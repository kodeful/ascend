import { type FC } from "react";
import { ListItemAvatar } from "@material-ui/core";
import {
  Close,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

// import { useHistory } from "react-router";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserDrawer: FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  // const history = useHistory();

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
        <Close
          sx={{ cursor: "pointer", fontSize: 30, color: "#FFF" }}
          onClick={() => onClose()}
        />
      </Stack>
    </Drawer>
  );
};

export default UserDrawer;
