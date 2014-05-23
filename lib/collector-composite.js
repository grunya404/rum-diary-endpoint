/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Promise = require('bluebird');

'use strict';

function CollectorComposite(options) {
  this.collectors = options.collectors;
}

CollectorComposite.prototype = {
  storeResult: function (result) {
    var promises = this.collectors.map(function (collector) {
      return collector.storeResult(result);
    });

    return Promise.all(promises);
  },

  flush: function () {
    var promises = this.collectors.map(function (collector) {
      return collector.flush();
    });

    return Promise.all(promises);
  }
};

module.exports = CollectorComposite;
