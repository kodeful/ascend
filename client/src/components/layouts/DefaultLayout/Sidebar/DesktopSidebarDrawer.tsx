import { useRef, useState, type FC } from "react";
import { UnfoldMoreOutlined } from "@mui/icons-material";
import {
  ButtonBase,
  Divider,
  Drawer,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import OrganisationsIcon from "components/icons/OrganisationsIcon";
import { useMeStore } from "components/stores/MeStore";

import SidebarMenu from "./SidebarMenu/SidebarMenu";
import UserPopoverWorkspace from "./UserPopoverWorkspace";

interface DesktopSidebarDrawerProps {
  menuDrawerWidth: number;
  isDesktopDrawerShrinked: boolean;
}

const DesktopSidebarDrawer: FC<DesktopSidebarDrawerProps> = ({
  menuDrawerWidth,
  isDesktopDrawerShrinked,
}) => {
  const organisation = useMeStore((s) => s.organisation);

  const popoverAnchorEl = useRef<HTMLDivElement | null>(null);
  const [isUserPopoverWorkspaceOpen, setIsUserPopoverWorkspaceOpen] =
    useState<boolean>(false);

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

        <SidebarMenu expanded={!isDesktopDrawerShrinked} />

        <Stack
          ref={popoverAnchorEl}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          // pt={1.5}
          // pb={0.5}
          // px={3}
          mb={3}
          onClick={() => setIsUserPopoverWorkspaceOpen(true)}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              // p: 1,
              width: "100%",
              overflow: "hidden",
              textAlign: "left",
              justifyContent: "flex-start",
              mx: 0.75,
              px: 1,
              py: 1,
              borderRadius: 2,

              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            component={ButtonBase}
          >
            <Stack
              minWidth={32}
              width={32}
              height={32}
              bgcolor="primary.main"
              borderRadius={2}
              justifyContent="center"
              alignItems="center"
            >
              <OrganisationsIcon sx={{ fontSize: 18, color: "#FFF" }} />
            </Stack>
            <Stack
              width="100%"
              sx={{ ml: 1.2, pr: 1 }}
              flex={1}
              overflow="hidden"
            >
              <Typography
                className="one-line"
                fontSize={16}
                color="#A09992"
                fontWeight={600}
              >
                {organisation?.name}
              </Typography>
            </Stack>
            <UnfoldMoreOutlined sx={{ fontSize: 20, color: "#A09992" }} />
          </Stack>
        </Stack>
        <UserPopoverWorkspace
          anchorEl={popoverAnchorEl.current}
          isOpen={isUserPopoverWorkspaceOpen}
          handleClose={() => setIsUserPopoverWorkspaceOpen(false)}
        />
      </Stack>
    </Drawer>
  );
};

export default DesktopSidebarDrawer;
