import React, { useMemo, type FC } from "react";
import { ButtonBase, darken, Divider, Stack, Typography } from "@mui/material";
import { groupBy } from "lodash";
import { useHistory } from "react-router-dom";

import { useChatControllerFilterChats } from "api/generated/chat/chat";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import dayjs from "utils/dayjs";

import PreviousChatsWidgetSkeleton from "./PreviousChatsWidgetSkeleton";

type PreviousChatsWidgetProps = {
  selected?: string;
};

const PreviousChatsWidget: FC<PreviousChatsWidgetProps> = ({ selected }) => {
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

  const chatGroups = useMemo(
    () =>
      groupBy(chats?.data ?? [], (chat) => dayjs(chat.createdAt).fromNow()) ||
      [],
    [chats],
  );

  return (
    <AsyncComponent
      loading={isChatsLoading}
      SkeletonComponent={<PreviousChatsWidgetSkeleton />}
    >
      <Stack direction="column" spacing={1.5} mt={2} divider={<Divider />}>
        {Object.keys(chatGroups).map((group) => (
          <Stack key={group} direction="column">
            <Typography
              fontSize={14}
              fontWeight={600}
              color="#4D4D4D"
              mb={0.5}
              textTransform="capitalize"
              px={0.5}
            >
              {group}
            </Typography>

            {chatGroups[group].map((data) => (
              <>
                <ButtonBase
                  key={data._id}
                  sx={{
                    textAlign: "left",
                    py: 1,
                    px: 1,
                    width: "100%",
                    borderRadius: 2,

                    bgcolor:
                      selected === data._id
                        ? darken("#F5EFEA", 0.05)
                        : "transparent",
                    "&:hover": {
                      bgcolor: darken("#F5EFEA", 0.1),
                    },
                  }}
                  onClick={() => {
                    history.push(`/chat-ai/${data._id}`);
                  }}
                >
                  <Typography
                    fontSize={14}
                    color="#4D4D4D"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    width="100%"
                  >
                    {data.firstMessage?.message}
                  </Typography>
                </ButtonBase>
              </>
            ))}
          </Stack>
        ))}
      </Stack>
    </AsyncComponent>
  );
};

export default PreviousChatsWidget;
