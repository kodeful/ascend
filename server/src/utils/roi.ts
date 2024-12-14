import {
  ROICalculatorFields,
  ROICalculatorResult,
} from 'api/models/roi-calculator.model';

export function roiCalculations({
  numFirstLineManagers,
  numEmployeesManaged,
  costPerManagerProgram,
  avgAttritionRateFirstLine,
  avgAttritionRateNonManager,
  minRehireCostFirstLinePercent,
  maxRehireCostFirstLinePercent,
  minRehireCostNonManagerPercent,
  maxRehireCostNonManagerPercent,
  avgSalaryFirstLineManager,
  avgSalaryNonManager,
  investmentDurationYears,
  targetAttritionReductionPercent,
  //   minRoiThresholdPercent,
  compoundRatePercent,
}: ROICalculatorFields): ROICalculatorResult {
  const targetReduction = targetAttritionReductionPercent / 100;
  const compoundRate = compoundRatePercent / 100;

  // Min Total Savings in Rotation
  const minTotalSavings =
    numFirstLineManagers *
      avgAttritionRateFirstLine *
      avgSalaryFirstLineManager *
      targetReduction *
      minRehireCostFirstLinePercent +
    numEmployeesManaged *
      avgAttritionRateNonManager *
      avgSalaryNonManager *
      targetReduction *
      minRehireCostNonManagerPercent;

  // Max Total Savings in Rotation
  const maxTotalSavings =
    numFirstLineManagers *
      avgAttritionRateFirstLine *
      avgSalaryFirstLineManager *
      targetReduction *
      maxRehireCostFirstLinePercent +
    numEmployeesManaged *
      avgAttritionRateNonManager *
      avgSalaryNonManager *
      targetReduction *
      maxRehireCostNonManagerPercent;

  // Min Expected ROI
  const minExpectedROI =
    minTotalSavings / (numFirstLineManagers * costPerManagerProgram) || 0;

  // Max Expected ROI
  const maxExpectedROI =
    maxTotalSavings / (numFirstLineManagers * costPerManagerProgram) || 0;

  // Min Compounded ROI
  const minCompoundedROI =
    minExpectedROI * Math.pow(1 + compoundRate, investmentDurationYears) || 0;

  // Max Compounded ROI
  const maxCompoundedROI =
    maxExpectedROI * Math.pow(1 + compoundRate, investmentDurationYears) || 0;

  // Check against ROI threshold
  //   const isMinROIAboveThreshold = minExpectedROI >= minRoiThresholdPercent / 100;
  //   const isMaxROIAboveThreshold = maxExpectedROI >= minRoiThresholdPercent / 100;

  return {
    minTotalSavings,
    maxTotalSavings,
    minExpectedROI,
    maxExpectedROI,
    minCompoundedROI,
    maxCompoundedROI,
    // isMinROIAboveThreshold,
    // isMaxROIAboveThreshold,
  };
}
