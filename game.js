const TYPES = ['🐑', '🌿', '🥕', '🎃', '🍎', '🌽'];
const LAYERS = 3;
const GRID_SIZE = 4;
let selectedTiles = [];
let slots = Array(10).fill(null);

function createGame() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    // 创建三层堆叠的方块
    for(let layer = 0; layer < LAYERS; layer++) {
        for(let i = 0; i < GRID_SIZE; i++) {
            for(let j = 0; j < GRID_SIZE; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.left = `${j * 90 + layer * 5}px`;
                tile.style.top = `${i * 90 + layer * 5}px`;
                tile.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 70%)`;
                tile.dataset.type = TYPES[Math.floor(Math.random()*TYPES.length)];
                tile.dataset.layer = layer;
                tile.textContent = tile.dataset.type;
                
                tile.onclick = () => handleClick(tile);
                board.appendChild(tile);
            }
        }
    }
    updateCount();
}

function handleClick(tile) {
    const rect = tile.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    
    const topElement = document.elementFromPoint(centerX, centerY);
    if (!tile.contains(topElement)) {
        alert('请先移开上层的方块！');
        return;
    }

    const emptySlotIndex = slots.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) {
        alert('卡槽已满！');
        return;
    }

    slots[emptySlotIndex] = tile.dataset.type;
    const slotElement = document.getElementById(`slot-${emptySlotIndex}`);
    slotElement.textContent = tile.dataset.type;
    
    tile.remove();
    updateLayers();
    updateCount();
    checkWin();
    
    checkSlotMatches();
}

function updateLayers() {
    document.querySelectorAll('.tile').forEach(tile => {
        const below = document.elementFromPoint(
            parseFloat(tile.style.left) + 40,
            parseFloat(tile.style.top) + 40
        );
        tile.dataset.layer = below === tile ? 0 : 1;
    });
}

function updateCount() {
    document.getElementById('count').textContent = 
        document.querySelectorAll('.tile').length;
}

function checkWin() {
    if (document.querySelectorAll('.tile').length === 0) {
        setTimeout(() => alert('胜利！'), 100);
    }
}

function checkSlotMatches() {
    const typeCount = {};
    slots.forEach(type => {
        if (type) typeCount[type] = (typeCount[type] || 0) + 1;
    });

    for (const [type, count] of Object.entries(typeCount)) {
        if (count >= 3) {
            slots = slots.map(slotType => slotType === type ? null : slotType);
            document.querySelectorAll('.slot').forEach((slot, index) => {
                if (slots[index] === null) slot.textContent = '';
            });
        }
    }
}

// 初始化游戏
createGame(); 