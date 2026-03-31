// ================== ELEMENTS ==================
const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");

let currentShape = "rectangle";
let mode = "draw";

// dessin
let isDrawing = false;
let startX = 0, startY = 0;
let currentElement = null;

// déplacement
let isDragging = false;
let draggedElement = null;
let offsetX = 0, offsetY = 0;

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

// ================== CHOIX FORME ==================
document.querySelectorAll("[data-shape]").forEach(btn => {
    btn.onclick = () => currentShape = btn.dataset.shape;
});

// ================== MOUSEDOWN ==================
canvas.addEventListener("mousedown", (e) => {

    const target = e.target;
    const canvasRect = canvas.getBoundingClientRect();

    // ===== DEPLACEMENT =====
    if (mode === "move" && target.classList.contains("shape")) {

        isDragging = true;
        draggedElement = target;

        const rect = target.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        return;
    }

    // ===== DESSIN =====
    if (mode === "draw") {

        startX = e.clientX - canvasRect.left;
        startY = e.clientY - canvasRect.top;

        isDrawing = true;

        currentElement = document.createElement("div");
        currentElement.classList.add("shape");

        currentElement.style.left = startX + "px";
        currentElement.style.top = startY + "px";

        canvas.appendChild(currentElement);
    }
});

// ================== MOUSEMOVE ==================
canvas.addEventListener("mousemove", (e) => {

    const canvasRect = canvas.getBoundingClientRect();

    // ===== DRAG =====
    if (isDragging) {
        draggedElement.style.left = (e.clientX - canvasRect.left - offsetX) + "px";
        draggedElement.style.top = (e.clientY - canvasRect.top - offsetY) + "px";
        return;
    }

    // ===== DRAW =====
    if (!isDrawing) return;

    let currentX = e.clientX - canvasRect.left;
    let currentY = e.clientY - canvasRect.top;

    let width = currentX - startX;
    let height = currentY - startY;

    currentElement.style.left = (width < 0 ? currentX : startX) + "px";
    currentElement.style.top = (height < 0 ? currentY : startY) + "px";

    width = Math.abs(width);
    height = Math.abs(height);

    // rectangle
    if (currentShape === "rectangle") {
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    // cercle
    if (currentShape === "circle") {
        currentElement.classList.add("circle");
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    // triangle
    if (currentShape === "triangle") {
        currentElement.classList.add("triangle");
        currentElement.style.borderWidth = `0 ${width/2}px ${height}px ${width/2}px`;
        currentElement.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        currentElement.style.backgroundColor = "transparent";
    }
});

// ================== MOUSEUP ==================
document.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
});

// ================== CLICK (DELETE / COLOR) ==================
canvas.addEventListener("click", (e) => {

    const target = e.target;
    if (!target.classList.contains("shape")) return;

    // suppression
    if (mode === "delete") {
        target.remove();
        return;
    }

    // changement de couleur
    if (mode === "draw") {
        if (target.classList.contains("triangle")) {
            target.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        } else {
            target.style.backgroundColor = colorPicker.value;
        }
    }
});
