// these are all DomElements reference
var border;
var borderLight;
var speedText;
var speed;
var battery;
var speedBack;
var display;
var batteryBack;
var background;
var light;
var drsLight;
var rollBarLight;
var glvLight;
// group of DomElements that need to be Animated
var toAnimOpacity;
var toAnim1;
// to delay one Timeout from another with an amount shown next to the "totDelay +=".
var totDelay = 0;
// initialize variables and status
setTimeout(function () {
    function get(id) {
        return document.getElementById(id);
    }
    // Set DomElement reference
    var border = get('path210-3-3'), borderLight = get('path4569'), speedText = get('tspan6417'), speed = get('path4814-3-5-5-6'), battery = get('path5209'), speedBack = get('layer1'), display = get('layer5'), batteryBack = get('layer6'), background = get('layer12'), light = get('layer16'), drsLight = get('path4487-3-56-0'), rollBarLight = get('path4493-3-6-2'), glvLight = get('path4487-3-5-5-9');
    toAnimOpacity = [speedBack, display, batteryBack, background, light, borderLight];
    // The second element of the inner Array is the Css Animation name
    toAnim1 = [
        [speed, 'speed'],
        [battery, 'battery'],
        [drsLight, 'drs'],
        [rollBarLight, 'rollBar'],
        [glvLight, 'glv']
    ];
    border.style.animationName = 'start1';
    speedText.innerHTML = '0';
}, totDelay += 50);
// Set an animation to the "toAnimOpacity" group
setTimeout(function () {
    toAnimOpacity.forEach(function (el) { el.style.animationName = 'start-opacity'; });
}, totDelay += 1500);
// Set Opacity to the "toAnimOpacity" group
setTimeout(function () {
    toAnimOpacity.forEach(function (el) { el.style.opacity = '1'; });
}, totDelay += 1000);
// Set animation
setTimeout(function () {
    toAnim1.forEach(function (t) { t[0].style.animationName = t[1]; });
}, totDelay += 1000);
setTimeout(function () {
    console.log(speed);
    speed.style.strokeDasharray = '364';
    speed.style.strokeDashoffset = '364';
    battery.style.strokeDasharray = '94';
    battery.style.strokeDashoffset = '0';
}, totDelay += 3000);
