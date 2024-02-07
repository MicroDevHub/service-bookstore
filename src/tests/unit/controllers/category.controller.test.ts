import "reflect-metadata";
import { Container } from "inversify";
import { CategoryController } from "../../../controllers";
import TYPES from "../../../constants/type";
import { ICategory } from "../../../models/category.model";
import { ILogger } from "@hh-bookstore/common";
import { Request, Response } from 'express'

const mockCategoriesList = [
  { id: 1, name: 'sport' },
  { id: 2, name: 'drama' },
  { id: 3, name: 'comedy' },
]

describe('CategoryController', () => {
  let container: Container;
  let categoryController: CategoryController;

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(mockCategoriesList),
  }

  const mockLogger = {
    info: jest.fn()
  }

  beforeAll(() => {
    container = new Container();

    container.bind<ILogger>(TYPES.ILogger).toConstantValue(mockLogger as any);

    container.bind<ICategory>(TYPES.ICategoryService).toConstantValue(mockCategoryService as any);

    categoryController = container.resolve<CategoryController>(CategoryController);
  });


  it('getCategories return categories', async() => {
    const mReq: Partial<Request> = {}
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await categoryController.getCategories(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith(mockCategoriesList);
  })
})