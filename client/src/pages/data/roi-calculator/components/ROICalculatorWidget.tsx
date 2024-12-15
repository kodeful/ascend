import React, { useMemo, type FC } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { isNil } from "lodash";
import { useHistory } from "react-router-dom";

import { useROICalculatorControllerFindROI } from "api/generated/roi-calculator/roi-calculator";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Counter from "components/Counter/Counter";
import RefreshIcon from "components/icons/RefreshIcon";

type ROICalculatorWidgetProps = {
  link?: string;
};

const ROICalculatorWidget: FC<ROICalculatorWidgetProps> = ({ link }) => {
  const history = useHistory();

  const { data: roiCalculator, isLoading } = useROICalculatorControllerFindROI({
    query: {
      queryKey: ["roi-calculator"],
    },
  });

  const roiCalculatorResult = useMemo(
    () => roiCalculator?.data?.result,
    [roiCalculator?.data?.result],
  );

  const calculations = useMemo(
    () => [
      {
        label: "Min Total Savings in Rotation",
        value: roiCalculatorResult?.minTotalSavings ?? 0,
        prefix: "$",
      },
      {
        label: "Max Total Savings in Rotation",
        value: roiCalculatorResult?.maxTotalSavings ?? 0,
        prefix: "$",
      },
      {
        label: "Min Expected ROI",
        value: roiCalculatorResult?.minExpectedROI ?? 0,
        sufix: "%",
      },
      {
        label: "Max Expected ROI",
        value: roiCalculatorResult?.maxExpectedROI ?? 0,
        sufix: "%",
      },
      {
        label: "Min Compounded ROI",
        value: roiCalculatorResult?.minCompoundedROI ?? 0,
        sufix: "%",
      },
      {
        label: "Max Compounded ROI",
        value: roiCalculatorResult?.maxCompoundedROI ?? 0,
        sufix: "%",
      },
    ],
    [roiCalculatorResult],
  );

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box>
          <Typography fontSize={18} color="#60646C">
            ROI Results
          </Typography>
          <Typography fontSize={14} color="#646C60">
            Last calculation
          </Typography>
        </Box>

        {link && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#646C60",
              borderRadius: "20px",
              px: 1,
              py: 0.6,
            }}
            onClick={() => {
              history.push(link);
            }}
          >
            <RefreshIcon sx={{ height: 14, width: 14, mt: -0.2, mr: 0.6 }} />
            <Typography fontSize={12} fontWeight={600}>
              Calculate
            </Typography>
          </Button>
        )}
      </Stack>

      <Grid container spacing={2} mt={0}>
        {calculations.map(({ label, value, prefix, sufix }) => (
          <Grid item xs={6} key={label}>
            <Stack
              direction="column"
              alignItems="center"
              px={2}
              py={1.5}
              bgcolor="#F4F5F6"
              borderRadius="10px"
              border="1px solid #E6E6E6"
              spacing={0.5}
            >
              <AsyncComponent
                loading={isLoading}
                SkeletonComponent={
                  <Skeleton height={27} variant="text" width={50} />
                }
              >
                <Typography fontSize={18} fontWeight={600} color="#2a2a2a">
                  {!isNil(value) ? (
                    <>
                      {prefix}
                      <Counter count={value} digits={2} />
                      {sufix}
                    </>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </AsyncComponent>
              <Typography
                height={30}
                fontSize={15}
                lineHeight={1}
                color="#2A2A2A"
                textAlign="center"
              >
                {label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Stack mt={2}>
        <Typography fontSize={16} fontWeight={700} color="#60646C">
          Suggestions
        </Typography>
        <Typography fontSize={13} color="#60648C" mt={1}>
          The ROl for this investment, exceeds the target. Investing in this
          Development Program for these First-Line Managers is expected to
          exceed the desired value.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ROICalculatorWidget;
