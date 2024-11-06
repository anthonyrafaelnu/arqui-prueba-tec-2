import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/db_datos';

export const connectToMongo = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB con Mongoose');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    throw error;
  }
};