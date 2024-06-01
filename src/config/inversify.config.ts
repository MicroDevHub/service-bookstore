import { ILogger, LoggerFactory } from '@hh-bookstore/common';
import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import TYPES from '../constants/type';
import { IBookService, ICategoryService } from '../interfaces';
import {
	BookService,
	CategoryService,
	DatabaseServices
} from '../services'

const DiContainer = new Container();

DiContainer.bind<IBookService>(TYPES.IBookService)
	.to(BookService)
	.inRequestScope();
DiContainer.bind<ICategoryService>(TYPES.ICategoryService)
	.to(CategoryService)
	.inRequestScope();
DiContainer.bind<DatabaseServices>(TYPES.DatabaseServices)
	.to(DatabaseServices)
	.inSingletonScope();

DiContainer.bind<ILogger>(TYPES.ILogger).toConstantValue(
	new LoggerFactory().logger
);
DiContainer.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(
	new PrismaClient()
);

export default DiContainer;
