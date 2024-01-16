import { PrismaClient } from '@prisma/client';
import { ILogger, DatabaseConnectionError } from '@hh-bookstore/common';
import { inject, injectable } from 'inversify';

import TYPES from '../constants/type';

@injectable()
export class DatabaseServices {
  constructor(
    @inject(TYPES.PrismaClient) private prismaClient: PrismaClient,
    @inject(TYPES.ILogger) private logger: ILogger
  ) { }

  async connection() {
    try {
      await this.prismaClient.$connect();
      this.logger.info('Connected to the database')
    } catch (error) {
      throw new DatabaseConnectionError();
    }
  }
}