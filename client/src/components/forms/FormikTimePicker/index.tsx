import React, { useMemo } from "react";
import { Box } from "@mui/material";
import {
  LocalizationProvider,
  TimePicker,
  type TimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useField } from "formik";

import type { MakeOptional } from "utils/types";

import FieldErrorFeedbackFormatter from "../FieldErrorFeedbackFormatter";

interface FormikTimePickerProps<T extends dayjs.Dayjs>
  extends MakeOptional<TimePickerProps<T>, "value" | "onChange"> {
  name: string;
  label: string;
}

const FormikTimePicker = <T extends dayjs.Dayjs>({
  name,
  label,
  ...rest
}: FormikTimePickerProps<T>) => {
  const [field, meta, helpers] = useField<Date | string | null>(name);

  const styles = useMemo(() => {
    if (meta.touched && !!meta.error) {
      return {
        // color: "error.main",
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "error.main",
        },
      };
    }

    return {};
  }, [meta]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        //@ts-expect-error
        value={field.value ? dayjs(field.value) : null}
        label={label}
        sx={{
          width: "100%",
          ...styles,
        }}
        onChange={(value) => {
          if (value) {
            helpers.setValue(dayjs(value).toDate());
          } else {
            helpers.setValue(null);
          }
        }}
        {...rest}
      />
      {meta.touched && meta.error ? (
        <Box
          sx={{ fontSize: "0.75rem", color: "error.main", pl: 1.8, pt: 0.1 }}
        >
          <FieldErrorFeedbackFormatter error={meta.error} />
        </Box>
      ) : (
        <></>
      )}
    </LocalizationProvider>
  );
};

export default FormikTimePicker;
