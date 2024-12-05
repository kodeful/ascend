import React from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";

import { useUserControllerUpdateMe } from "api/generated/user/user";
import FormikTextField from "components/forms/FormikTextField";
import { useMeStore } from "components/stores/MeStore";

const SettingsAccountInfoForm = () => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      username: useMeStore.getState().me?.username || "",
      firstName: useMeStore.getState().me?.firstName || "",
      lastName: useMeStore.getState().me?.lastName || "",
      email: useMeStore.getState().me?.email || "",
    },
    onSubmit: async (values) => {
      await updateMe({
        data: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      });
    },
  });

  const { mutateAsync: updateMe, isLoading } = useUserControllerUpdateMe({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["me"]);

        enqueueSnackbar("Account updated successfully", {
          variant: "success",
        });
      },
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Stack direction="column" spacing={1}>
          <FormikTextField name="username" label="Username" disabled />
          <FormikTextField name="firstName" label="Name" />
          <FormikTextField name="lastName" label="Last Name" />
          <FormikTextField name="email" label="Email" />

          <Box textAlign="right" pt={1}>
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
      </Form>
    </FormikProvider>
  );
};

export default SettingsAccountInfoForm;
