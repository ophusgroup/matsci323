// xrr-explorer.js
// AnyWidget: interactive X-ray reflectivity of a single film on a silicon
// substrate, computed with the exact Parratt recursion (Cu K-alpha) and
// Nevot-Croce roughness factors. Sliders: film material, thickness, density,
// and the two interface roughnesses. Static (redraws on input, no animation).
// delta is computed from density and Z/A; absorption (beta) is approximate.
//
//   :::{anywidget} ../../widgets/xrr-explorer.js
//   :::

const LAM = 0.15406;                 // Cu K-alpha wavelength, nm
const K = 2 * Math.PI / LAM;
const CDELTA = 1.0645e-35 * 6.022e29; // delta = CDELTA * rho[g/cc] * (Z/A)
// name, nominal density g/cc, Z/A, beta = delta/betaRatio (approximate)
const MATS = {
  "SiO2":  { rho: 2.20, za: 0.499, br: 80 },
  "Si3N4": { rho: 3.17, za: 0.499, br: 60 },
  "Al2O3": { rho: 3.95, za: 0.490, br: 70 },
  "a-C":   { rho: 2.00, za: 0.500, br: 150 },
  "TiN":   { rho: 5.40, za: 0.469, br: 30 },
  "Cu":    { rho: 8.96, za: 0.456, br: 45 },
  "HfO2":  { rho: 9.68, za: 0.418, br: 15 },
  "W":     { rho: 19.3, za: 0.403, br: 12 },
  "Au":    { rho: 19.3, za: 0.401, br: 10 },
};
const SI = { rho: 2.33, za: 0.4985, br: 45 };

// minimal complex helpers on [re, im]
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csqrt = (c) => {
  const r = Math.hypot(c[0], c[1]);
  return [Math.sqrt((r + c[0]) / 2), (c[1] >= 0 ? 1 : -1) * Math.sqrt(Math.max(0, (r - c[0]) / 2))];
};
const cexp = (c) => {  // exp(re + i im)
  const e = Math.exp(c[0]);
  return [e * Math.cos(c[1]), e * Math.sin(c[1])];
};

// Parratt reflectivity for layers[{delta,beta,d,sigmaTop}] top to bottom;
// layer 0 is vacuum (delta=beta=0), last layer semi-infinite
function reflectivity(theta, layers) {
  const s2 = Math.sin(theta) ** 2;
  const kz = layers.map(l => {
    const c = csqrt([s2 - 2 * l.delta, -2 * l.beta]);
    return [K * c[0], K * c[1]];
  });
  let X = [0, 0];
  for (let j = layers.length - 2; j >= 0; j--) {
    // Fresnel coefficient with Nevot-Croce roughness of interface j/j+1
    let r = cdiv([kz[j][0] - kz[j + 1][0], kz[j][1] - kz[j + 1][1]],
                 [kz[j][0] + kz[j + 1][0], kz[j][1] + kz[j + 1][1]]);
    const sg = layers[j + 1].sigmaTop || 0;
    const nc = cexp([-2 * (kz[j][0] * kz[j + 1][0] - kz[j][1] * kz[j + 1][1]) * sg * sg,
                     -2 * (kz[j][0] * kz[j + 1][1] + kz[j][1] * kz[j + 1][0]) * sg * sg]);
    r = cmul(r, nc);
    if (j + 1 < layers.length - 1) {
      // phase through layer j+1: exp(2 i kz d)
      const ph = cexp([-2 * kz[j + 1][1] * layers[j + 1].d, 2 * kz[j + 1][0] * layers[j + 1].d]);
      const Xp = cmul(X, ph);
      X = cdiv(cadd(r, Xp), cadd([1, 0], cmul(r, Xp)));
    } else {
      X = r;
    }
  }
  return X[0] * X[0] + X[1] * X[1];
}

function render({ model, el }) {
  const uid = "xr" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); --w-grid:#eee; font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); --w-grid:#333; }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; }
.${uid} .w-plot { flex:2 1 340px; min-width:300px; }
.${uid} .w-plot canvas, .${uid} .w-schem { width:100%; }
.${uid} .w-side { flex:1 1 200px; min-width:190px; }
.${uid} .w-bar { display:flex; gap:14px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar .w-val { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
.${uid} select { background:var(--w-panel); color:var(--w-fg); border:1px solid var(--w-border);
  border-radius:5px; padding:2px 4px; }
.${uid} input[type=range] { width:110px; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-side"><canvas class="w-schem" height="330"></canvas></div>
  <div class="w-plot"><canvas height="330"></canvas></div>
</div>
<div class="w-bar">
  <label>film <select class="w-mat"></select></label>
  <label>thickness <input class="w-t" type="range" min="3" max="120" step="0.5" value="10"><span class="w-val w-tv"></span></label>
  <label>density <input class="w-d" type="range" min="0.60" max="1.15" step="0.01" value="1.00"><span class="w-val w-dv"></span></label>
  <label>surface roughness <input class="w-r1" type="range" min="0" max="3" step="0.05" value="0.3"><span class="w-val w-r1v"></span></label>
  <label>interface roughness <input class="w-r2" type="range" min="0" max="3" step="0.05" value="0.2"><span class="w-val w-r2v"></span></label>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>X-ray reflectivity explorer.</b> Exact Parratt reflectivity; each slider maps to one feature of the curve.";
  root.appendChild(cap);

  const sel = root.querySelector(".w-mat");
  for (const m of Object.keys(MATS)) {
    const o = document.createElement("option"); o.textContent = m; sel.appendChild(o);
  }
  sel.value = "Cu";
  const cv = root.querySelector(".w-plot canvas");
  const sc = root.querySelector(".w-schem");
  const inT = root.querySelector(".w-t"), inD = root.querySelector(".w-d");
  const inR1 = root.querySelector(".w-r1"), inR2 = root.querySelector(".w-r2");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const m = MATS[sel.value];
    const t = +inT.value, ds = +inD.value, s1 = +inR1.value, s2 = +inR2.value;
    const dF = CDELTA * m.rho * ds * m.za, bF = dF / m.br;
    const dS = CDELTA * SI.rho * SI.za, bS = dS / SI.br;
    const layers = [
      { delta: 0, beta: 0, d: 0, sigmaTop: 0 },
      { delta: dF, beta: bF, d: t, sigmaTop: s1 },
      { delta: dS, beta: bS, d: 0, sigmaTop: s2 },
    ];
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 360, h = 330;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const mL = 46, mR = 10, mT = 12, mB = 34;
    const pw = w - mL - mR, ph = h - mT - mB;
    const thMax = 4 * Math.PI / 180, rMin = -8, rMax = 0.3;
    const X = th => mL + (th / thMax) * pw;
    const Y = lr => mT + (rMax - lr) / (rMax - rMin) * ph;
    const isD = dark();
    // grid: decades and 1-degree lines
    g.strokeStyle = isD ? "#333" : "#eee"; g.lineWidth = 1;
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    for (let d = 0; d >= rMin; d--) {
      g.beginPath(); g.moveTo(mL, Y(d)); g.lineTo(w - mR, Y(d)); g.stroke();
      g.fillText(d === 0 ? "1" : "10" + String.fromCharCode(0x207B) +
        String(-d).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join(""), 6, Y(d) + 3);
    }
    for (let dg = 0; dg <= 4; dg++) {
      const xx = X(dg * Math.PI / 180);
      g.beginPath(); g.moveTo(xx, mT); g.lineTo(xx, h - mB); g.stroke();
      g.fillText(dg + "°", xx - 5, h - mB + 14);
    }
    g.fillText("incidence angle θ", mL + pw / 2 - 40, h - 6);
    g.save(); g.translate(12, mT + ph / 2 + 30); g.rotate(-Math.PI / 2);
    g.fillText("reflectivity", 0, 0); g.restore();
    // curve
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
    g.lineWidth = 1.6; g.beginPath();
    let started = false;
    for (let i = 1; i <= 700; i++) {
      const th = (i / 700) * thMax;
      const R = reflectivity(th, layers);
      const lr = Math.log10(Math.max(R, 1e-12));
      if (lr < rMin) { started = false; continue; }
      const px = X(th), py = Y(Math.min(lr, rMax));
      started ? g.lineTo(px, py) : g.moveTo(px, py);
      started = true;
    }
    g.stroke();
    // ---- schematic: full-height panel with rays, stack, and readouts ----
    const tcF = Math.sqrt(2 * dF) * 180 / Math.PI, tcS = Math.sqrt(2 * dS) * 180 / Math.PI;
    {
      const sw = sc.clientWidth || 210, sh = 330;
      sc.width = sw * dpr; sc.height = sh * dpr;
      const q = sc.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.fillStyle = isD ? "#221f1e" : "#ffffff";
      q.fillRect(0, 0, sw, sh);
      const surfY = 130, filmPx = 14 + t * 0.55;
      const cx = sw * 0.5;
      const wig = (y, amp, ph) => {
        q.beginPath();
        for (let x = 8; x <= sw - 8; x += 3)
          x > 8 ? q.lineTo(x, y + amp * Math.sin(x / 6 + ph)) : q.moveTo(x, y + amp * Math.sin(ph));
        q.stroke();
      };
      // substrate and film
      q.fillStyle = isD ? "#3d3a38" : "#cfcbc5";
      q.fillRect(8, surfY + filmPx, sw - 16, 268 - surfY - filmPx);
      q.fillStyle = isD ? "rgba(240,122,158,0.30)" : "rgba(204,0,0,0.18)";
      q.fillRect(8, surfY, sw - 16, filmPx);
      // rough interfaces
      q.strokeStyle = isD ? "#eee" : "#333"; q.lineWidth = 1.2;
      wig(surfY, Math.min(5, 0.6 + s1 * 2.2), 0);
      wig(surfY + filmPx, Math.min(5, 0.6 + s2 * 2.2), 2);
      // rays: surface reflection plus one internal bounce (the fringe pair)
      const rayA = 0.40, run = surfY - 26;
      q.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)"; q.lineWidth = 1.6;
      q.beginPath(); q.moveTo(cx - run / Math.tan(rayA) * 0.55, 26);
      q.lineTo(cx, surfY); q.lineTo(cx + run / Math.tan(rayA) * 0.55, 26); q.stroke();
      q.globalAlpha = 0.65;
      q.beginPath(); q.moveTo(cx, surfY); q.lineTo(cx + filmPx * 1.5, surfY + filmPx);
      q.lineTo(cx + filmPx * 3, surfY);
      q.lineTo(cx + filmPx * 3 + run / Math.tan(rayA) * 0.55, 26); q.stroke();
      q.globalAlpha = 1;
      q.fillStyle = isD ? "#eee" : "#222"; q.font = "12.5px system-ui";
      q.fillText("X-rays", 12, 22);
      q.fillText("θ", cx - 34, surfY - 8);
      q.fillText(sel.value + "   t, σ₁", 14, surfY + Math.max(14, Math.min(filmPx - 4, 24)));
      q.fillText("Si   σ₂", 14, surfY + filmPx + 16);
      // readouts inside the panel
      q.fillStyle = isD ? "#bbb" : "#555"; q.font = "12.5px system-ui";
      const ro = [["critical angle (film)", tcF.toFixed(3) + "°"],
                  ["critical angle (Si)", tcS.toFixed(3) + "°"],
                  ["fringe period λ/2t", (LAM / (2 * t) * 180 / Math.PI).toFixed(3) + "°"]];
      ro.forEach(([k, v], i) => {
        q.fillText(k, 12, 288 + i * 16);
        q.fillStyle = isD ? "#eee" : "#111";
        q.fillText(v, sw - 12 - q.measureText(v).width, 288 + i * 16);
        q.fillStyle = isD ? "#bbb" : "#555";
      });
    }
    // readouts
    root.querySelector(".w-tv").textContent = t.toFixed(1) + " nm";
    root.querySelector(".w-dv").textContent = (ds * m.rho).toFixed(2) + " g/cm³";
    root.querySelector(".w-r1v").textContent = s1.toFixed(2) + " nm";
    root.querySelector(".w-r2v").textContent = s2.toFixed(2) + " nm";
  }
  for (const i of [sel, inT, inD, inR1, inR2]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  new ResizeObserver(draw).observe(sc);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, reflectivity, MATS, SI, CDELTA };
