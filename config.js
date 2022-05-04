const HEDERA_ETHRPC_PORT = process.env.HEDERA_ETHRPC_PORT || 18545;
const HEDERA_ETHRPC_PROVIDER = process.env.HEDERA_ETHRPC_PROVIDER || 'mainnet';
console.log('HEDERA_ETHRPC_PORT=%s', HEDERA_ETHRPC_PORT);
console.log('HEDERA_ETHRPC_PROVIDER=%s', HEDERA_ETHRPC_PROVIDER);

module.exports = {HEDERA_ETHRPC_PORT, HEDERA_ETHRPC_PROVIDER};