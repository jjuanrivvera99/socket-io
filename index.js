'use strict';

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('dotenv').config();

var redisPort = process.env.REDIS_PORT;
var redisHost = process.env.REDIS_HOST;
var redisPassword = process.env.REDIS_PASSWORD;

var ioRedis = require('ioredis');
//var redis = new ioRedis(redisPort, redisHost, redisPassword);
var redis = new ioRedis({
    port: redisPort, // Redis port
    host: redisHost, // Redis host
    password: redisPassword,
});

redis.subscribe(['notify-chanel']);

redis.on('message', function (channel, message) {
    message  = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});

var broadcastPort = process.env.PORT || process.env.BROADCAST_PORT || 5000;

server.listen(broadcastPort, function () {
    console.log('Socket server is running.');
});