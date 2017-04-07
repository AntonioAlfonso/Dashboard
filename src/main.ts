const http    = require('http').createServer(handler);  // WebServer
const io      = require('socket.io')(http);             // Comunication with WebServer
const fs      = require('fs');                          // Write/Read all files
const arduino = require('firmata');                     // Comunication with Arduino

// Our libraries
const util    = require('./util');

// Listen on 127.0.0.1:8127
http.listen(8127, '127.0.0.1');

// Handler for website
function handler(req, res) {

  // If '.' then redirect to the main page
  let reqFilePath = '.' + (req.url === '/'? '/index.html': req.url);

  fs.readFile(`app/${reqFilePath}`, (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end(`Error loading '${reqFilePath}'`);
      console.error(error);
      return;
    }

    res.writeHead(200, {'Content-Type' : util.getMimeType(reqFilePath)});
    res.end(data);
  });
}

interface State {
  accelerator   : number;
  brake         : number;
  drs           : boolean;
  rollBar       : boolean;
  glv           : boolean;
  onChange     ?: any;
  triggerChange?: any;
}

interface StateChangeHandler {
  (state: State): void;
}

// Variable of state pin
var state: State = {
  accelerator  : 0,
  brake        : 0,
  drs          : false,
  rollBar      : false,
  glv          : false,
  // Bind a listener to the Change Event
  onChange     : (handler: StateChangeHandler) => {
    state.onChange.handlers.push(handler);
  },
  // Trigger the Change Event. Call it when you change the state
  triggerChange: () => {
    let toCheck: string[] = [
      'accelerator',
      'brake',
      'power',
      'drs',
      'rollBar',
      'glv'
    ];

    toCheck.forEach((prop) => {
      if (state[prop] !== state.triggerChange.oldState[prop]) {
        // console.log(`${prop} --> ${state[prop]}`);
        //Update
        state.triggerChange.oldState[prop] = state[prop];
      }
    });
    state.onChange.handlers.forEach((handler: StateChangeHandler) => {
      handler(state);
    });
  }
};
state.onChange.handlers      = [];
state.triggerChange.oldState = {};

// Handler for Socket
io.on('connection', (socket) => {

  state.onChange((newState) => {
    socket.emit('state', {
      'accelerator' : newState.accelerator,
      'brake'       : newState.brake,
      'drs'         : newState.drs,
      'rollBar'     : newState.rollBar,
      'glv'         : newState.glv
    });
  });

});



// Test the Frontend part without an Arduino
var testOutput: boolean = false;
if (testOutput) {
  let i = 0;
  let int = setInterval(() => {
    i++;
    // state.accelerator = Math.random() * 1023 | 0;
    state.accelerator = (i * 10) % 770;
    state.triggerChange();
  }, 1000);
}

// Handler for Arduino
arduino.requestPort((error, port) => {
  // If there's an error, interrupt all
  if (error) {
    console.error(error);
    return;
  }

  // Mapping of pins
  const pin = {
    accelerator : 0,  // Analog
    brake       : 1,  // Analog
    drs         : 3,  // Digital
    rollBar     : 4,  // Digital
    glv         : 5   // Digital
  }

  // Request serial port name
  let board = new arduino(port.comName, {samplingInterval : 50});

  board.on('ready', () => {
    //Setup
    board.pinMode(pin.accelerator, board.MODES.INPUT);
    board.pinMode(pin.brake,       board.MODES.INPUT);
    board.pinMode(pin.drs,         board.MODES.INPUT);
    board.pinMode(pin.rollBar,     board.MODES.INPUT);
    board.pinMode(pin.glv,         board.MODES.INPUT);

    board.analogRead(pin.accelerator, (value) => {
      state.accelerator = value;
      state.triggerChange();
    });

    board.analogRead(pin.brake, (value) => {
      state.brake = value;
      state.triggerChange();
    });

    board.digitalRead(pin.drs, (value) => {
      if (value == board.HIGH) {
        state.drs = true;
      } else {
        state.drs = false;
      }
      state.triggerChange();
    });

    board.digitalRead(pin.rollBar, (value) => {
      if (value == board.HIGH) {
        state.rollBar = true;
      } else {
        state.rollBar = false;
      }
      state.triggerChange();
    });

    board.digitalRead(pin.glv, (value) => {
      if (value == board.HIGH) {
        state.glv = true;
      } else {
        state.glv = false;
      }
      state.triggerChange();
    });

  });

});
