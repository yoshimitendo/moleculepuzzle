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
const GRID_SIZE = 160;
const GRID_GAP = 30;

boardLayer.style.width = `${GRID_COLS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
boardLayer.style.height = `${GRID_ROWS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;

const ELEMENTS = [
    {text: "H", color: "#4987ae", arm: 1},
    {text: "C", color: "#2c8a5d", arm: 4},
    {text: "N", color: "#9f6035", arm: 3},
    {text: "O", color: "#9d333e", arm: 2},
    {text: "F", color: "#4987ae", arm: 1},
    {text: "S", color: "#9d333e", arm: 2},
    {text: "Cl", color: "#4987ae", arm: 1}
];

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
            ${ELEMENTS[piece.element].color + "22"} 0%,
            ${ELEMENTS[piece.element].color + "99"} 100%)
    `;
    piece.style.border = 
        `3px solid ${ELEMENTS[piece.element].color}`
    piece.style.width = `${GRID_SIZE}px`
    piece.style.height = `${GRID_SIZE}px`
    piece.X = i * (GRID_SIZE + GRID_GAP);
    piece.Y = j * (GRID_SIZE + GRID_GAP);
    piece.style.left = `${piece.X}px`
    piece.style.top = `${piece.Y}px`
    piece.style.scale = "0";
    piece.scale = 0.3;
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
        p.scaleSpeed += (1 - p.scale) * 0.1;
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
        target.style.filter = "brightness(1.6)";
        
        target.scale = 1.6;
        target.scaleSpeed = 0;
        soft(target);

        selectPiece.push(target);
    }

    isPointer = true;
})

document.addEventListener("pointerup", (e) => {
    selectPiece.forEach((e) => {
        e.style.filter = "brightness(1)";
    })
    selectPiece.length = 0;

    isPointer = false;
})

document.addEventListener("pointermove", (e) => {
    if (!isPointer) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target?.classList.contains("pieces")) {
        if (selectPiece.includes(target)) return;
        target.style.filter = "brightness(1.6)";

        target.scale = 1.6;
        target.scaleSpeed = 0;
        soft(target);

        selectPiece.push(target);
    }
})
