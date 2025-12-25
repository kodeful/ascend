import React from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";

import { useOrganisationControllerUpdateOrganisation } from "api/generated/organisation/organisation";
import FormikTextField from "components/forms/FormikTextField";
import { useMeStore } from "components/stores/MeStore";

const SettingsOrgnizationForm = () => {
  const queryClient = useQueryClient();
  const organisation = useMeStore((s) => s.organisation);

  const formik = useFormik({
    initialValues: {
      name: organisation?.name || "",
      industry: organisation?.industry || "",
    },
    onSubmit: async (values) => {
      await updateOrganisation({
        organisationId: organisation?._id,
        data: {
          name: values.name,
          industry: values.industry,
        },
      });
    },
  });

  const { mutateAsync: updateOrganisation, isLoading } =
    useOrganisationControllerUpdateOrganisation({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["me"]);
          await queryClient.invalidateQueries(["organization"]);

          enqueueSnackbar("Organisation updated successfully", {
            variant: "success",
          });
        },
      },
    });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Stack direction="column" spacing={1}>
          <FormikTextField name="name" label="Name" />
          <FormikTextField name="industry" label="Industry" />

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

export default SettingsOrgnizationForm;
