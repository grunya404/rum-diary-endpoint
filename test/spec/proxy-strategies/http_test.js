/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('chai').assert;
var Promise = require('bluebird');

var JsonEchoServer = require('../../lib/json-echo-server');
var HttpProxy = require('../../../lib/proxy-strategies/http');

describe('lib/proxy-strategies/http', function () {
  var httpProxy, server, receivePromise;

  before(function () {
    server = new JsonEchoServer();
    return server.init({})
        .then(function (port) {
           httpProxy = new HttpProxy();
           httpProxy.init({
             loadEventUrl: 'http://127.0.0.1:' + port + '/metrics/load',
             unloadEventUrl: 'http://127.0.0.1:' + port + '/metrics/unload',
             maxCacheSize: 3
           });

        });
  });

  beforeEach(function () {
    // reset the request promise between each test.
    receivePromise = server.listen(true);
  });

  after(function (done) {
    httpProxy.destroy();
    httpProxy = null;
    server.close(done);
  });

  describe('storeLoadEvent', function () {
    it('sends events to the collector after maxCacheSize is reached', function () {
      httpProxy.storeLoadEvent({ uuid: 'loadEvent1' });
      httpProxy.storeLoadEvent({ uuid: 'loadEvent2' });
      httpProxy.storeLoadEvent({ uuid: 'loadEvent3' });

      return receivePromise
          .then(function (data) {
            assert.deepEqual(data, [
              { uuid: 'loadEvent1' },
              { uuid: 'loadEvent2' },
              { uuid: 'loadEvent3' }
            ]);
          });
    });
  });

  describe('storeUnloadEvent', function () {
    it('sends events to the collector after maxCacheSize is reached', function () {
      httpProxy.storeUnloadEvent({ uuid: 'unloadEvent1' })
      httpProxy.storeUnloadEvent({ uuid: 'unloadEvent2' });
      httpProxy.storeUnloadEvent({ uuid: 'unloadEvent3' });

      return receivePromise
          .then(function (data) {
            assert.deepEqual(data, [
              { uuid: 'unloadEvent1' },
              { uuid: 'unloadEvent2' },
              { uuid: 'unloadEvent3' }
            ]);
          });
    });
  });

  describe('flush', function () {
    it('sends events to the collector even if maxCacheSize is not reached', function () {
      httpProxy.storeUnloadEvent({ uuid: 'flushEvent1' })
      httpProxy.storeUnloadEvent({ uuid: 'flushEvent2' });
      httpProxy.flush();

      return receivePromise
          .then(function (data) {
            assert.deepEqual(data, [
              { uuid: 'flushEvent1' },
              { uuid: 'flushEvent2' }
            ]);
          });
    });
  });
});

