import * as http from 'http';
import 'reflect-metadata';
import App from './src/app';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT || 3080;

App.set('port', port);
const server = http.createServer(App);
const prismaClient = new PrismaClient()

server.listen(port, () => {
  console.log('Server is listening on ' + port);
});
