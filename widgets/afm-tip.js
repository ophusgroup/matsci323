// afm-tip.js
// AnyWidget: AFM tip convolution. A known surface profile is scanned by a
// spherical tip of adjustable radius; the measured trace is the morphological
// dilation (the apex height when the tip touches the surface). Presets show
// the classic artifacts: broadened particles, narrowed trenches, and the
// doubled features of a double tip. Move the pointer over the plot to see
// the tip ride the surface. Static widget, redraws on input.
//
//   :::{anywidget} ../../widgets/afm-tip.js
//   :::

const NX = 480, XMAX = 200;           // nm
function makeSurface(kind) {
  const s = new Float64Array(NX);
  const x = i => i / NX * XMAX;
  if (kind === "Steps") {
    for (let i = 0; i < NX; i++) s[i] = 4 * Math.floor(Math.max(0, Math.min(4, (x(i) - 30) / 35)));
  } else if (kind === "Trench") {
    // narrow deep trench with vertical walls: the tip cannot reach the bottom
    for (let i = 0; i < NX; i++) s[i] = (x(i) > 92 && x(i) < 108) ? 0 : 14;
  } else if (kind === "Device") {
    for (let i = 0; i < NX; i++) {
      const xx = x(i);
      let v = 0;
      if (xx > 20 && xx < 42) v = 12;                       // wide line
      if (xx > 66 && xx < 72) v = 12;                       // narrow fin
      if (xx > 88 && xx < 94) v = 12;                       // narrow fin
      if (xx > 115 && xx < 165) v = 6;                      // low pad
      if (xx > 132 && xx < 138) v = 0;                      // contact hole in pad
      s[i] = v;
    }
  } else if (kind === "Particles") {
    const ps = [[40, 8], [90, 4], [130, 12], [170, 2.5]];
    for (let i = 0; i < NX; i++) {
      let v = 0;
      for (const [cx, r] of ps) {
        const d = x(i) - cx;
        if (Math.abs(d) < r) v = Math.max(v, Math.sqrt(r * r - d * d) + 0);
      }
      s[i] = v;
    }
  } else if (kind === "Spikes") {
    for (const cx of [40, 80, 120, 160])
      for (let i = 0; i < NX; i++) {
        const d = Math.abs(x(i) - cx);
        if (d < 2) s[i] = Math.max(s[i], 10 * (1 - d / 2));
      }
  } else { // Rough
    let seedv = 7;
    const rand = () => { seedv = (seedv * 16807) % 2147483647; return seedv / 2147483647; };
    const amps = [], phs = [];
    for (let k = 1; k <= 24; k++) { amps.push(rand() / Math.pow(k, 0.9)); phs.push(rand() * 6.28); }
    for (let i = 0; i < NX; i++) {
      let v = 0;
      for (let k = 1; k <= 24; k++) v += amps[k - 1] * Math.sin(2 * Math.PI * k * i / NX + phs[k - 1]);
      s[i] = 4 + 2.2 * v;
    }
  }
  return s;
}
// measured trace: apex height h(x) = max_u [ s(u) - T(u-x) ], sphere tip
function dilate(s, R, doubleTip) {
  const dx = XMAX / NX;
  const out = new Float64Array(NX);
  const nR = Math.ceil(R / dx);
  const apexes = doubleTip ? [[0, 0], [Math.round(12 / dx), 1.5]] : [[0, 0]];
  for (let i = 0; i < NX; i++) {
    let m = -1e9;
    for (const [off, drop] of apexes) {
      for (let j = -nR; j <= nR; j++) {
        const u = i + off + j;
        if (u < 0 || u >= NX) continue;
        const d = j * dx;
        const T = R - Math.sqrt(Math.max(0, R * R - d * d)); // tip profile above apex
        const v = s[u] - T - drop;
        if (v > m) m = v;
      }
    }
    out[i] = m;
  }
  return out;
}
const rq = a => {
  const mean = a.reduce((x, y) => x + y, 0) / a.length;
  return Math.sqrt(a.reduce((x, y) => x + (y - mean) ** 2, 0) / a.length);
};

function render({ model, el }) {
  const uid = "af" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; cursor:crosshair; }
.${uid} .w-controls { display:flex; gap:10px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:3px 9px; cursor:pointer; font-size:13px; }
.${uid} .w-controls button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} input[type=range] { flex:1 1 90px; accent-color:var(--w-accent); }
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<canvas height="270"></canvas>
<div class="w-controls w-presets"></div>
<div class="w-controls">
  <span>tip radius <span class="w-stat w-rv"></span></span>
  <input class="w-R" type="range" min="1" max="50" step="0.5" value="10">
  <button class="w-dbl">double tip</button>
  <span>R<sub>q</sub> true <span class="w-stat w-rqt"></span> · measured <span class="w-stat w-rqm"></span></span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>AFM tip convolution.</b> A spherical tip scans known test structures; the measured trace is the truth dilated by the tip shape.";
  root.appendChild(cap);

  const cv = root.querySelector("canvas");
  const inR = root.querySelector(".w-R");
  const dblBtn = root.querySelector(".w-dbl");
  const presetBox = root.querySelector(".w-presets");
  let kind = "Particles", dbl = false, hoverX = null;
  let scanX = 0, raf = 0, visible = true;
  for (const k of ["Particles", "Trench", "Steps", "Device", "Spikes", "Rough"]) {
    const b = document.createElement("button");
    b.textContent = k;
    if (k === kind) b.classList.add("on");
    b.addEventListener("click", () => {
      kind = k;
      presetBox.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
      draw();
    });
    presetBox.appendChild(b);
  }
  dblBtn.addEventListener("click", () => { dbl = !dbl; dblBtn.classList.toggle("on", dbl); draw(); });

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const R = +inR.value;
    const s = makeSurface(kind);
    const m = dilate(s, R, dbl);
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 420, h = 270;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    const yMax = 28;
    const X = i => i / NX * w;
    const Y = v => h - 18 - (v / yMax) * (h - 60);
    // true surface (filled)
    g.beginPath(); g.moveTo(0, Y(s[0]));
    for (let i = 1; i < NX; i++) g.lineTo(X(i), Y(s[i]));
    g.lineTo(w, h); g.lineTo(0, h); g.closePath();
    g.fillStyle = isD ? "#3a3735" : "#dad6d0"; g.fill();
    // measured trace
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)"; g.lineWidth = 1.8;
    g.beginPath();
    for (let i = 0; i < NX; i++) i ? g.lineTo(X(i), Y(m[i])) : g.moveTo(X(i), Y(m[i]));
    g.stroke();
    // height gridlines every 5 nm
    g.strokeStyle = isD ? "#333" : "#eee"; g.font = "12px system-ui";
    for (let z = 0; z <= 25; z += 5) {
      g.beginPath(); g.moveTo(30, Y(z)); g.lineTo(w, Y(z)); g.stroke();
      g.fillStyle = isD ? "#888" : "#999";
      g.fillText(z + " nm", 2, Y(z) + 4);
    }
    // tip: at the cursor if hovering, else riding the automatic scan
    const tipPx = hoverX !== null ? hoverX : scanX;
    {
      const i = Math.max(0, Math.min(NX - 1, Math.round(tipPx / w * NX)));
      const apex = m[i];
      const cx = X(i), cy = Y(apex + R);
      const rPix = R / XMAX * w;                     // horizontal scale
      const rPixV = R / yMax * (h - 60);             // vertical scale differs
      g.strokeStyle = isD ? "#ddd" : "#333"; g.lineWidth = 1.2;
      g.beginPath();
      // draw the tip as an ellipse to respect the anisotropic axes
      g.ellipse(cx, cy - 0, rPix, rPixV, 0, 0, 6.3);
      g.stroke();
      g.beginPath(); g.arc(cx, Y(apex), 2.5, 0, 6.3);
      g.fillStyle = isD ? "#ddd" : "#333"; g.fill();
      if (dbl) {
        g.strokeStyle = isD ? "#999" : "#888";
        g.beginPath();
        g.ellipse(cx - 12 / XMAX * w, cy + 1.5 / yMax * (h - 60), rPix, rPixV, 0, 0, 6.3);
        g.stroke();
      }
    }
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    g.fillText("true surface (grey) and measured AFM trace (red) · hover to place the tip", 8, 13);
    g.fillText("200 nm scan, heights in nm", 8, h - 4);
    root.querySelector(".w-rv").textContent = R.toFixed(1) + " nm";
    root.querySelector(".w-rqt").textContent = rq(s).toFixed(2) + " nm";
    root.querySelector(".w-rqm").textContent = rq(m).toFixed(2) + " nm";
  }
  cv.addEventListener("pointermove", ev => {
    const r = cv.getBoundingClientRect();
    hoverX = ev.clientX - r.left;
  });
  cv.addEventListener("pointerleave", () => { hoverX = null; });
  inR.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  function tick() {
    if (visible) {
      if (hoverX === null) {
        const w = cv.clientWidth || 420;
        scanX = (scanX + w / 480) % w;    // one sweep every ~8 s
      }
      draw();
    }
    raf = requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  syncTheme();
  tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, makeSurface, dilate };
