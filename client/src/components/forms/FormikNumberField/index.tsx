import React from "react";
import { Box, TextField, Typography, type TextFieldProps } from "@mui/material";
import { useField } from "formik";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

import FieldErrorFeedbackFormatter from "components/forms/FieldErrorFeedbackFormatter";
import type { MakeRequired } from "utils/types";

type Props = MakeRequired<TextFieldProps, "name">;

const FormikNumberField = ({
  name,
  helperText,
  label,
  ...rest
}: NumericFormatProps<Props>) => {
  const [field, meta, helper] = useField<number>(name);

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

      <NumericFormat
        fullWidth
        error={meta.touched && !!meta.error}
        helperText={helperTextValue}
        thousandSeparator
        label=""
        {...field}
        {...rest}
        onChange={() => {}}
        onValueChange={(values) => {
          const { floatValue } = values;
          helper.setValue(floatValue!);
        }}
        customInput={TextField}
      />
    </Box>
  );
};

export default FormikNumberField;
