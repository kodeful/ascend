// import DateAdapter from "@mui/lab/AdapterDateFns";

import React, { Suspense, type FC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type * as H from "history";
import { Router } from "react-router-dom";
import { lightTheme } from "theme";

import GlobalErrorBoundary from "components/providers/GlobalErrorBoundary";
import type { WithChildren } from "utils/types";

import ReactQueryProvider from "./components/providers/ReactQueryProvider";
import SEOProvider from "./components/providers/SEOProvider";
import SnackbarProvider from "./components/providers/SnackbarProvider";
import SplashScreenProvider from "./components/providers/SplashScreenProvider";

import "components/forms/yupErrorMessages";

type ProvidersProps = WithChildren<{ history: H.History }>;

const Providers: FC<ProvidersProps> = ({ children, history }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={lightTheme}>
        <SEOProvider />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <GlobalErrorBoundary>
            <SplashScreenProvider>
              <Suspense fallback={<></>}>
                {/* 
                    // @ts-ignore */}
                <Router history={history}>
                  <SnackbarProvider>
                    <ReactQueryProvider>{children}</ReactQueryProvider>
                  </SnackbarProvider>
                </Router>
              </Suspense>
            </SplashScreenProvider>
          </GlobalErrorBoundary>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
