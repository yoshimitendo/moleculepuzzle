document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const selectLayer = document.getElementById("select");

for (let i = 0; i < 4; i++) {
    const selection= document.createElement("div");
    selection.textContent = "H";
    selection.className = "selections";
    selectLayer.appendChild(selection);
    selection.style.scale = "0";
    selection.scale = 0;
    setTimeout(() => {
        soft(selection);
    }, i * 40);
}

function soft(selection) {
    let scaleSpeed = 0;
    function animate(){
        scaleSpeed += (1 - selection.scale) * 0.1;
        scaleSpeed = scaleSpeed * 0.95;
        selection.scale += scaleSpeed;
        selection.style.scale = `${selection.scale}`
        if (Math.abs(selection.scale - 1) > 0.01 || Math.abs(scaleSpeed) > 0.01) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}
