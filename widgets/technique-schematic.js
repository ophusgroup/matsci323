// technique-schematic.js
// AnyWidget: static instrument schematics, one module for the whole course.
// Embed with a JSON config naming the schematic:
//   :::{anywidget} ../../widgets/technique-schematic.js
//   { "name": "xps" }
//   :::
// Names: xps, sims, sem, stem, ellipsometer, raman, afm, ebsd, fib, leed.
// Theme-aware, no controls; each drawing carries its own one-line caption.

function helpers(g, C) {
  const arrow = (x0, y0, x1, y1, col, lw) => {
    g.strokeStyle = col || C.acc; g.lineWidth = lw || 2;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
    g.moveTo(x1, y1);
    g.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4));
    g.stroke();
  };
  const label = (t, x, y, col) => {
    g.fillStyle = col || C.fg; g.font = "12.5px system-ui"; g.fillText(t, x, y);
  };
  const lens = (x, y, w2) => {
    g.strokeStyle = C.muted; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x - w2, y - 4); g.quadraticCurveTo(x, y + 7, x + w2, y - 4); g.stroke();
    g.beginPath(); g.moveTo(x - w2, y + 4); g.quadraticCurveTo(x, y - 7, x + w2, y + 4); g.stroke();
  };
  const box = (x, y, w2, h2, fill) => {
    g.fillStyle = fill || C.metal;
    g.fillRect(x, y, w2, h2);
    g.strokeStyle = C.muted; g.lineWidth = 1; g.strokeRect(x, y, w2, h2);
  };
  return { arrow, label, lens, box };
}

const SCHEMS = {
  xps: { cap: "XPS: monochromated X-rays eject photoelectrons; a hemispherical analyzer disperses them by kinetic energy.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const sx = w * 0.42, sy = h * 0.76;
      box(sx - 40, sy, 80, 10);
      label("sample", sx - 24, sy + 24);
      box(20, h * 0.30, 56, 26);
      label("X-ray source", 12, h * 0.30 - 8);
      // monochromator crystal
      g.save(); g.translate(w * 0.22, h * 0.62); g.rotate(-0.5);
      box(-22, -5, 44, 8); g.restore();
      label("monochromator", 8, h * 0.62 + 26);
      arrow(76, h * 0.36, w * 0.20, h * 0.58, C.acc, 1.6);
      arrow(w * 0.245, h * 0.60, sx - 4, sy - 2, C.acc, 1.6);
      // electron lens column up to hemispheres
      arrow(sx + 8, sy - 6, sx + w * 0.16, sy - h * 0.34, C.el, 1.8);
      label("photoelectrons", sx + 16, sy - 20);
      const cxh = sx + w * 0.22, cyh = h * 0.34;
      g.strokeStyle = C.muted; g.lineWidth = 2.5;
      for (const r of [w * 0.10, w * 0.155]) {
        g.beginPath(); g.arc(cxh, cyh, r, Math.PI * 0.95, Math.PI * 1.85); g.stroke();
      }
      label("hemispherical analyzer", cxh - w * 0.14, cyh - w * 0.165);
      box(cxh + w * 0.09, cyh + 6, 34, 12);
      label("detector", cxh + w * 0.09, cyh + 34);
    } },
  sims: { cap: "SIMS: a keV primary ion beam sputters the surface; secondary ions are extracted into a mass spectrometer.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const sx = w * 0.45, sy = h * 0.78;
      box(sx - 60, sy, 120, 10);
      label("sample", sx - 20, sy + 24);
      box(30, 24, 72, 24);
      label("primary ion gun", 22, 18);
      arrow(96, 50, sx - 8, sy - 2, C.acc, 2);
      label("O₂⁺ or Cs⁺", 96, h * 0.42);
      // secondary ions up into extraction + analyzer
      for (const dx of [-6, 4, 14]) arrow(sx + dx, sy - 4, sx + dx + 8, sy - 40, C.el, 1.3);
      box(sx - 10, sy - 78, 60, 24);
      label("extraction", sx - 6, sy - 84);
      box(sx + 62, sy - 130, 96, 30);
      label("mass analyzer", sx + 64, sy - 136);
      label("(quadrupole / sector / ToF)", sx + 40, sy - 96);
      arrow(sx + 40, sy - 66, sx + 70, sy - 112, C.el, 1.6);
      box(w - 62, 30, 34, 14);
      label("detector", w - 70, 24);
      arrow(sx + 152, sy - 118, w - 50, 48, C.el, 1.6);
    } },
  sem: { cap: "SEM: a demagnified electron probe is scanned over the sample; detectors collect secondary and backscattered electrons.",
    draw(g, w, h, C) {
      const { arrow, label, lens, box } = helpers(g, C);
      const cx = w * 0.44;
      box(cx - 16, 12, 32, 16);
      label("electron gun", cx + 24, 24);
      g.strokeStyle = C.el; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(cx, 30); g.lineTo(cx, h * 0.74); g.stroke();
      lens(cx, h * 0.24, 26); label("condenser", cx + 34, h * 0.24 + 4);
      lens(cx, h * 0.40, 26); label("condenser", cx + 34, h * 0.40 + 4);
      // scan coils
      box(cx - 30, h * 0.50, 12, 10); box(cx + 18, h * 0.50, 12, 10);
      label("scan coils", cx + 36, h * 0.52 + 6);
      lens(cx, h * 0.62, 30); label("objective", cx + 38, h * 0.62 + 4);
      box(cx - 55, h * 0.76, 110, 9);
      label("sample", cx - 20, h * 0.76 + 24);
      // ET detector
      box(w * 0.10, h * 0.56, 26, 18);
      label("SE detector", w * 0.05, h * 0.56 - 6);
      arrow(cx - 8, h * 0.74, w * 0.10 + 26, h * 0.62, C.el, 1.2);
      // EDS
      box(w * 0.78, h * 0.52, 30, 16);
      label("EDS", w * 0.80, h * 0.50 - 2);
      arrow(cx + 10, h * 0.74, w * 0.78, h * 0.60, C.acc, 1.2);
      label("X-rays", cx + 40, h * 0.70);
    } },
  stem: { cap: "STEM: a sub-angstrom probe scans a thin sample; annular detectors and the EELS spectrometer collect the transmitted signals.",
    draw(g, w, h, C) {
      const { arrow, label, lens, box } = helpers(g, C);
      const cx = w * 0.46;
      box(cx - 14, 10, 28, 14);
      label("gun + corrector", cx + 22, 22);
      g.strokeStyle = C.el; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(cx, 26); g.lineTo(cx, h * 0.42); g.stroke();
      lens(cx, h * 0.22, 24);
      // converging onto thin sample
      g.beginPath(); g.moveTo(cx - 14, h * 0.30); g.lineTo(cx, h * 0.44); g.lineTo(cx + 14, h * 0.30); g.stroke();
      box(cx - 46, h * 0.44, 92, 5, C.metal);
      label("thin sample", cx + 52, h * 0.45 + 5);
      // transmitted cone to detectors
      g.beginPath(); g.moveTo(cx, h * 0.45); g.lineTo(cx - 22, h * 0.66); g.moveTo(cx, h * 0.45); g.lineTo(cx + 22, h * 0.66); g.stroke();
      box(cx - 52, h * 0.66, 26, 8); box(cx + 26, h * 0.66, 26, 8);
      label("HAADF (annular)", cx + 56, h * 0.66 + 8);
      box(cx - 12, h * 0.70, 24, 8);
      label("BF", cx - 42, h * 0.70 + 8);
      // EELS prism
      g.strokeStyle = C.el;
      g.beginPath(); g.moveTo(cx, h * 0.70); g.lineTo(cx, h * 0.80); g.quadraticCurveTo(cx, h * 0.90, cx + 30, h * 0.90); g.lineTo(w * 0.80, h * 0.90); g.stroke();
      box(cx + 8, h * 0.78, 22, 16, C.metal);
      label("magnetic prism", cx + 34, h * 0.80);
      box(w * 0.80, h * 0.84, 34, 12);
      label("EELS spectrum", w * 0.72, h * 0.82);
    } },
  ellipsometer: { cap: "Spectroscopic ellipsometry: polarized light reflects near the Brewster angle; the polarization change gives Psi and Delta.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const sx = w / 2, sy = h * 0.72;
      box(sx - 60, sy, 120, 10);
      label("film on substrate", sx - 48, sy + 24);
      box(16, h * 0.16, 44, 20); label("source", 20, h * 0.14);
      // polarizer / compensator discs
      const disc = (x, y, t) => {
        g.strokeStyle = C.muted; g.lineWidth = 2;
        g.beginPath(); g.ellipse(x, y, 7, 14, t, 0, 6.3); g.stroke();
      };
      arrow(60, h * 0.22, sx - 4, sy - 3, C.acc, 1.8);
      arrow(sx + 4, sy - 3, w - 60, h * 0.22, C.acc, 1.8);
      disc(w * 0.24, h * 0.38, -0.5); label("polarizer", w * 0.24 - 28, h * 0.38 - 20);
      disc(w * 0.33, h * 0.475, -0.5); label("compensator", w * 0.33 - 20, h * 0.475 + 28);
      disc(w * 0.72, h * 0.42, 0.5); label("analyzer", w * 0.72 - 12, h * 0.42 - 20);
      box(w - 60, h * 0.14, 44, 20); label("detector", w - 60, h * 0.12);
      label("~70°", sx - 12, sy - 14);
    } },
  raman: { cap: "Micro-Raman: a laser is focused through the objective; the edge filter passes only the Raman-shifted light to the spectrograph.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const cx = w * 0.40;
      box(16, 24, 52, 20); label("laser", 24, 18);
      // beamsplitter / edge filter at 45 deg
      g.save(); g.translate(cx, 34); g.rotate(Math.PI / 4);
      box(-20, -3, 40, 6); g.restore();
      label("edge filter", cx + 20, 28);
      arrow(68, 34, cx - 8, 34, C.acc, 1.8);
      arrow(cx, 42, cx, h * 0.52, C.acc, 1.8);
      // objective
      g.strokeStyle = C.muted; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 16, h * 0.54); g.lineTo(cx + 16, h * 0.54);
      g.lineTo(cx + 8, h * 0.64); g.lineTo(cx - 8, h * 0.64); g.closePath(); g.stroke();
      label("objective", cx + 24, h * 0.60);
      box(cx - 44, h * 0.78, 88, 9); label("sample", cx - 20, h * 0.78 + 22);
      arrow(cx - 4, h * 0.76, cx - 4, 44, C.el, 1.4);
      // to spectrograph
      arrow(cx + 6, 30, w * 0.74, 30, C.el, 1.6);
      box(w * 0.74, 18, 60, 26); label("spectrograph", w * 0.72, 14);
      label("(scattered, shifted light)", cx + 30, 52);
    } },
  afm: { cap: "AFM beam deflection: the laser reflects off the cantilever onto a quadrant photodiode; sub-angstrom bending is measurable.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const cy = h * 0.55;
      // cantilever + tip
      g.strokeStyle = C.fg; g.lineWidth = 4;
      g.beginPath(); g.moveTo(w * 0.30, cy); g.lineTo(w * 0.58, cy + 6); g.stroke();
      g.fillStyle = C.fg;
      g.beginPath(); g.moveTo(w * 0.55, cy + 8); g.lineTo(w * 0.53, cy + 24); g.lineTo(w * 0.57, cy + 8);
      g.closePath(); g.fill();
      box(w * 0.24, cy - 8, 24, 16);
      label("cantilever", w * 0.30, cy - 14);
      // sample on piezo
      box(w * 0.30, cy + 30, w * 0.40, 9);
      label("sample", w * 0.46, cy + 54);
      box(w * 0.34, cy + 39, w * 0.32, 14, C.metal);
      label("xyz piezo scanner", w * 0.34, cy + 68);
      // laser and photodiode
      box(16, 20, 44, 18); label("laser", 22, 16);
      arrow(60, 34, w * 0.55, cy + 2, C.acc, 1.6);
      arrow(w * 0.55, cy + 2, w * 0.80, 40, C.acc, 1.6);
      // quadrant photodiode
      const qx = w * 0.80, qy = 26;
      box(qx, qy, 30, 30, C.panel);
      g.strokeStyle = C.muted;
      g.beginPath(); g.moveTo(qx + 15, qy); g.lineTo(qx + 15, qy + 30);
      g.moveTo(qx, qy + 15); g.lineTo(qx + 30, qy + 15); g.stroke();
      label("quadrant photodiode", qx - 66, qy - 8);
    } },
  ebsd: { cap: "EBSD: the sample is tilted to 70 degrees and backscattered electrons form Kikuchi bands on the phosphor screen.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const cx = w * 0.36, cy = h * 0.55;
      // beam
      arrow(cx, 16, cx, cy - 12, C.el, 1.8);
      label("electron beam", cx + 10, 26);
      // tilted sample
      g.save(); g.translate(cx, cy); g.rotate(-70 * Math.PI / 180);
      box(-46, 0, 92, 9); g.restore();
      label("sample, 70° tilt", cx - 100, cy + 30);
      // pattern rays to screen
      for (const dy of [-30, 0, 30])
        arrow(cx + 6, cy - 6, w * 0.72, cy - 10 + dy, C.el, 1.1);
      // phosphor screen with bands
      box(w * 0.72, cy - 62, 12, 116, C.panel);
      g.strokeStyle = C.acc; g.lineWidth = 3;
      for (const dy of [-34, -6, 26]) {
        g.beginPath(); g.moveTo(w * 0.72, cy + dy); g.lineTo(w * 0.72 + 12, cy + dy - 10); g.stroke();
      }
      label("phosphor screen", w * 0.66, cy - 72);
      box(w * 0.86, cy - 20, 30, 40, C.metal);
      label("camera", w * 0.86, cy - 28);
    } },
  fib: { cap: "Dual-beam FIB: the electron column images while the ion column mills; the gas injector writes protective deposits.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const sx = w * 0.5, sy = h * 0.74;
      box(sx - 60, sy, 120, 10);
      label("sample", sx - 20, sy + 24);
      // electron column, vertical
      box(sx - 14, 12, 28, 30);
      label("e⁻ column", sx - 74, 30);
      arrow(sx, 44, sx, sy - 4, C.el, 1.6);
      // ion column at 52 degrees
      g.save(); g.translate(sx + Math.sin(0.91) * 150, sy - Math.cos(0.91) * 150);
      g.rotate(0.91);
      box(-14, -30, 28, 30); g.restore();
      label("Ga⁺ column (52°)", w * 0.72, 60);
      arrow(sx + Math.sin(0.91) * 140, sy - Math.cos(0.91) * 140, sx + 4, sy - 4, C.acc, 1.8);
      // GIS needle
      g.strokeStyle = C.muted; g.lineWidth = 3;
      g.beginPath(); g.moveTo(w * 0.12, sy - 60); g.lineTo(sx - 30, sy - 12); g.stroke();
      label("gas injector", w * 0.10, sy - 68);
      // milled trench
      g.fillStyle = C.bg;
      g.fillRect(sx - 6, sy, 22, 6);
      label("milled cross-section", sx + 20, sy - 12);
    } },
  leed: { cap: "LEED: low-energy electrons backscatter through retarding grids; elastic beams form the spot pattern on the screen.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const sx = w * 0.78, sy = h * 0.52;
      g.save(); g.translate(sx, sy); g.rotate(Math.PI / 2);
      box(-46, 0, 92, 9); g.restore();
      label("sample", sx + 12, sy + 4);
      // gun through the center
      box(w * 0.30, sy - 10, 60, 20, C.metal);
      label("electron gun", w * 0.28, sy - 18);
      arrow(w * 0.30 + 60, sy, sx - 8, sy, C.el, 1.6);
      // hemispherical grids + screen (arcs centered on sample)
      for (const [r, lw] of [[w * 0.30, 1.5], [w * 0.33, 1.5], [w * 0.36, 1.5]]) {
        g.strokeStyle = C.muted; g.lineWidth = lw;
        g.beginPath(); g.arc(sx, sy, r, Math.PI * 0.62, Math.PI * 1.38); g.stroke();
      }
      g.strokeStyle = C.acc; g.lineWidth = 3;
      g.beginPath(); g.arc(sx, sy, w * 0.40, Math.PI * 0.66, Math.PI * 1.34); g.stroke();
      label("retarding grids", w * 0.20, sy - w * 0.30);
      label("phosphor screen", w * 0.12, sy + w * 0.36);
      // diffracted beams
      for (const a of [-0.5, -0.2, 0.2, 0.5])
        arrow(sx - 10, sy, sx - Math.cos(a) * w * 0.38, sy - Math.sin(a) * w * 0.38, C.el, 1.1);
    } },
};

function render({ model, el }) {
  const name = (model && typeof model.get === "function" && model.get("name")) || "xps";
  const sch = SCHEMS[name] || SCHEMS.xps;
  const uid = "ts" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { display:block; margin-bottom:30px; font-family:system-ui,sans-serif; }
.${uid} canvas { border:1px solid var(--ts-border,#d8d5d0); border-radius:8px; display:block;
  width:100%; max-width:640px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `<canvas height="250"></canvas>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:8px 2px 0 2px; font-size:13.5px; line-height:1.5; max-width:640px;";
  root.appendChild(cap);
  const cv = root.querySelector("canvas");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function draw() {
    const isD = dark();
    const C = {
      bg: isD ? "#221f1e" : "#ffffff", fg: isD ? "#e8e6e3" : "#222",
      muted: isD ? "#8a8784" : "#888", acc: isD ? "rgb(240,122,158)" : "rgb(204,0,0)",
      el: isD ? "#7aa2e8" : "#3a62b8", metal: isD ? "#3d3a38" : "#cfcbc5",
      panel: isD ? "#2c2927" : "#f2efe9",
    };
    root.style.setProperty("--ts-border", isD ? "#3a3735" : "#d8d5d0");
    cap.style.color = isD ? "#999" : "#777";
    cap.innerHTML = sch.cap;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.min(cv.clientWidth || 500, 640), h = 250;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    sch.draw(g, w, h, C);
  }
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  new ResizeObserver(draw).observe(cv);
  draw();
  return () => obs.disconnect();
}

export default { render, SCHEMS };
