import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { useChatControllerGetChatMessages } from "api/generated/chat/chat";
import AscendIcon from "components/icons/AscendIcon";

const SingleChatMessages = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: chatMessagesRes } = useChatControllerGetChatMessages(chatId, {
    query: {
      queryKey: ["chat-messages", chatId],
    },
  });

  const chatMessages = useMemo(
    () => chatMessagesRes?.data || [],
    [chatMessagesRes],
  );
  return (
    <Stack
      direction="column"
      justifyContent="flex-end"
      height="100%"
      spacing={1}
    >
      {chatMessages.map(({ _id, user, message }) => (
        <Stack
          position="relative"
          direction="row"
          justifyContent={user ? "flex-end" : "flex-start"}
          key={_id}
        >
          {/* ASCEND LOGO */}
          {!user && (
            <Stack
              position="absolute"
              bottom={0}
              left={-45}
              width={35}
              height={35}
              borderRadius="50%"
              border="1px solid #E1D7CB"
              alignItems="center"
              justifyContent="center"
            >
              <AscendIcon />
            </Stack>
          )}

          <Box
            maxWidth={374}
            bgcolor={user ? "#EC762E" : "#F5EFEA"}
            sx={{
              borderRadius: "15px",
              ...(user
                ? { borderBottomRightRadius: "0px" }
                : { borderBottomLeftRadius: "0px" }),
            }}
            p={2}
          >
            <Typography
              fontSize={16}
              color={user ? "#fff" : "#333333"}
              fontWeight={500}
              lineHeight={1.2}
            >
              {message}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
};

export default SingleChatMessages;
