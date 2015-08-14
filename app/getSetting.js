'use strict';

var jsonfile = require('jsonfile'),
    util = require('util'),
    ipc = require('ipc');


var file = 'config.json';

var GetSetting = (function () {

  ipc.on('startup', function(event, arg){
    jsonfile.readFile(file, function(err, obj) {
      console.dir(obj);
      event.sender.send('readsetting', obj);
    });
  });
})();

module.exports = GetSetting;



