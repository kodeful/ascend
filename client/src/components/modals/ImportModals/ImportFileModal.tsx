import { type FC } from "react";
import { Dialog, Typography } from "@mui/material";

import type { ModalProps } from "../ModalProps";
import ImportFileFile from "./ImportFileFile";
import ImportFileGoogleSheet from "./ImportFileGoogleSheet";

const FORM = {
  file: ImportFileFile,
  "google-sheet": ImportFileGoogleSheet,
};

type ImportFileModalProps = ModalProps & {
  source: keyof typeof FORM;
};

const ImportFileModal: FC<ImportFileModalProps> = ({
  source,
  visible,
  handleClose,
}) => {
  const ImportForm = source ? FORM[source] : null;

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Import new data
      </Typography>

      {ImportForm && <ImportForm handleClose={handleClose} />}
    </Dialog>
  );
};

export default ImportFileModal;
