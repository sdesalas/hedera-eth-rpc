import express from 'express';

import jsonRPC from './src/jsonrpc';
import {getAddress, cors} from './src/api';

const app = express();

app.disable('x-powered-by');
app.use(express.json({limit: '10mb'}));
app.use((req, res, next) => { res.removeHeader('x-content-type-options'); next(); });

// Healthcheck
app.get('/healthcheck', (req, res) => res.status(200).send('OK'));

// API
app.get('/api/mainnet/address/:address', getAddress('mainnet'));
app.options('/api/mainnet/address/:address', cors);
app.get('/api/testnet/address/:address', getAddress('testnet'));
app.options('/api/testnet/address/:address', cors);

// RPC
app.post('/rpc/mainnet', jsonRPC('mainnet'));
app.post('/rpc/testnet', jsonRPC('testnet'));

// Kill any other connection
app.use((req, res) => res.connection.destroy());

// Finish off
module.exports = app;