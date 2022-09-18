const { connect } = require('mongoose');
const redis = require('redis');

const redis_client = redis.createClient(
    {
        url: process.env.REDIS_URL,
        legacyMode: true,
    }
);

redis_client.on("error", (err) => console.log("Error " + err))
redis_client.connect();

module.exports = redis_client;

