import React, { type FC } from "react";
import { Box, Divider, Drawer, Stack, Toolbar } from "@mui/material";
// LOGO:
// import Logo from "assets/icons/logo.png";
import { Link } from "react-router-dom";

import SidebarMenu from "./SidebarMenu/SidebarMenu";

type MobileSidebarDrawerProps = {
  wideDrawerWidth: number;
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
};

const MobileSidebarDrawer: FC<MobileSidebarDrawerProps> = ({
  wideDrawerWidth,
  isMobileDrawerOpen,
  toggleMobileDrawer,
}) => {
  return (
    <Drawer
      sx={{ "& .MuiDrawer-paper": { width: wideDrawerWidth } }}
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      open={isMobileDrawerOpen}
      onClose={toggleMobileDrawer}
    >
      <Toolbar disableGutters>
        <Box sx={{ pl: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            component={Link}
            to="/home"
          >
            {/* <img
              alt="Logo"
              style={{
                height: 40,
                width: 40,
                objectFit: "contain",
                objectPosition: "0 50%",
              }}
              src={Logo}
            /> */}
          </Stack>
        </Box>
      </Toolbar>
      <Divider />
      <SidebarMenu />
    </Drawer>
  );
};

export default MobileSidebarDrawer;
