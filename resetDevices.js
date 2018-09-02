var fs = require("fs");
const oldDevices = require('./devices.json');
var status = {};
var json;
//Turn all the devices off
/*for (deviceNumber in oldDevices.devices){
    var currentDevice = oldDevices.devices[deviceNumber];
    kaku.transmit(oldDevices[currentDevice].address, oldDevices[currentDevice].device, false);
}*/

//Add all the devices to the status.json
fs.readFile( __dirname + "/" + "devices.json", 'utf8', function (err, data) {
      var devicesFile = JSON.parse( data );
      var devices = devicesFile.devices;
      for (i in devices) {
        status[devices[i]] = "off";
      }
      json = JSON.stringify(status);
      console.log(json);
      fs.writeFile('status.json', json, 'utf8');
});

console.log("status updated");
