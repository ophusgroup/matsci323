// wulff.js
// AnyWidget: the Wulff construction and its Winterbottom extension. Left: the
// polar surface-energy plot gamma(theta) and the equilibrium (Wulff) shape it
// generates, computed as the inner envelope of the half-planes r.n <= gamma(n).
// Right: the same crystal on a substrate, truncated by the interface term
// (Winterbottom): sweeping the wetting parameter moves the island continuously
// from a barely-touching ball to a spread wetting film, and for the isotropic
// preset reproduces Young's contact angle. Static, redraws on input.
//
//   :::{anywidget} ../../widgets/wulff.js
//   :::

function gammaFn(a4, a6) {
  return th => 1 + a4 * Math.cos(4 * th) + a6 * Math.cos(6 * th);
}
// Wulff shape: r(phi) = min over th of gamma(th)/cos(phi-th)
function wulffShape(gam, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const phi = i / n * 2 * Math.PI;
    let r = 1e9;
    for (let j = -80; j <= 80; j++) {
      const th = phi + j / 80 * (Math.PI / 2 - 0.02);
      const c = Math.cos(phi - th);
      if (c > 0.02) r = Math.min(r, gam(th) / c);
    }
    pts.push([r * Math.cos(phi), r * Math.sin(phi)]);
  }
  return pts;
}

const PRESETS = {
  "isotropic (liquid)": { a4: 0, a6: 0 },
  "cubic": { a4: 0.12, a6: 0 },
  "strong facets": { a4: 0.30, a6: 0 },
  "hexagonal": { a4: 0, a6: 0.22 },
};

function render({ model, el }) {
  const uid = "wf" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-top { display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap; }
.${uid} .w-top button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 12px; cursor:pointer; font-size:13px; }
.${uid} .w-top button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-col { flex:1 1 240px; min-width:220px; display:flex; flex-direction:column; gap:6px; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} label { font-size:13px; color:var(--w-muted); display:flex; flex-direction:column; gap:2px; }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-top"></div>
<div class="w-row">
  <div class="w-col">
    <canvas class="w-free" height="300"></canvas>
    <label>cubic anisotropy <span class="w-val w-a4v"></span>
      <input class="w-a4" type="range" min="0" max="0.35" step="0.005" value="0.12"></label>
    <label>sixfold anisotropy <span class="w-val w-a6v"></span>
      <input class="w-a6" type="range" min="0" max="0.35" step="0.005" value="0"></label>
  </div>
  <div class="w-col">
    <canvas class="w-sub" height="300"></canvas>
    <label>wetting (interface energy vs substrate energy) <span class="w-val w-wv"></span>
      <input class="w-wet" type="range" min="-0.95" max="0.95" step="0.01" value="0.3"></label>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Wulff and Winterbottom constructions.</b> Equilibrium crystal shape from γ(θ), free and on a substrate.";
  root.appendChild(cap);

  const top = root.querySelector(".w-top");
  const inA4 = root.querySelector(".w-a4"), inA6 = root.querySelector(".w-a6");
  const inWet = root.querySelector(".w-wet");
  for (const [k, p] of Object.entries(PRESETS)) {
    const b = document.createElement("button");
    b.textContent = k;
    if (k === "cubic") b.classList.add("on");
    b.addEventListener("click", () => {
      inA4.value = p.a4; inA6.value = p.a6;
      top.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
      draw();
    });
    top.appendChild(b);
  }
  const cvF = root.querySelector(".w-free"), cvS = root.querySelector(".w-sub");
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const isD = dark();
    const acc = isD ? "rgb(255,63,63)" : "rgb(204,0,0)";
    const a4 = +inA4.value, a6 = +inA6.value;
    const gam = gammaFn(a4, a6);
    const shape = wulffShape(gam, 720);
    // ---------- left: gamma plot + free Wulff shape ----------
    {
      const w = cvF.clientWidth || 260, h = 300;
      cvF.width = w * dpr; cvF.height = h * dpr;
      const g = cvF.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2 + 8, S = Math.min(w, h) * 0.26;
      // gamma polar plot
      g.strokeStyle = isD ? "#777" : "#999"; g.lineWidth = 1.3;
      g.setLineDash([4, 3]);
      g.beginPath();
      for (let i = 0; i <= 720; i++) {
        const th = i / 720 * 2 * Math.PI, r = gam(th) * S;
        const px = cx + r * Math.cos(th), py = cy - r * Math.sin(th);
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.stroke(); g.setLineDash([]);
      // Wulff shape
      g.strokeStyle = acc; g.lineWidth = 2.2;
      g.fillStyle = isD ? "rgba(255,63,63,0.13)" : "rgba(204,0,0,0.08)";
      g.beginPath();
      shape.forEach((p, i) => {
        const px = cx + p[0] * S, py = cy - p[1] * S;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      });
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = isD ? "#ccc" : "#444"; g.font = "13px system-ui";
      g.fillText("γ(θ) polar plot (dashed)", 10, 18);
      g.fillText("equilibrium shape (solid)", 10, 34);
    }
    // ---------- right: Winterbottom island on the substrate ----------
    {
      const w = cvS.clientWidth || 260, h = 300;
      cvS.width = w * dpr; cvS.height = h * dpr;
      const g = cvS.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const wet = +inWet.value;          // = (gamma_interface - gamma_substrate)/gamma_film
      const cx = w / 2, S = Math.min(w, h) * 0.30;
      const subY = h * 0.68;
      // island: Wulff shape clipped at y = -wet (center sits at height wet above substrate)
      const cy = subY - wet * S;         // shape center in screen coords
      g.fillStyle = isD ? "#33302e" : "#dedad4";
      g.fillRect(0, subY, w, h - subY - 24);
      const poly = [];
      shape.forEach(p => {
        const py = cy - p[1] * S;
        poly.push([cx + p[0] * S, Math.min(py, subY)]);
      });
      g.fillStyle = isD ? "rgba(255,63,63,0.25)" : "rgba(204,0,0,0.16)";
      g.strokeStyle = acc; g.lineWidth = 2.2;
      g.beginPath();
      poly.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = isD ? "#ccc" : "#444"; g.font = "13px system-ui";
      g.fillText("island on substrate", 10, 18);
      g.fillText("substrate", 10, subY + 18);
      const regime = wet > 0.75 ? "nearly non-wetting" : wet > 0.15 ? "partial wetting"
        : wet > -0.5 ? "strong wetting" : "near-complete wetting";
      g.fillText(regime, w - g.measureText(regime).width - 10, 18);
    }
    root.querySelector(".w-a4v").textContent = a4.toFixed(2);
    root.querySelector(".w-a6v").textContent = a6.toFixed(2);
    root.querySelector(".w-wv").textContent = (+inWet.value).toFixed(2);
  }
  for (const i of [inA4, inA6, inWet]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cvF);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, wulffShape, gammaFn };
