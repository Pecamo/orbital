gameOptions = null;

function gameOptionsToForm() {
    let html = `<form method="post" action="javascript:void(0);">`;

    for (let name in gameOptions) {
        switch(gameOptions[name].type) {
            case "boolean": {
                html += generateInputBoolean(gameOptions[name], name);
                break;
            }
            case "enum": {
                html += generateInputEnum(gameOptions[name], name);
                break;
            }
            case "number": {
                html += generateInputNumber(gameOptions[name], name);
                break;
            }
            default: {
                console.error(`Type "${gameOptions[name].type}" not supported.`);
            }
        }

        html += "<br>";
    }

    html += `
        <!--<button class="button" id="changeOptionsCancel" onclick="activateScene('welcome')">Cancel</button>-->
        <button class="button" id="changeOptionsValidate" onmouseup="onChangeOptionsValidate()">Save</button>
        </form>
    `;

    return html;
}

function generateInputBoolean(gameOption, name) {
    const checked = gameOption.value ? "checked" : "";

    return `
        <label for="${name}">${formatName(name)} (default: ${gameOption.default}): </label>
        <input type="checkbox" name="${name}" ${checked} onchange="updateValue(this, this.checked)">
    `;
}

function generateInputEnum(gameOption, name) {
    let html = `<h3>${formatName(name)} (default: ${gameOption.default}):</h3>`;

    html += gameOption.options.map(option => {
        const checked = gameOption.value === option ? "checked" : "";

        return `
            <label for="${name}-${option}">${formatName(option)}: </label>
            <input type="radio" id="${name}-${option}" name="${name}" value="${option}" ${checked} onchange="updateValue(this, this.value)">
        `;
    }).join(' ');

    return html;
}

function generateInputNumber(gameOption, name) {
    const min = gameOption.min;
    const max = gameOption.max;

    return `
        <label for="${name}">${formatName(name)} (${min}-${max}, default: ${gameOption.default}): </label>
        <input type="number" name="${name}" min="${min}" max="${max}" value="${gameOption.value}" size="5" onchange="updateValue(this, parseFloat(this.value))">
    `;
}

function formatName(name) {
    return name.replace(/([A-Z])/g, " $1").trim();
}

function updateValue(input, value) {
    const name = input.name;
    console.log("updateValue", input, name, value);
    gameOptions[name].value = value;
}
