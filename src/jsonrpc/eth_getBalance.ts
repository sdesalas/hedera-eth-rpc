import provider from '../lib/provider';
import MongoDb from '../lib/mongodb';

export default (network) => {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async (account, block) => {
    console.log('eth_getBalance', account, block);
    try {
      const record = await MongoDb.findOne(network, {_id: account});
      if (record?.accounts?.length) {
        const balance = await p.getBalance(record?.accounts[0]);
        // Hbar has 8 decimals, Eth has 18. Multiply by 10^10.
        return balance.mul(Math.pow(10, 10)).toHexString();
      }
    } catch (err) {}
    return '0x0';
  };
};
