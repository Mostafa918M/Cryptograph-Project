import { getCipherById } from "./registry.js";

export const state = {
  selectedCipherId: "ceaser",
  mode: "encrypt",
  params: { shift: 3 },
  plaintext: "",
  ciphertext: "",
  paramsByCipher: {},
  steps:[]
};

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}


function notify() {
  listeners.forEach(fn => fn(state));
}

export function ensureCipherParams(cipherId) {
  if (state.paramsByCipher[cipherId]) return;

  const cipher = getCipherById(cipherId);
  const defaults = {};

  (cipher.params || []).forEach(p => {
    defaults[p.id] = p.value ?? (p.type === "checkbox" ? false : "");
  });

  state.paramsByCipher[cipherId] = defaults;
}
export function setMode(mode){
    state.mode = mode;
    notify();
}
export function setState(patch) {
  Object.assign(state, patch);
  notify();
}

export function setCipher(id) {
  state.selectedCipherId = id;
  ensureCipherParams(id);
  notify();
}

export function setParam(paramId, value) {
  const id = state.selectedCipherId;
  ensureCipherParams(id);
  state.paramsByCipher[id][paramId] = value;
  notify();
}

export function getActiveParams() {
  ensureCipherParams(state.selectedCipherId);
  return state.paramsByCipher[state.selectedCipherId];
}