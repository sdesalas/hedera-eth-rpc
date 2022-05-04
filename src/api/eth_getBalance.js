const provider = require('../lib/provider');

module.exports = async (account, block) => {
  try {
    return '0x' + Number(await provider.getBalance(account)).toString(16);
  } catch (err) {}
  return '0x0';
};
