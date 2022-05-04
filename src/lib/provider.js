const hethers = require('@hashgraph/hethers');
const config = require('../../config');

module.exports = hethers.getDefaultProvider(config.HEDERA_ETHRPC_PROVIDER);
