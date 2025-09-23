import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import Title from "components/TItle/Title";

import Chat from "./components/Chat";
import PreviousChatsWidget from "./components/PreviousChatsWidget";

const ChatAiPage = () => {
  const intl = useIntl();
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
          <Chat />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" color="#4D4D4D">
            {intl.formatMessage({ id: "PAGE.CHAT.PREVIOUS_CHATS" })}
          </Typography>

          <PreviousChatsWidget />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChatAiPage;
