import { forwardRef } from "react";
import { InfoOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { SnackbarContent, type CustomContentProps } from "notistack";

export interface ISnackbarBaseComponent extends CustomContentProps {
  color: string;
}

// eslint-disable-next-line react/display-name
const SnackbarBaseComponent = forwardRef<
  HTMLDivElement,
  ISnackbarBaseComponent
>(({ color, ...props }, ref) => {
  const { variant, message } = props;

  return (
    <SnackbarContent ref={ref}>
      <Stack
        sx={{
          // width: "100%",
          width: 400,
          maxWidth: 400,
          backgroundColor: color,
          padding: "20px 18px",

          borderRadius: "10px",
          overflow: "hidden",
          border: "2px solid #FFF",
        }}
        direction="column"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoOutlined sx={{ fontSize: 22, color: "#FFF" }} />
          <Typography fontSize={16} fontWeight={600} color="#FFF">
            {variant === "success" ? "Changes saved" : ""}
            {variant === "error" ? "Error" : ""}
            {variant === "warning" ? "Warning" : ""}
            {variant === "info" ? "Info" : ""}
          </Typography>
        </Stack>
        <Typography ml={3.85} fontSize={12} fontWeight={500} color="#FFF">
          {message}
        </Typography>
      </Stack>
    </SnackbarContent>
  );
});

export default SnackbarBaseComponent;
