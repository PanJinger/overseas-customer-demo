# TikTok Ads：投流后能拿到的数据

投放后台：**TikTok Ads Manager**。程序化取数：**TikTok Marketing API** ` /report/integrated/get/ `。

示例界面：[示例图片/tiktok-ads-report-example.png](示例图片/tiktok-ads-report-example.png)

## 三处看数

| 入口 | 你拿到什么 |
| --- | --- |
| Dashboard | 账户级消耗、状态、趋势快照 |
| Campaigns | 广告系列 / 组 / 广告明细；可自定义列；可按当前视图导出 |
| Reporting | 自建报表、选维度和指标、立即导出或定时邮件（常见最多 5 个收件人，CSV/XLSX） |

界面默认大约十来列，可扩到 **50+**；API 文档与第三方整理认为可达 **400+** 指标。手动导出常有行数上限（有资料写约 1 万行/文件），大批量走 API。

报表类型包括 BASIC、AUDIENCE、CATALOG、BC 等。数据层级：Advertiser / Campaign / Ad Group / Ad。

## 基础指标（官方 Basic metrics）

| 指标 | 含义 |
| --- | --- |
| Impressions | 展示次数 |
| Clicks (all) | 所有点击，含社交互动点击 |
| Clicks (destination) | 去往指定落地页的点击 |
| Reach | 至少看过一次的独立用户数 |
| Frequency / Average 7 day frequency | 人均看到次数 |
| Paid likes | 付费曝光期间的点赞 |
| Cost | 花费 |
| CPC (destination) | 每次落地点击成本 |
| Cost per 1,000 people reached | 千人覆盖成本 |
| Conversions | 优化事件次数 |
| CVR / CVR (clicks) | 转化率（分母是展示或落地点击，公式不同） |
| Cost per conversion | 单次转化成本 |
| Real-time conversions 及对应 CVR、成本 | 实时口径，和稳定报表可能不一致 |

**Clicks (all) 与 Clicks (destination) 不能当同一个「点击」**，否则 CTR、CPC 会对不齐国内抖音表。

## 指标大类（官方 Reporting metrics 分类）

| 大类 | 回答什么问题 | 例子 |
| --- | --- | --- |
| Attribution | 看完/点完广告后算谁的功劳 | Cost per CTA purchase |
| In-App Events | App 内行为 | Total Add to Cart、Install、Purchase |
| Page Events | 网站行为 | Button clicks (page)、Landing page view |
| Video play | 信息流视频看了多久 | 2s views、**6-second focused views**、quartile、完播 |
| Onsite Events | 站内（含电商/落地） | Adds to cart (onsite) |

6 秒聚焦播放：播放满 6 秒，或短于 6 秒的视频播完，或前 6 秒内有至少 1 次互动。这是 TikTok 创意质量的常用列，国内巨量更常用 3 秒 / 有效播放，字典不要硬映射成同一个「有效播放」。

## 受众拆分

AUDIENCE 报表可按年龄、性别、国家、操作系统、兴趣等切消耗和转化。仍然是汇总，不是用户列表。

## 点击标识 ttclid

用户点击广告后，落地页会自动带 `ttclid`（不必写进 UTM 模板，手写反而可能重复）。  
有效期跟 Ads Manager 里 **Attribution Manager 的点击窗口** 走，不是写死 7 天。常见默认仍是 **7 日点击 + 1 日展示**，购买/线索等事件可把点击窗口调到 1/7/14/28 天。

服务端 Events API 用 `ttclid`（文档里对应 callback）以及哈希邮箱/电话做增强匹配。这些哈希是你为了提高归因主动上传的，不是 TikTok 把用户通讯录发给你。

## 示例日表（虚构）

见 [示例表格/TikTok-Campaign日报表示例.csv](示例表格/TikTok-Campaign日报表示例.csv)。

| Date | Campaign | Cost (USD) | Impr. | Clicks dest. | CTR | Conv. | CPA | ROAS | 6s views |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-20 | US-Shop-Purchase-TOFU | 1840.50 | 220400 | 3310 | 1.50% | 96 | 19.17 | 3.42 | 48100 |
| 2026-08-20 | UK-Lead-Form-Retarget | 620.00 | 44120 | 980 | 2.22% | 54 | 11.48 | — | 12600 |
| 2026-08-20 | SEA-SparkAds-Awareness | 410.20 | 98000 | 720 | 0.73% | 12 | 34.18 | 1.10 | 35200 |

## 对接建议

- 主键：`advertiser_id + campaign_id + adgroup_id + ad_id + stat_time_day`。  
- 币种按广告账户时区与结算币，和国内人民币账户分账本。  
- 同时存「报表转化」和「实时转化」，看板默认用稳定报表。  
- Shop 站内 GMV 与 Pixel 网站购买不要加总成一个 ROAS。
