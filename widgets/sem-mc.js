// sem-mc.js
// AnyWidget: Monte Carlo electron trajectories in a bulk target, the classic
// single-scattering model (screened Rutherford elastic cross section, Bethe
// continuous slowing with the Joy-Luo low-energy correction). Trajectories
// draw progressively; backscattered electrons highlighted; BSE yield and
// Kanaya-Okayama range reported. Physics follows Goldstein/Joy.
//
//   :::{anywidget} ../../widgets/sem-mc.js
//   :::

const MATS = {
  C:  { z: 6,  a: 12.011, rho: 2.0 },
  Al: { z: 13, a: 26.98,  rho: 2.70 },
  Si: { z: 14, a: 28.09,  rho: 2.33 },
  Cu: { z: 29, a: 63.55,  rho: 8.96 },
  Ag: { z: 47, a: 107.87, rho: 10.5 },
  Au: { z: 79, a: 196.97, rho: 19.3 },
};

// one trajectory; returns {pts (um, x lateral, z depth), bse, tr}
// tFilm: film thickness in um (Infinity = bulk); electrons crossing the film
// bottom leave as transmitted, with the exit segment clipped to the boundary
function trajectory(mat, E0, tFilm = Infinity) {
  const { z: Z, a: A, rho } = mat;
  const J = (9.76 * Z + 58.5 * Math.pow(Z, -0.19)) * 1e-3;   // keV
  let E = E0, x = 0, y = 0, zz = 0, cx = 0, cy = 0, cz = 1;  // 3D direction cosines
  const pts = [[0, 0]];                                       // drawn as x-z projection
  for (let step = 0; step < 3000 && E > 0.2; step++) {
    const al = 3.4e-3 * Math.pow(Z, 0.67) / E;
    const sg = 5.21e-21 * (Z * Z / (E * E)) * (4 * Math.PI / (al * (1 + al))) *
      ((E + 511) / (E + 1024)) ** 2;                          // cm^2
    const lam = A / (6.022e23 * rho * sg) * 1e4;              // um
    const s = -lam * Math.log(Math.random());
    // Bethe + Joy-Luo, keV/cm -> keV/um
    const dEds = 78500 * (Z * rho / (A * E)) * Math.log(1.166 * (E + 0.85 * J) / J) * 1e-4;
    const dE = dEds * s;
    E -= dE;
    x += cx * s; y += cy * s; zz += cz * s;
    pts.push([x, zz, dE]);
    if (zz < 0) return { pts, bse: true, tr: false, E };
    if (zz > tFilm) {
      const p0 = pts[pts.length - 2], p1 = pts[pts.length - 1];
      const f = (tFilm - p0[1]) / (p1[1] - p0[1]);
      p1[0] = p0[0] + (p1[0] - p0[0]) * f;
      p1[1] = tFilm;
      p1[2] = dE * f;
      return { pts, bse: false, tr: true, E };
    }
    const R = Math.random();
    const ct = 1 - 2 * al * R / (1 + al - R);
    const st = Math.sqrt(Math.max(0, 1 - ct * ct));
    const ph = 2 * Math.PI * Math.random(), cf = Math.cos(ph), sf = Math.sin(ph);
    if (Math.abs(cz) > 0.99999) {
      cx = st * cf; cy = st * sf; cz = ct * Math.sign(cz);
    } else {
      const sq = Math.sqrt(1 - cz * cz);
      const nx = cx * ct + st * (cx * cz * cf - cy * sf) / sq;
      const ny = cy * ct + st * (cy * cz * cf + cx * sf) / sq;
      const nz = cz * ct - sq * st * cf;
      cx = nx; cy = ny; cz = nz;
    }
  }
  return { pts, bse: false, tr: false, E };
}
function koRange(mat, E0) { // Kanaya-Okayama, um
  return 0.0276 * mat.a * Math.pow(E0, 1.67) / (Math.pow(mat.z, 0.89) * mat.rho);
}

function render({ model, el }) {
  const uid = "sm" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1 1 280px; min-width:250px; }
.${uid} .w-bar { display:flex; gap:14px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} input[type=range] { width:110px; accent-color:var(--w-accent); }
.${uid} select { background:var(--w-panel); color:var(--w-fg); border:1px solid var(--w-border);
  border-radius:5px; padding:2px 4px; }
.${uid} button { border:1px solid var(--w-border); border-radius:6px; background:var(--w-panel);
  color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot"><canvas class="w-traj" height="360"></canvas></div>
  <div class="w-plot"><canvas class="w-hist" height="360"></canvas></div>
</div>
<div class="w-bar">
  <label>target <select class="w-mat">${Object.keys(MATS).map(k => `<option${k === "Si" ? " selected" : ""}>${k}</option>`).join("")}</select></label>
  <label>beam energy <input class="w-E" type="range" min="1" max="30" step="0.5" value="15"><b class="w-ev"></b></label>
  <label>thickness <input class="w-th" type="range" min="-2" max="1.05" step="0.05" value="1.05"><b class="w-thv"></b></label>
  <label>trajectories <input class="w-N" type="range" min="2" max="4.3" step="0.05" value="3"><b class="w-nv"></b></label>
  <button class="w-go">Restart</button>
</div>
<div class="w-bar">
  <span>completed <b class="w-nt">0</b></span>
  <span>backscattered <b class="w-bse">&ndash;</b></span>
  <span>transmitted <b class="w-tr">&ndash;</b></span>
  <span>K-O range <b class="w-ko"></b></span>
  <span>deepest so far <b class="w-md">&ndash;</b></span>
  <span><span style="color:#d04040">&#9644;</span> backscattered</span>
  <span><span style="color:#4060c0">&#9644;</span> absorbed</span>
  <span><span style="color:#c98f00">&#9644;</span> transmitted</span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>SEM interaction volume.</b> Monte Carlo electron trajectories and the deposited energy volume.";
  root.appendChild(cap);

  const cv = root.querySelector(".w-traj");
  const cvH = root.querySelector(".w-hist");
  const inE = root.querySelector(".w-E"), sel = root.querySelector(".w-mat");
  const inTh = root.querySelector(".w-th");
  let trajs = [], nBse = 0, nTr = 0, nDone = 0, maxDepth = 0, raf = 0, visible = true, scale = 1;
  let tFilm = Infinity;                                    // um
  const HG = 110;
  let hist = new Float32Array(HG * HG);
  const inN = () => Math.round(Math.pow(10, +root.querySelector(".w-N").value));

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); redrawAll(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function setup() {
    trajs = []; nBse = 0; nTr = 0; nDone = 0; maxDepth = 0;
    hist = new Float32Array(HG * HG);
    root.querySelector(".w-nv").textContent = inN();
    const m = MATS[sel.value], E0 = +inE.value;
    const R = koRange(m, E0);
    tFilm = +inTh.value >= 1.049 ? Infinity : Math.pow(10, +inTh.value);
    // bulk: zoom to the pear. Finite film: lock the view to the film so the
    // boundary stays put while the energy sweeps, for a direct comparison
    scale = tFilm === Infinity ? 1.1 * R : 2.2 * tFilm;
    root.querySelector(".w-thv").textContent = tFilm === Infinity ? "bulk"
      : tFilm >= 1 ? tFilm.toFixed(1) + " µm" : (tFilm * 1000).toFixed(0) + " nm";
    root.querySelector(".w-ev").textContent = E0.toFixed(1) + " keV";
    root.querySelector(".w-ko").textContent = R >= 1 ? R.toFixed(2) + " µm" : (R * 1000).toFixed(0) + " nm";
    redrawAll(); drawHist();
  }
  function view(w, h) {
    // beam enters top center; sample occupies lower 85%
    const zTop = h * 0.12;
    return { X: x => w / 2 + (x / scale) * (w / 2.2), Y: z => zTop + (z / scale) * (h * 0.82), zTop };
  }
  function redrawAll() {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 360, h = 360;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#ffffff";
    g.fillRect(0, 0, w, h);
    const { X, Y, zTop } = view(w, h);
    g.fillStyle = isD ? "#1c1a19" : "#efedea";
    const yF = tFilm === Infinity ? h : Math.min(h, Y(tFilm));
    g.fillRect(0, zTop, w, yF - zTop);
    g.strokeStyle = isD ? "#444" : "#bbb";
    g.beginPath(); g.moveTo(0, zTop); g.lineTo(w, zTop); g.stroke();
    if (yF < h) { g.beginPath(); g.moveTo(0, yF); g.lineTo(w, yF); g.stroke(); }
    // beam arrow
    g.strokeStyle = isD ? "#eee" : "#222"; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(w / 2, 6); g.lineTo(w / 2, zTop - 2); g.stroke();
    // scale bar
    const sb = scale > 2 ? 1 : scale > 0.4 ? 0.2 : scale > 0.1 ? 0.05 : 0.01; // um
    const sbPx = (sb / scale) * (w / 2.2);
    g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(w - 20 - sbPx, h - 14); g.lineTo(w - 20, h - 14); g.stroke();
    g.fillStyle = isD ? "#ccc" : "#333"; g.font = "12px system-ui";
    g.fillText(sb >= 1 ? sb + " µm" : sb * 1000 + " nm", w - 20 - sbPx, h - 20);
    for (const t of trajs) drawTraj(g, t, X, Y);
  }
  function accumulate(t) {
    // deposit segment energies into the histogram grid (x centered, z down)
    for (let i = 1; i < t.pts.length; i++) {
      const p = t.pts[i];
      const gx = Math.floor((p[0] / scale * 0.5 + 0.5) * HG);
      const gz = Math.floor((p[1] / scale) * HG);
      if (gx >= 0 && gx < HG && gz >= 0 && gz < HG) hist[gz * HG + gx] += p[2] || 0;
    }
  }
  function drawHist() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvH.clientWidth || 300, h = 360;
    cvH.width = w * dpr; cvH.height = h * dpr;
    const g = cvH.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#ffffff";
    g.fillRect(0, 0, w, h);
    const zTop = h * 0.12;
    g.fillStyle = isD ? "#1c1a19" : "#efedea";
    const yF = tFilm === Infinity ? h : Math.min(h, zTop + (tFilm / scale) * (h * 0.82));
    g.fillRect(0, zTop, w, yF - zTop);
    let mx = 0;
    for (let i = 0; i < hist.length; i++) if (hist[i] > mx) mx = hist[i];
    if (mx > 0) {
      const cw = (w / 2.2) * 2 / HG, ch = (h * 0.82) / HG;
      for (let gz = 0; gz < HG; gz++) {
        for (let gx = 0; gx < HG; gx++) {
          const v = hist[gz * HG + gx];
          if (!v) continue;
          const a = Math.log1p(v) / Math.log1p(mx);
          g.fillStyle = isD ? `rgba(255,63,63,${(0.9 * a).toFixed(3)})`
                            : `rgba(204,0,0,${(0.85 * a).toFixed(3)})`;
          g.fillRect(w / 2 + (gx / HG - 0.5) * (w / 1.1), zTop + gz * ch, cw + 0.5, ch + 0.5);
        }
      }
    }
    g.strokeStyle = isD ? "#444" : "#bbb";
    g.beginPath(); g.moveTo(0, zTop); g.lineTo(w, zTop); g.stroke();
    if (yF < h) { g.beginPath(); g.moveTo(0, yF); g.lineTo(w, yF); g.stroke(); }
    g.fillStyle = isD ? "#ccc" : "#333"; g.font = "12px system-ui";
    g.fillText("deposited energy (log color scale)", 10, 16);
  }
  function drawTraj(g, t, X, Y) {
    g.strokeStyle = t.bse ? (dark() ? "rgba(255,63,63,0.85)" : "rgba(204,0,0,0.8)")
                  : t.tr ? (dark() ? "rgba(224,168,50,0.6)" : "rgba(180,125,20,0.55)")
                         : (dark() ? "rgba(160,190,255,0.28)" : "rgba(40,70,160,0.22)");
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(X(t.pts[0][0]), Y(t.pts[0][1]));
    for (let i = 1; i < t.pts.length; i++) g.lineTo(X(t.pts[i][0]), Y(t.pts[i][1]));
    g.stroke();
  }
  let sinceHist = 0;
  function tick() {
    if (visible && nDone < inN()) {
      const m = MATS[sel.value], E0 = +inE.value;
      const dpr = window.devicePixelRatio || 1;
      const g = cv.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = cv.clientWidth || 360, h = 360;
      const { X, Y } = view(w, h);
      const batch = Math.min(40, inN() - nDone);
      for (let k = 0; k < batch; k++) {
        const t = trajectory(m, E0, tFilm);
        nDone++;
        if (t.bse) nBse++;
        if (t.tr) nTr++;
        accumulate(t);
        for (const p of t.pts) if (p[1] > maxDepth) maxDepth = p[1];
        if (trajs.length < 250) { trajs.push(t); drawTraj(g, t, X, Y); }
      }
      if (++sinceHist >= 8 || nDone >= inN()) { drawHist(); sinceHist = 0; }
      root.querySelector(".w-nt").textContent = nDone;
      root.querySelector(".w-bse").textContent = "η = " + (nBse / nDone).toFixed(3);
      root.querySelector(".w-tr").textContent = "T = " + (nTr / nDone).toFixed(3);
      root.querySelector(".w-md").textContent =
        maxDepth >= 1 ? maxDepth.toFixed(2) + " µm" : (maxDepth * 1000).toFixed(0) + " nm";
    }
    raf = requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  for (const i of [inE, sel, inTh, root.querySelector(".w-N")]) i.addEventListener("input", setup);
  root.querySelector(".w-go").addEventListener("click", setup);
  new ResizeObserver(() => { redrawAll(); drawHist(); }).observe(cv);
  syncTheme(); setup(); tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, trajectory, koRange, MATS };
