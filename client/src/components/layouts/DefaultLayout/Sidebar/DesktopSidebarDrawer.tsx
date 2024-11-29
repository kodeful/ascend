import { type FC } from "react";
import { Divider, Drawer, Stack, Toolbar } from "@mui/material";

import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";

import SidebarMenu from "./SidebarMenu/SidebarMenu";

interface DesktopSidebarDrawerProps {
  wideDrawerWidth: number;
  menuDrawerWidth: number;
  isDesktopDrawerShrinked: boolean;
}

const DesktopSidebarDrawer: FC<DesktopSidebarDrawerProps> = ({
  menuDrawerWidth,
  isDesktopDrawerShrinked,
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: menuDrawerWidth,
          // transition: "width 0.1s ease-out",
          overflow: "hidden",
          border: "none",
          borderRadius: 0,
        },
      }}
    >
      <Stack direction="column" overflow="hidden" sx={{ height: "100%" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
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

            {!isDesktopDrawerShrinked && (
              <AscendTextIcon
                sx={{
                  width: 80,
                  height: 16,

                  "& path": {
                    fill: "#FFF",
                  },
                }}
              />
            )}
          </Stack>
        </Toolbar>
        <Divider />
        <SidebarMenu />
      </Stack>
    </Drawer>
  );
};

export default DesktopSidebarDrawer;
