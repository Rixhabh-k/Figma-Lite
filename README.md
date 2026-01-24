# 🎨 FIGMA STYLE DESIGN TOOL (DOM ONLY)

## 🔗 LIVE LINKS
- 🚀 Live Demo  : https://figma-lite.vercel.app/

## 🎯 PROJECT OVERVIEW
- 🧩 DOM based visual design editor
- 🎨 Inspired by Figma
- ❌ No Canvas
- ❌ No SVG
- ❌ No external libraries
- ✅ Built using HTML, CSS, Vanilla JavaScript

## 🧱 SUPPORTED ELEMENTS
- ⬛ Rectangle
- ⚪ Circle
- 🔺 Triangle
- 🔤 Text Box

## ⚙️ CORE FUNCTIONALITIES

### ➕ ELEMENT CREATION
- 📦 Each element created as a `div`
- 🆔 Unique ID assigned
- 📐 Default size and position
- 🗂️ Element metadata stored in state

### 🎯 SINGLE ELEMENT SELECTION
- ☝️ Only one element selectable at a time
- 🖱️ Click element → select
- 🌌 Click canvas → deselect
- 🔲 Selection outline visible
- 🟦 Resize handles on selection

### 🖐️ DRAGGING
- 🖱️ Mouse based dragging
- 📍 Offset based movement logic
- 🧱 Restricted inside canvas
- 🔄 Real time position update

### 📏 RESIZING
- 🔲 Corner handles only
- 📐 Dynamic width & height update
- 🚫 Minimum size constraint applied

### 🔄 ROTATION
- 🌀 Rotation using CSS `transform`
- 🖱️ Event based rotation logic
- 💾 Rotation state preserved

### 🗂️ LAYERS PANEL
- 📋 Vertical list of elements
- 🎯 Click layer → select element
- ⬆️ Move Up (bring forward)
- ⬇️ Move Down (send backward)
- 🎚️ Z-index synced with state

### 🎛️ PROPERTIES PANEL
- 📐 Width control
- 📏 Height control
- 🎨 Background color control
- ✏️ Text content editing
- ⚡ Real time updates

### ⌨️ KEYBOARD INTERACTIONS
- ❌ Delete key → remove element
- ⬅️➡️⬆️⬇️ Arrow keys → move by 5px
- 🧱 Boundary constraints applied
- 🎯 Works only on selected element

### 💾 SAVE AND LOAD
- 🗄️ Uses `localStorage`
- 📦 State stored as array of objects
- 🔄 Auto load on refresh
- 🧠 Position, size, rotation & layer order restored

### 📤 EXPORT FUNCTIONALITY
- 📄 Export as JSON
- 🌐 Export as HTML
- 🧾 Inline styles used
- 🎯 Matches current canvas state

## 🧰 TECH STACK
- 🟠 HTML5
- 🔵 CSS3
- 🟡 Vanilla JavaScript

## 🏁 FINAL NOTE
- ✅ Built with clean architecture
- 🧠 Single source of truth for state
- 🚀 Focused on correctness & clarity
- 💪 Extended features beyond base requirements
