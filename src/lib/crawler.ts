import config from '../../config';
import MongoDb from './mongodb';
import { toEthAddress } from './utils';
import axios from 'axios';

export default class Crawler {
  static HEDERA_MIRROR_API_ROOT = (config.HEDERA_ETHRPC_NETWORK === 'mainnet') ? 
          'https://mainnet-public.mirrornode.hedera.com' : 
          'https://testnet.mirrornode.hedera.com';

  static nextUrl;

  static startUrl = `${Crawler.HEDERA_MIRROR_API_ROOT}/api/v1/accounts?balance=false&limit=100&order=desc`;

  static start() {
    console.log(Date.now(), 'Crawler.start()')
    setInterval(Crawler.heartbeat, config.HEDERA_ETHRPC_HEARTBEAT_MS);
  }

  static async heartbeat() {
    console.log(Date.now(), 'Crawler.heartbeat()');
    const url = Crawler.nextUrl || Crawler.startUrl;
    console.log(`GET ${url}`);
    const response = await axios.get(url);
    console.log(`${response.status} ${response.statusText}`);
    console.log(`${JSON.stringify(response.data)}`);
    const accounts = response.data?.accounts;
    if (Array.isArray(accounts)) {
      const items = [];
      for(const a of accounts) {
        if (a?.key?.key) {
          const _id = toEthAddress('0x' + a.key.key);
          const key = a.key.key;
          const type = a.key._type;
          const item = {_id, key, type, accounts: {$concatArrays: [{$ifNull: ["$accounts", []]}, {$cond: {if: {$in: [a.account, {$ifNull: ["$accounts", []]}]}, then: [], else: [a.account]}}]}};
          // const item = {_id, key, type, accounts: {$addToSet: a.account}};
          console.log('item', item);
          items.push(item);
        }
      }
      const connection = await MongoDb.connect();
      try {
        const c = await connection.db(config.MONGODB_DB).collection(config.HEDERA_ETHRPC_NETWORK);
        const ops = items.map(item => ({ updateOne: { filter: { _id: item._id }, update: [{ $set: item }], upsert: true}}));
        const docs = await c.bulkWrite(ops, {ordered: false});
        console.log('bulkWrite() upserted #', docs.nUpserted);
        console.log('bulkWrite() matched #', docs.nMatched);
        console.log('bulkWrite() modified #', docs.nModified);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
    // Pick next url or start over
    const next = response.data?.links?.next;
    Crawler.nextUrl = (next) ? `${Crawler.HEDERA_MIRROR_API_ROOT}${next}`: Crawler.startUrl;
  }
}
