import { useCallback } from "react";
import {
  Grid,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { UsePaginationProps } from "@mui/material/usePagination/usePagination";
import type { QueryStatus } from "@tanstack/react-query";
import type {
  UsePaginationInstanceProps,
  UsePaginationState,
} from "react-table";

import AsyncComponent from "components/AsyncComponent/AsyncComponent";

const availablePageLimitOptions = [20, 50, 100, 200] as const;
export type TablePageLimitType = (typeof availablePageLimitOptions)[number];

interface Props<T extends object> {
  status: QueryStatus;
  totalResults?: number;
  pageCount: UsePaginationInstanceProps<T>["pageCount"];
  pageIndex: UsePaginationState<T>["pageIndex"];
  pageSize: UsePaginationState<T>["pageSize"];
  setPageSize: UsePaginationInstanceProps<T>["setPageSize"];
  gotoPage: UsePaginationInstanceProps<T>["gotoPage"];
}

const TablePagination = <T extends object>({
  status,
  totalResults,
  pageCount,
  pageIndex,
  pageSize,
  setPageSize,
  gotoPage,
}: Props<T>) => {
  const handlePaginationChange = useCallback<
    Required<UsePaginationProps>["onChange"]
  >(
    (_event, page) => {
      gotoPage(page - 1);
    },
    [gotoPage],
  );

  return (
    <Grid container sx={{ py: 1, pt: 3 }} alignItems="center">
      <Grid item xs={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Rows per page:</Typography>
          <Select
            variant="standard"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            disableUnderline
            style={{
              marginBottom: "-4px",
            }}
          >
            {availablePageLimitOptions.map((limit) => (
              <MenuItem key={limit} value={limit}>
                {limit}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Grid>

      <Grid item xs={4}>
        <Stack direction="row" justifyContent="center">
          <Pagination
            count={pageCount}
            page={pageIndex + 1}
            onChange={handlePaginationChange}
            showFirstButton
            showLastButton
            sx={{
              ".MuiPaginationItem-page, .MuiPaginationItem-ellipsis": {
                display: "none",
              },
            }}
          />
        </Stack>
      </Grid>

      <Grid item xs={4}>
        <Stack direction="row" justifyContent="flex-end">
          <AsyncComponent
            SkeletonComponent={<Skeleton width={80} variant="rounded" />}
            loading={status === "loading"}
          >
            <>
              {totalResults ? (
                <Typography>
                  {pageIndex * pageSize + 1} -{" "}
                  {Math.min((pageIndex + 1) * pageSize, totalResults)} of{" "}
                  {totalResults}
                </Typography>
              ) : (
                <Typography>No Results</Typography>
              )}
            </>
          </AsyncComponent>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TablePagination;
