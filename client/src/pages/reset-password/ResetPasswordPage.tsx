import React from "react";
import { Box } from "@mui/material";
import SignInLayout from "pages/sign-in/SignInLayout";

import Title from "components/TItle/Title";

import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <SignInLayout>
      <Box mb={1}>
        <Title title="Reset password" />
      </Box>

      <ResetPasswordForm />
    </SignInLayout>
  );
};

export default ResetPasswordPage;
