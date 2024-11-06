import * as amqp from 'amqplib';

export class RabbitMqConfig {
  private connection: amqp.Connection | undefined;
  private channel: amqp.Channel | undefined;

  constructor(private host: string) { }

  async connect() {
    this.connection = await amqp.connect(this.host);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('movements', { durable: false });
  }

  getChannel() {
    return this.channel;
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}