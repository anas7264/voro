// VORO Gamification Engine
// Achievement tracking, XP calculation, and challenge management

import { achievements } from "../data/achievements.js";
import { challenges } from "../data/challenges.js";

// Calculate XP earned from action
export const calculateXP = (action, metadata = {}) => {
  const xpValues = {
    // Workout XP
    complete_workout: 50,
    pr_lift: 100,
    new_personal_record: 150,
    complete_cardio_session: 40,
    strength_training: 60,
    flexibility_training: 30,

    // Nutrition XP
    log_meal: 20,
    log_complete_nutrition: 50,
    hit_protein_target: 40,
    hit_calorie_target: 40,
    track_water_intake: 20,
    meal_prep: 75,

    // Consistency XP
    daily_streak: 25,
    weekly_streak: 75,
    monthly_streak: 150,

    // Body metrics XP
    body_measurement: 20,
    weight_update: 15,
    progress_photo: 30,
    body_fat_measurement: 25,

    // Challenges/Achievements
    challenge_complete: 50,
    achievement_unlock: (metadata.xpReward || 50),

    // Social/Engagement
    share_workout: 25,
    share_achievement: 30,
    referral_friend: 200
  };

  return xpValues[action] || 0;
};

// Get level from total XP
export const getLevelFromXP = (totalXP) => {
  const xpPerLevel = 1000;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const currentLevelXP = totalXP - (level - 1) * xpPerLevel;
  const nextLevelXP = xpPerLevel;
  const progress = (currentLevelXP / nextLevelXP) * 100;

  return {
    level,
    totalXP,
    currentLevelXP,
    nextLevelXP,
    progress: progress.toFixed(1),
    nextLevelIn: xpPerLevel - currentLevelXP
  };
};

// Check if achievement should be unlocked
export const checkAchievementTrigger = (trigger, userData) => {
  // Returns true if achievement should be unlocked
  const triggerChecks = {
    first_workout: () => userData.totalWorkouts === 1,
    workout_streak_7: () => userData.currentStreak === 7,
    workout_streak_30: () => userData.currentStreak === 30,
    workout_streak_365: () => userData.currentStreak === 365,
    nutrition_14days: () => userData.nutritionLogDays >= 14,
    nutrition_30days: () => userData.nutritionLogDays >= 30,
    hydration_2l: () => userData.dailyWaterLiters >= 2,
    weight_loss_5kg: () => (userData.startingWeight - userData.currentWeight) >= 5,
    weight_loss_10kg: () => (userData.startingWeight - userData.currentWeight) >= 10,
    weight_loss_20kg: () => (userData.startingWeight - userData.currentWeight) >= 20,
    muscle_gain_5kg: () => (userData.currentWeight - userData.startingWeight) >= 5 && userData.bodyFatDecreased,
    pr_hit: () => userData.hitNewPR === true,
    social_share: () => userData.hasSharedWorkout === true,
    referral_friend: () => userData.referredFriends >= 1,
    day_100: () => userData.currentStreak >= 100,
    day_365: () => userData.currentStreak >= 365,
    all_achievements: () => userData.unlockedAchievements >= (achievements.length - 1)
  };

  return triggerChecks[trigger] ? triggerChecks[trigger]() : false;
};

// Calculate streak
export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return { current: 0, best: 0 };

  const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => a - b);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);

    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      prevDate.setHours(0, 0, 0, 0);

      const dayDiff = (date - prevDate) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }

    if (tempStreak > bestStreak) bestStreak = tempStreak;

    // Check if this is current streak
    const daysSinceDate = (today - date) / (1000 * 60 * 60 * 24);
    if (daysSinceDate <= 1) {
      currentStreak = tempStreak;
    }
  }

  return { current: currentStreak, best: bestStreak };
};

// Get rank from level and XP
export const getRankTier = (level) => {
  let tier = "Novice";
  let icon = "Zap";
  let color = "#3B82F6";

  if (level < 5) {
    tier = "Novice";
    icon = "Zap";
    color = "#6B7280";
  } else if (level < 10) {
    tier = "Athlete";
    icon = "Flame";
    color = "#3B82F6";
  } else if (level < 20) {
    tier = "Champion";
    icon = "Trophy";
    color = "#10B981";
  } else if (level < 35) {
    tier = "Elite";
    icon = "Crown";
    color = "#F59E0B";
  } else if (level < 50) {
    tier = "Legend";
    icon = "Zap";
    color = "#7C3AED";
  } else {
    tier = "VORO Master";
    icon = "Star";
    color = "#EC4899";
  }

  return { tier, icon, color, level };
};

// Check challenge completion
export const checkChallengeCompletion = (challenge, userProgress) => {
  // Returns object with isComplete and progress
  const criteria = challenge.criteria;
  let isComplete = false;
  let progress = 0;

  // Parse criteria and check completion
  if (criteria.includes("workouts")) {
    const regex = /(\d+)\+?\s*workouts/i;
    const match = criteria.match(regex);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.workoutsThisPeriod / required) * 100;
      isComplete = userProgress.workoutsThisPeriod >= required;
    }
  }

  if (criteria.includes("nutrition")) {
    const regex = /(\d+)\s*days/i;
    const match = criteria.match(regex);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.nutritionDays / required) * 100;
      isComplete = userProgress.nutritionDays >= required;
    }
  }

  if (criteria.includes("water")) {
    const regex = /(\d+)\+?\s*liters/i;
    const match = criteria.match(regex);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.waterLiters / required) * 100;
      isComplete = userProgress.waterLiters >= required;
    }
  }

  if (criteria.includes("steps")) {
    const regex = /(\d+)\+?\s*steps/i;
    const match = criteria.match(regex);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.steps / required) * 100;
      isComplete = userProgress.steps >= required;
    }
  }

  return {
    isComplete,
    progress: Math.min(100, progress),
    xpReward: challenge.xpReward,
    timeRemaining: challenge.timeRemaining
  };
};

// Get active challenges based on duration
export const getActiveChallenges = (allChallenges, filterType = "all") => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dateOfMonth = now.getDate();

  return allChallenges.filter(challenge => {
    if (filterType !== "all" && challenge.duration !== filterType) return false;

    if (challenge.duration === "daily") return true;

    if (challenge.duration === "weekly") {
      // Weekly challenges refresh on Monday (day 1)
      return true;
    }

    if (challenge.duration === "monthly") {
      // Monthly challenges refresh on 1st of month
      return true;
    }

    return false;
  });
};

// Calculate rewards for multiple achievements/challenges
export const calculateTotalRewards = (unlockedAchievements, completedChallenges) => {
  let totalXP = 0;
  let tierUp = false;

  unlockedAchievements.forEach(achievement => {
    totalXP += achievement.xpReward || 0;
  });

  completedChallenges.forEach(challenge => {
    totalXP += challenge.xpReward || 0;
  });

  return {
    totalXP,
    achievementsCount: unlockedAchievements.length,
    challengesCount: completedChallenges.length,
    bonusXP: Math.floor(totalXP * 0.1) // 10% bonus for multiple completions
  };
};

// Leaderboard ranking
export const calculateLeaderboardPosition = (userStats, allUsers) => {
  const sortedUsers = allUsers.sort((a, b) => b.totalXP - a.totalXP);
  const position = sortedUsers.findIndex(u => u.id === userStats.id) + 1;
  const percentile = ((allUsers.length - position) / allUsers.length) * 100;

  return {
    position,
    totalUsers: allUsers.length,
    percentile: percentile.toFixed(1),
    topPercentile: position <= Math.floor(allUsers.length * 0.1)
  };
};

// Achievement rarity breakdown
export const getRarityBreakdown = (unlockedAchievements) => {
  const rarities = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  };

  unlockedAchievements.forEach(ach => {
    const rarity = ach.rarity?.toLowerCase() || "common";
    if (rarities[rarity] !== undefined) {
      rarities[rarity]++;
    }
  });

  return {
    ...rarities,
    total: unlockedAchievements.length,
    legendaryPercentage: (rarities.legendary / unlockedAchievements.length * 100).toFixed(1)
  };
};

// Gamification stats summary
export const getGamificationStats = (userData) => {
  const level = getLevelFromXP(userData.totalXP);
  const rank = getRankTier(level.level);
  const streak = calculateStreak(userData.completedWorkoutDates);
  const rarity = getRarityBreakdown(userData.achievements);

  return {
    level: level.level,
    xp: userData.totalXP,
    nextLevelXP: level.nextLevelIn,
    rank: rank.tier,
    currentStreak: streak.current,
    bestStreak: streak.best,
    achievements: userData.achievements.length,
    legendaryCount: rarity.legendary,
    challenges: userData.completedChallenges ? userData.completedChallenges.length : 0
  };
};

// Predict next achievement
export const predictNextAchievement = (userData) => {
  // Returns most likely next achievement to unlock
  let nextAchievements = [];

  achievements.forEach(ach => {
    if (!userData.unlockedAchievements.includes(ach.id)) {
      // Rough prediction based on trigger proximity
      if (ach.trigger?.includes("streak")) {
        const daysFromStreak = parseInt(ach.trigger.match(/\d+/)?.[0]) - userData.currentStreak;
        if (daysFromStreak > 0 && daysFromStreak < 30) {
          nextAchievements.push({ ...ach, daysUntil: daysFromStreak });
        }
      }
    }
  });

  return nextAchievements.sort((a, b) => a.daysUntil - b.daysUntil)[0];
};

export default {
  calculateXP,
  getLevelFromXP,
  checkAchievementTrigger,
  calculateStreak,
  getRankTier,
  checkChallengeCompletion,
  getActiveChallenges,
  calculateTotalRewards,
  calculateLeaderboardPosition,
  getRarityBreakdown,
  getGamificationStats,
  predictNextAchievement
};
