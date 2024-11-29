import React, { type FC } from "react";
import { Stack, useMediaQuery, type Theme } from "@mui/material";

import DesktopSidebarDrawer from "./DesktopSidebarDrawer";

type SidebarProps = {
  isDesktopDrawerShrinked: boolean;
};

const Sidebar: FC<SidebarProps> = ({ isDesktopDrawerShrinked }) => {
  const isMobile = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("md"),
  );

  const wideDrawerWidth = 225;
  const narrowDrawerWidth = 64;

  const menuDrawerWidth = isDesktopDrawerShrinked
    ? narrowDrawerWidth
    : wideDrawerWidth;

  return (
    <Stack
      direction="column"
      component="nav"
      sx={{
        width: { md: menuDrawerWidth },
        flexShrink: { md: 0 },
      }}
      data-cy="navigation"
    >
      {/* {isMobile && (
        <MobileSidebarDrawer
          wideDrawerWidth={wideDrawerWidth}
          isMobileDrawerOpen={isMobileDrawerOpen}
          toggleMobileDrawer={toggleMobileDrawer}
        />
      )} */}

      {!isMobile && (
        <DesktopSidebarDrawer
          wideDrawerWidth={wideDrawerWidth}
          menuDrawerWidth={menuDrawerWidth}
          isDesktopDrawerShrinked={isDesktopDrawerShrinked}
        />
      )}
    </Stack>
  );
};

export default Sidebar;
