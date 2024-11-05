import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'servidorA_db'
});

const testConnection = async () => {
  try {
    await db.getConnection();
    console.log('Conectado a MySQL');
  } catch (error) {
    console.error('Fallo al conectar a MySQL:', error);
  }
};

testConnection();

export default db;