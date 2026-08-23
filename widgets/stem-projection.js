// stem-projection.js
// AnyWidget: projection in (S)TEM. A film with a buried interface is viewed
// two ways: cross-section (beam in the film plane, through a lamella of
// finite thickness) and plan view (beam along the film normal, through the
// whole stack). Buttons select the interface type; sliders set the roughness
// amplitude and the lamella thickness. The cross-section panel reports the
// apparent interface width, which for a rough interface is set by the
// roughness projected through the lamella, not by the chemistry.
//
//   :::{anywidget} ../../widgets/stem-projection.js
//   :::

const NX = 110, NZ = 90, NYS = 20;   // grid and y-integration samples
const ZINT = 0.5;                    // interface position, fraction of height
// smooth 2D noise for roughness, fixed seed
function makeNoise() {
  const amps = [], kx = [], ky = [], ph = [];
  let seed = 12345;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 14; i++) {
    const kk = 1 + Math.floor(rnd() * 5);
    kx.push(kk * (rnd() < 0.5 ? 1 : -1));
    ky.push(1 + Math.floor(rnd() * 5));
    amps.push(1 / Math.sqrt(kx[i] * kx[i] + ky[i] * ky[i]));
    ph.push(rnd() * 6.28);
  }
  let norm = 0;
  for (const a of amps) norm += a * a;
  norm = Math.sqrt(norm / 2);
  return (x, y) => {
    let v = 0;
    for (let i = 0; i < 14; i++)
      v += amps[i] * Math.sin(2 * Math.PI * (kx[i] * x + ky[i] * y) + ph[i]);
    return v / norm / 3.2;           // roughly unit-ish amplitude
  };
}
const noise = makeNoise();

// interface height (in z fraction) at lateral position (x, y in 0..1)
function zInt(kind, x, y, amp) {
  if (kind === "Sharp") return ZINT;
  if (kind === "Diffuse") return ZINT;
  if (kind === "Rough") return ZINT + amp * noise(x, y);
  if (kind === "Inclined") return ZINT + amp * (y - 0.5) * 1.6;
  return ZINT;
}
// composition at (x, y, z): 1 below the interface, 0 above; Diffuse grades
function comp(kind, x, y, z, amp) {
  const zi = zInt(kind, x, y, amp);
  if (kind === "Diffuse") {
    const wdif = Math.max(amp, 0.003);
    return 1 / (1 + Math.exp((z - zi) / (wdif / 2)));
  }
  return z < zi ? 1 : 0;
}

function render({ model, el }) {
  const uid = "sp" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} .w-top { display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap; }
.${uid} .w-top button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 12px; cursor:pointer; font-size:13px; }
.${uid} .w-top button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-col { flex:1 1 200px; min-width:190px; display:flex; flex-direction:column; gap:6px; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} label { font-size:13px; color:var(--w-muted); display:flex; flex-direction:column; gap:2px; }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-top"></div>
<div class="w-row">
  <div class="w-col"><canvas class="w-schem" height="290"></canvas>
    <label>interface roughness / width / tilt <span class="w-val w-ampv"></span>
      <input class="w-amp" type="range" min="0" max="0.16" step="0.005" value="0.06"></label></div>
  <div class="w-col"><canvas class="w-xs" height="290"></canvas>
    <label>lamella thickness (cross-section) <span class="w-val w-tv"></span>
      <input class="w-t" type="range" min="0.02" max="0.6" step="0.02" value="0.25"></label></div>
  <div class="w-col"><canvas class="w-pv" height="290"></canvas>
    <label style="visibility:hidden">spacer<input type="range"></label></div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Projection through the foil.</b> The same buried interface in cross-section and in plan view.";
  root.appendChild(cap);

  const top = root.querySelector(".w-top");
  let kind = "Rough";
  for (const k of ["Sharp", "Diffuse", "Rough", "Inclined"]) {
    const b = document.createElement("button");
    b.textContent = k;
    if (k === kind) b.classList.add("on");
    b.addEventListener("click", () => {
      kind = k;
      top.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
      draw();
    });
    top.appendChild(b);
  }
  const cvS = root.querySelector(".w-schem"), cvX = root.querySelector(".w-xs"), cvP = root.querySelector(".w-pv");
  const inAmp = root.querySelector(".w-amp"), inT = root.querySelector(".w-t");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const isD = dark();
    const amp = +inAmp.value, tLam = +inT.value;
    // ---------- schematic: oblique view of the film block with beams ----------
    {
      const w = cvS.clientWidth || 200, h = 290;
      cvS.width = w * dpr; cvS.height = h * dpr;
      const g = cvS.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = isD ? "#221f1e" : "#ffffff"; g.fillRect(0, 0, w, h);
      const bx = w * 0.16, by = h * 0.36, bw = w * 0.56, bh = h * 0.34;
      const ox = w * 0.16, oy = -h * 0.12;            // oblique offset
      // block: bottom layer (film B), top layer (film A), interface between
      const zi = by + bh * (1 - ZINT);
      const face = (x0, y0, x1, y1, c) => { g.fillStyle = c; g.fillRect(x0, y0, x1 - x0, y1 - y0); };
      // front face
      face(bx, by, bx + bw, zi, isD ? "#4a4440" : "#d8d2ca");           // top material
      face(bx, zi, bx + bw, by + bh, isD ? "#7a6ea8" : "#8a80b8");      // bottom material
      // interface roughness drawn on the front face
      g.strokeStyle = isD ? "#eee" : "#222"; g.lineWidth = 1.4;
      g.beginPath();
      for (let i = 0; i <= 60; i++) {
        const xf = i / 60;
        const z = zInt(kind, xf, 0, amp);
        const py = by + bh * (1 - z);
        i ? g.lineTo(bx + xf * bw, py) : g.moveTo(bx + xf * bw, py);
      }
      g.stroke();
      // top face (oblique)
      g.fillStyle = isD ? "#5a5450" : "#c8c2ba";
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + ox, by + oy);
      g.lineTo(bx + bw + ox, by + oy); g.lineTo(bx + bw, by); g.closePath(); g.fill();
      // side face
      g.fillStyle = isD ? "#3a3430" : "#e2dcd4";
      g.beginPath(); g.moveTo(bx + bw, by); g.lineTo(bx + bw + ox, by + oy);
      g.lineTo(bx + bw + ox, by + oy + bh); g.lineTo(bx + bw, by + bh); g.closePath(); g.fill();
      // beams
      const acc = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
      g.strokeStyle = acc; g.lineWidth = 2;
      // plan-view beam: down through the top face
      g.beginPath(); g.moveTo(bx + bw * 0.75 + ox / 2, 12);
      g.lineTo(bx + bw * 0.75 + ox / 2, by + oy + 10); g.stroke();
      // cross-section beam: into the page along y (drawn along the oblique axis)
      g.beginPath(); g.moveTo(bx + bw * 0.22 + ox, by + oy + bh * 0.5 - 26);
      g.lineTo(bx + bw * 0.22, by + bh * 0.5 + 4); g.stroke();
      g.fillStyle = isD ? "#ccc" : "#444"; g.font = "13px system-ui";
      g.fillText("plan-view beam", bx + bw * 0.55, 12);
      g.fillText("cross-section beam", 6, by + oy + bh * 0.5 - 32);
      g.fillText("film A / film B interface", bx, by + bh + 20);
      g.fillText("sample", 6, 16);
    }
    // ---------- cross-section image: project along y through the lamella ----------
    {
      const w = cvX.clientWidth || 200, h = 290;
      cvX.width = w * dpr; cvX.height = h * dpr;
      const g = cvX.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#0b0a0a"; g.fillRect(0, 0, w, h);
      const imH = h - 90, x0 = 8, y0 = 26, imW = w - 16;
      const prof = new Float64Array(NZ);
      for (let iz = 0; iz < NZ; iz++) {
        for (let ix = 0; ix < NX; ix++) {
          let s = 0;
          for (let iy = 0; iy < NYS; iy++)
            s += comp(kind, ix / NX, 0.5 + (iy / NYS - 0.5) * tLam, 1 - iz / NZ, amp);
          s /= NYS;
          const v = Math.round(40 + 190 * s);
          g.fillStyle = `rgb(${v},${Math.round(v * 0.92)},${Math.round(v * 0.85)})`;
          g.fillRect(x0 + ix / NX * imW, y0 + iz / NZ * imH, imW / NX + 0.5, imH / NZ + 0.5);
          prof[iz] += s / NX;
        }
      }
      // apparent width from the laterally averaged profile (10% to 90%)
      let z10 = -1, z90 = -1;
      for (let iz = 0; iz < NZ; iz++) {
        if (z10 < 0 && prof[iz] > 0.1) z10 = iz / NZ;
        if (z90 < 0 && prof[iz] > 0.9) z90 = iz / NZ;
      }
      const wid = (z10 >= 0 && z90 >= 0) ? Math.abs(z90 - z10) : 0;
      g.fillStyle = "#ddd"; g.font = "13px system-ui";
      g.fillText("cross-section image (beam into page)", 8, 16);
      g.fillText("apparent interface width: " + (wid * 100).toFixed(1) + " (a.u.)", 8, h - 64);
      // profile trace
      g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(255,120,140)"; g.lineWidth = 1.6;
      g.beginPath();
      for (let iz = 0; iz < NZ; iz++) {
        const px = x0 + prof[iz] * (imW - 4), py = h - 54 + iz / NZ * 44 - 44 + 44;
        iz ? g.lineTo(px, h - 50 + (iz / NZ) * 42) : g.moveTo(px, h - 50 + (iz / NZ) * 42);
      }
      g.stroke();
      g.fillStyle = "#999"; g.fillText("averaged profile", w - 130, h - 40);
    }
    // ---------- plan-view image: project along z through the whole stack ----------
    {
      const w = cvP.clientWidth || 200, h = 290;
      cvP.width = w * dpr; cvP.height = h * dpr;
      const g = cvP.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#0b0a0a"; g.fillRect(0, 0, w, h);
      const im = Math.min(w - 16, h - 60), x0 = (w - im) / 2, y0 = 30;
      const NP = 84;
      for (let iy = 0; iy < NP; iy++) {
        for (let ix = 0; ix < NP; ix++) {
          // projected composition = interface height at (x, y)
          let zi;
          if (kind === "Diffuse") zi = ZINT;   // graded but flat: uniform projection
          else zi = zInt(kind, ix / NP, iy / NP, amp);
          const v = Math.round(40 + 190 * Math.min(1, Math.max(0, zi)));
          g.fillStyle = `rgb(${v},${Math.round(v * 0.92)},${Math.round(v * 0.85)})`;
          g.fillRect(x0 + ix / NP * im, y0 + iy / NP * im, im / NP + 0.5, im / NP + 0.5);
        }
      }
      g.fillStyle = "#ddd"; g.font = "13px system-ui";
      g.fillText("plan-view image (beam into page)", 8, 16);
      if (kind === "Sharp" || kind === "Diffuse")
        g.fillText("flat interface: no contrast at all", x0 + 4, y0 + im + 18);
    }
    root.querySelector(".w-ampv").textContent = (amp * 100).toFixed(1) + " (a.u.)";
    root.querySelector(".w-tv").textContent = (tLam * 100).toFixed(0) + " (a.u.)";
  }
  for (const i of [inAmp, inT]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cvX);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, comp, zInt };
