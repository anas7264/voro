import { useContext } from "react";
import { StorageContext } from "../context/StorageContext";

export const useStorage = () => {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error("useStorage must be used within StorageProvider");
  }

  // Provide aliases for backwards-compatible API
  return {
    ...context,
    storageData: context.storageData,
    getStorage: context.getItem,
    setStorage: context.setItem,
    removeStorage: context.deleteItem,
  };
};

export default useStorage;
