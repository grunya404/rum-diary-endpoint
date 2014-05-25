/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var request = require('request');
var Bluebird = require('bluebird');

function HttpCollector(options) {
  options = options || {};

  this.cache = [];
  this.maxCacheSize = options.maxCacheSize || 20;

  this.collectorUrl = options.collectorUrl;
  this.request = options.request || request;
}

HttpCollector.prototype = {
  destroy: function destroy() {
    this.cache = this.uncache = null;
  },

  storeResult: function storeResult(event) {
    var self = this;
    this.cache.push(event);

    return new Bluebird(function (resolve, reject) {
      if (self.cache.length < self.maxCacheSize) return resolve();

      return self.flush();
    });
  },

  /**
   * Flush the cache
   */
  flush: function flush() {
    // the request could fail and we have already dropped the data
    // This is acceptable.
    var self = this;
    return new Bluebird(function (resolve, reject) {
      if (! self.cache.length) return resolve();

      var dataToSend = self.cache;
      self.cache = [];

      return self._sendData(dataToSend, self.collectorUrl);
    });
  },

  _sendData: function _sendData(data, url) {
    var self = this;
    return new Bluebird(function (resolve, reject) {
      self.request({
        uri: url,
        method: 'POST',
        body: JSON.stringify(data)
      }, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = HttpCollector;
