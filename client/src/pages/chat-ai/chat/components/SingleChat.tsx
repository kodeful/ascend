import React from "react";
import { Paper, Stack } from "@mui/material";
import ChatInput from "pages/chat-ai/components/ChatInput";

import SingleChatMessages from "./SingleChatMessages";

const SingleChat = () => {
  return (
    <Paper sx={{ height: "100%" }}>
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          direction="column"
          maxWidth={768}
          width="100%"
          height="100%"
          px={4}
          py={4}
          boxSizing="border-box"
          justifyContent="space-between"
          spacing={2}
        >
          <SingleChatMessages />

          <ChatInput />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SingleChat;
