import React from "react";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Avatar, Box, Divider, Paper, Stack, Typography } from "@mui/material";

import Counter from "components/Counter/Counter";
import { userInitials } from "components/stores/MeStore";

const HomeLearners = () => {
  const learners = [
    {
      name: "Julia Oquendo",
      role: "Leadership",
      change: 23,
    },
    {
      name: "Rajesh Koothrappali",
      role: "Leadership",
      change: -5,
    },
    {
      name: "Bernadette Smith",
      role: "Leadership",
      change: 10,
    },
  ];

  return (
    <Paper
      sx={{
        py: 0.5,
        px: 2,
      }}
    >
      <Stack direction="column" divider={<Divider />}>
        {learners.map((learner) => {
          const initials = userInitials(learner.name);
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Stack direction="row" py={1.5} spacing={1}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "primary.main",
                    color: "#FFF",
                    fontSize: Math.min(30, 38 / initials.length),
                    border: "1px solid transparent",
                    borderColor: "primary.dark",
                    fontWeight: 600,
                  }}
                  variant="circular"
                >
                  {initials.toUpperCase()}
                </Avatar>

                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {learner.name}
                  </Typography>
                  <Typography fontSize={12} lineHeight={1}>
                    {learner.role}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize={14} color="#AEAC95">
                  {learner.change > 0 ? "+" : "-"}
                  <Counter count={Math.abs(learner.change)} digits={0} />%
                </Typography>
                {learner.change > 0 ? (
                  <TrendingUp color="success" />
                ) : (
                  <TrendingDown color="error" />
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default HomeLearners;
