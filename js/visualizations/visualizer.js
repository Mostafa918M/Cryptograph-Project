import { modInverse } from "./affine.js";
import { generatePlayfairGrid, createPlayfairGrid, findPosition, highlightPlayfairCells, clearPlayfairHighlights } from "./playfair.js"

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

    element.style.animation = `${animationName} ${time}ms ease-in-out`;

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
            yield visualizationElement;

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
            yield visualizationElement;

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
            yield visualizationElement;


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
            yield visualizationElement;

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
            yield visualizationElement;

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
            yield visualizationElement;

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
            yield visualizationElement;



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

            yield visualizationElement;
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
        encrypt: async function*(plaintext, { keyword }) {
            const vis = createElement("visualizer");
            yield vis;

            const cleanKey = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
            const text = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

            const grid = generatePlayfairGrid(cleanKey);
            const gridEl = createPlayfairGrid(grid);
            vis.appendChild(gridEl);
            yield vis;

            const plaintextRow = createElement("raw-container");
            plaintextRow.classList.add("vis-mb-md");
            for (let i = 0; i < text.length; i++) {
                const char = createElement("box", text[i]);
                char.classList.add("vis-char", "plaintext", "borderless");
                if (i > 0 && text[i] === text[i - 1]) {
                    char.classList.add("vis-text-accent");
                }
                plaintextRow.appendChild(char);
            }
            vis.insertBefore(plaintextRow, gridEl);
            animate(plaintextRow, "fadeIn", 300);
            await sleep(500);

            const cipherRow = createElement("box");
            cipherRow.classList.add("vis-mt-md");
            vis.appendChild(cipherRow);

            let i = 0;
            const digraphs = [];
            while (i < text.length) {
                const first = text[i];
                const second = (i + 1 < text.length && text[i + 1] !== first) ? text[i + 1] : 'X';

                digraphs.push([first, second]);
                i += (second === 'X' && i + 1 < text.length) ? 1 : 2;
            }

            for (const [idx, [a, b]] of digraphs.entries()) {
                const posA = findPosition(a, grid);
                const posB = findPosition(b, grid);

                const cells = gridEl.children;
                const cellA = cells[posA.row * 5 + posA.col];
                const cellB = cells[posB.row * 5 + posB.col];
                let cipherA, cipherB;

                highlightPlayfairCells(gridEl, posA, posB, grid);
                animate(cellA, "shake", 300);
                animate(cellB, "shake", 300);
                await sleep(800);
                yield vis;


                if (posA.row === posB.row) {
                    // Same row - shift right

                    cipherA = grid[posA.row][(posA.col + 1) % 5];
                    cipherB = grid[posB.row][(posB.col + 1) % 5];
                    const resultCellA = cells[posA.row * 5 + (posA.col + 1) % 5];
                    const resultCellB = cells[posB.row * 5 + (posB.col + 1) % 5];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "slideIn", 500);

                    await sleep(200);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 500);
                    animate(finalB, "slideIn", 500);

                    await sleep(200);

                } else if (posA.col === posB.col) {
                    // Same column - shift down

                    cipherA = grid[(posA.row + 1) % 5][posA.col];
                    cipherB = grid[(posB.row + 1) % 5][posB.col];
                    const resultCellA = cells[(posA.row + 1) % 5 * 5 + posA.col];
                    const resultCellB = cells[(posB.row + 1) % 5 * 5 + posB.col];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "fadeIn", 500);

                    await sleep(200);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 300);
                    animate(finalB, "fadeIn", 500);

                    await sleep(200);

                } else {
                    // Rectangle - swap columns

                    cipherA = grid[posA.row][posB.col];
                    cipherB = grid[posB.row][posA.col];
                    const resultCellA = cells[posA.row * 5 + posB.col];
                    const resultCellB = cells[posB.row * 5 + posA.col];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "slideIn", 500);

                    await sleep(1000);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 500);
                    animate(finalB, "slideIn", 500);

                    await sleep(1000);
                }

                yield vis;

                clearPlayfairHighlights(gridEl);
            }

            animate(cipherRow, "glow", 1000);
            yield vis;
        },

        decrypt: async function*(ciphertext, { keyword }) {
            const vis = createElement("visualizer");
            yield vis;

            const cleanKey = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
            const text = ciphertext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

            const grid = generatePlayfairGrid(cleanKey);
            const gridEl = createPlayfairGrid(grid);
            vis.appendChild(gridEl);
            yield vis;

            const plaintextRow = createElement("raw-container");
            plaintextRow.classList.add("vis-mb-md");
            for (let i = 0; i < text.length; i++) {
                const char = createElement("box", text[i]);
                char.classList.add("vis-char", "plaintext", "borderless");
                if (i > 0 && text[i] === text[i - 1]) {
                    char.classList.add("vis-text-accent");
                }
                plaintextRow.appendChild(char);
            }
            vis.insertBefore(plaintextRow, gridEl);
            animate(plaintextRow, "fadeIn", 300);
            await sleep(500);

            const cipherRow = createElement("box");
            cipherRow.classList.add("vis-mt-md");
            vis.appendChild(cipherRow);

            let i = 0;
            const digraphs = [];
            while (i < text.length) {
                const first = text[i];
                const second = (i + 1 < text.length && text[i + 1] !== first) ? text[i + 1] : 'X';

                digraphs.push([first, second]);
                i += (second === 'X' && i + 1 < text.length) ? 1 : 2;
            }

            for (const [idx, [a, b]] of digraphs.entries()) {
                const posA = findPosition(a, grid);
                const posB = findPosition(b, grid);

                const cells = gridEl.children;
                const cellA = cells[posA.row * 5 + posA.col];
                const cellB = cells[posB.row * 5 + posB.col];
                let cipherA, cipherB;

                highlightPlayfairCells(gridEl, posA, posB, grid);
                animate(cellA, "shake", 300);
                animate(cellB, "shake", 300);
                await sleep(800);
                yield vis;


                if (posA.row === posB.row) {
                    // Same row - shift right

                    cipherA = grid[posA.row][(posA.col + 4) % 5];
                    cipherB = grid[posB.row][(posB.col + 4) % 5];
                    const resultCellA = cells[posA.row * 5 + (posA.col + 4) % 5];
                    const resultCellB = cells[posB.row * 5 + (posB.col + 4) % 5];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "slideIn", 500);

                    await sleep(200);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 500);
                    animate(finalB, "slideIn", 500);

                    await sleep(200);

                } else if (posA.col === posB.col) {
                    // Same column - shift down

                    cipherA = grid[(posA.row + 4) % 5][posA.col];
                    cipherB = grid[(posB.row + 4) % 5][posB.col];
                    const resultCellA = cells[(posA.row + 4) % 5 * 5 + posA.col];
                    const resultCellB = cells[(posB.row + 4) % 5 * 5 + posB.col];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "fadeIn", 500);

                    await sleep(200);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 300);
                    animate(finalB, "fadeIn", 500);

                    await sleep(200);

                } else {
                    // Rectangle - swap columns

                    cipherA = grid[posA.row][posB.col];
                    cipherB = grid[posB.row][posA.col];
                    const resultCellA = cells[posA.row * 5 + posB.col];
                    const resultCellB = cells[posB.row * 5 + posA.col];

                    const finalA = createElement("box", cipherA);
                    finalA.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalA);

                    animate(resultCellA, "glow", 500);
                    animate(finalA, "slideIn", 500);

                    await sleep(1000);

                    const finalB = createElement("box", cipherB);
                    finalB.classList.add("vis-char", "ciphertext");
                    cipherRow.appendChild(finalB);

                    animate(resultCellB, "glow", 500);
                    animate(finalB, "slideIn", 500);

                    await sleep(1000);
                }

                yield vis;

                clearPlayfairHighlights(gridEl);
            }

            animate(cipherRow, "glow", 1000);
            yield vis;
        }
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
