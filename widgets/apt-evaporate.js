// apt-evaporate.js
// AnyWidget: atom probe tomography. Left: field evaporation of a needle
// specimen; atoms leave from the curved evaporation front where the field is
// highest, and the front recedes into the widening shank. Right: the
// reconstruction assembled from the detected atoms, with adjustable detection
// efficiency and lateral/depth position errors. The whole run is precomputed,
// so the time slider scrubs freely and the efficiency and error sliders
// re-render the reconstruction at any moment of the run. Ground-truth solute
// regions are shaded behind both panels.
//
//   :::{anywidget} ../../widgets/apt-evaporate.js
//   :::

const A = 1;
const CONE = 0.24;                 // shank slope
const R0 = 5.5;                    // initial apex radius
const DEPTH = 40;                  // tip length simulated

const CLUSTERS = [[-3, 9, 1.8], [2.5, 15, 2.2], [-1, 23, 1.9],
  [4, 29, 1.7], [-4.5, 33, 2.0], [0.5, 36, 1.6]];

const SAMPLES = {
  Multilayer: (x, z) => (z > 3) && ((z - 3) % 9 < 2.2),
  Clusters: (x, z) => {
    for (const [cx, cz, r] of CLUSTERS)
      if (Math.hypot(x - cx, z - cz) < r) return true;
    return false;
  },
  Interface: (x, z) => {
    // one chemically diffuse interface at z = 18, width ~3
    const p = 1 / (1 + Math.exp(-(z - 18) / 1.5));
    return Math.random() < p * 0.9;
  },
  Alloy: () => Math.random() < 0.18,
};

function buildTip(kind) {
  const atoms = [];
  const f = SAMPLES[kind];
  for (let j = 0; j < DEPTH / (A * 0.866); j++) {
    const z = j * A * 0.866;
    let r;
    if (z < R0) r = Math.sqrt(Math.max(0, R0 * R0 - (R0 - z) * (R0 - z)));
    else r = R0 + (z - R0) * CONE;
    const nx = Math.floor(r / A);
    for (let i = -nx; i <= nx; i++) {
      const x = (i + 0.5 * (j & 1)) * A;
      if (Math.abs(x) > r) continue;
      atoms.push({ x, z, b: !!f(x, z), ord: Infinity });
    }
  }
  return atoms;
}
function frontRadius(zf) {
  return zf < R0 ? R0 : R0 + (zf - R0) * CONE;
}
// evaporation-front radius of curvature: much wider than the shank radius so
// the front is one gentle arc spanning the whole tip, with no flat shoulders
function frontCurveR(zf) {
  return 2.6 * frontRadius(Math.max(zf, 2));
}
// evaporation coordinate: distance along the tip axis of the curved front
// passing through this atom; atoms with the smallest u are most exposed
function evapU(a, zf) {
  const R = frontCurveR(zf);
  return a.z - Math.max(0, R - Math.sqrt(Math.max(0, R * R - a.x * a.x)));
}
function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random(); while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
// simulate the complete evaporation sequence once; each event carries its own
// detection lottery number and error draws so the sliders replay consistently
function simulate(atoms) {
  const alive = atoms.slice();
  const events = [];
  while (true) {
    let zf = 1e9;
    for (const a of alive) if (a.z < zf) zf = a.z;
    if (zf > DEPTH - 8 || !alive.length) break;
    let uMin = 1e9;
    for (const a of alive) { const u = evapU(a, zf); if (u < uMin) uMin = u; }
    const cand = [];
    for (const a of alive) if (evapU(a, zf) < uMin + 1.2) cand.push(a);
    if (!cand.length) break;
    const pick = cand[Math.floor(Math.random() * cand.length)];
    alive.splice(alive.indexOf(pick), 1);
    pick.ord = events.length;
    events.push({ x: pick.x, z: pick.z, b: pick.b, zf,
      u: Math.random(), gx: gauss(), gz: gauss() });
  }
  return events;
}

function render({ model, el }) {
  const uid = "ap" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1 1 260px; min-width:240px; }
.${uid} .w-controls { display:flex; gap:14px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
.${uid} .w-controls button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} .w-controls label { display:flex; align-items:center; gap:6px; }
.${uid} input[type=range] { width:90px; accent-color:var(--w-accent); }
.${uid} input.w-time { width:170px; }
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-row">
  <div class="w-plot"><canvas class="w-tip" height="330"></canvas></div>
  <div class="w-plot"><canvas class="w-rec" height="330"></canvas></div>
</div>
<div class="w-controls">
  <span class="w-samples" style="display:contents"></span>
  <button class="w-play">&#10074;&#10074; Pause</button>
  <label>time <input class="w-time" type="range" min="0" max="1" step="1" value="0"></label>
</div>
<div class="w-controls">
  <label>efficiency <input class="w-eff" type="range" min="0.2" max="1" step="0.05" value="0.6"><span class="w-stat w-effv"></span></label>
  <label>xy error <input class="w-sx" type="range" min="0" max="4" step="0.1" value="1.5"><span class="w-stat w-sxv"></span></label>
  <label>z error <input class="w-sz" type="range" min="0" max="1" step="0.05" value="0.15"><span class="w-stat w-szv"></span></label>
  <span>solute: true <span class="w-stat w-ct">&ndash;</span> measured <span class="w-stat w-cm">&ndash;</span></span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Atom probe tomography.</b> Field evaporation (left) and the reconstruction from detected atoms (right).";
  root.appendChild(cap);

  const cvT = root.querySelector(".w-tip"), cvR = root.querySelector(".w-rec");
  const inTime = root.querySelector(".w-time");
  const btnPlay = root.querySelector(".w-play");
  let kind = "Multilayer";
  let atoms, events, t = 0, flying = [];
  let playing = true, raf = 0, visible = true, dirty = true;

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); dirty = true; }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  const sampleBox = root.querySelector(".w-samples");
  for (const k of Object.keys(SAMPLES)) {
    const b = document.createElement("button");
    b.textContent = k;
    if (k === kind) b.classList.add("on");
    b.addEventListener("click", () => {
      kind = k;
      sampleBox.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
      reset();               // keeps the current play/pause state
    });
    sampleBox.appendChild(b);
  }
  function reset() {
    atoms = buildTip(kind);
    events = simulate(atoms);
    t = 0; flying = [];
    inTime.max = events.length;
    inTime.value = 0;
    dirty = true;
    setBtn();
  }
  function setBtn() {
    btnPlay.innerHTML = playing ? "&#10074;&#10074; Pause"
      : (t >= events.length ? "&#9654; Replay" : "&#9654; Play");
  }
  // detection probability: species-dependent below 100%, but exactly 1 at 100%
  // so a perfect detector misses nothing
  function detProb(eff, b) { return Math.min(1, Math.pow(eff, b ? 0.8 : 1.15)); }

  function geom(cv2) {
    const w = cv2.clientWidth || 260, h = 330;
    const sc = (h - 60) / DEPTH;
    return { w, h, sc, X: x => w / 2 + x * sc, Y: z => 44 + z * sc };
  }
  // ground-truth solute regions, shaded behind BOTH panels
  function drawTruth(g, X, Y, sc, isD) {
    g.fillStyle = "rgba(224,168,50,0.13)";
    if (kind === "Multilayer") {
      for (let z0 = 3; z0 < DEPTH; z0 += 9) {
        const r = frontRadius(z0 + 1.1);
        g.fillRect(X(-r), Y(z0), 2 * r * sc, 2.2 * sc);
      }
    } else if (kind === "Clusters") {
      for (const [cx, cz, r] of CLUSTERS) {
        g.beginPath(); g.arc(X(cx), Y(cz), r * sc, 0, 6.3); g.fill();
      }
    } else if (kind === "Interface") {
      // shade tracks the sigmoid solute fraction across the diffuse interface
      for (let z = 12; z < DEPTH; z += 0.5) {
        const p = 1 / (1 + Math.exp(-(z - 18) / 1.5));
        const r = frontRadius(z + 0.5);
        g.fillStyle = `rgba(224,168,50,${(0.14 * p).toFixed(3)})`;
        g.fillRect(X(-r), Y(z), 2 * r * sc, 0.55 * sc);
      }
    }
  }
  function drawTip() {
    const dpr = window.devicePixelRatio || 1;
    const { w, h, sc, X, Y } = geom(cvT);
    cvT.width = w * dpr; cvT.height = h * dpr;
    const g = cvT.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#f4f2ef";
    g.fillRect(0, 0, w, h);
    drawTruth(g, X, Y, sc, isD);
    // detector spans the full panel width
    g.fillStyle = isD ? "#444" : "#999";
    g.fillRect(4, 5, w - 8, 5);
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.fillText("position-sensitive detector", 8, 24);
    for (const a of atoms) {
      if (a.ord < t) continue;
      g.fillStyle = a.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath(); g.arc(X(a.x), Y(a.z), sc * 0.45, 0, 6.3); g.fill();
    }
    // curved evaporation front: one wide arc, drawn only until it meets the
    // tip silhouette so there are no flat shoulders
    if (t < events.length) {
      const zf = t ? events[t - 1].zf : 0;
      const R = frontCurveR(zf);
      let W = 0.25;
      while (W < R - 0.25) {
        const dz = R - Math.sqrt(R * R - W * W);
        if (frontRadius(zf + dz) < W) break;
        W += 0.25;
      }
      g.strokeStyle = isD ? "rgba(255,63,63,0.9)" : "rgba(204,0,0,0.8)";
      g.lineWidth = 1.5; g.setLineDash([4, 3]);
      g.beginPath();
      let started = false;
      for (let x = -W; x <= W; x += 0.25) {
        const dz = R - Math.sqrt(Math.max(0, R * R - x * x));
        const px = X(x), py = Y(zf + dz);
        started ? g.lineTo(px, py) : g.moveTo(px, py);
        started = true;
      }
      g.stroke(); g.setLineDash([]);
    }
    for (const f of flying) {
      g.fillStyle = f.b ? "#e0a832" : (isD ? "#9a90c8" : "#8a80b8");
      g.beginPath(); g.arc(X(f.x), Y(f.z), sc * 0.4, 0, 6.3); g.fill();
    }
    g.fillStyle = isD ? "#bbb" : "#444";
    g.fillText("specimen (+V, pulsed)", 8, h - 8);
  }
  function drawRecon() {
    const dpr = window.devicePixelRatio || 1;
    const { w, h, sc, X, Y } = geom(cvR);
    cvR.width = w * dpr; cvR.height = h * dpr;
    const g = cvR.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#f4f2ef";
    g.fillRect(0, 0, w, h);
    // ground-truth shadow: tip silhouette
    g.fillStyle = isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    g.beginPath();
    let started = false;
    for (let z = 0; z <= DEPTH; z += 0.5) {
      const px = X(-frontRadius(z)), py = Y(z);
      started ? g.lineTo(px, py) : g.moveTo(px, py);
      started = true;
    }
    for (let z = DEPTH; z >= 0; z -= 0.5) g.lineTo(X(frontRadius(z)), Y(z));
    g.closePath(); g.fill();
    drawTruth(g, X, Y, sc, isD);
    const eff = +root.querySelector(".w-eff").value;
    const sx = +root.querySelector(".w-sx").value, sz = +root.querySelector(".w-sz").value;
    let dA = 0, dB = 0, nB = 0;
    for (let i = 0; i < t; i++) {
      const e = events[i];
      if (e.b) nB++;
      if (e.u >= detProb(eff, e.b)) continue;
      if (e.b) dB++; else dA++;
      g.fillStyle = e.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath();
      g.arc(X(e.x + sx * e.gx), Y(e.z + sz * e.gz), sc * 0.4, 0, 6.3);
      g.fill();
    }
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.fillText("reconstruction (ground truth shaded)", 8, 20);
    root.querySelector(".w-ct").textContent = t ? (100 * nB / t).toFixed(1) + "%" : "–";
    root.querySelector(".w-cm").textContent = (dA + dB) ? (100 * dB / (dA + dB)).toFixed(1) + "%" : "–";
  }
  function tick() {
    if (visible && (playing || dirty || flying.length)) {
      if (playing && t < events.length) {
        const n = Math.min(3, events.length - t);
        for (let k = 0; k < n; k++) {
          const e = events[t + k];
          const R = frontRadius(e.zf + 2);
          flying.push({ x: e.x, z: e.z, b: e.b,
            vx: 0.9 * e.x / R + 0.06 * gauss(), vz: -(2.4 + 0.6 * Math.random()) });
        }
        t += n;
        inTime.value = t;
        if (t >= events.length && !flying.length) { playing = false; setBtn(); }
      } else if (playing && !flying.length) {
        playing = false; setBtn();
      }
      for (const f of flying) { f.x += f.vx * 0.6; f.z += f.vz * 0.6; }
      flying = flying.filter(f => f.z > -8);
      drawTip(); drawRecon();
      dirty = false;
    }
    root.querySelector(".w-effv").textContent = (+root.querySelector(".w-eff").value * 100).toFixed(0) + "%";
    root.querySelector(".w-sxv").textContent = (+root.querySelector(".w-sx").value).toFixed(1);
    root.querySelector(".w-szv").textContent = (+root.querySelector(".w-sz").value).toFixed(2);
    raf = requestAnimationFrame(tick);
  }
  btnPlay.addEventListener("click", () => {
    if (!playing && t >= events.length) { t = 0; inTime.value = 0; flying = []; }
    playing = !playing;
    dirty = true;
    setBtn();
  });
  inTime.addEventListener("input", () => {
    t = +inTime.value;
    flying = [];
    dirty = true;
    setBtn();
  });
  for (const c of [".w-eff", ".w-sx", ".w-sz"])
    root.querySelector(c).addEventListener("input", () => { dirty = true; });
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; dirty = true; },
    { rootMargin: "100px" });
  io.observe(root);
  new ResizeObserver(() => { dirty = true; }).observe(cvT);
  reset(); tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, buildTip, simulate };
