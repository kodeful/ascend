import React from "react";
import {
  Skeleton,
  Stack,
  type TableProps as MUITableProps,
  type StackProps,
} from "@mui/material";
import type { QueryStatus } from "@tanstack/react-query";
import { flexRender, type RowData, type Table } from "@tanstack/react-table";

import TablePagination from "components/Table/components/TablePagination";

import TableEmptyMessage from "./components/TableEmptyMessage";
import TableErrorMessage from "./components/TableErrorMessage";

interface SkeletonProps extends StackProps {
  rows: number;
}

interface DefaultTanstackTableProps<TData extends RowData> {
  table: Table<TData>;
  status: QueryStatus;
  enablePagination?: boolean;
  TableProps?: MUITableProps;
  SkeletonProps?: SkeletonProps;
  totalResults?: number;
  rowProps?: (row: any) => StackProps;
}

const DefaultTanstackTable = <TData extends RowData>({
  table,
  status,
  enablePagination = true,
  TableProps,
  SkeletonProps = { rows: 20 },
  totalResults,
  rowProps,
}: DefaultTanstackTableProps<TData>) => {
  // Skeleton Setup
  const { rows: skeletonRows, ...restSkeletonProps } = SkeletonProps;

  return (
    <>
      <Stack
        flex={1}
        height="100%"
        overflow="hidden"
        className="scrollbar-hidden"
      >
        <Stack
          {...TableProps}
          sx={{
            minWidth: "100%",
            ...(TableProps?.sx || {}),
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          flexDirection="column"
          width="max-content"
          flex={1}
          overflow="hidden"
          height="100%"
        >
          {/* Header */}
          <Stack flex={1} bgcolor="grey.200">
            {table.getHeaderGroups().map((headerGroup) => (
              <Stack key={headerGroup.id} direction="row">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  return (
                    <Stack
                      key={header.id}
                      sx={{
                        height: 46,
                        fontWeight: 600,
                        fontSize: 15,
                        border: "none",
                        textAlign: header.column.columnDef.meta?.align,
                        minWidth: header.column.columnDef.minSize ?? "auto",
                        maxWidth: header.column.columnDef.maxSize ?? "auto",
                        width: "100%",
                      }}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      pl={isFirst ? 2 : 0}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            ))}
          </Stack>

          {/* Body */}
          <Stack
            className="table-body scrollbar-hidden"
            direction="column"
            height="100%"
            overflow="scroll"
          >
            {status === "success" &&
              table.getRowModel().rows.map((row) => {
                let additionalProps: StackProps = {};
                if (rowProps) {
                  additionalProps = rowProps(row.original);
                }

                return (
                  <Stack
                    key={row.id}
                    {...additionalProps}
                    sx={{
                      // backgroundColor: "#F8F8F8",
                      // borderRadius: 2,
                      borderBottom: "1px solid #E0E0E0",
                      // mb: 1,
                      justifyContent: "flex-start",
                      ...(additionalProps?.sx || {}),
                    }}
                    role="row"
                    direction="row"
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFirst = index === 0;

                      return (
                        <Stack
                          key={cell.id}
                          role="cell"
                          justifyContent="center"
                          sx={{
                            pr: 2,
                            height: 43,
                            border: "none",
                            textAlign: cell.column.columnDef.meta?.align,
                            minWidth: cell.column.columnDef.minSize ?? "auto",
                            maxWidth: cell.column.columnDef.maxSize ?? "auto",
                            width: "100%",
                          }}
                          pl={isFirst ? 2 : 0}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                );
              })}

            {/**
             * Status: success and empty data -> displays empty message
             */}
            {status === "success" && totalResults === 0 && (
              <TableEmptyMessage />
            )}

            {/**
             * Status: error -> displays error message
             */}
            {status === "error" && <TableErrorMessage />}

            {/**
             * Status: loading -> displays skeletons
             */}
            {status === "loading" &&
              Array.from({ length: skeletonRows }).map((item, index) => (
                <Stack
                  {...restSkeletonProps}
                  key={index}
                  sx={{
                    backgroundColor: "#F8F8F8",
                    borderRadius: 2,
                    mt: 1.5,
                    // mt: index === 0 ? 1 : 0,
                    height: 36,
                    width: "100%",
                    overflow: "hidden",
                    ...(restSkeletonProps?.sx || {}),
                  }}
                  role="row"
                  direction="row"
                >
                  <Skeleton width="100%" height={43} variant="rectangular" />
                </Stack>
              ))}
          </Stack>
        </Stack>
      </Stack>

      {enablePagination && (
        <TablePagination
          status={status}
          gotoPage={table.setPageIndex}
          totalResults={totalResults}
          pageCount={table.getPageCount()}
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          setPageSize={table.setPageSize}
        />
      )}
    </>
  );
};

export default DefaultTanstackTable;
