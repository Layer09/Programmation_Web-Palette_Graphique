const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");

let currentShape = "rectangle";
let mode = "draw";

let isDrawing = false;
let startX, startY;
let currentElement = null;

// DRAG
let isDragging = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// ================== MODES ==================
function setMode(newMode) {
    mode = newMode;

    document.querySelectorAll("#toolbar button").forEach(btn => {
        btn.classList.remove("active");
    });

    if (newMode === "draw") document.getElementById("drawMode").classList.add("active");
    if (newMode === "move") document.getElementById("moveMode").classList.add("active");
    if (newMode === "delete") document.getElementById("deleteMode").classList.add("active");
}

document.getElementById("drawMode").onclick = () => setMode("draw");
document.getElementById("moveMode").onclick = () => setMode("move");
document.getElementById("deleteMode").onclick = () => setMode("delete");

// forme
document.querySelectorAll("[data-shape]").forEach(btn => {
    btn.onclick = () => currentShape = btn.dataset.shape;
});

// ================== DESSIN ==================
canvas.addEventListener("mousedown", (e) => {

    // DRAG MODE
    if (mode === "move") {
        const target = e.target;
        if (!target.classList.contains("shape")) return;

        isDragging = true;
        draggedElement = target;

        const rect = target.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        return;
    }

    // DRAW MODE
    if (mode !== "draw") return;

    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    currentElement = document.createElement("div");
    currentElement.classList.add("shape");

    currentElement.style.left = startX + "px";
    currentElement.style.top = startY + "px";

    canvas.appendChild(currentElement);
});

// dessin dynamique
canvas.addEventListener("mousemove", (e) => {

    // DRAG
    if (isDragging) {
        const canvasRect = canvas.getBoundingClientRect();

        draggedElement.style.left = (e.clientX - canvasRect.left - offsetX) + "px";
        draggedElement.style.top = (e.clientY - canvasRect.top - offsetY) + "px";
        return;
    }

    // DRAW
    if (!isDrawing) return;

    let width = e.offsetX - startX;
    let height = e.offsetY - startY;

    // gérer dessin dans tous les sens
    currentElement.style.left = (width < 0 ? e.offsetX : startX) + "px";
    currentElement.style.top = (height < 0 ? e.offsetY : startY) + "px";

    width = Math.abs(width);
    height = Math.abs(height);

    if (currentShape === "rectangle") {
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    if (currentShape === "circle") {
        currentElement.classList.add("circle");
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    if (currentShape === "triangle") {
        currentElement.classList.add("triangle");
        currentElement.style.borderWidth = `0 ${width/2}px ${height}px ${width/2}px`;
        currentElement.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        currentElement.style.backgroundColor = "transparent";
    }
});

// fin actions
document.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
});

// ================== CLICK SUR FORMES ==================
canvas.addEventListener("click", (e) => {

    const target = e.target;
    if (!target.classList.contains("shape")) return;

    // DELETE
    if (mode === "delete") {
        target.remove();
        return;
    }

    // COLOR CHANGE
    if (mode === "draw") {
        if (target.classList.contains("triangle")) {
            target.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        } else {
            target.style.backgroundColor = colorPicker.value;
        }
    }
});
