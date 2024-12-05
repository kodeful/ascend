import { type FC } from "react";
import { InfoOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import * as yup from "yup";

import { UserRole } from "api/generated/models";
import { useUserControllerCreateUser } from "api/generated/user/user";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";
import FormikTextField from "components/forms/FormikTextField";

import type { ModalProps } from "../ModalProps";

type AddUserModalProps = ModalProps;

const AddUserModal: FC<AddUserModalProps> = ({ visible, handleClose }) => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      username: "",
      role: null,
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      phone: yup.string().optional(),
      username: yup.string().required(),
      role: yup.string().nullable().required(),
      password: yup.string().required().min(8),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required(),
    }),
    onSubmit: async (values) => {
      createUser({
        data: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          username: values.username,
          role: values.role as unknown as UserRole,
          password: values.password,
        },
      });
    },
  });

  const { resetForm } = formik;

  const { mutateAsync: createUser, isLoading } = useUserControllerCreateUser({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["users"]);

        enqueueSnackbar("User created successfully", { variant: "success" });
        resetForm();
        handleClose();
      },
    },
  });

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm">
      <Typography fontSize={18} fontWeight={600} mb={1} color="#0F172A">
        Add User
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
          <FormikAutocomplete
            name="role"
            label="User Type"
            options={valueOptions(Object.keys(UserRole))}
          />
          <FormikTextField name="password" label="Password" type="password" />
          <FormikTextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            // helperText="Add the first password to send it to the user email. Later we recommend the user can change it for a new one."
          />

          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <InfoOutlined sx={{ fontSize: 18 }} />
            <Typography fontSize={12} color="#60646C">
              Add the first password to send it to the user email. Later we
              recommend the user can change it for a new one.
            </Typography>
          </Stack>

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
                Add User
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddUserModal;
