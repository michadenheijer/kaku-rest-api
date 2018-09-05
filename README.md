# kaku-rest
[![CircleCI](https://circleci.com/gh/michadenheijer/kaku-rest-api.svg?style=svg&circle-token=e06c27eac7c9cff5ba9283b447023246fe4f204e)](https://circleci.com/gh/michadenheijer/kaku-rest-api)

A REST-api for KlikAanKlikUit (CoCo) devices using NodeJS.

## Requirements
To use this API, you have to connected a generic 433-mhz transmitter to your Raspberry Pi (3). The data-port has to be connected to the physical pin 11.

## Installation
### Step 1: Download the project
#### Using npm
Downloading and installing using npm is the easiest installation method.
```
npm i kaku-rest
```
You can skip the from source method.
#### From source
```
git clone https://github.com/michadenheijer/kaku-rest-api.git
```
Go to the downloaded folder:
```
cd kaku-rest-api
```
Install the project:
```
sudo npm install -g
```
### Step 2: Locate the setup folder
First run the program, it will stop afer a few seconds, but it will create the needed files and folders.
```
kaku-rest
```
Then change to the setup folder
```
cd ~/.kaku-rest
```
Copy the device example
```
cp devices.example.json devices.json
```
Add your own devices, using the nano command:
```
nano devices.json
```
### Step 3: Add your devices
To add your devices change the ```devices.json``` file:
```
nano devices.json
```
You should see a file like this:
```
{
	"devices": ["light", "switch", "christmas-tree"],
	"light": {
		"address": 1592,
		"device": 2
	},
	"switch": {
		"address": 1593,
		"device": 3
	},
	"christmas-tree": {
		"address": 1594,
		"device": 4
	}

}
```
After ```"devices"``` there are your switches written down. The settings of your devices are below there. Every device is defined like this:
```
"light": {
  "address": 1592,
  "device": 2
}
```
First is the name, below the device address and below that the device id.
The device address is a number. If you know your device address you can fill it in (you can skip step 5), most often you don't so just fill in a number between ```1000``` and ```9000```.
The device id should ideally be a number that you won't use for the other devices.

Change the names, device addresses and id's and save the file using:
```
Ctrl^X
```
It'll ask to save and press ```y```. Followed by an ```enter```.
### Step 4: Learn your devices to respond
At this moment your devices do NOT yet respond to your commands. But you can teach them to do so. First, run the server using:
```
kaku-rest
```
Then unplug your switches and replug them, using an other terminal run (the learning fase is only in the first 6 seconds, so it might require some running):
```
curl -X POST http://localhost:8081/THE-DEVICENAME-YOU-JUST-UNPLUGGED/on
```
If it worked the switch will click 4 times and your device can be turned on using the previous command. If you want to turn your device off, use:
```
curl -X POST http://localhost:8081/THE-DEVICENAME/off
```
You can see the status of your devices using the command:
```
curl http://localhost:8081/status
```
This command uses a system that, saves the old commands, so it cannot see changes using an other remote.
To view the status of one device use
```
curl http://localhost:8081/THE-DEVICENAME
```
At this moment the rest-api is only accessible for the ```localhost```.
## Credits
Using the [kaku-rpi](https://github.com/robertklep/node-kaku-rpi) module from [Robert Klep](https://github.com/robertklep).
