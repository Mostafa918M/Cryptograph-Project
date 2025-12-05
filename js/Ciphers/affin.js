export default {
  id: "affine",
  name: "Affine Cipher",
  description:
    "A type of monoalphabetic substitution cipher, where each letter in an alphabet is mapped to its numeric equivalent, encrypted using a simple mathematical function, and converted back to a letter.",
  params: [
    { type: "number", id: "a", label: "Slope (a)", min: 1, max: 25, value: 5 },
    {
      type: "number",
      id: "b",
      label: "Intercept (b)",
      min: 0,
      max: 25,
      value: 8,
    },
  ],
  encrypt: function (plaintext, params) {
    return affineEncrypt(plaintext, params.a, params.b);
  },
  decrypt: function (ciphertext, params) {
    return affineDecrypt(ciphertext, params.a, params.b);
  },
};

function affineEncrypt(plaintext, a, b) {
  let result = "";
  const steps = [];

  steps.push({
    description: `Encrypting "${plaintext}" with a=${a}, b=${b}`,
    input: null,
    output: null,
  });

  for (let char of plaintext) {
    if (char >= "A" && char <= "Z") {
      const x = char.charCodeAt(0) - 65;
      const y = (a * x + b) % 26;
      const encryptedChar = String.fromCharCode(y + 65);

      steps.push({
        description: `${a}*${x} + ${b} mod 26 = ${y}`,
        input: char,
        output: encryptedChar,
      });

      result += encryptedChar;
    } else if (char >= "a" && char <= "z") {
      const x = char.charCodeAt(0) - 97;
      const y = (a * x + b) % 26;
      const encryptedChar = String.fromCharCode(y + 97);

      steps.push({
        description: `${a}*${x} + ${b} mod 26 = ${y}`,
        input: char,
        output: encryptedChar,
      });

      result += encryptedChar;
    } else {
      result += char;
    }
  }

  steps.push({
    description: `Result: "${result}"`,
    input: null,
    output: null,
  });

  return { result, steps };
}

function affineDecrypt(ciphertext, a, b) {
  let result = "";
  const steps = [];
  let aInv = modInverse(a, 26);
  steps.push({
    description: `Decrypting "${ciphertext}" with a=${a}, b=${b}`,
    input: null,
    output: null,
  });
  if (aInv === null) {
    steps.push({
      description: `Error: a=${a} has no modular inverse mod 26 (gcd(a, 26) ≠ 1)`,
      input: null,
      output: null,
    });
    return { result: "Error: a and 26 are not coprime", steps };
  }
  for (let char of ciphertext) {
    if (char >= "A" && char <= "Z") {
      const x = char.charCodeAt(0) - 65;
      const y = (aInv * (x - b + 26)) % 26;
      const plainChar = String.fromCharCode(y + 65);

      steps.push({
        description: `${aInv}*(${x}-${b} + 26) mod 26 = ${y}`,
        input: char,
        output: plainChar,
      });

      result += plainChar;
    } else if (char >= "a" && char <= "z") {
      const x = char.charCodeAt(0) - 97;
      const y = (aInv * (x - b + 26)) % 26;
      const plainChar = String.fromCharCode(y + 97);

      steps.push({
        description: `${aInv}*(${x}-${b} + 26) mod 26 = ${y}`,
        input: char,
        output: plainChar,
      });

      result += plainChar;
    } else {
      result += char;
    }
  }

  steps.push({
    description: `Result: "${result}"`,
    input: null,
    output: null,
  });

  return { result, steps };
}

function modInverse(a, m) {
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      return i;
    }
  }
  return null;
}
