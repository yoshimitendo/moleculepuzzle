document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const gameLayer = document.getElementById("game");

const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const SELECT_HEIGHT = 1000;

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

for (let i = 0; i < 4; i++) {
    const piece= document.createElement("div");
    piece.className = "pieces";
    piece.textContent = "H";
    gameLayer.appendChild(piece);
    piece.X = i * 200;
    piece.Y = SELECT_HEIGHT;
    piece.style.left = `${piece.X}px`
    piece.style.top = `${piece.Y}px`


    piece.style.scale = "0";
    piece.scale = 0;
    piece.isAnimating = false;
    setTimeout(() => {
        soft(piece);
    }, i * 40);

    piece.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        piece.isPointer = true;
        piece.style.filter = "brightness(1.5)";
        piece.style.zIndex = "1";
        piece.oldX = piece.X;
        piece.oldY = piece.Y;
        piece.pointerX = e.clientX;
        piece.pointerY = e.clientY;
        
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

function soft(p) {
    if (p.isAnimating) return;
    p.isAnimating = true;
    let scaleSpeed = 0;
    function animate(){
        scaleSpeed += (1 - p.scale) * 0.08;
        scaleSpeed = scaleSpeed * 0.94;
        p.scale += scaleSpeed;
        p.style.scale = p.scale
        if (Math.abs(p.scale - 1) < 0.005 && Math.abs(scaleSpeed) < 0.005) {
            p.isAnimating = false;
            return;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
