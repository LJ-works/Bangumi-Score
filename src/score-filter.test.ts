// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createScoreFilter, type ScoreFilterDependencies } from "./score-filter";

describe("Minimum Score filter", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders the current Minimum Score and reports slider changes", () => {
    const onMinimumScoreChange = vi.fn();

    const dependencies: ScoreFilterDependencies = {
      document,
      minimumScore: 6.5,
      onMinimumScoreChange,
    };
    createScoreFilter(dependencies);

    const slider = document.querySelector<HTMLInputElement>('input[type="range"]')!;
    expect(document.querySelector("h3")?.textContent).toBe("Hide Score");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("10");
    expect(slider.step).toBe("0.1");
    expect(slider.value).toBe("6.5");
    expect(slider.style.width).toBe("300px");
    expect(document.getElementById("limit-score")?.parentElement?.textContent).toBe("Score: ");

    slider.value = "7.2";
    slider.dispatchEvent(new Event("input"));

    expect(onMinimumScoreChange).toHaveBeenCalledOnce();
    expect(onMinimumScoreChange).toHaveBeenCalledWith(7.2);
  });
});
