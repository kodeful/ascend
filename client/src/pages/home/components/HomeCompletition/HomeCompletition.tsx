import React from "react";
import { CalendarToday, CheckCircle, WatchLater } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";

import { useMetricsMindslinesControllerGetCompletition } from "api/generated/metrics-mindslines/metrics-mindslines";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Counter from "components/Counter/Counter";

const HomeCompletition = ({ email }: { email?: string }) => {
  const { data: completition, isLoading } =
    useMetricsMindslinesControllerGetCompletition(
      { email },
      {
        query: {
          queryKey: ["completition", email],
        },
      },
    );

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
        pb: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={500} color="#60646C">
          Progress statistics LMS
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        mt={1}
        mb={1}
        justifyContent="space-between"
      >
        {[
          {
            count: completition?.in_progress,
            status: "In Progress",
            icon: WatchLater,
            color: "warning.main",
            loading: isLoading,
          },
          {
            count: completition?.completed,
            status: "Completed",
            icon: CheckCircle,
            color: "success.main",
            loading: isLoading,
          },
          {
            count: completition?.not_started,
            status: "Not Started",
            icon: CalendarToday,
            color: "error.main",
            loading: isLoading,
          },
        ].map((item) => (
          <Stack direction="row" spacing={1.5} key={item.status}>
            {/* ICON */}
            <Stack
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
              alignItems="center"
              justifyContent="center"
            >
              <item.icon sx={{ color: "#FFF", fontSize: 24 }} />
            </Stack>

            {/* TITLE */}
            <Stack>
              <AsyncComponent
                loading={item.loading}
                SkeletonComponent={<Skeleton variant="text" width={80} />}
              >
                <Typography fontSize={16} fontWeight={600} color="#2A2A2A">
                  <Counter count={item.count as number} step={1} digits={0} />{" "}
                  quizzes
                </Typography>
              </AsyncComponent>
              <Typography fontSize={11} lineHeight={1} color="#2A2A2A">
                {item.status}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* <Box mt={1}>
        <HomeCompletitionGraph height={200} />
      </Box> */}
    </Paper>
  );
};

export default HomeCompletition;
