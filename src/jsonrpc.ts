import path from 'path';
import fs from 'fs';

const hide_methods = ['net_version'];

// Initialize ETH JSON-RPC APIs
const methods = {};
setTimeout(() => {
  for (const item of fs.readdirSync(path.join(__dirname, 'jsonrpc'), {withFileTypes: true})) {
    if (item.isFile() && item.name.split('.').pop() === 'ts') {
      const method = item.name.split('.').shift();
      console.log('Adding api/%s...', method);
      methods[method] = require('./jsonrpc/' + item.name).default;
    }
  }
}, 0);

export default (network) => {
  return async (req, res) => {
    console.log('%s %s', req.method, req.originalUrl);
    const {jsonrpc, id, method, params} = req?.body || {};
    // Invalid request
    if (req.method !== 'POST' || !id || !method || jsonrpc !== '2.0') {
      res.writeHead(400);
      res.status(400).send({jsonrpc, error: {code: -32600, message: 'Invalid Request'}, id});
      return;
    }
    if (!hide_methods.includes(method)) {
      console.log(req.body);
    }
    try {
      let response;
      if (method in methods) {
        response = {jsonrpc, id, result: await methods[method](network)(...params)};
      } else {
        response = {jsonrpc, id, error: {code: -32601, message: 'method not found: ' + method}};
      }
      if (!hide_methods.includes(method)) console.log(response);
      return res.send(response);
    } catch (err) {
      return res.send({jsonrpc, id, error: {code: -32700, message: String(err)}});
    }
  }
}
