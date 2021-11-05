// Color Picker
const colorPickers = document.querySelectorAll(".color-picker");
[].forEach.call(colorPickers, colorPicker => {
    colorPicker.addEventListener('input', () => {
        const colors = getColors();
        sendColors(colors);
    });
});

// Retrieve color data from HTML inputs
function getColors() {
    const colors = [];

    [].map.call(colorPickers, colorPicker => {
        const id = colorPicker.dataset.id;
        const hexColor = colorPicker.value;
        const color = {
            r: parseInt(hexColor.substring(1, 3), 16),
            g: parseInt(hexColor.substring(3, 5), 16),
            b: parseInt(hexColor.substring(5, 7), 16),
            w: 0,
        }

        colors[id] = color;
    });

    return colors;
}

// Send colors to the server
function sendColors(colors) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/lamp/colors", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(colors));
}

// Animation Picker
const animationPicker = document.getElementById("animation-picker");
animationPicker.addEventListener('change', () => {
    sendAnimnation({ animation: animationPicker.value });
});

// Send animation mode to the server
function sendAnimnation(animation) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/lamp/animation", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(animation));
}

const topLedNumberInput = document.querySelector(".top-led-number");
topLedNumberInput.addEventListener('change', () => {
    const topLedNb = topLedNumberInput.value;
    sendTopLedNb(topLedNb);
});

// Send top led number to the server
function sendTopLedNb(topLedNb) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/lamp/set-top-led", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ topLedNb }));
}
