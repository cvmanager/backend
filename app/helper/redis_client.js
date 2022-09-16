const { connect } = require('mongoose');
const redis = require('redis');


// async function redis_client() {
    // connect to redis
    const redis_client =  redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

    // await client.on('connect', function () {
    //     console.log('redis client connected');
    // });
    redis_client.on("error", function (err) {
        console.log("Error " + err);
    });

    redis_client.connect();


// }
module.exports = redis_client;

