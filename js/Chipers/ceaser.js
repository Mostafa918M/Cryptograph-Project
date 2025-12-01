export default {
  id: 'caesar',
  name: 'Caesar Cipher',
  description:
    'A simple substitution cipher where each letter in the plaintext is shifted a fixed number of places down or up the alphabet.',
  params: [{ type: 'number', id: 'shift', label: 'Shift (N)', min: 1, max: 25, value: 3 }],

  encrypt: function (plaintext, params) {
    return caesarEncrypt(plaintext, params.shift);
  },
  decrypt: function (ciphertext, params) {
    return caesarDecrypt(ciphertext, params.shift);
  },
};

function caesarEncrypt(plaintext, shift) {
  let result = shiftText(plaintext, shift);
  let steps = [`Shifting "${plaintext}" by ${shift} positions`];
  return { result, steps };
}
function caesarDecrypt(ciphertext, shift) {
  let result = shiftText(ciphertext, 26 - shift);
  let steps = [`Shifting "${ciphertext}" by ${26 - shift} positions (decrypt)`];
  return { result, steps };
}
function shiftText(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char >= 'A' && char <= 'Z') {
      result += String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    } else if (char >= 'a' && char <= 'z') {
      result += String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
    } else {
      result += char;
    }
  }
  return result;
}
