// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCalendar, type Calendar } from "./calendar";
import type { Settings } from "./settings";

const subjectUrl = (id: string) => `https://bangumi.tv/subject/${id}`;

function renderDaySchedule(...ids: string[]): void {
  const week = document.createElement("div");
  week.className = "week";
  const list = document.createElement("ul");
  list.className = "coverList";

  for (const id of ids) {
    const item = document.createElement("li");
    item.id = id;
    const link = document.createElement("a");
    link.href = subjectUrl(id);
    link.textContent = id;
    item.appendChild(link);
    list.appendChild(item);
  }

  week.appendChild(list);
  document.body.replaceChildren(week);
  const score = document.createElement("span");
  score.id = "limit-score";
  document.body.appendChild(score);
}

function scorePage(score?: number): Response {
  return new Response(
    score === undefined
      ? "<html></html>"
      : `<div class="global_score"><span class="number">${score}</span></div>`,
  );
}

function itemIds(): string[] {
  return [...document.querySelectorAll<HTMLLIElement>(".coverList > li")].map(({ id }) => id);
}

describe("Calendar", () => {
  beforeEach(() => document.body.replaceChildren());

  it("prepares Subject Items and refreshes their order and visibility", async () => {
    renderDaySchedule("low", "high");
    let settings: Settings = {
      scoreLimit: 7,
      hidden: [subjectUrl("high")],
    };
    const hiddenChanges: string[][] = [];
    let calendar: Calendar;
    calendar = createCalendar({
      document,
      fetch: vi.fn(async (input: RequestInfo | URL) =>
        scorePage(String(input) === subjectUrl("high") ? 8.7 : 4),
      ),
      onHiddenSubjectsChange(hidden: string[]) {
        hiddenChanges.push(hidden);
        settings = { ...settings, hidden };
        calendar.refresh(settings);
      },
    });

    await calendar.prepare(settings);
    calendar.refresh(settings);

    const high = document.querySelector<HTMLElement>("#high")!;
    const low = document.querySelector<HTMLElement>("#low")!;
    const highButton = high.querySelector("button")!;

    expect(itemIds()).toEqual(["low", "high"]);
    expect(high.style.display).toBe("none");
    expect(low.style.display).toBe("none");
    expect(high.querySelector("span")?.textContent).toBe("8.7Show");
    expect(low.querySelector("span")?.textContent).toBe("4Hide");
    expect(
      [...document.querySelectorAll<HTMLAnchorElement>(".coverList a")].map(({ target }) => target),
    ).toEqual(["_blank", "_blank"]);
    expect(document.getElementById("limit-score")?.textContent).toBe("7");

    highButton.click();
    expect(hiddenChanges).toEqual([[]]);
    expect(itemIds()).toEqual(["high", "low"]);
    expect(high.style.display).toBe("");
    expect(highButton.textContent).toBe("Hide");

    highButton.click();
    expect(hiddenChanges).toEqual([[], [subjectUrl("high")]]);
    expect(itemIds()).toEqual(["low", "high"]);
    expect(high.style.display).toBe("none");
    expect(highButton.textContent).toBe("Show");
  });

  it("uses zero scores when subject pages have no score or cannot be fetched", async () => {
    renderDaySchedule("missing", "failed", "no-link");
    document.querySelector("#no-link a")!.remove();
    const calendar = createCalendar({
      document,
      fetch: vi.fn(async (input: RequestInfo | URL) => {
        if (String(input) === subjectUrl("failed")) {
          throw new Error("network failure");
        }
        return scorePage();
      }),
      onHiddenSubjectsChange: vi.fn(),
    });
    const settings: Settings = { scoreLimit: 5, hidden: [] };

    await calendar.prepare(settings);
    calendar.refresh(settings);

    expect(itemIds()).toEqual(["missing", "failed", "no-link"]);
    for (const id of itemIds()) {
      expect(document.querySelector(`#${id} span`)?.textContent).toBe("Hide");
      expect(document.querySelector<HTMLElement>(`#${id}`)!.style.display).toBe("none");
    }
  });
});
