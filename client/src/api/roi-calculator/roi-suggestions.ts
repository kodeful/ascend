export function getInvestmentSuggestion({
  maxCompoundedROI,
  maxExpectedROI,
  // maxTotalSavings,
  minCompoundedROI,
  minExpectedROI,
  // minTotalSavings,
}: {
  maxCompoundedROI: number;
  maxExpectedROI: number;
  // maxTotalSavings: number;
  minCompoundedROI: number;
  minExpectedROI: number;
  // minTotalSavings: number;
}) {
  // Positive if even worst case ROI is above 0
  if (minExpectedROI > 0 && minCompoundedROI > 0) {
    return "The ROI for this investment exceeds the target. Investing in this Development Program for these First-Line Managers is expected to exceed the desired value.";
  }

  // Mixed: some positive, some negative
  if (
    (maxExpectedROI > 0 || maxCompoundedROI > 0) &&
    (minExpectedROI < 0 || minCompoundedROI < 0)
  ) {
    return "The ROI varies across scenarios. While some cases show positive outcomes, there is a risk of underperformance in others. Consider reviewing assumptions or conducting a pilot before scaling.";
  }

  // Negative if all are below or near 0
  if (maxExpectedROI <= 0 && maxCompoundedROI <= 0) {
    return "The ROI for this investment is below expectations. It is not expected to meet the target value, and proceeding may not be financially advisable.";
  }

  // Fallback if values are near zero
  return "The ROI projections are neutral or uncertain. Further analysis is recommended before making an investment decision.";
}
