/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Connect/Express middleware to send rum-diary results
// to one or more collectors

'use strict';

var Composite = require('./collector-composite');

module.exports = function Middleware(options) {
  var endpoint = options.endpoint;

  var composite = new Composite({
    collectors: options.collectors
  });

  var middleware = function (req, res, next) {
    if (! (req.url === endpoint && req.method === 'POST')) return next();

    res.json(200, { success: true });

    composite.storeResult(req.body);
  };

  middleware.storeResult = composite.storeResult.bind(composite);
  middleware.flush = composite.flush.bind(composite);

  return middleware;
};

