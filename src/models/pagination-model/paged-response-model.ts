export interface PagedResponseModel<T> {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
