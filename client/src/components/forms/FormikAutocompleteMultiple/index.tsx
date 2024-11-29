import React, { useMemo, type ReactNode } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
  type AutocompleteProps,
  type TextFieldProps,
} from "@mui/material";
import { useField } from "formik";

import FieldErrorFeedbackFormatter from "components/forms/FieldErrorFeedbackFormatter";
import type { MakeOptional } from "utils/types";

export type AutocompleteOptiontType<T = any> = { label: string; value: T };

interface FormikAutocompleteProps<
  Option extends AutocompleteOptiontType,
  DisableClearable extends boolean | undefined = undefined,
> extends MakeOptional<
    AutocompleteProps<Option, false, DisableClearable, false>,
    "renderInput"
  > {
  name: string;
  label: string | ReactNode;
  helperText?: TextFieldProps["helperText"];
}

const FormikAutocompleteMultiple = <
  Option extends AutocompleteOptiontType,
  DisableClearable extends boolean | undefined = undefined,
>({
  name,
  options,
  label,
  loading,
  size,
  helperText,
  ...rest
}: FormikAutocompleteProps<Option, DisableClearable>) => {
  const [field, meta, helpers] = useField<string[] | null>(name);

  const selectedValues = useMemo(() => {
    if (field.value) {
      return field.value.map((item: string) => {
        const foundItem = options?.find((el) => el.value === item);
        return {
          label: foundItem?.label,
          value: item,
        };
      });
    }
    return [];
  }, [field, options]);

  const unlinkOption = (value: string) => {
    const filteredOptions = field.value?.filter((item) => item !== value);
    helpers.setValue(filteredOptions || []);
  };

  const handleSelect = (value: any) => {
    helpers.setValue(value.map((el: any) => el.value));
  };

  return (
    <Autocomplete
      options={options.filter(
        (el) => !selectedValues.some((el2) => el2.value === el.value),
      )}
      // couldn't satisfy typescript, but 99.9% will work.
      // @ts-expect-error
      value={selectedValues || []}
      filterSelectedOptions
      disableCloseOnSelect
      renderTags={(value) =>
        value.map((option) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              padding: 0.5,
            }}
          >
            <Chip
              label={option.label}
              onDelete={() => unlinkOption(option.value)}
            />
          </Box>
        ))
      }
      onChange={(_e, value) => handleSelect(value)}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label}
            size={size}
            error={meta.touched && !!meta.error}
            helperText={
              meta.touched && meta.error ? (
                <FieldErrorFeedbackFormatter error={meta.error} />
              ) : (
                helperText
              )
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
      {...rest}
      //@ts-expect-error
      multiple
      //@ts-expect-error
      disableClearable
    />
  );
};

export default FormikAutocompleteMultiple;
