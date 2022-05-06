import express from 'express';

import jsonRPC from './src/jsonrpc';

const app = express();

app.disable('x-powered-by');
app.use(express.json({limit: '10mb'}));
app.use((req, res, next) => { res.removeHeader('x-content-type-options'); next(); });

app.get('/healthcheck', (req, res) => res.status(200).send('test'));
app.get('/', (req, res) => res.connection.destroy());
app.post('/', jsonRPC);

// Finish off
module.exports = app;