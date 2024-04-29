export interface PaginatedCollection<T> {
  items: T[];
  count: number;
  currentPage: number;
  lastPage: number;
  total: number;
}
