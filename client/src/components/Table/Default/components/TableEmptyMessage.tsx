import { Stack, Typography } from "@mui/material";

const TableEmptyMessage = () => {
  return (
    <Stack sx={{ py: 10 }}>
      <Typography variant="h5" sx={{ textAlign: "center" }} mb={1}>
        We {"couldn't"} find data that match your query
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Try changing filters or refresh the page
      </Typography>
    </Stack>
  );
};

export default TableEmptyMessage;
