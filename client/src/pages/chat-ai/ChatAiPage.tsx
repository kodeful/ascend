import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";

const ChatAiPage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
      height="100%"
    >
      <Typography variant="h1" color="primary.main">
        Chat
      </Typography>

      <Grid container spacing={2} mt={2} height="100%">
        <Grid item xs={8}>
          <Paper sx={{ height: "100%" }}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" color="#4D4D4D">
            Previous chats
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChatAiPage;
