import React, { useMemo } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import GoogleSheetsIMG from "assets/imgs/connections/google-sheets.png";

import { useImportControllerFilterImports } from "api/generated/import/import";
import DataGrid from "components/DataGrid/DataGrid";

const ImportsLuminaDataGrid = () => {
  const { data: imports, isLoading } = useImportControllerFilterImports(
    {
      filter: "type::eq::Lumina",
      limit: -1,
    },
    {
      query: {
        queryKey: ["imports", "lumina"],
      },
    },
  );

  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "sheetId",
        headerName: "Sheet ID",
        flex: 1,
        renderCell: ({ value }) => {
          return (
            // <Stack>
            //   <B
            //   <Typography>{row.sheetId}</Typography>
            // </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src={GoogleSheetsIMG}
                width={20}
                height={20}
                sx={{
                  pb: 0.2,
                  objectFit: "cover",
                }}
              />
              <Link
                href={`https://docs.google.com/spreadsheets/d/${value}`}
                target="_blank"
                className="one-line"
              >
                {value}
              </Link>
            </Stack>
          );
        },
      },
      {
        field: "refetchInterval",
        headerName: "Refetch Interval",
        flex: 1,
      },
      // {
      //   field: "metric",
      //   headerName: "Metric",
      //   flex: 1,
      // },
      // {
      //   field: "skill",
      //   headerName: "Skill",
      //   flex: 1,
      // },
      // {
      //   field: "assessment",
      //   headerName: "Assessment",
      //   flex: 1,
      // },
      //   {
      //     field: "actions",
      //     headerName: "",
      //     width: 100,
      //     align: "right",
      //     renderCell: ({ row }) => (
      //       <ButtonBase
      //         sx={{
      //           border: "1px solid #CBD5E1",
      //           padding: "5px 6px 5px 12px",
      //           borderRadius: "20px",
      //           backgroundColor: "#FFFFFF",
      //           mt: -0.4,
      //         }}
      //         onClick={() => {
      //           openModal("user-edit", {
      //             user: row,
      //           });
      //         }}
      //       >
      //         <Typography fontSize={12} fontWeight={600} color="#535851">
      //           Edit
      //         </Typography>
      //         <ChevronRight
      //           sx={{
      //             fontSize: 16,
      //             color: "#94a3b8",
      //           }}
      //         />
      //       </ButtonBase>
      //     ),
      //   },
    ],
    [],
  );

  return (
    <>
      <DataGrid
        columns={columns}
        loading={isLoading}
        rows={imports?.data || []}
      />

      <Typography
        fontSize={14}
        mt={1.5}
        color="#646C60"
        sx={{
          opacity: 0.5,
        }}
      >
        Showing <b>{imports?.data?.length}</b> of{" "}
        <b>{imports?.meta?.pagination?.totalResults}</b> imports
      </Typography>
    </>
  );
};

export default ImportsLuminaDataGrid;
