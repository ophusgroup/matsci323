// apt-evaporate.js
// AnyWidget: atom probe tomography in action. Left: a needle specimen loses
// atoms one by one from its apex by field evaporation; the evaporation front
// recedes into the shank and its radius grows. Right: the reconstruction
// built from the detected atoms: depth (sequence order) is nearly perfect,
// lateral positions are blurred by trajectory aberrations, and detection is
// incomplete, with the lighter matrix atoms lost more often than the heavy
// solute. The multilayer stays razor sharp in depth and fuzzy sideways,
// which is exactly the character of real APT data.
//
//   :::{anywidget} ../../widgets/apt-evaporate.js
//   :::

const A = 1;                       // lattice spacing
const CONE = 0.22;                 // shank half-angle (radians-ish, slope)
const R0 = 7;                      // initial apex radius, lattice units
const DEPTH = 46;                  // tip length simulated
const DET_A = 0.55, DET_B = 0.85;  // detection efficiency: matrix vs heavy solute
const SIG_LAT = 2.2, SIG_Z = 0.25; // reconstruction noise, lattice units

function buildTip() {
  // apex at z=0, z increases into the shank; 2D cross-section, x centered
  const atoms = [];
  for (let j = 0; j < DEPTH / (A * 0.866); j++) {
    const z = j * A * 0.866;
    let r;
    if (z < R0) r = Math.sqrt(Math.max(0, R0 * R0 - (R0 - z) * (R0 - z)));
    else r = R0 + (z - R0) * CONE;
    const nx = Math.floor(r / A);
    for (let i = -nx; i <= nx; i++) {
      const x = (i + 0.5 * (j & 1)) * A;
      if (Math.abs(x) > r) continue;
      // species: heavy solute B in periodic 3-layer bands, plus one cluster
      const band = Math.floor((z - 4) / 11);
      let b = (z > 4) && ((z - 4) % 11 < 2.6) && band >= 0;
      if (Math.hypot(x - 4, z - 30) < 2.2) b = true;
      atoms.push({ x, z, b, alive: true });
    }
  }
  return atoms;
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
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1 1 260px; min-width:240px; }
.${uid} .w-ctl { width:210px; display:flex; flex-direction:column; gap:8px; font-size:13px;
  color:var(--w-muted); }
.${uid} .w-box { background:var(--w-panel); border:1px solid var(--w-border); border-radius:6px;
  padding:6px 8px; display:flex; flex-direction:column; gap:3px; }
.${uid} .w-box b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} button { border:1px solid var(--w-border); border-radius:6px; background:var(--w-panel);
  color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot"><canvas class="w-tip" height="400"></canvas></div>
  <div class="w-plot"><canvas class="w-rec" height="400"></canvas></div>
  <div class="w-ctl">
    <div class="w-box"><span>evaporation rate</span>
      <input class="w-rate" type="range" min="0.5" max="8" step="0.5" value="3"></div>
    <div class="w-box">
      <span>atoms evaporated <b class="w-nev">0</b></span>
      <span>matrix detected <b class="w-da">&ndash;</b></span>
      <span>solute detected <b class="w-db">&ndash;</b></span>
      <span>solute fraction, true <b class="w-ct">&ndash;</b></span>
      <span>solute fraction, measured <b class="w-cm">&ndash;</b></span>
    </div>
    <div class="w-box" style="font-size:12px; line-height:1.5">Depth in the
      reconstruction comes from arrival order, so layers stay sharp in z.
      Lateral positions carry trajectory noise, and undetected atoms
      (more often the light matrix) are simply absent, biasing composition.</div>
    <button class="w-play">&#10074;&#10074; Pause</button>
    <button class="w-reset">Reset</button>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Atom probe, atom by atom.</b> Field evaporation peels the needle from its apex (left); the reconstruction (right) preserves depth almost perfectly, blurs laterally, and misses the atoms that were never detected.";
  root.appendChild(cap);

  const cvT = root.querySelector(".w-tip"), cvR = root.querySelector(".w-rec");
  let atoms = buildTip();
  let flying = [];        // {x, z, vx, vz, b, t}
  let detected = [];      // {xr, zr, b}
  let nEv = 0, nA = 0, nB = 0, dA = 0, dB = 0, zSeq = 0;
  let playing = true, raf = 0, visible = true;

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  function gauss() {
    let u = 0, v = 0;
    while (!u) u = Math.random(); while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function frontZ() {
    let zm = 1e9;
    for (const a of atoms) if (a.alive && a.z < zm) zm = a.z;
    return zm;
  }
  function evaporateOne() {
    // candidates: alive atoms within ~1.2 spacings of the current front;
    // light matrix atoms evaporate a little more readily than heavy solute
    const zf = frontZ();
    if (zf > DEPTH - 6) return false;   // tip consumed
    const cand = [];
    for (const a of atoms)
      if (a.alive && a.z < zf + 1.3) cand.push(a);
    if (!cand.length) return false;
    let pick;
    for (let tries = 0; tries < 10; tries++) {
      pick = cand[Math.floor(Math.random() * cand.length)];
      if (!pick.b || Math.random() < 0.4) break;   // solute held at higher field
    }
    pick.alive = false; nEv++;
    if (pick.b) nB++; else nA++;
    // launch: field lines diverge radially from the apex region
    const r = Math.max(2, R0 + Math.max(0, pick.z - R0) * CONE);
    flying.push({ x: pick.x, z: pick.z, vx: 1.4 * pick.x / r + 0.15 * gauss(),
                  vz: -(2.2 + Math.random()), b: pick.b, x0: pick.x });
    return true;
  }
  function detect(f) {
    const eff = f.b ? DET_B : DET_A;
    if (Math.random() < eff) {
      zSeq += 1;                          // depth from arrival order
      detected.push({ xr: f.x0 + SIG_LAT * gauss(), zr: zSeq + SIG_Z * gauss() * 10, b: f.b });
      if (f.b) dB++; else dA++;
    } else {
      zSeq += 1;                          // volume still gone, atom just missing
    }
  }
  function reset() {
    atoms = buildTip(); flying = []; detected = [];
    nEv = 0; nA = 0; nB = 0; dA = 0; dB = 0; zSeq = 0;
    const g = cvR.getContext("2d");
    g.clearRect(0, 0, cvR.width, cvR.height);
  }
  function drawTip() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvT.clientWidth || 280, h = 400;
    cvT.width = w * dpr; cvT.height = h * dpr;
    const g = cvT.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#f4f2ef";
    g.fillRect(0, 0, w, h);
    // detector bar at top
    g.fillStyle = isD ? "#444" : "#999";
    g.fillRect(w * 0.15, 6, w * 0.7, 5);
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.fillText("position-sensitive detector", w * 0.17, 24);
    const sc = h * 0.75 / DEPTH;
    const X = x => w / 2 + x * sc, Y = z => h * 0.2 + z * sc;
    // remaining atoms
    for (const a of atoms) {
      if (!a.alive) continue;
      g.fillStyle = a.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath(); g.arc(X(a.x), Y(a.z), sc * 0.44, 0, 6.3); g.fill();
    }
    // evaporation front arc
    const zf = frontZ();
    if (zf < DEPTH) {
      const rf = zf < R0 ? R0 : R0 + (zf - R0) * CONE;
      g.strokeStyle = isD ? "rgba(240,122,158,0.9)" : "rgba(204,0,0,0.8)";
      g.lineWidth = 1.5; g.setLineDash([4, 3]);
      g.beginPath(); g.moveTo(X(-rf - 2), Y(zf)); g.lineTo(X(rf + 2), Y(zf)); g.stroke();
      g.setLineDash([]);
      g.fillStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
      g.fillText("front", X(rf + 2) - 34, Y(zf) - 5);
    }
    // flying ions
    for (const f of flying) {
      g.fillStyle = f.b ? "#e0a832" : (isD ? "#9a90c8" : "#8a80b8");
      g.beginPath(); g.arc(X(f.x), Y(f.z), sc * 0.4, 0, 6.3); g.fill();
      g.strokeStyle = f.b ? "rgba(224,168,50,0.35)" : "rgba(140,130,190,0.35)";
      g.beginPath(); g.moveTo(X(f.x), Y(f.z)); g.lineTo(X(f.x - f.vx * 2), Y(f.z - f.vz * 2)); g.stroke();
    }
    g.fillStyle = isD ? "#bbb" : "#444";
    g.fillText("specimen (+V, pulsed)", 10, h - 10);
  }
  function drawRecon() {
    // persistent canvas: only new points are drawn each frame
    const dpr = window.devicePixelRatio || 1;
    const w = cvR.clientWidth || 280, h = 400;
    if (cvR.width !== w * dpr) {
      cvR.width = w * dpr; cvR.height = h * dpr;
      redrawRecon();
      return;
    }
    const g = cvR.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawReconChrome(g, w, h);
    // draw the most recent points
    const sc = h * 0.75 / DEPTH;
    const total = atoms.length;
    for (let i = Math.max(0, detected.length - 12); i < detected.length; i++) {
      const d = detected[i];
      const zr = d.zr / total * DEPTH * 1.15;
      const isD = dark();
      g.fillStyle = d.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath();
      g.arc(w / 2 + d.xr * sc, h * 0.2 + zr * sc, sc * 0.4, 0, 6.3);
      g.fill();
    }
  }
  function drawReconChrome(g, w, h) {
    const isD = dark();
    g.fillStyle = isD ? "#bbb" : "#444"; g.font = "12px system-ui";
    g.clearRect(0, 0, w, 28);
    g.fillStyle = isD ? "#0b0a0a" : "#f4f2ef";
    g.fillRect(0, 0, w, 28);
    g.fillStyle = isD ? "#bbb" : "#444";
    g.fillText("reconstruction: z from order, x noisy, atoms missing", 10, 18);
  }
  function redrawRecon() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvR.clientWidth || 280, h = 400;
    const g = cvR.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#f4f2ef";
    g.fillRect(0, 0, w, h);
    const sc = h * 0.75 / DEPTH, total = atoms.length;
    for (const d of detected) {
      const zr = d.zr / total * DEPTH * 1.15;
      g.fillStyle = d.b ? "#e0a832" : (isD ? "#7a6ea8" : "#8a80b8");
      g.beginPath();
      g.arc(w / 2 + d.xr * sc, h * 0.2 + zr * sc, sc * 0.4, 0, 6.3);
      g.fill();
    }
    drawReconChrome(g, w, h);
  }
  function tick() {
    if (visible && playing) {
      const rate = +root.querySelector(".w-rate").value;
      for (let k = 0; k < rate; k++) {
        if (!evaporateOne()) {              // tip consumed: restart
          if (flying.length === 0) reset();
          break;
        }
      }
      // advance flights
      for (const f of flying) { f.x += f.vx * 0.5; f.z += f.vz * 0.5; }
      const still = [];
      for (const f of flying) (f.z < -10 ? detect(f) : still.push(f));
      flying = still;
      drawTip(); drawRecon();
      root.querySelector(".w-nev").textContent = nEv;
      root.querySelector(".w-da").textContent = nA ? (100 * dA / Math.max(1, nA)).toFixed(0) + "%" : "–";
      root.querySelector(".w-db").textContent = nB ? (100 * dB / Math.max(1, nB)).toFixed(0) + "%" : "–";
      root.querySelector(".w-ct").textContent = nEv ? (100 * nB / nEv).toFixed(1) + "%" : "–";
      root.querySelector(".w-cm").textContent = (dA + dB) ? (100 * dB / (dA + dB)).toFixed(1) + "%" : "–";
    }
    raf = requestAnimationFrame(tick);
  }
  root.querySelector(".w-play").addEventListener("click", function () {
    playing = !playing;
    this.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Play";
  });
  root.querySelector(".w-reset").addEventListener("click", reset);
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  new ResizeObserver(redrawRecon).observe(cvR);
  tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, buildTip };
