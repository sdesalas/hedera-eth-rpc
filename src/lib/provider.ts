import * as hethers from '@hashgraph/hethers';
import config from '../../config';

console.log('hethers.getDefaultProvider(%s)', config.HEDERA_ETHRPC_NETWORK)

export default hethers.getDefaultProvider(config.HEDERA_ETHRPC_NETWORK);
