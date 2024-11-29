import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { TableState } from "@tanstack/react-table";
import { isNil as _isNil, omitBy as _omitBy } from "lodash";

import type { FilterMeta } from "api/meta/meta";
import type { Paginated, QueryParamsType } from "api/utils";
import { useDebounce } from "utils/hooks/useDebounce";

import {
  useManualTableState,
  type InitialManualTableStateState,
} from "./useManualTableState";

export type ManualTableFiltersGetter = (
  columnFilters: TableState["columnFilters"],
) => QueryParamsType | undefined;

interface useManualTableLogicProps<T extends Record<string, unknown>> {
  queryKey: QueryKey;
  queryFn: (
    params?: any,
    signal?: AbortSignal,
  ) => Promise<{ data: any[]; meta: FilterMeta }>;
  options?: Omit<UseQueryOptions<Paginated<T[]>>, "queryKey" | "queryFn">;
  initialState?: InitialManualTableStateState;
  getFilters?: ManualTableFiltersGetter;
}

function useManualTableLogic<T extends Record<string, unknown>>({
  queryKey,
  queryFn,
  options,
  initialState,
  getFilters,
}: useManualTableLogicProps<T>) {
  const {
    sorting,
    onSortingChange,
    transformedSorting,
    pagination,
    onPaginationChange,
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    page,
    limit,
  } = useManualTableState(initialState);

  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  const parseFilter = (queryFilter: QueryParamsType) => {
    const { filter, limit, page, sort } = queryFilter;
    return _omitBy(
      {
        limit,
        page,
        sort: sort && `${sort.order === "desc" ? "-" : ""}${sort.field}`,
        filter: filter
          ?.map((filterItem) => {
            //@ts-expect-error
            return `${filterItem.field}::${filterItem.operator}::${filterItem.value}`;
          })
          .join(";"),
      },
      _isNil,
    );
  };

  const { data, status } = useQuery(
    [
      ...queryKey,
      {
        sort: transformedSorting,
        page,
        limit,
        q: debouncedGlobalFilter || undefined,
        ...(getFilters && parseFilter(getFilters(columnFilters)!)),
      },
    ],
    async () => {
      const res = await queryFn({
        sort: transformedSorting,
        page,
        limit,
        q: debouncedGlobalFilter || undefined,
        ...(getFilters && parseFilter(getFilters(columnFilters)!)),
      });

      return res;
    },
    options as any,
  );

  return {
    data: data?.data || [],
    status,
    state: { globalFilter, sorting, pagination, columnFilters },
    manualSorting: true,
    onSortingChange: onSortingChange,
    manualPagination: true,
    onPaginationChange: onPaginationChange,
    pageCount: data?.meta.pagination.totalPages,
    totalResults: data?.meta.pagination.totalResults,
    manualFiltering: true,
    onGlobalFilterChange,
    onColumnFiltersChange,
  };
}

export { useManualTableLogic };
