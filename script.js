let makeRectangle = document.querySelector('#makeRectangle')
let canvas = document.querySelector('#canvas')

let selectedBox = null;

let colorPicker = document.querySelector('#colorPicker')

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


function appendLayers(iconClass, shapeName, shapeId) {
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.dataset.shapeId = shapeId;   // shape ka ID yahan store

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

    // by default unhide hidden rahe
    unHideSpan.style.display = "none";

    // structure
    layer.appendChild(layerWrapper);
    layer.appendChild(hideSpan);
    layer.appendChild(unHideSpan);

    document.querySelector(".layers").appendChild(layer);

    /* ===================== LAYER CLICK → SHAPE SELECT ===================== */
    layer.addEventListener("click", (e) => {
        e.stopPropagation();

        const id = layer.dataset.shapeId;
        const shape = document.querySelector(`[data-id="${id}"]`);
        if (!shape) return;

        // sab deselect
        deselectBox();
        deselectCircle();
        deselectTriangle();
        deselectAllLayers();

        // shape ke type ke hisaab se select
        if (shape.classList.contains("newRectangle")) {
            selectBox(shape);
        } 
        else if (shape.classList.contains("newCircle")) {
            selectCircle(shape);
        } 
        else if (shape.classList.contains("newTriangle")) {
            selectTriangle(shape);
        }

        layer.classList.add("active");
    });

    /* ===================== HIDE ===================== */
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

    /* ===================== UNHIDE ===================== */
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

    canvas.appendChild(newRectangle)

    appendLayers("ri-rectangle-line", "Rectangle", id)


    makeSelectable(newRectangle)

    makeSelectedDraggable()


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
    box.classList.add("selected");


    // colorPicker.style.display = "flex"
    addResizeToSelectedBox();

    selectLayerByShapeId(box.dataset.id);
}

// deselecting rectangle
function deselectBox() {
    if (!selectedBox) return;

    selectedBox.classList.remove("selected");

    // colorPicker.style.display = "none"

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());


    selectedBox = null;
}


canvas.addEventListener("click", function () {
    deselectBox();
});

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

    canvas.appendChild(newCircle)

    appendLayers("ri-circle-line", "Circle", id)

    makeCircleSelect(newCircle)

    makeSelectedCircleDraggable()
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
    circle.classList.add('selectedCircle')

    addResizeToSelectedCircle();

    selectLayerByShapeId(circle.dataset.id);
}

function deselectCircle() {
    if (!selectedCircle) return;

    selectedCircle.classList.remove('selectedCircle')

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    selectedCircle = null;
}

canvas.addEventListener("click", function () {
    deselectCircle()
})

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

                // circle ko perfect round rakhne ke liye
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

document.addEventListener('keydown',(e)=>{
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if(e.key==="Delete"){
        if(!selectedCircle) return;

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

    canvas.appendChild(newTriangle)

    appendLayers("ri-triangle-line", "Triangle", id)

    makeTriangleSelect(newTriangle)

    makeSelectedTriangleDraggable()
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
    triangle.classList.add('selectedTriangle');

    addResizeToSelectedTriangle();

    selectLayerByShapeId(triangle.dataset.id);
}

function deselectTriangle() {
    if (!selectedTriangle) return;

    selectedTriangle.classList.remove('selectedTriangle');

    document.querySelectorAll(".resize-handle").forEach(h => h.remove());

    selectedTriangle = null;
}


canvas.addEventListener("click", function () {
    deselectTriangle();
    deselectAllLayers();
});

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

                // triangle ke liye free resize (perfect square ki condition nahi)
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


document.addEventListener('keydown',(e)=>{
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if(e.key==="Delete"){
        if(!selectedTriangle) return;

        document.querySelectorAll(".resize-handle").forEach(h => h.remove());

        deleteShapeAndLayer(selectedTriangle);
        selectedTriangle = null;
        deselectAllLayers();
    }
});

