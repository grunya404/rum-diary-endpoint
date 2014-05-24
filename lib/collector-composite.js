/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var Bluebird = require('bluebird');

function CollectorComposite(options) {
  this.collectors = options.collectors;
}

CollectorComposite.prototype = {
  storeResult: function (result) {
    var promises = this.collectors.map(function (collector) {
      return collector.storeResult(result);
    });

    return Bluebird.all(promises);
  },

  flush: function () {
    var promises = this.collectors.map(function (collector) {
      return collector.flush();
    });

    return Bluebird.all(promises);
  }
};

module.exports = CollectorComposite;
