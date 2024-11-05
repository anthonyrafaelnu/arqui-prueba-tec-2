import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let database: any;

export const connectToMongo = async (dbName: string) => {
  if (!database) {
    await client.connect();
    database = client.db(dbName);
  }
  return database;
};

export const getMongoDB = () => {
  if (!database) {
    throw new Error('MongoDB no está conectado. Llama a connectToMongo primero.');
  }
  return database;
};