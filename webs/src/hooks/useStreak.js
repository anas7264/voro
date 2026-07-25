import { useMemo, useCallback } from "react";
import { useStorageMethods, useStorageKey } from "./useStorage";
import { getFastDateStr } from "@/utils/formatters";

export const useStreak = () => {
  const { setItem } = useStorageMethods();
  const streakDataFromStorage = useStorageKey("streak");

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'streak' data to prevent redundant re-renders
   * when unrelated storage keys change.
   */
  const streakData = useMemo(() => {
    return streakDataFromStorage || {
      current: 0,
      best: 0,
      completedDates: [],
      lastCompletedDate: null
    };
  }, [streakDataFromStorage]);

  // Derived metrics from streak data
  const currentStreak = streakData.current;
  const bestStreak = streakData.best;
  const completedDates = streakData.completedDates || [];

  // Synchronous streak status derivation
  const streakStatus = useMemo(() => {
    if (!streakData.lastCompletedDate) {
      return "resting";
    }

    const lastDate = new Date(streakData.lastCompletedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return "completed_today";
    } else if (daysDifference === 1) {
      return "active";
    } else {
      return "broken";
    }
  }, [streakData.lastCompletedDate]);

  // Mark day as completed
  const markDayCompleted = useCallback(() => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Check if already completed today
      if (streakData.lastCompletedDate?.includes(today)) {
        return { message: "Already completed today", updated: false };
      }

      // Calculate new streak
      const lastDate = streakData.lastCompletedDate;
      let newStreak = streakData.current || 0;

      if (lastDate) {
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const daysDifference = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

        if (daysDifference === 1) {
          newStreak += 1;
        } else if (daysDifference > 1) {
          newStreak = 1; // Streak broken, restart
        } else if (daysDifference < 0) {
          // Future date or something weird
          return { message: "Already completed today", updated: false };
        }
      } else {
        newStreak = 1; // First day
      }

      // Update best streak
      let newBestStreak = streakData.best || 0;
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }

      // Update data
      const updatedDates = [...(streakData.completedDates || []), today];
      const updatedStreakData = {
        current: newStreak,
        best: newBestStreak,
        completedDates: updatedDates,
        lastCompletedDate: today
      };

      setItem("streak", updatedStreakData);

      return {
        message: "Day completed",
        updated: true,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };
    } catch (err) {
      console.error("Failed to mark day as completed:", err);
      return { message: "Error marking day complete", updated: false, error: err };
    }
  }, [streakData, setItem]);

  // Get streak info (legacy support)
  const getStreakInfo = useCallback(() => {
    return {
      ...streakData,
      status: streakStatus
    };
  }, [streakData, streakStatus]);

  // Get streak percentage for week
  // ⚡ PERFORMANCE OPTIMIZATION: Uses Set-based O(1) membership checks and fast manual Date formatting via `getFastDateStr`.
  const getWeeklyStreakPercentage = useCallback(() => {
    try {
      if (!completedDates || completedDates.length === 0) return 0;
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());

      const completedSet = new Set(completedDates);
      let daysCompleted = 0;

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateString = getFastDateStr(date);

        if (completedSet.has(dateString)) {
          daysCompleted++;
        }
      }

      return Math.round((daysCompleted / 7) * 100);
    } catch (err) {
      console.error("Failed to calculate weekly streak percentage:", err);
      return 0;
    }
  }, [completedDates]);

  // Get monthly streak count
  // ⚡ PERFORMANCE OPTIMIZATION: Bypasses hundreds of dynamic Date allocations by executing a zero-allocation string prefix match via `.startsWith()`.
  const getMonthlyStreakCount = useCallback(() => {
    try {
      if (!completedDates || completedDates.length === 0) return 0;
      const today = new Date();
      const yearStr = today.getFullYear().toString();
      const monthStr = (today.getMonth() + 1).toString().padStart(2, "0");
      const prefix = `${yearStr}-${monthStr}`;

      let count = 0;
      for (let i = 0; i < completedDates.length; i++) {
        const d = completedDates[i];
        if (d && d.startsWith(prefix)) {
          count++;
        }
      }
      return count;
    } catch (err) {
      console.error("Failed to get monthly streak count:", err);
      return 0;
    }
  }, [completedDates]);

  // Reset streak (admin only)
  const resetStreak = useCallback(() => {
    try {
      const resetData = {
        current: 0,
        best: bestStreak, // Keep best streak record
        completedDates: [],
        lastCompletedDate: null
      };

      setItem("streak", resetData);
      return true;
    } catch (err) {
      console.error("Failed to reset streak:", err);
      return false;
    }
  }, [bestStreak, setItem]);

  // Deprecated: initializeStreak is now handled by reactive useMemo
  const initializeStreak = useCallback(() => {
    return streakData;
  }, [streakData]);

  // Deprecated: checkStreakStatus is now handled by reactive useMemo
  const checkStreakStatus = useCallback(() => {
    return streakStatus;
  }, [streakStatus]);

  return {
    currentStreak,
    bestStreak,
    completedDates,
    streakStatus,
    initializeStreak,
    markDayCompleted,
    getStreakInfo,
    getWeeklyStreakPercentage,
    getMonthlyStreakCount,
    resetStreak,
    checkStreakStatus
  };
};

export default useStreak;
