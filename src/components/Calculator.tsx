'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BagUnit,
  BulkFulfillmentMode,
  CurrencyCode,
  LengthUnit,
  TruckAvailability,
  VolumeUnit,
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
  makeVolumeResult,
  calculateUShapedRaisedBedVolume,
  checkDepthSuitability,
  compareBulkVsBags,
  currencySymbol,
  estimateRaisedBedProjectCost,
  type SoilMixInput,
  type SoilMixComponent,
  type MixBreakdownResult,
  lengthToFeet,
  volumeToFt3,
  type CalculatorWarning,
} from '@/lib/calculators';
import { AdSlot } from '@/components/AdSlot';
import { BAG_PRESETS, RAISED_BED_PRESETS, SOIL_MIX_TEMPLATES } from '@/lib/data/presets';
import { flowNextStepsForMode } from '@/lib/data/flow';
import { fmt, plantText } from '@/lib/utils/format';

type Tab = 'raised' | 'bags' | 'bulk' | 'mix' | 'containers' | 'spacing' | 'topoff' | 'depth' | 'cost' | 'multi' | 'shapes';
type ContainerMode = 'grow' | 'rect' | 'round' | 'taper';
type ShapeMode = 'round' | 'lShape' | 'uShape';
type UnitPreset = 'us' | 'metric';
type VolumeSource = 'bed' | 'manual';
type FieldChangeEvent = { target: { value: string } };
type FormSubmitEvent = { preventDefault: () => void };

function safeNonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function wholeQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.floor(Math.max(0, value));
}

function NumberInput({ label, value, setValue, step = 1 }: { label: string; value: number; setValue: (value: number) => void; step?: number }) {
  return (
    <label>
      <span>{label}</span>
      <input type="number" inputMode="decimal" min={0} step={step} value={Number.isFinite(value) ? value : 0} onChange={(event: FieldChangeEvent) => setValue(safeNonNegativeNumber(Number(event.target.value)))} />
    </label>
  );
}

function SelectInput<T extends string>({ label, value, setValue, options }: { label: string; value: T; setValue: (value: T) => void; options: readonly { label: string; value: T }[] }) {
  return <label><span>{label}</span><select value={value} onChange={(event: FieldChangeEvent) => setValue(event.target.value as T)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function warningKey(warning: CalculatorWarning) {
  return `${warning.code}-${warning.message}`;
}

function warningsText(warnings: CalculatorWarning[]) {
  return warnings.map((warning) => `[${warning.severity}] ${warning.message}`).join('\n');
}

const fastPathByTab: Record<Tab, { title: string; detail: string }[]> = {
  raised: [
    { title: '1. Confirm the bed preset', detail: 'Check length, width, depth, quantity, freeboard, and settling allowance.' },
    { title: '2. Read the volume cards', detail: 'Use cubic feet, cubic yards, bag count, and warnings before buying material.' },
    { title: '3. Export the shopping list', detail: 'Copy, print, download, or share the result once assumptions are stable.' },
  ],
  bags: [
    { title: '1. Choose volume source', detail: 'Use bed dimensions or enter a known volume from another estimate.' },
    { title: '2. Match the package label', detail: 'Use ft³, dry qt, L, or gal; avoid weight-only labels for volume math.' },
    { title: '3. Round once', detail: 'Use the rounded bag count and leftover note before visiting a store.' },
  ],
  bulk: [
    { title: '1. Set required volume', detail: 'Use bed dimensions or manual cubic feet before comparing suppliers.' },
    { title: '2. Add real supplier terms', detail: 'Include cubic-yard price, delivery fee, pickup cost, minimums, and overbuy.' },
    { title: '3. Confirm before ordering', detail: 'Treat the recommendation as planning guidance until the supplier confirms terms.' },
  ],
  mix: [
    { title: '1. Set total fill volume', detail: 'Calculate or enter the volume that needs to be split into components.' },
    { title: '2. Verify the ratio', detail: 'Make sure component percentages total 100% before using the output.' },
    { title: '3. Check local fit', detail: 'Use the split as volume math, not a substitute for soil testing or local guidance.' },
  ],
  containers: [
    { title: '1. Match the container type', detail: 'Choose grow bag, rectangular planter, round pot, or tapered pot.' },
    { title: '2. Check fill-line assumptions', detail: 'Nominal gallons, folds, taper, and drainage space can change usable volume.' },
    { title: '3. Convert to bags', detail: 'Use cubic feet, liters, dry quarts, and package counts before buying mix.' },
  ],
  spacing: [
    { title: '1. Choose crop and grid', detail: 'Use the crop selector and bed area to draft the square-foot layout.' },
    { title: '2. Verify variety spacing', detail: 'Check seed packet, trellis, airflow, and harvest style before planting.' },
    { title: '3. Save the layout', detail: 'Print or copy the plan, then move to depth or soil-volume checks.' },
  ],
  topoff: [
    { title: '1. Measure the soil drop', detail: 'Use the actual gap below the rim before planning top-off material.' },
    { title: '2. Choose material depth', detail: 'Estimate compost, soil, or mix volume using seasonal assumptions.' },
    { title: '3. Verify material choice', detail: 'Separate top-off, mulch, and amendment decisions before buying.' },
  ],
  depth: [
    { title: '1. Choose crop and depth', detail: 'Compare planned bed depth with conservative crop-depth ranges.' },
    { title: '2. Check the base', detail: 'A hard surface below the bed changes how much depth matters.' },
    { title: '3. Route to soil volume', detail: 'Move from suitability screening to the matching fill-volume calculator.' },
  ],
  cost: [
    { title: '1. Enter material assumptions', detail: 'Set soil, compost, kit, hardware, delivery, and tax inputs.' },
    { title: '2. Compare full cost', detail: 'Review per-bed and total cost before choosing bags or bulk.' },
    { title: '3. Export the budget', detail: 'Copy or print the estimate for supplier checks.' },
  ],
  multi: [
    { title: '1. Add every bed', detail: 'Combine multiple beds and containers before rounding purchase quantities.' },
    { title: '2. Review combined volume', detail: 'Use total cubic feet, cubic yards, and bag count as the order basis.' },
    { title: '3. Export one list', detail: 'Create one shopping list instead of separate over-rounded estimates.' },
  ],
  shapes: [
    { title: '1. Select the shape', detail: 'Choose round, L-shaped, U-shaped, or another approximation path.' },
    { title: '2. Check assumptions', detail: 'Read the shape formula and approximation warning before trusting the number.' },
    { title: '3. Cross-check volume', detail: 'Convert to bags or bulk and compare with a rectangular sanity check if needed.' },
  ],
};


async function writeClipboardText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback for restricted clipboard contexts.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function csvValue(value: string | number): string {
  const raw = typeof value === 'number' ? (Number.isFinite(value) ? String(Number(value.toFixed(4))) : '0') : value;
  return /[",\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}



function recommendationLabel(value: 'bulk' | 'bags' | 'tie' | 'notComparable'): string {
  if (value === 'notComparable') return 'Need comparable inputs';
  if (value === 'bulk') return 'Bulk may be cheaper';
  if (value === 'bags') return 'Bags may be cheaper';
  return 'Similar cost';
}

function roundInput(value: number, digits = 2): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function feetToLengthUnit(feet: number, unit: LengthUnit): number {
  switch (unit) {
    case 'ft': return feet;
    case 'in': return feet * 12;
    case 'cm': return feet * 30.48;
    case 'm': return feet / 3.280839895;
  }
}

function convertLengthInput(value: number, from: LengthUnit, to: LengthUnit): number {
  return roundInput(feetToLengthUnit(lengthToFeet(value, from), to), to === 'm' ? 3 : 2);
}

function ft3ToVolumeUnit(valueFt3: number, unit: VolumeUnit): number {
  switch (unit) {
    case 'ft3': return valueFt3;
    case 'yd3': return valueFt3 / 27;
    case 'liter': return valueFt3 * 28.316846592;
    case 'dryQuart': return valueFt3 * 25.71404638;
    case 'gallon': return valueFt3 * 7.48051948;
  }
}

function convertVolumeInput(value: number, from: VolumeUnit, to: VolumeUnit): number {
  return roundInput(ft3ToVolumeUnit(volumeToFt3(value, from), to), to === 'yd3' ? 3 : 2);
}


function trackCalculatorEvent(name: string, payload: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('bedsoil:calculator-event', { detail: { name, ...payload } }));
  const maybeGtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  maybeGtag?.('event', name, payload);
}

function SquareFootGridPreview({ lengthFt, widthFt, cropLabel }: { lengthFt: number; widthFt: number; cropLabel: string }) {
  const actualCols = Math.max(0, Math.floor(Number.isFinite(lengthFt) ? lengthFt : 0));
  const actualRows = Math.max(0, Math.floor(Number.isFinite(widthFt) ? widthFt : 0));
  if (actualCols === 0 || actualRows === 0) {
    return (
      <div className="layout-preview empty-preview" aria-label="Square-foot planting grid needs positive dimensions">
        <p className="muted-card">Enter grid length and width above zero to preview square-foot cells for {cropLabel}.</p>
      </div>
    );
  }
  const displayCols = Math.min(12, actualCols);
  const displayRows = Math.min(12, actualRows);
  const total = displayCols * displayRows;
  const isCapped = displayCols !== actualCols || displayRows !== actualRows;
  return (
    <div className="layout-preview" aria-label={`${actualCols} by ${actualRows} square-foot planting grid`}>
      <div className="layout-grid" style={{ gridTemplateColumns: `repeat(${displayCols}, minmax(28px, 1fr))` }}>
        {Array.from({ length: total }, (_, index) => <span key={index}>{index + 1}</span>)}
      </div>
      <p className="muted-card">Printable square-foot layout preview for {cropLabel}. {isCapped ? `Preview is capped at ${displayCols} × ${displayRows} cells; calculation still uses ${actualCols} × ${actualRows} squares.` : 'Each cell represents 1 sq ft.'}</p>
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

const volumeUnitOptions = [
  { label: 'ft³', value: 'ft3' },
  { label: 'yd³', value: 'yd3' },
  { label: 'L', value: 'liter' },
  { label: 'dry qt', value: 'dryQuart' },
  { label: 'gal', value: 'gallon' },
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
  const [volumeSource, setVolumeSource] = useState<VolumeSource>(initial === 'bags' || initial === 'bulk' || initial === 'mix' ? 'manual' : 'bed');
  const [manualVolume, setManualVolume] = useState(32);
  const [manualVolumeUnit, setManualVolumeUnit] = useState<VolumeUnit>('ft3');
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(8);
  const [depth, setDepth] = useState(12);
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('ft');
  const [widthUnit, setWidthUnit] = useState<LengthUnit>('ft');
  const [depthUnit, setDepthUnit] = useState<LengthUnit>('in');
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [freeboard, setFreeboard] = useState(0);
  const [settling, setSettling] = useState(10);
  const [bagSize, setBagSize] = useState(2);
  const [bagUnit, setBagUnit] = useState<BagUnit>('ft3');
  const [bagPrice, setBagPrice] = useState(8);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [bulkPrice, setBulkPrice] = useState(55);
  const [deliveryFee, setDeliveryFee] = useState(60);
  const [pickupTripCost, setPickupTripCost] = useState(0);
  const [minimumOrder, setMinimumOrder] = useState(1);
  const [bulkFulfillmentMode, setBulkFulfillmentMode] = useState<BulkFulfillmentMode>('delivery');
  const [truckAvailability, setTruckAvailability] = useState<TruckAvailability>('unknown');
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
  const [shapeDepth, setShapeDepth] = useState(12);
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
      setUnitPreset('us');
      setLength(Number(sizeMatch[1]));
      setWidth(Number(sizeMatch[2]));
      setDepth(12);
      setLengthUnit('ft');
      setWidthUnit('ft');
      setDepthUnit('in');
      setGridLength(Number(sizeMatch[1]));
      setGridWidth(Number(sizeMatch[2]));
    }
    if (slug === '40-qt-soil-bag-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(40); setBagUnit('dryQuart'); }
    if (slug === '1-cubic-foot-soil-bag-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(1); setBagUnit('ft3'); }
    if (slug === '1-5-cubic-foot-soil-bag-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(1.5); setBagUnit('ft3'); }
    if (slug === '2-cubic-foot-soil-bag-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(2); setBagUnit('ft3'); }
    if (slug === 'liters-to-soil-bags-calculator') { setVolumeSource('manual'); setManualVolume(200); setManualVolumeUnit('liter'); setBagSize(50); setBagUnit('liter'); setUnitPreset('metric'); }
    if (slug === 'cubic-feet-to-soil-bags-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(2); setBagUnit('ft3'); }
    if (slug === 'tomato-spacing-raised-bed') setCrop('tomato');
    if (slug === 'pepper-spacing-raised-bed') setCrop('pepper');
    if (slug === 'lettuce-spacing-square-foot-garden') setCrop('lettuce');
    if (slug === 'carrot-spacing-square-foot-garden') setCrop('carrot');
    if (slug === 'cucumber-spacing-raised-bed') setCrop('cucumber');
    if (slug === 'basil-spacing-square-foot-garden') setCrop('basil');
    if (slug.endsWith('spacing-raised-bed') || slug.endsWith('spacing-square-foot-garden')) { setTab('spacing'); setGridLength(4); setGridWidth(8); }
    if (slug === 'round-raised-bed-soil-calculator') { setShapeMode('round'); setShapeA(6); setShapeDepth(12); setTab('shapes'); }
    if (slug === 'l-shaped-raised-bed-soil-calculator') { setShapeMode('lShape'); setShapeA(8); setShapeB(6); setShapeC(4); setShapeD(3); setShapeDepth(12); setTab('shapes'); }
    if (slug === 'u-shaped-raised-bed-soil-calculator') { setShapeMode('uShape'); setShapeA(8); setShapeB(6); setShapeC(4); setShapeD(3); setShapeDepth(12); setTab('shapes'); }
    if (slug === 'spring-raised-bed-checklist') { setTopOffDepth(2); setTab('topoff'); }
    if (slug === 'fall-raised-bed-soil-checklist') { setTopOffDepth(1); setTab('topoff'); }
    if (slug === 'grow-bag-soil-calculator') { setContainerMode('grow'); setTab('containers'); }
    if (slug === 'container-soil-calculator') { setContainerMode('rect'); setTab('containers'); }
    if (slug === 'how-much-soil-for-4x8-raised-bed') { setUnitPreset('us'); setLength(4); setWidth(8); setDepth(12); setLengthUnit('ft'); setWidthUnit('ft'); setDepthUnit('in'); setTab('raised'); }
    const fourByEightDepthMatch = slug.match(/^4x8-raised-bed-(6|8|10|12|18|24)-inches-soil$/);
    if (fourByEightDepthMatch) { setUnitPreset('us'); setLength(4); setWidth(8); setDepth(Number(fourByEightDepthMatch[1])); setLengthUnit('ft'); setWidthUnit('ft'); setDepthUnit('in'); setTab('raised'); }
    if (slug === 'raised-bed-cubic-feet-calculator') { setUnitPreset('us'); setLength(4); setWidth(8); setDepth(12); setLengthUnit('ft'); setWidthUnit('ft'); setDepthUnit('in'); setTab('raised'); }
    if (slug === 'how-many-bags-of-soil-for-raised-bed') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(2); setBagUnit('ft3'); setTab('bags'); }
    if (slug === 'cubic-yards-to-soil-bags-calculator') { setVolumeSource('manual'); setManualVolume(1); setManualVolumeUnit('yd3'); setBagSize(2); setBagUnit('ft3'); setTab('bags'); }
    if (slug === 'liters-to-cubic-feet-soil-calculator') { setVolumeSource('manual'); setManualVolume(200); setManualVolumeUnit('liter'); setBagSize(50); setBagUnit('liter'); setUnitPreset('metric'); setTab('bags'); }
    if (slug === 'how-many-40-lb-bags-of-soil-do-i-need') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setBagSize(40); setBagUnit('lb'); setTab('bags'); }
    if (slug === 'raised-bed-cost-calculator' || slug === 'raised-bed-soil-cost-calculator') { setTab('cost'); }
    if (slug === 'cheapest-way-to-fill-raised-beds') { setVolumeSource('manual'); setManualVolume(64); setManualVolumeUnit('ft3'); setTab('bulk'); setMinimumOrder(2); }
    if (slug === 'how-much-bulk-soil-for-raised-beds' || slug === 'cubic-yards-of-soil-for-raised-beds') { setNumberOfBeds(2); setSettling(10); setTab('bulk'); }
    if (slug === 'compost-topsoil-mix-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setMix('custom'); setCustomTopsoil(50); setCustomCompost(50); setCustomPotting(0); setTab('mix'); }
    if (slug === 'mels-mix-calculator') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setMix('melsMix'); setTab('mix'); }
    if (slug === 'how-much-compost-for-raised-bed') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setMix('basic'); setTab('mix'); }
    if (slug === 'topsoil-compost-ratio-raised-bed') { setVolumeSource('manual'); setManualVolume(32); setManualVolumeUnit('ft3'); setMix('basic'); setTab('mix'); }
    if (slug === 'planter-soil-volume-calculator') { setContainerMode('rect'); setTab('containers'); }
    if (slug === '10-gallon-grow-bag-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(10); setGrowQtyOne(6); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === '20-gallon-grow-bag-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(20); setGrowQtyOne(4); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === '5-gallon-bucket-soil-calculator') { setContainerMode('grow'); setGrowGallonsOne(5); setGrowQtyOne(10); setGrowGallonsTwo(0); setGrowQtyTwo(0); setTab('containers'); }
    if (slug === 'how-much-soil-for-45-six-inch-pots') { setContainerMode('round'); setContainerWidth(6); setContainerDepth(6); setContainerQty(45); setTab('containers'); }
    if (slug === '4x8-raised-bed-planting-layout' || slug === 'how-many-tomato-plants-in-4x8-raised-bed') { setTab('spacing'); setGridLength(4); setGridWidth(8); setCrop('tomato'); }
    if (slug === 'raised-bed-depth-for-tomatoes') { setTab('depth'); setCrop('tomato'); setDepth(12); }
    if (slug === 'raised-bed-depth-for-carrots') { setTab('depth'); setCrop('carrot'); }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      applyPagePreset(presetSlug);
      const params = new URLSearchParams(window.location.search);
      const nextTab = params.get('tab') as Tab | null;
      if (nextTab && ['raised', 'bags', 'bulk', 'mix', 'containers', 'spacing', 'topoff', 'depth', 'cost', 'multi', 'shapes'].includes(nextTab)) setTab(nextTab);
      const numericSetters: [string, (value: number) => void][] = [
        ['l', setLength], ['w', setWidth], ['d', setDepth], ['beds', setNumberOfBeds], ['free', setFreeboard], ['settle', setSettling],
        ['bagSize', setBagSize], ['bagPrice', setBagPrice], ['mv', setManualVolume], ['bulkPrice', setBulkPrice], ['delivery', setDeliveryFee], ['pickupCost', setPickupTripCost], ['minOrder', setMinimumOrder],
        ['ctop', setCustomTopsoil], ['ccomp', setCustomCompost], ['cpot', setCustomPotting],
        ['g1gal', setGrowGallonsOne], ['g1qty', setGrowQtyOne], ['g2gal', setGrowGallonsTwo], ['g2qty', setGrowQtyTwo],
        ['contL', setContainerLength], ['contW', setContainerWidth], ['contD', setContainerDepth], ['bottomD', setBottomDiameter], ['contQty', setContainerQty],
        ['gridL', setGridLength], ['gridW', setGridWidth], ['topoff', setTopOffDepth],
        ['shapeA', setShapeA], ['shapeB', setShapeB], ['shapeC', setShapeC], ['shapeD', setShapeD], ['shapeDepth', setShapeDepth],
        ['costKit', setCostKit], ['costCompost', setCostCompost], ['costMulch', setCostMulch], ['costHardware', setCostHardware], ['tax', setTaxPercent],
        ['m2l', setMultiLengthTwo], ['m2w', setMultiWidthTwo], ['m2d', setMultiDepthTwo], ['m2q', setMultiQtyTwo],
        ['m3l', setMultiLengthThree], ['m3w', setMultiWidthThree], ['m3d', setMultiDepthThree], ['m3q', setMultiQtyThree],
        ['c1l', setMultiContainerLengthOne], ['c1w', setMultiContainerWidthOne], ['c1d', setMultiContainerDepthOne], ['c1q', setMultiContainerQtyOne],
        ['c2l', setMultiContainerLengthTwo], ['c2w', setMultiContainerWidthTwo], ['c2d', setMultiContainerDepthTwo], ['c2q', setMultiContainerQtyTwo],
      ];
      numericSetters.forEach(([key, setter]) => {
        const raw = params.get(key);
        if (raw !== null && Number.isFinite(Number(raw))) setter(safeNonNegativeNumber(Number(raw)));
      });
      const lu = params.get('lu') as LengthUnit | null;
      const wu = params.get('wu') as LengthUnit | null;
      const du = params.get('du') as LengthUnit | null;
      const bu = params.get('bu') as BagUnit | null;
      const vu = params.get('vu') as VolumeUnit | null;
      const vs = params.get('vs') as VolumeSource | null;
      const cur = params.get('cur') as CurrencyCode | null;
      const nextUnitPreset = params.get('up') as UnitPreset | null;
      const nextCrop = params.get('crop');
      const nextShape = params.get('shape') as ShapeMode | null;
      const nextFulfillment = params.get('fulfillment') as BulkFulfillmentMode | null;
      const nextTruck = params.get('truck') as TruckAvailability | null;
      const nextMix = params.get('mix') as keyof typeof SOIL_MIX_TEMPLATES | 'custom' | null;
      const nextContainerMode = params.get('container') as ContainerMode | null;
      if (nextCrop && CROPS.some((item) => item.id === nextCrop)) setCrop(nextCrop);
      if (nextShape && ['round', 'lShape', 'uShape'].includes(nextShape)) setShapeMode(nextShape);
      if (nextFulfillment && ['delivery', 'pickup'].includes(nextFulfillment)) setBulkFulfillmentMode(nextFulfillment);
      if (nextTruck && ['unknown', 'available', 'notAvailable'].includes(nextTruck)) setTruckAvailability(nextTruck);
      if (nextMix && (nextMix === 'custom' || Object.keys(SOIL_MIX_TEMPLATES).includes(nextMix))) setMix(nextMix);
      if (nextContainerMode && ['grow', 'rect', 'round', 'taper'].includes(nextContainerMode)) setContainerMode(nextContainerMode);
      if (nextUnitPreset && ['us', 'metric'].includes(nextUnitPreset)) setUnitPreset(nextUnitPreset);
      if (lu && ['ft', 'in', 'cm', 'm'].includes(lu)) setLengthUnit(lu);
      if (wu && ['ft', 'in', 'cm', 'm'].includes(wu)) setWidthUnit(wu);
      if (du && ['ft', 'in', 'cm', 'm'].includes(du)) setDepthUnit(du);
      if (bu && ['ft3', 'yd3', 'liter', 'dryQuart', 'gallon', 'lb', 'kg'].includes(bu)) setBagUnit(bu);
      if (vu && ['ft3', 'yd3', 'liter', 'dryQuart', 'gallon'].includes(vu)) setManualVolumeUnit(vu);
      if (vs && ['bed', 'manual'].includes(vs)) setVolumeSource(vs);
      if (cur && ['USD', 'CAD', 'GBP', 'AUD', 'EUR'].includes(cur)) setCurrency(cur);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [applyPagePreset, presetSlug]);

  function applyUnitPreset(nextPreset: UnitPreset) {
    setUnitPreset(nextPreset);
    if (nextPreset === 'metric') {
      setLength(convertLengthInput(length, lengthUnit, 'cm'));
      setWidth(convertLengthInput(width, widthUnit, 'cm'));
      setDepth(convertLengthInput(depth, depthUnit, 'cm'));
      setFreeboard(convertLengthInput(freeboard, depthUnit, 'cm'));
      setTopOffDepth(convertLengthInput(topOffDepth, depthUnit, 'cm'));
      setLengthUnit('cm');
      setWidthUnit('cm');
      setDepthUnit('cm');
      setManualVolume(convertVolumeInput(manualVolume, manualVolumeUnit, 'liter'));
      setManualVolumeUnit('liter');
      if (bagUnit !== 'lb' && bagUnit !== 'kg') {
        setBagSize(convertVolumeInput(bagSize, bagUnit, 'liter'));
        setBagUnit('liter');
      }
    } else {
      setLength(convertLengthInput(length, lengthUnit, 'ft'));
      setWidth(convertLengthInput(width, widthUnit, 'ft'));
      setDepth(convertLengthInput(depth, depthUnit, 'in'));
      setFreeboard(convertLengthInput(freeboard, depthUnit, 'in'));
      setTopOffDepth(convertLengthInput(topOffDepth, depthUnit, 'in'));
      setLengthUnit('ft');
      setWidthUnit('ft');
      setDepthUnit('in');
      setManualVolume(convertVolumeInput(manualVolume, manualVolumeUnit, 'ft3'));
      setManualVolumeUnit('ft3');
      if (bagUnit !== 'lb' && bagUnit !== 'kg') {
        setBagSize(convertVolumeInput(bagSize, bagUnit, 'ft3'));
        setBagUnit('ft3');
      }
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

  const manualVolumeResult = useMemo(() => {
    const volumeFt3 = volumeToFt3(manualVolume, manualVolumeUnit);
    return makeVolumeResult(volumeFt3, volumeFt3, []);
  }, [manualVolume, manualVolumeUnit]);
  const sourceVolume = (tab === 'bags' || tab === 'bulk' || tab === 'mix') && volumeSource === 'manual' ? manualVolumeResult : bedResult;
  const mixInput: SoilMixInput = useMemo(() => {
    const withBagEstimate = (components: readonly SoilMixComponent[]): SoilMixComponent[] => components.map((component) => ({
      ...component,
      bagSize,
      bagUnit,
      bagPrice,
    }));
    if (mix !== 'custom') {
      const template = SOIL_MIX_TEMPLATES[mix as keyof typeof SOIL_MIX_TEMPLATES];
      return { ...template, components: withBagEstimate(template.components) };
    }
    const components: SoilMixComponent[] = [
      { id: 'topsoil', name: 'Topsoil', ratioPercent: customTopsoil },
      { id: 'compost', name: 'Compost', ratioPercent: customCompost },
      { id: 'pottingMix', name: 'Potting mix or aeration', ratioPercent: customPotting },
    ];
    return { templateId: 'custom', components: withBagEstimate(components) };
  }, [mix, customTopsoil, customCompost, customPotting, bagSize, bagUnit, bagPrice]);
  const containerResult = useMemo(() => {
    if (containerMode === 'grow') return calculateGrowBagVolume({ gallons: growGallonsOne * wholeQuantity(growQtyOne) + growGallonsTwo * wholeQuantity(growQtyTwo), quantity: 1 });
    if (containerMode === 'round') return calculateRoundPotVolume({ diameter: containerWidth, height: containerDepth, unit: 'in', quantity: containerQty });
    if (containerMode === 'taper') return calculateTaperedPotVolume({ topDiameter: containerWidth, bottomDiameter, height: containerDepth, unit: 'in', quantity: containerQty });
    return calculateRectangularPlanterVolume({ length: containerLength, width: containerWidth, depth: containerDepth, unit: 'in', quantity: containerQty });
  }, [containerMode, growGallonsOne, growQtyOne, growGallonsTwo, growQtyTwo, containerLength, containerWidth, containerDepth, bottomDiameter, containerQty]);
  const topOffResult = useMemo(() => calculateAnnualTopOff({ length, width, topOffDepth, lengthUnit, widthUnit, topOffDepthUnit: depthUnit, numberOfBeds }), [length, width, topOffDepth, lengthUnit, widthUnit, depthUnit, numberOfBeds]);
  const topOffMaterials = useMemo(() => calculateTopOffMaterials(topOffResult.finalVolumeFt3, 100, 25), [topOffResult.finalVolumeFt3]);
  const spacingResult = useMemo(() => calculateSquareFootSpacing({ lengthFt: gridLength, widthFt: gridWidth, cropId: crop }), [gridLength, gridWidth, crop]);
  const depthResult = useMemo(() => checkDepthSuitability(depthUnit === 'in' ? depth : depthUnit === 'cm' ? depth / 2.54 : depthUnit === 'ft' ? depth * 12 : depth * 39.3701, crop), [depth, depthUnit, crop]);
  const shapeResult = useMemo(() => {
    if (shapeMode === 'round') return calculateRoundRaisedBedVolume({ diameter: shapeA, depth: shapeDepth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
    if (shapeMode === 'lShape') return calculateLShapedRaisedBedVolume({ outerLength: shapeA, outerWidth: shapeB, cutoutLength: shapeC, cutoutWidth: shapeD, depth: shapeDepth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
    return calculateUShapedRaisedBedVolume({ outerLength: shapeA, outerWidth: shapeB, innerLength: shapeC, innerWidth: shapeD, depth: shapeDepth, unit: 'ft', depthUnit: 'in', numberOfBeds, settlingAllowancePercent: settling });
  }, [shapeMode, shapeA, shapeB, shapeC, shapeD, shapeDepth, numberOfBeds, settling]);
  const multiResult = useMemo(() => calculateMultipleRaisedBedVolume([
    { length, width, depth, lengthUnit, widthUnit, depthUnit, numberOfBeds, freeboard, freeboardUnit: depthUnit, settlingAllowancePercent: settling },
    { length: multiLengthTwo, width: multiWidthTwo, depth: multiDepthTwo, lengthUnit: 'ft', widthUnit: 'ft', depthUnit: 'in', numberOfBeds: multiQtyTwo, freeboard: 0, freeboardUnit: 'in', settlingAllowancePercent: settling },
    { length: multiLengthThree, width: multiWidthThree, depth: multiDepthThree, lengthUnit: 'ft', widthUnit: 'ft', depthUnit: 'in', numberOfBeds: multiQtyThree, freeboard: 0, freeboardUnit: 'in', settlingAllowancePercent: settling },
  ]), [length, width, depth, lengthUnit, widthUnit, depthUnit, numberOfBeds, freeboard, settling, multiLengthTwo, multiWidthTwo, multiDepthTwo, multiQtyTwo, multiLengthThree, multiWidthThree, multiDepthThree, multiQtyThree]);
  const multiContainerResult = useMemo(() => calculateMultipleRectangularContainerVolume([
    { length: multiContainerLengthOne, width: multiContainerWidthOne, depth: multiContainerDepthOne, unit: 'in', quantity: multiContainerQtyOne },
    { length: multiContainerLengthTwo, width: multiContainerWidthTwo, depth: multiContainerDepthTwo, unit: 'in', quantity: multiContainerQtyTwo },
  ]), [multiContainerLengthOne, multiContainerWidthOne, multiContainerDepthOne, multiContainerQtyOne, multiContainerLengthTwo, multiContainerWidthTwo, multiContainerDepthTwo, multiContainerQtyTwo]);
  const multiCombinedResult = useMemo(() => makeVolumeResult(
    multiResult.baseVolumeFt3 + multiContainerResult.baseVolumeFt3,
    multiResult.finalVolumeFt3 + multiContainerResult.finalVolumeFt3,
    [...multiResult.warnings, ...multiContainerResult.warnings],
  ), [multiResult, multiContainerResult]);
  const symbol = currencySymbol(currency);
  const activeVolume = tab === 'containers' ? containerResult : tab === 'topoff' ? topOffResult : tab === 'shapes' ? shapeResult : tab === 'multi' ? multiCombinedResult : (tab === 'bags' || tab === 'bulk' || tab === 'mix') ? sourceVolume : bedResult;
  const mixBreakdownVolume = tab === 'mix' ? sourceVolume : activeVolume;
  const mixRows: MixBreakdownResult[] = useMemo(() => calculateSoilMix(mixBreakdownVolume.finalVolumeFt3, mixInput), [mixBreakdownVolume.finalVolumeFt3, mixInput]);
  const mixTotalCost = mixRows.reduce((total: number, row: MixBreakdownResult) => total + (row.cost ?? 0), 0);
  const activeBagResult = useMemo(() => calculateSoilBags(activeVolume.finalVolumeFt3, { bagSize, bagUnit, bagPrice, currency }), [activeVolume.finalVolumeFt3, bagSize, bagUnit, bagPrice, currency]);
  const activeBulkResult = useMemo(() => compareBulkVsBags(activeVolume.finalVolumeFt3, { bagSize, bagUnit, bagPrice, currency }, { pricePerCubicYard: bulkPrice, deliveryFee, pickupTripCost, minimumOrderYards: minimumOrder, fulfillmentMode: bulkFulfillmentMode, truckAvailability, currency }), [activeVolume.finalVolumeFt3, bagSize, bagUnit, bagPrice, currency, bulkPrice, deliveryFee, pickupTripCost, minimumOrder, bulkFulfillmentMode, truckAvailability]);
  const costResult = useMemo(() => estimateRaisedBedProjectCost({
    soilCost: activeBagResult.totalCost ?? 0,
    lumberOrKitCost: costKit,
    compostCost: costCompost,
    mulchCost: costMulch,
    hardwareCost: costHardware,
    deliveryFee,
    taxPercent,
    numberOfBeds,
    currency,
  }), [activeBagResult.totalCost, costKit, costCompost, costMulch, costHardware, deliveryFee, taxPercent, numberOfBeds, currency]);
  const activeBagLine = activeBagResult.canEstimateBags ? `${activeBagResult.bagsNeeded} × ${bagSize} ${bagUnit}` : 'Package volume required for weight-only bag labels';
  const activeBagCostLine = activeBagResult.canEstimateBags ? `${symbol}${fmt(activeBagResult.totalCost ?? 0)}` : 'Not estimated from lb/kg labels';
  const isVolumeTask = tab !== 'spacing' && tab !== 'depth';
  const activeVolumeWarnings = tab === 'containers' ? containerResult.warnings
    : tab === 'topoff' ? topOffResult.warnings
    : tab === 'shapes' ? shapeResult.warnings
    : tab === 'multi' ? multiCombinedResult.warnings
    : (tab === 'bags' || tab === 'bulk' || tab === 'mix') ? sourceVolume.warnings
    : bedResult.warnings;
  const scopedWarnings = isVolumeTask
    ? [...activeVolumeWarnings, ...activeBagResult.warnings, ...activeBulkResult.warnings, ...mixRows.flatMap((row) => row.warnings), ...(tab === 'cost' ? costResult.warnings : [])]
    : [];
  const warnings = Array.from(new Map(scopedWarnings.map((warning) => [warningKey(warning), warning])).values());
  const needsRaisedVolumeInputs = tab === 'raised' || tab === 'cost' || tab === 'multi' || ((tab === 'bags' || tab === 'bulk' || tab === 'mix') && volumeSource === 'bed');
  const needsManualVolumeInput = (tab === 'bags' || tab === 'bulk' || tab === 'mix') && volumeSource === 'manual';
  const validationMessages = [
    needsRaisedVolumeInputs && (length <= 0 || width <= 0 || depth <= 0) ? 'Enter raised bed length, width, and depth greater than zero for the current mode.' : '',
    needsManualVolumeInput && manualVolume <= 0 ? 'Enter a manual soil volume greater than zero for this volume-source mode.' : '',
    tab === 'topoff' && (length <= 0 || width <= 0 || topOffDepth <= 0) ? 'Enter top-off length, width, and top-off depth greater than zero.' : '',
    tab === 'depth' && depth <= 0 ? 'Enter bed depth greater than zero for crop-depth suitability.' : '',
    tab === 'shapes' && (shapeA <= 0 || shapeDepth <= 0) ? 'Enter positive shape dimensions and depth for the current shape estimate.' : '',
    tab === 'containers' && activeVolume.finalVolumeFt3 <= 0 ? 'Enter positive container dimensions or grow-bag quantities to estimate container soil.' : '',
    tab === 'spacing' && (gridLength <= 0 || gridWidth <= 0) ? 'Enter grid length and width above zero to estimate planting squares.' : '',
    isVolumeTask && bagSize <= 0 ? 'Bag size must be greater than zero.' : '',
    isVolumeTask && !activeBagResult.canEstimateBags ? 'Enter package volume from the label to estimate bags. Weight-only bag labels cannot be converted reliably.' : '',
    isVolumeTask && bulkFulfillmentMode === 'pickup' && truckAvailability === 'notAvailable' ? 'Pickup selected without a truck or trailer. Delivery or bagged soil may be more practical.' : '',
    tab === 'mix' && customTopsoil + customCompost + customPotting !== 100 ? 'Custom soil mix percentages must add up to 100%.' : '',
    isVolumeTask && activeVolume.finalVolumeFt3 <= 0 ? 'Current inputs produce 0 soil volume. Check the current mode quantities and dimensions before buying materials.' : '',
    isVolumeTask && activeBulkResult.overbuyFt3 > activeVolume.finalVolumeFt3 && minimumOrder > activeBulkResult.requiredYd3 ? 'Your bulk minimum order is much larger than the required volume.' : '',
  ].filter(Boolean);

  const modeSpecificLines = [
    isVolumeTask ? `Mix estimate for active volume: ${mixRows.map((row) => `${row.name} ${fmt(row.volumeFt3)} ft³ / ${row.bagsNeeded ?? 'label volume required'} bags`).join('; ')}` : '',
    isVolumeTask ? `Mix bag cost estimate: ${symbol}${fmt(mixTotalCost)}` : '',
    tab === 'topoff' ? `Top-off compost: ${fmt(topOffMaterials.compostFt3)} ft³; optional mulch: ${fmt(topOffMaterials.optionalMulchFt3)} ft³` : '',
    tab === 'spacing' ? `Planting grid: ${spacingResult.totalSquares} squares; ${plantText(spacingResult.totalPlants)} plants for ${spacingResult.crop?.name ?? 'custom crop'}` : '',
    tab === 'depth' ? `Depth status: ${depthResult.status}; ${depthResult.message}` : '',
  ].filter(Boolean).join('\n');
  const volumeShoppingList = `BedSoil shopping list\nActive tool: ${tab}\nSoil volume: ${fmt(activeVolume.finalVolumeFt3)} ft³ (${fmt(activeVolume.volumeYd3)} yd³ / ${fmt(activeVolume.volumeLiters)} L)\nBags: ${activeBagLine}\nEstimated bag cost: ${activeBagCostLine}\nBulk mode: ${activeBulkResult.fulfillmentMode}; service cost: ${symbol}${fmt(activeBulkResult.serviceCost)}; truck/trailer: ${activeBulkResult.truckAvailability}\nBulk estimate: ${symbol}${fmt(activeBulkResult.bulkTotalCost)}\nProject cost estimate: ${tab === 'cost' ? `${symbol}${fmt(costResult.total)}` : 'Open the cost tab for project-cost inputs'}\n${modeSpecificLines}\nWarnings:\n${warningsText(warnings)}`;
  const spacingShoppingList = `BedSoil spacing plan\nActive tool: ${tab}\nGrid: ${gridLength} ft × ${gridWidth} ft = ${spacingResult.totalSquares} square-foot cells\nCrop: ${spacingResult.crop?.name ?? 'custom crop'}\nPlants per square foot: ${plantText(spacingResult.plantsPerSquareFoot)}\nEstimated plants: ${plantText(spacingResult.totalPlants)}\nBoundary: verify seed packet spacing, mature plant size, support plan, airflow, and local Extension guidance before planting.`;
  const depthShoppingList = `BedSoil depth check\nActive tool: ${tab}\nCrop: ${spacingResult.crop?.name ?? 'custom crop'}\nBed depth: ${depth} ${depthUnit}\nStatus: ${depthResult.status}\nResult: ${depthResult.message}\nBoundary: depth suitability depends on variety, native soil or hard surface, drainage, irrigation, and local Extension guidance.`;
  const shoppingList = tab === 'spacing' ? spacingShoppingList : tab === 'depth' ? depthShoppingList : volumeShoppingList;
  const flowNextSteps = flowNextStepsForMode(tab);

  function createShareUrl() {
    const params = new URLSearchParams({
      tab, up: unitPreset, vs: volumeSource, mv: String(manualVolume), vu: manualVolumeUnit,
      l: String(length), w: String(width), d: String(depth), lu: lengthUnit, wu: widthUnit, du: depthUnit, beds: String(numberOfBeds), free: String(freeboard), settle: String(settling),
      bagSize: String(bagSize), bagPrice: String(bagPrice), bu: bagUnit,
      bulkPrice: String(bulkPrice), delivery: String(deliveryFee), pickupCost: String(pickupTripCost), minOrder: String(minimumOrder), fulfillment: bulkFulfillmentMode, truck: truckAvailability, cur: currency,
      mix, ctop: String(customTopsoil), ccomp: String(customCompost), cpot: String(customPotting),
      container: containerMode, g1gal: String(growGallonsOne), g1qty: String(growQtyOne), g2gal: String(growGallonsTwo), g2qty: String(growQtyTwo), contL: String(containerLength), contW: String(containerWidth), contD: String(containerDepth), bottomD: String(bottomDiameter), contQty: String(containerQty),
      gridL: String(gridLength), gridW: String(gridWidth), topoff: String(topOffDepth), crop,
      shape: shapeMode, shapeA: String(shapeA), shapeB: String(shapeB), shapeC: String(shapeC), shapeD: String(shapeD), shapeDepth: String(shapeDepth),
      costKit: String(costKit), costCompost: String(costCompost), costMulch: String(costMulch), costHardware: String(costHardware), tax: String(taxPercent),
      m2l: String(multiLengthTwo), m2w: String(multiWidthTwo), m2d: String(multiDepthTwo), m2q: String(multiQtyTwo), m3l: String(multiLengthThree), m3w: String(multiWidthThree), m3d: String(multiDepthThree), m3q: String(multiQtyThree),
      c1l: String(multiContainerLengthOne), c1w: String(multiContainerWidthOne), c1d: String(multiContainerDepthOne), c1q: String(multiContainerQtyOne), c2l: String(multiContainerLengthTwo), c2w: String(multiContainerWidthTwo), c2d: String(multiContainerDepthTwo), c2q: String(multiContainerQtyTwo),
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}#calculator`;
  }

  async function copyShoppingList() {
    const ok = await writeClipboardText(shoppingList);
    trackCalculatorEvent(ok ? 'copy_shopping_list' : 'copy_shopping_list_failed', { tab });
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1200);
  }

  async function copyShareUrl() {
    const url = createShareUrl();
    const ok = await writeClipboardText(url);
    if (ok) window.history.replaceState(null, '', url.replace(window.location.origin, ''));
    trackCalculatorEvent(ok ? 'copy_share_url' : 'copy_share_url_failed', { tab });
    setShared(ok);
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
    const csvRows: [string, string | number][] = tab === 'spacing' ? [
      ['item', 'value'],
      ['mode', tab],
      ['grid_length_ft', gridLength],
      ['grid_width_ft', gridWidth],
      ['total_squares', spacingResult.totalSquares],
      ['crop', spacingResult.crop?.name ?? 'custom crop'],
      ['plants_per_square', Array.isArray(spacingResult.plantsPerSquareFoot) ? spacingResult.plantsPerSquareFoot.join('-') : spacingResult.plantsPerSquareFoot],
      ['total_plants', Array.isArray(spacingResult.totalPlants) ? spacingResult.totalPlants.join('-') : spacingResult.totalPlants],
    ] : tab === 'depth' ? [
      ['item', 'value'],
      ['mode', tab],
      ['crop', spacingResult.crop?.name ?? 'custom crop'],
      ['depth_value', depth],
      ['depth_unit', depthUnit],
      ['status', depthResult.status],
      ['message', depthResult.message],
    ] : [
      ['item', 'value'],
      ['volume_ft3', activeVolume.finalVolumeFt3],
      ['volume_yd3', activeVolume.volumeYd3],
      ['volume_liters', activeVolume.volumeLiters],
      ['bags', activeBagResult.canEstimateBags ? activeBagResult.bagsNeeded : 'package volume required'],
      ['bag_cost', activeBagResult.totalCost ?? 0],
      ['bulk_cost', activeBulkResult.bulkTotalCost],
      ['project_cost', tab === 'cost' ? costResult.total : 'open cost tab for project-cost inputs'],
    ];
    const csv = csvRows.map((row) => row.map(csvValue).join(',')).join('\n');
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

  const raisedBedSourceControls = (
    <div className="full-width embedded-source-panel" aria-label="Raised bed dimensions used by this result">
      <p className="muted-card">Raised bed source: these dimensions feed any mode set to use raised bed dimensions.</p>
      <div className="input-grid nested-input-grid">
        <NumberInput label={`Length (${lengthUnit})`} value={length} setValue={setLength} step={0.25} />
        <SelectInput label="Length unit" value={lengthUnit} setValue={setLengthUnit} options={lengthUnitOptions} />
        <NumberInput label={`Width (${widthUnit})`} value={width} setValue={setWidth} step={0.25} />
        <SelectInput label="Width unit" value={widthUnit} setValue={setWidthUnit} options={lengthUnitOptions} />
        <NumberInput label={`Depth (${depthUnit})`} value={depth} setValue={setDepth} />
        <SelectInput label="Depth unit" value={depthUnit} setValue={setDepthUnit} options={lengthUnitOptions} />
        <NumberInput label="Number of beds" value={numberOfBeds} setValue={setNumberOfBeds} />
      </div>
      <details className="advanced-panel">
        <summary>Advanced bed assumptions: freeboard and settling</summary>
        <div className="input-grid nested-input-grid">
          <NumberInput label={`Freeboard (${depthUnit})`} value={freeboard} setValue={setFreeboard} step={0.5} />
          <NumberInput label="Settling allowance (%)" value={settling} setValue={setSettling} />
        </div>
      </details>
    </div>
  );


  return (
    <section id="calculator" className="calculator-shell workspace-shell">
      <div className="workspace-header">
        <div>
          <p className="eyebrow">Interactive raised bed calculator</p>
          <h2>Enter bed size. Get soil volume, bags, cost, and a shopping list.</h2>
          <p className="muted-card">Default example: one 4×8×12 in bed, 10% settling, and 2 ft³ bags. Results update automatically as inputs change.</p>
        </div>
        <span className="status-badge status-info">Planning estimate</span>
      </div>

      <div className="sxo-start-strip" aria-label="Fast path from search intent to calculator result">
        {fastPathByTab[tab].map((step) => (
          <div key={step.title}><b>{step.title}</b><span>{step.detail}</span></div>
        ))}
      </div>

      <div className="tabs primary-tabs" aria-label="Primary calculator tabs">
        {(['raised', 'bags', 'bulk'] as const).map((item) => (
          <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); trackCalculatorEvent('tab_change', { tab: item }); }}>{item}</button>
        ))}
      </div>
      <details className="more-tools" open={(['mix', 'containers', 'spacing', 'topoff', 'depth', 'cost', 'multi', 'shapes'] as readonly Tab[]).includes(tab)}>
        <summary>More planners: mix, containers, spacing, top-off, depth, cost, multi-bed, shapes</summary>
        <div className="tabs secondary-tabs" aria-label="More planning tools">
          {(['mix', 'containers', 'spacing', 'topoff', 'depth', 'cost', 'multi', 'shapes'] as const).map((item) => (
            <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); trackCalculatorEvent('tab_change', { tab: item }); }}>{item}</button>
          ))}
        </div>
      </details>

      <div className="preset-row">
        <SelectInput label="Unit preset" value={unitPreset} setValue={applyUnitPreset} options={[{ label: 'US / imperial', value: 'us' }, { label: 'Metric', value: 'metric' }]} />
        <SelectInput label="Currency" value={currency} setValue={setCurrency} options={currencyOptions} />
        {RAISED_BED_PRESETS.map((presetDepth) => (
          <button type="button" key={presetDepth} onClick={() => { setUnitPreset('us'); setLength(4); setWidth(8); setDepth(presetDepth); setLengthUnit('ft'); setWidthUnit('ft'); setDepthUnit('in'); setTab('raised'); }}>4×8×{presetDepth} in</button>
        ))}
      </div>

      <div className="calculator-grid">
        <form className="input-grid control-panel" onSubmit={(event: FormSubmitEvent) => event.preventDefault()}>
          {tab === 'raised' && (
            <>
              <NumberInput label={`Length (${lengthUnit})`} value={length} setValue={setLength} step={0.25} />
              <SelectInput label="Length unit" value={lengthUnit} setValue={setLengthUnit} options={lengthUnitOptions} />
              <NumberInput label={`Width (${widthUnit})`} value={width} setValue={setWidth} step={0.25} />
              <SelectInput label="Width unit" value={widthUnit} setValue={setWidthUnit} options={lengthUnitOptions} />
              <NumberInput label={`Depth (${depthUnit})`} value={depth} setValue={setDepth} />
              <SelectInput label="Depth unit" value={depthUnit} setValue={setDepthUnit} options={lengthUnitOptions} />
              <NumberInput label="Number of beds" value={numberOfBeds} setValue={setNumberOfBeds} />
              <details className="advanced-panel full-width">
                <summary>Advanced assumptions: freeboard and settling</summary>
                <div className="input-grid nested-input-grid">
                  <NumberInput label={`Freeboard (${depthUnit})`} value={freeboard} setValue={setFreeboard} step={0.5} />
                  <NumberInput label="Settling allowance (%)" value={settling} setValue={setSettling} />
                </div>
                <div className="small-buttons" aria-label="Settling allowance presets">
                  {[0, 10, 15].map((value) => <button type="button" key={value} className={settling === value ? 'active' : ''} onClick={() => setSettling(value)}>{value}% settling</button>)}
                </div>
              </details>
            </>
          )}

          {tab === 'bags' && (
            <>

              <div className="full-width source-toggle" role="group" aria-label="Required volume source">
                <button type="button" className={volumeSource === 'bed' ? 'active' : ''} onClick={() => setVolumeSource('bed')}>Use raised bed dimensions</button>
                <button type="button" className={volumeSource === 'manual' ? 'active' : ''} onClick={() => setVolumeSource('manual')}>Enter total volume</button>
              </div>
              {volumeSource === 'manual' ? <><NumberInput label="Required volume" value={manualVolume} setValue={setManualVolume} step={0.1} /><SelectInput label="Volume unit" value={manualVolumeUnit} setValue={setManualVolumeUnit} options={volumeUnitOptions} /></> : raisedBedSourceControls}
              <NumberInput label="Bag size" value={bagSize} setValue={setBagSize} step={0.1} />
              <SelectInput label="Bag unit" value={bagUnit} setValue={setBagUnit} options={bagUnitOptions} />
              <NumberInput label={`Bag price (${symbol})`} value={bagPrice} setValue={setBagPrice} step={0.5} />
              <div className="full-width small-buttons">{BAG_PRESETS.map((preset) => <button type="button" key={preset.label} onClick={() => { setBagSize(preset.size); setBagUnit(preset.unit); }}>{preset.label}</button>)}</div>
            </>
          )}

          {tab === 'bulk' && (
            <>

              <div className="full-width source-toggle" role="group" aria-label="Required volume source">
                <button type="button" className={volumeSource === 'bed' ? 'active' : ''} onClick={() => setVolumeSource('bed')}>Use raised bed dimensions</button>
                <button type="button" className={volumeSource === 'manual' ? 'active' : ''} onClick={() => setVolumeSource('manual')}>Enter total volume</button>
              </div>
              {volumeSource === 'manual' ? <><NumberInput label="Required volume" value={manualVolume} setValue={setManualVolume} step={0.1} /><SelectInput label="Volume unit" value={manualVolumeUnit} setValue={setManualVolumeUnit} options={volumeUnitOptions} /></> : raisedBedSourceControls}
              <NumberInput label="Bag size" value={bagSize} setValue={setBagSize} step={0.1} />
              <SelectInput label="Bag unit" value={bagUnit} setValue={setBagUnit} options={bagUnitOptions} />
              <NumberInput label={`Bag price (${symbol})`} value={bagPrice} setValue={setBagPrice} step={0.5} />
              <NumberInput label={`Bulk price / yd³ (${symbol})`} value={bulkPrice} setValue={setBulkPrice} />
              <NumberInput label={`Delivery fee (${symbol})`} value={deliveryFee} setValue={setDeliveryFee} />
              <NumberInput label="Minimum order (yd³)" value={minimumOrder} setValue={setMinimumOrder} step={0.25} />
              <SelectInput label="Bulk fulfillment" value={bulkFulfillmentMode} setValue={setBulkFulfillmentMode} options={[{ label: 'Delivery', value: 'delivery' }, { label: 'Pickup / self-haul', value: 'pickup' }]} />
              {bulkFulfillmentMode === 'pickup' ? <><NumberInput label={`Pickup trip cost (${symbol})`} value={pickupTripCost} setValue={setPickupTripCost} /><SelectInput label="Truck or trailer available" value={truckAvailability} setValue={setTruckAvailability} options={[{ label: 'Not sure yet', value: 'unknown' }, { label: 'Available', value: 'available' }, { label: 'Not available', value: 'notAvailable' }]} /></> : <p className="full-width muted-card">Delivery mode uses the delivery fee in the bulk total. Switch to pickup if you plan to self-haul.</p>}
            </>
          )}

          {tab === 'mix' && (
            <>

              <div className="full-width source-toggle" role="group" aria-label="Required volume source">
                <button type="button" className={volumeSource === 'bed' ? 'active' : ''} onClick={() => setVolumeSource('bed')}>Use raised bed dimensions</button>
                <button type="button" className={volumeSource === 'manual' ? 'active' : ''} onClick={() => setVolumeSource('manual')}>Enter total volume</button>
              </div>
              {volumeSource === 'manual' ? <><NumberInput label="Required volume" value={manualVolume} setValue={setManualVolume} step={0.1} /><SelectInput label="Volume unit" value={manualVolumeUnit} setValue={setManualVolumeUnit} options={volumeUnitOptions} /></> : raisedBedSourceControls}
              <label className="full-width"><span>Mix template</span><select value={mix} onChange={(event: FieldChangeEvent) => setMix(event.target.value as keyof typeof SOIL_MIX_TEMPLATES | 'custom')}><option value="basic">Basic raised bed mix 60/30/10</option><option value="soilless">Compost + soilless mix 50/50</option><option value="melsMix">Mel&apos;s Mix style</option><option value="budgetFill">Budget fill</option><option value="custom">Custom ratio</option></select></label>
              {mix === 'custom' ? <><NumberInput label="Topsoil %" value={customTopsoil} setValue={setCustomTopsoil} /><NumberInput label="Compost %" value={customCompost} setValue={setCustomCompost} /><NumberInput label="Potting / aeration %" value={customPotting} setValue={setCustomPotting} /><p className="full-width muted-card">Custom total: {customTopsoil + customCompost + customPotting}%. It must equal 100%.</p></> : null}
            </>
          )}

          {tab === 'containers' && (
            <>
              <SelectInput label="Container type" value={containerMode} setValue={setContainerMode} options={[{ label: 'Grow bags', value: 'grow' }, { label: 'Rectangular planter', value: 'rect' }, { label: 'Round pot', value: 'round' }, { label: 'Tapered pot', value: 'taper' }]} />
              {containerMode === 'grow' ? (
                <>
                  <NumberInput label="Group 1 gallons" value={growGallonsOne} setValue={setGrowGallonsOne} />
                  <NumberInput label="Group 1 quantity" value={growQtyOne} setValue={setGrowQtyOne} step={1} />
                  <NumberInput label="Group 2 gallons" value={growGallonsTwo} setValue={setGrowGallonsTwo} />
                  <NumberInput label="Group 2 quantity" value={growQtyTwo} setValue={setGrowQtyTwo} step={1} />
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
              <label><span>Crop</span><select value={crop} onChange={(event: FieldChangeEvent) => setCrop(event.target.value)}>{CROPS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </>
          )}

          {tab === 'topoff' && (
            <>
              <NumberInput label={`Length (${lengthUnit})`} value={length} setValue={setLength} />
              <NumberInput label={`Width (${widthUnit})`} value={width} setValue={setWidth} />
              <NumberInput label={`Top-off depth (${depthUnit})`} value={topOffDepth} setValue={setTopOffDepth} step={0.5} />
              <div className="full-width small-buttons" aria-label="Top-off depth presets">{(depthUnit === 'ft' ? [1 / 12, 2 / 12, 3 / 12] : depthUnit === 'cm' ? [2.5, 5, 7.5] : depthUnit === 'm' ? [0.025, 0.05, 0.075] : [1, 2, 3]).map((value) => <button type="button" key={value} className={topOffDepth === value ? 'active' : ''} onClick={() => setTopOffDepth(value)}>{value} {depthUnit}</button>)}</div>
              <NumberInput label="Number of beds" value={numberOfBeds} setValue={setNumberOfBeds} />
            </>
          )}

          {tab === 'depth' && (
            <>
              <NumberInput label={`Bed depth (${depthUnit})`} value={depth} setValue={setDepth} />
              <SelectInput label="Depth unit" value={depthUnit} setValue={setDepthUnit} options={lengthUnitOptions} />
              <label><span>Crop</span><select value={crop} onChange={(event: FieldChangeEvent) => setCrop(event.target.value)}>{CROPS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </>
          )}

          {tab === 'cost' && (
            <>
              {raisedBedSourceControls}
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
              {raisedBedSourceControls}
              <p className="full-width muted-card">Row 1 uses the raised bed dimensions shown here. Add two optional raised-bed rows and optional container rows below.</p>
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
              <NumberInput label="Depth (in)" value={shapeDepth} setValue={setShapeDepth} />
              <NumberInput label="Quantity" value={numberOfBeds} setValue={setNumberOfBeds} />
              <div className="full-width small-buttons" aria-label="Settling allowance presets">{[0, 10, 15].map((value) => <button type="button" key={value} className={settling === value ? 'active' : ''} onClick={() => setSettling(value)}>{value}% settling</button>)}</div>
            </>
          )}

          <p className="full-width auto-status"><span className="status-badge status-success">Live calculation</span> Results update as inputs change.</p>
        </form>

        <aside className="result-panel result-focus" aria-live="polite">
          <div className="result-topline">
            <div>
              <p className="eyebrow">Focused result</p>
              <h2>{tab === 'spacing' ? 'Planting space estimate' : tab === 'depth' ? 'Depth suitability' : tab === 'cost' ? 'Project cost estimate' : 'Soil volume estimate'}</h2>
            </div>
            <span className="status-badge status-success">Updated</span>
          </div>

          <div className="main-result-card">
            <span>{tab === 'spacing' ? `${spacingResult.totalSquares} sq ft grid` : tab === 'depth' ? `Status: ${depthResult.status}` : tab === 'cost' ? `${symbol}${fmt(costResult.total)}` : `${fmt(activeVolume.finalVolumeFt3)} ft³`}</span>
            <strong>{tab === 'spacing' ? `${plantText(spacingResult.totalPlants)} plants` : tab === 'depth' ? depthResult.message : tab === 'cost' ? `${symbol}${fmt(costResult.costPerBed)} per bed` : `${fmt(activeVolume.volumeYd3)} yd³ · ${fmt(activeVolume.volumeLiters)} L`}</strong>
            <p>{tab === 'bags' || tab === 'bulk' || tab === 'mix' ? `Volume source: ${volumeSource === 'manual' ? `${manualVolume} ${manualVolumeUnit}` : 'raised bed dimensions'}.` : 'Results are planning estimates and should be checked against product labels and local conditions.'}</p>
          </div>

          <div className="button-row action-row quick-action-row" aria-label="Primary result actions">
            <button type="button" className="primary" onClick={copyShoppingList}>{copied ? 'Copied' : 'Copy shopping list'}</button>
            <button type="button" onClick={printResult}>Print / save as PDF</button>
            <button type="button" onClick={copyShareUrl}>{shared ? 'URL copied' : 'Copy share URL'}</button>
          </div>

          <div className="flow-result-completion" aria-label="Calculator completion flow">
            <p className="eyebrow">Finish this planning flow</p>
            <h3>Save the result, then choose the next calculator.</h3>
            <ol>
              <li>Copy or print the focused result before buying materials.</li>
              <li>Check warnings, package volume labels, and local delivery minimums.</li>
              <li>Use one next-step route below to continue the planning path.</li>
            </ol>
            <div className="flow-next-step-grid compact-flow-links">
              {flowNextSteps.map((step) => (
                <a key={step.href} href={step.href} onClick={() => trackCalculatorEvent('flow_next_step_click', { tab, target: step.href })}>
                  <span>{step.label}</span>
                  <small>{step.reason}</small>
                </a>
              ))}
            </div>
          </div>

          {isVolumeTask ? (
            <div className="result-card-grid volume-result-cards">
              <div className="result-card"><span>Bags needed</span><strong>{activeBagResult.canEstimateBags ? activeBagResult.bagsNeeded : 'Volume needed'}</strong><small>{activeBagResult.canEstimateBags ? `${bagSize} ${bagUnit} · leftover ${fmt(activeBagResult.leftoverFt3)} ft³` : 'Use package ft³, dry qt, L, or gal instead of lb/kg.'}</small></div>
              <div className="result-card"><span>Bag cost</span><strong>{activeBagResult.canEstimateBags ? `${symbol}${fmt(activeBagResult.totalCost ?? 0)}` : 'Not estimated'}</strong><small>{activeBagResult.canEstimateBags ? `${symbol}${fmt(activeBulkResult.bagCostPerFt3)} per ft³` : 'Weight-only bags need a volume label.'}</small></div>
              <div className="result-card"><span>Bulk order</span><strong>{fmt(activeBulkResult.bulkOrderYd3)} yd³</strong><small>{symbol}{fmt(activeBulkResult.bulkTotalCost)} · {activeBulkResult.fulfillmentMode} · {fmt(activeBulkResult.overbuyFt3)} ft³ extra</small></div>
              <div className="result-card"><span>Cost signal</span><strong>{recommendationLabel(activeBulkResult.recommendation)}</strong><small>{activeBulkResult.recommendation === 'notComparable' ? 'Enter positive volume and a package volume label.' : `Savings vs bags: ${symbol}${fmt(activeBulkResult.savings)}`}</small></div>
            </div>
          ) : tab === 'spacing' ? (
            <div className="result-card-grid task-result-cards" aria-label="Spacing result details">
              <div className="result-card"><span>Grid size</span><strong>{spacingResult.totalSquares} sq ft</strong><small>{gridLength} ft × {gridWidth} ft input</small></div>
              <div className="result-card"><span>Crop</span><strong>{spacingResult.crop?.name ?? 'Custom crop'}</strong><small>{spacingResult.crop?.notes ?? 'Check seed packet spacing.'}</small></div>
              <div className="result-card"><span>Plants per square</span><strong>{plantText(spacingResult.plantsPerSquareFoot)}</strong><small>Planning assumption, not a yield guarantee.</small></div>
              <div className="result-card"><span>Total plants</span><strong>{plantText(spacingResult.totalPlants)}</strong><small>Verify mature size, support, and airflow.</small></div>
            </div>
          ) : (
            <div className="result-card-grid task-result-cards" aria-label="Depth result details">
              <div className="result-card"><span>Crop</span><strong>{spacingResult.crop?.name ?? 'Custom crop'}</strong><small>Depth guidance is crop-specific.</small></div>
              <div className="result-card"><span>Bed depth</span><strong>{depth} {depthUnit}</strong><small>Converted internally to inches for the check.</small></div>
              <div className="result-card"><span>Status</span><strong>{depthResult.status}</strong><small>Planning estimate only.</small></div>
              <div className="result-card"><span>Boundary</span><strong>Verify locally</strong><small>Variety, surface, drainage, and irrigation matter.</small></div>
            </div>
          )}

          <AdSlot placement="result" />

          {isVolumeTask ? (
            <div className="metric-group" aria-label="Volume conversions">
              <h3>Volume conversions</h3>
              <div className="metric"><span>Base cubic feet</span><strong>{fmt(activeVolume.baseVolumeFt3)}</strong></div>
              <div className="metric"><span>Final cubic feet</span><strong>{fmt(activeVolume.finalVolumeFt3)}</strong></div>
              <div className="metric"><span>Cubic yards</span><strong>{fmt(activeVolume.volumeYd3)}</strong></div>
              <div className="metric"><span>Dry quarts</span><strong>{fmt(activeVolume.volumeDryQuarts)}</strong></div>
              <div className="metric"><span>Gallons</span><strong>{fmt(activeVolume.volumeGallons)}</strong></div>
            </div>
          ) : null}

          {isVolumeTask ? <div className="mini-table result-section"><h3>Mix breakdown for active volume</h3><p className="muted-card">This uses the soil volume shown in the focused result above, so container, top-off, shape, and multi-project estimates stay aligned with the current mode.</p>{mixRows.map((row) => <div key={row.componentId}><span>{row.name}</span><strong>{fmt(row.volumeFt3)} ft³ · {row.bagsNeeded ?? 'label volume required'} bags · {symbol}{fmt(row.cost ?? 0)}</strong></div>)}<div><span>Estimated mix bag cost</span><strong>{symbol}{fmt(mixTotalCost)}</strong></div></div> : null}
          {tab === 'containers' ? <p className="callout">Container volume: <b>{fmt(containerResult.finalVolumeFt3)} ft³</b> / {fmt(containerResult.volumeLiters)} L</p> : null}
          {tab === 'multi' ? <p className="callout">Combined multi-project volume: <b>{fmt(multiCombinedResult.finalVolumeFt3)} ft³</b>. Beds: <b>{fmt(multiResult.finalVolumeFt3)} ft³</b>. Containers: <b>{fmt(multiContainerResult.finalVolumeFt3)} ft³</b>.</p> : null}
          {tab === 'topoff' ? <p className="callout">Annual top-off need: <b>{fmt(topOffResult.finalVolumeFt3)} ft³</b>. Compost planning amount: <b>{fmt(topOffMaterials.compostFt3)} ft³</b>. Optional mulch estimate: <b>{fmt(topOffMaterials.optionalMulchFt3)} ft³</b>.</p> : null}
          {tab === 'spacing' ? <><p className="callout">{spacingResult.totalSquares} squares × {plantText(spacingResult.plantsPerSquareFoot)} plants per square = <b>{plantText(spacingResult.totalPlants)} plants</b></p><SquareFootGridPreview lengthFt={gridLength} widthFt={gridWidth} cropLabel={spacingResult.crop?.name ?? 'custom crop'} /></> : null}
          {tab === 'depth' ? <p className={`callout status-callout status-${depthResult.status === 'good' ? 'success' : depthResult.status === 'borderline' ? 'warning' : 'danger'}`}><b>Status: {depthResult.status}</b>. {depthResult.message}</p> : null}
          {tab === 'spacing' || tab === 'depth' ? <div className="result-section assumption-note"><h3>Crop assumption and source boundary</h3><p>Spacing and depth are conservative planning estimates. Check your seed packet, plant tag, local Extension guidance, variety habit, trellis plan, surface type, drainage, and season before planting.</p>{spacingResult.crop ? <><p>{spacingResult.crop.name}: {spacingResult.crop.notes}</p><p>{spacingResult.crop.basis}</p>{spacingResult.crop.sourceNote ? <p><b>Source boundary:</b> {spacingResult.crop.sourceNote}</p> : null}</> : null}</div> : null}
          {tab === 'shapes' ? <p className="callout">Shape estimate: <b>{fmt(shapeResult.finalVolumeFt3)} ft³</b>. Use as an approximation for non-rectangular beds.</p> : null}
          {tab === 'cost' ? <p className="callout">Estimated project cost: <b>{symbol}{fmt(costResult.total)}</b>, or {symbol}{fmt(costResult.costPerBed)} per bed.</p> : null}

          {isVolumeTask ? (
            <div className="assumption-strip">
              <span>Settling: {settling}%</span>
              <span>Freeboard: {freeboard} {depthUnit}</span>
              <span>Bag: {bagSize} {bagUnit}</span>
              <span>Bulk minimum: {minimumOrder} yd³</span>
              <span>Bulk mode: {activeBulkResult.fulfillmentMode}</span>
            </div>
          ) : (
            <div className="assumption-strip task-assumption-strip">
              <span>Mode: {tab}</span>
              <span>Crop: {spacingResult.crop?.name ?? 'custom crop'}</span>
              <span>{tab === 'spacing' ? `Grid: ${gridLength}×${gridWidth} ft` : `Depth: ${depth} ${depthUnit}`}</span>
              <span>Boundary: check seed packet and local Extension guidance</span>
            </div>
          )}

          <h3>Shopping list</h3>
          <pre>{shoppingList}</pre>
          <div className="button-row action-row">
            <button type="button" className="primary" onClick={copyShoppingList}>{copied ? 'Copied' : 'Copy shopping list'}</button>
            <button type="button" onClick={printResult}>Print / save as PDF</button>
            <button type="button" onClick={downloadText}>Download TXT</button>
            <button type="button" onClick={downloadCsv}>Download CSV</button>
            <button type="button" onClick={downloadPng}>Download PNG</button>
            <button type="button" onClick={downloadPdf}>Download PDF</button>
            <button type="button" onClick={copyShareUrl}>{shared ? 'URL copied' : 'Copy share URL'}</button>
          </div>
          {validationMessages.length > 0 ? <ul className="warning-list validation-list">{validationMessages.map((message) => <li key={message}><b>Check:</b> {message}</li>)}</ul> : null}
          {warnings.length > 0 ? <ul className="warning-list">{warnings.map((warning) => <li className={`warning-item severity-${warning.severity}`} key={warningKey(warning)}><b>{warning.severity}:</b> {warning.message}</li>)}</ul> : null}
        </aside>
      </div>
    </section>
  );
}
