// afm-tip.js
// AnyWidget: AFM tip convolution, drawn at true aspect ratio (100 nm scan)
// so the tip apex is a real circle. Tip presets carry representative apex
// radii and sidewall half-angles (sphere-on-cone model): Si (~7 nm, ~12 deg),
// sharp Si3N4 (~2 nm), diamond-coated (~40 nm, blunter). The measured trace
// is the morphological dilation of the surface by the tip shape; the tip
// scans continuously, or follows the pointer on hover. Double tip optional.
//
//   :::{anywidget} ../../widgets/afm-tip.js
//   :::

const NX = 500, XMAX = 100;           // nm
const YMAX = 32;                      // nm vertical extent of the plot
const TIPS = {
  "Si": { R: 7, ang: 12 },
  "Si₃N₄": { R: 2, ang: 15 },
  "diamond-coated": { R: 40, ang: 25 },
};

function makeSurface(kind) {
  const s = new Float64Array(NX);
  const x = i => i / NX * XMAX;
  if (kind === "Steps") {
    for (let i = 0; i < NX; i++)
      s[i] = 4 * Math.floor(Math.max(0, Math.min(4, (x(i) - 12) / 19)));
  } else if (kind === "Trench") {
    for (let i = 0; i < NX; i++) s[i] = (x(i) > 46 && x(i) < 54) ? 0 : 14;
  } else if (kind === "Device") {
    for (let i = 0; i < NX; i++) {
      const xx = x(i);
      let v = 0;
      if (xx > 8 && xx < 21) v = 12;
      if (xx > 33 && xx < 36.5) v = 12;
      if (xx > 44 && xx < 47.5) v = 12;
      if (xx > 56 && xx < 82) v = 6;
      if (xx > 66 && xx < 69.5) v = 0;
      s[i] = v;
    }
  } else if (kind === "Particles") {
    const ps = [[18, 6], [42, 3], [65, 9], [88, 2]];
    for (let i = 0; i < NX; i++) {
      let v = 0;
      for (const [cx, r] of ps) {
        const d = x(i) - cx;
        if (Math.abs(d) < r) v = Math.max(v, Math.sqrt(r * r - d * d));
      }
      s[i] = v;
    }
  } else if (kind === "Spikes") {
    for (const cx of [18, 40, 62, 84])
      for (let i = 0; i < NX; i++) {
        const d = Math.abs(x(i) - cx);
        if (d < 1.2) s[i] = Math.max(s[i], 11 * (1 - d / 1.2));
      }
  } else { // Rough
    let seedv = 7;
    const rand = () => { seedv = (seedv * 16807) % 2147483647; return seedv / 2147483647; };
    const amps = [], phs = [];
    for (let k = 1; k <= 20; k++) { amps.push(rand() / Math.pow(k, 0.9)); phs.push(rand() * 6.28); }
    for (let i = 0; i < NX; i++) {
      let v = 0;
      for (let k = 1; k <= 20; k++) v += amps[k - 1] * Math.sin(2 * Math.PI * k * i / NX + phs[k - 1]);
      s[i] = 4.5 + 2.2 * v;
    }
  }
  return s;
}
// tip profile above the apex: sphere of radius R blended into a cone of
// half-angle ang (deg) at the tangent point
function tipProfile(d, R, ang) {
  const al = ang * Math.PI / 180;
  const dt = R * Math.cos(al);
  const ad = Math.abs(d);
  if (ad <= dt) return R - Math.sqrt(R * R - ad * ad);
  return R - R * Math.sin(al) + (ad - dt) / Math.tan(al);
}
function dilate(s, R, ang, doubleTip) {
  const dx = XMAX / NX;
  const out = new Float64Array(NX);
  const reach = Math.ceil((R + YMAX * Math.tan(ang * Math.PI / 180)) / dx);
  const apexes = doubleTip ? [[0, 0], [Math.round(8 / dx), 1.2]] : [[0, 0]];
  for (let i = 0; i < NX; i++) {
    let m = -1e9;
    for (const [off, drop] of apexes) {
      for (let j = -reach; j <= reach; j++) {
        const u = i + off + j;
        if (u < 0 || u >= NX) continue;
        const v = s[u] - tipProfile(j * dx, R, ang) - drop;
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
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; cursor:crosshair; }
.${uid} .w-controls { display:flex; gap:10px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:3px 9px; cursor:pointer; font-size:13px; }
.${uid} .w-controls button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} input[type=range] { flex:1 1 80px; accent-color:var(--w-accent); }
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<canvas height="330"></canvas>
<div class="w-controls"><span>sample:</span><span class="w-presets" style="display:flex;gap:6px;flex-wrap:wrap"></span></div>
<div class="w-controls"><span>tip:</span><span class="w-tips" style="display:flex;gap:6px;flex-wrap:wrap"></span>
  <span>R <span class="w-stat w-rv"></span></span>
  <input class="w-R" type="range" min="1" max="50" step="0.5" value="7">
  <button class="w-dbl">double tip</button>
  <span>R<sub>q</sub> true <span class="w-stat w-rqt"></span> · measured <span class="w-stat w-rqm"></span></span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>AFM tip convolution.</b> A real tip shape scans known structures; the trace is the dilation.";
  root.appendChild(cap);

  const cv = root.querySelector("canvas");
  const inR = root.querySelector(".w-R");
  const dblBtn = root.querySelector(".w-dbl");
  let kind = "Particles", tipName = "Si", ang = TIPS["Si"].ang, dbl = false;
  let hoverX = null, scanX = 0, raf = 0, visible = true;

  const presetBox = root.querySelector(".w-presets");
  for (const k of ["Particles", "Trench", "Steps", "Device", "Spikes", "Rough"]) {
    const b = document.createElement("button");
    b.textContent = k;
    if (k === kind) b.classList.add("on");
    b.addEventListener("click", () => {
      kind = k;
      presetBox.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
    });
    presetBox.appendChild(b);
  }
  const tipBox = root.querySelector(".w-tips");
  for (const [name, t] of Object.entries(TIPS)) {
    const b = document.createElement("button");
    b.textContent = name;
    if (name === tipName) b.classList.add("on");
    b.addEventListener("click", () => {
      tipName = name; ang = t.ang; inR.value = t.R;
      tipBox.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
    });
    tipBox.appendChild(b);
  }
  dblBtn.addEventListener("click", () => { dbl = !dbl; dblBtn.classList.toggle("on", dbl); });

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  function draw() {
    const R = +inR.value;
    const s = makeSurface(kind);
    const m = dilate(s, R, ang, dbl);
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 500, h = 330;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    // equal aspect: same nm-per-pixel horizontally and vertically
    const mL = 44, mR2 = 8;
    const scale = (w - mL - mR2) / XMAX;      // px per nm
    const yBase = h - 20;
    const X = i => mL + (i / NX) * XMAX * scale;
    const Xnm = xnm => mL + xnm * scale;
    const Y = v => yBase - v * scale;
    // height gridlines every 5 nm
    g.strokeStyle = isD ? "#333" : "#eee"; g.font = "13px system-ui";
    for (let z = 0; z <= YMAX; z += 5) {
      if (Y(z) < 14) break;
      g.beginPath(); g.moveTo(mL, Y(z)); g.lineTo(w - mR2, Y(z)); g.stroke();
      g.fillStyle = isD ? "#888" : "#999";
      g.fillText(z + " nm", 2, Y(z) + 4);
    }
    // true surface, filled
    g.beginPath(); g.moveTo(X(0), Y(s[0]));
    for (let i = 1; i < NX; i++) g.lineTo(X(i), Y(s[i]));
    g.lineTo(w - mR2, yBase); g.lineTo(mL, yBase); g.closePath();
    g.fillStyle = isD ? "#3a3735" : "#dad6d0"; g.fill();
    // measured trace
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)"; g.lineWidth = 2;
    g.beginPath();
    for (let i = 0; i < NX; i++) i ? g.lineTo(X(i), Y(m[i])) : g.moveTo(X(i), Y(m[i]));
    g.stroke();
    // tip: sphere (true circle at this aspect) plus tangent cone sides
    const tipPx = hoverX !== null ? hoverX : scanX;
    const xnm = Math.max(0, Math.min(XMAX, (tipPx - mL) / scale));
    const i0 = Math.max(0, Math.min(NX - 1, Math.round(xnm / XMAX * NX)));
    const apex = m[i0];
    const drawTip = (xc, apexH, ghost) => {
      const cx = Xnm(xc), cyC = Y(apexH + R);
      g.strokeStyle = ghost ? (isD ? "#777" : "#999") : (isD ? "#ddd" : "#333");
      g.lineWidth = 1.5;
      g.beginPath(); g.arc(cx, cyC, R * scale, 0, 6.3); g.stroke();
      // cone sides tangent to the sphere, up to the top of the plot
      const al = ang * Math.PI / 180;
      const dt = R * Math.cos(al), ht = R - R * Math.sin(al);
      const topY = 8;
      const hAtTop = apexH + (yBase - topY) / scale;
      const dTop = dt + Math.tan(al) * (hAtTop - apexH - ht);
      for (const sgn of [-1, 1]) {
        g.beginPath();
        g.moveTo(Xnm(xc + sgn * dt), Y(apexH + ht));
        g.lineTo(Xnm(xc + sgn * Math.min(dTop, XMAX)), topY);
        g.stroke();
      }
    };
    drawTip(xnm, apex, false);
    if (dbl) drawTip(xnm - 8, apex + 1.2, true);
    g.fillStyle = isD ? "#999" : "#777"; g.font = "13px system-ui";
    g.fillText("true surface (grey), measured trace (red) · hover to place the tip", mL + 4, 14);
    root.querySelector(".w-rv").textContent = R.toFixed(1) + " nm";
    root.querySelector(".w-rqt").textContent = rq(s).toFixed(2) + " nm";
    root.querySelector(".w-rqm").textContent = rq(m).toFixed(2) + " nm";
  }
  cv.addEventListener("pointermove", ev => {
    const r = cv.getBoundingClientRect();
    hoverX = ev.clientX - r.left;
  });
  cv.addEventListener("pointerleave", () => { hoverX = null; });
  function tick() {
    if (visible) {
      if (hoverX === null) {
        const w = cv.clientWidth || 500;
        scanX = (scanX + w / 560) % w;
      }
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

export default { render, makeSurface, dilate, tipProfile };
