import express from 'express';

import jsonRPC from './src/jsonrpc';
import {getAddress, getAccount, cors, count} from './src/api';

const app = express();

app.disable('x-powered-by');
app.use(express.json({limit: '10mb'}));
app.use((req, res, next) => { res.removeHeader('x-content-type-options'); next(); });

// Healthcheck
app.get('/healthcheck', (req, res) => res.status(200).send('OK'));

// API
app.get('/api/mainnet/count', count('mainnet'));
app.options('/api/mainnet/count', cors);
app.get('/api/testnet/count', count('testnet'));
app.options('/api/testnet/count', cors);
app.get('/api/mainnet/address/:address', getAddress('mainnet'));
app.options('/api/mainnet/address/:address', cors);
app.get('/api/testnet/address/:address', getAddress('testnet'));
app.options('/api/testnet/address/:address', cors);
app.get('/api/mainnet/account/:account', getAccount('mainnet'));
app.options('/api/mainnet/account/:account', cors);
app.get('/api/testnet/account/:account', getAccount('testnet'));
app.options('/api/testnet/account/:account', cors);

// RPC
app.post('/rpc/mainnet', jsonRPC('mainnet'));
app.post('/rpc/testnet', jsonRPC('testnet'));

// Kill any other connection
app.use((req, res) => res.connection.destroy());

// Finish off
module.exports = app;