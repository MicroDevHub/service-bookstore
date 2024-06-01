import { inject, injectable } from "inversify";
import { ICategoryService } from "../interfaces/category.interface";
import { ICategory } from "../models/category.model";
import { PrismaClient } from "@prisma/client";
import TYPES from "../constants/type";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.PrismaClient) private prismaClient: PrismaClient,
  ) { }
	
  /**
   * @description Get all categories of book
   * @returns {Promise<ICategory[]>}
   */
  async getCategories(): Promise<ICategory[]> {
    const categories = await this.prismaClient.categories.findMany();

    return categories;
  }
}
