const provider = require('../lib/provider');

module.exports = async () => {
  return String((await provider.getNetwork()).chainId);
};
