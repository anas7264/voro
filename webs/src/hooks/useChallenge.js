import { useState, useCallback } from "react";
import { useStorage } from "./useStorage";
import { challenges } from "../data/challenges";
import * as gamification from "../utils/gamification";

export const useChallenge = () => {
  const { getItem, setItem } = useStorage();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [userChallengeProgress, setUserChallengeProgress] = useState({});

  // Initialize challenges
  const initializeChallenges = useCallback(() => {
    try {
      const active = gamification.getActiveChallenges(challenges, "all");
      setActiveChallenges(active);

      let progress = getItem("challengeProgress") || {};
      setUserChallengeProgress(progress);

      return active;
    } catch (err) {
      console.error("Failed to initialize challenges:", err);
      return [];
    }
  }, [getItem]);

  // Get active challenges by type
  const getActiveChallengesByType = useCallback((type) => {
    try {
      return gamification.getActiveChallenges(challenges, type);
    } catch (err) {
      console.error("Failed to get active challenges:", err);
      return [];
    }
  }, []);

  // Update challenge progress
  const updateChallengeProgress = useCallback((challengeId, progressData) => {
    try {
      const current = userChallengeProgress[challengeId] || {};
      const updated = { ...current, ...progressData, lastUpdated: new Date().toISOString() };

      const newProgress = { ...userChallengeProgress, [challengeId]: updated };
      setItem("challengeProgress", newProgress);
      setUserChallengeProgress(newProgress);

      return updated;
    } catch (err) {
      console.error("Failed to update challenge progress:", err);
      return null;
    }
  }, [userChallengeProgress, setItem]);

  // Check if challenge is complete
  const isChallengeComplete = useCallback((challengeId) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      const progress = userChallengeProgress[challengeId];

      if (!challenge || !progress) return false;

      const completion = gamification.checkChallengeCompletion(challenge, progress);
      return completion.isComplete;
    } catch (err) {
      console.error("Failed to check challenge completion:", err);
      return false;
    }
  }, [userChallengeProgress]);

  // Get challenge progress
  const getChallengeProgress = useCallback((challengeId) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      const progress = userChallengeProgress[challengeId];

      if (!challenge || !progress) return null;

      return gamification.checkChallengeCompletion(challenge, progress);
    } catch (err) {
      console.error("Failed to get challenge progress:", err);
      return null;
    }
  }, [userChallengeProgress]);

  // Get all challenge progress
  const getAllChallengeProgress = useCallback(() => {
    try {
      const allProgress = activeChallenges.map(challenge => ({
        challenge,
        progress: getChallengeProgress(challenge.id),
        isComplete: isChallengeComplete(challenge.id)
      }));

      return allProgress;
    } catch (err) {
      console.error("Failed to get all challenge progress:", err);
      return [];
    }
  }, [activeChallenges, getChallengeProgress, isChallengeComplete]);

  // Reset daily challenges
  const resetDailyChallenges = useCallback(() => {
    try {
      const dailyChallenges = challenges.filter(c => c.duration === "daily");
      const newProgress = { ...userChallengeProgress };

      dailyChallenges.forEach(challenge => {
        delete newProgress[challenge.id];
      });

      setItem("challengeProgress", newProgress);
      setUserChallengeProgress(newProgress);

      return true;
    } catch (err) {
      console.error("Failed to reset daily challenges:", err);
      return false;
    }
  }, [userChallengeProgress, setItem]);

  // Reset weekly challenges
  const resetWeeklyChallenges = useCallback(() => {
    try {
      const weeklyChallenges = challenges.filter(c => c.duration === "weekly");
      const newProgress = { ...userChallengeProgress };

      weeklyChallenges.forEach(challenge => {
        delete newProgress[challenge.id];
      });

      setItem("challengeProgress", newProgress);
      setUserChallengeProgress(newProgress);

      return true;
    } catch (err) {
      console.error("Failed to reset weekly challenges:", err);
      return false;
    }
  }, [userChallengeProgress, setItem]);

  // Get challenge by ID
  const getChallengeById = useCallback((challengeId) => {
    return challenges.find(c => c.id === challengeId);
  }, []);

  // Get all challenges
  const getAllChallenges = useCallback(() => {
    return challenges;
  }, []);

  // Get challenges by category
  const getChallengesByCategory = useCallback((category) => {
    return challenges.filter(c => c.category === category);
  }, []);

  return {
    activeChallenges,
    userChallengeProgress,
    initializeChallenges,
    getActiveChallengesByType,
    updateChallengeProgress,
    isChallengeComplete,
    getChallengeProgress,
    getAllChallengeProgress,
    resetDailyChallenges,
    resetWeeklyChallenges,
    getChallengeById,
    getAllChallenges,
    getChallengesByCategory
  };
};

export default useChallenge;
