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

    raised-bed-soil-calculator/
      page.tsx
    4x8-raised-bed-soil-calculator/
      page.tsx
    soil-bags-calculator/
      page.tsx
    bulk-soil-vs-bags-calculator/
      page.tsx
    raised-bed-soil-mix-calculator/
      page.tsx
    container-soil-calculator/
      page.tsx
    grow-bag-soil-calculator/
      page.tsx
    square-foot-garden-spacing-calculator/
      page.tsx
    annual-raised-bed-top-off-calculator/
      page.tsx
    raised-bed-depth-calculator/
      page.tsx

    about/
      page.tsx
    privacy/
      page.tsx
    terms/
      page.tsx
    disclaimer/
      page.tsx
    affiliate-disclosure/
      page.tsx

    sitemap.ts
    robots.ts
    not-found.tsx

  components/
    layout/
      SiteHeader.tsx
      SiteFooter.tsx
      PageShell.tsx
      CalculatorLayout.tsx

    calculators/
      RaisedBedCalculator.tsx
      SoilBagCalculator.tsx
      BulkVsBagsCalculator.tsx
      SoilMixCalculator.tsx
      ContainerSoilCalculator.tsx
      GrowBagCalculator.tsx
      SquareFootGridCalculator.tsx
      AnnualTopOffCalculator.tsx
      DepthSuitabilityChecker.tsx

    results/
      ResultCard.tsx
      VolumeSummary.tsx
      BagSummary.tsx
      BulkCostSummary.tsx
      MixBreakdownTable.tsx
      ShoppingListCard.tsx
      WarningList.tsx

    ui/
      NumberInput.tsx
      UnitSelect.tsx
      PresetButtons.tsx
      CopyButton.tsx
      PrintButton.tsx
      Tabs.tsx
      FAQ.tsx
      DisclosureBox.tsx
      AdSlot.tsx
      AffiliateSlot.tsx

  lib/
    calculators/
      units.ts
      raisedBed.ts
      bags.ts
      bulkCost.ts
      soilMix.ts
      containers.ts
      topOff.ts
      spacing.ts
      depth.ts

    data/
      raisedBedPresets.ts
      bagPresets.ts
      soilMixTemplates.ts
      crops.ts
      pageMetadata.ts
      faqs.ts

    seo/
      metadata.ts
      structuredData.ts
      urls.ts

    utils/
      format.ts
      validation.ts
      queryParams.ts

  tests/
    units.test.ts
    raisedBed.test.ts
    bags.test.ts
    bulkCost.test.ts
    soilMix.test.ts
    containers.test.ts
    topOff.test.ts
    spacing.test.ts
```

---

## 6. 数据结构设计

### 6.1 单位类型

```ts
export type LengthUnit = 'in' | 'ft' | 'cm' | 'm';
export type VolumeUnit = 'ft3' | 'yd3' | 'liter' | 'dryQuart' | 'gallon';
export type BagUnit = 'ft3' | 'dryQuart' | 'liter' | 'gallon' | 'lb' | 'kg';
export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'AUD' | 'EUR';
```

### 6.2 Raised Bed 输入

```ts
export interface RaisedBedInput {
  shape: 'rectangle' | 'square' | 'round';
  length: number;
  width: number;
  depth: number;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  depthUnit: LengthUnit;
  numberOfBeds: number;
  freeboard: number;
  freeboardUnit: LengthUnit;
  settlingAllowancePercent: number;
}
```

### 6.3 Soil Bag 输入

```ts
export interface SoilBagInput {
  bagSize: number;
  bagUnit: BagUnit;
  bagPrice?: number;
  currency?: CurrencyCode;
}
```

### 6.4 Bulk Soil 输入

```ts
export interface BulkSoilInput {
  pricePerCubicYard: number;
  deliveryFee: number;
  minimumOrderYards: number;
  currency?: CurrencyCode;
}
```

### 6.5 Soil Mix 输入

```ts
export interface SoilMixComponent {
  id: string;
  name: string;
  ratioPercent: number;
  bagSize?: number;
  bagUnit?: BagUnit;
  bagPrice?: number;
}

export interface SoilMixInput {
  templateId: 'basic' | 'soilless' | 'melsMix' | 'budgetFill' | 'custom';
  components: SoilMixComponent[];
}
```

### 6.6 Container 输入

```ts
export interface GrowBagInput {
  gallons: number;
  quantity: number;
}

export interface RoundPotInput {
  diameter: number;
  height: number;
  unit: LengthUnit;
  quantity: number;
}

export interface TaperedPotInput {
  topDiameter: number;
  bottomDiameter: number;
  height: number;
  unit: LengthUnit;
  quantity: number;
}

export interface RectangularPlanterInput {
  length: number;
  width: number;
  depth: number;
  unit: LengthUnit;
  quantity: number;
}
```

### 6.7 结果结构

```ts
export interface VolumeResult {
  baseVolumeFt3: number;
  finalVolumeFt3: number;
  volumeYd3: number;
  volumeLiters: number;
  volumeDryQuarts: number;
  volumeGallons: number;
}

export interface BagResult {
  bagVolumeFt3: number;
  rawBags: number;
  bagsNeeded: number;
  leftoverFt3: number;
  totalCost?: number;
  warnings: string[];
}

export interface BulkComparisonResult {
  bagTotalCost: number;
  bulkTotalCost: number;
  requiredYd3: number;
  bulkOrderYd3: number;
  savings: number;
  overbuyFt3: number;
  recommendation: 'bulk' | 'bags' | 'tie';
  warnings: string[];
}

export interface MixBreakdownResult {
  componentId: string;
  name: string;
  ratioPercent: number;
  volumeFt3: number;
  volumeYd3: number;
  volumeLiters: number;
  bagsNeeded?: number;
  cost?: number;
}

export interface CalculatorWarnings {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}
```

---

## 7. 核心计算模块

### 7.1 `units.ts`

职责：

- 长度统一换算为 feet。
- 体积统一换算为 cubic feet。
- 输出 cubic yards、liters、dry quarts、gallons。
- 处理 pounds/kg 的非精确警告。

常量：

```ts
export const FT3_PER_YD3 = 27;
export const LITERS_PER_FT3 = 28.316846592;
export const DRY_QUARTS_PER_FT3 = 25.71404638;
export const GALLONS_PER_FT3 = 7.48051948;
export const FT3_PER_GALLON = 0.133680556;
export const CUBIC_INCHES_PER_FT3 = 1728;
```

函数：

```ts
export function lengthToFeet(value: number, unit: LengthUnit): number;
export function volumeToFt3(value: number, unit: VolumeUnit | BagUnit): number;
export function ft3ToYd3(value: number): number;
export function ft3ToLiters(value: number): number;
export function ft3ToDryQuarts(value: number): number;
export function ft3ToGallons(value: number): number;
```

### 7.2 `raisedBed.ts`

函数：

```ts
export function calculateRaisedBedVolume(input: RaisedBedInput): VolumeResult;
```

公式：

```text
lengthFt = lengthToFeet(length, lengthUnit)
widthFt = lengthToFeet(width, widthUnit)
depthFt = lengthToFeet(depth, depthUnit)
freeboardFt = lengthToFeet(freeboard, freeboardUnit)

effectiveDepthFt = max(depthFt - freeboardFt, 0)

baseVolumeFt3 = lengthFt × widthFt × effectiveDepthFt × numberOfBeds
finalVolumeFt3 = baseVolumeFt3 × (1 + settlingAllowancePercent / 100)
```

特殊处理：

- `numberOfBeds` 最小为 1。
- `effectiveDepthFt` 不能小于 0。
- 如果 depth 单位为 ft 且数值大于 3，提示可能单位错误。
- 如果 depth 单位为 in 且数值大于 36，提示检查深度。
- 如果 settlingAllowancePercent 超过 30%，提示可能过高。

### 7.3 `bags.ts`

函数：

```ts
export function calculateSoilBags(
  requiredVolumeFt3: number,
  input: SoilBagInput
): BagResult;
```

公式：

```text
bagVolumeFt3 = volumeToFt3(bagSize, bagUnit)
rawBags = requiredVolumeFt3 / bagVolumeFt3
bagsNeeded = ceil(rawBags)
leftoverFt3 = bagsNeeded × bagVolumeFt3 - requiredVolumeFt3
totalCost = bagsNeeded × bagPrice
```

特殊处理：

- 如果 bagUnit 是 lb/kg，不直接精确计算，返回 warning。
- 如果 bagVolumeFt3 为 0 或负数，返回错误。
- 袋数永远向上取整。

### 7.4 `bulkCost.ts`

函数：

```ts
export function compareBulkVsBags(
  requiredVolumeFt3: number,
  bagInput: SoilBagInput,
  bulkInput: BulkSoilInput
): BulkComparisonResult;
```

公式：

```text
requiredYd3 = requiredVolumeFt3 / 27
bulkOrderYd3 = max(requiredYd3, minimumOrderYards)
bulkTotalCost = bulkOrderYd3 × pricePerCubicYard + deliveryFee

bagResult = calculateSoilBags(requiredVolumeFt3, bagInput)
bagTotalCost = bagResult.totalCost

savings = bagTotalCost - bulkTotalCost
overbuyFt3 = bulkOrderYd3 × 27 - requiredVolumeFt3
```

推荐逻辑：

```text
if savings > 0:
  recommendation = bulk
if savings < 0:
  recommendation = bags
else:
  recommendation = tie
```

warning：

- minimum order 远大于需求时提示可能买多。
- delivery fee 高于材料费时提示检查本地价格。
- 需求低于 10 ft³ 时提示 bulk 通常不实际。

### 7.5 `soilMix.ts`

函数：

```ts
export function calculateSoilMix(
  totalVolumeFt3: number,
  mixInput: SoilMixInput
): MixBreakdownResult[];
```

校验：

```text
sum(ratioPercent) === 100
ratioPercent >= 0
```

公式：

```text
componentVolumeFt3 = totalVolumeFt3 × ratioPercent / 100
```

模板：

```ts
export const SOIL_MIX_TEMPLATES = [
  {
    id: 'basic',
    label: 'Basic raised bed mix',
    components: [
      { id: 'topsoil', name: 'Topsoil', ratioPercent: 60 },
      { id: 'compost', name: 'Compost', ratioPercent: 30 },
      { id: 'pottingMix', name: 'Potting mix', ratioPercent: 10 }
    ]
  },
  {
    id: 'soilless',
    label: 'Compost + soilless mix',
    components: [
      { id: 'compost', name: 'Compost', ratioPercent: 50 },
      { id: 'soillessMix', name: 'Soilless growing mix', ratioPercent: 50 }
    ]
  },
  {
    id: 'melsMix',
    label: "Mel's Mix style",
    components: [
      { id: 'compost', name: 'Blended compost', ratioPercent: 33.33 },
      { id: 'peatOrCoir', name: 'Peat moss or coco coir', ratioPercent: 33.33 },
      { id: 'vermiculite', name: 'Vermiculite or perlite', ratioPercent: 33.34 }
    ]
  }
];
```

warning：

- compost/manure 超过 50% 时提示不适合所有情况。
- topsoil 用于硬质底面浅床时提示谨慎。
- custom ratio 不等于 100% 时阻止计算。

### 7.6 `containers.ts`

函数：

```ts
export function calculateGrowBagVolume(input: GrowBagInput): VolumeResult;
export function calculateRoundPotVolume(input: RoundPotInput): VolumeResult;
export function calculateTaperedPotVolume(input: TaperedPotInput): VolumeResult;
export function calculateRectangularPlanterVolume(input: RectangularPlanterInput): VolumeResult;
```

Grow bag：

```text
volumeFt3 = gallons × 0.133680556 × quantity
```

Round pot：

```text
radiusFt = diameterFt / 2
volumeFt3 = π × radiusFt² × heightFt × quantity
```

Tapered pot：

```text
volumeFt3 = (π × heightFt / 3) × (R1² + R1 × R2 + R2²) × quantity
```

Rectangular planter：

```text
volumeFt3 = lengthFt × widthFt × depthFt × quantity
```

warning：

- grow bag 标称容量和实际填充可能不同。
- 圆盆若只给直径不提供高度，应要求输入高度。
- tapered pot 适合上宽下窄花盆。

### 7.7 `topOff.ts`

函数：

```ts
export function calculateAnnualTopOff(input: AnnualTopOffInput): VolumeResult;
```

输入：

```ts
export interface AnnualTopOffInput {
  length: number;
  width: number;
  topOffDepth: number;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  topOffDepthUnit: LengthUnit;
  numberOfBeds: number;
}
```

公式：

```text
topOffFt3 = lengthFt × widthFt × topOffDepthFt × numberOfBeds
```

### 7.8 `spacing.ts`

函数：

```ts
export function calculateSquareFootSpacing(input: SquareFootSpacingInput): SquareFootSpacingResult;
```

输入：

```ts
export interface SquareFootSpacingInput {
  lengthFt: number;
  widthFt: number;
  cropId: string;
  customPlantsPerSquare?: number;
}
```

公式：

```text
totalSquares = floor(lengthFt) × floor(widthFt)
totalPlants = totalSquares × plantsPerSquareFoot
```

第一版作物数据：

| 作物 | 每平方英尺株数 | 备注 |
|---|---:|---|
| Tomato | 1 | 大型番茄建议更多空间和支架 |
| Pepper | 1 | 可密植但不建议过密 |
| Cucumber | 1–2 | 建议 trellis |
| Lettuce | 2–4 | 视 baby leaf 或 full head |
| Spinach | 9 | 常见 square foot 密度 |
| Carrot | 9–16 | 视品种 |
| Radish | 16 | 短周期 |
| Basil | 1–4 | 视采收方式 |
| Beans | 4–9 | bush / pole 不同 |
| Kale | 1 | 需要空间 |

### 7.9 `depth.ts`

函数：

```ts
export function checkDepthSuitability(depthInches: number, cropId: string): DepthSuitabilityResult;
```

输出：

```ts
export interface DepthSuitabilityResult {
  status: 'good' | 'borderline' | 'notIdeal';
  message: string;
  recommendedDepthRange?: [number, number];
}
```

基础规则：

| 作物类型 | 建议深度 |
|---|---|
| leafy greens / herbs | 6–8 in 起步 |
| beans / cucumbers | 8 in 起步 |
| peppers / tomatoes / squash | 12–24 in 更稳 |
| carrots / root crops | 取决于品种，短根和长根分开 |

---

## 8. UI / UX 开发计划

### 8.1 首页 UX

首页首屏必须直接是工具，不要先放长篇内容。

结构：

1. H1：Raised Bed Soil Calculator
2. Subtitle：Calculate soil volume, bags, bulk cost, compost mix, and planting space.
3. Tabs：
   - Raised Bed
   - Soil Bags
   - Bulk vs Bags
   - Soil Mix
   - Containers
   - Plant Spacing
4. 4x8 Quick Presets：
   - 6 in
   - 8 in
   - 10 in
   - 12 in
   - 18 in
   - 24 in
5. Result Summary：
   - cubic feet
   - cubic yards
   - liters
   - bags needed
   - estimated cost
6. Copy shopping list
7. Print result
8. FAQ
9. Disclaimer

### 8.2 输入默认值

| 字段 | 默认值 |
|---|---|
| Length | 4 ft |
| Width | 8 ft |
| Depth | 12 in |
| Number of beds | 1 |
| Freeboard | 0 in |
| Settling allowance | 10% |
| Bag size | 2 cu ft |
| Bag price | 空 |
| Bulk price | 空 |
| Currency | USD |
| Soil mix | Basic raised bed mix |
| Container mode | Grow bag |

### 8.3 结果区规则

结果区必须输出：

1. Base volume
2. Volume with settling allowance
3. Cubic feet
4. Cubic yards
5. Liters
6. Dry quarts
7. Bags needed
8. Leftover volume
9. Bagged cost
10. Bulk cost
11. Soil mix breakdown
12. Copyable shopping list
13. Warnings
14. Print result

示例 shopping list：

```text
Raised bed soil estimate:
- Total soil: 35.2 cubic feet / 1.30 cubic yards
- Bags needed: 18 bags of 2 cu ft soil
- Mix breakdown:
  - Topsoil: 21.1 cu ft
  - Compost: 10.6 cu ft
  - Potting mix: 3.5 cu ft
- Includes 10% settling allowance
```

### 8.4 Warning 文案规则

| 条件 | 文案 |
|---|---|
| depth 大于 36 in | This is a very deep bed. Check whether you meant inches or feet. |
| bag unit 为 lb/kg | Weight-based soil bags are only rough estimates because soil density varies by moisture and material. |
| compost ratio > 50% | Very high compost ratios may not suit every crop or soil condition. |
| bulk minimum order > required × 2 | Your bulk minimum order is much larger than your required volume. |
| bed on concrete + depth < 8 in | Shallow beds on hard surfaces may not suit many vegetables. |
| tomato/pepper + depth < 12 in | Tomatoes and peppers usually do better with deeper soil. |
| grow bag | Grow bag capacity can vary by shape, fold height, and compaction. |

### 8.5 移动端要求

1. 输入框单列。
2. 使用 numeric input。
3. 单位选择器大按钮。
4. 结果卡片不要过宽。
5. Copy 按钮固定在结果卡片内，不要 sticky 遮挡。
6. 广告不能插在输入区中间。
7. 4x8 presets 在移动端横向滚动或两列。
8. FAQ 折叠显示。
9. 字体最小 16px。
10. Calculate button 明显，但计算也可以即时更新。

---

## 9. 页面开发计划

### 9.1 第一批上线页面

第一批建议 15 个页面：

| URL | 页面目标 | 核心模块 |
|---|---|---|
| `/` | 首页 + 工具矩阵入口 | 全功能 tabs |
| `/raised-bed-soil-calculator` | 主工具页 | Raised Bed |
| `/4x8-raised-bed-soil-calculator` | 4x8 长尾主力页 | 4x8 presets |
| `/soil-bags-calculator` | 袋数换算 | Soil Bags |
| `/bulk-soil-vs-bags-calculator` | 成本比较 | Bulk vs Bags |
| `/raised-bed-soil-mix-calculator` | 配土 | Soil Mix |
| `/container-soil-calculator` | 容器 | Container |
| `/grow-bag-soil-calculator` | grow bag | Grow Bag |
| `/annual-raised-bed-top-off-calculator` | 年度补土 | Top-Off |
| `/square-foot-garden-spacing-calculator` | 种植密度 | Spacing Grid |
| `/raised-bed-depth-calculator` | 深度提示 | Depth |
| `/about` | 站点说明 | 合规 |
| `/privacy` | 隐私 | 合规 |
| `/terms` | 条款 | 合规 |
| `/disclaimer` | 免责声明 | 合规 |

### 9.2 第二批尺寸页

| URL | 目标关键词 |
|---|---|
| `/4x4-raised-bed-soil-calculator` | 4x4 raised bed soil calculator |
| `/4x6-raised-bed-soil-calculator` | 4x6 raised bed soil calculator |
| `/3x6-raised-bed-soil-calculator` | 3x6 raised bed soil calculator |
| `/2x8-raised-bed-soil-calculator` | 2x8 raised bed soil calculator |
| `/4x8-raised-bed-6-inches-soil` | 4x8 raised bed 6 inches soil |
| `/4x8-raised-bed-8-inches-soil` | 4x8 raised bed 8 inches soil |
| `/4x8-raised-bed-10-inches-soil` | 4x8 raised bed 10 inches soil |
| `/4x8-raised-bed-12-inches-soil` | 4x8 raised bed 12 inches soil |
| `/4x8-raised-bed-18-inches-soil` | 4x8 raised bed 18 inches soil |
| `/4x8-raised-bed-24-inches-soil` | 4x8 raised bed 24 inches soil |

### 9.3 第三批作物页

| URL | 目标关键词 |
|---|---|
| `/how-many-tomato-plants-in-4x8-raised-bed` | how many tomato plants in 4x8 raised bed |
| `/tomato-spacing-raised-bed` | tomato spacing raised bed |
| `/pepper-spacing-raised-bed` | pepper spacing raised bed |
| `/lettuce-spacing-square-foot-garden` | lettuce spacing square foot garden |
| `/carrot-spacing-square-foot-garden` | carrot spacing square foot garden |
| `/cucumber-spacing-raised-bed` | cucumber spacing raised bed |
| `/raised-bed-depth-for-tomatoes` | raised bed depth for tomatoes |
| `/raised-bed-depth-for-carrots` | raised bed depth for carrots |

### 9.4 每个工具页内容结构

每个核心工具页都必须包含：

1. H1
2. 一句话说明
3. Calculator
4. Result
5. How to use
6. Formula
7. Example calculation
8. Common mistakes
9. FAQ
10. Related calculators
11. Disclaimer
12. Internal links

不要生成只有标题和一段文字的薄页。

---

## 10. SEO 开发计划

### 10.1 Metadata 规则

每页必须有：

- 唯一 title。
- 唯一 description。
- canonical。
- Open Graph title。
- Open Graph description。
- robots index/follow。
- 不使用 meta keywords。

示例：

```ts
export const metadata = {
  title: 'Raised Bed Soil Calculator | Soil Volume, Bags & Compost Mix',
  description: 'Calculate how much soil, compost, and bagged or bulk mix you need for a raised garden bed. Includes cubic feet, cubic yards, liters, bags, and settling allowance.',
  alternates: {
    canonical: 'https://example.com/raised-bed-soil-calculator'
  }
};
```

### 10.2 结构化数据

优先做：

1. WebApplication schema
2. FAQPage schema
3. BreadcrumbList schema

不要伪造 Review / Rating。

### 10.3 Internal Links

每个页面至少链接到：

- Raised Bed Soil Calculator
- Soil Bags Calculator
- Bulk vs Bags Calculator
- Soil Mix Calculator
- Container Soil Calculator
- Square Foot Spacing Calculator

4x8 页面应链接：

- 4x8 6 inches
- 4x8 8 inches
- 4x8 10 inches
- 4x8 12 inches
- 4x8 planting layout
- tomato spacing

### 10.4 Sitemap

`sitemap.ts` 应包含所有静态页面。上线第一版至少包含 15 个页面。

### 10.5 Robots

`robots.ts`：

- 允许索引主要页面。
- sitemap 指向正式域名。
- 不屏蔽工具页。

---

## 11. AdSense 与 Affiliate 开发计划

### 11.1 AdSense 放置

第一版只预留 `AdSlot`，AdSense 过审前可先不接或只接 Auto Ads。

适合位置：

1. 结果区下方。
2. FAQ 中段。
3. 桌面端右侧栏。
4. 页面底部相关工具上方。

禁止位置：

1. 输入框之间。
2. Calculate 按钮旁边。
3. 结果数字和 Copy 按钮之间。
4. 移动端首屏遮挡计算器。
5. Square Foot Grid 中间。
6. Shopping list 内部。

组件设计：

```tsx
<AdSlot id="result-bottom" />
<AdSlot id="faq-mid" />
<AdSlot id="desktop-sidebar" />
```

### 11.2 Affiliate 放置

Affiliate 应跟结果上下文绑定。

场景：

| 场景 | 推荐 |
|---|---|
| 用户算出袋数 | bagged raised bed soil、compost、potting mix |
| 用户算出 Mel’s Mix | peat/coco、vermiculite、compost |
| 用户算 grow bags | grow bags、potting mix |
| 用户做 spacing | seeds、trellis、plant labels |
| 用户补土 | compost、worm castings、mulch |
| 用户规划高床 | raised bed kits、drip irrigation |

要求：

1. Affiliate disclosure 必须有。
2. 链接不能伪装成结果。
3. 早期可用占位卡片，不强行接太多平台。
4. 不能影响核心工具。
5. 结果卡片之后再出现推荐。

---

## 12. 测试计划

### 12.1 Unit Tests

必须覆盖：

- `units.ts`
- `raisedBed.ts`
- `bags.ts`
- `bulkCost.ts`
- `soilMix.ts`
- `containers.ts`
- `topOff.ts`
- `spacing.ts`
- `depth.ts`

### 12.2 固定测试用例

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

### 12.3 UI Tests

检查：

1. 页面可以加载。
2. 输入 4、8、12 后显示 32 ft³。
3. 切换 bag size 后袋数变化。
4. Copy shopping list 可用。
5. Print 按钮可触发。
6. Tabs 切换不丢失核心输入。
7. 移动端无横向溢出。
8. FAQ 可展开。
9. 广告位不遮挡输入。
10. 无控制台严重错误。

### 12.4 SEO Tests

检查：

1. 每页只有一个 H1。
2. title 唯一。
3. description 唯一。
4. canonical 正确。
5. sitemap 包含页面。
6. robots 允许索引。
7. 无 meta keywords。
8. 无 `noindex`。
9. 页面正文可被静态抓取。
10. 合规页面可访问。

---

## 13. Analytics 事件计划

### 13.1 核心事件

| 事件名 | 触发 |
|---|---|
| `calculator_view` | 用户看到计算器 |
| `calculate_click` | 点击 Calculate |
| `preset_select` | 点击 4x8 / 4x4 preset |
| `unit_change` | 改变单位 |
| `bag_size_change` | 改变袋规格 |
| `settling_change` | 改变 settling |
| `copy_shopping_list` | 点击 copy |
| `print_result` | 点击 print |
| `bulk_compare_use` | 使用 bulk comparison |
| `soil_mix_change` | 切换配土模板 |
| `container_mode_change` | 切换容器类型 |
| `crop_select` | 选择作物 |
| `affiliate_click` | 点击 affiliate |
| `faq_expand` | 展开 FAQ |

### 13.2 事件属性

示例：

```ts
{
  calculator: 'raised_bed_soil',
  page: '/raised-bed-soil-calculator',
  preset: '4x8x12',
  volumeFt3Range: '30-50',
  bagSize: '2_ft3',
  settling: 10
}
```

不要采集敏感信息。不要上传用户完整输入历史。

---

## 14. 分阶段开发任务

### 阶段 0：项目初始化和仓库检查

目标：确保项目基础可运行、可部署、不会浪费 Vercel 旧 commit 构建。

任务：

1. 初始化 Next.js + TypeScript + Tailwind。
2. 配置 ESLint / TypeScript。
3. 创建基础目录结构。
4. 创建 `vercel.json`。
5. 创建 `scripts/skip-old-vercel-builds.mjs`。
6. 检查是否已有 ignoreCommand，避免重复。
7. 创建基础 layout。
8. 创建 footer 合规链接。
9. 创建 placeholder 合规页面。
10. 跑 `npm install`、`npm run lint`、`npm run build`。

验收：

- 本地 build 通过。
- `vercel.json` 包含 ignoreCommand。
- 合规页面可访问。
- 首页可打开。
- 无 meta keywords。

### 阶段 1：计算核心

目标：先保证公式正确，避免 UI 完成后返工。

任务：

1. 编写 `units.ts`。
2. 编写 `raisedBed.ts`。
3. 编写 `bags.ts`。
4. 编写 `bulkCost.ts`。
5. 编写 `soilMix.ts`。
6. 编写 `containers.ts`。
7. 编写 `topOff.ts`。
8. 编写 `spacing.ts`。
9. 编写 `depth.ts`。
10. 添加 Vitest。
11. 添加固定测试用例。

验收：

- 所有 unit tests 通过。
- 4x8×12 in = 32 ft³。
- 2 个 4x8×12 in + 10% = 70.4 ft³。
- 32 ft³ / 2 ft³ = 16 bags。
- 32 ft³ / 1.5 ft³ = 22 bags。
- 60/30/10 mix 正确。
- 10×15 gal + 6×10 gal 正确。
- 4x8 grid = 32 squares。

### 阶段 2：首页和 Raised Bed Calculator

目标：完成主工具体验。

任务：

1. 创建 `RaisedBedCalculator`。
2. 创建 `ResultCard`。
3. 创建 `VolumeSummary`。
4. 创建 `BagSummary`。
5. 创建 `ShoppingListCard`。
6. 创建 `WarningList`。
7. 创建 `CopyButton`。
8. 创建 `PrintButton`。
9. 创建 4x8 preset buttons。
10. 首页集成 calculator tabs。
11. `/raised-bed-soil-calculator` 页面上线。
12. `/4x8-raised-bed-soil-calculator` 页面上线。

验收：

- 默认 4×8×12 in 输出 32 ft³。
- 支持 settling 0/10/15/custom。
- 支持 number of beds。
- 支持 freeboard。
- 支持复制 shopping list。
- 支持打印。
- 移动端无横向溢出。
- 页面有公式、示例、FAQ、免责声明。

### 阶段 3：Soil Bags + Bulk vs Bags + Soil Mix

目标：完成买土决策闭环。

任务：

1. 创建 `SoilBagCalculator`。
2. 创建 `BulkVsBagsCalculator`。
3. 创建 `SoilMixCalculator`。
4. 创建 `BulkCostSummary`。
5. 创建 `MixBreakdownTable`。
6. 添加 bag presets。
7. 添加 soil mix templates。
8. 集成到首页 tabs。
9. 创建 `/soil-bags-calculator`。
10. 创建 `/bulk-soil-vs-bags-calculator`。
11. 创建 `/raised-bed-soil-mix-calculator`。

验收：

- 40 qt、1 cu ft、1.5 cu ft、2 cu ft、50 L 可选。
- 自定义袋规格可用。
- 袋数向上取整。
- bulk minimum order 生效。
- delivery fee 生效。
- Basic / Soilless / Mel’s Mix / Custom 可切换。
- custom ratio 不等于 100% 时提示。
- compost > 50% 时提示。
- pounds/kg 显示警告。

### 阶段 4：Container / Grow Bag / Annual Top-Off

目标：覆盖同类高意图需求并增强复用。

任务：

1. 创建 `ContainerSoilCalculator`。
2. 创建 `GrowBagCalculator`。
3. 创建 `AnnualTopOffCalculator`。
4. 支持 grow bag gallons。
5. 支持 round pot。
6. 支持 tapered pot。
7. 支持 rectangular planter。
8. 支持 quantity。
9. 创建 `/container-soil-calculator`。
10. 创建 `/grow-bag-soil-calculator`。
11. 创建 `/annual-raised-bed-top-off-calculator`。

验收：

- 10 个 15-gallon + 6 个 10-gallon 输出 210 gallons / 28.07 ft³。
- round pot 公式正确。
- tapered pot 公式正确。
- 4×8 top-off 2 in 输出 5.33 ft³。
- grow bag warning 正常显示。
- 结果可复制和打印。

### 阶段 5：Square Foot Grid + Depth

目标：增加停留、规划价值和后续作物页基础。

任务：

1. 创建 `SquareFootGridCalculator`。
2. 创建 `DepthSuitabilityChecker`。
3. 创建 crop data。
4. 支持 4x4、4x8、3x6 presets。
5. 支持 10 个常见作物。
6. 显示 total squares。
7. 显示 total plants。
8. 显示 spacing warning。
9. 创建 `/square-foot-garden-spacing-calculator`。
10. 创建 `/raised-bed-depth-calculator`。

验收：

- 4x8 输出 32 squares。
- 4x4 输出 16 squares。
- tomato 显示 trellis / spacing warning。
- depth < 12 in + tomato 显示 warning。
- carrot 根据品种提示。
- 页面内容不承诺产量。

### 阶段 6：SEO 页面和内容扩展

目标：上线第一批可索引页面，形成工具矩阵。

任务：

1. 完成首页正文。
2. 完成 15 个第一批页面。
3. 每页写 formula。
4. 每页写 example calculation。
5. 每页写 FAQ。
6. 每页加入 related calculators。
7. 每页加入 disclaimer。
8. 配置 metadata。
9. 配置 sitemap。
10. 配置 robots。
11. 加入 FAQ structured data。
12. 加入 Breadcrumb structured data。

验收：

- 15 个页面全部可访问。
- sitemap 包含全部页面。
- 每页 title/description 唯一。
- 每页一个 H1。
- 无 meta keywords。
- 无 coming soon。
- 无空页面。
- 无重复薄页。

### 阶段 7：AdSense / Affiliate 准备

目标：为审核和变现预留位置，但不干扰工具。

任务：

1. 创建 `AdSlot` 组件。
2. 结果区下方预留广告位。
3. FAQ 中段预留广告位。
4. 桌面侧边栏预留广告位。
5. 创建 `AffiliateSlot` 组件。
6. 创建 affiliate disclosure 页面。
7. 在 shopping list 后加入推荐区域。
8. 检查移动端广告不遮挡。
9. 检查合规链接。
10. 站点最终审核。

验收：

- 广告位不在输入框中间。
- 广告位不遮挡结果。
- affiliate disclosure 可访问。
- 推荐卡片明确不是计算结果。
- footer 包含 About / Privacy / Terms / Disclaimer。
- 如果接 AdSense，`ads.txt` 正确。

### 阶段 8：上线前 QA

目标：确保可以正式部署和提交索引。

任务：

1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. Lighthouse 移动端检查
5. 手动测试核心计算
6. 检查 sitemap
7. 检查 robots
8. 检查 canonical
9. 检查 metadata
10. 检查合规页面
11. 检查无 meta keywords
12. 检查 noindex
13. 检查移动端输入
14. 检查 copy / print
15. 检查部署状态

验收：

- build 通过。
- 核心测试通过。
- 线上页面可访问。
- sitemap 可访问。
- robots 可访问。
- GSC 可提交。
- 无明显 UI 阻断。
- 无控制台严重错误。

---

## 15. 90 天验证计划

### 15.1 第 0–7 天

任务：

1. 部署正式站点。
2. 提交 sitemap 到 GSC。
3. 检查索引状态。
4. 手动检查核心页面。
5. 修正明显标题、描述、canonical 问题。
6. 记录初始基线。

目标：

- 15 个页面可访问。
- GSC 能识别 sitemap。
- 没有 noindex。
- 没有 404。
- 没有严重移动端问题。

### 15.2 第 8–30 天

任务：

1. 观察哪些页面开始有 impressions。
2. 检查用户是否点击计算器。
3. 根据 GSC query 调整 FAQ。
4. 增加 4x8 深度页或 soil bag 页。
5. 修正交互低的页面。
6. 补充真实示例计算。

目标：

- 至少部分页面被索引。
- 核心页有 impressions。
- calculator interaction rate 开始出现。
- 无大量错误反馈。

### 15.3 第 31–60 天

任务：

1. 根据 GSC 扩展第二批尺寸页。
2. 上线作物间距页。
3. 优化内链。
4. 增加 affiliate 推荐卡片。
5. 观察 copy / print 事件。
6. 判断是否需要调整首页首屏。

目标：

- 30+ 页面上线。
- 长尾 query 开始覆盖。
- 至少有若干页面获得稳定 impressions。
- 用户有实际交互。

### 15.4 第 61–90 天

任务：

1. 分析核心页面排名。
2. 分析使用行为。
3. 分析 affiliate 点击。
4. 判断是否继续扩展。
5. 如果表现好，增加更多尺寸页和作物页。
6. 如果表现差，回到 SERP 和搜索意图复核。

目标：

- 明确继续、收缩或止损。
- 不凭感觉堆页面。
- 不继续开发没有交互的功能。

---

## 16. 90 天指标

### 16.1 SEO 指标

| 指标 | 目标 |
|---|---:|
| 已索引页面 | 30+ |
| GSC 累计曝光 | 5,000+ |
| 核心页日曝光 | 100+/day |
| 有曝光页面比例 | 50%+ |
| 核心关键词进入前 50 | 5 个以上 |
| 核心关键词进入前 20 | 1–2 个 |

### 16.2 交互指标

| 指标 | 目标 |
|---|---:|
| calculator interaction rate | 20%+ |
| calculate click rate | 15%+ |
| copy shopping list click rate | 3%+ |
| print result click rate | 1%+ |
| tab switch rate | 5%+ |
| average engagement time | 60 秒以上 |

### 16.3 商业指标

| 指标 | 目标 |
|---|---:|
| affiliate CTR | 1%+ |
| result affiliate CTR | 2%+ |
| AdSense RPM | 观察，不设早期硬目标 |
| shopping list 后推荐点击 | 有稳定点击 |
| high-intent pages clicks | 有增长 |

### 16.4 维护成本指标

| 指标 | 警戒线 |
|---|---:|
| 计算错误反馈 | 每周 > 5 个 |
| 内容维护成本 | 每周 > 5 小时 |
| 作物规则争议 | 频繁出现 |
| 90 天后日曝光 | < 200 |
| 工具点击率 | < 5% |

---

## 17. 止损条件

如果同时出现以下多个情况，应暂停扩页：

1. 30–45 页上线 90 天后，GSC 日曝光仍低于 200。
2. 核心工具页没有稳定 impressions。
3. calculator interaction rate 低于 5%。
4. 用户只看首屏表格，不使用工具。
5. affiliate 点击长期接近 0。
6. AdSense 收益极低且没有增长迹象。
7. 维护作物、土壤配方、内容的成本高于预期。
8. SERP 被强电商和强内容站完全压制，长尾也无突破。
9. 技术支持和错误反馈消耗过多时间。
10. 新增页面无法获得索引或曝光。

如果出现这些情况，不要继续堆代码。应重新审查关键词、SERP、竞品页面和真实搜索意图。

---

## 18. 上线验收总清单

### 18.1 产品

- [ ] Raised Bed Calculator 可用
- [ ] 4x8 Presets 可用
- [ ] Soil Bag Calculator 可用
- [ ] Bulk vs Bags Calculator 可用
- [ ] Soil Mix Calculator 可用
- [ ] Container Calculator 可用
- [ ] Grow Bag Calculator 可用
- [ ] Annual Top-Off Calculator 可用
- [ ] Square Foot Grid 可用
- [ ] Depth Checker 可用
- [ ] Copy shopping list 可用
- [ ] Print result 可用

### 18.2 计算

- [ ] 4×8×12 in = 32 ft³
- [ ] 2 个 4×8×12 in + 10% = 70.4 ft³
- [ ] 32 ft³ / 2 ft³ = 16 bags
- [ ] 32 ft³ / 1.5 ft³ = 22 bags
- [ ] 40 qt ≈ 1.56 ft³
- [ ] 210 gallons ≈ 28.07 ft³
- [ ] 4×8 top-off 2 in = 5.33 ft³
- [ ] 60/30/10 mix = 19.2 / 9.6 / 3.2 ft³
- [ ] 4x8 grid = 32 squares
- [ ] 4x4 grid = 16 squares

### 18.3 SEO

- [ ] 每页一个 H1
- [ ] 每页 title 唯一
- [ ] 每页 description 唯一
- [ ] canonical 正确
- [ ] sitemap 正确
- [ ] robots 正确
- [ ] 无 meta keywords
- [ ] 无 noindex
- [ ] 无 coming soon
- [ ] 无薄页

### 18.4 合规

- [ ] About 页面
- [ ] Privacy 页面
- [ ] Terms 页面
- [ ] Disclaimer 页面
- [ ] Affiliate disclosure 页面
- [ ] 不保存用户输入
- [ ] 不需要登录
- [ ] 不上传文件
- [ ] 不承诺专业农业建议
- [ ] 不保证产量

### 18.5 部署

- [ ] vercel.json 存在
- [ ] ignoreCommand 存在
- [ ] skip-old-vercel-builds.mjs 存在
- [ ] build 通过
- [ ] GitHub main 已提交
- [ ] Vercel 最新 commit 触发
- [ ] 线上部署成功
- [ ] sitemap 可在线访问
- [ ] robots 可在线访问

---

## 19. 开发 AI 执行提示词

可以把以下内容交给开发 AI 执行：

```text
你现在根据《Raised Bed Soil & Planting Planner 开发计划》开发一个英文免费工具站 MVP。

严格范围：
1. 使用 Next.js App Router + TypeScript + Tailwind。
2. 所有计算在前端本地完成。
3. 不做登录、不做云端保存、不做 AI 植物诊断、不做复杂 3D layout。
4. 第一版必须做 Raised Bed Soil Calculator、4x8 Presets、Soil Bag Calculator、Bulk vs Bags Calculator、Soil Mix Calculator、Container/Grow Bag Calculator、Annual Top-Off Calculator、Basic Square Foot Grid、Depth Checker。
5. 每个核心计算函数必须是纯函数，并写单元测试。
6. 所有单位换算集中在 lib/calculators/units.ts。
7. 页面必须包含工具、公式、示例、FAQ、免责声明、相关工具内链。
8. 不使用 meta keywords。
9. 广告位只预留在结果区下方、FAQ 中段、桌面侧边栏，不得遮挡输入和结果。
10. 添加 About、Privacy、Terms、Disclaimer、Affiliate Disclosure、sitemap、robots。
11. 添加 vercel.json ignoreCommand 和 scripts/skip-old-vercel-builds.mjs，执行前先检查是否已存在。
12. 同一阶段尽量批量完成改动和检查后一次性提交。
13. 验收必须通过 npm run lint、npm run test、npm run build。
14. 最终区分 GitHub 提交状态、Vercel 触发状态、线上部署状态。
```

---

## 20. 最终开发原则

本项目的成功关键不是代码量，而是是否围绕真实用户的买土决策闭环做透。

第一版必须聚焦：

1. 多少土。
2. 几袋土。
3. 袋装还是散装。
4. 怎么配土。
5. 容器怎么算。
6. 4x8 能种多少。
7. 结果能否复制和打印。
8. 页面能否被搜索引擎索引。
9. 广告和推荐是否不干扰工具。
10. 90 天数据是否证明继续扩展。

只要这条闭环完成，就可以开始上线验证。不要在验证前扩成大而全园艺平台。
