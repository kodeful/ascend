import React from "react";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { range } from "lodash";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import { useUserControllerFilterUsers } from "api/generated/user/user";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Counter from "components/Counter/Counter";
import { userInitials } from "components/stores/MeStore";

const HomeLearners = () => {
  const history = useHistory();

  const { data: learners, isLoading } = useUserControllerFilterUsers(
    {
      limit: -1,
      filter: "workspaces.role::eq::Learner",
    },
    {
      query: {
        queryKey: ["users", "learner"],
      },
    },
  );

  return (
    <Paper
      sx={{
        py: 0.5,
        px: 2,
      }}
    >
      <AsyncComponent
        loading={isLoading}
        SkeletonComponent={
          <Stack direction="column" divider={<Divider />}>
            {range(0, 3).map((_, index) => (
              <Stack direction="row" py={1.5} spacing={1} key={index}>
                <Skeleton variant="circular" width={39} height={39} />

                <Box>
                  <Skeleton variant="text" sx={{ fontSize: 14 }} width={100} />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: 12, lineHeight: 1.2 }}
                    width={60}
                  />
                </Box>
              </Stack>
            ))}
          </Stack>
        }
      >
        <Stack
          direction="column"
          divider={<Divider />}
          maxHeight={195}
          overflow="scroll"
          className="scrollbar-hidden"
        >
          {!learners?.data.length && (
            <Typography
              fontSize={14}
              color="#60646C"
              fontWeight={500}
              textAlign="center"
              py={2}
            >
              <FormattedMessage id="PAGE.HOME.NO_ACTIVE_LEARNERS" />
            </Typography>
          )}

          {(learners?.data || []).map((learner) => {
            const initials = userInitials(learner.fullName);
            const change = 0;

            return (
              <Stack
                key={learner._id}
                component={ButtonBase}
                textAlign="left"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                onClick={() => {
                  history.push(`/data/learner/${learner._id}`);
                }}
              >
                <Stack direction="row" py={1.5} spacing={1}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "primary.main",
                      color: "#FFF",
                      // fontSize: Math.min(30, 38 / initials.length),
                      fontSize: 18,
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
                      {learner.fullName}
                    </Typography>
                    <Typography fontSize={12} lineHeight={1.2}>
                      {learner.role}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontSize={14} color="#AEAC95">
                    {change >= 0 ? "+" : "-"}
                    <Counter count={Math.abs(change)} digits={0} />%
                  </Typography>
                  {change >= 0 ? (
                    <TrendingUp color="success" />
                  ) : (
                    <TrendingDown color="error" />
                  )}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </AsyncComponent>
    </Paper>
  );
};

export default HomeLearners;
