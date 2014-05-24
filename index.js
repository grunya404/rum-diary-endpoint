/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

/**
 * Middleware is initialized using `middleware.setup(options);`
 */
exports.middleware = require('./lib/middleware');

/**
 * Direct access to an instantiable Composite.
 */
exports.Composite = require('./lib/collector-composite');

/**
 * Built in collectors that can be added to the middleware.
 */
exports.collectors = {
  console: require('./lib/collectors/console'),
  http: require('./lib/collectors/http'),
  'null': require('./lib/collectors/null')
};
