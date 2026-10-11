/*!
 * ReweCoin JavaScript SDK
 *
 * Thin client for the public read-only REST API (https://api.rewecoin.com).
 * No dependencies. Works in Node.js 18+ (uses global fetch) and in browsers.
 *
 * Usage (browser):
 *   <script src="rewecoin.js"></script>
 *   const rwc = new ReweCoin();
 *   rwc.getNetwork().then(console.log);
 *
 * Usage (Node, CommonJS):
 *   const { ReweCoin } = require("./rewecoin.js");
 *
 * getBalance(address) calls the explorer API (options.explorerUrl, default
 * https://api.rewecoin.com). Its /api/address
 * route sends CORS headers, so it works in browsers.
 * Amounts are converted from zatoshi (1 RWC = 100,000,000); the unit
 * is inferred from data, not from API documentation.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    module.exports.default = module.exports.ReweCoin;
  } else {
    root.ReweCoin = factory().ReweCoin;
    root.ReweCoinError = factory().ReweCoinError;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var DEFAULT_BASE_URL = "https://api.rewecoin.com";
  var DEFAULT_EXPLORER_URL = "https://api.rewecoin.com";
  var ZAT_PER_RWC = 100000000;

  function ReweCoinError(message, status, body) {
    this.name = "ReweCoinError";
    this.message = message;
    this.status = status || 0;
    this.body = body;
    if (Error.captureStackTrace) Error.captureStackTrace(this, ReweCoinError);
  }
  ReweCoinError.prototype = Object.create(Error.prototype);
  ReweCoinError.prototype.constructor = ReweCoinError;

  function ReweCoin(options) {
    options = options || {};
    this.baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.explorerUrl = String(options.explorerUrl || DEFAULT_EXPLORER_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs > 0 ? options.timeoutMs : 10000;
    this._fetch = options.fetch || (typeof fetch === "function" ? fetch.bind(globalThis) : null);
    if (!this._fetch) {
      throw new ReweCoinError("No fetch available. Use a browser or Node.js 18+, or pass options.fetch.");
    }
  }

  ReweCoin.prototype._get = function (path, base, timeoutMs) {
    var self = this;
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, timeoutMs || this.timeoutMs) : null;
    var url = (base || this.baseUrl) + path;

    return this._fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.text().then(function (text) {
        var data;
        try { data = text ? JSON.parse(text) : null; }
        catch (e) {
          throw new ReweCoinError("Response from " + path + " was not valid JSON (HTTP " + res.status + ")", res.status, text.slice(0, 200));
        }
        if (res.status === 429) {
          throw new ReweCoinError("Rate limit exceeded (HTTP 429). Slow down and retry.", 429, data);
        }
        if (!res.ok) {
          var msg = (data && (data.error || data.message)) || ("HTTP " + res.status);
          throw new ReweCoinError(String(msg), res.status, data);
        }
        return data;
      });
    }, function (err) {
      if (timer) clearTimeout(timer);
      if (err && err.name === "AbortError") {
        throw new ReweCoinError("Request to " + path + " timed out after " + (timeoutMs || self.timeoutMs) + " ms");
      }
      throw new ReweCoinError("Network error calling " + path + ": " + (err && err.message ? err.message : err));
    });
  };

  ReweCoin.prototype.getNetwork = function () { return this._get("/api/network"); };

  ReweCoin.prototype.getBlock = function (id) {
    if (id === undefined || id === null) id = "latest";
    var s = String(id).trim();
    var ok = s === "latest" || /^\d+$/.test(s) || /^[0-9a-fA-F]{64}$/.test(s);
    if (!ok) {
      return Promise.reject(new ReweCoinError("getBlock expects a height, a 64-character block hash, or \"latest\""));
    }
    return this._get("/api/block/" + encodeURIComponent(s));
  };

  ReweCoin.prototype.getTx = function (txid) {
    var s = String(txid || "").trim();
    if (!/^[0-9a-fA-F]{64}$/.test(s)) {
      return Promise.reject(new ReweCoinError("getTx expects a 64-character transaction ID"));
    }
    return this._get("/api/tx/" + encodeURIComponent(s));
  };

  ReweCoin.prototype.getHashrate = function () { return this._get("/api/hashrate"); };

  ReweCoin.prototype.getSupply = function () { return this._get("/api/supply"); };

  ReweCoin.prototype.getRichList = function () { return this._get("/api/richlist", undefined, 30000); };

  ReweCoin.prototype.getBalance = function (address, opts) {
    var s = String(address || "").trim();
    if (!/^[1-9A-HJ-NP-Za-km-z]{26,40}$/.test(s)) {
      return Promise.reject(new ReweCoinError("getBalance expects a transparent ReweCoin address (base58)"));
    }
    var includeTxids = !!(opts && opts.includeTxids);
    return this._get("/api/address/" + encodeURIComponent(s), this.explorerUrl).then(function (d) {
      var fields = ["balance", "received", "sent", "txCount"];
      for (var i = 0; i < fields.length; i++) {
        if (!d || typeof d[fields[i]] !== "number" || !isFinite(d[fields[i]])) {
          throw new ReweCoinError("Unexpected explorer response for address " + s, 200, d);
        }
      }
      var out = {
        address: d.address || s,
        balance: d.balance / ZAT_PER_RWC,
        received: d.received / ZAT_PER_RWC,
        sent: d.sent / ZAT_PER_RWC,
        balanceZat: d.balance,
        receivedZat: d.received,
        sentZat: d.sent,
        txCount: d.txCount
      };
      if (includeTxids) out.txids = d.txids || [];
      return out;
    });
  };

  ReweCoin.prototype.health = function () {
    return this._get("/api/health").then(function (d) { return !!(d && d.ok); });
  };

  return { ReweCoin: ReweCoin, ReweCoinError: ReweCoinError };
});
