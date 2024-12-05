import React from "react";
import { Info } from "@mui/icons-material";
import { Box, ButtonBase, Grid, Paper, Stack, Typography } from "@mui/material";

import AddCircleIcon from "components/icons/AddCircleIcon";

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

const Chat = () => {
  return (
    <Paper sx={{ height: "100%" }}>
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Stack width={768}>
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

          <Box
            height={61}
            width="100%"
            border="1px solid #E1D7CB"
            borderRadius={99}
            mt={1}
            bgcolor="#FAFAFA"
          ></Box>

          <Stack mt={1} alignItems="center">
            <Stack
              height={36}
              border="1px solid #E1D7CB"
              borderRadius={20}
              direction="row"
              alignItems="center"
              px={1}
              component={ButtonBase}
            >
              <AddCircleIcon
                sx={{
                  width: 20,
                  height: 20,
                  mr: 0.5,
                  "& path": { stroke: "#B3B3B3" },
                }}
              />
              <Typography fontSize={12} color="#535851" fontWeight={600}>
                Adjunct report
              </Typography>
            </Stack>
          </Stack>

          <Grid container spacing={1} mt={1}>
            {chatSuggestions.map((suggestion) => (
              <Grid item xs={6}>
                <Stack
                  direction="row"
                  alignItems="center"
                  px={1.5}
                  height={70}
                  bgcolor="#E1D7CB"
                  sx={{
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    borderBottomLeftRadius: 15,
                    border: "2px dashed #C6BDB3",
                  }}
                  component={ButtonBase}
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
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Chat;
