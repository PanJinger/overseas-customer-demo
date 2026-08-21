import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ENRICHED,
  PLATFORM_LABEL,
  SHOP_FUNNEL,
  TOP_SKUS,
  summarizeByPlatform,
  totals,
  type Platform,
} from "./data/delivery";
import { FIELD_MAPPINGS, METRICS, type MetricDef } from "./data/dictionary";
import {
  AD_ACCOUNTS,
  CHANNELS,
  FX_TABLE,
  QUALITY_ISSUES,
  QUALITY_SCORE,
  SKU_MAPS,
  STORES,
} from "./data/master";

type Role = "老板" | "投放" | "运营" | "财务" | "管理员";
type Page =
  | "overview"
  | "ads"
  | "shop"
  | "dictionary"
  | "master"
  | "quality"
  | "ingest";

const PAGES: { id: Page; label: string; roles: Role[] }[] = [
  { id: "overview", label: "经营总览", roles: ["老板", "财务", "管理员", "投放", "运营"] },
  { id: "ads", label: "投放工作台", roles: ["投放", "老板", "管理员"] },
  { id: "shop", label: "店铺运营", roles: ["运营", "老板", "管理员"] },
  { id: "dictionary", label: "数据字典", roles: ["管理员", "老板", "投放", "运营", "财务"] },
  { id: "master", label: "主数据", roles: ["管理员", "财务"] },
  { id: "quality", label: "质量中心", roles: ["管理员", "财务", "投放"] },
  { id: "ingest", label: "数据接入", roles: ["管理员"] },
];

function fmtMoney(n: number) {
  return n.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
}

function fmtNum(n: number, digits = 2) {
  return n.toLocaleString("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function MetricDrawer({
  metric,
  onClose,
}: {
  metric: MetricDef | null;
  onClose: () => void;
}) {
  if (!metric) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="close" type="button" onClick={onClose}>
          关闭
        </button>
        <h3>
          {metric.code} · {metric.nameZh}
        </h3>
        <p style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.5 }}>
          {metric.definition}
        </p>
        <dl>
          <dt>英文名</dt>
          <dd>{metric.nameEn}</dd>
          <dt>别名</dt>
          <dd>{metric.aliases.join(" / ")}</dd>
          <dt>公式</dt>
          <dd>
            <code>{metric.formula}</code>
          </dd>
          <dt>粒度</dt>
          <dd>{metric.grain}</dd>
          <dt>币种规则</dt>
          <dd>{metric.currencyRule}</dd>
          <dt>时区规则</dt>
          <dd>{metric.timezoneRule}</dd>
          <dt>源系统</dt>
          <dd>{metric.sourceSystems.join("、")}</dd>
          <dt>源字段</dt>
          <dd>{metric.sourceFields.join("、")}</dd>
          <dt>标准字段</dt>
          <dd>
            <code>{metric.standardField}</code>
          </dd>
          <dt>跨渠道加总</dt>
          <dd>
            {metric.canCrossChannelSum ? (
              <span className="tag tag-ok">允许</span>
            ) : (
              <span className="tag tag-forbid">禁止</span>
            )}
          </dd>
          <dt>Owner</dt>
          <dd>
            业务 {metric.businessOwner} · 技术 {metric.techOwner}
          </dd>
          <dt>状态</dt>
          <dd>
            {metric.status} · {metric.version}
            {metric.pendingConfirm ? " · 待业务确认" : ""}
          </dd>
          <dt>使用看板</dt>
          <dd>{metric.usedIn.join("、")}</dd>
        </dl>
      </div>
    </div>
  );
}

function OverviewPage({
  onOpenMetric,
}: {
  onOpenMetric: (code: string) => void;
}) {
  const t = totals();
  const byPlat = summarizeByPlatform();
  const chartData = byPlat.map((p) => ({
    name: p.label.replace(" Ads", "").replace("聚光", "").replace("引擎", ""),
    花费CNY: Math.round(p.costCny),
    净销售CNY: Math.round(p.netSalesCny),
    经营ROAS: Number(p.businessRoas.toFixed(2)),
  }));

  return (
    <>
      <div className="alert">
        <strong>口径提醒：</strong>
        四平台「平台转化」加总为 {t.forbiddenConvSum}，一方支付订单仅{" "}
        {t.orders}。老板看板只认净销售额与广告花费，不认四平台 ROAS / 转化加总。
        数据来自调研示例表（2026-08-20）+ 一方订单校准。
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">
            <span>净销售额</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M002")}>
              M002
            </button>
          </div>
          <div className="value">¥{fmtMoney(t.netSalesCny)}</div>
          <div className="hint">一方 OMS · 扣退款折扣 · 月平均汇率</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>广告花费</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M001")}>
              M001
            </button>
          </div>
          <div className="value">¥{fmtMoney(t.costCny)}</div>
          <div className="hint">四平台消耗折 CNY · 可跨渠道加总</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>经营 ROAS</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M003")}>
              M003
            </button>
          </div>
          <div className="value">{fmtNum(t.businessRoas)}x</div>
          <div className="hint">净销售额 / 花费 · 跨渠道唯一标尺</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>MER</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M004")}>
              M004
            </button>
          </div>
          <div className="value">{fmtNum(t.mer * 100, 1)}%</div>
          <div className="hint">花费 / 净销售额 · 老板看整体效率</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>分渠道花费与净销售（CNY）</h3>
          <p className="caption">
            Source: 调研示例 CSV · 2026-08-20 · 口径版本 v1.0
          </p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd4" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="花费CNY" fill="#0f5c4c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="净销售CNY" fill="#c4a574" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3>渠道效率对照</h3>
          <p className="caption">经营 ROAS 可对比；平台转化不可加总</p>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>渠道</th>
                  <th className="num">花费</th>
                  <th className="num">经营ROAS</th>
                  <th className="num">平台转化</th>
                  <th className="num">一方订单</th>
                </tr>
              </thead>
              <tbody>
                {byPlat.map((p) => (
                  <tr key={p.platform}>
                    <td>{p.label}</td>
                    <td className="num">¥{fmtMoney(p.costCny)}</td>
                    <td className="num">{fmtNum(p.businessRoas)}</td>
                    <td className="num">
                      <span className="tag tag-forbid">{p.platformConv}</span>
                    </td>
                    <td className="num">{p.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="legend-note">
            橙色标签 = 媒体自报，禁止做集团经营加总（见字典 M010）
          </p>
        </div>
      </div>
    </>
  );
}

function AdsPage({ onOpenMetric }: { onOpenMetric: (code: string) => void }) {
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const rows =
    platform === "all"
      ? ENRICHED
      : ENRICHED.filter((r) => r.platform === platform);

  return (
    <>
      <div className="alert">
        <strong>投放工作台规则：</strong>
        左侧「平台转化 / 归因备注」只服务渠道内优化；跨渠道排预算看「经营
        ROAS」。TikTok 使用 destination 点击；Google 只用 Conversions，不用 All
        conv.。
      </div>

      <div className="tabs">
        <button
          type="button"
          className={platform === "all" ? "active" : ""}
          onClick={() => setPlatform("all")}
        >
          全部
        </button>
        {(Object.keys(PLATFORM_LABEL) as Platform[]).map((p) => (
          <button
            key={p}
            type="button"
            className={platform === p ? "active" : ""}
            onClick={() => setPlatform(p)}
          >
            {PLATFORM_LABEL[p]}
          </button>
        ))}
      </div>

      <div className="panel">
        <h3>计划级投放明细</h3>
        <p className="caption">
          字段来自调研示例：小红书计划报 / 巨量广告报 / TikTok Campaign / Google
          Campaign ·{" "}
          <button className="metric-link" type="button" onClick={() => onOpenMetric("M003")}>
            经营ROAS M003
          </button>{" "}
          <button className="metric-link" type="button" onClick={() => onOpenMetric("M010")}>
            平台转化 M010
          </button>
        </p>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>平台</th>
                <th>计划</th>
                <th className="num">花费原币</th>
                <th className="num">花费CNY</th>
                <th className="num">展现</th>
                <th className="num">点击</th>
                <th>平台转化字段</th>
                <th className="num">平台转化</th>
                <th className="num">一方订单</th>
                <th className="num">经营ROAS</th>
                <th>归因</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.platform}-${r.campaignId}`}>
                  <td>{PLATFORM_LABEL[r.platform]}</td>
                  <td>
                    <div>{r.campaignName}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      {r.accountId} / {r.campaignId}
                    </div>
                  </td>
                  <td className="num">
                    {fmtNum(r.costOriginal)} {r.currency}
                  </td>
                  <td className="num">¥{fmtMoney(r.costCny)}</td>
                  <td className="num">{r.impressions.toLocaleString()}</td>
                  <td className="num">{r.clicks.toLocaleString()}</td>
                  <td style={{ fontSize: 12 }}>{r.conversionField}</td>
                  <td className="num">
                    <span className="tag tag-forbid">{r.platformConversions}</span>
                  </td>
                  <td className="num">{r.firstPartyOrders}</td>
                  <td className="num">{fmtNum(r.businessRoas)}</td>
                  <td style={{ fontSize: 11, maxWidth: 160 }}>{r.attributionNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ShopPage({ onOpenMetric }: { onOpenMetric: (code: string) => void }) {
  const f = SHOP_FUNNEL;
  const steps = [
    { name: "访客", value: f.visitors, pct: 100 },
    { name: "加购", value: f.addToCart, pct: (f.addToCart / f.visitors) * 100 },
    { name: "结账", value: f.checkout, pct: (f.checkout / f.visitors) * 100 },
    { name: "支付成功", value: f.paidOrders, pct: (f.paidOrders / f.visitors) * 100 },
  ];

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">
            <span>净销售额</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M002")}>
              M002
            </button>
          </div>
          <div className="value">¥{fmtMoney(f.netSalesCny)}</div>
          <div className="hint">{f.storeName} · {f.date}</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>客单价</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M030")}>
              M030
            </button>
          </div>
          <div className="value">¥{fmtMoney(f.aovCny)}</div>
          <div className="hint">净销售额 / 支付订单</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>退款额</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M031")}>
              M031
            </button>
          </div>
          <div className="value">¥{fmtMoney(f.refundCny)}</div>
          <div className="hint">退款率 {(f.refundCny / f.gmvCny * 100).toFixed(1)}%</div>
        </div>
        <div className="kpi">
          <div className="label">
            <span>支付订单</span>
            <button className="metric-link" type="button" onClick={() => onOpenMetric("M005")}>
              M005
            </button>
          </div>
          <div className="value">{f.paidOrders}</div>
          <div className="hint">一方事实，非广告后台转化</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>转化漏斗</h3>
          <p className="caption">店铺侧一方数据 · 与广告平台转化分列存储</p>
          <div className="funnel">
            {steps.map((s) => (
              <div className="funnel-step" key={s.name}>
                <div>{s.name}</div>
                <div className="funnel-bar">
                  <span style={{ width: `${Math.max(s.pct, 4)}%` }} />
                </div>
                <div className="num">{s.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>TOP SKU</h3>
          <p className="caption">依赖主数据 SKU 映射，否则无法跨平台汇总单品</p>
          <table className="data">
            <thead>
              <tr>
                <th>SKU</th>
                <th>名称</th>
                <th className="num">订单</th>
                <th className="num">净销售</th>
                <th className="num">退款率</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SKUS.map((s) => (
                <tr key={s.sku}>
                  <td>{s.sku}</td>
                  <td>{s.name}</td>
                  <td className="num">{s.orders}</td>
                  <td className="num">¥{fmtMoney(s.netSalesCny)}</td>
                  <td className="num">
                    {s.refundRate > 0.1 ? (
                      <span className="tag tag-warn">{(s.refundRate * 100).toFixed(0)}%</span>
                    ) : (
                      `${(s.refundRate * 100).toFixed(0)}%`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DictionaryPage({
  onOpenMetric,
}: {
  onOpenMetric: (code: string) => void;
}) {
  const [tab, setTab] = useState<"metrics" | "mapping">("metrics");

  return (
    <>
      <div className="tabs">
        <button
          type="button"
          className={tab === "metrics" ? "active" : ""}
          onClick={() => setTab("metrics")}
        >
          黄金指标
        </button>
        <button
          type="button"
          className={tab === "mapping" ? "active" : ""}
          onClick={() => setTab("mapping")}
        >
          平台字段映射
        </button>
      </div>

      {tab === "metrics" ? (
        <div className="panel">
          <h3>指标目录（{METRICS.length}）</h3>
          <p className="caption">
            未入字典的字段不准上看板。橙色 = 禁止跨渠道加总。
          </p>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>编码</th>
                  <th>中文名</th>
                  <th>状态</th>
                  <th>跨渠道加总</th>
                  <th>业务 Owner</th>
                  <th>看板</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => (
                  <tr key={m.code}>
                    <td>{m.code}</td>
                    <td>
                      {m.nameZh}
                      {m.pendingConfirm ? (
                        <span className="tag tag-warn" style={{ marginLeft: 6 }}>
                          待确认
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <span className="tag tag-ok">{m.status}</span>
                    </td>
                    <td>
                      {m.canCrossChannelSum ? (
                        <span className="tag tag-ok">允许</span>
                      ) : (
                        <span className="tag tag-forbid">禁止</span>
                      )}
                    </td>
                    <td>{m.businessOwner}</td>
                    <td style={{ fontSize: 12 }}>{m.usedIn.join("、")}</td>
                    <td>
                      <button
                        className="metric-link"
                        type="button"
                        onClick={() => onOpenMetric(m.code)}
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="panel">
          <h3>源字段 → 标准指标</h3>
          <p className="caption">
            依据调研《四平台对比总览》《口径差异与数据治理要点》
          </p>
          <table className="data">
            <thead>
              <tr>
                <th>平台</th>
                <th>源字段</th>
                <th>标准指标</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {FIELD_MAPPINGS.map((f, i) => (
                <tr key={i}>
                  <td>{f.platform}</td>
                  <td>
                    <code>{f.sourceField}</code>
                  </td>
                  <td>{f.standardMetric}</td>
                  <td>{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function MasterPage() {
  return (
    <>
      <div className="panel">
        <h3>店铺主数据</h3>
        <p className="caption">经营汇总与权限的根对象</p>
        <table className="data">
          <thead>
            <tr>
              <th>店铺编码</th>
              <th>名称</th>
              <th>事业部</th>
              <th>国家</th>
              <th>币种</th>
              <th>负责人</th>
            </tr>
          </thead>
          <tbody>
            {STORES.map((s) => (
              <tr key={s.storeId}>
                <td>{s.storeId}</td>
                <td>{s.storeName}</td>
                <td>{s.bu}</td>
                <td>{s.country}</td>
                <td>{s.currency}</td>
                <td>{s.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>广告账户绑定</h3>
        <p className="caption">账户 → 唯一店铺（调研模型 dim_ad_account）</p>
        <table className="data">
          <thead>
            <tr>
              <th>账户 ID</th>
              <th>平台</th>
              <th>店铺</th>
              <th>币种</th>
              <th>时区</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {AD_ACCOUNTS.map((a) => (
              <tr key={a.accountId}>
                <td>{a.accountId}</td>
                <td>{a.platform}</td>
                <td>{a.storeId}</td>
                <td>{a.currency}</td>
                <td>{a.timezone}</td>
                <td>
                  <span className="tag tag-ok">{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>渠道参考数据</h3>
          <p className="caption">封闭枚举，消灭「谷歌/Google/SEM」脏别名</p>
          <table className="data">
            <thead>
              <tr>
                <th>编码</th>
                <th>标准名</th>
                <th>别名（清洗前）</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.code}>
                  <td>{c.code}</td>
                  <td>{c.nameZh}</td>
                  <td>{c.aliases.join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3>汇率表 · SKU 映射</h3>
          <p className="caption">财务月平均汇率（Demo 默认）</p>
          <table className="data">
            <thead>
              <tr>
                <th>月份</th>
                <th>币种</th>
                <th className="num">→CNY</th>
                <th>来源</th>
              </tr>
            </thead>
            <tbody>
              {FX_TABLE.map((x) => (
                <tr key={x.currency}>
                  <td>{x.month}</td>
                  <td>{x.currency}</td>
                  <td className="num">{x.rateToCny}</td>
                  <td>{x.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="data" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>集团 SKU</th>
                <th>名称</th>
                <th>平台 SKU</th>
                <th>平台</th>
              </tr>
            </thead>
            <tbody>
              {SKU_MAPS.map((s, i) => (
                <tr key={i}>
                  <td>{s.groupSku}</td>
                  <td>{s.name}</td>
                  <td>{s.platformSku}</td>
                  <td>{s.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function QualityPage({ onOpenMetric }: { onOpenMetric: (code: string) => void }) {
  const scores = [
    { k: "完整性", v: QUALITY_SCORE.completeness },
    { k: "准确性", v: QUALITY_SCORE.accuracy },
    { k: "一致性", v: QUALITY_SCORE.consistency },
    { k: "及时性", v: QUALITY_SCORE.timeliness },
    { k: "唯一性", v: QUALITY_SCORE.uniqueness },
  ];

  return (
    <>
      <div className="grid-2">
        <div className="panel">
          <h3>质量评分 · 总分 {QUALITY_SCORE.overall}</h3>
          <p className="caption">一致性偏低：平台转化误加总、All conv. 混用</p>
          {scores.map((s) => (
            <div className="score-row" key={s.k}>
              <div>{s.k}</div>
              <div className="bar">
                <span style={{ width: `${s.v}%` }} />
              </div>
              <div className="num">{s.v}</div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>治理要点（调研结论）</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, fontSize: 13 }}>
            <li>花费相对可加，仍须统一币种与时区</li>
            <li>转化 / ROAS / Reach 禁止跨平台直接相加</li>
            <li>媒体自报进 ODS；经营结论只用一方订单</li>
            <li>线索手机号、设备哈希不进默认看板下载</li>
          </ul>
        </div>
      </div>

      <div className="panel">
        <h3>问题清单</h3>
        <p className="caption">故意保留的脏数据场景，用于演示质量闭环</p>
        <table className="data">
          <thead>
            <tr>
              <th>ID</th>
              <th>规则</th>
              <th>维度</th>
              <th>级别</th>
              <th>状态</th>
              <th>详情</th>
              <th>指标</th>
            </tr>
          </thead>
          <tbody>
            {QUALITY_ISSUES.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.rule}</td>
                <td>{q.dimension}</td>
                <td>
                  <span
                    className={`tag ${q.severity === "阻断" ? "tag-danger" : "tag-warn"}`}
                  >
                    {q.severity}
                  </span>
                </td>
                <td>
                  <span
                    className={`tag ${
                      q.status === "关闭"
                        ? "tag-ok"
                        : q.status === "处理中"
                          ? "tag-warn"
                          : "tag-muted"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td style={{ maxWidth: 360, fontSize: 12 }}>{q.detail}</td>
                <td>
                  <button
                    className="metric-link"
                    type="button"
                    onClick={() => onOpenMetric(q.relatedMetric)}
                  >
                    {q.relatedMetric}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IngestPage() {
  const sources = [
    {
      name: "小红书聚光",
      file: "小红书-计划日报表示例.csv",
      grain: "日 × 计划",
      clickId: "click_id",
      status: "已载入",
    },
    {
      name: "巨量引擎",
      file: "巨量引擎-广告日报表示例.csv",
      grain: "日 × 项目 × 广告",
      clickId: "clickid",
      status: "已载入",
    },
    {
      name: "TikTok Ads",
      file: "TikTok-Campaign日报表示例.csv",
      grain: "日 × Campaign",
      clickId: "ttclid",
      status: "已载入",
    },
    {
      name: "Google Ads",
      file: "Google-Ads-Campaign日报表示例.csv",
      grain: "日 × Campaign",
      clickId: "gclid",
      status: "已载入",
    },
    {
      name: "一方订单",
      file: "模拟 OMS（Demo）",
      grain: "订单行",
      clickId: "映射 click_id",
      status: "已载入",
    },
  ];

  return (
    <div className="panel">
      <h3>数据接入清单</h3>
      <p className="caption">
        源数据来自仓库{" "}
        <code>调研/广告投放回传数据/示例表格/</code>
        。管道成功标志：源字段映射进字典，而非「接了多少 API」。
      </p>
      <table className="data">
        <thead>
          <tr>
            <th>源系统</th>
            <th>样例文件</th>
            <th>粒度</th>
            <th>点击标识</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>
                <code>{s.file}</code>
              </td>
              <td>{s.grain}</td>
              <td>
                <code>{s.clickId}</code>
              </td>
              <td>
                <span className="tag tag-ok">{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="legend-note" style={{ marginTop: 14 }}>
        分层：ODS 保留平台原始字段 → DWD 统一时区/币种 → DWS 日汇总 → ADS
        看板；平台转化打标「不可跨渠道加总」。
      </p>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("老板");
  const [page, setPage] = useState<Page>("overview");
  const [metricCode, setMetricCode] = useState<string | null>(null);

  const visiblePages = useMemo(
    () => PAGES.filter((p) => p.roles.includes(role)),
    [role]
  );

  const activePage = visiblePages.some((p) => p.id === page)
    ? page
    : visiblePages[0]?.id ?? "overview";

  const metric = METRICS.find((m) => m.code === metricCode) ?? null;

  const pageMeta: Record<Page, { title: string; sub: string }> = {
    overview: {
      title: "经营总览",
      sub: "老板决策页：统一币种花费、一方净销售、经营 ROAS / MER。不展示四平台 ROAS 加总。",
    },
    ads: {
      title: "投放工作台",
      sub: "计划/素材层盯盘：平台原生指标 + 校准后的经营 ROAS。字段对齐调研四平台报表示例。",
    },
    shop: {
      title: "店铺运营",
      sub: "漏斗、客单、退款、TOP SKU。成交以一方订单为准，与广告后台转化分列。",
    },
    dictionary: {
      title: "数据字典",
      sub: "元数据主战场：黄金指标口径、版本、Owner，以及平台字段映射。",
    },
    master: {
      title: "主数据",
      sub: "店铺、广告账户、渠道枚举、SKU 映射、汇率 —— 对齐调研 dim_ad_account 模型。",
    },
    quality: {
      title: "质量中心",
      sub: "规则、问题工单、评分。演示「转化加总」「All conv. 混用」等阻断/预警。",
    },
    ingest: {
      title: "数据接入",
      sub: "四平台 CSV + 一方订单的载入状态与点击标识对照。",
    },
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">Data Governance Demo</p>
          <h1>泉水 · 海外拓客数据治理</h1>
          <p>基于调研四平台回传字段 · 统一口径 · 分角色看板</p>
        </div>
        <nav className="nav">
          {visiblePages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={activePage === p.id ? "active" : ""}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <div className="role-box">
          <label htmlFor="role">当前角色</label>
          <select
            id="role"
            value={role}
            onChange={(e) => {
              const next = e.target.value as Role;
              setRole(next);
              const first = PAGES.find((p) => p.roles.includes(next));
              if (first) setPage(first.id);
            }}
          >
            {(["老板", "投放", "运营", "财务", "管理员"] as Role[]).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <div>
            <h2>{pageMeta[activePage].title}</h2>
            <p className="sub">{pageMeta[activePage].sub}</p>
          </div>
          <div className="meta-chip">业务日 2026-08-20 · 币种 CNY · 字典 v1.0</div>
        </div>

        {activePage === "overview" && (
          <OverviewPage onOpenMetric={setMetricCode} />
        )}
        {activePage === "ads" && <AdsPage onOpenMetric={setMetricCode} />}
        {activePage === "shop" && <ShopPage onOpenMetric={setMetricCode} />}
        {activePage === "dictionary" && (
          <DictionaryPage onOpenMetric={setMetricCode} />
        )}
        {activePage === "master" && <MasterPage />}
        {activePage === "quality" && (
          <QualityPage onOpenMetric={setMetricCode} />
        )}
        {activePage === "ingest" && <IngestPage />}
      </main>

      <MetricDrawer metric={metric} onClose={() => setMetricCode(null)} />
    </div>
  );
}
