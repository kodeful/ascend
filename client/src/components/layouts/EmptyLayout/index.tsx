import React, { type FC } from "react";
import { Box } from "@mui/material";

import ScrollTopProvider from "components/providers/ScrollTopProvider";
import type { WithChildren } from "utils/types";

type EmptyLayoutProps = WithChildren<unknown>;

const EmptyLayout: FC<EmptyLayoutProps> = ({ children }) => {
  return (
    <ScrollTopProvider>
      <Box height="100vh" width="100vw">
        <Box
          gridArea="content"
          minHeight="100%"
          height="inherit"
          display="flex"
          flexDirection="column"
          sx={{
            overflow: "auto",
          }}
          className="content"
        >
          <Box
            component="main"
            minHeight="inherit"
            sx={{
              position: "relative",
              //   flexGrow: 1,
              backgroundColor: (t) => t.palette.background.default,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ScrollTopProvider>
  );
};

export default EmptyLayout;
