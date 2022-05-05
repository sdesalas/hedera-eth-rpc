import provider from '../lib/provider';

export default async () => {
  return String((await provider.getNetwork()).chainId);
};
