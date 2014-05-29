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
  var nullCollector, middleware;

  before(function () {
    nullCollector = new NullCollector();

    middleware = new Middleware({
      endpoint: '/metrics',
      collectors: [ nullCollector ]
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
  });
});

