import React, { type FC } from "react";
import { ArrowUpward } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useIntl } from "react-intl";
import * as yup from "yup";

import AddCircleIcon from "components/icons/AddCircleIcon";

type ChatInputProps = {
  onSend: (message: string) => Promise<void>;
};

const ChatInput: FC<ChatInputProps> = ({ onSend }) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: yup.object().shape({
      message: yup.string().required(),
    }),
    onSubmit: async ({ message }) => {
      await onSend(message);

      resetForm();
    },
  });

  const { setFieldValue, resetForm } = formik;

  return (
    <FormikProvider value={formik}>
      <Form>
        <Box>
          <Stack
            direction="row"
            width="100%"
            border="1px solid #E1D7CB"
            borderRadius={99}
            mt={1}
            bgcolor="#FAFAFA"
            justifyContent="center"
            alignItems="center"
            py={1.2}
            px={1.5}
            spacing={1}
          >
            <InputBase
              placeholder={intl.formatMessage({ id: "PAGE.CHAT.CHAT_INPUT" })}
              value={formik.values.message}
              onChange={(e) => {
                setFieldValue("message", e.target.value);
              }}
              sx={{
                flex: 1,
                backgroundColor: "transparent",
              }}
            />

            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#F5EFEA",
                "&:hover": {
                  bgcolor: "#E1D7CB",
                },
              }}
              type="submit"
            >
              <ArrowUpward sx={{ color: "#AEAC95" }} />
            </IconButton>
          </Stack>

          <Stack mt={1} alignItems="center">
            <Stack
              height={36}
              border="1px solid #E1D7CB"
              borderRadius={20}
              direction="row"
              alignItems="center"
              px={1}
              component={ButtonBase}
              disabled
            >
              <AddCircleIcon
                sx={{
                  width: 20,
                  height: 20,
                  mr: 0.5,
                  "& path": { stroke: "#B3B3B3" },
                }}
              />
              <Typography fontSize={12} color="#535851" fontWeight={600}>
                {intl.formatMessage({
                  id: "PAGE.CHAT.CHAT_INPUT.ADJUNCT_REPORT",
                })}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default ChatInput;
