// VORO Body Fat Percentage Standards
// Classification by age, gender, and fitness level

export const bodyFatStandards = {
  male: {
    "18-25": {
      essential: { min: 2, max: 5 },
      athletes: { min: 6, max: 13 },
      fit: { min: 14, max: 17 },
      average: { min: 18, max: 24 },
      obese: { min: 25, max: 100 }
    },
    "26-35": {
      essential: { min: 2, max: 5 },
      athletes: { min: 6, max: 13 },
      fit: { min: 14, max: 17 },
      average: { min: 18, max: 25 },
      obese: { min: 26, max: 100 }
    },
    "36-45": {
      essential: { min: 3, max: 6 },
      athletes: { min: 7, max: 14 },
      fit: { min: 15, max: 18 },
      average: { min: 19, max: 26 },
      obese: { min: 27, max: 100 }
    },
    "46-55": {
      essential: { min: 4, max: 7 },
      athletes: { min: 8, max: 15 },
      fit: { min: 16, max: 19 },
      average: { min: 20, max: 27 },
      obese: { min: 28, max: 100 }
    },
    "56-65": {
      essential: { min: 5, max: 8 },
      athletes: { min: 9, max: 16 },
      fit: { min: 17, max: 20 },
      average: { min: 21, max: 28 },
      obese: { min: 29, max: 100 }
    },
    "65+": {
      essential: { min: 6, max: 10 },
      athletes: { min: 11, max: 17 },
      fit: { min: 18, max: 21 },
      average: { min: 22, max: 29 },
      obese: { min: 30, max: 100 }
    }
  },

  female: {
    "18-25": {
      essential: { min: 10, max: 13 },
      athletes: { min: 14, max: 20 },
      fit: { min: 21, max: 24 },
      average: { min: 25, max: 32 },
      obese: { min: 33, max: 100 }
    },
    "26-35": {
      essential: { min: 10, max: 13 },
      athletes: { min: 14, max: 20 },
      fit: { min: 21, max: 24 },
      average: { min: 25, max: 33 },
      obese: { min: 34, max: 100 }
    },
    "36-45": {
      essential: { min: 11, max: 14 },
      athletes: { min: 15, max: 21 },
      fit: { min: 22, max: 25 },
      average: { min: 26, max: 34 },
      obese: { min: 35, max: 100 }
    },
    "46-55": {
      essential: { min: 12, max: 15 },
      athletes: { min: 16, max: 22 },
      fit: { min: 23, max: 26 },
      average: { min: 27, max: 35 },
      obese: { min: 36, max: 100 }
    },
    "56-65": {
      essential: { min: 13, max: 16 },
      athletes: { min: 17, max: 23 },
      fit: { min: 24, max: 27 },
      average: { min: 28, max: 36 },
      obese: { min: 37, max: 100 }
    },
    "65+": {
      essential: { min: 14, max: 18 },
      athletes: { min: 19, max: 25 },
      fit: { min: 26, max: 29 },
      average: { min: 30, max: 37 },
      obese: { min: 38, max: 100 }
    }
  }
};

export const bodyFatLevelDescriptions = {
  essential: {
    name: "Essential Fat",
    description: "Minimum body fat required for basic physiological and hormonal health. Not recommended for extended periods.",
    healthRisk: "High - Hormonal disruption, energy depletion, performance loss"
  },
  athletes: {
    name: "Athletic Range",
    description: "Optimal range for athletes and highly active individuals. Excellent muscle definition and cardiovascular performance.",
    healthRisk: "Low - Healthy and sustainable"
  },
  fit: {
    name: "Fit",
    description: "Healthy range with clear muscle definition. Good energy levels and athletic performance.",
    healthRisk: "Very Low - Optimal health and longevity"
  },
  average: {
    name: "Average",
    description: "Typical range for sedentary population. Some visible muscle but covered by fat layer.",
    healthRisk: "Moderate - Increased metabolic disease risk"
  },
  obese: {
    name: "Obese",
    description: "Elevated body fat with significant health risks. Regular exercise and nutrition intervention recommended.",
    healthRisk: "High - Significant metabolic disease, cardiovascular, joint risks"
  }
};

export const bodyFatCalculationMethods = {
  navyFormula: {
    name: "US Navy Formula",
    maleFormula: "86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76",
    femaleFormula: "163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387",
    accuracy: "±3-4%",
    measurements: {
      male: ["Neck circumference", "Waist circumference at navel", "Height"],
      female: ["Neck circumference", "Waist circumference at navel", "Hip circumference at widest point", "Height"]
    },
    notes: "Most widely used formula, requires accurate tape measurements"
  },

  jackson3Site: {
    name: "Jackson 3-Site Skinfold (Men)",
    sites: ["Chest", "Abdomen", "Thigh"],
    accuracy: "±3-4%",
    formula: "Percentage fat = (0.29288 * sum) - (0.0005 * sum²) + (0.15845 * age) - 5.76377",
    notes: "Requires calibrated skinfold calipers, professional measurement recommended"
  },

  siri: {
    name: "Siri Equation",
    formula: "Body Fat % = (495 / Body Density) - 450",
    requirements: ["Hydrostatic weighing or DEXA scan for body density"],
    accuracy: "±2-3%",
    notes: "Gold standard but requires lab equipment"
  },

  bioelectricalImpedance: {
    name: "Bioelectrical Impedance Analysis (BIA)",
    accuracy: "±3-5%",
    notes: "Non-invasive, affected by hydration status, meal timing, and exercise",
    ideal: "Early morning, 12+ hours fasted, 48 hours post-intense exercise"
  }
};

export const bodyFatHealthMetrics = {
  cardiovascularRisk: {
    essential: "Very Low",
    athletes: "Very Low",
    fit: "Very Low",
    average: "Moderate",
    obese: "High"
  },
  metabolicHealth: {
    essential: "Compromised",
    athletes: "Excellent",
    fit: "Excellent",
    average: "Moderate",
    obese: "Poor"
  },
  hormoneBalance: {
    essential: "Disrupted",
    athletes: "Optimal",
    fit: "Optimal",
    average: "Normal",
    obese: "Disrupted"
  },
  lifeExpectancy: {
    essential: "Reduced",
    athletes: "Extended",
    fit: "Extended",
    average: "Normal",
    obese: "Reduced"
  }
};

export const bodyFatTrackingRecommendations = {
  measurementFrequency: "Monthly for tracking consistency",
  bestTime: "Same time each week, early morning, after bathroom",
  consistency: "Same person taking measurements for accuracy",
  hydration: "Normal hydration status (not dehydrated or overhydrated)",
  trackingMethods: [
    "Scale weight + measurements (waist, chest, hips, arms, thighs)",
    "Monthly photos from same angles",
    "Clothing fit changes",
    "Visual assessment with comparison photos"
  ]
};

export default bodyFatStandards;
