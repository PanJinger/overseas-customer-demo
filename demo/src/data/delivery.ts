/** 基于调研示例表格整理的投放日数据 + 一方订单（虚构，仅供 Demo） */

export type Platform =
  | "xiaohongshu"
  | "oceanengine"
  | "tiktok"
  | "google";

export const PLATFORM_LABEL: Record<Platform, string> = {
  xiaohongshu: "小红书聚光",
  oceanengine: "巨量引擎",
  tiktok: "TikTok Ads",
  google: "Google Ads",
};

/** 月平均记账汇率（Demo 默认，字典标注待确认） */
export const FX_TO_CNY: Record<string, number> = {
  CNY: 1,
  USD: 7.2,
  GBP: 9.15,
};

export interface AdDeliveryRow {
  date: string;
  platform: Platform;
  accountId: string;
  campaignId: string;
  campaignName: string;
  /** 平台原始花费 */
  costOriginal: number;
  currency: string;
  impressions: number;
  clicks: number;
  /** 平台自报转化（不可跨渠道加总） */
  platformConversions: number;
  conversionField: string;
  attributionNote: string;
  /** 一方校准订单数（来自店铺/CRM，可跨渠道用） */
  firstPartyOrders: number;
  /** 一方净销售额原币 */
  netSalesOriginal: number;
}

/** 由调研四平台日汇总 + 各平台报表示例展开，并补一方订单 */
export const AD_DELIVERY: AdDeliveryRow[] = [
  // 小红书（调研：小红书-计划日报表示例.csv）
  {
    date: "2026-08-20",
    platform: "xiaohongshu",
    accountId: "XHS-10086",
    campaignId: "XHS-P1",
    campaignName: "秋季护肤种草-信息流",
    costOriginal: 4280,
    currency: "CNY",
    impressions: 86210,
    clicks: 3180,
    platformConversions: 0,
    conversionField: "互动量(非转化目标)",
    attributionNote: "互动可不经点击，不可当订单",
    firstPartyOrders: 8,
    netSalesOriginal: 5600,
  },
  {
    date: "2026-08-20",
    platform: "xiaohongshu",
    accountId: "XHS-10086",
    campaignId: "XHS-P2",
    campaignName: "客资收集-表单落地页",
    costOriginal: 5120,
    currency: "CNY",
    impressions: 54100,
    clicks: 2106,
    platformConversions: 41,
    conversionField: "表单数",
    attributionNote: "私信开口多按点击后24h",
    firstPartyOrders: 18,
    netSalesOriginal: 12600,
  },
  {
    date: "2026-08-20",
    platform: "xiaohongshu",
    accountId: "XHS-10086",
    campaignId: "XHS-P3",
    campaignName: "搜索品牌词卡位",
    costOriginal: 3080,
    currency: "CNY",
    impressions: 46110,
    clicks: 1970,
    platformConversions: 56,
    conversionField: "私信开口数",
    attributionNote: "开口≠成交",
    firstPartyOrders: 12,
    netSalesOriginal: 8400,
  },
  // 巨量（调研：巨量引擎-广告日报表示例.csv）
  {
    date: "2026-08-20",
    platform: "oceanengine",
    accountId: "178000111",
    campaignId: "P-8801",
    campaignName: "海外店-美国转化",
    costOriginal: 22460,
    currency: "CNY",
    impressions: 342800,
    clicks: 7770,
    platformConversions: 139,
    conversionField: "convert_cnt(表单提交)",
    attributionNote: "转化目标以 external_action 为准",
    firstPartyOrders: 52,
    netSalesOriginal: 46800,
  },
  {
    date: "2026-08-20",
    platform: "oceanengine",
    accountId: "178000111",
    campaignId: "P-8802",
    campaignName: "品牌认知-抖音",
    costOriginal: 6190,
    currency: "CNY",
    impressions: 70000,
    clicks: 2100,
    platformConversions: 47,
    conversionField: "convert_cnt(有效播放)",
    attributionNote: "覆盖目标，转化含义不同",
    firstPartyOrders: 6,
    netSalesOriginal: 4200,
  },
  // TikTok（调研：TikTok-Campaign日报表示例.csv）
  {
    date: "2026-08-20",
    platform: "tiktok",
    accountId: "TT-7788",
    campaignId: "C-1001",
    campaignName: "US-Shop-Purchase-TOFU",
    costOriginal: 1840.5,
    currency: "USD",
    impressions: 220400,
    clicks: 3310,
    platformConversions: 96,
    conversionField: "conversions",
    attributionNote: "默认常见 7d click + 1d view",
    firstPartyOrders: 61,
    netSalesOriginal: 6290,
  },
  {
    date: "2026-08-20",
    platform: "tiktok",
    accountId: "TT-7788",
    campaignId: "C-1002",
    campaignName: "UK-Lead-Form-Retarget",
    costOriginal: 620,
    currency: "GBP",
    impressions: 44120,
    clicks: 980,
    platformConversions: 54,
    conversionField: "conversions(Lead)",
    attributionNote: "14d click / 1d view",
    firstPartyOrders: 22,
    netSalesOriginal: 1980,
  },
  {
    date: "2026-08-20",
    platform: "tiktok",
    accountId: "TT-7788",
    campaignId: "C-1003",
    campaignName: "SEA-SparkAds-Awareness",
    costOriginal: 410.2,
    currency: "USD",
    impressions: 98000,
    clicks: 720,
    platformConversions: 12,
    conversionField: "conversions",
    attributionNote: "Reach 目标，转化偏少",
    firstPartyOrders: 5,
    netSalesOriginal: 380,
  },
  // Google（调研：Google-Ads-Campaign日报表示例.csv）
  {
    date: "2026-08-20",
    platform: "google",
    accountId: "123-456-7890",
    campaignId: "111",
    campaignName: "Brand Search - US",
    costOriginal: 724.12,
    currency: "USD",
    impressions: 9120,
    clicks: 842,
    platformConversions: 118,
    conversionField: "conversions(不含 all_conversions)",
    attributionNote: "DATA_DRIVEN；All conv.=131，含浏览",
    firstPartyOrders: 89,
    netSalesOriginal: 8420,
  },
  {
    date: "2026-08-20",
    platform: "google",
    accountId: "123-456-7890",
    campaignId: "222",
    campaignName: "Shopping - Best sellers",
    costOriginal: 516.6,
    currency: "USD",
    impressions: 88040,
    clicks: 1260,
    platformConversions: 74,
    conversionField: "conversions",
    attributionNote: "购物广告商品维度另表",
    firstPartyOrders: 58,
    netSalesOriginal: 5310.5,
  },
  {
    date: "2026-08-20",
    platform: "google",
    accountId: "123-456-7890",
    campaignId: "333",
    campaignName: "YouTube - Product demo",
    costOriginal: 462,
    currency: "USD",
    impressions: 156000,
    clicks: 210,
    platformConversions: 19,
    conversionField: "conversions",
    attributionNote: "view_through_conversions=41，跨渠道易重复",
    firstPartyOrders: 9,
    netSalesOriginal: 980,
  },
];

export function toCny(amount: number, currency: string): number {
  return amount * (FX_TO_CNY[currency] ?? 1);
}

export function enrichRow(row: AdDeliveryRow) {
  const costCny = toCny(row.costOriginal, row.currency);
  const netSalesCny = toCny(row.netSalesOriginal, row.currency);
  const platformRoas =
    costCny > 0 && row.platformConversions > 0
      ? (row.platformConversions * (netSalesCny / Math.max(row.firstPartyOrders, 1))) /
        costCny
      : null;
  /** 经营 ROAS：一方净销售额 / 花费，可跨渠道对比 */
  const businessRoas = costCny > 0 ? netSalesCny / costCny : 0;
  return {
    ...row,
    costCny,
    netSalesCny,
    platformRoas,
    businessRoas,
  };
}

export const ENRICHED = AD_DELIVERY.map(enrichRow);

export function summarizeByPlatform() {
  const map = new Map<
    Platform,
    {
      platform: Platform;
      costCny: number;
      netSalesCny: number;
      platformConv: number;
      orders: number;
      impressions: number;
      clicks: number;
    }
  >();
  for (const r of ENRICHED) {
    const cur = map.get(r.platform) ?? {
      platform: r.platform,
      costCny: 0,
      netSalesCny: 0,
      platformConv: 0,
      orders: 0,
      impressions: 0,
      clicks: 0,
    };
    cur.costCny += r.costCny;
    cur.netSalesCny += r.netSalesCny;
    cur.platformConv += r.platformConversions;
    cur.orders += r.firstPartyOrders;
    cur.impressions += r.impressions;
    cur.clicks += r.clicks;
    map.set(r.platform, cur);
  }
  return [...map.values()].map((x) => ({
    ...x,
    label: PLATFORM_LABEL[x.platform],
    businessRoas: x.costCny > 0 ? x.netSalesCny / x.costCny : 0,
    mer: x.netSalesCny > 0 ? x.costCny / x.netSalesCny : 0,
    /** 错误示范：把平台转化当收入系数 —— Demo 里用来对比 */
    naivePlatformRoas:
      x.costCny > 0 ? (x.platformConv * 80) / x.costCny : 0,
  }));
}

export function totals() {
  const rows = ENRICHED;
  const costCny = rows.reduce((s, r) => s + r.costCny, 0);
  const netSalesCny = rows.reduce((s, r) => s + r.netSalesCny, 0);
  const orders = rows.reduce((s, r) => s + r.firstPartyOrders, 0);
  const platformConv = rows.reduce((s, r) => s + r.platformConversions, 0);
  return {
    costCny,
    netSalesCny,
    orders,
    platformConv,
    businessRoas: costCny > 0 ? netSalesCny / costCny : 0,
    mer: netSalesCny > 0 ? costCny / netSalesCny : 0,
    /** 平台转化加总（禁止作为经营结论） */
    forbiddenConvSum: platformConv,
  };
}

/** 店铺漏斗（Demo 补一方经营数据，调研未覆盖时用合理虚构） */
export const SHOP_FUNNEL = {
  date: "2026-08-20",
  storeName: "US Independent Store A",
  visitors: 18640,
  addToCart: 3120,
  checkout: 980,
  paidOrders: 340,
  gmvCny: 312000,
  refundCny: 18600,
  netSalesCny: 293400,
  aovCny: 917.6,
};

export const TOP_SKUS = [
  { sku: "SKU-US-401", name: "修护精华 30ml", orders: 86, netSalesCny: 77400, refundRate: 0.04 },
  { sku: "SKU-US-218", name: "防晒乳 SPF50", orders: 72, netSalesCny: 43200, refundRate: 0.06 },
  { sku: "SKU-UK-105", name: "洁面慕斯", orders: 54, netSalesCny: 21600, refundRate: 0.03 },
  { sku: "SKU-SEA-033", name: "旅行装套盒", orders: 41, netSalesCny: 16400, refundRate: 0.11 },
  { sku: "SKU-US-090", name: "面膜 5 片装", orders: 38, netSalesCny: 11400, refundRate: 0.08 },
];
