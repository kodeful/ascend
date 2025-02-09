import type { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import { useImportControllerImportGoogleSheet } from "api/generated/import/import";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";
import FormikTextField from "components/forms/FormikTextField";

type ImportFileGoogleSheetProps = {
  handleClose: () => void;
};

const ImportFileGoogleSheet: FC<ImportFileGoogleSheetProps> = ({
  handleClose,
}) => {
  const formik = useFormik({
    initialValues: {
      spreadsheetLink: null,
      metric: "",
      assessment: null,
    },
    validationSchema: yup.object({
      spreadsheetLink: yup.string().nullable().required(),
      metric: yup.string().required(),
      assessment: yup.string().nullable().required(),
    }),

    onSubmit: async (values) => {
      await importGoogleSheet({
        data: {
          spreadsheetLink: values.spreadsheetLink,
          metric: values.metric,
          assessment: values.assessment,
        },
      });
    },
  });

  const { resetForm } = formik;

  const { mutateAsync: importGoogleSheet, isLoading } =
    useImportControllerImportGoogleSheet({
      mutation: {
        onSuccess: async () => {
          // useMeStore.getState().setWorkspace(workspace);
          // window.location.reload();
        },
      },
    });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Typography
          fontSize={14}
          fontWeight={700}
          mb={1.5}
          color="primary.dark"
        >
          Data source
        </Typography>

        <FormikTextField name="spreadsheetLink" label="Spreadsheet link" />

        <Typography
          fontSize={14}
          fontWeight={700}
          mb={1.5}
          mt={2}
          color="primary.dark"
        >
          Data info
        </Typography>

        <FormikTextField
          // freeSolo
          name="metric"
          label="Metric"
        />

        <FormikAutocomplete
          name="assessment"
          label="Assessment"
          options={valueOptions([
            "Peer Evaluation",
            "Self-evaluation",
            "Facilitator Evaluation",
          ])}
        />

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
              onClick={() => {
                resetForm();
                handleClose();
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              variant="contained"
              fullWidth
              type="submit"
              loading={isLoading}
            >
              Import now
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default ImportFileGoogleSheet;
