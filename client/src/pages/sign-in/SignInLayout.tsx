import React, { type FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import type { WithChildren } from "utils/types";

import SignInCursor from "./components/SignInCursor";

const SignInLayout: FC<WithChildren<{}>> = ({ children }) => {
  return (
    <Stack
      height="100vh"
      minHeight="100vh"
      bgcolor="#F4F5F6"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <SignInCursor />
      <Box
        position="absolute"
        bottom={0}
        left="50%"
        sx={{
          transform: "translateX(-50%)",
        }}
      >
        <AscendTextIcon
          sx={{
            width: 1062,
            height: 213,
            opacity: 0.5,

            "& path": {
              fill: "#FFF",
            },
            zIndex: -1,
          }}
        />
      </Box>

      <Stack
        maxWidth={483}
        width="100%"
        height="100%"
        justifyContent="space-between"
        py={4}
        maxHeight={1200}
        zIndex={1}
      >
        {/* Logo */}
        <Stack alignItems="center">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            width={95}
            height={95}
            bgcolor="#FFF"
            borderRadius="25px"
            border="1.5px solid #F3E9E3"
            boxShadow="0px 11px 10.4px -6px #FB9B847D"
            sx={{
              animation: "pulse-shadow 1.5s infinite",
              "@keyframes pulse-shadow": {
                "0%": {
                  boxShadow: "0px 11px 10.4px -6px rgba(251, 155, 132, 0.4)",
                },
                "50%": {
                  boxShadow: "0px 11px 20px -6px rgba(251, 155, 132, 0.8)",
                },
                "100%": {
                  boxShadow: "0px 11px 10.4px -6px rgba(251, 155, 132, 0.4)",
                },
              },
            }}
          >
            <AscendIcon
              sx={{
                width: 60,
                height: 60,
              }}
            />
          </Stack>

          <Box mt={1.5}>
            <AscendTextIcon
              sx={{
                width: 171,
                height: 35,
              }}
            />
          </Box>
        </Stack>

        {/* Form */}
        <Box>{children}</Box>

        {/* Request an Account */}
        <Stack textAlign="center">
          <Typography fontSize={14} mb={2} color="#646C60">
            Don&apos;t have an Account?
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              sx={{
                backgroundColor: "#0F172A",
                color: "#FFF",
              }}
            >
              Request Account
            </Button>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              sx={{
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFF",
                color: "#000",
              }}
            >
              Book a Demo
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SignInLayout;
