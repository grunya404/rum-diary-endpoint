/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var index = require('../../index');

describe('index', function () {
  it('should expose setup, Composite, collectors', function () {
    assert.isFunction(index.setup);
    assert.isFunction(index.Composite);
    assert.isObject(index.collectors);
  });

  describe('setup', function () {
    it('should return a middleware', function () {
      var middleware = index.setup({
        endpoint: '/metrics',
        collectors: []
      });

      assert.isFunction(middleware);
    });
  });
});

