export default {
    id: 'vernam',
    name: 'Vernam Cipher',
    description: 'A symmetric stream cipher that uses a one-time pad. Each bit or character of the plaintext is encrypted by combining it with the corresponding bit or character from a secret key stream.',
    params: [{ type: "text", id: "key", label: "Key", value: "SECRET" }],
    encrypt: function(plaintext, params) { return vernamEncrypt(plaintext, params.key); },
    decrypt: function(ciphertext, params) { return vernamDecrypt(ciphertext, params.key); }
};

function vernamEncrypt(plaintext, key) {
    let result = '';
    let steps = [`Encrypting "${plaintext}" with key "${key}"`];
    let keyIndex = 0;
    for (let char of plaintext) {
        if (char >= 'A' && char <= 'Z') {
            let p = char.charCodeAt(0) - 65;
            let k = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
            let c = (p ^ k) % 26;
            result += String.fromCharCode(c + 65);
            keyIndex++;
        } else if (char >= 'a' && char <= 'z') {
            let p = char.charCodeAt(0) - 97;
            let k = key[keyIndex % key.length].toLowerCase().charCodeAt(0) - 97;
            let c = (p ^ k) % 26;
            result += String.fromCharCode(c + 97);
            keyIndex++;
        } else {
            result += char;
        }
    }
    steps.push(`Result: "${result}"`);
    return {result, steps};
}

function vernamDecrypt(ciphertext, key) {
    // Vernam is symmetric, so decrypt is same as encrypt
    return vernamEncrypt(ciphertext, key);
}
