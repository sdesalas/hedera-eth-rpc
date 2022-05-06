import express from 'express';

import jsonRPC from './src/jsonrpc';

const app = express();

app.use(express.json({limit: '10mb'}));

app.get('/healthcheck', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.end());
app.post('/', jsonRPC);

// Finish off
module.exports = app;