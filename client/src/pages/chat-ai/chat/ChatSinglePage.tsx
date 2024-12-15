import React from "react";
import { Grid, Stack, Typography } from "@mui/material";

import Title from "components/TItle/Title";

import PreviousChatsWidget from "../components/PreviousChatsWidget";
import SingleChat from "./components/SingleChat";

const ChatSinglePage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
      height="100%"
    >
      <Title title="Chat" />

      <Grid container spacing={2} mt={2} height="100%">
        <Grid item xs={8}>
          <SingleChat />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" color="#4D4D4D">
            Previous chats
          </Typography>

          <PreviousChatsWidget />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChatSinglePage;
