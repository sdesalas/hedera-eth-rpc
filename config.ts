import dotenv from 'dotenv';
import {obfuscate} from './src/lib/utils';

dotenv.config();

const HEDERA_ETHRPC_PORT = process.env.HEDERA_ETHRPC_PORT || 58545;
const HEDERA_ETHRPC_PROVIDER = process.env.HEDERA_ETHRPC_PROVIDER || 'mainnet';
const HEDERA_ETHRPC_HEARTBEAT_MS = Number(process.env.HEDERA_ETHRPC_HEARTBEAT_MS) || 5000;
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_USER = process.env.MONGODB_USER || 'admin';
const MONGODB_PASS = process.env.MONGODB_PASS || 'pass';
const MONGODB_DB = process.env.MONGODB_DB || 'hedera-eth';

console.log('HEDERA_ETHRPC_PORT=%s', HEDERA_ETHRPC_PORT);
console.log('HEDERA_ETHRPC_PROVIDER=%s', HEDERA_ETHRPC_PROVIDER);
console.log('HEDERA_ETHRPC_HEARTBEAT_MS=%s', HEDERA_ETHRPC_HEARTBEAT_MS);
console.log('MONGODB_HOST=%s', MONGODB_HOST);
console.log('MONGODB_DB=%s', MONGODB_DB);
console.log('MONGODB_USER=%s', MONGODB_USER);
console.log('MONGODB_PASS=%s', obfuscate(MONGODB_PASS));

export default {
  HEDERA_ETHRPC_PORT, 
  HEDERA_ETHRPC_PROVIDER, 
  HEDERA_ETHRPC_HEARTBEAT_MS,
  MONGODB_HOST,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_DB
};
