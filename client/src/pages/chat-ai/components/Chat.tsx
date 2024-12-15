import { Info } from "@mui/icons-material";
import { Paper, Stack, Typography } from "@mui/material";

import ChatInput from "./ChatInput";
import ChatSuggestions from "./ChatSuggestions";

const Chat = () => {
  return (
    <Paper sx={{ height: "100%" }}>
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Stack maxWidth={768} width="100%" px={4} boxSizing="border-box">
          <Typography
            fontSize={34}
            fontWeight={600}
            color="#4d4d4d"
            textAlign="center"
          >
            Where your team improvement begins
          </Typography>

          <Stack direction="row" alignItems="center" mt={3} spacing={0.5}>
            <Info sx={{ color: "#B3B3B3", fontSize: 20 }} />
            <Typography color="#808080" fontSize={14}>
              You can ask all about metrics and reports from your pannel
            </Typography>
          </Stack>

          <ChatInput />

          <ChatSuggestions />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Chat;
