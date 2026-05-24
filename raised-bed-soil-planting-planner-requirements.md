# 园艺高床土壤 / 种植空间工具矩阵需求文档

版本：v1.0  
项目类型：免费工具站 / AdSense + Affiliate 工具矩阵  
目标语言：英文站优先  
建议站点定位：Raised Bed Soil & Planting Planner  
核心目标：围绕 raised bed、container gardening、soil bags、soil mix、bulk soil、square foot gardening 等搜索需求，提供低敏感、即时结果、可复用、可规模化扩展的前端计算工具矩阵。

---

## 1. 项目摘要

本项目不是普通的“土壤体积计算器”，而是面向家庭园艺、raised bed gardening、container gardening、square foot gardening 用户的买土与种植空间决策工具站。

用户的真实需求链路是：

> 我准备建高床 / 已经买了高床  
> → 不知道需要多少土  
> → 不知道要买几袋  
> → 不知道袋装还是散装更划算  
> → 不知道 topsoil、compost、potting mix 怎么配  
> → 不知道床深够不够  
> → 不知道 4x8 高床能种多少植物  
> → 第二年还要补多少土或 compost

因此，第一版产品应围绕“买土前决策”展开，而不是泛泛做 gardening 内容站。

推荐英文定位：

> Calculate soil volume, bags, bulk cost, compost mix, and planting space for raised beds, containers, and square foot gardens.

中文定位：

> 高床买土、配土、袋数、散装成本、种植布局，一次算清。

---

## 2. 项目价值判断

### 2.1 为什么这个方向值得做

该方向符合免费工具站的关键条件：

1. 用户有明确主动搜索意图  
   典型关键词包括 raised bed soil calculator、4x8 raised bed soil calculator、soil bags calculator、planter soil volume calculator、square foot garden spacing calculator。

2. 用户输入低敏感  
   输入的是尺寸、袋规格、价格、作物类型，不涉及医疗、金融、身份、账号、商业机密。

3. 结果即时  
   用户输入尺寸后立即得到 cubic feet、cubic yards、liters、bags、cost、mix breakdown。

4. 可复用  
   用户每次建床、扩建、换盆、补 compost、春季重新规划种植时都会重新计算。

5. 商业邻接强  
   计算结果天然连接 soil、compost、raised bed kits、grow bags、seeds、drip irrigation、trellis、garden tools、moisture meter、pH tester 等 affiliate 场景。

6. 可以规模化扩展长尾页  
   能按尺寸、深度、袋规格、作物、容器、配方、成本比较拆分大量工具页。

### 2.2 项目的主要风险

1. 季节性明显  
   北美园艺搜索通常在冬末、春季、初夏更集中。站点应尽早上线和索引。

2. 内容竞争强  
   BHG、The Spruce、HGTV、Houzz、Gardener’s Supply、Home Depot、Lowe’s 等站点会覆盖大量园艺内容。新站不能靠泛内容竞争，必须靠工具闭环和长尾细分进入。

3. 配土建议存在地区差异  
   不同气候、排水条件、现有土壤、作物、材料质量会影响结果。页面必须声明结果是 planning estimate，而不是农业处方。

4. 单位和重量换算容易出错  
   用户会混用 cubic feet、cubic yards、dry quarts、liters、gallons、pounds。尤其 pounds 不能稳定换算体积，因为土壤含水量和密度变化很大。工具应优先使用体积单位，对重量单位加警告。

5. Square foot gardening 不应过早做复杂  
   第一版应做轻量 grid 和常见作物密度，不应做完整拖拽式 3D garden planner。

---

## 3. 目标用户

### 3.1 核心用户

1. 家庭菜园新手  
   典型问题：4x8 raised bed 要买多少袋土？12 inch 深够不够种番茄？40 qt 袋要几袋？

2. Raised bed 用户  
   已经买了木质、金属或模块化高床，需要计算 soil volume、soil mix、bulk delivery。

3. Container gardening 用户  
   使用 grow bags、planters、pots、5 gallon buckets、utility tubs，需要换算容器土量。

4. Square foot gardening 用户  
   想知道 4x4、4x8 高床能种几棵番茄、辣椒、生菜、胡萝卜。

5. Homesteading / backyard gardening 用户  
   同时有多个高床，需要计算总土量、散装土、堆肥、年度补土。

6. 预算敏感用户  
   发现买土成本远超预期，需要比较 bagged soil 和 bulk soil。

### 3.2 非核心用户

1. 专业农艺师  
   他们需要土壤测试、pH、养分、区域性建议，超出本 MVP 范围。

2. 景观公司  
   可能会用 cubic yard 计算，但不是第一版的主要服务对象。

3. 大规模农场  
   面积、土壤改良、灌溉和作物规划复杂，不适合本工具第一版。

---

## 4. 用户真实需求拆解

### 4.1 高床需要多少土

用户最常见的问题是：

- How much soil do I need for a 4x8 raised bed?
- How many bags of soil for a 4x8 raised bed?
- How much soil for 4x8 raised bed 12 inches deep?
- How much soil for two raised beds?

需求本质：

用户已经知道床的尺寸，但无法稳定完成体积换算和袋数换算。

工具必须解决：

- 长 × 宽 × 深的体积计算
- ft、in、cm、m、liters 的单位换算
- 多个相同高床的总量
- 是否填满到顶部
- 是否预留 1 inch freeboard
- 是否加入 10% 或 15% settling allowance

### 4.2 要买几袋土

用户不会只满足于 cubic feet。真实购买时看到的是：

- 40 qt bag
- 1 cu ft bag
- 1.5 cu ft bag
- 2 cu ft bag
- 3 cu ft bag
- 40 lb bag
- 50 L bag
- 85 L bag

工具必须把体积换成 bags needed，并向上取整。

还要输出：

- total bags
- total cost
- leftover volume
- warnings for weight-based bags
- custom bag size

### 4.3 袋装 vs 散装哪个划算

当需求超过几十 cubic feet 时，用户会考虑 bulk soil delivery。

工具必须支持：

- bag price
- bag volume
- bulk price per cubic yard
- delivery fee
- minimum order
- pickup or delivery
- truck availability
- overbuy warning
- break-even comparison

输出应告诉用户：

- bagged soil total cost
- bulk soil total cost
- bulk minimum order adjusted cost
- cost per cubic foot
- cost per cubic yard
- whether bulk is cheaper
- how much extra soil bulk order leaves

### 4.4 土壤怎么配

用户常见困惑：

- topsoil + compost 可以吗？
- raised bed mix 和 potting mix 有什么区别？
- Mel’s Mix 要多少 peat moss、compost、vermiculite？
- 能不能为了便宜多用 topsoil？
- 高床在 concrete 上，能不能加普通 topsoil？

工具应做“配比计算”，不是做绝对建议。

第一版建议内置配方：

1. Basic raised bed mix  
   60% topsoil / 30% compost / 10% potting mix

2. Compost + soilless mix  
   50% compost / 50% soilless mix

3. Mel’s Mix style  
   1/3 compost / 1/3 peat or coco coir / 1/3 vermiculite or perlite

4. Budget fill  
   lower fill + upper 8–12 inches growing mix

5. Custom mix  
   用户自行设定比例，比例总和必须为 100%

### 4.5 土会不会下沉

有机质分解、浇水压实、材料沉降会导致高床第一年或每年下降。

工具必须支持：

- 初始填充时加入 settling allowance
- 默认 10%
- 可选 15%
- 自定义百分比
- 年度补土模式：补 1 inch、2 inches、3 inches 或自定义

年度补土计算器是重要复用入口。

### 4.6 深度够不够

用户会问：

- 6 inch raised bed enough for lettuce?
- 8 inch raised bed enough for cucumbers?
- 12 inch raised bed enough for tomatoes?
- How deep should raised bed be for carrots?

工具应输出“深度适配提示”，而不是承诺产量。

示例输出：

- Good for shallow greens and herbs
- Usually workable for beans and cucumbers
- Better deeper for tomatoes, peppers, squash
- Not ideal for long carrots unless using short varieties

### 4.7 4x8 高床能种多少植物

4x8 是最高价值尺寸之一。用户常问：

- how many tomato plants in a 4x8 raised bed
- how many pepper plants in 4x8 raised bed
- 4x8 raised bed planting layout
- square foot garden spacing

工具应做：

- 4x8 默认 32 个 1 sq ft 格子
- 作物选择
- 每平方英尺株数
- 总株数
- spacing warning
- printable grid

### 4.8 容器和 grow bag 土量

同一批用户也会使用：

- 5 gallon bucket
- 10 gallon grow bag
- 20 gallon grow bag
- 40 gallon container
- 6 inch pot
- round planter
- rectangular planter
- tapered pot

工具必须支持：

- grow bag gallon to soil volume
- round pot volume
- rectangular planter volume
- multiple pots
- liters / gallons / quarts / cubic feet conversion

---

## 5. 产品范围

### 5.1 第一版必须做

第一版只做可上线、可索引、可验证搜索和交互的数据闭环。

P0 功能：

1. Raised Bed Soil Calculator
2. 4x8 Raised Bed Calculator
3. Soil Bag Calculator
4. Bulk vs Bags Cost Calculator
5. Soil Mix Calculator
6. Container / Grow Bag Soil Calculator
7. Basic Square Foot Spacing Grid
8. Copy / Print / Download Result
9. FAQ
10. Disclaimer

### 5.2 第一版禁止做

1. AI plant diagnosis
2. pest / disease diagnosis
3. companion planting full database
4. weather-based planting calendar
5. USDA zone personalized calendar
6. account system
7. save garden projects
8. cloud sync
9. image upload
10. soil test interpretation
11. fertilizer prescription
12. 3D garden layout
13. marketplace
14. local delivery quote aggregation

### 5.3 第二阶段可做

P1 功能：

1. Annual Top-Off Calculator
2. Crop Depth Suitability Checker
3. More crop spacing presets
4. Printable shopping list
5. Raised bed cost estimator
6. Multiple bed planner
7. Round raised bed calculator
8. U-shaped and L-shaped bed approximation
9. Local unit presets: US / metric
10. Seasonal checklist pages

---

## 6. 信息架构

### 6.1 首页

URL：/

首页目标：

1. 让用户立即计算
2. 承接 raised bed soil calculator 主词
3. 分发到长尾工具页
4. 建立工具矩阵认知
5. 放置适度 AdSense 和 affiliate

首页结构：

1. H1：Raised Bed Soil Calculator
2. Subtitle：Calculate soil volume, bags, bulk cost, compost mix, and planting space.
3. Calculator Tabs：
   - Raised Bed
   - Soil Bags
   - Bulk vs Bags
   - Soil Mix
   - Containers
   - Plant Spacing
4. 4x8 Quick Presets：
   - 4x8×6 in
   - 4x8×8 in
   - 4x8×10 in
   - 4x8×12 in
   - 4x8×18 in
   - 4x8×24 in
5. Result Card
6. Shopping List
7. Soil Mix Breakdown
8. Cost Comparison
9. Popular Calculators
10. Common Raised Bed Sizes Table
11. FAQ
12. Disclaimer

### 6.2 核心工具页

第一批核心 URL：

1. /raised-bed-soil-calculator
2. /4x8-raised-bed-soil-calculator
3. /soil-bags-calculator
4. /bulk-soil-vs-bags-calculator
5. /raised-bed-soil-mix-calculator
6. /container-soil-calculator
7. /grow-bag-soil-calculator
8. /square-foot-garden-spacing-calculator
9. /raised-bed-depth-calculator
10. /annual-raised-bed-top-off-calculator

### 6.3 长尾尺寸页

1. /4x4-raised-bed-soil-calculator
2. /4x6-raised-bed-soil-calculator
3. /4x8-raised-bed-soil-calculator
4. /3x6-raised-bed-soil-calculator
5. /2x8-raised-bed-soil-calculator
6. /8x4-raised-bed-soil-calculator

### 6.4 袋规格页

1. /40-qt-soil-bag-calculator
2. /1-cubic-foot-soil-bag-calculator
3. /1-5-cubic-foot-soil-bag-calculator
4. /2-cubic-foot-soil-bag-calculator
5. /cubic-feet-to-soil-bags-calculator
6. /liters-to-soil-bags-calculator

### 6.5 作物空间页

1. /tomato-spacing-raised-bed
2. /pepper-spacing-raised-bed
3. /lettuce-spacing-square-foot-garden
4. /carrot-spacing-square-foot-garden
5. /cucumber-spacing-raised-bed
6. /basil-spacing-square-foot-garden

---

## 7. 核心计算逻辑

### 7.1 Raised Bed Volume

输入：

- length
- width
- depth
- unit
- numberOfBeds
- freeboard
- settlingAllowance

基础公式：

```text
lengthFt = convertLengthToFeet(length, lengthUnit)
widthFt = convertLengthToFeet(width, widthUnit)
depthFt = convertLengthToFeet(depth, depthUnit)

effectiveDepthFt = max(depthFt - freeboardFt, 0)

baseVolumeFt3 = lengthFt * widthFt * effectiveDepthFt * numberOfBeds

finalVolumeFt3 = baseVolumeFt3 * (1 + settlingAllowance)
```

输出换算：

```text
volumeYd3 = finalVolumeFt3 / 27
volumeLiters = finalVolumeFt3 * 28.316846592
volumeDryQuarts = finalVolumeFt3 * 25.71404638
volumeGallons = finalVolumeFt3 * 7.48051948
```

### 7.2 Soil Bag Count

输入：

- totalVolumeFt3
- bagSize
- bagUnit
- bagPrice
- wasteBuffer

换算：

```text
bagVolumeFt3 = convertVolumeToFt3(bagSize, bagUnit)
rawBags = totalVolumeFt3 / bagVolumeFt3
bagsNeeded = ceil(rawBags)
leftoverFt3 = bagsNeeded * bagVolumeFt3 - totalVolumeFt3
totalCost = bagsNeeded * bagPrice
```

重量单位处理：

如果用户输入 bagUnit = lb 或 kg：

- 显示警告：weight-based bags are only rough estimates because soil density varies by moisture and material.
- 要求用户选择 soil density preset：
  - light potting mix
  - raised bed mix
  - compost
  - topsoil
- 第一版可以不启用 pounds 精确换算，只提示用户查看包装体积。

### 7.3 Bulk vs Bags

输入：

- requiredVolumeFt3
- bagVolumeFt3
- bagPrice
- bulkPricePerYd3
- deliveryFee
- minimumOrderYd3
- pickupFee 可选

公式：

```text
bagCount = ceil(requiredVolumeFt3 / bagVolumeFt3)
bagTotal = bagCount * bagPrice

requiredYd3 = requiredVolumeFt3 / 27
bulkOrderYd3 = max(requiredYd3, minimumOrderYd3)
bulkTotal = bulkOrderYd3 * bulkPricePerYd3 + deliveryFee

bagCostPerFt3 = bagPrice / bagVolumeFt3
bulkCostPerFt3 = bulkTotal / (bulkOrderYd3 * 27)

savings = bagTotal - bulkTotal
overbuyFt3 = bulkOrderYd3 * 27 - requiredVolumeFt3
```

输出判断：

```text
if bulkTotal < bagTotal:
  recommendation = "Bulk soil may be cheaper for this volume."
else:
  recommendation = "Bagged soil may be cheaper or more practical for this volume."
```

### 7.4 Soil Mix Breakdown

输入：

- totalVolumeFt3
- mixTemplate
- customRatios

校验：

```text
sum(ratios) must equal 100
all ratios >= 0
```

计算：

```text
componentVolumeFt3 = totalVolumeFt3 * ratio / 100
componentVolumeYd3 = componentVolumeFt3 / 27
componentLiters = componentVolumeFt3 * 28.316846592
```

可选：每种材料可输入袋规格和价格。

输出：

- topsoil volume
- compost volume
- potting mix volume
- perlite / vermiculite / coco coir volume
- bags needed per component
- total cost per component
- total mix cost

### 7.5 Container / Grow Bag

#### Grow Bag

```text
volumeFt3 = gallons * 0.133680556 * quantity
```

#### Round Pot / Cylinder

```text
radius = diameter / 2
volume = π * radius² * height
```

单位必须先转成 feet。

#### Tapered Pot / Frustum

```text
volume = (π * height / 3) * (R1² + R1*R2 + R2²)
```

R1 为顶部半径，R2 为底部半径。

#### Rectangular Planter

```text
volume = length * width * depth
```

### 7.6 Annual Top-Off

输入：

- length
- width
- soilDrop
- numberOfBeds
- bagSize

公式：

```text
topOffVolumeFt3 = lengthFt * widthFt * dropFt * numberOfBeds
```

输出：

- needed cu ft
- bags needed
- compost amount
- optional mulch amount

### 7.7 Square Foot Spacing

输入：

- bedLength
- bedWidth
- crop
- spacingMode
- plantPerSquare

计算：

```text
totalSquares = floor(lengthFt) * floor(widthFt)
totalPlants = totalSquares * plantsPerSquare
```

常见 plants per square foot：

| 作物 | 每平方英尺株数 | 备注 |
|---|---:|---|
| Tomato | 1 | 大型番茄应给更多空间，建议 trellis |
| Pepper | 1 | 可密植但不建议过度拥挤 |
| Cucumber | 1–2 | 建议 trellis |
| Lettuce | 2–4 | 视品种而定 |
| Spinach | 9 | 常见 square foot 指南 |
| Carrot | 9–16 | 视品种而定 |
| Radish | 16 | 短周期作物 |
| Basil | 1–4 | 视采收方式而定 |
| Beans | 4–9 | 视 bush/pole 类型 |
| Kale | 1 | 大叶菜需空间 |

第一版不要把这些写成绝对标准，应标注 “general spacing estimate”。

---

## 8. 数据结构设计

### 8.1 Calculator State

```ts
type UnitLength = 'in' | 'ft' | 'cm' | 'm'
type UnitVolume = 'ft3' | 'yd3' | 'liter' | 'dryQuart' | 'gallon'
type BagUnit = 'ft3' | 'dryQuart' | 'liter' | 'gallon' | 'lb' | 'kg'

interface RaisedBedInput {
  shape: 'rectangle' | 'square' | 'round'
  length: number
  width: number
  depth: number
  lengthUnit: UnitLength
  widthUnit: UnitLength
  depthUnit: UnitLength
  numberOfBeds: number
  freeboard: number
  freeboardUnit: UnitLength
  settlingAllowancePercent: number
}

interface SoilBagInput {
  bagSize: number
  bagUnit: BagUnit
  bagPrice?: number
}

interface BulkSoilInput {
  bulkPricePerYard: number
  deliveryFee: number
  minimumOrderYards: number
}

interface SoilMixComponent {
  name: string
  ratioPercent: number
  bagSize?: number
  bagUnit?: BagUnit
  bagPrice?: number
}

interface SoilMixInput {
  templateId: string
  components: SoilMixComponent[]
}

interface CalculationResult {
  baseVolumeFt3: number
  finalVolumeFt3: number
  volumeYd3: number
  volumeLiters: number
  volumeDryQuarts: number
  bagsNeeded?: number
  totalCost?: number
  leftoverFt3?: number
  mixBreakdown?: SoilMixResult[]
  warnings: string[]
}
```

### 8.2 Crop Spacing Data

```ts
interface CropSpacing {
  id: string
  name: string
  plantsPerSquareFoot: number | [number, number]
  minDepthInches?: number
  idealDepthInches?: [number, number]
  notes: string
  warning?: string
}

const CROPS: CropSpacing[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    plantsPerSquareFoot: 1,
    minDepthInches: 12,
    idealDepthInches: [12, 24],
    notes: 'Use a cage or trellis. Large indeterminate tomatoes may need more space.',
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    plantsPerSquareFoot: [2, 4],
    minDepthInches: 6,
    idealDepthInches: [6, 8],
    notes: 'Spacing depends on whether you harvest baby leaves or full heads.',
  }
]
```

### 8.3 Presets

```ts
interface RaisedBedPreset {
  id: string
  label: string
  lengthFt: number
  widthFt: number
  depthIn: number
}

const RAISED_BED_PRESETS: RaisedBedPreset[] = [
  { id: '4x8x6', label: '4×8 bed, 6 in deep', lengthFt: 4, widthFt: 8, depthIn: 6 },
  { id: '4x8x8', label: '4×8 bed, 8 in deep', lengthFt: 4, widthFt: 8, depthIn: 8 },
  { id: '4x8x10', label: '4×8 bed, 10 in deep', lengthFt: 4, widthFt: 8, depthIn: 10 },
  { id: '4x8x12', label: '4×8 bed, 12 in deep', lengthFt: 4, widthFt: 8, depthIn: 12 },
  { id: '4x8x18', label: '4×8 bed, 18 in deep', lengthFt: 4, widthFt: 8, depthIn: 18 },
  { id: '4x8x24', label: '4×8 bed, 24 in deep', lengthFt: 4, widthFt: 8, depthIn: 24 }
]
```

---

## 9. UX 需求

### 9.1 首屏

首屏必须直接出现计算器，不要先放长篇文章。

首屏元素：

1. H1
2. 一句话说明
3. 尺寸输入
4. 4x8 preset
5. Calculate 按钮
6. 即时结果摘要

### 9.2 输入体验

必须降低单位错误：

1. 默认美国用户：length / width 用 ft，depth 用 inches。
2. 单位切换后保持数值逻辑清晰。
3. 如果 depth 输入 12 ft，提示用户是否想输入 12 in。
4. 如果 length 小于 width 不报错，因为 4x8 和 8x4 都有效。
5. numberOfBeds 默认 1。
6. settling 默认 10%，可关闭。
7. bag size 提供常用选项，不强迫用户手输。

### 9.3 结果体验

结果区不能只给一个数字。

必须分成：

1. Soil volume
2. Bags needed
3. With settling allowance
4. Bulk order estimate
5. Mix breakdown
6. Cost estimate
7. Shopping list
8. Warnings
9. Copy result
10. Print result

### 9.4 移动端

移动端是主要场景之一。用户可能在 Lowe’s、Home Depot、garden center、车库、后院现场使用。

要求：

1. 输入区单列布局
2. 结果卡片 sticky 不强制，避免遮挡
3. Copy shopping list 按钮明显
4. 字体不小于 16px
5. 数字输入使用 numeric keyboard
6. 广告不能插在输入框中间
7. 计算按钮必须明显

### 9.5 错误提示

常见错误：

| 错误 | 提示 |
|---|---|
| 长宽深为空 | Enter a length, width, and depth to calculate soil volume. |
| 深度为 0 | Soil depth must be greater than zero. |
| 比例不等于 100% | Soil mix percentages must add up to 100%. |
| 袋规格为 0 | Bag size must be greater than zero. |
| pounds 输入 | Weight-based soil bags are only rough estimates because soil density varies. |
| bulk minimum too high | Your bulk minimum order is much larger than your required volume. |

---

## 10. 页面内容要求

### 10.1 每个工具页的基本结构

每个工具页必须包含：

1. H1
2. 一句话工具说明
3. Calculator
4. Result
5. How to use
6. Formula
7. Example calculation
8. Common sizes / presets
9. Practical notes
10. FAQ
11. Disclaimer
12. Internal links

### 10.2 FAQ 示例

#### Raised Bed Soil Calculator FAQ

1. How much soil do I need for a 4x8 raised bed?
2. How many bags of soil do I need for a raised bed?
3. Should I add extra soil for settling?
4. What is the difference between cubic feet and cubic yards?
5. Is 40 lb of soil the same as 40 quarts?
6. How deep should a raised bed be?
7. Can I fill a raised bed with only topsoil?
8. Should I buy bagged soil or bulk soil?
9. How much compost should I add to a raised bed?
10. Can I use this calculator for raised beds on concrete?

#### Container Soil Calculator FAQ

1. How much soil does a 10 gallon grow bag need?
2. How much potting soil for a 20 gallon container?
3. How many liters are in a cubic foot of soil?
4. How many quarts are in a cubic foot of soil?
5. How do I calculate soil for a round pot?
6. Why do grow bags not always take their full listed gallon amount?

#### Square Foot Garden FAQ

1. How many tomato plants fit in a 4x8 raised bed?
2. How many pepper plants fit in a 4x8 raised bed?
3. What does plants per square foot mean?
4. Should I use row spacing or square foot spacing?
5. Can I plant tomatoes and lettuce in the same 4x8 bed?
6. How much space should I leave for trellised crops?

---

## 11. SEO 需求

### 11.1 SEO 原则

1. 不使用 meta keywords。
2. 每页必须有唯一 title、description、canonical。
3. 工具页以真实任务词为主，不做泛泛 gardening content。
4. 长尾页必须有真实计算器或预设结果，不能只是换标题的薄页面。
5. FAQ 只写用户真实问题。
6. 页面必须可索引、可渲染、核心内容不依赖登录。
7. 公式和结果示例应写在 HTML 中，利于抓取。
8. 同类页面要避免重复内容过高。
9. 内链要围绕工具链路，不要随意堆链接。

### 11.2 第一批 45 个关键词 / 页面

| 分组 | URL | 目标关键词 | 页面意图 | 工具模块 |
|---|---|---|---|---|
| 高床体积 | /raised-bed-soil-calculator | raised bed soil calculator | 算高床土量 | Raised Bed Calculator |
| 高床体积 | /4x8-raised-bed-soil-calculator | 4x8 raised bed soil calculator | 算 4x8 高床土量 | 4x8 Preset |
| 高床体积 | /how-much-soil-for-4x8-raised-bed | how much soil for 4x8 raised bed | 解答 4x8 常见深度 | 4x8 Table |
| 高床体积 | /how-many-bags-of-soil-for-raised-bed | how many bags of soil for raised bed | 换算袋数 | Bag Calculator |
| 高床体积 | /4x8-raised-bed-12-inches-soil | 4x8 raised bed 12 inches soil | 指定深度页 | Preset Result |
| 高床体积 | /4x8-raised-bed-10-inches-soil | 4x8 raised bed 10 inches soil | 指定深度页 | Preset Result |
| 高床体积 | /4x4-raised-bed-soil-calculator | 4x4 raised bed soil calculator | 小高床土量 | Preset |
| 高床体积 | /3x6-raised-bed-soil-calculator | 3x6 raised bed soil calculator | 常见尺寸土量 | Preset |
| 高床体积 | /2x8-raised-bed-soil-calculator | 2x8 raised bed soil calculator | 窄床土量 | Preset |
| 高床体积 | /raised-bed-cubic-feet-calculator | raised bed cubic feet calculator | 体积换算 | Volume |
| 袋装土 | /soil-bags-calculator | soil bags calculator | 总体积换袋数 | Bag |
| 袋装土 | /40-qt-soil-bag-calculator | 40 qt soil bag calculator | 40 qt 换算 | Bag |
| 袋装土 | /1-5-cubic-foot-soil-bag-calculator | 1.5 cu ft soil bag calculator | 1.5 cu ft 袋数 | Bag |
| 袋装土 | /2-cubic-foot-soil-bag-calculator | 2 cu ft soil bag calculator | 2 cu ft 袋数 | Bag |
| 袋装土 | /cubic-feet-to-soil-bags-calculator | cubic feet to soil bags calculator | 体积转袋数 | Bag |
| 袋装土 | /cubic-yards-to-soil-bags-calculator | cubic yards to soil bags calculator | yd³ 转袋数 | Bag |
| 袋装土 | /liters-to-cubic-feet-soil-calculator | liters to cubic feet soil calculator | 公制换算 | Conversion |
| 袋装土 | /how-many-40-lb-bags-of-soil-do-i-need | how many 40 lb bags of soil do I need | 重量警告 | Bag Warning |
| 成本 | /bulk-soil-vs-bags-calculator | bulk soil vs bagged soil calculator | 成本比较 | Cost |
| 成本 | /raised-bed-soil-cost-calculator | raised bed soil cost calculator | 预算 | Cost |
| 成本 | /cheapest-way-to-fill-raised-beds | cheapest way to fill raised beds | 省钱方案 | Mix + Cost |
| 成本 | /how-much-bulk-soil-for-raised-beds | how much bulk soil for raised beds | 散装土 | Bulk |
| 成本 | /cubic-yards-of-soil-for-raised-beds | cubic yards of soil for raised beds | bulk 单位 | Bulk |
| 配土 | /raised-bed-soil-mix-calculator | raised bed soil mix calculator | 配比计算 | Mix |
| 配土 | /compost-topsoil-mix-calculator | compost topsoil mix calculator | compost/topsoil 比例 | Mix |
| 配土 | /mels-mix-calculator | Mel’s Mix calculator | SFG 配方 | Mix |
| 配土 | /how-much-compost-for-raised-bed | how much compost for raised bed | compost 数量 | Mix |
| 配土 | /topsoil-compost-ratio-raised-bed | topsoil compost ratio raised bed | 配比解释 | Mix |
| 容器 | /container-soil-calculator | container soil calculator | 容器土量 | Container |
| 容器 | /planter-soil-volume-calculator | planter soil volume calculator | 花盆土量 | Container |
| 容器 | /grow-bag-soil-calculator | grow bag soil calculator | grow bag 土量 | Grow Bag |
| 容器 | /10-gallon-grow-bag-soil-calculator | 10 gallon grow bag soil calculator | 指定容器 | Grow Bag |
| 容器 | /20-gallon-grow-bag-soil-calculator | 20 gallon grow bag soil calculator | 指定容器 | Grow Bag |
| 容器 | /5-gallon-bucket-soil-calculator | 5 gallon bucket soil calculator | 桶种植 | Container |
| 容器 | /how-much-soil-for-45-six-inch-pots | how much soil for 45 six inch pots | 多盆场景 | Container |
| 种植空间 | /square-foot-garden-spacing-calculator | square foot garden spacing calculator | SFG 间距 | Grid |
| 种植空间 | /4x8-raised-bed-planting-layout | 4x8 raised bed planting layout | 4x8 布局 | Grid |
| 种植空间 | /how-many-tomato-plants-in-4x8-raised-bed | how many tomato plants in 4x8 raised bed | 番茄数量 | Crop |
| 种植空间 | /tomato-spacing-raised-bed | tomato spacing raised bed | 番茄间距 | Crop |
| 种植空间 | /pepper-spacing-raised-bed | pepper spacing raised bed | 辣椒间距 | Crop |
| 种植空间 | /carrot-spacing-square-foot-garden | carrot spacing square foot garden | 胡萝卜密度 | Crop |
| 种植空间 | /lettuce-spacing-square-foot-garden | lettuce spacing square foot garden | 生菜密度 | Crop |
| 种植空间 | /cucumber-spacing-raised-bed | cucumber spacing raised bed | 黄瓜间距 | Crop |
| 深度 | /raised-bed-depth-for-tomatoes | raised bed depth for tomatoes | 番茄深度 | Depth |
| 深度 | /raised-bed-depth-for-carrots | raised bed depth for carrots | 胡萝卜深度 | Depth |

---

## 12. AdSense 与 Affiliate 策略

### 12.1 AdSense 放置

适合位置：

1. 结果区下方
2. FAQ 中段
3. 桌面端右侧栏
4. 页面底部相关文章前
5. 工具说明与示例计算之间

不适合位置：

1. 输入框之间
2. Calculate 按钮旁边
3. 结果数字和 copy 按钮之间
4. 移动端首屏遮挡工具
5. grid 图中间
6. shopping list 内部

### 12.2 Affiliate 承接

可承接产品：

1. Raised bed kits
2. Bagged raised bed soil
3. Compost
4. Potting mix
5. Topsoil
6. Worm castings
7. Coco coir
8. Peat moss
9. Perlite
10. Vermiculite
11. Grow bags
12. Planters
13. Seeds
14. Trellis
15. Drip irrigation kits
16. Garden tools
17. Soil moisture meters
18. pH meters
19. Plant labels
20. Mulch

Affiliate 放置原则：

1. 只在结果后推荐。
2. 不要影响计算。
3. 推荐必须和计算结果上下文相关。
4. 不要伪装成计算结果。
5. 标注 affiliate disclosure。
6. 早期可只放占位，不强行接入过多商家。

---

## 13. 技术架构建议

### 13.1 技术栈

推荐：

- Next.js App Router
- TypeScript
- Tailwind CSS
- 静态生成为主
- 客户端计算
- 不需要数据库
- 不需要登录
- 不需要云端保存

### 13.2 核心目录建议

```text
src/
  app/
    page.tsx
    raised-bed-soil-calculator/page.tsx
    4x8-raised-bed-soil-calculator/page.tsx
    soil-bags-calculator/page.tsx
    bulk-soil-vs-bags-calculator/page.tsx
    raised-bed-soil-mix-calculator/page.tsx
    container-soil-calculator/page.tsx
    square-foot-garden-spacing-calculator/page.tsx
    about/page.tsx
    privacy/page.tsx
    terms/page.tsx
    disclaimer/page.tsx
    sitemap.ts
    robots.ts
  components/
    calculators/
      RaisedBedCalculator.tsx
      SoilBagCalculator.tsx
      BulkVsBagsCalculator.tsx
      SoilMixCalculator.tsx
      ContainerSoilCalculator.tsx
      SquareFootGrid.tsx
    ui/
      ResultCard.tsx
      UnitSelect.tsx
      PresetButtons.tsx
      CopyButton.tsx
      PrintButton.tsx
      WarningBox.tsx
  lib/
    calculators/
      volume.ts
      units.ts
      bags.ts
      bulkCost.ts
      soilMix.ts
      container.ts
      spacing.ts
    data/
      presets.ts
      crops.ts
      soilMixTemplates.ts
    seo/
      metadata.ts
```

### 13.3 计算原则

1. 所有核心计算函数必须是纯函数。
2. 所有单位换算集中在 lib/calculators/units.ts。
3. UI 不直接写复杂计算。
4. 每个计算器都要有测试用例。
5. 输出统一保留 1–2 位小数。
6. 袋数必须向上取整。
7. 对 pounds/kg 输入必须给出警告。
8. 所有免责声明出现在 footer、结果区注释、disclaimer 页面。

---

## 14. 测试用例

### 14.1 Raised Bed Volume

测试 1：

```text
Input:
length = 4 ft
width = 8 ft
depth = 12 in
beds = 1
settling = 0%

Expected:
volume = 32 ft³
volume = 1.19 yd³
```

测试 2：

```text
Input:
length = 4 ft
width = 8 ft
depth = 12 in
beds = 2
settling = 10%

Expected:
base = 64 ft³
final = 70.4 ft³
yd³ = 2.61 yd³
```

测试 3：

```text
Input:
length = 4 ft
width = 8 ft
depth = 6 in
beds = 1

Expected:
volume = 16 ft³
```

### 14.2 Soil Bags

测试 1：

```text
Input:
required = 32 ft³
bag = 2 ft³

Expected:
bags = 16
leftover = 0
```

测试 2：

```text
Input:
required = 32 ft³
bag = 1.5 ft³

Expected:
bags = 22
leftover = 1 ft³
```

测试 3：

```text
Input:
required = 32 ft³
bag = 40 dry quarts

Expected:
40 dry quarts ≈ 1.56 ft³
bags = 21
```

### 14.3 Bulk vs Bags

测试：

```text
Input:
required = 70.4 ft³
bag = 2 ft³
bagPrice = 8
bulkPricePerYard = 60
deliveryFee = 50
minimumOrder = 2 yd³

Expected:
bagCount = 36
bagTotal = 288
requiredYd3 = 2.61
bulkOrderYd3 = 2.61
bulkTotal = 206.6
bulk cheaper
```

### 14.4 Soil Mix

测试：

```text
Input:
total = 32 ft³
mix = 60/30/10

Expected:
topsoil = 19.2 ft³
compost = 9.6 ft³
potting mix = 3.2 ft³
```

### 14.5 Container

测试：

```text
Input:
10 gallon grow bag
quantity = 4

Expected:
total = 40 gallons
ft³ = 5.35
liters = 151.4
```

### 14.6 Annual Top-Off

测试：

```text
Input:
4 ft x 8 ft bed
drop = 2 in
beds = 1

Expected:
topOff = 5.33 ft³
```

### 14.7 Square Foot Grid

测试：

```text
Input:
4x8 bed
crop = tomato
plantsPerSquareFoot = 1

Expected:
totalSquares = 32
max theoretical plants = 32
warning = large tomatoes may need more space
```

---

## 15. 边界条件与免责声明

### 15.1 结果边界

工具输出必须说明：

1. Results are planning estimates.
2. Actual soil volume may vary due to settling, moisture, compaction, bag fill, and material density.
3. Weight-based soil bags are not reliable for exact volume conversion.
4. Soil mix recommendations are general and may not suit every climate, crop, or drainage condition.
5. For serious soil problems, use a local soil test or extension service.
6. This tool does not replace professional horticultural or agricultural advice.

### 15.2 不得承诺

不要写：

- exact amount guaranteed
- perfect soil mix
- best soil for all vegetables
- guaranteed yield
- disease prevention
- fertilizer prescription
- professional soil analysis

推荐写：

- estimate
- planning guide
- general guidance
- starting point
- check your local conditions
- adjust based on drainage and crop needs

---

## 16. 合规页面

必须有：

1. /about
2. /privacy
3. /terms
4. /disclaimer
5. /affiliate-disclosure 可选，如果 affiliate 很明显则建议做

Privacy 要点：

1. 不上传文件
2. 不保存用户输入
3. 计算在浏览器本地完成
4. 可能使用 analytics
5. 可能展示广告
6. 可能包含 affiliate links

Disclaimer 要点：

1. 结果为估算
2. 不构成专业农业建议
3. 不保证植物生长结果
4. 用户应结合本地土壤、气候和材料判断

---

## 17. 开发阶段计划

### 阶段 1：MVP 核心计算

目标：先让一个完整工具链可用。

完成内容：

1. 项目初始化
2. 通用单位换算
3. Raised Bed Calculator
4. Soil Bag Calculator
5. Soil Mix Calculator
6. Result Card
7. Copy / Print
8. FAQ
9. 合规页面
10. sitemap / robots

验收标准：

1. 4x8×12 in 计算为 32 ft³。
2. 2 个 4x8×12 in 加 10% settling 为 70.4 ft³。
3. 32 ft³ 用 2 ft³ 袋为 16 袋。
4. 32 ft³ 用 1.5 ft³ 袋为 22 袋。
5. 60/30/10 配比正确输出。
6. 移动端可正常输入和复制结果。
7. 页面无 meta keywords。

### 阶段 2：成本与容器

完成内容：

1. Bulk vs Bags Calculator
2. Container Soil Calculator
3. Grow Bag Calculator
4. 常见容器页
5. 成本 FAQ
6. affiliate 占位区

验收标准：

1. bulk 和 bags 成本比较逻辑正确。
2. minimum order 可正确影响 bulk 总价。
3. grow bag gallon 换算正确。
4. round pot / rectangular planter 公式正确。
5. 对重量单位显示警告。

### 阶段 3：种植空间与长尾页

完成内容：

1. Square Foot Grid
2. Crop spacing data
3. 4x8 planting layout
4. tomato / pepper / lettuce / carrot 页面
5. depth suitability checker
6. 30–45 个长尾页

验收标准：

1. 4x8 显示 32 squares。
2. 作物选择后显示总株数。
3. 番茄、黄瓜等显示 spacing warning。
4. 长尾页不是薄页面，每页有工具或预设结果。
5. 内链完整。

### 阶段 4：AdSense / Affiliate 准备

完成内容：

1. AdSense script
2. ads.txt
3. affiliate disclosure
4. 广告位预留
5. FAQ 优化
6. 结构化数据
7. 站点最终审计

验收标准：

1. 广告不遮挡核心工具。
2. footer 合规链接完整。
3. sitemap 包含所有页面。
4. robots 允许索引。
5. canonical 正确。
6. 无空页面、无占位文本、无薄页。

---

## 18. AdSense 过审注意事项

1. 首页必须有实际可用工具，不要只有内容。
2. 工具结果必须稳定输出，不要出现空白结果。
3. 页面需要有足够原创解释、FAQ、公式、示例。
4. 不要堆 AI 泛文。
5. 不要使用 meta keywords。
6. footer 要有 About、Privacy、Terms、Disclaimer。
7. 广告代码上线前后都不能破坏工具体验。
8. 不要在首屏塞过多 affiliate。
9. 不要出现“建设中”“coming soon”的核心页面。
10. 不要生成大量低质量尺寸页；每个长尾页必须有对应预设或计算价值。

---

## 19. 90 天验证指标

### 19.1 SEO 指标

| 指标 | 目标 |
|---|---:|
| 已索引页面 | 30+ |
| GSC 总曝光 | 90 天累计 5,000+ |
| 核心工具页日曝光 | 90 天后 100+/day |
| 长尾页有曝光页面比例 | 50%+ |
| 核心关键词进入前 50 | 至少 5 个 |
| 核心关键词进入前 20 | 至少 1–2 个 |

### 19.2 交互指标

| 指标 | 目标 |
|---|---:|
| Calculator interaction rate | 20%+ |
| Calculate button click rate | 15%+ |
| Copy result click rate | 3%+ |
| Print result click rate | 1%+ |
| 多 tab 使用率 | 5%+ |
| 平均停留时间 | 60 秒以上 |

### 19.3 商业指标

| 指标 | 目标 |
|---|---:|
| AdSense RPM | 上线后观察，不设早期硬目标 |
| Affiliate click rate | 1%+ |
| 结果区 affiliate CTR | 2%+ |
| 高床 / 土壤相关链接点击 | 有稳定点击 |
| 邮件或反馈 | 有真实用户反馈 |

### 19.4 维护成本指标

| 指标 | 警戒线 |
|---|---:|
| 计算错误反馈 | 每周 > 5 个需排查 |
| 内容维护 | 每周 > 5 小时 |
| 作物数据库争议 | 频繁出现 |
| SERP 无曝光 | 90 天后仍无增长 |
| 用户只看答案不使用工具 | 交互低于 5% |

### 19.5 止损条件

满足以下任意多个条件，应暂停扩页：

1. 30–45 页上线 90 天后，GSC 日曝光仍低于 200。
2. 核心计算器点击率低于 5%。
3. 大量用户只看 4x8 表格，不使用工具。
4. affiliate 点击长期接近 0。
5. 维护配方和作物建议的成本超过收益。
6. 前排被电商、强内容站、官方工具完全压制，长尾也无突破。

---

## 20. 最终 MVP 验收清单

### 产品

- [ ] 首页有可用 calculator
- [ ] 支持 raised bed 体积计算
- [ ] 支持 4x8 快速预设
- [ ] 支持袋装土换算
- [ ] 支持 10% / 15% settling allowance
- [ ] 支持 soil mix breakdown
- [ ] 支持 bulk vs bags 成本比较
- [ ] 支持 container / grow bag
- [ ] 支持 basic square foot grid
- [ ] 支持 copy result
- [ ] 支持 print result

### 技术

- [ ] TypeScript 无类型错误
- [ ] 单位换算有测试
- [ ] 核心公式有测试
- [ ] 移动端输入正常
- [ ] 无 hydration error
- [ ] 无控制台严重错误
- [ ] sitemap 正常
- [ ] robots 正常
- [ ] canonical 正常
- [ ] 页面可索引

### 内容

- [ ] 每页有 H1
- [ ] 每页 title 唯一
- [ ] 每页 description 唯一
- [ ] 每页有公式
- [ ] 每页有 example calculation
- [ ] 每页有 FAQ
- [ ] 每页有 disclaimer
- [ ] 没有 meta keywords
- [ ] 没有薄页面
- [ ] 没有 coming soon

### 合规

- [ ] About
- [ ] Privacy
- [ ] Terms
- [ ] Disclaimer
- [ ] Affiliate disclosure
- [ ] 不保存用户输入
- [ ] 不要求登录
- [ ] 不上传文件
- [ ] 不承诺专业农业建议

### 商业

- [ ] 结果区下方广告位
- [ ] FAQ 中段广告位
- [ ] 桌面侧边栏广告位
- [ ] affiliate 占位
- [ ] shopping list 可承接 affiliate
- [ ] 广告不遮挡核心操作

---

## 21. 给开发 AI 的执行提示

可以把以下任务交给开发 AI：

> 根据本需求文档开发一个英文免费工具站 MVP。  
> 只做 raised bed soil、soil bags、bulk vs bags、soil mix、container soil、basic square foot spacing。  
> 不做登录、不做云端保存、不做 AI 诊断、不做复杂 3D layout。  
> 所有计算在前端本地完成。  
> 使用 Next.js App Router + TypeScript + Tailwind。  
> 每个计算函数写成纯函数并添加测试。  
> 页面必须包含工具、公式、示例、FAQ、免责声明、合规链接。  
> 不使用 meta keywords。  
> 广告位只放在结果区下方、FAQ 中段和桌面侧边栏，不得遮挡输入和结果。  
> 第一版至少完成首页、raised bed calculator、4x8 calculator、soil bag calculator、bulk vs bags calculator、soil mix calculator、container calculator、square foot spacing calculator、about、privacy、terms、disclaimer、sitemap、robots。

---

## 22. 项目最终判断

该项目适合作为第二个新开工具站方向。它的优势不在于单个 soil calculator，而在于围绕 raised bed 用户的完整买土和种植空间决策链路。

最小可行产品应聚焦：

1. 需要多少土
2. 要买几袋
3. 袋装还是散装
4. 土壤怎么配
5. 容器怎么算
6. 4x8 能种多少

只要第一版把这六个问题做透，就已经比大量单点 calculator 更接近真实用户需求，也更适合后续扩展长尾页、AdSense、affiliate 和工具矩阵。
