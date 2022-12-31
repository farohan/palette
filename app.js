//Welcome to app.js!

//To stop the form from refreshing the page

const form = document.querySelector('#form');

function formHandler(event) {
    event.preventDefault();
}

form.addEventListener('submit', formHandler);

//The code behind the palette generator.

const buildPalette = (colorsList) => {
    const paletteContainer = document.querySelector('#palette');
    const complementaryContainer = document.querySelector('#complementary');

    paletteContainer.innerHTML = '';
    complementaryContainer.innerHTML = '';

    const orderedByColor = orderByLuminance(colorsList);
    const hslColors = convertRGBtoHSL(orderedByColor);

    for (let i = 0; i < orderedByColor.length; i++) {
        const hexColor = rgbToHex(orderedByColor[i]);
        const hexColorComplementary = hslToHex(hslColors[i]);

        if (i > 0) {
            const difference = calculateColorDifference(
                orderedByColor[i],
                orderedByColor[i - 1]
            );

            if (difference < 120) {
                continue;
            }
        }
    
        const colorElement = document.createElement('div');
        colorElement.style.backgroundColor = hexColor;
        colorElement.appendChild(document.createTextNode(hexColor));
        paletteContainer.appendChild(colorElement);

        if (hslColors[i].h) {
            const complementaryElement = document.createElement('div');
            complementaryElement.style.backgroundColor = `hsl(${hslColors[i].h},${hslColors[i].s}%,${hslColors[i].l}%)`;

            complementaryElement.appendChild(
                document.createTextNode(hexColorComplementary)
            );
            complementaryContainer.appendChild(complementaryElement);
        }
    }
};

const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    return (
        '#' + 
        componentToHex(pixel.r) +
        componentToHex(pixel.g) +
        componentToHex(pixel.b)
    ).toUpperCase();
};

const hslToHex = (hslColor) => {
    const hslColorCopy = { ...hslColor };
    hslColorCopy.l /= 100;
    const a = 
        (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
    const f = (n) => {
        const k = (n + hslColorCopy.h / 30) % 12;
        const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

