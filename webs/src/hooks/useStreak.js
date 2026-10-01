import { useMemo, useCallback } from "react";
import { useStorageMethods, useStorageKeySelector } from "./useStorage";
import { getFastDateStr } from "@/utils/formatters";

const DEFAULT_STREAK_DATA = Object.freeze({
  current: 0,
  best: 0,
  completedDates: Object.freeze([]),
  lastCompletedDate: null
});

const selectStreak = (val) => val || DEFAULT_STREAK_DATA;

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation local midnight timestamp extraction.
 * Converts YYYY-MM-DD ISO strings directly into local midnight epoch timestamps,
 * eliminating UTC string parsing timezone shifts and avoiding Date object mutation allocations.
 */
const getLocalMidnightTime = (dateInput) => {
  if (!dateInput) return null;
  if (typeof dateInput === "string" && dateInput.length === 10 && dateInput.charCodeAt(4) === 45 && dateInput.charCodeAt(7) === 45) {
    const y = parseInt(dateInput.slice(0, 4), 10);
    const m = parseInt(dateInput.slice(5, 7), 10);
    const d = parseInt(dateInput.slice(8, 10), 10);
    if (y >= 1000 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m - 1, d);
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        return dt.getTime();
      }
    }
  }
  const dt = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (!dt || isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
};

export const useStreak = () => {
  const { setItem } = useStorageMethods();

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribes specifically to 'streak' data via useStorageKeySelector
   * to prevent redundant re-renders when unrelated storage keys change.
   */
  const streakData = useStorageKeySelector("streak", selectStreak);

  // Derived metrics from streak data
  const currentStreak = streakData.current;
  const bestStreak = streakData.best;
  const completedDates = streakData.completedDates || [];

  // Synchronous streak status derivation
  // ⚡ PERFORMANCE OPTIMIZATION: Local midnight timestamp calculation bypasses UTC parsing timezone shifts and setHours mutations.
  const streakStatus = useMemo(() => {
    if (!streakData.lastCompletedDate) {
      return "resting";
    }

    const lastTime = getLocalMidnightTime(streakData.lastCompletedDate);
    if (lastTime === null) return "resting";

    const now = new Date();
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const daysDifference = Math.round((todayTime - lastTime) / 86400000);

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
        const lastTime = getLocalMidnightTime(lastDate);
        const todayTime = getLocalMidnightTime(today);

        if (lastTime !== null && todayTime !== null) {
          const daysDifference = Math.round((todayTime - lastTime) / 86400000);

          if (daysDifference === 1) {
            newStreak += 1;
          } else if (daysDifference > 1) {
            newStreak = 1; // Streak broken, restart
          } else if (daysDifference < 0) {
            // Future date or something weird
            return { message: "Already completed today", updated: false };
          }
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
  // Reuses a single mutable Date object with baseTime set to 12:00 (noon) to guarantee DST and calendar boundary immunity.
  const getWeeklyStreakPercentage = useCallback(() => {
    try {
      if (!completedDates || completedDates.length === 0) return 0;
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(12, 0, 0, 0); // Noon base for complete DST shift immunity

      const completedSet = new Set(completedDates);
      let daysCompleted = 0;

      const date = new Date(weekStart);
      const baseTime = weekStart.getTime();
      const dayMs = 86400000;
      for (let i = 0; i < 7; i++) {
        date.setTime(baseTime + i * dayMs);
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
