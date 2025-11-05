document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SPEED = 0.5;                                   // px / frame

  document.querySelectorAll('[mq="wrap"]').forEach(wrap => {
    /* Keep a pristine copy of the list for every rebuild */
    const pristine = wrap.querySelector('[mq="list"]')?.outerHTML;
    if (!pristine) return;

    let rafId = null;
    let inner = null;
    let lastW = wrap.offsetWidth;

    build();                              // first paint
    observeSize();                        // rebuild only on real width changes

    /* -------- build / rebuild one marquee ---------------- */
    function build() {
      if (rafId) cancelAnimationFrame(rafId);
      inner?.remove();                    // remove old strip & clones

      /* ensure ONE fresh list is back inside the wrapper */
      wrap.querySelector('[mq="list"]')?.remove();
      wrap.insertAdjacentHTML('afterbegin', pristine);
      const list = wrap.querySelector('[mq="list"]');   // will move next

      /* read instance options */
      const SPEED      = +wrap.dataset.speed || DEFAULT_SPEED;
      const dir        = (wrap.dataset.direction || 'left').toLowerCase()==='right' ? 1 : -1;
      const PAUSE_HOV  = (wrap.dataset.pauseHover || '').toLowerCase()==='true';

      /* build the flex strip */
      inner = document.createElement('div');
      inner.className = 'mq-inner';
      wrap.appendChild(inner);
      inner.appendChild(list);            // move, don't copy

      /* measure one block */
      const gap        = parseFloat(getComputedStyle(inner).gap) || 0;
      const wrapWidth  = wrap.offsetWidth;
      const blockWidth = list.getBoundingClientRect().width;
      const block      = Math.ceil(blockWidth + gap);

      if (!Number.isFinite(block) || block <= 0) {
        console.warn('[marquee-infinite] Ignoring marquee with zero-width content.', wrap);
        return;
      }

      /* clone just enough lists to cover the viewport + one extra block */
      const targetWidth = wrapWidth + block;
      const required    = Math.max(2, Math.ceil(targetWidth / block));
      const fragment    = document.createDocumentFragment();

      for (let i = 1; i < required; i++) {
        fragment.appendChild(list.cloneNode(true));
      }

      inner.appendChild(fragment);

      /* optional pause-on-hover */
      let paused = false;
      if (PAUSE_HOV) {
        wrap.onmouseenter = () => paused = true;
        wrap.onmouseleave = () => paused = false;
      }

      /* animate */
      let offset = 0;                     // stays in [-block,0)
      (function step() {
        if (!paused) {
          offset = (offset + dir * SPEED) % block;
          if (offset > 0) offset -= block;
          inner.style.transform = `translateX(${offset}px)`;
        }
        rafId = requestAnimationFrame(step);
      })();
    }

    /* -------- watch just the wrapper’s width ------------- */
    function observeSize() {
      new ResizeObserver(() => {
        const w = wrap.offsetWidth;
        if (w !== lastW) {
          lastW = w;
          build();
        }
      }).observe(wrap);
    }
  });
});
