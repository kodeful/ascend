import React, { useMemo } from "react";
import {
  ButtonBase,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";

import { useChatControllerFilterChats } from "api/generated/chat/chat";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import dayjs from "utils/dayjs";

const PreviousChatsWidget = () => {
  const history = useHistory();

  const { data: chats, isLoading: isChatsLoading } =
    useChatControllerFilterChats(
      {
        sort: "-createdAt",
      },
      {
        query: {
          queryKey: ["chats"],
        },
      },
    );

  const chatGroups = useMemo(() => chats?.data || [], [chats]);
  return (
    <AsyncComponent
      loading={isChatsLoading}
      SkeletonComponent={
        <Stack direction="column" spacing={1.5} mt={2} divider={<Divider />}>
          {[1, 2, 3, 4, 5].map((key) => (
            <Stack direction="column" key={key}>
              <Skeleton
                variant="text"
                sx={{ fontSize: 14, mb: 0.5 }}
                width={100}
              />
              <Skeleton variant="text" sx={{ fontSize: 14 }} width={180} />
            </Stack>
          ))}
        </Stack>
      }
    >
      <Stack direction="column" spacing={1.5} mt={2} divider={<Divider />}>
        {chatGroups.map((data) => (
          <Stack
            direction="column"
            textAlign="left"
            alignItems="flex-start"
            component={ButtonBase}
            onClick={() => {
              history.push(`/chat-ai/${data._id}`);
            }}
          >
            <Typography
              fontSize={14}
              fontWeight={600}
              color="#4D4D4D"
              mb={0.5}
              textTransform="capitalize"
            >
              {dayjs(data.createdAt).fromNow()}
            </Typography>
            <Typography fontSize={14} color="#4D4D4D">
              {data.lastMessage?.message}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </AsyncComponent>
  );
};

export default PreviousChatsWidget;
