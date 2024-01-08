import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import TYPES from '../constants/type';
import { ICategoryService } from '../interfaces/category.interface';
import { ICategory } from '../models/category.model';

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.PrismaClient) private prismaClient: PrismaClient) {}

  async getCategories(): Promise<ICategory[]> {
    const categories = await this.prismaClient.categories.findMany();

    return categories;
  }
}
