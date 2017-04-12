var http = require('http').createServer(handler); // WebServer
var io = require('socket.io')(http); // Comunication with WebServer
var fs = require('fs'); // Write/Read all files
var arduino = require('firmata'); // Comunication with Arduino
// Our libraries
var util = require('./util');
// Listen on 127.0.0.1:8127
http.listen(8127, '127.0.0.1');
// Handler for website
function handler(req, res) {
    // If '.' then redirect to the main page
    var reqFilePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    fs.readFile("app/" + reqFilePath, function (error, data) {
        if (error) {
            res.writeHead(500);
            res.end("Error loading '" + reqFilePath + "'");
            console.error(error);
            return;
        }
        res.writeHead(200, { 'Content-Type': util.getMimeType(reqFilePath) });
        res.end(data);
    });
}
// Variable of state pin
var state = {
    accelerator: 0,
    brake: 0,
    drs: false,
    rollBar: false,
    glv: false,
    // Bind a listener to the Change Event
    onChange: function (handler, namespace) {
        state.onChange.handlers.push(handler);
    },
    // Trigger the Change Event. Call it when you change the state
    triggerChange: function () {
        var channel = 'state'; // default channel
        var toCheck = [
            'accelerator',
            'brake',
            'drs',
            'rollBar',
            'glv'
        ];
        toCheck.forEach(function (prop) {
            if (state[prop] !== state.triggerChange.oldState[prop]) {
                console.log(prop + " --> " + state[prop]);
                // Update
                state.triggerChange.oldState[prop] = state[prop];
                if (prop === 'accelerator' || prop === 'brake') {
                    channel = 'state';
                }
                else {
                    channel = 'alert';
                }
            }
        });
        state.onChange.handlers.forEach(function (handler) {
            handler(state, channel);
        });
    }
};
state.onChange.handlers = [];
state.triggerChange.oldState = {};
// Handler for Socket
io.on('connection', function (socket) {
    state.onChange(function (newState, channel) {
        var mess = {
            state: function () {
                io.emit('state', {
                    'accelerator': newState.accelerator,
                    'brake': newState.brake
                });
            },
            alert: function () {
                io.emit('alert', {
                    'drs': newState.drs,
                    'rollBar': newState.rollBar,
                    'glv': newState.glv
                });
            }
        };
        // Send the data
        mess[channel]();
    });
});
// Test the Frontend part without an Arduino
var testOutput = false;
if (testOutput) {
    var i_1 = 0;
    var int = setInterval(function () {
        i_1++;
        // state.accelerator = Math.random() * 1023 | 0;
        state.accelerator = (i_1 * 10) % 770;
        state.triggerChange();
    }, 1000);
}
// Handler for Arduino
arduino.requestPort(function (error, port) {
    // If there's an error, interrupt all
    if (error) {
        console.error(error);
        return;
    }
    // Mapping of pins
    var pin = {
        accelerator: 0,
        brake: 1,
        drs: 3,
        rollBar: 4,
        glv: 5 // Digital
    };
    // Request serial port name
    var board = new arduino(port.comName, { samplingInterval: 50 });
    board.on('ready', function () {
        // Setup
        board.pinMode(pin.accelerator, board.MODES.INPUT);
        board.pinMode(pin.brake, board.MODES.INPUT);
        board.pinMode(pin.drs, board.MODES.INPUT);
        board.pinMode(pin.rollBar, board.MODES.INPUT);
        board.pinMode(pin.glv, board.MODES.INPUT);
        // Loop
        board.analogRead(pin.accelerator, function (value) {
            state.accelerator = value;
            state.triggerChange();
        });
        board.analogRead(pin.brake, function (value) {
            state.brake = value;
            state.triggerChange();
        });
        board.digitalRead(pin.drs, function (value) {
            state.drs = (value === board.HIGH);
            state.triggerChange();
        });
        board.digitalRead(pin.rollBar, function (value) {
            state.rollBar = (value === board.HIGH);
            state.triggerChange();
        });
        board.digitalRead(pin.glv, function (value) {
            state.glv = (value === board.HIGH);
            state.triggerChange();
        });
    });
});
