import { useMemo, type FC } from "react";
import { Close } from "@mui/icons-material";
import { Box, Drawer, Paper, Stack, Typography } from "@mui/material";
import AlertNotificationIMG from "assets/imgs/notifications/alert-notification.jpeg";

// import { useHistory } from "react-router";

type NotificationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NotificationDrawer: FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const notifications = useMemo(() => {
    return [
      {
        date: "Yesterday",
        type: "calendar",
        title: "Weekly report generated",
        description:
          "A new weekly report has been generated. Check it now and discover the evolution of your students.",
      },
      {
        date: "August 29",
        type: "path",
        title: "Follow the learners path",
        description:
          "Did you know that you can follow the LMS metrics from Ascend App to each individual learner.",
      },
      {
        date: "August 26",
        type: "chart",
        title: "New charts available",
        description:
          "We have launched a new release of Ascend and we have big news! Now you can view the 3 Eye Report y different ways to compare growth. ",
      },
    ];
  }, []);

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
        <Close
          sx={{ cursor: "pointer", fontSize: 30, color: "#FFF" }}
          onClick={() => onClose()}
        />
      </Stack>

      <Typography variant="h1" color="primary">
        Inbox
      </Typography>

      <Stack direction="column" spacing={2} mt={2}>
        {notifications.map((notification) => (
          <Box>
            <Typography fontSize={16} fontWeight={600} color="#6C6B67">
              {notification.date}
            </Typography>
            <Paper sx={{ p: 2, mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <Box
                  width={56}
                  height={56}
                  borderRadius="50%"
                  bgcolor="#6C6B67"
                  sx={{
                    backgroundImage: `url('${AlertNotificationIMG}')`,
                    backgroundSize: "cover",
                  }}
                />

                <Box flex={1}>
                  <Typography fontSize={16} fontWeight={600} color="#4D4D4D">
                    {notification.title}
                  </Typography>
                  <Typography fontSize={14} color="#808080" mt={0.5}>
                    {notification.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Drawer>
  );
};

export default NotificationDrawer;
