import * as http from 'http';
import 'reflect-metadata';
import App from './src/app';
import DiContainer from './src/config/inversify.config';
import { ILogger } from 'common-services';
import TYPES from './src/constants/type';
import { DatabaseConnection } from './src/utils/database-connection';


const logger = DiContainer.get<ILogger>(TYPES.ILogger);
const database = DiContainer.get<DatabaseConnection>(TYPES.DatabaseConnection);

export const startService = async () => {
  try {
    await database.checkDatabaseConnection();
    const port = process.env.PORT ?? 3080;

    App.set('port', port);
    const server = http.createServer(App);
    
    server.listen(port, () => {
      logger.info('Server is listening on ' + port);
    });
  } catch (err) {
    logger.error(`Service error: ${err}`)
  }
}

startService()
