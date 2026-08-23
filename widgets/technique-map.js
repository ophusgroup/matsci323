// technique-map.js
// AnyWidget: the course's techniques on one chart, lateral resolution against
// the depth sampled per measurement, each drawn as its operating REGION
// (ranges are representative orders of magnitude, matching the master table).
// Hover a region for the question that technique answers best.
//
//   :::{anywidget} ./widgets/technique-map.js   (from synthesis.md)
//   :::

// lateral range (m), depth range (m)
const DATA = [
  { n: "XRD/GIXRD", x: [5e-4, 1e-2], y: [5e-8, 5e-6], f: "photons", q: "phases, texture, strain" },
  { n: "XRR", x: [1e-3, 1e-2], y: [1e-9, 3e-7], f: "photons", q: "thickness, density, roughness", lp: "in" },
  { n: "Ellipsometry", x: [2e-5, 1e-3], y: [3e-10, 1e-6], f: "photons", q: "thickness and optical constants" },
  { n: "Raman", x: [3e-7, 5e-6], y: [1e-7, 2e-6], f: "photons", q: "phase, strain, disorder" },
  { n: "RBS", x: [5e-4, 3e-3], y: [1e-8, 2e-6], f: "ions", q: "absolute composition vs depth", lp: "in" },
  { n: "SIMS", x: [5e-8, 3e-4], y: [5e-10, 5e-9], f: "ions", q: "trace impurities, ppb" },
  { n: "LEIS", x: [1e-4, 5e-3], y: [2e-10, 3.5e-10], f: "ions", q: "the outermost atomic layer", lp: "below" },
  { n: "APT", x: [2e-10, 1e-9], y: [1e-10, 3e-10], f: "ions", q: "3D composition, atom by atom" },
  { n: "XPS", x: [1e-5, 3e-3], y: [2e-9, 1e-8], f: "electron spectroscopy", q: "surface chemistry, oxidation states", lp: "in" },
  { n: "AES", x: [1e-8, 1e-5], y: [2e-9, 1e-8], f: "electron spectroscopy", q: "small-feature surface composition" },
  { n: "SEM", x: [1e-9, 2e-8], y: [1e-9, 5e-8], f: "electron microscopy", q: "morphology" },
  { n: "EDS (SEM)", x: [3e-7, 5e-6], y: [3e-7, 5e-6], f: "electron microscopy", q: "micron-scale composition" },
  { n: "EBSD", x: [2e-8, 1e-7], y: [1e-8, 4e-8], f: "electron microscopy", q: "grain orientations" },
  { n: "STEM/EELS", x: [5e-11, 1e-9], y: [5e-9, 1e-7], f: "electron microscopy", q: "interfaces imaged directly" },
  { n: "LEED/RHEED", x: [1e-4, 1e-2], y: [3e-10, 2e-9], f: "diffraction", q: "surface order; growth monitoring", lp: "in" },
  { n: "AFM", x: [1e-9, 3e-8], y: [1e-10, 1e-9], f: "scanning probe", q: "topography and roughness", lp: "below" },
  { n: "STM", x: [5e-11, 5e-10], y: [1e-10, 5e-10], f: "scanning probe", q: "atomic and electronic structure" },
  { n: "KPFM", x: [2e-8, 1e-7], y: [5e-10, 5e-9], f: "scanning probe", q: "work function maps" },
];
const FAMS = {
  "photons": "#c98f00", "ions": "#b03030", "electron spectroscopy": "#3a7abd",
  "electron microscopy": "#3f8f5f", "diffraction": "#8a5fbd", "scanning probe": "#c25e8a",
};

function render({ model, el }) {
  const uid = "tm" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; cursor:crosshair; }
.${uid} .w-legend { display:flex; gap:14px; flex-wrap:wrap; margin-top:6px; font-size:12.5px;
  color:var(--w-muted); }
.${uid} .w-legend span::before { content:"\\25A0"; margin-right:4px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `<canvas height="440"></canvas><div class="w-legend"></div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>The technique landscape.</b> Operating regions in resolution and depth; hover for details.";
  root.appendChild(cap);
  const cv = root.querySelector("canvas");
  const leg = root.querySelector(".w-legend");
  for (const [f, c] of Object.entries(FAMS)) {
    const s = document.createElement("span");
    s.textContent = f; s.style.color = c;
    leg.appendChild(s);
  }
  let hover = -1, geo = null;
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const lx0 = -10.6, lx1 = -1.8, ly0 = -10.2, ly1 = -5.1;
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 500, h = 440;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    const mL = 74, mR = 12, mT = 14, mB = 46;
    const X = v => mL + (Math.log10(v) - lx0) / (lx1 - lx0) * (w - mL - mR);
    const Y = v => h - mB - (Math.log10(v) - ly0) / (ly1 - ly0) * (h - mT - mB);
    geo = { X, Y };
    g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
    g.font = "12.5px system-ui";
    const xticks = [[1e-10, "1 Å"], [1e-9, "1 nm"], [1e-8, "10 nm"], [1e-7, "100 nm"],
      [1e-6, "1 µm"], [1e-5, "10 µm"], [1e-4, "0.1 mm"], [1e-3, "1 mm"], [1e-2, "1 cm"]];
    for (const [v, lab] of xticks) {
      g.beginPath(); g.moveTo(X(v), mT); g.lineTo(X(v), h - mB); g.stroke();
      g.fillText(lab, X(v) - 14, h - mB + 16);
    }
    const yticks = [[1e-10, "1 Å"], [1e-9, "1 nm"], [1e-8, "10 nm"], [1e-7, "100 nm"], [1e-6, "1 µm"]];
    for (const [v, lab] of yticks) {
      g.beginPath(); g.moveTo(mL, Y(v)); g.lineTo(w - mR, Y(v)); g.stroke();
      g.fillText(lab, 26, Y(v) + 4);
    }
    g.fillText("lateral resolution", mL + (w - mL) / 2 - 50, h - 8);
    g.save(); g.translate(14, mT + (h - mT - mB) / 2 + 55); g.rotate(-Math.PI / 2);
    g.fillText("depth sampled", 0, 0); g.restore();
    // regions
    DATA.forEach((d, i) => {
      const c = FAMS[d.f];
      const x0 = X(d.x[0]), x1 = X(d.x[1]);
      const y0 = Y(d.y[1]), y1 = Y(d.y[0]);
      const ww = Math.max(x1 - x0, 10), hh = Math.max(y1 - y0, 10);
      g.globalAlpha = i === hover ? 0.5 : 0.22;
      g.fillStyle = c;
      g.beginPath(); g.roundRect(x0, y0, ww, hh, 7); g.fill();
      g.globalAlpha = 1;
      g.strokeStyle = c; g.lineWidth = i === hover ? 2.5 : 1.2;
      g.beginPath(); g.roundRect(x0, y0, ww, hh, 7); g.stroke();
      g.fillStyle = isD ? "#eee" : "#222"; g.font = "12px system-ui";
      if (d.lp === "in") g.fillText(d.n, x0 + 5, y0 + 14);
      else if (d.lp === "below") g.fillText(d.n, x0 + 4, y0 + hh + 13);
      else g.fillText(d.n, x0 + 4, y0 - 3);
    });
    if (hover >= 0) {
      const d = DATA[hover];
      const tx = Math.min(X(d.x[0]) + 10, w - 230), ty = Math.max(Y(d.y[1]) + 26, 46);
      g.fillStyle = isD ? "rgba(20,18,17,0.96)" : "rgba(255,255,255,0.97)";
      g.strokeStyle = FAMS[d.f];
      g.beginPath(); g.roundRect(tx, ty - 30, 220, 44, 6); g.fill(); g.stroke();
      g.fillStyle = isD ? "#eee" : "#111"; g.font = "bold 13px system-ui";
      g.fillText(d.n, tx + 8, ty - 12);
      g.font = "12.5px system-ui"; g.fillStyle = isD ? "#bbb" : "#444";
      g.fillText(d.q, tx + 8, ty + 5);
    }
  }
  cv.addEventListener("pointermove", ev => {
    if (!geo) return;
    const r = cv.getBoundingClientRect();
    const px = ev.clientX - r.left, py = ev.clientY - r.top;
    let best = -1, bestArea = 1e18;
    DATA.forEach((d, i) => {
      const x0 = geo.X(d.x[0]), x1 = geo.X(d.x[1]);
      const y0 = geo.Y(d.y[1]), y1 = geo.Y(d.y[0]);
      if (px >= x0 - 4 && px <= Math.max(x1, x0 + 10) + 4 && py >= y0 - 4 && py <= Math.max(y1, y0 + 10) + 4) {
        const area = (x1 - x0 + 10) * (y1 - y0 + 10);
        if (area < bestArea) { bestArea = area; best = i; }  // prefer the smallest region under the cursor
      }
    });
    if (best !== hover) { hover = best; draw(); }
  });
  cv.addEventListener("pointerleave", () => { hover = -1; draw(); });
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, DATA };
