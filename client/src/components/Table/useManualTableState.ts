import { useCallback, useMemo, useReducer, type Reducer } from "react";
import type {
  ColumnFiltersState,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  SortingState,
  TableState,
} from "@tanstack/react-table";

import type { QueryParamsSortType } from "api/utils";

export type TableStateState = Pick<
  TableState,
  "pagination" | "sorting" | "globalFilter" | "columnFilters"
>;

type TableStateActions =
  | { type: "SET_SORTING"; payload: TableState["sorting"] }
  | {
      type: "UPDATE_SORTING";
      payload: (prev: TableState["sorting"]) => TableState["sorting"];
    }
  | { type: "SET_PAGINATION"; payload: TableState["pagination"] }
  | {
      type: "UPDATE_PAGINATION";
      payload: (prev: TableState["pagination"]) => TableState["pagination"];
    }
  | { type: "SET_GLOBAL_FILTER"; payload: TableState["globalFilter"] }
  | {
      type: "UPDATE_GLOBAL_FILTER";
      payload: (prev: TableState["globalFilter"]) => TableState["globalFilter"];
    }
  | { type: "SET_COLUMN_FILTERS"; payload: TableState["columnFilters"] }
  | {
      type: "UPDATE_COLUMN_FILTERS";
      payload: (
        prev: TableState["columnFilters"],
      ) => TableState["columnFilters"];
    };

export type InitialManualTableStateState = Pick<
  InitialTableState,
  "pagination" | "sorting" | "globalFilter" | "columnFilters"
>;

const defaultInitialTableState: TableStateState = {
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 20 },
  globalFilter: "",
  columnFilters: [],
};

function useManualTableState<T extends Record<string, unknown>>(
  initialState: InitialManualTableStateState | undefined,
) {
  const [tableState, dispatch] = useReducer<
    Reducer<TableStateState, TableStateActions>
  >(tableStateReducer, {
    ...defaultInitialTableState,
    ...initialState,
    pagination: {
      ...defaultInitialTableState.pagination,
      ...initialState?.pagination,
    },
  });

  const transformedSorting = useMemo<QueryParamsSortType<T> | undefined>(() => {
    if (!tableState.sorting) {
      return undefined;
    }

    if (tableState.sorting.length === 0) {
      return undefined;
    }

    return {
      field: tableState.sorting[0].id,
      order: tableState.sorting[0].desc ? "desc" : "asc",
    };
  }, [tableState.sorting]);

  const page = tableState.pagination.pageIndex + 1;
  const limit = tableState.pagination.pageSize;

  const onSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        return dispatch({
          type: "UPDATE_SORTING",
          payload: updaterOrValue,
        });
      }

      return dispatch({ type: "SET_SORTING", payload: updaterOrValue });
    },
    [],
  );

  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        return dispatch({
          type: "UPDATE_PAGINATION",
          payload: updaterOrValue,
        });
      }

      return dispatch({ type: "SET_PAGINATION", payload: updaterOrValue });
    },
    [],
  );

  const onGlobalFilterChange = useCallback<OnChangeFn<string>>(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        return dispatch({
          type: "UPDATE_GLOBAL_FILTER",
          payload: updaterOrValue,
        });
      }

      return dispatch({ type: "SET_GLOBAL_FILTER", payload: updaterOrValue });
    },
    [],
  );

  const onColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        return dispatch({
          type: "UPDATE_COLUMN_FILTERS",
          payload: updaterOrValue,
        });
      }

      return dispatch({ type: "SET_COLUMN_FILTERS", payload: updaterOrValue });
    },
    [],
  );

  return {
    sorting: tableState.sorting,
    onSortingChange,
    pagination: tableState.pagination,
    onPaginationChange,
    globalFilter: tableState.globalFilter,
    onGlobalFilterChange,
    columnFilters: tableState.columnFilters,
    onColumnFiltersChange,

    transformedSorting,
    page,
    limit,
  };
}

export { useManualTableState };

const tableStateReducer = (
  state: TableStateState,
  action: TableStateActions,
) => {
  switch (action.type) {
    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload,
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    case "UPDATE_SORTING":
      return {
        ...state,
        sorting: action.payload(state.sorting),
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      };

    case "UPDATE_PAGINATION":
      return {
        ...state,
        pagination: action.payload(state.pagination),
      };

    case "SET_GLOBAL_FILTER":
      return {
        ...state,
        globalFilter: action.payload,
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    case "UPDATE_GLOBAL_FILTER":
      return {
        ...state,
        globalFilter: action.payload(state.globalFilter),
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    case "SET_COLUMN_FILTERS":
      return {
        ...state,
        columnFilters: action.payload,
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    case "UPDATE_COLUMN_FILTERS":
      return {
        ...state,
        columnFilters: action.payload(state.columnFilters),
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      };

    default:
      return state;
  }
};
