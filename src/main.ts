import { createCalendar, type Calendar } from "./calendar";
import { createScoreFilter } from "./score-filter";
import { loadSettings, saveSettings, type Settings } from "./settings";

let settings = loadSettings(localStorage);
let calendar: Calendar;

function updateSettings(changes: Partial<Settings>): void {
  settings = { ...settings, ...changes };
  saveSettings(localStorage, settings);
  calendar.refresh(settings);
}

calendar = createCalendar({
  document,
  fetch,
  onHiddenSubjectsChange: (hidden) => updateSettings({ hidden }),
});

void calendar
  .prepare(settings)
  .then(() =>
    createScoreFilter({
      document,
      minimumScore: settings.scoreLimit,
      onMinimumScoreChange: (scoreLimit) => updateSettings({ scoreLimit }),
    }),
  )
  .then(() => calendar.refresh(settings));
