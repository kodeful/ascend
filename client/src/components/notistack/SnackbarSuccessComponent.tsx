import { forwardRef } from "react";
import { useTheme } from "@mui/material";
import type { CustomContentProps } from "notistack";

import SnackbarBaseComponent from "./SnackbarBaseComponent";

// eslint-disable-next-line react/display-name
const SnackbarSuccessComponent = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, ...props }, ref) => {
    const theme = useTheme();
    return (
      <SnackbarBaseComponent
        id={id}
        color={theme.palette.success.main}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SnackbarSuccessComponent;
