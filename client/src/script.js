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

sendJSON = (message) => (data) => {
  if (data && !message.data) {
    message.data = data;
  }

  ws.send(JSON.stringify(message));
};

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
  }
};
