import  ceaser  from "./Chipers/ceaser.js";
import autokey from "./Chipers/autokey.js";
import hillcliming from "./Chipers/hillcliming.js";
import affin from "./Chipers/affin.js";

export const CHIPHERS = [ceaser, autokey,hillcliming, affin];

export function getCipherById(id) {
    return CHIPHERS.find(cipher => cipher.id === id);
}