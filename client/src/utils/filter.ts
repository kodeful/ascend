import { filter as _filter, sortBy as _sortBy } from "lodash";

export type FilterOptions<T> = {
  page?: number;
  limit?: number;
  filter?: (entity: T) => boolean;
  sort?: string[];
};

export function useFilter<T>({
  entitites,
  filter,
}: {
  entitites: T[];
  filter: FilterOptions<T>;
}): T[] {
  const { filter: filterFunc, sort, page, limit } = filter;

  // Filter
  if (filterFunc) {
    entitites = _filter(entitites, filterFunc);
  }

  // Sort
  if (sort) {
    entitites = _sortBy(entitites, sort);
  }

  // Pagination
  if (limit) {
    entitites = entitites.slice((page || 0) * limit, limit);
  }

  return entitites;
}
