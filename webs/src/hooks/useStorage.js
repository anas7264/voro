import { useContext, useSyncExternalStore, useCallback, useRef } from "react";
import { StorageContext } from "../context/StorageContext";
import storage from "../utils/storage";

/**
 * ⚡ OPTIMIZATION: Granular Reactivity Hook.
 * Enables surgical reactivity by allowing components to subscribe to specific
 * data slices from storage keys using a custom selector and equality check.
 */
export const useStorageKeySelector = (key, selector, equalityFn) => {
  const lastStateRef = useRef();
  const lastSelectedStateRef = useRef();

  /**
   * ⚡ OPTIMIZATION: High-performance shallow equality check.
   * Drastically faster than JSON.stringify for large objects and arrays.
   */
  const defaultEquality = useCallback((a, b) => {
    if (a === b) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, keysA[i]) || a[keysA[i]] !== b[keysA[i]]) {
        return false;
      }
    }
    return true;
  }, []);

  const effectiveEqualityFn = equalityFn || defaultEquality;

  const getSnapshot = useCallback(() => {
    const fullState = storage.get(key);

    if (fullState === lastStateRef.current) {
      return lastSelectedStateRef.current;
    }

    const selectedState = selector(fullState);
    if (lastSelectedStateRef.current !== undefined && effectiveEqualityFn(lastSelectedStateRef.current, selectedState)) {
      lastStateRef.current = fullState;
      return lastSelectedStateRef.current;
    }

    lastStateRef.current = fullState;
    lastSelectedStateRef.current = selectedState;
    return selectedState;
  }, [key, selector, effectiveEqualityFn]);

  const subscribe = useCallback((callback) => {
    return storage.subscribe((updatedKey) => {
      if (updatedKey === '*' || updatedKey === key) {
        callback();
      }
    });
  }, [key]);

  return useSyncExternalStore(subscribe, getSnapshot);
};

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

  const getSnapshot = useCallback(() => storage.get(key), [key]);

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
  const subscribe = useCallback((cb) => storage.subscribe(cb), []);
  const getSnapshot = useCallback(() => storage.getAllSync(), []);

  const storageData = useSyncExternalStore(subscribe, getSnapshot);

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
