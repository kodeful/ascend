import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";

import FormikTextField from "components/forms/FormikTextField";

const SettingsPasswordForm = () => {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: (values) => {
      console.log(values);
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
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SettingsPasswordForm;
