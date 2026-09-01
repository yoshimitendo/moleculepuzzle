document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const gameLayer = document.getElementById("game");
const boardLayer = document.getElementById("board");

const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

gameLayer.style.width = `${GAME_WIDTH}px`;
gameLayer.style.height = `${GAME_HEIGHT}px`;

function resizeGame() {
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    gameLayer.style.transform = `scale(${scale})`;
    return scale;
}

window.addEventListener("resize", resizeGame);
const GAME_SCALE = resizeGame();

const GRID_COLS = 5;
const GRID_ROWS = 6;
const GRID_SIZE = 170;
const GRID_GAP = 20;

boardLayer.style.width = `${GRID_COLS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
boardLayer.style.height = `${GRID_ROWS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;

const ELEMENTS = [
    {text: "H", col: "#4987ae", arm: 1},
    {text: "C", col: "#2c8a5d", arm: 4},
    {text: "N", col: "#9f6035", arm: 3},
    {text: "O", col: "#9d333e", arm: 2}
];

const MOLECULES = [
    {text: "H₂", con: ["H", "H"]},
    {text: "N₂", con: ["N", "N"]},
    {text: "O₂", con: ["O", "O"]},
]

const selectPiece = [];

function creatSelect(i, j, d) {
    const piece= document.createElement("div");
    piece.className = "pieces";
    piece.element = Math.floor(Math.random() * ELEMENTS.length);
    boardLayer.appendChild(piece);

    piece.textContent = ELEMENTS[piece.element].text;
    piece.style.background = `
        radial-gradient(
            circle,
            ${ELEMENTS[piece.element].col + "22"} 0%,
            ${ELEMENTS[piece.element].col + "99"} 100%
        )
    `;
    piece.style.border = 
        `3px solid ${ELEMENTS[piece.element].col}`;
    piece.style.width = `${GRID_SIZE}px`;
    piece.style.height = `${GRID_SIZE}px`;
    piece.GridX = i;
    piece.GridY = j;
    piece.style.left = 
        `${piece.GridX * (GRID_SIZE + GRID_GAP)}px`;
    piece.style.top = 
        `${piece.GridY * (GRID_SIZE + GRID_GAP)}px`;
    piece.style.scale = "0";
    piece.scale = 0.4;
    piece.isAnimating = false;
    setTimeout(() => {
        soft(piece);
    }, d);
}

for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
        creatSelect(i, j, (i + j) * 40);
    }
}

function soft(p) {
    if (p.isAnimating) return;
    p.isAnimating = true;
    p.scaleSpeed = 0;
    function animate(){
        p.scaleSpeed += (1 - p.scale) * 0.12;
        p.scaleSpeed *= 0.9;
        p.scale += p.scaleSpeed;
        p.style.scale = p.scale
        if (Math.abs(p.scale - 1) < 0.01 && Math.abs(p.scaleSpeed) < 0.01) {
            p.isAnimating = false;
            return;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

let isPointer = false;

document.addEventListener("pointerdown", (e) => {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target?.classList.contains("pieces")) {
        addPiece(target);
        isPointer = true;
    }
})

document.addEventListener("pointerup", (e) => {
    selectPiece.forEach((e) => {
        e.style.filter = "brightness(1)";
        e.style.border = 
        `3px solid ${ELEMENTS[e.element].col}`;
    })
    selectPiece.length = 0;

    document.querySelectorAll(".lines").forEach(element => {
        element.remove();
    })

    isPointer = false;
})

document.addEventListener("pointermove", (e) => {
    if (!isPointer) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target?.classList.contains("pieces")) return;
    if (selectPiece.includes(target)) {
        const index = selectPiece.findIndex(i => i === target);
        if (index === selectPiece.length - 2) {
            const last = selectPiece[selectPiece.length - 1]
            last.style.filter = "brightness(1)";
            last.style.border = 
                `3px solid ${ELEMENTS[last.element].col}`;
            selectPiece.splice(selectPiece.length - 1, 1)
            document.querySelectorAll(".lines").forEach(element => {
                element.remove();
            })
            genLine();
        }
        return;
    }
    const gapX = Math.abs(target.GridX - selectPiece[selectPiece.length - 1].GridX);
    const gapY = Math.abs(target.GridY - selectPiece[selectPiece.length - 1].GridY);
    if (gapX + gapY !== 1) return;
    document.querySelectorAll(".lines").forEach(element => {
        element.remove();
    })
    addPiece(target);
    genLine();

})

function addPiece(t) {
    t.style.filter = "brightness(1.6)";
    t.style.border = 
        `5px solid ${ELEMENTS[t.element].col}`;

    t.scale = 1.3;
    t.scaleSpeed = 0;
    soft(t);

    selectPiece.push(t);
}

function genLine() {
    for (let i = 1; i < selectPiece.length; i++) {
        createLine(selectPiece[i].GridX, selectPiece[i].GridY, selectPiece[i - 1].GridX, selectPiece[i - 1].GridY)
    }
}

function createLine(x, y, x2, y2) {
    const dx = x2 - x;
    const dy = y2 - y;

    const line = document.createElement("div");
    line.className = "lines";
    line.style.zIndex = -1;
    boardLayer.appendChild(line);

    if (dx === 0) {
        line.style.width = `12px`;
        line.style.height = `${GRID_GAP + 40}px`;
    } else {
        line.style.width = `${GRID_GAP + 40}px`;
        line.style.height = `12px`;
    }
    line.style.left = 
        `${x * (GRID_SIZE + GRID_GAP) + GRID_SIZE / 2 + dx * (GRID_SIZE + GRID_GAP) / 2}px`;
    line.style.top = 
        `${y * (GRID_SIZE + GRID_GAP) + GRID_SIZE / 2 + dy * (GRID_SIZE + GRID_GAP) / 2}px`;
}
