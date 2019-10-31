var cluster = require('cluster')

module.exports = function(clusterFn, opts) {
  if (!opts) opts = {}
  var i,
    options = {
      size: opts.size || 2, // Default to the number of CPUs
      logger: opts.logger || console,
      forceTimeout: opts.forceTimeout || 30000
    },
    shuttingDown = false,
    numRunningWorkers = 0

  // Cluster is used in all but the development environment
  if (process.env.NODE_ENV !== undefined && cluster.isMaster) {
    options.logger.info(
      'Forking ' +
        options.size +
        ' cluster process(es) from parent ' +
        process.pid
    )

    // Create one instance of the app (i.e. one process) per CPU
    for (i = 0; i < options.size; i += 1) {
      cluster.fork()
    }

    process.on('SIGTERM', startShutDown)

    cluster.on('fork', function() {
      numRunningWorkers++
    })

    // Report child process death
    cluster.on('exit', function(worker) {
      numRunningWorkers--
      if (shuttingDown) {
        return checkIfShouldShutDown()
      }
      forkNewProcess(worker.process)
    })
  } else {
    options.logger.info('Forked ' + process.pid)
    clusterFn()
  }

  function forkNewProcess(process) {
    var exitCode = process.exitCode
    var signalCode = process.signalCode
    if (exitCode || (signalCode && signalCode !== 'SIGTERM')) {
      options.logger.warn(
        'Worker ' +
          process.pid +
          ' died' +
          (exitCode ? ' ' + exitCode : '') +
          (signalCode ? ' ' + signalCode : '')
      )
    }
    cluster.fork()
  }

  function startShutDown() {
    options.logger.info('SIGTERM received. Begin cluster shutdown')
    shuttingDown = true
    for (var id in cluster.workers) {
      process.kill(cluster.workers[id].process.pid)
    }
    setTimeout(function() {
      options.logger.error(
        'Workers did not gracefully close in time, forcefully shutting down'
      )
      process.exit(1)
    }, options.forceTimeout).unref()
  }

  function checkIfShouldShutDown() {
    if (!numRunningWorkers) {
      options.logger.info('Cluster exiting. All workers exited.')
      return process.exit(0)
    }
    options.logger.info(
      'Cluster not exiting. Num workers still closing: ' + numRunningWorkers
    )
  }
}
