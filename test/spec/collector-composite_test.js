/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var CollectorComposite = require('../../lib/collector-composite');
var NullCollector = require('../../lib/collectors/null');
var ConsoleCollector = require('../../lib/collectors/console');

describe('lib/collector-composite', function () {
  var nullCollector1, nullCollector2, consoleCollector, composite;

  before(function () {
    nullCollector1 = new NullCollector();
    nullCollector2 = new NullCollector();
    consoleCollector = new ConsoleCollector({
      console: {
        log: function () {
          // drop the console messages on the ground for testing.
        }
      }
    });

    composite = new CollectorComposite({
      collectors: [ nullCollector1, nullCollector2, consoleCollector ]
    });
  });

  describe('write', function () {
    it('passes on data to all collectors', function (done) {
      var collector1Event;
      nullCollector1.on('data', function (event) {
        collector1Event = event;
      });

      nullCollector2.on('data', function (event) {
        assert.ok(collector1Event);
        assert.ok(event);
        done();
      });

      composite.write({ events: [ { type: 'done' } ] });
    });
  });

  describe('flush', function () {
    it('calls flush on all collectors', function (done) {
      var collector1Flushed;
      nullCollector1.on('flush', function (event) {
        collector1Flushed = true;
      });

      nullCollector2.on('flush', function (event) {
        assert.isTrue(collector1Flushed);
        done();
      });

      composite.flush();
    });
  });

  describe('destroy', function () {
    it('calls destroy on all collectors', function (done) {
      var collector1Destroyed;
      nullCollector1.on('destroy', function (event) {
        collector1Destroyed = true;
      });

      nullCollector2.on('destroy', function (event) {
        assert.isTrue(collector1Destroyed);
        done();
      });

      composite.destroy();
    });
  });
});

