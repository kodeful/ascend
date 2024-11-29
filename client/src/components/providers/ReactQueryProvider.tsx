import React, { useCallback, type FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  // SnackbarKey,
  useSnackbar,
} from "notistack";

import type { WithChildren } from "utils/types";

const ReactQueryProvider: FC<WithChildren> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || "Error", {
        variant: "error",
      });
    },
    [enqueueSnackbar],
  );

  const handleSuccess = useCallback(
    (response: any) => {
      enqueueSnackbar(response?.message || "Success", {
        variant: "success",
      });
    },
    [enqueueSnackbar],
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: handleError,
      },
      mutations: {
        onError: handleError,
        onSuccess: handleSuccess,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools position="bottom-right" />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
