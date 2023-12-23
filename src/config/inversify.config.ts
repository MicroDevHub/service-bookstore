import { Container, interfaces } from "inversify";
import { IBookService } from "../interfaces/book.interface";
import TYPES from "../constants/type";
import { BookService } from "../services/book.service";
import { ICategoryService } from "../interfaces/category.interface";
import { CategoryService } from "../services/category.service";
import { ILogger, LoggerFactory } from "@hh-bookstore/common";
import { PrismaClient } from "@prisma/client";

const DiContainer = new Container();

DiContainer.bind<IBookService>(TYPES.IBookService)
    .to(BookService)
    .inRequestScope()
DiContainer.bind<ICategoryService>(TYPES.ICategoryService)
    .to(CategoryService)
    .inRequestScope()
DiContainer.bind<ILogger>(TYPES.ILogger)
    .toDynamicValue((context: interfaces.Context) => { return new LoggerFactory().logger })
DiContainer.bind<PrismaClient>(TYPES.PrismaClient)
    .toDynamicValue((context: interfaces.Context) => { return new PrismaClient() })

export default DiContainer;
