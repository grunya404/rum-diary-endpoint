/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var Middleware = require('./lib/middleware');

/**
 * Middleware is initialized using `rumDiaryEndpoint.setup(options);`
 */
module.exports.setup = function setup(options) {
  return new Middleware(options);
};

/**
 * Direct access to an instantiable Composite.
 */
exports.Composite = require('./lib/collector-composite');

/**
 * Direct access to an instantiable Handler. Use to hook
 * up directly to a route without using the middleware.
 */
exports.Handler = require('./lib/handler');

/**
 * Built in collectors that can be added to the middleware.
 */
exports.collectors = {
  Console: require('./lib/collectors/console'),
  Http: require('./lib/collectors/http'),
  'Null': require('./lib/collectors/null')
};
