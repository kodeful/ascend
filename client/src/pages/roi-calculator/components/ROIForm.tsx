import React, { useMemo } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, Paper } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import * as yup from "yup";

import {
  useROICalculatorControllerCalculateROI,
  useROICalculatorControllerFindROI,
} from "api/generated/roi-calculator/roi-calculator";
import FormikNumberField from "components/forms/FormikNumberField";

const ROIForm = () => {
  const queryClient = useQueryClient();

  const { data: roiCalculator } = useROICalculatorControllerFindROI({
    query: {
      queryKey: ["roi-calculator"],
    },
  });

  const roiCalculatorFields = useMemo(
    () => roiCalculator?.data?.fields,
    [roiCalculator?.data?.fields],
  );

  const { mutateAsync: calculateROI, isLoading } =
    useROICalculatorControllerCalculateROI({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries(["roi-calculator"]);

          enqueueSnackbar("ROI calculated successfully", {
            variant: "success",
          });
        },
      },
    });

  const formik = useFormik({
    initialValues: {
      numFirstLineManagers: roiCalculatorFields?.numFirstLineManagers ?? null,
      numEmployeesManaged: roiCalculatorFields?.numEmployeesManaged ?? null,
      costPerManagerProgram: roiCalculatorFields?.costPerManagerProgram ?? null,
      avgAttritionRateFirstLine:
        roiCalculatorFields?.avgAttritionRateFirstLine ?? null,
      avgAttritionRateNonManager:
        roiCalculatorFields?.avgAttritionRateNonManager ?? null,
      minRehireCostFirstLinePercent:
        roiCalculatorFields?.minRehireCostFirstLinePercent ?? null,
      maxRehireCostFirstLinePercent:
        roiCalculatorFields?.maxRehireCostFirstLinePercent ?? null,
      minRehireCostNonManagerPercent:
        roiCalculatorFields?.minRehireCostNonManagerPercent ?? null,
      maxRehireCostNonManagerPercent:
        roiCalculatorFields?.maxRehireCostNonManagerPercent ?? null,
      avgSalaryFirstLineManager:
        roiCalculatorFields?.avgSalaryFirstLineManager ?? null,
      avgSalaryNonManager: roiCalculatorFields?.avgSalaryNonManager ?? null,
      investmentDurationYears:
        roiCalculatorFields?.investmentDurationYears ?? null,
      targetAttritionReductionPercent:
        roiCalculatorFields?.targetAttritionReductionPercent ?? null,
      minRoiThresholdPercent:
        roiCalculatorFields?.minRoiThresholdPercent ?? null,
      compoundRatePercent: roiCalculatorFields?.compoundRatePercent ?? null,
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      numFirstLineManagers: yup.number().required(),
      numEmployeesManaged: yup.number().required(),
      costPerManagerProgram: yup.number().required(),
      avgAttritionRateFirstLine: yup.number().required(),
      avgAttritionRateNonManager: yup.number().required(),
      minRehireCostFirstLinePercent: yup.number().required(),
      maxRehireCostFirstLinePercent: yup.number().required(),
      minRehireCostNonManagerPercent: yup.number().required(),
      maxRehireCostNonManagerPercent: yup.number().required(),
      avgSalaryFirstLineManager: yup.number().required(),
      avgSalaryNonManager: yup.number().required(),
      investmentDurationYears: yup.number().required(),
      targetAttritionReductionPercent: yup.number().required(),
      minRoiThresholdPercent: yup.number().required(),
      compoundRatePercent: yup.number().required(),
    }),
    onSubmit: async (values) => {
      await calculateROI({
        data: {
          numFirstLineManagers: values.numFirstLineManagers as number,
          numEmployeesManaged: values.numEmployeesManaged as number,
          costPerManagerProgram: values.costPerManagerProgram as number,
          avgAttritionRateFirstLine: values.avgAttritionRateFirstLine as number,
          avgAttritionRateNonManager:
            values.avgAttritionRateNonManager as number,
          minRehireCostFirstLinePercent:
            values.minRehireCostFirstLinePercent as number,
          maxRehireCostFirstLinePercent:
            values.maxRehireCostFirstLinePercent as number,
          minRehireCostNonManagerPercent:
            values.minRehireCostNonManagerPercent as number,
          maxRehireCostNonManagerPercent:
            values.maxRehireCostNonManagerPercent as number,
          avgSalaryFirstLineManager: values.avgSalaryFirstLineManager as number,
          avgSalaryNonManager: values.avgSalaryNonManager as number,
          investmentDurationYears: values.investmentDurationYears as number,
          targetAttritionReductionPercent:
            values.targetAttritionReductionPercent as number,
          minRoiThresholdPercent: values.minRoiThresholdPercent as number,
          compoundRatePercent: values.compoundRatePercent as number,
        },
      });
    },
  });

  return (
    <Paper sx={{ p: 2 }}>
      <FormikProvider value={formik}>
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormikNumberField
                label="Number of First-Line Managers to take Development Program"
                name="numFirstLineManagers"
                min={0}
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Total Employees Managed by First-Line Managers Taking Program"
                name="numEmployeesManaged"
                min={0}
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Cost of Development program per First-Line Manager"
                name="costPerManagerProgram"
                min={0}
                prefix="$"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Avg Attrition Rate (Rotation) for First Line (%)"
                name="avgAttritionRateFirstLine"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Avg Attrition Rate (Rotation) for Non-Manager Employees (%)"
                name="avgAttritionRateNonManager"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Min Cost of Losing & Rehiring First-Line Managers (As % of Salary)"
                name="minRehireCostFirstLinePercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Max Cost of Losing & Rehiring First-Line Managers (As % of Salary)"
                name="maxRehireCostFirstLinePercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Min Cost of Losing & Rehiring Non-Manager Employees (As % of Salary)"
                name="minRehireCostNonManagerPercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Max Cost of Losing & Rehiring Non-Manager Employees (As % of Salary)"
                name="maxRehireCostNonManagerPercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Average Salary - First-Line Manager"
                name="avgSalaryFirstLineManager"
                min={0}
                prefix="$"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Average Salary - Non-Manager Employees:"
                name="avgSalaryNonManager"
                min={0}
                prefix="$"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Number of Year of expected value from Investment (n)"
                name="investmentDurationYears"
                min={0}
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Target Reduction in Attrition (%)"
                name="targetAttritionReductionPercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Minimum ROI (Threshold for decision on training) (%)"
                name="minRoiThresholdPercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>
            <Grid item xs={6}>
              <FormikNumberField
                label="Rate for compounded ROI calculation (%)"
                name="compoundRatePercent"
                min={0}
                max={100}
                suffix="%"
              />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isLoading}
                fullWidth
              >
                Calculate ROI
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Paper>
  );
};

export default ROIForm;
