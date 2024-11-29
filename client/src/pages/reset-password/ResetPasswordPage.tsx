import React from "react";
import { Typography } from "@mui/material";
import SignInLayout from "pages/sign-in/SignInLayout";

import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <SignInLayout>
      <Typography variant="h1" color="primary.main" mb={1}>
        Reset Password
      </Typography>
      <ResetPasswordForm />
    </SignInLayout>
  );
};

export default ResetPasswordPage;
