import { type FC } from "react";
import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Drawer,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

// import AlertNotificationIMG from "assets/imgs/notifications/alert-notification.jpeg";

import CloseIcon from "components/icons/CloseIcon";
import { useLanguageStore } from "components/stores/LanguageStore";
import Title from "components/TItle/Title";

// import { useHistory } from "react-router";

type LanguageDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LanguageDrawer: FC<LanguageDrawerProps> = ({ isOpen, onClose }) => {
  const currentLanguage = useLanguageStore((s) => s.language);

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
          background: "#F5EFEA80",
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

      <Title title="DRAWER.TITLE.LANGUAGE" />

      <Stack direction="column" spacing={1} mt={2}>
        {[
          {
            label: "English",
            value: "en",
          },
          {
            label: "Spanish",
            value: "es",
          },
        ].map((language, i) => (
          <Box key={i}>
            <Paper
              component={ButtonBase}
              sx={{ p: 1, width: "100%", justifyContent: "flex-start" }}
              onClick={() =>
                useLanguageStore
                  .getState()
                  .setLanguage(language.value as "en" | "es")
              }
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
                width="100%"
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    width={30}
                    height={30}
                    borderRadius="50%"
                    sx={{
                      backgroundImage:
                        language.value === "en"
                          ? "url('https://flagcdn.com/gb.svg')"
                          : language.value === "es"
                            ? "url('https://flagcdn.com/es.svg')"
                            : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#6C6B67",
                    }}
                  />

                  <Box flex={1}>
                    <Typography fontSize={16} fontWeight={600} color="#4D4D4D">
                      {language.label}
                    </Typography>
                  </Box>
                </Stack>

                {currentLanguage === language.value && (
                  <CheckCircle sx={{ fontSize: 24, color: "primary.main" }} />
                )}
              </Stack>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Drawer>
  );
};

export default LanguageDrawer;
