# Google Ads：投流后能拿到的数据

投放后台：**Google Ads**。程序化：**Google Ads API**（GAQL）以及可选的 BigQuery 数据传输。

示例界面：[示例图片/google-ads-report-example.png](示例图片/google-ads-report-example.png)

## 统计表里最常见的列

官方「About columns in your statistics table」中的效果列包括：

| UI 列 | 含义 | API 近似字段 |
| --- | --- | --- |
| Clicks | 点击广告 | `metrics.clicks` |
| Impr. | 展示 | `metrics.impressions` |
| CTR | 点击率 | `metrics.ctr` |
| Avg. CPC | 平均点击费用 | `metrics.average_cpc` |
| Avg. CPM | 千次展示费用 | `metrics.average_cpm` |
| Cost | 总花费 | `metrics.cost_micros`（一百万微货币单位 = 1 元/1 美元） |
| Interactions / Interaction rate | 跨广告类型的「有效互动」 | 搜索算点击、视频算观看等 |
| Results / Results value | 各标准目标下的主转化及价值 | 与转化列相关 |
| Conversions | 勾选了「计入转化」的转化 | `metrics.conversions` |
| All conv. | 全部转化动作 | `metrics.all_conversions` |
| Conv. value | 转化价值 | `metrics.conversions_value` |
| Cost / conv. | 转化成本 | `metrics.cost_per_conversion` |
| View-through conv. | 展示（未点击）归因转化 | `metrics.view_through_conversions` |
| Abs. top IS / Top IS | 搜索绝对顶部/顶部展示份额 | `metrics.absolute_top_impression_percentage` 等 |
| Impression share / Lost IS (rank/budget) | 展示份额及因排名/预算丢失 | 搜索竞争环境 |

**Conversions 与 All conv. 必须分开存。** 前者给智能出价用，后者更全，相加或混用都会和财务对不上。

## 你可以切的维度（Segment）

在 UI 用「细分」，在 API 往 SELECT 里加 `segments.*`：

| 细分 | 用途 |
| --- | --- |
| 日期 / 周 / 月 / 小时 | 趋势。细粒度日期回溯约 **37 个月**（API 新版本限制） |
| 设备 | 电脑 / 手机 / 平板 |
| 网络 | 搜索、搜索合作伙伴、YouTube、展示等 |
| 转化动作名称 | 看是购买还是线索 |
| 点击类型、广告网络类型 | 诊断 |
| 地理、年龄、性别 | 有隐私阈值，过细会没数 |

资源级报告：广告系列、广告组、关键字、素材资源组、商品（购物）、搜索字词。

## Google 特有：搜索字词

「搜索字词分析 / 搜索字词报告」告诉你 **用户实际搜了什么词才看到广告**（不是你买的关键字本身）。因隐私，部分低频词不会逐条展示，但会进类别汇总。指标仍是点击、展示、CTR、转化、转化价值等。

这是 Google 相对信息流平台最强的一方投放数据之一，建议单独建 `search_term_daily` 表。

## 点击级数据：gclid 与 click_view

打开自动标记后，落地页带 `gclid`。可把它和 GA4、店铺订单、CRM 订单对齐。

Google Ads API 的 `click_view`：

- 粒度：每次点击（含无效点击统计场景）。  
- 字段：`gclid`、广告、关键字、兴趣地域、所在地域、搜索结果页码、关联用户列表等。  
- 限制：**一次只能查一天**，大约 **过去 90 天**。  
- 应用安装类部分广告系列 **没有 gclid**。

这是四平台里相对最接近「点击流水」的官方能力，但仍不是用户实名。

## 转化与归因

- 默认广泛使用 **以数据为依据的归因（DDA）**；规则模型里仍保留「最终点击」。首次点击、线性等已退出。  
- 可看归因路径：天数、互动次数、跨设备。  
- 增强型转化：你把哈希邮箱/电话回传给 Google 用来补归因，**不是** Google 把用户通讯录下载给你。  
- 离线转化导入：用 gclid 把门店成交、电话成交灌回广告。

## 示例日表（虚构）

见 [示例表格/Google-Ads-Campaign日报表示例.csv](示例表格/Google-Ads-Campaign日报表示例.csv)。

| Date | Campaign | Clicks | Impr. | CTR | Avg CPC | Cost | Conv. | All conv. | Cost/conv | Conv. value |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-20 | Brand Search - US | 842 | 9120 | 9.23% | 0.86 | 724.12 | 118 | 131 | 6.14 | 8420.00 |
| 2026-08-20 | Shopping - Best sellers | 1260 | 88040 | 1.43% | 0.41 | 516.60 | 74 | 81 | 6.98 | 5310.50 |
| 2026-08-20 | YouTube - Product demo | 210 | 156000 | 0.13% | 0.22 | 462.00 | 19 | 27 | 24.32 | 980.00 |

（YouTube 行的「点击」与「观看」不是同一互动，看板要同时保留 Interactions / Views。）

## 对接建议

- 花费从 `cost_micros / 1_000_000` 转成账户币种，保留币种字段。  
- 转化表按 `conversion_action` 拆行，再映射到集团统一事件（购买、加购、线索）。  
- gclid 流水表保留 90 天热数据，汇总表长期保存。  
- 不要用 Google 的 ROAS 去加 TikTok 的 ROAS。
