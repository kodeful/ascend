import React from "react";
import { ArrowUpward } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";

import AddCircleIcon from "components/icons/AddCircleIcon";

const ChatInput = () => {
  return (
    <Box>
      <Stack
        direction="row"
        width="100%"
        border="1px solid #E1D7CB"
        borderRadius={99}
        mt={1}
        bgcolor="#FAFAFA"
        justifyContent="center"
        alignItems="center"
        py={1.2}
        px={1.5}
        spacing={1}
      >
        <InputBase
          placeholder="Type your questions here"
          sx={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        />

        <IconButton
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#F5EFEA",
            "&:hover": {
              bgcolor: "#E1D7CB",
            },
          }}
        >
          <ArrowUpward sx={{ color: "#AEAC95" }} />
        </IconButton>
      </Stack>

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
    </Box>
  );
};

export default ChatInput;
