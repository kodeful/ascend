import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import FilePDFIMG from "assets/imgs/files/file-pdf.png";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { useReportControllerFilterReports } from "api/generated/report/report";
import DataGrid from "components/DataGrid/DataGrid";
import { useLanguageStore } from "components/stores/LanguageStore";
import dayjs from "utils/dayjs";

const HomeRecentReportsDataGrid = () => {
  const history = useHistory();

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
  const intl = useIntl();
  const currentLanguage = useLanguageStore((s) => s.language);

  const columns = useMemo<GridColDef<any, any>[]>(
    () => [
      {
        field: "title",
        headerName: intl.formatMessage({
          id: "PAGE.HOME.RECENT_REPORTS_TITLE",
        }),
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
        headerName: intl.formatMessage({
          id: "PAGE.HOME.RECENT_REPORTS_DATE",
        }),
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
        valueFormatter: (value) => {
          const formatted = dayjs(value)
            .locale(currentLanguage)
            .format("DD MMM, YYYY HH:mm");
          if (currentLanguage === "es") {
            return formatted.replace(
              /(\d{2} )([a-z])/,
              (match, day, firstLetter) => day + firstLetter.toUpperCase(),
            );
          }
          return formatted;
        },
      },
      {
        field: "type",
        headerName: intl.formatMessage({
          id: "PAGE.HOME.RECENT_REPORTS_TYPE",
        }),
        // headerAlign: "center",
        // type: "boolean",
        // width: 120,
        // editable: true,
        flex: 1,
        valueFormatter: (value) => {
          if (value === "Group Report") {
            return intl.formatMessage({
              id: "PAGE.HOME.RECENT_REPORTS_TYPE_GROUP",
            });
          }
          if (value === "Individual Report") {
            return intl.formatMessage({
              id: "PAGE.HOME.RECENT_REPORTS_TYPE_INDIVIDUAL",
            });
          }
          return value;
        },
      },
    ],
    [intl, currentLanguage],
  );

  return (
    <>
      <DataGrid
        columns={columns}
        loading={isLoading}
        rows={reports?.data || []}
        onRowClick={({ row }) => {
          history.push(`/report/${row._id}`);
        }}
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
