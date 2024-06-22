const odbc = require('odbc');
const pool = new odbc.Pool();
const connectionString = process.env.ODBC_CONNECTION_STRING;

async function getConnection() {
  try {
    const connection = await pool.connect(connectionString);
    console.log('Connected to SQL Server using Pool');
    return connection;
  } catch (error) {
    console.error('Database Connection Failed!', error);
    throw error;
  }
}

module.exports = {
  getConnection
};
