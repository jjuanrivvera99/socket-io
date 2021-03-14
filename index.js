'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

if (process.env.REDIS_URL) {
    const redisURL = url.parse(process.env.REDIS_URL);
}

const redisPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;

const broadcastPort = process.env.PORT || process.env.BROADCAST_PORT || 5000;

const ioRedis = require('ioredis');
//const redis = new ioRedis(redisPort, redisHost, redisPassword);
const redis = new ioRedis({
    port: redisPort, // Redis port
    host: redisHost, // Redis host
    password: redisPassword,
});

redis.subscribe(['notify-chanel']);

redis.on('message', function (channel, message) {
    message  = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});


server.listen(broadcastPort, function () {
    console.log('Socket server is running on port: ' + broadcastPort);
});