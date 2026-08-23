// rheed-growth.js
// AnyWidget: layer-by-layer film growth with live RHEED intensity. A 1D
// solid-on-solid model: atoms land on random columns and relax to the lowest
// nearby site within a diffusion length. The specular RHEED intensity is the
// kinematic anti-Bragg interference I = |sum_i exp(i pi h_i)|^2 / W^2, which
// oscillates once per completed monolayer while growth is layer-by-layer and
// decays as the surface roughens. High diffusion = smooth growth = strong
// persistent oscillations; zero diffusion = random deposition = rapid decay.
//
//   :::{anywidget} ../../widgets/rheed-growth.js
//   :::

function render({ model, el }) {
  const uid = "rh" + Math.random().toString(36).slice(2, 8);
  const W = 160;
  let h = new Int32Array(W);
  let dep = 0;                    // total atoms deposited
  let trace = [];
  let playing = true, raf = 0, visible = true, acc = 0;

  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg); display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(240,122,158); }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:8px; display:block; width:100%; }
.${uid} .w-film { margin-bottom:8px; }
.${uid} .w-controls { display:flex; gap:12px; align-items:center; margin-top:8px;
  font-size:13px; color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-controls button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
.${uid} input[type=range] { flex:1 1 100px; accent-color:var(--w-accent); }
.${uid} .w-stat { font-variant-numeric:tabular-nums; color:var(--w-fg); font-weight:600; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<canvas class="w-film" height="150"></canvas>
<canvas class="w-int" height="150"></canvas>
<div class="w-controls">
  <button class="w-play">&#10074;&#10074; Pause</button>
  <span>diffusion</span><input class="w-diff" type="range" min="0" max="2" step="0.05" value="1.3">
  <span>speed</span><input class="w-rate" type="range" min="0.2" max="4" step="0.1" value="1">
  <span>coverage <span class="w-stat w-cov">0.0</span> ML</span>
  <button class="w-reset">Reset</button>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>RHEED intensity oscillations.</b> A film grows atom by atom; every completed monolayer rings the specular intensity.";
  root.appendChild(cap);

  const cvF = root.querySelector(".w-film"), cvI = root.querySelector(".w-int");
  const inDiff = root.querySelector(".w-diff"), inRate = root.querySelector(".w-rate");
  const playBtn = root.querySelector(".w-play");

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();

  function deposit() {
    // land on a random column, then relax: within a search range set by the
    // diffusion slider, settle at the lowest reachable site (Family model)
    const range = Math.round(Math.pow(10, +inDiff.value) - 1); // 0 .. ~99 sites
    let i = Math.floor(Math.random() * W);
    let best = i;
    for (let d2 = 1; d2 <= range; d2++) {
      for (const j of [(i - d2 + W) % W, (i + d2) % W]) {
        if (h[j] < h[best]) best = j;
      }
      if (h[best] < h[i]) break;    // greedy: settle at first downhill terrace
    }
    h[best]++; dep++;
  }
  function intensity() {
    // anti-Bragg kinematic sum: even layers interfere destructively with odd
    let re = 0;
    for (let i = 0; i < W; i++) re += (h[i] % 2 === 0 ? 1 : -1);
    return (re / W) ** 2;
  }
  function drawFilm() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvF.clientWidth || 400, hh = 150;
    cvF.width = w * dpr; cvF.height = hh * dpr;
    const g = cvF.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, hh);
    const isD = dark();
    const hmin = Math.min(...h);
    const cw = w / W, ch = cw * 0.92;
    // substrate band
    g.fillStyle = isD ? "#3a3735" : "#d8d5d0";
    g.fillRect(0, hh - 12, w, 12);
    for (let i = 0; i < W; i++) {
      for (let l = hmin; l < h[i]; l++) {
        const y = hh - 12 - (l - hmin + 1) * ch + ch / 2;
        if (y < -ch) continue;
        // atoms as circles, every other layer offset half a site
        const cx = i * cw + cw / 2 + (l % 2) * cw / 2;
        g.fillStyle = l % 2 === 0 ? (isD ? "rgb(240,122,158)" : "rgb(204,0,0)")
                                  : (isD ? "#a06a76" : "#e0a0a0");
        g.beginPath(); g.arc(cx, y, cw / 2 * 0.95, 0, 6.3); g.fill();
      }
    }
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    g.fillText("film cross-section (colors alternate by layer)", 8, 13);
  }
  function drawTrace() {
    const dpr = window.devicePixelRatio || 1;
    const w = cvI.clientWidth || 400, hh = 150;
    cvI.width = w * dpr; cvI.height = hh * dpr;
    const g = cvI.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, hh);
    const isD = dark();
    const covNow = dep / W, cov0 = Math.max(0, covNow - 12);
    const Xc = c => (c - cov0) / 12 * w;
    g.strokeStyle = isD ? "#333" : "#eee";
    g.fillStyle = isD ? "#999" : "#777"; g.font = "12px system-ui";
    for (let mlv = Math.ceil(cov0); mlv <= cov0 + 12; mlv++) {
      g.beginPath(); g.moveTo(Xc(mlv), 16); g.lineTo(Xc(mlv), hh - 16); g.stroke();
      if (mlv % 2 === 0) g.fillText(mlv + " ML", Xc(mlv) + 2, hh - 4);
    }
    g.strokeStyle = isD ? "rgb(240,122,158)" : "rgb(204,0,0)";
    g.lineWidth = 1.8; g.beginPath();
    for (let i = 0; i < trace.length; i++) {
      const x = Xc(trace[i][0]);
      const y = hh - 18 - trace[i][1] * (hh - 38);
      i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = isD ? "#999" : "#777";
    g.fillText("specular RHEED intensity vs deposited coverage (gridlines: 1 ML)", 8, 12);
  }
  function tick() {
    if (visible && playing) {
      acc += +inRate.value * W / 60;   // atoms per frame; speed is playback only
      while (acc >= 1) { deposit(); acc--; }
      trace.push([dep / W, intensity()]);
      while (trace.length > 2 && trace[0][0] < dep / W - 12) trace.shift();
      root.querySelector(".w-cov").textContent = (dep / W).toFixed(1);
      drawFilm(); drawTrace();
    }
    raf = requestAnimationFrame(tick);
  }
  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Play";
  });
  root.querySelector(".w-reset").addEventListener("click", () => {
    h = new Int32Array(W); dep = 0; trace = []; acc = 0;
  });
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "100px" });
  io.observe(root);
  tick();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); io.disconnect(); };
}

export default { render };
