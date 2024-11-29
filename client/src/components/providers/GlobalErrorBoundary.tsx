import type { FC } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import type { WithChildren } from "utils/types";

export const ErrorFallback = ({
  resetErrorBoundary: _resetErrorBoundary,
}: FallbackProps) => {
  return <></>;
};

const GlobalErrorBoundary: FC<WithChildren> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // we could send some error data to external system like DataDog etc. here
        console.error({ error, info });
      }}
      onReset={() => (window.location.pathname = "/tickets")}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
