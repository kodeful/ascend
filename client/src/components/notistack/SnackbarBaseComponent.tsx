import { forwardRef, useCallback, useState } from "react";
import { Close } from "@mui/icons-material";
import { alpha, Box, IconButton, Stack } from "@mui/material";
import dayjs from "dayjs";
import {
  SnackbarContent,
  useSnackbar,
  type CustomContentProps,
} from "notistack";

export interface ISnackbarBaseComponent extends CustomContentProps {
  color: string;
}

// eslint-disable-next-line react/display-name
const SnackbarBaseComponent = forwardRef<
  HTMLDivElement,
  ISnackbarBaseComponent
>(({ id, color, ...props }, ref) => {
  const { message } = props;
  const { closeSnackbar } = useSnackbar();

  const [timeOfEvent] = useState<Date>(new Date());

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <Stack
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: (theme) =>
            `0 10px 30px ${alpha(theme.palette.grey[500], 0.3)}`,

          borderRadius: 1,
          overflow: "hidden",
        }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center">
          <Box sx={{ width: 11, bgcolor: color, minHeight: 50, mr: 1 }}></Box>

          <Box>
            <Box
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.grey[500],
                lineHeight: 1,
              }}
            >
              {dayjs(timeOfEvent).format("MMM DD, HH:mm:ss")}
            </Box>
            <Box sx={{ fontSize: 14, color: "#000" }}>{message}</Box>
          </Box>
        </Stack>

        <IconButton sx={{ ml: 1.5, mr: 0.5 }} onClick={handleDismiss}>
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </SnackbarContent>
  );
});

export default SnackbarBaseComponent;
