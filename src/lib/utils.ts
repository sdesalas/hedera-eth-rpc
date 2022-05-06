const crypto = require('crypto');

export const SECOND = 1000;
export const MINUTE = 60*SECOND;
export const HOUR = 60*MINUTE;
export const DAY = 24*HOUR;
export const WEEK = 7*DAY;

export function sha256(data, digest:string) {
  const h = crypto.createHash('sha256').update(data);
  return digest ? h.digest(digest) : h.digest();
}

export function obfuscate(data) {
  return sha256(data, 'hex').substr(6,18);
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


