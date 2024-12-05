import { type FC } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, Divider, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";

import type { User } from "api/generated/models";
import { useUserControllerUpdateUser } from "api/generated/user/user";
import FormikTextField from "components/forms/FormikTextField";

import type { ModalProps } from "../ModalProps";

type EditUserModalProps = ModalProps & {
  user: User;
};

const EditUserModal: FC<EditUserModalProps> = ({
  visible,
  handleClose,
  user,
}) => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      username: user?.username || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateUser({
        userId: user?._id,
        data: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          username: values.username,
        },
      });
    },
  });

  const { resetForm } = formik;

  const { mutateAsync: updateUser, isLoading } = useUserControllerUpdateUser({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["users"]);

        enqueueSnackbar("User updated successfully", { variant: "success" });
        handleClose();
      },
    },
  });

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Edit User: {user?.fullName}
      </Typography>

      <FormikProvider value={formik}>
        <Form>
          <Typography
            fontSize={14}
            fontWeight={700}
            mb={1.5}
            color="primary.dark"
          >
            User info
          </Typography>
          <FormikTextField name="email" label="Email" />
          <FormikTextField name="firstName" label="Name" />
          <FormikTextField name="lastName" label="Last name" />
          <FormikTextField name="phone" label="Phone" />

          <Typography
            fontSize={14}
            fontWeight={700}
            mb={1.5}
            mt={2}
            color="primary.dark"
          >
            Account info
          </Typography>
          <FormikTextField name="username" label="Username" />

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
                loading={isLoading}
                variant="contained"
                fullWidth
                type="submit"
              >
                Save Changes
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditUserModal;
