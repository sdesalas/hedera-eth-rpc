import provider from './lib/provider';
import MongoDb from "./lib/mongodb";

/**
 * Hedera does not have a map of Ethereum compatible addresses so this
 * entrypoint allows users to figure out what is their hedera account (if any)
 * for a valid ETH compatible address.
 * @param network 
 * @returns Express router
 */
 export function getAddress(network) {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async (req, res) => {
    console.log('getAddress(%s)', network, req.params);
    const {address} = req.params;
    try {
      const item = await MongoDb.findOne(network, {_id: address});
      if (item) {
        const {_id:address, key:publicKey, type} = item;
        const account = item.accounts[0];
        const json = {address, publicKey, type, account};
        if (item.accounts.length > 1) {
          json['subaccounts'] = item.accounts.slice(1);
        }
        res.json(json);
      } else {
        res.status(400).json({error: "Not Found"});
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({error: String(err)});
    }
  };
}

/**
 * Hedera does not have a map of Ethereum compatible addresses so this
 * entrypoint allows users to figure out what is their Eth compatible address is
 * for a valid Hedera addresss
 * @param network 
 * @returns Express router
 */
 export function getAccount(network) {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async (req, res) => {
    console.log('getAccount(%s)', network, req.params);
    const {account} = req.params;
    try {
      const item = await MongoDb.findOne(network, {accounts: account});
      if (item) {
        const {_id:address, key:publicKey, type} = item;
        const json = {address, publicKey, type, account};
        res.json(json);
      } else {
        res.status(400).json({error: "Not Found"});
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({error: String(err)});
    }
  };
}

export function count(network) {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async (req, res) => {
    console.log('count(%s)', network)
    try {
      const stats = await MongoDb.stats(network);
      res.json({count: stats.count})
    } catch (err) {
      console.error(err);
      res.status(500).json({error: String(err)});
    }
  }
}

/**
 * Allows CORS for certain entrypoint, to be used in
 * conjunction with OPTIONS requests.
 */
export function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.send();
  next();
}