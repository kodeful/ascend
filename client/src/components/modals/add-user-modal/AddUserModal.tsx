import { type FC } from "react";
import { InfoOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";

import FormikAutocomplete from "components/forms/FormikAutocomplete";
import FormikTextField from "components/forms/FormikTextField";

import type { ModalProps } from "../ModalProps";

type AddUserModalProps = ModalProps;

const AddUserModal: FC<AddUserModalProps> = ({ visible, handleClose }) => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
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
          <FormikAutocomplete name="role" label="User Type" options={[]} />
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
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" fullWidth type="submit">
                Add User
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddUserModal;
