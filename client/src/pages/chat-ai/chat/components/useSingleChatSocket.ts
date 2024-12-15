import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { useMeStore } from "components/stores/MeStore";

export const useSingleChatSocket = () => {
  const queryClient = useQueryClient();
  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    const socket = io(
      `${import.meta.env.REACT_APP_API_URL}/socket/chat/${chatId}`,
      {
        auth: {
          token: useMeStore.getState().token,
        },
      },
    );

    socket.on("message", ({ message }) => {
      queryClient.setQueryData(["chat-messages", chatId], (oldData: any) => ({
        data: [
          ...(oldData?.data || []),
          {
            _id: Math.random(),
            user: undefined,
            message,
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
          },
        ],
      }));
    });

    socket.on("connect", async () => {});

    return () => {
      socket.disconnect();
    };
  }, [chatId, queryClient]);
};
