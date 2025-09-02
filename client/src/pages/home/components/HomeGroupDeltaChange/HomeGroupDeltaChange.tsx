import React from "react";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FormattedMessage } from "react-intl";

import { useMetricsControllerGetMetricsStatisticsByMetric } from "api/generated/metrics/metrics";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Counter from "components/Counter/Counter";

import HomeGroupDeltaChangeGraph from "./HomeGroupDeltaChangeGraph";

const HomeGroupDeltaChange = () => {
  const { data: metrics, isLoading } =
    useMetricsControllerGetMetricsStatisticsByMetric({
      query: {
        queryKey: ["metrics", "statistics", "by-metric"],
      },
    });

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        <FormattedMessage id="PAGE.HOME.GROUP_DELTA_CHANGE" />
      </Typography>

      <AsyncComponent
        loading={isLoading}
        SkeletonComponent={<Skeleton variant="rectangular" height={240} />}
      >
        <HomeGroupDeltaChangeGraph height={240} />
      </AsyncComponent>

      <Stack direction="row" alignItems="center" spacing={1}>
        <AsyncComponent
          loading={isLoading}
          SkeletonComponent={<Skeleton variant="text" width={160} />}
        >
          <Typography fontSize={14} fontWeight={600} color="#1C2024">
            <FormattedMessage id="PAGE.HOME.TOTAL_INCREASE_UP_BY" />
            {/* @ts-expect-error */}
            <Counter count={metrics?.increasePercentage * 100} step={0.1} />%
          </Typography>

          {/* @ts-expect-error */}
          {metrics?.increasePercentage >= 0 ? (
            <TrendingUp color="success" />
          ) : (
            <TrendingDown color="error" />
          )}
        </AsyncComponent>
      </Stack>

      <Typography fontSize={14} color="#60646C">
        {dayjs().subtract(1, "month").format("MMMM YYYY")} -{" "}
        {dayjs().format("MMMM YYYY")}
      </Typography>
    </Paper>
  );
};

export default HomeGroupDeltaChange;
