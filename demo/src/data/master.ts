/** 主数据与质量问题 —— 对齐调研治理模型 */

export interface Store {
  storeId: string;
  storeName: string;
  bu: string;
  country: string;
  currency: string;
  owner: string;
}

export interface AdAccount {
  accountId: string;
  platform: string;
  storeId: string;
  currency: string;
  timezone: string;
  status: string;
}

export interface ChannelRef {
  code: string;
  nameZh: string;
  aliases: string[];
}

export interface SkuMap {
  groupSku: string;
  name: string;
  platformSku: string;
  platform: string;
}

export const STORES: Store[] = [
  {
    storeId: "ST-US-01",
    storeName: "US Independent Store A",
    bu: "北美事业部",
    country: "US",
    currency: "USD",
    owner: "店长-陈",
  },
  {
    storeId: "ST-UK-01",
    storeName: "UK Store B",
    bu: "欧洲事业部",
    country: "UK",
    currency: "GBP",
    owner: "店长-李",
  },
  {
    storeId: "ST-SEA-01",
    storeName: "SEA Store C",
    bu: "东南亚事业部",
    country: "SG",
    currency: "USD",
    owner: "店长-王",
  },
];

export const AD_ACCOUNTS: AdAccount[] = [
  {
    accountId: "XHS-10086",
    platform: "xiaohongshu",
    storeId: "ST-US-01",
    currency: "CNY",
    timezone: "Asia/Shanghai",
    status: "启用",
  },
  {
    accountId: "178000111",
    platform: "oceanengine",
    storeId: "ST-US-01",
    currency: "CNY",
    timezone: "Asia/Shanghai",
    status: "启用",
  },
  {
    accountId: "TT-7788",
    platform: "tiktok",
    storeId: "ST-US-01",
    currency: "USD",
    timezone: "America/Los_Angeles",
    status: "启用",
  },
  {
    accountId: "123-456-7890",
    platform: "google",
    storeId: "ST-US-01",
    currency: "USD",
    timezone: "America/Los_Angeles",
    status: "启用",
  },
];

export const CHANNELS: ChannelRef[] = [
  {
    code: "xiaohongshu",
    nameZh: "小红书聚光",
    aliases: ["小红书", "聚光", "xhs", "红书"],
  },
  {
    code: "oceanengine",
    nameZh: "巨量引擎",
    aliases: ["抖音", "巨量", "ocean", "头条"],
  },
  {
    code: "tiktok",
    nameZh: "TikTok Ads",
    aliases: ["TT", "tik tok", "TikTok"],
  },
  {
    code: "google",
    nameZh: "Google Ads",
    aliases: ["谷歌", "Google", "SEM", "google ads"],
  },
];

export const SKU_MAPS: SkuMap[] = [
  {
    groupSku: "G-SKU-401",
    name: "修护精华 30ml",
    platformSku: "shopify:401",
    platform: "独立站",
  },
  {
    groupSku: "G-SKU-401",
    name: "修护精华 30ml",
    platformSku: "tt:SKU-US-401",
    platform: "TikTok",
  },
  {
    groupSku: "G-SKU-218",
    name: "防晒乳 SPF50",
    platformSku: "shopify:218",
    platform: "独立站",
  },
  {
    groupSku: "G-SKU-105",
    name: "洁面慕斯",
    platformSku: "shopify:105",
    platform: "独立站",
  },
];

export const FX_TABLE = [
  { month: "2026-08", currency: "USD", rateToCny: 7.2, source: "财务月平均" },
  { month: "2026-08", currency: "GBP", rateToCny: 9.15, source: "财务月平均" },
  { month: "2026-08", currency: "CNY", rateToCny: 1, source: "本位币" },
];

export type IssueSeverity = "阻断" | "预警";
export type IssueStatus = "新建" | "处理中" | "关闭";

export interface QualityIssue {
  id: string;
  rule: string;
  dimension: string;
  severity: IssueSeverity;
  status: IssueStatus;
  detail: string;
  relatedMetric: string;
  owner: string;
}

export const QUALITY_ISSUES: QualityIssue[] = [
  {
    id: "Q-001",
    rule: "渠道别名未标准化",
    dimension: "一致性",
    severity: "预警",
    status: "处理中",
    detail:
      "人工日报出现「谷歌 / Google / SEM」三种写法，已映射到 google，需停用自由文本录入。",
    relatedMetric: "M001",
    owner: "数据管理员",
  },
  {
    id: "Q-002",
    rule: "平台转化禁止跨渠道加总",
    dimension: "准确性",
    severity: "阻断",
    status: "新建",
    detail:
      "某事业部周报将四平台 conversions 相加得到「总转化 602」，与一方订单 340 严重偏离。已拦截进入 ADS。",
    relatedMetric: "M010",
    owner: "投放负责人",
  },
  {
    id: "Q-003",
    rule: "多币种账户缺汇率",
    dimension: "完整性",
    severity: "阻断",
    status: "关闭",
    detail: "TT-7788 含 GBP 花费，8 月汇率表已补齐 9.15。",
    relatedMetric: "M001",
    owner: "财务",
  },
  {
    id: "Q-004",
    rule: "Google All conv. 误入标准转化",
    dimension: "一致性",
    severity: "预警",
    status: "新建",
    detail:
      "Brand Search 行 All conv.=131、Conversions=118。映射规则要求只用 Conversions。",
    relatedMetric: "M010",
    owner: "数据管理员",
  },
  {
    id: "Q-005",
    rule: "经营 ROAS 极端值",
    dimension: "合理性",
    severity: "预警",
    status: "新建",
    detail: "YouTube - Product demo 经营 ROAS 偏低且含 41 次浏览转化，需投放复核。",
    relatedMetric: "M003",
    owner: "投放优化师",
  },
  {
    id: "Q-006",
    rule: "账户时区与北京日切不一致",
    dimension: "及时性",
    severity: "预警",
    status: "处理中",
    detail:
      "Google/TikTok 账户为美西时区，与北京自然日相差约 15 小时。双日期字段已保留，看板默认 biz_date_cn。",
    relatedMetric: "M001",
    owner: "数据管理员",
  },
];

export const QUALITY_SCORE = {
  completeness: 92,
  accuracy: 88,
  consistency: 76,
  timeliness: 95,
  uniqueness: 98,
  overall: 88,
};
