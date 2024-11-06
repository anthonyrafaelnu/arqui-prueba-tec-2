import { RabbitMqConfig } from 'common/services/rabbitmq';
import { DataMovement, IDataMovement } from 'common/models/dataMovimiento';

export const getDataInRange = async (fromDate: Date | null, toDate: Date | null): Promise<IDataMovement[]> => {
    const query: any = {};

    if (fromDate) {
        query.movementDate = { ...query.movementDate, $gte: fromDate };
    }

    if (toDate) {
        query.movementDate = { ...query.movementDate, $lte: toDate };
    }

    const data: IDataMovement[] = await DataMovement.find(query);
    return data;
};

export const groupByMonth = async (): Promise<any> => {
    const data: any = await DataMovement.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$movementDate' },
                    month: { $month: '$movementDate' }
                },
                amount: { $sum: '$amount' }
            }
        },
        {
            $project: {
                _id: 0,
                yyyymm: {
                    $concat: [
                        { $toString: '$_id.year' },
                        { $cond: { if: { $lt: ['$_id.month', 10] }, then: '0', else: '' } },
                        { $toString: '$_id.month' }
                    ]
                },
                amount: 1
            }
        }
    ]);

    return data;
};

export async function startListening() {
    const rabbitMqConfig = new RabbitMqConfig('amqp://localhost');
    await rabbitMqConfig.connect();
    const channel = rabbitMqConfig.getChannel();

    channel?.consume('movements', async (msg) => {
        if (msg) {
            const messageContent = msg.content.toString();
            console.log(`Recibido: ${messageContent}`);

            try {
                const data: IDataMovement = JSON.parse(messageContent);

                console.log('Guardando datos en mongo: ', data);

                const newData = new DataMovement(data);
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