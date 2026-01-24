🎨 Figma-Style Design Tool (DOM-Only)

A lightweight Figma-inspired visual design editor built entirely using HTML, CSS, and Vanilla JavaScript, without Canvas, SVG engines, or external libraries.

This project demonstrates strong fundamentals in DOM manipulation, event handling, coordinate calculations, and centralized state management, closely following the given problem statement while extending it with additional shape support.

🔗 Live Demo

👉 Live Link: https://figma-lite.vercel.app/

🧠 Project Overview

This editor allows users to visually create, manipulate, and manage design elements on a canvas — similar in spirit to tools like Figma — but implemented using pure DOM elements.

The focus is on:

Correctness over shortcuts

Clear architecture

Single source of truth for state

Real-time UI synchronization

✨ Features
1. Shape Creation

Users can add the following shapes to the canvas:

Rectangle

Circle

Triangle

Text Box

Each shape:

Is represented by a <div>

Has a unique ID

Is created with default position and size

Stores its metadata in a centralized state (canvasStore)

✅ Circle and Triangle were added as extended features beyond the base requirements.

2. Single Element Selection

Only one element can be selected at a time

Clicking on a shape selects it

Clicking on empty canvas deselects it

Selected element shows:

Outline/border

Resize handles

Selection state is centrally managed so all tools act on the same element

3. Dragging

Shapes can be dragged using mouse

Offset-based movement logic

Movement is restricted within canvas boundaries

Position updates in real time and syncs with state

4. Resizing

Resizing allowed only from corner handles

Width and height update dynamically

Minimum size constraints prevent invalid dimensions

5. Rotation

Shapes support rotation using CSS transforms

Rotation is event-based and simple (no physics engine)

Rotation value is:

Applied visually

Stored in state

Restored on reload

6. Layers Panel

Displays all elements in a vertical list

Each layer represents one canvas element

Clicking a layer selects the corresponding shape

Controls available:

Move Up (bring forward)

Move Down (send backward)

Layer order syncs with:

z-index

Internal state array

7. Properties Panel

Allows editing of selected element properties:

Width

Height

Background color

Text content (for text elements only)

All changes:

Apply instantly

Stay synced with the selected element

Update automatically on selection change

8. Keyboard Interactions

Delete key → removes selected element

Arrow keys → move element by 5px

Keyboard actions:

Work only when an element is selected

Respect canvas boundaries

9. Save & Load (Persistence)

Canvas state is saved using localStorage

Stored as an array of objects containing:

{
  id,
  type,
  position,
  size,
  rotation,
  styles,
  zIndex
}


On page refresh:

Canvas is automatically reconstructed

Position, size, rotation, and layer order are preserved

10. Export Functionality

The editor supports exporting designs in two formats:

🔹 JSON Export

Downloads the internal layout data

Useful for persistence or future rendering

🔹 HTML Export

Generates a standalone HTML structure

Uses inline styles

Visually reproduces the current canvas state

🧱 Tech Stack

HTML5

CSS3

Vanilla JavaScript (No frameworks, no Canvas, no SVG)

🎯 Why This Project Stands Out

Strictly follows DOM-only constraint

Clean separation of UI and state

Centralized selection and data management

Extended beyond requirements with Circle & Triangle

Focused on clarity, correctness, and maintainability

📌 How to Run Locally
git clone your-repo-link
cd project-folder
open index.html

🏁 Final Note

This project was built to demonstrate real understanding, not shortcuts.
Every interaction — drag, resize, rotate, layer management, persistence — is handled manually through JavaScript and the DOM.
