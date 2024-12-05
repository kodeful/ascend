import type { FC } from "react";
import { Divider, MenuList, Stack } from "@mui/material";

import ChatIcon from "components/icons/ChatIcon";
import DataIcon from "components/icons/DataIcon";
import HomeIcon from "components/icons/HomeIcon";
import LogoutIcon from "components/icons/LogoutIcon";
import ReportIcon from "components/icons/ReportIcon";
import SettingsIcon from "components/icons/SettingsIcon";
import { openModal } from "components/modals/ModalsStore";

// import { FormattedMessage } from "react-intl";

// import type { UserOrgTypeRoleType } from "api/user/types";
// import { hasPermissions, hasRole } from "components/stores/UserStore";
// import type { PermissionsType } from "components/stores/UserStore/permissions";

import SidebarMenuItem, { type SidebarMenuItemsProps } from "./SidebarMenuItem";

export type SidebarMenuListChild = (SidebarMenuItemsProps & {
  //   requiredPermissions?: PermissionsType[];
  //   requiredRole?: UserOrgTypeRoleType[];
  // dropdown?: Omit<SidebarMenuItemsProps, "icon">[];
})[];

const sidebarMenuList: SidebarMenuListChild = [
  {
    icon: <HomeIcon />,
    text: "Home",
    link: "/home",
  },
  {
    icon: <DataIcon />,
    text: "Data",
    link: "/data",
  },
  {
    icon: <ReportIcon />,
    text: "Report",
    link: "/report",
  },
  {
    icon: <ChatIcon />,
    text: "Chat Ai",
    link: "/chat-ai",
  },
];

const sidebarMenuListBottom: SidebarMenuListChild = [
  {
    icon: <SettingsIcon />,
    text: "Settings",
    link: "/settings",
  },
  {
    icon: <LogoutIcon />,
    text: "Logout",
    onClick: () => {
      openModal("logout");
    },
  },
];

interface SidebarMenuProps {
  expanded: boolean;
  //   onClose?: () => void;
}

const SidebarMenu: FC<SidebarMenuProps> = ({ expanded }) => {
  return (
    <MenuList
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        flex: 1,

        pt: 0,
        height: "100%",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack
        direction="column"
        pt={3}
        pb={1}
        justifyContent="space-between"
        height="100%"
        overflow="hidden"
      >
        <Stack flex={1}>
          {sidebarMenuList.map(({ icon, text, link, onClick }) => {
            return (
              <SidebarMenuItem
                key={link}
                icon={icon}
                text={text}
                link={link}
                onClick={onClick}
                tooltip={!expanded}
              />
            );
          })}
        </Stack>

        <Divider sx={{ mx: 2, my: 1.5 }} />

        <Stack>
          {sidebarMenuListBottom.map(({ icon, text, link, onClick }) => {
            return (
              <SidebarMenuItem
                key={link}
                icon={icon}
                text={text}
                link={link}
                onClick={onClick}
                tooltip={!expanded}
              />
            );
          })}
        </Stack>
      </Stack>
    </MenuList>
  );
};

export default SidebarMenu;
