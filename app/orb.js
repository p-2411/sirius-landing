// Hero orb — a rotating, interconnected sphere of signals on a 2D canvas.
// Ported inline from the standalone bundle (no React / no iframe). Auto-rotates,
// and leans toward the cursor when you hover near it (magnetism). Surface +
// interior nodes, nearest-neighbour edges, hubs slightly brighter. Mounts onto
// <canvas id="signalField">; respects prefers-reduced-motion and pauses off-screen.

(function () {
  var canvas = document.getElementById('signalField');
  if (!canvas) return;
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var TWO = Math.PI * 2;
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var W = 0, H = 0, R = 0, cx = 0, cy = 0, focal = 1;
  var nodes = [], edges = [];
  var inView = true, last = 0, rafId = 0, rt = 0;
  var rect = null, mx = -9999, my = -9999, mEngaged = false, mStr = 0, mInside = false;
  var autoRY = 0.6, rx = -0.25, ry = 0.6, trx = -0.25, tryy = 0.6;

  function build() {
    rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W * 0.5; cy = H * 0.5;
    R = Math.min(W, H) * 0.45; focal = R * 2.9;
    nodes = []; edges = [];

    var area = W * H;
    var Nsurf = Math.max(52, Math.min(92, Math.round(area / 5900)));
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < Nsurf; i++) {
      var yy = 1 - (i / (Nsurf - 1)) * 2;
      var rr = Math.sqrt(Math.max(0, 1 - yy * yy));
      var th = i * golden + rand(-0.06, 0.06);
      var rad = R * rand(0.985, 1.0);
      nodes.push({ X: Math.cos(th) * rr * rad, Y: yy * rad, Z: Math.sin(th) * rr * rad,
        r: rand(1.4, 2.0), a: rand(0.5, 0.66), ph: rand(0, TWO),
        hub: 0, edges: [], sx: 0, sy: 0, sc: 1, dp: 0.5 });
    }
    var Nin = Math.round(Nsurf * 0.16);
    var minD2 = (R * 0.34) * (R * 0.34); // keep interior nodes from clumping together
    for (var k = 0; k < Nin; k++) {
      var X, Y, Z, tries = 0, okp;
      do {
        var u = rand(0, TWO), v = Math.acos(rand(-1, 1)), rd = R * rand(0.30, 0.74);
        X = rd * Math.sin(v) * Math.cos(u); Y = rd * Math.cos(v); Z = rd * Math.sin(v) * Math.sin(u);
        okp = true;
        for (var q = 0; q < nodes.length; q++) {
          var dX = nodes[q].X - X, dY = nodes[q].Y - Y, dZ = nodes[q].Z - Z;
          if (dX * dX + dY * dY + dZ * dZ < minD2) { okp = false; break; }
        }
        tries++;
      } while (!okp && tries < 16);
      nodes.push({ X: X, Y: Y, Z: Z,
        r: rand(1.4, 1.8), a: rand(0.42, 0.56), ph: rand(0, TWO), interior: true, edges: [], sx: 0, sy: 0, sc: 1, dp: 0.5 });
    }

    var seen = {};
    var link = function (i, j) {
      var key = i < j ? i + '_' + j : j + '_' + i;
      if (seen[key]) return; seen[key] = 1;
      var e = { a: nodes[i], b: nodes[j] };
      edges.push(e); nodes[i].edges.push(e); nodes[j].edges.push(e);
    };
    for (var a1 = 0; a1 < nodes.length; a1++) {
      var na = nodes[a1];
      var ds = [];
      for (var j1 = 0; j1 < nodes.length; j1++) {
        if (j1 === a1) continue;
        var nb = nodes[j1];
        ds.push({ j: j1, d: (na.X - nb.X) * (na.X - nb.X) + (na.Y - nb.Y) * (na.Y - nb.Y) + (na.Z - nb.Z) * (na.Z - nb.Z) });
      }
      ds.sort(function (p, q) { return p.d - q.d; });
      if (!na.interior) {
        for (var s1 = 0; s1 < 3 && s1 < ds.length; s1++) link(a1, ds[s1].j);
      } else {
        var chosen = [];
        for (var s2 = 0; s2 < ds.length && chosen.length < 6; s2++) {
          var nc = nodes[ds[s2].j];
          var dx = nc.X - na.X, dy = nc.Y - na.Y, dz = nc.Z - na.Z;
          var len = Math.hypot(dx, dy, dz) || 1;
          var ux = dx / len, uy = dy / len, uz = dz / len;
          var ok = true;
          for (var c1 = 0; c1 < chosen.length; c1++) { var c = chosen[c1]; if (c.ux * ux + c.uy * uy + c.uz * uz > 0.7) { ok = false; break; } }
          if (!ok) continue;
          chosen.push({ ux: ux, uy: uy, uz: uz });
          link(a1, ds[s2].j);
        }
      }
    }

    for (var h = 0; h < nodes.length; h++) {
      var n = nodes[h];
      n.hub = Math.min(1, Math.max(0, (n.edges.length - 3) / 3));
      n.r *= 1 + n.hub * 0.4;
      n.a = Math.min(0.88, n.a * (1 + n.hub * 0.45));
    }
  }

  function project() {
    var cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var x1 = n.X * cosY - n.Z * sinY;
      var z1 = n.X * sinY + n.Z * cosY;
      var y1 = n.Y * cosX - z1 * sinX;
      var z2 = n.Y * sinX + z1 * cosX;
      var s = focal / (focal + z2);
      n.sx = cx + x1 * s; n.sy = cy + y1 * s; n.sc = s;
      n.dp = (z2 + R) / (2 * R); if (n.dp < 0) n.dp = 0; else if (n.dp > 1) n.dp = 1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var depth = (e.a.dp + e.b.dp) / 2;
      var al = 0.04 + 0.06 * depth;
      ctx.strokeStyle = 'rgba(255,255,255,' + al + ')';
      ctx.lineWidth = 0.7 + 0.25 * depth;
      ctx.beginPath(); ctx.moveTo(e.a.sx, e.a.sy); ctx.lineTo(e.b.sx, e.b.sy); ctx.stroke();
    }
    var order = nodes.slice().sort(function (p, q) { return p.dp - q.dp; });
    for (var o = 0; o < order.length; o++) {
      var n = order[o];
      var rr = n.r * n.sc * (0.5 + 0.85 * n.dp);
      var tw = 0.88 + 0.12 * Math.sin(n.ph);
      var dw = n.dp * n.dp;                       // emphasise the near hemisphere
      var al = Math.min(1, (n.a * 0.25 + 0.72 * dw) * tw); // front pops white, back stays dim
      ctx.beginPath(); ctx.arc(n.sx, n.sy, rr, 0, TWO);
      ctx.fillStyle = 'rgba(255,255,255,' + al + ')'; ctx.fill();
    }
  }

  function step(ts) {
    if (!inView || canvas.offsetParent === null) { last = ts; rafId = requestAnimationFrame(step); return; }
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
    rect = canvas.getBoundingClientRect();

    autoRY += dt * 0.05;
    var lx = mx - rect.left, ly = my - rect.top;
    var dCen = Math.hypot(lx - cx, ly - cy);
    var outer = R * 1.9;
    var reach = Math.max(0, Math.min(1, (outer - dCen) / (outer - R)));
    if (!mEngaged && mInside) {
      var hr = R * 0.07;
      for (var i = 0; i < nodes.length; i++) {
        var dx = nodes[i].sx - lx, dy = nodes[i].sy - ly;
        if (dx * dx + dy * dy < hr * hr) { mEngaged = true; break; }
      }
    }
    if (mEngaged && (!mInside || reach <= 0)) mEngaged = false;
    var target = mEngaged ? reach : 0;
    mStr += (target - mStr) * 0.08;
    if (mStr > 0.001) {
      var nx = lx / W - 0.5, ny = ly / H - 0.5;
      tryy = autoRY - nx * 0.9 * mStr;
      trx = -0.25 - ny * 0.7 * mStr;
    } else { tryy = autoRY; trx = -0.25; }
    ry += (tryy - ry) * 0.06; rx += (trx - rx) * 0.06;

    project();
    for (var p = 0; p < nodes.length; p++) nodes[p].ph += dt * 0.7;
    draw();
    rafId = requestAnimationFrame(step);
  }

  build();
  project();
  if (reduce) { draw(); }
  else rafId = requestAnimationFrame(step);

  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY; rect = canvas.getBoundingClientRect();
    mInside = (mx > rect.left && mx < rect.right && my > rect.top && my < rect.bottom);
  }, { passive: true });
  window.addEventListener('mouseout', function () { mInside = false; mEngaged = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      build(); project();
      if (reduce) draw();
    }, 160);
  });
})();
