import config from '../../config';
import MongoDb from './mongodb';
import { toEthAddress } from './utils';
import axios from 'axios';

const HEDERA_MIRROR_API_ROOT = {
  mainnet: 'https://mainnet-public.mirrornode.hedera.com',
  testnet: 'https://testnet.mirrornode.hedera.com'
 };

export default class Crawler {
  constructor(network:string) {
    console.log('%s new Crawler(%s)', Date.now(), network);
    if (!Object.keys(HEDERA_MIRROR_API_ROOT).includes(network)) {
      throw new Error('Network unavailable: ' + network);
    } else {
      this.network = network;
    }
  }

  network = 'mainnet';
  nextUrl;
  startUrl = `/api/v1/accounts?balance=false&limit=100&order=desc&account.id=lt:0.0.490986`;

  start() {
    console.log('%s Crawler.start()', Date.now());
    setInterval(() => this.heartbeat(), config.HEDERA_ETHRPC_HEARTBEAT_MS);
  }

  async heartbeat() {
    console.log('%s Crawler.heartbeat()', Date.now());
    const apiRoot = HEDERA_MIRROR_API_ROOT[this.network];
    const url = this.nextUrl || this.startUrl;
    try {
      console.log(`GET ${apiRoot}${url}`);
      const response = await axios.get(`${apiRoot}${url}`);
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
        // Bulk insert
        const connection = await MongoDb.connect();
        const c = await connection.db(config.MONGODB_DB).collection(this.network);
        const ops = items.map(item => ({ updateOne: { filter: { _id: item._id }, update: [{ $set: item }], upsert: true}}));
        const docs = await c.bulkWrite(ops, {ordered: false});
        console.log('bulkWrite() upserted #', docs.nUpserted);
        console.log('bulkWrite() matched #', docs.nMatched);
        console.log('bulkWrite() modified #', docs.nModified);
      }
      // Pick next url or start over (only if everything went ok)
      const next = response.data?.links?.next;
      this.nextUrl = (next) ? next: this.startUrl;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
