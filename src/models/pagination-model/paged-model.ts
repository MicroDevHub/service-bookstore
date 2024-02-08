export interface PageModel<T> {
  maxPageSize: number;
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
