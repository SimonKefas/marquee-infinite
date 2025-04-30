document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SPEED = 0.5;                           // px per frame

  document.querySelectorAll('[mq="wrap"]').forEach(wrap => {
    /* ----------------------------------------------------------------
     *  Keep the original <[mq="list"]> markup around so we can rebuild
     *  the marquee after a resize.
     * ---------------------------------------------------------------- */
    const originalList = wrap.querySelector('[mq="list"]');
    if (!originalList) return;                          // nothing to do
    const listMarkup = originalList.outerHTML;          // stash

    let rafId;                                          // current animation frame id

    /* ---- build once, then rebuild (debounced) on resize ------------- */
    build();
    window.addEventListener('resize', debounce(rebuild, 200));

    /* =================================================================
     *  BUILD ONE MARQUEE INSTANCE
     * ================================================================= */
    function build() {
      /* ...............................................................
       *  1.  Read data-attributes
       * ............................................................... */
      const SCROLL_SPEED   = +(wrap.dataset.speed) || DEFAULT_SPEED;
      const direction      = (wrap.dataset.direction || 'left').toLowerCase() === 'right' ? 'right' : 'left';
      const PAUSE_ON_HOVER = (wrap.dataset.pauseHover || '').toLowerCase() === 'true';

      /* ...............................................................
       *  2.  Create inner flex-strip and measure its “block” width
       * ............................................................... */
      const inner = document.createElement('div');
      inner.className = 'mq-inner';
      wrap.appendChild(inner);
      inner.insertAdjacentHTML('beforeend', listMarkup);

      const gap           = parseFloat(getComputedStyle(inner).gap) || 0;
      const listWidth     = inner.firstElementChild.offsetWidth;
      const blockWidth    = Math.round(listWidth + gap);      // integer px
      const wrapWidth     = wrap.offsetWidth;

      /* ...............................................................
       *  3.  Duplicate until we have ≥ 2 × wrapWidth
       * ............................................................... */
      let totalWidth = blockWidth;
      while (totalWidth < wrapWidth * 2) {
        inner.insertAdjacentHTML('beforeend', listMarkup);
        totalWidth += blockWidth;
      }

      /* ...............................................................
       *  4.  Handle optional pause-on-hover
       * ............................................................... */
      let paused = false;
      if (PAUSE_ON_HOVER) {
        wrap.addEventListener('mouseenter', () => paused = true);
        wrap.addEventListener('mouseleave', () => paused = false);
      }

      /* ...............................................................
       *  5.  Animate with modulo to avoid drift
       * ............................................................... */
      let offset = 0;                                   // always in [-blockWidth, 0)
      function step() {
        if (!paused) {
          offset = direction === 'left'
            ? (offset - SCROLL_SPEED) % blockWidth
            : (offset + SCROLL_SPEED) % blockWidth;

          if (offset > 0) offset -= blockWidth;         // normalise
          inner.style.transform = `translateX(${offset}px)`;
        }
        rafId = requestAnimationFrame(step);
      }
      step();
    }

    /* =================================================================
     *  REBUILD (called after a resize)
     * ================================================================= */
    function rebuild() {
      cancelAnimationFrame(rafId);                      // stop old loop
      wrap.querySelector('.mq-inner')?.remove();        // clear old DOM
      build();                                          // fresh build
    }

    /* =================================================================
     *  Small debounce helper
     * ================================================================= */
    function debounce(fn, delay = 200) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
      };
    }
  });
});
