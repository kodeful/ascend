import React from "react";
import { Divider, MenuList, Stack } from "@mui/material";

import AccountIcon from "components/icons/AccountIcon";
import AscendIcon from "components/icons/AscendIcon";
import ConnectionIcon from "components/icons/ConnectionIcon";
// import NotificationIcon from "components/icons/NotificationIcon";
import SupportIcon from "components/icons/SupportIcon";
import type { SidebarMenuListChild } from "components/layouts/DefaultLayout/Sidebar/SidebarMenu/SidebarMenu";
import SidebarMenuItem from "components/layouts/DefaultLayout/Sidebar/SidebarMenu/SidebarMenuItem";

const sidebarMenuList: SidebarMenuListChild = [
  {
    icon: <AccountIcon />,
    text: "Account",
    link: "/settings/account",
  },
  {
    icon: <AccountIcon />,
    text: "Group Settings",
    link: "/settings/group-settings",
  },
  {
    icon: <ConnectionIcon />,
    text: "Connections",
    link: "/settings/connections",
  },
  // {
  //   icon: <NotificationIcon />,
  //   text: "Notification settings",
  //   link: "/settings/notification-settings",
  // },
  {
    icon: <SupportIcon />,
    text: "Support",
    link: "/settings/support",
  },
];

const sidebarMenuListBottom: SidebarMenuListChild = [
  {
    icon: <AscendIcon />,
    text: "About ascend",
    link: "/about",
  },
];

const SettingsSidebar = () => {
  return (
    <Stack width={340} bgcolor="#F2F2F2" borderRight="1px solid #E1D7CB" px={1}>
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
          justifyContent="flex-start"
          height="100%"
          overflow="hidden"
        >
          <Stack>
            {sidebarMenuList.map(({ icon, text, link }) => {
              return (
                <SidebarMenuItem
                  key={link}
                  icon={icon}
                  text={text}
                  link={link}
                  onClick={() => {}}
                  colors={{
                    active: "#4D4D4D",
                    inactive: "#4D4D4D",
                    activeBackground: "#FFFFFF",
                  }}
                />
              );
            })}
          </Stack>

          <Divider sx={{ mx: 2, my: 1.5 }} />

          <Stack>
            {sidebarMenuListBottom.map(({ icon, text, link }) => {
              return (
                <SidebarMenuItem
                  key={link}
                  icon={icon}
                  text={text}
                  link={link}
                  onClick={() => {}}
                  colors={{
                    active: "#4D4D4D",
                    inactive: "#4D4D4D",
                    activeBackground: "#FFFFFF",
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
      </MenuList>
    </Stack>
  );
};

export default SettingsSidebar;
