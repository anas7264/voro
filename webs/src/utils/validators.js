// VORO Input Validators
// Validation functions for form inputs and data integrity

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Get password strength feedback
export const getPasswordStrength = (password) => {
  let strength = 0;
  const feedback = [];

  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[@$!%*?&]/)) strength++;

  if (strength <= 1) return { level: "Very Weak", score: 1, feedback: ["Add more characters", "Mix uppercase and lowercase", "Add numbers", "Add special characters"] };
  if (strength <= 2) return { level: "Weak", score: 2, feedback: ["Mix uppercase and lowercase", "Add numbers", "Add special characters"] };
  if (strength <= 3) return { level: "Fair", score: 3, feedback: ["Add special characters"] };
  if (strength <= 4) return { level: "Good", score: 4, feedback: [] };
  return { level: "Strong", score: 5, feedback: [] };
};

// Positive number validation
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// Non-negative number validation
export const isNonNegativeNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

// Integer validation
export const isInteger = (value) => {
  return Number.isInteger(parseFloat(value));
};

// Weight validation (reasonable range in kg: 30-500kg)
export const isValidWeight = (weight) => {
  const w = parseFloat(weight);
  return !isNaN(w) && w >= 30 && w <= 500;
};

// Exercise weight validation (reasonable range in kg: 0-1000kg)
export const isValidExerciseWeight = (weight) => {
  const w = parseFloat(weight);
  return !isNaN(w) && w >= 0 && w <= 1000;
};

// Height validation (reasonable range in cm: 100-250cm)
export const isValidHeight = (height) => {
  const h = parseFloat(height);
  return !isNaN(h) && h >= 100 && h <= 250;
};

// Age validation (reasonable range: 13-120)
export const isValidAge = (age) => {
  const a = parseInt(age);
  return !isNaN(a) && a >= 13 && a <= 120;
};

// Body fat percentage validation (0-100%)
export const isValidBodyFat = (percentage) => {
  const bf = parseFloat(percentage);
  return !isNaN(bf) && bf >= 0 && bf <= 100;
};

// Calorie validation (daily intake: 500-10000)
export const isValidCalories = (calories) => {
  const cal = parseFloat(calories);
  return !isNaN(cal) && cal >= 500 && cal <= 10000;
};

// Macro validation (g: 0-500g)
export const isValidMacro = (value) => {
  const v = parseFloat(value);
  return !isNaN(v) && v >= 0 && v <= 500;
};

// Macro ratio validation (protein 10-50%, carbs 20-70%, fat 10-50%)
export const isValidMacroRatio = (protein, carbs, fat) => {
  const p = parseFloat(protein);
  const c = parseFloat(carbs);
  const f = parseFloat(fat);

  const valid = {
    protein: p >= 10 && p <= 50,
    carbs: c >= 20 && c <= 70,
    fat: f >= 10 && f <= 50
  };

  return valid.protein && valid.carbs && valid.fat;
};

// Date validation
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Date in future validation
export const isDateInFuture = (dateString) => {
  const date = new Date(dateString);
  return date > new Date();
};

// Date in past validation
export const isDateInPast = (dateString) => {
  const date = new Date(dateString);
  return date < new Date();
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Heart rate validation (bpm: 30-220)
export const isValidHeartRate = (bpm) => {
  const hr = parseInt(bpm);
  return !isNaN(hr) && hr >= 30 && hr <= 220;
};

// Blood pressure validation (systolic: 70-200, diastolic: 40-120)
export const isValidBloodPressure = (systolic, diastolic) => {
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);

  return (
    !isNaN(sys) && !isNaN(dia) &&
    sys >= 70 && sys <= 200 &&
    dia >= 40 && dia <= 120 &&
    sys > dia
  );
};

// Temperature validation (Celsius: -50 to 50)
export const isValidTemperature = (temp) => {
  const t = parseFloat(temp);
  return !isNaN(t) && t >= -50 && t <= 50;
};

// Rep range validation (1-100 reps)
export const isValidReps = (reps) => {
  const r = parseInt(reps);
  return !isNaN(r) && r >= 1 && r <= 100;
};

// Set count validation (1-50 sets)
export const isValidSets = (sets) => {
  const s = parseInt(sets);
  return !isNaN(s) && s >= 1 && s <= 50;
};

// Duration validation (seconds, 1-3600)
export const isValidDuration = (seconds) => {
  const dur = parseInt(seconds);
  return !isNaN(dur) && dur >= 1 && dur <= 3600;
};

// Water intake validation (ml: 0-5000)
export const isValidWaterAmount = (amount) => {
  const ml = parseInt(amount);
  return !isNaN(ml) && ml >= 0 && ml <= 5000;
};

// Gender validation
export const isValidGender = (gender) => {
  const validGenders = ["male", "female", "other", "prefer_not_to_say"];
  return validGenders.includes(gender?.toLowerCase());
};

// Goal validation
export const isValidGoal = (goal) => {
  const validGoals = [
    "weight_loss", "muscle_gain", "maintenance", "athletic_performance", "health_optimization",
    "lose weight", "build muscle", "improve fitness", "body recomposition", "general health"
  ];
  return validGoals.includes(goal?.toLowerCase());
};

// Experience level validation
export const isValidExperienceLevel = (level) => {
  const validLevels = ["beginner", "intermediate", "advanced", "elite"];
  return validLevels.includes(level?.toLowerCase());
};

// Activity level validation
export const isValidActivityLevel = (level) => {
  const validLevels = [
    "sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active",
    "lightly active", "moderately active", "very active", "extremely active"
  ];
  return validLevels.includes(level?.toLowerCase());
};

// Meal type validation
export const isValidMealType = (type) => {
  const validTypes = ["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"];
  return validTypes.includes(type?.toLowerCase());
};

// Exercise equipment validation
export const isValidEquipment = (equipment) => {
  const validEquipment = ["barbell", "dumbbell", "machine", "cable", "bodyweight", "kettlebell", "bands", "cardio", "medicine_ball"];
  return validEquipment.includes(equipment?.toLowerCase());
};

// Difficulty validation
export const isValidDifficulty = (difficulty) => {
  const validDifficulties = ["beginner", "intermediate", "advanced", "expert"];
  return validDifficulties.includes(difficulty?.toLowerCase());
};

// Form validation for fitness profile
export const validateFitnessProfile = (profile) => {
  const errors = {};

  if (!isValidAge(profile.age)) errors.age = "Age must be between 13-120";
  if (!isValidHeight(profile.height)) errors.height = "Height must be between 100-250 cm";
  if (!isValidWeight(profile.weight)) errors.weight = "Weight must be between 30-500 kg";
  if (!isValidGender(profile.gender)) errors.gender = "Invalid gender selection";
  if (!isValidGoal(profile.goal)) errors.goal = "Invalid fitness goal";
  if (!isValidActivityLevel(profile.activityLevel)) errors.activityLevel = "Invalid activity level";

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for food diary entry
export const validateFoodDiaryEntry = (entry) => {
  const errors = {};

  const portion = parseFloat(entry.portion);
  if (isNaN(portion) || portion < 1 || portion > 5000) {
    errors.portion = "Portion must be between 1 and 5000 grams";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for vitals
export const validateVitals = (vitals) => {
  const errors = {};

  if (!isValidHeartRate(vitals.heartRate)) errors.heartRate = "Heart rate must be between 30-220 bpm";

  if (vitals.bloodPressure) {
    const parts = vitals.bloodPressure.split('/');
    if (parts.length === 2) {
      if (!isValidBloodPressure(parts[0], parts[1])) {
        errors.bloodPressure = "Invalid blood pressure format or values";
      }
    } else {
      errors.bloodPressure = "Blood pressure must be in 'systolic/diastolic' format";
    }
  }

  if (vitals.sleep < 0 || vitals.sleep > 24) errors.sleep = "Sleep must be between 0-24 hours";
  if (vitals.mood < 1 || vitals.mood > 10) errors.mood = "Mood must be between 1-10";
  if (vitals.energy < 1 || vitals.energy > 10) errors.energy = "Energy must be between 1-10";

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for workout entry
export const validateWorkoutEntry = (workout) => {
  const errors = {};

  // Handle both single entry and full session structure
  if (Array.isArray(workout.exercises)) {
    if (workout.exercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    } else {
      workout.exercises.forEach((ex, idx) => {
        if (!ex.name?.trim()) errors[`exercise_${idx}_name`] = "Exercise name is required";
        if (Array.isArray(ex.sets)) {
          ex.sets.forEach((set, setIdx) => {
            if (!isValidReps(set.reps)) errors[`exercise_${idx}_set_${setIdx}_reps`] = "Reps must be between 1-100";
            if (!isValidExerciseWeight(set.weight)) errors[`exercise_${idx}_set_${setIdx}_weight`] = "Weight must be between 0-1000kg";
          });
        }
      });
    }
    if (!isValidDate(workout.date)) errors.date = "Date is invalid";
  } else {
    // Single entry validation
    if (!workout.exercise?.trim()) errors.exercise = "Exercise is required";
    if (!isValidSets(workout.sets)) errors.sets = "Sets must be between 1-50";
    if (!isValidReps(workout.reps)) errors.reps = "Reps must be between 1-100";
    if (!isValidExerciseWeight(workout.weight)) errors.weight = "Weight is invalid";
    if (workout.date && !isValidDate(workout.date)) errors.date = "Date is invalid";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for nutrition entry
export const validateNutritionEntry = (nutrition) => {
  const errors = {};

  if (!nutrition.food?.trim()) errors.food = "Food is required";
  if (!isValidCalories(nutrition.calories)) errors.calories = "Calories must be between 500-10000";
  if (!isNonNegativeNumber(nutrition.protein)) errors.protein = "Protein must be non-negative";
  if (!isNonNegativeNumber(nutrition.carbs)) errors.carbs = "Carbs must be non-negative";
  if (!isNonNegativeNumber(nutrition.fat)) errors.fat = "Fat must be non-negative";
  if (!isValidMealType(nutrition.mealType)) errors.mealType = "Invalid meal type";
  if (!isValidDate(nutrition.date)) errors.date = "Date is invalid";

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for habit entry
export const validateHabit = (habit) => {
  const errors = {};

  if (!habit.name?.trim()) {
    errors.name = "Habit name is required";
  } else if (habit.name.length > 50) {
    errors.name = "Habit name must be less than 50 characters";
  }

  if (habit.icon && habit.icon.length > 10) {
    errors.icon = "Icon is too long";
  }

  const validColors = ["voro-primary", "voro-secondary", "voro-accent"];
  if (habit.color && !validColors.includes(habit.color)) {
    errors.color = "Invalid color selection";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for recipe entry
export const validateRecipe = (recipe) => {
  const errors = {};

  if (!recipe.name?.trim()) {
    errors.name = "Recipe name is required";
  } else if (recipe.name.length > 100) {
    errors.name = "Recipe name must be less than 100 characters";
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.ingredients = "At least one ingredient is required";
  } else {
    recipe.ingredients.forEach((ing, idx) => {
      const portion = parseFloat(ing.portion);
      if (isNaN(portion) || portion < 1 || portion > 5000) {
        errors[`ingredient_${idx}_portion`] = `Portion for ${ing.name || 'ingredient'} must be between 1 and 5000 grams`;
      }
    });
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for water entry
export const validateWaterEntry = (entry) => {
  const errors = {};

  if (!isValidWaterAmount(entry.amount)) {
    errors.amount = "Water amount must be between 0-5000 ml";
  }

  if (entry.date && !isValidDate(entry.date)) {
    errors.date = "Date is invalid";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export default {
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isValidWeight,
  isValidExerciseWeight,
  isValidHeight,
  isValidAge,
  isValidBodyFat,
  isValidCalories,
  isValidMacro,
  isValidMacroRatio,
  isValidDate,
  isDateInFuture,
  isDateInPast,
  isValidURL,
  isValidHeartRate,
  isValidBloodPressure,
  isValidTemperature,
  isValidReps,
  isValidSets,
  isValidDuration,
  isValidGender,
  isValidGoal,
  isValidExperienceLevel,
  isValidActivityLevel,
  isValidMealType,
  isValidEquipment,
  isValidDifficulty,
  validateFitnessProfile,
  validateWorkoutEntry,
  validateNutritionEntry,
  validateVitals,
  validateWaterEntry,
  validateFoodDiaryEntry,
  validateHabit,
  validateRecipe,
  isValidWaterAmount
};
