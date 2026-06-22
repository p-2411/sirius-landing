// Scroll-depth milestones → PostHog custom events (cookieless).
// PostHog already captures pageviews, device, and time-on-page (via pageleave)
// natively, so this only adds the explicit 25/50/75/100% scroll breakdown.
// Pure client-side measurement — no cookies, no storage.

(function () {
  function capture(name, props) {
    try { if (window.posthog && window.posthog.capture) window.posthog.capture(name, props); } catch (e) {}
  }

  var marks = [25, 50, 75, 100], hit = {}, ticking = false;
  function measure() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (!hit[m] && pct >= m) { hit[m] = 1; capture('scroll_depth', { depth: m + '%' }); }
    }
    if (hit[100]) window.removeEventListener('scroll', onScroll);
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    window.requestAnimationFrame(function () { measure(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  measure(); // short pages may already be at 100%
})();
