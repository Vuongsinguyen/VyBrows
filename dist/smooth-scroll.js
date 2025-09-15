// Smooth scroll with ease-in-out for all anchor links and scroll triggers
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScrollTo(targetY, duration = 700) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start;
  function step(timestamp) {
    if (!start) start = timestamp;
    const time = Math.min(1, (timestamp - start) / duration);
    const eased = easeInOutQuad(time);
    window.scrollTo(0, startY + diff * eased);
    if (time < 1) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

// Intercept all anchor clicks with href starting with #
document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) {
        e.preventDefault();
        const offset = el.getBoundingClientRect().top + window.scrollY - 80;
        smoothScrollTo(offset, 700);
      }
    }
  });
});

// Expose for manual scroll triggers
window.smoothScrollTo = smoothScrollTo;
