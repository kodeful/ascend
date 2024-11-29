import { LoadingButton } from "@mui/lab";
import { Box, Link, Paper, Typography } from "@mui/material";
import { Form as FormikForm, FormikProvider, useFormik } from "formik";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as yup from "yup";

import FormikTextField from "components/forms/FormikTextField";

const ResetPasswordForm = () => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: yup.object({
      email: yup.string().email().required(),
    }),
    onSubmit: () => {
      history.push("/sign-in");
    },
  });

  return (
    <Paper
      sx={{
        bgcolor: "#FFF",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        p: "21px",
        textAlign: "center",
      }}
    >
      <Typography fontSize={16} fontWeight={500} mb={2} textAlign="left">
        We&apos;ll email you instructions on how to reset your password.
      </Typography>

      <FormikProvider value={formik}>
        <FormikForm data-cy="login-form">
          <FormikTextField
            name="email"
            label="Email"
            placeholder="Enter your email"
            sx={{ mb: 1 }}
            data-cy="email-input"
          />

          <LoadingButton
            sx={{ mt: 1, mb: 1.5 }}
            // sx={{ mt: 4.5, py: 1 }}
            type="submit"
            variant="contained"
            fullWidth
            // loading={status === "loading"}
          >
            Send password reset link
          </LoadingButton>
        </FormikForm>
      </FormikProvider>

      <Box width="100%" textAlign="left">
        <Link to="/sign-in" component={RouterLink} fontSize={14}>
          Go Back
        </Link>
      </Box>
    </Paper>
  );
};

export default ResetPasswordForm;
