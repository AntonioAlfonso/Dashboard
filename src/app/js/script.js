setTimeout(function() {
  var speed        = document.getElementById('path4814-3-5-5-6'),
      battery      = document.getElementById('path5209'),
      speedText    = document.getElementById('tspan6417');

  var drsLight     = document.getElementById('path4487-3-56-0'),
      rollBarLight = document.getElementById('path4493-3-6-2'),
      glvLight     = document.getElementById('path4487-3-5-5-9');

  var oldState  = {
    accelerator : 0,
    brake       : 0,
    speed       : 0
  }

  var socket = io('http://127.0.0.1:8127/');

  socket.on('state', function(data) {
    console.log(data);
    animationAccelerator(data.accelerator);
  });
  socket.on('alert', function(data) {
    console.log(data)
    drs(data.drs);
    rollBar(data.rollBar);
    glv(data.glv);
  });

  function animationAccelerator(accelerator) {
    let speed2Graph = -map(accelerator, 0, 535, -364, 0),
        speed2Text  = parseInt(map(accelerator, 0, 535, 0, 130));

    speed.style.strokeDashoffset = speed2Graph;
    speedText.innerHTML          = speed2Text;
    if (speed2Text <= 80) {
      speed.style.stroke = '#0f0';
    } else if (speed2Text > 80 && speed2Text <= 115) {
      speed.style.stroke = '#ff0';
    } else {
      speed.style.stroke = '#f00';
    }
  }

  function animationBrake(brake) {
    var speedDisplay = speed.style.strokeDashoffset
    while(speedDisplay > 1) {
      speed.style.strokeDashoffset = speedDisplay--;
    }
  }
  function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  function drs(state) {
    if (state) {
      drsLight.style.fill = '#f00';
    } else {
      drsLight.style.fill = '#393939'
    }
  }
  function rollBar(state) {
    if (state) {
      rollBarLight.style.fill = '#0f0';
    } else {
      rollBarLight.style.fill = '#393939';
    }
  }
  function glv(state) {
    if (state) {
      glvLight.style.fill = '#ff0';
    } else {
      glvLight.style.fill = '#393939';
    }
  }
}, 7000);

function speedOut(accelerator, out) {
  return ((0.09048 * (out)) + (0.09516 * accelerator))
}
state.speed = speedOut(state.in, state.out);
state.in = data.accelerator;
state.out = state.speed;

speed.style.strokeDashoffset = -map(state.out, 0, 800, -364, 0);
speedText.innerHTML = parseInt(map(state.out, 0, 800, 0, 130));
