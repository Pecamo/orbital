// BACKGROUND
for (var s = 0; s < 10; s++) {
  var strip = document.createElement("div");
  strip.classList.add("strip");

  for (var l = 0; l < 30; l++) {
    var led = document.createElement("div");
    led.classList.add("led");
    strip.appendChild(led);
  }

  document.querySelector("#allBackground").appendChild(strip);
}
// ---

spectateLastData = null;

sendJSON = (message) => (data) => {
  if (data && !message.data) {
    message.data = data;
  }

  ws.send(JSON.stringify(message));
};

onSpectate = sendJSON({ cmd: "spectate" });
onQueryGameOptions = sendJSON({ cmd: "queryGameOptions" });
onWriteGameOptions = sendJSON({ cmd: "writeGameOptions" });

function changeThemeColor(color) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", color);
}

changeBaseColorFG = (color) => {
  document.documentElement.style.setProperty("--base-color-fg", color);
};
changeBaseColorBG = (color) => {
  document.documentElement.style.setProperty("--base-color-bg", color);
  changeThemeColor(color);
};

onSpectateRelease = () => {
  activateScene("spectate");
  onSpectate();
};

onChangeOptionsRelease = () => {
  document.querySelector("#changeOptionsButton").setAttribute("disabled", true);
  onQueryGameOptions();
};

onChangeOptionsDisappear = () => {
  document.querySelector("#changeOptionsButton").removeAttribute("disabled");
};

onChangeOptionsValidate = () => {
  onWriteGameOptions(gameOptions);
  onChangeOptionsDisappear();
  activateScene("welcome");
};

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  var canvas = document.getElementById("spectateCanvas");
  var min = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = min;
  canvas.height = min;

  spectateData();
}
resizeCanvas();

baseGray = "#777777";
waitTime = 60;

onRecieve = (message) => {
  var json = JSON.parse(message);
  if (!json.cmd) {
    console.error("Invalid message recieved");
    return;
  }
  joinPressed = false;
  switch (json.cmd) {


    case "readGameOptions": {
      json.data;
      gameOptions = json.data;
      document.querySelector("#gameOptionsScene").innerHTML =
        gameOptionsToForm();
      activateScene("changeGameOptions");
      break;
    }

    case "spectateData": {
      spectateLastData = json.data;
      spectateData();
      break;
    }
  }
};

spectateData = () => {
  var data = spectateLastData;
  if (data === null) {
    return;
  }
  var result = Array(data.stageSize).fill(null);

  if (data.battleRoyale) {
    const warnColor = { r: 100, g: 0, b: 0, w: 0 };
    data.battleRoyale.warnLines.forEach((line) => {
      if (line._isLooping) {
        for (let i = line._from; i <= data.stageSize; i++) {
          result[i] = warnColor;
        }
        for (let i = 0; i <= line._to; i++) {
          result[i] = warnColor;
        }
      } else {
        for (let i = line._from; i <= line._to; i++) {
          result[i] = warnColor;
        }
      }
    });

    const deathColor = { r: 255, g: 0, b: 0, w: 0 };
    data.battleRoyale.deathLines.forEach((line) => {
      if (line._isLooping) {
        for (let i = line._from; i <= data.stageSize; i++) {
          result[i] = deathColor;
        }
        for (let i = 0; i <= line._to; i++) {
          result[i] = deathColor;
        }
      } else {
        for (let i = line._from; i <= line._to; i++) {
          result[i] = deathColor;
        }
      }
    });
  }

  data.characters
    .filter((c) => c.alive)
    .forEach((p) => {
      result[p.x] = p.color;
    });
  data.shots.forEach((s) => {
    var pColor = data.characters[s.owner].color;
    result[s.x] = {
      r: pColor.r / 1.5,
      g: pColor.g / 1.5,
      b: pColor.b / 1.5,
    };
  });
  var node = document.createElement("div");
  node.classList.add("s-strip");

  var canvas = document.getElementById("spectateCanvas");
  var radius = Math.min(canvas.height, canvas.width) / 2;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var one = (Math.PI * 2) / data.stageSize;
  result.forEach((c, i) => {
    ctx.beginPath();
    var from = i * one;
    var to = (i + 1) * one;
    ctx.arc(radius, radius, radius - 25, from, to);
    ctx.arc(radius, radius, radius - 5, to, from, true);
    ctx.closePath();
    ctx.stroke();
    if (c !== null) {
      ctx.fillStyle = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
      ctx.fill();
    }
  });
  document.querySelector("#spectateResult").innerHTML = "";
  document.querySelector("#spectateResult").appendChild(node);
};