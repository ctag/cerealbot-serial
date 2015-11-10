/**
 *  Gateway for cerealbox-serial
 *  Christopher Bero
 *  csb0019@uah.edu
 */

// Requests
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var util = require("util");
var stdin = process.openStdin();

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);


function sendCommand(req, res) {
	//serial.open(function (error) {
		// if (error) {
		// 	console.log(">>> Error opening serial port: ", error);
		// 	request.respond(0);
		// 	return;
		// }
		var cmd = req.query.cmd;
		serial.write(cmd, function (error) {
			console.log("\n\r\n\r[SendCommand] Wrote to serial: ", cmd);
			// if (serial.isOpen()) {
			// 	serial.close();
			// }
			res.sendStatus(1);
		});
	//});
}

function sendCommandResp(req, res) {
	//serial.open(function (error) {
		// if (error) {
		// 	console.log(">>> Error opening serial port: ", error);
		// 	return;
		// }
		// If the serial doesn't return anything in 0.5s, give up
		// serialTimeout = setTimeout(function () {
		// 	if (serial.isOpen()) {
		// 		serial.close();
		// 		console.log("timeout reached, cancelling and closing port.");
		// 	}
		// 	request.respond(-1);
		// }, 100);
		var cmd = req.query.cmd;
		serial.write(cmd, function (error) {
			console.log("\n\r\n\r[sendComandResp] Wrote to serial: ", cmd);
			console.log("Waiting for reply.");
			// If data is returned, then hand back the data and exit.
			serial.on('data', function handleData (data) {
				//clearTimeout(serialTimeout);
				console.log("Received response: ", data);
				res.write(data);
				res.close();
				latestData = data;
				// if (serial.isOpen()) {
				// 	serial.close();
				// 	console.log("Success, it seems, closing port.");
				// }
				serial.removeListener('data', handleData);
			});
		}); // end serial.write
	//}); // end serial.open
}


stdin.addListener("data", function(d) {
	console.log("entered: " + d.toString());
});

app.get('/serialCmdResp', sendCommandResp);
app.get('/serialCmd', sendCommand);

//console.log("Serial: ", process.env.npm_package_config_dev);

//var serial = new SerialPort(process.env.npm_package_config_dev, {
var serial = new SerialPort("/dev/ttyAMA0", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
}/*, false */);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
