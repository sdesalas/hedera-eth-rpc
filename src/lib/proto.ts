import protobuf from "protobufjs";
import path from "path";

// Load types
const Types = {Key: null};
process.nextTick(async () => {
  const proto = await protobuf.load(path.join(__dirname, '/proto/basictypes.proto'));
  Object.keys(Types).forEach((k) => {
    Types[k] = proto.lookupType('proto.' + k);
  });
});

export function toBuffer(type, obj:Object|object|Record<string,object>) {
  // const obj = {ECDSASecp256k1: Buffer.from('e6cd5832097db5e187a38a15ccc8c1edd238b71c7e1d6cda80f24f36097641ad', 'hex')};
  const t = Types[type];
  if (!t || !t.verify) {
    throw new Error('Invalid type proto.' + type);
  }
  if (t.verify(obj)) {
    throw new Error('Unable to convert proto.' + type);
  };
  return t.encode(t.fromObject(obj)).finish();
}

export function toObject(type, buffer:Buffer|Int8Array) {
  // const buffer = Buffer.from('3a20d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex');
  const t = Types[type];
  if (!t || !t.verify) {
    throw new Error('Invalid type proto.' + type);
  }
  return t.decode(buffer);
}


// USAGE

// import {base32decode} from './utils';
// import {toBuffer, toObject} from '/proto';

// setTimeout(async () => {
//   // const bytes = Buffer.from('2a700802126c0a2212205b7b8d8c5b3c39130f80e47da0578990afd08193338b1d8e478c37e3baa52a790a2212201aaebcddb9e346d0d48397ba90df8cb54f06e51f6adff8e3913d5b97ae1d397f0a221220b5984d612731fafc53534e6048e9a94ac2e2fddb51bbb7567a5e2e3645db28be', 'hex');
//   // const bytes = Buffer.from('3a20d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex');
//   const bytes = base32decode('CIQNOWUYAGBLCCVX2VF75U6JMQDTUDXBOLZ5VJRDEWXQEGTI64DVCGQ');
//   console.log('bytes', bytes);
//   const obj = toObject('Key', bytes);
//   console.log('obj', obj);
// }, 100);

// setTimeout(async () => {
//   // const obj = {ed25519: Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex')};
//   const obj = {ECDSASecp256k1: Buffer.from('02cd5c809bb5e6ea9737c318dd8489adbe4dcd68bcafb90f2acfb4d894453ef9c5', 'hex')};
//   console.log('obj', obj);
//   const buffer = toBuffer('Key', obj);
//   console.log('buffer', buffer);
// }, 1000);