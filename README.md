# Infinite Horizontal Scroll (Marquee) – Documentation

This repository contains a **vanilla JavaScript** solution for creating a performant, infinitely scrolling horizontal marquee effect. It uses modern best practices like `requestAnimationFrame`, flex-based layout, and attribute-based configuration.

## Table of Contents

1. [Features](#features)  
2. [Requirements](#requirements)  
3. [Usage & Setup](#usage--setup)  
   - [HTML Structure](#html-structure)  
   - [CSS](#css)  
   - [JavaScript](#javascript)  
4. [Configuration Attributes](#configuration-attributes)  
   - [data-speed](#data-speed)  
   - [data-pause-hover](#data-pause-hover)  
5. [Advanced Notes & Customization](#advanced-notes--customization)  
   - [Responsive / Dynamic Width Changes](#responsive--dynamic-width-changes)  
   - [Different Speeds per Marquee](#different-speeds-per-marquee)  
   - [Pause on Hover](#pause-on-hover)  
   - [Gap Handling](#gap-handling)  
6. [License](#license)

---

## Features

- **Infinite Looping**: Content appears to scroll continuously from right to left with no visible breaks.  
- **Flex Layout**: `.mq-inner` is a flex container that supports CSS `gap`, making it easy to adjust spacing between lists.  
- **Attribute-Based Configuration**: Each marquee can have a custom scroll speed and an optional “pause on hover” behavior.  
- **Performant Animations**: Uses `requestAnimationFrame` and hardware-accelerated transforms (`will-change: transform` in CSS).  
- **Lightweight, No Dependencies**: Pure vanilla JavaScript, minimal DOM manipulation.

---

## Requirements

- A **modern browser** that supports ES5+ JavaScript, `requestAnimationFrame`, and `Flexbox`.
- Basic knowledge of HTML/CSS to integrate it into your project.  
- No external libraries (like jQuery) are required.

---

## Usage & Setup

### HTML Structure

Your basic markup for each marquee container is:

```html
<!-- One marquee container -->
<div mq="wrap" data-speed="0.8" data-pause-hover="true">
  <div mq="list">
    <!-- Repeated items, images, or any HTML content -->
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    ...
  </div>
</div>
```

**Key points**:  
- `mq="wrap"` is the outer container that will be cropped to prevent scrollbars from showing the overflow.  
- Inside it, there must be exactly one `mq="list"` element containing your marquee items.

### CSS

You are free to style this as you like, but **the JavaScript expects** a **flex container** for the scrolled content. We do this by dynamically creating a `.mq-inner` inside `[mq="wrap"]`, and moving `[mq="list"]` into it. A minimal example:

```css
[mq="wrap"] {
  position: relative;
  overflow: hidden; /* Hides the overflowing content */
  width: 100%; /* or a fixed width */
  border: 1px solid #aaa; /* For visual demo only */
}

.mq-inner {
  display: flex;
  white-space: nowrap;
  will-change: transform; /* Helps performance on some browsers */
  gap: 1rem; /* Default gap between marquee lists/items */
}

@media (min-width: 768px) {
  .mq-inner {
    gap: 2.5rem; /* Example: a larger gap for bigger screens */
  }
}

[mq="list"] {
  flex-shrink: 0; /* Don’t shrink these blocks */
}

/* Example item styling inside the list */
[mq="list"] > * {
  padding: 1rem;
  border-right: 1px solid #ccc;
  display: inline-block;
}
```

You can customize widths, gaps, or add your own design. The marquee code will measure the actual width plus gap, so the loop remains smooth.

### JavaScript

Include the following script on your page **after** your HTML. You can place it in a separate `.js` file or inline in a `<script>` tag.

```js
document.addEventListener('DOMContentLoaded', function() {
  /**
   * Infinite Horizontal Scroll (Marquee) with:
   * 1) data-speed="<number>" attribute to control speed per [mq="wrap"].
   * 2) data-pause-hover="true" to pause animation on hover.
   *
   * If data-speed is missing or invalid, it falls back to DEFAULT_SPEED.
   * If data-pause-hover is "true", hovering on that marquee pauses the scroll.
   * Otherwise, it remains always scrolling.
   */

  const DEFAULT_SPEED = 0.5; // Fallback speed if no data-speed is specified

  const wraps = document.querySelectorAll('[mq="wrap"]');
  wraps.forEach(initMarquee);

  function initMarquee(wrapElem) {
    const originalList = wrapElem.querySelector('[mq="list"]');
    if (!originalList) return; // No list found, abort initialization

    // Read the speed from data attribute (or fallback to default)
    const attrSpeed = parseFloat(wrapElem.getAttribute('data-speed'));
    const SCROLL_SPEED = isNaN(attrSpeed) ? DEFAULT_SPEED : attrSpeed;

    // Check if we should pause on hover (data-pause-hover="true")
    const dataPauseValue = wrapElem.getAttribute('data-pause-hover');
    const PAUSE_ON_HOVER = dataPauseValue && dataPauseValue.toLowerCase() === 'true';

    // 1) Create a .mq-inner wrapper
    const inner = document.createElement('div');
    inner.classList.add('mq-inner');
    wrapElem.appendChild(inner);

    // 2) Move the original [mq="list"] into .mq-inner
    inner.appendChild(originalList);

    // 3) Clone [mq="list"] once to measure the total width (including gap)
    const clone = originalList.cloneNode(true);
    inner.appendChild(clone);

    const lists = inner.children; 
    if (lists.length < 2) return;

    // Measure the distance from the first block's left to the second block's left
    const rect1 = lists[0].getBoundingClientRect();
    const rect2 = lists[1].getBoundingClientRect();
    const listGapWidth = rect2.left - rect1.left; // includes flex gap

    // Remove the temporary clone
    inner.removeChild(clone);

    // 4) Duplicate until total width >= 2x the container width
    const wrapWidth = wrapElem.offsetWidth;
    let totalWidth = listGapWidth;
    while (totalWidth < wrapWidth * 2) {
      const c = originalList.cloneNode(true);
      inner.appendChild(c);
      totalWidth += listGapWidth;
    }

    // 5) Animate with requestAnimationFrame
    let offset = 0;
    let paused = false;

    // Pause on hover if requested
    if (PAUSE_ON_HOVER) {
      wrapElem.addEventListener('mouseenter', () => { paused = true; });
      wrapElem.addEventListener('mouseleave', () => { paused = false; });
    }

    function animate() {
      if (!paused) {
        offset -= SCROLL_SPEED;
        // Snap offset back by one full block (list + gap) when scrolled fully
        if (Math.abs(offset) >= listGapWidth) {
          offset += listGapWidth;
        }
        inner.style.transform = `translateX(${offset}px)`;
      }
      requestAnimationFrame(animate);
    }

    animate();
  }
});
```

---

## Configuration Attributes

### `data-speed`

- **Usage**: `data-speed="1"`, `data-speed="0.3"`, etc.
- **Type**: Number (pixels per frame)
- **Description**: Determines how many pixels per animation frame the marquee will move.  
- **Default**: If absent or invalid, uses `DEFAULT_SPEED = 0.5`.

### `data-pause-hover`

- **Usage**: `data-pause-hover="true"`
- **Type**: Boolean (expects the string `"true"` to enable pausing)
- **Description**: If set to `"true"`, the marquee animation will pause when the user hovers over the `[mq="wrap"]`.  
- **Default**: If not set or set to something else, the marquee scroll is never paused on hover.

---

## Advanced Notes & Customization

### Responsive / Dynamic Width Changes

By default, the code measures widths on `DOMContentLoaded`. If your layout changes size drastically (e.g. due to window resizing or dynamic content injection), you can:

- **Re-initialize** the marquee logic after the layout changes.
- Or **debounce** a `window.onresize` event and then re-run the `initMarquee` for each `[mq="wrap"]`.

### Different Speeds per Marquee

Each `[mq="wrap"]` can have its own `data-speed` attribute. For instance:
```html
<div mq="wrap" data-speed="0.8"> ... </div>
<div mq="wrap" data-speed="2"> ... </div>
```
This way, you can have multiple, differently animated marquees on the same page.

### Pause on Hover

If you only want some marquees to pause on hover, set `data-pause-hover="true"` on those marquees only. Others will continue scrolling even if hovered.

### Gap Handling

Because we measure the **distance between two consecutive `[mq="list"]` blocks** in the flex container, you can freely use `gap` in your CSS. The script will automatically account for that space when duplicating and snapping. This makes it easy to adjust spacing via media queries without breaking the infinite loop alignment.

---

## License

(This is an example section – include your actual license if needed.)

MIT License. You’re free to use, modify, and distribute this script for personal or commercial projects. No attribution is strictly required, though it is always appreciated!

---

Feel free to **fork**, **modify**, or **extend** this code to fit your specific project needs. If you encounter any issues or want to propose improvements, open an issue or create a pull request. Happy scrolling!