import { PrismaClient } from '@prisma/client';
import { ILogger, DatabaseConnectionError } from 'common-services';
import { inject, injectable } from 'inversify';

import TYPES from '../constants/type';

@injectable()
export class DatabaseConnection {
  constructor(
    @inject(TYPES.PrismaClient) private prismaClient: PrismaClient,
    @inject(TYPES.ILogger) private logger: ILogger
  ) { }

  async checkDatabaseConnection() {
    try {
      await this.prismaClient.$connect();
      this.logger.info('Connected to the database')
    } catch (error) {
      throw new DatabaseConnectionError();
    }
  }
}

