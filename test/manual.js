/*
 * Small basic manual test, used with nave to test different node versions. Run
 * the test script (NODE_ENV=test nave use 0.6.8 node test/manual), followed by
 * a number of cURL requests (curl http://localhost:5545/) which will trigger an
 * exception. The single process should die, then a new process forked in it's
 * place, along with logging.
 */
var clustered = require('../clustered')
  , http = require('http')

clustered(function () {
  http.createServer(function () {
    throw 'Exception'
  }).listen(5545, function () { })
}, { size: 1 })
