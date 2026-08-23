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
  // magnetic lens drawn as its two pole pieces flanking the optic axis
  const pole = (cx, y, gap, pw, ph) => {
    box(cx - gap - pw, y - ph / 2, pw, ph);
    box(cx + gap, y - ph / 2, pw, ph);
  };
  // mirrored marginal rays: pts = [[halfWidth, y], ...] along the axis
  const ray = (cx, pts) => {
    g.strokeStyle = C.el; g.lineWidth = 1.4;
    for (const s of [-1, 1]) {
      g.beginPath();
      pts.forEach(([hw, y], i) =>
        i ? g.lineTo(cx + s * hw, y) : g.moveTo(cx + s * hw, y));
      g.stroke();
    }
  };
  return { arrow, label, lens, box, pole, ray };
}

const SCHEMS = {
  xps: { cap: "<b>XPS.</b> Monochromated Al K&alpha; X-rays eject photoelectrons; the transfer lens feeds the hemispherical analyzer, which disperses them in kinetic energy.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const norm = (vx, vy) => { const n = Math.hypot(vx, vy); return [vx / n, vy / n]; };
      const P = [w * 0.44, 200], M = [w * 0.16, 150], S = [46, 56];
      // sample
      box(P[0] - 55, P[1], 110, 9);
      label("sample", P[0] - 52, P[1] + 22);
      // source box tilted along its own beam
      const d1 = norm(M[0] - S[0], M[1] - S[1]);
      g.save(); g.translate(S[0], S[1]); g.rotate(Math.atan2(d1[1], d1[0]));
      box(-26, -10, 52, 20); g.restore();
      label("Al Kα source", 12, 24);
      // monochromator crystal: surface tangent set by the reflection law
      const d2 = norm(P[0] - M[0], P[1] - M[1]);
      const nrm = norm(d1[0] - d2[0], d1[1] - d2[1]);
      g.save(); g.translate(M[0], M[1]); g.rotate(Math.atan2(nrm[0], -nrm[1]));
      box(-26, -4, 52, 8); g.restore();
      label("monochromator", M[0] - 40, M[1] + 26);
      arrow(S[0] + d1[0] * 30, S[1] + d1[1] * 30, M[0] - d1[0] * 12, M[1] - d1[1] * 12, C.acc, 1.6);
      arrow(M[0] + d2[0] * 12, M[1] + d2[1] * 12, P[0] - d2[0] * 14, P[1] - d2[1] * 14, C.acc, 1.6);
      // hemispherical analyzer: entrance and exit slits on the diameter
      const H = [w * 0.68, 96], r1 = w * 0.085, r2 = w * 0.135, rm = (r1 + r2) / 2;
      const E = [H[0] - rm, H[1]], Xt = [H[0] + rm, H[1]];
      // transfer lens along the sample-to-entrance path
      const dpv = norm(E[0] - P[0], E[1] - P[1]);
      g.strokeStyle = C.el; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(P[0] + dpv[0] * 6, P[1] + dpv[1] * 6 - 2);
      g.lineTo(E[0], E[1] + 4); g.stroke();
      for (const f of [0.42, 0.60]) {
        const lx = P[0] + (E[0] - P[0]) * f, ly = P[1] + (E[1] - P[1]) * f;
        g.save(); g.translate(lx, ly); g.rotate(Math.atan2(dpv[1], dpv[0]));
        g.strokeStyle = C.muted; g.lineWidth = 2;
        g.beginPath(); g.moveTo(0, -11); g.lineTo(0, 11); g.stroke(); g.restore();
      }
      label("transfer lens", P[0] + 4, P[1] - 44);
      g.strokeStyle = C.muted; g.lineWidth = 2.5;
      for (const r of [r1, r2]) {
        g.beginPath(); g.arc(H[0], H[1], r, Math.PI, 2 * Math.PI); g.stroke();
      }
      // electron path through the hemispheres, dashed at the mean radius
      g.strokeStyle = C.el; g.lineWidth = 1.4; g.setLineDash([4, 3]);
      g.beginPath(); g.arc(H[0], H[1], rm, Math.PI, 2 * Math.PI); g.stroke();
      g.setLineDash([]);
      arrow(Xt[0], Xt[1] + 2, Xt[0], Xt[1] + 24, C.el, 1.4);
      box(Xt[0] - 16, H[1] + 26, 32, 13);
      label("detector", Xt[0] - 18, H[1] + 54);
      label("hemispherical", H[0] - 42, H[1] - 26);
      label("analyzer", H[0] - 27, H[1] - 10);
      label("photoelectrons", P[0] + 46, P[1] - 14, C.el);
    } },
  sims: { cap: "<b>SIMS.</b> A keV primary ion beam sputters the surface; secondary ions are extracted into a mass spectrometer.",
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
  sem: { cap: "<b>SEM.</b> Two condenser lenses demagnify the source through successive crossovers, the objective focuses the probe, and the scan coils raster it over the sample.",
    draw(g, w, h, C) {
      const { arrow, label, box, pole, ray } = helpers(g, C);
      const cx = w * 0.42;
      box(cx - 14, 10, 28, 16);
      label("electron gun", cx + 34, 22);
      // marginal rays through two crossovers, then the objective focus
      const pts = [[0, 26], [7, 64], [0, 91], [6, 118], [0, 145], [9, 180], [0, 208]];
      ray(cx, pts);
      pole(cx, 64, 15, 15, 11); label("condenser 1", cx + 34, 68);
      pole(cx, 118, 14, 15, 11); label("condenser 2", cx + 34, 122);
      box(cx - 19, 155, 8, 9); box(cx + 11, 155, 8, 9);
      label("scan coils", cx + 34, 163);
      pole(cx, 180, 17, 16, 12); label("objective", cx + 38, 184);
      box(cx - 60, 208, 120, 8);
      label("sample", cx - 58, 232);
      // Everhart-Thornley SE detector, with curved SE trajectories
      box(w * 0.10, 168, 30, 17);
      label("SE detector", w * 0.07, 162);
      g.strokeStyle = C.el; g.lineWidth = 1.2;
      for (const d of [0, 7]) {
        g.beginPath(); g.moveTo(cx - 4 - d, 206);
        g.quadraticCurveTo(cx - 60 - d, 170 + d, w * 0.10 + 32, 177); g.stroke();
      }
      // EDS with a straight X-ray path
      box(w * 0.80, 164, 30, 17);
      label("EDS", w * 0.82, 158);
      arrow(cx + 6, 206, w * 0.80, 176, C.acc, 1.2);
      label("X-rays", w * 0.60, 184, C.acc);
    } },
  stem: { cap: "<b>STEM.</b> The condensers and objective focus a sub-angstrom probe on a thin sample; annular detectors catch the scattered cone and the spectrometer disperses the axial beam.",
    draw(g, w, h, C) {
      const { arrow, label, box, pole, ray } = helpers(g, C);
      const cx = w * 0.40;
      box(cx - 14, 8, 28, 14);
      label("gun + corrector", cx + 32, 18);
      // one crossover, the probe-forming aperture, then the focused probe
      ray(cx, [[0, 22], [8, 52], [0, 76], [7, 96], [11, 124], [0, 152]]);
      pole(cx, 52, 16, 15, 11); label("condenser", cx + 34, 56);
      // aperture: two bars with a gap
      g.fillStyle = C.muted;
      g.fillRect(cx - 26, 94, 16, 4); g.fillRect(cx + 10, 94, 16, 4);
      label("aperture", cx + 34, 100);
      pole(cx, 124, 17, 16, 12); label("objective", cx + 38, 128);
      box(cx - 50, 152, 100, 5, C.metal);
      label("thin sample", cx + 56, 158);
      // transmitted cones: direct beam plus scattering to the annular detector
      g.strokeStyle = C.el; g.lineWidth = 1.3;
      for (const s of [-1, 1]) {
        g.beginPath(); g.moveTo(cx, 152); g.lineTo(cx + s * 11, 196); g.stroke();
        g.globalAlpha = 0.55;
        g.beginPath(); g.moveTo(cx, 152); g.lineTo(cx + s * 31, 196); g.stroke();
        g.globalAlpha = 1;
      }
      box(cx - 40, 196, 18, 8); box(cx + 22, 196, 18, 8);
      label("ADF (annular)", cx + 46, 203);
      label("BF cone", cx - 78, 188, C.el);
      // axial beam into the magnetic prism, bent to the EELS camera
      g.strokeStyle = C.el; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(cx, 196); g.lineTo(cx, 218);
      g.quadraticCurveTo(cx, 234, cx + 26, 234); g.lineTo(w * 0.74, 234); g.stroke();
      g.save(); g.translate(cx + 2, 219); g.rotate(0.5);
      box(-10, -8, 22, 16, C.metal); g.restore();
      label("magnetic prism", cx - 118, 226);
      box(w * 0.74, 227, 34, 13);
      label("EELS camera", w * 0.74 - 4, 222);
    } },
  ellipsometer: { cap: "<b>Spectroscopic ellipsometry.</b> Polarized light reflects near the Brewster angle; the polarization change gives Psi and Delta.",
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
  raman: { cap: "<b>Micro-Raman.</b> The edge filter reflects the laser down through the objective and transmits only the Raman-shifted light up to the spectrograph.",
    draw(g, w, h, C) {
      const { arrow, label, box } = helpers(g, C);
      const cx = w * 0.42, fy = 92, oy = 148, ot = 170, sy = 216;
      // collected light: wide blue cone from the focus, collimated up to the spectrograph
      g.strokeStyle = C.el; g.lineWidth = 1.4;
      for (const s of [-1, 1]) {
        g.beginPath(); g.moveTo(cx, sy); g.lineTo(cx + s * 11, ot);
        g.lineTo(cx + s * 11, 40); g.stroke();
      }
      arrow(cx, 52, cx, 40, C.el, 1.4);
      box(cx - 32, 12, 64, 26);
      label("spectrograph", cx + 40, 30);
      label("Raman-shifted light", cx + 20, 66, C.el);
      // laser: in from the left, folded down by the 45-degree edge filter
      arrow(66, fy, cx - 14, fy, C.acc, 1.8);
      box(14, fy - 10, 46, 20); label("laser", 18, fy + 28);
      g.save(); g.translate(cx, fy); g.rotate(Math.PI / 4);
      box(-19, -3, 38, 6); g.restore();
      label("edge filter (45°)", cx + 26, fy + 22);
      // marginal rays: collimated to the objective, focused to a point on the sample
      g.strokeStyle = C.acc; g.lineWidth = 1.6;
      for (const s of [-1, 1]) {
        g.beginPath(); g.moveTo(cx + s * 5, fy + 8); g.lineTo(cx + s * 5, ot);
        g.lineTo(cx, sy); g.stroke();
      }
      // objective as a trapezoid, exit pupil at ot
      g.strokeStyle = C.muted; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 17, oy); g.lineTo(cx + 17, oy);
      g.lineTo(cx + 13, ot); g.lineTo(cx - 13, ot); g.closePath(); g.stroke();
      label("objective", cx + 26, oy + 14);
      box(cx - 46, sy, 92, 9); label("sample", cx - 44, sy + 22);
      label("focus", cx + 8, sy - 6);
    } },
  afm: { cap: "<b>AFM beam deflection.</b> The laser reflects off the cantilever onto a quadrant photodiode; sub-angstrom bending is measurable.",
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
  ebsd: { cap: "<b>EBSD.</b> The sample is tilted to 70 degrees and backscattered electrons form Kikuchi bands on the phosphor screen.",
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
  fib: { cap: "<b>Dual-beam FIB.</b> The electron column images while the ion column mills; the gas injector writes protective deposits.",
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
  leed: { cap: "<b>LEED.</b> Low-energy electrons backscatter through retarding grids; elastic beams form the spot pattern on the screen.",
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
      muted: isD ? "#8a8784" : "#888", acc: isD ? "rgb(255,63,63)" : "rgb(204,0,0)",
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
