import express from 'express';
import cors from 'cors';
import cache from 'cache-middleware-express';
import jsonRPC from './src/jsonrpc';
import {getAddress, getAccount, count} from './src/api';

const app = express();

app.disable('x-powered-by');
app.use(express.json({limit: '10mb'}));
app.use((req, res, next) => { res.removeHeader('x-content-type-options'); next(); });

// Healthcheck
app.get('/healthcheck', (req, res) => res.status(200).send('OK'));

// API
app.get('/api/count', cors(), cache(15), count());
app.get('/api/mainnet/count', cors(), cache(15), count('mainnet'));
app.get('/api/testnet/count', cors(), cache(15), count('testnet'));
app.get('/api/mainnet/address/:address', cors(), cache(30), getAddress('mainnet'));
app.get('/api/testnet/address/:address', cors(), cache(30), getAddress('testnet'));
app.get('/api/mainnet/account/:account', cors(), cache(30), getAccount('mainnet'));
app.get('/api/testnet/account/:account', cors(), cache(30), getAccount('testnet'));

// RPC
app.post('/rpc/mainnet', jsonRPC('mainnet'));
app.post('/rpc/testnet', jsonRPC('testnet'));

// Kill any other connection
app.use((req, res) => res.connection.destroy());

// Finish off
module.exports = app;