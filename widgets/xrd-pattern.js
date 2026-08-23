// xrd-pattern.js
// AnyWidget: symmetric X-ray diffraction pattern calculator (Cu K-alpha).
// Reflections and relative intensities are computed from the crystal
// structure: structure-factor selection rules, multiplicity, Lorentz-
// polarization factor, and a simple falling atomic form factor. Sliders add
// the microstructure: texture (a symmetric scan only sees planes parallel to
// the surface, so a fiber texture kills all but one family), Scherrer grain-
// size broadening, and microstrain broadening. Bottom axis 2-theta, top axis
// the scattering vector q. The schematic shows the geometry and the two film
// microstructures. Static, redraws on input.
//
//   :::{anywidget} ../../widgets/xrd-pattern.js
//   :::

const LAM = 1.5406; // Angstrom
const MATS = {
  Al:  { st: "fcc", a: 4.050, z: [13] },
  Cu:  { st: "fcc", a: 3.615, z: [29] },
  Au:  { st: "fcc", a: 4.078, z: [79] },
  W:   { st: "bcc", a: 3.165, z: [74] },
  Fe:  { st: "bcc", a: 2.866, z: [26] },
  Si:  { st: "diamond", a: 5.431, z: [14] },
  MgO: { st: "rocksalt", a: 4.212, z: [12, 8] },
  TiN: { st: "rocksalt", a: 4.240, z: [22, 7] },
};
const TEXAXIS = { fcc: [1, 1, 1], bcc: [1, 1, 0], diamond: [1, 1, 1], rocksalt: [2, 0, 0] };

function formf(z, s) { return z * Math.exp(-1.5 * s * s); } // crude f(sin(th)/lambda)
function structureAmp(st, h, k, l, z, s) {
  const par = (h % 2 + 2) % 2 === (k % 2 + 2) % 2 && (k % 2 + 2) % 2 === (l % 2 + 2) % 2;
  if (st === "fcc") return par ? 4 * formf(z[0], s) : 0;
  if (st === "bcc") return (h + k + l) % 2 === 0 ? 2 * formf(z[0], s) : 0;
  if (st === "diamond") {
    if (!par) return 0;
    const m = ((h + k + l) % 4 + 4) % 4;
    if (h % 2 !== 0) return 4 * Math.SQRT2 * formf(z[0], s); // all odd
    return m === 0 ? 8 * formf(z[0], s) : 0;                  // 200, 222 forbidden
  }
  if (st === "rocksalt") {
    if (!par) return 0;
    const fA = formf(z[0], s), fB = formf(z[1], s);
    return h % 2 !== 0 ? 4 * Math.abs(fA - fB) : 4 * (fA + fB);
  }
  return 0;
}
function multiplicity(h, k, l) {
  const seen = new Set();
  const vals = [h, k, l];
  const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  for (const p of perms)
    for (let sgn = 0; sgn < 8; sgn++) {
      const v = [vals[p[0]] * (sgn & 1 ? -1 : 1), vals[p[1]] * (sgn & 2 ? -1 : 1),
        vals[p[2]] * (sgn & 4 ? -1 : 1)];
      seen.add(v.join(","));
    }
  return seen.size;
}
function parallelToAxis(h, k, l, ax) {
  // is any symmetry-equivalent of (hkl) parallel to the texture axis family?
  const perms = [[h,k,l],[h,l,k],[k,h,l],[k,l,h],[l,h,k],[l,k,h]];
  for (const p of perms)
    for (let sgn = 0; sgn < 8; sgn++) {
      const v = [p[0]*(sgn&1?-1:1), p[1]*(sgn&2?-1:1), p[2]*(sgn&4?-1:1)];
      const cx = v[1]*ax[2]-v[2]*ax[1], cy = v[2]*ax[0]-v[0]*ax[2], cz = v[0]*ax[1]-v[1]*ax[0];
      if (cx === 0 && cy === 0 && cz === 0) return true;
    }
  return false;
}
function reflections(matName) {
  const m = MATS[matName];
  const out = [];
  const done = new Set();
  for (let h = 0; h <= 6; h++) for (let k = 0; k <= h; k++) for (let l = 0; l <= k; l++) {
    if (!h && !k && !l) continue;
    const s2 = h*h + k*k + l*l;
    const key = s2 + ":" + [h,k,l].sort((x,y)=>y-x).join("");
    if (done.has(key)) continue;
    done.add(key);
    const d = m.a / Math.sqrt(s2);
    const sinth = LAM / (2 * d);
    if (sinth >= Math.sin(60 * Math.PI / 180)) continue;   // 2theta <= 120
    const th = Math.asin(sinth);
    const s = sinth / LAM;
    const F = structureAmp(m.st, h, k, l, m.z, s);
    if (F <= 1e-6) continue;
    const LP = (1 + Math.cos(2*th)**2) / (Math.sin(th)**2 * Math.cos(th));
    out.push({ h, k, l, tth: 2*th*180/Math.PI, d,
      I: F*F * multiplicity(h,k,l) * LP,
      par: parallelToAxis(h,k,l, TEXAXIS[m.st]) });
  }
  // normalize
  let mx = 0; for (const r of out) mx = Math.max(mx, r.I);
  for (const r of out) r.I /= mx;
  return out.sort((a,b) => a.tth - b.tth);
}

function render({ model, el }) {
  const uid = "xp" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-plot { flex:2 1 380px; min-width:320px; }
.${uid} .w-side { flex:1 1 200px; min-width:190px; display:flex; flex-direction:column; gap:6px; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-bar { display:flex; gap:14px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} select { background:var(--w-panel); color:var(--w-fg); border:1px solid var(--w-border);
  border-radius:5px; padding:2px 4px; }
.${uid} input[type=range] { width:100px; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-row">
  <div class="w-plot"><canvas class="w-main" height="340"></canvas></div>
  <div class="w-side"><canvas class="w-schem" height="340"></canvas></div>
</div>
<div class="w-bar">
  <label>material <select class="w-mat">${Object.keys(MATS).map(k => `<option${k === "Cu" ? " selected" : ""}>${k}</option>`).join("")}</select></label>
  <label>texture <input class="w-tex" type="range" min="0" max="1" step="0.01" value="0"><b class="w-texv"></b></label>
  <label>grain size <input class="w-gs" type="range" min="0.5" max="2.30" step="0.02" value="1.7"><b class="w-gsv"></b></label>
  <label>microstrain <input class="w-ms" type="range" min="0" max="1" step="0.02" value="0"><b class="w-msv"></b></label>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Diffraction pattern calculator.</b> Structure factors, texture, and peak broadening in a symmetric scan.";
  root.appendChild(cap);

  const cv = root.querySelector(".w-main"), sc = root.querySelector(".w-schem");
  const selM = root.querySelector(".w-mat");
  const inTex = root.querySelector(".w-tex"), inGs = root.querySelector(".w-gs"), inMs = root.querySelector(".w-ms");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const isD = dark();
    const acc = isD ? "rgb(255,63,63)" : "rgb(204,0,0)";
    const refl = reflections(selM.value);
    const T = +inTex.value;
    const grainNm = Math.pow(10, +inGs.value);          // 3 to 200 nm
    const strain = +inMs.value / 100;                    // up to 1 percent
    // ---------- pattern ----------
    {
      const w = cv.clientWidth || 420, h = 340;
      cv.width = w * dpr; cv.height = h * dpr;
      const g = cv.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const mL = 46, mR = 10, mT = 34, mB = 40;
      const t0 = 20, t1 = 120;
      const X = tt => mL + (tt - t0) / (t1 - t0) * (w - mL - mR);
      const Y = v => h - mB - v * (h - mT - mB - 12);
      g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
      g.font = "12.5px system-ui";
      for (let tt = 20; tt <= 120; tt += 20) {
        g.beginPath(); g.moveTo(X(tt), mT); g.lineTo(X(tt), h - mB); g.stroke();
        g.fillText(tt + "°", X(tt) - 10, h - mB + 16);
      }
      g.fillText("scattering angle 2θ (Cu Kα)", mL + 110, h - 6);
      // top axis: q = 4 pi sin(theta)/lambda
      for (let q = 2; q <= 7; q++) {
        const sth = q * LAM / (4 * Math.PI);
        if (sth >= 1) continue;
        const tt = 2 * Math.asin(sth) * 180 / Math.PI;
        if (tt < t0 || tt > t1) continue;
        g.beginPath(); g.moveTo(X(tt), mT - 4); g.lineTo(X(tt), mT + 2); g.strokeStyle = isD ? "#666" : "#999"; g.stroke();
        g.fillText(q, X(tt) - 3, mT - 8);
      }
      g.fillText("q (Å⁻¹)", w - 60, mT - 8);
      // compute profile
      const pts = new Float64Array(w - mL - mR);
      let norm = 0;
      const rows = refl.map(r => {
        const wtex = (1 - T) + T * (r.par ? 6 : 0.02);
        return { ...r, Ieff: r.I * wtex };
      });
      for (const r of rows) norm = Math.max(norm, r.Ieff);
      for (const r of rows) {
        const th = r.tth / 2 * Math.PI / 180;
        const wSch = 0.9 * LAM / (grainNm * 10 * Math.cos(th)) * 180 / Math.PI;
        const wStr = 4 * strain * Math.tan(th) * 180 / Math.PI;
        const wid = Math.sqrt(0.08 ** 2 + wSch ** 2 + wStr ** 2);
        for (let i = 0; i < pts.length; i++) {
          const tt = t0 + i / pts.length * (t1 - t0);
          pts[i] += (r.Ieff / norm) * Math.exp(-0.5 * ((tt - r.tth) / (wid / 2.355)) ** 2);
        }
      }
      let pmax = 0;
      for (const v of pts) pmax = Math.max(pmax, v);
      g.strokeStyle = acc; g.lineWidth = 1.8;
      g.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const px = mL + i, py = Y(pts[i] / (pmax || 1));
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.stroke();
      // labels on visible peaks: vertical text, pushed up when neighbors collide
      g.fillStyle = isD ? "#ddd" : "#333"; g.font = "12px system-ui";
      const placed = [];
      for (const r of rows) {
        if (r.Ieff / norm < 0.02) continue;
        const txt = `${r.h}${r.k}${r.l}`;
        const len = g.measureText(txt).width;
        const px = X(r.tth);
        let yb = Y(Math.min(1, r.Ieff / norm)) - 5;   // label bottom (text runs upward)
        for (const p of placed)
          if (Math.abs(p.x - px) < 13 && yb > p.yTop - 3) yb = p.yTop - 3;
        yb = Math.max(yb, mT + len + 2);
        placed.push({ x: px, yTop: yb - len });
        g.save();
        g.translate(px + 4, yb);
        g.rotate(-Math.PI / 2);
        g.fillText(txt, 0, 0);
        g.restore();
      }
    }
    // ---------- schematic: geometry + microstructure ----------
    {
      const w = sc.clientWidth || 210, h = 340;
      sc.width = w * dpr; sc.height = h * dpr;
      const g = sc.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = isD ? "#221f1e" : "#ffffff"; g.fillRect(0, 0, w, h);
      // theta-2theta geometry
      const cx = w / 2, cy = 92;
      g.fillStyle = isD ? "#3d3a38" : "#cfcbc5";
      g.fillRect(cx - 44, cy, 88, 9);
      g.strokeStyle = acc; g.lineWidth = 1.8;
      const thg = 0.6;
      g.beginPath(); g.moveTo(cx - Math.cos(thg) * 80, cy - Math.sin(thg) * 80); g.lineTo(cx, cy); g.stroke();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(thg) * 80, cy - Math.sin(thg) * 80); g.stroke();
      g.strokeStyle = isD ? "#777" : "#999"; g.setLineDash([3, 3]);
      g.beginPath(); g.arc(cx, cy, 74, -Math.PI + 0.35, -0.35); g.stroke(); g.setLineDash([]);
      g.fillStyle = isD ? "#ccc" : "#444"; g.font = "12.5px system-ui";
      g.fillText("tube", cx - 92, cy - 52);
      g.fillText("detector", cx + 38, cy - 52);
      g.fillText("θ", cx - 30, cy - 6);
      g.fillText("θ", cx + 24, cy - 6);
      // film cross-section, one column per grain, colored by plane tilt.
      // Each grain has a fixed random tilt; the texture slider pulls every
      // tilt toward zero so the colors converge as the film textures.
      const y2 = 168, filmH = 78, x0 = 10, x1 = w - 10;
      let seed = 5;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const hue = t => 210 + t / 90 * 140;          // tilt -90..90 -> hue 70..350
      const edges = [x0];
      while (edges[edges.length - 1] < x1 - 14)
        edges.push(Math.min(x1, edges[edges.length - 1] + 14 + rnd() * 16));
      edges[edges.length - 1] = x1;
      for (let i = 0; i + 1 < edges.length; i++) {
        const gx0 = edges[i], gx1 = edges[i + 1];
        const tiltFull = (rnd() * 2 - 1) * 88;
        const tilt = tiltFull * (1 - T);
        g.fillStyle = `hsl(${hue(tilt)} 55% ${isD ? 46 : 60}%)`;
        g.fillRect(gx0, y2, gx1 - gx0, filmH);
        // lattice planes inside the grain, tilted by the grain orientation
        g.save();
        g.beginPath(); g.rect(gx0, y2, gx1 - gx0, filmH); g.clip();
        g.strokeStyle = isD ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.75)";
        g.lineWidth = 1;
        const a = tilt * Math.PI / 180, cxg = (gx0 + gx1) / 2, cyg = y2 + filmH / 2;
        for (let p = -9; p <= 9; p++) {
          const ox = -Math.sin(a) * p * 7, oy = Math.cos(a) * p * 7;
          g.beginPath();
          g.moveTo(cxg + ox - Math.cos(a) * 60, cyg + oy - Math.sin(a) * 60);
          g.lineTo(cxg + ox + Math.cos(a) * 60, cyg + oy + Math.sin(a) * 60);
          g.stroke();
        }
        g.restore();
        g.strokeStyle = isD ? "#181616" : "#fff"; g.lineWidth = 1.5;
        g.strokeRect(gx0, y2, gx1 - gx0, filmH);
      }
      // substrate
      g.fillStyle = isD ? "#3d3a38" : "#cfcbc5";
      g.fillRect(x0, y2 + filmH, x1 - x0, 14);
      g.fillStyle = isD ? "#ccc" : "#444";
      g.fillText("film cross-section: color and lines", x0, y2 + filmH + 30);
      g.fillText("show each grain's plane tilt", x0, y2 + filmH + 44);
      // tilt-to-color ramp
      const rampY = y2 - 24;
      for (let px = 0; px <= x1 - x0 - 70; px++) {
        const t = -90 + 180 * px / (x1 - x0 - 70);
        g.fillStyle = `hsl(${hue(t)} 55% ${isD ? 46 : 60}%)`;
        g.fillRect(x0 + px, rampY, 1.5, 9);
      }
      g.fillStyle = isD ? "#ccc" : "#444";
      g.fillText("±90° tilt", x1 - 56, rampY + 8);
      const m = MATS[selM.value];
      g.fillText(selM.value + ": " + m.st + ", a = " + m.a.toFixed(3) + " Å", 10, h - 22);
      g.fillText("texture axis [" + TEXAXIS[m.st].join("") + "]", 10, h - 8);
    }
    root.querySelector(".w-texv").textContent = (T * 100).toFixed(0) + "%";
    root.querySelector(".w-gsv").textContent = grainNm.toFixed(0) + " nm";
    root.querySelector(".w-msv").textContent = (+inMs.value / 1).toFixed(2) + "%";
  }
  for (const i of [selM, inTex, inGs, inMs]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, reflections, multiplicity };
