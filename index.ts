import * as http from 'http';
import 'reflect-metadata';
import App from './src/app';
import DiContainer from './src/config/inversify.config';
import { ILogger } from '@hh-bookstore/common';
import TYPES from './src/constants/type';
import { DatabaseServices } from './src/services/database.service';

const logger = DiContainer.get<ILogger>(TYPES.ILogger);
const database = DiContainer.get<DatabaseServices>(TYPES.DatabaseServices);

export const startService = (async () => {
  try {
    await database.connection();
    const port = process.env.PORT ?? 3080;

    App.set('port', port);
    const server = http.createServer(App);

    server.listen(port, () => {
      logger.info('Server is listening on ' + port);
    });
  } catch (err) {
    logger.error(`Service error: ${err}`)
  }
})()
