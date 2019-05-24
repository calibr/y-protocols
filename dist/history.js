'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var encoding = require('lib0/dist/encoding.js');
var decoding = require('lib0/dist/decoding.js');
require('yjs/src/index');

/**
 * @typedef {Object} HistorySnapshot
 * @property {Y.DeleteStore} HistorySnapshot.ds
 * @property {Map<number,number>} HistorySnapshot.sm
 * @property {Map<number,string>} HistorySnapshot.userMap
 */

/**
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} y
 * @param {Map<number, string>} userMap
 */
const writeHistorySnapshot = (encoder, y, userMap) => {
  writeDeleteStore(encoder, y.ds);
  writeStateMap(encoder, y.ss.state);
  encoding.writeVarUint(encoder, userMap.size);
  userMap.forEach((accountname, userid) => {
    encoding.writeVarUint(encoder, userid);
    encoding.writeVarString(encoder, accountname);
  });
};

/**
 *
 * @param {decoding.Decoder} decoder
 * @return {HistorySnapshot}
 */
const readHistorySnapshot = decoder => {
  const ds = readFreshDeleteStore(decoder);
  const sm = readStateMap(decoder);
  const size = decoding.readVarUint(decoder);
  const userMap = new Map();
  for (let i = 0; i < size; i++) {
    const userid = decoding.readVarUint(decoder);
    const accountname = decoding.readVarString(decoder);
    userMap.set(userid, accountname);
  }
  return { ds, sm, userMap }
};

exports.writeHistorySnapshot = writeHistorySnapshot;
exports.readHistorySnapshot = readHistorySnapshot;
