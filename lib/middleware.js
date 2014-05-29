/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Connect/Express middleware to send rum-diary results
// to one or more collectors

'use strict';

var Handler = require('./handler');

module.exports = function Middleware(options) {
  var endpoint = options.endpoint;
  var handler = new Handler(options);

  var middleware = function middleware (req, res, next) {
    if (req.url === endpoint && req.method === 'POST') return handler(req, res);

    next();
  };

  middleware.write = handler.write;
  middleware.flush = handler.flush;
  middleware.destroy = handler.destroy;

  return middleware;
};

