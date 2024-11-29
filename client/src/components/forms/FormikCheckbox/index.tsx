import React, { type ReactElement } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  type CheckboxProps,
} from "@mui/material";
import { useField } from "formik";

import type { MakeRequired } from "utils/types";

interface FormikCheckboxProps extends MakeRequired<CheckboxProps, "name"> {
  label: string | ReactElement;
  helperText?: string | ReactElement;
}

const FormikCheckbox = ({
  name,
  label,
  helperText,
  ...rest
}: FormikCheckboxProps) => {
  const [field] = useField<unknown>(name);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox checked={Boolean(field.value)} {...field} {...rest} />
        }
        label={label}
        sx={{ mt: 0.7, ml: 0, ".MuiTypography-root": { mt: 0.1, ml: 0 } }}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </>
  );
};

export default FormikCheckbox;
