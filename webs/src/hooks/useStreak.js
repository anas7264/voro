import { useState, useCallback, useEffect } from "react";
import { useStorage } from "./useStorage";
import * as gamification from "../utils/gamification";

export const useStreak = () => {
  const { getItem, setItem, appendItem } = useStorage();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState([]);
  const [streakStatus, setStreakStatus] = useState("active"); // "active", "broken", "resting"

  // Initialize streak data
  const initializeStreak = useCallback(() => {
    try {
      let streakData = getItem("streak") || {
        current: 0,
        best: 0,
        completedDates: [],
        lastCompletedDate: null
      };

      setCurrentStreak(streakData.current);
      setBestStreak(streakData.best);
      setCompletedDates(streakData.completedDates || []);

      checkStreakStatus(streakData);

      return streakData;
    } catch (err) {
      console.error("Failed to initialize streak data:", err);
      return null;
    }
  }, [getItem]);

  // Check if streak should be broken
  const checkStreakStatus = useCallback((streakData) => {
    if (!streakData?.lastCompletedDate) {
      setStreakStatus("resting");
      return;
    }

    const lastDate = new Date(streakData.lastCompletedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      setStreakStatus("completed_today");
    } else if (daysDifference === 1) {
      setStreakStatus("active");
    } else {
      setStreakStatus("broken");
      if (streakData.current > 0) {
        setCurrentStreak(0);
      }
    }
  }, []);

  // Mark day as completed
  const markDayCompleted = useCallback(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let streakData = getItem("streak") || {
        current: 0,
        best: 0,
        completedDates: [],
        lastCompletedDate: null
      };

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
        } else {
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
      setCurrentStreak(newStreak);
      setBestStreak(newBestStreak);
      setCompletedDates(updatedDates);
      setStreakStatus("completed_today");

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
  }, [getItem, setItem]);

  // Get streak info
  const getStreakInfo = useCallback(() => {
    try {
      const streakData = getItem("streak") || {
        current: 0,
        best: 0,
        completedDates: [],
        lastCompletedDate: null
      };

      return {
        current: streakData.current,
        best: streakData.best,
        completedDates: streakData.completedDates || [],
        lastCompletedDate: streakData.lastCompletedDate,
        status: streakStatus
      };
    } catch (err) {
      console.error("Failed to get streak info:", err);
      return null;
    }
  }, [getItem, streakStatus]);

  // Get streak percentage for week
  const getWeeklyStreakPercentage = useCallback(() => {
    try {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());

      let daysCompleted = 0;

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split("T")[0];

        if (completedDates?.includes(dateString)) {
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
  const getMonthlyStreakCount = useCallback(() => {
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return completedDates?.filter(date => {
        const dateObj = new Date(date);
        return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
      }).length || 0;
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
      setCurrentStreak(0);
      setCompletedDates([]);
      setStreakStatus("resting");

      return true;
    } catch (err) {
      console.error("Failed to reset streak:", err);
      return false;
    }
  }, [bestStreak, setItem]);

  // Auto-check streak on component mount
  useEffect(() => {
    initializeStreak();
  }, []);

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
