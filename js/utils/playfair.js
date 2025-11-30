function* characterGenerator(keyword) {
    const alphabet = 'abcdefghiklmnopqrstuvwxyz';
    let keywordIndex = 0;
    let alphabetIndex = 0;

    const taken = new Set();

    while (keywordIndex < keyword.length) {
        let character = keyword.charAt(keywordIndex);

        if (character == 'j') character = 'i';

        keywordIndex++;

        if (taken.has(character))
            continue;

        taken.add(character);

        yield character;
    }

    while (alphabetIndex < alphabet.length) {
        let character = alphabet.charAt(alphabetIndex);

        alphabetIndex++;

        if (taken.has(character))
            continue;

        yield character;
    }
}

export function createMatrix(keyword) {
    keyword = keyword.toLowerCase();
    keyword = keyword.replace(/[^a-z]/g, '');

    const matrix = [];


    const generator = characterGenerator(keyword);

    for (let x = 0; x < 5; x++) {
        matrix.push([]);
        for (let y = 0; y < 5; y++) {
            const next = generator.next();

            if (next.done) throw "something went wrong with matrix creation";

            matrix[x].push(next.value);
        }
    }

    return matrix;
}

export function splitIntoPairs(text) {
    text = text.toLowerCase().replace(/j/g, 'i').replace(/[^a-z]/g, '');
    const pairs = [];

    let index = 0;

    while (index < text.length) {
        if (index + 1 == text.length) {
            pairs.push(text.charAt(index) + 'x');
            break;
        }

        if (text.charAt(index) == text.charAt(index + 1)) {
            pairs.push(text.charAt(index) + 'x');
            index++;
            continue;
        }

        pairs.push(text.charAt(index) + text.charAt(index + 1));

        index += 2;
    }

    return pairs;
}

export function findInMatrix(matrix, letter) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (matrix[x][y] == letter) return { x, y };
        }
    }

    return null;
}

export function convert(pair, matrix, type = "encrypt") {
    const increment = type == "decrypt" ? 4 : 1; 

    const firstPos = findInMatrix(matrix, pair.charAt(0));
    const secondPos = findInMatrix(matrix, pair.charAt(1));

    if (!firstPos || !secondPos) return "something went wrong";

    if (firstPos.x == secondPos.x) {
        const first = matrix[firstPos.x][(firstPos.y + increment) % 5];
        const second = matrix[secondPos.x][(secondPos.y + increment) % 5];

        return {first, second};
    } else if (firstPos.y == secondPos.y) {
        const first = matrix[(firstPos.x + increment) % 5][firstPos.y];
        const second = matrix[(secondPos.x + increment) % 5][secondPos.y];

        return {first, second};
    } else {

        const first = matrix[firstPos.x][secondPos.y];
        const second = matrix[secondPos.x][firstPos.y];

        return {first, second};
    }
}
