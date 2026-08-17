export interface Settings {
  scoreLimit: number;
  hidden: string[];
}

const defaultSettings: Settings = { scoreLimit: 5, hidden: [] };

export function loadSettings(storage: Storage): Settings {
  try {
    return JSON.parse(storage.getItem("settings") || JSON.stringify(defaultSettings)) as Settings;
  } catch {
    return { ...defaultSettings, hidden: [] };
  }
}

export function saveSettings(storage: Storage, settings: Settings): void {
  storage.setItem("settings", JSON.stringify(settings));
}
