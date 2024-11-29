import React, { type FC } from "react";
import { SnackbarProvider as SnackbarActualProvider } from "notistack";

import SnackbarErrorComponent from "components/notistack/SnackbarErrorComponent";
import SnackbarInfoComponent from "components/notistack/SnackbarInfoComponent";
import SnackbarSuccessComponent from "components/notistack/SnackbarSuccessComponent";
import type { WithChildren } from "utils/types";

type SnackbarProviderProps = WithChildren<unknown>;

const SnackbarProvider: FC<SnackbarProviderProps> = ({ children }) => {
  return (
    <SnackbarActualProvider
      maxSnack={3}
      Components={{
        success: SnackbarSuccessComponent,
        error: SnackbarErrorComponent,
        info: SnackbarInfoComponent,
      }}
    >
      {children}
    </SnackbarActualProvider>
  );
};

export default SnackbarProvider;
