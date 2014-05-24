/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A null proxy, useful for testing. Emits an 'event' event when a result
// is added, otherwise events are dropped on the ground.

'use strict';

var _ = require('underscore');
var util = require('util');
var events = require('events');

function NullCollector() {
  // nothing to do here.
}

util.inherits(NullCollector, events.EventEmitter);

_.extend(NullCollector.prototype, {
  init: function (options) {
  },

  destroy: function () {
  },

  /**
   * Store a result
   */
  storeResult: function (event) {
    this.emit('event', event);
  },

  /**
   * Flush the cache
   */
  flush: function () {
    this.emit('flush');
  }
});

module.exports = NullCollector;
