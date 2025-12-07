export default {
    id: 'aes',
    name: 'AES Cipher',
    description: 'AES-128 (ECB mode) with PKCS#7 padding. Key must be 16 characters (128 bits).',
    params: [{ type: "text", id: "key", label: "Key (16 characters)", value: "0123456789abcdef" }],
    encrypt: function(plaintext, params) { return aesEncrypt(plaintext, params.key); },
    decrypt: function(ciphertext, params) { return aesDecrypt(ciphertext, params.key); }
};
function aesEncrypt(plaintext, keyStr) {
    const steps = [];
    if (!keyStr || keyStr.length !== 16) {
        steps.push('Key must be 16 characters (128-bit).');
        return { result: '', steps };
    }
    steps.push(`Using key: "${keyStr}"`);
    const key = stringToBytes(keyStr);
    const data = stringToBytes(plaintext);
    const padded = pkcs7Pad(data, 16);
    steps.push(`Plaintext length ${data.length}, padded to ${padded.length} bytes`);

    const roundKeys = keyExpansion(key);
    const blocks = [];
    for (let i = 0; i < padded.length; i += 16) {
        const block = padded.slice(i, i + 16);
        const enc = cipher(block, roundKeys);
        blocks.push(enc);
    }
    const ciphertextHex = bytesToHex(flatten(blocks));
    steps.push(`Encrypted ${blocks.length} block(s)`);
    return { result: ciphertextHex, steps };
}

function aesDecrypt(cipherHex, keyStr) {
    const steps = [];
    if (!keyStr || keyStr.length !== 16) {
        steps.push('Key must be 16 characters (128-bit).');
        return { result: '', steps };
    }
    steps.push(`Using key: "${keyStr}"`);
    if (!cipherHex || cipherHex.length % 32 !== 0) {
        steps.push('Ciphertext hex length invalid.');
        return { result: '', steps };
    }
    const key = stringToBytes(keyStr);
    const roundKeys = keyExpansion(key);
    const cipherBytes = hexToBytes(cipherHex);
    const blocks = [];
    for (let i = 0; i < cipherBytes.length; i += 16) {
        const block = cipherBytes.slice(i, i + 16);
        const dec = invCipher(block, roundKeys);
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

// --- Utilities ---
function stringToBytes(s) { const a = []; for (let i=0;i<s.length;++i) a.push(s.charCodeAt(i)&0xff); return a; }
function bytesToString(b) { return String.fromCharCode(...b); }
function bytesToHex(bytes) { return bytes.map(x=> (x>>>0).toString(16).padStart(2,'0')).join(''); }
function hexToBytes(hex) { const out=[]; for (let i=0;i<hex.length;i+=2) out.push(parseInt(hex.substr(i,2),16)); return out; }
function flatten(arr){ return [].concat(...arr); }

function pkcs7Pad(bytes, blockSize){ const pad = blockSize - (bytes.length % blockSize || blockSize); return bytes.concat(Array(pad).fill(pad)); }
function pkcs7Unpad(bytes){ if(bytes.length===0) return null; const pad=bytes[bytes.length-1]; if(pad<1||pad>16) return null; for(let i=0;i<pad;++i) if(bytes[bytes.length-1-i]!==pad) return null; return bytes.slice(0, bytes.length-pad); }

// --- AES core (AES-128) ---
const SBOX = [
0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];
const INV_SBOX = (function(){ const a=[]; for(let i=0;i<256;++i) a[SBOX[i]]=i; return a; })();
const RCON = [0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];

function keyExpansion(keyBytes){
    const Nk=4, Nb=4, Nr=10;
    const w = new Array(Nb*(Nr+1));
    for(let i=0;i<Nk;i++) w[i]=[keyBytes[4*i],keyBytes[4*i+1],keyBytes[4*i+2],keyBytes[4*i+3]];
    for(let i=Nk;i< Nb*(Nr+1); ++i){
        let temp = w[i-1].slice();
        if(i%Nk===0){
            temp = subWord(rotWord(temp));
            temp[0] ^= RCON[i/Nk]|0;
        }
        w[i] = xorWord(w[i-Nk], temp);
    }
    return w; // array of 44 words (4 bytes each)
}
function rotWord(w){ return [w[1],w[2],w[3],w[0]]; }
function subWord(w){ return w.map(b=>SBOX[b]); }
function xorWord(a,b){ return [a[0]^b[0], a[1]^b[1], a[2]^b[2], a[3]^b[3]]; }

function addRoundKey(state, w, round){
    for(let c=0;c<4;++c){
        const word = w[round*4 + c];
        for(let r=0;r<4;++r) state[r][c] ^= word[r];
    }
}
function subBytes(state){ for(let r=0;r<4;++r) for(let c=0;c<4;++c) state[r][c]=SBOX[state[r][c]]; }
function invSubBytes(state){ for(let r=0;r<4;++r) for(let c=0;c<4;++c) state[r][c]=INV_SBOX[state[r][c]]; }
function shiftRows(state){
    state[1].push(state[1].shift());
    state[2].push(state[2].shift()); state[2].push(state[2].shift());
    state[3].unshift(state[3].pop());
}
function invShiftRows(state){
    state[1].unshift(state[1].pop());
    state[2].push(state[2].shift()); state[2].push(state[2].shift());
    state[3].push(state[3].shift());
}

function xtime(a){ return ((a<<1)^(((a>>7)&1)*0x1b))&0xff; }
function mixColumns(state){
    for(let c=0;c<4;++c){
        const a = [state[0][c],state[1][c],state[2][c],state[3][c]];
        const r = [ (xtime(a[0])^ (a[1]^xtime(a[1])) ^ a[2] ^ a[3]),
                    (xtime(a[1])^ (a[2]^xtime(a[2])) ^ a[3] ^ a[0]),
                    (xtime(a[2])^ (a[3]^xtime(a[3])) ^ a[0] ^ a[1]),
                    (xtime(a[3])^ (a[0]^xtime(a[0])) ^ a[1] ^ a[2]) ];
        for(let i=0;i<4;++i) state[i][c]=r[i]&0xff;
    }
}

function invMixColumns(state){
    for(let c=0;c<4;++c){
        const a = [state[0][c],state[1][c],state[2][c],state[3][c]];
        const r = [];
        r[0] = mul(a[0],0x0e) ^ mul(a[1],0x0b) ^ mul(a[2],0x0d) ^ mul(a[3],0x09);
        r[1] = mul(a[0],0x09) ^ mul(a[1],0x0e) ^ mul(a[2],0x0b) ^ mul(a[3],0x0d);
        r[2] = mul(a[0],0x0d) ^ mul(a[1],0x09) ^ mul(a[2],0x0e) ^ mul(a[3],0x0b);
        r[3] = mul(a[0],0x0b) ^ mul(a[1],0x0d) ^ mul(a[2],0x09) ^ mul(a[3],0x0e);
        for(let i=0;i<4;++i) state[i][c]=r[i]&0xff;
    }
}
function mul(a,b){ let res=0; for(let i=0;i<8;i++){ if(b&1) res ^= a; const hi=(a&0x80); a = (a<<1)&0xff; if(hi) a ^= 0x1b; b >>=1; } return res; }

function cipher(input, w){
    // input: 16 bytes
    const state = [[],[],[],[]];
    for(let i=0;i<16;++i) state[i%4][Math.floor(i/4)] = input[i];
    addRoundKey(state, w, 0);
    for(let round=1; round<=9; ++round){
        subBytes(state);
        shiftRows(state);
        mixColumns(state);
        addRoundKey(state, w, round);
    }
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, w, 10);
    const out = new Array(16);
    for(let i=0;i<16;++i) out[i]=state[i%4][Math.floor(i/4)];
    return out;
}

function invCipher(input, w){
    const state=[[],[],[],[]];
    for(let i=0;i<16;++i) state[i%4][Math.floor(i/4)] = input[i];
    addRoundKey(state, w, 10);
    for(let round=9; round>=1; --round){
        invShiftRows(state);
        invSubBytes(state);
        addRoundKey(state, w, round);
        invMixColumns(state);
    }
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, w, 0);
    const out = new Array(16);
    for(let i=0;i<16;++i) out[i]=state[i%4][Math.floor(i/4)];
    return out;
}

// End AES
