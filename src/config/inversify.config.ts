import { ILogger, LoggerFactory } from '@hh-bookstore/common';
import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import TYPES from '../constants/type';
import { IBookService, ICategoryService } from '../interfaces';
import { KafkaInstance, ProducerInstance } from '@micro-dev-hub/kafka-event-sourcing';
import {
	BookService,
	CategoryService,
	DatabaseServices
} from '../services'
import config from '.';

const clientId = config.kafkaClientId;
const brokers = config.kafkaBrokers;
const schemaRegistry = config.kafkaSchemaRegistry;

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
DiContainer.bind<ProducerInstance>(TYPES.KafkaProducerServices).toConstantValue(
	new KafkaInstance(clientId, brokers, schemaRegistry).producer()
);

export default DiContainer;
