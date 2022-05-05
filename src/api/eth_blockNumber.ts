
export default async () => {
  // Use unix epoch to rotate every second
  return '0x' + Math.floor(Date.now() / 1000).toString(16);
};
