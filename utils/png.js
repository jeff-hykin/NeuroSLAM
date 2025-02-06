// https://esm.sh/iobuffer@5.3.2/denonext/iobuffer.mjs
const y = TextDecoder
const c = TextEncoder
function h(r2, t = "utf8") {
  return new y(t).decode(r2);
}
var g = new c();
function u(r2) {
  return g.encode(r2);
}
var b = 1024 * 8;
var w = (() => {
  let r2 = new Uint8Array(4), t = new Uint32Array(r2.buffer);
  return !((t[0] = 1) & r2[0]);
})();
var f = { int8: globalThis.Int8Array, uint8: globalThis.Uint8Array, int16: globalThis.Int16Array, uint16: globalThis.Uint16Array, int32: globalThis.Int32Array, uint32: globalThis.Uint32Array, uint64: globalThis.BigUint64Array, int64: globalThis.BigInt64Array, float32: globalThis.Float32Array, float64: globalThis.Float64Array };
var d = class r {
  constructor(t = b, e = {}) {
    let i = false;
    typeof t == "number" ? t = new ArrayBuffer(t) : (i = true, this.lastWrittenByte = t.byteLength);
    let s = e.offset ? e.offset >>> 0 : 0, n = t.byteLength - s, a = s;
    (ArrayBuffer.isView(t) || t instanceof r) && (t.byteLength !== t.buffer.byteLength && (a = t.byteOffset + s), t = t.buffer), i ? this.lastWrittenByte = n : this.lastWrittenByte = 0, this.buffer = t, this.length = n, this.byteLength = n, this.byteOffset = a, this.offset = 0, this.littleEndian = true, this._data = new DataView(this.buffer, a, n), this._mark = 0, this._marks = [];
  }
  available(t = 1) {
    return this.offset + t <= this.length;
  }
  isLittleEndian() {
    return this.littleEndian;
  }
  setLittleEndian() {
    return this.littleEndian = true, this;
  }
  isBigEndian() {
    return !this.littleEndian;
  }
  setBigEndian() {
    return this.littleEndian = false, this;
  }
  skip(t = 1) {
    return this.offset += t, this;
  }
  back(t = 1) {
    return this.offset -= t, this;
  }
  seek(t) {
    return this.offset = t, this;
  }
  mark() {
    return this._mark = this.offset, this;
  }
  reset() {
    return this.offset = this._mark, this;
  }
  pushMark() {
    return this._marks.push(this.offset), this;
  }
  popMark() {
    let t = this._marks.pop();
    if (t === void 0) throw new Error("Mark stack empty");
    return this.seek(t), this;
  }
  rewind() {
    return this.offset = 0, this;
  }
  ensureAvailable(t = 1) {
    if (!this.available(t)) {
      let i = (this.offset + t) * 2, s = new Uint8Array(i);
      s.set(new Uint8Array(this.buffer)), this.buffer = s.buffer, this.length = this.byteLength = i, this._data = new DataView(this.buffer);
    }
    return this;
  }
  readBoolean() {
    return this.readUint8() !== 0;
  }
  readInt8() {
    return this._data.getInt8(this.offset++);
  }
  readUint8() {
    return this._data.getUint8(this.offset++);
  }
  readByte() {
    return this.readUint8();
  }
  readBytes(t = 1) {
    return this.readArray(t, "uint8");
  }
  readArray(t, e) {
    let i = f[e].BYTES_PER_ELEMENT * t, s = this.byteOffset + this.offset, n = this.buffer.slice(s, s + i);
    if (this.littleEndian === w && e !== "uint8" && e !== "int8") {
      let l = new Uint8Array(this.buffer.slice(s, s + i));
      l.reverse();
      let o = new f[e](l.buffer);
      return this.offset += i, o.reverse(), o;
    }
    let a = new f[e](n);
    return this.offset += i, a;
  }
  readInt16() {
    let t = this._data.getInt16(this.offset, this.littleEndian);
    return this.offset += 2, t;
  }
  readUint16() {
    let t = this._data.getUint16(this.offset, this.littleEndian);
    return this.offset += 2, t;
  }
  readInt32() {
    let t = this._data.getInt32(this.offset, this.littleEndian);
    return this.offset += 4, t;
  }
  readUint32() {
    let t = this._data.getUint32(this.offset, this.littleEndian);
    return this.offset += 4, t;
  }
  readFloat32() {
    let t = this._data.getFloat32(this.offset, this.littleEndian);
    return this.offset += 4, t;
  }
  readFloat64() {
    let t = this._data.getFloat64(this.offset, this.littleEndian);
    return this.offset += 8, t;
  }
  readBigInt64() {
    let t = this._data.getBigInt64(this.offset, this.littleEndian);
    return this.offset += 8, t;
  }
  readBigUint64() {
    let t = this._data.getBigUint64(this.offset, this.littleEndian);
    return this.offset += 8, t;
  }
  readChar() {
    return String.fromCharCode(this.readInt8());
  }
  readChars(t = 1) {
    let e = "";
    for (let i = 0; i < t; i++) e += this.readChar();
    return e;
  }
  readUtf8(t = 1) {
    return h(this.readBytes(t));
  }
  decodeText(t = 1, e = "utf-8") {
    return h(this.readBytes(t), e);
  }
  writeBoolean(t) {
    return this.writeUint8(t ? 255 : 0), this;
  }
  writeInt8(t) {
    return this.ensureAvailable(1), this._data.setInt8(this.offset++, t), this._updateLastWrittenByte(), this;
  }
  writeUint8(t) {
    return this.ensureAvailable(1), this._data.setUint8(this.offset++, t), this._updateLastWrittenByte(), this;
  }
  writeByte(t) {
    return this.writeUint8(t);
  }
  writeBytes(t) {
    this.ensureAvailable(t.length);
    for (let e = 0; e < t.length; e++) this._data.setUint8(this.offset++, t[e]);
    return this._updateLastWrittenByte(), this;
  }
  writeInt16(t) {
    return this.ensureAvailable(2), this._data.setInt16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this;
  }
  writeUint16(t) {
    return this.ensureAvailable(2), this._data.setUint16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this;
  }
  writeInt32(t) {
    return this.ensureAvailable(4), this._data.setInt32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
  }
  writeUint32(t) {
    return this.ensureAvailable(4), this._data.setUint32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
  }
  writeFloat32(t) {
    return this.ensureAvailable(4), this._data.setFloat32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
  }
  writeFloat64(t) {
    return this.ensureAvailable(8), this._data.setFloat64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
  }
  writeBigInt64(t) {
    return this.ensureAvailable(8), this._data.setBigInt64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
  }
  writeBigUint64(t) {
    return this.ensureAvailable(8), this._data.setBigUint64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
  }
  writeChar(t) {
    return this.writeUint8(t.charCodeAt(0));
  }
  writeChars(t) {
    for (let e = 0; e < t.length; e++) this.writeUint8(t.charCodeAt(e));
    return this;
  }
  writeUtf8(t) {
    return this.writeBytes(u(t));
  }
  toArray() {
    return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
  }
  _updateLastWrittenByte() {
    this.offset > this.lastWrittenByte && (this.lastWrittenByte = this.offset);
  }
};

// https://esm.sh/pako@2.1.0/denonext/pako.mjs
function de(e) {
  let i = e.length;
  for (; --i >= 0; ) e[i] = 0;
}
var Bi = 0;
var fi = 1;
var Ki = 2;
var Pi = 3;
var Xi = 258;
var wt = 29;
var Re = 256;
var ve = Re + 1 + wt;
var oe = 30;
var bt = 19;
var oi = 2 * ve + 1;
var Q = 15;
var Ye = 16;
var Yi = 7;
var gt = 256;
var _i = 16;
var hi = 17;
var di = 18;
var lt = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]);
var Fe = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);
var Gi = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);
var si = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var ji = 512;
var P = new Array((ve + 2) * 2);
de(P);
var ge = new Array(oe * 2);
de(ge);
var ke = new Array(ji);
de(ke);
var Ee = new Array(Xi - Pi + 1);
de(Ee);
var pt = new Array(wt);
de(pt);
var Me = new Array(oe);
de(Me);
function Ge(e, i, t, n, r2) {
  this.static_tree = e, this.extra_bits = i, this.extra_base = t, this.elems = n, this.max_length = r2, this.has_stree = e && e.length;
}
var ci;
var ui;
var wi;
function je(e, i) {
  this.dyn_tree = e, this.max_code = 0, this.stat_desc = i;
}
var bi = (e) => e < 256 ? ke[e] : ke[256 + (e >>> 7)];
var ye = (e, i) => {
  e.pending_buf[e.pending++] = i & 255, e.pending_buf[e.pending++] = i >>> 8 & 255;
};
var N = (e, i, t) => {
  e.bi_valid > Ye - t ? (e.bi_buf |= i << e.bi_valid & 65535, ye(e, e.bi_buf), e.bi_buf = i >> Ye - e.bi_valid, e.bi_valid += t - Ye) : (e.bi_buf |= i << e.bi_valid & 65535, e.bi_valid += t);
};
var M = (e, i, t) => {
  N(e, t[i * 2], t[i * 2 + 1]);
};
var gi = (e, i) => {
  let t = 0;
  do
    t |= e & 1, e >>>= 1, t <<= 1;
  while (--i > 0);
  return t >>> 1;
};
var Wi = (e) => {
  e.bi_valid === 16 ? (ye(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
};
var Vi = (e, i) => {
  let t = i.dyn_tree, n = i.max_code, r2 = i.stat_desc.static_tree, a = i.stat_desc.has_stree, o = i.stat_desc.extra_bits, f2 = i.stat_desc.extra_base, c2 = i.stat_desc.max_length, l, _, y2, s, h2, u2, T = 0;
  for (s = 0; s <= Q; s++) e.bl_count[s] = 0;
  for (t[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < oi; l++) _ = e.heap[l], s = t[t[_ * 2 + 1] * 2 + 1] + 1, s > c2 && (s = c2, T++), t[_ * 2 + 1] = s, !(_ > n) && (e.bl_count[s]++, h2 = 0, _ >= f2 && (h2 = o[_ - f2]), u2 = t[_ * 2], e.opt_len += u2 * (s + h2), a && (e.static_len += u2 * (r2[_ * 2 + 1] + h2)));
  if (T !== 0) {
    do {
      for (s = c2 - 1; e.bl_count[s] === 0; ) s--;
      e.bl_count[s]--, e.bl_count[s + 1] += 2, e.bl_count[c2]--, T -= 2;
    } while (T > 0);
    for (s = c2; s !== 0; s--) for (_ = e.bl_count[s]; _ !== 0; ) y2 = e.heap[--l], !(y2 > n) && (t[y2 * 2 + 1] !== s && (e.opt_len += (s - t[y2 * 2 + 1]) * t[y2 * 2], t[y2 * 2 + 1] = s), _--);
  }
};
var pi = (e, i, t) => {
  let n = new Array(Q + 1), r2 = 0, a, o;
  for (a = 1; a <= Q; a++) r2 = r2 + t[a - 1] << 1, n[a] = r2;
  for (o = 0; o <= i; o++) {
    let f2 = e[o * 2 + 1];
    f2 !== 0 && (e[o * 2] = gi(n[f2]++, f2));
  }
};
var Ji = () => {
  let e, i, t, n, r2, a = new Array(Q + 1);
  for (t = 0, n = 0; n < wt - 1; n++) for (pt[n] = t, e = 0; e < 1 << lt[n]; e++) Ee[t++] = n;
  for (Ee[t - 1] = n, r2 = 0, n = 0; n < 16; n++) for (Me[n] = r2, e = 0; e < 1 << Fe[n]; e++) ke[r2++] = n;
  for (r2 >>= 7; n < oe; n++) for (Me[n] = r2 << 7, e = 0; e < 1 << Fe[n] - 7; e++) ke[256 + r2++] = n;
  for (i = 0; i <= Q; i++) a[i] = 0;
  for (e = 0; e <= 143; ) P[e * 2 + 1] = 8, e++, a[8]++;
  for (; e <= 255; ) P[e * 2 + 1] = 9, e++, a[9]++;
  for (; e <= 279; ) P[e * 2 + 1] = 7, e++, a[7]++;
  for (; e <= 287; ) P[e * 2 + 1] = 8, e++, a[8]++;
  for (pi(P, ve + 1, a), e = 0; e < oe; e++) ge[e * 2 + 1] = 5, ge[e * 2] = gi(e, 5);
  ci = new Ge(P, lt, Re + 1, ve, Q), ui = new Ge(ge, Fe, 0, oe, Q), wi = new Ge(new Array(0), Gi, 0, bt, Yi);
};
var xi = (e) => {
  let i;
  for (i = 0; i < ve; i++) e.dyn_ltree[i * 2] = 0;
  for (i = 0; i < oe; i++) e.dyn_dtree[i * 2] = 0;
  for (i = 0; i < bt; i++) e.bl_tree[i * 2] = 0;
  e.dyn_ltree[gt * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
};
var vi = (e) => {
  e.bi_valid > 8 ? ye(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
};
var yt = (e, i, t, n) => {
  let r2 = i * 2, a = t * 2;
  return e[r2] < e[a] || e[r2] === e[a] && n[i] <= n[t];
};
var We = (e, i, t) => {
  let n = e.heap[t], r2 = t << 1;
  for (; r2 <= e.heap_len && (r2 < e.heap_len && yt(i, e.heap[r2 + 1], e.heap[r2], e.depth) && r2++, !yt(i, n, e.heap[r2], e.depth)); ) e.heap[t] = e.heap[r2], t = r2, r2 <<= 1;
  e.heap[t] = n;
};
var mt = (e, i, t) => {
  let n, r2, a = 0, o, f2;
  if (e.sym_next !== 0) do
    n = e.pending_buf[e.sym_buf + a++] & 255, n += (e.pending_buf[e.sym_buf + a++] & 255) << 8, r2 = e.pending_buf[e.sym_buf + a++], n === 0 ? M(e, r2, i) : (o = Ee[r2], M(e, o + Re + 1, i), f2 = lt[o], f2 !== 0 && (r2 -= pt[o], N(e, r2, f2)), n--, o = bi(n), M(e, o, t), f2 = Fe[o], f2 !== 0 && (n -= Me[o], N(e, n, f2)));
  while (a < e.sym_next);
  M(e, gt, i);
};
var ft = (e, i) => {
  let t = i.dyn_tree, n = i.stat_desc.static_tree, r2 = i.stat_desc.has_stree, a = i.stat_desc.elems, o, f2, c2 = -1, l;
  for (e.heap_len = 0, e.heap_max = oi, o = 0; o < a; o++) t[o * 2] !== 0 ? (e.heap[++e.heap_len] = c2 = o, e.depth[o] = 0) : t[o * 2 + 1] = 0;
  for (; e.heap_len < 2; ) l = e.heap[++e.heap_len] = c2 < 2 ? ++c2 : 0, t[l * 2] = 1, e.depth[l] = 0, e.opt_len--, r2 && (e.static_len -= n[l * 2 + 1]);
  for (i.max_code = c2, o = e.heap_len >> 1; o >= 1; o--) We(e, t, o);
  l = a;
  do
    o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], We(e, t, 1), f2 = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = f2, t[l * 2] = t[o * 2] + t[f2 * 2], e.depth[l] = (e.depth[o] >= e.depth[f2] ? e.depth[o] : e.depth[f2]) + 1, t[o * 2 + 1] = t[f2 * 2 + 1] = l, e.heap[1] = l++, We(e, t, 1);
  while (e.heap_len >= 2);
  e.heap[--e.heap_max] = e.heap[1], Vi(e, i), pi(t, c2, e.bl_count);
};
var zt = (e, i, t) => {
  let n, r2 = -1, a, o = i[0 * 2 + 1], f2 = 0, c2 = 7, l = 4;
  for (o === 0 && (c2 = 138, l = 3), i[(t + 1) * 2 + 1] = 65535, n = 0; n <= t; n++) a = o, o = i[(n + 1) * 2 + 1], !(++f2 < c2 && a === o) && (f2 < l ? e.bl_tree[a * 2] += f2 : a !== 0 ? (a !== r2 && e.bl_tree[a * 2]++, e.bl_tree[_i * 2]++) : f2 <= 10 ? e.bl_tree[hi * 2]++ : e.bl_tree[di * 2]++, f2 = 0, r2 = a, o === 0 ? (c2 = 138, l = 3) : a === o ? (c2 = 6, l = 3) : (c2 = 7, l = 4));
};
var St = (e, i, t) => {
  let n, r2 = -1, a, o = i[0 * 2 + 1], f2 = 0, c2 = 7, l = 4;
  for (o === 0 && (c2 = 138, l = 3), n = 0; n <= t; n++) if (a = o, o = i[(n + 1) * 2 + 1], !(++f2 < c2 && a === o)) {
    if (f2 < l) do
      M(e, a, e.bl_tree);
    while (--f2 !== 0);
    else a !== 0 ? (a !== r2 && (M(e, a, e.bl_tree), f2--), M(e, _i, e.bl_tree), N(e, f2 - 3, 2)) : f2 <= 10 ? (M(e, hi, e.bl_tree), N(e, f2 - 3, 3)) : (M(e, di, e.bl_tree), N(e, f2 - 11, 7));
    f2 = 0, r2 = a, o === 0 ? (c2 = 138, l = 3) : a === o ? (c2 = 6, l = 3) : (c2 = 7, l = 4);
  }
};
var Qi = (e) => {
  let i;
  for (zt(e, e.dyn_ltree, e.l_desc.max_code), zt(e, e.dyn_dtree, e.d_desc.max_code), ft(e, e.bl_desc), i = bt - 1; i >= 3 && e.bl_tree[si[i] * 2 + 1] === 0; i--) ;
  return e.opt_len += 3 * (i + 1) + 5 + 5 + 4, i;
};
var qi = (e, i, t, n) => {
  let r2;
  for (N(e, i - 257, 5), N(e, t - 1, 5), N(e, n - 4, 4), r2 = 0; r2 < n; r2++) N(e, e.bl_tree[si[r2] * 2 + 1], 3);
  St(e, e.dyn_ltree, i - 1), St(e, e.dyn_dtree, t - 1);
};
var en = (e) => {
  let i = 4093624447, t;
  for (t = 0; t <= 31; t++, i >>>= 1) if (i & 1 && e.dyn_ltree[t * 2] !== 0) return 0;
  if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0) return 1;
  for (t = 32; t < Re; t++) if (e.dyn_ltree[t * 2] !== 0) return 1;
  return 0;
};
var At = false;
var tn = (e) => {
  At || (Ji(), At = true), e.l_desc = new je(e.dyn_ltree, ci), e.d_desc = new je(e.dyn_dtree, ui), e.bl_desc = new je(e.bl_tree, wi), e.bi_buf = 0, e.bi_valid = 0, xi(e);
};
var ki = (e, i, t, n) => {
  N(e, (Bi << 1) + (n ? 1 : 0), 3), vi(e), ye(e, t), ye(e, ~t), t && e.pending_buf.set(e.window.subarray(i, i + t), e.pending), e.pending += t;
};
var nn = (e) => {
  N(e, fi << 1, 3), M(e, gt, P), Wi(e);
};
var an = (e, i, t, n) => {
  let r2, a, o = 0;
  e.level > 0 ? (e.strm.data_type === 2 && (e.strm.data_type = en(e)), ft(e, e.l_desc), ft(e, e.d_desc), o = Qi(e), r2 = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= r2 && (r2 = a)) : r2 = a = t + 5, t + 4 <= r2 && i !== -1 ? ki(e, i, t, n) : e.strategy === 4 || a === r2 ? (N(e, (fi << 1) + (n ? 1 : 0), 3), mt(e, P, ge)) : (N(e, (Ki << 1) + (n ? 1 : 0), 3), qi(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), mt(e, e.dyn_ltree, e.dyn_dtree)), xi(e), n && vi(e);
};
var rn = (e, i, t) => (e.pending_buf[e.sym_buf + e.sym_next++] = i, e.pending_buf[e.sym_buf + e.sym_next++] = i >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = t, i === 0 ? e.dyn_ltree[t * 2]++ : (e.matches++, i--, e.dyn_ltree[(Ee[t] + Re + 1) * 2]++, e.dyn_dtree[bi(i) * 2]++), e.sym_next === e.sym_end);
var ln = tn;
var fn = ki;
var on = an;
var _n = rn;
var hn = nn;
var dn = { _tr_init: ln, _tr_stored_block: fn, _tr_flush_block: on, _tr_tally: _n, _tr_align: hn };
var sn = (e, i, t, n) => {
  let r2 = e & 65535 | 0, a = e >>> 16 & 65535 | 0, o = 0;
  for (; t !== 0; ) {
    o = t > 2e3 ? 2e3 : t, t -= o;
    do
      r2 = r2 + i[n++] | 0, a = a + r2 | 0;
    while (--o);
    r2 %= 65521, a %= 65521;
  }
  return r2 | a << 16 | 0;
};
var me = sn;
var cn = () => {
  let e, i = [];
  for (var t = 0; t < 256; t++) {
    e = t;
    for (var n = 0; n < 8; n++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
    i[t] = e;
  }
  return i;
};
var un = new Uint32Array(cn());
var wn = (e, i, t, n) => {
  let r2 = un, a = n + t;
  e ^= -1;
  for (let o = n; o < a; o++) e = e >>> 8 ^ r2[(e ^ i[o]) & 255];
  return e ^ -1;
};
var Z = wn;
var te = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
var ae = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_MEM_ERROR: -4, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
var { _tr_init: bn, _tr_stored_block: ot, _tr_flush_block: gn, _tr_tally: j, _tr_align: pn } = dn;
var { Z_NO_FLUSH: W, Z_PARTIAL_FLUSH: xn, Z_FULL_FLUSH: vn, Z_FINISH: C, Z_BLOCK: Rt, Z_OK: I, Z_STREAM_END: Tt, Z_STREAM_ERROR: H, Z_DATA_ERROR: kn, Z_BUF_ERROR: Ve, Z_DEFAULT_COMPRESSION: En, Z_FILTERED: yn, Z_HUFFMAN_ONLY: Ne, Z_RLE: mn, Z_FIXED: zn, Z_DEFAULT_STRATEGY: Sn, Z_UNKNOWN: An, Z_DEFLATED: Ke } = ae;
var Rn = 9;
var Tn = 15;
var Dn = 8;
var Zn = 29;
var In = 256;
var _t = In + 1 + Zn;
var On = 30;
var Nn = 19;
var Ln = 2 * _t + 1;
var Un = 15;
var v = 3;
var G = 258;
var B = G + v + 1;
var Cn = 32;
var _e = 42;
var xt = 57;
var ht = 69;
var dt = 73;
var st = 91;
var ct = 103;
var q = 113;
var we = 666;
var O = 1;
var se = 2;
var ie = 3;
var ce = 4;
var $n = 3;
var ee = (e, i) => (e.msg = te[i], i);
var Dt = (e) => e * 2 - (e > 4 ? 9 : 0);
var Y = (e) => {
  let i = e.length;
  for (; --i >= 0; ) e[i] = 0;
};
var Fn = (e) => {
  let i, t, n, r2 = e.w_size;
  i = e.hash_size, n = i;
  do
    t = e.head[--n], e.head[n] = t >= r2 ? t - r2 : 0;
  while (--i);
  i = r2, n = i;
  do
    t = e.prev[--n], e.prev[n] = t >= r2 ? t - r2 : 0;
  while (--i);
};
var Mn = (e, i, t) => (i << e.hash_shift ^ t) & e.hash_mask;
var V = Mn;
var L = (e) => {
  let i = e.state, t = i.pending;
  t > e.avail_out && (t = e.avail_out), t !== 0 && (e.output.set(i.pending_buf.subarray(i.pending_out, i.pending_out + t), e.next_out), e.next_out += t, i.pending_out += t, e.total_out += t, e.avail_out -= t, i.pending -= t, i.pending === 0 && (i.pending_out = 0));
};
var U = (e, i) => {
  gn(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, i), e.block_start = e.strstart, L(e.strm);
};
var z = (e, i) => {
  e.pending_buf[e.pending++] = i;
};
var ue = (e, i) => {
  e.pending_buf[e.pending++] = i >>> 8 & 255, e.pending_buf[e.pending++] = i & 255;
};
var ut = (e, i, t, n) => {
  let r2 = e.avail_in;
  return r2 > n && (r2 = n), r2 === 0 ? 0 : (e.avail_in -= r2, i.set(e.input.subarray(e.next_in, e.next_in + r2), t), e.state.wrap === 1 ? e.adler = me(e.adler, i, r2, t) : e.state.wrap === 2 && (e.adler = Z(e.adler, i, r2, t)), e.next_in += r2, e.total_in += r2, r2);
};
var Ei = (e, i) => {
  let t = e.max_chain_length, n = e.strstart, r2, a, o = e.prev_length, f2 = e.nice_match, c2 = e.strstart > e.w_size - B ? e.strstart - (e.w_size - B) : 0, l = e.window, _ = e.w_mask, y2 = e.prev, s = e.strstart + G, h2 = l[n + o - 1], u2 = l[n + o];
  e.prev_length >= e.good_match && (t >>= 2), f2 > e.lookahead && (f2 = e.lookahead);
  do
    if (r2 = i, !(l[r2 + o] !== u2 || l[r2 + o - 1] !== h2 || l[r2] !== l[n] || l[++r2] !== l[n + 1])) {
      n += 2, r2++;
      do
        ;
      while (l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && l[++n] === l[++r2] && n < s);
      if (a = G - (s - n), n = s - G, a > o) {
        if (e.match_start = i, o = a, a >= f2) break;
        h2 = l[n + o - 1], u2 = l[n + o];
      }
    }
  while ((i = y2[i & _]) > c2 && --t !== 0);
  return o <= e.lookahead ? o : e.lookahead;
};
var he = (e) => {
  let i = e.w_size, t, n, r2;
  do {
    if (n = e.window_size - e.lookahead - e.strstart, e.strstart >= i + (i - B) && (e.window.set(e.window.subarray(i, i + i - n), 0), e.match_start -= i, e.strstart -= i, e.block_start -= i, e.insert > e.strstart && (e.insert = e.strstart), Fn(e), n += i), e.strm.avail_in === 0) break;
    if (t = ut(e.strm, e.window, e.strstart + e.lookahead, n), e.lookahead += t, e.lookahead + e.insert >= v) for (r2 = e.strstart - e.insert, e.ins_h = e.window[r2], e.ins_h = V(e, e.ins_h, e.window[r2 + 1]); e.insert && (e.ins_h = V(e, e.ins_h, e.window[r2 + v - 1]), e.prev[r2 & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = r2, r2++, e.insert--, !(e.lookahead + e.insert < v)); ) ;
  } while (e.lookahead < B && e.strm.avail_in !== 0);
};
var yi = (e, i) => {
  let t = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, n, r2, a, o = 0, f2 = e.strm.avail_in;
  do {
    if (n = 65535, a = e.bi_valid + 42 >> 3, e.strm.avail_out < a || (a = e.strm.avail_out - a, r2 = e.strstart - e.block_start, n > r2 + e.strm.avail_in && (n = r2 + e.strm.avail_in), n > a && (n = a), n < t && (n === 0 && i !== C || i === W || n !== r2 + e.strm.avail_in))) break;
    o = i === C && n === r2 + e.strm.avail_in ? 1 : 0, ot(e, 0, 0, o), e.pending_buf[e.pending - 4] = n, e.pending_buf[e.pending - 3] = n >> 8, e.pending_buf[e.pending - 2] = ~n, e.pending_buf[e.pending - 1] = ~n >> 8, L(e.strm), r2 && (r2 > n && (r2 = n), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + r2), e.strm.next_out), e.strm.next_out += r2, e.strm.avail_out -= r2, e.strm.total_out += r2, e.block_start += r2, n -= r2), n && (ut(e.strm, e.strm.output, e.strm.next_out, n), e.strm.next_out += n, e.strm.avail_out -= n, e.strm.total_out += n);
  } while (o === 0);
  return f2 -= e.strm.avail_in, f2 && (f2 >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= f2 && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - f2, e.strm.next_in), e.strstart), e.strstart += f2, e.insert += f2 > e.w_size - e.insert ? e.w_size - e.insert : f2), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), o ? ce : i !== W && i !== C && e.strm.avail_in === 0 && e.strstart === e.block_start ? se : (a = e.window_size - e.strstart, e.strm.avail_in > a && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, a += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), a > e.strm.avail_in && (a = e.strm.avail_in), a && (ut(e.strm, e.window, e.strstart, a), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.high_water < e.strstart && (e.high_water = e.strstart), a = e.bi_valid + 42 >> 3, a = e.pending_buf_size - a > 65535 ? 65535 : e.pending_buf_size - a, t = a > e.w_size ? e.w_size : a, r2 = e.strstart - e.block_start, (r2 >= t || (r2 || i === C) && i !== W && e.strm.avail_in === 0 && r2 <= a) && (n = r2 > a ? a : r2, o = i === C && e.strm.avail_in === 0 && n === r2 ? 1 : 0, ot(e, e.block_start, n, o), e.block_start += n, L(e.strm)), o ? ie : O);
};
var Je = (e, i) => {
  let t, n;
  for (; ; ) {
    if (e.lookahead < B) {
      if (he(e), e.lookahead < B && i === W) return O;
      if (e.lookahead === 0) break;
    }
    if (t = 0, e.lookahead >= v && (e.ins_h = V(e, e.ins_h, e.window[e.strstart + v - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), t !== 0 && e.strstart - t <= e.w_size - B && (e.match_length = Ei(e, t)), e.match_length >= v) if (n = j(e, e.strstart - e.match_start, e.match_length - v), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= v) {
      e.match_length--;
      do
        e.strstart++, e.ins_h = V(e, e.ins_h, e.window[e.strstart + v - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
      while (--e.match_length !== 0);
      e.strstart++;
    } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = V(e, e.ins_h, e.window[e.strstart + 1]);
    else n = j(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
    if (n && (U(e, false), e.strm.avail_out === 0)) return O;
  }
  return e.insert = e.strstart < v - 1 ? e.strstart : v - 1, i === C ? (U(e, true), e.strm.avail_out === 0 ? ie : ce) : e.sym_next && (U(e, false), e.strm.avail_out === 0) ? O : se;
};
var le = (e, i) => {
  let t, n, r2;
  for (; ; ) {
    if (e.lookahead < B) {
      if (he(e), e.lookahead < B && i === W) return O;
      if (e.lookahead === 0) break;
    }
    if (t = 0, e.lookahead >= v && (e.ins_h = V(e, e.ins_h, e.window[e.strstart + v - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = v - 1, t !== 0 && e.prev_length < e.max_lazy_match && e.strstart - t <= e.w_size - B && (e.match_length = Ei(e, t), e.match_length <= 5 && (e.strategy === yn || e.match_length === v && e.strstart - e.match_start > 4096) && (e.match_length = v - 1)), e.prev_length >= v && e.match_length <= e.prev_length) {
      r2 = e.strstart + e.lookahead - v, n = j(e, e.strstart - 1 - e.prev_match, e.prev_length - v), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
      do
        ++e.strstart <= r2 && (e.ins_h = V(e, e.ins_h, e.window[e.strstart + v - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
      while (--e.prev_length !== 0);
      if (e.match_available = 0, e.match_length = v - 1, e.strstart++, n && (U(e, false), e.strm.avail_out === 0)) return O;
    } else if (e.match_available) {
      if (n = j(e, 0, e.window[e.strstart - 1]), n && U(e, false), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return O;
    } else e.match_available = 1, e.strstart++, e.lookahead--;
  }
  return e.match_available && (n = j(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < v - 1 ? e.strstart : v - 1, i === C ? (U(e, true), e.strm.avail_out === 0 ? ie : ce) : e.sym_next && (U(e, false), e.strm.avail_out === 0) ? O : se;
};
var Hn = (e, i) => {
  let t, n, r2, a, o = e.window;
  for (; ; ) {
    if (e.lookahead <= G) {
      if (he(e), e.lookahead <= G && i === W) return O;
      if (e.lookahead === 0) break;
    }
    if (e.match_length = 0, e.lookahead >= v && e.strstart > 0 && (r2 = e.strstart - 1, n = o[r2], n === o[++r2] && n === o[++r2] && n === o[++r2])) {
      a = e.strstart + G;
      do
        ;
      while (n === o[++r2] && n === o[++r2] && n === o[++r2] && n === o[++r2] && n === o[++r2] && n === o[++r2] && n === o[++r2] && n === o[++r2] && r2 < a);
      e.match_length = G - (a - r2), e.match_length > e.lookahead && (e.match_length = e.lookahead);
    }
    if (e.match_length >= v ? (t = j(e, 1, e.match_length - v), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (t = j(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), t && (U(e, false), e.strm.avail_out === 0)) return O;
  }
  return e.insert = 0, i === C ? (U(e, true), e.strm.avail_out === 0 ? ie : ce) : e.sym_next && (U(e, false), e.strm.avail_out === 0) ? O : se;
};
var Bn = (e, i) => {
  let t;
  for (; ; ) {
    if (e.lookahead === 0 && (he(e), e.lookahead === 0)) {
      if (i === W) return O;
      break;
    }
    if (e.match_length = 0, t = j(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, t && (U(e, false), e.strm.avail_out === 0)) return O;
  }
  return e.insert = 0, i === C ? (U(e, true), e.strm.avail_out === 0 ? ie : ce) : e.sym_next && (U(e, false), e.strm.avail_out === 0) ? O : se;
};
function F(e, i, t, n, r2) {
  this.good_length = e, this.max_lazy = i, this.nice_length = t, this.max_chain = n, this.func = r2;
}
var be = [new F(0, 0, 0, 0, yi), new F(4, 4, 8, 4, Je), new F(4, 5, 16, 8, Je), new F(4, 6, 32, 32, Je), new F(4, 4, 16, 16, le), new F(8, 16, 32, 32, le), new F(8, 16, 128, 128, le), new F(8, 32, 128, 256, le), new F(32, 128, 258, 1024, le), new F(32, 258, 258, 4096, le)];
var Kn = (e) => {
  e.window_size = 2 * e.w_size, Y(e.head), e.max_lazy_match = be[e.level].max_lazy, e.good_match = be[e.level].good_length, e.nice_match = be[e.level].nice_length, e.max_chain_length = be[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = v - 1, e.match_available = 0, e.ins_h = 0;
};
function Pn() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Ke, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Ln * 2), this.dyn_dtree = new Uint16Array((2 * On + 1) * 2), this.bl_tree = new Uint16Array((2 * Nn + 1) * 2), Y(this.dyn_ltree), Y(this.dyn_dtree), Y(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(Un + 1), this.heap = new Uint16Array(2 * _t + 1), Y(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * _t + 1), Y(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
var Te = (e) => {
  if (!e) return 1;
  let i = e.state;
  return !i || i.strm !== e || i.status !== _e && i.status !== xt && i.status !== ht && i.status !== dt && i.status !== st && i.status !== ct && i.status !== q && i.status !== we ? 1 : 0;
};
var mi = (e) => {
  if (Te(e)) return ee(e, H);
  e.total_in = e.total_out = 0, e.data_type = An;
  let i = e.state;
  return i.pending = 0, i.pending_out = 0, i.wrap < 0 && (i.wrap = -i.wrap), i.status = i.wrap === 2 ? xt : i.wrap ? _e : q, e.adler = i.wrap === 2 ? 0 : 1, i.last_flush = -2, bn(i), I;
};
var zi = (e) => {
  let i = mi(e);
  return i === I && Kn(e.state), i;
};
var Xn = (e, i) => Te(e) || e.state.wrap !== 2 ? H : (e.state.gzhead = i, I);
var Si = (e, i, t, n, r2, a) => {
  if (!e) return H;
  let o = 1;
  if (i === En && (i = 6), n < 0 ? (o = 0, n = -n) : n > 15 && (o = 2, n -= 16), r2 < 1 || r2 > Rn || t !== Ke || n < 8 || n > 15 || i < 0 || i > 9 || a < 0 || a > zn || n === 8 && o !== 1) return ee(e, H);
  n === 8 && (n = 9);
  let f2 = new Pn();
  return e.state = f2, f2.strm = e, f2.status = _e, f2.wrap = o, f2.gzhead = null, f2.w_bits = n, f2.w_size = 1 << f2.w_bits, f2.w_mask = f2.w_size - 1, f2.hash_bits = r2 + 7, f2.hash_size = 1 << f2.hash_bits, f2.hash_mask = f2.hash_size - 1, f2.hash_shift = ~~((f2.hash_bits + v - 1) / v), f2.window = new Uint8Array(f2.w_size * 2), f2.head = new Uint16Array(f2.hash_size), f2.prev = new Uint16Array(f2.w_size), f2.lit_bufsize = 1 << r2 + 6, f2.pending_buf_size = f2.lit_bufsize * 4, f2.pending_buf = new Uint8Array(f2.pending_buf_size), f2.sym_buf = f2.lit_bufsize, f2.sym_end = (f2.lit_bufsize - 1) * 3, f2.level = i, f2.strategy = a, f2.method = t, zi(e);
};
var Yn = (e, i) => Si(e, i, Ke, Tn, Dn, Sn);
var Gn = (e, i) => {
  if (Te(e) || i > Rt || i < 0) return e ? ee(e, H) : H;
  let t = e.state;
  if (!e.output || e.avail_in !== 0 && !e.input || t.status === we && i !== C) return ee(e, e.avail_out === 0 ? Ve : H);
  let n = t.last_flush;
  if (t.last_flush = i, t.pending !== 0) {
    if (L(e), e.avail_out === 0) return t.last_flush = -1, I;
  } else if (e.avail_in === 0 && Dt(i) <= Dt(n) && i !== C) return ee(e, Ve);
  if (t.status === we && e.avail_in !== 0) return ee(e, Ve);
  if (t.status === _e && t.wrap === 0 && (t.status = q), t.status === _e) {
    let r2 = Ke + (t.w_bits - 8 << 4) << 8, a = -1;
    if (t.strategy >= Ne || t.level < 2 ? a = 0 : t.level < 6 ? a = 1 : t.level === 6 ? a = 2 : a = 3, r2 |= a << 6, t.strstart !== 0 && (r2 |= Cn), r2 += 31 - r2 % 31, ue(t, r2), t.strstart !== 0 && (ue(t, e.adler >>> 16), ue(t, e.adler & 65535)), e.adler = 1, t.status = q, L(e), t.pending !== 0) return t.last_flush = -1, I;
  }
  if (t.status === xt) {
    if (e.adler = 0, z(t, 31), z(t, 139), z(t, 8), t.gzhead) z(t, (t.gzhead.text ? 1 : 0) + (t.gzhead.hcrc ? 2 : 0) + (t.gzhead.extra ? 4 : 0) + (t.gzhead.name ? 8 : 0) + (t.gzhead.comment ? 16 : 0)), z(t, t.gzhead.time & 255), z(t, t.gzhead.time >> 8 & 255), z(t, t.gzhead.time >> 16 & 255), z(t, t.gzhead.time >> 24 & 255), z(t, t.level === 9 ? 2 : t.strategy >= Ne || t.level < 2 ? 4 : 0), z(t, t.gzhead.os & 255), t.gzhead.extra && t.gzhead.extra.length && (z(t, t.gzhead.extra.length & 255), z(t, t.gzhead.extra.length >> 8 & 255)), t.gzhead.hcrc && (e.adler = Z(e.adler, t.pending_buf, t.pending, 0)), t.gzindex = 0, t.status = ht;
    else if (z(t, 0), z(t, 0), z(t, 0), z(t, 0), z(t, 0), z(t, t.level === 9 ? 2 : t.strategy >= Ne || t.level < 2 ? 4 : 0), z(t, $n), t.status = q, L(e), t.pending !== 0) return t.last_flush = -1, I;
  }
  if (t.status === ht) {
    if (t.gzhead.extra) {
      let r2 = t.pending, a = (t.gzhead.extra.length & 65535) - t.gzindex;
      for (; t.pending + a > t.pending_buf_size; ) {
        let f2 = t.pending_buf_size - t.pending;
        if (t.pending_buf.set(t.gzhead.extra.subarray(t.gzindex, t.gzindex + f2), t.pending), t.pending = t.pending_buf_size, t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2)), t.gzindex += f2, L(e), t.pending !== 0) return t.last_flush = -1, I;
        r2 = 0, a -= f2;
      }
      let o = new Uint8Array(t.gzhead.extra);
      t.pending_buf.set(o.subarray(t.gzindex, t.gzindex + a), t.pending), t.pending += a, t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2)), t.gzindex = 0;
    }
    t.status = dt;
  }
  if (t.status === dt) {
    if (t.gzhead.name) {
      let r2 = t.pending, a;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2)), L(e), t.pending !== 0) return t.last_flush = -1, I;
          r2 = 0;
        }
        t.gzindex < t.gzhead.name.length ? a = t.gzhead.name.charCodeAt(t.gzindex++) & 255 : a = 0, z(t, a);
      } while (a !== 0);
      t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2)), t.gzindex = 0;
    }
    t.status = st;
  }
  if (t.status === st) {
    if (t.gzhead.comment) {
      let r2 = t.pending, a;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2)), L(e), t.pending !== 0) return t.last_flush = -1, I;
          r2 = 0;
        }
        t.gzindex < t.gzhead.comment.length ? a = t.gzhead.comment.charCodeAt(t.gzindex++) & 255 : a = 0, z(t, a);
      } while (a !== 0);
      t.gzhead.hcrc && t.pending > r2 && (e.adler = Z(e.adler, t.pending_buf, t.pending - r2, r2));
    }
    t.status = ct;
  }
  if (t.status === ct) {
    if (t.gzhead.hcrc) {
      if (t.pending + 2 > t.pending_buf_size && (L(e), t.pending !== 0)) return t.last_flush = -1, I;
      z(t, e.adler & 255), z(t, e.adler >> 8 & 255), e.adler = 0;
    }
    if (t.status = q, L(e), t.pending !== 0) return t.last_flush = -1, I;
  }
  if (e.avail_in !== 0 || t.lookahead !== 0 || i !== W && t.status !== we) {
    let r2 = t.level === 0 ? yi(t, i) : t.strategy === Ne ? Bn(t, i) : t.strategy === mn ? Hn(t, i) : be[t.level].func(t, i);
    if ((r2 === ie || r2 === ce) && (t.status = we), r2 === O || r2 === ie) return e.avail_out === 0 && (t.last_flush = -1), I;
    if (r2 === se && (i === xn ? pn(t) : i !== Rt && (ot(t, 0, 0, false), i === vn && (Y(t.head), t.lookahead === 0 && (t.strstart = 0, t.block_start = 0, t.insert = 0))), L(e), e.avail_out === 0)) return t.last_flush = -1, I;
  }
  return i !== C ? I : t.wrap <= 0 ? Tt : (t.wrap === 2 ? (z(t, e.adler & 255), z(t, e.adler >> 8 & 255), z(t, e.adler >> 16 & 255), z(t, e.adler >> 24 & 255), z(t, e.total_in & 255), z(t, e.total_in >> 8 & 255), z(t, e.total_in >> 16 & 255), z(t, e.total_in >> 24 & 255)) : (ue(t, e.adler >>> 16), ue(t, e.adler & 65535)), L(e), t.wrap > 0 && (t.wrap = -t.wrap), t.pending !== 0 ? I : Tt);
};
var jn = (e) => {
  if (Te(e)) return H;
  let i = e.state.status;
  return e.state = null, i === q ? ee(e, kn) : I;
};
var Wn = (e, i) => {
  let t = i.length;
  if (Te(e)) return H;
  let n = e.state, r2 = n.wrap;
  if (r2 === 2 || r2 === 1 && n.status !== _e || n.lookahead) return H;
  if (r2 === 1 && (e.adler = me(e.adler, i, t, 0)), n.wrap = 0, t >= n.w_size) {
    r2 === 0 && (Y(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0);
    let c2 = new Uint8Array(n.w_size);
    c2.set(i.subarray(t - n.w_size, t), 0), i = c2, t = n.w_size;
  }
  let a = e.avail_in, o = e.next_in, f2 = e.input;
  for (e.avail_in = t, e.next_in = 0, e.input = i, he(n); n.lookahead >= v; ) {
    let c2 = n.strstart, l = n.lookahead - (v - 1);
    do
      n.ins_h = V(n, n.ins_h, n.window[c2 + v - 1]), n.prev[c2 & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = c2, c2++;
    while (--l);
    n.strstart = c2, n.lookahead = v - 1, he(n);
  }
  return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = v - 1, n.match_available = 0, e.next_in = o, e.input = f2, e.avail_in = a, n.wrap = r2, I;
};
var Vn = Yn;
var Jn = Si;
var Qn = zi;
var qn = mi;
var ea = Xn;
var ta = Gn;
var ia = jn;
var na = Wn;
var aa = "pako deflate (from Nodeca project)";
var pe = { deflateInit: Vn, deflateInit2: Jn, deflateReset: Qn, deflateResetKeep: qn, deflateSetHeader: ea, deflate: ta, deflateEnd: ia, deflateSetDictionary: na, deflateInfo: aa };
var ra = (e, i) => Object.prototype.hasOwnProperty.call(e, i);
var la = function(e) {
  let i = Array.prototype.slice.call(arguments, 1);
  for (; i.length; ) {
    let t = i.shift();
    if (t) {
      if (typeof t != "object") throw new TypeError(t + "must be non-object");
      for (let n in t) ra(t, n) && (e[n] = t[n]);
    }
  }
  return e;
};
var fa = (e) => {
  let i = 0;
  for (let n = 0, r2 = e.length; n < r2; n++) i += e[n].length;
  let t = new Uint8Array(i);
  for (let n = 0, r2 = 0, a = e.length; n < a; n++) {
    let o = e[n];
    t.set(o, r2), r2 += o.length;
  }
  return t;
};
var Pe = { assign: la, flattenChunks: fa };
var Ai = true;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Ai = false;
}
var ze = new Uint8Array(256);
for (let e = 0; e < 256; e++) ze[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
ze[254] = ze[254] = 1;
var oa = (e) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
  let i, t, n, r2, a, o = e.length, f2 = 0;
  for (r2 = 0; r2 < o; r2++) t = e.charCodeAt(r2), (t & 64512) === 55296 && r2 + 1 < o && (n = e.charCodeAt(r2 + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), r2++)), f2 += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (i = new Uint8Array(f2), a = 0, r2 = 0; a < f2; r2++) t = e.charCodeAt(r2), (t & 64512) === 55296 && r2 + 1 < o && (n = e.charCodeAt(r2 + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), r2++)), t < 128 ? i[a++] = t : t < 2048 ? (i[a++] = 192 | t >>> 6, i[a++] = 128 | t & 63) : t < 65536 ? (i[a++] = 224 | t >>> 12, i[a++] = 128 | t >>> 6 & 63, i[a++] = 128 | t & 63) : (i[a++] = 240 | t >>> 18, i[a++] = 128 | t >>> 12 & 63, i[a++] = 128 | t >>> 6 & 63, i[a++] = 128 | t & 63);
  return i;
};
var _a = (e, i) => {
  if (i < 65534 && e.subarray && Ai) return String.fromCharCode.apply(null, e.length === i ? e : e.subarray(0, i));
  let t = "";
  for (let n = 0; n < i; n++) t += String.fromCharCode(e[n]);
  return t;
};
var ha = (e, i) => {
  let t = i || e.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, i));
  let n, r2, a = new Array(t * 2);
  for (r2 = 0, n = 0; n < t; ) {
    let o = e[n++];
    if (o < 128) {
      a[r2++] = o;
      continue;
    }
    let f2 = ze[o];
    if (f2 > 4) {
      a[r2++] = 65533, n += f2 - 1;
      continue;
    }
    for (o &= f2 === 2 ? 31 : f2 === 3 ? 15 : 7; f2 > 1 && n < t; ) o = o << 6 | e[n++] & 63, f2--;
    if (f2 > 1) {
      a[r2++] = 65533;
      continue;
    }
    o < 65536 ? a[r2++] = o : (o -= 65536, a[r2++] = 55296 | o >> 10 & 1023, a[r2++] = 56320 | o & 1023);
  }
  return _a(a, r2);
};
var da = (e, i) => {
  i = i || e.length, i > e.length && (i = e.length);
  let t = i - 1;
  for (; t >= 0 && (e[t] & 192) === 128; ) t--;
  return t < 0 || t === 0 ? i : t + ze[e[t]] > i ? t : i;
};
var Se = { string2buf: oa, buf2string: ha, utf8border: da };
function sa() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Ri = sa;
var Ti = Object.prototype.toString;
var { Z_NO_FLUSH: ca, Z_SYNC_FLUSH: ua, Z_FULL_FLUSH: wa, Z_FINISH: ba, Z_OK: He, Z_STREAM_END: ga, Z_DEFAULT_COMPRESSION: pa, Z_DEFAULT_STRATEGY: xa, Z_DEFLATED: va } = ae;
function De(e) {
  this.options = Pe.assign({ level: pa, method: va, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: xa }, e || {});
  let i = this.options;
  i.raw && i.windowBits > 0 ? i.windowBits = -i.windowBits : i.gzip && i.windowBits > 0 && i.windowBits < 16 && (i.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new Ri(), this.strm.avail_out = 0;
  let t = pe.deflateInit2(this.strm, i.level, i.method, i.windowBits, i.memLevel, i.strategy);
  if (t !== He) throw new Error(te[t]);
  if (i.header && pe.deflateSetHeader(this.strm, i.header), i.dictionary) {
    let n;
    if (typeof i.dictionary == "string" ? n = Se.string2buf(i.dictionary) : Ti.call(i.dictionary) === "[object ArrayBuffer]" ? n = new Uint8Array(i.dictionary) : n = i.dictionary, t = pe.deflateSetDictionary(this.strm, n), t !== He) throw new Error(te[t]);
    this._dict_set = true;
  }
}
De.prototype.push = function(e, i) {
  let t = this.strm, n = this.options.chunkSize, r2, a;
  if (this.ended) return false;
  for (i === ~~i ? a = i : a = i === true ? ba : ca, typeof e == "string" ? t.input = Se.string2buf(e) : Ti.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    if (t.avail_out === 0 && (t.output = new Uint8Array(n), t.next_out = 0, t.avail_out = n), (a === ua || a === wa) && t.avail_out <= 6) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (r2 = pe.deflate(t, a), r2 === ga) return t.next_out > 0 && this.onData(t.output.subarray(0, t.next_out)), r2 = pe.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === He;
    if (t.avail_out === 0) {
      this.onData(t.output);
      continue;
    }
    if (a > 0 && t.next_out > 0) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (t.avail_in === 0) break;
  }
  return true;
};
De.prototype.onData = function(e) {
  this.chunks.push(e);
};
De.prototype.onEnd = function(e) {
  e === He && (this.result = Pe.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function vt(e, i) {
  let t = new De(i);
  if (t.push(e, true), t.err) throw t.msg || te[t.err];
  return t.result;
}
function ka(e, i) {
  return i = i || {}, i.raw = true, vt(e, i);
}
function Ea(e, i) {
  return i = i || {}, i.gzip = true, vt(e, i);
}
var ya = De;
var ma = vt;
var za = ka;
var Sa = Ea;
var Aa = ae;
var Ra = { Deflate: ya, deflate: ma, deflateRaw: za, gzip: Sa, constants: Aa };
var Le = 16209;
var Ta = 16191;
var Da = function(i, t) {
  let n, r2, a, o, f2, c2, l, _, y2, s, h2, u2, T, k, g2, S, p, d2, m, D, w2, A, E, b2, x = i.state;
  n = i.next_in, E = i.input, r2 = n + (i.avail_in - 5), a = i.next_out, b2 = i.output, o = a - (t - i.avail_out), f2 = a + (i.avail_out - 257), c2 = x.dmax, l = x.wsize, _ = x.whave, y2 = x.wnext, s = x.window, h2 = x.hold, u2 = x.bits, T = x.lencode, k = x.distcode, g2 = (1 << x.lenbits) - 1, S = (1 << x.distbits) - 1;
  e: do {
    u2 < 15 && (h2 += E[n++] << u2, u2 += 8, h2 += E[n++] << u2, u2 += 8), p = T[h2 & g2];
    t: for (; ; ) {
      if (d2 = p >>> 24, h2 >>>= d2, u2 -= d2, d2 = p >>> 16 & 255, d2 === 0) b2[a++] = p & 65535;
      else if (d2 & 16) {
        m = p & 65535, d2 &= 15, d2 && (u2 < d2 && (h2 += E[n++] << u2, u2 += 8), m += h2 & (1 << d2) - 1, h2 >>>= d2, u2 -= d2), u2 < 15 && (h2 += E[n++] << u2, u2 += 8, h2 += E[n++] << u2, u2 += 8), p = k[h2 & S];
        i: for (; ; ) {
          if (d2 = p >>> 24, h2 >>>= d2, u2 -= d2, d2 = p >>> 16 & 255, d2 & 16) {
            if (D = p & 65535, d2 &= 15, u2 < d2 && (h2 += E[n++] << u2, u2 += 8, u2 < d2 && (h2 += E[n++] << u2, u2 += 8)), D += h2 & (1 << d2) - 1, D > c2) {
              i.msg = "invalid distance too far back", x.mode = Le;
              break e;
            }
            if (h2 >>>= d2, u2 -= d2, d2 = a - o, D > d2) {
              if (d2 = D - d2, d2 > _ && x.sane) {
                i.msg = "invalid distance too far back", x.mode = Le;
                break e;
              }
              if (w2 = 0, A = s, y2 === 0) {
                if (w2 += l - d2, d2 < m) {
                  m -= d2;
                  do
                    b2[a++] = s[w2++];
                  while (--d2);
                  w2 = a - D, A = b2;
                }
              } else if (y2 < d2) {
                if (w2 += l + y2 - d2, d2 -= y2, d2 < m) {
                  m -= d2;
                  do
                    b2[a++] = s[w2++];
                  while (--d2);
                  if (w2 = 0, y2 < m) {
                    d2 = y2, m -= d2;
                    do
                      b2[a++] = s[w2++];
                    while (--d2);
                    w2 = a - D, A = b2;
                  }
                }
              } else if (w2 += y2 - d2, d2 < m) {
                m -= d2;
                do
                  b2[a++] = s[w2++];
                while (--d2);
                w2 = a - D, A = b2;
              }
              for (; m > 2; ) b2[a++] = A[w2++], b2[a++] = A[w2++], b2[a++] = A[w2++], m -= 3;
              m && (b2[a++] = A[w2++], m > 1 && (b2[a++] = A[w2++]));
            } else {
              w2 = a - D;
              do
                b2[a++] = b2[w2++], b2[a++] = b2[w2++], b2[a++] = b2[w2++], m -= 3;
              while (m > 2);
              m && (b2[a++] = b2[w2++], m > 1 && (b2[a++] = b2[w2++]));
            }
          } else if (d2 & 64) {
            i.msg = "invalid distance code", x.mode = Le;
            break e;
          } else {
            p = k[(p & 65535) + (h2 & (1 << d2) - 1)];
            continue i;
          }
          break;
        }
      } else if (d2 & 64) if (d2 & 32) {
        x.mode = Ta;
        break e;
      } else {
        i.msg = "invalid literal/length code", x.mode = Le;
        break e;
      }
      else {
        p = T[(p & 65535) + (h2 & (1 << d2) - 1)];
        continue t;
      }
      break;
    }
  } while (n < r2 && a < f2);
  m = u2 >> 3, n -= m, u2 -= m << 3, h2 &= (1 << u2) - 1, i.next_in = n, i.next_out = a, i.avail_in = n < r2 ? 5 + (r2 - n) : 5 - (n - r2), i.avail_out = a < f2 ? 257 + (f2 - a) : 257 - (a - f2), x.hold = h2, x.bits = u2;
};
var fe = 15;
var Zt = 852;
var It = 592;
var Ot = 0;
var Qe = 1;
var Nt = 2;
var Za = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]);
var Ia = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]);
var Oa = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]);
var Na = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
var La = (e, i, t, n, r2, a, o, f2) => {
  let c2 = f2.bits, l = 0, _ = 0, y2 = 0, s = 0, h2 = 0, u2 = 0, T = 0, k = 0, g2 = 0, S = 0, p, d2, m, D, w2, A = null, E, b2 = new Uint16Array(fe + 1), x = new Uint16Array(fe + 1), J = null, Et, Ie, Oe;
  for (l = 0; l <= fe; l++) b2[l] = 0;
  for (_ = 0; _ < n; _++) b2[i[t + _]]++;
  for (h2 = c2, s = fe; s >= 1 && b2[s] === 0; s--) ;
  if (h2 > s && (h2 = s), s === 0) return r2[a++] = 1 << 24 | 64 << 16 | 0, r2[a++] = 1 << 24 | 64 << 16 | 0, f2.bits = 1, 0;
  for (y2 = 1; y2 < s && b2[y2] === 0; y2++) ;
  for (h2 < y2 && (h2 = y2), k = 1, l = 1; l <= fe; l++) if (k <<= 1, k -= b2[l], k < 0) return -1;
  if (k > 0 && (e === Ot || s !== 1)) return -1;
  for (x[1] = 0, l = 1; l < fe; l++) x[l + 1] = x[l] + b2[l];
  for (_ = 0; _ < n; _++) i[t + _] !== 0 && (o[x[i[t + _]]++] = _);
  if (e === Ot ? (A = J = o, E = 20) : e === Qe ? (A = Za, J = Ia, E = 257) : (A = Oa, J = Na, E = 0), S = 0, _ = 0, l = y2, w2 = a, u2 = h2, T = 0, m = -1, g2 = 1 << h2, D = g2 - 1, e === Qe && g2 > Zt || e === Nt && g2 > It) return 1;
  for (; ; ) {
    Et = l - T, o[_] + 1 < E ? (Ie = 0, Oe = o[_]) : o[_] >= E ? (Ie = J[o[_] - E], Oe = A[o[_] - E]) : (Ie = 96, Oe = 0), p = 1 << l - T, d2 = 1 << u2, y2 = d2;
    do
      d2 -= p, r2[w2 + (S >> T) + d2] = Et << 24 | Ie << 16 | Oe | 0;
    while (d2 !== 0);
    for (p = 1 << l - 1; S & p; ) p >>= 1;
    if (p !== 0 ? (S &= p - 1, S += p) : S = 0, _++, --b2[l] === 0) {
      if (l === s) break;
      l = i[t + o[_]];
    }
    if (l > h2 && (S & D) !== m) {
      for (T === 0 && (T = h2), w2 += y2, u2 = l - T, k = 1 << u2; u2 + T < s && (k -= b2[u2 + T], !(k <= 0)); ) u2++, k <<= 1;
      if (g2 += 1 << u2, e === Qe && g2 > Zt || e === Nt && g2 > It) return 1;
      m = S & D, r2[m] = h2 << 24 | u2 << 16 | w2 - a | 0;
    }
  }
  return S !== 0 && (r2[w2 + S] = l - T << 24 | 64 << 16 | 0), f2.bits = h2, 0;
};
var xe = La;
var Ua = 0;
var Di = 1;
var Zi = 2;
var { Z_FINISH: Lt, Z_BLOCK: Ca, Z_TREES: Ue, Z_OK: ne, Z_STREAM_END: $a, Z_NEED_DICT: Fa, Z_STREAM_ERROR: $, Z_DATA_ERROR: Ii, Z_MEM_ERROR: Oi, Z_BUF_ERROR: Ma, Z_DEFLATED: Ut } = ae;
var Xe = 16180;
var Ct = 16181;
var $t = 16182;
var Ft = 16183;
var Mt = 16184;
var Ht = 16185;
var Bt = 16186;
var Kt = 16187;
var Pt = 16188;
var Xt = 16189;
var Be = 16190;
var K = 16191;
var qe = 16192;
var Yt = 16193;
var et = 16194;
var Gt = 16195;
var jt = 16196;
var Wt = 16197;
var Vt = 16198;
var Ce = 16199;
var $e = 16200;
var Jt = 16201;
var Qt = 16202;
var qt = 16203;
var ei = 16204;
var ti = 16205;
var tt = 16206;
var ii = 16207;
var ni = 16208;
var R = 16209;
var Ni = 16210;
var Li = 16211;
var Ha = 852;
var Ba = 592;
var Ka = 15;
var Pa = Ka;
var ai = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
function Xa() {
  this.strm = null, this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
var re = (e) => {
  if (!e) return 1;
  let i = e.state;
  return !i || i.strm !== e || i.mode < Xe || i.mode > Li ? 1 : 0;
};
var Ui = (e) => {
  if (re(e)) return $;
  let i = e.state;
  return e.total_in = e.total_out = i.total = 0, e.msg = "", i.wrap && (e.adler = i.wrap & 1), i.mode = Xe, i.last = 0, i.havedict = 0, i.flags = -1, i.dmax = 32768, i.head = null, i.hold = 0, i.bits = 0, i.lencode = i.lendyn = new Int32Array(Ha), i.distcode = i.distdyn = new Int32Array(Ba), i.sane = 1, i.back = -1, ne;
};
var Ci = (e) => {
  if (re(e)) return $;
  let i = e.state;
  return i.wsize = 0, i.whave = 0, i.wnext = 0, Ui(e);
};
var $i = (e, i) => {
  let t;
  if (re(e)) return $;
  let n = e.state;
  return i < 0 ? (t = 0, i = -i) : (t = (i >> 4) + 5, i < 48 && (i &= 15)), i && (i < 8 || i > 15) ? $ : (n.window !== null && n.wbits !== i && (n.window = null), n.wrap = t, n.wbits = i, Ci(e));
};
var Fi = (e, i) => {
  if (!e) return $;
  let t = new Xa();
  e.state = t, t.strm = e, t.window = null, t.mode = Xe;
  let n = $i(e, i);
  return n !== ne && (e.state = null), n;
};
var Ya = (e) => Fi(e, Pa);
var ri = true;
var it;
var nt;
var Ga = (e) => {
  if (ri) {
    it = new Int32Array(512), nt = new Int32Array(32);
    let i = 0;
    for (; i < 144; ) e.lens[i++] = 8;
    for (; i < 256; ) e.lens[i++] = 9;
    for (; i < 280; ) e.lens[i++] = 7;
    for (; i < 288; ) e.lens[i++] = 8;
    for (xe(Di, e.lens, 0, 288, it, 0, e.work, { bits: 9 }), i = 0; i < 32; ) e.lens[i++] = 5;
    xe(Zi, e.lens, 0, 32, nt, 0, e.work, { bits: 5 }), ri = false;
  }
  e.lencode = it, e.lenbits = 9, e.distcode = nt, e.distbits = 5;
};
var Mi = (e, i, t, n) => {
  let r2, a = e.state;
  return a.window === null && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), n >= a.wsize ? (a.window.set(i.subarray(t - a.wsize, t), 0), a.wnext = 0, a.whave = a.wsize) : (r2 = a.wsize - a.wnext, r2 > n && (r2 = n), a.window.set(i.subarray(t - n, t - n + r2), a.wnext), n -= r2, n ? (a.window.set(i.subarray(t - n, t), 0), a.wnext = n, a.whave = a.wsize) : (a.wnext += r2, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += r2))), 0;
};
var ja = (e, i) => {
  let t, n, r2, a, o, f2, c2, l, _, y2, s, h2, u2, T, k = 0, g2, S, p, d2, m, D, w2, A, E = new Uint8Array(4), b2, x, J = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  if (re(e) || !e.output || !e.input && e.avail_in !== 0) return $;
  t = e.state, t.mode === K && (t.mode = qe), o = e.next_out, r2 = e.output, c2 = e.avail_out, a = e.next_in, n = e.input, f2 = e.avail_in, l = t.hold, _ = t.bits, y2 = f2, s = c2, A = ne;
  e: for (; ; ) switch (t.mode) {
    case Xe:
      if (t.wrap === 0) {
        t.mode = qe;
        break;
      }
      for (; _ < 16; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if (t.wrap & 2 && l === 35615) {
        t.wbits === 0 && (t.wbits = 15), t.check = 0, E[0] = l & 255, E[1] = l >>> 8 & 255, t.check = Z(t.check, E, 2, 0), l = 0, _ = 0, t.mode = Ct;
        break;
      }
      if (t.head && (t.head.done = false), !(t.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
        e.msg = "incorrect header check", t.mode = R;
        break;
      }
      if ((l & 15) !== Ut) {
        e.msg = "unknown compression method", t.mode = R;
        break;
      }
      if (l >>>= 4, _ -= 4, w2 = (l & 15) + 8, t.wbits === 0 && (t.wbits = w2), w2 > 15 || w2 > t.wbits) {
        e.msg = "invalid window size", t.mode = R;
        break;
      }
      t.dmax = 1 << t.wbits, t.flags = 0, e.adler = t.check = 1, t.mode = l & 512 ? Xt : K, l = 0, _ = 0;
      break;
    case Ct:
      for (; _ < 16; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if (t.flags = l, (t.flags & 255) !== Ut) {
        e.msg = "unknown compression method", t.mode = R;
        break;
      }
      if (t.flags & 57344) {
        e.msg = "unknown header flags set", t.mode = R;
        break;
      }
      t.head && (t.head.text = l >> 8 & 1), t.flags & 512 && t.wrap & 4 && (E[0] = l & 255, E[1] = l >>> 8 & 255, t.check = Z(t.check, E, 2, 0)), l = 0, _ = 0, t.mode = $t;
    case $t:
      for (; _ < 32; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      t.head && (t.head.time = l), t.flags & 512 && t.wrap & 4 && (E[0] = l & 255, E[1] = l >>> 8 & 255, E[2] = l >>> 16 & 255, E[3] = l >>> 24 & 255, t.check = Z(t.check, E, 4, 0)), l = 0, _ = 0, t.mode = Ft;
    case Ft:
      for (; _ < 16; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      t.head && (t.head.xflags = l & 255, t.head.os = l >> 8), t.flags & 512 && t.wrap & 4 && (E[0] = l & 255, E[1] = l >>> 8 & 255, t.check = Z(t.check, E, 2, 0)), l = 0, _ = 0, t.mode = Mt;
    case Mt:
      if (t.flags & 1024) {
        for (; _ < 16; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        t.length = l, t.head && (t.head.extra_len = l), t.flags & 512 && t.wrap & 4 && (E[0] = l & 255, E[1] = l >>> 8 & 255, t.check = Z(t.check, E, 2, 0)), l = 0, _ = 0;
      } else t.head && (t.head.extra = null);
      t.mode = Ht;
    case Ht:
      if (t.flags & 1024 && (h2 = t.length, h2 > f2 && (h2 = f2), h2 && (t.head && (w2 = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Uint8Array(t.head.extra_len)), t.head.extra.set(n.subarray(a, a + h2), w2)), t.flags & 512 && t.wrap & 4 && (t.check = Z(t.check, n, h2, a)), f2 -= h2, a += h2, t.length -= h2), t.length)) break e;
      t.length = 0, t.mode = Bt;
    case Bt:
      if (t.flags & 2048) {
        if (f2 === 0) break e;
        h2 = 0;
        do
          w2 = n[a + h2++], t.head && w2 && t.length < 65536 && (t.head.name += String.fromCharCode(w2));
        while (w2 && h2 < f2);
        if (t.flags & 512 && t.wrap & 4 && (t.check = Z(t.check, n, h2, a)), f2 -= h2, a += h2, w2) break e;
      } else t.head && (t.head.name = null);
      t.length = 0, t.mode = Kt;
    case Kt:
      if (t.flags & 4096) {
        if (f2 === 0) break e;
        h2 = 0;
        do
          w2 = n[a + h2++], t.head && w2 && t.length < 65536 && (t.head.comment += String.fromCharCode(w2));
        while (w2 && h2 < f2);
        if (t.flags & 512 && t.wrap & 4 && (t.check = Z(t.check, n, h2, a)), f2 -= h2, a += h2, w2) break e;
      } else t.head && (t.head.comment = null);
      t.mode = Pt;
    case Pt:
      if (t.flags & 512) {
        for (; _ < 16; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        if (t.wrap & 4 && l !== (t.check & 65535)) {
          e.msg = "header crc mismatch", t.mode = R;
          break;
        }
        l = 0, _ = 0;
      }
      t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = true), e.adler = t.check = 0, t.mode = K;
      break;
    case Xt:
      for (; _ < 32; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      e.adler = t.check = ai(l), l = 0, _ = 0, t.mode = Be;
    case Be:
      if (t.havedict === 0) return e.next_out = o, e.avail_out = c2, e.next_in = a, e.avail_in = f2, t.hold = l, t.bits = _, Fa;
      e.adler = t.check = 1, t.mode = K;
    case K:
      if (i === Ca || i === Ue) break e;
    case qe:
      if (t.last) {
        l >>>= _ & 7, _ -= _ & 7, t.mode = tt;
        break;
      }
      for (; _ < 3; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      switch (t.last = l & 1, l >>>= 1, _ -= 1, l & 3) {
        case 0:
          t.mode = Yt;
          break;
        case 1:
          if (Ga(t), t.mode = Ce, i === Ue) {
            l >>>= 2, _ -= 2;
            break e;
          }
          break;
        case 2:
          t.mode = jt;
          break;
        case 3:
          e.msg = "invalid block type", t.mode = R;
      }
      l >>>= 2, _ -= 2;
      break;
    case Yt:
      for (l >>>= _ & 7, _ -= _ & 7; _ < 32; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if ((l & 65535) !== (l >>> 16 ^ 65535)) {
        e.msg = "invalid stored block lengths", t.mode = R;
        break;
      }
      if (t.length = l & 65535, l = 0, _ = 0, t.mode = et, i === Ue) break e;
    case et:
      t.mode = Gt;
    case Gt:
      if (h2 = t.length, h2) {
        if (h2 > f2 && (h2 = f2), h2 > c2 && (h2 = c2), h2 === 0) break e;
        r2.set(n.subarray(a, a + h2), o), f2 -= h2, a += h2, c2 -= h2, o += h2, t.length -= h2;
        break;
      }
      t.mode = K;
      break;
    case jt:
      for (; _ < 14; ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if (t.nlen = (l & 31) + 257, l >>>= 5, _ -= 5, t.ndist = (l & 31) + 1, l >>>= 5, _ -= 5, t.ncode = (l & 15) + 4, l >>>= 4, _ -= 4, t.nlen > 286 || t.ndist > 30) {
        e.msg = "too many length or distance symbols", t.mode = R;
        break;
      }
      t.have = 0, t.mode = Wt;
    case Wt:
      for (; t.have < t.ncode; ) {
        for (; _ < 3; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        t.lens[J[t.have++]] = l & 7, l >>>= 3, _ -= 3;
      }
      for (; t.have < 19; ) t.lens[J[t.have++]] = 0;
      if (t.lencode = t.lendyn, t.lenbits = 7, b2 = { bits: t.lenbits }, A = xe(Ua, t.lens, 0, 19, t.lencode, 0, t.work, b2), t.lenbits = b2.bits, A) {
        e.msg = "invalid code lengths set", t.mode = R;
        break;
      }
      t.have = 0, t.mode = Vt;
    case Vt:
      for (; t.have < t.nlen + t.ndist; ) {
        for (; k = t.lencode[l & (1 << t.lenbits) - 1], g2 = k >>> 24, S = k >>> 16 & 255, p = k & 65535, !(g2 <= _); ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        if (p < 16) l >>>= g2, _ -= g2, t.lens[t.have++] = p;
        else {
          if (p === 16) {
            for (x = g2 + 2; _ < x; ) {
              if (f2 === 0) break e;
              f2--, l += n[a++] << _, _ += 8;
            }
            if (l >>>= g2, _ -= g2, t.have === 0) {
              e.msg = "invalid bit length repeat", t.mode = R;
              break;
            }
            w2 = t.lens[t.have - 1], h2 = 3 + (l & 3), l >>>= 2, _ -= 2;
          } else if (p === 17) {
            for (x = g2 + 3; _ < x; ) {
              if (f2 === 0) break e;
              f2--, l += n[a++] << _, _ += 8;
            }
            l >>>= g2, _ -= g2, w2 = 0, h2 = 3 + (l & 7), l >>>= 3, _ -= 3;
          } else {
            for (x = g2 + 7; _ < x; ) {
              if (f2 === 0) break e;
              f2--, l += n[a++] << _, _ += 8;
            }
            l >>>= g2, _ -= g2, w2 = 0, h2 = 11 + (l & 127), l >>>= 7, _ -= 7;
          }
          if (t.have + h2 > t.nlen + t.ndist) {
            e.msg = "invalid bit length repeat", t.mode = R;
            break;
          }
          for (; h2--; ) t.lens[t.have++] = w2;
        }
      }
      if (t.mode === R) break;
      if (t.lens[256] === 0) {
        e.msg = "invalid code -- missing end-of-block", t.mode = R;
        break;
      }
      if (t.lenbits = 9, b2 = { bits: t.lenbits }, A = xe(Di, t.lens, 0, t.nlen, t.lencode, 0, t.work, b2), t.lenbits = b2.bits, A) {
        e.msg = "invalid literal/lengths set", t.mode = R;
        break;
      }
      if (t.distbits = 6, t.distcode = t.distdyn, b2 = { bits: t.distbits }, A = xe(Zi, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, b2), t.distbits = b2.bits, A) {
        e.msg = "invalid distances set", t.mode = R;
        break;
      }
      if (t.mode = Ce, i === Ue) break e;
    case Ce:
      t.mode = $e;
    case $e:
      if (f2 >= 6 && c2 >= 258) {
        e.next_out = o, e.avail_out = c2, e.next_in = a, e.avail_in = f2, t.hold = l, t.bits = _, Da(e, s), o = e.next_out, r2 = e.output, c2 = e.avail_out, a = e.next_in, n = e.input, f2 = e.avail_in, l = t.hold, _ = t.bits, t.mode === K && (t.back = -1);
        break;
      }
      for (t.back = 0; k = t.lencode[l & (1 << t.lenbits) - 1], g2 = k >>> 24, S = k >>> 16 & 255, p = k & 65535, !(g2 <= _); ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if (S && !(S & 240)) {
        for (d2 = g2, m = S, D = p; k = t.lencode[D + ((l & (1 << d2 + m) - 1) >> d2)], g2 = k >>> 24, S = k >>> 16 & 255, p = k & 65535, !(d2 + g2 <= _); ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        l >>>= d2, _ -= d2, t.back += d2;
      }
      if (l >>>= g2, _ -= g2, t.back += g2, t.length = p, S === 0) {
        t.mode = ti;
        break;
      }
      if (S & 32) {
        t.back = -1, t.mode = K;
        break;
      }
      if (S & 64) {
        e.msg = "invalid literal/length code", t.mode = R;
        break;
      }
      t.extra = S & 15, t.mode = Jt;
    case Jt:
      if (t.extra) {
        for (x = t.extra; _ < x; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        t.length += l & (1 << t.extra) - 1, l >>>= t.extra, _ -= t.extra, t.back += t.extra;
      }
      t.was = t.length, t.mode = Qt;
    case Qt:
      for (; k = t.distcode[l & (1 << t.distbits) - 1], g2 = k >>> 24, S = k >>> 16 & 255, p = k & 65535, !(g2 <= _); ) {
        if (f2 === 0) break e;
        f2--, l += n[a++] << _, _ += 8;
      }
      if (!(S & 240)) {
        for (d2 = g2, m = S, D = p; k = t.distcode[D + ((l & (1 << d2 + m) - 1) >> d2)], g2 = k >>> 24, S = k >>> 16 & 255, p = k & 65535, !(d2 + g2 <= _); ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        l >>>= d2, _ -= d2, t.back += d2;
      }
      if (l >>>= g2, _ -= g2, t.back += g2, S & 64) {
        e.msg = "invalid distance code", t.mode = R;
        break;
      }
      t.offset = p, t.extra = S & 15, t.mode = qt;
    case qt:
      if (t.extra) {
        for (x = t.extra; _ < x; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        t.offset += l & (1 << t.extra) - 1, l >>>= t.extra, _ -= t.extra, t.back += t.extra;
      }
      if (t.offset > t.dmax) {
        e.msg = "invalid distance too far back", t.mode = R;
        break;
      }
      t.mode = ei;
    case ei:
      if (c2 === 0) break e;
      if (h2 = s - c2, t.offset > h2) {
        if (h2 = t.offset - h2, h2 > t.whave && t.sane) {
          e.msg = "invalid distance too far back", t.mode = R;
          break;
        }
        h2 > t.wnext ? (h2 -= t.wnext, u2 = t.wsize - h2) : u2 = t.wnext - h2, h2 > t.length && (h2 = t.length), T = t.window;
      } else T = r2, u2 = o - t.offset, h2 = t.length;
      h2 > c2 && (h2 = c2), c2 -= h2, t.length -= h2;
      do
        r2[o++] = T[u2++];
      while (--h2);
      t.length === 0 && (t.mode = $e);
      break;
    case ti:
      if (c2 === 0) break e;
      r2[o++] = t.length, c2--, t.mode = $e;
      break;
    case tt:
      if (t.wrap) {
        for (; _ < 32; ) {
          if (f2 === 0) break e;
          f2--, l |= n[a++] << _, _ += 8;
        }
        if (s -= c2, e.total_out += s, t.total += s, t.wrap & 4 && s && (e.adler = t.check = t.flags ? Z(t.check, r2, s, o - s) : me(t.check, r2, s, o - s)), s = c2, t.wrap & 4 && (t.flags ? l : ai(l)) !== t.check) {
          e.msg = "incorrect data check", t.mode = R;
          break;
        }
        l = 0, _ = 0;
      }
      t.mode = ii;
    case ii:
      if (t.wrap && t.flags) {
        for (; _ < 32; ) {
          if (f2 === 0) break e;
          f2--, l += n[a++] << _, _ += 8;
        }
        if (t.wrap & 4 && l !== (t.total & 4294967295)) {
          e.msg = "incorrect length check", t.mode = R;
          break;
        }
        l = 0, _ = 0;
      }
      t.mode = ni;
    case ni:
      A = $a;
      break e;
    case R:
      A = Ii;
      break e;
    case Ni:
      return Oi;
    case Li:
    default:
      return $;
  }
  return e.next_out = o, e.avail_out = c2, e.next_in = a, e.avail_in = f2, t.hold = l, t.bits = _, (t.wsize || s !== e.avail_out && t.mode < R && (t.mode < tt || i !== Lt)) && Mi(e, e.output, e.next_out, s - e.avail_out), y2 -= e.avail_in, s -= e.avail_out, e.total_in += y2, e.total_out += s, t.total += s, t.wrap & 4 && s && (e.adler = t.check = t.flags ? Z(t.check, r2, s, e.next_out - s) : me(t.check, r2, s, e.next_out - s)), e.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === K ? 128 : 0) + (t.mode === Ce || t.mode === et ? 256 : 0), (y2 === 0 && s === 0 || i === Lt) && A === ne && (A = Ma), A;
};
var Wa = (e) => {
  if (re(e)) return $;
  let i = e.state;
  return i.window && (i.window = null), e.state = null, ne;
};
var Va = (e, i) => {
  if (re(e)) return $;
  let t = e.state;
  return t.wrap & 2 ? (t.head = i, i.done = false, ne) : $;
};
var Ja = (e, i) => {
  let t = i.length, n, r2, a;
  return re(e) || (n = e.state, n.wrap !== 0 && n.mode !== Be) ? $ : n.mode === Be && (r2 = 1, r2 = me(r2, i, t, 0), r2 !== n.check) ? Ii : (a = Mi(e, i, t, t), a ? (n.mode = Ni, Oi) : (n.havedict = 1, ne));
};
var Qa = Ci;
var qa = $i;
var er = Ui;
var tr = Ya;
var ir = Fi;
var nr = ja;
var ar = Wa;
var rr = Va;
var lr = Ja;
var fr = "pako inflate (from Nodeca project)";
var X = { inflateReset: Qa, inflateReset2: qa, inflateResetKeep: er, inflateInit: tr, inflateInit2: ir, inflate: nr, inflateEnd: ar, inflateGetHeader: rr, inflateSetDictionary: lr, inflateInfo: fr };
function or() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
}
var _r = or;
var Hi = Object.prototype.toString;
var { Z_NO_FLUSH: hr, Z_FINISH: dr, Z_OK: Ae, Z_STREAM_END: at, Z_NEED_DICT: rt, Z_STREAM_ERROR: sr, Z_DATA_ERROR: li, Z_MEM_ERROR: cr } = ae;
function Ze(e) {
  this.options = Pe.assign({ chunkSize: 1024 * 64, windowBits: 15, to: "" }, e || {});
  let i = this.options;
  i.raw && i.windowBits >= 0 && i.windowBits < 16 && (i.windowBits = -i.windowBits, i.windowBits === 0 && (i.windowBits = -15)), i.windowBits >= 0 && i.windowBits < 16 && !(e && e.windowBits) && (i.windowBits += 32), i.windowBits > 15 && i.windowBits < 48 && (i.windowBits & 15 || (i.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new Ri(), this.strm.avail_out = 0;
  let t = X.inflateInit2(this.strm, i.windowBits);
  if (t !== Ae) throw new Error(te[t]);
  if (this.header = new _r(), X.inflateGetHeader(this.strm, this.header), i.dictionary && (typeof i.dictionary == "string" ? i.dictionary = Se.string2buf(i.dictionary) : Hi.call(i.dictionary) === "[object ArrayBuffer]" && (i.dictionary = new Uint8Array(i.dictionary)), i.raw && (t = X.inflateSetDictionary(this.strm, i.dictionary), t !== Ae))) throw new Error(te[t]);
}
Ze.prototype.push = function(e, i) {
  let t = this.strm, n = this.options.chunkSize, r2 = this.options.dictionary, a, o, f2;
  if (this.ended) return false;
  for (i === ~~i ? o = i : o = i === true ? dr : hr, Hi.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    for (t.avail_out === 0 && (t.output = new Uint8Array(n), t.next_out = 0, t.avail_out = n), a = X.inflate(t, o), a === rt && r2 && (a = X.inflateSetDictionary(t, r2), a === Ae ? a = X.inflate(t, o) : a === li && (a = rt)); t.avail_in > 0 && a === at && t.state.wrap > 0 && e[t.next_in] !== 0; ) X.inflateReset(t), a = X.inflate(t, o);
    switch (a) {
      case sr:
      case li:
      case rt:
      case cr:
        return this.onEnd(a), this.ended = true, false;
    }
    if (f2 = t.avail_out, t.next_out && (t.avail_out === 0 || a === at)) if (this.options.to === "string") {
      let c2 = Se.utf8border(t.output, t.next_out), l = t.next_out - c2, _ = Se.buf2string(t.output, c2);
      t.next_out = l, t.avail_out = n - l, l && t.output.set(t.output.subarray(c2, c2 + l), 0), this.onData(_);
    } else this.onData(t.output.length === t.next_out ? t.output : t.output.subarray(0, t.next_out));
    if (!(a === Ae && f2 === 0)) {
      if (a === at) return a = X.inflateEnd(this.strm), this.onEnd(a), this.ended = true, true;
      if (t.avail_in === 0) break;
    }
  }
  return true;
};
Ze.prototype.onData = function(e) {
  this.chunks.push(e);
};
Ze.prototype.onEnd = function(e) {
  e === Ae && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Pe.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function kt(e, i) {
  let t = new Ze(i);
  if (t.push(e), t.err) throw t.msg || te[t.err];
  return t.result;
}
function ur(e, i) {
  return i = i || {}, i.raw = true, kt(e, i);
}
var wr = Ze;
var br = kt;
var gr = ur;
var pr = kt;
var xr = ae;
var vr = { Inflate: wr, inflate: br, inflateRaw: gr, ungzip: pr, constants: xr };
var { Deflate: kr, deflate: Er, deflateRaw: yr, gzip: mr } = Ra;
var { Inflate: zr, inflate: Sr, inflateRaw: Ar, ungzip: Rr } = vr;
var Dr = Er;
var Or = zr;
var Nr = Sr;

// src/helpers/crc.ts
var crcTable = [];
for (let n = 0; n < 256; n++) {
  let c2 = n;
  for (let k = 0; k < 8; k++) {
    if (c2 & 1) {
      c2 = 3988292384 ^ c2 >>> 1;
    } else {
      c2 = c2 >>> 1;
    }
  }
  crcTable[n] = c2;
}
var initialCrc = 4294967295;
function updateCrc(currentCrc, data, length) {
  let c2 = currentCrc;
  for (let n = 0; n < length; n++) {
    c2 = crcTable[(c2 ^ data[n]) & 255] ^ c2 >>> 8;
  }
  return c2;
}
function crc(data, length) {
  return (updateCrc(initialCrc, data, length) ^ initialCrc) >>> 0;
}
function checkCrc(buffer, crcLength, chunkName) {
  const expectedCrc = buffer.readUint32();
  const actualCrc = crc(
    new Uint8Array(
      buffer.buffer,
      buffer.byteOffset + buffer.offset - crcLength - 4,
      crcLength
    ),
    crcLength
  );
  if (actualCrc !== expectedCrc) {
    throw new Error(
      `CRC mismatch for chunk ${chunkName}. Expected ${expectedCrc}, found ${actualCrc}`
    );
  }
}
function writeCrc(buffer, length) {
  buffer.writeUint32(
    crc(
      new Uint8Array(
        buffer.buffer,
        buffer.byteOffset + buffer.offset - length,
        length
      ),
      length
    )
  );
}

// src/helpers/unfilter.ts
function unfilterNone(currentLine, newLine, bytesPerLine) {
  for (let i = 0; i < bytesPerLine; i++) {
    newLine[i] = currentLine[i];
  }
}
function unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel) {
  let i = 0;
  for (; i < bytesPerPixel; i++) {
    newLine[i] = currentLine[i];
  }
  for (; i < bytesPerLine; i++) {
    newLine[i] = currentLine[i] + newLine[i - bytesPerPixel] & 255;
  }
}
function unfilterUp(currentLine, newLine, prevLine, bytesPerLine) {
  let i = 0;
  if (prevLine.length === 0) {
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i];
    }
  } else {
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i] + prevLine[i] & 255;
    }
  }
}
function unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i = 0;
  if (prevLine.length === 0) {
    for (; i < bytesPerPixel; i++) {
      newLine[i] = currentLine[i];
    }
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i] + (newLine[i - bytesPerPixel] >> 1) & 255;
    }
  } else {
    for (; i < bytesPerPixel; i++) {
      newLine[i] = currentLine[i] + (prevLine[i] >> 1) & 255;
    }
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i] + (newLine[i - bytesPerPixel] + prevLine[i] >> 1) & 255;
    }
  }
}
function unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i = 0;
  if (prevLine.length === 0) {
    for (; i < bytesPerPixel; i++) {
      newLine[i] = currentLine[i];
    }
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i] + newLine[i - bytesPerPixel] & 255;
    }
  } else {
    for (; i < bytesPerPixel; i++) {
      newLine[i] = currentLine[i] + prevLine[i] & 255;
    }
    for (; i < bytesPerLine; i++) {
      newLine[i] = currentLine[i] + paethPredictor(
        newLine[i - bytesPerPixel],
        prevLine[i],
        prevLine[i - bytesPerPixel]
      ) & 255;
    }
  }
}
function paethPredictor(a, b2, c2) {
  const p = a + b2 - c2;
  const pa2 = Math.abs(p - a);
  const pb = Math.abs(p - b2);
  const pc = Math.abs(p - c2);
  if (pa2 <= pb && pa2 <= pc) return a;
  else if (pb <= pc) return b2;
  else return c2;
}

// src/helpers/decodeInterlaceNull.ts
var uint16 = new Uint16Array([255]);
var uint8 = new Uint8Array(uint16.buffer);
var osIsLittleEndian = uint8[0] === 255;
var empty = new Uint8Array(0);
function decodeInterlaceNull(params) {
  const { data, width, height, channels, depth } = params;
  const bytesPerPixel = channels * depth / 8;
  const bytesPerLine = width * bytesPerPixel;
  const newData = new Uint8Array(height * bytesPerLine);
  let prevLine = empty;
  let offset = 0;
  let currentLine;
  let newLine;
  for (let i = 0; i < height; i++) {
    currentLine = data.subarray(offset + 1, offset + 1 + bytesPerLine);
    newLine = newData.subarray(i * bytesPerLine, (i + 1) * bytesPerLine);
    switch (data[offset]) {
      case 0:
        unfilterNone(currentLine, newLine, bytesPerLine);
        break;
      case 1:
        unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel);
        break;
      case 2:
        unfilterUp(currentLine, newLine, prevLine, bytesPerLine);
        break;
      case 3:
        unfilterAverage(
          currentLine,
          newLine,
          prevLine,
          bytesPerLine,
          bytesPerPixel
        );
        break;
      case 4:
        unfilterPaeth(
          currentLine,
          newLine,
          prevLine,
          bytesPerLine,
          bytesPerPixel
        );
        break;
      default:
        throw new Error(`Unsupported filter: ${data[offset]}`);
    }
    prevLine = newLine;
    offset += bytesPerLine + 1;
  }
  if (depth === 16) {
    const uint16Data = new Uint16Array(newData.buffer);
    if (osIsLittleEndian) {
      for (let k = 0; k < uint16Data.length; k++) {
        uint16Data[k] = swap16(uint16Data[k]);
      }
    }
    return uint16Data;
  } else {
    return newData;
  }
}
function swap16(val) {
  return (val & 255) << 8 | val >> 8 & 255;
}

// src/helpers/signature.ts
var pngSignature = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
function writeSignature(buffer) {
  buffer.writeBytes(pngSignature);
}
function checkSignature(buffer) {
  if (!hasPngSignature(buffer.readBytes(pngSignature.length))) {
    throw new Error("wrong PNG signature");
  }
}
function hasPngSignature(array) {
  if (array.length < pngSignature.length) {
    return false;
  }
  for (let i = 0; i < pngSignature.length; i++) {
    if (array[i] !== pngSignature[i]) {
      return false;
    }
  }
  return true;
}

// src/helpers/text.ts
var textChunkName = "tEXt";
var NULL = 0;
var latin1Decoder = new TextDecoder("latin1");
function validateKeyword(keyword) {
  validateLatin1(keyword);
  if (keyword.length === 0 || keyword.length > 79) {
    throw new Error("keyword length must be between 1 and 79");
  }
}
var latin1Regex = /^[\u0000-\u00FF]*$/;
function validateLatin1(text) {
  if (!latin1Regex.test(text)) {
    throw new Error("invalid latin1 text");
  }
}
function decodetEXt(text, buffer, length) {
  const keyword = readKeyword(buffer);
  text[keyword] = readLatin1(buffer, length - keyword.length - 1);
}
function encodetEXt(buffer, keyword, text) {
  validateKeyword(keyword);
  validateLatin1(text);
  const length = keyword.length + 1 + text.length;
  buffer.writeUint32(length);
  buffer.writeChars(textChunkName);
  buffer.writeChars(keyword);
  buffer.writeByte(NULL);
  buffer.writeChars(text);
  writeCrc(buffer, length + 4);
}
function readKeyword(buffer) {
  buffer.mark();
  while (buffer.readByte() !== NULL) {
  }
  const end = buffer.offset;
  buffer.reset();
  const keyword = latin1Decoder.decode(
    buffer.readBytes(end - buffer.offset - 1)
  );
  buffer.skip(1);
  validateKeyword(keyword);
  return keyword;
}
function readLatin1(buffer, length) {
  return latin1Decoder.decode(buffer.readBytes(length));
}

// src/internalTypes.ts
var ColorType = {
  UNKNOWN: -1,
  GREYSCALE: 0,
  TRUECOLOUR: 2,
  INDEXED_COLOUR: 3,
  GREYSCALE_ALPHA: 4,
  TRUECOLOUR_ALPHA: 6
};
var CompressionMethod = {
  UNKNOWN: -1,
  DEFLATE: 0
};
var FilterMethod = {
  UNKNOWN: -1,
  ADAPTIVE: 0
};
var InterlaceMethod = {
  UNKNOWN: -1,
  NO_INTERLACE: 0,
  ADAM7: 1
};

// src/PngDecoder.ts
var PngDecoder = class extends d {
  _checkCrc;
  _inflator;
  _png;
  _end;
  _hasPalette;
  _palette;
  _hasTransparency;
  _transparency;
  _compressionMethod;
  _filterMethod;
  _interlaceMethod;
  _colorType;
  constructor(data, options = {}) {
    super(data);
    const { checkCrc: checkCrc2 = false } = options;
    this._checkCrc = checkCrc2;
    this._inflator = new Or();
    this._png = {
      width: -1,
      height: -1,
      channels: -1,
      data: new Uint8Array(0),
      depth: 1,
      text: {}
    };
    this._end = false;
    this._hasPalette = false;
    this._palette = [];
    this._hasTransparency = false;
    this._transparency = new Uint16Array(0);
    this._compressionMethod = CompressionMethod.UNKNOWN;
    this._filterMethod = FilterMethod.UNKNOWN;
    this._interlaceMethod = InterlaceMethod.UNKNOWN;
    this._colorType = ColorType.UNKNOWN;
    this.setBigEndian();
  }
  decode() {
    checkSignature(this);
    while (!this._end) {
      this.decodeChunk();
    }
    this.decodeImage();
    return this._png;
  }
  // https://www.w3.org/TR/PNG/#5Chunk-layout
  decodeChunk() {
    const length = this.readUint32();
    const type = this.readChars(4);
    const offset = this.offset;
    switch (type) {
      // 11.2 Critical chunks
      case "IHDR":
        this.decodeIHDR();
        break;
      case "PLTE":
        this.decodePLTE(length);
        break;
      case "IDAT":
        this.decodeIDAT(length);
        break;
      case "IEND":
        this._end = true;
        break;
      // 11.3 Ancillary chunks
      case "tRNS":
        this.decodetRNS(length);
        break;
      case "iCCP":
        this.decodeiCCP(length);
        break;
      case textChunkName:
        decodetEXt(this._png.text, this, length);
        break;
      case "pHYs":
        this.decodepHYs();
        break;
      default:
        this.skip(length);
        break;
    }
    if (this.offset - offset !== length) {
      throw new Error(`Length mismatch while decoding chunk ${type}`);
    }
    if (this._checkCrc) {
      checkCrc(this, length + 4, type);
    } else {
      this.skip(4);
    }
  }
  // https://www.w3.org/TR/PNG/#11IHDR
  decodeIHDR() {
    const image = this._png;
    image.width = this.readUint32();
    image.height = this.readUint32();
    image.depth = checkBitDepth(this.readUint8());
    const colorType = this.readUint8();
    this._colorType = colorType;
    let channels;
    switch (colorType) {
      case ColorType.GREYSCALE:
        channels = 1;
        break;
      case ColorType.TRUECOLOUR:
        channels = 3;
        break;
      case ColorType.INDEXED_COLOUR:
        channels = 1;
        break;
      case ColorType.GREYSCALE_ALPHA:
        channels = 2;
        break;
      case ColorType.TRUECOLOUR_ALPHA:
        channels = 4;
        break;
      // Kept for exhaustiveness.
      // eslint-disable-next-line unicorn/no-useless-switch-case
      case ColorType.UNKNOWN:
      default:
        throw new Error(`Unknown color type: ${colorType}`);
    }
    this._png.channels = channels;
    this._compressionMethod = this.readUint8();
    if (this._compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(
        `Unsupported compression method: ${this._compressionMethod}`
      );
    }
    this._filterMethod = this.readUint8();
    this._interlaceMethod = this.readUint8();
  }
  // https://www.w3.org/TR/PNG/#11PLTE
  decodePLTE(length) {
    if (length % 3 !== 0) {
      throw new RangeError(
        `PLTE field length must be a multiple of 3. Got ${length}`
      );
    }
    const l = length / 3;
    this._hasPalette = true;
    const palette = [];
    this._palette = palette;
    for (let i = 0; i < l; i++) {
      palette.push([this.readUint8(), this.readUint8(), this.readUint8()]);
    }
  }
  // https://www.w3.org/TR/PNG/#11IDAT
  decodeIDAT(length) {
    this._inflator.push(
      new Uint8Array(this.buffer, this.offset + this.byteOffset, length)
    );
    this.skip(length);
  }
  // https://www.w3.org/TR/PNG/#11tRNS
  decodetRNS(length) {
    switch (this._colorType) {
      case ColorType.GREYSCALE:
      case ColorType.TRUECOLOUR: {
        if (length % 2 !== 0) {
          throw new RangeError(
            `tRNS chunk length must be a multiple of 2. Got ${length}`
          );
        }
        if (length / 2 > this._png.width * this._png.height) {
          throw new Error(
            `tRNS chunk contains more alpha values than there are pixels (${length / 2} vs ${this._png.width * this._png.height})`
          );
        }
        this._hasTransparency = true;
        this._transparency = new Uint16Array(length / 2);
        for (let i = 0; i < length / 2; i++) {
          this._transparency[i] = this.readUint16();
        }
        break;
      }
      case ColorType.INDEXED_COLOUR: {
        if (length > this._palette.length) {
          throw new Error(
            `tRNS chunk contains more alpha values than there are palette colors (${length} vs ${this._palette.length})`
          );
        }
        let i = 0;
        for (; i < length; i++) {
          const alpha = this.readByte();
          this._palette[i].push(alpha);
        }
        for (; i < this._palette.length; i++) {
          this._palette[i].push(255);
        }
        break;
      }
      // Kept for exhaustiveness.
      /* eslint-disable unicorn/no-useless-switch-case */
      case ColorType.UNKNOWN:
      case ColorType.GREYSCALE_ALPHA:
      case ColorType.TRUECOLOUR_ALPHA:
      default: {
        throw new Error(
          `tRNS chunk is not supported for color type ${this._colorType}`
        );
      }
    }
  }
  // https://www.w3.org/TR/PNG/#11iCCP
  decodeiCCP(length) {
    const name = readKeyword(this);
    const compressionMethod = this.readUint8();
    if (compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(
        `Unsupported iCCP compression method: ${compressionMethod}`
      );
    }
    const compressedProfile = this.readBytes(length - name.length - 2);
    this._png.iccEmbeddedProfile = {
      name,
      profile: Nr(compressedProfile)
    };
  }
  // https://www.w3.org/TR/PNG/#11pHYs
  decodepHYs() {
    const ppuX = this.readUint32();
    const ppuY = this.readUint32();
    const unitSpecifier = this.readByte();
    this._png.resolution = { x: ppuX, y: ppuY, unit: unitSpecifier };
  }
  decodeImage() {
    if (this._inflator.err) {
      throw new Error(
        `Error while decompressing the data: ${this._inflator.err}`
      );
    }
    const data = this._inflator.result;
    if (this._filterMethod !== FilterMethod.ADAPTIVE) {
      throw new Error(`Filter method ${this._filterMethod} not supported`);
    }
    if (this._interlaceMethod === InterlaceMethod.NO_INTERLACE) {
      this._png.data = decodeInterlaceNull({
        data,
        width: this._png.width,
        height: this._png.height,
        channels: this._png.channels,
        depth: this._png.depth
      });
    } else {
      throw new Error(
        `Interlace method ${this._interlaceMethod} not supported`
      );
    }
    if (this._hasPalette) {
      this._png.palette = this._palette;
    }
    if (this._hasTransparency) {
      this._png.transparency = this._transparency;
    }
  }
};
function checkBitDepth(value) {
  if (value !== 1 && value !== 2 && value !== 4 && value !== 8 && value !== 16) {
    throw new Error(`invalid bit depth: ${value}`);
  }
  return value;
}

// src/PngEncoder.ts
var defaultZlibOptions = {
  level: 3
};
var PngEncoder = class extends d {
  _png;
  _zlibOptions;
  _colorType;
  constructor(data, options = {}) {
    super();
    this._colorType = ColorType.UNKNOWN;
    this._zlibOptions = { ...defaultZlibOptions, ...options.zlib };
    this._png = this._checkData(data);
    this.setBigEndian();
  }
  encode() {
    writeSignature(this);
    this.encodeIHDR();
    this.encodeData();
    if (this._png.text) {
      for (const [keyword, text] of Object.entries(this._png.text)) {
        encodetEXt(this, keyword, text);
      }
    }
    this.encodeIEND();
    return this.toArray();
  }
  // https://www.w3.org/TR/PNG/#11IHDR
  encodeIHDR() {
    this.writeUint32(13);
    this.writeChars("IHDR");
    this.writeUint32(this._png.width);
    this.writeUint32(this._png.height);
    this.writeByte(this._png.depth);
    this.writeByte(this._colorType);
    this.writeByte(CompressionMethod.DEFLATE);
    this.writeByte(FilterMethod.ADAPTIVE);
    this.writeByte(InterlaceMethod.NO_INTERLACE);
    writeCrc(this, 17);
  }
  // https://www.w3.org/TR/PNG/#11IEND
  encodeIEND() {
    this.writeUint32(0);
    this.writeChars("IEND");
    writeCrc(this, 4);
  }
  // https://www.w3.org/TR/PNG/#11IDAT
  encodeIDAT(data) {
    this.writeUint32(data.length);
    this.writeChars("IDAT");
    this.writeBytes(data);
    writeCrc(this, data.length + 4);
  }
  encodeData() {
    const { width, height, channels, depth, data } = this._png;
    const slotsPerLine = channels * width;
    const newData = new d().setBigEndian();
    let offset = 0;
    for (let i = 0; i < height; i++) {
      newData.writeByte(0);
      if (depth === 8) {
        offset = writeDataBytes(data, newData, slotsPerLine, offset);
      } else if (depth === 16) {
        offset = writeDataUint16(data, newData, slotsPerLine, offset);
      } else {
        throw new Error("unreachable");
      }
    }
    const buffer = newData.toArray();
    const compressed = Dr(buffer, this._zlibOptions);
    this.encodeIDAT(compressed);
  }
  _checkData(data) {
    const { colorType, channels, depth } = getColorType(data);
    const png = {
      width: checkInteger(data.width, "width"),
      height: checkInteger(data.height, "height"),
      channels,
      data: data.data,
      depth,
      text: data.text
    };
    this._colorType = colorType;
    const expectedSize = png.width * png.height * channels;
    if (png.data.length !== expectedSize) {
      throw new RangeError(
        `wrong data size. Found ${png.data.length}, expected ${expectedSize}`
      );
    }
    return png;
  }
};
function checkInteger(value, name) {
  if (Number.isInteger(value) && value > 0) {
    return value;
  }
  throw new TypeError(`${name} must be a positive integer`);
}
function getColorType(data) {
  const { channels = 4, depth = 8 } = data;
  if (channels !== 4 && channels !== 3 && channels !== 2 && channels !== 1) {
    throw new RangeError(`unsupported number of channels: ${channels}`);
  }
  if (depth !== 8 && depth !== 16) {
    throw new RangeError(`unsupported bit depth: ${depth}`);
  }
  const returnValue = {
    channels,
    depth,
    colorType: ColorType.UNKNOWN
  };
  switch (channels) {
    case 4:
      returnValue.colorType = ColorType.TRUECOLOUR_ALPHA;
      break;
    case 3:
      returnValue.colorType = ColorType.TRUECOLOUR;
      break;
    case 1:
      returnValue.colorType = ColorType.GREYSCALE;
      break;
    case 2:
      returnValue.colorType = ColorType.GREYSCALE_ALPHA;
      break;
    default:
      throw new Error("unsupported number of channels");
  }
  return returnValue;
}
function writeDataBytes(data, newData, slotsPerLine, offset) {
  for (let j2 = 0; j2 < slotsPerLine; j2++) {
    newData.writeByte(data[offset++]);
  }
  return offset;
}
function writeDataUint16(data, newData, slotsPerLine, offset) {
  for (let j2 = 0; j2 < slotsPerLine; j2++) {
    newData.writeUint16(data[offset++]);
  }
  return offset;
}

// src/types.ts
var ResolutionUnitSpecifier = /* @__PURE__ */ ((ResolutionUnitSpecifier2) => {
  ResolutionUnitSpecifier2[ResolutionUnitSpecifier2["UNKNOWN"] = 0] = "UNKNOWN";
  ResolutionUnitSpecifier2[ResolutionUnitSpecifier2["METRE"] = 1] = "METRE";
  return ResolutionUnitSpecifier2;
})(ResolutionUnitSpecifier || {});

// src/index.ts
function decodePng(data, options) {
  const decoder = new PngDecoder(data, options);
  return decoder.decode();
}
function encodePng(png, options) {
  const encoder = new PngEncoder(png, options);
  return encoder.encode();
}
export {
  ResolutionUnitSpecifier,
  decodePng as decode,
  encodePng as encode,
  hasPngSignature
};
/*! Bundled license information:

pako/dist/pako.esm.mjs:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)
*/