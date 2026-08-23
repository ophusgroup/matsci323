// ewald.js
// AnyWidget: the Ewald construction for surface diffraction. A 2D surface has
// reciprocal-space RODS, so the Ewald circle always intersects something:
// LEED diffracts at every energy, and grazing-incidence RHEED cuts the rods
// at a shallow angle, stretching spots into streaks. Toggling to a 3D crystal
// (points) shows why bulk diffraction needs the angle scanned. Giving the
// rods finite width (finite ordered-domain size) makes the streak mechanism
// visible: the highlighted chords ARE the pattern. Static, redraws on input.
//
//   :::{anywidget} ../../widgets/ewald.js
//   :::

function lambdaE(eV) { // electron wavelength in Angstrom, with rel. correction
  return 12.2643 / Math.sqrt(eV * (1 + 0.978476e-6 * eV));
}

function render({ model, el }) {
  const uid = "ew" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} .w-wrap { display:flex; gap:12px; flex-wrap:wrap; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-plot { flex:1.4 1 340px; min-width:300px; }
.${uid} .w-ctl { width:215px; display:flex; flex-direction:column; gap:8px; font-size:13px;
  color:var(--w-muted); }
.${uid} .w-row { display:flex; gap:5px; }
.${uid} .w-row button { flex:1; border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 6px; cursor:pointer; font-size:13px; }
.${uid} .w-row button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} label { display:flex; flex-direction:column; gap:2px; }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
.${uid} .w-box { background:var(--w-panel); border:1px solid var(--w-border); border-radius:6px;
  padding:6px 8px; line-height:1.55; }
.${uid} .w-box b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-wrap">
  <div class="w-plot"><canvas height="380"></canvas></div>
  <div class="w-ctl">
    <canvas class="w-schem" height="86" style="border-radius:8px"></canvas>
    <div class="w-row"><button class="w-leed on">LEED</button><button class="w-rheed">RHEED</button></div>
    <div class="w-row"><button class="w-rods on">2D surface (rods)</button><button class="w-pts">3D crystal (points)</button></div>
    <label>electron energy <span class="w-val w-ev"></span>
      <input class="w-E" type="range" min="0" max="1" step="0.005" value="0.4"></label>
    <label class="w-angL" style="display:none">grazing angle <span class="w-val w-av"></span>
      <input class="w-a" type="range" min="0.5" max="6" step="0.1" value="2"></label>
    <label>rod width (1/domain size) <span class="w-val w-wv"></span>
      <input class="w-w" type="range" min="0.01" max="0.30" step="0.005" value="0.06"></label>
    <canvas class="w-det" height="150" style="border-radius:8px"></canvas>
    <div class="w-box">
      wavelength <b class="w-lam"></b><br>
      |k| = 2&pi;/&lambda; <b class="w-k"></b><br>
      diffracted beams in view <b class="w-nb"></b>
    </div>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Ewald construction for surface diffraction.</b> Reciprocal rods, the Ewald sphere, and the pattern that lands on the detector.";
  root.appendChild(cap);

  const cv = root.querySelector(".w-plot canvas");
  const scm = root.querySelector(".w-schem");
  const det = root.querySelector(".w-det");
  const bLeed = root.querySelector(".w-leed"), bRheed = root.querySelector(".w-rheed");
  const bRods = root.querySelector(".w-rods"), bPts = root.querySelector(".w-pts");
  const inE = root.querySelector(".w-E"), inA = root.querySelector(".w-a"), inW = root.querySelector(".w-w");
  let mode = "LEED", rods = true;
  const a = 3.0, g = 2 * Math.PI / a;   // surface row spacing 3 A

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const isD = dark();
    const acc = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
    const t = +inE.value;
    const eV = mode === "LEED" ? 20 * Math.pow(500 / 20, t) : 5000 * Math.pow(30000 / 5000, t);
    const lam = lambdaE(eV), k = 2 * Math.PI / lam;
    const thI = mode === "LEED" ? Math.PI / 2 : (+inA.value) * Math.PI / 180; // from surface
    const rodW = +inW.value * g;
    // view: x in [-3.2g, 3.2g], y (out-of-plane q) in [-0.5g, 5.5g]
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 380, h = 380;
    cv.width = w * dpr; cv.height = h * dpr;
    const gr = cv.getContext("2d");
    gr.setTransform(dpr, 0, 0, dpr, 0, 0);
    gr.clearRect(0, 0, w, h);
    const x0 = -3.6 * g, x1 = 3.6 * g, y1 = 6.4 * g, y0 = -0.6 * g;
    const X = q => (q - x0) / (x1 - x0) * w;
    const Y = q => h - (q - y0) / (y1 - y0) * h;
    const S = (x1 - x0) / w;                     // q per px
    // incident direction (down toward surface): d = (cos thI, -sin thI)
    const dx = Math.cos(thI), dy = -Math.sin(thI);
    const C = [-k * dx, -k * dy];                // Ewald center: origin - k_in
    // reciprocal features
    gr.strokeStyle = isD ? "#4a4744" : "#ccc";
    gr.fillStyle = isD ? "#8a8784" : "#999";
    let beams = 0;
    if (rods) {
      for (let n = -3; n <= 3; n++) {
        const px = X(n * g), pw = Math.max(1.5, rodW / S);
        gr.fillStyle = isD ? "rgba(160,160,160,0.25)" : "rgba(0,0,0,0.10)";
        gr.fillRect(px - pw / 2, 0, pw, Y(0) + 12);
        // highlighted chord where the Ewald shell (width = rodW) crosses
        const A2 = k * k, dxr = n * g - C[0];
        if (Math.abs(dxr) < k) {
          // scan y for |dist(circle)| < rodW/2 (accounts for grazing geometry)
          let yLo = null, yHi = null;
          for (let yy = y0; yy < y1; yy += (y1 - y0) / 1200) {
            const d = Math.abs(Math.hypot(dxr, yy - C[1]) - k);
            if (d < rodW / 2) { if (yLo === null) yLo = yy; yHi = yy; }
            else if (yLo !== null && yHi !== null && yy > yHi + 0.2 * g) break;
          }
          if (yLo !== null) {
            beams++;
            gr.strokeStyle = acc; gr.lineWidth = Math.max(3, pw);
            gr.beginPath(); gr.moveTo(px, Y(yLo)); gr.lineTo(px, Y(yHi)); gr.stroke();
          }
        }
      }
    } else {
      for (let n = -3; n <= 3; n++) {
        for (let m2 = 0; m2 <= 6; m2++) {
          const qx = n * g, qy = m2 * g;
          const d = Math.abs(Math.hypot(qx - C[0], qy - C[1]) - k);
          const hit = d < rodW / 2;
          if (hit) beams++;
          gr.fillStyle = hit ? acc : (isD ? "#777" : "#aaa");
          gr.beginPath(); gr.arc(X(qx), Y(qy), hit ? 5 : 3, 0, 6.3); gr.fill();
        }
      }
    }
    // surface line at q_y = 0
    gr.strokeStyle = isD ? "#555" : "#bbb"; gr.lineWidth = 1;
    gr.beginPath(); gr.moveTo(0, Y(0)); gr.lineTo(w, Y(0)); gr.stroke();
    // Ewald circle
    gr.strokeStyle = isD ? "#ddd" : "#333"; gr.lineWidth = 1.4;
    gr.beginPath();
    let started = false;
    for (let i = 0; i <= 1500; i++) {
      const ph = i / 1500 * 2 * Math.PI;
      const qx = C[0] + k * Math.cos(ph), qy = C[1] + k * Math.sin(ph);
      if (qx < x0 || qx > x1 || qy < y0 - g || qy > y1 + g) { started = false; continue; }
      started ? gr.lineTo(X(qx), Y(qy)) : gr.moveTo(X(qx), Y(qy));
      started = true;
    }
    gr.stroke();
    // incident beam arrow: from tail C to origin
    const ox = X(0), oy = Y(0);
    const tx = X(Math.max(x0, C[0])), ty = Y(C[1] < y0 ? 0 : C[1]);
    gr.strokeStyle = acc; gr.lineWidth = 2;
    gr.beginPath();
    if (mode === "LEED") { gr.moveTo(X(0), Y(Math.min(k, y1))); gr.lineTo(ox, oy); }
    else {
      const s0 = Math.min(1, (x0 - C[0]) / (0 - C[0] || 1));
      gr.moveTo(X(C[0] * (1 - Math.max(0, s0))), Y(C[1] * (1 - Math.max(0, s0))));
      gr.lineTo(ox, oy);
    }
    gr.stroke();
    gr.fillStyle = acc; gr.font = "12px system-ui";
    gr.fillText("k_in", (ox + (mode === "LEED" ? X(0) : tx)) / 2 + 6,
      (oy + (mode === "LEED" ? Y(Math.min(k, y1)) : ty)) / 2);
    gr.fillStyle = isD ? "#ccc" : "#444"; gr.font = "12px system-ui";
    gr.fillText("origin", ox + 6, oy + 12);
    gr.fillText(rods ? "reciprocal rods (2D surface)" : "reciprocal points (3D crystal)", 10, 14);
    // ---- real-space schematic ----
    {
      const sw = scm.clientWidth || 215, sh = 86;
      scm.width = sw * dpr; scm.height = sh * dpr;
      const q = scm.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.fillStyle = isD ? "#221f1e" : "#ffffff"; q.fillRect(0, 0, sw, sh);
      q.fillStyle = isD ? "#3d3a38" : "#cfcbc5";
      q.fillRect(sw * 0.2, sh - 16, sw * 0.6, 8);   // sample
      q.strokeStyle = acc; q.lineWidth = 1.6;
      q.font = "11px system-ui";
      if (mode === "LEED") {
        q.beginPath(); q.moveTo(sw / 2, 8); q.lineTo(sw / 2, sh - 18); q.stroke();
        q.strokeStyle = isD ? "#888" : "#999";
        q.beginPath(); q.arc(sw / 2, sh - 14, sw * 0.34, Math.PI * 1.12, Math.PI * 1.88); q.stroke();
        q.setLineDash([3, 3]); q.strokeStyle = acc;
        for (const a of [-0.5, 0.5]) {
          q.beginPath(); q.moveTo(sw / 2, sh - 18);
          q.lineTo(sw / 2 + Math.sin(a) * sw * 0.3, sh - 18 - Math.cos(a) * sw * 0.3); q.stroke();
        }
        q.setLineDash([]);
        q.fillStyle = isD ? "#ccc" : "#444";
        q.fillText("beam", sw / 2 + 4, 16);
        q.fillText("screen", sw * 0.72, 22);
      } else {
        const th = (+inA.value) * Math.PI / 180 * 6;  // exaggerated for visibility
        q.beginPath(); q.moveTo(6, sh - 18 - Math.tan(th) * (sw * 0.44));
        q.lineTo(sw / 2, sh - 18); q.stroke();
        q.setLineDash([3, 3]);
        q.beginPath(); q.moveTo(sw / 2, sh - 18);
        q.lineTo(sw - 24, sh - 18 - Math.tan(th) * (sw * 0.42)); q.stroke();
        q.setLineDash([]);
        q.strokeStyle = isD ? "#888" : "#999"; q.lineWidth = 3;
        q.beginPath(); q.moveTo(sw - 14, 8); q.lineTo(sw - 14, sh - 10); q.stroke();
        q.fillStyle = isD ? "#ccc" : "#444";
        q.fillText("grazing beam", 8, sh - 34 - Math.tan(th) * sw * 0.3);
        q.fillText("screen", sw - 58, 14);
      }
    }
    // ---- detector view ----
    {
      const dw = det.clientWidth || 215, dh = 150;
      det.width = dw * dpr; det.height = dh * dpr;
      const q = det.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.fillStyle = "#0a0a0c"; q.fillRect(0, 0, dw, dh);
      q.font = "11px system-ui";
      if (!rods) {
        q.fillStyle = "#777";
        q.fillText("3D crystal: (almost) nothing", 12, dh / 2 - 4);
        q.fillText("hits the detector", 12, dh / 2 + 12);
      } else if (mode === "LEED") {
        // spots at (n,m) g/k projected on the circular screen
        const R = Math.min(dw, dh) * 0.44, cx = dw / 2, cy = dh / 2;
        q.strokeStyle = "#333";
        q.beginPath(); q.arc(cx, cy, R, 0, 6.3); q.stroke();
        const sr = Math.max(1.6, 5 * (+inW.value) / 0.3);
        for (let n2 = -4; n2 <= 4; n2++) {
          for (let m2 = -4; m2 <= 4; m2++) {
            const sx = n2 * g / k, sy = m2 * g / k;
            if (sx * sx + sy * sy >= 0.92) continue;
            q.fillStyle = n2 === 0 && m2 === 0 ? "#fff" : (isD ? "rgb(240,170,190)" : "rgb(230,120,140)");
            q.beginPath(); q.arc(cx + sx * R, cy - sy * R, sr, 0, 6.3); q.fill();
          }
        }
        q.fillStyle = "#888"; q.fillText("LEED screen", 8, 14);
      } else {
        // RHEED: streaks on the zeroth Laue circle + shadow edge
        const shadow = dh * 0.72;
        q.fillStyle = "#161618"; q.fillRect(0, shadow, dw, dh - shadow);
        q.strokeStyle = "#333";
        q.beginPath(); q.moveTo(0, shadow); q.lineTo(dw, shadow); q.stroke();
        const thI2 = (+inA.value) * Math.PI / 180;
        const spec = shadow - Math.tan(2 * thI2) * dh * 1.4;   // specular height
        const sr = Math.max(2, 5 * (+inW.value) / 0.3);
        for (let n2 = -3; n2 <= 3; n2++) {
          const sx = dw / 2 + n2 * (g / k) * dw * 14;
          if (sx < 4 || sx > dw - 4) continue;
          // streak length grows toward the specular row (grazing chord)
          const len = 12 + 46 * Math.exp(-Math.abs(n2) * 0.35) * ((+inW.value) / 0.1);
          const cyS = spec - n2 * n2 * 3;
          const grd = q.createLinearGradient(0, cyS - len / 2, 0, cyS + len / 2);
          grd.addColorStop(0, "rgba(230,120,140,0)");
          grd.addColorStop(0.5, "rgba(240,170,190,0.95)");
          grd.addColorStop(1, "rgba(230,120,140,0)");
          q.fillStyle = grd;
          q.fillRect(sx - sr / 2, cyS - len / 2, sr, len);
        }
        q.fillStyle = "#888"; q.fillText("RHEED screen", 8, 14);
        q.fillText("shadow edge", 8, shadow + 14);
      }
    }
    root.querySelector(".w-ev").textContent = eV >= 1000 ? (eV / 1000).toFixed(1) + " keV" : eV.toFixed(0) + " eV";
    root.querySelector(".w-av").textContent = (+inA.value).toFixed(1) + "°";
    root.querySelector(".w-wv").textContent = (+inW.value).toFixed(2) + " g";
    root.querySelector(".w-lam").textContent = lam.toFixed(3) + " Å";
    root.querySelector(".w-k").textContent = k.toFixed(1) + " Å⁻¹";
    root.querySelector(".w-nb").textContent = beams;
  }
  function setMode(m2) {
    mode = m2;
    bLeed.classList.toggle("on", m2 === "LEED");
    bRheed.classList.toggle("on", m2 === "RHEED");
    root.querySelector(".w-angL").style.display = m2 === "RHEED" ? "" : "none";
    draw();
  }
  bLeed.addEventListener("click", () => setMode("LEED"));
  bRheed.addEventListener("click", () => setMode("RHEED"));
  bRods.addEventListener("click", () => { rods = true; bRods.classList.add("on"); bPts.classList.remove("on"); draw(); });
  bPts.addEventListener("click", () => { rods = false; bPts.classList.add("on"); bRods.classList.remove("on"); draw(); });
  for (const i of [inE, inA, inW]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, lambdaE };
