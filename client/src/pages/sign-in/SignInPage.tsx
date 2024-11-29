import React from "react";
import { Typography } from "@mui/material";

import SignInForm from "./components/SignInForm";
import SignInLayout from "./SignInLayout";

const SignInPage = () => {
  return (
    <SignInLayout>
      <Typography variant="h1" color="primary.main" mb={1}>
        Sign in
      </Typography>
      <SignInForm />
    </SignInLayout>
  );
};

export default SignInPage;
