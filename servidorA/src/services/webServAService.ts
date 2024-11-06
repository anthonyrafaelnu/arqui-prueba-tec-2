import db from 'common/services/mysql';
import { redisClient } from 'common/services/redis';
import { RabbitMqConfig } from 'common/services/rabbitmq';
import { ICreateMovement, IMovement } from '../../interfaces/IMovement';

export const initializeDatabase = async (): Promise<void> => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS movimientos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            authorizationNumber VARCHAR(255),
            movementDate DATE,
            accountFrom VARCHAR(255),
            accountTo VARCHAR(255),
            destinationBank VARCHAR(255),
            currency VARCHAR(255),
            amount DECIMAL(10, 2)
            );
        `);
    } catch (error) {
        console.error('Error inicializando base de datos:', error);
    }
};

export const saveData = async (data: ICreateMovement): Promise<void> => {
    if (validateEmptyData(data) === false) {
        throw new Error('Datos incompletos');
    }

    await db.query('INSERT INTO movimientos SET ?', data);
    await publishMessage(data);
};

export const getData = async (authNumber: string): Promise<IMovement> => {
    const cachedAuth = await redisClient.get(`auth:${authNumber}`);
    if (cachedAuth) {
        console.log('Autorización encontrada en caché');
        let json = JSON.parse(cachedAuth);
        json.status = 'Obtenido en caché';

        return json;
    }

    const [rows]: any[] = await db.query('SELECT * FROM movimientos WHERE authorizationNumber = ?', [authNumber]);

    if (rows.length > 0) {
        await redisClient.set(`auth:${authNumber}`, JSON.stringify(rows[0]));
        let json = rows[0];
        json.status = 'Obtenido de base de datos';
        return json;
    } else {
        throw new Error('No se encontró el movimiento');
    }
};

async function publishMessage(message: ICreateMovement) {
    const rabbitMqConfig = new RabbitMqConfig('amqp://localhost');
    await rabbitMqConfig.connect();
    const channel = rabbitMqConfig.getChannel();

    const messageString = JSON.stringify(message);

    channel?.sendToQueue('movements', Buffer.from(messageString));
    console.log(`Mensaje enviado: ${messageString}`);

    await rabbitMqConfig.close();
}

function validateEmptyData(data: ICreateMovement): boolean {
    if (data.authorizationNumber === '' || data.movementDate === null || data.accountFrom === ''
        || data.accountTo === '' || data.destinationBank === '' || data.currency === ''
        || data.amount === 0) {
        return false;
    }
    return true;
}