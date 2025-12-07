import affine from "./Ciphers/affin.js";
import playfair from "./Ciphers/playfair.js";
import vernam from "./Ciphers/vernam.js";
import railfence from "./Ciphers/railfence.js";
import des from "./Ciphers/des.js";
import aes from "./Ciphers/aes.js";

export const CHIPHERS = [affine, playfair, vernam, railfence,des,aes];

export function getCipherById(id) {
    return CHIPHERS.find(cipher => cipher.id === id);
}
