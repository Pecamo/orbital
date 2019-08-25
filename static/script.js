for (var s = 0; s < 10; s++) {
  var strip = document.createElement('div');
  strip.classList.add('strip');
  for (var l = 0; l < 30; l++) {
    var led = document.createElement('div');
    led.classList.add('led');
    strip.appendChild(led);
  }
  document.querySelector('#allBackground').appendChild(strip);
}


state = {
  activeScene: 'welcome'
};

function changeThemeColor(color) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", color);
}

changeBaseColorFG = (color) => {
  document.documentElement.style.setProperty('--base-color-fg', color);
};
changeBaseColorBG = (color) => {
  document.documentElement.style.setProperty('--base-color-bg', color);
  changeThemeColor(color);
};

onJoinRelease = () => {
  document.querySelector('#joinButton').setAttribute('disabled', true);
  onJoin();
};

onJoinDisappear = () => {
  document.querySelector('#joinButton').removeAttribute('disabled');
};

onHowRelease = () => {
  activateScene('how');
};

onSpectateRelease = () => {
  activateScene('spectate');
  onSpectate();
};

activateScene = (scene) => {
  onJoinDisappear();
  if (!['welcome', 'how', 'spectate', 'wait', 'getReady', 'play', 'won', 'lost', 'gameInProgress']
    .includes(scene)) {
    console.error("This scene doesn't exist");
    return;
  }
  if (scene === 'lost' || scene === 'won') {
    if ("vibrate" in window.navigator)
    {
      navigator.vibrate(200);
    }
  }
  if (scene === 'welcome') {
    changeBaseColorBG(baseGray);
  }
  state.activeScene = scene;
  document
    .querySelectorAll('.scene')
    .forEach(e => e.classList.remove('active'));
  document
    .querySelector('#' + scene).classList.add('active');
};

spectateData = (data) => {
  var result = Array(data.stageSize).fill(null);
  data.characters.filter(c => c.alive).forEach(p => {
    result[p.x] = p.color;
  });
  data.shots.forEach(s => {
    var pColor = data.characters[s.owner].color;
    result[s.x] = {
      r: pColor.r / 1.5,
      g: pColor.g / 1.5,
      b: pColor.b / 1.5
    };
  });
  var node = document.createElement('div');
  node.classList.add('s-strip');
  result.forEach((c, i) => {
    var led = document.createElement('div');
    var ledLight = document.createElement('div');
    led.classList.add('s-led');
    ledLight.classList.add('light');
    var degRotate = i * 360 / data.stageSize;
    led.style = "transform: rotate(" + degRotate + "deg)";
    if (c !== null) {
      ledLight.style = 'background-color: rgb(' + c.r + ", " + c.g + ", " + c.b + ");";
    }
    led.appendChild(ledLight);
    node.appendChild(led);
  });
  document.querySelector('#spectateResult').innerHTML = '';
  document.querySelector('#spectateResult').appendChild(node);
};

dataToString = (data) => {
  let world = '';

  for (let x = 0; x < data.stageSize; x++) {
    let char = '_';
    for (let playerId in data.players) {
      const player = data.players[playerId];
      if (player.x === x && player.alive) {
        char = '' + playerId;
      }
    }
    for (let shotId in data.shots) {
      const shot = data.shots[shotId];
      if (shot.x === x) {
        char = shot.facesRight ? '⯈' : '⯇';
      }
      if (shot.x === this.move(x, 1) && shot.facesRight) {
        char = '⬩'
      }
      if (shot.x === this.move(x, -1) && !shot.facesRight) {
        char = '⬩'
      }
    }
    world += char;
  }
  return world;
};

baseGray = '#777777';
waitTime = 60;

ws = new WebSocket("ws://" + location.host + "/");

sendJSON = (message) => () => {
  ws.send(JSON.stringify(message));
};

onJoin = sendJSON({cmd: 'join'});
onSpectate = sendJSON({cmd: 'spectate'});
onLeftPress = sendJSON({cmd: 'press', data: 'left'});
onLeftRelease = sendJSON({cmd: 'release', data: 'left'});
onRightPress = sendJSON({cmd: 'press', data: 'right'});
onRightRelease = sendJSON({cmd: 'release', data: 'right'});
onFirePress = sendJSON({cmd: 'press', data: 'fire'});
onFireRelease = sendJSON({cmd: 'release', data: 'fire'});

var leftDown = (e) => {
  return onLeftPress(e);
};
var rightDown = (e) => {
  return onRightPress(e);
};
var fireDown = (e) => {
  return onFirePress(e);
};

var leftUp = (e) => {
  e.target.blur();
  return onLeftRelease(e);
};
var rightUp = (e) => {
  e.target.blur();
  return onRightRelease(e);
};
var fireUp = (e) => {
  e.target.blur();
  return onFireRelease(e);
};
document.querySelector('#leftButton').addEventListener("mousedown", leftDown);
document.querySelector('#leftButton').addEventListener("touchstart", leftDown);

document.querySelector('#fireButton').addEventListener("mousedown", fireDown);
document.querySelector('#fireButton').addEventListener("touchstart", fireDown);

document.querySelector('#rightButton').addEventListener("mousedown", rightDown);
document.querySelector('#rightButton').addEventListener("touchstart", rightDown);


document.querySelector('#leftButton').addEventListener("mouseup", leftUp);
document.querySelector('#leftButton').addEventListener("touchend", leftUp);

document.querySelector('#fireButton').addEventListener("mouseup", fireUp);
document.querySelector('#fireButton').addEventListener("touchend", fireUp);

document.querySelector('#rightButton').addEventListener("mouseup", rightUp);
document.querySelector('#rightButton').addEventListener("touchend", rightUp);


setWaitTime = (newTime) => {
  waitTime = newTime;
  document.querySelector('#startsIn').innerHTML = newTime;
};

var bindings = {
  'ArrowLeft': [onLeftPress, onLeftRelease],
  'a': [onLeftPress, onLeftRelease],

  'ArrowRight': [onRightPress, onRightRelease],
  'd': [onRightPress, onRightRelease],

  ' ': [onFirePress, onFireRelease],
  'Control': [onFirePress, onFireRelease],
  'Shift': [onFirePress, onFireRelease],
  'Alt': [onFirePress, onFireRelease],
  'y': [onFirePress, onFireRelease],
};

onKeyDown = (e) => {
  if (state.activeScene !== 'play') {
    return;
  }
  if (e.key in bindings) {
    bindings[e.key][0]();
  }
};

onKeyUp = (e) => {
  if (state.activeScene !== 'play') {
    return;
  }
  if (e.key in bindings) {
    bindings[e.key][1]();
  }
};


document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

onRecieve = (message) => {
  var json = JSON.parse(message);
  if (!json.cmd) {
    console.error("Invalid message recieved");
    return;
  }
  joinPressed = false;
  switch (json.cmd) {
    case 'welcome': {
      activateScene('welcome');
      changeBaseColorBG(baseGray);
      break;
    }

    case 'wait': {
      activateScene('wait');
      break;
    }

    case 'getReady': {
      activateScene('getReady');
      setWaitTime(json.data);
      changeBaseColorBG(json.color);
      break;
    }

    case 'play': {
      activateScene('play');
      changeBaseColorBG(json.color);
      break;
    }

    case 'won': {
      activateScene('won');
      break;
    }

    case 'lost': {
      activateScene('lost');
      break;
    }

    case 'gameInProgress': {
      activateScene('gameInProgress');
      break;
    }

    case 'spectateData': {
      spectateData(json.data);
      break;
    }
  }
};

ws.onmessage = (evt) => {
  onRecieve(evt.data);
};

var protectator = '<a href="https://twitter.com/Protectator">Protectator</a>';
var binary_brain = '<a href="https://twitter.com/Binary_Brain">Binary Brain</a>';
document.querySelector('.names').innerHTML =
  [[protectator, binary_brain], [binary_brain, protectator]][Math.floor(Math.random() * 2)].join(' and ');
