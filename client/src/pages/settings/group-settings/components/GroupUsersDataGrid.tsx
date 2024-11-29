import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";

import DataGrid from "components/DataGrid/DataGrid";

const GroupUsersDataGrid = () => {
  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "username",
        headerName: "Username",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
      },
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
        field: "role",
        headerName: "Role",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
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
            username: "johndoe",
            name: "John Doe",
            role: "Admin",
            email: "",
          },
          {
            id: 2,
            username: "johndoe",
            name: "John Doe",
            role: "Admin",
            email: "",
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
        Showing <b>8</b> of <b>8</b> users
      </Typography>
    </>
  );
};

export default GroupUsersDataGrid;
