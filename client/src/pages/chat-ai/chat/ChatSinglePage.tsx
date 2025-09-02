import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import Title from "components/TItle/Title";

import PreviousChatsWidget from "../components/PreviousChatsWidget";
import SingleChat from "./components/SingleChat";

const ChatSinglePage = () => {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
      height="100%"
    >
      <Title title="PAGE.TITLE.CHAT" />

      <Grid container spacing={2} mt={2} height="100%">
        <Grid item xs={8}>
          <SingleChat />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" color="#4D4D4D">
            Previous chats
          </Typography>

          <PreviousChatsWidget selected={chatId} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChatSinglePage;
