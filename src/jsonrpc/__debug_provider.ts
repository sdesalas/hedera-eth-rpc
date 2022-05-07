import provider from '../lib/provider';

export default (network) => {
  const p = provider[network];
  if (!p) throw Error('Provider not available: ' + network);
  return async () => {
    console.log('provider', p);
    return p;
  };
};
