import React from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import { useField } from "formik";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

import FieldErrorFeedbackFormatter from "components/forms/FieldErrorFeedbackFormatter";
import type { MakeRequired } from "utils/types";

type Props = MakeRequired<TextFieldProps, "name">;

const FormikNumberField = ({
  name,
  helperText,
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
    <NumericFormat
      fullWidth
      error={meta.touched && !!meta.error}
      helperText={helperTextValue}
      thousandSeparator
      {...field}
      {...rest}
      onChange={() => {}}
      onValueChange={(values) => {
        const { floatValue } = values;
        helper.setValue(floatValue!);
      }}
      customInput={TextField}
    />
  );
};

export default FormikNumberField;
