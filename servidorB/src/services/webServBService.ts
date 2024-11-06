import { RabbitMqConfig } from 'common/services/rabbitmq';
import { DataModel, IData } from 'common/models/dataModel';

export const getAllData = async (): Promise<IData[]> => {
    const data: IData[] = await DataModel.find();
    return data;
  };

export async function startListening() {
    const rabbitMqConfig = new RabbitMqConfig('amqp://localhost');
    await rabbitMqConfig.connect();
    const channel = rabbitMqConfig.getChannel();

    channel?.consume('mi_cola', async (msg) => {
        if (msg) {
            const messageContent = msg.content.toString();
            console.log(`Recibido: ${messageContent}`);

            try {
                const data: IData = JSON.parse(messageContent);

                console.log('Guardando datos en mongo: ', data);

                const newData = new DataModel(data);
                await newData.save();

                channel.ack(msg);
            } catch (error) {
                console.error('Error al guardar datos o al procesar mensaje:', error);
                channel.nack(msg);
            }
        }
    });

    console.log('Esperando mensajes...');
}