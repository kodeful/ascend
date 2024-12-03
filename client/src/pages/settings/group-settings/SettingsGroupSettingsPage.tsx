import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";

import FormikTextField from "components/forms/FormikTextField";
import { openModal } from "components/modals/ModalsStore";

import SettingsPageLayout from "../SettingsPageLayout";
import GroupUsersDataGrid from "./components/GroupUsersDataGrid";

const SettingsGroupSettingsPage = () => {
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });
  return (
    <SettingsPageLayout>
      <Stack
        sx={{
          p: 3,
          py: 2,
        }}
        width="100%"
        flex={1}
        overflow="hidden"
      >
        <Typography variant="h1" color="primary.main">
          Group settings
        </Typography>

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <FormikProvider value={formik}>
            <Form>
              <Stack
                direction="row"
                justifyContent="space-between"
                pb={1}
                alignItems="center"
              >
                <Box width="100%" maxWidth={470}>
                  <FormikTextField
                    name="search"
                    label=""
                    placeholder="Search user"
                    fullWidth
                  />
                </Box>

                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      padding: "8px 16px",
                      minHeight: "auto",
                      height: "auto",
                      fontSize: 14,
                    }}
                    onClick={() => {
                      openModal("add-user");
                    }}
                  >
                    Add User
                  </Button>
                </Box>
              </Stack>

              <GroupUsersDataGrid />
            </Form>
          </FormikProvider>
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsGroupSettingsPage;
