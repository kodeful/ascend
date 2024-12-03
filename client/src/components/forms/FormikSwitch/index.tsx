import React, { type ReactElement } from "react";
import {
  FormControlLabel,
  FormHelperText,
  styled,
  Switch,
  type SwitchProps,
} from "@mui/material";
import { useField } from "formik";

import type { MakeRequired } from "utils/types";

interface FormikSwitchProps extends MakeRequired<SwitchProps, "name"> {
  label: string | ReactElement;
  helperText?: string | ReactElement;
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",

    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "primary.main",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 1,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "primary.main",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "#B7B0A9",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 1,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#B7B0A9",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const FormikSwitch = ({
  name,
  label,
  helperText,
  ...rest
}: FormikSwitchProps) => {
  const [field] = useField<unknown>(name);

  return (
    <>
      <FormControlLabel
        control={
          <IOSSwitch checked={Boolean(field.value)} {...field} {...rest} />
        }
        label={label}
        sx={{
          mt: 0.7,
          ml: 0,
          ".MuiTypography-root": { pl: 1, fontSize: 14, fontWeight: 500 },
        }}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </>
  );
};

export default FormikSwitch;
