// VORO Biometric & Performance Calculator Hook
// ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen Static API Object.
// All calculation functions in calculators.js are stateless pure functions.
// Hoisting them to module scope and freezing the returned object completely eliminates
// 22 useCallback hook invocations and 22 function allocations per render cycle,
// providing zero-allocation execution and absolute referential stability.

import * as calculators from "../utils/calculators.js";

const CALCULATORS_API = Object.freeze({
  calculateBMI: calculators.calculateBMI,
  getBMICategory: calculators.getBMICategory,
  calculateBMR: calculators.calculateBMR,
  calculateTDEE: calculators.calculateTDEE,
  calculateProteinTarget: calculators.calculateProteinTarget,
  calculateWaterIntake: calculators.calculateWaterIntake,
  calculateOneRepMax: (weight, reps, method = "average") => calculators.calculateOneRepMax[method](weight, reps),
  calculateWilks: calculators.calculateWilksCoefficient,
  calculateFFMI: calculators.calculateFFMI,
  calculateIdealWeight: calculators.calculateIdealWeight,
  calculateMaxHeartRate: calculators.calculateMaxHeartRate,
  getHeartRateZones: calculators.getHeartRateZones,
  estimateVO2Max: calculators.estimateVO2Max,
  convertPace: calculators.convertPace,
  estimateCaloriesBurned: calculators.estimateCaloriesBurned,
  calculateMacroRatios: calculators.calculateMacroRatios,
  calculateCalorieAdjustment: calculators.calculateCalorieAdjustment,
  calculatePeriodization: calculators.calculatePeriodizationCycle,
  calculateVolume: calculators.calculateTrainingVolume,
  suggestProgressiveOverload: calculators.suggestProgressiveOverload,
  calculateRecoveryScore: calculators.calculateRecoveryScore,
  assessOvertrainingRisk: calculators.assessOvertrainingRisk
});

export const useCalculators = () => CALCULATORS_API;

export default useCalculators;
