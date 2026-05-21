import React, { createContext, useCallback, useState } from "react";
import storage from "../utils/storage";

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Get item from storage
  const getItem = useCallback((key) => {
    try {
      const value = storage.get(key);
      return value;
    } catch (err) {
      console.error(`Failed to get storage item ${key}:`, err);
      return null;
    }
  }, []);

  // Set item in storage
  const setItem = useCallback((key, value) => {
    try {
      const success = storage.set(key, value);
      if (success) {
        setStorageData(prev => ({ ...prev, [key]: value }));
        setLastUpdated(new Date());
      }
      return success;
    } catch (err) {
      console.error(`Failed to set storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Delete item from storage
  const deleteItem = useCallback((key) => {
    try {
      const success = storage.delete(key);
      if (success) {
        setStorageData(prev => {
          const newData = { ...prev };
          delete newData[key];
          return newData;
        });
        setLastUpdated(new Date());
      }
      return success;
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
  const appendItem = useCallback((key, value) => {
    try {
      const success = storage.append(key, value);
      if (success) {
        const updated = storage.get(key);
        setStorageData(prev => ({ ...prev, [key]: updated }));
        setLastUpdated(new Date());
      }
      return success;
    } catch (err) {
      console.error(`Failed to append to storage item ${key}:`, err);
      return false;
    }
  }, []);

  // Update object in storage (shallow merge)
  const updateItem = useCallback((key, updates) => {
    try {
      const success = storage.update(key, updates);
      if (success) {
        const updated = storage.get(key);
        setStorageData(prev => ({ ...prev, [key]: updated }));
        setLastUpdated(new Date());
      }
      return success;
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
  const getAllData = useCallback(() => {
    try {
      return storage.getAll();
    } catch (err) {
      console.error("Failed to get all storage data:", err);
      return {};
    }
  }, []);

  // Export storage
  const exportData = useCallback(() => {
    try {
      return storage.export();
    } catch (err) {
      console.error("Failed to export storage data:", err);
      return null;
    }
  }, []);

  // Import storage
  const importData = useCallback((backup) => {
    try {
      const success = storage.import(backup);
      if (success) {
        setStorageData(backup.data || {});
        setLastUpdated(new Date());
      }
      return success;
    } catch (err) {
      console.error("Failed to import storage data:", err);
      return false;
    }
  }, []);

  // Clear all storage
  const clearAllData = useCallback(() => {
    try {
      const success = storage.clear();
      if (success) {
        setStorageData({});
        setLastUpdated(new Date());
      }
      return success;
    } catch (err) {
      console.error("Failed to clear storage:", err);
      return false;
    }
  }, []);

  // Get storage size
  const getStorageSize = useCallback(() => {
    try {
      return {
        bytes: storage.getSize(),
        formatted: storage.getSizeFormatted()
      };
    } catch (err) {
      console.error("Failed to get storage size:", err);
      return { bytes: 0, formatted: "0 B" };
    }
  }, []);

  const value = {
    getItem,
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
    lastUpdated
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export default StorageContext;
