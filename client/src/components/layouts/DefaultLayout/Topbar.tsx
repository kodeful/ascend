import { useState, type FC } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  type Theme,
} from "@mui/material";
import { useIsFetching } from "@tanstack/react-query";
import { FormattedMessage } from "react-intl";

import NotificationIcon from "components/icons/NotificationIcon";
import {
  getLanguageFlag,
  useLanguageStore,
} from "components/stores/LanguageStore";
import { useMeStore, userInitials } from "components/stores/MeStore";

import LanguageDrawer from "./Drawers/LanguageDrawer";
import NotificationDrawer from "./Drawers/NotificationDrawer";
import UserDrawer from "./Drawers/UserDrawer";

const Topbar: FC<{}> = () => {
  const isMobile = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("md"),
  );
  const isFetching = useIsFetching();

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState<boolean>(false);
  const toggleNotificationDrawer = () =>
    setIsNotificationDrawerOpen((prev) => !prev);

  const [isLanguageDrawerOpen, setIsLanguageDrawerOpen] =
    useState<boolean>(false);
  const toggleLanguageDrawer = () => setIsLanguageDrawerOpen((prev) => !prev);

  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState<boolean>(false);
  const toggleUserDrawer = () => setIsUserDrawerOpen((prev) => !prev);

  const name = useMeStore((s) => s.me?.fullName);
  const firstName = useMeStore((s) => s.me?.firstName);
  const initials = userInitials(name);

  const currentLanguage = useLanguageStore((s) => s.language);

  return (
    <AppBar
      color="inherit"
      position={isMobile ? "fixed" : "sticky"}
      elevation={0}
      sx={{
        borderTop: "none",
        borderRight: "none",
        borderLeft: "none",
        mt: -0.5,
        borderRadius: 0,
        bgcolor: "primary.dark",
      }}
    >
      <Toolbar disableGutters>
        <Box
          sx={{
            mt: 1,
            // ml: isMobile ? 1 : 3,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* Notifications */}
            <Box>
              <IconButton
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#DC7C65",
                  color: "#FFF",
                  mx: 0.5,
                }}
                onClick={toggleLanguageDrawer}
              >
                <Box
                  width={24}
                  height={24}
                  bgcolor="#FFF"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    backgroundImage: `url('${getLanguageFlag(currentLanguage)}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </IconButton>
              <LanguageDrawer
                isOpen={isLanguageDrawerOpen}
                onClose={toggleLanguageDrawer}
              />
            </Box>

            {/* Notifications */}
            <Box>
              <IconButton
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#DC7C65",
                  color: "#FFF",
                  mx: 0.5,
                }}
                onClick={toggleNotificationDrawer}
              >
                <NotificationIcon
                  sx={{
                    fill: "#FFF",
                  }}
                />
              </IconButton>
              <NotificationDrawer
                isOpen={isNotificationDrawerOpen}
                onClose={toggleNotificationDrawer}
              />
            </Box>

            {/* User */}
            <Box>
              <Button
                sx={{
                  boxShadow: "none",
                  textTransform: "none",
                  px: 2,
                  pl: 1.5,
                  py: 1,
                  ":hover": {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                  },
                }}
                onClick={toggleUserDrawer}
                data-cy="user-drawer-button"
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "primary.main",
                      color: "#FFF",
                      border: "2px solid #FFF",
                      // fontSize: Math.min(25, 30 / initials.length),
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                    variant="circular"
                  >
                    {initials.toUpperCase()}
                  </Avatar>

                  <Typography fontWeight={400} fontSize={16} color="#FFF">
                    <FormattedMessage id="TOPBAR.HEY" /> <b>{firstName}</b>
                  </Typography>
                </Stack>
              </Button>
              <UserDrawer
                isOpen={isUserDrawerOpen}
                onClose={toggleUserDrawer}
              />
            </Box>
          </Stack>
        </Box>
      </Toolbar>
      {isFetching ? <LinearProgress color="primary" /> : <Box height="4px" />}
    </AppBar>
  );
};

export default Topbar;
