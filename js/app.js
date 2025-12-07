import { CHIPHERS, getCipherById } from "./registry.js";
import { state, setState, setParam, subscribe, getActiveParams, setCipher, setMode } from "./state.js";
import Visualizer from "./visualizations/visualizer.js";


const cipherSelect = document.querySelector("#cipherSelect");
const cipherName = document.querySelector("#cipherName");
const cipherDescription = document.querySelector("#cipherDescription");
const paramsContainer = document.querySelector("#paramsContainer");
const modeDisplay = document.querySelector("#modeDisplay");
const plainInput = document.querySelector("#plainInput");
const result = document.querySelector("#result");

const swapModeBtn = document.querySelector("#swapModeBtn");
const stepsBtn = document.querySelector("#steps-tab-btn");
const visualizationBtn = document.querySelector("#visualization-tab-btn");
const theoryBtn = document.querySelector("#theory-tab-btn");

const tabsContainer = document.querySelector("#tab-content");

const stepsTab = document.querySelector("#view-steps");
const theoryTab = document.querySelector("#view-theory");
const visualizationTab = document.querySelector("#view-visualization");

const tabGroups = new Map([
    ["visualization", {
        button: visualizationBtn,
        tab: visualizationTab
    }],
    ["steps", {
        button: stepsBtn,
        tab: stepsTab
    }],
    ["theory", {
        button: theoryBtn,
        tab: theoryTab
    }],
]);


function renderCipherOptions() {
    cipherSelect.innerHTML = CHIPHERS
        .map(c => `<option value="${c.id}">${c.name}</option>`)
        .join("");
    cipherSelect.value = state.selectedCipherId;
}
function renderParams(cipher) {
    const activeParams = getActiveParams();
    paramsContainer.innerHTML = "";

    (cipher.params || []).forEach(p => {
        const wrap = document.createElement("div");
        wrap.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.textContent = p.label || p.id;
        label.style.display = "block";

        let input;

        if (p.type === "textarea") {
            input = document.createElement("textarea");
            input.value = activeParams[p.id] ?? "";
        } else if (p.type === "select") {
            input = document.createElement("select");
            (p.options || []).forEach(opt => {
                const o = document.createElement("option");
                o.value = opt.value;
                o.textContent = opt.label ?? opt.value;
                if (opt.value === activeParams[p.id]) o.selected = true;
                input.appendChild(o);
            });
        } else if (p.type === "checkbox") {
            input = document.createElement("input");
            input.type = "checkbox";
            input.checked = !!activeParams[p.id];
        } else {
            input = document.createElement("input");
            input.type = p.type === "number" ? "number" : "text";
            if (p.min != null) input.min = p.min;
            if (p.max != null) input.max = p.max;
            input.value = activeParams[p.id] ?? "";
        }

        input.id = `param-${p.id}`;

        input.addEventListener("input", e => {
            let val;
            if (p.type === "number") val = Number(e.target.value);
            else if (p.type === "checkbox") val = e.target.checked;
            else val = e.target.value;

            setParam(p.id, val);
        });

        wrap.appendChild(label);
        wrap.appendChild(input);
        paramsContainer.appendChild(wrap);
    });
}
function render() {
    const cipher = getCipherById(state.selectedCipherId);
    const activeParams = getActiveParams();
    cipherName.textContent = cipher.name;
    cipherDescription.textContent = cipher.description;
    modeDisplay.textContent = `${state.mode === "encrypt" ? "Encryption" : "Decryption"}`;
    swapModeBtn.textContent = state.mode === "encrypt" ? "Switch to Decrypt" : "Switch to Encrypt";

    renderParams(cipher);
    const fn = state.mode === "encrypt" ? cipher.encrypt : cipher.decrypt;
    const out = fn(state.plaintext, activeParams);

    if (out && typeof out === "object") {
        result.textContent = out.result ?? "";
        state.ciphertext = out.result ?? "";
        state.steps = out.steps ?? [];

    } else {
        result.textContent = out ?? "";
        state.ciphertext = out ?? "";
        state.steps = [];
    }
}

subscribe(render);


renderCipherOptions();
render();


cipherSelect.addEventListener("change", e => {
    setCipher(e.target.value);

});

function renderSteps(steps) {
    stepsTab.classList.remove("hidden"); // make it visible
    stepsTab.innerHTML = steps
        .map(
            (st, i) =>
                `<div class="border-b border-gray-800 py-1 flex gap-4">
           <span class="text-gray-500 w-6">${i + 1}.</span>
           <span class="text-primary">${st.description}</span>
         </div>`
        )
        .join("");
}

async function renderVisualization() {
    const text = state.plaintext;
    const params = getActiveParams();
    const visualizer = new Visualizer(state.selectedCipherId);
    const generator = state.mode === "encrypt" ? visualizer.visualizeEncrypt : visualizer.visualizeDecrypt;

    let isAppended = false;
    for await (const value of generator(text, params)) {
        if (!isAppended) {
            visualizationTab.appendChild(value);
            isAppended = true;
        }
    }
}

visualizationBtn.addEventListener("click", () => {
    switchTab("visualization");
    visualizationTab.innerHTML = "";
    renderVisualization();
});

stepsBtn.addEventListener("click", () => {
    switchTab("steps");
    stepsTab.innerHTML = "";
    renderSteps(state.steps);
});

theoryBtn.addEventListener("click", () => {
    switchTab("theory");
    theoryContainer.innerHTML = "";
    // renderTheory();
});

plainInput.addEventListener("input", e => {
    setState({ plaintext: e.target.value });
    switchTab("steps");
    renderSteps(state.steps);
});

swapModeBtn.addEventListener("click", () => {
    setMode(state.mode === "encrypt" ? "decrypt" : "encrypt");
    switchTab("steps");
    renderSteps(state.steps);
});

function switchTab(tabGroupName) {
    if (!tabGroups.has(tabGroupName)) return false;

    for (const tabGroup of tabGroups.values()) {
        tabGroup.tab.classList.add("hidden");

        tabGroup.button.classList.remove("border-primary");
        tabGroup.button.classList.remove("text-white");
        tabGroup.button.classList.remove("transition-colors");

        tabGroup.button.classList.add("border-transparent");
        tabGroup.button.classList.add("text-gray-500");
        tabGroup.button.classList.add("hover:text-gray-300");
        tabGroup.button.classList.add("transition-colors");
    }

    const tabGroup = tabGroups.get(tabGroupName);

    tabGroup.tab.classList.remove("hidden");

    tabGroup.button.classList.add("border-primary");
    tabGroup.button.classList.add("text-white");
    tabGroup.button.classList.add("transition-colors");

    tabGroup.button.classList.remove("border-transparent");
    tabGroup.button.classList.remove("text-gray-500");
    tabGroup.button.classList.remove("hover:text-gray-300");
    tabGroup.button.classList.remove("transition-colors");

    return true;
}
