/* RD Quiz — dekodè done yo : li chèn base64 la (moso 1..8 yo), li
   dekode LZW a, li verifye CRC a, epi li mete done yo nan QUIZZES,
   TF_QUESTIONS ak L10N. Li mete window.__quizDataReady = true lè tout
   bagay pare. */
var __rdqLen = 35826602;
var __rdqCrc = 1201794947;
function __rdqBytes(s) {
  var bin = atob(s);
  var out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function __rdqCrc32(bytes) {
  var c, k, n;
  if (!__rdqCrc32.t) {
    var t = new Int32Array(256);
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c; }
    __rdqCrc32.t = t;
  }
  var crc = 0xFFFFFFFF;
  var tt = __rdqCrc32.t;
  for (var i = 0; i < bytes.length; i++) crc = tt[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function __rdqLzw(bytes, outLen) {
  var MAX = 262144;
  var out = new Uint8Array(outLen);
  var outPos = 0;
  var prefix = new Int32Array(MAX);
  var tail = new Uint8Array(MAX);
  var next = 256;
  var bitBuf = 0, bitCnt = 0, bytePos = 0;
  var prev = -1;
  var stack = [];
  function firstChar(code) { while (code >= 256) code = prefix[code]; return code; }
  function emit(code) {
    var n = 0;
    while (code >= 256) { stack[n++] = tail[code]; code = prefix[code]; }
    stack[n++] = code;
    while (n > 0) out[outPos++] = stack[--n];
  }
  while (outPos < outLen) {
    var m = next < MAX ? next : MAX - 1;
    var width = 32 - Math.clz32(m);
    while (bitCnt < width) { bitBuf |= bytes[bytePos++] << bitCnt; bitCnt += 8; }
    var code = bitBuf & ((1 << width) - 1);
    bitBuf >>= width; bitCnt -= width;
    if (prev < 0) { emit(code); prev = code; continue; }
    var fc;
    if (code < next) { fc = firstChar(code); emit(code); }
    else { fc = firstChar(prev); emit(prev); out[outPos++] = fc; }
    if (next < MAX) { prefix[next] = prev; tail[next] = fc; next++; }
    prev = code;
  }
  return out;
}
function __rdqUtf8(bytes) {
  if (typeof TextDecoder !== "undefined") return new TextDecoder("utf-8").decode(bytes);
  return __rdqUtf8Manual(bytes);
}
function __rdqUtf8Manual(bytes) {
  var cps = [];
  for (var i = 0; i < bytes.length;) {
    var b = bytes[i++];
    if (b < 128) cps.push(b);
    else if (b < 224) cps.push(((b & 31) << 6) | (bytes[i++] & 63));
    else if (b < 240) cps.push(((b & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63));
    else cps.push(((b & 7) << 18) | ((bytes[i++] & 63) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63));
  }
  var s = "";
  for (var j = 0; j < cps.length; j += 8192) s += String.fromCodePoint.apply(null, cps.slice(j, j + 8192));
  return s;
}
var TF_QUESTIONS;
var L10N;
try {
  var __rdqRaw = __rdqLzw(__rdqBytes(__rdqB64), __rdqLen);
  if (__rdqCrc32(__rdqRaw) === __rdqCrc) {
    var __rdqData = JSON.parse(__rdqUtf8(__rdqRaw));
    for (var __rdqId in __rdqData.q) { QUIZZES[__rdqId] = __rdqData.q[__rdqId]; }
    TF_QUESTIONS = __rdqData.t;
    L10N = __rdqData.l;
    __rdqB64 = null; __rdqRaw = null; __rdqData = null;
    window.__quizDataReady = true;
  }
} catch (e) { /* done yo pa t dekode : app la ap montre bouton Retry a */ }
