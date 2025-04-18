var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// https://esm.sh/pngparse@2.0.1/denonext/pngparse.mjs
import { Buffer as __Buffer$ } from "node:buffer";
import * as __0$ from "node:fs";
import * as __1$ from "node:stream";
import * as __2$ from "node:zlib";
var require2, K, L, O, Q2, V, X2, q, Y2, Z2, _, J, R, ie, se, ce, fe, oe;
var init_pngparse = __esm({
  "https://esm.sh/pngparse@2.0.1/denonext/pngparse.mjs"() {
    require2 = (n) => {
      const e = (m2) => typeof m2.default < "u" ? m2.default : m2, c = (m2) => Object.assign({ __esModule: true }, m2);
      switch (n) {
        case "node:fs":
          return e(__0$);
        case "node:stream":
          return e(__1$);
        case "node:zlib":
          return e(__2$);
        default:
          console.error('module "' + n + '" not found');
          return null;
      }
    };
    K = Object.create;
    L = Object.defineProperty;
    O = Object.getOwnPropertyDescriptor;
    Q2 = Object.getOwnPropertyNames;
    V = Object.getPrototypeOf;
    X2 = Object.prototype.hasOwnProperty;
    q = ((a) => typeof require2 < "u" ? require2 : typeof Proxy < "u" ? new Proxy(a, { get: (n, t) => (typeof require2 < "u" ? require2 : n)[t] }) : a)(function(a) {
      if (typeof require2 < "u") return require2.apply(this, arguments);
      throw Error('Dynamic require of "' + a + '" is not supported');
    });
    Y2 = (a, n) => () => (n || a((n = { exports: {} }).exports, n), n.exports);
    Z2 = (a, n, t, i) => {
      if (n && typeof n == "object" || typeof n == "function") for (let e of Q2(n)) !X2.call(a, e) && e !== t && L(a, e, { get: () => n[e], enumerable: !(i = O(n, e)) || i.enumerable });
      return a;
    };
    _ = (a, n, t) => (t = a != null ? K(V(a)) : {}, Z2(n || !a || !a.__esModule ? L(t, "default", { value: a, enumerable: true }) : t, a));
    J = Y2((U) => {
      var $2 = q("node:fs"), ee = q("node:stream"), re = q("node:zlib"), z3 = new __Buffer$("89504e470d0a1a0a", "hex");
      function W2(a, n, t, i, e) {
        this.width = a, this.height = n, this.channels = t, this.data = i, this.trailer = e;
      }
      W2.prototype.getPixel = function(a, n) {
        if (a = a | 0, n = n | 0, a < 0 || n < 0 || a >= this.width || n >= this.height) return 0;
        var t = (n * this.width + a) * this.channels, i, e, l2, y;
        switch (this.channels) {
          case 1:
            i = e = l2 = this.data[t], y = 255;
            break;
          case 2:
            i = e = l2 = this.data[t], y = this.data[t + 1];
            break;
          case 3:
            i = this.data[t], e = this.data[t + 1], l2 = this.data[t + 2], y = 255;
            break;
          case 4:
            i = this.data[t], e = this.data[t + 1], l2 = this.data[t + 2], y = this.data[t + 3];
            break;
        }
        return (i << 24 | e << 16 | l2 << 8 | y) >>> 0;
      };
      function te(a, n, t) {
        var i = a + n - t, e = Math.abs(i - a), l2 = Math.abs(i - n), y = Math.abs(i - t);
        return e <= l2 && e <= y ? a : l2 <= y ? n : t;
      }
      U.parseStream = function(a, n) {
        var t = re.createInflate(), i = 0, e = 0, l2 = new __Buffer$(13), y = 2, h = -1, u = 0, G2 = 0, j = 0, p, N3, A2, B, g2, M, f, S, w, C3, c, b, m2, H, x, k2, T, E2;
        function d2(o) {
          return a.destroy && a.destroy(), t.destroy && t.destroy(), n(o);
        }
        function F() {
          if (!--y) return n(void 0, new W2(N3, A2, E2, f, x));
        }
        a.on("error", d2), t.on("error", d2), a.on("end", function() {
          return a.destroy(), f ? x ? F() : d2(new Error("Corrupt PNG?")) : d2(new Error("Corrupt PNG?"));
        }), t.on("end", function() {
          return t.destroy && t.destroy(), u !== f.length ? d2(new Error("Too little pixel data! (Corrupt PNG?)")) : F();
        }), a.on("data", function(o) {
          if (a.readable) for (var s = o.length, r = 0, v, I; r !== s; ) switch (i) {
            case 0:
              if (o[r++] !== z3[e++]) return d2(new Error("Invalid PNG header."));
              e === z3.length && (i = 1, e = 0);
              break;
            case 1:
              if (s - r < 8 - e) o.copy(l2, e, r), e += s - r, r = s;
              else switch (o.copy(l2, e, r, r + 8 - e), r += 8 - e, e = 0, p = l2.readUInt32BE(0), l2.toString("ascii", 4, 8)) {
                case "IHDR":
                  i = 2;
                  break;
                case "PLTE":
                  if (M !== 3) i = 7;
                  else {
                    if (p % 3 !== 0) return d2(new Error("Invalid PLTE size."));
                    G2 = p / 3, k2 = new __Buffer$(p), i = 3;
                  }
                  break;
                case "tRNS":
                  if (M !== 3) return d2(new Error("tRNS for non-paletted images not yet supported."));
                  E2++, j = p, T = new __Buffer$(p), i = 4;
                  break;
                case "IDAT":
                  f || (f = new __Buffer$(N3 * A2 * E2)), i = 5;
                  break;
                case "IEND":
                  i = 6;
                  break;
                default:
                  i = 7;
                  break;
              }
              break;
            case 2:
              if (p !== 13) return d2(new Error("Invalid IHDR chunk."));
              if (s - r < p - e) o.copy(l2, e, r), e += s - r, r = s;
              else {
                if (o.copy(l2, e, r, r + p - e), l2.readUInt8(10) !== 0) return d2(new Error("Unsupported compression method."));
                if (l2.readUInt8(11) !== 0) return d2(new Error("Unsupported filter method."));
                if (l2.readUInt8(12) !== 0) return d2(new Error("Unsupported interlace method."));
                switch (r += p - e, i = 8, e = 0, N3 = l2.readUInt32BE(0), A2 = l2.readUInt32BE(4), B = l2.readUInt8(8), g2 = 255 / ((1 << B) - 1), M = l2.readUInt8(9), M) {
                  case 0:
                    S = 1, w = Math.ceil(B * 0.125), E2 = 1;
                    break;
                  case 2:
                    S = 3, w = Math.ceil(B * 0.375), E2 = 3;
                    break;
                  case 3:
                    S = 1, w = 1, E2 = 3;
                    break;
                  case 4:
                    S = 2, w = Math.ceil(B * 0.25), E2 = 2;
                    break;
                  case 6:
                    S = 4, w = Math.ceil(B * 0.5), E2 = 4;
                    break;
                  default:
                    return d2(new Error("Unsupported color type: " + M));
                }
                C3 = Math.ceil(N3 * B * S / 8), c = new __Buffer$(S), b = new __Buffer$(C3), m2 = new __Buffer$(C3), b.fill(0);
              }
              break;
            case 3:
              if (s - r < p - e) o.copy(k2, e, r), e += s - r, r = s;
              else for (o.copy(k2, e, r, r + p - e), r += p - e, i = 8, e = 0, E2 = 1, I = G2; I--; ) if (k2[I * 3 + 0] !== k2[I * 3 + 1] || k2[I * 3 + 0] !== k2[I * 3 + 2]) {
                E2 = 3;
                break;
              }
              break;
            case 4:
              s - r < p - e ? (o.copy(T, e, r), e += s - r, r = s) : (o.copy(T, e, r, r + p - e), r += p - e, i = 8, e = 0);
              break;
            case 5:
              s - r < p - e ? (t.write(o.slice(r)), e += s - r, r = s) : (t.write(o.slice(r, r + p - e)), r += p - e, i = 8, e = 0);
              break;
            case 6:
              if (p !== 0) return d2(new Error("Invalid IEND chunk."));
              s - r < 4 - e ? (e += s - r, r = s) : (x = new __Buffer$(0), r += 4 - e, i = 9, e = 0, t.end());
              break;
            case 7:
              s - r < p - e ? (e += s - r, r = s) : (r += p - e, i = 8, e = 0);
              break;
            case 8:
              s - r < 4 - e ? (e += s - r, r = s) : (r += 4 - e, i = 1, e = 0);
              break;
            case 9:
              v = new __Buffer$(e + s - r), x.copy(v), o.copy(v, e, r, s), x = v, e += s - r, r = s;
              break;
          }
        }), t.on("data", function(o) {
          if (t.readable) {
            var s = o.length, r, v, I, P3, D;
            for (r = 0; r !== s; ++r) {
              if (h === -1) H = o[r], v = b, b = m2, m2 = v;
              else switch (H) {
                case 0:
                  b[h] = o[r];
                  break;
                case 1:
                  b[h] = h < w ? o[r] : o[r] + b[h - w] & 255;
                  break;
                case 2:
                  b[h] = o[r] + m2[h] & 255;
                  break;
                case 3:
                  b[h] = o[r] + ((h < w ? m2[h] : b[h - w] + m2[h]) >>> 1) & 255;
                  break;
                case 4:
                  b[h] = o[r] + (h < w ? m2[h] : te(b[h - w], m2[h], m2[h - w])) & 255;
                  break;
                default:
                  return d2(new Error("Unsupported scanline filter: " + H));
              }
              if (++h === C3) {
                if (u === f.length) return d2(new Error("Too much pixel data! (Corrupt PNG?)"));
                for (P3 = 0, I = 0; I !== N3; ++I) {
                  for (D = 0; D !== S; ++P3, ++D) switch (B) {
                    case 1:
                      c[D] = b[P3 >>> 3] >> 7 - (P3 & 7) & 1;
                      break;
                    case 2:
                      c[D] = b[P3 >>> 2] >> (3 - (P3 & 3) << 1) & 3;
                      break;
                    case 4:
                      c[D] = b[P3 >>> 1] >> (1 - (P3 & 1) << 2) & 15;
                      break;
                    case 8:
                      c[D] = b[P3];
                      break;
                    default:
                      return d2(new Error("Unsupported bit depth: " + B));
                  }
                  switch (M) {
                    case 0:
                      f[u++] = c[0] * g2;
                      break;
                    case 2:
                      f[u++] = c[0] * g2, f[u++] = c[1] * g2, f[u++] = c[2] * g2;
                      break;
                    case 3:
                      if (c[0] >= G2) return d2(new Error("Invalid palette index."));
                      switch (E2) {
                        case 1:
                          f[u++] = k2[c[0] * 3];
                          break;
                        case 2:
                          f[u++] = k2[c[0] * 3], f[u++] = c[0] < j ? T[c[0]] : 255;
                          break;
                        case 3:
                          f[u++] = k2[c[0] * 3 + 0], f[u++] = k2[c[0] * 3 + 1], f[u++] = k2[c[0] * 3 + 2];
                          break;
                        case 4:
                          f[u++] = k2[c[0] * 3 + 0], f[u++] = k2[c[0] * 3 + 1], f[u++] = k2[c[0] * 3 + 2], f[u++] = c[0] < j ? T[c[0]] : 255;
                          break;
                      }
                      break;
                    case 4:
                      f[u++] = c[0] * g2, f[u++] = c[1] * g2;
                      break;
                    case 6:
                      f[u++] = c[0] * g2, f[u++] = c[1] * g2, f[u++] = c[2] * g2, f[u++] = c[3] * g2;
                      break;
                  }
                }
                h = -1;
              }
            }
          }
        });
      };
      U.parseFile = function(a, n) {
        return U.parseStream($2.createReadStream(a), n);
      };
      U.parseBuffer = function(a, n) {
        var t = new ee.Stream();
        t.readable = true, t.destroy = function() {
          t.readable = false;
        }, U.parseStream(t, n), t.emit("data", a), t.readable && t.emit("end");
      };
      U.parse = U.parseBuffer;
    });
    R = _(J());
    ({ parseStream: ie, parseFile: se, parseBuffer: ce, parse: fe } = R);
    oe = R.default ?? R;
  }
});

// https://esm.sh/pngparse@2.0.1
var init_pngparse_2_0 = __esm({
  "https://esm.sh/pngparse@2.0.1"() {
    init_pngparse();
    init_pngparse();
  }
});

// bundle_help/util/decompressPng.js
var decompressPng_exports = {};
__export(decompressPng_exports, {
  default: () => decompressPng
});
function decompressPng(data, callback) {
  var buffer = new Buffer(data, "base64");
  oe.parse(buffer, function(err, data2) {
    if (err) {
      console.warn("Cannot process PNG encoded message ");
    } else {
      var jsonData = data2.data.toString();
      callback(JSON.parse(jsonData));
    }
  });
}
var init_decompressPng = __esm({
  "bundle_help/util/decompressPng.js"() {
    init_pngparse_2_0();
  }
});

// bundle_help/util/shim/decompressPng.js
var decompressPng_exports2 = {};
__export(decompressPng_exports2, {
  default: () => decompressPng2
});
function decompressPng2(data, callback) {
  var image = new Image();
  image.onload = function() {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to create Canvas context!");
    }
    canvas.width = image.width;
    canvas.height = image.height;
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0);
    var imageData = context.getImageData(0, 0, image.width, image.height).data;
    var jsonData = "";
    for (var i = 0; i < imageData.length; i += 4) {
      jsonData += String.fromCharCode(
        imageData[i],
        imageData[i + 1],
        imageData[i + 2]
      );
    }
    callback(JSON.parse(jsonData));
  };
  image.src = "data:image/png;base64," + data;
}
var init_decompressPng2 = __esm({
  "bundle_help/util/shim/decompressPng.js"() {
  }
});

// ../../../../Library/Caches/deno/deno_esbuild/ws@8.18.1/node_modules/ws/browser.js
var require_browser = __commonJS({
  "../../../../Library/Caches/deno/deno_esbuild/ws@8.18.1/node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// bundle_help/core/index.js
var core_exports = {};
__export(core_exports, {
  Action: () => Action,
  Param: () => Param,
  Ros: () => Ros,
  Service: () => Service,
  Topic: () => Topic
});

// https://esm.sh/cbor-js@0.1.0/denonext/cbor-js.mjs
var N = Object.create;
var z = Object.defineProperty;
var Q = Object.getOwnPropertyDescriptor;
var X = Object.getOwnPropertyNames;
var Y = Object.getPrototypeOf;
var Z = Object.prototype.hasOwnProperty;
var $ = (x, o) => () => (o || x((o = { exports: {} }).exports, o), o.exports);
var l = (x, o, A2, d2) => {
  if (o && typeof o == "object" || typeof o == "function") for (let g2 of X(o)) !Z.call(x, g2) && g2 !== A2 && z(x, g2, { get: () => o[g2], enumerable: !(d2 = Q(o, g2)) || d2.enumerable });
  return x;
};
var C = (x, o, A2) => (A2 = x != null ? N(Y(x)) : {}, l(o || !x || !x.__esModule ? z(A2, "default", { value: x, enumerable: true }) : A2, x));
var G = $((E2, O3) => {
  (function(x, o) {
    "use strict";
    var A2 = Math.pow(2, -24), d2 = Math.pow(2, 32), g2 = Math.pow(2, 53);
    function H(F) {
      var p = new ArrayBuffer(256), U = new DataView(p), h, s = 0;
      function u(r) {
        for (var i = p.byteLength, e = s + r; i < e; ) i *= 2;
        if (i !== p.byteLength) {
          var n = U;
          p = new ArrayBuffer(i), U = new DataView(p);
          for (var c = s + 3 >> 2, t = 0; t < c; ++t) U.setUint32(t * 4, n.getUint32(t * 4));
        }
        return h = r, U;
      }
      function y() {
        s += h;
      }
      function S(r) {
        y(u(8).setFloat64(s, r));
      }
      function w(r) {
        y(u(1).setUint8(s, r));
      }
      function j(r) {
        for (var i = u(r.length), e = 0; e < r.length; ++e) i.setUint8(s + e, r[e]);
        y();
      }
      function a(r) {
        y(u(2).setUint16(s, r));
      }
      function m2(r) {
        y(u(4).setUint32(s, r));
      }
      function L3(r) {
        var i = r % d2, e = (r - i) / d2, n = u(8);
        n.setUint32(s, e), n.setUint32(s + 4, i), y();
      }
      function v(r, i) {
        i < 24 ? w(r << 5 | i) : i < 256 ? (w(r << 5 | 24), w(i)) : i < 65536 ? (w(r << 5 | 25), a(i)) : i < 4294967296 ? (w(r << 5 | 26), m2(i)) : (w(r << 5 | 27), L3(i));
      }
      function V2(r) {
        var i;
        if (r === false) return w(244);
        if (r === true) return w(245);
        if (r === null) return w(246);
        if (r === o) return w(247);
        switch (typeof r) {
          case "number":
            if (Math.floor(r) === r) {
              if (0 <= r && r <= g2) return v(0, r);
              if (-g2 <= r && r < 0) return v(1, -(r + 1));
            }
            return w(251), S(r);
          case "string":
            var e = [];
            for (i = 0; i < r.length; ++i) {
              var n = r.charCodeAt(i);
              n < 128 ? e.push(n) : n < 2048 ? (e.push(192 | n >> 6), e.push(128 | n & 63)) : n < 55296 ? (e.push(224 | n >> 12), e.push(128 | n >> 6 & 63), e.push(128 | n & 63)) : (n = (n & 1023) << 10, n |= r.charCodeAt(++i) & 1023, n += 65536, e.push(240 | n >> 18), e.push(128 | n >> 12 & 63), e.push(128 | n >> 6 & 63), e.push(128 | n & 63));
            }
            return v(3, e.length), j(e);
          default:
            var c;
            if (Array.isArray(r)) for (c = r.length, v(4, c), i = 0; i < c; ++i) V2(r[i]);
            else if (r instanceof Uint8Array) v(2, r.length), j(r);
            else {
              var t = Object.keys(r);
              for (c = t.length, v(5, c), i = 0; i < c; ++i) {
                var f = t[i];
                V2(f), V2(r[f]);
              }
            }
        }
      }
      if (V2(F), "slice" in p) return p.slice(0, s);
      for (var D = new ArrayBuffer(s), M = new DataView(D), b = 0; b < s; ++b) M.setUint8(b, U.getUint8(b));
      return D;
    }
    function J2(F, p, U) {
      var h = new DataView(F), s = 0;
      typeof p != "function" && (p = function(e) {
        return e;
      }), typeof U != "function" && (U = function() {
        return o;
      });
      function u(e, n) {
        return s += n, e;
      }
      function y(e) {
        return u(new Uint8Array(F, s, e), e);
      }
      function S() {
        var e = new ArrayBuffer(4), n = new DataView(e), c = m2(), t = c & 32768, f = c & 31744, B = c & 1023;
        if (f === 31744) f = 261120;
        else if (f !== 0) f += 114688;
        else if (B !== 0) return B * A2;
        return n.setUint32(0, t << 16 | f << 13 | B << 13), n.getFloat32(0);
      }
      function w() {
        return u(h.getFloat32(s), 4);
      }
      function j() {
        return u(h.getFloat64(s), 8);
      }
      function a() {
        return u(h.getUint8(s), 1);
      }
      function m2() {
        return u(h.getUint16(s), 2);
      }
      function L3() {
        return u(h.getUint32(s), 4);
      }
      function v() {
        return L3() * d2 + L3();
      }
      function V2() {
        return h.getUint8(s) !== 255 ? false : (s += 1, true);
      }
      function D(e) {
        if (e < 24) return e;
        if (e === 24) return a();
        if (e === 25) return m2();
        if (e === 26) return L3();
        if (e === 27) return v();
        if (e === 31) return -1;
        throw "Invalid length encoding";
      }
      function M(e) {
        var n = a();
        if (n === 255) return -1;
        var c = D(n & 31);
        if (c < 0 || n >> 5 !== e) throw "Invalid indefinite length element";
        return c;
      }
      function b(e, n) {
        for (var c = 0; c < n; ++c) {
          var t = a();
          t & 128 && (t < 224 ? (t = (t & 31) << 6 | a() & 63, n -= 1) : t < 240 ? (t = (t & 15) << 12 | (a() & 63) << 6 | a() & 63, n -= 2) : (t = (t & 15) << 18 | (a() & 63) << 12 | (a() & 63) << 6 | a() & 63, n -= 3)), t < 65536 ? e.push(t) : (t -= 65536, e.push(55296 | t >> 10), e.push(56320 | t & 1023));
        }
      }
      function r() {
        var e = a(), n = e >> 5, c = e & 31, t, f;
        if (n === 7) switch (c) {
          case 25:
            return S();
          case 26:
            return w();
          case 27:
            return j();
        }
        if (f = D(c), f < 0 && (n < 2 || 6 < n)) throw "Invalid length";
        switch (n) {
          case 0:
            return f;
          case 1:
            return -1 - f;
          case 2:
            if (f < 0) {
              for (var B = [], T = 0; (f = M(n)) >= 0; ) T += f, B.push(y(f));
              var q2 = new Uint8Array(T), I = 0;
              for (t = 0; t < B.length; ++t) q2.set(B[t], I), I += B[t].length;
              return q2;
            }
            return y(f);
          case 3:
            var W2 = [];
            if (f < 0) for (; (f = M(n)) >= 0; ) b(W2, f);
            else b(W2, f);
            return String.fromCharCode.apply(null, W2);
          case 4:
            var _2;
            if (f < 0) for (_2 = []; !V2(); ) _2.push(r());
            else for (_2 = new Array(f), t = 0; t < f; ++t) _2[t] = r();
            return _2;
          case 5:
            var k2 = {};
            for (t = 0; t < f || f < 0 && !V2(); ++t) {
              var K2 = r();
              k2[K2] = r();
            }
            return k2;
          case 6:
            return p(r(), f);
          case 7:
            switch (f) {
              case 20:
                return false;
              case 21:
                return true;
              case 22:
                return null;
              case 23:
                return o;
              default:
                return U(f);
            }
        }
      }
      var i = r();
      if (s !== F.byteLength) throw "Remaining bytes";
      return i;
    }
    var R2 = { encode: H, decode: J2 };
    typeof define == "function" && define.amd ? define("cbor/cbor", R2) : typeof O3 < "u" && O3.exports ? O3.exports = R2 : x.CBOR || (x.CBOR = R2);
  })(E2);
});
var P = C(G());
var { encode: er, decode: nr } = P;
var tr = P.default ?? P;

// bundle_help/util/cborTypedArrayTags.js
var UPPER32 = Math.pow(2, 32);
var warnedPrecision = false;
function warnPrecision() {
  if (!warnedPrecision) {
    warnedPrecision = true;
    console.warn(
      "CBOR 64-bit integer array values may lose precision. No further warnings."
    );
  }
}
function decodeUint64LE(bytes) {
  warnPrecision();
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var arrLen = byteLen / 8;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  var uint32View = new Uint32Array(buffer);
  var arr = new Array(arrLen);
  for (var i = 0; i < arrLen; i++) {
    var si2 = i * 2;
    var lo = uint32View[si2];
    var hi2 = uint32View[si2 + 1];
    arr[i] = lo + UPPER32 * hi2;
  }
  return arr;
}
function decodeInt64LE(bytes) {
  warnPrecision();
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var arrLen = byteLen / 8;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  var uint32View = new Uint32Array(buffer);
  var int32View = new Int32Array(buffer);
  var arr = new Array(arrLen);
  for (var i = 0; i < arrLen; i++) {
    var si2 = i * 2;
    var lo = uint32View[si2];
    var hi2 = int32View[si2 + 1];
    arr[i] = lo + UPPER32 * hi2;
  }
  return arr;
}
function decodeNativeArray(bytes, ArrayType) {
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  return new ArrayType(buffer);
}
var nativeArrayTypes = {
  64: Uint8Array,
  69: Uint16Array,
  70: Uint32Array,
  72: Int8Array,
  77: Int16Array,
  78: Int32Array,
  85: Float32Array,
  86: Float64Array
};
var conversionArrayTypes = {
  71: decodeUint64LE,
  79: decodeInt64LE
};
function cborTypedArrayTagger(data, tag) {
  if (tag in nativeArrayTypes) {
    var arrayType = nativeArrayTypes[tag];
    return decodeNativeArray(data, arrayType);
  }
  if (tag in conversionArrayTypes) {
    return conversionArrayTypes[tag](data);
  }
  return data;
}

// bundle_help/core/SocketAdapter.js
var BSON = null;
if (typeof bson !== "undefined") {
  BSON = bson().BSON;
}
function SocketAdapter(client) {
  var decoder = null;
  if (client.transportOptions.decoder) {
    decoder = client.transportOptions.decoder;
  }
  function handleMessage(message) {
    if (message.op === "publish") {
      client.emit(message.topic, message.msg);
    } else if (message.op === "service_response") {
      client.emit(message.id, message);
    } else if (message.op === "call_service") {
      client.emit(message.service, message);
    } else if (message.op === "send_action_goal") {
      client.emit(message.action, message);
    } else if (message.op === "cancel_action_goal") {
      client.emit(message.id, message);
    } else if (message.op === "action_feedback") {
      client.emit(message.id, message);
    } else if (message.op === "action_result") {
      client.emit(message.id, message);
    } else if (message.op === "status") {
      if (message.id) {
        client.emit("status:" + message.id, message);
      } else {
        client.emit("status", message);
      }
    }
  }
  function handlePng(message, callback) {
    if (message.op === "png") {
      if (typeof window === "undefined") {
        Promise.resolve().then(() => (init_decompressPng(), decompressPng_exports)).then(({ default: decompressPng3 }) => decompressPng3(message.data, callback));
      } else {
        Promise.resolve().then(() => (init_decompressPng2(), decompressPng_exports2)).then(({ default: decompressPng3 }) => decompressPng3(message.data, callback));
      }
    } else {
      callback(message);
    }
  }
  function decodeBSON(data, callback) {
    if (!BSON) {
      throw "Cannot process BSON encoded message without BSON header.";
    }
    var reader = new FileReader();
    reader.onload = function() {
      var uint8Array = new Uint8Array(this.result);
      var msg = BSON.deserialize(uint8Array);
      callback(msg);
    };
    reader.readAsArrayBuffer(data);
  }
  return {
    /**
     * Emit a 'connection' event on WebSocket connection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onopen: function onOpen(event) {
      client.isConnected = true;
      client.emit("connection", event);
    },
    /**
     * Emit a 'close' event on WebSocket disconnection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onclose: function onClose(event) {
      client.isConnected = false;
      client.emit("close", event);
    },
    /**
     * Emit an 'error' event whenever there was an error.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onerror: function onError(event) {
      client.emit("error", event);
    },
    /**
     * Parse message responses from rosbridge and send to the appropriate
     * topic, service, or param.
     *
     * @param {Object} data - The raw JSON message from rosbridge.
     * @memberof SocketAdapter
     */
    onmessage: function onMessage(data) {
      if (decoder) {
        decoder(data.data, function(message2) {
          handleMessage(message2);
        });
      } else if (typeof Blob !== "undefined" && data.data instanceof Blob) {
        decodeBSON(data.data, function(message2) {
          handlePng(message2, handleMessage);
        });
      } else if (data.data instanceof ArrayBuffer) {
        var decoded = tr.decode(data.data, cborTypedArrayTagger);
        handleMessage(decoded);
      } else {
        var message = JSON.parse(typeof data === "string" ? data : data.data);
        handlePng(message, handleMessage);
      }
    }
  };
}

// https://esm.sh/eventemitter3@5.0.1/denonext/eventemitter3.mjs
var E = Object.create;
var d = Object.defineProperty;
var L2 = Object.getOwnPropertyDescriptor;
var O2 = Object.getOwnPropertyNames;
var C2 = Object.getPrototypeOf;
var A = Object.prototype.hasOwnProperty;
var k = (n, e) => () => (e || n((e = { exports: {} }).exports, e), e.exports);
var P2 = (n, e, t, s) => {
  if (e && typeof e == "object" || typeof e == "function") for (let i of O2(e)) !A.call(n, i) && i !== t && d(n, i, { get: () => e[i], enumerable: !(s = L2(e, i)) || s.enumerable });
  return n;
};
var N2 = (n, e, t) => (t = n != null ? E(C2(n)) : {}, P2(e || !n || !n.__esModule ? d(t, "default", { value: n, enumerable: true }) : t, n));
var m = k((q2, x) => {
  "use strict";
  var S = Object.prototype.hasOwnProperty, l2 = "~";
  function _2() {
  }
  Object.create && (_2.prototype = /* @__PURE__ */ Object.create(null), new _2().__proto__ || (l2 = false));
  function T(n, e, t) {
    this.fn = n, this.context = e, this.once = t || false;
  }
  function w(n, e, t, s, i) {
    if (typeof t != "function") throw new TypeError("The listener must be a function");
    var u = new T(t, s || n, i), o = l2 ? l2 + e : e;
    return n._events[o] ? n._events[o].fn ? n._events[o] = [n._events[o], u] : n._events[o].push(u) : (n._events[o] = u, n._eventsCount++), n;
  }
  function y(n, e) {
    --n._eventsCount === 0 ? n._events = new _2() : delete n._events[e];
  }
  function c() {
    this._events = new _2(), this._eventsCount = 0;
  }
  c.prototype.eventNames = function() {
    var e = [], t, s;
    if (this._eventsCount === 0) return e;
    for (s in t = this._events) S.call(t, s) && e.push(l2 ? s.slice(1) : s);
    return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
  };
  c.prototype.listeners = function(e) {
    var t = l2 ? l2 + e : e, s = this._events[t];
    if (!s) return [];
    if (s.fn) return [s.fn];
    for (var i = 0, u = s.length, o = new Array(u); i < u; i++) o[i] = s[i].fn;
    return o;
  };
  c.prototype.listenerCount = function(e) {
    var t = l2 ? l2 + e : e, s = this._events[t];
    return s ? s.fn ? 1 : s.length : 0;
  };
  c.prototype.emit = function(e, t, s, i, u, o) {
    var a = l2 ? l2 + e : e;
    if (!this._events[a]) return false;
    var r = this._events[a], p = arguments.length, h, f;
    if (r.fn) {
      switch (r.once && this.removeListener(e, r.fn, void 0, true), p) {
        case 1:
          return r.fn.call(r.context), true;
        case 2:
          return r.fn.call(r.context, t), true;
        case 3:
          return r.fn.call(r.context, t, s), true;
        case 4:
          return r.fn.call(r.context, t, s, i), true;
        case 5:
          return r.fn.call(r.context, t, s, i, u), true;
        case 6:
          return r.fn.call(r.context, t, s, i, u, o), true;
      }
      for (f = 1, h = new Array(p - 1); f < p; f++) h[f - 1] = arguments[f];
      r.fn.apply(r.context, h);
    } else {
      var b = r.length, v;
      for (f = 0; f < b; f++) switch (r[f].once && this.removeListener(e, r[f].fn, void 0, true), p) {
        case 1:
          r[f].fn.call(r[f].context);
          break;
        case 2:
          r[f].fn.call(r[f].context, t);
          break;
        case 3:
          r[f].fn.call(r[f].context, t, s);
          break;
        case 4:
          r[f].fn.call(r[f].context, t, s, i);
          break;
        default:
          if (!h) for (v = 1, h = new Array(p - 1); v < p; v++) h[v - 1] = arguments[v];
          r[f].fn.apply(r[f].context, h);
      }
    }
    return true;
  };
  c.prototype.on = function(e, t, s) {
    return w(this, e, t, s, false);
  };
  c.prototype.once = function(e, t, s) {
    return w(this, e, t, s, true);
  };
  c.prototype.removeListener = function(e, t, s, i) {
    var u = l2 ? l2 + e : e;
    if (!this._events[u]) return this;
    if (!t) return y(this, u), this;
    var o = this._events[u];
    if (o.fn) o.fn === t && (!i || o.once) && (!s || o.context === s) && y(this, u);
    else {
      for (var a = 0, r = [], p = o.length; a < p; a++) (o[a].fn !== t || i && !o[a].once || s && o[a].context !== s) && r.push(o[a]);
      r.length ? this._events[u] = r.length === 1 ? r[0] : r : y(this, u);
    }
    return this;
  };
  c.prototype.removeAllListeners = function(e) {
    var t;
    return e ? (t = l2 ? l2 + e : e, this._events[t] && y(this, t)) : (this._events = new _2(), this._eventsCount = 0), this;
  };
  c.prototype.off = c.prototype.removeListener;
  c.prototype.addListener = c.prototype.on;
  c.prefixed = l2;
  c.EventEmitter = c;
  typeof x < "u" && (x.exports = c);
});
var g = N2(m(), 1);
var z2 = g.default;
var export_EventEmitter = g.default;

// bundle_help/core/Topic.js
var Topic = class extends export_EventEmitter {
  /** @type {boolean | undefined} */
  waitForReconnect = void 0;
  /** @type {(() => void) | undefined} */
  reconnectFunc = void 0;
  isAdvertised = false;
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The topic name, like '/cmd_vel'.
   * @param {string} options.messageType - The message type, like 'std_msgs/String'.
   * @param {string} [options.compression=none] - The type of compression to use, like 'png', 'cbor', or 'cbor-raw'.
   * @param {number} [options.throttle_rate=0] - The rate (in ms in between messages) at which to throttle the topics.
   * @param {number} [options.queue_size=100] - The queue created at bridge side for re-publishing webtopics.
   * @param {boolean} [options.latch=false] - Latch the topic when publishing.
   * @param {number} [options.queue_length=0] - The queue length at bridge side used when subscribing.
   * @param {boolean} [options.reconnect_on_close=true] - The flag to enable resubscription and readvertisement on close event.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.name = options.name;
    this.messageType = options.messageType;
    this.compression = options.compression || "none";
    this.throttle_rate = options.throttle_rate || 0;
    this.latch = options.latch || false;
    this.queue_size = options.queue_size || 100;
    this.queue_length = options.queue_length || 0;
    this.reconnect_on_close = options.reconnect_on_close !== void 0 ? options.reconnect_on_close : true;
    if (this.compression && this.compression !== "png" && this.compression !== "cbor" && this.compression !== "cbor-raw" && this.compression !== "none") {
      this.emit(
        "warning",
        this.compression + " compression is not supported. No compression will be used."
      );
      this.compression = "none";
    }
    if (this.throttle_rate < 0) {
      this.emit("warning", this.throttle_rate + " is not allowed. Set to 0");
      this.throttle_rate = 0;
    }
    if (this.reconnect_on_close) {
      this.callForSubscribeAndAdvertise = (message) => {
        this.ros.callOnConnection(message);
        this.waitForReconnect = false;
        this.reconnectFunc = () => {
          if (!this.waitForReconnect) {
            this.waitForReconnect = true;
            this.ros.callOnConnection(message);
            this.ros.once("connection", () => {
              this.waitForReconnect = false;
            });
          }
        };
        this.ros.on("close", this.reconnectFunc);
      };
    } else {
      this.callForSubscribeAndAdvertise = this.ros.callOnConnection;
    }
  }
  _messageCallback = (data) => {
    this.emit("message", data);
  };
  /**
   * @callback subscribeCallback
   * @param {T} message - The published message.
   */
  /**
   * Every time a message is published for the given topic, the callback
   * will be called with the message object.
   *
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(callback) {
    if (typeof callback === "function") {
      this.on("message", callback);
    }
    if (this.subscribeId) {
      return;
    }
    this.ros.on(this.name, this._messageCallback);
    this.subscribeId = "subscribe:" + this.name + ":" + (++this.ros.idCounter).toString();
    this.callForSubscribeAndAdvertise({
      op: "subscribe",
      id: this.subscribeId,
      type: this.messageType,
      topic: this.name,
      compression: this.compression,
      throttle_rate: this.throttle_rate,
      queue_length: this.queue_length
    });
  }
  /**
   * Unregister as a subscriber for the topic. Unsubscribing will stop
   * and remove all subscribe callbacks. To remove a callback, you must
   * explicitly pass the callback function in.
   *
   * @param {import('eventemitter3').EventEmitter.ListenerFn} [callback] - The callback to unregister, if
   *     provided and other listeners are registered the topic won't
   *     unsubscribe, just stop emitting to the passed listener.
   */
  unsubscribe(callback) {
    if (callback) {
      this.off("message", callback);
      if (this.listeners("message").length) {
        return;
      }
    }
    if (!this.subscribeId) {
      return;
    }
    this.ros.off(this.name, this._messageCallback);
    if (this.reconnect_on_close) {
      this.ros.off("close", this.reconnectFunc);
    }
    this.emit("unsubscribe");
    this.ros.callOnConnection({
      op: "unsubscribe",
      id: this.subscribeId,
      topic: this.name
    });
    this.subscribeId = null;
  }
  /**
   * Register as a publisher for the topic.
   */
  advertise() {
    if (this.isAdvertised) {
      return;
    }
    this.advertiseId = "advertise:" + this.name + ":" + (++this.ros.idCounter).toString();
    this.callForSubscribeAndAdvertise({
      op: "advertise",
      id: this.advertiseId,
      type: this.messageType,
      topic: this.name,
      latch: this.latch,
      queue_size: this.queue_size
    });
    this.isAdvertised = true;
    if (!this.reconnect_on_close) {
      this.ros.on("close", () => {
        this.isAdvertised = false;
      });
    }
  }
  /**
   * Unregister as a publisher for the topic.
   */
  unadvertise() {
    if (!this.isAdvertised) {
      return;
    }
    if (this.reconnect_on_close) {
      this.ros.off("close", this.reconnectFunc);
    }
    this.emit("unadvertise");
    this.ros.callOnConnection({
      op: "unadvertise",
      id: this.advertiseId,
      topic: this.name
    });
    this.isAdvertised = false;
  }
  /**
   * Publish the message.
   *
   * @param {T} message - The message to publish.
   */
  publish(message) {
    if (!this.isAdvertised) {
      this.advertise();
    }
    this.ros.idCounter++;
    var call = {
      op: "publish",
      id: "publish:" + this.name + ":" + this.ros.idCounter,
      topic: this.name,
      msg: message,
      latch: this.latch
    };
    this.ros.callOnConnection(call);
  }
};

// bundle_help/core/Service.js
var Service = class extends export_EventEmitter {
  /**
     * Stores a reference to the most recent service callback advertised so it can be removed from the EventEmitter during un-advertisement
     * @private
     * @type {((rosbridgeRequest) => any) | null}
     */
  _serviceCallback = null;
  isAdvertised = false;
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The service name, like '/add_two_ints'.
   * @param {string} options.serviceType - The service type, like 'rospy_tutorials/AddTwoInts'.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.name = options.name;
    this.serviceType = options.serviceType;
  }
  /**
   * @callback callServiceCallback
   *  @param {TResponse} response - The response from the service request.
   */
  /**
   * @callback callServiceFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Call the service. Returns the service response in the
   * callback. Does nothing if this service is currently advertised.
   *
   * @param {TRequest} request - The service request to send.
   * @param {callServiceCallback} [callback] - Function with the following params:
   * @param {callServiceFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   * @param {number} [timeout] - Optional timeout, in seconds, for the service call. A non-positive value means no timeout.
   *                             If not provided, the rosbridge server will use its default value.
  */
  callService(request, callback, failedCallback, timeout) {
    if (this.isAdvertised) {
      return;
    }
    var serviceCallId = "call_service:" + this.name + ":" + (++this.ros.idCounter).toString();
    if (callback || failedCallback) {
      this.ros.once(serviceCallId, function(message) {
        if (message.result !== void 0 && message.result === false) {
          if (typeof failedCallback === "function") {
            failedCallback(message.values);
          }
        } else if (typeof callback === "function") {
          callback(message.values);
        }
      });
    }
    var call = {
      op: "call_service",
      id: serviceCallId,
      service: this.name,
      type: this.serviceType,
      args: request,
      timeout
    };
    this.ros.callOnConnection(call);
  }
  /**
   * @callback advertiseCallback
   * @param {TRequest} request - The service request.
   * @param {Partial<TResponse>} response - An empty dictionary. Take care not to overwrite this. Instead, only modify the values within.
   * @returns {boolean} true if the service has finished successfully, i.e., without any fatal errors.
   */
  /**
   * Advertise the service. This turns the Service object from a client
   * into a server. The callback will be called with every request
   * that's made on this service.
   *
   * @param {advertiseCallback} callback - This works similarly to the callback for a C++ service and should take the following params
   */
  advertise(callback) {
    if (this.isAdvertised) {
      throw new Error("Cannot advertise the same Service twice!");
    }
    this._serviceCallback = (rosbridgeRequest) => {
      var response = {};
      var success = callback(rosbridgeRequest.args, response);
      var call = {
        op: "service_response",
        service: this.name,
        values: response,
        result: success
      };
      if (rosbridgeRequest.id) {
        call.id = rosbridgeRequest.id;
      }
      this.ros.callOnConnection(call);
    };
    this.ros.on(this.name, this._serviceCallback);
    this.ros.callOnConnection({
      op: "advertise_service",
      type: this.serviceType,
      service: this.name
    });
    this.isAdvertised = true;
  }
  unadvertise() {
    if (!this.isAdvertised) {
      throw new Error(`Tried to un-advertise service ${this.name}, but it was not advertised!`);
    }
    this.ros.callOnConnection({
      op: "unadvertise_service",
      service: this.name
    });
    if (this._serviceCallback) {
      this.ros.off(this.name, this._serviceCallback);
    }
    this.isAdvertised = false;
  }
  /**
   * An alternate form of Service advertisement that supports a modern Promise-based interface for use with async/await.
   * @param {(request: TRequest) => Promise<TResponse>} callback An asynchronous callback processing the request and returning a response.
   */
  advertiseAsync(callback) {
    if (this.isAdvertised) {
      throw new Error("Cannot advertise the same Service twice!");
    }
    this._serviceCallback = async (rosbridgeRequest) => {
      let rosbridgeResponse = {
        op: "service_response",
        service: this.name,
        result: false
      };
      try {
        rosbridgeResponse.values = await callback(rosbridgeRequest.args);
        rosbridgeResponse.result = true;
      } finally {
        if (rosbridgeRequest.id) {
          rosbridgeResponse.id = rosbridgeRequest.id;
        }
        this.ros.callOnConnection(rosbridgeResponse);
      }
    };
    this.ros.on(this.name, this._serviceCallback);
    this.ros.callOnConnection({
      op: "advertise_service",
      type: this.serviceType,
      service: this.name
    });
    this.isAdvertised = true;
  }
};

// bundle_help/core/Param.js
var Param = class {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The param name, like max_vel_x.
   */
  constructor(options) {
    this.ros = options.ros;
    this.name = options.name;
  }
  /**
   * @callback getCallback
   * @param {Object} value - The value of the param from ROS.
   */
  /**
   * @callback getFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Fetch the value of the param.
   *
   * @param {getCallback} callback - The callback function.
   * @param {getFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  get(callback, failedCallback) {
    var paramClient = new Service({
      ros: this.ros,
      name: "rosapi/get_param",
      serviceType: "rosapi/GetParam"
    });
    var request = { name: this.name };
    paramClient.callService(
      request,
      function(result) {
        var value = JSON.parse(result.value);
        callback(value);
      },
      failedCallback
    );
  }
  /**
   * @callback setParamCallback
   * @param {Object} response - The response from the service request.
   */
  /**
   * @callback setParamFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Set the value of the param in ROS.
   *
   * @param {Object} value - The value to set param to.
   * @param {setParamCallback} [callback] - The callback function.
   * @param {setParamFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  set(value, callback, failedCallback) {
    var paramClient = new Service({
      ros: this.ros,
      name: "rosapi/set_param",
      serviceType: "rosapi/SetParam"
    });
    var request = {
      name: this.name,
      value: JSON.stringify(value)
    };
    paramClient.callService(request, callback, failedCallback);
  }
  /**
   * Delete this parameter on the ROS server.
   *
   * @param {setParamCallback} callback - The callback function.
   * @param {setParamFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  delete(callback, failedCallback) {
    var paramClient = new Service({
      ros: this.ros,
      name: "rosapi/delete_param",
      serviceType: "rosapi/DeleteParam"
    });
    var request = {
      name: this.name
    };
    paramClient.callService(request, callback, failedCallback);
  }
};

// bundle_help/actionlib/ActionClient.js
var ActionClient = class extends export_EventEmitter {
  goals = {};
  /** flag to check if a status has been received */
  receivedStatus = false;
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   * @param {number} [options.timeout] - The timeout length when connecting to the action server.
   * @param {boolean} [options.omitFeedback] - The flag to indicate whether to omit the feedback channel or not.
   * @param {boolean} [options.omitStatus] - The flag to indicate whether to omit the status channel or not.
   * @param {boolean} [options.omitResult] - The flag to indicate whether to omit the result channel or not.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.serverName = options.serverName;
    this.actionName = options.actionName;
    this.timeout = options.timeout;
    this.omitFeedback = options.omitFeedback;
    this.omitStatus = options.omitStatus;
    this.omitResult = options.omitResult;
    this.feedbackListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    });
    this.statusListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    });
    this.resultListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    });
    this.goalTopic = new Topic({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    });
    this.cancelTopic = new Topic({
      ros: this.ros,
      name: this.serverName + "/cancel",
      messageType: "actionlib_msgs/GoalID"
    });
    this.goalTopic.advertise();
    this.cancelTopic.advertise();
    if (!this.omitStatus) {
      this.statusListener.subscribe((statusMessage) => {
        this.receivedStatus = true;
        statusMessage.status_list.forEach((status) => {
          var goal = this.goals[status.goal_id.id];
          if (goal) {
            goal.emit("status", status);
          }
        });
      });
    }
    if (!this.omitFeedback) {
      this.feedbackListener.subscribe((feedbackMessage) => {
        var goal = this.goals[feedbackMessage.status.goal_id.id];
        if (goal) {
          goal.emit("status", feedbackMessage.status);
          goal.emit("feedback", feedbackMessage.feedback);
        }
      });
    }
    if (!this.omitResult) {
      this.resultListener.subscribe((resultMessage) => {
        var goal = this.goals[resultMessage.status.goal_id.id];
        if (goal) {
          goal.emit("status", resultMessage.status);
          goal.emit("result", resultMessage.result);
        }
      });
    }
    if (this.timeout) {
      setTimeout(() => {
        if (!this.receivedStatus) {
          this.emit("timeout");
        }
      }, this.timeout);
    }
  }
  /**
   * Cancel all goals associated with this ActionClient.
   */
  cancel() {
    var cancelMessage = {};
    this.cancelTopic.publish(cancelMessage);
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this ActionClient.
   */
  dispose() {
    this.goalTopic.unadvertise();
    this.cancelTopic.unadvertise();
    if (!this.omitStatus) {
      this.statusListener.unsubscribe();
    }
    if (!this.omitFeedback) {
      this.feedbackListener.unsubscribe();
    }
    if (!this.omitResult) {
      this.resultListener.unsubscribe();
    }
  }
};

// bundle_help/actionlib/Goal.js
var Goal = class extends export_EventEmitter {
  isFinished = false;
  status = void 0;
  result = void 0;
  feedback = void 0;
  // Create a random ID
  goalID = "goal_" + Math.random() + "_" + (/* @__PURE__ */ new Date()).getTime();
  /**
   * @param {Object} options
   * @param {ActionClient} options.actionClient - The ROSLIB.ActionClient to use with this goal.
   * @param {Object} options.goalMessage - The JSON object containing the goal for the action server.
   */
  constructor(options) {
    super();
    this.actionClient = options.actionClient;
    this.goalMessage = {
      goal_id: {
        stamp: {
          secs: 0,
          nsecs: 0
        },
        id: this.goalID
      },
      goal: options.goalMessage
    };
    this.on("status", (status) => {
      this.status = status;
    });
    this.on("result", (result) => {
      this.isFinished = true;
      this.result = result;
    });
    this.on("feedback", (feedback) => {
      this.feedback = feedback;
    });
    this.actionClient.goals[this.goalID] = this;
  }
  /**
   * Send the goal to the action server.
   *
   * @param {number} [timeout] - A timeout length for the goal's result.
   */
  send(timeout) {
    this.actionClient.goalTopic.publish(this.goalMessage);
    if (timeout) {
      setTimeout(() => {
        if (!this.isFinished) {
          this.emit("timeout");
        }
      }, timeout);
    }
  }
  /**
   * Cancel the current goal.
   */
  cancel() {
    var cancelMessage = {
      id: this.goalID
    };
    this.actionClient.cancelTopic.publish(cancelMessage);
  }
};

// bundle_help/math/Quaternion.js
var Quaternion = class _Quaternion {
  /**
   * @param {Object} [options]
   * @param {number|null} [options.x=0] - The x value.
   * @param {number|null} [options.y=0] - The y value.
   * @param {number|null} [options.z=0] - The z value.
   * @param {number|null} [options.w=1] - The w value.
   */
  constructor(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
    this.w = typeof options.w === "number" ? options.w : 1;
  }
  /**
   * Perform a conjugation on this quaternion.
   */
  conjugate() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
  }
  /**
   * Return the norm of this quaternion.
   */
  norm() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  /**
   * Perform a normalization on this quaternion.
   */
  normalize() {
    var l2 = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
    if (l2 === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l2 = 1 / l2;
      this.x = this.x * l2;
      this.y = this.y * l2;
      this.z = this.z * l2;
      this.w = this.w * l2;
    }
  }
  /**
   * Convert this quaternion into its inverse.
   */
  invert() {
    this.conjugate();
    this.normalize();
  }
  /**
   * Set the values of this quaternion to the product of itself and the given quaternion.
   *
   * @param {Quaternion} q - The quaternion to multiply with.
   */
  multiply(q2) {
    var newX = this.x * q2.w + this.y * q2.z - this.z * q2.y + this.w * q2.x;
    var newY = -this.x * q2.z + this.y * q2.w + this.z * q2.x + this.w * q2.y;
    var newZ = this.x * q2.y - this.y * q2.x + this.z * q2.w + this.w * q2.z;
    var newW = -this.x * q2.x - this.y * q2.y - this.z * q2.z + this.w * q2.w;
    this.x = newX;
    this.y = newY;
    this.z = newZ;
    this.w = newW;
  }
  /**
   * Clone a copy of this quaternion.
   *
   * @returns {Quaternion} The cloned quaternion.
   */
  clone() {
    return new _Quaternion(this);
  }
};

// bundle_help/math/Vector3.js
var Vector3 = class _Vector3 {
  /**
   * @param {Object} [options]
   * @param {number} [options.x=0] - The x value.
   * @param {number} [options.y=0] - The y value.
   * @param {number} [options.z=0] - The z value.
   */
  constructor(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
  }
  /**
   * Set the values of this vector to the sum of itself and the given vector.
   *
   * @param {Vector3} v - The vector to add with.
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }
  /**
   * Set the values of this vector to the difference of itself and the given vector.
   *
   * @param {Vector3} v - The vector to subtract with.
   */
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }
  /**
   * Multiply the given Quaternion with this vector.
   *
   * @param {Quaternion} q - The quaternion to multiply with.
   */
  multiplyQuaternion(q2) {
    var ix = q2.w * this.x + q2.y * this.z - q2.z * this.y;
    var iy = q2.w * this.y + q2.z * this.x - q2.x * this.z;
    var iz = q2.w * this.z + q2.x * this.y - q2.y * this.x;
    var iw = -q2.x * this.x - q2.y * this.y - q2.z * this.z;
    this.x = ix * q2.w + iw * -q2.x + iy * -q2.z - iz * -q2.y;
    this.y = iy * q2.w + iw * -q2.y + iz * -q2.x - ix * -q2.z;
    this.z = iz * q2.w + iw * -q2.z + ix * -q2.y - iy * -q2.x;
  }
  /**
   * Clone a copy of this vector.
   *
   * @returns {Vector3} The cloned vector.
   */
  clone() {
    return new _Vector3(this);
  }
};

// bundle_help/math/Transform.js
var Transform = class _Transform {
  /**
   * @param {Object} options
   * @param {Vector3} options.translation - The ROSLIB.Vector3 describing the translation.
   * @param {Quaternion} options.rotation - The ROSLIB.Quaternion describing the rotation.
   */
  constructor(options) {
    this.translation = new Vector3(options.translation);
    this.rotation = new Quaternion(options.rotation);
  }
  /**
   * Clone a copy of this transform.
   *
   * @returns {Transform} The cloned transform.
   */
  clone() {
    return new _Transform(this);
  }
};

// bundle_help/tf/TFClient.js
var TFClient = class extends export_EventEmitter {
  /** @type {Goal|false} */
  currentGoal = false;
  /** @type {Topic|false} */
  currentTopic = false;
  frameInfos = {};
  republisherUpdateRequested = false;
  /** @type {((tf: any) => any) | undefined} */
  _subscribeCB = void 0;
  _isDisposed = false;
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} [options.fixedFrame=base_link] - The fixed frame.
   * @param {number} [options.angularThres=2.0] - The angular threshold for the TF republisher.
   * @param {number} [options.transThres=0.01] - The translation threshold for the TF republisher.
   * @param {number} [options.rate=10.0] - The rate for the TF republisher.
   * @param {number} [options.updateDelay=50] - The time (in ms) to wait after a new subscription
   *     to update the TF republisher's list of TFs.
   * @param {number} [options.topicTimeout=2.0] - The timeout parameter for the TF republisher.
   * @param {string} [options.serverName="/tf2_web_republisher"] - The name of the tf2_web_republisher server.
   * @param {string} [options.repubServiceName="/republish_tfs"] - The name of the republish_tfs service (non groovy compatibility mode only).
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.fixedFrame = options.fixedFrame || "base_link";
    this.angularThres = options.angularThres || 2;
    this.transThres = options.transThres || 0.01;
    this.rate = options.rate || 10;
    this.updateDelay = options.updateDelay || 50;
    var seconds = options.topicTimeout || 2;
    var secs = Math.floor(seconds);
    var nsecs = Math.floor((seconds - secs) * 1e9);
    this.topicTimeout = {
      secs,
      nsecs
    };
    this.serverName = options.serverName || "/tf2_web_republisher";
    this.repubServiceName = options.repubServiceName || "/republish_tfs";
    this.actionClient = new ActionClient({
      ros: options.ros,
      serverName: this.serverName,
      actionName: "tf2_web_republisher/TFSubscriptionAction",
      omitStatus: true,
      omitResult: true
    });
    this.serviceClient = new Service({
      ros: options.ros,
      name: this.repubServiceName,
      serviceType: "tf2_web_republisher/RepublishTFs"
    });
  }
  /**
   * Process the incoming TF message and send them out using the callback
   * functions.
   *
   * @param {Object} tf - The TF message from the server.
   */
  processTFArray(tf) {
    tf.transforms.forEach((transform) => {
      var frameID = transform.child_frame_id;
      if (frameID[0] === "/") {
        frameID = frameID.substring(1);
      }
      var info = this.frameInfos[frameID];
      if (info) {
        info.transform = new Transform({
          translation: transform.transform.translation,
          rotation: transform.transform.rotation
        });
        info.cbs.forEach((cb) => {
          cb(info.transform);
        });
      }
    }, this);
  }
  /**
   * Create and send a new goal (or service request) to the tf2_web_republisher
   * based on the current list of TFs.
   */
  updateGoal() {
    var goalMessage = {
      source_frames: Object.keys(this.frameInfos),
      target_frame: this.fixedFrame,
      angular_thres: this.angularThres,
      trans_thres: this.transThres,
      rate: this.rate
    };
    if (this.ros.groovyCompatibility) {
      if (this.currentGoal) {
        this.currentGoal.cancel();
      }
      this.currentGoal = new Goal({
        actionClient: this.actionClient,
        goalMessage
      });
      this.currentGoal.on("feedback", this.processTFArray.bind(this));
      this.currentGoal.send();
    } else {
      goalMessage.timeout = this.topicTimeout;
      this.serviceClient.callService(goalMessage, this.processResponse.bind(this));
    }
    this.republisherUpdateRequested = false;
  }
  /**
   * Process the service response and subscribe to the tf republisher
   * topic.
   *
   * @param {Object} response - The service response containing the topic name.
   */
  processResponse(response) {
    if (this._isDisposed) {
      return;
    }
    if (this.currentTopic) {
      this.currentTopic.unsubscribe(this._subscribeCB);
    }
    this.currentTopic = new Topic({
      ros: this.ros,
      name: response.topic_name,
      messageType: "tf2_web_republisher/TFArray"
    });
    this._subscribeCB = this.processTFArray.bind(this);
    this.currentTopic.subscribe(this._subscribeCB);
  }
  /**
   * @callback subscribeCallback
   * @param {Transform} callback.transform - The transform data.
   */
  /**
   * Subscribe to the given TF frame.
   *
   * @param {string} frameID - The TF frame to subscribe to.
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(frameID, callback) {
    if (frameID[0] === "/") {
      frameID = frameID.substring(1);
    }
    if (!this.frameInfos[frameID]) {
      this.frameInfos[frameID] = {
        cbs: []
      };
      if (!this.republisherUpdateRequested) {
        setTimeout(this.updateGoal.bind(this), this.updateDelay);
        this.republisherUpdateRequested = true;
      }
    } else if (this.frameInfos[frameID].transform) {
      callback(this.frameInfos[frameID].transform);
    }
    this.frameInfos[frameID].cbs.push(callback);
  }
  /**
   * Unsubscribe from the given TF frame.
   *
   * @param {string} frameID - The TF frame to unsubscribe from.
   * @param {function} callback - The callback function to remove.
   */
  unsubscribe(frameID, callback) {
    if (frameID[0] === "/") {
      frameID = frameID.substring(1);
    }
    var info = this.frameInfos[frameID];
    for (var cbs = info && info.cbs || [], idx = cbs.length; idx--; ) {
      if (cbs[idx] === callback) {
        cbs.splice(idx, 1);
      }
    }
    if (!callback || cbs.length === 0) {
      delete this.frameInfos[frameID];
    }
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this TFClient.
   */
  dispose() {
    this._isDisposed = true;
    this.actionClient.dispose();
    if (this.currentTopic) {
      this.currentTopic.unsubscribe(this._subscribeCB);
    }
  }
};

// bundle_help/actionlib/SimpleActionServer.js
var SimpleActionServer = class extends export_EventEmitter {
  // needed for handling preemption prompted by a new goal being received
  /** @type {{goal_id: {id: any, stamp: any}, goal: any} | null} */
  currentGoal = null;
  // currently tracked goal
  /** @type {{goal_id: {id: any, stamp: any}, goal: any} | null} */
  nextGoal = null;
  // the one this'll be preempting
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.serverName = options.serverName;
    this.actionName = options.actionName;
    this.feedbackPublisher = new Topic({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    });
    this.feedbackPublisher.advertise();
    var statusPublisher = new Topic({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    });
    statusPublisher.advertise();
    this.resultPublisher = new Topic({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    });
    this.resultPublisher.advertise();
    var goalListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    });
    var cancelListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/cancel",
      messageType: "actionlib_msgs/GoalID"
    });
    this.statusMessage = {
      header: {
        stamp: { secs: 0, nsecs: 100 },
        frame_id: ""
      },
      /** @type {{goal_id: any, status: number}[]} */
      status_list: []
    };
    goalListener.subscribe((goalMessage) => {
      if (this.currentGoal) {
        this.nextGoal = goalMessage;
        this.emit("cancel");
      } else {
        this.statusMessage.status_list = [{ goal_id: goalMessage.goal_id, status: 1 }];
        this.currentGoal = goalMessage;
        this.emit("goal", goalMessage.goal);
      }
    });
    var isEarlier = function(t1, t2) {
      if (t1.secs > t2.secs) {
        return false;
      } else if (t1.secs < t2.secs) {
        return true;
      } else if (t1.nsecs < t2.nsecs) {
        return true;
      } else {
        return false;
      }
    };
    cancelListener.subscribe((cancelMessage) => {
      if (cancelMessage.stamp.secs === 0 && cancelMessage.stamp.secs === 0 && cancelMessage.id === "") {
        this.nextGoal = null;
        if (this.currentGoal) {
          this.emit("cancel");
        }
      } else {
        if (this.currentGoal && cancelMessage.id === this.currentGoal.goal_id.id) {
          this.emit("cancel");
        } else if (this.nextGoal && cancelMessage.id === this.nextGoal.goal_id.id) {
          this.nextGoal = null;
        }
        if (this.nextGoal && isEarlier(this.nextGoal.goal_id.stamp, cancelMessage.stamp)) {
          this.nextGoal = null;
        }
        if (this.currentGoal && isEarlier(this.currentGoal.goal_id.stamp, cancelMessage.stamp)) {
          this.emit("cancel");
        }
      }
    });
    setInterval(() => {
      var currentTime = /* @__PURE__ */ new Date();
      var secs = Math.floor(currentTime.getTime() / 1e3);
      var nsecs = Math.round(
        1e9 * (currentTime.getTime() / 1e3 - secs)
      );
      this.statusMessage.header.stamp.secs = secs;
      this.statusMessage.header.stamp.nsecs = nsecs;
      statusPublisher.publish(this.statusMessage);
    }, 500);
  }
  /**
   * Set action state to succeeded and return to client.
   *
   * @param {Object} result - The result to return to the client.
   */
  setSucceeded(result) {
    if (this.currentGoal !== null) {
      var resultMessage = {
        status: { goal_id: this.currentGoal.goal_id, status: 3 },
        result
      };
      this.resultPublisher.publish(resultMessage);
      this.statusMessage.status_list = [];
      if (this.nextGoal) {
        this.currentGoal = this.nextGoal;
        this.nextGoal = null;
        this.emit("goal", this.currentGoal.goal);
      } else {
        this.currentGoal = null;
      }
    }
  }
  /**
   * Set action state to aborted and return to client.
   *
   * @param {Object} result - The result to return to the client.
   */
  setAborted(result) {
    if (this.currentGoal !== null) {
      var resultMessage = {
        status: { goal_id: this.currentGoal.goal_id, status: 4 },
        result
      };
      this.resultPublisher.publish(resultMessage);
      this.statusMessage.status_list = [];
      if (this.nextGoal) {
        this.currentGoal = this.nextGoal;
        this.nextGoal = null;
        this.emit("goal", this.currentGoal.goal);
      } else {
        this.currentGoal = null;
      }
    }
  }
  /**
   * Send a feedback message.
   *
   * @param {Object} feedback - The feedback to send to the client.
   */
  sendFeedback(feedback) {
    if (this.currentGoal !== null) {
      var feedbackMessage = {
        status: { goal_id: this.currentGoal.goal_id, status: 1 },
        feedback
      };
      this.feedbackPublisher.publish(feedbackMessage);
    }
  }
  /**
   * Handle case where client requests preemption.
   */
  setPreempted() {
    if (this.currentGoal !== null) {
      this.statusMessage.status_list = [];
      var resultMessage = {
        status: { goal_id: this.currentGoal.goal_id, status: 2 }
      };
      this.resultPublisher.publish(resultMessage);
      if (this.nextGoal) {
        this.currentGoal = this.nextGoal;
        this.nextGoal = null;
        this.emit("goal", this.currentGoal.goal);
      } else {
        this.currentGoal = null;
      }
    }
  }
};

// bundle_help/core/Ros.js
var Ros = class extends export_EventEmitter {
  /** @type {WebSocket | import("ws").WebSocket | null} */
  socket = null;
  idCounter = 0;
  isConnected = false;
  groovyCompatibility = true;
  /**
   * @param {Object} [options]
   * @param {string} [options.url] - The WebSocket URL for rosbridge. Can be specified later with `connect`.
   * @param {boolean} [options.groovyCompatibility=true] - Don't use interfaces that changed after the last groovy release or rosbridge_suite and related tools.
   * @param {'websocket'|RTCPeerConnection} [options.transportLibrary='websocket'] - 'websocket', or an RTCPeerConnection instance controlling how the connection is created in `connect`.
   * @param {Object} [options.transportOptions={}] - The options to use when creating a connection. Currently only used if `transportLibrary` is RTCPeerConnection.
   */
  constructor(options) {
    super();
    options = options || {};
    this.transportLibrary = options.transportLibrary || "websocket";
    this.transportOptions = options.transportOptions || {};
    this.groovyCompatibility = options.groovyCompatibility ?? true;
    if (options.url) {
      this.connect(options.url);
    }
  }
  /**
   * Connect to the specified WebSocket.
   *
   * @param {string} url - WebSocket URL or RTCDataChannel label for rosbridge.
   */
  connect(url) {
    if (this.transportLibrary.constructor.name === "RTCPeerConnection") {
      this.socket = Object.assign(
        // @ts-expect-error -- this is kinda wild. `this.transportLibrary` can either be a string or an RTCDataChannel. This needs fixing.
        this.transportLibrary.createDataChannel(url, this.transportOptions),
        SocketAdapter(this)
      );
    } else if (this.transportLibrary === "websocket") {
      if (typeof window !== "undefined" || typeof Deno !== "undefined") {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
          const sock = new WebSocket(url);
          sock.binaryType = "arraybuffer";
          this.socket = Object.assign(sock, SocketAdapter(this));
        }
      } else {
        Promise.resolve().then(() => __toESM(require_browser())).then((ws) => {
          if (!this.socket || this.socket.readyState === ws.WebSocket.CLOSED) {
            const sock = new ws.WebSocket(url);
            sock.binaryType = "arraybuffer";
            this.socket = Object.assign(sock, SocketAdapter(this));
          }
        });
      }
    } else {
      throw "Unknown transportLibrary: " + this.transportLibrary.toString();
    }
  }
  /**
   * Disconnect from the WebSocket server.
   */
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
  /**
   * Send an authorization request to the server.
   *
   * @param {string} mac - MAC (hash) string given by the trusted source.
   * @param {string} client - IP of the client.
   * @param {string} dest - IP of the destination.
   * @param {string} rand - Random string given by the trusted source.
   * @param {Object} t - Time of the authorization request.
   * @param {string} level - User level as a string given by the client.
   * @param {Object} end - End time of the client's session.
   */
  authenticate(mac, client, dest, rand, t, level, end) {
    var auth = {
      op: "auth",
      mac,
      client,
      dest,
      rand,
      t,
      level,
      end
    };
    this.callOnConnection(auth);
  }
  /**
   * Send an encoded message over the WebSocket.
   *
   * @param {Object} messageEncoded - The encoded message to be sent.
   */
  sendEncodedMessage(messageEncoded) {
    if (!this.isConnected) {
      this.once("connection", () => {
        if (this.socket !== null) {
          this.socket.send(messageEncoded);
        }
      });
    } else {
      if (this.socket !== null) {
        this.socket.send(messageEncoded);
      }
    }
  }
  /**
   * Send the message over the WebSocket, but queue the message up if not yet
   * connected.
   *
   * @param {Object} message - The message to be sent.
   */
  callOnConnection(message) {
    if (this.transportOptions.encoder) {
      this.transportOptions.encoder(message, this.sendEncodedMessage);
    } else {
      this.sendEncodedMessage(JSON.stringify(message));
    }
  }
  /**
   * Send a set_level request to the server.
   *
   * @param {string} level - Status level (none, error, warning, info).
   * @param {number} [id] - Operation ID to change status level on.
   */
  setStatusLevel(level, id) {
    var levelMsg = {
      op: "set_level",
      level,
      id
    };
    this.callOnConnection(levelMsg);
  }
  /**
   * @callback getActionServersCallback
   * @param {string[]} actionservers - Array of action server names.
   */
  /**
   * @callback getActionServersFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of action servers in ROS as an array of string.
   *
   * @param {getActionServersCallback} callback - Function with the following params:
   * @param {getActionServersFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getActionServers(callback, failedCallback) {
    var getActionServers = new Service({
      ros: this,
      name: "rosapi/action_servers",
      serviceType: "rosapi/GetActionServers"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      getActionServers.callService(
        request,
        function(result) {
          callback(result.action_servers);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      getActionServers.callService(request, function(result) {
        callback(result.action_servers);
      });
    }
  }
  /**
   * @callback getTopicsCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.topics - Array of topic names.
   * @param {string[]} result.types - Array of message type names.
   */
  /**
   * @callback getTopicsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics in ROS as an array.
   *
   * @param {getTopicsCallback} callback - Function with the following params:
   * @param {getTopicsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopics(callback, failedCallback) {
    var topicsClient = new Service({
      ros: this,
      name: "rosapi/topics",
      serviceType: "rosapi/Topics"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      topicsClient.callService(
        request,
        function(result) {
          callback(result);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      topicsClient.callService(request, function(result) {
        callback(result);
      });
    }
  }
  /**
   * @callback getTopicsForTypeCallback
   * @param {string[]} topics - Array of topic names.
   */
  /**
   * @callback getTopicsForTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics in ROS as an array of a specific type.
   *
   * @param {string} topicType - The topic type to find.
   * @param {getTopicsForTypeCallback} callback - Function with the following params:
   * @param {getTopicsForTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicsForType(topicType, callback, failedCallback) {
    var topicsForTypeClient = new Service({
      ros: this,
      name: "rosapi/topics_for_type",
      serviceType: "rosapi/TopicsForType"
    });
    var request = {
      type: topicType
    };
    if (typeof failedCallback === "function") {
      topicsForTypeClient.callService(
        request,
        function(result) {
          callback(result.topics);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      topicsForTypeClient.callService(request, function(result) {
        callback(result.topics);
      });
    }
  }
  /**
   * @callback getServicesCallback
   * @param {string[]} services - Array of service names.
   */
  /**
   * @callback getServicesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of active service names in ROS.
   *
   * @param {getServicesCallback} callback - Function with the following params:
   * @param {getServicesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServices(callback, failedCallback) {
    var servicesClient = new Service({
      ros: this,
      name: "rosapi/services",
      serviceType: "rosapi/Services"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      servicesClient.callService(
        request,
        function(result) {
          callback(result.services);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      servicesClient.callService(request, function(result) {
        callback(result.services);
      });
    }
  }
  /**
   * @callback getServicesForTypeCallback
   * @param {string[]} topics - Array of service names.
   */
  /**
   * @callback getServicesForTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of services in ROS as an array as specific type.
   *
   * @param {string} serviceType - The service type to find.
   * @param {getServicesForTypeCallback} callback - Function with the following params:
   * @param {getServicesForTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServicesForType(serviceType, callback, failedCallback) {
    var servicesForTypeClient = new Service({
      ros: this,
      name: "rosapi/services_for_type",
      serviceType: "rosapi/ServicesForType"
    });
    var request = {
      type: serviceType
    };
    if (typeof failedCallback === "function") {
      servicesForTypeClient.callService(
        request,
        function(result) {
          callback(result.services);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      servicesForTypeClient.callService(request, function(result) {
        callback(result.services);
      });
    }
  }
  /**
   * @callback getServiceRequestDetailsCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.typedefs - An array containing the details of the service request.
   */
  /**
   * @callback getServiceRequestDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS service request.
   *
   * @param {string} type - The type of the service.
   * @param {getServiceRequestDetailsCallback} callback - Function with the following params:
   * @param {getServiceRequestDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceRequestDetails(type, callback, failedCallback) {
    var serviceTypeClient = new Service({
      ros: this,
      name: "rosapi/service_request_details",
      serviceType: "rosapi/ServiceRequestDetails"
    });
    var request = {
      type
    };
    if (typeof failedCallback === "function") {
      serviceTypeClient.callService(
        request,
        function(result) {
          callback(result);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      serviceTypeClient.callService(request, function(result) {
        callback(result);
      });
    }
  }
  /**
   * @callback getServiceResponseDetailsCallback
   * @param {{typedefs: string[]}} result - The result object with the following params:
   */
  /**
   * @callback getServiceResponseDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS service response.
   *
   * @param {string} type - The type of the service.
   * @param {getServiceResponseDetailsCallback} callback - Function with the following params:
   * @param {getServiceResponseDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceResponseDetails(type, callback, failedCallback) {
    var serviceTypeClient = new Service({
      ros: this,
      name: "rosapi/service_response_details",
      serviceType: "rosapi/ServiceResponseDetails"
    });
    var request = {
      type
    };
    if (typeof failedCallback === "function") {
      serviceTypeClient.callService(
        request,
        function(result) {
          callback(result);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      serviceTypeClient.callService(request, function(result) {
        callback(result);
      });
    }
  }
  /**
   * @callback getNodesCallback
   * @param {string[]} nodes - Array of node names.
   */
  /**
   * @callback getNodesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of active node names in ROS.
   *
   * @param {getNodesCallback} callback - Function with the following params:
   * @param {getNodesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getNodes(callback, failedCallback) {
    var nodesClient = new Service({
      ros: this,
      name: "rosapi/nodes",
      serviceType: "rosapi/Nodes"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      nodesClient.callService(
        request,
        function(result) {
          callback(result.nodes);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      nodesClient.callService(request, function(result) {
        callback(result.nodes);
      });
    }
  }
  /**
   * @callback getNodeDetailsCallback
   * @param {string[]} subscriptions - Array of subscribed topic names.
   * @param {string[]} publications - Array of published topic names.
   * @param {string[]} services - Array of service names hosted.
   */
  /**
   * @callback getNodeDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * @callback getNodeDetailsLegacyCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.subscribing - Array of subscribed topic names.
   * @param {string[]} result.publishing - Array of published topic names.
   * @param {string[]} result.services - Array of service names hosted.
   */
  /**
   * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
   * <br>
   * These are the parameters if failedCallback is <strong>defined</strong>.
   *
   * @param {string} node - Name of the node.
   * @param {getNodeDetailsCallback} callback - Function with the following params:
   * @param {getNodeDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   *
   * @also
   *
   * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
   * <br>
   * These are the parameters if failedCallback is <strong>undefined</strong>.
   *
   * @param {string} node - Name of the node.
   * @param {getNodeDetailsLegacyCallback} callback - Function with the following params:
   * @param {getNodeDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getNodeDetails(node, callback, failedCallback) {
    var nodesClient = new Service({
      ros: this,
      name: "rosapi/node_details",
      serviceType: "rosapi/NodeDetails"
    });
    var request = {
      node
    };
    if (typeof failedCallback === "function") {
      nodesClient.callService(
        request,
        function(result) {
          callback(result.subscribing, result.publishing, result.services);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      nodesClient.callService(request, function(result) {
        callback(result);
      });
    }
  }
  /**
   * @callback getParamsCallback
   * @param {string[]} params - Array of param names.
   */
  /**
   * @callback getParamsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of parameter names from the ROS Parameter Server.
   *
   * @param {getParamsCallback} callback - Function with the following params:
   * @param {getParamsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getParams(callback, failedCallback) {
    var paramsClient = new Service({
      ros: this,
      name: "rosapi/get_param_names",
      serviceType: "rosapi/GetParamNames"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      paramsClient.callService(
        request,
        function(result) {
          callback(result.names);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      paramsClient.callService(request, function(result) {
        callback(result.names);
      });
    }
  }
  /**
   * @callback getTopicTypeCallback
   * @param {string} type - The type of the topic.
   */
  /**
   * @callback getTopicTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the type of a ROS topic.
   *
   * @param {string} topic - Name of the topic.
   * @param {getTopicTypeCallback} callback - Function with the following params:
   * @param {getTopicTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicType(topic, callback, failedCallback) {
    var topicTypeClient = new Service({
      ros: this,
      name: "rosapi/topic_type",
      serviceType: "rosapi/TopicType"
    });
    var request = {
      topic
    };
    if (typeof failedCallback === "function") {
      topicTypeClient.callService(
        request,
        function(result) {
          callback(result.type);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      topicTypeClient.callService(request, function(result) {
        callback(result.type);
      });
    }
  }
  /**
   * @callback getServiceTypeCallback
   * @param {string} type - The type of the service.
   */
  /**
   * @callback getServiceTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the type of a ROS service.
   *
   * @param {string} service - Name of the service.
   * @param {getServiceTypeCallback} callback - Function with the following params:
   * @param {getServiceTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceType(service, callback, failedCallback) {
    var serviceTypeClient = new Service({
      ros: this,
      name: "rosapi/service_type",
      serviceType: "rosapi/ServiceType"
    });
    var request = {
      service
    };
    if (typeof failedCallback === "function") {
      serviceTypeClient.callService(
        request,
        function(result) {
          callback(result.type);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      serviceTypeClient.callService(request, function(result) {
        callback(result.type);
      });
    }
  }
  /**
   * @callback getMessageDetailsCallback
   * @param {string} details - An array of the message details.
   */
  /**
   * @callback getMessageDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS message.
   *
   * @param {string} message - The name of the message type.
   * @param {getMessageDetailsCallback} callback - Function with the following params:
   * @param {getMessageDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getMessageDetails(message, callback, failedCallback) {
    var messageDetailClient = new Service({
      ros: this,
      name: "rosapi/message_details",
      serviceType: "rosapi/MessageDetails"
    });
    var request = {
      type: message
    };
    if (typeof failedCallback === "function") {
      messageDetailClient.callService(
        request,
        function(result) {
          callback(result.typedefs);
        },
        function(message2) {
          failedCallback(message2);
        }
      );
    } else {
      messageDetailClient.callService(request, function(result) {
        callback(result.typedefs);
      });
    }
  }
  /**
   * Decode a typedef array into a dictionary like `rosmsg show foo/bar`.
   *
   * @param {Object[]} defs - Array of type_def dictionary.
   */
  decodeTypeDefs(defs) {
    var decodeTypeDefsRec = (theType, hints) => {
      var typeDefDict = {};
      for (var i = 0; i < theType.fieldnames.length; i++) {
        var arrayLen = theType.fieldarraylen[i];
        var fieldName = theType.fieldnames[i];
        var fieldType = theType.fieldtypes[i];
        if (fieldType.indexOf("/") === -1) {
          if (arrayLen === -1) {
            typeDefDict[fieldName] = fieldType;
          } else {
            typeDefDict[fieldName] = [fieldType];
          }
        } else {
          var sub = false;
          for (var j = 0; j < hints.length; j++) {
            if (hints[j].type.toString() === fieldType.toString()) {
              sub = hints[j];
              break;
            }
          }
          if (sub) {
            var subResult = decodeTypeDefsRec(sub, hints);
            if (arrayLen === -1) {
              typeDefDict[fieldName] = subResult;
            } else {
              typeDefDict[fieldName] = [subResult];
            }
          } else {
            this.emit(
              "error",
              "Cannot find " + fieldType + " in decodeTypeDefs"
            );
          }
        }
      }
      return typeDefDict;
    };
    return decodeTypeDefsRec(defs[0], defs);
  }
  /**
   * @callback getTopicsAndRawTypesCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.topics - Array of topic names.
   * @param {string[]} result.types - Array of message type names.
   * @param {string[]} result.typedefs_full_text - Array of full definitions of message types, similar to `gendeps --cat`.
   */
  /**
   * @callback getTopicsAndRawTypesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics and their associated type definitions.
   *
   * @param {getTopicsAndRawTypesCallback} callback - Function with the following params:
   * @param {getTopicsAndRawTypesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicsAndRawTypes(callback, failedCallback) {
    var topicsAndRawTypesClient = new Service({
      ros: this,
      name: "rosapi/topics_and_raw_types",
      serviceType: "rosapi/TopicsAndRawTypes"
    });
    var request = {};
    if (typeof failedCallback === "function") {
      topicsAndRawTypesClient.callService(
        request,
        function(result) {
          callback(result);
        },
        function(message) {
          failedCallback(message);
        }
      );
    } else {
      topicsAndRawTypesClient.callService(request, function(result) {
        callback(result);
      });
    }
  }
  Topic(options) {
    return new Topic({ ros: this, ...options });
  }
  Param(options) {
    return new Param({ ros: this, ...options });
  }
  Service(options) {
    return new Service({ ros: this, ...options });
  }
  TFClient(options) {
    return new TFClient({ ros: this, ...options });
  }
  ActionClient(options) {
    return new ActionClient({ ros: this, ...options });
  }
  SimpleActionServer(options) {
    return new SimpleActionServer({ ros: this, ...options });
  }
};

// bundle_help/core/Action.js
var Action = class extends export_EventEmitter {
  isAdvertised = false;
  /**
   * @callback advertiseActionCallback
   * @param {TGoal} goal - The action goal.
   * @param {string} id - The ID of the action goal to execute.
   */
  /**
   * @private
   * @type {advertiseActionCallback | null}
   */
  _actionCallback = null;
  /**
   * @callback advertiseCancelCallback
   * @param {string} id - The ID of the action goal to cancel.
   */
  /**
   * @private
   * @type {advertiseCancelCallback | null}
   */
  _cancelCallback = null;
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The action name, like '/fibonacci'.
   * @param {string} options.actionType - The action type, like 'action_tutorials_interfaces/Fibonacci'.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.name = options.name;
    this.actionType = options.actionType;
  }
  /**
   * @callback sendGoalResultCallback
   * @param {TResult} result - The result from the action.
   */
  /**
   * @callback sendGoalFeedbackCallback
   * @param {TFeedback} feedback - The feedback from the action.
   */
  /**
   * @callback sendGoalFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Sends an action goal. Returns the feedback in the feedback callback while the action is running
   * and the result in the result callback when the action is completed.
   * Does nothing if this action is currently advertised.
   *
   * @param {TGoal} goal - The action goal to send.
   * @param {sendGoalResultCallback} resultCallback - The callback function when the action is completed.
   * @param {sendGoalFeedbackCallback} [feedbackCallback] - The callback function when the action pulishes feedback.
   * @param {sendGoalFailedCallback} [failedCallback] - The callback function when the action failed.
   */
  sendGoal(goal, resultCallback, feedbackCallback, failedCallback) {
    if (this.isAdvertised) {
      return;
    }
    var actionGoalId = "send_action_goal:" + this.name + ":" + ++this.ros.idCounter;
    if (resultCallback || failedCallback) {
      this.ros.on(actionGoalId, function(message) {
        if (message.result !== void 0 && message.result === false) {
          if (typeof failedCallback === "function") {
            failedCallback(message.values);
          }
        } else if (message.op === "action_feedback" && typeof feedbackCallback === "function") {
          feedbackCallback(message.values);
        } else if (message.op === "action_result" && typeof resultCallback === "function") {
          resultCallback(message.values);
        }
      });
    }
    var call = {
      op: "send_action_goal",
      id: actionGoalId,
      action: this.name,
      action_type: this.actionType,
      args: goal,
      feedback: true
    };
    this.ros.callOnConnection(call);
    return actionGoalId;
  }
  /**
   * Cancels an action goal.
   *
   * @param {string} id - The ID of the action goal to cancel.
   */
  cancelGoal(id) {
    var call = {
      op: "cancel_action_goal",
      id,
      action: this.name
    };
    this.ros.callOnConnection(call);
  }
  /**
   * Advertise the action. This turns the Action object from a client
   * into a server. The callback will be called with every goal sent to this action.
   *
   * @param {advertiseActionCallback} actionCallback - This works similarly to the callback for a C++ action.
   * @param {advertiseCancelCallback} cancelCallback - A callback function to execute when the action is canceled.
   */
  advertise(actionCallback, cancelCallback) {
    if (this.isAdvertised || typeof actionCallback !== "function") {
      return;
    }
    this._actionCallback = actionCallback;
    this._cancelCallback = cancelCallback;
    this.ros.on(this.name, this._executeAction.bind(this));
    this.ros.callOnConnection({
      op: "advertise_action",
      type: this.actionType,
      action: this.name
    });
    this.isAdvertised = true;
  }
  /**
   * Unadvertise a previously advertised action.
   */
  unadvertise() {
    if (!this.isAdvertised) {
      return;
    }
    this.ros.callOnConnection({
      op: "unadvertise_action",
      action: this.name
    });
    this.isAdvertised = false;
  }
  /**
   * Helper function that executes an action by calling the provided
   * action callback with the auto-generated ID as a user-accessible input.
   * Should not be called manually.
   *
   * @param {Object} rosbridgeRequest - The rosbridge request containing the action goal to send and its ID.
   * @param {string} rosbridgeRequest.id - The ID of the action goal.
   * @param {TGoal} rosbridgeRequest.args - The arguments of the action goal.
   */
  _executeAction(rosbridgeRequest) {
    var id = rosbridgeRequest.id;
    if (typeof id === "string") {
      this.ros.on(id, (message) => {
        if (message.op === "cancel_action_goal" && typeof this._cancelCallback === "function") {
          this._cancelCallback(id);
        }
      });
    }
    if (typeof this._actionCallback === "function") {
      this._actionCallback(rosbridgeRequest.args, id);
    }
  }
  /**
   * Helper function to send action feedback inside an action handler.
   *
   * @param {string} id - The action goal ID.
   * @param {TFeedback} feedback - The feedback to send.
   */
  sendFeedback(id, feedback) {
    var call = {
      op: "action_feedback",
      id,
      action: this.name,
      values: feedback
    };
    this.ros.callOnConnection(call);
  }
  /**
   * Helper function to set an action as succeeded.
   *
   * @param {string} id - The action goal ID.
   * @param {TResult} result - The result to set.
   */
  setSucceeded(id, result) {
    var call = {
      op: "action_result",
      id,
      action: this.name,
      values: result,
      status: 4 /* STATUS_SUCCEEDED */,
      result: true
    };
    this.ros.callOnConnection(call);
  }
  /**
   * Helper function to set an action as canceled.
   *
   * @param {string} id - The action goal ID.
   * @param {TResult} result - The result to set.
   */
  setCanceled(id, result) {
    var call = {
      op: "action_result",
      id,
      action: this.name,
      values: result,
      status: 5 /* STATUS_CANCELED */,
      result: true
    };
    this.ros.callOnConnection(call);
  }
  /**
   * Helper function to set an action as failed.
   *
   * @param {string} id - The action goal ID.
   */
  setFailed(id) {
    var call = {
      op: "action_result",
      id,
      action: this.name,
      status: 6 /* STATUS_ABORTED */,
      result: false
    };
    this.ros.callOnConnection(call);
  }
};

// bundle_help/actionlib/index.js
var actionlib_exports = {};
__export(actionlib_exports, {
  ActionClient: () => ActionClient,
  ActionListener: () => ActionListener,
  Goal: () => Goal,
  SimpleActionServer: () => SimpleActionServer
});

// bundle_help/actionlib/ActionListener.js
var ActionListener = class extends export_EventEmitter {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.serverName = options.serverName;
    this.actionName = options.actionName;
    var goalListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    });
    var feedbackListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    });
    var statusListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    });
    var resultListener = new Topic({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    });
    goalListener.subscribe((goalMessage) => {
      this.emit("goal", goalMessage);
    });
    statusListener.subscribe((statusMessage) => {
      statusMessage.status_list.forEach((status) => {
        this.emit("status", status);
      });
    });
    feedbackListener.subscribe((feedbackMessage) => {
      this.emit("status", feedbackMessage.status);
      this.emit("feedback", feedbackMessage.feedback);
    });
    resultListener.subscribe((resultMessage) => {
      this.emit("status", resultMessage.status);
      this.emit("result", resultMessage.result);
    });
  }
};

// bundle_help/math/index.js
var math_exports = {};
__export(math_exports, {
  Pose: () => Pose,
  Quaternion: () => Quaternion,
  Transform: () => Transform,
  Vector3: () => Vector3
});

// bundle_help/math/Pose.js
var Pose = class _Pose {
  /**
   * @param {Object} [options]
   * @param {Vector3} [options.position] - The ROSLIB.Vector3 describing the position.
   * @param {Quaternion} [options.orientation] - The ROSLIB.Quaternion describing the orientation.
   */
  constructor(options) {
    options = options || {};
    options = options || {};
    this.position = new Vector3(options.position);
    this.orientation = new Quaternion(options.orientation);
  }
  /**
   * Apply a transform against this pose.
   *
   * @param {Transform} tf - The transform to be applied.
   */
  applyTransform(tf) {
    this.position.multiplyQuaternion(tf.rotation);
    this.position.add(tf.translation);
    var tmp = tf.rotation.clone();
    tmp.multiply(this.orientation);
    this.orientation = tmp;
  }
  /**
   * Clone a copy of this pose.
   *
   * @returns {Pose} The cloned pose.
   */
  clone() {
    return new _Pose(this);
  }
  /**
   * Multiply this pose with another pose without altering this pose.
   *
   * @returns {Pose} The result of the multiplication.
   */
  multiply(pose) {
    var p = pose.clone();
    p.applyTransform({
      rotation: this.orientation,
      translation: this.position
    });
    return p;
  }
  /**
   * Compute the inverse of this pose.
   *
   * @returns {Pose} The inverse of the pose.
   */
  getInverse() {
    var inverse = this.clone();
    inverse.orientation.invert();
    inverse.position.multiplyQuaternion(inverse.orientation);
    inverse.position.x *= -1;
    inverse.position.y *= -1;
    inverse.position.z *= -1;
    return inverse;
  }
};

// bundle_help/tf/index.js
var tf_exports = {};
__export(tf_exports, {
  ROS2TFClient: () => ROS2TFClient,
  TFClient: () => TFClient
});

// bundle_help/tf/ROS2TFClient.js
var ROS2TFClient = class extends export_EventEmitter {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} [options.fixedFrame=base_link] - The fixed frame.
   * @param {number} [options.angularThres=2.0] - The angular threshold for the TF republisher.
   * @param {number} [options.transThres=0.01] - The translation threshold for the TF republisher.
   * @param {number} [options.rate=10.0] - The rate for the TF republisher.
   * @param {number} [options.updateDelay=50] - The time (in ms) to wait after a new subscription
   *     to update the TF republisher's list of TFs.
   * @param {number} [options.topicTimeout=2.0] - The timeout parameter for the TF republisher.
   * @param {string} [options.serverName="/tf2_web_republisher"] - The name of the tf2_web_republisher server.
   * @param {string} [options.repubServiceName="/republish_tfs"] - The name of the republish_tfs service (non groovy compatibility mode only).
   */
  constructor(options) {
    super();
    this.ros = options.ros;
    this.fixedFrame = options.fixedFrame || "base_link";
    this.angularThres = options.angularThres || 2;
    this.transThres = options.transThres || 0.01;
    this.rate = options.rate || 10;
    this.updateDelay = options.updateDelay || 50;
    const seconds = options.topicTimeout || 2;
    const secs = Math.floor(seconds);
    const nsecs = Math.floor((seconds - secs) * 1e9);
    this.topicTimeout = {
      secs,
      nsecs
    };
    this.serverName = options.serverName || "/tf2_web_republisher";
    this.goal_id = "";
    this.frameInfos = {};
    this.republisherUpdateRequested = false;
    this._subscribeCB = void 0;
    this._isDisposed = false;
    this.actionClient = new Action({
      ros: options.ros,
      name: this.serverName,
      actionType: "tf2_web_republisher_msgs/TFSubscription"
    });
  }
  /**
   * Process the incoming TF message and send them out using the callback
   * functions.
   *
   * @param {Object} tf - The TF message from the server.
   */
  processTFArray(tf) {
    let that = this;
    tf.transforms.forEach(function(transform) {
      let frameID = transform.child_frame_id;
      if (frameID[0] === "/") {
        frameID = frameID.substring(1);
      }
      const info = that.frameInfos[frameID];
      if (info) {
        info.transform = new Transform({
          translation: transform.transform.translation,
          rotation: transform.transform.rotation
        });
        info.cbs.forEach(function(cb) {
          cb(info.transform);
        });
      }
    }, this);
  }
  /**
   * Create and send a new goal (or service request) to the tf2_web_republisher
   * based on the current list of TFs.
   */
  updateGoal() {
    const goalMessage = {
      source_frames: Object.keys(this.frameInfos),
      target_frame: this.fixedFrame,
      angular_thres: this.angularThres,
      trans_thres: this.transThres,
      rate: this.rate
    };
    if (this.goal_id !== "") {
      this.actionClient.cancelGoal(this.goal_id);
    }
    this.currentGoal = goalMessage;
    const id = this.actionClient.sendGoal(
      goalMessage,
      (result) => {
      },
      (feedback) => {
        this.processTFArray(feedback);
      }
    );
    if (typeof id === "string") {
      this.goal_id = id;
    }
    this.republisherUpdateRequested = false;
  }
  /**
   * @callback subscribeCallback
   * @param {Transform} callback.transform - The transform data.
   */
  /**
   * Subscribe to the given TF frame.
   *
   * @param {string} frameID - The TF frame to subscribe to.
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(frameID, callback) {
    if (frameID[0] === "/") {
      frameID = frameID.substring(1);
    }
    if (!this.frameInfos[frameID]) {
      this.frameInfos[frameID] = {
        cbs: []
      };
      if (!this.republisherUpdateRequested) {
        setTimeout(this.updateGoal.bind(this), this.updateDelay);
        this.republisherUpdateRequested = true;
      }
    } else if (this.frameInfos[frameID].transform) {
      callback(this.frameInfos[frameID].transform);
    }
    this.frameInfos[frameID].cbs.push(callback);
  }
  /**
   * Unsubscribe from the given TF frame.
   *
   * @param {string} frameID - The TF frame to unsubscribe from.
   * @param {function} callback - The callback function to remove.
   */
  unsubscribe(frameID, callback) {
    if (frameID[0] === "/") {
      frameID = frameID.substring(1);
    }
    const info = this.frameInfos[frameID];
    for (var cbs = info && info.cbs || [], idx = cbs.length; idx--; ) {
      if (cbs[idx] === callback) {
        cbs.splice(idx, 1);
      }
    }
    if (!callback || cbs.length === 0) {
      delete this.frameInfos[frameID];
    }
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this TFClient.
   */
  dispose() {
    this._isDisposed = true;
  }
};

// bundle_help/urdf/index.js
var urdf_exports = {};
__export(urdf_exports, {
  URDF_BOX: () => URDF_BOX,
  URDF_CYLINDER: () => URDF_CYLINDER,
  URDF_MESH: () => URDF_MESH,
  URDF_SPHERE: () => URDF_SPHERE,
  UrdfBox: () => UrdfBox,
  UrdfColor: () => UrdfColor,
  UrdfCylinder: () => UrdfCylinder,
  UrdfLink: () => UrdfLink,
  UrdfMaterial: () => UrdfMaterial,
  UrdfMesh: () => UrdfMesh,
  UrdfModel: () => UrdfModel,
  UrdfSphere: () => UrdfSphere,
  UrdfVisual: () => UrdfVisual
});

// bundle_help/urdf/UrdfTypes.js
var URDF_SPHERE = 0;
var URDF_BOX = 1;
var URDF_CYLINDER = 2;
var URDF_MESH = 3;

// bundle_help/urdf/UrdfBox.js
var UrdfBox = class {
  /** @type {Vector3 | null} */
  dimension;
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.type = URDF_BOX;
    var xyz = options.xml.getAttribute("size")?.split(" ");
    if (xyz) {
      this.dimension = new Vector3({
        x: parseFloat(xyz[0]),
        y: parseFloat(xyz[1]),
        z: parseFloat(xyz[2])
      });
    } else {
      this.dimension = null;
    }
  }
};

// bundle_help/urdf/UrdfColor.js
var UrdfColor = class {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    var rgba = options.xml.getAttribute("rgba")?.split(" ");
    if (rgba) {
      this.r = parseFloat(rgba[0]);
      this.g = parseFloat(rgba[1]);
      this.b = parseFloat(rgba[2]);
      this.a = parseFloat(rgba[3]);
    }
  }
};

// bundle_help/urdf/UrdfCylinder.js
var UrdfCylinder = class {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.type = URDF_CYLINDER;
    this.length = parseFloat(options.xml.getAttribute("length"));
    this.radius = parseFloat(options.xml.getAttribute("radius"));
  }
};

// bundle_help/urdf/UrdfMaterial.js
var UrdfMaterial = class {
  /** @type {string | null} */
  textureFilename = null;
  /** @type {UrdfColor | null} */
  color = null;
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.name = options.xml.getAttribute("name");
    var textures = options.xml.getElementsByTagName("texture");
    if (textures.length > 0) {
      this.textureFilename = textures[0].getAttribute("filename");
    }
    var colors = options.xml.getElementsByTagName("color");
    if (colors.length > 0) {
      this.color = new UrdfColor({
        xml: colors[0]
      });
    }
  }
  isLink() {
    return this.color === null && this.textureFilename === null;
  }
  assign(obj) {
    return Object.assign(this, obj);
  }
};

// bundle_help/urdf/UrdfMesh.js
var UrdfMesh = class {
  /** @type {Vector3 | null} */
  scale = null;
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.type = URDF_MESH;
    this.filename = options.xml.getAttribute("filename");
    var scale = options.xml.getAttribute("scale");
    if (scale) {
      var xyz = scale.split(" ");
      this.scale = new Vector3({
        x: parseFloat(xyz[0]),
        y: parseFloat(xyz[1]),
        z: parseFloat(xyz[2])
      });
    }
  }
};

// bundle_help/urdf/UrdfSphere.js
var UrdfSphere = class {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.type = URDF_SPHERE;
    this.radius = parseFloat(options.xml.getAttribute("radius") || "NaN");
  }
};

// bundle_help/urdf/UrdfVisual.js
var UrdfVisual = class {
  /** @type {Pose | null} */
  origin = null;
  /** @type {UrdfMesh | UrdfSphere | UrdfBox | UrdfCylinder | null} */
  geometry = null;
  /** @type {UrdfMaterial | null} */
  material = null;
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    var xml = options.xml;
    this.name = options.xml.getAttribute("name");
    var origins = xml.getElementsByTagName("origin");
    if (origins.length === 0) {
      this.origin = new Pose();
    } else {
      var xyzValue = origins[0].getAttribute("xyz");
      var position = new Vector3();
      if (xyzValue) {
        var xyz = xyzValue.split(" ");
        position = new Vector3({
          x: parseFloat(xyz[0]),
          y: parseFloat(xyz[1]),
          z: parseFloat(xyz[2])
        });
      }
      var rpyValue = origins[0].getAttribute("rpy");
      var orientation = new Quaternion();
      if (rpyValue) {
        var rpy = rpyValue.split(" ");
        var roll = parseFloat(rpy[0]);
        var pitch = parseFloat(rpy[1]);
        var yaw = parseFloat(rpy[2]);
        var phi = roll / 2;
        var the = pitch / 2;
        var psi = yaw / 2;
        var x = Math.sin(phi) * Math.cos(the) * Math.cos(psi) - Math.cos(phi) * Math.sin(the) * Math.sin(psi);
        var y = Math.cos(phi) * Math.sin(the) * Math.cos(psi) + Math.sin(phi) * Math.cos(the) * Math.sin(psi);
        var z3 = Math.cos(phi) * Math.cos(the) * Math.sin(psi) - Math.sin(phi) * Math.sin(the) * Math.cos(psi);
        var w = Math.cos(phi) * Math.cos(the) * Math.cos(psi) + Math.sin(phi) * Math.sin(the) * Math.sin(psi);
        orientation = new Quaternion({
          x,
          y,
          z: z3,
          w
        });
        orientation.normalize();
      }
      this.origin = new Pose({
        position,
        orientation
      });
    }
    var geoms = xml.getElementsByTagName("geometry");
    if (geoms.length > 0) {
      var geom = geoms[0];
      var shape = null;
      for (var i = 0; i < geom.childNodes.length; i++) {
        var node = geom.childNodes[i];
        if (node.nodeType === 1) {
          shape = node;
          break;
        }
      }
      if (shape) {
        var type = shape.nodeName;
        if (type === "sphere") {
          this.geometry = new UrdfSphere({
            xml: shape
          });
        } else if (type === "box") {
          this.geometry = new UrdfBox({
            xml: shape
          });
        } else if (type === "cylinder") {
          this.geometry = new UrdfCylinder({
            xml: shape
          });
        } else if (type === "mesh") {
          this.geometry = new UrdfMesh({
            xml: shape
          });
        } else {
          console.warn("Unknown geometry type " + type);
        }
      }
    }
    var materials = xml.getElementsByTagName("material");
    if (materials.length > 0) {
      this.material = new UrdfMaterial({
        xml: materials[0]
      });
    }
  }
};

// bundle_help/urdf/UrdfLink.js
var UrdfLink = class {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.name = options.xml.getAttribute("name");
    this.visuals = [];
    var visuals = options.xml.getElementsByTagName("visual");
    for (var i = 0; i < visuals.length; i++) {
      this.visuals.push(
        new UrdfVisual({
          xml: visuals[i]
        })
      );
    }
  }
};

// bundle_help/urdf/UrdfJoint.js
var UrdfJoint = class {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(options) {
    this.name = options.xml.getAttribute("name");
    this.type = options.xml.getAttribute("type");
    var parents = options.xml.getElementsByTagName("parent");
    if (parents.length > 0) {
      this.parent = parents[0].getAttribute("link");
    }
    var children = options.xml.getElementsByTagName("child");
    if (children.length > 0) {
      this.child = children[0].getAttribute("link");
    }
    var limits = options.xml.getElementsByTagName("limit");
    if (limits.length > 0) {
      this.minval = parseFloat(limits[0].getAttribute("lower") || "NaN");
      this.maxval = parseFloat(limits[0].getAttribute("upper") || "NaN");
    }
    var origins = options.xml.getElementsByTagName("origin");
    if (origins.length === 0) {
      this.origin = new Pose();
    } else {
      var xyzValue = origins[0].getAttribute("xyz");
      var position = new Vector3();
      if (xyzValue) {
        var xyz = xyzValue.split(" ");
        position = new Vector3({
          x: parseFloat(xyz[0]),
          y: parseFloat(xyz[1]),
          z: parseFloat(xyz[2])
        });
      }
      var rpyValue = origins[0].getAttribute("rpy");
      var orientation = new Quaternion();
      if (rpyValue) {
        var rpy = rpyValue.split(" ");
        var roll = parseFloat(rpy[0]);
        var pitch = parseFloat(rpy[1]);
        var yaw = parseFloat(rpy[2]);
        var phi = roll / 2;
        var the = pitch / 2;
        var psi = yaw / 2;
        var x = Math.sin(phi) * Math.cos(the) * Math.cos(psi) - Math.cos(phi) * Math.sin(the) * Math.sin(psi);
        var y = Math.cos(phi) * Math.sin(the) * Math.cos(psi) + Math.sin(phi) * Math.cos(the) * Math.sin(psi);
        var z3 = Math.cos(phi) * Math.cos(the) * Math.sin(psi) - Math.sin(phi) * Math.sin(the) * Math.cos(psi);
        var w = Math.cos(phi) * Math.cos(the) * Math.cos(psi) + Math.sin(phi) * Math.sin(the) * Math.sin(psi);
        orientation = new Quaternion({
          x,
          y,
          z: z3,
          w
        });
        orientation.normalize();
      }
      this.origin = new Pose({
        position,
        orientation
      });
    }
  }
};

// https://esm.sh/@xmldom/xmldom@0.9.8/denonext/xmldom.mjs
var et = Object.create;
var ku = Object.defineProperty;
var ut = Object.getOwnPropertyDescriptor;
var rt = Object.getOwnPropertyNames;
var tt = Object.getPrototypeOf;
var nt = Object.prototype.hasOwnProperty;
var W = (e, u) => () => (u || e((u = { exports: {} }).exports, u), u.exports);
var it = (e, u, r, t) => {
  if (u && typeof u == "object" || typeof u == "function") for (let n of rt(u)) !nt.call(e, n) && n !== r && ku(e, n, { get: () => u[n], enumerable: !(t = ut(u, n)) || t.enumerable });
  return e;
};
var at = (e, u, r) => (r = e != null ? et(tt(e)) : {}, it(u || !e || !e.__esModule ? ku(r, "default", { value: e, enumerable: true }) : r, e));
var ne = W((R2) => {
  "use strict";
  function ot(e, u, r) {
    if (r === void 0 && (r = Array.prototype), e && typeof r.find == "function") return r.find.call(e, u);
    for (var t = 0; t < e.length; t++) if (te(e, t)) {
      var n = e[t];
      if (u.call(void 0, n, t, e)) return n;
    }
  }
  function ce2(e, u) {
    return u === void 0 && (u = Object), u && typeof u.getOwnPropertyDescriptors == "function" && (e = u.create(null, u.getOwnPropertyDescriptors(e))), u && typeof u.freeze == "function" ? u.freeze(e) : e;
  }
  function te(e, u) {
    return Object.prototype.hasOwnProperty.call(e, u);
  }
  function st(e, u) {
    if (e === null || typeof e != "object") throw new TypeError("target is not an object");
    for (var r in u) te(u, r) && (e[r] = u[r]);
    return e;
  }
  var Vu = ce2({ allowfullscreen: true, async: true, autofocus: true, autoplay: true, checked: true, controls: true, default: true, defer: true, disabled: true, formnovalidate: true, hidden: true, ismap: true, itemscope: true, loop: true, multiple: true, muted: true, nomodule: true, novalidate: true, open: true, playsinline: true, readonly: true, required: true, reversed: true, selected: true });
  function lt(e) {
    return te(Vu, e.toLowerCase());
  }
  var Hu = ce2({ area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ct(e) {
    return te(Hu, e.toLowerCase());
  }
  var we = ce2({ script: false, style: false, textarea: true, title: true });
  function Et(e) {
    var u = e.toLowerCase();
    return te(we, u) && !we[u];
  }
  function Dt(e) {
    var u = e.toLowerCase();
    return te(we, u) && we[u];
  }
  function Gu(e) {
    return e === ye.HTML;
  }
  function pt(e) {
    return Gu(e) || e === ye.XML_XHTML_APPLICATION;
  }
  var ye = ce2({ HTML: "text/html", XML_APPLICATION: "application/xml", XML_TEXT: "text/xml", XML_XHTML_APPLICATION: "application/xhtml+xml", XML_SVG_IMAGE: "image/svg+xml" }), ft = Object.keys(ye).map(function(e) {
    return ye[e];
  });
  function ht(e) {
    return ft.indexOf(e) > -1;
  }
  var At = ce2({ HTML: "http://www.w3.org/1999/xhtml", SVG: "http://www.w3.org/2000/svg", XML: "http://www.w3.org/XML/1998/namespace", XMLNS: "http://www.w3.org/2000/xmlns/" });
  R2.assign = st;
  R2.find = ot;
  R2.freeze = ce2;
  R2.HTML_BOOLEAN_ATTRIBUTES = Vu;
  R2.HTML_RAW_TEXT_ELEMENTS = we;
  R2.HTML_VOID_ELEMENTS = Hu;
  R2.hasDefaultHTMLNamespace = pt;
  R2.hasOwn = te;
  R2.isHTMLBooleanAttribute = lt;
  R2.isHTMLRawTextElement = Et;
  R2.isHTMLEscapableRawTextElement = Dt;
  R2.isHTMLMimeType = Gu;
  R2.isHTMLVoidElement = ct;
  R2.isValidMimeType = ht;
  R2.MIME_TYPE = ye;
  R2.NAMESPACE = At;
});
var Be = W((Oe) => {
  "use strict";
  var mt = ne();
  function Xu(e, u) {
    e.prototype = Object.create(Error.prototype, { constructor: { value: e }, name: { value: e.name, enumerable: true, writable: u } });
  }
  var Se = mt.freeze({ Error: "Error", IndexSizeError: "IndexSizeError", DomstringSizeError: "DomstringSizeError", HierarchyRequestError: "HierarchyRequestError", WrongDocumentError: "WrongDocumentError", InvalidCharacterError: "InvalidCharacterError", NoDataAllowedError: "NoDataAllowedError", NoModificationAllowedError: "NoModificationAllowedError", NotFoundError: "NotFoundError", NotSupportedError: "NotSupportedError", InUseAttributeError: "InUseAttributeError", InvalidStateError: "InvalidStateError", SyntaxError: "SyntaxError", InvalidModificationError: "InvalidModificationError", NamespaceError: "NamespaceError", InvalidAccessError: "InvalidAccessError", ValidationError: "ValidationError", TypeMismatchError: "TypeMismatchError", SecurityError: "SecurityError", NetworkError: "NetworkError", AbortError: "AbortError", URLMismatchError: "URLMismatchError", QuotaExceededError: "QuotaExceededError", TimeoutError: "TimeoutError", InvalidNodeTypeError: "InvalidNodeTypeError", DataCloneError: "DataCloneError", EncodingError: "EncodingError", NotReadableError: "NotReadableError", UnknownError: "UnknownError", ConstraintError: "ConstraintError", DataError: "DataError", TransactionInactiveError: "TransactionInactiveError", ReadOnlyError: "ReadOnlyError", VersionError: "VersionError", OperationError: "OperationError", NotAllowedError: "NotAllowedError", OptOutError: "OptOutError" }), zu = Object.keys(Se);
  function ju(e) {
    return typeof e == "number" && e >= 1 && e <= 25;
  }
  function dt(e) {
    return typeof e == "string" && e.substring(e.length - Se.Error.length) === Se.Error;
  }
  function Ie(e, u) {
    ju(e) ? (this.name = zu[e], this.message = u || "") : (this.message = e, this.name = dt(u) ? u : Se.Error), Error.captureStackTrace && Error.captureStackTrace(this, Ie);
  }
  Xu(Ie, true);
  Object.defineProperties(Ie.prototype, { code: { enumerable: true, get: function() {
    var e = zu.indexOf(this.name);
    return ju(e) ? e : 0;
  } } });
  var Qu = { INDEX_SIZE_ERR: 1, DOMSTRING_SIZE_ERR: 2, HIERARCHY_REQUEST_ERR: 3, WRONG_DOCUMENT_ERR: 4, INVALID_CHARACTER_ERR: 5, NO_DATA_ALLOWED_ERR: 6, NO_MODIFICATION_ALLOWED_ERR: 7, NOT_FOUND_ERR: 8, NOT_SUPPORTED_ERR: 9, INUSE_ATTRIBUTE_ERR: 10, INVALID_STATE_ERR: 11, SYNTAX_ERR: 12, INVALID_MODIFICATION_ERR: 13, NAMESPACE_ERR: 14, INVALID_ACCESS_ERR: 15, VALIDATION_ERR: 16, TYPE_MISMATCH_ERR: 17, SECURITY_ERR: 18, NETWORK_ERR: 19, ABORT_ERR: 20, URL_MISMATCH_ERR: 21, QUOTA_EXCEEDED_ERR: 22, TIMEOUT_ERR: 23, INVALID_NODE_TYPE_ERR: 24, DATA_CLONE_ERR: 25 }, Cu = Object.entries(Qu);
  for (_e = 0; _e < Cu.length; _e++) Yu = Cu[_e][0], Ie[Yu] = Cu[_e][1];
  var Yu, _e;
  function Tu(e, u) {
    this.message = e, this.locator = u, Error.captureStackTrace && Error.captureStackTrace(this, Tu);
  }
  Xu(Tu);
  Oe.DOMException = Ie;
  Oe.DOMExceptionName = Se;
  Oe.ExceptionCode = Qu;
  Oe.ParseError = Tu;
});
var Su = W((h) => {
  "use strict";
  function ur(e) {
    try {
      typeof e != "function" && (e = RegExp);
      var u = new e("𝌆", "u").exec("𝌆");
      return !!u && u[0].length === 2;
    } catch {
    }
    return false;
  }
  var Fe = ur();
  function ie2(e) {
    if (e.source[0] !== "[") throw new Error(e + " can not be used with chars");
    return e.source.slice(1, e.source.lastIndexOf("]"));
  }
  function Ee(e, u) {
    if (e.source[0] !== "[") throw new Error("/" + e.source + "/ can not be used with chars_without");
    if (!u || typeof u != "string") throw new Error(JSON.stringify(u) + " is not a valid search");
    if (e.source.indexOf(u) === -1) throw new Error('"' + u + '" is not is /' + e.source + "/");
    if (u === "-" && e.source.indexOf(u) !== 1) throw new Error('"' + u + '" is not at the first postion of /' + e.source + "/");
    return new RegExp(e.source.replace(u, ""), Fe ? "u" : "");
  }
  function m2(e) {
    var u = this;
    return new RegExp(Array.prototype.slice.call(arguments).map(function(r) {
      var t = typeof r == "string";
      if (t && u === void 0 && r === "|") throw new Error("use regg instead of reg to wrap expressions with `|`!");
      return t ? r : r.source;
    }).join(""), Fe ? "mu" : "m");
  }
  function D(e) {
    if (arguments.length === 0) throw new Error("no parameters provided");
    return m2.apply(D, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
  }
  var gt = "�", ae = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
  Fe && (ae = m2("[", ie2(ae), "\\u{10000}-\\u{10FFFF}", "]"));
  var Nu = /[\x20\x09\x0D\x0A]/, Ct = ie2(Nu), T = m2(Nu, "+"), N3 = m2(Nu, "*"), Re = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  Fe && (Re = m2("[", ie2(Re), "\\u{10000}-\\u{10FFFF}", "]"));
  var Tt = ie2(Re), bu = m2("[", Tt, ie2(/[-.0-9\xB7]/), ie2(/[\u0300-\u036F\u203F-\u2040]/), "]"), V2 = m2(Re, bu, "*"), Wu = m2(bu, "+"), vt = m2("&", V2, ";"), Nt = D(/&#[0-9]+;|&#x[0-9a-fA-F]+;/), Me = D(vt, "|", Nt), xe = m2("%", V2, ";"), wu = D(m2('"', D(/[^%&"]/, "|", xe, "|", Me), "*", '"'), "|", m2("'", D(/[^%&']/, "|", xe, "|", Me), "*", "'")), bt = D('"', D(/[^<&"]/, "|", Me), "*", '"', "|", "'", D(/[^<&']/, "|", Me), "*", "'"), wt = Ee(Re, ":"), yt = Ee(bu, ":"), Zu = m2(wt, yt, "*"), Pe = m2(Zu, D(":", Zu), "?"), _t = m2("^", Pe, "$"), St = m2("(", Pe, ")"), Le = D(/"[^"]*"|'[^']*'/), It = m2(/^<\?/, "(", V2, ")", D(T, "(", ae, "*?)"), "?", /\?>/), Ju = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/, Je = D('"', Ju, '*"', "|", "'", Ee(Ju, "'"), "*'"), rr = "<!--", tr2 = "-->", Ot = m2(rr, D(Ee(ae, "-"), "|", m2("-", Ee(ae, "-"))), "*", tr2), $u = "#PCDATA", Bt = D(m2(/\(/, N3, $u, D(N3, /\|/, N3, Pe), "*", N3, /\)\*/), "|", m2(/\(/, N3, $u, N3, /\)/)), Rt = /[?*+]?/, Mt = m2(/\([^>]+\)/, Rt), xt = D("EMPTY", "|", "ANY", "|", Bt, "|", Mt), Lt = "<!ELEMENT", Ft = m2(Lt, T, D(Pe, "|", xe), T, D(xt, "|", xe), N3, ">"), Pt = m2("NOTATION", T, /\(/, N3, V2, D(N3, /\|/, N3, V2), "*", N3, /\)/), qt = m2(/\(/, N3, Wu, D(N3, /\|/, N3, Wu), "*", N3, /\)/), Ut = D(Pt, "|", qt), kt = D(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", Ut), Vt = D(/#REQUIRED|#IMPLIED/, "|", D(D("#FIXED", T), "?", bt)), Ht = D(T, V2, T, kt, T, Vt), Gt = "<!ATTLIST", Yt = m2(Gt, T, V2, Ht, "*", N3, ">"), vu = "about:legacy-compat", Xt = D('"' + vu + '"', "|", "'" + vu + "'"), yu = "SYSTEM", $e = "PUBLIC", Ke = D(D(yu, T, Le), "|", D($e, T, Je, T, Le)), zt = m2("^", D(D(yu, T, "(?<SystemLiteralOnly>", Le, ")"), "|", D($e, T, "(?<PubidLiteral>", Je, ")", T, "(?<SystemLiteral>", Le, ")"))), jt = D(T, "NDATA", T, V2), Qt = D(wu, "|", D(Ke, jt, "?")), nr2 = "<!ENTITY", Wt = m2(nr2, T, V2, T, Qt, N3, ">"), Zt = D(wu, "|", Ke), Jt = m2(nr2, T, "%", T, V2, T, Zt, N3, ">"), $t = D(Wt, "|", Jt), Kt = m2($e, T, Je), en = m2("<!NOTATION", T, V2, T, D(Ke, "|", Kt), N3, ">"), _u = m2(N3, "=", N3), Ku = /1[.]\d+/, un = m2(T, "version", _u, D("'", Ku, "'", "|", '"', Ku, '"')), er2 = /[A-Za-z][-A-Za-z0-9._]*/, rn = D(T, "encoding", _u, D('"', er2, '"', "|", "'", er2, "'")), tn = D(T, "standalone", _u, D("'", D("yes", "|", "no"), "'", "|", '"', D("yes", "|", "no"), '"')), nn = m2(/^<\?xml/, un, rn, "?", tn, "?", N3, /\?>/), an = "<!DOCTYPE", on = "<![CDATA[", sn = "]]>", ln = /<!\[CDATA\[/, cn = /\]\]>/, En = m2(ae, "*?", cn), Dn = m2(ln, En);
  h.chars = ie2;
  h.chars_without = Ee;
  h.detectUnicodeSupport = ur;
  h.reg = m2;
  h.regg = D;
  h.ABOUT_LEGACY_COMPAT = vu;
  h.ABOUT_LEGACY_COMPAT_SystemLiteral = Xt;
  h.AttlistDecl = Yt;
  h.CDATA_START = on;
  h.CDATA_END = sn;
  h.CDSect = Dn;
  h.Char = ae;
  h.Comment = Ot;
  h.COMMENT_START = rr;
  h.COMMENT_END = tr2;
  h.DOCTYPE_DECL_START = an;
  h.elementdecl = Ft;
  h.EntityDecl = $t;
  h.EntityValue = wu;
  h.ExternalID = Ke;
  h.ExternalID_match = zt;
  h.Name = V2;
  h.NotationDecl = en;
  h.Reference = Me;
  h.PEReference = xe;
  h.PI = It;
  h.PUBLIC = $e;
  h.PubidLiteral = Je;
  h.QName = Pe;
  h.QName_exact = _t;
  h.QName_group = St;
  h.S = T;
  h.SChar_s = Ct;
  h.S_OPT = N3;
  h.SYSTEM = yu;
  h.SystemLiteral = Le;
  h.UNICODE_REPLACEMENT_CHARACTER = gt;
  h.UNICODE_SUPPORT = Fe;
  h.XMLDecl = nn;
});
var xu = W((y) => {
  "use strict";
  var H = ne(), z3 = H.find, pn = H.hasDefaultHTMLNamespace, pe = H.hasOwn, fn = H.isHTMLMimeType, hn = H.isHTMLRawTextElement, An = H.isHTMLVoidElement, qe = H.MIME_TYPE, j = H.NAMESPACE, x = Symbol(), Er = Be(), E2 = Er.DOMException, mn = Er.DOMExceptionName, X3 = Su();
  function L3(e) {
    if (e !== x) throw new TypeError("Illegal constructor");
  }
  function dn(e) {
    return e !== "";
  }
  function gn(e) {
    return e ? e.split(/[\t\n\f\r ]+/).filter(dn) : [];
  }
  function Cn(e, u) {
    return pe(e, u) || (e[u] = true), e;
  }
  function ir(e) {
    if (!e) return [];
    var u = gn(e);
    return Object.keys(u.reduce(Cn, {}));
  }
  function Tn(e) {
    return function(u) {
      return e && e.indexOf(u) !== -1;
    };
  }
  function Dr(e) {
    if (!X3.QName_exact.test(e)) throw new E2(E2.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + e + '"');
  }
  function Ou(e, u) {
    Dr(u), e = e || null;
    var r = null, t = u;
    if (u.indexOf(":") >= 0) {
      var n = u.split(":");
      r = n[0], t = n[1];
    }
    if (r !== null && e === null) throw new E2(E2.NAMESPACE_ERR, "prefix is non-null and namespace is null");
    if (r === "xml" && e !== H.NAMESPACE.XML) throw new E2(E2.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
    if ((r === "xmlns" || u === "xmlns") && e !== H.NAMESPACE.XMLNS) throw new E2(E2.NAMESPACE_ERR, 'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace');
    if (e === H.NAMESPACE.XMLNS && r !== "xmlns" && u !== "xmlns") throw new E2(E2.NAMESPACE_ERR, 'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"');
    return [e, r, t];
  }
  function Ae(e, u) {
    for (var r in e) pe(e, r) && (u[r] = e[r]);
  }
  function F(e, u) {
    var r = e.prototype;
    if (!(r instanceof u)) {
      let t = function() {
      };
      t.prototype = u.prototype, t = new t(), Ae(r, t), e.prototype = r = t;
    }
    r.constructor != e && (typeof e != "function" && console.error("unknown Class:" + e), r.constructor = e);
  }
  var P3 = {}, Y3 = P3.ELEMENT_NODE = 1, fe2 = P3.ATTRIBUTE_NODE = 2, eu = P3.TEXT_NODE = 3, pr = P3.CDATA_SECTION_NODE = 4, fr = P3.ENTITY_REFERENCE_NODE = 5, vn = P3.ENTITY_NODE = 6, hr = P3.PROCESSING_INSTRUCTION_NODE = 7, Ar = P3.COMMENT_NODE = 8, ke = P3.DOCUMENT_NODE = 9, mr = P3.DOCUMENT_TYPE_NODE = 10, Z3 = P3.DOCUMENT_FRAGMENT_NODE = 11, Nn = P3.NOTATION_NODE = 12, b = H.freeze({ DOCUMENT_POSITION_DISCONNECTED: 1, DOCUMENT_POSITION_PRECEDING: 2, DOCUMENT_POSITION_FOLLOWING: 4, DOCUMENT_POSITION_CONTAINS: 8, DOCUMENT_POSITION_CONTAINED_BY: 16, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32 });
  function dr(e, u) {
    if (u.length < e.length) return dr(u, e);
    var r = null;
    for (var t in e) {
      if (e[t] !== u[t]) return r;
      r = e[t];
    }
    return r;
  }
  function ar(e) {
    return e.guid || (e.guid = Math.random()), e.guid;
  }
  function O3() {
  }
  O3.prototype = { length: 0, item: function(e) {
    return e >= 0 && e < this.length ? this[e] : null;
  }, toString: function(e) {
    for (var u = [], r = 0; r < this.length; r++) De(this[r], u, e);
    return u.join("");
  }, filter: function(e) {
    return Array.prototype.filter.call(this, e);
  }, indexOf: function(e) {
    return Array.prototype.indexOf.call(this, e);
  } };
  O3.prototype[Symbol.iterator] = function() {
    var e = this, u = 0;
    return { next: function() {
      return u < e.length ? { value: e[u++], done: false } : { done: true };
    }, return: function() {
      return { done: true };
    } };
  };
  function oe2(e, u) {
    this._node = e, this._refresh = u, ru(this);
  }
  function ru(e) {
    var u = e._node._inc || e._node.ownerDocument._inc;
    if (e._inc !== u) {
      var r = e._refresh(e._node);
      if (Or(e, "length", r.length), !e.$$length || r.length < e.$$length) for (var t = r.length; t in e; t++) pe(e, t) && delete e[t];
      Ae(r, e), e._inc = u;
    }
  }
  oe2.prototype.item = function(e) {
    return ru(this), this[e] || null;
  };
  F(oe2, O3);
  function he() {
  }
  function gr(e, u) {
    for (var r = 0; r < e.length; ) {
      if (e[r] === u) return r;
      r++;
    }
  }
  function bn(e, u, r, t) {
    if (t ? u[gr(u, t)] = r : (u[u.length] = r, u.length++), e) {
      r.ownerElement = e;
      var n = e.ownerDocument;
      n && (t && vr(n, e, t), wn(n, e, r));
    }
  }
  function or(e, u, r) {
    var t = gr(u, r);
    if (t >= 0) {
      for (var n = u.length - 1; t <= n; ) u[t] = u[++t];
      if (u.length = n, e) {
        var i = e.ownerDocument;
        i && vr(i, e, r), r.ownerElement = null;
      }
    }
  }
  he.prototype = { length: 0, item: O3.prototype.item, getNamedItem: function(e) {
    this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    for (var u = 0; u < this.length; ) {
      var r = this[u];
      if (r.nodeName === e) return r;
      u++;
    }
    return null;
  }, setNamedItem: function(e) {
    var u = e.ownerElement;
    if (u && u !== this._ownerElement) throw new E2(E2.INUSE_ATTRIBUTE_ERR);
    var r = this.getNamedItemNS(e.namespaceURI, e.localName);
    return r === e ? e : (bn(this._ownerElement, this, e, r), r);
  }, setNamedItemNS: function(e) {
    return this.setNamedItem(e);
  }, removeNamedItem: function(e) {
    var u = this.getNamedItem(e);
    if (!u) throw new E2(E2.NOT_FOUND_ERR, e);
    return or(this._ownerElement, this, u), u;
  }, removeNamedItemNS: function(e, u) {
    var r = this.getNamedItemNS(e, u);
    if (!r) throw new E2(E2.NOT_FOUND_ERR, e ? e + " : " + u : u);
    return or(this._ownerElement, this, r), r;
  }, getNamedItemNS: function(e, u) {
    e || (e = null);
    for (var r = 0; r < this.length; ) {
      var t = this[r];
      if (t.localName === u && t.namespaceURI === e) return t;
      r++;
    }
    return null;
  } };
  he.prototype[Symbol.iterator] = function() {
    var e = this, u = 0;
    return { next: function() {
      return u < e.length ? { value: e[u++], done: false } : { done: true };
    }, return: function() {
      return { done: true };
    } };
  };
  function Cr() {
  }
  Cr.prototype = { hasFeature: function(e, u) {
    return true;
  }, createDocument: function(e, u, r) {
    var t = qe.XML_APPLICATION;
    e === j.HTML ? t = qe.XML_XHTML_APPLICATION : e === j.SVG && (t = qe.XML_SVG_IMAGE);
    var n = new J2(x, { contentType: t });
    if (n.implementation = this, n.childNodes = new O3(), n.doctype = r || null, r && n.appendChild(r), u) {
      var i = n.createElementNS(e, u);
      n.appendChild(i);
    }
    return n;
  }, createDocumentType: function(e, u, r, t) {
    Dr(e);
    var n = new iu(x);
    return n.name = e, n.nodeName = e, n.publicId = u || "", n.systemId = r || "", n.internalSubset = t || "", n.childNodes = new O3(), n;
  }, createHTMLDocument: function(e) {
    var u = new J2(x, { contentType: qe.HTML });
    if (u.implementation = this, u.childNodes = new O3(), e !== false) {
      u.doctype = this.createDocumentType("html"), u.doctype.ownerDocument = u, u.appendChild(u.doctype);
      var r = u.createElement("html");
      u.appendChild(r);
      var t = u.createElement("head");
      if (r.appendChild(t), typeof e == "string") {
        var n = u.createElement("title");
        n.appendChild(u.createTextNode(e)), t.appendChild(n);
      }
      r.appendChild(u.createElement("body"));
    }
    return u;
  } };
  function d2(e) {
    L3(e);
  }
  d2.prototype = { firstChild: null, lastChild: null, previousSibling: null, nextSibling: null, parentNode: null, get parentElement() {
    return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
  }, childNodes: null, ownerDocument: null, nodeValue: null, namespaceURI: null, prefix: null, localName: null, baseURI: "about:blank", get isConnected() {
    var e = this.getRootNode();
    return e && e.nodeType === e.DOCUMENT_NODE;
  }, contains: function(e) {
    if (!e) return false;
    var u = e;
    do {
      if (this === u) return true;
      u = e.parentNode;
    } while (u);
    return false;
  }, getRootNode: function(e) {
    var u = this;
    do {
      if (!u.parentNode) return u;
      u = u.parentNode;
    } while (u);
  }, isEqualNode: function(e) {
    if (!e || this.nodeType !== e.nodeType) return false;
    switch (this.nodeType) {
      case this.DOCUMENT_TYPE_NODE:
        if (this.name !== e.name || this.publicId !== e.publicId || this.systemId !== e.systemId) return false;
        break;
      case this.ELEMENT_NODE:
        if (this.namespaceURI !== e.namespaceURI || this.prefix !== e.prefix || this.localName !== e.localName || this.attributes.length !== e.attributes.length) return false;
        for (var u = 0; u < this.attributes.length; u++) {
          var r = this.attributes.item(u);
          if (!r.isEqualNode(e.getAttributeNodeNS(r.namespaceURI, r.localName))) return false;
        }
        break;
      case this.ATTRIBUTE_NODE:
        if (this.namespaceURI !== e.namespaceURI || this.localName !== e.localName || this.value !== e.value) return false;
        break;
      case this.PROCESSING_INSTRUCTION_NODE:
        if (this.target !== e.target || this.data !== e.data) return false;
        break;
      case this.TEXT_NODE:
      case this.COMMENT_NODE:
        if (this.data !== e.data) return false;
        break;
    }
    if (this.childNodes.length !== e.childNodes.length) return false;
    for (var u = 0; u < this.childNodes.length; u++) if (!this.childNodes[u].isEqualNode(e.childNodes[u])) return false;
    return true;
  }, isSameNode: function(e) {
    return this === e;
  }, insertBefore: function(e, u) {
    return uu(this, e, u);
  }, replaceChild: function(e, u) {
    uu(this, e, u, yr), u && this.removeChild(u);
  }, removeChild: function(e) {
    return br(this, e);
  }, appendChild: function(e) {
    return this.insertBefore(e, null);
  }, hasChildNodes: function() {
    return this.firstChild != null;
  }, cloneNode: function(e) {
    return Bu(this.ownerDocument || this, this, e);
  }, normalize: function() {
    for (var e = this.firstChild; e; ) {
      var u = e.nextSibling;
      u && u.nodeType == eu && e.nodeType == eu ? (this.removeChild(u), e.appendData(u.data)) : (e.normalize(), e = u);
    }
  }, isSupported: function(e, u) {
    return this.ownerDocument.implementation.hasFeature(e, u);
  }, lookupPrefix: function(e) {
    for (var u = this; u; ) {
      var r = u._nsMap;
      if (r) {
        for (var t in r) if (pe(r, t) && r[t] === e) return t;
      }
      u = u.nodeType == fe2 ? u.ownerDocument : u.parentNode;
    }
    return null;
  }, lookupNamespaceURI: function(e) {
    for (var u = this; u; ) {
      var r = u._nsMap;
      if (r && pe(r, e)) return r[e];
      u = u.nodeType == fe2 ? u.ownerDocument : u.parentNode;
    }
    return null;
  }, isDefaultNamespace: function(e) {
    var u = this.lookupPrefix(e);
    return u == null;
  }, compareDocumentPosition: function(e) {
    if (this === e) return 0;
    var u = e, r = this, t = null, n = null;
    if (u instanceof se2 && (t = u, u = t.ownerElement), r instanceof se2 && (n = r, r = n.ownerElement, t && u && r === u)) for (var i = 0, a; a = r.attributes[i]; i++) {
      if (a === t) return b.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + b.DOCUMENT_POSITION_PRECEDING;
      if (a === n) return b.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + b.DOCUMENT_POSITION_FOLLOWING;
    }
    if (!u || !r || r.ownerDocument !== u.ownerDocument) return b.DOCUMENT_POSITION_DISCONNECTED + b.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (ar(r.ownerDocument) > ar(u.ownerDocument) ? b.DOCUMENT_POSITION_FOLLOWING : b.DOCUMENT_POSITION_PRECEDING);
    if (n && u === r) return b.DOCUMENT_POSITION_CONTAINS + b.DOCUMENT_POSITION_PRECEDING;
    if (t && u === r) return b.DOCUMENT_POSITION_CONTAINED_BY + b.DOCUMENT_POSITION_FOLLOWING;
    for (var c = [], o = u.parentNode; o; ) {
      if (!n && o === r) return b.DOCUMENT_POSITION_CONTAINED_BY + b.DOCUMENT_POSITION_FOLLOWING;
      c.push(o), o = o.parentNode;
    }
    c.reverse();
    for (var l2 = [], s = r.parentNode; s; ) {
      if (!t && s === u) return b.DOCUMENT_POSITION_CONTAINS + b.DOCUMENT_POSITION_PRECEDING;
      l2.push(s), s = s.parentNode;
    }
    l2.reverse();
    var p = dr(c, l2);
    for (var A2 in p.childNodes) {
      var v = p.childNodes[A2];
      if (v === r) return b.DOCUMENT_POSITION_FOLLOWING;
      if (v === u) return b.DOCUMENT_POSITION_PRECEDING;
      if (l2.indexOf(v) >= 0) return b.DOCUMENT_POSITION_FOLLOWING;
      if (c.indexOf(v) >= 0) return b.DOCUMENT_POSITION_PRECEDING;
    }
    return 0;
  } };
  function Tr(e) {
    return e == "<" && "&lt;" || e == ">" && "&gt;" || e == "&" && "&amp;" || e == '"' && "&quot;" || "&#" + e.charCodeAt() + ";";
  }
  Ae(P3, d2);
  Ae(P3, d2.prototype);
  Ae(b, d2);
  Ae(b, d2.prototype);
  function Ue(e, u) {
    if (u(e)) return true;
    if (e = e.firstChild) do
      if (Ue(e, u)) return true;
    while (e = e.nextSibling);
  }
  function J2(e, u) {
    L3(e);
    var r = u || {};
    this.ownerDocument = this, this.contentType = r.contentType || qe.XML_APPLICATION, this.type = fn(this.contentType) ? "html" : "xml";
  }
  function wn(e, u, r) {
    e && e._inc++;
    var t = r.namespaceURI;
    t === j.XMLNS && (u._nsMap[r.prefix ? r.localName : ""] = r.value);
  }
  function vr(e, u, r, t) {
    e && e._inc++;
    var n = r.namespaceURI;
    n === j.XMLNS && delete u._nsMap[r.prefix ? r.localName : ""];
  }
  function Nr(e, u, r) {
    if (e && e._inc) {
      e._inc++;
      var t = u.childNodes;
      if (r && !r.nextSibling) t[t.length++] = r;
      else {
        for (var n = u.firstChild, i = 0; n; ) t[i++] = n, n = n.nextSibling;
        t.length = i, delete t[t.length];
      }
    }
  }
  function br(e, u) {
    if (e !== u.parentNode) throw new E2(E2.NOT_FOUND_ERR, "child's parent is not parent");
    var r = u.previousSibling, t = u.nextSibling;
    return r ? r.nextSibling = t : e.firstChild = t, t ? t.previousSibling = r : e.lastChild = r, Nr(e.ownerDocument, e), u.parentNode = null, u.previousSibling = null, u.nextSibling = null, u;
  }
  function yn(e) {
    return e && (e.nodeType === d2.DOCUMENT_NODE || e.nodeType === d2.DOCUMENT_FRAGMENT_NODE || e.nodeType === d2.ELEMENT_NODE);
  }
  function _n(e) {
    return e && (e.nodeType === d2.CDATA_SECTION_NODE || e.nodeType === d2.COMMENT_NODE || e.nodeType === d2.DOCUMENT_FRAGMENT_NODE || e.nodeType === d2.DOCUMENT_TYPE_NODE || e.nodeType === d2.ELEMENT_NODE || e.nodeType === d2.PROCESSING_INSTRUCTION_NODE || e.nodeType === d2.TEXT_NODE);
  }
  function $2(e) {
    return e && e.nodeType === d2.DOCUMENT_TYPE_NODE;
  }
  function Q3(e) {
    return e && e.nodeType === d2.ELEMENT_NODE;
  }
  function wr(e) {
    return e && e.nodeType === d2.TEXT_NODE;
  }
  function sr(e, u) {
    var r = e.childNodes || [];
    if (z3(r, Q3) || $2(u)) return false;
    var t = z3(r, $2);
    return !(u && t && r.indexOf(t) > r.indexOf(u));
  }
  function lr(e, u) {
    var r = e.childNodes || [];
    function t(i) {
      return Q3(i) && i !== u;
    }
    if (z3(r, t)) return false;
    var n = z3(r, $2);
    return !(u && n && r.indexOf(n) > r.indexOf(u));
  }
  function Sn(e, u, r) {
    if (!yn(e)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + e.nodeType);
    if (r && r.parentNode !== e) throw new E2(E2.NOT_FOUND_ERR, "child not in parent");
    if (!_n(u) || $2(u) && e.nodeType !== d2.DOCUMENT_NODE) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Unexpected node type " + u.nodeType + " for parent node type " + e.nodeType);
  }
  function In(e, u, r) {
    var t = e.childNodes || [], n = u.childNodes || [];
    if (u.nodeType === d2.DOCUMENT_FRAGMENT_NODE) {
      var i = n.filter(Q3);
      if (i.length > 1 || z3(n, wr)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
      if (i.length === 1 && !sr(e, r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
    }
    if (Q3(u) && !sr(e, r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
    if ($2(u)) {
      if (z3(t, $2)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
      var a = z3(t, Q3);
      if (r && t.indexOf(a) < t.indexOf(r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
      if (!r && a) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
    }
  }
  function yr(e, u, r) {
    var t = e.childNodes || [], n = u.childNodes || [];
    if (u.nodeType === d2.DOCUMENT_FRAGMENT_NODE) {
      var i = n.filter(Q3);
      if (i.length > 1 || z3(n, wr)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
      if (i.length === 1 && !lr(e, r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
    }
    if (Q3(u) && !lr(e, r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
    if ($2(u)) {
      if (z3(t, function(o) {
        return $2(o) && o !== r;
      })) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
      var a = z3(t, Q3);
      if (r && t.indexOf(a) < t.indexOf(r)) throw new E2(E2.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
    }
  }
  function uu(e, u, r, t) {
    Sn(e, u, r), e.nodeType === d2.DOCUMENT_NODE && (t || In)(e, u, r);
    var n = u.parentNode;
    if (n && n.removeChild(u), u.nodeType === Z3) {
      var i = u.firstChild;
      if (i == null) return u;
      var a = u.lastChild;
    } else i = a = u;
    var c = r ? r.previousSibling : e.lastChild;
    i.previousSibling = c, a.nextSibling = r, c ? c.nextSibling = i : e.firstChild = i, r == null ? e.lastChild = a : r.previousSibling = a;
    do
      i.parentNode = e;
    while (i !== a && (i = i.nextSibling));
    return Nr(e.ownerDocument || e, e, u), u.nodeType == Z3 && (u.firstChild = u.lastChild = null), u;
  }
  J2.prototype = { implementation: null, nodeName: "#document", nodeType: ke, doctype: null, documentElement: null, _inc: 1, insertBefore: function(e, u) {
    if (e.nodeType === Z3) {
      for (var r = e.firstChild; r; ) {
        var t = r.nextSibling;
        this.insertBefore(r, u), r = t;
      }
      return e;
    }
    return uu(this, e, u), e.ownerDocument = this, this.documentElement === null && e.nodeType === Y3 && (this.documentElement = e), e;
  }, removeChild: function(e) {
    var u = br(this, e);
    return u === this.documentElement && (this.documentElement = null), u;
  }, replaceChild: function(e, u) {
    uu(this, e, u, yr), e.ownerDocument = this, u && this.removeChild(u), Q3(e) && (this.documentElement = e);
  }, importNode: function(e, u) {
    return Ir(this, e, u);
  }, getElementById: function(e) {
    var u = null;
    return Ue(this.documentElement, function(r) {
      if (r.nodeType == Y3 && r.getAttribute("id") == e) return u = r, true;
    }), u;
  }, createElement: function(e) {
    var u = new K2(x);
    u.ownerDocument = this, this.type === "html" && (e = e.toLowerCase()), pn(this.contentType) && (u.namespaceURI = j.HTML), u.nodeName = e, u.tagName = e, u.localName = e, u.childNodes = new O3();
    var r = u.attributes = new he();
    return r._ownerElement = u, u;
  }, createDocumentFragment: function() {
    var e = new He(x);
    return e.ownerDocument = this, e.childNodes = new O3(), e;
  }, createTextNode: function(e) {
    var u = new Ve(x);
    return u.ownerDocument = this, u.childNodes = new O3(), u.appendData(e), u;
  }, createComment: function(e) {
    var u = new tu(x);
    return u.ownerDocument = this, u.childNodes = new O3(), u.appendData(e), u;
  }, createCDATASection: function(e) {
    var u = new nu(x);
    return u.ownerDocument = this, u.childNodes = new O3(), u.appendData(e), u;
  }, createProcessingInstruction: function(e, u) {
    var r = new ou(x);
    return r.ownerDocument = this, r.childNodes = new O3(), r.nodeName = r.target = e, r.nodeValue = r.data = u, r;
  }, createAttribute: function(e) {
    if (!X3.QName_exact.test(e)) throw new E2(E2.INVALID_CHARACTER_ERR, 'invalid character in name "' + e + '"');
    return this.type === "html" && (e = e.toLowerCase()), this._createAttribute(e);
  }, _createAttribute: function(e) {
    var u = new se2(x);
    return u.ownerDocument = this, u.childNodes = new O3(), u.name = e, u.nodeName = e, u.localName = e, u.specified = true, u;
  }, createEntityReference: function(e) {
    if (!X3.Name.test(e)) throw new E2(E2.INVALID_CHARACTER_ERR, 'not a valid xml name "' + e + '"');
    if (this.type === "html") throw new E2("document is an html document", mn.NotSupportedError);
    var u = new au(x);
    return u.ownerDocument = this, u.childNodes = new O3(), u.nodeName = e, u;
  }, createElementNS: function(e, u) {
    var r = Ou(e, u), t = new K2(x), n = t.attributes = new he();
    return t.childNodes = new O3(), t.ownerDocument = this, t.nodeName = u, t.tagName = u, t.namespaceURI = r[0], t.prefix = r[1], t.localName = r[2], n._ownerElement = t, t;
  }, createAttributeNS: function(e, u) {
    var r = Ou(e, u), t = new se2(x);
    return t.ownerDocument = this, t.childNodes = new O3(), t.nodeName = u, t.name = u, t.specified = true, t.namespaceURI = r[0], t.prefix = r[1], t.localName = r[2], t;
  } };
  F(J2, d2);
  function K2(e) {
    L3(e), this._nsMap = /* @__PURE__ */ Object.create(null);
  }
  K2.prototype = { nodeType: Y3, attributes: null, getQualifiedName: function() {
    return this.prefix ? this.prefix + ":" + this.localName : this.localName;
  }, _isInHTMLDocumentAndNamespace: function() {
    return this.ownerDocument.type === "html" && this.namespaceURI === j.HTML;
  }, hasAttributes: function() {
    return !!(this.attributes && this.attributes.length);
  }, hasAttribute: function(e) {
    return !!this.getAttributeNode(e);
  }, getAttribute: function(e) {
    var u = this.getAttributeNode(e);
    return u ? u.value : null;
  }, getAttributeNode: function(e) {
    return this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase()), this.attributes.getNamedItem(e);
  }, setAttribute: function(e, u) {
    this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    var r = this.getAttributeNode(e);
    r ? r.value = r.nodeValue = "" + u : (r = this.ownerDocument._createAttribute(e), r.value = r.nodeValue = "" + u, this.setAttributeNode(r));
  }, removeAttribute: function(e) {
    var u = this.getAttributeNode(e);
    u && this.removeAttributeNode(u);
  }, setAttributeNode: function(e) {
    return this.attributes.setNamedItem(e);
  }, setAttributeNodeNS: function(e) {
    return this.attributes.setNamedItemNS(e);
  }, removeAttributeNode: function(e) {
    return this.attributes.removeNamedItem(e.nodeName);
  }, removeAttributeNS: function(e, u) {
    var r = this.getAttributeNodeNS(e, u);
    r && this.removeAttributeNode(r);
  }, hasAttributeNS: function(e, u) {
    return this.getAttributeNodeNS(e, u) != null;
  }, getAttributeNS: function(e, u) {
    var r = this.getAttributeNodeNS(e, u);
    return r ? r.value : null;
  }, setAttributeNS: function(e, u, r) {
    var t = Ou(e, u), n = t[2], i = this.getAttributeNodeNS(e, n);
    i ? i.value = i.nodeValue = "" + r : (i = this.ownerDocument.createAttributeNS(e, u), i.value = i.nodeValue = "" + r, this.setAttributeNode(i));
  }, getAttributeNodeNS: function(e, u) {
    return this.attributes.getNamedItemNS(e, u);
  }, getElementsByClassName: function(e) {
    var u = ir(e);
    return new oe2(this, function(r) {
      var t = [];
      return u.length > 0 && Ue(r, function(n) {
        if (n !== r && n.nodeType === Y3) {
          var i = n.getAttribute("class");
          if (i) {
            var a = e === i;
            if (!a) {
              var c = ir(i);
              a = u.every(Tn(c));
            }
            a && t.push(n);
          }
        }
      }), t;
    });
  }, getElementsByTagName: function(e) {
    var u = (this.nodeType === ke ? this : this.ownerDocument).type === "html", r = e.toLowerCase();
    return new oe2(this, function(t) {
      var n = [];
      return Ue(t, function(i) {
        if (!(i === t || i.nodeType !== Y3)) if (e === "*") n.push(i);
        else {
          var a = i.getQualifiedName(), c = u && i.namespaceURI === j.HTML ? r : e;
          a === c && n.push(i);
        }
      }), n;
    });
  }, getElementsByTagNameNS: function(e, u) {
    return new oe2(this, function(r) {
      var t = [];
      return Ue(r, function(n) {
        n !== r && n.nodeType === Y3 && (e === "*" || n.namespaceURI === e) && (u === "*" || n.localName == u) && t.push(n);
      }), t;
    });
  } };
  J2.prototype.getElementsByClassName = K2.prototype.getElementsByClassName;
  J2.prototype.getElementsByTagName = K2.prototype.getElementsByTagName;
  J2.prototype.getElementsByTagNameNS = K2.prototype.getElementsByTagNameNS;
  F(K2, d2);
  function se2(e) {
    L3(e), this.namespaceURI = null, this.prefix = null, this.ownerElement = null;
  }
  se2.prototype.nodeType = fe2;
  F(se2, d2);
  function me(e) {
    L3(e);
  }
  me.prototype = { data: "", substringData: function(e, u) {
    return this.data.substring(e, e + u);
  }, appendData: function(e) {
    e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
  }, insertData: function(e, u) {
    this.replaceData(e, 0, u);
  }, deleteData: function(e, u) {
    this.replaceData(e, u, "");
  }, replaceData: function(e, u, r) {
    var t = this.data.substring(0, e), n = this.data.substring(e + u);
    r = t + r + n, this.nodeValue = this.data = r, this.length = r.length;
  } };
  F(me, d2);
  function Ve(e) {
    L3(e);
  }
  Ve.prototype = { nodeName: "#text", nodeType: eu, splitText: function(e) {
    var u = this.data, r = u.substring(e);
    u = u.substring(0, e), this.data = this.nodeValue = u, this.length = u.length;
    var t = this.ownerDocument.createTextNode(r);
    return this.parentNode && this.parentNode.insertBefore(t, this.nextSibling), t;
  } };
  F(Ve, me);
  function tu(e) {
    L3(e);
  }
  tu.prototype = { nodeName: "#comment", nodeType: Ar };
  F(tu, me);
  function nu(e) {
    L3(e);
  }
  nu.prototype = { nodeName: "#cdata-section", nodeType: pr };
  F(nu, Ve);
  function iu(e) {
    L3(e);
  }
  iu.prototype.nodeType = mr;
  F(iu, d2);
  function Ru(e) {
    L3(e);
  }
  Ru.prototype.nodeType = Nn;
  F(Ru, d2);
  function Mu(e) {
    L3(e);
  }
  Mu.prototype.nodeType = vn;
  F(Mu, d2);
  function au(e) {
    L3(e);
  }
  au.prototype.nodeType = fr;
  F(au, d2);
  function He(e) {
    L3(e);
  }
  He.prototype.nodeName = "#document-fragment";
  He.prototype.nodeType = Z3;
  F(He, d2);
  function ou(e) {
    L3(e);
  }
  ou.prototype.nodeType = hr;
  F(ou, me);
  function _r() {
  }
  _r.prototype.serializeToString = function(e, u) {
    return Sr.call(e, u);
  };
  d2.prototype.toString = Sr;
  function Sr(e) {
    var u = [], r = this.nodeType === ke && this.documentElement || this, t = r.prefix, n = r.namespaceURI;
    if (n && t == null) {
      var t = r.lookupPrefix(n);
      if (t == null) var i = [{ namespace: n, prefix: null }];
    }
    return De(this, u, e, i), u.join("");
  }
  function cr(e, u, r) {
    var t = e.prefix || "", n = e.namespaceURI;
    if (!n || t === "xml" && n === j.XML || n === j.XMLNS) return false;
    for (var i = r.length; i--; ) {
      var a = r[i];
      if (a.prefix === t) return a.namespace !== n;
    }
    return true;
  }
  function Iu(e, u, r) {
    e.push(" ", u, '="', r.replace(/[<>&"\t\n\r]/g, Tr), '"');
  }
  function De(e, u, r, t) {
    t || (t = []);
    var n = e.nodeType === ke ? e : e.ownerDocument, i = n.type === "html";
    if (r) if (e = r(e), e) {
      if (typeof e == "string") {
        u.push(e);
        return;
      }
    } else return;
    switch (e.nodeType) {
      case Y3:
        var a = e.attributes, c = a.length, I = e.firstChild, o = e.tagName, l2 = o;
        if (!i && !e.prefix && e.namespaceURI) {
          for (var s, p = 0; p < a.length; p++) if (a.item(p).name === "xmlns") {
            s = a.item(p).value;
            break;
          }
          if (!s) for (var A2 = t.length - 1; A2 >= 0; A2--) {
            var v = t[A2];
            if (v.prefix === "" && v.namespace === e.namespaceURI) {
              s = v.namespace;
              break;
            }
          }
          if (s !== e.namespaceURI) for (var A2 = t.length - 1; A2 >= 0; A2--) {
            var v = t[A2];
            if (v.namespace === e.namespaceURI) {
              v.prefix && (l2 = v.prefix + ":" + o);
              break;
            }
          }
        }
        u.push("<", l2);
        for (var M = 0; M < c; M++) {
          var _2 = a.item(M);
          _2.prefix == "xmlns" ? t.push({ prefix: _2.localName, namespace: _2.value }) : _2.nodeName == "xmlns" && t.push({ prefix: "", namespace: _2.value });
        }
        for (var M = 0; M < c; M++) {
          var _2 = a.item(M);
          if (cr(_2, i, t)) {
            var w = _2.prefix || "", S = _2.namespaceURI;
            Iu(u, w ? "xmlns:" + w : "xmlns", S), t.push({ prefix: w, namespace: S });
          }
          De(_2, u, r, t);
        }
        if (o === l2 && cr(e, i, t)) {
          var w = e.prefix || "", S = e.namespaceURI;
          Iu(u, w ? "xmlns:" + w : "xmlns", S), t.push({ prefix: w, namespace: S });
        }
        var ue = !I;
        if (ue && (i || e.namespaceURI === j.HTML) && (ue = An(o)), ue) u.push("/>");
        else {
          if (u.push(">"), i && hn(o)) for (; I; ) I.data ? u.push(I.data) : De(I, u, r, t.slice()), I = I.nextSibling;
          else for (; I; ) De(I, u, r, t.slice()), I = I.nextSibling;
          u.push("</", l2, ">");
        }
        return;
      case ke:
      case Z3:
        for (var I = e.firstChild; I; ) De(I, u, r, t.slice()), I = I.nextSibling;
        return;
      case fe2:
        return Iu(u, e.name, e.value);
      case eu:
        return u.push(e.data.replace(/[<&>]/g, Tr));
      case pr:
        return u.push(X3.CDATA_START, e.data, X3.CDATA_END);
      case Ar:
        return u.push(X3.COMMENT_START, e.data, X3.COMMENT_END);
      case mr:
        var re = e.publicId, G2 = e.systemId;
        u.push(X3.DOCTYPE_DECL_START, " ", e.name), re ? (u.push(" ", X3.PUBLIC, " ", re), G2 && G2 !== "." && u.push(" ", G2)) : G2 && G2 !== "." && u.push(" ", X3.SYSTEM, " ", G2), e.internalSubset && u.push(" [", e.internalSubset, "]"), u.push(">");
        return;
      case hr:
        return u.push("<?", e.target, " ", e.data, "?>");
      case fr:
        return u.push("&", e.nodeName, ";");
      default:
        u.push("??", e.nodeName);
    }
  }
  function Ir(e, u, r) {
    var t;
    switch (u.nodeType) {
      case Y3:
        t = u.cloneNode(false), t.ownerDocument = e;
      case Z3:
        break;
      case fe2:
        r = true;
        break;
    }
    if (t || (t = u.cloneNode(false)), t.ownerDocument = e, t.parentNode = null, r) for (var n = u.firstChild; n; ) t.appendChild(Ir(e, n, r)), n = n.nextSibling;
    return t;
  }
  function Bu(e, u, r) {
    var t = new u.constructor(x);
    for (var n in u) if (pe(u, n)) {
      var i = u[n];
      typeof i != "object" && i != t[n] && (t[n] = i);
    }
    switch (u.childNodes && (t.childNodes = new O3()), t.ownerDocument = e, t.nodeType) {
      case Y3:
        var a = u.attributes, c = t.attributes = new he(), o = a.length;
        c._ownerElement = t;
        for (var l2 = 0; l2 < o; l2++) t.setAttributeNode(Bu(e, a.item(l2), true));
        break;
      case fe2:
        r = true;
    }
    if (r) for (var s = u.firstChild; s; ) t.appendChild(Bu(e, s, r)), s = s.nextSibling;
    return t;
  }
  function Or(e, u, r) {
    e[u] = r;
  }
  try {
    if (Object.defineProperty) {
      let e = function(u) {
        switch (u.nodeType) {
          case Y3:
          case Z3:
            var r = [];
            for (u = u.firstChild; u; ) u.nodeType !== 7 && u.nodeType !== 8 && r.push(e(u)), u = u.nextSibling;
            return r.join("");
          default:
            return u.nodeValue;
        }
      };
      Object.defineProperty(oe2.prototype, "length", { get: function() {
        return ru(this), this.$$length;
      } }), Object.defineProperty(d2.prototype, "textContent", { get: function() {
        return e(this);
      }, set: function(u) {
        switch (this.nodeType) {
          case Y3:
          case Z3:
            for (; this.firstChild; ) this.removeChild(this.firstChild);
            (u || String(u)) && this.appendChild(this.ownerDocument.createTextNode(u));
            break;
          default:
            this.data = u, this.value = u, this.nodeValue = u;
        }
      } }), Or = function(u, r, t) {
        u["$$" + r] = t;
      };
    }
  } catch {
  }
  y._updateLiveList = ru;
  y.Attr = se2;
  y.CDATASection = nu;
  y.CharacterData = me;
  y.Comment = tu;
  y.Document = J2;
  y.DocumentFragment = He;
  y.DocumentType = iu;
  y.DOMImplementation = Cr;
  y.Element = K2;
  y.Entity = Mu;
  y.EntityReference = au;
  y.LiveNodeList = oe2;
  y.NamedNodeMap = he;
  y.Node = d2;
  y.NodeList = O3;
  y.Notation = Ru;
  y.Text = Ve;
  y.ProcessingInstruction = ou;
  y.XMLSerializer = _r;
});
var Rr = W((Ge) => {
  "use strict";
  var Br = ne().freeze;
  Ge.XML_ENTITIES = Br({ amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' });
  Ge.HTML_ENTITIES = Br({ Aacute: "Á", aacute: "á", Abreve: "Ă", abreve: "ă", ac: "∾", acd: "∿", acE: "∾̳", Acirc: "Â", acirc: "â", acute: "´", Acy: "А", acy: "а", AElig: "Æ", aelig: "æ", af: "⁡", Afr: "𝔄", afr: "𝔞", Agrave: "À", agrave: "à", alefsym: "ℵ", aleph: "ℵ", Alpha: "Α", alpha: "α", Amacr: "Ā", amacr: "ā", amalg: "⨿", AMP: "&", amp: "&", And: "⩓", and: "∧", andand: "⩕", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", ange: "⦤", angle: "∠", angmsd: "∡", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angst: "Å", angzarr: "⍼", Aogon: "Ą", aogon: "ą", Aopf: "𝔸", aopf: "𝕒", ap: "≈", apacir: "⩯", apE: "⩰", ape: "≊", apid: "≋", apos: "'", ApplyFunction: "⁡", approx: "≈", approxeq: "≊", Aring: "Å", aring: "å", Ascr: "𝒜", ascr: "𝒶", Assign: "≔", ast: "*", asymp: "≈", asympeq: "≍", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", awconint: "∳", awint: "⨑", backcong: "≌", backepsilon: "϶", backprime: "‵", backsim: "∽", backsimeq: "⋍", Backslash: "∖", Barv: "⫧", barvee: "⊽", Barwed: "⌆", barwed: "⌅", barwedge: "⌅", bbrk: "⎵", bbrktbrk: "⎶", bcong: "≌", Bcy: "Б", bcy: "б", bdquo: "„", becaus: "∵", Because: "∵", because: "∵", bemptyv: "⦰", bepsi: "϶", bernou: "ℬ", Bernoullis: "ℬ", Beta: "Β", beta: "β", beth: "ℶ", between: "≬", Bfr: "𝔅", bfr: "𝔟", bigcap: "⋂", bigcirc: "◯", bigcup: "⋃", bigodot: "⨀", bigoplus: "⨁", bigotimes: "⨂", bigsqcup: "⨆", bigstar: "★", bigtriangledown: "▽", bigtriangleup: "△", biguplus: "⨄", bigvee: "⋁", bigwedge: "⋀", bkarow: "⤍", blacklozenge: "⧫", blacksquare: "▪", blacktriangle: "▴", blacktriangledown: "▾", blacktriangleleft: "◂", blacktriangleright: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bNot: "⫭", bnot: "⌐", Bopf: "𝔹", bopf: "𝕓", bot: "⊥", bottom: "⊥", bowtie: "⋈", boxbox: "⧉", boxDL: "╗", boxDl: "╖", boxdL: "╕", boxdl: "┐", boxDR: "╔", boxDr: "╓", boxdR: "╒", boxdr: "┌", boxH: "═", boxh: "─", boxHD: "╦", boxHd: "╤", boxhD: "╥", boxhd: "┬", boxHU: "╩", boxHu: "╧", boxhU: "╨", boxhu: "┴", boxminus: "⊟", boxplus: "⊞", boxtimes: "⊠", boxUL: "╝", boxUl: "╜", boxuL: "╛", boxul: "┘", boxUR: "╚", boxUr: "╙", boxuR: "╘", boxur: "└", boxV: "║", boxv: "│", boxVH: "╬", boxVh: "╫", boxvH: "╪", boxvh: "┼", boxVL: "╣", boxVl: "╢", boxvL: "╡", boxvl: "┤", boxVR: "╠", boxVr: "╟", boxvR: "╞", boxvr: "├", bprime: "‵", Breve: "˘", breve: "˘", brvbar: "¦", Bscr: "ℬ", bscr: "𝒷", bsemi: "⁏", bsim: "∽", bsime: "⋍", bsol: "\\", bsolb: "⧅", bsolhsub: "⟈", bull: "•", bullet: "•", bump: "≎", bumpE: "⪮", bumpe: "≏", Bumpeq: "≎", bumpeq: "≏", Cacute: "Ć", cacute: "ć", Cap: "⋒", cap: "∩", capand: "⩄", capbrcup: "⩉", capcap: "⩋", capcup: "⩇", capdot: "⩀", CapitalDifferentialD: "ⅅ", caps: "∩︀", caret: "⁁", caron: "ˇ", Cayleys: "ℭ", ccaps: "⩍", Ccaron: "Č", ccaron: "č", Ccedil: "Ç", ccedil: "ç", Ccirc: "Ĉ", ccirc: "ĉ", Cconint: "∰", ccups: "⩌", ccupssm: "⩐", Cdot: "Ċ", cdot: "ċ", cedil: "¸", Cedilla: "¸", cemptyv: "⦲", cent: "¢", CenterDot: "·", centerdot: "·", Cfr: "ℭ", cfr: "𝔠", CHcy: "Ч", chcy: "ч", check: "✓", checkmark: "✓", Chi: "Χ", chi: "χ", cir: "○", circ: "ˆ", circeq: "≗", circlearrowleft: "↺", circlearrowright: "↻", circledast: "⊛", circledcirc: "⊚", circleddash: "⊝", CircleDot: "⊙", circledR: "®", circledS: "Ⓢ", CircleMinus: "⊖", CirclePlus: "⊕", CircleTimes: "⊗", cirE: "⧃", cire: "≗", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", ClockwiseContourIntegral: "∲", CloseCurlyDoubleQuote: "”", CloseCurlyQuote: "’", clubs: "♣", clubsuit: "♣", Colon: "∷", colon: ":", Colone: "⩴", colone: "≔", coloneq: "≔", comma: ",", commat: "@", comp: "∁", compfn: "∘", complement: "∁", complexes: "ℂ", cong: "≅", congdot: "⩭", Congruent: "≡", Conint: "∯", conint: "∮", ContourIntegral: "∮", Copf: "ℂ", copf: "𝕔", coprod: "∐", Coproduct: "∐", COPY: "©", copy: "©", copysr: "℗", CounterClockwiseContourIntegral: "∳", crarr: "↵", Cross: "⨯", cross: "✗", Cscr: "𝒞", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", cuesc: "⋟", cularr: "↶", cularrp: "⤽", Cup: "⋓", cup: "∪", cupbrcap: "⩈", CupCap: "≍", cupcap: "⩆", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curarrm: "⤼", curlyeqprec: "⋞", curlyeqsucc: "⋟", curlyvee: "⋎", curlywedge: "⋏", curren: "¤", curvearrowleft: "↶", curvearrowright: "↷", cuvee: "⋎", cuwed: "⋏", cwconint: "∲", cwint: "∱", cylcty: "⌭", Dagger: "‡", dagger: "†", daleth: "ℸ", Darr: "↡", dArr: "⇓", darr: "↓", dash: "‐", Dashv: "⫤", dashv: "⊣", dbkarow: "⤏", dblac: "˝", Dcaron: "Ď", dcaron: "ď", Dcy: "Д", dcy: "д", DD: "ⅅ", dd: "ⅆ", ddagger: "‡", ddarr: "⇊", DDotrahd: "⤑", ddotseq: "⩷", deg: "°", Del: "∇", Delta: "Δ", delta: "δ", demptyv: "⦱", dfisht: "⥿", Dfr: "𝔇", dfr: "𝔡", dHar: "⥥", dharl: "⇃", dharr: "⇂", DiacriticalAcute: "´", DiacriticalDot: "˙", DiacriticalDoubleAcute: "˝", DiacriticalGrave: "`", DiacriticalTilde: "˜", diam: "⋄", Diamond: "⋄", diamond: "⋄", diamondsuit: "♦", diams: "♦", die: "¨", DifferentialD: "ⅆ", digamma: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", DJcy: "Ђ", djcy: "ђ", dlcorn: "⌞", dlcrop: "⌍", dollar: "$", Dopf: "𝔻", dopf: "𝕕", Dot: "¨", dot: "˙", DotDot: "⃜", doteq: "≐", doteqdot: "≑", DotEqual: "≐", dotminus: "∸", dotplus: "∔", dotsquare: "⊡", doublebarwedge: "⌆", DoubleContourIntegral: "∯", DoubleDot: "¨", DoubleDownArrow: "⇓", DoubleLeftArrow: "⇐", DoubleLeftRightArrow: "⇔", DoubleLeftTee: "⫤", DoubleLongLeftArrow: "⟸", DoubleLongLeftRightArrow: "⟺", DoubleLongRightArrow: "⟹", DoubleRightArrow: "⇒", DoubleRightTee: "⊨", DoubleUpArrow: "⇑", DoubleUpDownArrow: "⇕", DoubleVerticalBar: "∥", DownArrow: "↓", Downarrow: "⇓", downarrow: "↓", DownArrowBar: "⤓", DownArrowUpArrow: "⇵", DownBreve: "̑", downdownarrows: "⇊", downharpoonleft: "⇃", downharpoonright: "⇂", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVector: "↽", DownLeftVectorBar: "⥖", DownRightTeeVector: "⥟", DownRightVector: "⇁", DownRightVectorBar: "⥗", DownTee: "⊤", DownTeeArrow: "↧", drbkarow: "⤐", drcorn: "⌟", drcrop: "⌌", Dscr: "𝒟", dscr: "𝒹", DScy: "Ѕ", dscy: "ѕ", dsol: "⧶", Dstrok: "Đ", dstrok: "đ", dtdot: "⋱", dtri: "▿", dtrif: "▾", duarr: "⇵", duhar: "⥯", dwangle: "⦦", DZcy: "Џ", dzcy: "џ", dzigrarr: "⟿", Eacute: "É", eacute: "é", easter: "⩮", Ecaron: "Ě", ecaron: "ě", ecir: "≖", Ecirc: "Ê", ecirc: "ê", ecolon: "≕", Ecy: "Э", ecy: "э", eDDot: "⩷", Edot: "Ė", eDot: "≑", edot: "ė", ee: "ⅇ", efDot: "≒", Efr: "𝔈", efr: "𝔢", eg: "⪚", Egrave: "È", egrave: "è", egs: "⪖", egsdot: "⪘", el: "⪙", Element: "∈", elinters: "⏧", ell: "ℓ", els: "⪕", elsdot: "⪗", Emacr: "Ē", emacr: "ē", empty: "∅", emptyset: "∅", EmptySmallSquare: "◻", emptyv: "∅", EmptyVerySmallSquare: "▫", emsp: " ", emsp13: " ", emsp14: " ", ENG: "Ŋ", eng: "ŋ", ensp: " ", Eogon: "Ę", eogon: "ę", Eopf: "𝔼", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", Epsilon: "Ε", epsilon: "ε", epsiv: "ϵ", eqcirc: "≖", eqcolon: "≕", eqsim: "≂", eqslantgtr: "⪖", eqslantless: "⪕", Equal: "⩵", equals: "=", EqualTilde: "≂", equest: "≟", Equilibrium: "⇌", equiv: "≡", equivDD: "⩸", eqvparsl: "⧥", erarr: "⥱", erDot: "≓", Escr: "ℰ", escr: "ℯ", esdot: "≐", Esim: "⩳", esim: "≂", Eta: "Η", eta: "η", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", euro: "€", excl: "!", exist: "∃", Exists: "∃", expectation: "ℰ", ExponentialE: "ⅇ", exponentiale: "ⅇ", fallingdotseq: "≒", Fcy: "Ф", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", Ffr: "𝔉", ffr: "𝔣", filig: "ﬁ", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", Fopf: "𝔽", fopf: "𝕗", ForAll: "∀", forall: "∀", fork: "⋔", forkv: "⫙", Fouriertrf: "ℱ", fpartint: "⨍", frac12: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", Fscr: "ℱ", fscr: "𝒻", gacute: "ǵ", Gamma: "Γ", gamma: "γ", Gammad: "Ϝ", gammad: "ϝ", gap: "⪆", Gbreve: "Ğ", gbreve: "ğ", Gcedil: "Ģ", Gcirc: "Ĝ", gcirc: "ĝ", Gcy: "Г", gcy: "г", Gdot: "Ġ", gdot: "ġ", gE: "≧", ge: "≥", gEl: "⪌", gel: "⋛", geq: "≥", geqq: "≧", geqslant: "⩾", ges: "⩾", gescc: "⪩", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", Gfr: "𝔊", gfr: "𝔤", Gg: "⋙", gg: "≫", ggg: "⋙", gimel: "ℷ", GJcy: "Ѓ", gjcy: "ѓ", gl: "≷", gla: "⪥", glE: "⪒", glj: "⪤", gnap: "⪊", gnapprox: "⪊", gnE: "≩", gne: "⪈", gneq: "⪈", gneqq: "≩", gnsim: "⋧", Gopf: "𝔾", gopf: "𝕘", grave: "`", GreaterEqual: "≥", GreaterEqualLess: "⋛", GreaterFullEqual: "≧", GreaterGreater: "⪢", GreaterLess: "≷", GreaterSlantEqual: "⩾", GreaterTilde: "≳", Gscr: "𝒢", gscr: "ℊ", gsim: "≳", gsime: "⪎", gsiml: "⪐", Gt: "≫", GT: ">", gt: ">", gtcc: "⪧", gtcir: "⩺", gtdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrapprox: "⪆", gtrarr: "⥸", gtrdot: "⋗", gtreqless: "⋛", gtreqqless: "⪌", gtrless: "≷", gtrsim: "≳", gvertneqq: "≩︀", gvnE: "≩︀", Hacek: "ˇ", hairsp: " ", half: "½", hamilt: "ℋ", HARDcy: "Ъ", hardcy: "ъ", hArr: "⇔", harr: "↔", harrcir: "⥈", harrw: "↭", Hat: "^", hbar: "ℏ", Hcirc: "Ĥ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", hercon: "⊹", Hfr: "ℌ", hfr: "𝔥", HilbertSpace: "ℋ", hksearow: "⤥", hkswarow: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", hookrightarrow: "↪", Hopf: "ℍ", hopf: "𝕙", horbar: "―", HorizontalLine: "─", Hscr: "ℋ", hscr: "𝒽", hslash: "ℏ", Hstrok: "Ħ", hstrok: "ħ", HumpDownHump: "≎", HumpEqual: "≏", hybull: "⁃", hyphen: "‐", Iacute: "Í", iacute: "í", ic: "⁣", Icirc: "Î", icirc: "î", Icy: "И", icy: "и", Idot: "İ", IEcy: "Е", iecy: "е", iexcl: "¡", iff: "⇔", Ifr: "ℑ", ifr: "𝔦", Igrave: "Ì", igrave: "ì", ii: "ⅈ", iiiint: "⨌", iiint: "∭", iinfin: "⧜", iiota: "℩", IJlig: "Ĳ", ijlig: "ĳ", Im: "ℑ", Imacr: "Ī", imacr: "ī", image: "ℑ", ImaginaryI: "ⅈ", imagline: "ℐ", imagpart: "ℑ", imath: "ı", imof: "⊷", imped: "Ƶ", Implies: "⇒", in: "∈", incare: "℅", infin: "∞", infintie: "⧝", inodot: "ı", Int: "∬", int: "∫", intcal: "⊺", integers: "ℤ", Integral: "∫", intercal: "⊺", Intersection: "⋂", intlarhk: "⨗", intprod: "⨼", InvisibleComma: "⁣", InvisibleTimes: "⁢", IOcy: "Ё", iocy: "ё", Iogon: "Į", iogon: "į", Iopf: "𝕀", iopf: "𝕚", Iota: "Ι", iota: "ι", iprod: "⨼", iquest: "¿", Iscr: "ℐ", iscr: "𝒾", isin: "∈", isindot: "⋵", isinE: "⋹", isins: "⋴", isinsv: "⋳", isinv: "∈", it: "⁢", Itilde: "Ĩ", itilde: "ĩ", Iukcy: "І", iukcy: "і", Iuml: "Ï", iuml: "ï", Jcirc: "Ĵ", jcirc: "ĵ", Jcy: "Й", jcy: "й", Jfr: "𝔍", jfr: "𝔧", jmath: "ȷ", Jopf: "𝕁", jopf: "𝕛", Jscr: "𝒥", jscr: "𝒿", Jsercy: "Ј", jsercy: "ј", Jukcy: "Є", jukcy: "є", Kappa: "Κ", kappa: "κ", kappav: "ϰ", Kcedil: "Ķ", kcedil: "ķ", Kcy: "К", kcy: "к", Kfr: "𝔎", kfr: "𝔨", kgreen: "ĸ", KHcy: "Х", khcy: "х", KJcy: "Ќ", kjcy: "ќ", Kopf: "𝕂", kopf: "𝕜", Kscr: "𝒦", kscr: "𝓀", lAarr: "⇚", Lacute: "Ĺ", lacute: "ĺ", laemptyv: "⦴", lagran: "ℒ", Lambda: "Λ", lambda: "λ", Lang: "⟪", lang: "⟨", langd: "⦑", langle: "⟨", lap: "⪅", Laplacetrf: "ℒ", laquo: "«", Larr: "↞", lArr: "⇐", larr: "←", larrb: "⇤", larrbfs: "⤟", larrfs: "⤝", larrhk: "↩", larrlp: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", lat: "⪫", lAtail: "⤛", latail: "⤙", late: "⪭", lates: "⪭︀", lBarr: "⤎", lbarr: "⤌", lbbrk: "❲", lbrace: "{", lbrack: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", Lcaron: "Ľ", lcaron: "ľ", Lcedil: "Ļ", lcedil: "ļ", lceil: "⌈", lcub: "{", Lcy: "Л", lcy: "л", ldca: "⤶", ldquo: "“", ldquor: "„", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", lE: "≦", le: "≤", LeftAngleBracket: "⟨", LeftArrow: "←", Leftarrow: "⇐", leftarrow: "←", LeftArrowBar: "⇤", LeftArrowRightArrow: "⇆", leftarrowtail: "↢", LeftCeiling: "⌈", LeftDoubleBracket: "⟦", LeftDownTeeVector: "⥡", LeftDownVector: "⇃", LeftDownVectorBar: "⥙", LeftFloor: "⌊", leftharpoondown: "↽", leftharpoonup: "↼", leftleftarrows: "⇇", LeftRightArrow: "↔", Leftrightarrow: "⇔", leftrightarrow: "↔", leftrightarrows: "⇆", leftrightharpoons: "⇋", leftrightsquigarrow: "↭", LeftRightVector: "⥎", LeftTee: "⊣", LeftTeeArrow: "↤", LeftTeeVector: "⥚", leftthreetimes: "⋋", LeftTriangle: "⊲", LeftTriangleBar: "⧏", LeftTriangleEqual: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVector: "↿", LeftUpVectorBar: "⥘", LeftVector: "↼", LeftVectorBar: "⥒", lEg: "⪋", leg: "⋚", leq: "≤", leqq: "≦", leqslant: "⩽", les: "⩽", lescc: "⪨", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessapprox: "⪅", lessdot: "⋖", lesseqgtr: "⋚", lesseqqgtr: "⪋", LessEqualGreater: "⋚", LessFullEqual: "≦", LessGreater: "≶", lessgtr: "≶", LessLess: "⪡", lesssim: "≲", LessSlantEqual: "⩽", LessTilde: "≲", lfisht: "⥼", lfloor: "⌊", Lfr: "𝔏", lfr: "𝔩", lg: "≶", lgE: "⪑", lHar: "⥢", lhard: "↽", lharu: "↼", lharul: "⥪", lhblk: "▄", LJcy: "Љ", ljcy: "љ", Ll: "⋘", ll: "≪", llarr: "⇇", llcorner: "⌞", Lleftarrow: "⇚", llhard: "⥫", lltri: "◺", Lmidot: "Ŀ", lmidot: "ŀ", lmoust: "⎰", lmoustache: "⎰", lnap: "⪉", lnapprox: "⪉", lnE: "≨", lne: "⪇", lneq: "⪇", lneqq: "≨", lnsim: "⋦", loang: "⟬", loarr: "⇽", lobrk: "⟦", LongLeftArrow: "⟵", Longleftarrow: "⟸", longleftarrow: "⟵", LongLeftRightArrow: "⟷", Longleftrightarrow: "⟺", longleftrightarrow: "⟷", longmapsto: "⟼", LongRightArrow: "⟶", Longrightarrow: "⟹", longrightarrow: "⟶", looparrowleft: "↫", looparrowright: "↬", lopar: "⦅", Lopf: "𝕃", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", lowbar: "_", LowerLeftArrow: "↙", LowerRightArrow: "↘", loz: "◊", lozenge: "◊", lozf: "⧫", lpar: "(", lparlt: "⦓", lrarr: "⇆", lrcorner: "⌟", lrhar: "⇋", lrhard: "⥭", lrm: "‎", lrtri: "⊿", lsaquo: "‹", Lscr: "ℒ", lscr: "𝓁", Lsh: "↰", lsh: "↰", lsim: "≲", lsime: "⪍", lsimg: "⪏", lsqb: "[", lsquo: "‘", lsquor: "‚", Lstrok: "Ł", lstrok: "ł", Lt: "≪", LT: "<", lt: "<", ltcc: "⪦", ltcir: "⩹", ltdot: "⋖", lthree: "⋋", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltri: "◃", ltrie: "⊴", ltrif: "◂", ltrPar: "⦖", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", macr: "¯", male: "♂", malt: "✠", maltese: "✠", Map: "⤅", map: "↦", mapsto: "↦", mapstodown: "↧", mapstoleft: "↤", mapstoup: "↥", marker: "▮", mcomma: "⨩", Mcy: "М", mcy: "м", mdash: "—", mDDot: "∺", measuredangle: "∡", MediumSpace: " ", Mellintrf: "ℳ", Mfr: "𝔐", mfr: "𝔪", mho: "℧", micro: "µ", mid: "∣", midast: "*", midcir: "⫰", middot: "·", minus: "−", minusb: "⊟", minusd: "∸", minusdu: "⨪", MinusPlus: "∓", mlcp: "⫛", mldr: "…", mnplus: "∓", models: "⊧", Mopf: "𝕄", mopf: "𝕞", mp: "∓", Mscr: "ℳ", mscr: "𝓂", mstpos: "∾", Mu: "Μ", mu: "μ", multimap: "⊸", mumap: "⊸", nabla: "∇", Nacute: "Ń", nacute: "ń", nang: "∠⃒", nap: "≉", napE: "⩰̸", napid: "≋̸", napos: "ŉ", napprox: "≉", natur: "♮", natural: "♮", naturals: "ℕ", nbsp: " ", nbump: "≎̸", nbumpe: "≏̸", ncap: "⩃", Ncaron: "Ň", ncaron: "ň", Ncedil: "Ņ", ncedil: "ņ", ncong: "≇", ncongdot: "⩭̸", ncup: "⩂", Ncy: "Н", ncy: "н", ndash: "–", ne: "≠", nearhk: "⤤", neArr: "⇗", nearr: "↗", nearrow: "↗", nedot: "≐̸", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", nequiv: "≢", nesear: "⤨", nesim: "≂̸", NestedGreaterGreater: "≫", NestedLessLess: "≪", NewLine: `
`, nexist: "∄", nexists: "∄", Nfr: "𝔑", nfr: "𝔫", ngE: "≧̸", nge: "≱", ngeq: "≱", ngeqq: "≧̸", ngeqslant: "⩾̸", nges: "⩾̸", nGg: "⋙̸", ngsim: "≵", nGt: "≫⃒", ngt: "≯", ngtr: "≯", nGtv: "≫̸", nhArr: "⇎", nharr: "↮", nhpar: "⫲", ni: "∋", nis: "⋼", nisd: "⋺", niv: "∋", NJcy: "Њ", njcy: "њ", nlArr: "⇍", nlarr: "↚", nldr: "‥", nlE: "≦̸", nle: "≰", nLeftarrow: "⇍", nleftarrow: "↚", nLeftrightarrow: "⇎", nleftrightarrow: "↮", nleq: "≰", nleqq: "≦̸", nleqslant: "⩽̸", nles: "⩽̸", nless: "≮", nLl: "⋘̸", nlsim: "≴", nLt: "≪⃒", nlt: "≮", nltri: "⋪", nltrie: "⋬", nLtv: "≪̸", nmid: "∤", NoBreak: "⁠", NonBreakingSpace: " ", Nopf: "ℕ", nopf: "𝕟", Not: "⫬", not: "¬", NotCongruent: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", NotElement: "∉", NotEqual: "≠", NotEqualTilde: "≂̸", NotExists: "∄", NotGreater: "≯", NotGreaterEqual: "≱", NotGreaterFullEqual: "≧̸", NotGreaterGreater: "≫̸", NotGreaterLess: "≹", NotGreaterSlantEqual: "⩾̸", NotGreaterTilde: "≵", NotHumpDownHump: "≎̸", NotHumpEqual: "≏̸", notin: "∉", notindot: "⋵̸", notinE: "⋹̸", notinva: "∉", notinvb: "⋷", notinvc: "⋶", NotLeftTriangle: "⋪", NotLeftTriangleBar: "⧏̸", NotLeftTriangleEqual: "⋬", NotLess: "≮", NotLessEqual: "≰", NotLessGreater: "≸", NotLessLess: "≪̸", NotLessSlantEqual: "⩽̸", NotLessTilde: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", notni: "∌", notniva: "∌", notnivb: "⋾", notnivc: "⋽", NotPrecedes: "⊀", NotPrecedesEqual: "⪯̸", NotPrecedesSlantEqual: "⋠", NotReverseElement: "∌", NotRightTriangle: "⋫", NotRightTriangleBar: "⧐̸", NotRightTriangleEqual: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", NotSubset: "⊂⃒", NotSubsetEqual: "⊈", NotSucceeds: "⊁", NotSucceedsEqual: "⪰̸", NotSucceedsSlantEqual: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", NotSupersetEqual: "⊉", NotTilde: "≁", NotTildeEqual: "≄", NotTildeFullEqual: "≇", NotTildeTilde: "≉", NotVerticalBar: "∤", npar: "∦", nparallel: "∦", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", npr: "⊀", nprcue: "⋠", npre: "⪯̸", nprec: "⊀", npreceq: "⪯̸", nrArr: "⇏", nrarr: "↛", nrarrc: "⤳̸", nrarrw: "↝̸", nRightarrow: "⇏", nrightarrow: "↛", nrtri: "⋫", nrtrie: "⋭", nsc: "⊁", nsccue: "⋡", nsce: "⪰̸", Nscr: "𝒩", nscr: "𝓃", nshortmid: "∤", nshortparallel: "∦", nsim: "≁", nsime: "≄", nsimeq: "≄", nsmid: "∤", nspar: "∦", nsqsube: "⋢", nsqsupe: "⋣", nsub: "⊄", nsubE: "⫅̸", nsube: "⊈", nsubset: "⊂⃒", nsubseteq: "⊈", nsubseteqq: "⫅̸", nsucc: "⊁", nsucceq: "⪰̸", nsup: "⊅", nsupE: "⫆̸", nsupe: "⊉", nsupset: "⊃⃒", nsupseteq: "⊉", nsupseteqq: "⫆̸", ntgl: "≹", Ntilde: "Ñ", ntilde: "ñ", ntlg: "≸", ntriangleleft: "⋪", ntrianglelefteq: "⋬", ntriangleright: "⋫", ntrianglerighteq: "⋭", Nu: "Ν", nu: "ν", num: "#", numero: "№", numsp: " ", nvap: "≍⃒", nVDash: "⊯", nVdash: "⊮", nvDash: "⊭", nvdash: "⊬", nvge: "≥⃒", nvgt: ">⃒", nvHarr: "⤄", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwarhk: "⤣", nwArr: "⇖", nwarr: "↖", nwarrow: "↖", nwnear: "⤧", Oacute: "Ó", oacute: "ó", oast: "⊛", ocir: "⊚", Ocirc: "Ô", ocirc: "ô", Ocy: "О", ocy: "о", odash: "⊝", Odblac: "Ő", odblac: "ő", odiv: "⨸", odot: "⊙", odsold: "⦼", OElig: "Œ", oelig: "œ", ofcir: "⦿", Ofr: "𝔒", ofr: "𝔬", ogon: "˛", Ograve: "Ò", ograve: "ò", ogt: "⧁", ohbar: "⦵", ohm: "Ω", oint: "∮", olarr: "↺", olcir: "⦾", olcross: "⦻", oline: "‾", olt: "⧀", Omacr: "Ō", omacr: "ō", Omega: "Ω", omega: "ω", Omicron: "Ο", omicron: "ο", omid: "⦶", ominus: "⊖", Oopf: "𝕆", oopf: "𝕠", opar: "⦷", OpenCurlyDoubleQuote: "“", OpenCurlyQuote: "‘", operp: "⦹", oplus: "⊕", Or: "⩔", or: "∨", orarr: "↻", ord: "⩝", order: "ℴ", orderof: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oS: "Ⓢ", Oscr: "𝒪", oscr: "ℴ", Oslash: "Ø", oslash: "ø", osol: "⊘", Otilde: "Õ", otilde: "õ", Otimes: "⨷", otimes: "⊗", otimesas: "⨶", Ouml: "Ö", ouml: "ö", ovbar: "⌽", OverBar: "‾", OverBrace: "⏞", OverBracket: "⎴", OverParenthesis: "⏜", par: "∥", para: "¶", parallel: "∥", parsim: "⫳", parsl: "⫽", part: "∂", PartialD: "∂", Pcy: "П", pcy: "п", percnt: "%", period: ".", permil: "‰", perp: "⊥", pertenk: "‱", Pfr: "𝔓", pfr: "𝔭", Phi: "Φ", phi: "φ", phiv: "ϕ", phmmat: "ℳ", phone: "☎", Pi: "Π", pi: "π", pitchfork: "⋔", piv: "ϖ", planck: "ℏ", planckh: "ℎ", plankv: "ℏ", plus: "+", plusacir: "⨣", plusb: "⊞", pluscir: "⨢", plusdo: "∔", plusdu: "⨥", pluse: "⩲", PlusMinus: "±", plusmn: "±", plussim: "⨦", plustwo: "⨧", pm: "±", Poincareplane: "ℌ", pointint: "⨕", Popf: "ℙ", popf: "𝕡", pound: "£", Pr: "⪻", pr: "≺", prap: "⪷", prcue: "≼", prE: "⪳", pre: "⪯", prec: "≺", precapprox: "⪷", preccurlyeq: "≼", Precedes: "≺", PrecedesEqual: "⪯", PrecedesSlantEqual: "≼", PrecedesTilde: "≾", preceq: "⪯", precnapprox: "⪹", precneqq: "⪵", precnsim: "⋨", precsim: "≾", Prime: "″", prime: "′", primes: "ℙ", prnap: "⪹", prnE: "⪵", prnsim: "⋨", prod: "∏", Product: "∏", profalar: "⌮", profline: "⌒", profsurf: "⌓", prop: "∝", Proportion: "∷", Proportional: "∝", propto: "∝", prsim: "≾", prurel: "⊰", Pscr: "𝒫", pscr: "𝓅", Psi: "Ψ", psi: "ψ", puncsp: " ", Qfr: "𝔔", qfr: "𝔮", qint: "⨌", Qopf: "ℚ", qopf: "𝕢", qprime: "⁗", Qscr: "𝒬", qscr: "𝓆", quaternions: "ℍ", quatint: "⨖", quest: "?", questeq: "≟", QUOT: '"', quot: '"', rAarr: "⇛", race: "∽̱", Racute: "Ŕ", racute: "ŕ", radic: "√", raemptyv: "⦳", Rang: "⟫", rang: "⟩", rangd: "⦒", range: "⦥", rangle: "⟩", raquo: "»", Rarr: "↠", rArr: "⇒", rarr: "→", rarrap: "⥵", rarrb: "⇥", rarrbfs: "⤠", rarrc: "⤳", rarrfs: "⤞", rarrhk: "↪", rarrlp: "↬", rarrpl: "⥅", rarrsim: "⥴", Rarrtl: "⤖", rarrtl: "↣", rarrw: "↝", rAtail: "⤜", ratail: "⤚", ratio: "∶", rationals: "ℚ", RBarr: "⤐", rBarr: "⤏", rbarr: "⤍", rbbrk: "❳", rbrace: "}", rbrack: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", Rcaron: "Ř", rcaron: "ř", Rcedil: "Ŗ", rcedil: "ŗ", rceil: "⌉", rcub: "}", Rcy: "Р", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdquo: "”", rdquor: "”", rdsh: "↳", Re: "ℜ", real: "ℜ", realine: "ℛ", realpart: "ℜ", reals: "ℝ", rect: "▭", REG: "®", reg: "®", ReverseElement: "∋", ReverseEquilibrium: "⇋", ReverseUpEquilibrium: "⥯", rfisht: "⥽", rfloor: "⌋", Rfr: "ℜ", rfr: "𝔯", rHar: "⥤", rhard: "⇁", rharu: "⇀", rharul: "⥬", Rho: "Ρ", rho: "ρ", rhov: "ϱ", RightAngleBracket: "⟩", RightArrow: "→", Rightarrow: "⇒", rightarrow: "→", RightArrowBar: "⇥", RightArrowLeftArrow: "⇄", rightarrowtail: "↣", RightCeiling: "⌉", RightDoubleBracket: "⟧", RightDownTeeVector: "⥝", RightDownVector: "⇂", RightDownVectorBar: "⥕", RightFloor: "⌋", rightharpoondown: "⇁", rightharpoonup: "⇀", rightleftarrows: "⇄", rightleftharpoons: "⇌", rightrightarrows: "⇉", rightsquigarrow: "↝", RightTee: "⊢", RightTeeArrow: "↦", RightTeeVector: "⥛", rightthreetimes: "⋌", RightTriangle: "⊳", RightTriangleBar: "⧐", RightTriangleEqual: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVector: "↾", RightUpVectorBar: "⥔", RightVector: "⇀", RightVectorBar: "⥓", ring: "˚", risingdotseq: "≓", rlarr: "⇄", rlhar: "⇌", rlm: "‏", rmoust: "⎱", rmoustache: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", robrk: "⟧", ropar: "⦆", Ropf: "ℝ", ropf: "𝕣", roplus: "⨮", rotimes: "⨵", RoundImplies: "⥰", rpar: ")", rpargt: "⦔", rppolint: "⨒", rrarr: "⇉", Rrightarrow: "⇛", rsaquo: "›", Rscr: "ℛ", rscr: "𝓇", Rsh: "↱", rsh: "↱", rsqb: "]", rsquo: "’", rsquor: "’", rthree: "⋌", rtimes: "⋊", rtri: "▹", rtrie: "⊵", rtrif: "▸", rtriltri: "⧎", RuleDelayed: "⧴", ruluhar: "⥨", rx: "℞", Sacute: "Ś", sacute: "ś", sbquo: "‚", Sc: "⪼", sc: "≻", scap: "⪸", Scaron: "Š", scaron: "š", sccue: "≽", scE: "⪴", sce: "⪰", Scedil: "Ş", scedil: "ş", Scirc: "Ŝ", scirc: "ŝ", scnap: "⪺", scnE: "⪶", scnsim: "⋩", scpolint: "⨓", scsim: "≿", Scy: "С", scy: "с", sdot: "⋅", sdotb: "⊡", sdote: "⩦", searhk: "⤥", seArr: "⇘", searr: "↘", searrow: "↘", sect: "§", semi: ";", seswar: "⤩", setminus: "∖", setmn: "∖", sext: "✶", Sfr: "𝔖", sfr: "𝔰", sfrown: "⌢", sharp: "♯", SHCHcy: "Щ", shchcy: "щ", SHcy: "Ш", shcy: "ш", ShortDownArrow: "↓", ShortLeftArrow: "←", shortmid: "∣", shortparallel: "∥", ShortRightArrow: "→", ShortUpArrow: "↑", shy: "­", Sigma: "Σ", sigma: "σ", sigmaf: "ς", sigmav: "ς", sim: "∼", simdot: "⩪", sime: "≃", simeq: "≃", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", slarr: "←", SmallCircle: "∘", smallsetminus: "∖", smashp: "⨳", smeparsl: "⧤", smid: "∣", smile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", SOFTcy: "Ь", softcy: "ь", sol: "/", solb: "⧄", solbar: "⌿", Sopf: "𝕊", sopf: "𝕤", spades: "♠", spadesuit: "♠", spar: "∥", sqcap: "⊓", sqcaps: "⊓︀", sqcup: "⊔", sqcups: "⊔︀", Sqrt: "√", sqsub: "⊏", sqsube: "⊑", sqsubset: "⊏", sqsubseteq: "⊑", sqsup: "⊐", sqsupe: "⊒", sqsupset: "⊐", sqsupseteq: "⊒", squ: "□", Square: "□", square: "□", SquareIntersection: "⊓", SquareSubset: "⊏", SquareSubsetEqual: "⊑", SquareSuperset: "⊐", SquareSupersetEqual: "⊒", SquareUnion: "⊔", squarf: "▪", squf: "▪", srarr: "→", Sscr: "𝒮", sscr: "𝓈", ssetmn: "∖", ssmile: "⌣", sstarf: "⋆", Star: "⋆", star: "☆", starf: "★", straightepsilon: "ϵ", straightphi: "ϕ", strns: "¯", Sub: "⋐", sub: "⊂", subdot: "⪽", subE: "⫅", sube: "⊆", subedot: "⫃", submult: "⫁", subnE: "⫋", subne: "⊊", subplus: "⪿", subrarr: "⥹", Subset: "⋐", subset: "⊂", subseteq: "⊆", subseteqq: "⫅", SubsetEqual: "⊆", subsetneq: "⊊", subsetneqq: "⫋", subsim: "⫇", subsub: "⫕", subsup: "⫓", succ: "≻", succapprox: "⪸", succcurlyeq: "≽", Succeeds: "≻", SucceedsEqual: "⪰", SucceedsSlantEqual: "≽", SucceedsTilde: "≿", succeq: "⪰", succnapprox: "⪺", succneqq: "⪶", succnsim: "⋩", succsim: "≿", SuchThat: "∋", Sum: "∑", sum: "∑", sung: "♪", Sup: "⋑", sup: "⊃", sup1: "¹", sup2: "²", sup3: "³", supdot: "⪾", supdsub: "⫘", supE: "⫆", supe: "⊇", supedot: "⫄", Superset: "⊃", SupersetEqual: "⊇", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supne: "⊋", supplus: "⫀", Supset: "⋑", supset: "⊃", supseteq: "⊇", supseteqq: "⫆", supsetneq: "⊋", supsetneqq: "⫌", supsim: "⫈", supsub: "⫔", supsup: "⫖", swarhk: "⤦", swArr: "⇙", swarr: "↙", swarrow: "↙", swnwar: "⤪", szlig: "ß", Tab: "	", target: "⌖", Tau: "Τ", tau: "τ", tbrk: "⎴", Tcaron: "Ť", tcaron: "ť", Tcedil: "Ţ", tcedil: "ţ", Tcy: "Т", tcy: "т", tdot: "⃛", telrec: "⌕", Tfr: "𝔗", tfr: "𝔱", there4: "∴", Therefore: "∴", therefore: "∴", Theta: "Θ", theta: "θ", thetasym: "ϑ", thetav: "ϑ", thickapprox: "≈", thicksim: "∼", ThickSpace: "  ", thinsp: " ", ThinSpace: " ", thkap: "≈", thksim: "∼", THORN: "Þ", thorn: "þ", Tilde: "∼", tilde: "˜", TildeEqual: "≃", TildeFullEqual: "≅", TildeTilde: "≈", times: "×", timesb: "⊠", timesbar: "⨱", timesd: "⨰", tint: "∭", toea: "⤨", top: "⊤", topbot: "⌶", topcir: "⫱", Topf: "𝕋", topf: "𝕥", topfork: "⫚", tosa: "⤩", tprime: "‴", TRADE: "™", trade: "™", triangle: "▵", triangledown: "▿", triangleleft: "◃", trianglelefteq: "⊴", triangleq: "≜", triangleright: "▹", trianglerighteq: "⊵", tridot: "◬", trie: "≜", triminus: "⨺", TripleDot: "⃛", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", Tscr: "𝒯", tscr: "𝓉", TScy: "Ц", tscy: "ц", TSHcy: "Ћ", tshcy: "ћ", Tstrok: "Ŧ", tstrok: "ŧ", twixt: "≬", twoheadleftarrow: "↞", twoheadrightarrow: "↠", Uacute: "Ú", uacute: "ú", Uarr: "↟", uArr: "⇑", uarr: "↑", Uarrocir: "⥉", Ubrcy: "Ў", ubrcy: "ў", Ubreve: "Ŭ", ubreve: "ŭ", Ucirc: "Û", ucirc: "û", Ucy: "У", ucy: "у", udarr: "⇅", Udblac: "Ű", udblac: "ű", udhar: "⥮", ufisht: "⥾", Ufr: "𝔘", ufr: "𝔲", Ugrave: "Ù", ugrave: "ù", uHar: "⥣", uharl: "↿", uharr: "↾", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", Umacr: "Ū", umacr: "ū", uml: "¨", UnderBar: "_", UnderBrace: "⏟", UnderBracket: "⎵", UnderParenthesis: "⏝", Union: "⋃", UnionPlus: "⊎", Uogon: "Ų", uogon: "ų", Uopf: "𝕌", uopf: "𝕦", UpArrow: "↑", Uparrow: "⇑", uparrow: "↑", UpArrowBar: "⤒", UpArrowDownArrow: "⇅", UpDownArrow: "↕", Updownarrow: "⇕", updownarrow: "↕", UpEquilibrium: "⥮", upharpoonleft: "↿", upharpoonright: "↾", uplus: "⊎", UpperLeftArrow: "↖", UpperRightArrow: "↗", Upsi: "ϒ", upsi: "υ", upsih: "ϒ", Upsilon: "Υ", upsilon: "υ", UpTee: "⊥", UpTeeArrow: "↥", upuparrows: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", Uring: "Ů", uring: "ů", urtri: "◹", Uscr: "𝒰", uscr: "𝓊", utdot: "⋰", Utilde: "Ũ", utilde: "ũ", utri: "▵", utrif: "▴", uuarr: "⇈", Uuml: "Ü", uuml: "ü", uwangle: "⦧", vangrt: "⦜", varepsilon: "ϵ", varkappa: "ϰ", varnothing: "∅", varphi: "ϕ", varpi: "ϖ", varpropto: "∝", vArr: "⇕", varr: "↕", varrho: "ϱ", varsigma: "ς", varsubsetneq: "⊊︀", varsubsetneqq: "⫋︀", varsupsetneq: "⊋︀", varsupsetneqq: "⫌︀", vartheta: "ϑ", vartriangleleft: "⊲", vartriangleright: "⊳", Vbar: "⫫", vBar: "⫨", vBarv: "⫩", Vcy: "В", vcy: "в", VDash: "⊫", Vdash: "⊩", vDash: "⊨", vdash: "⊢", Vdashl: "⫦", Vee: "⋁", vee: "∨", veebar: "⊻", veeeq: "≚", vellip: "⋮", Verbar: "‖", verbar: "|", Vert: "‖", vert: "|", VerticalBar: "∣", VerticalLine: "|", VerticalSeparator: "❘", VerticalTilde: "≀", VeryThinSpace: " ", Vfr: "𝔙", vfr: "𝔳", vltri: "⊲", vnsub: "⊂⃒", vnsup: "⊃⃒", Vopf: "𝕍", vopf: "𝕧", vprop: "∝", vrtri: "⊳", Vscr: "𝒱", vscr: "𝓋", vsubnE: "⫋︀", vsubne: "⊊︀", vsupnE: "⫌︀", vsupne: "⊋︀", Vvdash: "⊪", vzigzag: "⦚", Wcirc: "Ŵ", wcirc: "ŵ", wedbar: "⩟", Wedge: "⋀", wedge: "∧", wedgeq: "≙", weierp: "℘", Wfr: "𝔚", wfr: "𝔴", Wopf: "𝕎", wopf: "𝕨", wp: "℘", wr: "≀", wreath: "≀", Wscr: "𝒲", wscr: "𝓌", xcap: "⋂", xcirc: "◯", xcup: "⋃", xdtri: "▽", Xfr: "𝔛", xfr: "𝔵", xhArr: "⟺", xharr: "⟷", Xi: "Ξ", xi: "ξ", xlArr: "⟸", xlarr: "⟵", xmap: "⟼", xnis: "⋻", xodot: "⨀", Xopf: "𝕏", xopf: "𝕩", xoplus: "⨁", xotime: "⨂", xrArr: "⟹", xrarr: "⟶", Xscr: "𝒳", xscr: "𝓍", xsqcup: "⨆", xuplus: "⨄", xutri: "△", xvee: "⋁", xwedge: "⋀", Yacute: "Ý", yacute: "ý", YAcy: "Я", yacy: "я", Ycirc: "Ŷ", ycirc: "ŷ", Ycy: "Ы", ycy: "ы", yen: "¥", Yfr: "𝔜", yfr: "𝔶", YIcy: "Ї", yicy: "ї", Yopf: "𝕐", yopf: "𝕪", Yscr: "𝒴", yscr: "𝓎", YUcy: "Ю", yucy: "ю", Yuml: "Ÿ", yuml: "ÿ", Zacute: "Ź", zacute: "ź", Zcaron: "Ž", zcaron: "ž", Zcy: "З", zcy: "з", Zdot: "Ż", zdot: "ż", zeetrf: "ℨ", ZeroWidthSpace: "​", Zeta: "Ζ", zeta: "ζ", Zfr: "ℨ", zfr: "𝔷", ZHcy: "Ж", zhcy: "ж", zigrarr: "⇝", Zopf: "ℤ", zopf: "𝕫", Zscr: "𝒵", zscr: "𝓏", zwj: "‍", zwnj: "‌" });
  Ge.entityMap = Ge.HTML_ENTITIES;
});
var Gr = W((lu) => {
  "use strict";
  var Te = ne(), f = Su(), Pr = Be(), On = Te.isHTMLEscapableRawTextElement, Bn = Te.isHTMLMimeType, Rn = Te.isHTMLRawTextElement, je = Te.hasOwn, Mr = Te.NAMESPACE, xr = Pr.ParseError, Mn = Pr.DOMException, Ye = 0, ee = 1, de = 2, Xe = 3, ge = 4, Ce = 5, ze = 6, su = 7;
  function qr() {
  }
  qr.prototype = { parse: function(e, u, r) {
    var t = this.domBuilder;
    t.startDocument(), Ur(u, u = /* @__PURE__ */ Object.create(null)), xn(e, u, r, t, this.errorHandler), t.endDocument();
  } };
  var Lu = /&#?\w+;?/g;
  function xn(e, u, r, t, n) {
    var i = Bn(t.mimeType);
    e.indexOf(f.UNICODE_REPLACEMENT_CHARACTER) >= 0 && n.warning("Unicode replacement character detected, source encoding issues?");
    function a(C3) {
      if (C3 > 65535) {
        C3 -= 65536;
        var k2 = 55296 + (C3 >> 10), We = 56320 + (C3 & 1023);
        return String.fromCharCode(k2, We);
      } else return String.fromCharCode(C3);
    }
    function c(C3) {
      var k2 = C3[C3.length - 1] === ";" ? C3 : C3 + ";";
      if (!i && k2 !== C3) return n.error("EntityRef: expecting ;"), C3;
      var We = f.Reference.exec(k2);
      if (!We || We[0].length !== k2.length) return n.error("entity not matching Reference production: " + C3), C3;
      var Ze = k2.slice(1, -1);
      return je(r, Ze) ? r[Ze] : Ze.charAt(0) === "#" ? a(parseInt(Ze.substring(1).replace("x", "0x"))) : (n.error("entity not found:" + C3), C3);
    }
    function o(C3) {
      if (C3 > w) {
        var k2 = e.substring(w, C3).replace(Lu, c);
        A2 && v(w), t.characters(k2, 0, C3 - w), w = C3;
      }
    }
    var l2 = 0, s = 0, p = /\r\n?|\n|$/g, A2 = t.locator;
    function v(C3, k2) {
      for (; C3 >= s && (k2 = p.exec(e)); ) l2 = s, s = k2.index + k2[0].length, A2.lineNumber++;
      A2.columnNumber = C3 - l2 + 1;
    }
    for (var M = [{ currentNSMap: u }], _2 = [], w = 0; ; ) {
      try {
        var S = e.indexOf("<", w);
        if (S < 0) {
          if (!i && _2.length > 0) return n.fatalError("unclosed xml tag(s): " + _2.join(", "));
          if (!e.substring(w).match(/^\s*$/)) {
            var ue = t.doc, I = ue.createTextNode(e.substring(w));
            if (ue.documentElement) return n.error("Extra content at the end of the document");
            ue.appendChild(I), t.currentElement = I;
          }
          return;
        }
        if (S > w) {
          var re = e.substring(w, S);
          !i && _2.length === 0 && (re = re.replace(new RegExp(f.S_OPT.source, "g"), ""), re && n.error("Unexpected content outside root element: '" + re + "'")), o(S);
        }
        switch (e.charAt(S + 1)) {
          case "/":
            var U = e.indexOf(">", S + 2), G2 = e.substring(S + 2, U > 0 ? U : void 0);
            if (!G2) return n.fatalError("end tag name missing");
            var hu = U > 0 && f.reg("^", f.QName_group, f.S_OPT, "$").exec(G2);
            if (!hu) return n.fatalError('end tag name contains invalid characters: "' + G2 + '"');
            if (!t.currentElement && !t.doc.documentElement) return;
            var Qe = _2[_2.length - 1] || t.currentElement.tagName || t.doc.documentElement.tagName || "";
            if (Qe !== hu[1]) {
              var $r = hu[1].toLowerCase();
              if (!i || Qe.toLowerCase() !== $r) return n.fatalError('Opening and ending tag mismatch: "' + Qe + '" != "' + G2 + '"');
            }
            var Au = M.pop();
            _2.pop();
            var mu = Au.localNSMap;
            if (t.endElement(Au.uri, Au.localName, Qe), mu) for (var Pu in mu) je(mu, Pu) && t.endPrefixMapping(Pu);
            U++;
            break;
          case "?":
            A2 && v(S), U = qn(e, S, t, n);
            break;
          case "!":
            A2 && v(S), U = Vr(e, S, t, n, i);
            break;
          default:
            A2 && v(S);
            var q2 = new Hr(), du = M[M.length - 1].currentNSMap, U = Ln(e, S, q2, du, c, n, i), qu = q2.length;
            if (q2.closed || (i && Te.isHTMLVoidElement(q2.tagName) ? q2.closed = true : _2.push(q2.tagName)), A2 && qu) {
              for (var Kr = Lr(A2, {}), gu = 0; gu < qu; gu++) {
                var Uu = q2[gu];
                v(Uu.offset), Uu.locator = Lr(A2, {});
              }
              t.locator = Kr, Fr(q2, t, du) && M.push(q2), t.locator = A2;
            } else Fr(q2, t, du) && M.push(q2);
            i && !q2.closed ? U = Fn(e, U, q2.tagName, c, t) : U++;
        }
      } catch (C3) {
        if (C3 instanceof xr) throw C3;
        if (C3 instanceof Mn) throw new xr(C3.name + ": " + C3.message, t.locator, C3);
        n.error("element parse error: " + C3), U = -1;
      }
      U > w ? w = U : o(Math.max(S, w) + 1);
    }
  }
  function Lr(e, u) {
    return u.lineNumber = e.lineNumber, u.columnNumber = e.columnNumber, u;
  }
  function Ln(e, u, r, t, n, i, a) {
    function c(v, M, _2) {
      if (je(r.attributeNames, v)) return i.fatalError("Attribute " + v + " redefined");
      if (!a && M.indexOf("<") >= 0) return i.fatalError("Unescaped '<' not allowed in attributes values");
      r.addValue(v, M.replace(/[\t\n\r]/g, " ").replace(Lu, n), _2);
    }
    for (var o, l2, s = ++u, p = Ye; ; ) {
      var A2 = e.charAt(s);
      switch (A2) {
        case "=":
          if (p === ee) o = e.slice(u, s), p = Xe;
          else if (p === de) p = Xe;
          else throw new Error("attribute equal must after attrName");
          break;
        case "'":
        case '"':
          if (p === Xe || p === ee) if (p === ee && (i.warning('attribute value must after "="'), o = e.slice(u, s)), u = s + 1, s = e.indexOf(A2, u), s > 0) l2 = e.slice(u, s), c(o, l2, u - 1), p = Ce;
          else throw new Error("attribute value no end '" + A2 + "' match");
          else if (p == ge) l2 = e.slice(u, s), c(o, l2, u), i.warning('attribute "' + o + '" missed start quot(' + A2 + ")!!"), u = s + 1, p = Ce;
          else throw new Error('attribute value must after "="');
          break;
        case "/":
          switch (p) {
            case Ye:
              r.setTagName(e.slice(u, s));
            case Ce:
            case ze:
            case su:
              p = su, r.closed = true;
            case ge:
            case ee:
              break;
            case de:
              r.closed = true;
              break;
            default:
              throw new Error("attribute invalid close char('/')");
          }
          break;
        case "":
          return i.error("unexpected end of input"), p == Ye && r.setTagName(e.slice(u, s)), s;
        case ">":
          switch (p) {
            case Ye:
              r.setTagName(e.slice(u, s));
            case Ce:
            case ze:
            case su:
              break;
            case ge:
            case ee:
              l2 = e.slice(u, s), l2.slice(-1) === "/" && (r.closed = true, l2 = l2.slice(0, -1));
            case de:
              p === de && (l2 = o), p == ge ? (i.warning('attribute "' + l2 + '" missed quot(")!'), c(o, l2, u)) : (a || i.warning('attribute "' + l2 + '" missed value!! "' + l2 + '" instead!!'), c(l2, l2, u));
              break;
            case Xe:
              if (!a) return i.fatalError(`AttValue: ' or " expected`);
          }
          return s;
        case "":
          A2 = " ";
        default:
          if (A2 <= " ") switch (p) {
            case Ye:
              r.setTagName(e.slice(u, s)), p = ze;
              break;
            case ee:
              o = e.slice(u, s), p = de;
              break;
            case ge:
              var l2 = e.slice(u, s);
              i.warning('attribute "' + l2 + '" missed quot(")!!'), c(o, l2, u);
            case Ce:
              p = ze;
              break;
          }
          else switch (p) {
            case de:
              a || i.warning('attribute "' + o + '" missed value!! "' + o + '" instead2!!'), c(o, o, u), u = s, p = ee;
              break;
            case Ce:
              i.warning('attribute space is required"' + o + '"!!');
            case ze:
              p = ee, u = s;
              break;
            case Xe:
              p = ge, u = s;
              break;
            case su:
              throw new Error("elements closed character '/' and '>' must be connected to");
          }
      }
      s++;
    }
  }
  function Fr(e, u, r) {
    for (var t = e.tagName, n = null, p = e.length; p--; ) {
      var i = e[p], a = i.qName, c = i.value, A2 = a.indexOf(":");
      if (A2 > 0) var o = i.prefix = a.slice(0, A2), l2 = a.slice(A2 + 1), s = o === "xmlns" && l2;
      else l2 = a, o = null, s = a === "xmlns" && "";
      i.localName = l2, s !== false && (n == null && (n = /* @__PURE__ */ Object.create(null), Ur(r, r = /* @__PURE__ */ Object.create(null))), r[s] = n[s] = c, i.uri = Mr.XMLNS, u.startPrefixMapping(s, c));
    }
    for (var p = e.length; p--; ) i = e[p], i.prefix && (i.prefix === "xml" && (i.uri = Mr.XML), i.prefix !== "xmlns" && (i.uri = r[i.prefix]));
    var A2 = t.indexOf(":");
    A2 > 0 ? (o = e.prefix = t.slice(0, A2), l2 = e.localName = t.slice(A2 + 1)) : (o = null, l2 = e.localName = t);
    var v = e.uri = r[o || ""];
    if (u.startElement(v, l2, t, e), e.closed) {
      if (u.endElement(v, l2, t), n) for (o in n) je(n, o) && u.endPrefixMapping(o);
    } else return e.currentNSMap = r, e.localNSMap = n, true;
  }
  function Fn(e, u, r, t, n) {
    var i = On(r);
    if (i || Rn(r)) {
      var a = e.indexOf("</" + r + ">", u), c = e.substring(u + 1, a);
      return i && (c = c.replace(Lu, t)), n.characters(c, 0, c.length), a;
    }
    return u + 1;
  }
  function Ur(e, u) {
    for (var r in e) je(e, r) && (u[r] = e[r]);
  }
  function kr(e, u) {
    var r = u;
    function t(s) {
      return s = s || 0, e.charAt(r + s);
    }
    function n(s) {
      s = s || 1, r += s;
    }
    function i() {
      for (var s = 0; r < e.length; ) {
        var p = t();
        if (p !== " " && p !== `
` && p !== "	" && p !== "\r") return s;
        s++, n();
      }
      return -1;
    }
    function a() {
      return e.substring(r);
    }
    function c(s) {
      return e.substring(r, r + s.length) === s;
    }
    function o(s) {
      return e.substring(r, r + s.length).toUpperCase() === s.toUpperCase();
    }
    function l2(s) {
      var p = f.reg("^", s), A2 = p.exec(a());
      return A2 ? (n(A2[0].length), A2[0]) : null;
    }
    return { char: t, getIndex: function() {
      return r;
    }, getMatch: l2, getSource: function() {
      return e;
    }, skip: n, skipBlanks: i, substringFromIndex: a, substringStartsWith: c, substringStartsWithCaseInsensitive: o };
  }
  function Pn(e, u) {
    function r(c, o) {
      var l2 = f.PI.exec(c.substringFromIndex());
      return l2 ? l2[1].toLowerCase() === "xml" ? o.fatalError("xml declaration is only allowed at the start of the document, but found at position " + c.getIndex()) : (c.skip(l2[0].length), l2[0]) : o.fatalError("processing instruction is not well-formed at position " + c.getIndex());
    }
    var t = e.getSource();
    if (e.char() === "[") {
      e.skip(1);
      for (var n = e.getIndex(); e.getIndex() < t.length; ) {
        if (e.skipBlanks(), e.char() === "]") {
          var i = t.substring(n, e.getIndex());
          return e.skip(1), i;
        }
        var a = null;
        if (e.char() === "<" && e.char(1) === "!") switch (e.char(2)) {
          case "E":
            e.char(3) === "L" ? a = e.getMatch(f.elementdecl) : e.char(3) === "N" && (a = e.getMatch(f.EntityDecl));
            break;
          case "A":
            a = e.getMatch(f.AttlistDecl);
            break;
          case "N":
            a = e.getMatch(f.NotationDecl);
            break;
          case "-":
            a = e.getMatch(f.Comment);
            break;
        }
        else if (e.char() === "<" && e.char(1) === "?") a = r(e, u);
        else if (e.char() === "%") a = e.getMatch(f.PEReference);
        else return u.fatalError("Error detected in Markup declaration");
        if (!a) return u.fatalError("Error in internal subset at position " + e.getIndex());
      }
      return u.fatalError("doctype internal subset is not well-formed, missing ]");
    }
  }
  function Vr(e, u, r, t, n) {
    var i = kr(e, u);
    switch (n ? i.char(2).toUpperCase() : i.char(2)) {
      case "-":
        var a = i.getMatch(f.Comment);
        return a ? (r.comment(a, f.COMMENT_START.length, a.length - f.COMMENT_START.length - f.COMMENT_END.length), i.getIndex()) : t.fatalError("comment is not well-formed at position " + i.getIndex());
      case "[":
        var c = i.getMatch(f.CDSect);
        return c ? !n && !r.currentElement ? t.fatalError("CDATA outside of element") : (r.startCDATA(), r.characters(c, f.CDATA_START.length, c.length - f.CDATA_START.length - f.CDATA_END.length), r.endCDATA(), i.getIndex()) : t.fatalError("Invalid CDATA starting at position " + u);
      case "D": {
        if (r.doc && r.doc.documentElement) return t.fatalError("Doctype not allowed inside or after documentElement at position " + i.getIndex());
        if (n ? !i.substringStartsWithCaseInsensitive(f.DOCTYPE_DECL_START) : !i.substringStartsWith(f.DOCTYPE_DECL_START)) return t.fatalError("Expected " + f.DOCTYPE_DECL_START + " at position " + i.getIndex());
        if (i.skip(f.DOCTYPE_DECL_START.length), i.skipBlanks() < 1) return t.fatalError("Expected whitespace after " + f.DOCTYPE_DECL_START + " at position " + i.getIndex());
        var o = { name: void 0, publicId: void 0, systemId: void 0, internalSubset: void 0 };
        if (o.name = i.getMatch(f.Name), !o.name) return t.fatalError("doctype name missing or contains unexpected characters at position " + i.getIndex());
        if (n && o.name.toLowerCase() !== "html" && t.warning("Unexpected DOCTYPE in HTML document at position " + i.getIndex()), i.skipBlanks(), i.substringStartsWith(f.PUBLIC) || i.substringStartsWith(f.SYSTEM)) {
          var l2 = f.ExternalID_match.exec(i.substringFromIndex());
          if (!l2) return t.fatalError("doctype external id is not well-formed at position " + i.getIndex());
          l2.groups.SystemLiteralOnly !== void 0 ? o.systemId = l2.groups.SystemLiteralOnly : (o.systemId = l2.groups.SystemLiteral, o.publicId = l2.groups.PubidLiteral), i.skip(l2[0].length);
        } else if (n && i.substringStartsWithCaseInsensitive(f.SYSTEM)) {
          if (i.skip(f.SYSTEM.length), i.skipBlanks() < 1) return t.fatalError("Expected whitespace after " + f.SYSTEM + " at position " + i.getIndex());
          if (o.systemId = i.getMatch(f.ABOUT_LEGACY_COMPAT_SystemLiteral), !o.systemId) return t.fatalError("Expected " + f.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + f.SYSTEM + " at position " + i.getIndex());
        }
        return n && o.systemId && !f.ABOUT_LEGACY_COMPAT_SystemLiteral.test(o.systemId) && t.warning("Unexpected doctype.systemId in HTML document at position " + i.getIndex()), n || (i.skipBlanks(), o.internalSubset = Pn(i, t)), i.skipBlanks(), i.char() !== ">" ? t.fatalError("doctype not terminated with > at position " + i.getIndex()) : (i.skip(1), r.startDTD(o.name, o.publicId, o.systemId, o.internalSubset), r.endDTD(), i.getIndex());
      }
      default:
        return t.fatalError('Not well-formed XML starting with "<!" at position ' + u);
    }
  }
  function qn(e, u, r, t) {
    var n = e.substring(u).match(f.PI);
    if (!n) return t.fatalError("Invalid processing instruction starting at position " + u);
    if (n[1].toLowerCase() === "xml") {
      if (u > 0) return t.fatalError("processing instruction at position " + u + " is an xml declaration which is only at the start of the document");
      if (!f.XMLDecl.test(e.substring(u))) return t.fatalError("xml declaration is not well-formed");
    }
    return r.processingInstruction(n[1], n[2]), u + n[0].length;
  }
  function Hr() {
    this.attributeNames = /* @__PURE__ */ Object.create(null);
  }
  Hr.prototype = { setTagName: function(e) {
    if (!f.QName_exact.test(e)) throw new Error("invalid tagName:" + e);
    this.tagName = e;
  }, addValue: function(e, u, r) {
    if (!f.QName_exact.test(e)) throw new Error("invalid attribute:" + e);
    this.attributeNames[e] = this.length, this[this.length++] = { qName: e, value: u, offset: r };
  }, length: 0, getLocalName: function(e) {
    return this[e].localName;
  }, getLocator: function(e) {
    return this[e].locator;
  }, getQName: function(e) {
    return this[e].qName;
  }, getURI: function(e) {
    return this[e].uri;
  }, getValue: function(e) {
    return this[e].value;
  } };
  lu.XMLReader = qr;
  lu.parseUtils = kr;
  lu.parseDoctypeCommentOrCData = Vr;
});
var Zr = W((Ne) => {
  "use strict";
  var le = ne(), Un = xu(), kn = Be(), Yr = Rr(), Vn = Gr(), Hn = Un.DOMImplementation, Gn = le.hasDefaultHTMLNamespace, Yn = le.isHTMLMimeType, Xn = le.isValidMimeType, jr = le.MIME_TYPE, Fu = le.NAMESPACE, Xr = kn.ParseError, zn = Vn.XMLReader;
  function Qr(e) {
    return e.replace(/\r[\n\u0085]/g, `
`).replace(/[\r\u0085\u2028\u2029]/g, `
`);
  }
  function Wr(e) {
    if (e = e || {}, e.locator === void 0 && (e.locator = true), this.assign = e.assign || le.assign, this.domHandler = e.domHandler || Eu, this.onError = e.onError || e.errorHandler, e.errorHandler && typeof e.errorHandler != "function") throw new TypeError("errorHandler object is no longer supported, switch to onError!");
    e.errorHandler && e.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this), this.normalizeLineEndings = e.normalizeLineEndings || Qr, this.locator = !!e.locator, this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), e.xmlns);
  }
  Wr.prototype.parseFromString = function(e, u) {
    if (!Xn(u)) throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + u + '" is not valid.');
    var r = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns), t = Yr.XML_ENTITIES, n = r[""] || null;
    Gn(u) ? (t = Yr.HTML_ENTITIES, n = Fu.HTML) : u === jr.XML_SVG_IMAGE && (n = Fu.SVG), r[""] = n, r.xml = r.xml || Fu.XML;
    var i = new this.domHandler({ mimeType: u, defaultNamespace: n, onError: this.onError }), a = this.locator ? {} : void 0;
    this.locator && i.setDocumentLocator(a);
    var c = new zn();
    c.errorHandler = i, c.domBuilder = i;
    var o = !le.isHTMLMimeType(u);
    return o && typeof e != "string" && c.errorHandler.fatalError("source is not a string"), c.parse(this.normalizeLineEndings(String(e)), r, t), i.doc.documentElement || c.errorHandler.fatalError("missing root element"), i.doc;
  };
  function Eu(e) {
    var u = e || {};
    this.mimeType = u.mimeType || jr.XML_APPLICATION, this.defaultNamespace = u.defaultNamespace || null, this.cdata = false, this.currentElement = void 0, this.doc = void 0, this.locator = void 0, this.onError = u.onError;
  }
  function ve(e, u) {
    u.lineNumber = e.lineNumber, u.columnNumber = e.columnNumber;
  }
  Eu.prototype = { startDocument: function() {
    var e = new Hn();
    this.doc = Yn(this.mimeType) ? e.createHTMLDocument(false) : e.createDocument(this.defaultNamespace, "");
  }, startElement: function(e, u, r, t) {
    var n = this.doc, i = n.createElementNS(e, r || u), a = t.length;
    cu(this, i), this.currentElement = i, this.locator && ve(this.locator, i);
    for (var c = 0; c < a; c++) {
      var e = t.getURI(c), o = t.getValue(c), r = t.getQName(c), l2 = n.createAttributeNS(e, r);
      this.locator && ve(t.getLocator(c), l2), l2.value = l2.nodeValue = o, i.setAttributeNode(l2);
    }
  }, endElement: function(e, u, r) {
    this.currentElement = this.currentElement.parentNode;
  }, startPrefixMapping: function(e, u) {
  }, endPrefixMapping: function(e) {
  }, processingInstruction: function(e, u) {
    var r = this.doc.createProcessingInstruction(e, u);
    this.locator && ve(this.locator, r), cu(this, r);
  }, ignorableWhitespace: function(e, u, r) {
  }, characters: function(e, u, r) {
    if (e = zr.apply(this, arguments), e) {
      if (this.cdata) var t = this.doc.createCDATASection(e);
      else var t = this.doc.createTextNode(e);
      this.currentElement ? this.currentElement.appendChild(t) : /^\s*$/.test(e) && this.doc.appendChild(t), this.locator && ve(this.locator, t);
    }
  }, skippedEntity: function(e) {
  }, endDocument: function() {
    this.doc.normalize();
  }, setDocumentLocator: function(e) {
    e && (e.lineNumber = 0), this.locator = e;
  }, comment: function(e, u, r) {
    e = zr.apply(this, arguments);
    var t = this.doc.createComment(e);
    this.locator && ve(this.locator, t), cu(this, t);
  }, startCDATA: function() {
    this.cdata = true;
  }, endCDATA: function() {
    this.cdata = false;
  }, startDTD: function(e, u, r, t) {
    var n = this.doc.implementation;
    if (n && n.createDocumentType) {
      var i = n.createDocumentType(e, u, r, t);
      this.locator && ve(this.locator, i), cu(this, i), this.doc.doctype = i;
    }
  }, reportError: function(e, u) {
    if (typeof this.onError == "function") try {
      this.onError(e, u, this);
    } catch (r) {
      throw new Xr("Reporting " + e + ' "' + u + '" caused ' + r, this.locator);
    }
    else console.error("[xmldom " + e + "]	" + u, jn(this.locator));
  }, warning: function(e) {
    this.reportError("warning", e);
  }, error: function(e) {
    this.reportError("error", e);
  }, fatalError: function(e) {
    throw this.reportError("fatalError", e), new Xr(e, this.locator);
  } };
  function jn(e) {
    if (e) return `
@#[line:` + e.lineNumber + ",col:" + e.columnNumber + "]";
  }
  function zr(e, u, r) {
    return typeof e == "string" ? e.substr(u, r) : e.length >= u + r || u ? new java.lang.String(e, u, r) + "" : e;
  }
  "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(e) {
    Eu.prototype[e] = function() {
      return null;
    };
  });
  function cu(e, u) {
    e.currentElement ? e.currentElement.appendChild(u) : e.doc.appendChild(u);
  }
  function Qn(e) {
    if (e === "error") throw "onErrorStopParsing";
  }
  function Wn() {
    throw "onWarningStopParsing";
  }
  Ne.__DOMHandler = Eu;
  Ne.DOMParser = Wr;
  Ne.normalizeLineEndings = Qr;
  Ne.onErrorStopParsing = Qn;
  Ne.onWarningStopParsing = Wn;
});
var Jr = W((g2) => {
  "use strict";
  var be = ne();
  g2.assign = be.assign;
  g2.hasDefaultHTMLNamespace = be.hasDefaultHTMLNamespace;
  g2.isHTMLMimeType = be.isHTMLMimeType;
  g2.isValidMimeType = be.isValidMimeType;
  g2.MIME_TYPE = be.MIME_TYPE;
  g2.NAMESPACE = be.NAMESPACE;
  var Du = Be();
  g2.DOMException = Du.DOMException;
  g2.DOMExceptionName = Du.DOMExceptionName;
  g2.ExceptionCode = Du.ExceptionCode;
  g2.ParseError = Du.ParseError;
  var B = xu();
  g2.Attr = B.Attr;
  g2.CDATASection = B.CDATASection;
  g2.CharacterData = B.CharacterData;
  g2.Comment = B.Comment;
  g2.Document = B.Document;
  g2.DocumentFragment = B.DocumentFragment;
  g2.DocumentType = B.DocumentType;
  g2.DOMImplementation = B.DOMImplementation;
  g2.Element = B.Element;
  g2.Entity = B.Entity;
  g2.EntityReference = B.EntityReference;
  g2.LiveNodeList = B.LiveNodeList;
  g2.NamedNodeMap = B.NamedNodeMap;
  g2.Node = B.Node;
  g2.NodeList = B.NodeList;
  g2.Notation = B.Notation;
  g2.ProcessingInstruction = B.ProcessingInstruction;
  g2.Text = B.Text;
  g2.XMLSerializer = B.XMLSerializer;
  var pu = Zr();
  g2.DOMParser = pu.DOMParser;
  g2.normalizeLineEndings = pu.normalizeLineEndings;
  g2.onErrorStopParsing = pu.onErrorStopParsing;
  g2.onWarningStopParsing = pu.onWarningStopParsing;
});
var fu = at(Jr());
var { assign: ii, hasDefaultHTMLNamespace: ai, isHTMLMimeType: oi, isValidMimeType: si, MIME_TYPE: li, NAMESPACE: ci, DOMException: Ei, DOMExceptionName: Di, ExceptionCode: pi, ParseError: fi, Attr: hi, CDATASection: Ai, CharacterData: mi, Comment: di, Document: gi, DocumentFragment: Ci, DocumentType: Ti, DOMImplementation: vi, Element: Ni, Entity: bi, EntityReference: wi, LiveNodeList: yi, NamedNodeMap: _i, Node: Si, NodeList: Ii, Notation: Oi, ProcessingInstruction: Bi, Text: Ri, XMLSerializer: Mi, DOMParser: xi, normalizeLineEndings: Li, onErrorStopParsing: Fi, onWarningStopParsing: Pi } = fu;
var qi = fu.default ?? fu;

// bundle_help/urdf/UrdfModel.js
var UrdfModel = class {
  materials = {};
  links = {};
  joints = {};
  /**
   * @param {Object} options
   * @param {Element | null} [options.xml] - The XML element to parse.
   * @param {string} [options.string] - The XML element to parse as a string.
   */
  constructor(options) {
    var xmlDoc = options.xml;
    var string = options.string;
    if (string) {
      var parser = new xi();
      xmlDoc = parser.parseFromString(string, li.XML_TEXT).documentElement;
    }
    if (!xmlDoc) {
      throw new Error("No URDF document parsed!");
    }
    var robotXml = xmlDoc;
    this.name = robotXml.getAttribute("name");
    for (var nodes = robotXml.childNodes, i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.tagName === "material") {
        var material = new UrdfMaterial({
          xml: node
        });
        if (this.materials[material.name] !== void 0) {
          if (this.materials[material.name].isLink()) {
            this.materials[material.name].assign(material);
          } else {
            console.warn("Material " + material.name + "is not unique.");
          }
        } else {
          this.materials[material.name] = material;
        }
      } else if (node.tagName === "link") {
        var link = new UrdfLink({
          xml: node
        });
        if (this.links[link.name] !== void 0) {
          console.warn("Link " + link.name + " is not unique.");
        } else {
          for (var j = 0; j < link.visuals.length; j++) {
            var mat = link.visuals[j].material;
            if (mat !== null && mat.name) {
              if (this.materials[mat.name] !== void 0) {
                link.visuals[j].material = this.materials[mat.name];
              } else {
                this.materials[mat.name] = mat;
              }
            }
          }
          this.links[link.name] = link;
        }
      } else if (node.tagName === "joint") {
        var joint = new UrdfJoint({
          xml: node
        });
        this.joints[joint.name] = joint;
      }
    }
  }
};

// bundle_help/RosLib.js
var REVISION = "1.4.1";
var RosLib_default = {
  REVISION,
  ...core_exports,
  ...actionlib_exports,
  ...math_exports,
  ...tf_exports,
  ...urdf_exports
};
export {
  Action,
  ActionClient,
  ActionListener,
  Goal,
  Param,
  Pose,
  Quaternion,
  REVISION,
  ROS2TFClient,
  Ros,
  Service,
  SimpleActionServer,
  TFClient,
  Topic,
  Transform,
  URDF_BOX,
  URDF_CYLINDER,
  URDF_MESH,
  URDF_SPHERE,
  UrdfBox,
  UrdfColor,
  UrdfCylinder,
  UrdfLink,
  UrdfMaterial,
  UrdfMesh,
  UrdfModel,
  UrdfSphere,
  UrdfVisual,
  Vector3,
  RosLib_default as default
};
