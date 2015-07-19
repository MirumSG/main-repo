'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var chokidar = require('chokidar');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: false
	});

	win.loadUrl(`file://${__dirname}/html/index.html`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}


function startWatch(path) {
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
    // More events.
    .on('addDir', function(path) { log('Directory', path, 'has been added'); })
    .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
    .on('error', function(error) { log('Error happened', error); })
    .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
    .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })

  // 'add', 'addDir' and 'change' events also receive stat() results as second
  // argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
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
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();

  var ipc = require('ipc');
  var dialog = require('dialog');

  ipc.on('web-browse', function(event, arg) {
    var path = dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
    console.log(arg);  // prints "ping"
    event.sender.send('rtn-browse', path);
    startWatch(path);
  });

});
