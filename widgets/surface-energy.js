// surface-energy.js
// AnyWidget: interactive 2D Lennard-Jones sandbox for the Surfaces module.
// Atoms colored by per-atom energy (cmasher "ember" colormap): bulk atoms sit
// dark near -3.2 eps, edge atoms glow, free atoms are brightest. Langevin
// dynamics with a single temperature slider; periodic boundary conditions with
// the (circular-mean) center of mass eased to frame center. Drag atoms to
// build defects and watch them heal. Presets demonstrate stable, metastable,
// and evolving structures, including dense polycrystals, melting, and vapor.
// Cell-list neighbor search keeps ~300 atoms real-time.
//
// Self-contained: no external data. Embed with
//   :::{anywidget} ../../widgets/surface-energy.js  (from modules/<m>/page.md)
//   :::

const EMBER = "00000001010102020404040807070e0d0914120c1a180e1f1e11232413282a142c30162f3617333c1836431939491a3b511a3e581a405f1a42651a436c19457319457a18468116468815458f13459510439c0e42a30c40aa0a3db0093ab60b37bd1033c2152fc71b2bcc2227d02923d3301fd7381cda3f18dd4615df4c12e2530ee45a0be66107e86705ea6e03ec7402ed7d01ef8301f08a03f19005f29709f39d0df3a412f3ab16f4b11bf4b820f4bf25f3c529f3cc2ef2d333f2da39f1e13e"; // 64 rgb hex, cmasher.ember (BSD-3)

const RMIN = Math.pow(2, 1 / 6);      // LJ bond length, sigma = eps = 1
const RC = 2 * RMIN;                  // cutoff: twice the bond length
const RC2 = RC * RC;
const VSHIFT = 4 * (Math.pow(RC, -12) - Math.pow(RC, -6)); // shift V(rc) to 0
const DT = 0.005;
const GAMMA = 2.0;                    // Langevin friction
const SUBSTEPS = 14;
const EMIN = -3.4, EMAX = 0.0;        // fixed color scale (energy per atom)
const A = RMIN;                       // lattice constant
const SQ3 = Math.sqrt(3);

function emberColor(t) {
  // floor the ramp so the coldest atoms stay visible on a black background
  const u = 0.12 + 0.88 * Math.max(0, Math.min(1, t));
  const i = Math.min(63, Math.round(u * 63)) * 6;
  return "#" + EMBER.slice(i, i + 6);
}

function gauss() { // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- presets: each returns { pts: [[x,y],...], L } ----------
function hexLattice(test, reach) {
  const R = reach || 16;
  const pts = [];
  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const x = (i + 0.5 * (j & 1)) * A;
      const y = j * A * SQ3 / 2;
      if (test(x, y)) pts.push([x, y]);
    }
  }
  return pts;
}
function hexClusterTest(n) {
  // geometric hexagon (flat-top) of circumradius ~n*A, corners at 0, 60, ... deg
  return (x, y) => {
    const R = (n + 0.25) * A;
    const ax = Math.abs(x), ay = Math.abs(y);
    return ax <= R && (SQ3 / 2) * ax + 0.5 * ay <= (SQ3 / 2) * R && ay <= (SQ3 / 2) * R;
  };
}
function dedupe(pts, dmin, L) {
  const d2 = dmin * dmin, out = [];
  for (const p of pts) {
    let ok = true;
    for (const q of out) {
      let dx = p[0] - q[0], dy = p[1] - q[1];
      if (L) { dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); }
      if (dx * dx + dy * dy < d2) { ok = false; break; }
    }
    if (ok) out.push(p);
  }
  return out;
}
function boxFor(pts, rho) {
  const L = Math.max(4.6, Math.sqrt(pts.length / rho));
  return { pts, L };
}
function grains(nseeds, fixedSeeds) {
  const rho = 0.916, targetN = 600;
  const L = Math.sqrt(targetN / rho);
  const seeds = fixedSeeds ? fixedSeeds(L) : [];
  if (!fixedSeeds)
    for (let s = 0; s < nseeds; s++)
      seeds.push([Math.random() * L, Math.random() * L, Math.random() * Math.PI / 3]);
  const nseed = seeds.length;
  const raw = [];
  const R = Math.ceil(L / A) + 2;
  for (let s = 0; s < nseed; s++) {
    const [sx, sy, th] = seeds[s], c = Math.cos(th), si = Math.sin(th);
    for (let j = -R; j <= R; j++) {
      for (let i = -R; i <= R; i++) {
        const lx = (i + 0.5 * (j & 1)) * A, ly = j * A * SQ3 / 2;
        let px = sx + c * lx - si * ly, py = sy + si * lx + c * ly;
        px = ((px % L) + L) % L; py = ((py % L) + L) % L;
        // keep the point only if this seed is its nearest (min-image Voronoi)
        let bestS = 0, bestD = 1e9;
        for (let t = 0; t < nseed; t++) {
          let dx = px - seeds[t][0], dy = py - seeds[t][1];
          dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
          const d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; bestS = t; }
        }
        if (bestS === s) raw.push([px, py]);
      }
    }
  }
  return { pts: dedupe(raw, 0.85, L), L };
}
const PRESETS = {
  Hexagon: () => boxFor(hexLattice(hexClusterTest(8)), 0.2),           // ~217
  Snowflake: () => {
    const core = hexClusterTest(6);                                     // 127
    const sat = [];
    for (let k = 0; k < 6; k++) {
      const th = k * Math.PI / 3;
      sat.push([8.4 * A * Math.cos(th), 8.4 * A * Math.sin(th)]);
    }
    const pts = hexLattice((x, y) => {
      if (core(x, y)) return true;
      for (const s of sat) {
        const dx = x - s[0], dy = y - s[1];
        if (dx * dx + dy * dy < (2.35 * A) ** 2) return true;
      }
      return false;
    });
    return boxFor(pts, 0.16);
  },
  Triangle: () => {
    const k = 20, pts = [];                                             // 210
    for (let j = 0; j < k; j++)
      for (let i = 0; i < k - j; i++)
        pts.push([(i + 0.5 * j - (k - 1) / 2) * A, (j - (k - 1) / 3) * A * SQ3 / 2]);
    return boxFor(pts, 0.2);
  },
  Square: () => {
    // square LATTICE, not just square shape: metastable when cold; warm it
    // to watch it shear into the close-packed hexagonal lattice
    const pts = [];
    for (let j = -7; j <= 7; j++) for (let i = -7; i <= 7; i++) pts.push([i * A, j * A]);
    return boxFor(pts, 0.2);                                            // 225
  },
  Ring: () => boxFor(hexLattice((x, y) => {
    const r2 = x * x + y * y;
    return r2 < (9.3 * A) ** 2 && r2 > (5.1 * A) ** 2;
  }), 0.17),                                                            // ~200
  Rod: () => boxFor(hexLattice((x, y) =>
    Math.abs(x) < 14 * A && Math.abs(y) < 2.0 * A, 20), 0.12),          // 5 close-packed rows
  Pair: () => {
    const disk = hexLattice((x, y) => x * x + y * y < (5.2 * A) ** 2);  // ~91 each
    const off = 5.85 * A;
    const pts = disk.map(p => [p[0] - off, p[1]])
      .concat(disk.map(p => [p[0] + off, p[1] + 0.5 * A]));
    return boxFor(dedupe(pts, 0.85), 0.16);
  },
  Vacancies: () => {
    const full = hexLattice((x, y) => x * x + y * y < (8.2 * A) ** 2);
    const pts = full.filter(p =>
      (p[0] * p[0] + p[1] * p[1] > (6.6 * A) ** 2) || Math.random() > 0.10);
    return boxFor(pts, 0.2);
  },
  Notch: () => boxFor(hexLattice((x, y) => {
    // hexagonal crystal with a sharp crack cut from the right edge to center
    if (!hexClusterTest(8)(x, y)) return false;
    return !(x > 0.5 * A && Math.abs(y) < 0.72 * A * (1 - x / (18 * A)) + 0.05);
  }), 0.2),
  Honeycomb: () => {
    // open 3-coordinated lattice (2D materials): metastable, collapses to
    // close packing when warmed. Triangular lattice minus one of 3 sublattices.
    const pts = [];
    for (let j = -12; j <= 12; j++) {
      for (let i = -12; i <= 12; i++) {
        const q = i - ((j - (j & 1)) / 2);
        if (((q - j) % 3 + 3) % 3 === 0) continue;
        const x = (i + 0.5 * (j & 1)) * A, y = j * A * SQ3 / 2;
        if (x * x + y * y < (10.2 * A) ** 2) pts.push([x, y]);
      }
    }
    return boxFor(pts, 0.14);
  },
  Islands: () => {
    // scattered islands of assorted sizes, the morphology of early film
    // growth: warm gently to watch coalescence and Ostwald ripening
    const L = 39, sizes = [4.6, 3.4, 3.4, 2.4, 2.4, 1.6, 1.6, 1.2];
    const centers = [], pts = [];
    for (const r of sizes) {
      for (let guard = 0; guard < 500; guard++) {
        const cx = Math.random() * L, cy = Math.random() * L;
        let ok = true;
        for (const [ox, oy, or2] of centers) {
          let dx = cx - ox, dy = cy - oy;
          dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
          if (Math.hypot(dx, dy) < (r + or2 + 3.2) * A) { ok = false; break; }
        }
        if (ok) { centers.push([cx, cy, r]); break; }
      }
    }
    for (const [cx, cy, r] of centers)
      for (const p of hexLattice((x, y) => x * x + y * y < (r * A) ** 2))
        pts.push([p[0] + cx, p[1] + cy]);
    return { pts, L };
  },
  Quasicrystal: () => {
    // dodecagonal square-triangle quasicrystal patch (cut-and-project from
    // Z^4). Both local motifs are stable in this potential, so unlike the
    // honeycomb it is genuinely metastable when cold.
    const u = [], v = [];
    for (let k = 0; k < 4; k++) {
      u.push([Math.cos(k * Math.PI / 6), Math.sin(k * Math.PI / 6)]);
      v.push([Math.cos(k * 5 * Math.PI / 6), Math.sin(k * 5 * Math.PI / 6)]);
    }
    const W = 1.05, R = 8.6, raw = [];
    for (let a = -10; a <= 10; a++) for (let b = -10; b <= 10; b++)
      for (let c = -10; c <= 10; c++) for (let d = -10; d <= 10; d++) {
        const px = a * u[0][0] + b * u[1][0] + c * u[2][0] + d * u[3][0];
        const py = a * u[0][1] + b * u[1][1] + c * u[2][1] + d * u[3][1];
        if (px * px + py * py > R * R) continue;
        const qx = a * v[0][0] + b * v[1][0] + c * v[2][0] + d * v[3][0];
        const qy = a * v[0][1] + b * v[1][1] + c * v[2][1] + d * v[3][1];
        if (qx * qx + qy * qy < W * W) raw.push([px * A, py * A]);
      }
    return boxFor(dedupe(raw, 0.9 * A), 0.2);
  },
  Glass: () => {
    // binary mixture (60:40, size ratio 1 : 0.8), the classic 2D glass
    // former: the loading quench jams it into an amorphous solid that flows
    // when warmed but resists crystallizing
    const n = 420, L = Math.sqrt(n * 0.98), pts = [], sizes = [];
    let guard = 0;
    while (pts.length < n && guard++ < 200000) {
      const sNew = pts.length % 5 < 3 ? 1.0 : 0.8;
      const x = Math.random() * L, y = Math.random() * L;
      let ok = true;
      for (let k = 0; k < pts.length; k++) {
        let dx = x - pts[k][0], dy = y - pts[k][1];
        dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
        const dmin = 0.72 * 0.5 * (sNew + sizes[k]);
        if (dx * dx + dy * dy < dmin * dmin) { ok = false; break; }
      }
      if (ok) { pts.push([x, y]); sizes.push(sNew); }
    }
    return { pts, L, sizes };
  },
  Bicrystal: () => grains(0, L => [
    [0.25 * L, 0.5 * L, 0],
    [0.75 * L, 0.5 * L, Math.PI / 6]]),
  "Coarse grains": () => grains(4),
  "Fine grains": () => grains(14),
  Gas: () => {
    const n = 260, L = Math.sqrt(n / 0.30), pts = [];
    let guard = 0;
    while (pts.length < n && guard++ < 60000) {
      const x = Math.random() * L, y = Math.random() * L;
      let ok = true;
      for (const p of pts) {
        let dx = x - p[0], dy = y - p[1];
        dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
        if (dx * dx + dy * dy < 0.81) { ok = false; break; }
      }
      if (ok) pts.push([x, y]);
    }
    return { pts, L };
  },
};
// temperature carries over between presets (metastability experiments),
// except Gas, which needs to start hot
const PRESET_DEFAULT_T = { Gas: 0.60 };

// The MyST theme remounts the widget on light/dark toggle (and on client-side
// navigation). The module instance survives, so the simulation state is stashed
// here at cleanup and restored by the next render.
let SAVED = null;

function render({ model, el }) {
  const uid = "se" + Math.random().toString(36).slice(2, 8);

  // ---------- state ----------
  let N = 0, L = 10;
  let x, y, vx, vy, fx, fy, ea, sig;
  let head, next, ncell = 0;
  let T = 0.0125;   // calm default: structures vibrate gently, nothing evolves
  let playing = true;
  let raf = 0, visible = true;
  let comX = 0, comY = 0;
  let drag = -1, dragX = 0, dragY = 0;
  let hist = [], histMax = 900;
  let plotLo = null, plotHi = null;

  function load(name) {
    const { pts, L: box, sizes } = PRESETS[name]();
    N = pts.length; L = box;
    x = new Float64Array(N); y = new Float64Array(N);
    vx = new Float64Array(N); vy = new Float64Array(N);
    fx = new Float64Array(N); fy = new Float64Array(N);
    ea = new Float64Array(N);
    sig = sizes ? Float64Array.from(sizes) : new Float64Array(N).fill(1);
    ncell = Math.max(1, Math.floor(L / RC));
    head = new Int32Array(ncell * ncell); next = new Int32Array(N);
    for (let i = 0; i < N; i++) {
      x[i] = wrap(pts[i][0]); y[i] = wrap(pts[i][1]);
      const s = Math.sqrt(Math.max(T, 1e-4));
      vx[i] = s * gauss(); vy[i] = s * gauss();
    }
    hist = []; plotLo = plotHi = null; drag = -1;
    forces();
    quench();
    const c = com(); comX = c[0]; comY = c[1];
  }
  function wrap(v) { return ((v % L) + L) % L; }
  function snapshot() {
    return { name: current, T, playing, N, L,
      x: x.slice(), y: y.slice(), vx: vx.slice(), vy: vy.slice(),
      sig: sig.slice(), hist: hist.slice(), comX, comY, plotLo, plotHi };
  }
  function restore(sv) {
    current = sv.name; T = sv.T; playing = sv.playing; N = sv.N; L = sv.L;
    x = sv.x; y = sv.y; vx = sv.vx; vy = sv.vy; sig = sv.sig;
    fx = new Float64Array(N); fy = new Float64Array(N); ea = new Float64Array(N);
    ncell = Math.max(1, Math.floor(L / RC));
    head = new Int32Array(ncell * ncell); next = new Int32Array(N);
    hist = sv.hist; comX = sv.comX; comY = sv.comY;
    plotLo = sv.plotLo; plotHi = sv.plotHi; drag = -1;
    forces();
  }

  function quench() {
    // stage 1: steepest descent with capped displacement removes the worst
    // construction overlaps (dense grain boundaries) without launching atoms
    for (let k = 0; k < 60; k++) {
      for (let i = 0; i < N; i++) {
        let dx = 0.02 * fx[i], dy = 0.02 * fy[i];
        const d = Math.hypot(dx, dy);
        if (d > 0.05) { dx *= 0.05 / d; dy *= 0.05 / d; }
        x[i] = wrap(x[i] + dx); y[i] = wrap(y[i] + dy);
      }
      forces();
    }
    // stage 2: overdamped zero-temperature dynamics converges the stiff
    // grain-boundary contacts, so presets are genuinely metastable at T = 0
    const qvx = new Float64Array(N), qvy = new Float64Array(N);
    const c1 = Math.exp(-8 * DT);
    for (let k = 0; k < 250; k++) {
      for (let i = 0; i < N; i++) { qvx[i] += 0.5 * DT * fx[i]; qvy[i] += 0.5 * DT * fy[i]; }
      for (let i = 0; i < N; i++) {
        qvx[i] *= c1; qvy[i] *= c1;
        const v2 = qvx[i] * qvx[i] + qvy[i] * qvy[i];
        if (v2 > 4) { const sc = 2 / Math.sqrt(v2); qvx[i] *= sc; qvy[i] *= sc; }
        x[i] = wrap(x[i] + DT * qvx[i]); y[i] = wrap(y[i] + DT * qvy[i]);
      }
      forces();
      for (let i = 0; i < N; i++) { qvx[i] += 0.5 * DT * fx[i]; qvy[i] += 0.5 * DT * fy[i]; }
    }
  }

  // ---------- physics ----------
  function pairForce(i, j) {
    let dx = x[i] - x[j], dy = y[i] - y[j];
    dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
    let r2 = dx * dx + dy * dy;
    // pair size sigma_ij = mean of the two atomic sizes (1 for most presets)
    const sm = 0.5 * (sig[i] + sig[j]), s2 = sm * sm;
    if (r2 >= RC2 * s2) return;
    if (r2 < 0.64 * s2) r2 = 0.64 * s2;  // force cap: treat r < 0.8 sigma as 0.8
    const inv2 = s2 / r2, inv6 = inv2 * inv2 * inv2;
    const f = 24 * inv6 * (2 * inv6 - 1) / r2;
    const v = 4 * inv6 * (inv6 - 1) - VSHIFT;
    fx[i] += f * dx; fy[i] += f * dy;
    fx[j] -= f * dx; fy[j] -= f * dy;
    ea[i] += 0.5 * v; ea[j] += 0.5 * v;
  }
  function forces() {
    fx.fill(0); fy.fill(0); ea.fill(0);
    if (ncell < 3) {                  // tiny box: plain O(N^2)
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) pairForce(i, j);
    } else {
      head.fill(-1);
      const cs = L / ncell;
      for (let i = 0; i < N; i++) {
        const c = (Math.floor(x[i] / cs) % ncell) + ncell * (Math.floor(y[i] / cs) % ncell);
        next[i] = head[c]; head[c] = i;
      }
      // half shell: same cell (chain order), plus 4 neighbor cells
      for (let cy = 0; cy < ncell; cy++) {
        for (let cx = 0; cx < ncell; cx++) {
          const c0 = cx + ncell * cy;
          for (let i = head[c0]; i >= 0; i = next[i])
            for (let j = next[i]; j >= 0; j = next[j]) pairForce(i, j);
          const nb = [
            [(cx + 1) % ncell, cy],
            [(cx + ncell - 1) % ncell, (cy + 1) % ncell],
            [cx, (cy + 1) % ncell],
            [(cx + 1) % ncell, (cy + 1) % ncell]];
          for (const [bx, by] of nb) {
            const c1 = bx + ncell * by;
            for (let i = head[c0]; i >= 0; i = next[i])
              for (let j = head[c1]; j >= 0; j = next[j]) pairForce(i, j);
          }
        }
      }
    }
    if (drag >= 0) {
      const k = 40, i = drag;
      let dx = dragX - x[i], dy = dragY - y[i];
      dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
      fx[i] += k * dx; fy[i] += k * dy;
    }
  }
  function step() {
    const c1 = Math.exp(-GAMMA * DT), c2 = Math.sqrt((1 - c1 * c1) * Math.max(T, 0));
    for (let s = 0; s < SUBSTEPS; s++) {
      for (let i = 0; i < N; i++) { vx[i] += 0.5 * DT * fx[i]; vy[i] += 0.5 * DT * fy[i]; }
      for (let i = 0; i < N; i++) {
        vx[i] = c1 * vx[i] + c2 * gauss(); vy[i] = c1 * vy[i] + c2 * gauss();
        const v2 = vx[i] * vx[i] + vy[i] * vy[i];
        if (v2 > 36) { const sc = 6 / Math.sqrt(v2); vx[i] *= sc; vy[i] *= sc; }
        x[i] = wrap(x[i] + DT * vx[i]); y[i] = wrap(y[i] + DT * vy[i]);
      }
      forces();
      for (let i = 0; i < N; i++) { vx[i] += 0.5 * DT * fx[i]; vy[i] += 0.5 * DT * fy[i]; }
    }
    let e = 0;
    for (let i = 0; i < N; i++) e += ea[i];
    hist.push(e / N);
    if (hist.length > histMax) hist.shift();
  }
  function com() {
    // circular mean per axis; if the mass is spread uniformly (dense presets,
    // gas) the resultant is short and we keep the previous center instead
    let cx = 0, sx = 0, cy = 0, sy = 0;
    for (let i = 0; i < N; i++) {
      const tx = 2 * Math.PI * x[i] / L, ty = 2 * Math.PI * y[i] / L;
      cx += Math.cos(tx); sx += Math.sin(tx);
      cy += Math.cos(ty); sy += Math.sin(ty);
    }
    const rx = Math.hypot(cx, sx) / N, ry = Math.hypot(cy, sy) / N;
    if (Math.min(rx, ry) < 0.15) return [comX, comY];
    return [wrap(Math.atan2(sx, cx) * L / (2 * Math.PI)),
            wrap(Math.atan2(sy, cy) * L / (2 * Math.PI))];
  }

  // ---------- DOM ----------
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --se-bg:#f7f7f5; --se-panel:#ffffff; --se-fg:#1a1a1a; --se-muted:#777;
  --se-border:#d8d5d0; --se-accent:rgb(204,0,0); --se-sim:#ffffff;
  font-family:system-ui,sans-serif; color:var(--se-fg); display:block; margin-bottom:30px; }
.${uid}.se-dark { --se-bg:#191817; --se-panel:#221f1e; --se-fg:#eee;
  --se-muted:#999; --se-border:#3a3735; --se-accent:rgb(255,63,63); --se-sim:#000000; }
.${uid} .se-wrap { display:flex; gap:10px; align-items:stretch; flex-wrap:wrap; }
.${uid} .se-presets { display:flex; flex-direction:column; gap:4px; min-width:98px; }
.${uid} .se-presets button { font-size:13px; padding:5px 8px; text-align:left;
  border:1px solid var(--se-border); border-radius:6px; background:var(--se-panel);
  color:var(--se-fg); cursor:pointer; }
.${uid} .se-presets button.active { border-color:var(--se-accent);
  color:var(--se-accent); font-weight:600; }
.${uid} .se-main { flex:1 1 300px; min-width:260px; }
.${uid} canvas.se-sim { width:100%; display:block; border:1px solid var(--se-border);
  border-radius:8px; background:var(--se-sim); touch-action:none; cursor:grab; }
.${uid} .se-side { display:flex; flex-direction:column; gap:6px; width:158px; }
.${uid} .se-stat { background:var(--se-panel); border:1px solid var(--se-border);
  border-radius:6px; padding:6px 8px; font-size:13px; color:var(--se-muted); }
.${uid} .se-stat b { display:block; font-size:16px; color:var(--se-fg);
  font-variant-numeric:tabular-nums; }
.${uid} canvas.se-plot { width:100%; flex:1 1 170px; min-height:170px;
  background:var(--se-panel); border:1px solid var(--se-border); border-radius:6px; }
.${uid} .se-controls { display:flex; gap:10px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--se-muted); flex-wrap:wrap; }
.${uid} .se-controls button { border:1px solid var(--se-border); border-radius:6px;
  background:var(--se-panel); color:var(--se-fg); padding:4px 10px; cursor:pointer;
  font-size:13px; }
.${uid} input[type=range] { flex:1 1 120px; accent-color:var(--se-accent); }
`;

  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="se-wrap">
  <div class="se-presets"></div>
  <div class="se-main">
    <canvas class="se-sim"></canvas>
    <div class="se-controls">
      <button class="se-play">&#10074;&#10074; Pause</button>
      <span>cold</span><input class="se-temp" type="range" min="0" max="0.8" step="0.0025">
      <span>hot</span>
      <button class="se-reset">Reset</button>
    </div>
  </div>
  <div class="se-side">
    <div class="se-stat">energy / atom<b class="se-e">&ndash;</b></div>
    <div class="se-stat">temperature<b class="se-t">&ndash;</b></div>
    <div class="se-stat">atoms<b class="se-n">&ndash;</b></div>
    <canvas class="se-plot"></canvas>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--se-muted);";
  cap.innerHTML = "<b style='color:var(--se-fg)'>Surface energy sandbox.</b> 2D Lennard-Jones atoms colored by energy: dark is bulk, glowing is undercoordinated.";
  root.appendChild(cap);

  const sim = root.querySelector(".se-sim");
  const plot = root.querySelector(".se-plot");
  const playBtn = root.querySelector(".se-play");
  const tempSld = root.querySelector(".se-temp");
  const eOut = root.querySelector(".se-e");
  const tOut = root.querySelector(".se-t");
  const nOut = root.querySelector(".se-n");
  const presetBox = root.querySelector(".se-presets");

  let current = "Hexagon";
  for (const name of Object.keys(PRESETS)) {
    const b = document.createElement("button");
    b.textContent = name;
    b.addEventListener("click", () => {
      current = name;
      if (name in PRESET_DEFAULT_T) { T = PRESET_DEFAULT_T[name]; tempSld.value = T; }
      load(name);
      presetBox.querySelectorAll("button").forEach(q => q.classList.toggle("active", q === b));
    });
    presetBox.appendChild(b);
  }
  function markActive() {
    presetBox.querySelectorAll("button").forEach(q =>
      q.classList.toggle("active", q.textContent === current));
  }

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Play";
  });
  tempSld.value = T;
  tempSld.addEventListener("input", () => { T = +tempSld.value; });
  root.querySelector(".se-reset").addEventListener("click", () => load(current));

  // ---------- dragging ----------
  function simCoords(ev) {
    const r = sim.getBoundingClientRect();
    const scale = L / r.width;
    return [wrap((ev.clientX - r.left) * scale + comX - L / 2),
            wrap((ev.clientY - r.top) * scale + comY - L / 2)];
  }
  sim.addEventListener("pointerdown", ev => {
    const [px, py] = simCoords(ev);
    let best = -1, bd = 1.0;
    for (let i = 0; i < N; i++) {
      let dx = x[i] - px, dy = y[i] - py;
      dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L);
      const d2 = dx * dx + dy * dy;
      if (d2 < bd) { bd = d2; best = i; }
    }
    if (best >= 0) { drag = best; dragX = px; dragY = py; sim.setPointerCapture(ev.pointerId); }
  });
  sim.addEventListener("pointermove", ev => {
    if (drag < 0) return;
    const [px, py] = simCoords(ev);
    dragX = px; dragY = py;
  });
  const endDrag = () => { drag = -1; };
  sim.addEventListener("pointerup", endDrag);
  sim.addEventListener("pointercancel", endDrag);

  // ---------- theme ----------
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("se-dark", dark()); }
  const themeObs = new MutationObserver(syncTheme);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  // ---------- rendering ----------
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = sim.clientWidth || 300, h = w;
    if (sim.width !== w * dpr) { sim.width = w * dpr; sim.height = h * dpr; }
    if (sim.style.height !== w + "px") sim.style.height = w + "px";
    const g = sim.getContext("2d");
    const isDark = dark();
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = isDark ? "#000000" : "#ffffff";
    g.fillRect(0, 0, w, h);

    // ease the frame toward the center of mass, slowly (no global jerk)
    const c = com();
    let ddx = c[0] - comX, ddy = c[1] - comY;
    ddx -= L * Math.round(ddx / L); ddy -= L * Math.round(ddy / L);
    comX = wrap(comX + 0.015 * ddx); comY = wrap(comY + 0.015 * ddy);

    const scale = w / L, rad0 = 0.5 * A * scale * 0.92;
    g.lineWidth = Math.max(0.75, rad0 * 0.10);
    g.strokeStyle = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.75)";
    for (let i = 0; i < N; i++) {
      let px = x[i] - comX + L / 2, py = y[i] - comY + L / 2;
      px = ((px % L) + L) % L; py = ((py % L) + L) % L;
      const t = (ea[i] - EMIN) / (EMAX - EMIN);
      g.fillStyle = emberColor(t);
      g.beginPath();
      g.arc(px * scale, py * scale, rad0 * sig[i], 0, 6.2832);
      g.fill();
      g.stroke();
    }

    // ---------- energy plot: sticky limits, min/max labels ----------
    const pw = plot.clientWidth || 150, ph = plot.clientHeight || 170;
    if (plot.width !== pw * dpr) { plot.width = pw * dpr; plot.height = ph * dpr; }
    const q = plot.getContext("2d");
    q.setTransform(dpr, 0, 0, dpr, 0, 0);
    q.clearRect(0, 0, pw, ph);
    if (hist.length > 1) {
      let dLo = Math.min(...hist), dHi = Math.max(...hist);
      const pad = Math.max(0.04, (dHi - dLo) * 0.12);
      dLo -= pad; dHi += pad;
      if (plotLo === null) { plotLo = dLo; plotHi = dHi; }
      // expand immediately, contract very slowly: no jumping axes
      plotLo = dLo < plotLo ? dLo : plotLo + 0.002 * (dLo - plotLo);
      plotHi = dHi > plotHi ? dHi : plotHi + 0.002 * (dHi - plotHi);
      const y0 = 16, y1 = ph - 14;
      const Y = v => y1 - ((v - plotLo) / (plotHi - plotLo)) * (y1 - y0);
      q.strokeStyle = isDark ? "rgb(255,63,63)" : "rgb(204,0,0)";
      q.lineWidth = 1.5;
      q.beginPath();
      for (let i = 0; i < hist.length; i++) {
        const px2 = 4 + (i / (histMax - 1)) * (pw - 8);
        i ? q.lineTo(px2, Y(hist[i])) : q.moveTo(px2, Y(hist[i]));
      }
      q.stroke();
      q.fillStyle = isDark ? "#999" : "#777";
      q.font = "12px system-ui";
      q.fillText("E/atom vs time", 5, 11);
      q.textAlign = "right";
      q.fillText(plotHi.toFixed(2), pw - 5, y0 - 3);
      q.fillText(plotLo.toFixed(2), pw - 5, ph - 3);
      q.textAlign = "left";
    }
    eOut.textContent = hist.length ? hist[hist.length - 1].toFixed(3) + " ε" : "–";
    tOut.textContent = T.toFixed(2) + " ε/kʙ";
    nOut.textContent = N;
  }
  function tick() {
    if (visible && playing) step();
    if (visible) draw();
    raf = requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(es => {
    visible = es[es.length - 1].isIntersecting;
  }, { rootMargin: "100px" });
  io.observe(root);

  if (SAVED) { restore(SAVED); SAVED = null; } else { load(current); }
  markActive();
  tempSld.value = T;
  playBtn.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Play";
  tick();
  return () => {
    SAVED = snapshot();
    cancelAnimationFrame(raf); io.disconnect(); themeObs.disconnect();
  };
}

export default { render };
