/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var RequestMock = require('../mocks/request');
var ResponseMock = require('../mocks/response');

var Middleware = require('../../lib/middleware');
var NullCollector = require('../../lib/collectors/null');

describe('lib/middleware', function () {
  var nullCollector1, nullCollector2, middleware;

  before(function () {
    nullCollector1 = new NullCollector();
    nullCollector2 = new NullCollector();

    middleware = Middleware.setup({
      endpoint: '/metrics',
      collectors: [ nullCollector1, nullCollector2 ]
    });
  });

  describe('middleware', function () {
    var reqMock, respMock;

    it('calls next if url does not match endpoint', function (done) {
      reqMock = new RequestMock('/some_other_endpoint');
      respMock = new ResponseMock();

      middleware(reqMock, respMock, done);
    });

    it('returns json response of success', function () {
      reqMock = new RequestMock('/metrics');
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
      reqMock = new RequestMock('/metrics', { events: [ { type: 'done' } ]});
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

