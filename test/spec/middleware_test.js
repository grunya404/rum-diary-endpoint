/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var RequestMock = require('../mocks/request');
var ResponseMock = require('../mocks/response');

var Middleware = require('../../lib/middleware');
var NullCollector = require('../../lib/collectors/null');
var ConsoleCollector = require('../../lib/collectors/console');

describe('lib/middleware', function () {
  var nullCollector1, nullCollector2, consoleCollector, middleware;

  before(function () {
    nullCollector1 = new NullCollector();
    nullCollector2 = new NullCollector();
    consoleCollector = new ConsoleCollector();
    consoleCollector.init({
      console: {
        log: function () {
          // drop the console messages on the ground for testing.
        }
      }
    });

    middleware = Middleware.setup({
      endpoint: '/metrics',
      collectors: [ nullCollector1, nullCollector2, consoleCollector ]
    });
  });

  describe('middleware', function () {
    var reqMock, respMock;

    it('calls next if url does not match endpoint', function (done) {
      reqMock = new RequestMock({
        url: '/some_other_endpoint',
        method: 'POST'
      });
      respMock = new ResponseMock();

      middleware(reqMock, respMock, done);
    });

    it('calls next if method is not POST', function (done) {
      reqMock = new RequestMock({
        url: '/metrics',
        method: 'GET'
      });
      respMock = new ResponseMock();

      middleware(reqMock, respMock, done);
    });

    it('returns json response of success', function () {
      reqMock = new RequestMock({
        url: '/metrics',
        method: 'POST'
      });
      respMock = new ResponseMock();

      var nextCalled = false;
      middleware(reqMock, respMock, function () {
        nextCalled = true;
      });

      assert.isFalse(nextCalled);
      assert.equal(respMock.status, 200);
      assert.isTrue(JSON.parse(respMock.body).success);
    });

    it('passes on data to all collectors', function (done) {
      reqMock = new RequestMock({
        url: '/metrics',
        method: 'POST',
        data: { events: [ { type: 'done' } ] }
      });
      respMock = new ResponseMock();

      var collector1Event;
      nullCollector1.on('event', function (event) {
        collector1Event = event;
      });

      nullCollector2.on('event', function (event) {
        assert.ok(collector1Event);
        assert.ok(event);
        done();
      });

      middleware(reqMock, respMock);
    });
  });
});

