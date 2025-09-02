import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import FilePDFIMG from "assets/imgs/files/file-pdf.png";
import { FormattedMessage } from "react-intl";

import { useReportControllerFilterReports } from "api/generated/report/report";
import DataGrid from "components/DataGrid/DataGrid";
import dayjs from "utils/dayjs";

const HomeRecentReportsDataGrid = () => {
  const { data: reports, isLoading } = useReportControllerFilterReports(
    {
      limit: -1,
    },
    {
      query: {
        queryKey: ["reports"],
      },
    },
  );

  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "title",
        headerName: "Title",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        renderCell: ({ value }) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={FilePDFIMG}
              width={20}
              height={20}
              sx={{
                pb: 0.2,
                objectFit: "contain",
              }}
            />
            <Box>{value}</Box>
          </Stack>
        ),
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "Date",
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
        valueFormatter: (value) => dayjs(value).format("DD MMM, YYYY HH:mm"),
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
        loading={isLoading}
        rows={reports?.data || []}
      />

      <Typography
        fontSize={14}
        mt={1.5}
        color="#646C60"
        sx={{
          opacity: 0.5,
        }}
      >
        <FormattedMessage
          id="PAGE.HOME.SHOWING_REPORTS"
          values={{
            count: <b>{reports?.data?.length}</b>,
            total: <b>{reports?.meta?.pagination?.totalResults}</b>,
          }}
        />
      </Typography>
    </>
  );
};

export default HomeRecentReportsDataGrid;
