export interface ScoreFilterDependencies {
  document: Document;
  minimumScore: number;
  onMinimumScoreChange(minimumScore: number): void;
}

export function createScoreFilter({
  document,
  minimumScore,
  onMinimumScoreChange,
}: ScoreFilterDependencies): void {
  const filterPanel = document.createElement("div");
  filterPanel.style =
    "position:fixed;top:10px;right:10px;background:white;padding:10px;border:1px solid black;z-index:1000;";
  document.body.appendChild(filterPanel);
  const heading = document.createElement("h3");
  heading.textContent = "Hide Score";
  const minimumScoreSlider = document.createElement("input");
  minimumScoreSlider.type = "range";
  minimumScoreSlider.min = "0";
  minimumScoreSlider.max = "10";
  minimumScoreSlider.step = "0.1";
  minimumScoreSlider.value = String(minimumScore);
  minimumScoreSlider.style.width = "300px";
  const scoreLabel = document.createElement("div");
  scoreLabel.append("Score: ");
  const score = document.createElement("span");
  score.id = "limit-score";
  scoreLabel.appendChild(score);
  filterPanel.append(heading, minimumScoreSlider, scoreLabel);

  minimumScoreSlider.addEventListener("input", () => {
    onMinimumScoreChange(Number(minimumScoreSlider.value));
  });
}
