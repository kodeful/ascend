import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, Link, Paper, Typography } from "@mui/material";
import { Form as FormikForm, FormikProvider, useFormik } from "formik";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as yup from "yup";

import { useAuthControllerLogin } from "api/generated/auth/auth";
import FormikTextField from "components/forms/FormikTextField";
import { useMeStore } from "components/stores/MeStore";

const SignInForm = () => {
  const history = useHistory();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit: async (values) => {
      await login({
        data: {
          email: values.email,
          password: values.password,
        },
      });
    },
  });

  const { mutateAsync: login, isLoading } = useAuthControllerLogin({
    mutation: {
      onSuccess: ({ token }) => {
        useMeStore.getState().setToken(token);
        history.push("/home");
      },
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
      <Typography fontSize={16} fontWeight={500} mb={1}>
        Welcome! Login or requests an account
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
          <FormikTextField
            name="password"
            label="Password"
            placeholder="Enter your access key"
            type={passwordVisible ? "text" : "password"}
            sx={{ mb: 1 }}
            data-cy="password-input"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setPasswordVisible((p) => !p)}>
                  {passwordVisible ? (
                    <VisibilityOffOutlined />
                  ) : (
                    <VisibilityOutlined />
                  )}
                </IconButton>
              ),
            }}
          />
          {/* <Link
            component={RouterLink}
            to={`/forgot-password`}
            fontSize={14}
            sx={{ textDecoration: "none" }}
            data-cy="forgot-password-button"
          >
            Forgot Password?
          </Link> */}

          <LoadingButton
            sx={{ mt: 1, mb: 1.5 }}
            type="submit"
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            Access
          </LoadingButton>
        </FormikForm>
      </FormikProvider>

      <Box width="100%" textAlign="left">
        <Link to="/reset-password" component={RouterLink} fontSize={14}>
          Forgot password?
        </Link>
      </Box>
    </Paper>
  );
};

export default SignInForm;
