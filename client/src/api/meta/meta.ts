type FilterMetaPagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
};

export type FilterMeta = {
  pagination: FilterMetaPagination;
};
