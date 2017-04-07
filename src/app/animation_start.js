setTimeout(() => {
  var border       = document.getElementById('path210-3-3'),
      borderLight  = document.getElementById('path4569'),
      speedText    = document.getElementById('tspan6417'),
      speed        = document.getElementById('path4814-3-5-5-6'),
      battery      = document.getElementById('path5209'),
      speedBack    = document.getElementById('layer1'),
      display      = document.getElementById('layer5'),
      batteryBack  = document.getElementById('layer6'),
      background   = document.getElementById('layer12'),
      light        = document.getElementById('layer16'),
      drsLight     = document.getElementById('path4487-3-56-0'),
      rollBarLight = document.getElementById('path4493-3-6-2'),
      glvLight     = document.getElementById('path4487-3-5-5-9');

  border.style.animationName = 'start1';
  speedText.innerHTML = 0;

  setTimeout(() => {
    speedBack.style.animationName   = 'start-opacity';
    display.style.animationName     = 'start-opacity';
    batteryBack.style.animationName = 'start-opacity';
    background.style.animationName  = 'start-opacity';
    light.style.animationName       = 'start-opacity';
    borderLight.style.animationName = 'start-opacity';

    setTimeout(() => {
      speedBack.style.opacity   = 1;
      display.style.opacity     = 1;
      batteryBack.style.opacity = 1;
      background.style.opacity  = 1;
      light.style.opacity       = 1;
      borderLight.style.opacity = 1;

      setTimeout(() => {
        speed.style.animationName        = 'speed';
        battery.style.animationName      = 'battery';
        drsLight.style.animationName     = 'drs';
        rollBarLight.style.animationName = 'rollBar';
        glvLight.style.animationName     = 'glv';

        setTimeout(() => {
          speed.style.strokeDasharray     = '364';
          speed.style.strokeDashoffset    = '364';
          battery.style.strokeDasharray   = '94';
          battery.style.strokeDashoffset  = '0';
        }, 3000);
      }, 1000);
    }, 1000);
  }, 1500);
}, 50);
