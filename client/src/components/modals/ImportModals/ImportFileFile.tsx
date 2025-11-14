import { useRef, useState, type FC } from "react";
import { InfoOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import * as yup from "yup";

import axiosInstance from "api/axios-instance";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";
import FormikTextField from "components/forms/FormikTextField";

type ImportFileFileProps = {
  handleClose: () => void;
};

const ImportFileFile: FC<ImportFileFileProps> = ({ handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      file: null,
      metric: null,
      skill: "",
      // assessment: null,
    },
    validationSchema: yup.object({
      file: yup.mixed().required(),
      metric: yup.string().nullable().required(),
      skill: yup.string().required(),
      // assessment: yup.string().nullable().required(),
    }),

    onSubmit: async (values) => {
      setIsLoading(true);

      const formData = new FormData();
      // @ts-expect-error
      formData.append("file", values.file);
      formData.append("metric", values.metric as unknown as string);
      formData.append("skill", values.skill);
      // formData.append("assessment", values.assessment as unknown as string);

      await axiosInstance({
        method: "POST",
        url: "/import/file",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.response?.data?.message || "Error", {
            variant: "error",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  const { values, setFieldValue, resetForm } = formik;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFieldValue("file", file);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <InfoOutlined sx={{ fontSize: 18 }} />
        <Typography fontSize={12} color="#60646C">
          You can upload a .CSV .JSON file to add new data
        </Typography>
      </Stack>

      <FormikProvider value={formik}>
        <Form>
          <Typography
            fontSize={14}
            fontWeight={700}
            mb={1.5}
            color="primary.dark"
          >
            Data source
          </Typography>

          {/* <FormikTextField name="spreadsheetLink" label="Spreadsheet link" /> */}

          <Stack direction="row" alignItems="center" overflow="hidden">
            <Box
              component="input"
              name="file"
              type="file"
              style={{ display: "none" }}
              ref={fileRef}
              onChange={handleInputChange}
              accept=".csv, .json"
            />
            <Button
              variant="outlined"
              onClick={() => fileRef.current?.click()}
              sx={{
                borderColor: "#E2E8F0",
                color: "#0F172A",
                fontSize: 14,
                fontWeight: 500,
                minWidth: "fit-content",
                "&:hover": {
                  // borderColor: "#E2E8F0",
                  backgroundColor: "#FFF",
                },
              }}
            >
              Upload file
            </Button>

            <Typography
              className="one-line"
              fontSize={14}
              fontWeight={500}
              color="#0F172A"
              ml={1}
            >
              {/* @ts-expect-error */}
              {values.file?.name || "No File Selected"}
            </Typography>
          </Stack>

          <Typography
            fontSize={14}
            fontWeight={700}
            mb={1.5}
            mt={2}
            color="primary.dark"
          >
            Data info
          </Typography>

          <FormikAutocomplete
            name="metric"
            label="Metric"
            options={valueOptions(["Knowledge", "Confidence", "Application"])}
          />

          <FormikTextField name="skill" label="Skill" />
          {/* 
          <FormikAutocomplete
            name="assessment"
            label="Assessment"
            options={valueOptions([
              "Peer Evaluation",
              "Self-evaluation",
              "Facilitator Evaluation",
            ])}
          /> */}

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFF",
                  color: "#0F172A",
                }}
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={isLoading}
              >
                Import now
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
};

export default ImportFileFile;
