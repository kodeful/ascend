import React, { useState, type FC } from "react";
import {
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
// import Logo from "assets/icons/logo.png";
import { Link } from "react-router-dom";

import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";

import SidebarMenu from "./SidebarMenu/SidebarMenu";

interface DesktopSidebarDrawerProps {
  wideDrawerWidth: number;
  menuDrawerWidth: number;
  isDesktopDrawerShrinked: boolean;
  toggleDesktopDrawer: () => void;
}

const DesktopSidebarDrawer: FC<DesktopSidebarDrawerProps> = ({
  wideDrawerWidth,
  menuDrawerWidth,
  isDesktopDrawerShrinked,
  toggleDesktopDrawer,
}) => {
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width:
            isDesktopDrawerShrinked && isMouseOver
              ? wideDrawerWidth
              : menuDrawerWidth,
          transition: "width 0.1s ease-out",
          overflow: "hidden",
          border: "none",
          borderRadius: 0,
        },
      }}
    >
      <Stack
        direction="column"
        overflow="hidden"
        sx={{ height: "100%" }}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent:
              !isDesktopDrawerShrinked || isMouseOver
                ? "space-between"
                : "center",
            alignItems: "center",
            bgcolor: "primary.dark",
          }}
          disableGutters
        >
          <Stack direction="row" alignItems="center" spacing={1} ml={2}>
            <Stack
              width={30}
              height={30}
              bgcolor="#FFF"
              justifyContent="center"
              alignItems="center"
              borderRadius="8px"
            >
              <AscendIcon />
            </Stack>

            <AscendTextIcon
              sx={{
                width: 80,
                height: 16,

                "& path": {
                  fill: "#FFF",
                },
              }}
            />
          </Stack>
          {/* {(!isDesktopDrawerShrinked || isMouseOver) && (
            <Box sx={{ pl: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                component={Link}
                to="/home"
              >
                <img
                  alt="Logo"
                  style={{
                    height: 40,
                    width: 40,
                    objectFit: "contain",
                    objectPosition: "0 50%",
                  }}
                  src={Logo}
                />
              </Stack>
            </Box>
          )} */}

          {/* <Box sx={{ px: 1 }}>
            <IconButton color="primary" onClick={toggleDesktopDrawer}>
              {isDesktopDrawerShrinked ? (
                <KeyboardDoubleArrowRightIcon />
              ) : (
                <KeyboardDoubleArrowLeftIcon />
              )}
            </IconButton>
          </Box> */}
        </Toolbar>
        <Divider />
        <SidebarMenu />
      </Stack>
    </Drawer>
  );
};

export default DesktopSidebarDrawer;
