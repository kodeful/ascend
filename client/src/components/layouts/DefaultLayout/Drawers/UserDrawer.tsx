import { type FC } from "react";
import { Avatar, Drawer, Stack, Typography } from "@mui/material";

import CloseIcon from "components/icons/CloseIcon";
import { useMeStore, userInitials } from "components/stores/MeStore";

// import { useHistory } from "react-router";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserDrawer: FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const firstName = useMeStore((s) => s.me?.firstName);
  const name = useMeStore((s) => s.me?.name);
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
            fontSize: Math.min(40, 60 / initials.length),
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
          Facilitator
        </Typography>
      </Stack>
    </Drawer>
  );
};

export default UserDrawer;
