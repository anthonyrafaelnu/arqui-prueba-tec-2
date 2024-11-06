import db from 'common/services/mysql';
import { redisClient } from 'common/services/redis';
import { RabbitMqConfig } from 'common/services/rabbitmq';

export const initializeDatabase = async (): Promise<void> => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS data_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            User VARCHAR(255),
            Edad INT
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS auth_table (
            authNumber VARCHAR(255) PRIMARY KEY
            );
        `);
    } catch (error) {
        console.error('Error inicializando base de datos:', error);
    }
};

export const saveData = async (data: any): Promise<void> => {
    await db.query('INSERT INTO data_table SET ?', data);
    await publishMessage(data);
};

export const saveAuth = async (authNumber: string): Promise<void> => {
    await redisClient.set(`auth:${authNumber}`, 'true');
    await db.query('INSERT INTO auth_table (authNumber) VALUES (?)', [authNumber]);
};

export const getAuth = async (authNumber: string): Promise<boolean> => {
  const cachedAuth = await redisClient.get(`auth:${authNumber}`);
  if (cachedAuth) {
    console.log('Autorización encontrada en caché');
    return true;
  }

  const [rows]: any[] = await db.query('SELECT * FROM auth_table WHERE authNumber = ?', [authNumber]);

  if (rows.length > 0) {
    await redisClient.set(`auth:${authNumber}`, 'true');
    return true;
  }

  return false;
};

async function publishMessage(message: any) {
    const rabbitMqConfig = new RabbitMqConfig('amqp://localhost');
    await rabbitMqConfig.connect();
    const channel = rabbitMqConfig.getChannel();

    const messageString = JSON.stringify(message);

    channel?.sendToQueue('mi_cola', Buffer.from(messageString));
    console.log(`Mensaje enviado: ${messageString}`);

    await rabbitMqConfig.close();
}