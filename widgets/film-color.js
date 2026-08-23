// film-color.js
// AnyWidget: why oxide films have colors. Thin-film interference reflectance
// of SiO2 or Si3N4 on silicon at normal incidence, using tabulated Si optical
// constants, converted to a display color through the CIE color matching
// functions. The strip reproduces the cleanroom "oxide color chart", and the
// judgement of film thickness by eye is a real (if coarse) metrology.
// Colorimetry approximate (equal-energy illuminant). Static widget.
//
//   :::{anywidget} ../../widgets/film-color.js
//   :::

// Si optical constants, coarse table (lambda nm, n, k), interpolated
const SI_NK = [
  [380, 6.52, 0.83], [400, 5.57, 0.39], [420, 4.98, 0.24], [450, 4.67, 0.15],
  [480, 4.37, 0.09], [500, 4.30, 0.073], [550, 4.08, 0.032], [600, 3.94, 0.018],
  [650, 3.85, 0.013], [700, 3.78, 0.009], [740, 3.73, 0.007],
];
function siNK(lam) {
  let i = 0;
  while (i < SI_NK.length - 2 && SI_NK[i + 1][0] < lam) i++;
  const [l0, n0, k0] = SI_NK[i], [l1, n1, k1] = SI_NK[i + 1];
  const f = Math.min(1, Math.max(0, (lam - l0) / (l1 - l0)));
  return [n0 + f * (n1 - n0), k0 + f * (k1 - k0)];
}
// reflectance of film (n1 real) on Si at normal incidence
function reflectance(lam, t, n1) {
  const [n2, k2] = siNK(lam);
  // r01 real; r12 complex
  const r01 = (1 - n1) / (1 + n1);
  const d = (n1 + n2) * (n1 + n2) + k2 * k2;
  const r12 = [((n1 - n2) * (n1 + n2) - k2 * k2) / d, (-2 * n1 * k2) / d * -1]; // (n1-ñ2)/(n1+ñ2)
  // careful: (n1 - (n2 - i k2)) / (n1 + n2 - i k2) with n~ = n2 - i k2 (e^{-iwt} conv):
  // numerator (n1-n2) + i k2 ; denominator (n1+n2) - i k2
  const nr = [n1 - n2, k2], dr = [n1 + n2, -k2];
  const dd = dr[0] * dr[0] + dr[1] * dr[1];
  r12[0] = (nr[0] * dr[0] + nr[1] * dr[1]) / dd;
  r12[1] = (nr[1] * dr[0] - nr[0] * dr[1]) / dd;
  const beta = 4 * Math.PI * n1 * t / lam;         // 2*beta phase, t and lam in nm
  const c = Math.cos(beta), s = Math.sin(beta);
  const e = [c, s];                                 // e^{i 2 beta'}
  const num = [r01 + r12[0] * c - r12[1] * s, r12[0] * s + r12[1] * c];
  const pr = [r12[0] * c - r12[1] * s, r12[0] * s + r12[1] * c];
  const den = [1 + r01 * pr[0], r01 * pr[1]];
  const d2 = den[0] * den[0] + den[1] * den[1];
  const rr = [(num[0] * den[0] + num[1] * den[1]) / d2, (num[1] * den[0] - num[0] * den[1]) / d2];
  return rr[0] * rr[0] + rr[1] * rr[1];
}
// CIE 1931 color matching, multi-lobe Gaussian fits (Wyman et al.)
function gpw(x, mu, s1, s2) { const s = x < mu ? s1 : s2; return Math.exp(-0.5 * ((x - mu) / s) ** 2); }
const xbar = l => 1.056 * gpw(l, 599.8, 37.9, 31.0) + 0.362 * gpw(l, 442.0, 16.0, 26.7) - 0.065 * gpw(l, 501.1, 20.4, 26.2);
const ybar = l => 0.821 * gpw(l, 568.8, 46.9, 40.5) + 0.286 * gpw(l, 530.9, 16.3, 31.1);
const zbar = l => 1.217 * gpw(l, 437.0, 11.8, 36.0) + 0.681 * gpw(l, 459.0, 26.0, 13.8);
function filmRGB(t, n1, boost) {
  let X = 0, Y = 0, Z = 0, Yn = 0;
  for (let l = 380; l <= 740; l += 4) {
    const R = reflectance(l, t, n1);
    X += R * xbar(l); Y += R * ybar(l); Z += R * zbar(l); Yn += ybar(l);
  }
  X /= Yn; Y /= Yn; Z /= Yn;
  const sc = boost / Math.max(Y, 1e-6) < 1 ? 1 : Math.min(boost / Math.max(Y, 1e-6), 3.0);
  X *= sc; Y *= sc; Z *= sc;
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055;
  return [gam(r), gam(g), gam(b)].map(v => Math.round(255 * Math.min(1, Math.max(0, v))));
}

function spectralRGB(l) {
  // color of monochromatic light at wavelength l (approximate, saturated)
  let X = xbar(l), Y = ybar(l), Z = zbar(l);
  const s = 1.6 / Math.max(0.02, X + Y + Z);
  X *= s; Y *= s; Z *= s;
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  const m = Math.max(r, g, b, 1e-6);
  r = Math.max(0, r / m); g = Math.max(0, g / m); b = Math.max(0, b / m);
  const gam = v => Math.round(255 * Math.pow(v, 1 / 2.2));
  return `rgb(${gam(r)},${gam(g)},${gam(b)})`;
}

function render({ model, el }) {
  const uid = "fc" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-strip { height:56px; margin-bottom:8px; cursor:crosshair; }
.${uid} .w-row { display:flex; gap:12px; flex-wrap:wrap; align-items:stretch; }
.${uid} .w-spec { flex:1.4 1 300px; min-width:260px; }
.${uid} .w-side { flex:1 1 200px; min-width:190px; display:flex; flex-direction:column; gap:8px; }
.${uid} .w-chip { flex:1; min-height:90px; border-radius:8px; border:1px solid var(--w-border);
  display:flex; align-items:flex-end; justify-content:center; color:#fff;
  text-shadow:0 0 3px rgba(0,0,0,0.8); font-size:13px; padding:6px; }
.${uid} .w-controls { display:flex; gap:10px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:3px 9px; cursor:pointer; font-size:13px; }
.${uid} .w-controls button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} input[type=range] { flex:1 1 140px; accent-color:var(--w-accent); }
.${uid} .w-stat { color:var(--w-fg); font-weight:600; font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<canvas class="w-strip" height="56"></canvas>
<div class="w-row">
  <div class="w-spec"><canvas class="w-sp" height="220"></canvas></div>
  <div class="w-side"><div class="w-chip"><span class="w-chiplabel"></span></div></div>
</div>
<div class="w-controls">
  <button class="w-ox on">SiO&#8322; (n=1.46)</button>
  <button class="w-ni">Si&#8323;N&#8324; (n=2.02)</button>
  <span>thickness <span class="w-stat w-tv"></span></span>
  <input class="w-t" type="range" min="0" max="1000" step="2" value="300">
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Thin-film interference colors.</b> The cleanroom oxide color chart, computed from interference physics plus human color vision.";
  root.appendChild(cap);

  const cvStrip = root.querySelector(".w-strip"), cvSp = root.querySelector(".w-sp");
  const inT = root.querySelector(".w-t");
  const bOx = root.querySelector(".w-ox"), bNi = root.querySelector(".w-ni");
  let n1 = 1.46;
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const t = +inT.value;
    const isD = dark();
    // strip
    {
      const dpr = window.devicePixelRatio || 1;
      const w = cvStrip.clientWidth || 420, h = 56;
      cvStrip.width = w * dpr; cvStrip.height = h * dpr;
      const g = cvStrip.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let px = 0; px < w; px += 2) {
        const tt = px / w * 1000;
        const [r, gg, b] = filmRGB(tt, n1, 0.50);
        g.fillStyle = `rgb(${r},${gg},${b})`;
        g.fillRect(px, 12, 2, h - 24);
      }
      g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
      for (let tt = 0; tt <= 1000; tt += 200) g.fillText(tt + " nm", tt / 1000 * (w - 40), 10);
      const mx = t / 1000 * w;
      g.strokeStyle = isD ? "#fff" : "#000"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(mx, 10); g.lineTo(mx, h - 8); g.stroke();
    }
    // spectrum
    {
      const dpr = window.devicePixelRatio || 1;
      const w = cvSp.clientWidth || 320, h = 220;
      cvSp.width = w * dpr; cvSp.height = h * dpr;
      const g = cvSp.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const mL = 34, mB = 30, mT = 10, mR = 8;
      const X = l => mL + (l - 380) / 360 * (w - mL - mR);
      const Y = R => h - mB - R / 0.6 * (h - mT - mB);
      g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
      g.font = "12px system-ui";
      for (const R of [0, 0.2, 0.4, 0.6]) {
        g.beginPath(); g.moveTo(mL, Y(R)); g.lineTo(w - mR, Y(R)); g.stroke();
        g.fillText((R * 100) + "%", 4, Y(R) + 3);
      }
      for (const l of [400, 500, 600, 700]) {
        g.beginPath(); g.moveTo(X(l), mT); g.lineTo(X(l), h - mB); g.stroke();
        g.fillText(l, X(l) - 9, h - mB + 13);
      }
      g.fillText("wavelength (nm)", mL + 90, h - 4);
      // spectral color bar along the wavelength axis
      for (let l = 380; l <= 740; l += 2) {
        g.fillStyle = spectralRGB(l);
        g.fillRect(X(l), h - mB + 1, X(l + 2) - X(l) + 1, 6);
      }
      // reflectance curve, drawn in the color of each wavelength
      g.lineWidth = 3.5; g.lineCap = "round";
      let prev = null;
      for (let l = 380; l <= 740; l += 2) {
        const R = Math.min(reflectance(l, t, n1), 0.6);
        const pt = [X(l), Y(R)];
        if (prev) {
          g.strokeStyle = spectralRGB(l - 1);
          g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(pt[0], pt[1]); g.stroke();
        }
        prev = pt;
      }
      g.fillStyle = isD ? "#999" : "#777";
      g.fillText("reflectance of the film stack", mL + 6, mT + 10);
    }
    const [r, gg, b] = filmRGB(t, n1, 0.50);
    const chip = root.querySelector(".w-chip");
    chip.style.background = `rgb(${r},${gg},${b})`;
    root.querySelector(".w-chiplabel").textContent =
      `${t} nm ${n1 === 1.46 ? "SiO₂" : "Si₃N₄"} on Si`;
    root.querySelector(".w-tv").textContent = t + " nm";
  }
  bOx.addEventListener("click", () => { n1 = 1.46; bOx.classList.add("on"); bNi.classList.remove("on"); draw(); });
  bNi.addEventListener("click", () => { n1 = 2.02; bNi.classList.add("on"); bOx.classList.remove("on"); draw(); });
  inT.addEventListener("input", draw);
  cvStrip.addEventListener("pointerdown", ev => {
    const r2 = cvStrip.getBoundingClientRect();
    inT.value = Math.round((ev.clientX - r2.left) / r2.width * 1000);
    draw();
  });
  cvStrip.addEventListener("pointermove", ev => {
    if (ev.buttons !== 1) return;
    const r2 = cvStrip.getBoundingClientRect();
    inT.value = Math.round((ev.clientX - r2.left) / r2.width * 1000);
    draw();
  });
  new ResizeObserver(draw).observe(cvSp);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, reflectance, filmRGB };
