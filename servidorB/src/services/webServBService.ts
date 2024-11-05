import { IData } from 'common/models/dataModel';
import { RabbitMqConfig } from 'common/services/rabbitmq';
import { connectToMongo, getMongoDB } from 'common/services/mongodb';

export const getAllData = async (): Promise<IData[]> => {
    const db = getMongoDB();
    const dataCollection = db.collection('data_table');

    const data: IData[] = await dataCollection.find({}).toArray();
    return data;
};

export async function startListening() {
    await connectToMongo('db_datos');

    const rabbitMqConfig = new RabbitMqConfig('amqp://localhost');
    await rabbitMqConfig.connect();
    const channel = rabbitMqConfig.getChannel();

    channel?.consume('mi_cola', async (msg) => {
        if (msg) {
            const messageContent = msg.content.toString();
            console.log(`Recibido: ${messageContent}`);

            const data: IData = JSON.parse(messageContent);
            const db = getMongoDB();
            await db.collection('data_table').insertOne(data);

            channel.ack(msg);
        }
    });

    console.log('Esperando mensajes...');
}