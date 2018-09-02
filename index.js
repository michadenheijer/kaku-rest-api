var express = require('express');
var app = express();
var fs = require("fs");

const deviceData = require('./devices.json');
const KlikAanKlikUit = require('kaku-rpi');

let kaku = KlikAanKlikUit();

app.get('/status', function (req, res) {
   fs.readFile( __dirname + "/" + "status.json", 'utf8', function (err, data) {
     var statusData = JSON.parse( data );
     console.log(statusData);
     res.end( JSON.stringify(statusData) );
   });
})

//Get the device status
app.get('/:device', function (req, res) {
   fs.readFile( __dirname + "/" + "status.json", 'utf8', function (err, data) {
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
   fs.readFile( __dirname + "/" + "status.json", 'utf8', function (err, data) {

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
   fs.readFile( __dirname + "/" + "status.json", 'utf8', function (err, data) {

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
  fs.readFile( __dirname + "/" + "status.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data);
  });
})

var server = app.listen(8081, 'localhost', function () {

  var host = server.address().address
  var port = server.address().port

  console.log("KaKu REST-api listening at http://%s:%s", host, port)

})
