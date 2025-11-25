import { type FC } from "react";
import { Button, Dialog, Divider, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { useImportControllerDisconnectImport } from "api/generated/import/import";

import type { ModalProps } from "../ModalProps";

type ImportDisconnectModalProps = ModalProps & {
  import: any;
};

const ImportDisconnectModal: FC<ImportDisconnectModalProps> = ({
  visible,
  handleClose,
  import: importData,
}) => {
  const queryClient = useQueryClient();

  const { mutate: disconnectImport } = useImportControllerDisconnectImport({
    mutation: {
      onSuccess: () => {
        handleClose();

        queryClient.invalidateQueries({
          queryKey: ["import"],
        });
      },
    },
  });

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="xs">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Disconnect import
      </Typography>
      <Typography fontSize={14} fontWeight={400} mb={2} color="#64748B">
        Are you sure you want to disconnect this import?{" "}
        {JSON.stringify(importData)}
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
              disconnectImport({
                importId: importData._id,
              });
            }}
          >
            Disconnect
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ImportDisconnectModal;
