import express from 'express';

import jsonRPC from './src/jsonrpc';

const app = express();

app.use(express.json({limit: '10mb'}));

app.use('/', jsonRPC);

// Finish off
module.exports = app;