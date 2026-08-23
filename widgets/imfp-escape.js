// imfp-escape.js
// AnyWidget: the electron inelastic mean free path universal curve, with a
// live escape-depth calculator: pick a kinetic energy and an emission angle,
// see the sampling depth and overlayer attenuation. The curve is the
// schematic universal form for elements, lambda(nm) = 143/E^2 + 0.054 sqrt(E);
// real materials scatter around it by tens of percent. Static widget.
//
//   :::{anywidget} ../../widgets/imfp-escape.js
//   :::

const imfp = E => 143 / (E * E) + 0.054 * Math.sqrt(E); // nm, E in eV

const LINES = [ // common photoelectron kinetic energies with Al K-alpha
  { name: "Au 4f", E: 1403 }, { name: "Si 2p", E: 1387 }, { name: "C 1s", E: 1202 },
  { name: "O 1s", E: 954 },
];

function render({ model, el }) {
  const uid = "im" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-left { flex:1.2 1 320px; min-width:280px; }
.${uid} .w-right { flex:1 1 250px; min-width:240px; display:flex; flex-direction:column; gap:8px; }
.${uid} .w-box { background:var(--w-panel); border:1px solid var(--w-border); border-radius:6px;
  padding:6px 8px; font-size:13px; color:var(--w-muted); line-height:1.55; }
.${uid} .w-box b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} label { font-size:13px; color:var(--w-muted); display:flex; flex-direction:column; gap:2px; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-left"><canvas class="w-curve" height="300"></canvas></div>
  <div class="w-right">
    <label>electron kinetic energy <span class="w-val w-ev"></span>
      <input class="w-E" type="range" min="0.5" max="4" step="0.01" value="3.142"></label>
    <label>emission angle from normal <span class="w-val w-av"></span>
      <input class="w-a" type="range" min="0" max="80" step="1" value="0"></label>
    <label>overlayer thickness <span class="w-val w-tv"></span>
      <input class="w-t" type="range" min="0" max="10" step="0.1" value="2"></label>
    <canvas class="w-depth" height="120"></canvas>
    <div class="w-box">
      inelastic mean free path &lambda; <b class="w-l"></b><br>
      95% of signal from top <b class="w-d95"></b><br>
      substrate signal through overlayer <b class="w-att"></b>
    </div>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Electron escape depth.</b> The universal curve, and the sampling depth it implies at any energy and angle.";
  root.appendChild(cap);

  const cvC = root.querySelector(".w-curve"), cvD = root.querySelector(".w-depth");
  const inE = root.querySelector(".w-E"), inA = root.querySelector(".w-a"), inT = root.querySelector(".w-t");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const E = Math.pow(10, +inE.value);       // slider is log10(E)
    const th = +inA.value * Math.PI / 180, t = +inT.value;
    const lam = imfp(E), esc = 3 * lam * Math.cos(th);
    const att = Math.exp(-t / (lam * Math.cos(th)));
    const isD = dark();
    const acc = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
    // ---- universal curve, log-log ----
    {
      const dpr = window.devicePixelRatio || 1;
      const w = cvC.clientWidth || 340, h = 300;
      cvC.width = w * dpr; cvC.height = h * dpr;
      const g = cvC.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const mL = 46, mR = 10, mT = 12, mB = 42;
      const lx0 = Math.log10(1), lx1 = 4, ly0 = Math.log10(0.3), ly1 = Math.log10(30);
      const X = e => mL + (Math.log10(e) - lx0) / (lx1 - lx0) * (w - mL - mR);
      const Y = l => mT + (ly1 - Math.log10(l)) / (ly1 - ly0) * (h - mT - mB);
      g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
      g.font = "13px system-ui";
      for (const e of [1, 10, 100, 1000, 10000]) {
        g.beginPath(); g.moveTo(X(e), mT); g.lineTo(X(e), h - mB); g.stroke();
        g.fillText(e >= 1000 ? e / 1000 + "k" : e, X(e) - 6, h - mB + 13);
      }
      for (const l of [0.3, 1, 3, 10, 30]) {
        g.beginPath(); g.moveTo(mL, Y(l)); g.lineTo(w - mR, Y(l)); g.stroke();
        g.fillText(l, 10, Y(l) + 3);
      }
      g.fillText("kinetic energy (eV)", mL + 70, h - 8);
      g.save(); g.translate(10, mT + 130); g.rotate(-Math.PI / 2);
      g.fillText("IMFP (nm)", 0, 0); g.restore();
      // technique bands
      g.fillStyle = isD ? "rgba(240,122,158,0.10)" : "rgba(204,0,0,0.06)";
      g.fillRect(X(20), mT, X(300) - X(20), h - mT - mB);   // LEED / AES low
      g.fillRect(X(950), mT, X(1500) - X(950), h - mT - mB); // XPS with Al Ka
      g.fillStyle = isD ? "#bbb" : "#555";
      g.fillText("LEED", X(40), mT + 12);
      g.fillText("XPS", X(1000), mT + 12);
      // curve
      g.strokeStyle = acc; g.lineWidth = 1.8; g.beginPath();
      for (let i = 0; i <= 300; i++) {
        const e = Math.pow(10, lx0 + (lx1 - lx0) * i / 300);
        i ? g.lineTo(X(e), Y(imfp(e))) : g.moveTo(X(e), Y(imfp(e)));
      }
      g.stroke();
      // marker
      g.fillStyle = acc;
      g.beginPath(); g.arc(X(E), Y(lam), 5, 0, 6.3); g.fill();
    }
    // ---- escape-depth cartoon ----
    {
      const dpr = window.devicePixelRatio || 1;
      const w = cvD.clientWidth || 250, h = 120;
      cvD.width = w * dpr; cvD.height = h * dpr;
      const g = cvD.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const surf = 18, zScale = (h - surf - 6) / 12;  // 12 nm shown
      g.fillStyle = isD ? "#1c1a19" : "#efedea";
      g.fillRect(0, surf, w, h - surf);
      // overlayer
      g.fillStyle = isD ? "rgba(240,122,158,0.18)" : "rgba(204,0,0,0.10)";
      g.fillRect(0, surf, w, t * zScale);
      // exponential signal shading
      for (let i = 0; i < h - surf; i++) {
        const z = i / zScale;
        const a = Math.exp(-z / (lam * Math.cos(th)));
        g.fillStyle = isD ? `rgba(240,122,158,${0.5 * a})` : `rgba(204,0,0,${0.4 * a})`;
        g.fillRect(w * 0.62, surf + i, w * 0.3, 1);
      }
      // emission arrow at angle theta
      g.strokeStyle = isD ? "#eee" : "#222"; g.lineWidth = 1.5;
      const ax = w * 0.77, ay = surf;
      g.beginPath(); g.moveTo(ax, ay);
      g.lineTo(ax + Math.sin(th) * 40, ay - Math.cos(th) * 40); g.stroke();
      g.strokeStyle = isD ? "#666" : "#999";
      g.beginPath(); g.moveTo(0, surf); g.lineTo(w, surf); g.stroke();
      // escape depth line
      g.strokeStyle = acc; g.setLineDash([4, 3]);
      g.beginPath(); g.moveTo(w * 0.55, surf + esc * zScale);
      g.lineTo(w * 0.98, surf + esc * zScale); g.stroke(); g.setLineDash([]);
      g.fillStyle = isD ? "#ccc" : "#444"; g.font = "13px system-ui";
      g.fillText("3λcosθ", w * 0.55, surf + esc * zScale - 3);
      g.fillText("signal", w * 0.62, h - 4);
      if (t > 0) g.fillText("overlayer", 4, surf + Math.max(10, t * zScale - 2));
    }
    root.querySelector(".w-ev").textContent = E >= 1000 ? (E / 1000).toFixed(2) + " keV" : E.toFixed(0) + " eV";
    root.querySelector(".w-av").textContent = inA.value + "°";
    root.querySelector(".w-tv").textContent = t.toFixed(1) + " nm";
    root.querySelector(".w-l").textContent = lam.toFixed(2) + " nm";
    root.querySelector(".w-d95").textContent = esc.toFixed(2) + " nm";
    root.querySelector(".w-att").textContent = (att * 100).toFixed(1) + "%";
  }
  for (const i of [inE, inA, inT]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cvC);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, imfp };
