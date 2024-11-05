import express, { Application } from 'express';
import bodyParser from 'body-parser';
import db from '../common/services/mysql';
import routes from './src/routes';
import * as webServAService from './src/services/webServAService';

const app: Application = express();
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await db.getConnection();
    console.log('Conectado a MySQL');

    await webServAService.initializeDatabase();

    app.listen(PORT, () => {
      console.log(`ServidorA corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Fallo al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();