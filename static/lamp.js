const colorPicker = document.getElementById("color-picker");
colorPicker.addEventListener('input', () => {
    const hexColor = colorPicker.value;
    const color = {
        r: parseInt(hexColor.substring(1, 3), 16),
        g: parseInt(hexColor.substring(3, 5), 16),
        b: parseInt(hexColor.substring(5, 7), 16),
        w: 0,
    }

    sendColor(color)
});

function sendColor(color) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/lamp/color", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(color));
}
