import * as hethers from '@hashgraph/hethers';

export default {
  'mainnet': hethers.getDefaultProvider('mainnet'),
  'testnet': hethers.getDefaultProvider('testnet')
};
