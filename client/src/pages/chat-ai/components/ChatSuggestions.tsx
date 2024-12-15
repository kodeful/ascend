import React from "react";
import { ButtonBase, Grid, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";

import { useChatControllerStartChat } from "api/generated/chat/chat";

const chatSuggestions = [
  {
    icon: "📊",
    text: "Analyze the last report and find the gap to boost learners",
  },
  {
    icon: "🤔",
    text: "I want to know the predictions about learners improvement",
  },
  {
    icon: "🤖",
    text: "Use the last ROI generated and give me solutions to increase the amount",
  },
  {
    icon: "📚",
    text: "How to motivate properly to learners in order to make them study more",
  },
];

const ChatSuggestions = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const { mutateAsync: startChat } = useChatControllerStartChat({
    mutation: {
      onSuccess: ({ data }) => {
        history.push(`/chat-ai/${data._id}`);

        queryClient.invalidateQueries(["chats"]);
      },
    },
  });

  return (
    <Grid container spacing={1} mt={1}>
      {chatSuggestions.map((suggestion) => (
        <Grid item xs={6}>
          <Stack
            direction="row"
            alignItems="center"
            minHeight={70}
            py={1}
            px={1.5}
            bgcolor="#E1D7CB"
            sx={{
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              border: "2px dashed #C6BDB3",
            }}
            component={ButtonBase}
            onClick={() =>
              startChat({
                data: {
                  message: [suggestion.icon, suggestion.text].join(" "),
                },
              })
            }
          >
            <Typography>{suggestion.icon}</Typography>
            <Typography
              pl={1.5}
              fontSize={14}
              fontWeight={500}
              color="#000"
              textAlign="left"
            >
              {suggestion.text}
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatSuggestions;
