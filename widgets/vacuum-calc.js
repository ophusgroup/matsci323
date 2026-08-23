// vacuum-calc.js
// AnyWidget: the monolayer formation time. One logarithmic pressure slider;
// live gas density, impingement flux, mean free path, and time to deposit a
// monolayer (nitrogen, 300 K, unit sticking), with the vacuum regimes marked
// on a log-log chart. The reason surface analysis lives in UHV, in one
// number. Static widget.
//
//   :::{anywidget} ../../widgets/vacuum-calc.js
//   :::

const KB = 1.380649e-23, M = 28 * 1.6605e-27, D = 3.7e-10; // N2
function props(pTorr, T) {
  T = T || 300;
  const p = pTorr * 133.322;                       // Pa
  const n = p / (KB * T);                          // m^-3
  const flux = p / Math.sqrt(2 * Math.PI * M * KB * T); // m^-2 s^-1
  const mfp = KB * T / (Math.SQRT2 * Math.PI * D * D * p); // m
  const tml = 1e19 / flux;                         // s (1e15 sites/cm^2, s=1)
  return { n, flux, mfp, tml };
}
function fmtTime(s) {
  if (s < 1e-6) return (s * 1e9).toPrecision(2) + " ns";
  if (s < 1e-3) return (s * 1e6).toPrecision(2) + " µs";
  if (s < 1) return (s * 1e3).toPrecision(2) + " ms";
  if (s < 60) return s.toPrecision(2) + " s";
  if (s < 3600) return (s / 60).toPrecision(2) + " min";
  if (s < 86400) return (s / 3600).toPrecision(2) + " hours";
  if (s < 3.15e7) return (s / 86400).toPrecision(2) + " days";
  return (s / 3.15e7).toPrecision(2) + " years";
}
function fmtLen(m) {
  if (m < 1e-6) return (m * 1e9).toPrecision(2) + " nm";
  if (m < 1e-3) return (m * 1e6).toPrecision(2) + " µm";
  if (m < 1) return (m * 1e3).toPrecision(2) + " mm";
  if (m < 1000) return m.toPrecision(2) + " m";
  return (m / 1000).toPrecision(2) + " km";
}

function render({ model, el }) {
  const uid = "vc" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,80,90); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1.3 1 300px; min-width:280px; }
.${uid} .w-side { flex:1 1 220px; min-width:210px; display:flex; flex-direction:column; gap:8px;
  font-size:13px; color:var(--w-muted); }
.${uid} .w-box { background:var(--w-panel); border:1px solid var(--w-border); border-radius:6px;
  padding:8px 10px; line-height:1.7; }
.${uid} .w-box b { color:var(--w-fg); font-variant-numeric:tabular-nums; font-size:13px; }
.${uid} .w-big { font-size:17px !important; color:var(--w-accent) !important; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot"><canvas height="320"></canvas></div>
  <div class="w-side">
    <label>pressure <b class="w-pv" style="color:var(--w-fg)"></b>
      <input class="w-p" type="range" min="-12" max="2.9" step="0.05" value="-6"></label>
    <label>gas temperature <b class="w-tv" style="color:var(--w-fg)"></b>
      <input class="w-T" type="range" min="77" max="700" step="1" value="300"></label>
    <div class="w-box">
      gas density <b class="w-n"></b><br>
      impingement flux <b class="w-f"></b><br>
      mean free path <b class="w-m"></b><br>
      monolayer time <b class="w-t w-big"></b>
    </div>
    <div class="w-box" style="font-size:12px; line-height:1.5">Nitrogen with unit sticking, 10¹⁵ sites/cm². A surface analysis
      session needs the monolayer time to exceed the measurement time.</div>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Monolayer formation time.</b> How long a surface stays clean at each pressure (N₂, unit sticking).";
  root.appendChild(cap);
  const cv = root.querySelector("canvas");
  const inP = root.querySelector(".w-p");
  const inT = root.querySelector(".w-T");
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const lp = +inP.value, pT = Math.pow(10, lp), TK = +inT.value;
    const { n, flux, mfp, tml } = props(pT, TK);
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 320, h = 320;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    const mL = 48, mR = 12, mT = 18, mB = 38;
    const X = l => mL + (l + 12) / 14.9 * (w - mL - mR);
    const ltMin = -10, ltMax = 8;
    const Y = lt => mT + (ltMax - lt) / (ltMax - ltMin) * (h - mT - mB);
    // regime bands, labels at the bottom of each band
    const bands = [[2.9, -3, "rough vacuum", 0.05], [-3, -8, "high vacuum", 0.10], [-8, -12, "UHV", 0.16]];
    for (const [a, b, name, al] of bands) {
      g.fillStyle = isD ? `rgba(255,80,90,${al})` : `rgba(204,0,0,${al * 0.7})`;
      g.fillRect(X(b), mT, X(a) - X(b), h - mT - mB);
      g.fillStyle = isD ? "#ccc" : "#555"; g.font = "12px system-ui";
      g.fillText(name, X(b) + 5, h - mB - 7);
    }
    g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
    g.font = "12px system-ui";
    for (let e = -12; e <= 2; e += 2) {
      g.beginPath(); g.moveTo(X(e), mT); g.lineTo(X(e), h - mB); g.stroke();
      g.fillText("1e" + e, X(e) - 12, h - mB + 15);
    }
    for (let lt = -10; lt <= 8; lt += 2) {
      g.beginPath(); g.moveTo(mL, Y(lt)); g.lineTo(w - mR, Y(lt)); g.stroke();
    }
    // atmosphere marker
    const lAtm = Math.log10(760);
    g.strokeStyle = isD ? "#777" : "#999"; g.setLineDash([4, 3]);
    g.beginPath(); g.moveTo(X(lAtm), mT); g.lineTo(X(lAtm), h - mB); g.stroke();
    g.setLineDash([]);
    g.fillStyle = isD ? "#ccc" : "#555";
    g.fillText("1 atm", X(lAtm) - 34, mT + 13);
    // y labels: human time units on the left
    g.fillStyle = isD ? "#999" : "#777";
    for (const [lt, lab] of [[-6, "µs"], [-3, "ms"], [0, "1 s"], [2, "min"], [4, "hours"], [6, "weeks"]])
      g.fillText(lab, 5, Y(lt) + 4);
    g.fillText("pressure (Torr)", mL + (w - mL - mR) / 2 - 45, h - 4);
    // monolayer-time line
    g.strokeStyle = isD ? "rgb(255,80,90)" : "rgb(204,0,0)"; g.lineWidth = 2;
    g.beginPath();
    for (let l = -12; l <= 2.9; l += 0.1) {
      const t = props(Math.pow(10, l), TK).tml;
      const lt = Math.log10(t);
      l === -12 ? g.moveTo(X(l), Y(Math.min(ltMax, Math.max(ltMin, lt))))
                : g.lineTo(X(l), Y(Math.min(ltMax, Math.max(ltMin, lt))));
    }
    g.stroke();
    // marker
    g.fillStyle = isD ? "rgb(255,80,90)" : "rgb(204,0,0)";
    g.beginPath(); g.arc(X(lp), Y(Math.min(ltMax, Math.max(ltMin, Math.log10(tml)))), 6, 0, 6.3); g.fill();
    root.querySelector(".w-pv").textContent = pT.toExponential(1) + " Torr";
    root.querySelector(".w-tv").textContent = TK + " K";
    root.querySelector(".w-n").textContent = n.toExponential(1) + " m⁻³";
    root.querySelector(".w-f").textContent = (flux / 1e4).toExponential(1) + " cm⁻²s⁻¹";
    root.querySelector(".w-m").textContent = fmtLen(mfp);
    root.querySelector(".w-t").textContent = fmtTime(tml);
  }
  inP.addEventListener("input", draw);
  inT.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, props };
