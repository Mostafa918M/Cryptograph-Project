
export default{
    id:'affine',
    name:'Affine Cipher',
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
    let result = '';
    let steps = [`Encrypting "${plaintext}" with a=${a}, b=${b}`];
    for (let char of plaintext) {
        if (char >= 'A' && char <= 'Z') {
            let x = char.charCodeAt(0) - 65;
            let encrypted = (a * x + b) % 26;
            result += String.fromCharCode(encrypted + 65);
        } else if (char >= 'a' && char <= 'z') {
            let x = char.charCodeAt(0) - 97;
            let encrypted = (a * x + b) % 26;
            result += String.fromCharCode(encrypted + 97);
        } else {
            result += char;
        }
    }
    steps.push(`Result: "${result}"`);
    return {result, steps};
}

function affineDecrypt(ciphertext, a, b) {
    let result = '';
    let steps = [`Decrypting "${ciphertext}" with a=${a}, b=${b}`];
    let aInv = modInverse(a, 26);
    if (aInv === null) {
        return {result: 'Error: a and 26 are not coprime', steps};
    }
    for (let char of ciphertext) {
        if (char >= 'A' && char <= 'Z') {
            let x = char.charCodeAt(0) - 65;
            let decrypted = (aInv * (x - b + 26)) % 26;
            result += String.fromCharCode(decrypted + 65);
        } else if (char >= 'a' && char <= 'z') {
            let x = char.charCodeAt(0) - 97;
            let decrypted = (aInv * (x - b + 26)) % 26;
            result += String.fromCharCode(decrypted + 97);
        } else {
            result += char;
        }
    }
    steps.push(`Result: "${result}"`);
    return {result, steps};
}

function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return null;
}
