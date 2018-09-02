'use strict';
const KlikAanKlikUit = require('kaku-rpi');
const devices = require('./devices.json');
const consoleInput = process.argv.slice(2);
var deviceNumber;
var exists;

let kaku = KlikAanKlikUit();

for (deviceNumber in devices.devices){
    var currentDevice = devices.devices[deviceNumber];
    if (currentDevice == consoleInput[0]){
    exists = true;
    }
}

if (exists != true){
console.error("This device doesn't exist");
return;
}

if (console[1] == "on"){
    kaku.transmit(devices[consoleInput[0]].address, devices[console[0]].device, true);
} else if (console[1] == "off"){
    kaku.transmit(devices[consoleInput[0]].address, devices[console[0]].device, false);
} else {
    console.error("Define if you want to turn the device on or off");
}
