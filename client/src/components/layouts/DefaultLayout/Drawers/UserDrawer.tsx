import { type FC } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Drawer,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccountIMG from "assets/imgs/user-drawer/account.png";
import GroupIMG from "assets/imgs/user-drawer/group.png";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

import AscendIcon from "components/icons/AscendIcon";
import CloseIcon from "components/icons/CloseIcon";
import ConnectionIcon from "components/icons/ConnectionIcon";
import LogoutIcon from "components/icons/LogoutIcon";
import SettingsIcon from "components/icons/SettingsIcon";
import SupportIcon from "components/icons/SupportIcon";
import { openModal } from "components/modals/ModalsStore";
import { role, useMeStore, userInitials } from "components/stores/MeStore";

import type { SidebarMenuListChild } from "../Sidebar/SidebarMenu/SidebarMenu";
import UserDrawerMenuItem from "./UserDrawerMenuItem";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuListTop: SidebarMenuListChild = [
  {
    id: "settings",
    icon: <SettingsIcon />,
    text: "Settings",
    link: "/settings/account",
  },
  {
    id: "connections",
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
    id: "support",
    icon: <SupportIcon />,
    text: "Support",
    link: "/settings/support",
  },
];

const menuListBottom: SidebarMenuListChild = [
  {
    id: "about-ascend",
    icon: <AscendIcon />,
    text: "About Ascend",
    link: "/settings/support",
  },
  {
    id: "logout",
    icon: <LogoutIcon />,
    text: "Logout",
    onClick: () => {
      openModal("logout");
    },
  },
];

const UserDrawer: FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const history = useHistory();

  const firstName = useMeStore((s) => s.me?.firstName);
  const name = useMeStore((s) => s.me?.fullName);
  const initials = userInitials(name);

  return (
    <Drawer
      BackdropProps={{
        sx: {
          opacity: "0!important",
        },
      }}
      PaperProps={{
        sx: {
          // width: { xs: "320px", sm: "400px" },
          width: 418,

          // p: { xs: 2, sm: 3 },
          borderRadius: 0,
          // backdrop-filter: blur(50px)
          border: "none",
          backdropFilter: "blur(50px)",
          background: "#85240C4D",
          boxShadow: "0px 0px 20.9px 0px #00000026",
          px: 2,
        },
      }}
      variant="temporary"
      anchor="right"
      open={isOpen}
      onClose={onClose}
      data-cy="user-drawer"
    >
      <Stack height={70} justifyContent="center">
        <CloseIcon
          sx={{
            cursor: "pointer",
            "& svg path": { stroke: "#FFF" },
          }}
          onClick={() => onClose()}
        />
      </Stack>

      <Stack direction="column" alignItems="center">
        <Avatar
          sx={{
            width: 80,
            height: 80,
            // backgroundColor: "#FFF",
            // color: "primary.dark",
            bgcolor: "primary.main",
            color: "#FFF",
            border: "2px solid #FFF",
            // fontSize: Math.min(40, 60 / initials.length),
            fontSize: 35,
            fontWeight: 600,
          }}
          variant="circular"
        >
          {initials.toUpperCase()}
        </Avatar>

        <Typography fontSize={22} fontWeight={600} color="#FFF" mt={1}>
          {firstName}
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={600}
          color="#FFE4B0"
          lineHeight={1}
        >
          {role()}
        </Typography>
      </Stack>

      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={6}>
          <Paper
            component={ButtonBase}
            sx={{
              p: 2,
              flexDirection: "column",
              textAlign: "left",
              alignItems: "flex-start",
            }}
            onClick={() => {
              history.push("/settings/account");
              onClose();
            }}
          >
            <Box component="img" src={AccountIMG} />
            <Typography fontSize={16} fontWeight={600} color="#4D4D4D" mt={1}>
              Edit account
            </Typography>
            <Typography fontSize={14} color="#808080">
              Edit your account data, password, name, and more
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            component={ButtonBase}
            sx={{
              p: 2,
              flexDirection: "column",
              textAlign: "left",
              alignItems: "flex-start",
            }}
            onClick={() => {
              history.push("/settings/group-settings");
              onClose();
            }}
          >
            <Box component="img" src={GroupIMG} />
            <Typography fontSize={16} fontWeight={600} color="#4D4D4D" mt={1}>
              Edit group
            </Typography>
            <Typography fontSize={14} color="#808080">
              Add, edit or delete learners from the analytics
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, px: 1.5 }}>
            <Stack
              direction="column"
              divider={<Divider sx={{ mx: 0.5, my: "4px!important" }} />}
            >
              {menuListTop.map(({ id, icon, text, link, onClick }) => {
                return (
                  <UserDrawerMenuItem
                    key={id}
                    id={id}
                    icon={icon}
                    text={text}
                    link={link}
                    onClick={() => {
                      onClick?.();
                      onClose();
                    }}
                  />
                );
              })}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, px: 1.5 }}>
            <Stack
              direction="column"
              divider={<Divider sx={{ mx: 0.5, my: "4px!important" }} />}
            >
              {menuListBottom.map(({ id, icon, text, link, onClick }) => {
                return (
                  <UserDrawerMenuItem
                    key={id}
                    id={id}
                    icon={icon}
                    text={text}
                    link={link}
                    onClick={onClick}
                  />
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Typography
        fontSize={12}
        fontWeight={700}
        color="#FFF"
        mt={1}
        textAlign="center"
      >
        Ascend {dayjs().year()} © All rights reserved
      </Typography>
    </Drawer>
  );
};

export default UserDrawer;
