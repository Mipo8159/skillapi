export interface IPageInfo {
  remainingCount: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  page: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pageInfo: IPageInfo;
}
