import provider from '../lib/provider';

export default async () => {
  return '0x' + Number((await provider.getNetwork()).chainId).toString(16);
};
