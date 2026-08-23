// stm-tunnel.js
// AnyWidget: constant-current STM. A tip scans a row of surface atoms; the
// feedback loop adjusts tip height to hold the tunneling current constant,
// and the recorded height is the STM trace. Two special sites make the point
// that STM measures electronic structure, not geometry: one atom with high
// local density of states images tall, an adsorbate with low density images
// as a depression, at identical physical heights. Sliders set the current
// setpoint and the work function (decay constant).
//
//   :::{anywidget} ../../widgets/stm-tunnel.js
//   :::

const HBAR2_2M = 3.81;   // eV Angstrom^2 (hbar^2/2m for electrons)
// surface atoms: x (A), z (A), electronic weight (LDOS at the site)
const ATOMS = [];
for (let i = 0; i < 16; i++) ATOMS.push({ x: i * 8, z: 0, w: 1 });
ATOMS[5].w = 3.0;                     // dangling-bond-like site: bright
ATOMS[10] = { x: 80, z: 1.6, w: 0.03 }; // adsorbate: physically taller, dark

function current(xt, zt, kappa) {
  let I = 0;
  for (const a of ATOMS) {
    const r = Math.hypot(xt - a.x, zt - a.z);
    I += a.w * Math.exp(-2 * kappa * r);
  }
  return I;
}
// feedback: find z where current(x,z) = setpoint (monotonic in z)
function feedbackZ(x, setI, kappa) {
  let lo = 0.5, hi = 20;
  for (let it = 0; it < 40; it++) {
    const mid = (lo + hi) / 2;
    (current(x, mid, kappa) > setI) ? lo = mid : hi = mid;
  }
  return (lo + hi) / 2;
}

function render({ model, el }) {
  const uid = "st" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-controls { display:flex; gap:14px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls label { display:flex; align-items:center; gap:6px; }
.${uid} input[type=range] { width:110px; accent-color:var(--w-accent); }
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<canvas height="320"></canvas>
<div class="w-controls">
  <label>current setpoint <input class="w-I" type="range" min="-3" max="-0.5" step="0.05" value="-1.6"><span class="w-stat w-Iv"></span></label>
  <label>work function <input class="w-phi" type="range" min="1" max="6" step="0.1" value="4.5"><span class="w-stat w-pv"></span></label>
  <span>gap under tip <span class="w-stat w-gap">&ndash;</span></span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Constant-current STM.</b> The tip follows a contour of constant tunneling current, not the atomic positions.";
  root.appendChild(cap);

  const cv = root.querySelector("canvas");
  const inI = root.querySelector(".w-I"), inPhi = root.querySelector(".w-phi");
  let raf = 0, visible = true, scanX = 0;
  const trace = new Map();

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();
  for (const i of [inI, inPhi]) i.addEventListener("input", () => trace.clear());

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 500, h = 320;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    const kappa = Math.sqrt((+inPhi.value) / HBAR2_2M);  // 1/Angstrom
    const setI = Math.pow(10, +inI.value);
    const XA = 120;                                       // Angstroms shown
    const mL = 10, scale = (w - 20) / XA;
    const yAtoms = h - 60;
    const X = xa => mL + xa * scale;
    const Z = za => yAtoms - za * scale * 2.2;
    // surface atoms
    for (const a of ATOMS) {
      if (a.x > XA) continue;
      g.fillStyle = a.w > 2 ? "#e0a832" : a.w < 0.5 ? (isD ? "#5a8a6a" : "#6aa87a") : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath(); g.arc(X(a.x), Z(a.z), 7, 0, 6.3); g.fill();
    }
    g.fillStyle = isD ? "#999" : "#777"; g.font = "13px system-ui";
    g.fillText("bright site (high LDOS)", X(ATOMS[5].x) - 55, yAtoms + 24);
    g.fillText("adsorbate (low LDOS)", X(80) - 50, yAtoms + 40);
    // scan position and feedback
    const xa = (scanX / w) * XA;
    const zt = feedbackZ(xa, setI, kappa);
    trace.set(Math.round(xa * 2) / 2, zt);
    // tip: apex atom + body
    const tx = X(xa), ty = Z(zt);
    g.fillStyle = isD ? "#ddd" : "#444";
    g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx - 16, ty - 34); g.lineTo(tx + 16, ty - 34);
    g.closePath(); g.fill();
    g.beginPath(); g.arc(tx, ty, 5, 0, 6.3); g.fill();
    // tunneling arrows across the gap, density follows the current
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
    g.lineWidth = 1.4;
    const nArrows = 1 + Math.round(2 * (Math.log10(setI) + 3.2));
    for (let k = 0; k < Math.max(1, nArrows); k++) {
      const ox = (k - (nArrows - 1) / 2) * 4;
      g.beginPath(); g.moveTo(tx + ox, ty + 6); g.lineTo(tx + ox, Z(0) - 8); g.stroke();
    }
    // recorded trace (the STM topograph)
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)"; g.lineWidth = 2;
    g.beginPath();
    let started = false;
    const keys = [...trace.keys()].sort((a, b) => a - b);
    for (const kx of keys) {
      const px = X(kx), py = Z(trace.get(kx)) - 90;
      started ? g.lineTo(px, py) : g.moveTo(px, py);
      started = true;
    }
    g.stroke();
    g.fillStyle = isD ? "#999" : "#777";
    g.fillText("recorded tip height (the STM image)", mL + 4, 16);
    root.querySelector(".w-Iv").textContent = setI.toExponential(1) + " (rel.)";
    root.querySelector(".w-pv").textContent = (+inPhi.value).toFixed(1) + " eV";
    root.querySelector(".w-gap").textContent = zt.toFixed(1) + " Å";
  }
  function tick() {
    if (visible) {
      const w = cv.clientWidth || 500;
      scanX = (scanX + w / 700) % w;
      draw();
    }
    raf = requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, current, feedbackZ };
