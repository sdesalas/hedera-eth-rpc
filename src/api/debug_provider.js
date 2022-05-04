const provider = require('../lib/provider');

module.exports = async () => {
  console.log('provider', provider);
  return provider;
};
