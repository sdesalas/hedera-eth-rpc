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
        res.json({address, publicKey, type, account});
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
 * Allows CORS for certain entrypoint, to be used in
 * conjunction with OPTIONS requests.
 */
export function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.send();
  next();
}