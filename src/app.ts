import express, { RequestHandler } from 'express';
import fs from 'fs';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { checkSchema } from 'express-validator';
import { NotFoundError, errorHandler, validateRequest } from '@hh-bookstore/common';

import DiContainer from './config/inversify.config';
import { BookController, CategoryController } from './controllers';
import {
  bookPagingValidation,
  bookGetByIdValidation,
  bookCreateValidation,
  bookUpdateValidation,
  bookDeleteValidation,
} from './validations';

const file = fs.readFileSync('openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(express.json() as RequestHandler);
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
  }

  private routes(): void {
    const bookController = DiContainer.resolve<BookController>(BookController);
    const categoryController = DiContainer.resolve<CategoryController>(CategoryController);

    const router = express.Router();

    router.get(
      '/categories',
      categoryController.getCategories.bind(categoryController),
    );
    router.get(
      '/books',
      checkSchema(bookPagingValidation),
      validateRequest,
      bookController.getBookByPagination.bind(bookController),
    );
    router.get(
      '/books/:id',
      checkSchema(bookGetByIdValidation),
      validateRequest,
      bookController.getById.bind(bookController),
    );
    router.post(
      '/books',
      checkSchema(bookCreateValidation),
      validateRequest,
      bookController.createBook.bind(bookController),
    );
    router.put(
      '/books/:id',
      checkSchema(bookUpdateValidation),
      validateRequest,
      bookController.updateBook.bind(bookController),
    );
    router.delete(
      '/books/:id',
      checkSchema(bookDeleteValidation),
      validateRequest,
      bookController.deleteBook.bind(bookController),
    );

    this.express.use('', [router]);
    this.express.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
    this.express.all('*', () => {
      throw new NotFoundError()
    })
    this.express.use(errorHandler);
  }
}

export default new App().express;
