// technique-map.js
// AnyWidget: the course's techniques on one chart, lateral resolution against
// the depth sampled per measurement, colored by probe family. Hover for the
// question each technique answers best. The values are representative orders
// of magnitude, matching the master table on this page. Static, hover only.
//
//   :::{anywidget} ../../widgets/technique-map.js
//   :::

// lateral resolution (m), depth sampled (m)
const DATA = [
  { n: "XRD/GIXRD", x: 2e-3, y: 1e-6, f: "photons", q: "phases, texture, strain" },
  { n: "XRR", x: 2e-3, y: 2e-7, f: "photons", q: "thickness, density, roughness" },
  { n: "Ellipsometry", x: 3e-5, y: 5e-7, f: "photons", q: "thickness and optical constants" },
  { n: "Raman", x: 5e-7, y: 5e-7, f: "photons", q: "phase, strain, disorder" },
  { n: "RBS", x: 1e-3, y: 2e-6, f: "ions", q: "absolute composition vs depth" },
  { n: "SIMS", x: 2e-7, y: 2e-9, f: "ions", q: "trace impurities, ppb" },
  { n: "LEIS", x: 2e-3, y: 2.5e-10, f: "ions", q: "the outermost atomic layer" },
  { n: "APT", x: 5e-10, y: 3e-10, f: "ions", q: "3D composition, atom by atom" },
  { n: "XPS", x: 3e-5, y: 6e-9, f: "electron spectroscopy", q: "surface chemistry, oxidation states" },
  { n: "AES", x: 1e-8, y: 6e-9, f: "electron spectroscopy", q: "small-feature surface composition" },
  { n: "SEM", x: 1e-9, y: 5e-9, f: "microscopy", q: "morphology" },
  { n: "EDS (SEM)", x: 1e-6, y: 1e-6, f: "microscopy", q: "micron-scale composition" },
  { n: "EBSD", x: 3e-8, y: 3e-8, f: "microscopy", q: "grain orientations" },
  { n: "STEM", x: 1e-10, y: 5e-8, f: "microscopy", q: "direct interface imaging" },
  { n: "STEM-EELS", x: 2e-10, y: 5e-8, f: "microscopy", q: "bonding maps at atomic scale" },
  { n: "LEED", x: 1e-3, y: 1e-9, f: "diffraction", q: "surface order and reconstruction" },
  { n: "RHEED", x: 1e-3, y: 1e-9, f: "diffraction", q: "growth monitoring, live" },
  { n: "AFM", x: 3e-9, y: 3e-10, f: "scanning probe", q: "topography and roughness" },
  { n: "STM", x: 1e-10, y: 1e-10, f: "scanning probe", q: "atomic and electronic structure" },
  { n: "KPFM", x: 3e-8, y: 1e-9, f: "scanning probe", q: "work function maps" },
];
const FAMS = {
  "photons": "#c98f00", "ions": "#b03030", "electron spectroscopy": "#3a7abd",
  "microscopy": "#3f8f5f", "diffraction": "#8a5fbd", "scanning probe": "#c25e8a",
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
.${uid} .w-legend { display:flex; gap:12px; flex-wrap:wrap; margin-top:6px; font-size:12px;
  color:var(--w-muted); }
.${uid} .w-legend span::before { content:"●"; margin-right:3px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `<canvas height="420"></canvas><div class="w-legend"></div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>The technique landscape.</b> Lateral resolution against depth sampled per measurement; hover a point for what that tool answers best.";
  root.appendChild(cap);
  const cv = root.querySelector("canvas");
  const leg = root.querySelector(".w-legend");
  for (const [f, c] of Object.entries(FAMS)) {
    const s = document.createElement("span");
    s.textContent = f; s.style.color = c;
    leg.appendChild(s);
  }
  let hover = -1;
  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const lx0 = -10.5, lx1 = -2.3, ly0 = -10.1, ly1 = -5.5;
  let geom = null;
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 500, h = 420;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const isD = dark();
    const mL = 52, mR = 14, mT = 14, mB = 44;
    const X = v => mL + (Math.log10(v) - lx0) / (lx1 - lx0) * (w - mL - mR);
    const Y = v => h - mB - (Math.log10(v) - ly0) / (ly1 - ly0) * (h - mT - mB);
    geom = { X, Y };
    g.strokeStyle = isD ? "#333" : "#eee"; g.fillStyle = isD ? "#999" : "#777";
    g.font = "12px system-ui";
    const xticks = [[1e-10, "1 Å"], [1e-9, "1 nm"], [1e-8, "10 nm"], [1e-7, "100 nm"],
      [1e-6, "1 µm"], [1e-5, "10 µm"], [1e-4, "0.1 mm"], [1e-3, "1 mm"]];
    for (const [v, lab] of xticks) {
      g.beginPath(); g.moveTo(X(v), mT); g.lineTo(X(v), h - mB); g.stroke();
      g.fillText(lab, X(v) - 12, h - mB + 14);
    }
    const yticks = [[1e-10, "1 Å"], [1e-9, "1 nm"], [1e-8, "10 nm"], [1e-7, "100 nm"], [1e-6, "1 µm"]];
    for (const [v, lab] of yticks) {
      g.beginPath(); g.moveTo(mL, Y(v)); g.lineTo(w - mR, Y(v)); g.stroke();
      g.fillText(lab, 8, Y(v) + 3);
    }
    g.fillText("lateral resolution", mL + (w - mL) / 2 - 40, h - 8);
    g.save(); g.translate(12, h / 2 + 50); g.rotate(-Math.PI / 2);
    g.fillText("depth sampled per measurement", 0, 0); g.restore();
    // points
    DATA.forEach((d, i) => {
      const c = FAMS[d.f];
      g.fillStyle = c;
      g.beginPath(); g.arc(X(d.x), Y(d.y), i === hover ? 8 : 5.5, 0, 6.3); g.fill();
      if (i !== hover) {
        g.fillStyle = isD ? "#ddd" : "#333"; g.font = "12px system-ui";
        g.fillText(d.n, X(d.x) + 7, Y(d.y) - 4);
      }
    });
    if (hover >= 0) {
      const d = DATA[hover];
      const tx = Math.min(X(d.x) + 12, w - 210), ty = Math.max(Y(d.y) - 14, 40);
      g.fillStyle = isD ? "rgba(20,18,17,0.95)" : "rgba(255,255,255,0.96)";
      g.strokeStyle = FAMS[d.f];
      const bw = 200, bh = 42;
      g.beginPath(); g.roundRect(tx, ty - 30, bw, bh, 6); g.fill(); g.stroke();
      g.fillStyle = isD ? "#eee" : "#111"; g.font = "bold 12px system-ui";
      g.fillText(d.n, tx + 8, ty - 13);
      g.font = "12px system-ui"; g.fillStyle = isD ? "#bbb" : "#444";
      g.fillText(d.q, tx + 8, ty + 2);
    }
  }
  cv.addEventListener("pointermove", ev => {
    if (!geom) return;
    const r = cv.getBoundingClientRect();
    const px = ev.clientX - r.left, py = ev.clientY - r.top;
    let best = -1, bd = 20 * 20;
    DATA.forEach((d, i) => {
      const dd = (geom.X(d.x) - px) ** 2 + (geom.Y(d.y) - py) ** 2;
      if (dd < bd) { bd = dd; best = i; }
    });
    if (best !== hover) { hover = best; draw(); }
  });
  cv.addEventListener("pointerleave", () => { hover = -1; draw(); });
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, DATA };
