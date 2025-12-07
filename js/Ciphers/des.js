export default {
    id: 'des',
    name: 'DES Cipher',
    description: 'Data Encryption Standard (DES) is a symmetric-key algorithm for the encryption of digital data. It uses a fixed-length key of 56 bits and operates on 64-bit blocks of data.',
    params: [{ type: "text", id: "key", label: "Key (8 characters)", value: "ABCDEFGH" }],
    encrypt: function(plaintext, params) { return desEncrypt(plaintext, params.key); },
    decrypt: function(ciphertext, params) { return desDecrypt(ciphertext, params.key); }
};
// DES implementation (ECB mode, PKCS#7 padding)
// Ciphertext output is hex string. Decryption expects hex string.
function desEncrypt(plaintext, keyStr) {
    const steps = [];
    if (!keyStr || keyStr.length !== 8) {
        steps.push('Key must be 8 characters (64 bits, 56 used).');
        return { result: '', steps };
    }
    steps.push(`Using key: "${keyStr}"`);

    const key = stringToBytes(keyStr);
    const data = stringToBytes(plaintext);

    const padded = pkcs7Pad(data, 8);
    steps.push(`Plaintext length ${data.length}, padded to ${padded.length} bytes`);

    const subkeys = generateSubkeys(key);
    const blocks = [];
    for (let i = 0; i < padded.length; i += 8) {
        const block = padded.slice(i, i + 8);
        const enc = desBlock(block, subkeys, true);
        blocks.push(enc);
    }
    const ciphertextHex = bytesToHex(flatten(blocks));
    steps.push(`Encrypted ${blocks.length} block(s)`);
    return { result: ciphertextHex, steps };
}

function desDecrypt(cipherHex, keyStr) {
    const steps = [];
    if (!keyStr || keyStr.length !== 8) {
        steps.push('Key must be 8 characters (64 bits, 56 used).');
        return { result: '', steps };
    }
    steps.push(`Using key: "${keyStr}"`);
    const key = stringToBytes(keyStr);
    if (!cipherHex || cipherHex.length % 16 !== 0) {
        steps.push('Ciphertext hex length invalid.');
        return { result: '', steps };
    }
    const cipherBytes = hexToBytes(cipherHex);
    const subkeys = generateSubkeys(key);
    const blocks = [];
    for (let i = 0; i < cipherBytes.length; i += 8) {
        const block = cipherBytes.slice(i, i + 8);
        const dec = desBlock(block, subkeys, false);
        blocks.push(dec);
    }
    const merged = flatten(blocks);
    const unpadded = pkcs7Unpad(merged);
    if (unpadded === null) {
        steps.push('Invalid padding on decryption.');
        return { result: '', steps };
    }
    const plaintext = bytesToString(unpadded);
    steps.push(`Decrypted ${blocks.length} block(s)`);
    return { result: plaintext, steps };
}

// --- Utilities and DES internals ---
function stringToBytes(str) {
    const arr = [];
    for (let i = 0; i < str.length; ++i) arr.push(str.charCodeAt(i) & 0xff);
    return arr;
}
function bytesToString(bytes) {
    return String.fromCharCode(...bytes);
}
function bytesToHex(bytes) {
    return bytes.map(b => (b >>> 0).toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex) {
    const out = [];
    for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.substr(i, 2), 16));
    return out;
}
function flatten(arr) { return [].concat(...arr); }

function pkcs7Pad(bytes, blockSize) {
    const padLen = blockSize - (bytes.length % blockSize || blockSize);
    return bytes.concat(Array(padLen).fill(padLen));
}
function pkcs7Unpad(bytes) {
    if (bytes.length === 0) return null;
    const pad = bytes[bytes.length - 1];
    if (pad < 1 || pad > 8) return null;
    for (let i = 0; i < pad; ++i) if (bytes[bytes.length - 1 - i] !== pad) return null;
    return bytes.slice(0, bytes.length - pad);
}

// DES tables (standard)
const IP = [
    58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,
    57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7
];
const FP = [
    40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,
    36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25
];
const E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
const P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
const PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
const PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
const SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
const SBOX = [
    // S1
    [
        14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,
        0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,
        4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,
        15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13
    ],
    // S2
    [
        15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,
        3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,
        0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,
        13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9
    ],
    // S3
    [
        10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,
        13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,
        13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,
        1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12
    ],
    // S4
    [
        7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,
        13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,
        10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,
        3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14
    ],
    // S5
    [
        2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,
        14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,
        4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,
        11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3
    ],
    // S6
    [
        12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,
        10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,
        9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,
        4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13
    ],
    // S7
    [
        4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,
        13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,
        1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,
        6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12
    ],
    // S8
    [
        13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,
        1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,
        7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,
        2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11
    ]
];

function generateSubkeys(keyBytes) {
    // keyBytes: 8 bytes
    const keyBits = bytesToBits(keyBytes);
    const permuted = permute(keyBits, PC1); // 56 bits
    let c = permuted.slice(0, 28);
    let d = permuted.slice(28, 56);
    const subkeys = [];
    for (let i = 0; i < 16; ++i) {
        c = leftShift(c, SHIFTS[i]);
        d = leftShift(d, SHIFTS[i]);
        const cd = c.concat(d);
        const sub = permute(cd, PC2); // 48 bits
        subkeys.push(sub);
    }
    return subkeys;
}

function desBlock(blockBytes, subkeys, encrypt) {
    const bits = bytesToBits(blockBytes);
    let perm = permute(bits, IP);
    let l = perm.slice(0, 32);
    let r = perm.slice(32, 64);
    for (let i = 0; i < 16; ++i) {
        const ki = encrypt ? subkeys[i] : subkeys[15 - i];
        const er = permute(r, E); // 48
        const x = xorBits(er, ki);
        const sOut = sboxSubstitution(x); // 32
        const pOut = permute(sOut, P);
        const newR = xorBits(l, pOut);
        l = r;
        r = newR;
    }
    const preoutput = r.concat(l); // note swap
    const finalBits = permute(preoutput, FP);
    return bitsToBytes(finalBits);
}

// Bit helpers
function bytesToBits(bytes) {
    const bits = [];
    for (let b of bytes) for (let i = 7; i >= 0; --i) bits.push((b >> i) & 1);
    return bits;
}
function bitsToBytes(bits) {
    const out = [];
    for (let i = 0; i < bits.length; i += 8) {
        let v = 0;
        for (let j = 0; j < 8; ++j) v = (v << 1) | bits[i + j];
        out.push(v & 0xff);
    }
    return out;
}
function permute(bits, table) {
    return table.map(i => bits[i - 1]);
}
function leftShift(arr, n) {
    return arr.slice(n).concat(arr.slice(0, n));
}
function xorBits(a, b) {
    const out = [];
    for (let i = 0; i < a.length; ++i) out.push(a[i] ^ b[i]);
    return out;
}

function sboxSubstitution(bits48) {
    const out = [];
    for (let i = 0; i < 8; ++i) {
        const chunk = bits48.slice(i * 6, i * 6 + 6);
        const row = (chunk[0] << 1) | chunk[5];
        const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
        const sVal = SBOX[i][row * 16 + col];
        for (let b = 3; b >= 0; --b) out.push((sVal >> b) & 1);
    }
    return out;
}

// End of DES implementation
