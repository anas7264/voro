import { useContext, useSyncExternalStore, useCallback } from "react";
import { StorageContext } from "../context/StorageContext";
import storage from "../utils/storage";

/**
 * ⚡ OPTIMIZATION: Surgical Reactivity.
 * Subscribes only to a specific storage key. Prevents redundant re-renders
 * when unrelated keys in the storage manifest change.
 */
export const useStorageKey = (key) => {
  const subscribe = useCallback((callback) => {
    return storage.subscribe((updatedKey) => {
      if (updatedKey === '*' || updatedKey === key) {
        callback();
      }
    });
  }, [key]);

  const getSnapshot = () => storage.get(key);

  return useSyncExternalStore(subscribe, getSnapshot);
};

export const useStorage = () => {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error("useStorage must be used within StorageProvider");
  }

  /**
   * ⚡ OPTIMIZATION: Reactive storageData.
   * Uses useSyncExternalStore to subscribe to all storage changes.
   * This ensures components using the full storageData remain reactive
   * even though StorageProvider is now stable.
   */
  const storageData = useSyncExternalStore(
    storage.subscribe.bind(storage),
    storage.getAllSync.bind(storage)
  );

  // Provide aliases for backwards-compatible API
  return {
    ...context,
    storageData,
    getStorage: context.getItem,
    setStorage: context.setItem,
    updateItem: context.updateItem,
    removeStorage: context.deleteItem,
  };
};

/**
 * ⚡ OPTIMIZATION: Stable storage methods.
 * Use this when you only need to perform write operations (setItem, deleteItem)
 * and do not need to react to changes. Prevents redundant re-renders.
 */
export const useStorageMethods = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageMethods must be used within StorageProvider");
  }
  return context;
};

export default useStorage;
