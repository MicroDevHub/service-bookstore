import { ORDER } from "../../constants/sort-order.enum";

export default interface BaseQueryCriteria {
  search?: string;
  limit: number;
  page: number;
  sortOrder: ORDER;
  sortColumn: string;
}
