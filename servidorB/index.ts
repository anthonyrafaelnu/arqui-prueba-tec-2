import express, { Application } from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';
import { startListening } from './src/services/webServBService';
import { connectToMongo } from 'common/services/mongodb';

const app: Application = express();
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {

    connectToMongo()
      .then(() => console.log('MongoDB conectado'))
      .catch((error) => console.error('Error al conectar a MongoDB:', error));
      
    await startListening();

    app.listen(PORT, () => {
      console.log(`ServidorB corriendo en puerto: ${PORT}`);
    });
  } catch (error) {
    console.error('Error durante el inicio del servidor:', error);
  }
};

startServer();