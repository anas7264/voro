import { useState, useCallback } from "react";
import { useStorage } from "./useStorage";
import * as gamification from "../utils/gamification";

export const useGamification = () => {
  const { getItem, setItem, appendItem } = useStorage();
  const [gameState, setGameState] = useState(null);

  // Initialize gamification state
  const initializeGamification = useCallback(() => {
    try {
      let state = getItem("gamification");

      if (!state) {
        state = {
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

        setItem("gamification", state);
      }

      setGameState(state);
      return state;
    } catch (err) {
      console.error("Failed to initialize gamification:", err);
      return null;
    }
  }, [getItem, setItem]);

  // Award XP for action
  const awardXP = useCallback((action, metadata = {}) => {
    try {
      const xp = gamification.calculateXP(action, metadata);

      if (xp === 0) return null;

      const currentState = getItem("gamification") || gameState;
      const newTotalXP = (currentState.totalXP || 0) + xp;
      const levelInfo = gamification.getLevelFromXP(newTotalXP);

      const updatedState = {
        ...currentState,
        totalXP: newTotalXP,
        level: levelInfo.level
      };

      setItem("gamification", updatedState);
      setGameState(updatedState);

      return { xpAwarded: xp, newTotal: newTotalXP, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to award XP:", err);
      return null;
    }
  }, [getItem, setItem, gameState]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId, achievement) => {
    try {
      const currentState = getItem("gamification") || gameState;

      if (currentState.achievements?.includes(achievementId)) {
        return null; // Already unlocked
      }

      const xpReward = achievement.xpReward || 50;
      const updatedState = {
        ...currentState,
        achievements: [...(currentState.achievements || []), achievementId],
        totalXP: (currentState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);
      setGameState(updatedState);

      return { achievementId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to unlock achievement:", err);
      return null;
    }
  }, [getItem, setItem, gameState]);

  // Complete challenge
  const completeChallenge = useCallback((challengeId, challenge) => {
    try {
      const currentState = getItem("gamification") || gameState;

      // Check if already completed in this cycle
      const alreadyCompleted = currentState.completedChallenges?.some(c => c.id === challengeId);

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
        ...currentState,
        completedChallenges: [...(currentState.completedChallenges || []), completedChallenge],
        totalXP: (currentState.totalXP || 0) + xpReward
      };

      const levelInfo = gamification.getLevelFromXP(updatedState.totalXP);
      updatedState.level = levelInfo.level;

      setItem("gamification", updatedState);
      setGameState(updatedState);

      return { challengeId, xpRewarded: xpReward, newLevel: levelInfo.level };
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      return null;
    }
  }, [getItem, setItem, gameState]);

  // Update streak
  const updateStreak = useCallback((add = true) => {
    try {
      const currentState = getItem("gamification") || gameState;

      let newStreak = add ? (currentState.currentStreak || 0) + 1 : 0;
      let newBestStreak = currentState.bestStreak || 0;

      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }

      const updatedState = {
        ...currentState,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };

      setItem("gamification", updatedState);
      setGameState(updatedState);

      return { currentStreak: newStreak, bestStreak: newBestStreak };
    } catch (err) {
      console.error("Failed to update streak:", err);
      return null;
    }
  }, [getItem, setItem, gameState]);

  // Get current level info
  const getLevelInfo = useCallback(() => {
    try {
      const currentState = getItem("gamification") || gameState;
      const totalXP = currentState.totalXP || 0;

      return gamification.getLevelFromXP(totalXP);
    } catch (err) {
      console.error("Failed to get level info:", err);
      return null;
    }
  }, [getItem, gameState]);

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
      const currentState = getItem("gamification") || gameState;

      return gamification.getGamificationStats(currentState);
    } catch (err) {
      console.error("Failed to get game stats:", err);
      return null;
    }
  }, [getItem, gameState]);

  // Predict next achievement
  const predictNextAchievement = useCallback(() => {
    try {
      const currentState = getItem("gamification") || gameState;

      return gamification.predictNextAchievement(currentState);
    } catch (err) {
      console.error("Failed to predict next achievement:", err);
      return null;
    }
  }, [getItem, gameState]);

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
    setGameState(initialState);
  }, [setItem]);

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
