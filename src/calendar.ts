import type { Settings } from "./settings";

export interface Calendar {
  prepare(settings: Settings): Promise<void>;
  refresh(settings: Settings): void;
}

export interface CalendarDependencies {
  document: Document;
  fetch: typeof fetch;
  onHiddenSubjectsChange(hidden: string[]): void;
}

export function createCalendar({
  document,
  fetch,
  onHiddenSubjectsChange,
}: CalendarDependencies): Calendar {
  let hiddenSubjectUrls = new Set<string>();
  const scoreBySubjectItem = new Map<HTMLElement, number>();
  const daySchedules = [...document.querySelectorAll<HTMLUListElement>(".week ul.coverList")].map(
    (listElement) => ({
      items: [...listElement.querySelectorAll<HTMLElement>(":scope>li")],
      listElement,
    }),
  );

  function getSubjectUrl(subjectItem: HTMLElement): string {
    return subjectItem.querySelector<HTMLAnchorElement>("a")?.href || "";
  }

  function getEffectiveScore(subjectItem: HTMLElement): number {
    const subjectUrl = getSubjectUrl(subjectItem);
    return hiddenSubjectUrls.has(subjectUrl) ? 0 : scoreBySubjectItem.get(subjectItem) || 0;
  }

  function refresh(settings: Settings): void {
    hiddenSubjectUrls = new Set(settings.hidden);

    for (const { items, listElement } of daySchedules) {
      items.forEach((item) => listElement.removeChild(item));
      items.sort(
        (firstItem, secondItem) => getEffectiveScore(secondItem) - getEffectiveScore(firstItem),
      );
      items.forEach((item) => listElement.appendChild(item));
    }

    const minimumScore = settings.scoreLimit;
    document.getElementById("limit-score")!.textContent = String(minimumScore);

    for (const [subjectItem] of scoreBySubjectItem) {
      subjectItem.style.display = getEffectiveScore(subjectItem) < minimumScore ? "none" : "";
    }
  }

  async function fetchSubjectScore(subjectItem: HTMLElement): Promise<number | undefined> {
    try {
      const response = await fetch(getSubjectUrl(subjectItem));
      const subjectPage = await response.text();
      const scoreElement = new DOMParser()
        .parseFromString(subjectPage, "text/html")
        .querySelector(".global_score .number");

      return scoreElement ? Number(scoreElement.textContent) : undefined;
    } catch {
      return undefined;
    }
  }

  async function prepareSubjectItem(subjectItem: HTMLElement): Promise<void> {
    const score = (await fetchSubjectScore(subjectItem)) || 0;
    scoreBySubjectItem.set(subjectItem, score);

    subjectItem
      .querySelectorAll<HTMLAnchorElement>("a")
      .forEach((link) => link.setAttribute("target", "_blank"));

    const subjectUrl = getSubjectUrl(subjectItem);
    const scoreAndActions = document.createElement("span");
    scoreAndActions.style =
      "background:black;color:white;font-size:24px;position:relative;top:10px;";
    if (score) {
      scoreAndActions.textContent = String(score);
    }

    const visibilityButton = document.createElement("button");
    visibilityButton.style = "margin-left: 8px";
    visibilityButton.textContent = hiddenSubjectUrls.has(subjectUrl) ? "Show" : "Hide";
    visibilityButton.addEventListener("click", () => {
      let hidden: string[];
      if (hiddenSubjectUrls.has(subjectUrl)) {
        hidden = [...hiddenSubjectUrls].filter((hiddenUrl) => hiddenUrl !== subjectUrl);
        visibilityButton.textContent = "Hide";
      } else {
        hidden = [...hiddenSubjectUrls, subjectUrl];
        visibilityButton.textContent = "Show";
      }
      hiddenSubjectUrls = new Set(hidden);
      onHiddenSubjectsChange(hidden);
    });

    scoreAndActions.appendChild(visibilityButton);
    subjectItem.appendChild(scoreAndActions);
  }

  async function prepare(settings: Settings): Promise<void> {
    hiddenSubjectUrls = new Set(settings.hidden);
    for (const { items } of daySchedules) {
      await Promise.all(items.map(prepareSubjectItem));
    }
  }

  return { prepare, refresh };
}
