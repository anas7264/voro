// VORO Default Habits Templates
// Pre-built habit templates for habit tracking feature

export const defaultHabits = [
  {
    id: "habit_001",
    name: "Workout",
    emoji: "🏋️",
    color: "#7C3AED",
    category: "Fitness",
    frequency: "daily",
    targetPerWeek: 4,
    description: "Complete a workout session (strength, cardio, or flexibility)",
    notification: true,
    reminderTime: "06:00",
    difficulty: "Medium",
    icon: "Zap",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Track all types of exercise - strength training, cardio, flexibility work",
    benefits: [
      "Increased cardiovascular health",
      "Improved strength and endurance",
      "Better mood and mental clarity",
      "Consistent progress toward fitness goals"
    ]
  },

  {
    id: "habit_002",
    name: "Hydration",
    emoji: "💧",
    color: "#3B82F6",
    category: "Health",
    frequency: "daily",
    targetPerDay: 8,
    description: "Drink at least 8 glasses of water (2 liters) throughout the day",
    notification: true,
    reminderTime: "09:00",
    difficulty: "Easy",
    icon: "Droplet",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Spread water intake throughout the day. Increase with exercise/heat.",
    benefits: [
      "Better energy and focus",
      "Improved digestion and metabolism",
      "Clearer skin",
      "Reduced fatigue and headaches"
    ]
  },

  {
    id: "habit_003",
    name: "Sleep 8h",
    emoji: "😴",
    color: "#8B5CF6",
    category: "Recovery",
    frequency: "daily",
    targetHours: 8,
    description: "Get at least 8 hours of quality sleep",
    notification: true,
    reminderTime: "22:00",
    difficulty: "Medium",
    icon: "Moon",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Sleep consistency more important than total hours. Go to bed same time daily.",
    benefits: [
      "Faster recovery and muscle growth",
      "Improved cognitive function",
      "Better immune health",
      "Reduced injury risk"
    ]
  },

  {
    id: "habit_004",
    name: "Nutrition Logging",
    emoji: "🥗",
    color: "#10B981",
    category: "Nutrition",
    frequency: "daily",
    description: "Log all meals and snacks for complete nutrition tracking",
    notification: true,
    reminderTime: "19:00",
    difficulty: "Medium",
    icon: "Apple",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Track breakfast, lunch, dinner, and snacks. Include portions for accuracy.",
    benefits: [
      "Better awareness of eating patterns",
      "Improved dietary consistency",
      "Helps achieve nutrition goals",
      "Identifies nutrient deficiencies"
    ]
  },

  {
    id: "habit_005",
    name: "Meditation",
    emoji: "🧘",
    color: "#EC4899",
    category: "Wellness",
    frequency: "daily",
    targetMinutes: 10,
    description: "Practice mindfulness or meditation for mental clarity and stress relief",
    notification: true,
    reminderTime: "07:00",
    difficulty: "Medium",
    icon: "Smile",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Start with 5-10 minutes. Can do guided meditation via app or self-directed.",
    benefits: [
      "Reduced stress and anxiety",
      "Improved focus and concentration",
      "Better emotional regulation",
      "Enhanced sleep quality"
    ]
  },

  {
    id: "habit_006",
    name: "Stretching/Flexibility",
    emoji: "🤸",
    color: "#F59E0B",
    category: "Fitness",
    frequency: "daily",
    targetMinutes: 15,
    description: "Perform stretching or flexibility exercises",
    notification: true,
    reminderTime: "19:30",
    difficulty: "Easy",
    icon: "Activity",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Include foam rolling, static stretches, and mobility work. Post-workout optimal.",
    benefits: [
      "Improved mobility and range of motion",
      "Reduced muscle soreness",
      "Better posture",
      "Injury prevention"
    ]
  },

  {
    id: "habit_007",
    name: "Steps Goal",
    emoji: "🚶",
    color: "#06B6D4",
    category: "Activity",
    frequency: "daily",
    targetSteps: 10000,
    description: "Achieve at least 10,000 steps per day (non-exercise movement)",
    notification: true,
    reminderTime: "18:00",
    difficulty: "Medium",
    icon: "Footprints",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Light daily movement outside formal exercise. Use phone pedometer or wearable.",
    benefits: [
      "Improved cardiovascular health",
      "Better weight management",
      "Increased daily energy expenditure",
      "Reduced sedentary time"
    ]
  },

  {
    id: "habit_008",
    name: "Meal Prep",
    emoji: "🍳",
    color: "#EF4444",
    category: "Nutrition",
    frequency: "weekly",
    targetPerWeek: 1,
    description: "Prepare healthy meals for the week ahead",
    notification: true,
    reminderTime: "10:00",
    reminderDay: "Sunday",
    difficulty: "Hard",
    icon: "Chef",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Prepare 3-5 meals. Store in containers. Saves time during week and improves consistency.",
    benefits: [
      "Improved nutrition consistency",
      "Time savings during week",
      "Better portion control",
      "Cost savings on food"
    ]
  },

  {
    id: "habit_009",
    name: "Weigh-In",
    emoji: "⚖️",
    color: "#14B8A6",
    category: "Tracking",
    frequency: "weekly",
    targetPerWeek: 1,
    description: "Weigh yourself and record body weight",
    notification: true,
    reminderTime: "07:00",
    reminderDay: "Monday",
    difficulty: "Easy",
    icon: "Scale",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Same time each week (morning, after bathroom). Don't obsess over daily fluctuations.",
    benefits: [
      "Tracks long-term trends",
      "Helps adjust nutrition/training",
      "Motivates with visible progress",
      "Early detection of plateaus"
    ]
  },

  {
    id: "habit_010",
    name: "Progress Photos",
    emoji: "📸",
    color: "#F43F5E",
    category: "Tracking",
    frequency: "monthly",
    targetPerMonth: 1,
    description: "Take progress photos from front, side, and back angles",
    notification: true,
    reminderTime: "08:00",
    reminderDay: "1st",
    difficulty: "Easy",
    icon: "Camera",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Same location, lighting, time of day, and clothing each month for comparison.",
    benefits: [
      "Visual proof of progress",
      "Motivating when scale plateaus",
      "Reference for posture/form improvements",
      "Prevents mental distortion of progress"
    ]
  },

  {
    id: "habit_011",
    name: "Core Training",
    emoji: "💪",
    color: "#7C3AED",
    category: "Fitness",
    frequency: "weekly",
    targetPerWeek: 3,
    description: "Dedicated core/abdominal training session",
    notification: true,
    reminderTime: "17:30",
    difficulty: "Medium",
    icon: "Zap",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Include planks, crunches, leg raises, anti-rotation exercises. 15-20 min sessions.",
    benefits: [
      "Improved spinal stability",
      "Better posture",
      "Enhanced athletic performance",
      "Reduced back pain risk"
    ]
  },

  {
    id: "habit_012",
    name: "Reading",
    emoji: "📖",
    color: "#6366F1",
    category: "Wellness",
    frequency: "daily",
    targetMinutes: 30,
    description: "Read educational or motivational content",
    notification: true,
    reminderTime: "20:00",
    difficulty: "Easy",
    icon: "BookOpen",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    notes: "Fitness articles, nutrition guides, motivation, personal development, or fiction.",
    benefits: [
      "Improved fitness knowledge",
      "Better mental relaxation",
      "Enhanced focus and concentration",
      "Reduced stress before bed"
    ]
  }
];

export const habitCategories = {
  fitness: {
    name: "Fitness",
    color: "#7C3AED",
    icon: "Zap",
    description: "Exercise and physical activity habits"
  },
  nutrition: {
    name: "Nutrition",
    color: "#10B981",
    icon: "Apple",
    description: "Diet and eating habits"
  },
  recovery: {
    name: "Recovery",
    color: "#8B5CF6",
    icon: "Moon",
    description: "Sleep, rest, and recovery habits"
  },
  health: {
    name: "Health",
    color: "#3B82F6",
    icon: "Heart",
    description: "General health and wellness"
  },
  tracking: {
    name: "Tracking",
    color: "#14B8A6",
    icon: "TrendingUp",
    description: "Measurement and progress tracking"
  },
  wellness: {
    name: "Wellness",
    color: "#EC4899",
    icon: "Smile",
    description: "Mental health and mindfulness"
  },
  activity: {
    name: "Activity",
    color: "#06B6D4",
    icon: "Footprints",
    description: "Daily movement and activity"
  }
};

export const habitFrequencies = {
  daily: { label: "Daily", value: "daily", days: 1, week: 7 },
  threePerWeek: { label: "3x Per Week", value: "3-per-week", days: 2.3, week: 3 },
  fourPerWeek: { label: "4x Per Week", value: "4-per-week", days: 1.75, week: 4 },
  weekly: { label: "Weekly", value: "weekly", days: 7, week: 1 },
  biWeekly: { label: "Bi-Weekly", value: "bi-weekly", days: 14, week: 0.5 },
  monthly: { label: "Monthly", value: "monthly", days: 30, week: 0.25 }
};

export const habitDifficulties = {
  easy: { level: "Easy", points: 10, description: "Quick, minimal effort required" },
  medium: { level: "Medium", points: 25, description: "Regular commitment needed" },
  hard: { level: "Hard", points: 50, description: "Significant time/effort required" }
};

export default defaultHabits;
