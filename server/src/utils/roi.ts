/**************************************************************
 * 1) Define the input fields shape
 **************************************************************/
export interface ROICalculatorFields {
  // Basic counts & salaries
  numFirstLineManagers: number;
  numEmployeesManaged: number;
  avgSalaryFirstLineManager: number;
  avgSalaryNonManager: number;

  // Attrition rates (e.g., user enters 15 for 15%)
  avgAttritionRateFirstLine: number;
  avgAttritionRateNonManager: number;

  // Rehire cost % ranges (e.g., user enters 145 for 145%)
  minRehireCostFirstLinePercent: number;
  maxRehireCostFirstLinePercent: number;
  minRehireCostNonManagerPercent: number;
  maxRehireCostNonManagerPercent: number;

  // Training cost
  costPerManagerProgram: number;

  // Time & improvement assumptions
  investmentDurationYears: number; // e.g., 3
  targetAttritionReductionPercent: number; // e.g., 20 for 20%
  compoundRatePercent: number; // e.g., 5 for 5%

  // Decision threshold
  minRoiThresholdPercent: number; // e.g., 100 => we want at least 100% ROI
}

/**************************************************************
 * 2) Define what we return
 **************************************************************/
export interface ROICalculatorResult {
  // Year 1 total savings
  minTotalSavings: number;
  maxTotalSavings: number;

  // Year 1 ROI
  minExpectedROI: number;
  maxExpectedROI: number;

  // Multi-year ROI (compounded)
  minCompoundedROI: number;
  maxCompoundedROI: number;

  // Additional info
  totalTrainingCost: number;
  meetsROIThreshold: boolean;
}

/**************************************************************
 * 3) Implement the ROI calculation function
 **************************************************************/
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
  minRoiThresholdPercent,
  compoundRatePercent,
}: ROICalculatorFields): ROICalculatorResult {
  /**************************************************************
   * 1) Convert user-entered integer "percents" into decimals
   *    e.g., 15 -> 0.15, 145 -> 1.45, etc.
   **************************************************************/
  // Attrition rates
  const attrRateFLM = avgAttritionRateFirstLine / 100; // e.g. 15 -> 0.15
  const attrRateNonMgr = avgAttritionRateNonManager / 100; // e.g. 20 -> 0.20

  // Rehire cost percentages
  const minRehireCostFLM = minRehireCostFirstLinePercent / 100; // e.g. 100 -> 1.00
  const maxRehireCostFLM = maxRehireCostFirstLinePercent / 100; // e.g. 145 -> 1.45
  const minRehireCostNonMgr = minRehireCostNonManagerPercent / 100; // e.g. 145 -> 1.45
  const maxRehireCostNonMgr = maxRehireCostNonManagerPercent / 100; // e.g. 190 -> 1.90

  // Target attrition reduction
  const targetReduction = targetAttritionReductionPercent / 100; // e.g. 20 -> 0.20

  // Compound rate
  const compoundRate = compoundRatePercent / 100; // e.g. 5 -> 0.05

  /**************************************************************
   * 2) Compute total training cost
   **************************************************************/
  const totalTrainingCost = numFirstLineManagers * costPerManagerProgram;

  /**************************************************************
   * 3) Number of managers/employees "saved" from attrition
   **************************************************************/
  // Baseline manager turnover
  const managersLost = numFirstLineManagers * attrRateFLM; // e.g. 10 * 0.15 = 1.5
  const managersSaved = managersLost * targetReduction; // e.g. 1.5 * 0.20 = 0.3

  // Baseline non-manager turnover
  const employeesLost = numEmployeesManaged * attrRateNonMgr; // e.g. 100 * 0.20 = 20
  const employeesSaved = employeesLost * targetReduction; // e.g. 20 * 0.20 = 4

  /**************************************************************
   * 4) Year-1 SAVINGS in "Min" scenario vs "Max" scenario
   **************************************************************/
  const minTotalSavings =
    managersSaved * (avgSalaryFirstLineManager * minRehireCostFLM) +
    employeesSaved * (avgSalaryNonManager * minRehireCostNonMgr);

  const maxTotalSavings =
    managersSaved * (avgSalaryFirstLineManager * maxRehireCostFLM) +
    employeesSaved * (avgSalaryNonManager * maxRehireCostNonMgr);

  /**************************************************************
   * 5) Year-1 ROI Calculation
   *    ROI(%) = ((Savings - Cost) / Cost) * 100
   **************************************************************/
  function calculateROI(savings: number, cost: number): number {
    if (cost === 0) return 0;
    return ((savings - cost) / cost) * 100;
  }

  const minExpectedROI = calculateROI(minTotalSavings, totalTrainingCost);
  const maxExpectedROI = calculateROI(maxTotalSavings, totalTrainingCost);

  /**************************************************************
   * 6) "Compounded ROI" = (Year-1 ROI in %) * (1 + rate)^N
   **************************************************************/
  function calculateCompoundedROI(yearOneROI: number): number {
    // yearOneROI is already in %, e.g., 840 => 840%
    // multiply by (1 + compoundRate)^N => e.g. if yearOneROI=840, then
    // 840 * (1.05^3) ~ 973, etc.
    return yearOneROI * Math.pow(1 + compoundRate, investmentDurationYears);
  }

  const minCompoundedROI = calculateCompoundedROI(minExpectedROI);
  const maxCompoundedROI = calculateCompoundedROI(maxExpectedROI);

  /**************************************************************
   * 7) Check if the min Year-1 ROI meets the threshold
   **************************************************************/
  const meetsROIThreshold = minExpectedROI >= minRoiThresholdPercent;

  /**************************************************************
   * 8) Return the results
   **************************************************************/
  return {
    minTotalSavings,
    maxTotalSavings,
    minExpectedROI,
    maxExpectedROI,
    minCompoundedROI,
    maxCompoundedROI,
    totalTrainingCost,
    meetsROIThreshold,
  };
}
