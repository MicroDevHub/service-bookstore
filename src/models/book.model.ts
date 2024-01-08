import { ICategory } from './category.model';
import BaseQueryCriteria from './pagination-model/base-query-criteria';

export interface BookModel {
  id: number;
  title: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  author: string;
  category: ICategory;
}

export interface BookCreateUpdateDto {
  title: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  author: string;
  categoryId: number;
}

export interface BookQueryCriteria extends BaseQueryCriteria {
  categoryId?: number;
}
