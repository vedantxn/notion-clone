const storage = globalThis.localStorage;

if (typeof storage === "undefined" || typeof storage.getItem !== "function") {
  const memory = new Map<string, string>();

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    enumerable: true,
    value: {
      get length() {
        return memory.size;
      },
      clear() {
        memory.clear();
      },
      getItem(key: string) {
        return memory.get(String(key)) ?? null;
      },
      key(index: number) {
        return Array.from(memory.keys())[index] ?? null;
      },
      removeItem(key: string) {
        memory.delete(String(key));
      },
      setItem(key: string, value: string) {
        memory.set(String(key), String(value));
      },
    },
  });
}

