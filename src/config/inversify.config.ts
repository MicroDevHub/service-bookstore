import { PrismaClient } from '@prisma/client';
import { ILogger, LoggerFactory } from 'common-services';
import { Container } from 'inversify';

import TYPES from '../constants/type';
import { IBookService } from '../interfaces/book.interface';
import { ICategoryService } from '../interfaces/category.interface';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';
import { DatabaseConnection } from '../utils/database-connection';

const DiContainer = new Container();

DiContainer.bind<IBookService>(TYPES.IBookService)
  .to(BookService)
  .inRequestScope();
DiContainer.bind<ICategoryService>(TYPES.ICategoryService)
  .to(CategoryService)
  .inRequestScope();
DiContainer.bind<ILogger>(TYPES.ILogger).toDynamicValue(
  () => {
    return new LoggerFactory().logger;
  },
);
DiContainer.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(
  () => {
    return new PrismaClient();
  },
);
// DiContainer.bind<DatabaseConnection>(TYPES.DatabaseConnection).toSelf().inSingletonScope();
DiContainer.bind<DatabaseConnection>(TYPES.DatabaseConnection).to(DatabaseConnection).inSingletonScope();

export default DiContainer;
