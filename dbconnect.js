const odbc = require('odbc');
const connectionString = process.env.ODBC_CONNECTION_STRING;

async function getConnection() {
  try {
    const connection = await odbc.connect(connectionString);
    console.log('Connected to SQL Server using Pool');
    return connection;
  } catch (error) {
    console.error('Database Connection Failed!', error);
    throw error;
  }
}

const execQuery = async (query) => {

    const connection = await getConnection()
    let resp;
    try {
        resp = await connection.query(query)
        console.log(resp);
        
    } catch (error) {
        console.log(error);
    }

    connection.close()

    return resp
}

module.exports = {
  getConnection,
  execQuery
};
