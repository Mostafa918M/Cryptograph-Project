import { createMatrix, findInMatrix, splitIntoPairs, convert } from '../utils/playfair.js';
export default {
    id: 'playfair',
    name: 'Playfair Cipher',
    description: 'A cipher that uses a 5x5 grid of letters to encrypt messages. It is a symmetric cipher, meaning that both the encryption and decryption keys are the same.',
    params: [{ type: "text", id: "keyword", label: "Keyword", value: "KEY" }],
    encrypt: function(plaintext, params) { return playfairEncrypt(plaintext, params.keyword); },
    decrypt: function(ciphertext, params) { return playfairDecrypt(ciphertext, params.keyword); }
};

function playfairEncrypt(plaintext, keyword) {
    let result = [];
    let steps = [];

    plaintext = plaintext.toLowerCase().replace(/j/g, 'i').replace(/[^a-z]/g, '');

    const matrix = createMatrix(keyword);
    const pairs = splitIntoPairs(plaintext);

    pairs.forEach(pair => {
        const converted = convert(pair, matrix, "encrypt");
        result.push(converted.first);
        result.push(converted.second);
    });

    return { result: result.join(''), steps };
}

function playfairDecrypt(ciphertext, keyword) {
    let result = [];
    let steps = [];
    //implement here

    ciphertext = ciphertext.toLowerCase().replace(/j/g, 'i').replace(/[^a-z]/g, '');

    const matrix = createMatrix(keyword);
    const pairs = splitIntoPairs(ciphertext);

    pairs.forEach(pair => {
        const converted = convert(pair, matrix, "encrypt");
        result.push(converted.first);
        result.push(converted.second);
    });

    return { result: result.join(''), steps };
}
