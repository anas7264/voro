import { useMemo, useCallback } from "react";
import { useStorageMethods, useStorageKeySelector } from "./useStorage";
import * as gamification from "../utils/gamification";

const DEFAULT_GAMIFICATION_DATA = Object.freeze({
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  achievements: Object.freeze([]),
  completedChallenges: Object.freeze([]),
  leaderboardPosition: 0,
  totalWorkouts: 0,
  totalNutritionDays: 0,
  milestones: Object.freeze([])
});

const selectGamification = (val) => val || DEFAULT_GAMIFICATION_DATA;

export const useGamification = () => {
  const { getItem, setItem } = useStorageMethods();

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribes specifically to 'gamification' data via useStorageKeySelector
   * to prevent redundant re-renders when unrelated storage keys change.
   */
  const gameState = useStorageKeySelector("gamification", selectGamification);

  // Award XP for action
  const awardXP = useCallback((action, metadata = {}) => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      const xp = gamification.calculateXP(action, metadata);

      if (xp === 0) return null;

      const newTotalXP = (currentGameState.totalXP || 0) + xp;
      const levelInfo = gamification.getLevelFromXP(newTotalXP);

      const updatedState = {
        ...currentGameState,
        totalXP: newTotalXP,
        level: levelInfo.level
      };

      setItem("gamification", updatedState);

      return { xpAwarded: xp, newTotal: newTotalXP, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to award XP:", err);
      return null;
    }
  }, [getItem, setItem]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId, achievement) => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      if (currentGameState.achievements?.includes(achievementId)) {
        return null; // Already unlocked
      }

      const xpReward = achievement.xpReward || 50;
      const updatedState = {
        ...currentGameState,
        achievements: [...(currentGameState.achievements || []), achievementId],
        totalXP: (currentGameState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);

      return { achievementId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to unlock achievement:", err);
      return null;
    }
  }, [getItem, setItem]);

  // Complete challenge
  const completeChallenge = useCallback((challengeId, challenge) => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      // Check if already completed in this cycle
      const alreadyCompleted = currentGameState.completedChallenges?.some(c => c.id === challengeId);

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
        ...currentGameState,
        completedChallenges: [...(currentGameState.completedChallenges || []), completedChallenge],
        totalXP: (currentGameState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);

      return { challengeId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      return null;
    }
  }, [getItem, setItem]);

  // Update streak
  const updateStreak = useCallback((add = true) => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      let newStreak = add ? (currentGameState.currentStreak || 0) + 1 : 0;
      let newBestStreak = currentGameState.bestStreak || 0;

      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }

      const updatedState = {
        ...currentGameState,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };

      setItem("gamification", updatedState);

      return { currentStreak: newStreak, bestStreak: newBestStreak };
    } catch (err) {
      console.error("Failed to update streak:", err);
      return null;
    }
  }, [getItem, setItem]);

  // Get current level info
  const getLevelInfo = useCallback(() => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      const totalXP = currentGameState.totalXP || 0;
      return gamification.getLevelFromXP(totalXP);
    } catch (err) {
      console.error("Failed to get level info:", err);
      return null;
    }
  }, [getItem]);

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
      const currentGameState = selectGamification(getItem("gamification"));
      return gamification.getGamificationStats(currentGameState);
    } catch (err) {
      console.error("Failed to get game stats:", err);
      return null;
    }
  }, [getItem]);

  // Predict next achievement
  const predictNextAchievement = useCallback(() => {
    try {
      const currentGameState = selectGamification(getItem("gamification"));
      return gamification.predictNextAchievement(currentGameState);
    } catch (err) {
      console.error("Failed to predict next achievement:", err);
      return null;
    }
  }, [getItem]);

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
