document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[mq='wrap']").forEach((wrap) => {
      const list = wrap.querySelector("[mq='list']");
      const items = Array.from(list.children);
      const direction = wrap.getAttribute("mq-direction") || "left";
      const gap = parseInt(wrap.getAttribute("mq-gap")) || 0;
      const speed = 50;
  
      list.style.setProperty("--mq-gap", `${gap}px`);
      const itemWidth = items[0].offsetWidth + gap;
      const totalItems = items.length;
  
      if (wrap.hasAttribute("mq-fullscreen")) {
        const sectionWidth = wrap.closest("section")?.offsetWidth || window.innerWidth;
        const minItemsNeeded = Math.ceil(sectionWidth / itemWidth);
        while (list.children.length < minItemsNeeded * 2) {
          list.innerHTML += list.innerHTML;
        }
      } else {
        list.innerHTML += list.innerHTML;
      }
  
      let pos = 0;
      function animateMarquee() {
        const step = (direction === "left" ? -1 : 1) * (speed / 60);
        pos += step;
        if (Math.abs(pos) >= itemWidth * totalItems) pos = 0;
        list.style.transform = `translate3d(${pos}px, 0, 0)`;
        requestAnimationFrame(animateMarquee);
      }
      animateMarquee();
    });
  });
  