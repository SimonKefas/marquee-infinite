document.addEventListener('DOMContentLoaded', function() {
  /**
   * Infinite Horizontal Scroll (Marquee)
   *   - data-speed="<number>" controls the speed (px/frame) per [mq="wrap"].
   *   - data-pause-hover="true" pauses on hover.
   *   - data-direction="left" or "right" sets the scroll direction.
   *
   * If data-speed is invalid or missing, it falls back to DEFAULT_SPEED (0.5).
   */

  const DEFAULT_SPEED = 0.5; // Fallback speed

  // Get all marquee wrappers
  const wraps = document.querySelectorAll('[mq="wrap"]');
  wraps.forEach(initMarquee);

  function initMarquee(wrapElem) {
    const originalList = wrapElem.querySelector('[mq="list"]');
    if (!originalList) return;

    // 1) Read user-defined attributes
    const attrSpeed = parseFloat(wrapElem.getAttribute('data-speed'));
    const SCROLL_SPEED = isNaN(attrSpeed) ? DEFAULT_SPEED : attrSpeed;

    const PAUSE_ON_HOVER = (wrapElem.getAttribute('data-pause-hover') || '').toLowerCase() === 'true';
    const direction = ((wrapElem.getAttribute('data-direction') || '').toLowerCase() === 'right') ? 'right' : 'left';

    // 2) Create an inner container and move [mq="list"] into it
    const inner = document.createElement('div');
    inner.classList.add('mq-inner');
    wrapElem.appendChild(inner);
    inner.appendChild(originalList);

    // 3) Measure the content width of the original list
    const listWidth = originalList.getBoundingClientRect().width;

    // 4) Duplicate the list until total width >= (wrap width + list width)
    // This ensures there is always a copy coming in when one scrolls out.
    let totalWidth = listWidth;
    while (totalWidth < wrapElem.offsetWidth + listWidth) {
      const clone = originalList.cloneNode(true);
      inner.appendChild(clone);
      totalWidth += listWidth;
    }

    // 5) Animate the marquee
    let offset = 0;
    let paused = false;

    if (PAUSE_ON_HOVER) {
      wrapElem.addEventListener('mouseenter', () => { paused = true; });
      wrapElem.addEventListener('mouseleave', () => { paused = false; });
    }

    function animate() {
      if (!paused) {
        if (direction === 'left') {
          offset -= SCROLL_SPEED;
          // Once we've scrolled one full copy's width, snap back
          if (offset <= -listWidth) {
            offset += listWidth;
          }
        } else {
          offset += SCROLL_SPEED;
          if (offset >= listWidth) {
            offset -= listWidth;
          }
        }
        inner.style.transform = `translateX(${offset}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
});
