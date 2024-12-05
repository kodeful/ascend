import React from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";

import { useUserControllerUpdateMeChangePassword } from "api/generated/user/user";
import FormikTextField from "components/forms/FormikTextField";

const SettingsPasswordForm = () => {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async (values) => {
      await changePassword({
        data: {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      });
    },
  });

  const { resetForm } = formik;

  const { mutateAsync: changePassword, isLoading } =
    useUserControllerUpdateMeChangePassword({
      mutation: {
        onSuccess: async () => {
          enqueueSnackbar("Password updated successfully", {
            variant: "success",
          });

          resetForm();
        },
      },
    });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Stack direction="column" spacing={1}>
          <FormikTextField
            name="currentPassword"
            type="password"
            label="Current password"
          />
          <FormikTextField
            name="newPassword"
            type="password"
            label="New password"
          />

          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
            pt={1}
          >
            <Box>
              <Typography
                fontSize={12}
                fontWeight={700}
                color="#4d4d4d"
                mb={0.5}
              >
                Password requirements:
              </Typography>

              <Typography fontSize={12} fontWeight={500} color="#808080">
                1. Minimum of 8 characters
              </Typography>
              <Typography fontSize={12} fontWeight={500} color="#808080">
                2. Cannot be a commonly used password
              </Typography>
            </Box>

            <Box>
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  padding: "8px 16px",
                  minHeight: "auto",
                  height: "auto",
                  fontSize: 14,
                  minWidth: 80,
                }}
                loading={isLoading}
              >
                Save
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SettingsPasswordForm;
