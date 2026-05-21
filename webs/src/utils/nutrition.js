// VORO Nutrition Utilities
// Nutrition-specific calculations and analysis

import { calculateCaloriesBurned, estimateCaloriesBurned } from "./calculators.js";
import { foods } from "../data/foods.js";

// Calculate nutrition score (0-100) based on macronutrient distribution
export const calculateNutritionScore = (protein, carbs, fat, calories) => {
  if (calories === 0) return 0;

  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;

  const proteinPct = (proteinCals / calories) * 100;
  const carbsPct = (carbsCals / calories) * 100;
  const fatPct = (fatCals / calories) * 100;

  // Ideal ranges: 25-35% protein, 40-55% carbs, 20-35% fat
  const proteinScore = Math.max(0, 100 - Math.abs((proteinPct - 30) * 3));
  const carbsScore = Math.max(0, 100 - Math.abs((carbsPct - 50) * 2));
  const fatScore = Math.max(0, 100 - Math.abs((fatPct - 30) * 3));

  return Math.round((proteinScore + carbsScore + fatScore) / 3);
};

// Analyze daily macros against targets
export const analyzeMacros = (consumedProtein, consumedCarbs, consumedFat, targetProtein, targetCarbs, targetFat) => {
  const proteinDiff = consumedProtein - targetProtein;
  const carbsDiff = consumedCarbs - targetCarbs;
  const fatDiff = consumedFat - targetFat;

  return {
    protein: {
      consumed: consumedProtein,
      target: targetProtein,
      difference: proteinDiff,
      percentOfTarget: ((consumedProtein / targetProtein) * 100).toFixed(1),
      status: proteinDiff >= -5 && proteinDiff <= 5 ? "On Target" : (proteinDiff > 5 ? "Over" : "Under")
    },
    carbs: {
      consumed: consumedCarbs,
      target: targetCarbs,
      difference: carbsDiff,
      percentOfTarget: ((consumedCarbs / targetCarbs) * 100).toFixed(1),
      status: carbsDiff >= -10 && carbsDiff <= 10 ? "On Target" : (carbsDiff > 10 ? "Over" : "Under")
    },
    fat: {
      consumed: consumedFat,
      target: targetFat,
      difference: fatDiff,
      percentOfTarget: ((consumedFat / targetFat) * 100).toFixed(1),
      status: fatDiff >= -3 && fatDiff <= 3 ? "On Target" : (fatDiff > 3 ? "Over" : "Under")
    }
  };
};

// Get macro warnings
export const getMacroWarnings = (protein, carbs, fat, calories) => {
  const warnings = [];

  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;

  const proteinPct = (proteinCals / calories) * 100;
  const carbsPct = (carbsCals / calories) * 100;
  const fatPct = (fatCals / calories) * 100;

  if (proteinPct < 15) warnings.push("Protein intake is very low. Aim for at least 25-30%");
  if (proteinPct > 40) warnings.push("Protein intake is very high. Consider reducing slightly");

  if (carbsPct < 30) warnings.push("Carbs very low. May impact energy for training");
  if (carbsPct > 65) warnings.push("Carbs are high. Watch total calorie intake");

  if (fatPct < 15) warnings.push("Fat intake very low. Can impact hormone production");
  if (fatPct > 40) warnings.push("Fat intake high. Monitor total calorie intake");

  return warnings;
};

// Calculate glycemic load of a meal
export const calculateGlycemicLoad = (foodItems) => {
  // Simplified GL calculation: (Glycemic Index × Carbs) / 100
  // foodItems should have { glycemicIndex, carbs }
  let totalGL = 0;
  let totalCarbs = 0;

  foodItems.forEach(item => {
    const gl = (item.glycemicIndex * item.carbs) / 100;
    totalGL += gl;
    totalCarbs += item.carbs;
  });

  let classification = "Low";
  if (totalGL >= 10 && totalGL < 20) classification = "Moderate";
  if (totalGL >= 20) classification = "High";

  return {
    glycemicLoad: Math.round(totalGL),
    classification,
    carbs: totalCarbs,
    recommendation: classification === "Low" ? "Good for stable energy" : (classification === "Moderate" ? "Moderate blood sugar impact" : "High blood sugar impact - pair with protein/fat")
  };
};

// Assess meal inflammatory potential (simplified inflammatory score)
export const assessInflammatoryPotential = (foodItems) => {
  // Inflammatory foods increase risk, anti-inflammatory foods decrease
  let score = 0;

  foodItems.forEach(item => {
    // Simplified scoring
    if (item.category?.includes("processed")) score += 2;
    if (item.category?.includes("fried")) score += 2;
    if (item.category?.includes("sugary")) score += 2;
    if (item.tags?.includes("high-omega6")) score += 1;

    if (item.tags?.includes("antioxidant")) score -= 2;
    if (item.tags?.includes("high-omega3")) score -= 2;
    if (item.tags?.includes("polyphenol-rich")) score -= 1;
  });

  let classification = "Low";
  if (score > 2) classification = "Moderate";
  if (score > 5) classification = "High";

  return {
    inflammatoryScore: Math.max(0, score),
    classification,
    recommendation: classification === "Low" ? "Good meal composition" : (classification === "Moderate" ? "Consider anti-inflammatory additions" : "High inflammatory potential - modify meal")
  };
};

// Calculate thermic effect of food (TEF) - calories burned digesting
export const calculateTEF = (protein, carbs, fat) => {
  // TEF percentages: protein 20-30%, carbs 5-10%, fat 0-3%
  const proteinTEF = protein * 4 * 0.25;
  const carbsTEF = carbs * 4 * 0.08;
  const fatTEF = fat * 9 * 0.02;

  return Math.round(proteinTEF + carbsTEF + fatTEF);
};

// Find similar foods by macros
export const findSimilarFoods = (targetFood, tolerance = 10) => {
  // tolerance is percentage difference allowed
  if (!targetFood) return [];

  const similar = foods.filter(food => {
    const proteinDiff = Math.abs(food.protein - targetFood.protein) / targetFood.protein * 100;
    const carbsDiff = Math.abs(food.carbs - targetFood.carbs) / Math.max(targetFood.carbs, 1) * 100;
    const fatDiff = Math.abs(food.fat - targetFood.fat) / Math.max(targetFood.fat, 1) * 100;

    return proteinDiff <= tolerance && carbsDiff <= tolerance && fatDiff <= tolerance && food.id !== targetFood.id;
  });

  return similar.slice(0, 5);
};

// Calculate ideal meal composition for timing
export const getIdealMealMacros = (mealTiming, goal, totalDailyCalories) => {
  // Returns suggested macros based on meal timing
  const mealCalories = totalDailyCalories / 4; // Assuming 4 meals/day

  let macroRatios = {
    protein: 0.25,
    carbs: 0.50,
    fat: 0.25
  };

  // Adjust based on timing
  if (mealTiming === "pre_workout") {
    macroRatios = { protein: 0.15, carbs: 0.80, fat: 0.05 }; // High carbs, low fiber
  } else if (mealTiming === "post_workout") {
    macroRatios = { protein: 0.35, carbs: 0.60, fat: 0.05 }; // High protein and carbs
  } else if (mealTiming === "bedtime") {
    macroRatios = { protein: 0.30, carbs: 0.30, fat: 0.40 }; // Higher fat for slow digestion
  }

  return {
    calories: Math.round(mealCalories),
    protein: Math.round((mealCalories * macroRatios.protein) / 4),
    carbs: Math.round((mealCalories * macroRatios.carbs) / 4),
    fat: Math.round((mealCalories * macroRatios.fat) / 9)
  };
};

// Water needs based on weight and activity
export const calculateDailyWaterNeeds = (weightKg, activityLevel = "moderate") => {
  // Base: 35ml per kg
  let baseWater = weightKg * 0.035; // liters

  // Activity adjustments
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.2,
    moderate: 1.5,
    intense: 1.8,
    very_intense: 2.0
  };

  const adjustedWater = baseWater * (activityMultipliers[activityLevel] || 1.5);

  return {
    litersPerDay: parseFloat(adjustedWater.toFixed(1)),
    cupsPerDay: Math.round(adjustedWater * 4.227), // Convert to US cups
    bottlesPerDay: Math.round(adjustedWater * 2), // Assuming 500ml bottles
    ounces: Math.round(adjustedWater * 33.814)
  };
};

// Assess hydration status by various metrics
export const assessHydrationStatus = (urineDensity, urine_color, thirstLevel) => {
  // Urine specific gravity: 1.005-1.030 (higher = more dehydrated)
  // Color scale: pale yellow (hydrated) to dark brown (dehydrated)

  let status = "Optimally Hydrated";
  let score = 75;

  if (urineDensity > 1.030 || urine_color === "dark_brown") {
    status = "Dehydrated";
    score = 25;
  } else if (urineDensity > 1.020 || urine_color === "golden") {
    status = "Mild Dehydration";
    score = 50;
  } else if (urineDensity > 1.010 || urine_color === "pale_yellow") {
    status = "Optimally Hydrated";
    score = 75;
  } else if (urineDensity < 1.010 || urine_color === "colorless") {
    status = "Overhydrated";
    score = 40;
  }

  return {
    status,
    hydrationScore: score,
    recommendation: status === "Optimally Hydrated" ? "Maintain current water intake" : (status.includes("Dehydrated") ? "Increase water intake immediately" : "Reduce water intake slightly")
  };
};

// Nutrient deficit detector
export const detectNutrientDeficits = (dailyIntake, targets) => {
  const deficits = {};

  Object.keys(targets).forEach(nutrient => {
    const intake = dailyIntake[nutrient] || 0;
    const target = targets[nutrient];
    const percentage = (intake / target) * 100;

    if (percentage < 80) {
      deficits[nutrient] = {
        intake,
        target,
        percentage: percentage.toFixed(1),
        deficit: (target - intake).toFixed(1)
      };
    }
  });

  return deficits;
};

// Micronutrient timing optimization
export const optimizeMicronutrientTiming = (meals) => {
  // Suggests when to take certain supplements
  const timing = {
    ironAndCalcium: "Separate by at least 2 hours - iron absorption reduced by calcium",
    vitaminD: "With meals containing fat for better absorption",
    magnesium: "Evening before bed for relaxation and sleep",
    zinc: "With food to reduce nausea",
    bVitamins: "With breakfast for energy",
    omega3: "With meals for better absorption",
    vitaminC: "With iron sources to enhance absorption"
  };

  return timing;
};

export default {
  calculateNutritionScore,
  analyzeMacros,
  getMacroWarnings,
  calculateGlycemicLoad,
  assessInflammatoryPotential,
  calculateTEF,
  findSimilarFoods,
  getIdealMealMacros,
  calculateDailyWaterNeeds,
  assessHydrationStatus,
  detectNutrientDeficits,
  optimizeMicronutrientTiming
};
