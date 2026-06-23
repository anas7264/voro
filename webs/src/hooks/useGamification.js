import { useMemo, useCallback } from "react";
import { useStorageMethods, useStorageKey } from "./useStorage";
import * as gamification from "../utils/gamification";

export const useGamification = () => {
  const { setItem } = useStorageMethods();
  const gamificationData = useStorageKey("gamification");

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'gamification' data to prevent redundant re-renders
   * when unrelated storage keys change.
   */
  const gameState = useMemo(() => {
    return gamificationData || {
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      achievements: [],
      completedChallenges: [],
      leaderboardPosition: 0,
      totalWorkouts: 0,
      totalNutritionDays: 0,
      milestones: []
    };
  }, [gamificationData]);

  // Award XP for action
  const awardXP = useCallback((action, metadata = {}) => {
    try {
      const xp = gamification.calculateXP(action, metadata);

      if (xp === 0) return null;

      const newTotalXP = (gameState.totalXP || 0) + xp;
      const levelInfo = gamification.getLevelFromXP(newTotalXP);

      const updatedState = {
        ...gameState,
        totalXP: newTotalXP,
        level: levelInfo.level
      };

      setItem("gamification", updatedState);

      return { xpAwarded: xp, newTotal: newTotalXP, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to award XP:", err);
      return null;
    }
  }, [gameState, setItem]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId, achievement) => {
    try {
      if (gameState.achievements?.includes(achievementId)) {
        return null; // Already unlocked
      }

      const xpReward = achievement.xpReward || 50;
      const updatedState = {
        ...gameState,
        achievements: [...(gameState.achievements || []), achievementId],
        totalXP: (gameState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);

      return { achievementId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to unlock achievement:", err);
      return null;
    }
  }, [gameState, setItem]);

  // Complete challenge
  const completeChallenge = useCallback((challengeId, challenge) => {
    try {
      // Check if already completed in this cycle
      const alreadyCompleted = gameState.completedChallenges?.some(c => c.id === challengeId);

      if (alreadyCompleted) {
        return null;
      }

      const xpReward = challenge.xpReward || 50;
      const completedChallenge = {
        id: challengeId,
        completedAt: new Date().toISOString(),
        xpReward
      };

      const updatedState = {
        ...gameState,
        completedChallenges: [...(gameState.completedChallenges || []), completedChallenge],
        totalXP: (gameState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);

      return { challengeId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      return null;
    }
  }, [gameState, setItem]);

  // Update streak
  const updateStreak = useCallback((add = true) => {
    try {
      let newStreak = add ? (gameState.currentStreak || 0) + 1 : 0;
      let newBestStreak = gameState.bestStreak || 0;

      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }

      const updatedState = {
        ...gameState,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };

      setItem("gamification", updatedState);

      return { currentStreak: newStreak, bestStreak: newBestStreak };
    } catch (err) {
      console.error("Failed to update streak:", err);
      return null;
    }
  }, [gameState, setItem]);

  // Get current level info
  const getLevelInfo = useCallback(() => {
    try {
      const totalXP = gameState.totalXP || 0;
      return gamification.getLevelFromXP(totalXP);
    } catch (err) {
      console.error("Failed to get level info:", err);
      return null;
    }
  }, [gameState.totalXP]);

  // Get rank tier
  const getRankTier = useCallback(() => {
    try {
      const levelInfo = getLevelInfo();
      if (!levelInfo) return null;
      return gamification.getRankTier(levelInfo.level);
    } catch (err) {
      console.error("Failed to get rank tier:", err);
      return null;
    }
  }, [getLevelInfo]);

  // Get all stats
  const getGameStats = useCallback(() => {
    try {
      return gamification.getGamificationStats(gameState);
    } catch (err) {
      console.error("Failed to get game stats:", err);
      return null;
    }
  }, [gameState]);

  // Predict next achievement
  const predictNextAchievement = useCallback(() => {
    try {
      return gamification.predictNextAchievement(gameState);
    } catch (err) {
      console.error("Failed to predict next achievement:", err);
      return null;
    }
  }, [gameState]);

  // Reset gamification (debug only)
  const resetGamification = useCallback(() => {
    const initialState = {
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      achievements: [],
      completedChallenges: [],
      leaderboardPosition: 0,
      totalWorkouts: 0,
      totalNutritionDays: 0,
      milestones: []
    };

    setItem("gamification", initialState);
  }, [setItem]);

  // Deprecated: initializeGamification is now handled by reactive useMemo
  const initializeGamification = useCallback(() => {
    return gameState;
  }, [gameState]);

  return {
    gameState,
    initializeGamification,
    awardXP,
    unlockAchievement,
    completeChallenge,
    updateStreak,
    getLevelInfo,
    getRankTier,
    getGameStats,
    predictNextAchievement,
    resetGamification
  };
};

export default useGamification;
