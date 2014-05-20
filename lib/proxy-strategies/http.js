/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var request = require('request');
var Promise = require('bluebird');

function HttpProxyStrategy() {
  // nothing to do here.
}

HttpProxyStrategy.prototype = {
  init: function (options) {
    options = options || {};

    this.loadData = [];
    this.loadEventUrl = options.loadEventUrl;

    this.unloadData = [];
    this.unloadEventUrl = options.unloadEventUrl;

    this.maxCacheSize = options.maxCacheSize || 20;
    this.request = options.request || request;
  },

  destroy: function () {
  },

  storeLoadEvent: function (event) {
    return this._addEvent(event, this.loadData, this.loadEventUrl);
  },

  _flushLoadData: function () {
    return this._flushData(this.loadData, this.loadEventUrl);
  },

  storeUnloadEvent: function (data) {
    var self = this;
    this.unloadData.push(data);

    return new Promise(function (resolve, reject) {
      if (self.unloadData.length < self.maxCacheSize) return resolve();

      return self._flushUnloadData();
    });
  },

  _flushUnloadData: function () {
    return this._flushData(this.unloadData, this.unloadEventUrl);
  },

  /**
   * Flush all outstanding data
   */
  flush: function () {
    return Promise.all([
      this._flushLoadData(),
      this._flushUnloadData()
    ]);
  },

  _addEvent: function (event, dataStore, flushTo) {
    var self = this;
    dataStore.push(event);

    return new Promise(function (resolve, reject) {
      if (dataStore.length < self.maxCacheSize) return resolve();

      return self._flushData(dataStore, flushTo);
    });
  },

  _flushData: function(dataStore, flushTo) {
    // the request could fail and we have already dropped the data
    // This is acceptable.
    var self = this;
    return new Promise(function (resolve, reject) {
      if (! dataStore.length) return resolve();

      var dataToSend = [].concat(dataStore);
      dataStore = dataStore.splice(0, dataStore.length);

      return self._sendData(dataToSend, flushTo);
    });
  },

  _sendData: function (data, url) {
    var self = this;
    return new Promise(function (resolve, reject) {
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

module.exports = HttpProxyStrategy;
