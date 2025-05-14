import {
  PaginatedResult,
  PaginationInput,
  PaginationProps,
  QueryResult,
} from '../interfaces';

export class PaginatedService<T> {
  protected paginate(
    queryResult: QueryResult<T>,
    pagination: PaginationInput,
  ): PaginatedResult<T> {
    const { items, totalCount } = queryResult;
    const { page = 1, pageSize = 10 } = pagination;
    const totalPages = Math.ceil(totalCount / pageSize);
    const remainingCount = totalCount - pageSize * page;

    return {
      items: items,
      pageInfo: {
        remainingCount: remainingCount < 1 ? 0 : remainingCount,
        totalCount,
        totalPages,
        pageSize,
        page,
      },
    };
  }

  protected getPaginationProps = ({
    page = 1,
    pageSize = 10,
  }: PaginationInput): PaginationProps => ({
    limit: Number(pageSize),
    offset: Number(page === 1 ? 0 : (page - 1) * pageSize),
  });
}
