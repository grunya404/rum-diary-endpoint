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

  storeLoadEvent: function (data) {
    var self = this;
    self.loadData.push(data);

    return Promise.resolve()
      .then(function () {
        if (self.loadData.length < self.maxCacheSize) return;

        var data = self.loadData;
        self.loadData = [];
        console.error('sending data!');
        self.request.post(self.loadEventUrl, self.loadData);
      });
  },

  storeUnloadEvent: function (data) {
    var self = this;
    self.unloadData.push(data);

    return Promise.resolve()
      .then(function () {
        if (self.unloadData.length < self.maxCacheSize) return;

        var data = self.unloadData;
        self.unloadData = [];
        self.request.post(self.unloadEventUrl, self.unloadData);
      });
  },

  flush: function () {
  }
};

module.exports = HttpProxyStrategy;
