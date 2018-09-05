var userHome = require('user-home');
const express = require('express');
const app = express();
const fs = require("fs");
const KlikAanKlikUit = require('kaku-rpi');
let kaku = KlikAanKlikUit();
var dir = userHome + '/.kaku-rest';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, 0744);
    fs.createReadStream('devices.example.json').pipe(fs.createWriteStream(dir + '/devices.example.json'));
    console.log('Just created the setup dir, go to: ' + dir +' and create a devices.json file. For inspiration look at the example file');
    return;
} else if (!fs.existsSync(dir + "/" + "devices.json")){
    console.error("You have not yet setup a devices.json file, create one and try again...");
    return;
} else {
  var deviceData = require(dir + '/devices.json')
}


if (fs.existsSync(dir + "/" + "status.json")) {
    console.log("old status file found");
} else {
    console.log("no status is found, creating a new one");
    var loadStatus = require ("./resetDevices.js");
}

app.get('/status', function (req, res) {
   fs.readFile( dir + "/" + "status.json", 'utf8', function (err, data) {
     var statusData = JSON.parse( data );
     console.log(statusData);
     res.end( JSON.stringify(statusData) );
   });
})

//Get the device status
app.get('/:device', function (req, res) {
   fs.readFile( dir + "/" + "status.json", 'utf8', function (err, data) {
     var statusData = JSON.parse( data );
     var sendData = {};
     if (statusData[req.params.device]){
       sendData["status"] = statusData[req.params.device];
     } else {
       //If the device doesn't exist
       res.status(404)
          .send("This device doesn't exist");
     }
     console.log( sendData );
     res.end( JSON.stringify(sendData) );
   });
})


//Turn device on
app.post('/:device/on', function (req, res) {
   // First read existing users.
   fs.readFile( dir + "/" + "status.json", 'utf8', function (err, data) {

       var sendData = {};
       statusData = JSON.parse( data );
       if (statusData[req.params.device]){
         //turn device on
         for (deviceNumber in deviceData.devices){
           if (req.params.device == deviceData.devices[deviceNumber]){
               var currentDevice = deviceData.devices[deviceNumber];
               kaku.transmit(deviceData[currentDevice].address, deviceData[currentDevice].device, true);
           }
         }
         //save in database
         statusData[req.params.device] = "on";
         fs.writeFile('status.json', JSON.stringify(statusData), 'utf8');
         sendData["status"] = statusData[req.params.device];
       } else {
         //If the device doesn't exist
         res.status(404)
            .send("This device doesn't exist");
       }
       console.log( statusData );
       res.end( JSON.stringify(sendData));
   });
})

//Turn device on
app.post('/:device/off', function (req, res) {
   // First read existing users.
   fs.readFile( dir + "/" + "status.json", 'utf8', function (err, data) {

       var sendData = {};
       statusData = JSON.parse( data );
       if (statusData[req.params.device]){
         for (deviceNumber in deviceData.devices){
           if (req.params.device == deviceData.devices[deviceNumber]){
               var currentDevice = deviceData.devices[deviceNumber];
               kaku.transmit(deviceData[currentDevice].address, deviceData[currentDevice].device, false);
           }
         }
         statusData[req.params.device] = "off";
         fs.writeFile('status.json', JSON.stringify(statusData), 'utf8');
         sendData["status"] = statusData[req.params.device];
       } else {
         //If the device doesn't exist
         res.status(404)
            .send("This device doesn't exist");
       }
       console.log( statusData );
       res.end( JSON.stringify(sendData));
   });
})

app.post('/reset', function (req, res){
  var reset = require ('./resetDevices');
  fs.readFile( dir + "/" + "status.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data);
  });
})

var server = app.listen(8081, 'localhost', function () {

  var host = server.address().address
  var port = server.address().port

  console.log("KaKu REST-api listening at http://%s:%s", host, port)

})
