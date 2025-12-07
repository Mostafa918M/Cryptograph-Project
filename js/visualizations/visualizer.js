function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addClasses(element, styleClasses) {
    for (let styleClass of styleClasses.split(" ")) {
        element.classList.add(styleClass);
    }
}


function removeClasses(element, styleClasses) {
    for (let styleClass of styleClasses.split(" ")) {
        element.classList.remove(styleClass);
    }
}

function animate(element, animationName, time) {
    element.style.animation = `${animationName} ${time}ms ease-in-out infinite`;

    setTimeout(() => {
        element.style.animation = "";
    }, time);
}

function createElement(type, initialValue = "") {
    const element = document.createElement("div");
    switch (type) {
        case "visualizer":
            addClasses(element, "visualizer");
            break;
        case "span":
            addClasses(element, "vis-text-secondary");
            break;
        case "raw-container":
            addClasses(element, "vis-container borderless row");
            break;
        case "col-container":
            addClasses(element, "vis-container borderless cal");
            break;
        case "box":
            addClasses(element, "vis-box text-primary");
            break;
    }
    element.innerHTML = initialValue;
    return element;
}

function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return null;
}

const cipherVisualizations = {
    "affine": {
        encrypt: async function*(inputText, { a, b }) {

            const visualizationElement = createElement("visualizer");
            const asciiOffsets = [];

            yield visualizationElement;

            const inputCharacterCollection = createElement("raw-container");
            visualizationElement.appendChild(inputCharacterCollection);
            await sleep(100);

            for (const character of inputText.split("")) {
                const characterElement = createElement("box");
                characterElement.textContent = character;
                inputCharacterCollection.appendChild(characterElement);
                animate(characterElement, "slideIn", 500);
                await sleep(200);
            };

            await sleep(1000);

            for (const characterElement of inputCharacterCollection.children) {
                const character = characterElement.textContent;
                let asciiOffset = -1;
                if (character >= "A" && character <= "Z") asciiOffset = 65;
                if (character >= "a" && character <= "z") asciiOffset = 97;
                asciiOffsets.push(asciiOffset);
                if (asciiOffset == -1) continue;
                const charCode = character.charCodeAt(0) - asciiOffset;

                characterElement.textContent = charCode;
                animate(characterElement, "shake", 500);
                await sleep(200);
            };

            await sleep(1000);

            const equationElement = createElement("box");

            visualizationElement.appendChild(equationElement);

            const [outputElement, aElement, bElement, inputElement] = [
                createElement("box", "y"),
                createElement("box", a),
                createElement("box", b),
                createElement("box", "x"),
            ];

            equationElement.appendChild(outputElement);
            equationElement.appendChild(createElement("span", " = ("));
            equationElement.appendChild(aElement);
            equationElement.appendChild(createElement("span", " * "));
            equationElement.appendChild(inputElement);
            equationElement.appendChild(createElement("span", " + "));
            equationElement.appendChild(bElement);
            equationElement.appendChild(createElement("span", ") % 26"));
            animate(equationElement, "slideIn", 500);
            await sleep(800);


            const outputCharacterCollection = createElement("raw-container");
            visualizationElement.appendChild(outputCharacterCollection);
            await sleep(100);


            let i = 0;
            for (const characterElement of inputCharacterCollection.children) {
                const asciiOffset = asciiOffsets[i++];
                if (asciiOffset == -1) {
                    animate(characterElement, "glow", 500);
                    await sleep(800);

                    const outputCharacterElement = createElement("box");
                    outputCharacterElement.textContent = characterElement.textContent;
                    outputCharacterCollection.appendChild(outputCharacterElement);
                    animate(outputCharacterElement, "glow", 500);
                    await sleep(800);
                    continue;
                }

                animate(characterElement, "glow", 500);
                await sleep(800);

                inputElement.textContent = characterElement.textContent;
                animate(inputElement, "glow", 500);
                await sleep(800);

                outputElement.textContent = (parseInt(aElement.textContent) * parseInt(inputElement.textContent) + parseInt(bElement.textContent)) % 26;
                animate(outputElement, "glow", 500);
                await sleep(800);

                const outputCharacterElement = createElement("box");
                outputCharacterElement.textContent = outputElement.textContent;
                outputCharacterCollection.appendChild(outputCharacterElement);
                animate(outputCharacterElement, "glow", 500);
                await sleep(800);
            };

            i = 0;
            for (const characterElement of outputCharacterCollection.children) {
                const asciiOffset = asciiOffsets[i++];

                if (asciiOffset == -1) continue;

                const character = characterElement.textContent;

                const encryptedChar = String.fromCharCode(parseInt(character) + asciiOffset);

                characterElement.textContent = encryptedChar;
                animate(characterElement, "shake", 500);
                await sleep(200);
            };

            for (const characterElement of outputCharacterCollection.children) {
                animate(characterElement, "glow", 400);
                await sleep(100);
            };
        },
        decrypt: async function*(inputText, { a, b }) {

            const visualizationElement = createElement("visualizer");
            const asciiOffsets = [];

            yield visualizationElement;

            const inputCharacterCollection = createElement("raw-container");
            visualizationElement.appendChild(inputCharacterCollection);
            await sleep(100);

            for (const character of inputText.split("")) {
                const characterElement = createElement("box");
                characterElement.textContent = character;
                inputCharacterCollection.appendChild(characterElement);
                animate(characterElement, "slideIn", 500);
                await sleep(200);
            };

            await sleep(1000);

            for (const characterElement of inputCharacterCollection.children) {
                const character = characterElement.textContent;
                let asciiOffset = -1;
                if (character >= "A" && character <= "Z") asciiOffset = 65;
                if (character >= "a" && character <= "z") asciiOffset = 97;
                asciiOffsets.push(asciiOffset);
                if (asciiOffset == -1) continue;
                const charCode = character.charCodeAt(0) - asciiOffset;

                characterElement.textContent = charCode;
                animate(characterElement, "shake", 500);
                await sleep(200);
            };

            await sleep(1000);

            const modInverseEquationElement = createElement("box");
            const aElement = createElement("box", a);

            const aInveresElement = createElement("box", "a<sup>-1</sup>");
            modInverseEquationElement.appendChild(aInveresElement);
            modInverseEquationElement.appendChild(createElement("span", " = modInverse("));
            modInverseEquationElement.appendChild(aElement);
            modInverseEquationElement.appendChild(createElement("span", ", 26)"));
            visualizationElement.appendChild(modInverseEquationElement);
            animate(modInverseEquationElement, "slideIn", 500);
            await sleep(800);

            let aInv = modInverse(a, 26);

            animate(aElement, "glow", 500);
            await sleep(300);
            animate(aInveresElement, "glow", 500);
            aInveresElement.innerHTML = aInv;
            await sleep(1000);

            animate(modInverseEquationElement, "slideOut", 500);
            await sleep(500);
            visualizationElement.removeChild(modInverseEquationElement);
            
            const equationElement = createElement("box");

            visualizationElement.appendChild(equationElement);

            const [outputElement, bElement, inputElement] = [
                createElement("box", "y"),
                createElement("box", b),
                createElement("box", "x"),
            ];

            equationElement.appendChild(outputElement);
            equationElement.appendChild(createElement("span", " = ("));
            equationElement.appendChild(aInveresElement);
            equationElement.appendChild(createElement("span", " * ("));
            equationElement.appendChild(inputElement);
            equationElement.appendChild(createElement("span", " - "));
            equationElement.appendChild(bElement);
            equationElement.appendChild(createElement("span", ")) % 26"));
            animate(equationElement, "slideIn", 500);
            await sleep(800);



            const outputCharacterCollection = createElement("raw-container");
            visualizationElement.appendChild(outputCharacterCollection);
            await sleep(100);


            let i = 0;
            for (const characterElement of inputCharacterCollection.children) {
                const asciiOffset = asciiOffsets[i++];
                if (asciiOffset == -1) {
                    animate(characterElement, "glow", 500);
                    await sleep(800);

                    const outputCharacterElement = createElement("box");
                    outputCharacterElement.textContent = characterElement.textContent;
                    outputCharacterCollection.appendChild(outputCharacterElement);
                    animate(outputCharacterElement, "glow", 500);
                    await sleep(800);
                    continue;
                }

                animate(characterElement, "glow", 500);
                await sleep(800);

                inputElement.textContent = characterElement.textContent;
                animate(inputElement, "glow", 500);
                await sleep(800);

                outputElement.textContent = ((parseInt(aInveresElement.textContent) * (parseInt(inputElement.textContent) - parseInt(bElement.textContent) + 26)) + 26) % 26;
                animate(outputElement, "glow", 500);
                await sleep(800);

                const outputCharacterElement = createElement("box");
                outputCharacterElement.textContent = outputElement.textContent;
                outputCharacterCollection.appendChild(outputCharacterElement);
                animate(outputCharacterElement, "glow", 500);
                await sleep(800);
            };

            i = 0;
            for (const characterElement of outputCharacterCollection.children) {
                const asciiOffset = asciiOffsets[i++];

                if (asciiOffset == -1) continue;

                const character = characterElement.textContent;

                const encryptedChar = String.fromCharCode(parseInt(character) + asciiOffset);

                characterElement.textContent = encryptedChar;
                animate(characterElement, "shake", 500);
                await sleep(200);
            };

            for (const characterElement of outputCharacterCollection.children) {
                animate(characterElement, "glow", 400);
                await sleep(100);
            };
        }
    },
    playfair: {
    },
    vernam: {
    },
    railfence: {
    }
};

export default class Visualizer {
    #visualizeEncrypt;
    #visualizeDecrypt;

    constructor(cipherId) {
        if (!cipherId in cipherVisualizations) throw "Cipher not found";
        ({
            encrypt: this.#visualizeEncrypt,
            decrypt: this.#visualizeDecrypt
        } = cipherVisualizations[cipherId]);
    }

    get visualizeEncrypt() {
        return this.#visualizeEncrypt;
    }

    get visualizeDecrypt() {
        return this.#visualizeDecrypt;
    }
}
