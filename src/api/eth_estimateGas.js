const provider = require('../lib/provider');

module.exports = async (trx) => {
  const {from, value, data} = trx;
  return '0x' + Number(data.slice(2).length * 100).toString(16);
};
