var program = require('commander');
var fs = require("fs");
var status = {};
var json;

program
    .option('-d, --device [path]', 'set a devicefile')
    .parse(process.argv);

if (program.device){
    console.log('devicefile at: ' + program.device);
} else {
    console.error("no devicefile defined");
    return;
}
//Add all the devices to the status.json
fs.readFile( program.device , 'utf8', function (err, data) {
      var devicesFile = JSON.parse( data );
      var devices = devicesFile.devices;
      for (i in devices) {
        status[devices[i]] = "off";
      }
      json = JSON.stringify(status);
      console.log(json);
      fs.writeFile(__dirname + "/" + 'status.json', json, 'utf8');
});

console.log("status updated");
