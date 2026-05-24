import { describe, expect, it } from 'vitest';
import{CROPS,calculateAnnualTopOff,calculateGrowBagVolume,calculateRaisedBedVolume,calculateSoilBags,calculateSoilMix,calculateSquareFootSpacing,volumeToFt3}from'@/lib/calculators';
const base={length:4,width:8,depth:12,lengthUnit:'ft' as const,widthUnit:'ft' as const,depthUnit:'in' as const,numberOfBeds:1,freeboard:0,freeboardUnit:'in' as const,settlingAllowancePercent:0};
describe('BedSoil acceptance calculations',()=>{
it('4 ft × 8 ft × 12 in = 32 ft³ / 1.19 yd³',()=>{const r=calculateRaisedBedVolume(base);expect(r.finalVolumeFt3).toBeCloseTo(32,4);expect(r.volumeYd3).toBeCloseTo(1.185,3)});
it('2 beds with 10% settling = 70.4 ft³ / 2.61 yd³',()=>{const r=calculateRaisedBedVolume({...base,numberOfBeds:2,settlingAllowancePercent:10});expect(r.finalVolumeFt3).toBeCloseTo(70.4,4);expect(r.volumeYd3).toBeCloseTo(2.607,3)});
it('32 ft³ ÷ 2 ft³ bag = 16 bags',()=>{expect(calculateSoilBags(32,{bagSize:2,bagUnit:'ft3'}).bagsNeeded).toBe(16)});
it('32 ft³ ÷ 1.5 ft³ bag = 22 bags with about 1 ft³ left',()=>{const r=calculateSoilBags(32,{bagSize:1.5,bagUnit:'ft3'});expect(r.bagsNeeded).toBe(22);expect(r.leftoverFt3).toBeCloseTo(1,4)});
it('40 dry quarts ≈ 1.56 ft³',()=>{expect(volumeToFt3(40,'dryQuart')).toBeCloseTo(1.56,2)});
it('10 × 15-gallon grow bags + 6 × 10-gallon grow bags ≈ 28.07 ft³',()=>{expect(calculateGrowBagVolume({gallons:10*15+6*10,quantity:1}).finalVolumeFt3).toBeCloseTo(28.07,2)});
it('4×8×2 in top-off = 5.33 ft³',()=>{expect(calculateAnnualTopOff({length:4,width:8,topOffDepth:2,lengthUnit:'ft',widthUnit:'ft',topOffDepthUnit:'in',numberOfBeds:1}).finalVolumeFt3).toBeCloseTo(5.333,3)});
it('32 ft³ 60/30/10 mix = 19.2 / 9.6 / 3.2 ft³',()=>{const r=calculateSoilMix(32,{templateId:'basic',components:[{id:'topsoil',name:'Topsoil',ratioPercent:60},{id:'compost',name:'Compost',ratioPercent:30},{id:'pottingMix',name:'Potting mix',ratioPercent:10}]});expect(r[0].volumeFt3).toBeCloseTo(19.2,4);expect(r[1].volumeFt3).toBeCloseTo(9.6,4);expect(r[2].volumeFt3).toBeCloseTo(3.2,4)});
it('4×8 grid = 32 squares and 4×4 grid = 16 squares',()=>{expect(calculateSquareFootSpacing({lengthFt:4,widthFt:8,cropId:'tomato'}).totalSquares).toBe(32);expect(calculateSquareFootSpacing({lengthFt:4,widthFt:4,cropId:'tomato'}).totalSquares).toBe(16);expect(CROPS.length).toBeGreaterThanOrEqual(10)});
});
