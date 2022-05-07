import provider from '../lib/provider';

export default (network) => {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async () => {
    return '0x' + Number((await p.getNetwork()).chainId).toString(16);
  };
};
