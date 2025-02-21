export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
}

// export const getLocalStorageItem = (key: string, defaultValue: string) => {
//   if (typeof window === "undefined") return defaultValue;
//   try {
//     const item = localStorage.getItem(key);
//     return item ? JSON.parse(item) : defaultValue;
//   } catch (error) {
//     console.error("Error accessing localStorage:", error);
//     return defaultValue;
//   }
// };
