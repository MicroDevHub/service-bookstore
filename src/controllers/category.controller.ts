import { inject, injectable } from "inversify";
import TYPES from "../constants/type";
import { ICategoryService } from "../interfaces/category.interface";
import { Request, Response, NextFunction } from "express";
import { ICategory } from "../models/category.model";
import { ILogger } from "@hh-bookstore/common";

@injectable()
export class CategoryController {
  constructor(
    @inject(TYPES.ICategoryService) private categoryService: ICategoryService,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories: ICategory[] = await this.categoryService.getCategories();

      this.logger.info('Get Category');
      res.status(200).json(categories);
    } catch (err) {
      this.logger.error(`get categories: ${err}`);
      next(err);
    }
  }
}
