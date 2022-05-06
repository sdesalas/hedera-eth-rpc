import config from '../../config';
import axios from 'axios';

export default class Crawler {
  static HEDERA_MIRROR_API_URL = (config.HEDERA_ETHRPC_PROVIDER === 'mainnet') ? 
          'https://mainnet-public.mirrornode.hedera.com/api/v1' : 
          'https://testnet.mirrornode.hedera.com/api/v1';

  static start() {
    window.setInterval(Crawler.heartbeat, config.HEDERA_ETHRPC_HEARTBEAT_MS);
  }

  static async heartbeat() {
    axios.get(`${Crawler.HEDERA_MIRROR_API_URL}/accounts?limit=1000&order=desc`);
  }
}
