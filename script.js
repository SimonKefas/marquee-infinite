document.addEventListener('DOMContentLoaded', function() {
  /**
   * Infinite Horizontal Scroll (Marquee) with:
   *   - data-speed="<number>" to control speed (px/frame) per [mq="wrap"].
   *   - data-pause-hover="true" to pause on hover.
   *   - data-direction="left" or "right" to pick which way the content scrolls.
   * 
   * If data-speed is missing or invalid, it falls back to DEFAULT_SPEED (0.5).
   * If data-pause-hover is "true", animation pauses on hover.
   * If data-direction is "right", content moves right; otherwise, "left".
   */

  const DEFAULT_SPEED = 0.5; // Fallback speed if no data-speed is specified

  // Grab all marquee wrappers
  const wraps = document.querySelectorAll('[mq="wrap"]');
  wraps.forEach(initMarquee);

  function initMarquee(wrapElem) {
    const originalList = wrapElem.querySelector('[mq="list"]');
    if (!originalList) return;

    // 1) Get user-defined attributes
    // Speed
    const attrSpeed = parseFloat(wrapElem.getAttribute('data-speed'));
    const SCROLL_SPEED = isNaN(attrSpeed) ? DEFAULT_SPEED : attrSpeed;

    // Pause on Hover
    const dataPauseValue = wrapElem.getAttribute('data-pause-hover');
    const PAUSE_ON_HOVER = dataPauseValue && dataPauseValue.toLowerCase() === 'true';

    // Direction
    const dataDirValue = wrapElem.getAttribute('data-direction');
    // defaults to 'left' if none or invalid
    const direction = (dataDirValue && dataDirValue.toLowerCase() === 'right')
      ? 'right'
      : 'left';

    // 2) Create a .mq-inner container and move the [mq="list"] into it
    const inner = document.createElement('div');
    inner.classList.add('mq-inner');
    wrapElem.appendChild(inner);
    inner.appendChild(originalList);

    // 3) Temporarily clone the list to measure distance (including gap)
    const clone = originalList.cloneNode(true);
    inner.appendChild(clone);

    const lists = inner.children;
    if (lists.length < 2) return;

    // distance from left-edge of first child to left-edge of second child
    const rect1 = lists[0].getBoundingClientRect();
    const rect2 = lists[1].getBoundingClientRect();
    const listGapWidth = rect2.left - rect1.left; // includes flex gap

    // remove the temporary clone
    inner.removeChild(clone);

    // 4) Duplicate the [mq="list"] until total width >= 2 * wrap width
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

    // If user wants pause on hover, set up event listeners
    if (PAUSE_ON_HOVER) {
      wrapElem.addEventListener('mouseenter', () => { paused = true; });
      wrapElem.addEventListener('mouseleave', () => { paused = false; });
    }

    function animate() {
      if (!paused) {
        if (direction === 'left') {
          offset -= SCROLL_SPEED;
          // If we've scrolled one block's width to the left, snap back
          if (offset <= -listGapWidth) {
            offset += listGapWidth;
          }
        } else {
          // direction === 'right'
          offset += SCROLL_SPEED;
          // If we've scrolled one block's width to the right, snap back
          if (offset >= listGapWidth) {
            offset -= listGapWidth;
          }
        }
        inner.style.transform = `translateX(${offset}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
});
