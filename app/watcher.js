'use strict';
var chokidar = require('chokidar');

var Watcher = (function () {

  var start = function(path){
    // One-liner for current directory, ignores .dotfiles
    chokidar.watch(path, {ignored: /[\/\\]\./}).on('all', function(event, path) {
      console.log(event, path);
    });

    var watcher = chokidar.watch('file, dir, or glob', {
      persistent: true
    });

    var log = console.log.bind(console);

    watcher
      .on('add', function(path) { log('File', path, 'has been added'); })
      .on('change', function(path) { log('File', path, 'has been changed'); })
      .on('unlink', function(path) { log('File', path, 'has been removed'); })
      .on('error', function(error) { log('Error happened', error); })
      .on('ready', function() { log('Initial scan complete. Ready for changes.'); })

    watcher.on('change', function(path, stats) {
      if (stats) console.log('File', path, 'changed size to', stats.size);
    });


    // Full list of options. See below for descriptions.
    // chokidar.watch('file', {
    //   persistent: true,
    //
    //   ignored: '*.txt',
    //   ignoreInitial: false,
    //   followSymlinks: true,
    //   cwd: '.',
    //
    //   usePolling: true,
    //   alwaysStat: false,
    //   depth: undefined,
    //   interval: 100,
    //
    //   ignorePermissionErrors: false,
    //   atomic: true
    // });
  };

  return {
    start: start
  };


})();

module.exports = Watcher;
