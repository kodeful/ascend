import React, { type FC } from "react";
import { Box } from "@mui/material";

import { isObject } from "utils/isObject";

interface Props {
  error: any;
}

const FieldErrorFeedbackFormatter: FC<Props> = ({ error }) => {
  switch (true) {
    case typeof error === "string":
      return <Box textTransform="capitalize">{error}</Box>;

    case isObject(error) && Object.prototype.hasOwnProperty.call(error, "key"):
      // @ts-ignore
      return <Box textTransform="capitalize">{error.values}</Box>;

    case isObject(error) && Object.values(error).length > 0:
      const firstError = Object.values(error)[0] as string;
      return <Box textTransform="capitalize">{firstError}</Box>;

    default:
      return <Box textTransform="capitalize">Field Error</Box>;
  }
};

export default FieldErrorFeedbackFormatter;
