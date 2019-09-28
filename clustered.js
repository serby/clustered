var cluster = require('cluster')

module.exports = function(clusterFn, opts) {
  if (!opts) opts = {}
  var i,
    options = {
      size: opts.size || 2, // Default to the number of CPUs
      logger: opts.logger || console
    }

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
    // Report child process death
    cluster.on('exit', function(worker) {
      forkNewProcess(worker, worker.process)
    })
  } else {
    options.logger.info('Forked ' + process.pid)
    clusterFn()
  }

  function forkNewProcess(worker, process) {
    options.logger.warn(
      'Worker ' +
        process.pid +
        ' died' +
        (process.exitCode ? ' ' + process.exitCode : '') +
        (process.signalCode ? ' ' + process.signalCode : '')
    )
  }
}
