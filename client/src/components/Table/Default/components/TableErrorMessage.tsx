import { Stack, Typography } from "@mui/material";

const TableErrorMessage = () => {
  return (
    <Stack sx={{ py: 10 }}>
      <Typography variant="h5" sx={{ textAlign: "center" }} mb={1}>
        Something went wrong
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Try refreshing the page
      </Typography>
    </Stack>
  );
};

export default TableErrorMessage;
