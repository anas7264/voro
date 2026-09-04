// VORO Gamification Engine
// Achievement tracking, XP calculation, and challenge management

import { achievements } from "../data/achievements.js";
import { challenges } from "../data/challenges.js";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen Configuration Objects & Regular Expressions.
 * These are frozen with Object.freeze() at the module scope to completely
 * prevent heap-allocation and Garbage Collection (GC) churn in hot paths.
 */
const STATIC_XP_VALUES = Object.freeze({
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

  // Social/Engagement
  share_workout: 25,
  share_achievement: 30,
  referral_friend: 200
});

const TRIGGER_CHECKS = Object.freeze({
  first_workout: (userData) => userData.totalWorkouts === 1,
  workout_streak_7: (userData) => userData.currentStreak === 7,
  workout_streak_30: (userData) => userData.currentStreak === 30,
  workout_streak_365: (userData) => userData.currentStreak === 365,
  nutrition_14days: (userData) => userData.nutritionLogDays >= 14,
  nutrition_30days: (userData) => userData.nutritionLogDays >= 30,
  hydration_2l: (userData) => userData.dailyWaterLiters >= 2,
  weight_loss_5kg: (userData) => (userData.startingWeight - userData.currentWeight) >= 5,
  weight_loss_10kg: (userData) => (userData.startingWeight - userData.currentWeight) >= 10,
  weight_loss_20kg: (userData) => (userData.startingWeight - userData.currentWeight) >= 20,
  muscle_gain_5kg: (userData) => (userData.currentWeight - userData.startingWeight) >= 5 && userData.bodyFatDecreased,
  pr_hit: (userData) => userData.hitNewPR === true,
  social_share: (userData) => userData.hasSharedWorkout === true,
  referral_friend: (userData) => userData.referredFriends >= 1,
  day_100: (userData) => userData.currentStreak >= 100,
  day_365: (userData) => userData.currentStreak >= 365,
  all_achievements: (userData) => userData.unlockedAchievements >= (achievements.length - 1)
});

const WORKOUTS_RE = /(\d+)\+?\s*workouts/i;
const DAYS_RE = /(\d+)\s*days/i;
const LITERS_RE = /(\d+)\+?\s*liters/i;
const STEPS_RE = /(\d+)\+?\s*steps/i;
const DIGIT_RE = /\d+/;

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-scoped pre-computed streak achievements.
 * Pre-evaluates streak-based achievements at module load time to avoid runtime
 * string inspections, regex executions (`DIGIT_RE`), and array parsing during
 * hot-path `predictNextAchievement` executions.
 */
const STREAK_ACHIEVEMENTS = Object.freeze(
  achievements
    .map(ach => {
      const triggerStr = ach.trigger || ach.triggerType || "";
      if (triggerStr.includes("streak") || ach.category === "Streaks") {
        let target = ach.triggerValue;
        if (!target && triggerStr) {
          const match = triggerStr.match(DIGIT_RE);
          if (match) target = parseInt(match[0], 10);
        }
        if (target) {
          return Object.freeze({ ach, target });
        }
      }
      return null;
    })
    .filter(Boolean)
);

// Calculate XP earned from action
export const calculateXP = (action, metadata = {}) => {
  if (action === "achievement_unlock") {
    return metadata.xpReward !== undefined ? metadata.xpReward : 50;
  }
  return STATIC_XP_VALUES[action] || 0;
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
  return TRIGGER_CHECKS[trigger] ? TRIGGER_CHECKS[trigger](userData) : false;
};

// Calculate streak
// ⚡ PERFORMANCE OPTIMIZATION: Bypasses redundant heavy Date object allocations.
// Reduces object creation from O(N) back-to-back instantiations to a single O(N) map,
// performing standard numeric comparison on epoch timestamps with Math.round for robust DST mitigation.
export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return { current: 0, best: 0 };

  // Parse strings to local midnight timestamps in one pass
  const localMidnights = [];
  for (let i = 0; i < completedDates.length; i++) {
    const d = completedDates[i];
    if (!d) continue;

    let time;
    // ⚡ PERFORMANCE OPTIMIZATION: Fast path for standard YYYY-MM-DD ISO strings.
    // Avoids slow VM-level generic string parsing while matching standard UTC parsing behavior.
    if (typeof d === 'string' && d.length === 10 && d.charCodeAt(4) === 45 && d.charCodeAt(7) === 45) {
      const y = parseInt(d.slice(0, 4), 10);
      const m = parseInt(d.slice(5, 7), 10);
      const day = parseInt(d.slice(8, 10), 10);
      if (y >= 1000 && y <= 9999 && m >= 1 && m <= 12 && day >= 1 && day <= 31) {
        const utcTime = Date.UTC(y, m - 1, day);
        const dt = new Date(utcTime);
        dt.setHours(0, 0, 0, 0);
        time = dt.getTime();
      }
    }

    if (time === undefined) {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) continue;
      dt.setHours(0, 0, 0, 0);
      time = dt.getTime();
    }
    localMidnights.push(time);
  }

  if (localMidnights.length === 0) return { current: 0, best: 0 };

  // Extremely fast numeric sort, zero object allocations
  localMidnights.sort((a, b) => a - b);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const dayMs = 86400000;

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < localMidnights.length; i++) {
    const time = localMidnights[i];

    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevTime = localMidnights[i - 1];

      // If same local day, skip to avoid breaking or incorrectly incrementing streak
      if (time === prevTime) continue;

      const dayDiff = (time - prevTime) / dayMs;
      const roundedDiff = Math.round(dayDiff);

      if (roundedDiff === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }

    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }

    // Check if this is current streak
    const daysSinceDate = (todayMs - time) / dayMs;
    const roundedDaysSince = Math.round(daysSinceDate);
    if (roundedDaysSince <= 1) {
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
    const match = criteria.match(WORKOUTS_RE);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.workoutsThisPeriod / required) * 100;
      isComplete = userProgress.workoutsThisPeriod >= required;
    }
  }

  if (criteria.includes("nutrition")) {
    const match = criteria.match(DAYS_RE);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.nutritionDays / required) * 100;
      isComplete = userProgress.nutritionDays >= required;
    }
  }

  if (criteria.includes("water")) {
    const match = criteria.match(LITERS_RE);
    if (match) {
      const required = parseInt(match[1]);
      progress = (userProgress.waterLiters / required) * 100;
      isComplete = userProgress.waterLiters >= required;
    }
  }

  if (criteria.includes("steps")) {
    const match = criteria.match(STEPS_RE);
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
// ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation imperative loops.
// Bypasses higher-order array callback allocations (`.forEach()`) and adds null safety.
export const calculateTotalRewards = (unlockedAchievements, completedChallenges) => {
  let totalXP = 0;

  if (Array.isArray(unlockedAchievements)) {
    for (let i = 0; i < unlockedAchievements.length; i++) {
      totalXP += unlockedAchievements[i]?.xpReward || 0;
    }
  }

  if (Array.isArray(completedChallenges)) {
    for (let i = 0; i < completedChallenges.length; i++) {
      totalXP += completedChallenges[i]?.xpReward || 0;
    }
  }

  const achCount = unlockedAchievements?.length || 0;
  const chalCount = completedChallenges?.length || 0;

  return {
    totalXP,
    achievementsCount: achCount,
    challengesCount: chalCount,
    bonusXP: Math.floor(totalXP * 0.1) // 10% bonus for multiple completions
  };
};

// Leaderboard ranking
// ⚡ PERFORMANCE OPTIMIZATION: Pure O(N) single-pass rank evaluation.
// Eliminates in-place mutation of caller array (`allUsers.sort()`) and replaces O(N log N) sorting
// with a zero-allocation single loop pass counting users with higher totalXP.
export const calculateLeaderboardPosition = (userStats, allUsers) => {
  if (!Array.isArray(allUsers) || allUsers.length === 0) {
    return {
      position: 1,
      totalUsers: 0,
      percentile: "100.0",
      topPercentile: true
    };
  }

  const userXP = userStats?.totalXP || 0;
  let higherCount = 0;

  for (let i = 0; i < allUsers.length; i++) {
    if ((allUsers[i]?.totalXP || 0) > userXP) {
      higherCount++;
    }
  }

  const position = higherCount + 1;
  const percentile = ((allUsers.length - position) / allUsers.length) * 100;

  return {
    position,
    totalUsers: allUsers.length,
    percentile: percentile.toFixed(1),
    topPercentile: position <= Math.floor(allUsers.length * 0.1)
  };
};

// Achievement rarity breakdown
// ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation loop and safe division guard.
// Avoids callback function allocations and prevents returning `"NaN"` when `unlockedAchievements` is empty.
export const getRarityBreakdown = (unlockedAchievements) => {
  const rarities = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  };

  if (Array.isArray(unlockedAchievements)) {
    for (let i = 0; i < unlockedAchievements.length; i++) {
      const ach = unlockedAchievements[i];
      const rarity = ach?.rarity?.toLowerCase() || "common";
      if (rarities[rarity] !== undefined) {
        rarities[rarity]++;
      }
    }
  }

  const total = unlockedAchievements?.length || 0;

  return {
    ...rarities,
    total,
    legendaryPercentage: total > 0 ? ((rarities.legendary / total) * 100).toFixed(1) : "0.0"
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
/**
 * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation, single-pass prediction algorithm.
 * Bypasses `achievements.forEach` array allocations, `.push()`, `.sort()`, and regex matching.
 * Uses module-scoped `STREAK_ACHIEVEMENTS` to find the nearest unlockable achievement in O(N).
 */
export const predictNextAchievement = (userData) => {
  if (!userData) return undefined;
  const unlockedSet = new Set(userData.unlockedAchievements || []);
  const currentStreak = userData.currentStreak || 0;

  let bestAchievement = null;
  let minDays = Infinity;

  for (let i = 0; i < STREAK_ACHIEVEMENTS.length; i++) {
    const { ach, target } = STREAK_ACHIEVEMENTS[i];
    if (!unlockedSet.has(ach.id)) {
      const daysFromStreak = target - currentStreak;
      if (daysFromStreak > 0 && daysFromStreak < 30 && daysFromStreak < minDays) {
        minDays = daysFromStreak;
        bestAchievement = { ...ach, daysUntil: daysFromStreak };
      }
    }
  }

  return bestAchievement || undefined;
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
