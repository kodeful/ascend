import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";

import FormikTextField from "components/forms/FormikTextField";
import { openModal } from "components/modals/ModalsStore";
import Title from "components/TItle/Title";

import SettingsPageLayout from "../SettingsPageLayout";
import GroupUsersDataGrid from "./components/GroupUsersDataGrid";

const SettingsGroupSettingsPage = () => {
  const intl = useIntl();

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
        <Title title="PAGE.TITLE.GROUP_SETTINGS" />

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
                    placeholder={intl.formatMessage({
                      id: "PAGE.GROUP_SETTINGS.SEARCH_USER_PLACEHOLDER",
                    })}
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
                      openModal("user-add");
                    }}
                  >
                    <FormattedMessage id="PAGE.GROUP_SETTINGS.ADD_USER" />
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
