import { type FC } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, Divider, Grid, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import { useOrganisationControllerCreateOrganisation } from "api/generated/organisation/organisation";
import FormikTextField from "components/forms/FormikTextField";
import { useMeStore } from "components/stores/MeStore";

import type { ModalProps } from "../ModalProps";

type AddOrganizationModalProps = ModalProps;

const AddOrganizationModal: FC<AddOrganizationModalProps> = ({
  visible,
  handleClose,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),

    onSubmit: async (values) => {
      await createOrganisation({
        data: {
          name: values.name,
        },
      });
    },
  });

  const { resetForm } = formik;

  const { mutateAsync: createOrganisation, isLoading } =
    useOrganisationControllerCreateOrganisation({
      mutation: {
        onSuccess: async (workspace) => {
          useMeStore.getState().setWorkspace(workspace);
          window.location.reload();
        },
      },
    });

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Add Organization
      </Typography>

      <FormikProvider value={formik}>
        <Form>
          <FormikTextField name="name" label="Name" />

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
                Add Organization
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddOrganizationModal;
