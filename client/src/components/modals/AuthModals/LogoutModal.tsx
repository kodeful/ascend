import { type FC } from "react";
import { Button, Dialog, Divider, Grid, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

import { useMeStore } from "components/stores/MeStore";

import type { ModalProps } from "../ModalProps";

type LogoutModalProps = ModalProps;

const LogoutModal: FC<LogoutModalProps> = ({ visible, handleClose }) => {
  const history = useHistory();

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="xs">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Close session
      </Typography>
      <Typography fontSize={14} fontWeight={400} mb={2} color="#64748B">
        Are you sure you want to log out?
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              border: "1px solid #E2E8F0",
              bgcolor: "#FFF",
              color: "#0F172A",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              useMeStore.getState().reset();
              history.push("/sign-in");
              handleClose();
            }}
          >
            Log out
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default LogoutModal;
