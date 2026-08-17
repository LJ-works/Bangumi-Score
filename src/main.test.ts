// @vitest-environment jsdom

import { afterEach, beforeEach, expect, it, vi } from "vitest";

function createStorage(): Storage {
  const values = new Map<string, string>();
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

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("localStorage", createStorage());
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () => new Response('<div class="global_score"><span class="number">8</span></div>'),
    ),
  );

  const week = document.createElement("div");
  week.className = "week";
  const list = document.createElement("ul");
  list.className = "coverList";
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = "https://bangumi.tv/subject/1";
  item.appendChild(link);
  list.appendChild(item);
  week.appendChild(list);
  document.body.replaceChildren(week);
});

afterEach(() => vi.unstubAllGlobals());

it("wires Settings, Calendar, and Minimum Score filter modules", async () => {
  await import("./main");
  await vi.waitFor(() => {
    expect(document.querySelector<HTMLInputElement>('input[type="range"]')).not.toBeNull();
  });

  const item = document.querySelector<HTMLElement>(".coverList > li")!;
  const slider = document.querySelector<HTMLInputElement>('input[type="range"]')!;
  expect(item.style.display).toBe("");
  expect(item.querySelector("span")?.textContent).toBe("8Hide");

  slider.value = "9";
  slider.dispatchEvent(new Event("input"));
  expect(item.style.display).toBe("none");
  expect(JSON.parse(localStorage.getItem("settings")!)).toEqual({
    scoreLimit: 9,
    hidden: [],
  });

  item.querySelector("button")!.click();
  expect(JSON.parse(localStorage.getItem("settings")!)).toEqual({
    scoreLimit: 9,
    hidden: ["https://bangumi.tv/subject/1"],
  });
});
