/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var Bluebird = require('bluebird');

function CollectorComposite(options) {
  this.collectors = options.collectors;
}

CollectorComposite.prototype = {
  write: function write(data) {
    var promises = this.collectors.map(function write_map(collector) {
      return collector.write(data);
    });

    return Bluebird.all(promises);
  },

  flush: function flush() {
    var promises = this.collectors.map(function flush_map(collector) {
      return collector.flush();
    });

    return Bluebird.all(promises);
  },

  destroy: function destroy() {
    var promises = this.collectors.map(function destroy_map(collector) {
      return collector.destroy();
    });

    return Bluebird.all(promises);
  }
};

module.exports = CollectorComposite;
