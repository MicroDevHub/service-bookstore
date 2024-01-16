export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
export default interface BaseQueryCriteria {
  search?: string;
  limit: number;
  page: number;
  sortOrder: ORDER;
  sortColumn: string;
}
