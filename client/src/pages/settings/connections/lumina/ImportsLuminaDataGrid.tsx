import React, { useMemo } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import LuminaIMG from "assets/imgs/connections/lumina.png";

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
        field: "fileName",
        headerName: "File Name",
        flex: 1,
        renderCell: ({ value }) => {
          return (
            // <Stack>
            //   <B
            //   <Typography>{row.sheetId}</Typography>
            // </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                component="img"
                src={LuminaIMG}
                width={40}
                height={20}
                sx={{
                  pb: 0.2,
                  objectFit: "cover",
                }}
              />
              <Link
              // href={`https://app.mindslines.com/learners/${value}`}
              // target="_blank"
              // className="one-line"
              >
                {value}
              </Link>
            </Stack>
          );
        },
      },
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
