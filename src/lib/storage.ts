export function readJsonFromStorage<T>(
  key: string,
  guard: (value: unknown) => value is T,
): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(key);
    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    return guard(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function writeJsonToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error("Unable to save onboarding progress on this device.");
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(key);
}
