import React, { type FC } from "react";
import { Box, useMediaQuery, type Theme } from "@mui/material";

import ScrollTopProvider from "components/providers/ScrollTopProvider";
import type { WithChildren } from "utils/types";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar";

interface DefaultLayoutProps {
  shrinked: boolean;
}

const DefaultLayout: FC<WithChildren<DefaultLayoutProps>> = ({
  shrinked,
  children,
}) => {
  const isTablet = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("lg"),
  );

  const isDesktopDrawerShrinked = isTablet || shrinked;

  return (
    <ScrollTopProvider>
      <Box
        display="grid"
        gridTemplateAreas="
        'sidebar topbar' 
        'sidebar content'
      "
        gridTemplateColumns="min-content 1fr"
        gridTemplateRows="min-content 1fr"
        height="100vh"
        width="100vw"
      >
        <Box gridArea="sidebar">
          <Sidebar isDesktopDrawerShrinked={isDesktopDrawerShrinked} />
        </Box>

        <Box gridArea="topbar">
          <Topbar />
        </Box>

        <Box
          gridArea="content"
          minHeight="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          flex={1}
          sx={{
            overflow: "auto",
            paddingTop: 0,
          }}
          className="content"
        >
          <Box
            component="main"
            height="100%"
            flex={1}
            overflow="scroll"
            className="scrollbar-hidden"
            sx={{
              position: "relative",
              flexGrow: 1,
              // p: isMobile ? 2 : 3,
              // py: isMobile ? 4 : 2,
              bgcolor: "background.default",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ScrollTopProvider>
  );
};

export default DefaultLayout;
