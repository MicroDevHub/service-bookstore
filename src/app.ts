import fs from 'fs';

import { NotFoundRoutingError, validateRequest, errorHandler } from 'common-services';
import cors from 'cors';
import express, { RequestHandler } from 'express';
import { checkSchema } from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

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
    this.routes();
    this.middleware();
  }

  private middleware(): void {
    this.express.use(express.json() as RequestHandler);
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
    this.express.use(errorHandler);
  }

  private routes(): void {
    const router = express.Router();

    const bookController = DiContainer.resolve<BookController>(BookController);
    const categoryController = DiContainer.resolve<CategoryController>(CategoryController);

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
      throw new NotFoundRoutingError()
    })
  }
}

export default new App().express;
