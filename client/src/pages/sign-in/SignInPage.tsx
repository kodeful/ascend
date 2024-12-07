import React from "react";
import { Box } from "@mui/material";

import Title from "components/TItle/Title";

import SignInForm from "./components/SignInForm";
import SignInLayout from "./SignInLayout";

const SignInPage = () => {
  return (
    <SignInLayout>
      <Box mb={1}>
        <Title title="Sign in" />
      </Box>

      <SignInForm />
    </SignInLayout>
  );
};

export default SignInPage;
