import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";

import FormikTextField from "components/forms/FormikTextField";

const SettingsAccountInfoForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: (values) => {
      console.log(values);
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
            <Button
              type="submit"
              variant="contained"
              sx={{
                padding: "8px 16px",
                minHeight: "auto",
                height: "auto",
                fontSize: 14,
                minWidth: 80,
              }}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SettingsAccountInfoForm;
