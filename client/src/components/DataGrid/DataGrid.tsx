import React, { type FC } from "react";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";

type DataGridWrapperProps = DataGridProps;

const DataGridWrapper: FC<DataGridWrapperProps> = ({ ...rest }) => {
  return (
    <DataGrid
      {...rest}
      autoHeight
      hideFooter
      disableColumnMenu
      getRowId={(row) => row._id}
      slotProps={{
        loadingOverlay: {
          variant: "linear-progress",
          noRowsVariant: "skeleton",
        },
      }}
      sx={{
        border: "1px solid #E1D7CB",
        borderRadius: "8px",

        // Column
        "& .MuiDataGrid-columnHeaderTitle": {
          color: "#4D4D4D",
          fontSize: 15,
        },
        "& .MuiDataGrid-columnHeader": {
          bgcolor: "#FFF",
        },
        // Row
        "& .MuiDataGrid-row": {
          bgcolor: "#FFF",

          "&:hover": {
            bgcolor: "#F7F7F7",
          },
        },
        // Cell
        "& .MuiDataGrid-cell": {
          color: "#4D4D4D",
          fontSize: 14,
        },
        // Overlay
        "& .MuiDataGrid-overlay": {
          bgcolor: "#FFF",
        },
      }}
    />
  );
};

export default DataGridWrapper;
