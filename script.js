document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SPEED = 0.5;                                       // px / frame

  document.querySelectorAll('[mq="wrap"]').forEach(wrap => {
    let rafId = null;                                              // current rAF id
    let lastWrapWidth = wrap.offsetWidth;                          // track width
    let resizeObs;                                                 // ResizeObserver

    build();                                                       // first build
    observe();                                                     // watch size

    /* =========================================================
     * BUILD (or RE-BUILD) ONE MARQUEE
     * ======================================================= */
    function build() {
      // 1. stop and clear anything from a previous build
      if (rafId) cancelAnimationFrame(rafId);
      wrap.querySelector('.mq-inner')?.remove();

      // 2. grab the *current* [mq="list"] element (the one we will move)
      const originalList = wrap.querySelector('[mq="list"]');
      if (!originalList) return;                                   // nothing to animate

      const listMarkup = originalList.outerHTML;                   // for cloning later

      // 3. read per-instance data-attributes
      const SPEED      = +(wrap.dataset.speed) || DEFAULT_SPEED;
      const dirFactor  = (wrap.dataset.direction || 'left').toLowerCase() === 'right' ? 1 : -1;
      const pauseHover = (wrap.dataset.pauseHover || '').toLowerCase() === 'true';

      // 4. build the inner strip and move the list into it
      const inner = document.createElement('div');
      inner.className = 'mq-inner';
      wrap.appendChild(inner);
      inner.appendChild(originalList);                              // *** move, don’t copy ***

      // 5. measure one “block” = list width + gap
      const gap   = parseFloat(getComputedStyle(inner).gap) || 0;
      const block = Math.round(originalList.offsetWidth + gap);    // integer px

      // 6. clone until we cover ≥ 2 × wrapper width
      let need = wrap.offsetWidth * 2;
      for (let w = block; w < need; w += block) {
        inner.insertAdjacentHTML('beforeend', listMarkup);
      }

      // 7. optional pause on hover
      let paused = false;
      if (pauseHover) {
        wrap.onmouseenter = () => (paused = true);
        wrap.onmouseleave = () => (paused = false);
      }

      // 8. animate with modulo (no drift)
      let offset = 0;                                              // keep in [-block, 0)
      (function step() {
        if (!paused) {
          offset = (offset + dirFactor * SPEED) % block;
          if (offset > 0) offset -= block;                         // normalise: always ≤ 0
          inner.style.transform = `translateX(${offset}px)`;
        }
        rafId = requestAnimationFrame(step);
      })();
    }

    /* =========================================================
     * WATCH THE WRAPPER’S SIZE
     * ======================================================= */
    function observe() {
      resizeObs = new ResizeObserver(entries => {
        const newW = wrap.offsetWidth;
        if (newW !== lastWrapWidth) {                              // real change?
          lastWrapWidth = newW;
          build();                                                 // rebuild once
        }
      });
      resizeObs.observe(wrap);
    }
  });
});
