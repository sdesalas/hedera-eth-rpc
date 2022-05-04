const provider = require('../lib/provider');

module.exports = async () => {
  return '0x' + Number((await provider.getNetwork()).chainId).toString(16);
};
