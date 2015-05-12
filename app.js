/**
 * A sample app for taking code from the serial port and sending it to a designated Meteor app. We assume that
 * the USB port name is `/dev/tty.usbmodem1411`, that the Meteor app is running locally with default sensors, and
 * it has a Meteor method called `insertData`
 */

'use strict';

(function() {
	var DDP = require('ddp');
	// Create our DDP client. If we don't pass any config details through here then the module
	// just uses the default Meteor app connection details
	var ddpClient = new DDP();
	var SerialPort = require('serialport').SerialPort;

	// Listen to all serial data that comes from the set USB port. The actual value here will vary
	// from machine to machine. We're also making the assumption that the attached Arduino has it's
	// baud rate set to 9600 and that the data delimiter is the new line character
	var serialPort = new SerialPort('/dev/tty.usbmodem1411', {
			baudrate: 9600,
			parser: serialPort.parsers.readline('\n')
	});

	// Connect to our Meteor app
	ddpClient.connect(function() {
			// Listen for any incoming data
			serialPort.on('data', function(data){
					console.log('calling with ' + data.trim());

					// Call the `insertData` method on the Meteor app. We aren't dealing with any failures etc here
					ddpClient.call('insertData', [{
							temp: data.trim()
					}], function() {}, function() {});
			});
	});
})();
