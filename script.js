document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SPEED = 0.5;                     // px / frame

  document.querySelectorAll('[mq="wrap"]').forEach(wrap => {
    const originalList = wrap.querySelector('[mq="list"]');
    if (!originalList) return;

    const listMarkup = originalList.outerHTML;    // stash for rebuild
    let rafId;

    build();                                      // first build
    window.addEventListener('resize', debounce(rebuild, 200));

    /* ===== build one marquee instance ====================== */
    function build() {
      /* 1. read data-attributes */
      const SCROLL_SPEED   = +(wrap.dataset.speed) || DEFAULT_SPEED;
      const direction      = (wrap.dataset.direction || 'left').toLowerCase() === 'right' ? 'right' : 'left';
      const PAUSE_ON_HOVER = (wrap.dataset.pauseHover || '').toLowerCase() === 'true';

      /* 2. create inner strip, move the ORIGINAL list into it */
      const inner = document.createElement('div');
      inner.className = 'mq-inner';
      wrap.appendChild(inner);
      inner.appendChild(originalList);            // <<<<<< moved, not copied!

      /* 3. measure one “block” */
      const gap        = parseFloat(getComputedStyle(inner).gap) || 0;
      const listWidth  = originalList.offsetWidth;
      const blockWidth = Math.round(listWidth + gap);
      const wrapWidth  = wrap.offsetWidth;

      /* 4. duplicate until ≥ 2 × wrap width */
      let totalWidth = blockWidth;
      while (totalWidth < wrapWidth * 2) {
        inner.insertAdjacentHTML('beforeend', listMarkup);
        totalWidth += blockWidth;
      }

      /* 5. optional pause-on-hover */
      let paused = false;
      if (PAUSE_ON_HOVER) {
        wrap.addEventListener('mouseenter', () => paused = true);
        wrap.addEventListener('mouseleave', () => paused = false);
      }

      /* 6. animate with modulo */
      let offset = 0;                             // range [-blockWidth, 0)
      function step() {
        if (!paused) {
          offset = direction === 'left'
            ? (offset - SCROLL_SPEED) % blockWidth
            : (offset + SCROLL_SPEED) % blockWidth;

          if (offset > 0) offset -= blockWidth;   // normalise
          inner.style.transform = `translateX(${offset}px)`;
        }
        rafId = requestAnimationFrame(step);
      }
      step();
    }

    /* ===== rebuild after resize ============================ */
    function rebuild() {
      cancelAnimationFrame(rafId);
      wrap.querySelector('.mq-inner')?.remove();
      // re-insert a fresh copy of the list so build() can move it again
      wrap.insertAdjacentHTML('afterbegin', listMarkup);
      build();
    }

    /* ===== tiny debounce helper ============================ */
    function debounce(fn, delay = 200) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
      };
    }
  });
});
