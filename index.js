document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const gameLayer = document.getElementById("game");

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

const SELECT_HEIGHT = 1300;

const ELEMENTS = [
    {text: "H", color: "#4987ae", arm: 1},
    {text: "C", color: "#2c8a5d", arm: 4},
    {text: "N", color: "#9f6035", arm: 3},
    {text: "O", color: "#9d333e", arm: 2}
];

const pieces = [];

function creatSelect() {
    for (let i = 0; i < 4; i++) {
        const piece= document.createElement("div");
        piece.className = "pieces";
        piece.element = Math.floor(Math.random() * ELEMENTS.length);
        gameLayer.appendChild(piece);

        piece.textContent = ELEMENTS[piece.element].text;
        piece.style.background = `
            radial-gradient(
                circle,
                ${ELEMENTS[piece.element].color + "22"} 0%,
                ${ELEMENTS[piece.element].color + "99"} 100%)
        `;
        piece.style.border = 
            `3px solid ${ELEMENTS[piece.element].color}`
        piece.X = i * 200;
        piece.Y = SELECT_HEIGHT;
        piece.style.left = `${piece.X}px`
        piece.style.top = `${piece.Y}px`
        piece.style.scale = "0";
        piece.scale = 0.3;
        piece.isAnimating = false;
        setTimeout(() => {
            soft(piece);
        }, i * 30);

        piece.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            piece.isPointer = true;
            piece.style.filter = "brightness(1.6)";
            piece.style.zIndex = "1";
            piece.oldX = piece.X;
            piece.oldY = piece.Y;
            piece.pointerX = e.clientX;
            piece.pointerY = e.clientY;

            piece.scale = 1.4;
            piece.scaleSpeed = 0;
            soft(piece);
            
            piece.setPointerCapture(e.pointerId);
        })

        piece.addEventListener("pointerup", (e) => {
            e.preventDefault();
            if (!piece.isPointer) return;
            piece.style.filter = "brightness(1.0)";
            piece.style.zIndex = "0";
            piece.isPointer = false;

            piece.releasePointerCapture(e.pointerId);
        })

        piece.addEventListener("pointermove", (e) => {
            e.preventDefault();
            if (!piece.isPointer) return;
            piece.X = (e.clientX - piece.pointerX) / GAME_SCALE + piece.oldX;
            piece.Y = (e.clientY - piece.pointerY) / GAME_SCALE + piece.oldY;
            piece.style.left = `${piece.X}px`;
            piece.style.top = `${piece.Y}px`;
        })
    }
}

creatSelect();

function soft(p) {
    if (p.isAnimating) return;
    p.isAnimating = true;
    p.scaleSpeed = 0;
    function animate(){
        p.scaleSpeed += (1 - p.scale) * 0.1;
        p.scaleSpeed *= 0.9;
        p.scale += p.scaleSpeed;
        p.style.scale = p.scale
        if (Math.abs(p.scale - 1) < 0.005 && Math.abs(p.scaleSpeed) < 0.005) {
            p.isAnimating = false;
            return;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
