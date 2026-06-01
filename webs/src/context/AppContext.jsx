import React, { createContext, useState, useCallback, useEffect } from "react";
import storage from "../utils/storage";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Initialize app state from storage
  useEffect(() => {
    const initApp = async () => {
      try {
        await storage.ensureInitialized();
        const storedProfile = storage.get("profile");
        const storedUser = storage.get("user");

        if (storedProfile) {
          setProfile(storedProfile);
          setIsOnboarded(true);
        }

        if (storedUser) {
          setUser(storedUser);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize app state:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    initApp();

    // Subscribe to storage changes to keep state in sync
    const unsubscribe = storage.subscribe((key, value) => {
      if (key === 'profile') {
        setProfile(value);
        setIsOnboarded(!!value);
      } else if (key === 'user') {
        setUser(value);
      } else if (key === '*') {
        const storedProfile = storage.get("profile");
        const storedUser = storage.get("user");
        setProfile(storedProfile);
        setIsOnboarded(!!storedProfile);
        setUser(storedUser);
      }
    });

    return unsubscribe;
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      // State is updated via subscription
      await storage.set("profile", updatedProfile);
      return true;
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message);
      return false;
    }
  }, [profile]);

  // Update user data
  const updateUser = useCallback(async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      // State is updated via subscription
      await storage.set("user", updatedUser);
      return true;
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err.message);
      return false;
    }
  }, [user]);

  // Complete onboarding
  const completeOnboarding = useCallback(async (profileData) => {
    try {
      const newProfile = {
        ...profileData,
        createdAt: new Date().toISOString(),
        completedOnboarding: true
      };

      // State is updated via subscription
      await storage.set("profile", newProfile);

      return true;
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setError(err.message);
      return false;
    }
  }, []);

  // Reset app state (logout)
  const resetAppState = useCallback(() => {
    try {
      setUser(null);
      setProfile(null);
      setIsOnboarded(false);
      setError(null);
      storage.clear();
      return true;
    } catch (err) {
      console.error("Failed to reset app state:", err);
      setError(err.message);
      return false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    isOnboarded,
    updateProfile,
    updateUser,
    completeOnboarding,
    resetAppState,
    clearError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
