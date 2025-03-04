document.addEventListener('DOMContentLoaded', function() {
  /**
   * Infinite Horizontal Scroll (Marquee) with:
   * ------------------------------------------
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
    // Grab the first [mq="list"] inside this wrapper
    const originalList = wrapElem.querySelector('[mq="list"]');
    if (!originalList) return;

    // Read the speed (fallback if missing)
    const attrSpeed = parseFloat(wrapElem.getAttribute('data-speed'));
    const SCROLL_SPEED = isNaN(attrSpeed) ? DEFAULT_SPEED : attrSpeed;

    // Check if user wants to pause on hover
    const dataPauseValue = wrapElem.getAttribute('data-pause-hover');
    const PAUSE_ON_HOVER = dataPauseValue && dataPauseValue.toLowerCase() === 'true';

    // 1) Create a .mq-inner container and move the [mq="list"] into it
    const inner = document.createElement('div');
    inner.classList.add('mq-inner');
    wrapElem.appendChild(inner);
    inner.appendChild(originalList);

    // 2) Clone once, measure the distance from the first to the second (including gap), then remove clone
    const clone = originalList.cloneNode(true);
    inner.appendChild(clone);

    const lists = inner.children; // now should have [originalList, clone]
    if (lists.length < 2) return;

    const rect1 = lists[0].getBoundingClientRect();
    const rect2 = lists[1].getBoundingClientRect();
    const listGapWidth = rect2.left - rect1.left; // includes flex gap

    // remove the temporary clone
    inner.removeChild(clone);

    // 3) Duplicate [mq="list"] until total width >= 2 * wrapWidth
    const wrapWidth = wrapElem.offsetWidth;
    let totalWidth = listGapWidth;
    while (totalWidth < wrapWidth * 2) {
      const c = originalList.cloneNode(true);
      inner.appendChild(c);
      totalWidth += listGapWidth;
    }

    // 4) Animation with requestAnimationFrame, optionally paused on hover
    let offset = 0;
    let paused = false;

    // If user wants pause on hover, add the events
    if (PAUSE_ON_HOVER) {
      wrapElem.addEventListener('mouseenter', () => { paused = true; });
      wrapElem.addEventListener('mouseleave', () => { paused = false; });
    }

    function animate() {
      if (!paused) {
        offset -= SCROLL_SPEED;
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
