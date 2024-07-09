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

// client.on('error', (err) => {
//     console.error('Redis client error:', err);
// });
  
// client.on('connect', () => {
//     console.log('Redis client connected');
// });

const redisAdd = async (key, data) => {
  await client.set(key, JSON.stringify(data))
}

const redisGet = async (key) => {
    let data = await client.get(key)
    return JSON.parse(data)
}

const redisDel = (key) => {
  client.del(key)
}


module.exports = {
    redisAdd,
    redisGet,
    redisDel
}
