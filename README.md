# rum-diary-endpoint


[![Build Status](https://api.shippable.com/projects/538074528db9d83f00ba7eca/badge/master)](https://www.shippable.com/projects/538074528db9d83f00ba7eca/builds/history)

NodeJS endpoint to listen for [rum-diary-js-client](https://github.com/shane-tomlinson/speed-trap) statistics and send them to one or more collectors

## Installation

1. Install via npm: `npm install rum-diary-endpoint`
2. Install via github: `git clone https://github.com/shane-tomlinson/rum-diary-endpoint.git`

## Connect/Express middleware

1. Include `rum-diary-endpoint`.
2. Initialize one or more collectors.
3. Create a middleware, configuring it with the endpoint path and a list of collectors.
4. Register the middleware with the application.

```js
const rumDiaryEndpoint = require('rum-diary-endpoint');

const consoleCollector = new rumDiaryEndpoint.collectors.Console();

const middleware = rumDiaryEndpoint.setup({
  endpoint: '/metrics',
  collectors: [ consoleCollector ]
});

app.use(middleware);
```


## Advanced Use

## Custom collectors
A collector is an object that must expose three functions:

* `write` - write results to the collector.
* `flush` - flush any cached data to the collector.
* `destroy` - the collector is about to be destroyed.

```js
const metricsDatabase = setupMetricsDatabase();

const metricsDatabaseCollector = {
  write: function (result) {
    return metricsDatabase.create(result);
  },

  flush: function () {
    return metricsDatabase.persist();
  },

  destroy: function () {
    return metricsDatabase.close();
  }
};

const middleware = rumDiaryEndpoint.setup({
  endpoint: '/metrics',
  collectors: [ metricsDatabaseCollector ]
});

app.use(middleware);
```

### Send results to rum-diary.org

```js
const rumDiaryEndpoint = require('rum-diary-endpoint');

const httpCollector = new rumDiaryEndpoint.collectors.Http({
  collectorUrl: 'https://rum-diary.org/metrics'
});

const middleware = rumDiaryEndpoint.setup({
  endpoint: '/metrics',
  collectors: [ httpCollector ]
});

app.use(middleware);
```

## Direct use

### Composite

The `Composite` can be used directly.

```js
const rumDiaryEndpoint = require('rum-diary-endpoint');
const RumDiaryComposite = rumDiaryEndpoint.Composite;
const consoleCollector = new rumDiaryEndpoint.collectors.Console();


const metricsCollectors = new RumDiaryComposite({
  collectors: [ consoleCollector ]
});

...

app.post('/metrics', function (req, next) {
  var cleanMetrics = scrubMetrics(req.body);
  metricsCollectors.write(cleanMetrics);
});
```

### Handler

If custom route handling is needed, the `Handler` object can be instantiated
and initialized independently.

```js
const rumDiaryEndpoint = require('rum-diary-endpoint');
const RumDiaryHandler = rumDiaryEndpoint.Handler;
const consoleCollector = new rumDiaryEndpoint.collectors.Console();


const handler = new RumDiaryHandler({
  collectors: [ consoleCollector ]
});

...

app.post('/metrics', handler);
```


## Prerequisites:

* [nodejs](http://nodejs.org/) &gt;= 0.10.0

## Get Involved:

## Author:
* Shane Tomlinson
* shane@shanetomlinson.com
* stomlinson@mozilla.com
* set117@yahoo.com
* https://shanetomlinson.com
* https://github.com/shane-tomlinson
* @shane_tomlinson

## License:
This software is available under version 2.0 of the MPL:

  https://www.mozilla.org/MPL/

