import React, { useMemo } from "react";
import { ChevronRight } from "@mui/icons-material";
import { ButtonBase, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";

import { useUserControllerFilterUsers } from "api/generated/user/user";
import DataGrid from "components/DataGrid/DataGrid";
import { openModal } from "components/modals/ModalsStore";

const GroupUsersDataGrid = () => {
  const { data: users, isLoading } = useUserControllerFilterUsers(
    {
      limit: -1,
    },
    {
      query: {
        queryKey: ["users"],
      },
    },
  );

  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "username",
        headerName: "Username",
        flex: 1,
      },
      {
        field: "fullName",
        headerName: "Name",
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "",
        width: 100,
        align: "right",
        renderCell: ({ row }) => (
          <ButtonBase
            sx={{
              border: "1px solid #CBD5E1",
              padding: "5px 6px 5px 12px",
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              mt: -0.4,
            }}
            onClick={() => {
              openModal("user-edit", {
                user: row,
              });
            }}
          >
            <Typography fontSize={12} fontWeight={600} color="#535851">
              Edit
            </Typography>
            <ChevronRight
              sx={{
                fontSize: 16,
                color: "#94a3b8",
              }}
            />
          </ButtonBase>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <DataGrid
        columns={columns}
        loading={isLoading}
        rows={users?.data || []}
      />

      <Typography
        fontSize={14}
        mt={1.5}
        color="#646C60"
        sx={{
          opacity: 0.5,
        }}
      >
        Showing <b>{users?.data?.length}</b> of {/* @ts-expect-error */}
        <b>{users?.meta?.pagination?.totalResults}</b> users
      </Typography>
    </>
  );
};

export default GroupUsersDataGrid;
