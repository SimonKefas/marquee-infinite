document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SPEED = 0.5;                                         // px / frame

  document.querySelectorAll('[mq="wrap"]').forEach(wrap => {
    /* ──────────────────────────────────────────────────────────
       Stash a *pristine* copy of the list markup for reuse
       ─────────────────────────────────────────────────────── */
    const pristineMarkup = wrap.querySelector('[mq="list"]')?.outerHTML;
    if (!pristineMarkup) return;                                    // nothing to animate

    let rafId   = null;                                             // current rAF id
    let innerEl = null;                                             // the .mq-inner
    let lastW   = wrap.offsetWidth;                                 // track width

    build();                                                        // initial build
    observeSize();                                                  // watch wrapper size

    /* =========================================================
       BUILD (or REBUILD) ONE MARQUEE
       ======================================================= */
    function build() {
      /* 1  Clean up anything from a previous build */
      if (rafId)  cancelAnimationFrame(rafId);
      innerEl?.remove();                                            // removes old & its clones

      /* 2  Ensure exactly ONE list is back inside the wrapper */
      wrap.querySelector('[mq="list"]')?.remove();                  // stray copy (if any)
      wrap.insertAdjacentHTML('afterbegin', pristineMarkup);        // fresh copy
      const list = wrap.querySelector('[mq="list"]');               // will be moved next

      /* 3  Read per-instance data-attributes */
      const SPEED      = +wrap.dataset.speed || DEFAULT_SPEED;
      const dirFactor  = (wrap.dataset.direction || 'left').toLowerCase() === 'right' ? 1 : -1;
      const pauseHover = (wrap.dataset.pauseHover || '').toLowerCase() === 'true';

      /* 4  Build the flex strip and MOVE the list into it */
      innerEl = document.createElement('div');
      innerEl.className = 'mq-inner';
      wrap.appendChild(innerEl);
      innerEl.appendChild(list);                                    // move (not copy)

      /* 5  Measure one “block” = list width + gap */
      const gap        = parseFloat(getComputedStyle(innerEl).gap) || 0;
      const blockWidth = Math.round(list.offsetWidth + gap);        // integer px

      /* 6  Clone until we cover ≥ 2 × wrapper width */
      for (let w = blockWidth; w < wrap.offsetWidth * 2; w += blockWidth) {
        innerEl.insertAdjacentHTML('beforeend', pristineMarkup);
      }

      /* 7  Optional pause-on-hover */
      let paused = false;
      if (pauseHover) {
        wrap.onmouseenter = () => (paused = true);
        wrap.onmouseleave = () => (paused = false);
      }

      /* 8  Animate with modulo (no drift) */
      let offset = 0;                                               // stays in [-block, 0)
      (function step() {
        if (!paused) {
          offset = (offset + dirFactor * SPEED) % blockWidth;
          if (offset > 0) offset -= blockWidth;                     // normalise
          innerEl.style.transform = `translateX(${offset}px)`;
        }
        rafId = requestAnimationFrame(step);
      })();
    }

    /* =========================================================
       WATCH THE WRAPPER SIZE ONLY – real changes, not URL-bar jiggles
       ======================================================= */
    function observeSize() {
      new ResizeObserver(() => {
        const w = wrap.offsetWidth;
        if (w !== lastW) {                                          // real width change
          lastW = w;
          build();                                                  // rebuild once
        }
      }).observe(wrap);
    }
  });
});
