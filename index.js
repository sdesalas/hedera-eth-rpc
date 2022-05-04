const express = require('express');
const http = require('http');
const app = express();
const jsonrpc = require('./src/jsonrpc');
const config = require('./config');

app.set('port', config.HEDERA_ETHRPC_PORT);
app.use(express.json({limit: '10mb'}));
app.use(jsonrpc);

// Initialise
const server = http.createServer(app);
server.on('listening', function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
});
server.listen(config.HEDERA_ETHRPC_PORT);
