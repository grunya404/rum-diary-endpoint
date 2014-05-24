/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('chai').assert;
var Promise = require('bluebird');

var JsonEchoServer = require('../../lib/json-echo-server');
var HttpCollector = require('../../../lib/collectors/http');

describe('lib/collectors/http', function () {
  var httpCollector, server, receivePromise;

  before(function () {
    server = new JsonEchoServer();
    return server.init({})
        .then(function (port) {
           httpCollector = new HttpCollector();
           httpCollector.init({
             collectorUrl: 'http://127.0.0.1:' + port + '/metrics',
             maxCacheSize: 3
           });
        });
  });

  beforeEach(function () {
    // reset the request promise between each test.
    receivePromise = server.listen(true);
  });

  after(function (done) {
    httpCollector.destroy();
    httpCollector = null;
    server.close(done);
  });

  describe('storeResult', function () {
    it('sends events to the collector after maxCacheSize is reached', function () {
      httpCollector.storeResult({ uuid: 'loadEvent1' });
      httpCollector.storeResult({ uuid: 'loadEvent2' });
      httpCollector.storeResult({ uuid: 'loadEvent3' });

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

  describe('flush', function () {
    it('sends events to the collector even if maxCacheSize is not reached', function () {
      httpCollector.storeResult({ uuid: 'flushEvent1' })
      httpCollector.storeResult({ uuid: 'flushEvent2' });
      httpCollector.flush();

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

