import { useCallback } from "react";
import * as calculators from "../utils/calculators";

export const useCalculators = () => {
  // BMI calculation
  const calculateBMI = useCallback((weightKg, heightCm) => {
    return calculators.calculateBMI(weightKg, heightCm);
  }, []);

  // BMI category
  const getBMICategory = useCallback((bmi) => {
    return calculators.getBMICategory(bmi);
  }, []);

  // BMR calculation
  const calculateBMR = useCallback((weightKg, heightCm, age, gender) => {
    return calculators.calculateBMR(weightKg, heightCm, age, gender);
  }, []);

  // TDEE calculation
  const calculateTDEE = useCallback((bmr, activityLevel) => {
    return calculators.calculateTDEE(bmr, activityLevel);
  }, []);

  // Protein target
  const calculateProteinTarget = useCallback((weightKg, goal) => {
    return calculators.calculateProteinTarget(weightKg, goal);
  }, []);

  // Water intake
  const calculateWaterIntake = useCallback((weightKg, activityMinutesPerDay) => {
    return calculators.calculateWaterIntake(weightKg, activityMinutesPerDay);
  }, []);

  // One rep max estimators
  const calculateOneRepMax = useCallback((weight, reps, method = "average") => {
    return calculators.calculateOneRepMax[method](weight, reps);
  }, []);

  // Wilks coefficient
  const calculateWilks = useCallback((totalWeight, bodyweightKg, gender) => {
    return calculators.calculateWilksCoefficient(totalWeight, bodyweightKg, gender);
  }, []);

  // FFMI
  const calculateFFMI = useCallback((weightKg, bodyFatPercent, heightCm) => {
    return calculators.calculateFFMI(weightKg, bodyFatPercent, heightCm);
  }, []);

  // Max heart rate
  const calculateMaxHeartRate = useCallback((age, method) => {
    return calculators.calculateMaxHeartRate(age, method);
  }, []);

  // Heart rate zones
  const getHeartRateZones = useCallback((maxHeartRate, restingHeartRate) => {
    return calculators.getHeartRateZones(maxHeartRate, restingHeartRate);
  }, []);

  // VO2 Max estimation
  const estimateVO2Max = useCallback((age, gender, restingHeartRate) => {
    return calculators.estimateVO2Max(age, gender, restingHeartRate);
  }, []);

  // Pace converter
  const convertPace = useCallback((pace, unit) => {
    return calculators.convertPace(pace, unit);
  }, []);

  // Calories burned
  const estimateCaloriesBurned = useCallback((weightKg, durationMinutes, activity) => {
    return calculators.estimateCaloriesBurned(weightKg, durationMinutes, activity);
  }, []);

  // Macro ratios
  const calculateMacroRatios = useCallback((calories, proteinG, carbsG, fatG) => {
    return calculators.calculateMacroRatios(calories, proteinG, carbsG, fatG);
  }, []);

  // Calorie adjustment for goal
  const calculateCalorieAdjustment = useCallback((tdee, goal) => {
    return calculators.calculateCalorieAdjustment(tdee, goal);
  }, []);

  // Periodization cycle
  const calculatePeriodization = useCallback((totalWeeks, cycles) => {
    return calculators.calculatePeriodizationCycle(totalWeeks, cycles);
  }, []);

  // Training volume
  const calculateVolume = useCallback((sets, reps, weight) => {
    return calculators.calculateTrainingVolume(sets, reps, weight);
  }, []);

  // Progressive overload suggestions
  const suggestProgressiveOverload = useCallback((sets, reps, weight, trainingAge) => {
    return calculators.suggestProgressiveOverload(sets, reps, weight, trainingAge);
  }, []);

  // Recovery score
  const calculateRecoveryScore = useCallback((sleepHours, stressLevel, nutritionCompleteness) => {
    return calculators.calculateRecoveryScore(sleepHours, stressLevel, nutritionCompleteness);
  }, []);

  // Overtraining risk
  const assessOvertrainingRisk = useCallback((weeklyVolume, weeklyFrequency, averageIntensity, sleepQuality) => {
    return calculators.assessOvertrainingRisk(weeklyVolume, weeklyFrequency, averageIntensity, sleepQuality);
  }, []);

  const calculateIdealWeight = useCallback((heightCm, gender) => {
    return calculators.calculateIdealWeight(heightCm, gender);
  }, []);

  return {
    calculateBMI,
    getBMICategory,
    calculateBMR,
    calculateTDEE,
    calculateProteinTarget,
    calculateWaterIntake,
    calculateOneRepMax,
    calculateWilks,
    calculateFFMI,
    calculateIdealWeight,
    calculateMaxHeartRate,
    getHeartRateZones,
    estimateVO2Max,
    convertPace,
    estimateCaloriesBurned,
    calculateMacroRatios,
    calculateCalorieAdjustment,
    calculatePeriodization,
    calculateVolume,
    suggestProgressiveOverload,
    calculateRecoveryScore,
    assessOvertrainingRisk
  };
};

export default useCalculators;

// This is appended - useCalculators is already exported
