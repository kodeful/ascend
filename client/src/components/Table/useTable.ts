import type { TableCellProps } from "@mui/material";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table";

function useTable<TData extends RowData>(
  options: Omit<TableOptions<TData>, "getCoreRowModel">,
) {
  const table = useReactTable({
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    globalFilter: table.getState().globalFilter,
    setGlobalFilter: table.setGlobalFilter,
    columnFilters: table.getState().columnFilters,
    setColumnFilters: table.setColumnFilters,
  };
}

export { useTable };

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: TableCellProps["align"];
  }
}
