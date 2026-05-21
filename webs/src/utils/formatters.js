// VORO Formatters
// Data formatting utilities for display

// Format date to readable string
export const formatDate = (date, format = "short") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } else if (format === "long") {
    return dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  } else if (format === "time") {
    return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } else if (format === "datetime") {
    return dateObj.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } else if (format === "iso") {
    return dateObj.toISOString().split("T")[0];
  }

  return dateObj.toLocaleDateString();
};

// Format number with decimals and separators
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return "0";
  return parseFloat(num).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Format weight (kg ↔ lbs)
export const formatWeight = (value, from = "kg", to = "kg") => {
  if (from === to) return formatNumber(value, 1);

  if (from === "kg" && to === "lbs") {
    return formatNumber(value * 2.20462, 1);
  } else if (from === "lbs" && to === "kg") {
    return formatNumber(value / 2.20462, 1);
  }

  return formatNumber(value, 1);
};

// Format height (cm ↔ inches or cm ↔ feet+inches)
export const formatHeight = (value, from = "cm", to = "cm") => {
  if (from === to) return formatNumber(value, 1);

  if (from === "cm" && to === "inches") {
    return formatNumber(value / 2.54, 1);
  } else if (from === "cm" && to === "feet") {
    const feet = Math.floor(value / 30.48);
    const inches = Math.round((value % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  } else if (from === "inches" && to === "cm") {
    return formatNumber(value * 2.54, 1);
  }

  return formatNumber(value, 1);
};

// Format time duration (seconds to HH:MM:SS or MM:SS)
export const formatTime = (seconds, includeHours = false) => {
  if (!seconds) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (includeHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// Format calories with unit
export const formatCalories = (calories, decimals = 0) => {
  return `${formatNumber(calories, decimals)} kcal`;
};

// Format macros (protein, carbs, fat)
export const formatMacros = (protein, carbs, fat) => {
  return {
    protein: `${formatNumber(protein, 1)}g P`,
    carbs: `${formatNumber(carbs, 1)}g C`,
    fat: `${formatNumber(fat, 1)}g F`,
    total: `${formatNumber(protein + carbs + fat, 1)}g`
  };
};

// Format percentage with % symbol
export const formatPercentage = (value, decimals = 1) => {
  return `${formatNumber(value, decimals)}%`;
};

// Format as currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency
  }).format(amount);
};

// Format volume (sets × reps × weight)
export const formatVolume = (sets, reps, weight) => {
  const volume = sets * reps * weight;
  return `${formatNumber(volume, 0)} kg`;
};

// Format body measurements (cm)
export const formatMeasurement = (value, unit = "cm", decimals = 1) => {
  if (unit === "cm") {
    return `${formatNumber(value, decimals)} cm`;
  } else if (unit === "inches") {
    return `${formatNumber(value / 2.54, decimals)} in`;
  }
  return `${formatNumber(value, decimals)} ${unit}`;
};

// Format pace (minutes:seconds per km)
export const formatPace = (metersPerSecond) => {
  const kmPerHour = (metersPerSecond * 3.6);
  const secondsPerKm = 3600 / (kmPerHour * 1000);
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
};

// Format heart rate with bpm
export const formatHeartRate = (bpm) => {
  return `${formatNumber(bpm, 0)} bpm`;
};

// Format blood pressure
export const formatBloodPressure = (systolic, diastolic) => {
  return `${formatNumber(systolic, 0)}/${formatNumber(diastolic, 0)} mmHg`;
};

// Format temperature
export const formatTemperature = (celsius, unit = "C") => {
  if (unit === "F") {
    const fahrenheit = (celsius * 9/5) + 32;
    return `${formatNumber(fahrenheit, 1)}°F`;
  }
  return `${formatNumber(celsius, 1)}°C`;
};

// Format body fat percentage
export const formatBodyFat = (percentage) => {
  return `${formatNumber(percentage, 1)}% BF`;
};

// Format BMI with category
export const formatBMI = (bmi) => {
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  return `${formatNumber(bmi, 1)} (${category})`;
};

// Format distance (km or miles)
export const formatDistance = (km, unit = "km") => {
  if (unit === "miles") {
    return `${formatNumber(km * 0.621371, 2)} mi`;
  }
  return `${formatNumber(km, 2)} km`;
};

// Format duration with text (e.g., "2 hours 30 minutes")
export const formatDurationText = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = [];
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

  return result.length > 0 ? result.join(" ") : "0 minutes";
};

// Format level from XP
export const formatLevel = (xp) => {
  const levelThreshold = 1000; // XP per level
  const level = Math.floor(xp / levelThreshold) + 1;
  const nextLevel = level * levelThreshold;
  const currentXP = xp % levelThreshold;

  return {
    level,
    xp,
    currentXP,
    nextLevelXP: nextLevel,
    progress: ((currentXP / levelThreshold) * 100).toFixed(1)
  };
};

// Format streak (days)
export const formatStreak = (days) => {
  if (days === 0) return "No streak";
  if (days === 1) return "1 day 🔥";
  return `${days} days 🔥`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Format units display
export const formatUnits = (value, unit) => {
  const unitMap = {
    kg: "kg",
    lbs: "lbs",
    cm: "cm",
    in: "in",
    g: "g",
    mg: "mg",
    ml: "ml",
    oz: "oz",
    kcal: "kcal",
    bpm: "bpm",
    mmhg: "mmHg"
  };

  return `${formatNumber(value, 1)} ${unitMap[unit] || unit}`;
};

export default {
  formatDate,
  formatNumber,
  formatWeight,
  formatHeight,
  formatTime,
  formatCalories,
  formatMacros,
  formatPercentage,
  formatCurrency,
  formatVolume,
  formatMeasurement,
  formatPace,
  formatHeartRate,
  formatBloodPressure,
  formatTemperature,
  formatBodyFat,
  formatBMI,
  formatDistance,
  formatDurationText,
  formatLevel,
  formatStreak,
  formatPhoneNumber,
  formatUnits
};
