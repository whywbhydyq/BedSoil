# Raised Bed Soil & Planting Planner 开发计划

版本：v1.0  
项目方向：园艺高床土壤 / 种植空间工具矩阵  
站点类型：英文免费工具站  
变现方式：AdSense + Affiliate  
目标阶段：MVP 到 90 天验证  
建议产品名：Raised Bed Soil & Planting Planner  
建议主关键词：raised bed soil calculator

---

## 0. 开发计划结论

本项目第一版不应开发成泛园艺内容站，也不应开发成复杂园艺 SaaS。第一版要做成一个完整、轻量、快速、可索引、可复用的“买土前决策工具”。

第一版核心闭环：

1. 用户输入 raised bed / container 尺寸。
2. 工具计算土壤体积。
3. 工具换算袋装土数量。
4. 工具比较袋装土与散装 bulk soil 成本。
5. 工具拆分 topsoil / compost / potting mix / Mel’s Mix 配比。
6. 工具输出可复制、可打印 shopping list。
7. 工具补充基础 square foot spacing 和作物深度提示。
8. 用户可以继续进入 4x8、grow bag、soil bags、bulk soil、soil mix 等长尾页。

开发顺序必须是：

> 先做单位换算和计算核心  
> 再做核心工具 UI  
> 再做核心页面和 SEO  
> 再做 AdSense / affiliate 位置  
> 再扩展长尾页  
> 最后根据 GSC 和交互数据决定是否继续扩展

不要先做复杂视觉、账号系统、AI 植物诊断、病虫害建议、完整 companion planting 数据库、地区种植日历、3D garden planner。

---

## 1. 项目目标

### 1.1 产品目标

构建一个英文免费工具站，帮助家庭园艺用户在建高床、填土、补土、换盆、规划种植前快速计算：

- 需要多少土。
- 要买几袋土。
- 袋装土和散装土哪个更划算。
- topsoil / compost / potting mix / Mel’s Mix 分别要多少。
- 容器和 grow bag 需要多少土。
- 4x8 高床能种多少植物。
- 当前高床深度适合哪些作物。
- 每年要补多少 compost 或 soil。

### 1.2 SEO 目标

第一版优先覆盖以下搜索意图：

- raised bed soil calculator
- 4x8 raised bed soil calculator
- how much soil for 4x8 raised bed
- soil bags calculator
- bulk soil vs bags calculator
- raised bed soil mix calculator
- container soil calculator
- grow bag soil calculator
- square foot garden spacing calculator
- how many tomato plants in 4x8 raised bed

### 1.3 商业目标

第一版不追求立即收入最大化，而是验证：

- 是否有自然搜索曝光。
- 用户是否真的使用计算器。
- 用户是否复制 shopping list。
- 用户是否点击土壤、compost、高床、grow bag、滴灌、种子等 affiliate 出口。
- AdSense 是否能在不干扰工具体验的情况下产生展示价值。

### 1.4 验证目标

上线后 90 天内重点观察：

- GSC impressions。
- 核心页面索引状态。
- calculator interaction rate。
- calculate button click rate。
- copy shopping list click rate。
- result print rate。
- affiliate CTR。
- 页面停留时间。
- 错误反馈数量。
- 维护成本。

---

## 2. MVP 范围锁定

### 2.1 P0 必须做

P0 是第一版必须上线的功能。缺少其中任何一个，项目都会变成普通单点 calculator，差异化不足。

| 模块 | 必做原因 | 验收重点 |
|---|---|---|
| Unit Conversion Core | 所有计算基础 | ft/in/cm/m、ft³/yd³/L/dry qt/gallon 正确 |
| Raised Bed Soil Calculator | 主搜索意图 | 支持长宽深、多床、freeboard、settling |
| 4x8 Preset Calculator | 最高频尺寸 | 6/8/10/12/18/24 in 快速结果 |
| Soil Bag Calculator | 用户购买决策 | 支持 40 qt、1 cu ft、1.5 cu ft、2 cu ft、50 L、自定义 |
| Bulk vs Bags Calculator | 商业价值高 | 支持袋价、bulk yd³ 价格、delivery fee、minimum order |
| Soil Mix Calculator | 差异化核心 | 支持 Basic、Soilless、Mel’s Mix、Custom |
| Container / Grow Bag Calculator | 同类强需求 | 支持 gallon、liter、round pot、rectangular planter |
| Result Shopping List | 复用和 affiliate 入口 | 可复制、可打印 |
| Basic Square Foot Grid | 提升停留 | 4x4、4x8、3x6，基础作物密度 |
| 合规页面 | AdSense 和信任基础 | About / Privacy / Terms / Disclaimer |

### 2.2 P1 做但不阻塞首版

| 模块 | 价值 | 触发时机 |
|---|---|---|
| Annual Top-Off Calculator | 增加复访 | P0 稳定后 |
| Crop Depth Suitability Checker | 增加实用性 | 与作物页一起做 |
| Multiple Areas / Multiple Containers | 更贴近真实使用 | P0 后增强 |
| 4x8 Planting Layout | 长尾价值强 | Square Foot Grid 后 |
| 长尾尺寸页 | SEO 扩展 | 核心页索引后 |
| 作物间距页 | SEO 扩展 | spacing data 稳定后 |
| Printable PDF / PNG | 增强体验 | print/copy 数据显示有人用后 |

### 2.3 P2 暂不做

| 功能 | 暂不做原因 |
|---|---|
| AI plant diagnosis | 高责任、高维护、偏离计算器 |
| 病虫害诊断 | 专业风险高 |
| 完整 companion planting 数据库 | 争议多，内容维护重 |
| USDA zone planting calendar | 地区化维护复杂 |
| 登录 / 保存项目 | MVP 不需要 |
| 云端同步 | 增加隐私和架构复杂度 |
| 3D garden layout designer | 开发成本高，SEO 验证前不划算 |
| 图片上传 / 植物识别 | 偏离当前工具站定位 |
| 精准肥料处方 | 需要土壤测试和专业背书 |

---

## 3. 技术栈

### 3.1 推荐技术栈

| 层级 | 技术 |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Rendering | 静态生成 + 客户端计算 |
| State | React local state / URL query params |
| Testing | Vitest + Playwright 可选 |
| Analytics | Vercel Analytics / GA4 / Plausible 任选 |
| Deployment | Vercel |
| Storage | 不需要数据库 |
| Auth | 不需要登录 |
| File Upload | 不需要 |
| Server Actions | 第一版不需要 |

### 3.2 架构原则

1. 所有核心计算必须是纯函数。
2. 所有单位换算集中在 `src/lib/calculators/units.ts`。
3. React 组件不直接写复杂公式。
4. 页面内容可静态生成。
5. 用户输入不上传服务器。
6. 不做登录，不做云端保存。
7. 结果可通过 URL query params 分享，但不保存到数据库。
8. SEO 内容应在 HTML 中可抓取，不依赖用户操作后才出现全部正文。
9. 广告代码不得阻塞核心工具交互。
10. 所有页面禁止 `meta keywords`。

---

## 4. 仓库与部署工作流

### 4.1 GitHub / Vercel 基础要求

项目初始化后应包含：

```text
package.json
next.config.ts
tsconfig.json
tailwind.config.ts
postcss.config.js
src/
public/
vercel.json
scripts/
```

### 4.2 Vercel 旧 commit 构建跳过

为了避免连续提交时旧 commit 浪费构建额度，项目应在第一轮基础设施阶段加入 `ignoreCommand`。

`vercel.json`：

```json
{
  "ignoreCommand": "node scripts/skip-old-vercel-builds.mjs"
}
```

`scripts/skip-old-vercel-builds.mjs`：

```js
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA;
const ref = process.env.VERCEL_GIT_COMMIT_REF;
const owner = process.env.VERCEL_GIT_REPO_OWNER;
const repo = process.env.VERCEL_GIT_REPO_SLUG;

if (!currentSha || !ref || !owner || !repo) {
  console.log("Missing Vercel Git environment variables. Continue build.");
  process.exit(1);
}

async function main() {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`;
    const headers = {
      "Accept": "application/vnd.github+json",
      "User-Agent": "skip-old-vercel-builds"
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.log(`GitHub API check failed with ${res.status}. Continue build.`);
      process.exit(1);
    }

    const data = await res.json();
    const latestSha = data?.sha;

    if (!latestSha) {
      console.log("No latest SHA found. Continue build.");
      process.exit(1);
    }

    if (latestSha !== currentSha) {
      console.log(`Skip old Vercel build. Current: ${currentSha}. Latest: ${latestSha}.`);
      process.exit(0);
    }

    console.log("Current commit is latest. Continue build.");
    process.exit(1);
  } catch (error) {
    console.log("Skip-old-build check failed. Continue build.", error);
    process.exit(1);
  }
}

main();
```

注意：

- `process.exit(0)` 表示 Vercel 跳过构建。
- `process.exit(1)` 表示继续构建。
- 检查失败时应继续构建，避免误跳过最新部署。
- 执行任何代码修改前，先检查仓库是否已有 `vercel.json` 和 `ignoreCommand`。
- 最终必须区分 GitHub 提交成功、Vercel 是否触发、线上是否部署成功。

### 4.3 提交策略

开发时应尽量批量提交。同一阶段先完成全部相关改动和检查，再一次性提交。

如果使用 GitHub API 修改代码，建议流程：

1. 获取 main 当前 commit。
2. 获取 main 当前 tree。
3. 创建多个 blob。
4. 创建新 tree。
5. 创建 commit。
6. update ref 到 main。

避免为了一个阶段拆成大量小提交，除非单次提交失败或文件冲突无法解决。

---

## 5. 目录结构

推荐目录：

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    raised-bed-soil-calculator/page.tsx
    4x8-raised-bed-soil-calculator/page.tsx
    soil-bags-calculator/page.tsx
    bulk-soil-vs-bags-calculator/page.tsx
    raised-bed-soil-mix-calculator/page.tsx
    container-soil-calculator/page.tsx
    grow-bag-soil-calculator/page.tsx
    square-foot-garden-spacing-calculator/page.tsx
    annual-raised-bed-top-off-calculator/page.tsx
    raised-bed-depth-calculator/page.tsx
    about/page.tsx
    privacy/page.tsx
    terms/page.tsx
    disclaimer/page.tsx
    affiliate-disclosure/page.tsx
    sitemap.ts
    robots.ts
    not-found.tsx
  components/
    layout/
    calculators/
    results/
    ui/
  lib/
    calculators/
    data/
    seo/
    utils/
  tests/
```

本地实现可以使用等价的动态 SSG 结构，但必须满足可索引、sitemap 完整、每页独立 metadata、每页真实内容，不得做空白薄页。

---

## 6. 数据结构设计

### 6.1 单位类型

```ts
export type LengthUnit = 'in' | 'ft' | 'cm' | 'm';
export type VolumeUnit = 'ft3' | 'yd3' | 'liter' | 'dryQuart' | 'gallon';
export type BagUnit = 'ft3' | 'dryQuart' | 'liter' | 'gallon' | 'lb' | 'kg';
export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'AUD' | 'EUR';
```

### 6.2 核心输入 / 结果结构

应覆盖 RaisedBedInput、SoilBagInput、BulkSoilInput、SoilMixInput、GrowBagInput、RoundPotInput、TaperedPotInput、RectangularPlanterInput、VolumeResult、BagResult、BulkComparisonResult、MixBreakdownResult、CalculatorWarnings 等结构。

---

## 7. 核心计算模块

必须包含并测试：

1. `units.ts`
2. `raisedBed.ts`
3. `bags.ts`
4. `bulkCost.ts`
5. `soilMix.ts`
6. `containers.ts`
7. `topOff.ts`
8. `spacing.ts`
9. `depth.ts`

重点公式：

- Raised bed volume: `lengthFt × widthFt × effectiveDepthFt × numberOfBeds × (1 + settling%)`
- Soil bags: `ceil(requiredVolumeFt3 / bagVolumeFt3)`
- Bulk order: `max(requiredYd3, minimumOrderYd3)`
- Grow bag: `gallons × 0.133680556 × quantity`
- Round pot: `π × radius² × height`
- Tapered pot: `(π × height / 3) × (R1² + R1×R2 + R2²)`
- Top-off: `lengthFt × widthFt × topOffDepthFt × numberOfBeds`
- Square foot: `floor(lengthFt) × floor(widthFt)`

---

## 8. UI / UX 开发计划

首页首屏必须直接是工具，不要先放长篇内容。

首页结构：

1. H1：Raised Bed Soil Calculator
2. Subtitle：Calculate soil volume, bags, bulk cost, compost mix, and planting space.
3. Tabs：Raised Bed / Soil Bags / Bulk vs Bags / Soil Mix / Containers / Plant Spacing
4. 4x8 Quick Presets：6、8、10、12、18、24 in
5. Result Summary：cubic feet、cubic yards、liters、bags needed、estimated cost
6. Copy shopping list
7. Print result
8. FAQ
9. Disclaimer

结果区必须输出：Base volume、Volume with settling allowance、Cubic feet、Cubic yards、Liters、Dry quarts、Bags needed、Leftover volume、Bagged cost、Bulk cost、Soil mix breakdown、Copyable shopping list、Warnings、Print result。

移动端要求：单列输入、numeric input、单位选择易点、结果卡不溢出、copy 按钮明显、广告不插在输入区中间、字体不小于 16px。

---

## 9. 页面开发计划

第一批至少包含首页、核心 10 个工具页、about、privacy、terms、disclaimer、affiliate-disclosure。第二批扩展尺寸页、袋规格页、作物页和深度页。每个核心工具页都必须包含 H1、一句话说明、Calculator、Result、How to use、Formula、Example calculation、Common mistakes、FAQ、Related calculators、Disclaimer、Internal links。

不要生成只有标题和一段文字的薄页。

---

## 10. SEO 开发计划

每页必须有唯一 title、description、canonical、Open Graph title、Open Graph description、robots index/follow，不使用 meta keywords。

优先做 WebApplication、FAQPage、BreadcrumbList schema；不要伪造 Review / Rating。

每个页面至少链接到 Raised Bed Soil Calculator、Soil Bags Calculator、Bulk vs Bags Calculator、Soil Mix Calculator、Container Soil Calculator、Square Foot Spacing Calculator。

`sitemap.ts` 应包含所有静态页面。`robots.ts` 应允许索引主要页面，sitemap 指向正式域名，不屏蔽工具页。

---

## 11. AdSense 与 Affiliate 开发计划

第一版只预留 `AdSlot`，AdSense 过审前可先不接或只接 Auto Ads。

适合位置：结果区下方、FAQ 中段、桌面端右侧栏、页面底部相关工具上方。

禁止位置：输入框之间、Calculate 按钮旁边、结果数字和 Copy 按钮之间、移动端首屏遮挡计算器、Square Foot Grid 中间、Shopping list 内部。

Affiliate 应跟结果上下文绑定，必须有 disclosure，链接不能伪装成结果，推荐卡片明确不是计算结果。

---

## 12. 测试计划

必须覆盖 unit tests、UI tests、SEO tests。固定测试用例：

| 测试 | 输入 | 预期 |
|---|---|---|
| 4x8 标准床 | 4 ft × 8 ft × 12 in | 32 ft³ / 1.19 yd³ |
| 多床 + 沉降 | 2 个 4 ft × 8 ft × 12 in，10% | 70.4 ft³ / 2.61 yd³ |
| 2 cu ft 袋 | 32 ft³ ÷ 2 ft³ | 16 bags |
| 1.5 cu ft 袋 | 32 ft³ ÷ 1.5 ft³ | 22 bags，剩 1 ft³ |
| 40 qt 袋 | 40 dry qt | 约 1.56 ft³ |
| 10 个 15-gallon + 6 个 10-gallon | 210 gallons | 约 28.07 ft³ |
| 4x8 top-off 2 in | 4 ft × 8 ft × 2 in | 5.33 ft³ |
| 60/30/10 mix | 32 ft³ | 19.2 / 9.6 / 3.2 ft³ |
| 4x8 square grid | 4 ft × 8 ft | 32 squares |
| 4x4 square grid | 4 ft × 4 ft | 16 squares |

---

## 13. Analytics 事件计划

核心事件：calculator_view、calculate_click、preset_select、unit_change、bag_size_change、settling_change、copy_shopping_list、print_result、bulk_compare_use、soil_mix_change、container_mode_change、crop_select、affiliate_click、faq_expand。

不要采集敏感信息。不要上传用户完整输入历史。

---

## 14. 分阶段开发任务

阶段 0：项目初始化和仓库检查。  
阶段 1：计算核心。  
阶段 2：首页和 Raised Bed Calculator。  
阶段 3：Soil Bags + Bulk vs Bags + Soil Mix。  
阶段 4：Container / Grow Bag / Annual Top-Off。  
阶段 5：Square Foot Grid + Depth。  
阶段 6：SEO 页面和内容扩展。  
阶段 7：AdSense / Affiliate 准备。  
阶段 8：上线前 QA。

每阶段完成后都应运行对应检查。最终必须区分 GitHub 提交状态、Vercel 触发状态、线上部署状态。

---

## 15. 90 天验证计划

第 0–7 天：部署正式站点、提交 sitemap 到 GSC、检查索引状态、手动检查核心页面、修正明显标题/description/canonical 问题。  
第 8–30 天：观察 impressions、交互、GSC query，调整 FAQ 和真实示例。  
第 31–60 天：根据 GSC 扩展第二批尺寸页、作物间距页、内链、affiliate 卡片。  
第 61–90 天：分析排名、行为、affiliate 点击，决定继续扩展、收缩或止损。

---

## 16. 90 天指标

SEO：已索引页面 30+、GSC 累计曝光 5,000+、核心页日曝光 100+/day、有曝光页面比例 50%+、核心关键词进入前 50 至少 5 个。  
交互：calculator interaction rate 20%+、calculate click rate 15%+、copy shopping list click rate 3%+、print result click rate 1%+、tab switch rate 5%+。  
商业：affiliate CTR 1%+、result affiliate CTR 2%+、AdSense RPM 观察。  
维护：计算错误反馈、内容维护成本、作物规则争议、工具点击率作为警戒指标。

---

## 17. 止损条件

如果 30–45 页上线 90 天后 GSC 日曝光仍低于 200、核心工具页没有稳定 impressions、calculator interaction rate 低于 5%、affiliate 点击长期接近 0、维护成本过高、SERP 被强站压制，应暂停扩页并重新审查关键词、SERP、竞品页面和真实搜索意图。

---

## 18. 上线验收总清单

产品、计算、SEO、合规、部署都必须完成。重点验收：核心工具可用、固定计算用例正确、每页 title/description/canonical 正确、sitemap/robots 正确、无 meta keywords、无 noindex、无 coming soon、无薄页、合规页面完整、广告不遮挡核心操作、build/test/lint 通过。

---

## 19. 开发 AI 执行提示词

根据《Raised Bed Soil & Planting Planner 开发计划》开发一个英文免费工具站 MVP。严格范围：Next.js App Router + TypeScript + Tailwind；所有计算在前端本地完成；不做登录、云端保存、AI 植物诊断、复杂 3D layout；核心计算纯函数并写测试；页面包含工具、公式、示例、FAQ、免责声明、相关工具内链；不使用 meta keywords；广告位只预留在结果区下方、FAQ 中段、桌面侧边栏；添加合规页面、sitemap、robots、Vercel ignoreCommand；验收通过 lint/test/build；最终区分 GitHub、Vercel、线上状态。

---

## 20. 最终开发原则

本项目的成功关键不是代码量，而是是否围绕真实用户的买土决策闭环做透。第一版必须聚焦多少土、几袋土、袋装还是散装、怎么配土、容器怎么算、4x8 能种多少、结果能否复制和打印、页面能否被搜索引擎索引、广告和推荐是否不干扰工具、90 天数据是否证明继续扩展。

只要这条闭环完成，就可以开始上线验证。不要在验证前扩成大而全园艺平台。
