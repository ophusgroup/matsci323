// apt-evaporate.js
// AnyWidget: atom probe tomography. Left: field evaporation of a needle
// specimen; atoms leave from the curved evaporation front where the field is
// highest, and the front recedes into the widening shank. Right: the
// reconstruction assembled from the detected atoms, with adjustable detection
// efficiency and lateral/depth position errors, drawn over a faint ground
// truth for comparison. The run completes once, then can be replayed.
//
//   :::{anywidget} ../../widgets/apt-evaporate.js
//   :::

const A = 1;
const CONE = 0.24;                 // shank slope
const R0 = 5.5;                    // initial apex radius
const DEPTH = 40;                  // tip length simulated

const SAMPLES = {
  Multilayer: (x, z) => (z > 3) && ((z - 3) % 9 < 2.2),
  Clusters: (x, z) => {
    for (const [cx, cz, r] of [[-3, 9, 1.8], [2.5, 15, 2.2], [-1, 23, 1.9],
      [4, 29, 1.7], [-4.5, 33, 2.0], [0.5, 36, 1.6]])
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
      atoms.push({ x, z, b: !!f(x, z), alive: true });
    }
  }
  return atoms;
}
function frontRadius(zf) {
  return zf < R0 ? R0 : R0 + (zf - R0) * CONE;
}
// evaporation coordinate: distance along the tip axis of the curved front
// passing through this atom; atoms with the smallest u are most exposed
function evapU(a, zf) {
  const R = frontRadius(Math.max(zf, 2));
  return a.z - Math.max(0, R - Math.sqrt(Math.max(0, R * R - a.x * a.x)));
}

function render({ model, el }) {
  const uid = "ap" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
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
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-row">
  <div class="w-plot"><canvas class="w-tip" height="330"></canvas></div>
  <div class="w-plot"><canvas class="w-rec" height="330"></canvas></div>
</div>
<div class="w-controls w-samples"></div>
<div class="w-controls">
  <button class="w-play">&#9654; Replay</button>
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
  let kind = "Multilayer";
  let atoms, flying, detected, nEv, nB, dA, dB;
  let playing = true, raf = 0, visible = true, finished = false;

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
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
      reset();
    });
    sampleBox.appendChild(b);
  }
  function gauss() {
    let u = 0, v = 0;
    while (!u) u = Math.random(); while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function reset() {
    atoms = buildTip(kind); flying = []; detected = [];
    nEv = 0; nB = 0; dA = 0; dB = 0; finished = false; playing = true;
    root.querySelector(".w-play").innerHTML = "&#10074;&#10074; Pause";
  }
  function frontZ() {
    let zm = 1e9;
    for (const a of atoms) if (a.alive) { const u = a.z; if (u < zm) zm = u; }
    return zm;
  }
  function evaporateOne() {
    const zf = frontZ();
    if (zf > DEPTH - 8) return false;
    // candidates: alive atoms whose evaporation coordinate is near the front
    let uMin = 1e9;
    for (const a of atoms) if (a.alive) { const u = evapU(a, zf); if (u < uMin) uMin = u; }
    const cand = [];
    for (const a of atoms) if (a.alive && evapU(a, zf) < uMin + 1.2) cand.push(a);
    if (!cand.length) return false;
    let pick = cand[Math.floor(Math.random() * cand.length)];
    pick.alive = false; nEv++;
    if (pick.b) nB++;
    const R = frontRadius(zf + 2);
    flying.push({ x: pick.x, z: pick.z, vx: 0.9 * pick.x / R + 0.06 * gauss(),
                  vz: -(2.4 + 0.6 * Math.random()), b: pick.b, x0: pick.x, z0: pick.z });
    return true;
  }
  function detect(f) {
    const eff = +root.querySelector(".w-eff").value * (f.b ? 1.1 : 0.92);
    if (Math.random() < Math.min(1, eff)) {
      const sx = +root.querySelector(".w-sx").value, sz = +root.querySelector(".w-sz").value;
      detected.push({ xr: f.x0 + sx * gauss(), zr: f.z0 + sz * gauss(), b: f.b });
      if (f.b) dB++; else dA++;
    }
  }
  function geom(cv2) {
    const w = cv2.clientWidth || 260, h = 330;
    const sc = (h - 60) / DEPTH;
    return { w, h, sc, X: x => w / 2 + x * sc, Y: z => 44 + z * sc };
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
    // detector spans the full panel width
    g.fillStyle = isD ? "#444" : "#999";
    g.fillRect(4, 5, w - 8, 5);
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.fillText("position-sensitive detector", 8, 24);
    for (const a of atoms) {
      if (!a.alive) continue;
      g.fillStyle = a.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath(); g.arc(X(a.x), Y(a.z), sc * 0.45, 0, 6.3); g.fill();
    }
    // curved evaporation front: the surface of constant field
    const zf = frontZ();
    if (zf < DEPTH - 8) {
      const R = frontRadius(Math.max(zf, 2));
      g.strokeStyle = isD ? "rgba(240,122,158,0.9)" : "rgba(204,0,0,0.8)";
      g.lineWidth = 1.5; g.setLineDash([4, 3]);
      g.beginPath();
      let started = false;
      for (let x = -R - 1; x <= R + 1; x += 0.25) {
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
      const r = frontRadius(z);
      const px = X(-r), py = Y(z);
      started ? g.lineTo(px, py) : g.moveTo(px, py);
      started = true;
    }
    for (let z = DEPTH; z >= 0; z -= 0.5) g.lineTo(X(frontRadius(z)), Y(z));
    g.closePath(); g.fill();
    // ground-truth solute regions, faint
    g.fillStyle = "rgba(224,168,50,0.13)";
    if (kind === "Multilayer") {
      for (let z0 = 3; z0 < DEPTH; z0 += 9) {
        const r = frontRadius(z0 + 1.1);
        g.fillRect(X(-r), Y(z0), 2 * r * sc, 2.2 * sc);
      }
    } else if (kind === "Clusters") {
      for (const [cx, cz, r] of [[-3, 9, 1.8], [2.5, 15, 2.2], [-1, 23, 1.9],
        [4, 29, 1.7], [-4.5, 33, 2.0], [0.5, 36, 1.6]]) {
        g.beginPath(); g.arc(X(cx), Y(cz), r * sc, 0, 6.3); g.fill();
      }
    } else if (kind === "Interface") {
      const r = frontRadius(19);
      g.fillRect(X(-r), Y(16.5), 2 * r * sc, 6 * sc);
    }
    for (const d of detected) {
      g.fillStyle = d.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath(); g.arc(X(d.xr), Y(d.zr), sc * 0.4, 0, 6.3); g.fill();
    }
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.fillText("reconstruction (ground truth shaded)", 8, 20);
  }
  function tick() {
    if (visible && playing && !finished) {
      for (let k = 0; k < 3; k++) {
        if (!evaporateOne()) {
          if (flying.length === 0) {
            finished = true; playing = false;
            root.querySelector(".w-play").innerHTML = "&#9654; Replay";
          }
          break;
        }
      }
      for (const f of flying) { f.x += f.vx * 0.6; f.z += f.vz * 0.6; }
      const still = [];
      for (const f of flying) (f.z < -8 ? detect(f) : still.push(f));
      flying = still;
      drawTip(); drawRecon();
      root.querySelector(".w-ct").textContent = nEv ? (100 * nB / nEv).toFixed(1) + "%" : "–";
      root.querySelector(".w-cm").textContent = (dA + dB) ? (100 * dB / (dA + dB)).toFixed(1) + "%" : "–";
    }
    root.querySelector(".w-effv").textContent = (+root.querySelector(".w-eff").value * 100).toFixed(0) + "%";
    root.querySelector(".w-sxv").textContent = (+root.querySelector(".w-sx").value).toFixed(1);
    root.querySelector(".w-szv").textContent = (+root.querySelector(".w-sz").value).toFixed(2);
    raf = requestAnimationFrame(tick);
  }
  root.querySelector(".w-play").addEventListener("click", function () {
    if (finished) { reset(); return; }
    playing = !playing;
    this.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Play";
  });
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  reset(); tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, buildTip };
