const fs = require("fs");
var userHome = require('user-home');
var dir = userHome + '/.kaku-rest';
var status = {};
var json;

//Add all the devices to the status.json
fs.readFile( dir + '/devices.json' , 'utf8', function (err, data) {
      var devicesFile = JSON.parse( data );
      var devices = devicesFile.devices;
      for (i in devices) {
        status[devices[i]] = "off";
      }
      json = JSON.stringify(status);
      console.log(json);
      fs.writeFile( dir + "/" + 'status.json', json, 'utf8');
});

console.log("status updated");
