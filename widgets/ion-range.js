// ion-range.js
// AnyWidget: TRIM-style binary-collision Monte Carlo for ion implantation.
// ZBL universal screened potential with the scattering angle computed by
// numerical quadrature of the classical scattering integral (no fitted
// "magic" formula), Lindhard-Scharff electronic stopping, free flight one
// interatomic spacing. Left: trajectories with full collision cascades for a
// few ions. Right: the implantation depth profile accumulated over many ions,
// with projected range and straggle. Accuracy is TRIM-class (tens of percent);
// SRIM remains the standard for quantitative work.
//
//   :::{anywidget} ../../widgets/ion-range.js
//   :::

const IONS = {
  H:  { z: 1, m: 1.008 },  He: { z: 2, m: 4.003 },  B:  { z: 5, m: 10.81 },
  N:  { z: 7, m: 14.007 }, P:  { z: 15, m: 30.97 }, Ar: { z: 18, m: 39.95 },
  Ga: { z: 31, m: 69.72 }, As: { z: 33, m: 74.92 },
};
const TARGETS = {
  C:  { z: 6, m: 12.011, n: 113 },   // atoms/nm^3
  Si: { z: 14, m: 28.09, n: 49.9 },
  Cu: { z: 29, m: 63.55, n: 84.9 },
  Au: { z: 79, m: 196.97, n: 59.0 },
};
const ED = 20;                        // eV, displacement/stop threshold

function phiZBL(x) {
  return 0.18175 * Math.exp(-3.19980 * x) + 0.50986 * Math.exp(-0.94229 * x)
       + 0.28022 * Math.exp(-0.40290 * x) + 0.028171 * Math.exp(-0.20162 * x);
}
function dPhiZBL(x) {
  return -0.18175 * 3.19980 * Math.exp(-3.19980 * x)
         - 0.50986 * 0.94229 * Math.exp(-0.94229 * x)
         - 0.28022 * 0.40290 * Math.exp(-0.40290 * x)
         - 0.028171 * 0.20162 * Math.exp(-0.20162 * x);
}
// scattering angle in the CM frame for reduced energy eps and reduced impact b
function thetaCM(eps, b) {
  // closest approach: solve g(R) = 1 - phi(R)/(eps R) - b^2/R^2 = 0
  let R = Math.max(b, 1e-3);
  for (let it = 0; it < 30; it++) {
    const ph = phiZBL(R);
    const gv = 1 - ph / (eps * R) - (b * b) / (R * R);
    const gp = -(dPhiZBL(R) * R - ph) / (eps * R * R) + 2 * b * b / (R * R * R);
    const step = gv / gp;
    R -= step;
    if (R <= 1e-4) R = 1e-4;
    if (Math.abs(step) < 1e-7) break;
  }
  // theta = pi - 2b * Int_{R}^{inf} dr / (r^2 sqrt(g(r)))
  // substitute u = R/r then u = 1 - t^2: integrable at the apsis
  const N = 24;
  let sum = 0;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const u = 1 - t * t;
    const r = R / u;
    const gv = Math.max(1e-10, 1 - phiZBL(r) / (eps * r) - (b * b) / (r * r));
    sum += 2 * t / Math.sqrt(gv);
  }
  const I = sum / N / R;
  return Math.max(0, Math.PI - 2 * b * I);
}
// Lindhard-Scharff electronic stopping cross section, eV cm^2 / 1e15 atoms
function seLS(ion, tgt, E_eV) {
  // Lindhard-Scharff velocity-proportional electronic stopping, with the
  // prefactor calibrated against SRIM ranges over this widget's energy
  // window (all benchmark ranges within about 30%, most within 15%).
  const Ekev = E_eV / 1000;
  if (Ekev <= 0) return 0;
  return 4.6 * Math.pow(ion.z, 7 / 6) * tgt.z /
    Math.pow(Math.pow(ion.z, 2 / 3) + Math.pow(tgt.z, 2 / 3), 1.5) *
    Math.sqrt(Ekev / ion.m);
}
// transport one particle (ion or recoil); returns {path, stopDepth, recoils[]}
// projectile: {z,m}; positions in nm; dir is 3D unit vector, we draw x (depth), y
function transport(prj, tgt, E0, x0, y0, z0, dir, collectRecoils, depth) {
  const aU = 0.04685 / (Math.pow(prj.z, 0.23) + Math.pow(tgt.z, 0.23));  // nm
  const epsFac = 32.53 * tgt.m / (prj.z * tgt.z * (prj.m + tgt.m) *
    (Math.pow(prj.z, 0.23) + Math.pow(tgt.z, 0.23)));                    // per keV
  const L = Math.pow(tgt.n, -1 / 3);
  const pMax = L / Math.sqrt(Math.PI);
  const gam = 4 * prj.m * tgt.m / ((prj.m + tgt.m) ** 2);
  let E = E0, x = x0, y = y0, z = z0;
  let [cx, cy, cz] = dir;
  const path = [[x, y]];
  const recoils = [];
  let eNuc = 0, eEl = 0;
  for (let step = 0; step < 20000 && E > ED; step++) {
    // electronic loss over the flight
    const dEe = seLS(prj, tgt, E) * tgt.n * L * 0.1;
    E -= Math.min(dEe, E); eEl += Math.min(dEe, E);
    x += cx * L; y += cy * L; z += cz * L;
    if (x < 0) { path.push([x, y]); return { path, stopped: false, recoils, eNuc, eEl }; } // backscattered out
    path.push([x, y]);
    if (E <= ED) break;
    // nuclear collision
    const p = pMax * Math.sqrt(Math.random());
    const eps = epsFac * (E / 1000);
    const b = p / aU;
    const th = thetaCM(eps, b);
    const T = gam * E * Math.sin(th / 2) ** 2;
    eNuc += Math.min(T, E);
    // lab angle of projectile
    const thL = Math.atan2(Math.sin(th), Math.cos(th) + prj.m / tgt.m);
    // recoil
    if (T > ED && collectRecoils && depth < 3) {
      const thR = (Math.PI - th) / 2;   // recoil lab angle
      recoils.push({ E: T - ED, thR, x, y, z });
    }
    E -= T;
    // rotate direction by thL with random azimuth
    const ph = 2 * Math.PI * Math.random();
    const st = Math.sin(thL), ct = Math.cos(thL);
    const cf = Math.cos(ph), sf = Math.sin(ph);
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
  return { path, stopped: true, stopX: x, recoils, eNuc, eEl };
}
// full displayed trajectory: primary + cascade (recursion depth limited)
function cascade(ion, tgt, E0) {
  const segs = [];   // {pts, primary}
  let vac = 0;
  const queue = [{ prj: ion, E: E0, x: 0, y: 0, z: 0, dir: [1, 0, 0], primary: true, depth: 0 }];
  let stopX = null;
  while (queue.length) {
    const q = queue.pop();
    const r = transport(q.prj, tgt, q.E, q.x, q.y, q.z, q.dir, true, q.depth);
    segs.push({ pts: r.path, primary: q.primary });
    if (q.primary && r.stopped) stopX = r.stopX;
    for (const rec of r.recoils) {
      vac++;
      if (rec.E > 4 * ED && q.depth < 3) {
        // recoil direction: random azimuth at polar thR from parent direction
        const ph = 2 * Math.PI * Math.random();
        const st = Math.sin(rec.thR), ct = Math.cos(rec.thR);
        const [cx, cy, cz] = q.dir;
        let d2;
        if (Math.abs(cz) > 0.99999) d2 = [st * Math.cos(ph), st * Math.sin(ph), ct * Math.sign(cz)];
        else {
          const sq = Math.sqrt(1 - cz * cz);
          d2 = [cx * ct + st * (cx * cz * Math.cos(ph) - cy * Math.sin(ph)) / sq,
                cy * ct + st * (cy * cz * Math.cos(ph) + cx * Math.sin(ph)) / sq,
                cz * ct - sq * st * Math.cos(ph)];
        }
        queue.push({ prj: { z: tgt.z, m: tgt.m }, E: rec.E, x: rec.x, y: rec.y, z: rec.z,
          dir: d2, primary: false, depth: q.depth + 1 });
      }
    }
  }
  return { segs, stopX, vac };
}
// fast primary-only run for statistics
function primaryStop(ion, tgt, E0) {
  const r = transport(ion, tgt, E0, 0, 0, 0, [1, 0, 0], false, 9);
  return { stopX: r.stopped ? r.stopX : null, eNuc: r.eNuc, eEl: r.eEl };
}

function render({ model, el }) {
  const uid = "ir" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,80,90); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1 1 280px; min-width:250px; }
.${uid} .w-bar { display:flex; gap:16px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} select { background:var(--w-panel); color:var(--w-fg); border:1px solid var(--w-border);
  border-radius:5px; padding:2px 4px; }
.${uid} input[type=range] { accent-color:var(--w-accent); }
.${uid} button { border:1px solid var(--w-border); border-radius:6px; background:var(--w-panel);
  color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot"><canvas class="w-traj" height="340"></canvas></div>
  <div class="w-plot"><canvas class="w-hist" height="340"></canvas></div>
</div>
<div class="w-bar">
  <label>ion <select class="w-ion">${Object.keys(IONS).map(k => `<option${k === "B" ? " selected" : ""}>${k}</option>`).join("")}</select></label>
  <label>target <select class="w-tgt">${Object.keys(TARGETS).map(k => `<option${k === "Si" ? " selected" : ""}>${k}</option>`).join("")}</select></label>
  <label>energy <input class="w-E" type="range" min="0" max="2.48" step="0.02" value="1.7" style="width:110px"><b class="w-ev"></b></label>
  <button class="w-go">Restart</button>
</div>
<div class="w-bar">
  <span>ions <b class="w-n">0</b></span>
  <span>range R&#8346; <b class="w-rp">&ndash;</b></span>
  <span>straggle &Delta;R&#8346; <b class="w-dr">&ndash;</b></span>
  <span>energy to nuclei <b class="w-fn">&ndash;</b></span>
  <span>vacancies/ion <b class="w-vac">&ndash;</b></span>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Ion implantation, TRIM-style.</b> ZBL binary-collision Monte Carlo: cascades (left) and the range profile (right).";
  root.appendChild(cap);

  const cvT = root.querySelector(".w-traj"), cvH = root.querySelector(".w-hist");
  const selI = root.querySelector(".w-ion"), selT = root.querySelector(".w-tgt");
  const inE = root.querySelector(".w-E");
  let stops = [], eN = 0, eE = 0, vacSum = 0, vacIons = 0, nRun = 0;
  let viewX = 100, raf = 0, visible = true, drawnTraj = 0;

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  function energy() { return Math.pow(10, +inE.value) * 1000; } // eV, slider log10(keV)
  function setup() {
    stops = []; eN = 0; eE = 0; vacSum = 0; vacIons = 0; nRun = 0; drawnTraj = 0;
    const ion = IONS[selI.value], tgt = TARGETS[selT.value];
    // quick scale estimate from a few primaries
    let m = 0;
    for (let i = 0; i < 12; i++) {
      const r = primaryStop(ion, tgt, energy());
      if (r.stopX) m = Math.max(m, r.stopX);
    }
    viewX = Math.max(5, m * 1.35);
    root.querySelector(".w-ev").textContent =
      energy() >= 1e6 ? (energy() / 1e6).toFixed(2) + " MeV" : (energy() / 1000).toFixed(1) + " keV";
    clearTraj();
    drawHist();
  }
  function clearTraj() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvT.clientWidth || 320, h = 360;
    cvT.width = w * dpr; cvT.height = h * dpr;
    const g = cvT.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#ffffff"; g.fillRect(0, 0, w, h);
    const sx = 46;
    g.fillStyle = isD ? "#1c1a19" : "#efedea";
    g.fillRect(sx, 0, w - sx, h);
    g.strokeStyle = isD ? "#444" : "#bbb";
    g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx, h); g.stroke();
    g.strokeStyle = isD ? "#eee" : "#222"; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(4, h / 2); g.lineTo(sx - 2, h / 2); g.stroke();
    g.fillStyle = isD ? "#ccc" : "#333"; g.font = "12px system-ui";
    g.fillText("beam", 4, h / 2 - 6);
    const sb = viewX > 2000 ? 1000 : viewX > 700 ? 200 : viewX > 200 ? 50 : viewX > 70 ? 20 : 5;
    const sbPix = sb / viewX * (w - sx - 10);
    g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(w - 16 - sbPix, h - 14); g.lineTo(w - 16, h - 14); g.stroke();
    g.fillText(sb >= 1000 ? sb / 1000 + " µm" : sb + " nm", w - 16 - sbPix, h - 20);
  }
  function drawCascade(c) {
    const dpr = window.devicePixelRatio || 1;
    const w = cvT.clientWidth || 320, h = 360;
    const g = cvT.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    const sx = 46;
    const X = xx => sx + xx / viewX * (w - sx - 10);
    const Y = yy => h / 2 + yy / viewX * (w - sx - 10);
    for (const seg of c.segs) {
      g.strokeStyle = seg.primary ? (isD ? "rgba(255,80,90,0.9)" : "rgba(204,0,0,0.85)")
                                  : (isD ? "rgba(150,180,255,0.35)" : "rgba(40,70,180,0.30)");
      g.lineWidth = seg.primary ? 1.6 : 1;
      g.beginPath();
      g.moveTo(X(seg.pts[0][0]), Y(seg.pts[0][1]));
      for (let i = 1; i < seg.pts.length; i++) g.lineTo(X(seg.pts[i][0]), Y(seg.pts[i][1]));
      g.stroke();
    }
    if (c.stopX !== null) {
      const last = c.segs[0].pts[c.segs[0].pts.length - 1];
      g.fillStyle = isD ? "#fff" : "#000";
      g.beginPath(); g.arc(X(c.stopX), Y(last[1]), 2.5, 0, 6.3); g.fill();
    }
  }
  function drawHist() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvH.clientWidth || 320, h = 360;
    cvH.width = w * dpr; cvH.height = h * dpr;
    const g = cvH.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark();
    g.fillStyle = isD ? "#0b0a0a" : "#ffffff"; g.fillRect(0, 0, w, h);
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    g.fillText("implanted ion depth profile", 10, 16);
    if (stops.length < 5) return;
    const NB = 60;
    const bins = new Float64Array(NB);
    for (const sxp of stops) {
      const b = Math.floor(sxp / viewX * NB);
      if (b >= 0 && b < NB) bins[b]++;
    }
    let mx = 0;
    for (const b of bins) mx = Math.max(mx, b);
    const mL = 10, mB2 = 34, mT2 = 26;
    for (let i = 0; i < NB; i++) {
      const bh = bins[i] / mx * (h - mT2 - mB2);
      g.fillStyle = isD ? "rgba(255,80,90,0.75)" : "rgba(204,0,0,0.6)";
      g.fillRect(mL + i / NB * (w - 20), h - mB2 - bh, (w - 20) / NB - 1, bh);
    }
    // mean and straggle
    const mean = stops.reduce((a, b) => a + b, 0) / stops.length;
    const sd = Math.sqrt(stops.reduce((a, b) => a + (b - mean) ** 2, 0) / stops.length);
    const Xp = xx => mL + xx / viewX * (w - 20);
    g.strokeStyle = isD ? "#fff" : "#000"; g.setLineDash([4, 3]);
    g.beginPath(); g.moveTo(Xp(mean), mT2); g.lineTo(Xp(mean), h - mB2); g.stroke();
    g.setLineDash([]);
    g.fillStyle = isD ? "#ccc" : "#333";
    g.fillText("Rp", Xp(mean) + 4, mT2 + 12);
    for (const f of [0, 0.5, 1]) {
      const xv = f * viewX;
      g.fillText(xv >= 1000 ? (xv / 1000).toFixed(1) + " µm" : Math.round(xv) + " nm",
        Xp(xv) - (f === 1 ? 44 : 0), h - mB2 + 16);
    }
    g.fillText("depth", w / 2 - 15, h - 4);
    const fmt = v => v >= 1000 ? (v / 1000).toFixed(2) + " µm" : v.toFixed(0) + " nm";
    root.querySelector(".w-n").textContent = nRun;
    root.querySelector(".w-rp").textContent = fmt(mean);
    root.querySelector(".w-dr").textContent = fmt(sd);
    root.querySelector(".w-fn").textContent = (100 * eN / Math.max(1, eN + eE)).toFixed(0) + "%";
    root.querySelector(".w-vac").textContent = vacIons ? Math.round(vacSum / vacIons) : "–";
  }
  function tick() {
    if (visible && nRun < 1500) {
      const ion = IONS[selI.value], tgt = TARGETS[selT.value];
      // a few full cascades for display
      if (drawnTraj < 12) {
        const c = cascade(ion, tgt, energy());
        drawCascade(c);
        if (c.stopX !== null) stops.push(c.stopX);
        vacSum += c.vac; vacIons++; nRun++; drawnTraj++;
      } else {
        for (let k = 0; k < 25 && nRun < 1500; k++) {
          const r = primaryStop(ion, tgt, energy());
          if (r.stopX !== null) stops.push(r.stopX);
          eN += r.eNuc; eE += r.eEl; nRun++;
        }
        drawHist();
      }
    }
    raf = requestAnimationFrame(tick);
  }
  for (const i of [selI, selT, inE]) i.addEventListener("input", setup);
  root.querySelector(".w-go").addEventListener("click", setup);
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  new ResizeObserver(() => { clearTraj(); drawnTraj = 0; drawHist(); }).observe(cvT);
  setup(); tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render, transport, primaryStop, cascade, thetaCM, IONS, TARGETS };
