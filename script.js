let makeRectangle = document.querySelector('#makeRectangle')
let canvas = document.querySelector('#canvas')

let canvasStore = [];


let selectedBox = null;

let colorPicker = document.querySelector('#colorPicker')

let currentSelectedShape = null;

let selectedText = null;

function saveToLocal() {
    localStorage.setItem("canvasData", JSON.stringify(canvasStore));
}

function loadFromLocal() {
    const data = localStorage.getItem("canvasData");
    if (data) {
        canvasStore = JSON.parse(data);
    }
}

function renderFromStore() {
    canvas.innerHTML = "";
    document.querySelector(".layers").innerHTML = "";

    canvasStore.forEach(item => {
        let el = document.createElement("div");
        el.dataset.id = item.id;
        el.dataset.rotate = item.rotation || 0;

        el.style.position = "absolute";
        el.style.left = item.position.x + "px";
        el.style.top = item.position.y + "px";
        el.style.zIndex = item.zIndex;

        if (item.type === "rectangle") {
            el.classList.add("newRectangle");
            el.style.width = item.size.width + "px";
            el.style.height = item.size.height + "px";
            el.style.backgroundColor = item.styles.backgroundColor;
            makeSelectable(el);
            makeSelectedDraggable();
            appendLayers("ri-rectangle-line", "Rectangle", item.id);
        }

        else if (item.type === "circle") {
            el.classList.add("newCircle");
            el.style.width = item.size.width + "px";
            el.style.height = item.size.height + "px";
            el.style.backgroundColor = item.styles.backgroundColor;
            makeCircleSelect(el);
            makeSelectedCircleDraggable();
            appendLayers("ri-circle-line", "Circle", item.id);
        }

        else if (item.type === "triangle") {
            el.classList.add("newTriangle");
            el.style.width = item.size.width + "px";
            el.style.height = item.size.height + "px";
            el.style.backgroundColor = item.styles.backgroundColor;
            makeTriangleSelect(el);
            makeSelectedTriangleDraggable();
            appendLayers("ri-triangle-line", "Triangle", item.id);
        }

        else if (item.type === "text") {
            el.classList.add("canvasText");
            el.textContent = item.styles.text;
            el.style.color = item.styles.color;
            el.style.fontSize = item.styles.fontSize;
            makeTextSelectable(el);
            makeSelectedTextDraggable();
            appendLayers("ri-text", "Text", item.id);
        }

        el.style.transform = `rotate(${item.rotation}deg)`;

        canvas.appendChild(el);
    });
}


loadFromLocal()
renderFromStore();


function deselectAllLayers() {
    document.querySelectorAll(".layer").forEach(l => {
        l.classList.remove("active");
    });
}

function selectLayerByShapeId(id) {
    deselectAllLayers();
    const layer = document.querySelector(`.layer[data-shape-id="${id}"]`);
    if (layer) layer.classList.add("active");
}


function generateID() {
    return "el_" + Date.now() + "_" + Math.floor(Math.random() * 100);
}

function getMaxZIndex() {
    let elements = canvas.querySelectorAll("[data-id]");
    let max = 0;

    elements.forEach(el => {
        let z = parseInt(el.style.zIndex) || 0;
        if (z > max) max = z;
    });

    return max;
}

function addToStore(el, type) {
    const obj = {
        id: el.dataset.id,
        type: type,
        position: {
            x: parseInt(el.style.left),
            y: parseInt(el.style.top)
        },
        size: {
            width: el.offsetWidth || null,
            height: el.offsetHeight || null
        },
        rotation: el.dataset.rotate || 0,
        zIndex: parseInt(el.style.zIndex) || 0,
        styles: {
            backgroundColor: el.style.backgroundColor || null,
            color: el.style.color || null,
            fontSize: el.style.fontSize || null,
            text: el.textContent || null
        }
    };

    canvasStore.push(obj);
    saveToLocal();
}


function updateStore(id, newData) {
    const index = canvasStore.findIndex(item => item.id === id);
    if (index === -1) return;

    canvasStore[index] = {
        ...canvasStore[index],
        ...newData
    };

    saveToLocal();

    
}





function appendLayers(iconClass, shapeName, shapeId) {
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.dataset.shapeId = shapeId;

    const layerWrapper = document.createElement("div");
    layerWrapper.className = "layerWrapper";

    // icon
    const iconSpan = document.createElement("span");
    const icon = document.createElement("i");
    icon.className = iconClass;
    iconSpan.appendChild(icon);

    // text
    const textSpan = document.createElement("span");
    textSpan.textContent = shapeName;

    layerWrapper.appendChild(iconSpan);
    layerWrapper.appendChild(textSpan);



    // hide
    const hideSpan = document.createElement("span");
    hideSpan.id = "hide";
    const hideIcon = document.createElement("i");
    hideIcon.className = "ri-eye-line";
    hideSpan.appendChild(hideIcon);

    // unhide
    const unHideSpan = document.createElement("span");
    unHideSpan.id = "unHide";
    const unHideIcon = document.createElement("i");
    unHideIcon.className = "ri-eye-off-line";
    unHideSpan.appendChild(unHideIcon);

    unHideSpan.style.display = "none";

    // structure 
    layer.appendChild(layerWrapper);

    layer.appendChild(hideSpan);
    layer.appendChild(unHideSpan);

    document.querySelector(".layers").appendChild(layer);

    layer.addEventListener("click", (e) => {
        e.stopPropagation();

        const id = layer.dataset.shapeId;
        const shape = document.querySelector(`[data-id="${id}"]`);
        if (!shape) return;

        deselectBox();
        deselectCircle();
        deselectTriangle();
        deselectAllLayers();
        deselectText();

        if (shape.classList.contains("newRectangle")) {
            selectBox(shape);
        }
        else if (shape.classList.contains("newCircle")) {
            selectCircle(shape);
        }
        else if (shape.classList.contains("newTriangle")) {
            selectTriangle(shape);
        }
        else if (shape.classList.contains("canvasText")) {
            selectText(shape);
        }

        layer.classList.add("active");
    });

    hideSpan.addEventListener("click", (e) => {
        e.stopPropagation();

        const id = layer.dataset.shapeId;
        const shape = document.querySelector(`[data-id="${id}"]`);

        if (shape) {
            shape.style.display = "none";
            hideSpan.style.display = "none";
            unHideSpan.style.display = "flex";
        }
    });

    unHideSpan.addEventListener("click", (e) => {
        e.stopPropagation();

        const id = layer.dataset.shapeId;
        const shape = document.querySelector(`[data-id="${id}"]`);

        if (shape) {
            shape.style.display = "block";
            unHideSpan.style.display = "none";
            hideSpan.style.display = "flex";
        }
    });
}


function deleteShapeAndLayer(shape) {
    const id = shape.dataset.id;

    // layer remove
    const layer = document.querySelector(`.layer[data-shape-id="${id}"]`);
    if (layer) layer.remove();

    // shape remove
    shape.remove();
}



// making rectangle
makeRectangle.addEventListener('click', function () {

    let newRectangle = document.createElement('div')
    newRectangle.classList.add("newRectangle")

    let id = generateID();
    newRectangle.dataset.id = id;


    // rectangle original size 
    const rectWidth = 200;
    const rectHeight = 100;

    // canvas height/width
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    //Random top/left
    const randomTop = Math.random() * (canvasHeight - rectHeight);
    const randomLeft = Math.random() * (canvasWidth - rectWidth);

    // rectangle position
    newRectangle.style.width = rectWidth + "px";
    newRectangle.style.height = rectHeight + "px";

    newRectangle.style.left = randomLeft + "px";
    newRectangle.style.top = randomTop + "px";

    newRectangle.style.zIndex = getMaxZIndex() + 1;

    canvas.appendChild(newRectangle)

    appendLayers("ri-rectangle-line", "Rectangle", id)


    makeSelectable(newRectangle)

    makeSelectedDraggable()

    addToStore(newRectangle, "rectangle");

})

//selecting rectangle
function makeSelectable(box) {
    box.addEventListener("click", function (event) {
        event.stopPropagation();
        selectBox(box);
    });
}

function selectBox(box) {

    if (selectedBox && selectedBox !== box) {
        selectedBox.classList.remove("selected");
    }

    selectedBox = box;
    currentSelectedShape = box;
    box.classList.add("selected");


    // colorPicker.style.display = "flex"
    addResizeToSelectedBox();

    selectLayerByShapeId(box.dataset.id);

    updateSizeInputs();
}

// deselecting rectangle
function deselectBox() {
    if (!selectedBox) return;

    selectedBox.classList.remove("selected");

    // colorPicker.style.display = "none"

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());


    selectedBox = null;
    currentSelectedShape = null;
}




// draggable 
function makeSelectedDraggable() {

    canvas.addEventListener("mousedown", function (e) {

        if (!selectedBox) return;

        if (!selectedBox.contains(e.target)) return;

        let startX = e.clientX;
        let startY = e.clientY;

        let startLeft = selectedBox.offsetLeft;
        let startTop = selectedBox.offsetTop;

        let canvasW = canvas.clientWidth;
        let canvasH = canvas.clientHeight;

        let boxW = selectedBox.offsetWidth;
        let boxH = selectedBox.offsetHeight;

        function moveBox(e) {

            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // boundary
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;

            if (newLeft > canvasW - boxW) {
                newLeft = canvasW - boxW;
            }

            if (newTop > canvasH - boxH) {
                newTop = canvasH - boxH;
            }

            selectedBox.style.left = newLeft + "px";
            selectedBox.style.top = newTop + "px";

            updateStore(selectedBox.dataset.id, {
                position: {
                    x: newLeft,
                    y: newTop
                }
            });

        }

        function stopMove() {
            document.removeEventListener("mousemove", moveBox);
            document.removeEventListener("mouseup", stopMove);
        }

        document.addEventListener("mousemove", moveBox);
        document.addEventListener("mouseup", stopMove);
    });
}

colorPicker.addEventListener("input", function () {

    if (!selectedBox) return;

    selectedBox.style.backgroundColor = colorPicker.value;
});

// rectangle resize
function addResizeToSelectedBox() {

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    if (!selectedBox) return;

    let handles = ["tl", "tr", "bl", "br"];

    handles.forEach(type => {
        let handle = document.createElement("div");
        handle.className = "resize-handle " + type;
        selectedBox.appendChild(handle);

        handle.addEventListener("mousedown", function (e) {
            e.stopPropagation();

            let startX = e.clientX;
            let startY = e.clientY;

            let startWidth = selectedBox.offsetWidth;
            let startHeight = selectedBox.offsetHeight;
            let startLeft = selectedBox.offsetLeft;
            let startTop = selectedBox.offsetTop;

            function resize(e) {
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                if (type.includes("r")) newWidth = startWidth + dx;
                if (type.includes("l")) {
                    newWidth = startWidth - dx;
                    newLeft = startLeft + dx;
                }

                if (type.includes("b")) newHeight = startHeight + dy;
                if (type.includes("t")) {
                    newHeight = startHeight - dy;
                    newTop = startTop + dy;
                }

                // minimum size
                if (newWidth < 50 || newHeight < 50) return;

                selectedBox.style.width = newWidth + "px";
                selectedBox.style.height = newHeight + "px";
                selectedBox.style.left = newLeft + "px";
                selectedBox.style.top = newTop + "px";
            }

            function stopResize() {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            }

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        });
    });
}

// deleting elements
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete") {

        if (!selectedBox) return;

        document.querySelectorAll(".resize-handle").forEach(h => h.remove());

        deleteShapeAndLayer(selectedBox);
        selectedBox = null;
        deselectAllLayers();
    }
});



// making circle 

let makeCircle = document.querySelector('#makeCircle')
let selectedCircle = null;

makeCircle.addEventListener('click', () => {

    let newCircle = document.createElement('div')
    newCircle.classList.add("newCircle")

    let id = generateID();
    newCircle.dataset.id = id;

    // circle original size
    const circleWidth = 100;
    const circleHeight = 100;

    // canvas height/width
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // random top/left
    const randomTop = Math.random() * (canvasHeight - circleHeight);
    const randomLeft = Math.random() * (canvasWidth - circleWidth);

    // circle position
    newCircle.style.width = circleWidth + "px"
    newCircle.style.height = circleHeight + "px"

    newCircle.style.left = randomLeft + "px"
    newCircle.style.top = randomTop + "px"

    newCircle.style.zIndex = getMaxZIndex() + 1;


    canvas.appendChild(newCircle)

    appendLayers("ri-circle-line", "Circle", id)

    makeCircleSelect(newCircle)

    makeSelectedCircleDraggable()

    addToStore(newCircle, "circle");

})

function makeCircleSelect(circle) {
    circle.addEventListener('click', function (event) {
        event.stopPropagation()
        selectCircle(circle)
    })
}

function selectCircle(circle) {

    if (selectedCircle && selectedCircle !== circle) {
        selectedCircle.classList.remove('selectedCircle')
    }
    selectedCircle = circle
    currentSelectedShape = circle;
    circle.classList.add('selectedCircle')

    addResizeToSelectedCircle();

    selectLayerByShapeId(circle.dataset.id);

    updateSizeInputs();
}

function deselectCircle() {
    if (!selectedCircle) return;

    selectedCircle.classList.remove('selectedCircle')

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    selectedCircle = null;
    currentSelectedShape = null;
}



function makeSelectedCircleDraggable() {

    canvas.addEventListener("mousedown", function (e) {

        if (!selectedCircle) return;
        if (!selectedCircle.contains(e.target)) return;

        let startX = e.clientX;
        let startY = e.clientY;

        let startLeft = selectedCircle.offsetLeft;
        let startTop = selectedCircle.offsetTop;

        let canvasW = canvas.clientWidth;
        let canvasH = canvas.clientHeight;

        let circleW = selectedCircle.offsetWidth;
        let circleH = selectedCircle.offsetHeight;

        function moveCircle(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // boundary
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;

            if (newLeft > canvasW - circleW) {
                newLeft = canvasW - circleW;
            }

            if (newTop > canvasH - circleH) {
                newTop = canvasH - circleH;
            }

            selectedCircle.style.left = newLeft + "px";
            selectedCircle.style.top = newTop + "px";
        }

        function stopMove() {
            document.removeEventListener("mousemove", moveCircle);
            document.removeEventListener("mouseup", stopMove);
        }

        document.addEventListener("mousemove", moveCircle);
        document.addEventListener("mouseup", stopMove);
    });
}

colorPicker.addEventListener('input', function () {
    if (!selectedCircle) return

    selectedCircle.style.backgroundColor = colorPicker.value
})

function addResizeToSelectedCircle() {

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    if (!selectedCircle) return;

    let handles = ["tl", "tr", "bl", "br"];

    handles.forEach(type => {

        let handle = document.createElement("div");
        handle.className = "resize-handle " + type;
        selectedCircle.appendChild(handle);

        handle.addEventListener("mousedown", function (e) {
            e.stopPropagation();

            let startX = e.clientX;
            let startY = e.clientY;

            let startWidth = selectedCircle.offsetWidth;
            let startHeight = selectedCircle.offsetHeight;
            let startLeft = selectedCircle.offsetLeft;
            let startTop = selectedCircle.offsetTop;

            function resize(e) {

                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newSize = startWidth;


                if (type.includes("r") || type.includes("b")) {
                    newSize = startWidth + Math.max(dx, dy);
                }
                if (type.includes("l") || type.includes("t")) {
                    newSize = startWidth - Math.max(dx, dy);
                }

                if (newSize < 50) return;

                selectedCircle.style.width = newSize + "px";
                selectedCircle.style.height = newSize + "px";

                if (type.includes("l")) selectedCircle.style.left = startLeft + (startWidth - newSize) + "px";
                if (type.includes("t")) selectedCircle.style.top = startTop + (startHeight - newSize) + "px";
            }

            function stopResize() {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            }

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        });
    });
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete") {
        if (!selectedCircle) return;

        document.querySelectorAll(".resize-handle").forEach(h => h.remove());

        deleteShapeAndLayer(selectedCircle);
        selectedCircle = null;
        deselectAllLayers();
    }
});



// making triangle 

let makeTriangle = document.querySelector('#makeTriangle')
let selectedTriangle = null;

makeTriangle.addEventListener('click', function () {

    let newTriangle = document.createElement('div')
    newTriangle.classList.add('newTriangle')

    let id = generateID();
    newTriangle.dataset.id = id;

    const triWidth = 100;
    const triHeight = 100;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const randomTop = Math.random() * (canvasHeight - triHeight);
    const randomLeft = Math.random() * (canvasWidth - triWidth);

    newTriangle.style.width = triWidth + "px"
    newTriangle.style.height = triHeight + "px"

    newTriangle.style.left = randomLeft + "px"
    newTriangle.style.top = randomTop + "px"

    newTriangle.style.zIndex = getMaxZIndex() + 1;


    canvas.appendChild(newTriangle)

    appendLayers("ri-triangle-line", "Triangle", id)

    makeTriangleSelect(newTriangle)

    makeSelectedTriangleDraggable()

    addToStore(newTriangle, "triangle");

})


//selecting triangle
function makeTriangleSelect(triangle) {
    triangle.addEventListener('click', function (event) {
        event.stopPropagation();
        selectTriangle(triangle);
    });
}


function selectTriangle(triangle) {

    if (selectedTriangle && selectedTriangle !== triangle) {
        selectedTriangle.classList.remove('selectedTriangle');
    }

    selectedTriangle = triangle;
    currentSelectedShape = triangle;
    triangle.classList.add('selectedTriangle');

    addResizeToSelectedTriangle();

    selectLayerByShapeId(triangle.dataset.id);

    updateSizeInputs();
}

function deselectTriangle() {
    if (!selectedTriangle) return;

    selectedTriangle.classList.remove('selectedTriangle');

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    selectedTriangle = null;
    currentSelectedShape = null;
}




function makeSelectedTriangleDraggable() {

    canvas.addEventListener("mousedown", function (e) {

        if (!selectedTriangle) return;
        if (!selectedTriangle.contains(e.target)) return;

        let startX = e.clientX;
        let startY = e.clientY;

        let startLeft = selectedTriangle.offsetLeft;
        let startTop = selectedTriangle.offsetTop;

        let canvasW = canvas.clientWidth;
        let canvasH = canvas.clientHeight;

        let triangleW = selectedTriangle.offsetWidth;
        let triangleH = selectedTriangle.offsetHeight;

        function moveTriangle(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // boundary
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;

            if (newLeft > canvasW - triangleW) {
                newLeft = canvasW - triangleW;
            }

            if (newTop > canvasH - triangleH) {
                newTop = canvasH - triangleH;
            }

            selectedTriangle.style.left = newLeft + "px";
            selectedTriangle.style.top = newTop + "px";
        }

        function stopMove() {
            document.removeEventListener("mousemove", moveTriangle);
            document.removeEventListener("mouseup", stopMove);
        }

        document.addEventListener("mousemove", moveTriangle);
        document.addEventListener("mouseup", stopMove);
    });
}

colorPicker.addEventListener('input', function () {
    if (!selectedTriangle) return;

    selectedTriangle.style.backgroundColor = colorPicker.value;
});

function addResizeToSelectedTriangle() {

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    if (!selectedTriangle) return;

    let handles = ["tl", "tr", "bl", "br"];

    handles.forEach(type => {

        let handle = document.createElement("div");
        handle.className = "resize-handle " + type;
        selectedTriangle.appendChild(handle);

        handle.addEventListener("mousedown", function (e) {
            e.stopPropagation();

            let startX = e.clientX;
            let startY = e.clientY;

            let startWidth = selectedTriangle.offsetWidth;
            let startHeight = selectedTriangle.offsetHeight;
            let startLeft = selectedTriangle.offsetLeft;
            let startTop = selectedTriangle.offsetTop;

            function resize(e) {

                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;


                if (type.includes("r")) newWidth = startWidth + dx;
                if (type.includes("l")) newWidth = startWidth - dx;
                if (type.includes("b")) newHeight = startHeight + dy;
                if (type.includes("t")) newHeight = startHeight - dy;

                if (newWidth < 40) newWidth = 40;
                if (newHeight < 40) newHeight = 40;

                selectedTriangle.style.width = newWidth + "px";
                selectedTriangle.style.height = newHeight + "px";

                if (type.includes("l")) selectedTriangle.style.left = startLeft + (startWidth - newWidth) + "px";
                if (type.includes("t")) selectedTriangle.style.top = startTop + (startHeight - newHeight) + "px";
            }

            function stopResize() {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            }

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        });
    });
}


document.addEventListener('keydown', (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete") {
        if (!selectedTriangle) return;

        document.querySelectorAll(".resize-handle").forEach(h => h.remove());

        deleteShapeAndLayer(selectedTriangle);
        selectedTriangle = null;
        deselectAllLayers();
    }
});


// text 

let addTextBtn = document.querySelector("#addText");
let textInput = document.querySelector("#textInput");
let textSize = document.querySelector("#textSize");

addTextBtn.addEventListener("click", () => {
    let newText = document.createElement("div");
    newText.classList.add("canvasText");
    newText.textContent = "Your Text";

    let id = generateID();
    newText.dataset.id = id;
    newText.dataset.rotate = 0;

    newText.style.position = "absolute";
    newText.style.left = "50px";
    newText.style.top = "50px";
    newText.style.fontSize = "20px";
    newText.style.color = "#ffffff";
    newText.style.cursor = "move";

    newText.style.zIndex = getMaxZIndex() + 1;


    canvas.appendChild(newText);

    appendLayers("ri-text", "Text", id);

    makeTextSelectable(newText);
    makeSelectedTextDraggable();


    selectText(newText);

    addToStore(newText, "text");

});

function makeTextSelectable(textEl) {
    textEl.addEventListener("click", (e) => {
        e.stopPropagation();
        selectText(textEl);
    });
}

function selectText(textEl) {
    if (selectedText && selectedText !== textEl) {
        selectedText.classList.remove("selectedText");
    }

    selectedText = textEl;
    currentSelectedShape = textEl;

    textEl.classList.add("selectedText");

    // UI sync
    textInput.value = textEl.textContent;
    textColor.value = rgbToHex(getComputedStyle(textEl).color);
    textSize.value = parseInt(getComputedStyle(textEl).fontSize);

    selectLayerByShapeId(textEl.dataset.id);
}

function deselectText() {
    if (!selectedText) return;
    selectedText.classList.remove("selectedText");
    selectedText = null;
}

function makeSelectedTextDraggable() {
    canvas.addEventListener("mousedown", function (e) {
        if (!selectedText) return;
        if (!selectedText.contains(e.target)) return;

        let startX = e.clientX;
        let startY = e.clientY;

        let startLeft = selectedText.offsetLeft;
        let startTop = selectedText.offsetTop;

        function moveText(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            selectedText.style.left = startLeft + dx + "px";
            selectedText.style.top = startTop + dy + "px";

            updateStore(selectedText.dataset.id, {
                position: { x: newLeft, y: newTop }
            });
        }

        function stopMove() {
            document.removeEventListener("mousemove", moveText);
            document.removeEventListener("mouseup", stopMove);
        }

        document.addEventListener("mousemove", moveText);
        document.addEventListener("mouseup", stopMove);
    });
}

textInput.addEventListener("input", () => {
    if (!selectedText) return;
    selectedText.textContent = textInput.value;
});

colorPicker.addEventListener("input", () => {
    if (!selectedText) return;
    selectedText.style.color = colorPicker.value;
});


textSize.addEventListener("input", () => {
    if (!selectedText) return;
    selectedText.style.fontSize = textSize.value + "px";
});

canvas.addEventListener("click", function () {

    deselectBox();
    deselectCircle();
    deselectTriangle();
    deselectText();

    deselectAllLayers();
    currentSelectedShape = null;

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());
});

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete") {
        if (!currentSelectedShape) return;

        document.querySelectorAll(".resize-handle").forEach(h => h.remove());

        deleteShapeAndLayer(currentSelectedShape);

        // reset all selections
        selectedBox = null;
        selectedCircle = null;
        selectedTriangle = null;
        selectedText = null;
        currentSelectedShape = null;

        deselectAllLayers();
    }
});




// Rotation of shape 

let rotateLeft = document.querySelector("#rotateLeft");
let rotateRight = document.querySelector("#rotateRight");

const rotateDeg = 10;

function rotateShape(deg) {
    if (!currentSelectedShape) return;

    let currentRotation = currentSelectedShape.dataset.rotate || 0;
    currentRotation = parseInt(currentRotation);

    let newRotation = currentRotation + deg;

    currentSelectedShape.style.transform = `rotate(${newRotation}deg)`;
    currentSelectedShape.dataset.rotate = newRotation;
}


rotateRight.addEventListener("click", () => {
    rotateShape(rotateDeg);      // clockwise
});

rotateLeft.addEventListener("click", () => {
    rotateShape(-rotateDeg);     // anti-clockwise
});


// moving shapes

let moveUp = document.querySelector("#moveUp");
let moveDown = document.querySelector("#moveDown");
let moveLeft = document.querySelector("#moveLeft");
let moveRight = document.querySelector("#moveRight");

const moveStep = 5;

function moveShape(dx, dy) {
    if (!currentSelectedShape) return;

    let left = currentSelectedShape.offsetLeft;
    let top = currentSelectedShape.offsetTop;

    let canvasW = canvas.clientWidth;
    let canvasH = canvas.clientHeight;

    let shapeW = currentSelectedShape.offsetWidth;
    let shapeH = currentSelectedShape.offsetHeight;

    let newLeft = left + dx;
    let newTop = top + dy;

    // boundary control
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;

    if (newLeft > canvasW - shapeW) {
        newLeft = canvasW - shapeW;
    }

    if (newTop > canvasH - shapeH) {
        newTop = canvasH - shapeH;
    }

    currentSelectedShape.style.left = newLeft + "px";
    currentSelectedShape.style.top = newTop + "px";

    updateStore(currentSelectedShape.dataset.id, {
        position: {
            x: newLeft,
            y: newTop
        }
    });

}


moveUp.addEventListener("click", () => {
    moveShape(0, -moveStep);   // upar
});

moveDown.addEventListener("click", () => {
    moveShape(0, moveStep);    // niche
});

moveLeft.addEventListener("click", () => {
    moveShape(-moveStep, 0);   // left
});

moveRight.addEventListener("click", () => {
    moveShape(moveStep, 0);    // right
});

document.addEventListener("keydown", (e) => {
    if (!currentSelectedShape) return;

    // jab user input box me type kar raha ho to move na ho
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.key) {
        case "ArrowUp":
            e.preventDefault();
            moveShape(0, -moveStep);   // upar
            break;

        case "ArrowDown":
            e.preventDefault();
            moveShape(0, moveStep);    // niche
            break;

        case "ArrowLeft":
            e.preventDefault();
            moveShape(-moveStep, 0);   // left
            break;

        case "ArrowRight":
            e.preventDefault();
            moveShape(moveStep, 0);    // right
            break;
    }
});



// size of shape 

let widthInput = document.querySelector("#widthInput");
let heightInput = document.querySelector("#heightInput");

function updateSizeInputs() {
    if (!currentSelectedShape) return;

    widthInput.value = currentSelectedShape.offsetWidth;
    heightInput.value = currentSelectedShape.offsetHeight;
}


widthInput.addEventListener("input", () => {
    if (!currentSelectedShape) return;

    let newWidth = parseInt(widthInput.value);
    if (newWidth < 20) return;   // minimum size control

    currentSelectedShape.style.width = newWidth + "px";


    if (currentSelectedShape.classList.contains("newCircle")) {
        currentSelectedShape.style.height = newWidth + "px";
        heightInput.value = newWidth;
    }
});

heightInput.addEventListener("input", () => {
    if (!currentSelectedShape) return;

    let newHeight = parseInt(heightInput.value);
    if (newHeight < 20) return;

    currentSelectedShape.style.height = newHeight + "px";


    if (currentSelectedShape.classList.contains("newCircle")) {
        currentSelectedShape.style.width = newHeight + "px";
        widthInput.value = newHeight;
    }
});


// bring up and down 

let bringForwardBtn = document.querySelector("#bringForward");
let sendBackwardBtn = document.querySelector("#sendBackward");



document.addEventListener("DOMContentLoaded", () => {
    let bringForwardBtn = document.querySelector("#bringForward");
    let sendBackwardBtn = document.querySelector("#sendBackward");

    bringForwardBtn.addEventListener("click", () => {
        if (!currentSelectedShape) return;

        let maxZ = getMaxZIndex();
        currentSelectedShape.style.zIndex = maxZ + 1;
    });

    sendBackwardBtn.addEventListener("click", () => {
        if (!currentSelectedShape) return;

        let currentZ = parseInt(currentSelectedShape.style.zIndex) || 0;
        if (currentZ <= 0) return;

        currentSelectedShape.style.zIndex = currentZ - 1;
    });
});



let exportJSONBtn = document.querySelector("#exportJSON");

exportJSONBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify(canvasStore, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-layout.json";
    a.click();

    URL.revokeObjectURL(url);
});


let exportHTMLBtn = document.querySelector("#exportHTML");

exportHTMLBtn.addEventListener("click", () => {
    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exported Canvas</title>
<style>
body {
    margin: 0;
    background: #111;
}
.canvas {
    position: relative;
    width: ${canvas.clientWidth}px;
    height: ${canvas.clientHeight}px;
    background: #000;
}
.shape {
    position: absolute;
}
</style>
</head>
<body>
<div class="canvas">
`;

    canvasStore.forEach(item => {
        let style = `
            left:${item.position.x}px;
            top:${item.position.y}px;
            width:${item.size.w}px;
            height:${item.size.h}px;
            transform: rotate(${item.rotation}deg);
            z-index:${item.zIndex};
        `;

        if (item.type === "text") {
            html += `
<div class="shape" style="${style};
    color:${item.styles.color};
    font-size:${item.styles.fontSize}px;">
${item.text}
</div>
`;
        } else {
            html += `
<div class="shape" style="${style};
    background:${item.styles.backgroundColor};
"></div>
`;
        }
    });

    html += `
</div>
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-export.html";
    a.click();

    URL.revokeObjectURL(url);
});
