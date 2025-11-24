
export default{
    id:'affin',
    name:'Affin Cipher',
    description:'A type of monoalphabetic substitution cipher, where each letter in an alphabet is mapped to its numeric equivalent, encrypted using a simple mathematical function, and converted back to a letter.',
    params: [
        { type: "number", id: "a", label: "Slope (a)", min: 1, max: 25, value: 5 },
        { type: "number", id: "b", label: "Intercept (b)", min: 0, max: 25, value: 8 }
    ],
    encrypt: function(plaintext, params) {
        return affineEncrypt(plaintext, params.a, params.b);
    },
    decrypt: function(ciphertext, params) {
        return affineDecrypt(ciphertext, params.a, params.b);
    }
}

function affineEncrypt(plaintext, a, b) {
    let result = 'this is the resulting ciphertext';
    let steps = [];
    //implement here
    return {result, steps};
}

function affineDecrypt(ciphertext, a, b) {
    let result = 'this is the resulting plaintext';
    let steps = [];
    //implement here

    return {result, steps};
}
