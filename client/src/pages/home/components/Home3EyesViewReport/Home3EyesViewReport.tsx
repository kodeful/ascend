import React from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill } from "api/generated/metrics-three-eye-view/metrics-three-eye-view";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";

import Home3EyesViewReportGraph from "./Home3EyesViewReportGraph";

const Home3EyesViewReport = ({ email }: { email?: string }) => {
  const { isLoading } =
    useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill(
      {
        skill: undefined,
        email,
      },
      {
        query: {
          queryKey: ["metrics", "three-eye-view", "by-skill", email],
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
          <Home3EyesViewReportGraph height={280} email={email} />
        </AsyncComponent>
      </Box>
    </Paper>
  );
};

export default Home3EyesViewReport;
