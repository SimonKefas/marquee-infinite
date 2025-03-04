# marquee-infinite

A lightweight, **vanilla JavaScript** solution for creating infinitely scrolling horizontal marquees. It allows you to configure **speed**, **direction**, and **pause‐on‐hover** via simple HTML attributes.

---

## Table of Contents

1. [Installation](#installation)  
2. [Usage](#usage)  
   - [HTML Structure](#html-structure)  
   - [Script Reference](#script-reference)  
   - [CSS Example](#css-example)  
3. [Attributes](#attributes)  
   - [data-speed](#data-speed)  
   - [data-direction](#data-direction)  
   - [data-pause-hover](#data-pause-hover)  
4. [Advanced Notes](#advanced-notes)  
5. [License](#license)

---

## Installation

No special build steps are required. Simply load the **marquee‐infinite** script via the following `<script>` tag near the end of your HTML (e.g., right before `</body>`).

```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/marquee-infinite@latest/script.js"></script>
```

This script automatically scans your page for elements marked with `[mq="wrap"]` and initializes the marquee effect.

---

## Usage

### HTML Structure

Each marquee consists of:

```html
<div mq="wrap" data-speed="1" data-direction="left" data-pause-hover="true">
  <div mq="list">
    <!-- Repeated items, images, or any HTML content -->
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>
```

- **`mq="wrap"`**: The marquee wrapper that clips the overflowing content.  
- **`mq="list"`**: A single list (or block) of items you want to scroll infinitely.

You can have multiple `[mq="wrap"]` elements on the same page, each with its own `[mq="list"]`.

### Script Reference

Include the script near the end of `<body>` so it can process your `[mq="wrap"]` elements:

```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/marquee-infinite@latest/script.js"></script>
</body>
</html>
```

When the page loads, the script automatically:

1. Finds each `[mq="wrap"]`.  
2. Creates an internal `.mq-inner` container.  
3. Clones `[mq="list"]` multiple times to ensure continuous scrolling.  
4. Animates the content based on your attributes (speed, direction, pause on hover).

### CSS Example

A minimal CSS setup might look like this:

```css
[mq="wrap"] {
  position: relative;
  overflow: hidden;
  width: 100%; /* or a fixed width if you prefer */
  border: 1px solid #aaa; /* for demo visibility */
  margin-bottom: 2rem;
}

.mq-inner {
  display: flex;
  white-space: nowrap;
  will-change: transform;
  gap: 1rem; /* default gap between consecutive lists/items */
}

/* Example: Bigger gap for wider screens */
@media (min-width: 768px) {
  .mq-inner {
    gap: 2.5rem;
  }
}

[mq="list"] {
  flex-shrink: 0; /* Each entire list is one 'block' */
}

/* Simple item styling (optional) */
[mq="list"] > * {
  padding: 1rem;
  border-right: 1px solid #ccc;
}
```

Feel free to customize the styling, width, gaps, or item layouts as needed. The script measures the final computed width and gaps automatically, ensuring seamless looping.

---

## Attributes

You can tailor each marquee by adding these attributes to the `[mq="wrap"]` element:

### `data-speed`

- **Type**: Number (pixels per animation frame).  
- **Usage**:  
  ```html
  <div mq="wrap" data-speed="2">
    <div mq="list"> ... </div>
  </div>
  ```
- **Default**: `0.5` (if omitted or invalid).  
- **Effect**: How many pixels the marquee moves per frame. Larger values = faster scrolling.

### `data-direction`

- **Type**: `"left"` or `"right"`.  
- **Usage**:  
  ```html
  <div mq="wrap" data-direction="right">
    <div mq="list"> ... </div>
  </div>
  ```
- **Default**: `"left"` (if omitted or invalid).  
- **Effect**: Which direction the content scrolls. If `"left"`, content moves leftward and enters from the right. If `"right"`, content moves rightward and enters from the left.

### `data-pause-hover`

- **Type**: String `"true"` to enable pause on hover, or omit/false for no pause.  
- **Usage**:  
  ```html
  <div mq="wrap" data-pause-hover="true">
    <div mq="list"> ... </div>
  </div>
  ```
- **Default**: `false` (if omitted or set to anything else).  
- **Effect**: If `true`, the marquee will pause when hovered by the mouse.

---

## Advanced Notes

- **Multiple Marquees**: You can have any number of `[mq="wrap"]` containers on the same page. Each can have its own `data-speed`, `data-direction`, and `data-pause-hover` settings.  
- **Responsive Gaps**: Because the script measures the gap via `getBoundingClientRect()`, you can adjust the CSS `gap` in media queries without breaking the infinite loop.  
- **Images**: If your marquee contains images, ensure they’re loaded for correct width calculations (e.g., place the script after the images or use `window.onload` if needed).  
- **Dynamic Resizing**: If the container `[mq="wrap"]` size changes drastically, you may need to re‐run the script. In that case, reinitialize or reload the page so widths are measured correctly.  
- **Performance**: For best results, keep `[mq="wrap"]` content size manageable, and rely on `requestAnimationFrame` for the smooth animation (already in the script).  

---

## License

[MIT License](./LICENSE) – You’re free to use, modify, and distribute for personal or commercial projects.

Enjoy your smooth, customizable, infinite marquees!