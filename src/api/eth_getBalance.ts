import provider from '../lib/provider';
import MongoDb from '../lib/mongodb';
import config from '../../config';

export default async (account, block) => {
  console.log('eth_getBalance', account, block);
  try {
    const accountInfo = await MongoDb.findOne(config.HEDERA_ETHRPC_NETWORK, {_id: account});
    console.log({accountInfo});
    if (accountInfo?.accounts?.length) {
      const balance = await provider.getBalance(accountInfo?.accounts[0]);
      // Hbar has 8 decimals, Eth has 18. Multiply by 10^10.
      return balance.mul(Math.pow(10, 10)).toHexString();
    }
  } catch (err) {}
  return '0x0';
};
