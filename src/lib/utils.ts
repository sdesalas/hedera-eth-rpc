import crypto from 'crypto';
import {BinaryToTextEncoding} from 'crypto';
import { keccak256 } from "@ethersproject/keccak256";

export const SECOND = 1000;
export const MINUTE = 60*SECOND;
export const HOUR = 60*MINUTE;
export const DAY = 24*HOUR;
export const WEEK = 7*DAY;

export function sha256(data, digest:BinaryToTextEncoding) {
  const h = crypto.createHash('sha256').update(data);
  return digest ? h.digest(digest) : h.digest();
}

export function toEthAddress(data) {
  return '0x' + keccak256(data).substr(-40);
}

export function toEthAddressBytes(data) {
  return Buffer.from(keccak256(data).substr(-40), 'hex');
}

export function obfuscate(data) {
  return String(sha256(data, 'hex')).substr(6,18);
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


