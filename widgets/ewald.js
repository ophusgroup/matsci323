// ewald.js
// AnyWidget: the Ewald construction for surface diffraction. Left: real-space
// specimen and beam geometry. Middle: reciprocal space with the Ewald sphere
// (drawn with equal axis scaling, so it is a circle) crossing the reciprocal
// rods; a thickness slider morphs the rods continuously from the infinite rods
// of a monolayer, through finite rel-rod segments, to the points of a bulk
// crystal. Right: the resulting pattern on the detector. LEED and RHEED modes.
//
//   :::{anywidget} ../../widgets/ewald.js
//   :::

function lambdaE(eV) { // electron wavelength in Angstrom, relativistic
  return 12.2643 / Math.sqrt(eV * (1 + 0.978476e-6 * eV));
}

function render({ model, el }) {
  const uid = "ew" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-top { display:flex; gap:6px; margin-bottom:8px; align-items:center;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-top button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 12px; cursor:pointer; font-size:13px; }
.${uid} .w-top button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-col { flex:1 1 200px; min-width:190px; display:flex; flex-direction:column; gap:6px; }
.${uid} .w-col.w-mid { flex:1.3 1 240px; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} label { font-size:13px; color:var(--w-muted); display:flex; flex-direction:column; gap:2px; }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-top">
  <button class="w-leed on">LEED</button><button class="w-rheed">RHEED</button>
  <label class="w-angL" style="display:none; flex-direction:row; align-items:center; gap:6px">
    grazing angle <input class="w-a" type="range" min="0.5" max="6" step="0.1" value="2" style="width:90px">
    <span class="w-val w-av"></span></label>
</div>
<div class="w-row">
  <div class="w-col">
    <canvas class="w-schem" height="300"></canvas>
    <label>film thickness <span class="w-val w-nv"></span>
      <input class="w-N" type="range" min="1" max="40" step="1" value="1"></label>
  </div>
  <div class="w-col w-mid">
    <canvas class="w-ewald" height="300"></canvas>
    <label>electron energy <span class="w-val w-ev"></span>
      <input class="w-E" type="range" min="0" max="1" step="0.005" value="0.5"></label>
  </div>
  <div class="w-col">
    <canvas class="w-det" height="300"></canvas>
    <label>rod width (1 / domain size) <span class="w-val w-wv"></span>
      <input class="w-w" type="range" min="0.01" max="0.30" step="0.005" value="0.06"></label>
  </div>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Ewald construction.</b> Reciprocal rods, the Ewald sphere, and the resulting detector pattern.";
  root.appendChild(cap);

  const scm = root.querySelector(".w-schem");
  const cv = root.querySelector(".w-ewald");
  const det = root.querySelector(".w-det");
  const bLeed = root.querySelector(".w-leed"), bRheed = root.querySelector(".w-rheed");
  const inE = root.querySelector(".w-E"), inA = root.querySelector(".w-a");
  const inW = root.querySelector(".w-w"), inN = root.querySelector(".w-N");
  let mode = "LEED";
  const a = 3.0, g = 2 * Math.PI / a;    // in-plane row spacing and its rod spacing
  const gz = g;                          // interlayer spacing taken equal to a

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function draw() {
    const isD = dark();
    const acc = isD ? "rgb(255,63,63)" : "rgb(204,0,0)";
    const dpr = window.devicePixelRatio || 1;
    const t = +inE.value;
    const eV = mode === "LEED" ? 20 * Math.pow(500 / 20, t) : 5000 * Math.pow(30000 / 5000, t);
    const lam = lambdaE(eV), k = 2 * Math.PI / lam;
    const thI = mode === "LEED" ? Math.PI / 2 : (+inA.value) * Math.PI / 180;
    const rodW = +inW.value * g;
    const N = +inN.value;
    // rel-rod half-length: infinite for a monolayer, ~pi/(N c) for N layers
    const segHalf = N === 1 ? 1e9 : Math.PI / (N * a) * 2;   // in q units
    const inSeg = qy => N === 1 ? true :
      Math.abs(qy - gz * Math.round(qy / gz)) < segHalf;

    // ---------- middle: Ewald construction, equal axis scaling ----------
    {
      const w = cv.clientWidth || 260, h = 300;
      cv.width = w * dpr; cv.height = h * dpr;
      const gr = cv.getContext("2d");
      gr.setTransform(dpr, 0, 0, dpr, 0, 0);
      gr.clearRect(0, 0, w, h);
      const x0 = -3.6 * g, x1 = 3.6 * g;
      const S = (x1 - x0) / w;                 // q per px, SAME in x and y
      const y0 = -0.8 * g, y1 = y0 + h * S;
      const X = q => (q - x0) / S;
      const Y = q => h - (q - y0) / S;
      // rods / segments
      let beams = 0;
      for (let n = -3; n <= 3; n++) {
        const px = X(n * g), pw = Math.max(1.5, rodW / S);
        gr.fillStyle = isD ? "rgba(160,160,160,0.25)" : "rgba(0,0,0,0.10)";
        if (N === 1) {
          gr.fillRect(px - pw / 2, 0, pw, Y(0));
        } else {
          for (let m = 0; m * gz < y1 + gz; m++) {
            const cyq = m * gz;
            gr.fillRect(px - pw / 2, Y(Math.min(y1, cyq + segHalf)), pw,
              (2 * Math.min(segHalf, gz / 2)) / S);
          }
        }
        // highlighted chord where the Ewald shell crosses a populated rod
        const C = [-k * Math.cos(thI), k * Math.sin(thI)];
        const dxr = n * g - C[0];
        if (Math.abs(dxr) < k) {
          let yLo = null, yHi = null;
          for (let yy = Math.max(y0, 0); yy < y1; yy += (y1 - y0) / 1400) {
            const d = Math.abs(Math.hypot(dxr, yy - C[1]) - k);
            if (d < rodW / 2 && inSeg(yy)) { if (yLo === null) yLo = yy; yHi = yy; }
            else if (yLo !== null && yy > yHi + 0.3 * g) break;
          }
          if (yLo !== null) {
            beams++;
            gr.strokeStyle = acc; gr.lineWidth = Math.max(3, pw);
            gr.beginPath(); gr.moveTo(px, Y(yLo)); gr.lineTo(px, Y(Math.max(yHi, yLo + 0.05 * g))); gr.stroke();
          }
        }
      }
      root.dataset.beams = beams;
      // surface line
      gr.strokeStyle = isD ? "#555" : "#bbb"; gr.lineWidth = 1;
      gr.beginPath(); gr.moveTo(0, Y(0)); gr.lineTo(w, Y(0)); gr.stroke();
      // Ewald circle (equal scaling: an actual circle)
      const C = [-k * Math.cos(thI), k * Math.sin(thI)];
      gr.strokeStyle = isD ? "#ddd" : "#333"; gr.lineWidth = 1.5;
      gr.beginPath();
      gr.arc(X(C[0]), Y(C[1]), k / S, 0, 2 * Math.PI);
      gr.stroke();
      // incident beam: from circle center to origin
      gr.strokeStyle = acc; gr.lineWidth = 2;
      const cx2 = Math.max(-20, X(C[0])), cy2 = Math.min(h + 20, Y(C[1]));
      gr.beginPath(); gr.moveTo(cx2, cy2); gr.lineTo(X(0), Y(0)); gr.stroke();
      gr.fillStyle = isD ? "#ccc" : "#444"; gr.font = "13px system-ui";
      gr.fillText("k_in", (cx2 + X(0)) / 2 + 6, (cy2 + Y(0)) / 2);
      gr.fillText("Ewald sphere, r = 2π/λ", 10, 18);
      gr.fillText("q∥ →", w - 46, Y(0) + 16);
      gr.fillText("origin", X(0) + 5, Y(0) + 16);
    }
    // ---------- left: real-space schematic ----------
    {
      const w = scm.clientWidth || 200, h = 300;
      scm.width = w * dpr; scm.height = h * dpr;
      const q = scm.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.fillStyle = isD ? "#221f1e" : "#ffffff"; q.fillRect(0, 0, w, h);
      const sy = h * 0.62;
      // substrate
      q.fillStyle = isD ? "#33302e" : "#dedad4";
      q.fillRect(0, sy, w, h - sy - 26);
      // film: N monolayers as rows of atoms (display capped at 12 rows)
      const rows = Math.min(N, 12), da = 9;
      q.fillStyle = isD ? "rgb(240,150,175)" : "rgb(190,60,60)";
      for (let r = 0; r < rows; r++)
        for (let i = 0; i < w / da - 1; i++) {
          q.beginPath();
          q.arc(6 + i * da + (r % 2) * da / 2, sy - 5 - r * da * 0.87, 3.4, 0, 6.3);
          q.fill();
        }
      if (N > 12) {
        q.fillStyle = isD ? "#ccc" : "#444"; q.font = "13px system-ui";
        q.fillText("⋮", w / 2, sy - 5 - 12 * da * 0.87 - 6);
      }
      // beam
      q.strokeStyle = acc; q.lineWidth = 2;
      const topY = sy - 5 - Math.min(rows, 12) * da * 0.87;
      if (mode === "LEED") {
        q.beginPath(); q.moveTo(w / 2, 14); q.lineTo(w / 2, topY - 4); q.stroke();
        q.beginPath(); q.moveTo(w / 2 - 4, topY - 12); q.lineTo(w / 2, topY - 4);
        q.lineTo(w / 2 + 4, topY - 12); q.stroke();
        q.setLineDash([3, 3]);
        for (const ang of [-0.45, 0.45]) {
          q.beginPath(); q.moveTo(w / 2, topY - 4);
          q.lineTo(w / 2 + Math.sin(ang) * 80, topY - 4 - Math.cos(ang) * 80); q.stroke();
        }
        q.setLineDash([]);
      } else {
        const th2 = Math.max((+inA.value) * Math.PI / 180 * 5, 0.06);
        q.beginPath(); q.moveTo(4, topY - Math.tan(th2) * w * 0.45);
        q.lineTo(w / 2, topY); q.stroke();
        q.setLineDash([3, 3]);
        q.beginPath(); q.moveTo(w / 2, topY);
        q.lineTo(w - 4, topY - Math.tan(th2) * w * 0.45); q.stroke();
        q.setLineDash([]);
      }
      q.fillStyle = isD ? "#ccc" : "#444"; q.font = "13px system-ui";
      q.fillText("beam", mode === "LEED" ? w / 2 + 8 : 8, mode === "LEED" ? 22 : topY - Math.tan(Math.max((+inA.value) * Math.PI / 180 * 5, 0.06)) * w * 0.45 - 6);
      q.fillText("film, " + N + " ML", 6, sy - 5 - rows * da * 0.87 - 8 > 20 ? sy - 34 : sy - 34);
      q.fillText("substrate", 6, h - 32);
      q.fillText("real space", 6, 16);
    }
    // ---------- right: detector ----------
    {
      const w = det.clientWidth || 200, h = 300;
      det.width = w * dpr; det.height = h * dpr;
      const q = det.getContext("2d");
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.fillStyle = "#0a0a0c"; q.fillRect(0, 0, w, h);
      q.font = "13px system-ui";
      if (mode === "LEED") {
        const R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
        q.strokeStyle = "#333";
        q.beginPath(); q.arc(cx, cy, R, 0, 6.3); q.stroke();
        const sr = Math.max(1.8, 6 * (+inW.value) / 0.3);
        for (let n2 = -4; n2 <= 4; n2++) {
          for (let m2 = -4; m2 <= 4; m2++) {
            const sx = n2 * g / k, sy2 = m2 * g / k;
            if (sx * sx + sy2 * sy2 >= 0.9) continue;
            q.fillStyle = n2 === 0 && m2 === 0 ? "#fff" : "rgb(235,150,170)";
            q.beginPath(); q.arc(cx + sx * R, cy - sy2 * R, sr, 0, 6.3); q.fill();
          }
        }
        q.fillStyle = "#999"; q.fillText("LEED screen (spots)", 8, 18);
      } else {
        const shadow = h * 0.7;
        q.fillStyle = "#161618"; q.fillRect(0, shadow, w, h - shadow);
        q.strokeStyle = "#333";
        q.beginPath(); q.moveTo(0, shadow); q.lineTo(w, shadow); q.stroke();
        const thI2 = (+inA.value) * Math.PI / 180;
        const spec = shadow - Math.tan(2 * thI2) * h * 1.3;
        const sr = Math.max(2, 6 * (+inW.value) / 0.3);
        for (let n2 = -3; n2 <= 3; n2++) {
          const sx = w / 2 + n2 * (g / k) * w * 13;
          if (sx < 4 || sx > w - 4) continue;
          // streak length: rod width stretched by the grazing cut, shortened
          // as the film thickens and the rods break into segments
          const thick = N === 1 ? 1 : Math.min(1, 3 / N + 0.15);
          const len = (10 + 52 * ((+inW.value) / 0.12)) * Math.exp(-Math.abs(n2) * 0.3) * thick;
          const cyS = spec - n2 * n2 * 3;
          const grd = q.createLinearGradient(0, cyS - len / 2, 0, cyS + len / 2);
          grd.addColorStop(0, "rgba(235,150,170,0)");
          grd.addColorStop(0.5, "rgba(240,180,195,0.95)");
          grd.addColorStop(1, "rgba(235,150,170,0)");
          q.fillStyle = grd;
          q.fillRect(sx - sr / 2, cyS - len / 2, sr, len);
        }
        q.fillStyle = "#999"; q.fillText("RHEED screen (streaks)", 8, 18);
        q.fillText("shadow edge", 8, shadow + 16);
      }
    }
    root.querySelector(".w-ev").textContent = eV >= 1000 ? (eV / 1000).toFixed(1) + " keV" : eV.toFixed(0) + " eV";
    root.querySelector(".w-av").textContent = (+inA.value).toFixed(1) + "°";
    root.querySelector(".w-wv").textContent = (+inW.value).toFixed(2) + " g";
    root.querySelector(".w-nv").textContent = N === 1 ? "1 monolayer" : N === 40 ? "40 ML (≈ bulk)" : N + " monolayers";
  }
  function setMode(m2) {
    mode = m2;
    bLeed.classList.toggle("on", m2 === "LEED");
    bRheed.classList.toggle("on", m2 === "RHEED");
    root.querySelector(".w-angL").style.display = m2 === "RHEED" ? "flex" : "none";
    draw();
  }
  bLeed.addEventListener("click", () => setMode("LEED"));
  bRheed.addEventListener("click", () => setMode("RHEED"));
  for (const i of [inE, inA, inW, inN]) i.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cv);
  syncTheme();
  return () => obs.disconnect();
}

export default { render, lambdaE };
