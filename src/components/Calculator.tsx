'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BagUnit,
  CurrencyCode,
  LengthUnit,
  CROPS,
  calculateAnnualTopOff,
  calculateTopOffMaterials,
  calculateGrowBagVolume,
  calculateLShapedRaisedBedVolume,
  calculateMultipleRaisedBedVolume,
  calculateMultipleRectangularContainerVolume,
  calculateRaisedBedVolume,
  calculateRectangularPlanterVolume,
  calculateRoundPotVolume,
  calculateRoundRaisedBedVolume,
  calculateSoilBags,
  calculateSoilMix,
  calculateSquareFootSpacing,
  calculateTaperedPotVolume,
  calculateUShapedRaisedBedVolume,
  checkDepthSuitability,
  compareBulkVsBags,
  currencySymbol,
  estimateRaisedBedProjectCost,
  type SoilMixInput,
  type SoilMixComponent,
  type CalculatorWarning,
} from '@/lib/calculators';
import { BAG_PRESETS, RAISED_BED_PRESETS, SOIL_MIX_TEMPLATES } from '@/lib/data/presets';
import { fmt, plantText } from '@/lib/utils/format';
import { AdSlot } from './AdSlot';

type Tab = 'raised' | 'bags' | 'bulk' | 'mix' | 'containers' | 'spacing' | 'topoff' | 'depth' | 'cost' | 'multi' | 'shapes';
type ContainerMode = 'grow' | 'rect' | 'round' | 'taper';
type ShapeMode = 'round' | 'lShape' | 'uShape';
type UnitPreset = 'us' | 'metric';

function NumberInput({ label, value, setValue, step = 1 }: { label: string; value: number; setValue: (value: number) => void; step?: number }) {
  return (
    <label>
      <span>{label}</span>
      <input type="number" inputMode="decimal" min={0} step={step} value={Number.isFinite(value) ? value : 0} onChange={(event) => setValue(Number(event.target.value))} />
    </label>
  );
}

function SelectInput<T extends string>({ label, value, setValue, options }: { label: string; value: T; setValue: (value: T) => void; options: readonly { label: string; value: T }[] }) {
  return <label><span>{label}</span><select value={value} onChange={(event) => setValue(event.target.value as T)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function warningKey(warning: CalculatorWarning) {
  return `${warning.code}-${warning.message}`;
}

function warningsText(warnings: CalculatorWarning[]) {
  return warnings.map((warning) => `[${warning.severity}] ${warning.message}`).join('\n');
}


function trackCalculatorEvent(name: string, payload: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('bedsoil:calculator-event', { detail: { name, ...payload } }));
  const maybeGtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  maybeGtag?.('event', name, payload);
}

function SquareFootGridPreview({ lengthFt, widthFt, cropLabel }: { lengthFt: number; widthFt: number; cropLabel: string }) {
  const cols = Math.max(1, Math.min(12, Math.floor(lengthFt)));
  const rows = Math.max(1, Math.min(12, Math.floor(widthFt)));
  const total = cols * rows;
  return (
    <div className="layout-preview" aria-label={`${cols} by ${rows} square-foot planting grid`}>
      <div className="layout-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(28px, 1fr))` }}>
        {Array.from({ length: total }, (_, index) => <span key={index}>{index + 1}</span>)}
      </div>
      <p className="muted-card">Printable square-foot layout preview for {cropLabel}. Each cell represents 1 sq ft.</p>
    </div>
  );
}

const lengthUnitOptions = [
  { label: 'ft', value: 'ft' },
  { label: 'in', value: 'in' },
  { label: 'cm', value: 'cm' },
  { label: 'm', value: 'm' },
] as const;

const bagUnitOptions = [
  { label: 'ft³', value: 'ft3' },
  { label: 'dry qt', value: 'dryQuart' },
  { label: 'L', value: 'liter' },
  { label: 'gal', value: 'gallon' },
  { label: 'lb warning', value: 'lb' },
  { label: 'kg warning', value: 'kg' },
] as const;

const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'CAD', value: 'CAD' },
  { label: 'GBP', value: 'GBP' },
  { label: 'AUD', value: 'AUD' },
  { label: 'EUR', value: 'EUR' },
] as const;

export function Calculator({ initial = 'raised', presetSlug }: { initial?: Tab; presetSlug?: string }) {
  const [tab, setTab] = useState<Tab>(initial);
  const [unitPreset, setUnitPreset] = useState<UnitPreset>('us');
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(8);
  const [depth, setDepth] = useState(12);
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('ft');
  const [widthUnit, setWidthUnit] = useState<LengthUnit>('ft');
  const [depthUnit, setDepthUnit] = useState<LengthUnit>('in');
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [freeboard, setFreeboard] = useState(0);
  const [settling, setSettling] = useState(0);
  const [bagSize, setBagSize] = useState(2);
  const [bagUnit, setBagUnit] = useState<BagUnit>('ft3');
  const [bagPrice, setBagPrice] = useState(8);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [bulkPrice, setBulkPrice] = useState(55);
  const [deliveryFee, setDeliveryFee] = useState(60);
  const [minimumOrder, setMinimumOrder] = useState(1);
  const [mix, setMix] = useState<keyof typeof SOIL_MIX_TEMPLATES | 'custom'>('basic');
  const [customTopsoil, setCustomTopsoil] = useState(60);
  const [customCompost, setCustomCompost] = useState(30);
  const [customPotting, setCustomPotting] = useState(10);
  const [containerMode, setContainerMode] = useState<ContainerMode>('grow');
  const [growGallonsOne, setGrowGallonsOne] = useState(15);
  const [growQtyOne, setGrowQtyOne] = useState(10);
  const [growGallonsTwo, setGrowGallonsTwo] = useState(10);
  const [growQtyTwo, setGrowQtyTwo] = useState(6);
  const [containerLength, setContainerLength] = useState(24);
  const [containerWidth, setContainerWidth] = useState(12);
  const [containerDepth, setContainerDepth] = useState(12);
  const [bottomDiameter, setBottomDiameter] = useState(10);
  const [containerQty, setContainerQty] = useState(1);
  const [gridLength, setGridLength] = useState(4);
  const [gridWidth, setGridWidth] = useState(8);
  const [crop, setCrop] = useState('tomato');
  const [topOffDepth, setTopOffDepth] = useState(2);
  const [shapeMode, setShapeMode] = useState<ShapeMode>('round');
  const [shapeA, setShapeA] = useState(6);
  const [shapeB, setShapeB] = useState(4);
  const [shapeC, setShapeC] = useState(2);
  const [shapeD, setShapeD] = useState(2);
  const [costKit, setCostKit] = useState(180);
  const [costCompost, setCostCompost] = useState(40);
  const [costMulch, setCostMulch] = useState(25);
  const [costHardware, setCostHardware] = useState(20);
  const [taxPercent, setTaxPercent] = useState(0);
  const [multiLengthTwo, setMultiLengthTwo] = useState(4);
  const [multiWidthTwo, setMultiWidthTwo] = useState(4);
  const [multiDepthTwo, setMultiDepthTwo] = useState(12);
  const [multiQtyTwo, setMultiQtyTwo] = useState(1);
  const [multiLengthThree, setMultiLengthThree] = useState(2);
  const [multiWidthThree, setMultiWidthThree] = useState(8);
  const [multiDepthThree, setMultiDepthThree] = useState(12);
  const [multiQtyThree, setMultiQtyThree] = useState(1);
  const [multiContainerLengthOne, setMultiContainerLengthOne] = useState(24);
  const [multiContainerWidthOne, setMultiContainerWidthOne] = useState(12);
  const [multiContainerDepthOne, setMultiContainerDepthOne] = useState(12);
  const [multiContainerQtyOne, setMultiContainerQtyOne] = useState(2);
  const [multiContainerLengthTwo, setMultiContainerLengthTwo] = useState(18);
  const [multiContainerWidthTwo, setMultiContainerWidthTwo] = useState(18);
  const [multiContainerDepthTwo, setMultiContainerDepthTwo] = useState(14);
  const [multiContainerQtyTwo, setMultiContainerQtyTwo] = useState(3);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const applyPagePreset = useCallback((slug?: string) => {
    if (!slug) return;
    const sizeMatch = slug.match(/^(\d+)x(\d+)-raised-bed-soil-calculator$/);
    if (sizeMatch) {
      setLength(Number(sizeMatch[1]));
      setWidth(Number(sizeMatch[2]));
      setDepth(12);
      setLengthUnit('ft');
      setWidthUnit('ft');
      setDepthUnit('in');
      setGridLength(Number(sizeMatch[1]));
      setGridWidth(Number(sizeMatch[2]));
    }
    if (slug === '40-qt-soil-bag-calculator') { setBagSize(40); setBagUnit('dryQuart'); }
    if (slug === '1-cubic-foot-soil-bag-calculator') { setBagSize(1); setBagUnit('ft3'); }
    if (slug === '1-5-cubic-foot-soil-bag-calculator') { setBagSize(1.5); setBagUnit('ft3'); }
    if (slug === '2-cubic-foot-soil-bag-calculator') { setBagSize(2); setBagUnit('ft3'); }
    if (slug === 'liters-to-soil-bags-calculator') { setLength(120); setWidth(240); setDepth(30); setLengthUnit('cm'); setWidthUnit('cm'); setDepthUnit('cm'); setBagSize(50); setBagUnit('liter'); setUnitPreset('metric'); }
    if (slug === 'cubic-feet-to-soil-bags-calculator') { setBagSize(2); setBagUnit('ft3'); }
    if (slug === 'tomato-spacing-raised-bed') setCrop('tomato');
    if (slug === 'pepper-spacing-raised-bed') setCrop('pepper');
    if (slug === 'lettuce-spacing-square-foot-garden') setCrop('lettuce');
    if (slug === 'carrot-spacing-square-foot-garden') setCrop('carrot');
    if (slug === 'cucumber-spacing-raised-bed') setCrop('cucumber');
    if (slug === 'basil-spacing-square-foot-garden') setCrop('basil');
    if (slug === '4x8-planting-layout') { setTab('spacing'); setGridLength(4); setGridWidth(8); setCrop('tomato'); }
    if (slug.endsWith('spacing-raised-bed') || slug.endsWith('spacing-square-foot-garden')) { setTab('spacing'); setGridLength(4); setGridWidth(8); }
    if (slug === 'round-raised-bed-soil-calculator') { setShapeMode('round'); setShapeA(6); setDepth(12); setTab('shapes'); }
    if (slug === 'l-shaped-raised-bed-soil-calculator') { setShapeMode('lShape'); setShapeA(8); setShapeB(6); setShapeC(4); setShapeD(3); setDepth(12); setTab('shapes'); }
    if (slug === 'u-shaped-raised-bed-soil-calculator') { setShapeMode('uShape'); setShapeA(8); setShapeB(6); setShapeC(4); setShapeD(3); setDepth(12); setTab('shapes'); }
    if (slug === 'spring-raised-bed-checklist') { setTopOffDepth(2); setTab('topoff'); }
    if (slug === 'fall-raised-bed-soil-checklist') { setTopOffDepth(1); setTab('topoff'); }
    if (slug === 'grow-bag-soil-calculator') { setContainerMode('grow'); setTab('containers'); }
    if (slug === 'container-soil-calculator') { setContainerMode('rect'); setTab('containers'); }
    if (slug === 'how-much-soil-for-4x8-raised-bed') { setLength(4); setWidth(8); setDepth(12); setTab('raised'); }
    const fourByEightDepthMatch = slug.match(/^4x8-raised-bed-(6|8|10|12|18|24)-inches-soil$/);
    if (fourByEightDepthMatch) { setLength(4); setWidth(8); setDepth(Number(fourByEightDepthMatch[1])); setTab('raised'); }
    if (slug === 'raised-bed-cubic-feet-calculator') { setLength(4); setWidth(8); setDepth(12); setTab('raised'); }
    if (slug === 'how-many-bags-of-soil-for-raised-bed') { setBagSize(2); setBagUnit('ft3'); setTab('bags'); }
    if (slug === 'cubic-yards-to-soil-bags-calculator') { setLength(3); setWidth(3); setDepth(36); setBagSize(2); setBagUnit('ft3'); setTab('bags'); }
    if (slug === 'liters-to-cubic-feet-soil-calculator') { setLength(120); setWidth(240); setDepth(30); setLengthUnit('cm'); setWidthUnit('cm'); setDepthUnit('cm'); setBagSize(50); setBagUnit('liter'); setUnitPreset('metric'); setTab('bags'); }
    if (slug === 'how-many-40-lb-bags-of-soil-do-i-need') { setBagSize(40); setBagUnit('lb'); setTab('bags'); }
    if (slug === 'raised-bed-cost-calculator' || slug === 'raised-bed-soil-cost-calculator') { setTab('cost'); }
    if (slug === 'cheapest-way-to-fill-raised-beds') { setTab('bulk'); setMinimumOrder(2); }
    if (slug === 'how-much-bulk-soil-for-raised-beds' || slug === 'cubic-yards-of-soil-for-raised-beds') { setNumberOfBeds(2); setSettling(10); setTab('bulk'); }
    if (slug === 'compost-topsoil-mix-calculator') { setMix('custom'); setCustomTopsoil(50); setCustomCompost(50); setCustomPotting(0); setTab('mix'); }
    if (slug === 'mels-mix-calculator') { setMix('melsMix'); setTab('mix'); }
    if (slug === 'how-much-compost-for-raised-bed') { setMix('basic'); setTab('mix'); }
    if (slug === 'topsoil-compost-ratio-raised-bed') { setMix('basic'); setTab('mix'); }
    if (slug === 'planter-soil-volume-calculator') { setContainerMode('rect'); setTab('containers'); }
    if (slug === '10-gallon-grow-bag-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(10); setGrowQtyOne(6); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === '20-gallon-grow-bag-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(20); setGrowQtyOne(4); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === '5-gallon-bucket-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(5); setGrowQtyOne(10); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === 'how-much-soil-for-45-six-inch-pots') { setContainerMode('round'); setContainerWidth(6); setContainerDepth(6); setContainerQty(45); setTab('containers'); }
    if (slug === '4x8-raised-bed-planting-layout' || slug === 'how-many-tomato-plants-in-4x8-raised-bed') { setTab('spacing'); setGridLength(4); setGridWidth(8); setCrop('tomato'); }
    if (slug === 'raised-bed-depth-for-tomatoes') { setTab('depth'); setCrop('tomato'); setDepth(12); }
    if (slug === 'raised-bed-depth-for-carrots') { setTab('depth'); setCrop('carrot'); setDepth(10); }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      applyPagePreset(presetSlug);
      const params = new URLSearchParams(window.location.search);
      const nextTab = params.get('tab') as Tab | null;
      if (nextTab && ['raised', 'bags', 'bulk', 'mix', 'containers', 'spacing', 'topoff', 'depth', 'cost', 'multi', 'shapes'].includes(nextTab)) setTab(nextTab);
      const numericSetters: [string, (value: number) => void][] = [
        ['l', setLength], ['w', setWidth], ['d', setDepth], ['beds', setNumberOfBeds], ['free', setFreeboard], ['settle', setSettling],
        ['bagSize', setBagSize], ['bagPrice', setBagPrice], ['bulkPrice', setBulkPrice], ['delivery', setDeliveryFee], ['minOrder', setMinimumOrder],
        ['gridL', setGridLength], ['gridW', setGridWidth], ['topoff', setTopOffDepth],
        ['shapeA', setShapeA], ['shapeB', setShapeB], ['shapeC', setShapeC], ['shapeD', setShapeD],
        ['c1l', setMultiContainerLengthOne], ['c1w', setMultiContainerWidthOne], ['c1d', setMultiContainerDepthOne], ['c1q', setMultiContainerQtyOne],
        ['c2l', setMultiContainerLengthTwo], ['c2w', setMultiContainerWidthTwo], ['c2d', setMultiContainerDepthTwo], ['c2q', setMultiContainerQtyTwo],
      ];
      numericSetters.forEach(([key, setter]) => {
        const raw = params.get(key);
        if (raw !== null && Number.isFinite(Number(raw))) setter(Number(raw));
      });
      const lu = params.get('lu') as LengthUnit | null;
      const wu = params.get('wu') as LengthUnit | null;
      const du = params.get('du') as LengthUnit | null;
      const bu = params.get('bu') as BagUnit | null;
      const cur = params.get('cur') as CurrencyCode | null;
      const nextCrop = params.get('crop');
      const nextShape = params.get('shape') as ShapeMode | null;
      if (nextCrop && CROPS.some((item) => item.id === nextCrop)) setCrop(nextCrop);
      if (nextShape && ['round', 'lShape', 'uShape'].includes(nextShape)) setShapeMode(nextShape);
      if (lu && ['ft', 'in', 'cm', 'm'].includes(lu)) setLengthUnit(lu);
      if (wu && ['ft', 'in', 'cm', 'm'].includes(wu)) setWidthUnit(wu);
      if (du && ['ft', 'in', 'cm', 'm'].includes(du)) setDepthUnit(du);
      if (bu && ['ft3', 'yd3', 'liter', 'dryQuart', 'gallon', 'lb', 'kg'].includes(bu)) setBagUnit(bu);
      if (cur && ['USD', 'CAD', 'GBP', 'AUD', 'EUR'].includes(cur)) setCurrency(cur);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [applyPagePreset, presetSlug]);

  function applyUnitPreset(nextPreset: UnitPreset) {
    setUnitPreset(nextPreset);
    if (nextPreset === 'metric') {
      setLength(120);
      setWidth(240);
      setDepth(30);
      setLengthUnit('cm');
      setWidthUnit('cm');
      setDepthUnit('cm');
      setBagSize(50);
      setBagUnit('liter');
    } else {
      setLength(4);
      setWidth(8);
      setDepth(12);
      setLengthUnit('ft');
      setWidthUnit('ft');
      setDepthUnit('in');
      setBagSize(2);
      setBagUnit('ft3');
    }
  }

  const bedResult = useMemo(() => calculateRaisedBedVolume({
    length,
    width,
    depth,
    lengthUnit,
    widthUnit,
    depthUnit,
    numberOfBeds,
    freeboard,
    freeboardUnit: depthUnit,
    settlingAllowancePercent: settling,
  }), [length, width, depth, lengthUnit, widthUnit, depthUnit, numberOfBeds, freeboard, settling]);

  const bagResult = useMemo(() => calculateSoilBags(bedResult.finalVolumeFt3, { bagSize, bagUnit, bagPrice, currency }), [bedResult.finalVolumeFt3, bagSize, bagUnit, bagPrice, currency]);
  const bulkResult = useMemo(() => compareBulkVsBags(bedResult.finalVolumeFt3, { bagSize, bagUnit, bagPrice, currency }, { pricePerCubicYard: bulkPrice, deliveryFee, minimumOrderYards: minimumOrder, currency }), [bedResult.finalVolumeFt3, bagSize, bagUnit, bagPrice, currency, bulkPrice, deliveryFee, minimumOrder]);
  const mixInput: SoilMixInput = useMemo(() => {
    const withBagEstimate = (components: readonly SoilMixComponent[]): SoilMixComponent[] => components.map((component) => ({
      ...component,
      bagSize,
      bagUnit,
      bagPrice,
    }));
    if (mix !== 'custom') return { ...SOIL_MIX_TEMPLATES[mix], components: withBagEstimate(SOIL_MIX_TEMPLATES[mix].components) };
    const components: SoilMixComponent[] = [
      { id: 'topsoil', name: 'Topsoil', ratioPercent: customTopsoil },
      { id: 'compost', name: 'Compost', ratioPercent: customCompost },
      { id: 'pottingMix', name: 'Potting mix or aeration', ratioPercent: customPotting },
    ];
    return { templateId: 'custom', components: withBagEstimate(components) };
  }, [mix, customTopsoil, customCompost, customPotting, bagSize, bagUnit, bagPrice]);
  const mixRows = useMemo(() => calculateSoilMix(bedResult.finalVolumeFt3, mixInput), [bedResult.finalVolumeFt3, mixInput]);
  const mixTotalCost = mixRows.reduce((total, row) => total + (row.cost ?? 0), 0);
  const containerResult = useMemo(() => {
    if (containerMode === 'grow') return calculateGrowBagVolume({ gallons: growGallonsOne * growQtyOne + growGallonsTwo * growQtyTwo, quantity: 1 });
    if (containerMode === 'round') return calculateRoundPotVolume({ diameter: containerWidth, height: containerDepth, unit: 'in', quantity: containerQty });
    if (containerMode === 'taper') return calculateTaperedPotVolume({ topDiameter: containerWidth, bottomDiameter, height: containerDepth, unit: 'in', quantity: containerQty });
    return calculateRectangularPlanterVolume({ length: containerLength, width: containerWidth, depth: containerDepth, unit: 'in', quantity: containerQty });
  }, [containerMode, growGallonsOne, growQtyOne, growGallonsTwo, growQtyTwo, containerLength, containerWidth, containerDepth, bottomDiameter, containerQty]);
  const topOffResult = useMemo(() => calculateAnnualTopOff({ length, width, topOffDepth, lengthUnit, widthUnit, topOffDepthUnit: depthUnit, numberOfBeds }), [length, width, topOffDepth, lengthUnit, widthUnit, depthUnit, numberOfBeds]);
  const topOffMaterials = useMemo(() => calculateTopOffMaterials(topOffResult.finalVolumeFt3, 100, 25), [topOffResult.finalVolumeFt3]);
  const spacingResult = useMemo(() => calculateSquareFootSpacing({ lengthFt: gridLength, widthFt: gridWidth, cropId: crop }), [gridLength, gridWidth, crop]);
  const depthResult = useMemo(() => checkDepthSuitability(depthUnit === 'in' ? depth : depthUnit === 'cm' ? depth / 2.54 : depthUnit === 'ft' ? depth * 12 : depth * 39.3701, crop), [depth, depthUnit, crop]);
  const shapeResult = useMemo(() => {
    if (shapeMode === 'round') return calculateRoundRaisedBedVolume({ diameter: shapeA, depth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
    if (shapeMode === 'lShape') return calculateLShapedRaisedBedVolume({ outerLength: shapeA, outerWidth: shapeB, cutoutLength: shapeC, cutoutWidth: shapeD, depth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
    return calculateUShapedRaisedBedVolume({ outerLength: shapeA, outerWidth: shapeB, innerLength: shapeC, innerWidth: shapeD, depth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
  }, [shapeMode, shapeA, shapeB, shapeC, shapeD, depth, numberOfBeds, settling]);
  const multiResult = useMemo(() => calculateMultipleRaisedBedVolume([
    { length, width, depth, lengthUnit, widthUnit, depthUnit, numberOfBeds, freeboard, freeboardUnit: depthUnit, settlingAllowancePercent: settling },
    { length: multiLengthTwo, width: multiWidthTwo, depth: multiDepthTwo, lengthUnit: 'ft', widthUnit: 'ft', depthUnit: 'in', numberOfBeds: multiQtyTwo, freeboard: 0, freeboardUnit: 'in', settlingAllowancePercent: settling },
    { length: multiLengthThree, width: multiWidthThree, depth: multiDepthThree, lengthUnit: 'ft', widthUnit: 'ft', depthUnit: 'in', numberOfBeds: multiQtyThree, freeboard: 0, freeboardUnit: 'in', settlingAllowancePercent: settling },
  ]), [length, width, depth, lengthUnit, widthUnit, depthUnit, numberOfBeds, freeboard, settling, multiLengthTwo, multiWidthTwo, multiDepthTwo, multiQtyTwo, multiLengthThree, multiWidthThree, multiDepthThree, multiQtyThree]);
  const multiContainerResult = useMemo(() => calculateMultipleRectangularContainerVolume([
    { length: multiContainerLengthOne, width: multiContainerWidthOne, depth: multiContainerDepthOne, unit: 'in', quantity: multiContainerQtyOne },
    { length: multiContainerLengthTwo, width: multiContainerWidthTwo, depth: multiContainerDepthTwo, unit: 'in', quantity: multiContainerQtyTwo },
  ]), [multiContainerLengthOne, multiContainerWidthOne, multiContainerDepthOne, multiContainerQtyOne, multiContainerLengthTwo, multiContainerWidthTwo, multiContainerDepthTwo, multiContainerQtyTwo]);
  const costResult = useMemo(() => estimateRaisedBedProjectCost({
    soilCost: bagResult.totalCost ?? 0,
    lumberOrKitCost: costKit,
    compostCost: costCompost,
    mulchCost: costMulch,
    hardwareCost: costHardware,
    deliveryFee,
    taxPercent,
    numberOfBeds,
    currency,
  }), [bagResult.totalCost, costKit, costCompost, costMulch, costHardware, deliveryFee, taxPercent, numberOfBeds, currency]);

  const symbol = currencySymbol(currency);
  const activeVolume = tab === 'containers' ? containerResult : tab === 'topoff' ? topOffResult : tab === 'shapes' ? shapeResult : tab === 'multi' ? multiResult : bedResult;
  const activeBagResult = useMemo(() => calculateSoilBags(activeVolume.finalVolumeFt3, { bagSize, bagUnit, bagPrice, currency }), [activeVolume.finalVolumeFt3, bagSize, bagUnit, bagPrice, currency]);
  const warnings = Array.from(new Map([...bedResult.warnings, ...activeBagResult.warnings, ...bulkResult.warnings, ...containerResult.warnings, ...mixRows.flatMap((row) => row.warnings), ...shapeResult.warnings, ...multiResult.warnings, ...multiContainerResult.warnings, ...costResult.warnings].map((warning) => [warningKey(warning), warning])).values());
  const validationMessages = [
    length <= 0 || width <= 0 || depth <= 0 ? 'Enter a length, width, and depth greater than zero.' : '',
    bagSize <= 0 ? 'Bag size must be greater than zero.' : '',
    mix === 'custom' && customTopsoil + customCompost + customPotting !== 100 ? 'Custom soil mix percentages must add up to 100%.' : '',
    bulkResult.overbuyFt3 > activeVolume.finalVolumeFt3 && minimumOrder > bulkResult.requiredYd3 ? 'Your bulk minimum order is much larger than the required volume.' : '',
  ].filter(Boolean);

  const shoppingList = `BedSoil shopping list\nActive tool: ${tab}\nSoil volume: ${fmt(activeVolume.finalVolumeFt3)} ft³ (${fmt(activeVolume.volumeYd3)} yd³ / ${fmt(activeVolume.volumeLiters)} L)\nBags: ${activeBagResult.bagsNeeded} × ${bagSize} ${bagUnit}\nEstimated bag cost: ${symbol}${fmt(activeBagResult.totalCost ?? 0)}\nBulk estimate: ${symbol}${fmt(bulkResult.bulkTotalCost)}\nProject cost estimate: ${symbol}${fmt(costResult.total)}\nMix estimate: ${mixRows.map((row) => `${row.name} ${fmt(row.volumeFt3)} ft³ / ${row.bagsNeeded ?? 0} bags`).join('; ')}\nMix bag cost estimate: ${symbol}${fmt(mixTotalCost)}\nTop-off compost: ${fmt(topOffMaterials.compostFt3)} ft³; optional mulch: ${fmt(topOffMaterials.optionalMulchFt3)} ft³\nWarnings:\n${warningsText(warnings)}`;

  function createShareUrl() {
    const params = new URLSearchParams({
      tab, l: String(length), w: String(width), d: String(depth), lu: lengthUnit, wu: widthUnit, du: depthUnit, beds: String(numberOfBeds), free: String(freeboard), settle: String(settling), bagSize: String(bagSize), bagPrice: String(bagPrice), bu: bagUnit, bulkPrice: String(bulkPrice), delivery: String(deliveryFee), minOrder: String(minimumOrder), cur: currency, gridL: String(gridLength), gridW: String(gridWidth), topoff: String(topOffDepth), crop, shape: shapeMode, shapeA: String(shapeA), shapeB: String(shapeB), shapeC: String(shapeC), shapeD: String(shapeD), c1l: String(multiContainerLengthOne), c1w: String(multiContainerWidthOne), c1d: String(multiContainerDepthOne), c1q: String(multiContainerQtyOne), c2l: String(multiContainerLengthTwo), c2w: String(multiContainerWidthTwo), c2d: String(multiContainerDepthTwo), c2q: String(multiContainerQtyTwo),
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}#calculator`;
  }

  async function copyShoppingList() {
    await navigator.clipboard?.writeText(shoppingList);
    trackCalculatorEvent('copy_shopping_list', { tab });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  async function copyShareUrl() {
    const url = createShareUrl();
    window.history.replaceState(null, '', url.replace(window.location.origin, ''));
    await navigator.clipboard?.writeText(url);
    trackCalculatorEvent('copy_share_url', { tab });
    setShared(true);
    window.setTimeout(() => setShared(false), 1400);
  }

  function downloadText() {
    trackCalculatorEvent('download_txt', { tab });
    const blob = new Blob([shoppingList], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bedsoil-shopping-list.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadCsv() {
    trackCalculatorEvent('download_csv', { tab });
    const csv = ['item,value', `volume_ft3,${fmt(activeVolume.finalVolumeFt3)}`, `volume_yd3,${fmt(activeVolume.volumeYd3)}`, `bags,${activeBagResult.bagsNeeded}`, `bag_cost,${fmt(activeBagResult.totalCost ?? 0)}`, `bulk_cost,${fmt(bulkResult.bulkTotalCost)}`, `project_cost,${fmt(costResult.total)}`].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bedsoil-result.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function printResult() {
    trackCalculatorEvent('print_result', { tab });
    window.print();
  }

  function downloadPng() {
    trackCalculatorEvent('download_png', { tab });
    const canvas = document.createElement('canvas');
    canvas.width = 1100;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#241b13';
    ctx.font = 'bold 34px Arial';
    ctx.fillText('BedSoil Calculator Result', 40, 64);
    ctx.font = '24px Arial';
    shoppingList.split('\n').slice(0, 20).forEach((line, index) => ctx.fillText(line, 40, 120 + index * 30));
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'bedsoil-result.png';
    link.click();
  }

  function pdfEscape(value: string) {
    return value.replace(/ft³/g, 'ft3').replace(/yd³/g, 'yd3').replace(/×/g, 'x').replace(/–/g, '-').replace(/[^\x20-\x7E]/g, '').replace(/[\\()]/g, (match) => `\\${match}`);
  }

  function downloadPdf() {
    trackCalculatorEvent('download_pdf', { tab });
    const lines = ['BedSoil Calculator Result', ...shoppingList.split('\n')].slice(0, 22);
    const textCommands = lines.map((line, index) => `BT /F1 11 Tf 48 ${780 - index * 24} Td (${pdfEscape(line)}) Tj ET`).join('\n');
    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      `5 0 obj << /Length ${textCommands.length} >> stream\n${textCommands}\nendstream endobj`,
    ];
    let offset = 9;
    const xref = ['xref', '0 6', '0000000000 65535 f '];
    const body = objects.map((object) => {
      const current = offset;
      offset += object.length + 1;
      xref.push(`${String(current).padStart(10, '0')} 00000 n `);
      return object;
    }).join('\n');
    const trailer = `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;
    const pdf = `%PDF-1.4\n${body}\n${xref.join('\n')}\n${trailer}`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bedsoil-result.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section id="calculator" className="calculator-shell">
      <div className="tabs" aria-label="Calculator tabs">
        {(['raised', 'bags', 'bulk', 'mix', 'containers', 'spacing', 'topoff', 'depth', 'cost', 'multi', 'shapes'] as const).map((item) => (
          <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); trackCalculatorEvent('tab_change', { tab: item }); }}>{item}</button>
        ))}
      </div>

      <div className="preset-row">
        <SelectInput label="Unit preset" value={unitPreset} setValue={applyUnitPreset} options={[{ label: 'US / imperial', value: 'us' }, { label: 'Metric', value: 'metric' }]} />
        <SelectInput label="Currency" value={currency} setValue={setCurrency} options={currencyOptions} />
        {RAISED_BED_PRESETS.map((presetDepth) => (
          <button type="button" key={presetDepth} onClick={() => { setLength(4); setWidth(8); setDepth(presetDepth); setLengthUnit('ft'); setWidthUnit('ft'); setDepthUnit('in'); setTab('raised'); }}>4×8×{presetDepth} in</button>
        ))}
      </div>

      <div className="calculator-grid">
        <form className="input-grid" onSubmit={(event) => event.preventDefault()}>
          {tab === 'raised' && (
            <>
              <NumberInput label={`Length (${lengthUnit})`} value={length} setValue={setLength} step={0.25} />
              <SelectInput label="Length unit" value={lengthUnit} setValue={setLengthUnit} options={lengthUnitOptions} />
              <NumberInput label={`Width (${widthUnit})`} value={width} setValue={setWidth} step={0.25} />
              <SelectInput label="Width unit" value={widthUnit} setValue={setWidthUnit} options={lengthUnitOptions} />
              <NumberInput label={`Depth (${depthUnit})`} value={depth} setValue={setDepth} />
              <SelectInput label="Depth unit" value={depthUnit} setValue={setDepthUnit} options={lengthUnitOptions} />
              <NumberInput label="Number of beds" value={numberOfBeds} setValue={setNumberOfBeds} />
              <NumberInput label={`Freeboard (${depthUnit})`} value={freeboard} setValue={setFreeboard} step={0.5} />
              <NumberInput label="Settling allowance (%)" value={settling} setValue={setSettling} />
            </>
          )}

          {tab === 'bags' && (
            <>
              <NumberInput label="Bag size" value={bagSize} setValue={setBagSize} step={0.1} />
              <SelectInput label="Bag unit" value={bagUnit} setValue={setBagUnit} options={bagUnitOptions} />
              <NumberInput label={`Bag price (${symbol})`} value={bagPrice} setValue={setBagPrice} step={0.5} />
              <div className="full-width small-buttons">{BAG_PRESETS.map((preset) => <button type="button" key={preset.label} onClick={() => { setBagSize(preset.size); setBagUnit(preset.unit); }}>{preset.label}</button>)}</div>
            </>
          )}

          {tab === 'bulk' && (
            <>
              <NumberInput label="Bag size" value={bagSize} setValue={setBagSize} step={0.1} />
              <SelectInput label="Bag unit" value={bagUnit} setValue={setBagUnit} options={bagUnitOptions} />
              <NumberInput label={`Bag price (${symbol})`} value={bagPrice} setValue={setBagPrice} step={0.5} />
              <NumberInput label={`Bulk price / yd³ (${symbol})`} value={bulkPrice} setValue={setBulkPrice} />
              <NumberInput label={`Delivery fee (${symbol})`} value={deliveryFee} setValue={setDeliveryFee} />
              <NumberInput label="Minimum order (yd³)" value={minimumOrder} setValue={setMinimumOrder} step={0.25} />
            </>
          )}

          {tab === 'mix' && (
            <>
              <label className="full-width"><span>Mix template</span><select value={mix} onChange={(event) => setMix(event.target.value as keyof typeof SOIL_MIX_TEMPLATES | 'custom')}><option value="basic">Basic raised bed mix 60/30/10</option><option value="soilless">Compost + soilless mix 50/50</option><option value="melsMix">Mel&apos;s Mix style</option><option value="budgetFill">Budget fill</option><option value="custom">Custom ratio</option></select></label>
              {mix === 'custom' ? <><NumberInput label="Topsoil %" value={customTopsoil} setValue={setCustomTopsoil} /><NumberInput label="Compost %" value={customCompost} setValue={setCustomCompost} /><NumberInput label="Potting / aeration %" value={customPotting} setValue={setCustomPotting} /><p className="full-width muted-card">Custom total: {customTopsoil + customCompost + customPotting}%. It must equal 100%.</p></> : null}
            </>
          )}

          {tab === 'containers' && (
            <>
              <SelectInput label="Container type" value={containerMode} setValue={setContainerMode} options={[{ label: 'Grow bags', value: 'grow' }, { label: 'Rectangular planter', value: 'rect' }, { label: 'Round pot', value: 'round' }, { label: 'Tapered pot', value: 'taper' }]} />
              {containerMode === 'grow' ? (
                <>
                  <NumberInput label="Group 1 gallons" value={growGallonsOne} setValue={setGrowGallonsOne} />
                  <NumberInput label="Group 1 quantity" value={growQtyOne} setValue={setGrowQtyOne} />
                  <NumberInput label="Group 2 gallons" value={growGallonsTwo} setValue={setGrowGallonsTwo} />
                  <NumberInput label="Group 2 quantity" value={growQtyTwo} setValue={setGrowQtyTwo} />
                </>
              ) : (
                <>
                  {containerMode === 'rect' ? <NumberInput label="Length (in)" value={containerLength} setValue={setContainerLength} /> : null}
                  <NumberInput label={containerMode === 'rect' ? 'Width (in)' : 'Top diameter (in)'} value={containerWidth} setValue={setContainerWidth} />
                  {containerMode === 'taper' ? <NumberInput label="Bottom diameter (in)" value={bottomDiameter} setValue={setBottomDiameter} /> : null}
                  <NumberInput label="Height/depth (in)" value={containerDepth} setValue={setContainerDepth} />
                  <NumberInput label="Quantity" value={containerQty} setValue={setContainerQty} />
                </>
              )}
            </>
          )}

          {tab === 'spacing' && (
            <>
              <NumberInput label="Grid length (ft)" value={gridLength} setValue={setGridLength} />
              <NumberInput label="Grid width (ft)" value={gridWidth} setValue={setGridWidth} />
              <label><span>Crop</span><select value={crop} onChange={(event) => setCrop(event.target.value)}>{CROPS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </>
          )}

          {tab === 'topoff' && (
            <>
              <NumberInput label={`Length (${lengthUnit})`} value={length} setValue={setLength} />
              <NumberInput label={`Width (${widthUnit})`} value={width} setValue={setWidth} />
              <NumberInput label={`Top-off depth (${depthUnit})`} value={topOffDepth} setValue={setTopOffDepth} step={0.5} />
              <NumberInput label="Number of beds" value={numberOfBeds} setValue={setNumberOfBeds} />
            </>
          )}

          {tab === 'depth' && (
            <>
              <NumberInput label={`Bed depth (${depthUnit})`} value={depth} setValue={setDepth} />
              <SelectInput label="Depth unit" value={depthUnit} setValue={setDepthUnit} options={lengthUnitOptions} />
              <label><span>Crop</span><select value={crop} onChange={(event) => setCrop(event.target.value)}>{CROPS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </>
          )}

          {tab === 'cost' && (
            <>
              <NumberInput label={`Bed kit / lumber (${symbol})`} value={costKit} setValue={setCostKit} />
              <NumberInput label={`Compost add-on (${symbol})`} value={costCompost} setValue={setCostCompost} />
              <NumberInput label={`Mulch (${symbol})`} value={costMulch} setValue={setCostMulch} />
              <NumberInput label={`Hardware / liner (${symbol})`} value={costHardware} setValue={setCostHardware} />
              <NumberInput label={`Delivery fee (${symbol})`} value={deliveryFee} setValue={setDeliveryFee} />
              <NumberInput label="Tax (%)" value={taxPercent} setValue={setTaxPercent} step={0.1} />
            </>
          )}

          {tab === 'multi' && (
            <>
              <p className="full-width muted-card">Row 1 uses the main raised bed dimensions above. Add two optional rows below for multiple areas.</p>
              <NumberInput label="Row 2 length ft" value={multiLengthTwo} setValue={setMultiLengthTwo} />
              <NumberInput label="Row 2 width ft" value={multiWidthTwo} setValue={setMultiWidthTwo} />
              <NumberInput label="Row 2 depth in" value={multiDepthTwo} setValue={setMultiDepthTwo} />
              <NumberInput label="Row 2 quantity" value={multiQtyTwo} setValue={setMultiQtyTwo} />
              <NumberInput label="Row 3 length ft" value={multiLengthThree} setValue={setMultiLengthThree} />
              <NumberInput label="Row 3 width ft" value={multiWidthThree} setValue={setMultiWidthThree} />
              <NumberInput label="Row 3 depth in" value={multiDepthThree} setValue={setMultiDepthThree} />
              <NumberInput label="Row 3 quantity" value={multiQtyThree} setValue={setMultiQtyThree} />
              <p className="full-width muted-card">Optional rectangular container rows are included in the separate multi-container summary.</p>
              <NumberInput label="Container row 1 length in" value={multiContainerLengthOne} setValue={setMultiContainerLengthOne} />
              <NumberInput label="Container row 1 width in" value={multiContainerWidthOne} setValue={setMultiContainerWidthOne} />
              <NumberInput label="Container row 1 depth in" value={multiContainerDepthOne} setValue={setMultiContainerDepthOne} />
              <NumberInput label="Container row 1 quantity" value={multiContainerQtyOne} setValue={setMultiContainerQtyOne} />
              <NumberInput label="Container row 2 length in" value={multiContainerLengthTwo} setValue={setMultiContainerLengthTwo} />
              <NumberInput label="Container row 2 width in" value={multiContainerWidthTwo} setValue={setMultiContainerWidthTwo} />
              <NumberInput label="Container row 2 depth in" value={multiContainerDepthTwo} setValue={setMultiContainerDepthTwo} />
              <NumberInput label="Container row 2 quantity" value={multiContainerQtyTwo} setValue={setMultiContainerQtyTwo} />
            </>
          )}

          {tab === 'shapes' && (
            <>
              <SelectInput label="Raised bed shape" value={shapeMode} setValue={setShapeMode} options={[{ label: 'Round bed', value: 'round' }, { label: 'L-shaped approximation', value: 'lShape' }, { label: 'U-shaped approximation', value: 'uShape' }]} />
              <NumberInput label={shapeMode === 'round' ? 'Diameter (ft)' : 'Outer length (ft)'} value={shapeA} setValue={setShapeA} />
              {shapeMode !== 'round' ? <NumberInput label="Outer width (ft)" value={shapeB} setValue={setShapeB} /> : null}
              {shapeMode !== 'round' ? <NumberInput label={shapeMode === 'lShape' ? 'Cutout length (ft)' : 'Inner opening length (ft)'} value={shapeC} setValue={setShapeC} /> : null}
              {shapeMode !== 'round' ? <NumberInput label={shapeMode === 'lShape' ? 'Cutout width (ft)' : 'Inner opening width (ft)'} value={shapeD} setValue={setShapeD} /> : null}
              <NumberInput label="Depth (in)" value={depth} setValue={setDepth} />
              <NumberInput label="Quantity" value={numberOfBeds} setValue={setNumberOfBeds} />
            </>
          )}

          <button className="primary full-width" type="button">Calculate</button>
        </form>

        <aside className="result-panel" aria-live="polite">
          <h2>Result</h2>
          <div className="metric"><span>Base cubic feet</span><strong>{fmt(activeVolume.baseVolumeFt3)}</strong></div>
          <div className="metric"><span>Final cubic feet</span><strong>{fmt(activeVolume.finalVolumeFt3)}</strong></div>
          <div className="metric"><span>Cubic yards</span><strong>{fmt(activeVolume.volumeYd3)}</strong></div>
          <div className="metric"><span>Liters</span><strong>{fmt(activeVolume.volumeLiters)}</strong></div>
          <div className="metric"><span>Dry quarts</span><strong>{fmt(activeVolume.volumeDryQuarts)}</strong></div>
          <div className="metric"><span>Gallons</span><strong>{fmt(activeVolume.volumeGallons)}</strong></div>
          <div className="metric"><span>Bags needed</span><strong>{activeBagResult.bagsNeeded}</strong></div>
          <div className="metric"><span>Leftover bag volume</span><strong>{fmt(activeBagResult.leftoverFt3)} ft³</strong></div>
          <div className="metric"><span>Bag cost</span><strong>{symbol}{fmt(activeBagResult.totalCost ?? 0)}</strong></div>
          <div className="metric"><span>Bulk estimate</span><strong>{symbol}{fmt(bulkResult.bulkTotalCost)}</strong></div>
          <div className="metric"><span>Project total</span><strong>{symbol}{fmt(costResult.total)}</strong></div>
          <div className="metric"><span>Bulk recommendation</span><strong>{bulkResult.recommendation}</strong></div>
          <div className="metric"><span>Required bulk volume</span><strong>{fmt(bulkResult.requiredYd3)} yd³</strong></div>
          <div className="metric"><span>Adjusted bulk order</span><strong>{fmt(bulkResult.bulkOrderYd3)} yd³</strong></div>
          <div className="metric"><span>Bulk overbuy</span><strong>{fmt(bulkResult.overbuyFt3)} ft³</strong></div>
          <div className="metric"><span>Bag cost / ft³</span><strong>{symbol}{fmt(bulkResult.bagCostPerFt3)}</strong></div>
          <div className="metric"><span>Bulk cost / ft³</span><strong>{symbol}{fmt(bulkResult.bulkCostPerFt3)}</strong></div>
          <div className="metric"><span>Bulk savings</span><strong>{symbol}{fmt(bulkResult.savings)}</strong></div>

          <div className="mini-table"><h3>Mix breakdown</h3>{mixRows.map((row) => <div key={row.componentId}><span>{row.name}</span><strong>{fmt(row.volumeFt3)} ft³ · {row.bagsNeeded ?? 0} bags · {symbol}{fmt(row.cost ?? 0)}</strong></div>)}<div><span>Estimated mix bag cost</span><strong>{symbol}{fmt(mixTotalCost)}</strong></div></div>
          {tab === 'containers' ? <p className="callout">Container volume: <b>{fmt(containerResult.finalVolumeFt3)} ft³</b> / {fmt(containerResult.volumeLiters)} L</p> : null}
          {tab === 'multi' ? <p className="callout">Multiple beds: <b>{fmt(multiResult.finalVolumeFt3)} ft³</b>. Multiple containers: <b>{fmt(multiContainerResult.finalVolumeFt3)} ft³</b>.</p> : null}
          {tab === 'topoff' ? <p className="callout">Annual top-off need: <b>{fmt(topOffResult.finalVolumeFt3)} ft³</b>. Compost planning amount: <b>{fmt(topOffMaterials.compostFt3)} ft³</b>. Optional mulch estimate: <b>{fmt(topOffMaterials.optionalMulchFt3)} ft³</b>.</p> : null}
          {tab === 'spacing' ? <><p className="callout">{spacingResult.totalSquares} squares × {plantText(spacingResult.plantsPerSquareFoot)} plants per square = <b>{plantText(spacingResult.totalPlants)} plants</b></p><SquareFootGridPreview lengthFt={gridLength} widthFt={gridWidth} cropLabel={spacingResult.crop?.name ?? 'custom crop'} /></> : null}
          {tab === 'depth' ? <p className="callout"><b>Status: {depthResult.status}</b>. {depthResult.message}</p> : null}
          {tab === 'shapes' ? <p className="callout">Shape estimate: <b>{fmt(shapeResult.finalVolumeFt3)} ft³</b>. Use as an approximation for non-rectangular beds.</p> : null}
          {tab === 'cost' ? <p className="callout">Estimated project cost: <b>{symbol}{fmt(costResult.total)}</b>, or {symbol}{fmt(costResult.costPerBed)} per bed.</p> : null}

          <h3>Shopping list</h3>
          <pre>{shoppingList}</pre>
          <div className="button-row">
            <button type="button" onClick={copyShoppingList}>{copied ? 'Copied' : 'Copy shopping list'}</button>
            <button type="button" onClick={printResult}>Print / save as PDF</button>
            <button type="button" onClick={downloadText}>Download TXT</button>
            <button type="button" onClick={downloadCsv}>Download CSV</button>
            <button type="button" onClick={downloadPng}>Download PNG</button>
            <button type="button" onClick={downloadPdf}>Download PDF</button>
            <button type="button" onClick={copyShareUrl}>{shared ? 'URL copied' : 'Copy share URL'}</button>
          </div>
          {validationMessages.length > 0 ? <ul className="warning-list validation-list">{validationMessages.map((message) => <li key={message}><b>Check:</b> {message}</li>)}</ul> : null}
          {warnings.length > 0 ? <ul className="warning-list">{warnings.map((warning) => <li key={warningKey(warning)}><b>{warning.severity}:</b> {warning.message}</li>)}</ul> : null}
          <AdSlot placement="result" />
        </aside>
      </div>
    </section>
  );
}
