/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var index = require('../../index');

describe('index', function () {
  it('should expose middleware, Composite, collectors', function () {
    assert.ok(index.middleware);
    assert.ok(index.Composite);
    assert.ok(index.collectors);
  });
});

