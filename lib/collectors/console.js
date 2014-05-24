/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A console collector - ship results to the console.

'use strict';

function ConsoleCollector() {
  // nothing to do here.
}

ConsoleCollector.prototype = {
  init: function (options) {
    this.console = options.console || console;
  },

  destroy: function () {
  },

  /**
   * Store a result
   */
  storeResult: function (event) {
    this.console.log('event: %s', event);
  },

  /**
   * Flush the cache
   */
  flush: function () {
  }
};

module.exports = ConsoleCollector;
