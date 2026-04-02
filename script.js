// Elements qui composent la page
const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker"); // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color

// Elements sélectionnés par défaut (Dessiner et Rectangle)
let currentShape = "rectangle";
let mode = "dessin";

// Dessin
let isDrawing = false;
let startX = 0, startY = 0;
let currentElement = null;

// Déplacement
let isDragging = false;
let draggedElement = null;
let offsetX = 0, offsetY = 0;

// Empêche le clic après un drag
let hasMoved = false;

// Les différents modes
function setMode(newMode) {
    mode = newMode;

    // reset boutons mode
    document.querySelectorAll("#toolbar button").forEach(btn => {
        btn.classList.remove("active");
    });

    // reset body classes
    document.body.classList.remove("dessin-mode", "deplace-mode", "supprime-mode");
    document.body.classList.add(newMode + "-mode");

    /* Méthode dessin */
    if (newMode === "dessin") {
        document.getElementById("dessinMode").classList.add("active");

        // Reprendre la dernière forme sélectionnée pour la rendre active quand le bouton "Dessin" est à nouveau sélectionné
        setActiveShapeButton(currentShape);
    }

    /* Méthode déplacer */
    if (newMode === "deplace") {
        document.getElementById("deplaceMode").classList.add("active");
        clearShapeButtons();
    }

    /* Méthide supprimer */
    if (newMode === "supprime") {
        document.getElementById("supprimeMode").classList.add("active");
        clearShapeButtons();
    }
}

// Déselectionner un bouton quand on change de forme
function clearShapeButtons() {
    document.querySelectorAll("[data-shape]").forEach(btn => {
        btn.classList.remove("active");
    });
}

// Sélectionner un bouton quand on change de forme
function setActiveShapeButton(shape) {
    clearShapeButtons();
    const btn = document.querySelector(`[data-shape="${shape}"]`);
    if (btn) btn.classList.add("active");
}

// Initialiser le dessin
setMode("dessin");

// Boutons modes
document.getElementById("dessinMode").onclick = () => setMode("dessin");
document.getElementById("deplaceMode").onclick = () => setMode("deplace");
document.getElementById("supprimeMode").onclick = () => setMode("supprime");

// Boutons formes
document.querySelectorAll("[data-shape]").forEach(btn => {
    btn.onclick = () => {
        currentShape = btn.dataset.shape;

        // activer seulement en mode dessin
        if (mode === "dessin") {
            setActiveShapeButton(currentShape);
        }
    };
});

// Partie Souris 
canvas.addEventListener("mousedown", (e) => { // https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
    // Quand souris déplacée avec le clic enfoncé

    hasMoved = false;

    const canvasRect = canvas.getBoundingClientRect();

    // Déplacement
    if (mode === "deplace" && e.target.classList.contains("shape")) {

        isDragging = true;
        draggedElement = e.target;

        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        return;
    }

    // Dessin sur le canva
    if (mode === "dessin" && e.target === canvas) {

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

// Déplacement de la souris
canvas.addEventListener("mousemove", (e) => {
    // Déplacement de la souris (sans clic)

    const canvasRect = canvas.getBoundingClientRect();

    // Repère
    if (isDragging) {
        hasMoved = true;
        draggedElement.style.left = (e.clientX - canvasRect.left - offsetX) + "px";
        draggedElement.style.top = (e.clientY - canvasRect.top - offsetY) + "px";
        return;
    }

    if (!isDrawing) return;

    hasMoved = true;

    let currentX = e.clientX - canvasRect.left;
    let currentY = e.clientY - canvasRect.top;

    let width = currentX - startX;
    let height = currentY - startY;

    currentElement.style.left = (width < 0 ? currentX : startX) + "px";
    currentElement.style.top = (height < 0 ? currentY : startY) + "px";

    width = Math.abs(width);
    height = Math.abs(height);

    // Rectangle
    if (currentShape === "rectangle") {
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    // Cercle
    if (currentShape === "cercle") {
        currentElement.classList.add("cercle");
        currentElement.style.width = width + "px";
        currentElement.style.height = height + "px";
        currentElement.style.backgroundColor = colorPicker.value;
    }

    // Triangle
    if (currentShape === "triangle") {
        currentElement.classList.add("triangle");
        currentElement.style.borderWidth = `0 ${width/2}px ${height}px ${width/2}px`;
        currentElement.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
        currentElement.style.backgroundColor = "transparent";
    }
});

// Souris
document.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
});

// Clic souris
canvas.addEventListener("click", (e) => {
    // Souris cliquée sans déplacement

    const target = e.target.closest(".shape");
    if (!target) return;

    // Suppression
    if (mode === "supprime") {
        target.remove();
        return;
    }

    // Changement couleur
    if (target.classList.contains("triangle")) {
        target.style.borderColor = `transparent transparent ${colorPicker.value} transparent`;
    } else {
        target.style.backgroundColor = colorPicker.value;
    }
});
