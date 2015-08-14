'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var chokidar = require('chokidar');
var GetSetting = require('./getSetting');
var Watcher = require('./watcher');
var Tray = require('tray');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: 'app/icons/google-icon-monitoring.png'
  });

  win.loadUrl(`file://${__dirname}/html/task.html`);
  win.on('closed', onClosed);

  return win;
}

function onClosed() {
  // deref the window
  // for multiple windows store them in an array
  mainWindow = null;
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
  //GetSetting.start();

  // var ipc = require('ipc');
  // var dialog = require('dialog');

  // ipc.on('web-browse', function(event, arg) {
  //   var path = dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
  //   console.log(arg);  // prints "ping"
  //   event.sender.send('rtn-browse', path);
  //   Watcher.start(path);
  // });

});
