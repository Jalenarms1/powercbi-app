const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.connect().catch(console.error);

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

client.on('error', (err) => {
    console.error('Redis client error:', err);
});
  
client.on('connect', () => {
    console.log('Redis client connected');
});

const redisAdd = async (key, data) => {
    client.set(key, JSON.stringify(data))
}

const redisGet = async (key) => {
    return JSON.parse(client.get(key))
}

// Example function to execute a query and store results in Redis
async function executeAndStoreQuery(sql, key) {
  const results = await executeQuery(sql); // Implement your query execution logic
  await storeQueryResults(key, results);
}

module.exports = {
    redisAdd,
    redisGet
}
