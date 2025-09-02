import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, Link, Paper, Typography } from "@mui/material";
import { Form as FormikForm, FormikProvider, useFormik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as yup from "yup";

import { useAuthControllerLogin } from "api/generated/auth/auth";
import FormikTextField from "components/forms/FormikTextField";
import { useMeStore } from "components/stores/MeStore";

const SignInForm = () => {
  const history = useHistory();
  const intl = useIntl();

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
        <FormattedMessage id="PAGE.SIGN_IN.WELCOME" />
      </Typography>

      <FormikProvider value={formik}>
        <FormikForm data-cy="login-form">
          <FormikTextField
            name="email"
            label={intl.formatMessage({
              id: "PAGE.SIGN_IN.EMAIL_LABEL",
            })}
            placeholder={intl.formatMessage({
              id: "PAGE.SIGN_IN.EMAIL_PLACEHOLDER",
            })}
            sx={{ mb: 1 }}
            data-cy="email-input"
          />
          <FormikTextField
            name="password"
            label={intl.formatMessage({
              id: "PAGE.SIGN_IN.PASSWORD_LABEL",
            })}
            placeholder={intl.formatMessage({
              id: "PAGE.SIGN_IN.PASSWORD_PLACEHOLDER",
            })}
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

          <LoadingButton
            sx={{ mt: 1, mb: 1.5 }}
            type="submit"
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            <FormattedMessage id="PAGE.SIGN_IN.ACCESS" />
          </LoadingButton>
        </FormikForm>
      </FormikProvider>

      <Box width="100%" textAlign="left">
        <Link to="/reset-password" component={RouterLink} fontSize={14}>
          <FormattedMessage id="PAGE.SIGN_IN.FORGOT_PASSWORD" />
        </Link>
      </Box>
    </Paper>
  );
};

export default SignInForm;
