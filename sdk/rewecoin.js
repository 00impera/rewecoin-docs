/*!
 * ReweCoin JavaScript SDK
 *
 * Thin client for the public read-only REST API (https://rest.rewecoin.com).
 * No dependencies. Works in browsers and in Node.js 18+ (uses global fetch).
 *
 * Usage (browser):
 *   <script src="rewecoin.js"></script>
 *   const rwc = new ReweCoin();
 *   rwc.getNetwork().then(console.log);
 *
 * Usage (Node, CommonJS):
 *   const { ReweCoin } = require("./rewecoin.js");
 *
 * Address balances are not available: the API has no address index yet.
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

  var DEFAULT_BASE_URL = "https://rest.rewecoin.com";

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
    this.timeoutMs = options.timeoutMs > 0 ? options.timeoutMs : 10000;
    this._fetch = options.fetch || (typeof fetch === "function" ? fetch.bind(globalThis) : null);
    if (!this._fetch) {
      throw new ReweCoinError("No fetch available. Use a browser or Node.js 18+, or pass options.fetch.");
    }
  }

  ReweCoin.prototype._get = function (path) {
    var self = this;
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, this.timeoutMs) : null;
    var url = this.baseUrl + path;

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
        throw new ReweCoinError("Request to " + path + " timed out after " + self.timeoutMs + " ms");
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

  ReweCoin.prototype.health = function () {
    return this._get("/api/health").then(function (d) { return !!(d && d.ok); });
  };

  return { ReweCoin: ReweCoin, ReweCoinError: ReweCoinError };
});