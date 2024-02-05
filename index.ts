import 'reflect-metadata';
import * as http from 'http';
import { ILogger } from '@hh-bookstore/common';

import App from './src/app';
import DiContainer from './src/config/inversify.config';
import TYPES from './src/constants/type';
import { DatabaseServices } from './src/services/database.service';
import config from './src/config';

const logger = DiContainer.get<ILogger>(TYPES.ILogger);
const database = DiContainer.get<DatabaseServices>(TYPES.DatabaseServices);

export const startService = (async () => {
  try {
    await database.connection();

    App.set('port', config.port);
    const server = http.createServer(App);

    server.listen(config.port, () => {
      logger.info('Server is listening on ' + config.port);
    });
  } catch (err) {
    logger.error(`Service error: ${err}`)
  }
})()
