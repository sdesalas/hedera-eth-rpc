// const eth_blockNumber = require('./eth_blockNumber');
// const eth_blockNumber = require('./eth_blockNumber');
// const eth_provider = require('./eth_provider');

const items = require('fs').readdirSync(__dirname, {withFileTypes: true});
for (const item of items) {
  if (item.isFile() && item.name !== 'index.js') {
    const method = item.name.split('.').shift();
    console.log('Adding api/%s...', method);
    module.exports[method] = require('./' + item.name);
  }
}

// module.exports = {eth_provider, eth_blockNumber};