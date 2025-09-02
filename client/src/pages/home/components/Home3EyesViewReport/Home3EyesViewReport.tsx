import React from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useMetricsControllerGetMetricsStatisticsBySkill } from "api/generated/metrics/metrics";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";

import Home3EyesViewReportGraph from "./Home3EyesViewReportGraph";

const Home3EyesViewReport = () => {
  const { isLoading } = useMetricsControllerGetMetricsStatisticsBySkill(
    {
      skill: undefined,
    },
    {
      query: {
        queryKey: ["metrics", "statistics", "by-skill"],
      },
    },
  );

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        <FormattedMessage id="PAGE.HOME.3_EYES_VIEW_REPORT" />
      </Typography>
      <Typography fontSize={14} fontWeight={500} color="#646C60">
        <FormattedMessage id="PAGE.HOME.GROUP_LEADERSHIP_SKILLS_ASSESSMENT_COMPARISON" />
      </Typography>

      <Box mt={3}>
        <AsyncComponent
          loading={isLoading}
          SkeletonComponent={<Skeleton variant="rectangular" height={280} />}
        >
          <Home3EyesViewReportGraph height={280} />
        </AsyncComponent>
      </Box>
    </Paper>
  );
};

export default Home3EyesViewReport;
