export default {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    description: 'A transposition cipher that arranges the plaintext in a zigzag pattern across multiple "rails" and then reads off the ciphertext row by row.',
    params: [{ type: "number", id: "rails", label: "Number of Rails", min: 2, max: 10, value: 3 }],
    encrypt: function(plaintext, params) { return railFenceEncrypt(plaintext, params.rails); },
    decrypt: function(ciphertext, params) { return railFenceDecrypt(ciphertext, params.rails); }
};

function railFenceEncrypt(plaintext, rails) {
    let result = '';
    let steps = [`Encrypting "${plaintext}" with ${rails} rails`];
    if (rails < 2) return {result: plaintext, steps};

    let fence = Array.from({length: rails}, () => []);
    let rail = 0;
    let direction = 1;

    for (let char of plaintext) {
        fence[rail].push(char);
        rail += direction;
        if (rail === rails - 1 || rail === 0) {
            direction = -direction;
        }
    }

    for (let row of fence) {
        result += row.join('');
    }

    steps.push(`Result: "${result}"`);
    return {result, steps};
}

function railFenceDecrypt(ciphertext, rails) {
    let result = '';
    let steps = [`Decrypting "${ciphertext}" with ${rails} rails`];
    if (rails < 2) return {result: ciphertext, steps};

    let fence = Array.from({length: rails}, () => []);
    let rail = 0;
    let direction = 1;
    let lengths = Array(rails).fill(0);

    // Calculate lengths for each rail
    for (let i = 0; i < ciphertext.length; i++) {
        lengths[rail]++;
        rail += direction;
        if (rail === rails - 1 || rail === 0) {
            direction = -direction;
        }
    }

    // Distribute ciphertext to rails
    let index = 0;
    for (let r = 0; r < rails; r++) {
        for (let j = 0; j < lengths[r]; j++) {
            fence[r].push(ciphertext[index++]);
        }
    }

    // Read in zigzag order
    rail = 0;
    direction = 1;
    let railIndices = Array(rails).fill(0);
    for (let i = 0; i < ciphertext.length; i++) {
        result += fence[rail][railIndices[rail]++];
        rail += direction;
        if (rail === rails - 1 || rail === 0) {
            direction = -direction;
        }
    }

    steps.push(`Result: "${result}"`);
    return {result, steps};
}
