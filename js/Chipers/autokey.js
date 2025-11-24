export default {
    id: 'autokey',
    name: 'Autokey Cipher',
    description: 'A polygraphic substitution cipher that uses a keyword to generate a keystream for encryption and decryption.',
    params: [{ type: "text", id: "keyword", label: "Keyword", value: "" }],
    encrypt: function(plaintext, params) { return autokeyEncrypt(plaintext, params.keyword); },
    decrypt: function(ciphertext, params) { return autokeyDecrypt(ciphertext, params.keyword); }
}

function autokeyEncrypt(plaintext, keyword) {
    let result = 'this is the resulting ciphertext';
    let steps = [];
    //implement here

    return {result, steps};
}
function autokeyDecrypt(ciphertext, keyword) {
    let result = 'this is the resulting plaintext';
    let steps = [];
    //implement here

    return {result, steps};
}