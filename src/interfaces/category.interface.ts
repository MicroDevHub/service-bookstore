import { ICategory } from '../models/category.model';

export interface ICategoryService {
  getCategories(): Promise<ICategory[]>;
}
