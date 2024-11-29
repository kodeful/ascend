import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";

import DataGrid from "components/DataGrid/DataGrid";

const HomeRecentReportsDataGrid = () => {
  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
      },
      {
        field: "date",
        headerName: "Date",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
      },
      {
        field: "type",
        headerName: "Type",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
      },
    ],
    [],
  );

  return (
    <>
      <DataGrid
        columns={columns}
        rows={[
          {
            id: 1,
            name: "Weekly Group Report ascend",
            date: "27/10/2024",
            type: "Group",
          },
          {
            id: 2,
            name: "Weekly Group Report ascend",
            date: "27/10/2024",
            type: "Group",
          },
        ]}
      />

      <Typography
        fontSize={14}
        mt={1.5}
        color="#646C60"
        sx={{
          opacity: 0.5,
        }}
      >
        Showing <b>8</b> of <b>8</b> reports
      </Typography>
    </>
  );
};

export default HomeRecentReportsDataGrid;
