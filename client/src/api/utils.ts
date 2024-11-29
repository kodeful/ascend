import type { AxiosResponse } from "axios";

import { isEmptyObject } from "../utils/isEmptyObject";
import type { FilterMeta } from "./meta/meta";

export type APICall<T> = Promise<AxiosResponse<T>>;

export type PaginationMeta = {
  currentPage: number;
  nextPageUrl: string;
  pageSize: number;
  previousPageUrl: string;
  totalPages: number;
  totalResults: number;
};

export type Paginated<T> = {
  data: T;
  meta: FilterMeta;
};

export type QueryParamsSortType<T = Record<string, unknown>> = {
  field: keyof T;
  order: "asc" | "desc";
};

export type QueryParamsSingleFilterType<T = Record<string, unknown>> = {
  field: keyof T;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "regex";
  value: boolean | string | null;
};

export type QueryParamsType<T = Record<string, unknown>> = {
  sort?: QueryParamsSortType<T>;
  filter?: (QueryParamsSingleFilterType<T> | string)[] | null;
  page?: number;
  limit?: number;
  [key: string]: unknown;
};

const parseParams = <T>(object: QueryParamsType<T>) => {
  const queryParams = new URLSearchParams();
  Object.entries(object).forEach(([key, value]) => {
    if (key === "sort") {
      const sortValue = value as QueryParamsType["sort"];
      if (sortValue) {
        const parsedSort = `${sortValue.field}::${sortValue.order}`;
        queryParams.append("sort", parsedSort);
      }
      return;
    }

    if (key === "filter") {
      const filterValue = value as QueryParamsType["filter"];
      if (filterValue?.length) {
        const parsedFilter = filterValue
          .map((stringOrObject) => {
            if (typeof stringOrObject === "string") {
              return stringOrObject;
            } else {
              return `${stringOrObject.field}::${stringOrObject.operator}::${stringOrObject.value}`;
            }
          })
          .join(",");
        queryParams.append("filter", parsedFilter);
      }
      return;
    }

    if (value) {
      const otherParamValue = value as string | number;
      queryParams.append(key, otherParamValue.toString());
      return;
    }
  });

  return queryParams;
};

export const normalizeQueryParams = <T>(object?: QueryParamsType<T>) => {
  if (!object) {
    return "";
  }
  if (isEmptyObject(object)) {
    return "";
  }
  return `?${new URLSearchParams(parseParams(object)).toString()}`;
};
