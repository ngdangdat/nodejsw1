var http = require('http');
var fs = require('fs');
var path = require('path');
var files = {};
var port = 9000;
var assets = require('./backend/Assets') 

var app = http.createServer(assets).listen(port, '127.0.0.1');
console.log("Listening on 127.0.0.1: " + port);