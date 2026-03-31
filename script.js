const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");

let currentShape = "rectangle";
let isDrawing = false;
let startX, startY;
let currentElement = null;

let mode = "draw"; // draw | move | delete

// Choix de la forme
document.querySelectorAll("#toolbar button[data-shape]").forEach(btn => {
    btn.onclick = () => currentShape = btn.dataset.shape;
});

// Modes
document.getElementById("moveMode").onclick = () => mode = "move";
document.getElementById("deleteMode").onclick = () => mode = "delete";

// === DESSIN ===
canvas.addEventListener("mousedown", (e) => {

    if (mode !== "draw") return;

    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    currentElement = document.createElement("div");
    currentElement.classList.add("shape");

    currentElement.style.left = startX + "px";
    currentElement.style.top = startY + "px";
    currentElement.style.backgroundColor = colorPicker.value;

    if (currentShape === "circle") {
        currentElement.classList.add("circle");
    }

    if (currentShape === "triangle") {
        currentElement.classList.add("triangle");
    }

    canvas.appendChild(currentElement);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    let width = e.offsetX - startX;
    let height = e.offsetY - startY;

    if (currentShape === "triangle") {
        currentElement.style.borderWidth = `0 ${width/2}px ${height}px ${width/2}px`;
        currentElement.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        currentElement.style.backgroundColor = "transparent";
    } else {
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// === INTERACTION AVEC LES FORMES ===
canvas.addEventListener("click", (e) => {

    const target = e.target;

    if (!target.classList.contains("shape")) return;

    // SUPPRESSION
    if (mode === "delete") {
        target.remove();
        return;
    }

    // CHANGEMENT DE COULEUR
    if (mode === "draw") {
        if (target.classList.contains("triangle")) {
            target.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        } else {
            target.style.backgroundColor = colorPicker.value;
        }
    }
});

// === DRAG & DROP ===
let isDragging = false;
let offsetX, offsetY;
let draggedElement = null;

canvas.addEventListener("mousedown", (e) => {

    if (mode !== "move") return;

    const target = e.target;
    if (!target.classList.contains("shape")) return;

    isDragging = true;
    draggedElement = target;

    offsetX = e.offsetX - target.offsetLeft;
    offsetY = e.offsetY - target.offsetTop;
});

canvas.addEventListener("mousemove", (e) => {

    if (!isDragging) return;

    draggedElement.style.left = (e.offsetX - offsetX) + "px";
    draggedElement.style.top = (e.offsetY - offsetY) + "px";
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
