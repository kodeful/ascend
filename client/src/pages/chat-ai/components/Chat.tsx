import { Info } from "@mui/icons-material";
import { Paper, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { useChatControllerStartChat } from "api/generated/chat/chat";

import ChatInput from "./ChatInput";
import ChatSuggestions from "./ChatSuggestions";

const Chat = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const intl = useIntl();

  const { mutateAsync: startChat } = useChatControllerStartChat({
    mutation: {
      onSuccess: (chatId) => {
        history.push(`/chat-ai/${chatId.toString()}`);

        queryClient.invalidateQueries(["chats"]);
      },
    },
  });

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
            {intl.formatMessage({ id: "PAGE.CHAT.DOCUMENT_TITLE" })}
          </Typography>

          <Stack direction="row" alignItems="center" mt={3} spacing={0.5}>
            <Info sx={{ color: "#B3B3B3", fontSize: 20 }} />
            <Typography color="#808080" fontSize={14}>
              {intl.formatMessage({ id: "PAGE.CHAT.DOCUMENT_INFO" })}
            </Typography>
          </Stack>

          <ChatInput
            onSend={async (message) => {
              await startChat({
                data: {
                  message,
                },
              });
            }}
          />

          <ChatSuggestions
            onSend={async (message) => {
              await startChat({
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

export default Chat;
