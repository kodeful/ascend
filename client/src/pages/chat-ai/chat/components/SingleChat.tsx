import React from "react";
import { Paper, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import ChatInput from "pages/chat-ai/components/ChatInput";
import { useParams } from "react-router-dom";

import { useChatControllerSendMessageChat } from "api/generated/chat/chat";
import { useMeStore } from "components/stores/MeStore";
import dayjs from "utils/dayjs";

import SingleChatMessages from "./SingleChatMessages";
import { useSingleChatSocket } from "./useSingleChatSocket";

const SingleChat = () => {
  const queryClient = useQueryClient();
  const { chatId } = useParams<{ chatId: string }>();

  useSingleChatSocket();

  const { mutateAsync: sendMessage } = useChatControllerSendMessageChat({
    mutation: {
      onSuccess: (message) => {
        queryClient.setQueryData(["chat-messages", chatId], (oldData: any) => [
          ...(oldData || []),
          {
            _id: Math.random(),
            user: useMeStore.getState().me?._id,
            message,
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
          },
        ]);
      },
    },
  });

  return (
    <Paper
      sx={{
        height: "100%",
      }}
    >
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          direction="column"
          // maxWidth={768}
          maxWidth={768 + 42}
          width="100%"
          height="100%"
          px={4}
          py={4}
          boxSizing="border-box"
          justifyContent="space-between"
          flex={1}
          spacing={2}
        >
          <Stack
            height="100%"
            width="100%"
            overflow="scroll"
            className="scrollbar-hidden"
          >
            <SingleChatMessages />
          </Stack>

          <ChatInput
            onSend={async (message) => {
              await sendMessage({
                chatId,
                data: {
                  message,
                },
              });
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SingleChat;
