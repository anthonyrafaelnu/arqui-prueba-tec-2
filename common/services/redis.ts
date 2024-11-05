import Redis from 'ioredis';
import Bull from 'bull';

export const redisClient = new Redis();

export const queue = new Bull('dataQueue', {
  redis: { host: 'localhost', port: 6379 }
});

redisClient.on('ready', () => {
  console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
  console.error('Error de conexión de Redis:', err);
});