// Cookieless engagement tracking → Vercel Web Analytics custom events.
// Measures scroll depth (25/50/75/100%) and time-on-page. No cookies, no storage:
// these are pure client-side measurements, so nothing is persisted about the user.

(function () {
  // Vercel Analytics queue stub (safe if /_vercel/insights/script.js hasn't loaded yet)
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  function track(name, data) { try { window.va('event', { name: name, data: data }); } catch (e) {} }

  // --- Scroll depth milestones ---
  var marks = [25, 50, 75, 100], hit = {}, ticking = false;
  function measure() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (!hit[m] && pct >= m) { hit[m] = 1; track('Scroll Depth', { depth: m + '%' }); }
    }
    if (hit[100]) window.removeEventListener('scroll', onScroll);
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    window.requestAnimationFrame(function () { measure(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  measure(); // short pages may already be at 100%

  // --- Time on page (bucketed, sent once when the page is hidden/closed) ---
  var start = Date.now(), sent = false;
  function bucket(s) {
    if (s < 10) return '0-10s';
    if (s < 30) return '10-30s';
    if (s < 60) return '30-60s';
    if (s < 180) return '1-3m';
    if (s < 600) return '3-10m';
    return '10m+';
  }
  function sendTime() {
    if (sent) return; sent = true;
    track('Time on Page', { duration: bucket(Math.round((Date.now() - start) / 1000)) });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') sendTime();
  });
  window.addEventListener('pagehide', sendTime);
})();
