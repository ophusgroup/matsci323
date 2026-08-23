// rbs-spectrum.js
// AnyWidget: interactive Rutherford backscattering spectrum of a layer stack.
// Kinematics (K factor) and the Z^2/E^2 Rutherford cross section are exact;
// stopping powers are approximate (tabulated near-2-MeV values, taken as
// energy independent), so depth scales are semi-quantitative. Detector
// resolution 15 keV FWHM. Static widget, redraws on input.
//
//   :::{anywidget} ../../widgets/rbs-spectrum.js
//   :::

const M1 = 4.0026;                    // He-4
// element: mass, Z, atomic density (atoms/nm^3), stopping cross section
// eps (eV per 1e15 atoms/cm^2, approximate for ~2 MeV He)
const ELEMS = {
  C:  { m: 12.011, z: 6,  n: 113,  eps: 26 },
  Al: { m: 26.98,  z: 13, n: 60.3, eps: 44 },
  Si: { m: 28.09,  z: 14, n: 49.9, eps: 46 },
  Ti: { m: 47.87,  z: 22, n: 56.7, eps: 62 },
  Fe: { m: 55.85,  z: 26, n: 84.9, eps: 66 },
  Cu: { m: 63.55,  z: 29, n: 84.9, eps: 68 },
  Ag: { m: 107.87, z: 47, n: 58.6, eps: 89 },
  Hf: { m: 178.49, z: 72, n: 44.9, eps: 105 },
  W:  { m: 183.84, z: 74, n: 63.2, eps: 108 },
  Au: { m: 196.97, z: 79, n: 59.0, eps: 115 },
};
const THETA = 165 * Math.PI / 180;    // scattering angle
const EXIT = Math.PI - THETA;         // exit path angle from surface normal

function kFactor(m2) {
  const c = Math.cos(THETA), s = Math.sin(THETA);
  const q = (M1 * c + Math.sqrt(m2 * m2 - M1 * M1 * s * s)) / (M1 + m2);
  return q * q;
}
function dEdx(el) { // eV/nm = eps * n(atoms/nm^3) * 0.1
  return el.eps * el.n * 0.1;
}

// build spectrum: counts vs detected energy (keV), 2 keV bins
function spectrum(stack, E0keV) {
  const nb = 1024, Emax = E0keV * 1.05;
  const bins = new Float64Array(nb);
  const binOf = E => Math.floor(E / Emax * nb);
  let Ein = E0keV * 1000;             // eV, energy at current depth going in
  let outAbove = 0;                   // outgoing-path loss through layers above
  for (const lay of stack) {
    const el = ELEMS[lay.el], K = kFactor(el.m);
    const sIn = dEdx(el), sOut = sIn / Math.cos(EXIT); // outgoing path factor
    const dx = 1;                     // nm steps
    let x = 0, E = Ein;
    while (x < lay.t && E > 200000) {
      // scatter at depth x: detected energy = K*E minus the outgoing loss in
      // this layer plus the accumulated loss crossing every layer above
      let Edet = K * E - sOut * x - outAbove;
      if (Edet > 0) {
        const w = el.z * el.z / ((E / 1e6) ** 2) * el.n * dx; // Z^2/E^2 * areal density
        const b = binOf(Edet / 1000);
        if (b >= 0 && b < nb) bins[b] += w;
      }
      E -= sIn * dx; x += dx;
    }
    Ein = E;
    outAbove += sOut * Math.min(x, lay.t);
    if (Ein < 200000) break;
  }
  // detector resolution: gaussian, 15 keV FWHM -> sigma 6.4 keV
  const sigB = 6.4 / (Emax / nb);
  const out = new Float64Array(nb);
  const wHalf = Math.ceil(3 * sigB);
  const kern = [];
  for (let i = -wHalf; i <= wHalf; i++) kern.push(Math.exp(-i * i / (2 * sigB * sigB)));
  const ks = kern.reduce((a, b) => a + b, 0);
  for (let i = 0; i < nb; i++) {
    if (!bins[i]) continue;
    for (let j = -wHalf; j <= wHalf; j++) {
      const t = i + j;
      if (t >= 0 && t < nb) out[t] += bins[i] * kern[j + wHalf] / ks;
    }
  }
  return { bins: out, Emax };
}

function render({ model, el }) {
  const uid = "rb" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,80,90); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1 1 360px; min-width:300px; }
.${uid} .w-ctl { width:230px; display:flex; flex-direction:column; gap:8px; font-size:13px;
  color:var(--w-muted); }
.${uid} .w-lay { background:var(--w-panel); border:1px solid var(--w-border); border-radius:6px;
  padding:6px 8px; display:flex; flex-direction:column; gap:3px; }
.${uid} .w-lay .w-val { color:var(--w-fg); font-weight:600; }
.${uid} select, .${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
.${uid} select { background:var(--w-panel); color:var(--w-fg); border:1px solid var(--w-border);
  border-radius:5px; padding:2px; }
.${uid} .w-note { font-size:12px; line-height:1.4; }
.${uid} .w-stackview { height:26px; display:flex; border:1px solid var(--w-border);
  border-radius:5px; overflow:hidden; font-size:10px; }
.${uid} .w-stackview div { display:flex; align-items:center; justify-content:center;
  color:#fff; text-shadow:0 0 2px #000; min-width:14px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  const layerHTML = (i, def, defT) => `
<div class="w-lay">
  <span>layer ${i + 1} <span class="w-val w-e${i}v"></span></span>
  <select class="w-e${i}"><option>none</option>${Object.keys(ELEMS).map(e => `<option${e === def ? " selected" : ""}>${e}</option>`).join("")}</select>
  <input class="w-t${i}" type="range" min="5" max="400" step="5" value="${defT}">
</div>`;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot">
    <canvas class="w-schem" height="96" style="border-radius:8px; margin-bottom:8px"></canvas>
    <canvas class="w-main" height="300"></canvas>
  </div>
  <div class="w-ctl">
    <div class="w-lay"><span>beam energy <span class="w-val w-ev"></span></span>
      <input class="w-E" type="range" min="1000" max="3000" step="50" value="2000"></div>
    ${layerHTML(0, "Au", 40)}
    ${layerHTML(1, "none", 100)}
    <div class="w-lay"><span>substrate <span class="w-val">bulk</span></span>
      <select class="w-sub">${Object.keys(ELEMS).map(e => `<option${e === "Si" ? " selected" : ""}>${e}</option>`).join("")}</select></div>
    <div class="w-stackview"></div>
    <div class="w-note">2 MeV-class He beam, scattering angle 165°, detector
      15 keV FWHM. Kinematics and cross sections exact; stopping approximate.</div>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>RBS spectrum builder.</b> The backscattering spectrum of your stack; kinematics exact, stopping approximate.";
  root.appendChild(cap);

  const cv = root.querySelector(".w-main");
  const sc = root.querySelector(".w-schem");
  const inE = root.querySelector(".w-E"), sub = root.querySelector(".w-sub");
  const els = [root.querySelector(".w-e0"), root.querySelector(".w-e1")];
  const ths = [root.querySelector(".w-t0"), root.querySelector(".w-t1")];
  const COLORS = { C: "#555", Al: "#888ca0", Si: "#7a6ea8", Ti: "#5c8aa8", Fe: "#a06848",
    Cu: "#b87333", Ag: "#9aa4ac", Hf: "#6aa084", W: "#4a6a8a", Au: "#c9a227" };

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const E0 = +inE.value / 1000; // MeV
    const stack = [];
    for (let i = 0; i < 2; i++) {
      if (els[i].value !== "none") stack.push({ el: els[i].value, t: +ths[i].value });
      root.querySelector(`.w-e${i}v`).textContent =
        els[i].value === "none" ? "" : ths[i].value + " nm " + els[i].value;
    }
    stack.push({ el: sub.value, t: 4000 });
    root.querySelector(".w-ev").textContent = (E0).toFixed(2) + " MeV";
    // stack cartoon
    const sv = root.querySelector(".w-stackview");
    sv.innerHTML = "";
    for (const l of stack) {
      const d = document.createElement("div");
      d.style.background = COLORS[l.el];
      d.style.flex = l.t >= 4000 ? "1.2" : String(Math.max(0.25, l.t / 150));
      d.textContent = l.el;
      sv.appendChild(d);
    }
    // ---- schematic: beam in from the left, stack at right, detector upper left ----
    {
      const dpr = window.devicePixelRatio || 1;
      const sw = sc.clientWidth || 420, sh = 96;
      sc.width = sw * dpr; sc.height = sh * dpr;
      const q = sc.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isD = dark();
      q.fillStyle = isD ? "#221f1e" : "#ffffff";
      q.fillRect(0, 0, sw, sh);
      const sx = sw * 0.72, cym = sh * 0.62;
      // layer stack (beam hits its left face)
      let off = 0;
      for (const l of stack) {
        const wpx = l.t >= 4000 ? 30 : Math.max(6, l.t / 14);
        q.fillStyle = COLORS[l.el];
        q.fillRect(sx + off, 12, wpx, sh - 24);
        q.fillStyle = "#fff"; q.font = "11px system-ui";
        if (wpx > 13) q.fillText(l.el, sx + off + 2, sh - 28);
        off += wpx;
      }
      // incident beam, left to right
      q.strokeStyle = isD ? "rgb(255,80,90)" : "rgb(204,0,0)"; q.lineWidth = 2;
      q.beginPath(); q.moveTo(8, cym); q.lineTo(sx - 2, cym); q.stroke();
      q.beginPath(); q.moveTo(sx - 10, cym - 4); q.lineTo(sx - 2, cym); q.lineTo(sx - 10, cym + 4); q.stroke();
      q.fillStyle = isD ? "#eee" : "#222"; q.font = "12px system-ui";
      q.fillText("He beam", 10, cym - 8);
      // backscattered ray at 165 degrees and the detector it reaches
      const bs = 165 * Math.PI / 180;
      const dxd = sx + Math.cos(bs) * (sw * 0.42), dyd = cym - Math.sin(bs) * (sh * 0.42);
      q.setLineDash([4, 3]);
      q.beginPath(); q.moveTo(sx, cym); q.lineTo(dxd, dyd); q.stroke();
      q.setLineDash([]);
      q.fillStyle = isD ? "#666" : "#888";
      q.fillRect(dxd - 5, dyd - 10, 10, 20);
      q.fillStyle = isD ? "#eee" : "#222";
      q.fillText("detector", dxd - 24, dyd - 16);
      q.fillText("θ = 165°", sx - 92, cym - 22);
    }
    const { bins, Emax } = spectrum(stack, E0 * 1000);
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 380, h = 340;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const mL = 40, mR = 8, mT = 26, mB = 34;
    const pw = w - mL - mR, ph = h - mT - mB;
    const isD = dark();
    let ymax = 0;
    for (const b of bins) ymax = Math.max(ymax, b);
    ymax = ymax || 1;
    g.strokeStyle = isD ? "#333" : "#eee";
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    for (let e = 0; e <= Emax; e += 250) {
      const xx = mL + e / Emax * pw;
      g.beginPath(); g.moveTo(xx, mT); g.lineTo(xx, h - mB); g.stroke();
      g.fillText(e, xx - 8, h - mB + 14);
    }
    g.fillText("detected energy (keV)", mL + pw / 2 - 50, h - 6);
    g.save(); g.translate(12, mT + ph / 2 + 30); g.rotate(-Math.PI / 2);
    g.fillText("yield (arb.)", 0, 0); g.restore();
    // spectrum fill
    g.beginPath();
    g.moveTo(mL, h - mB);
    for (let i = 0; i < bins.length; i++)
      g.lineTo(mL + (i / bins.length) * pw, h - mB - (bins[i] / ymax) * ph * 0.94);
    g.lineTo(mL + pw, h - mB);
    g.closePath();
    g.fillStyle = isD ? "rgba(255,80,90,0.25)" : "rgba(204,0,0,0.15)";
    g.fill();
    g.strokeStyle = isD ? "rgb(255,80,90)" : "rgb(204,0,0)";
    g.lineWidth = 1.5; g.stroke();
    // surface-edge markers K*E0 for every element in the stack
    const seen = new Set();
    for (const l of stack) {
      if (seen.has(l.el)) continue; seen.add(l.el);
      const Ke = kFactor(ELEMS[l.el].m) * E0 * 1000;
      const xx = mL + Ke / Emax * pw;
      g.strokeStyle = isD ? "#777" : "#aaa"; g.setLineDash([3, 3]);
      g.beginPath(); g.moveTo(xx, mT); g.lineTo(xx, h - mB); g.stroke();
      g.setLineDash([]);
      g.fillStyle = isD ? "#ccc" : "#444";
      g.fillText(l.el, xx - 6, mT - 4);
    }
  }
  for (const i of [inE, sub, ...els, ...ths]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, kFactor, spectrum, ELEMS };
