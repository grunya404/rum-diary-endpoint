/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

// A simple JSON message server. Listens for a single JSON request.

var http = require('http');
var Bluebird = require('bluebird');

function JsonEchoServer() {
}

JsonEchoServer.prototype = {
  init: function (options, done) {
    options = options || {};

    var self = this;
    return new Bluebird(function (resolve, reject) {
      self.server = http.createServer(function (req, resp) {
        var receivedData = '';

        req.on('data', function (_data) {
          receivedData += String(_data);
        });

        req.on('end', function () {
          resp.statusCode = 200;
          resp.end(receivedData);

          self._getReceiveDeferred().fulfill(JSON.parse(receivedData));
        });
      });

      self.server.listen(options.port || 0, function (err) {
        if (err) return reject(err);

        var port = self.server.address().port;
        resolve(port);
      });
    });
  },

  close: function (done) {
    this.server.close(done);
  },

  /**
   * Listen for a request. Return a promise that is fulfilled when
   * a request arrives.
   *
   * @params {boolean} shouldReset - if `true`, reset for next request.
   *      Defaults to `false`.
   */
  listen: function (shouldReset) {
    if (shouldReset) this.clear();

    return this._getReceiveDeferred().promise;
  },

  /**
   * Prepare for the next request. Clears any outstanding promises.
   */
  clear: function () {
    this.receiveDeferred = null;
  },

  _getReceiveDeferred: function () {
    if (! this.receiveDeferred) this.receiveDeferred = Bluebird.defer();
    return this.receiveDeferred;
  }
};

module.exports = JsonEchoServer;
