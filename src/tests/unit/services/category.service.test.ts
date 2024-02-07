import "reflect-metadata";
import { Container } from "inversify"
import { PrismaClient } from "@prisma/client";
import { CategoryService } from "../../../services";
import TYPES from "../../../constants/type";
import { ICategoryService } from "../../../interfaces";

const mockCategoriesList = [
  { id: 1, name: 'sport' },
  { id: 2, name: 'drama' },
  { id: 3, name: 'comedy' },
]

describe('CategoryService', () => {
  let container: Container;
  let categoryService: CategoryService;

  const mockPrismaClient = {
    categories: {
      findMany: jest.fn().mockResolvedValue(mockCategoriesList),
    },
  }

  beforeAll(() => {
    container = new Container();

    container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(mockPrismaClient as any);

    categoryService = container.resolve<CategoryService>(CategoryService);
  });


  it('getCategories return categories', async() => {
    const categories = await categoryService.getCategories();

    expect(categories).toEqual(mockCategoriesList);
  })
})