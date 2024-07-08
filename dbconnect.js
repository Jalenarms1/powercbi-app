const sql = require("msnodesqlv8")

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



async function execQuery(query) {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            reject(err);
        } else {
            resolve(rows);
        }
    });
  });
}

const CONTAINER_TABLE = 'PowerCBIContainer'
const REPORT_TABLE = 'PowerCBIReport'
const JOB_TABLE = 'PowerCBIReportJob'
const SHEET_TABLE = 'PowerCBIDataSheet'

module.exports = {
  getConnection,
  execQuery,
  CONTAINER_TABLE,
  REPORT_TABLE,
  JOB_TABLE,
  SHEET_TABLE
};
