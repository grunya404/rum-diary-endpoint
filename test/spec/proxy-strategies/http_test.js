/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var http = require('http');
var assert = require('chai').assert;

var HttpProxy = require('../../../lib/proxy-strategies/http');

describe('lib/proxy-strategies/http', function () {
  var httpProxy, server, receivedData;

  beforeEach(function (done) {
    receivedData = null;

    server = http.createServer(function (req, resp) {
      receivedData = true;
      console.error('received some data!');

      resp.statusCode = 200;
      resp.end('ok');
    });

    server.listen(0, function (err) {
      var port = server.address().port;
      console.error('listening on port: %s', port);

      httpProxy = new HttpProxy();
      httpProxy.init({
        loadEventUrl: 'http://127.0.0.1:' + port + '/metrics/load',
        unloadEventUrl: 'http://127.0.0.1:' + port + '/metrics/unload',
        maxCacheSize: 3
      });

      done();
    });
  });

  afterEach(function (done) {
    httpProxy.destroy();
    httpProxy = null;
    server.close(done);
  });

  describe('storeLoadEvent', function () {
    it('sends events to the collector after maxCacheSize is reached', function (done) {
      httpProxy.storeLoadEvent({ uuid: 'event1' })
        .then(function () {
          return httpProxy.storeLoadEvent({ uuid: 'event2' });
        })
        .then(function () {
          return httpProxy.storeLoadEvent({ uuid: 'event3' });
        })
        .then(function () {
          setTimeout(function () {
            assert.ok(receivedData);
            done();
          }, 1000);
        });
    });
  });

  describe('storeUnloadEvent', function () {
  });

  describe('flush', function () {
  });
});

