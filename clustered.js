var cluster = require('cluster')

module.exports = function (clusterFn, opts) {
  if (!opts) opts = {}
  var i
    , options =
    { size: opts.size || 2 // Default to the number of CPUs
    , logger: opts.logger || console
    }

  // Cluster is used in all but the development environment
  if ((process.env.NODE_ENV !== undefined) && (cluster.isMaster)) {

    options.logger.info('Forking ' + options.size + ' cluster process(es)')

    // Create one instance of the app (i.e. one process) per CPU
    for (i = 0; i < options.size; i += 1) {
      cluster.fork()
    }

    // Report child process death
    cluster.on('exit', function (worker) {
      forkNewProcess(worker, worker.process)
    })

  } else {
    options.logger.info('Running in PID ' + process.pid)
    clusterFn()
  }

  function forkNewProcess (worker, process) {
    options.logger.error('Worker ' + process.pid + ' died', worker)

    if (process.signalCode === null) {
      cluster.fork()
    } else {
      options.logger.error('Not forking new process because ' + process.signalCode + ' was given')
    }
  }
}
