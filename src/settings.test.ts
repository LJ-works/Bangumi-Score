import { describe, expect, it } from "vitest";

import { loadSettings, saveSettings, type Settings } from "./settings";

function createStorage(initial?: string): Storage {
  const values = new Map<string, string>();
  if (initial !== undefined) {
    values.set("settings", initial);
  }

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("Settings", () => {
  it("loads saved settings and falls back when settings are absent or invalid", () => {
    const saved: Settings = { scoreLimit: 7, hidden: ["/subject/1"] };

    expect(loadSettings(createStorage(JSON.stringify(saved)))).toEqual(saved);
    expect(loadSettings(createStorage())).toEqual({ scoreLimit: 5, hidden: [] });
    expect(loadSettings(createStorage("not json"))).toEqual({ scoreLimit: 5, hidden: [] });
  });

  it("saves settings in the existing JSON format", () => {
    const storage = createStorage();
    const settings: Settings = { scoreLimit: 6.5, hidden: ["/subject/2"] };

    saveSettings(storage, settings);

    expect(storage.getItem("settings")).toBe(JSON.stringify(settings));
  });
});
