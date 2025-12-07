export function generatePlayfairGrid(key) {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const grid = Array(5).fill().map(() => Array(5).fill(''));
    const used = new Set();
    
    let row = 0, col = 0;
    
    // Add key
    for (const char of key) {
        if (!used.has(char)) {
            grid[row][col] = char;
            used.add(char);
            col++;
            if (col === 5) {
                col = 0;
                row++;
            }
        }
    }
    
    // Add remaining
    for (const char of alphabet) {
        if (!used.has(char)) {
            grid[row][col] = char;
            col++;
            if (col === 5) {
                col = 0;
                row++;
            }
        }
    }
    
    return grid;
}

export function createPlayfairGrid(grid) {
    const container = document.createElement("div");
    container.className = "vis-grid cols-5 vis-gap-sm";
    
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement("div");
            cell.className = "vis-box vis-square vis-center borderless";
            cell.textContent = grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;
            container.appendChild(cell);
        }
    }
    
    return container;
}

export function highlightPlayfairCells(gridEl, posA, posB, grid) {
    const cells = gridEl.children;
    
    // Clear previous highlights
    clearPlayfairHighlights(gridEl);
    
    // Find and highlight positions
    for (let i = 0; i < cells.length; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        
        if ((row === posA.row && col === posA.col) || 
            (row === posB.row && col === posB.col)) {
            
            // Add position indicator
            const indicator = document.createElement("div");
            indicator.className = "vis-label";
            indicator.textContent = row === posA.row && col === posA.col ? "A" : "B";
            cells[i].appendChild(indicator);
        }
    }
}

export function clearPlayfairHighlights(gridEl) {
    const cells = gridEl.children;
    
    for (let i = 0; i < cells.length; i++) {
        // Remove indicators
        const indicator = cells[i].querySelector(".vis-label");
        if (indicator) {
            cells[i].removeChild(indicator);
        }
    }
}

export function findPosition(letter, grid) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (grid[row][col] === letter) {
                return { row, col };
            }
        }
    }
    return null;
}
