import affine from "./Ciphers/affin.js";
import playfair from "./Ciphers/playfair.js";
import vernam from "./Ciphers/vernam.js";
import railfence from "./Ciphers/railfence.js";

export const CHIPHERS = [affine, playfair, vernam, railfence];

export function getCipherById(id) {
    return CHIPHERS.find(cipher => cipher.id === id);
}
