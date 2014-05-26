/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var JsonEchoServer = require('../../lib/json-echo-server');
var HttpCollector = require('../../../lib/collectors/http');

describe('lib/collectors/http', function () {
  var httpCollector, server, receiveBluebird;

  before(function () {
    server = new JsonEchoServer();
    return server.start({})
        .then(function (port) {
           httpCollector = new HttpCollector({
             collectorUrl: 'http://127.0.0.1:' + port + '/metrics',
             maxCacheSize: 3
           });
        });
  });

  beforeEach(function () {
    // reset the request promise between each test.
    receiveBluebird = server.listen(true);
  });

  after(function (done) {
    httpCollector.destroy();
    httpCollector = null;
    server.close(done);
  });

  describe('write', function () {
    it('sends events to the collector after maxCacheSize is reached', function () {
      httpCollector.write({ uuid: 'loadEvent1' });
      httpCollector.write({ uuid: 'loadEvent2' });
      httpCollector.write({ uuid: 'loadEvent3' });

      return receiveBluebird
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
      httpCollector.write({ uuid: 'flushEvent1' });
      httpCollector.write({ uuid: 'flushEvent2' });
      httpCollector.flush();

      return receiveBluebird
          .then(function (data) {
            assert.deepEqual(data, [
              { uuid: 'flushEvent1' },
              { uuid: 'flushEvent2' }
            ]);
          });
    });
  });
});

