export default{
    id: 'ceaser',
    name: 'Caesar Cipher',
    description: 'A simple substitution cipher where each letter in the plaintext is shifted a fixed number of places down or up the alphabet.',
    params: [{ type: "number", id: "shift", label: "Shift (N)", min: 1, max: 25, value: 3 }],
    
    encrypt: function(plaintext, params) { return caesarEncrypt(plaintext, params.shift); },
    decrypt: function(ciphertext, params) { return caesarDecrypt(ciphertext, params.shift); }
};

function caesarEncrypt(plaintext, shift) {
    let result = 'this is the resulting ciphertext';
    let steps = [];
    //implement here
    steps.push(`${plaintext}`);
    return {result, steps};
}
function caesarDecrypt(ciphertext, shift) {
    let result = 'this is the resulting plaintext';
    let steps = [];
    //implement here
    steps.push(`${ciphertext}`);
    return {result, steps};
}