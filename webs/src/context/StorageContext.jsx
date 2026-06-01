import React, { createContext, useCallback, useState, useEffect } from "react";
import storage from "../utils/storage";

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize and subscribe to storage changes
  useEffect(() => {
    const init = async () => {
      await storage.ensureInitialized();
      setStorageData(storage.getAllSync());
    };

    init();

    const unsubscribe = storage.subscribe((key, value) => {
      if (key === '*') {
        setStorageData(storage.getAllSync());
      } else {
        setStorageData(prev => ({ ...prev, [key]: value }));
      }
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, []);

  // Get item from storage
  const getItem = useCallback((key) => {
    return storageData[key];
  }, [storageData]);

  // Get item from storage asynchronously (bypassing state)
  const getItemAsync = useCallback(async (key) => {
    try {
      const value = await storage.getAsync(key);
      return value;
    } catch (err) {
      console.error(`Failed to get storage item ${key}:`, err);
      return null;
    }
  }, []);

  // Set item in storage
  const setItem = useCallback(async (key, value) => {
    try {
      return await storage.set(key, value);
    } catch (err) {
      console.error(`Failed to set storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Delete item from storage
  const deleteItem = useCallback((key) => {
    try {
      return storage.delete(key);
    } catch (err) {
      console.error(`Failed to delete storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Check if key exists
  const hasItem = useCallback((key) => {
    try {
      return storage.exists(key);
    } catch (err) {
      console.error(`Failed to check storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Append to array in storage
  const appendItem = useCallback(async (key, value) => {
    try {
      return await storage.append(key, value);
    } catch (err) {
      console.error(`Failed to append to storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Update object in storage (shallow merge)
  const updateItem = useCallback(async (key, updates) => {
    try {
      return await storage.update(key, updates);
    } catch (err) {
      console.error(`Failed to update storage item ${key}:`, err);
      return false;
    }
  }, []);

  // List all keys
  const listKeys = useCallback(() => {
    try {
      return storage.list();
    } catch (err) {
      console.error("Failed to list storage keys:", err);
      return [];
    }
  }, []);

  // Get all data
  const getAllData = useCallback(async () => {
    try {
      return await storage.getAll();
    } catch (err) {
      console.error("Failed to get all storage data:", err);
      return {};
    }
  }, []);

  // Export storage
  const exportData = useCallback(async () => {
    try {
      return await storage.export();
    } catch (err) {
      console.error("Failed to export storage data:", err);
      return null;
    }
  }, []);

  // Import storage
  const importData = useCallback(async (backup) => {
    try {
      return await storage.import(backup);
    } catch (err) {
      console.error("Failed to import storage data:", err);
      return false;
    }
  }, []);

  // Clear all storage
  const clearAllData = useCallback(() => {
    try {
      return storage.clear();
    } catch (err) {
      console.error("Failed to clear storage:", err);
      return false;
    }
  }, []);

  // Get storage size
  const getStorageSize = useCallback(async () => {
    try {
      return {
        bytes: await storage.getSize(),
        formatted: await storage.getSizeFormatted()
      };
    } catch (err) {
      console.error("Failed to get storage size:", err);
      return { bytes: 0, formatted: "0 B" };
    }
  }, []);

  const value = {
    getItem,
    getItemAsync,
    setItem,
    deleteItem,
    hasItem,
    appendItem,
    updateItem,
    listKeys,
    getAllData,
    exportData,
    importData,
    clearAllData,
    getStorageSize,
    lastUpdated,
    storageData
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export default StorageContext;
