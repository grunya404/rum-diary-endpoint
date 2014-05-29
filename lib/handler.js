/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Plain jane handler to hook up to a route.
// Sends metrics to one or more collectors.

'use strict';

var Composite = require('./collector-composite');

module.exports = function Handler(options) {
  var composite = new Composite({
    collectors: options.collectors
  });

  var handler = function handler (req, res) {
    res.json(200, { success: true });

    var data = req.body || {};
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (! data.location) {
      data.location = req.get('referrer');
    }

    if (! data.user_agent) {
      data.user_agent = req.get('user-agent');
    }

    composite.write(data);
  };

  handler.write = composite.write.bind(composite);
  handler.flush = composite.flush.bind(composite);
  handler.destroy = composite.destroy.bind(composite);

  return handler;
};

