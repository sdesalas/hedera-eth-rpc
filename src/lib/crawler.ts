import config from '../../config';
import axios from 'axios';

export default class Crawler {
  static HEDERA_MIRROR_API_ROOT = (config.HEDERA_ETHRPC_PROVIDER === 'mainnet') ? 
          'https://mainnet-public.mirrornode.hedera.com' : 
          'https://testnet.mirrornode.hedera.com';

  static next;

  static start() {
    console.log(Date.now(), 'Crawler.start()')
    setInterval(Crawler.heartbeat, config.HEDERA_ETHRPC_HEARTBEAT_MS);
  }

  static async heartbeat() {
    console.log(Date.now(), 'Crawler.heartbeat()');
    const url = Crawler.next || `${Crawler.HEDERA_MIRROR_API_ROOT}/api/v1/accounts?limit=1000&order=desc`;
    console.log(`GET ${url}`);
    const response = await axios.get(url);
    console.log(`${response.status} ${response.statusText}`);
    console.log(`${JSON.stringify(response.data)}`);
    if (response.data?.links?.next) {
      Crawler.next = `${Crawler.HEDERA_MIRROR_API_ROOT}${response.data?.links?.next}`;
    }
  }
}
