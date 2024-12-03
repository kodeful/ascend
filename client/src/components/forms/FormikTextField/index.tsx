import React from "react";
import { Box, TextField, Typography, type TextFieldProps } from "@mui/material";
import { useField } from "formik";

import FieldErrorFeedbackFormatter from "components/forms/FieldErrorFeedbackFormatter";
import type { MakeRequired } from "utils/types";

type Props = MakeRequired<TextFieldProps, "name">;

const FormikTextField = ({ label, name, helperText, ...rest }: Props) => {
  const [field, meta] = useField<unknown>(name);

  let helperTextValue;
  if (helperText !== false) {
    helperTextValue =
      meta.touched && meta.error ? (
        <FieldErrorFeedbackFormatter error={meta.error} />
      ) : (
        helperText
      );
  }

  return (
    <Box
      sx={{
        opacity: rest.disabled ? 0.5 : 1,
      }}
    >
      {label && (
        <Typography
          color="#0F172A"
          fontSize={14}
          fontWeight={500}
          textAlign="left"
        >
          {label}
        </Typography>
      )}

      <TextField
        fullWidth
        error={meta.touched && !!meta.error}
        helperText={helperTextValue}
        label=""
        {...field}
        {...rest}
      />
    </Box>
  );
};

export default FormikTextField;
