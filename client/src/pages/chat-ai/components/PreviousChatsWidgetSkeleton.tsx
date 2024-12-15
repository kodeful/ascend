import React, { memo } from "react";
import { Divider, Skeleton, Stack } from "@mui/material";
import { map, random, range } from "lodash";

const PreviousChatsWidgetSkeleton = () => {
  return (
    <Stack direction="column" spacing={1.5} mt={2} divider={<Divider />}>
      {map(range(0, 5), (key) => (
        <Stack direction="column" key={`group-skeleton-${key}`}>
          <Skeleton
            variant="text"
            sx={{ fontSize: 14, mb: 0.5, mx: 0.5 }}
            width={100}
          />

          {map(range(0, random(0, 5)), (key) => (
            <Stack py={0.5} key={`chat-skeleton-${key}`}>
              <Skeleton
                variant="text"
                sx={{ fontSize: 14, mx: 1 }}
                width={random(190, 390)}
              />
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

export default memo(PreviousChatsWidgetSkeleton);
