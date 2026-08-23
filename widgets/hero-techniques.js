// hero-techniques.js
// AnyWidget: landing-page hero. Twelve looping vignettes, one per technique,
// in a 4-column rainbow grid with motion trails. Correct physics gestures at
// a calm pace: Bragg reflection stealing amplitude from the transmitted
// beam, two-interface XRR interference, photoemission in proper sequence,
// square SEM pixels, RHEED streaks pulsing with deposition, FIB milling,
// a STEM probe with its diffraction disks, and an AFM tip that is actually
// attached to its cantilever. Pauses off-screen.
//
//   :::{anywidget} ./widgets/hero-techniques.js   (from index.md)
//   :::

const H = 118;
const SPEED = 0.5;

function render({ model, el }) {
  const uid = "ht" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { display:block; margin:26px 0 30px 0; font-family:system-ui,sans-serif; }
.${uid} .ht-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr));
  gap:9px; }
.${uid} .ht-tile { position:relative; border-radius:9px; overflow:hidden;
  background:#0b0b10; border:1px solid rgba(128,128,128,0.25); display:block;
  text-decoration:none; cursor:pointer; }
.${uid} .ht-tile:hover { border-color:rgba(200,200,200,0.6); }
.${uid} .ht-tile canvas { display:block; width:100%; height:${H}px; }
.${uid} .ht-label { position:absolute; left:8px; bottom:5px; font-size:12.5px;
  font-weight:650; letter-spacing:0.03em; color:#fff; text-shadow:0 0 6px rgba(0,0,0,0.9); }
`;
  const root = document.createElement("div");
  root.className = uid;
  el.appendChild(style); el.appendChild(root);

  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(42);
  function beam(g, x0, y0, x1, y1, c, lw) {
    g.strokeStyle = c; g.lineWidth = lw || 1.5;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  }

  const V = [
    { name: "XRD", make: () => ({
      step(g, w, t, hue) {
        const cx = w / 2, cy = H * 0.52;
        for (let r = 0; r < 4; r++) for (let i = -4; i <= 4; i++) {
          g.fillStyle = `hsla(${hue},60%,70%,0.5)`;
          g.beginPath(); g.arc(cx + i * 14, cy + r * 11, 1.8, 0, 6.3); g.fill();
        }
        const th = 0.45 + 0.28 * Math.sin(t * 0.8);
        const bragg = Math.max(0, 1 - Math.abs(th - 0.6) / 0.07); // 0..1
        // incident
        beam(g, cx - Math.cos(th) * 120, cy - Math.sin(th) * 120, cx, cy,
          `hsla(${hue},90%,65%,0.9)`, 2);
        // transmitted: always there, loses amplitude to the reflection
        beam(g, cx, cy, cx + Math.cos(th) * 120, cy + Math.sin(th) * 120,
          `hsla(${hue},85%,60%,${0.85 - 0.6 * bragg})`, 2 - bragg);
        // diffracted
        if (bragg > 0.02) {
          beam(g, cx, cy, cx + Math.cos(th) * 120, cy - Math.sin(th) * 120,
            `hsla(${hue},100%,75%,${bragg})`, 1 + 2.5 * bragg);
          g.fillStyle = `hsla(${hue},100%,80%,${0.3 * bragg})`;
          g.beginPath(); g.arc(cx, cy, 11, 0, 6.3); g.fill();
        }
      } }) },
    { name: "XRR", make: () => ({
      pts: [],
      step(g, w, t, hue) {
        const sy = H * 0.40, fpx = 11;
        g.fillStyle = `hsla(${hue},45%,42%,0.35)`; g.fillRect(0, sy, w, fpx);
        g.fillStyle = `hsla(${hue},30%,26%,0.35)`; g.fillRect(0, sy + fpx, w, 12);
        // the measurement: incidence angle sweeps upward, the detector trace
        // draws the fringe pattern in step with the sweep
        const p = (t * 0.07) % 1;
        if (this.lastP !== undefined && p < this.lastP) this.pts = [];
        this.lastP = p;
        const th = 0.10 + 0.42 * p;
        const I = (0.55 + 0.45 * Math.cos(2 * Math.PI * 5.5 * p)) * Math.exp(-1.8 * p);
        const px = w * 0.40;
        // incident + two exit rays (top surface, buried interface), parallel
        beam(g, px - Math.cos(th) * 110, sy - Math.sin(th) * 110, px, sy,
          `hsla(${hue},90%,66%,0.9)`, 1.8);
        const a = 0.25 + 0.75 * I;
        beam(g, px, sy, px + Math.cos(th) * 110, sy - Math.sin(th) * 110,
          `hsla(${hue},95%,72%,${a})`, 1 + 2 * I);
        const dxf = fpx / Math.tan(Math.max(th, 0.12));
        beam(g, px, sy, px + dxf, sy + fpx, `hsla(${hue},90%,66%,0.4)`, 1.2);
        beam(g, px + dxf, sy + fpx, px + 2 * dxf, sy, `hsla(${hue},90%,66%,0.4)`, 1.2);
        beam(g, px + 2 * dxf, sy, px + 2 * dxf + Math.cos(th) * 100, sy - Math.sin(th) * 100,
          `hsla(${hue},95%,72%,${a * 0.7})`, 1 + 1.4 * I);
        // detector trace accumulating below
        this.pts.push([w * (0.05 + 0.9 * p), H - 22 - I * 30]);
        g.strokeStyle = `hsla(${hue},95%,72%,0.95)`; g.lineWidth = 1.7;
        g.beginPath();
        this.pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]));
        g.stroke();
        const last = this.pts[this.pts.length - 1];
        g.fillStyle = `hsla(${hue},100%,80%,1)`;
        g.beginPath(); g.arc(last[0], last[1], 2.6, 0, 6.3); g.fill();
      } }) },
    { name: "Ellipsometry", make: () => ({
      step(g, w, t, hue) {
        const sy = H * 0.74, cx = w / 2;
        g.fillStyle = `hsla(${hue},40%,35%,0.4)`; g.fillRect(0, sy, w, H);
        for (let k = 0; k < 8; k++) {
          const f = k / 8, a = t * 3.6 + k * 0.7;
          const x = f * cx, y = sy - (1 - f) * H * 0.45;
          g.strokeStyle = `hsla(${(hue + k * 5) % 360},95%,68%,0.85)`;
          g.lineWidth = 1.3;
          g.beginPath(); g.ellipse(x, y, 6, 2.8, a, 0, 6.3); g.stroke();
          const x2 = cx + f * (w / 2 - 8), y2 = sy - f * H * 0.45;
          g.strokeStyle = `hsla(${(hue + 35 + k * 5) % 360},95%,68%,0.85)`;
          g.beginPath(); g.ellipse(x2, y2, 2.8, 6, -a * 0.7, 0, 6.3); g.stroke();
        }
      } }) },
    { name: "RBS", make: () => ({
      ions: Array.from({ length: 5 }, (_, i) => ({ p: (i / 5 + rnd()) % 1, y: 20 + rnd() * 45 })),
      step(g, w, t, hue) {
        for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
          g.fillStyle = `hsla(${hue},55%,68%,0.6)`;
          g.beginPath(); g.arc(w * 0.7 + i * 11, 26 + r * 20 + (i % 2) * 5, 2.5, 0, 6.3); g.fill();
        }
        for (const io of this.ions) {
          io.p += 0.0035;
          if (io.p > 1) { io.p = 0; io.y = 18 + rnd() * 55; io.bs = rnd() < 0.3; }
          const xh = w * 0.68;
          if (!io.bs || io.p < 0.55) {
            const x = io.p / 0.55 * xh;
            if (x < xh) {
              g.fillStyle = `hsla(${hue},95%,70%,0.95)`;
              g.beginPath(); g.arc(x, io.y, 2.3, 0, 6.3); g.fill();
            }
          } else {
            const f = (io.p - 0.55) / 0.45;
            g.fillStyle = `hsla(${(hue + 30) % 360},100%,75%,0.95)`;
            g.beginPath(); g.arc(xh - f * xh * 0.9, io.y - f * 30, 2.3, 0, 6.3); g.fill();
          }
        }
      } }) },
    { name: "SIMS", make: () => ({
      sp: [],
      step(g, w, t, hue) {
        const sy = H * 0.72;
        g.fillStyle = `hsla(${hue},45%,45%,0.4)`; g.fillRect(0, sy, w, H);
        beam(g, w * 0.12, 8, w * 0.4, sy, `hsla(${hue},90%,65%,0.9)`, 2);
        if (rnd() < 0.28) this.sp.push({ x: w * 0.4, y: sy, vx: 0.35 + rnd() * 0.9,
          vy: -(0.7 + rnd() * 0.9), t: 0 });
        g.fillStyle = `hsla(${hue},90%,72%,0.95)`;
        for (const s of this.sp) {
          s.x += s.vx; s.y += s.vy; s.vy += 0.007; s.t++;
          g.beginPath(); g.arc(s.x, s.y, 2, 0, 6.3); g.fill();
        }
        this.sp = this.sp.filter(s => s.t < 220 && s.y < sy + 4);
        g.strokeStyle = `hsla(${hue},60%,70%,0.8)`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(w * 0.86, 6); g.lineTo(w * 0.8, 24); g.lineTo(w * 0.8, 36);
        g.moveTo(w * 0.97, 6); g.lineTo(w * 1.03, 24); g.stroke();
      } }) },
    { name: "APT", make: () => ({
      fly: [],
      step(g, w, t, hue) {
        const ax = w * 0.3, ay = H / 2;
        g.fillStyle = `hsla(${hue},50%,55%,0.5)`;
        g.beginPath(); g.moveTo(0, ay - 26); g.lineTo(ax, ay); g.lineTo(0, ay + 26);
        g.closePath(); g.fill();
        if (rnd() < 0.4) {
          const a = (rnd() - 0.5) * 1.5;
          this.fly.push({ x: ax, y: ay, vx: Math.cos(a) * 1.2, vy: Math.sin(a) * 1.2, t: 0 });
        }
        g.fillStyle = `hsla(${hue},95%,72%,0.95)`;
        for (const f of this.fly) {
          f.x += f.vx; f.y += f.vy; f.t++;
          g.beginPath(); g.arc(f.x, f.y, 1.9, 0, 6.3); g.fill();
        }
        this.fly = this.fly.filter(f => f.t < 200 && f.x < w + 5);
        g.strokeStyle = `hsla(${hue},60%,70%,0.7)`; g.lineWidth = 3;
        g.beginPath(); g.moveTo(w - 5, 10); g.lineTo(w - 5, H - 10); g.stroke();
      } }) },
    { name: "XPS", make: () => ({
      step(g, w, t, hue) {
        const cx = w * 0.55, cy = H * 0.58;
        const ph = (t * 0.35) % 1;
        g.strokeStyle = `hsla(${hue},60%,65%,0.7)`; g.lineWidth = 1.1;
        for (const r of [8, 14]) { g.beginPath(); g.arc(cx, cy, r, 0, 6.3); g.stroke(); }
        g.fillStyle = `hsla(${hue},60%,70%,0.9)`;
        g.beginPath(); g.arc(cx, cy, 3.5, 0, 6.3); g.fill();
        // sequence: photon travels (0 to 0.6), flash (0.6), electron leaves after
        if (ph < 0.6) {
          const f = ph / 0.6;
          const px = f * (cx - 14);
          g.strokeStyle = `hsla(${hue},95%,68%,0.9)`; g.lineWidth = 1.7;
          g.beginPath();
          for (let x = Math.max(0, px - 46); x <= px; x += 2) {
            const y = cy - (cx - x) * 0.42 + 5 * Math.sin(x * 0.4 + t * 6);
            x <= Math.max(0, px - 46) + 0.1 ? g.moveTo(x, y) : g.lineTo(x, y);
          }
          g.stroke();
        } else if (ph < 0.68) {
          g.fillStyle = `hsla(${hue},100%,85%,${1 - (ph - 0.6) / 0.08})`;
          g.beginPath(); g.arc(cx, cy, 16, 0, 6.3); g.fill();
        } else {
          const f = (ph - 0.68) / 0.32;
          g.fillStyle = `hsla(${(hue + 40) % 360},100%,75%,1)`;
          g.beginPath();
          g.arc(cx + 12 + f * w * 0.34, cy - 12 - f * H * 0.42, 2.6, 0, 6.3); g.fill();
        }
      } }) },
    { name: "SEM", make: () => ({
      row: 0, col: 0, img: null,
      step(g, w, t, hue) {
        const NC = 20, px = (w * 0.66) / NC;             // square pixels
        const NR = Math.max(4, Math.floor((H - 40) / px));
        if (!this.img) {
          this.img = [];
          for (let r = 0; r < NR; r++)
            this.img.push(Array.from({ length: NC }, (_, c) =>
              0.25 + 0.75 * Math.abs(Math.sin(r * 0.9 + c * 0.5) * Math.cos(c * 0.23))));
        }
        const x0 = w * 0.17, y0 = 14;
        for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
          const seen = r < this.row || (r === this.row && c <= this.col);
          if (seen) {
            g.fillStyle = `hsla(${hue},80%,${25 + 50 * this.img[r][c]}%,0.9)`;
            g.fillRect(x0 + c * px, y0 + r * px, px - 1, px - 1);
          }
        }
        this.col += 1;
        if (this.col >= NC) { this.col = 0; this.row = (this.row + 1) % NR; if (!this.row) this.img = null; }
        const bx = x0 + this.col * px, by = y0 + this.row * px;
        beam(g, bx - 10, 0, bx, by, `hsla(${hue},100%,75%,0.95)`, 1.6);
        g.fillStyle = `hsla(${hue},100%,80%,0.5)`;
        g.beginPath(); g.arc(bx, by, 4, 0, 6.3); g.fill();
      } }) },
    { name: "FIB", make: () => ({
      depth: null, sp: [],
      step(g, w, t, hue) {
        const NC = 60;
        if (!this.depth) this.depth = new Float32Array(NC);
        const sy = H * 0.55;
        const bx = w * (0.35 + 0.18 * Math.sin(t * 0.9));  // beam sweeps the mill box
        const ci = Math.floor(bx / w * NC);
        if (ci >= NC * 0.3 && ci <= NC * 0.7 && this.depth[ci] < H * 0.32)
          this.depth[ci] += 0.5;
        if (rnd() < 0.4) this.sp.push({ x: bx, y: sy + this.depth[ci], vx: (rnd() - 0.5) * 1.6,
          vy: -(0.6 + rnd()), t: 0 });
        // material with milled trench
        g.fillStyle = `hsla(${hue},45%,45%,0.45)`;
        g.beginPath(); g.moveTo(0, sy);
        for (let i = 0; i < NC; i++) g.lineTo((i + 0.5) / NC * w, sy + this.depth[i]);
        g.lineTo(w, sy); g.lineTo(w, H); g.lineTo(0, H); g.closePath(); g.fill();
        beam(g, bx - w * 0.06, 4, bx, sy + this.depth[Math.min(NC - 1, Math.max(0, ci))],
          `hsla(${hue},95%,68%,0.95)`, 1.8);
        g.fillStyle = `hsla(${hue},90%,75%,0.9)`;
        for (const s of this.sp) {
          s.x += s.vx; s.y += s.vy; s.vy += 0.01; s.t++;
          g.beginPath(); g.arc(s.x, s.y, 1.7, 0, 6.3); g.fill();
        }
        this.sp = this.sp.filter(s => s.t < 120 && s.y < H);
      } }) },
    { name: "STEM", make: () => ({
      step(g, w, t, hue) {
        const sy = H * 0.5;
        const bx = w / 2 + w * 0.22 * Math.sin(t * 0.5);
        // thin specimen: row of atomic columns
        for (let i = 1; i < 12; i++) {
          g.fillStyle = `hsla(${hue},60%,68%,0.7)`;
          g.beginPath(); g.arc(i / 12 * w, sy, 2.2, 0, 6.3); g.fill();
        }
        // cone angles set by the disks: the direct cone lands exactly on the
        // central disk, so its edges are tangent to the disk edge, and each
        // diffracted cone lands exactly on its own disk
        const py = H - 16, rx = 8, dy = py - sy;
        const hw0 = rx / dy * sy;
        g.fillStyle = `hsla(${hue},90%,65%,0.30)`;
        g.beginPath(); g.moveTo(bx - hw0, 0); g.lineTo(bx, sy); g.lineTo(bx + hw0, 0);
        g.closePath(); g.fill();
        const ons = [-1, 0, 1].map(n => 0.35 + 0.65 * Math.abs(Math.sin(t * 0.5 + n)));
        for (const n of [-1, 0, 1]) {
          const a = n === 0 ? 0.22 : 0.13 * ons[n + 1];
          g.fillStyle = `hsla(${hue},90%,65%,${a})`;
          g.beginPath(); g.moveTo(bx, sy);
          g.lineTo(bx + n * 26 - rx, py); g.lineTo(bx + n * 26 + rx, py);
          g.closePath(); g.fill();
        }
        for (const n of [-1, 0, 1]) {
          g.fillStyle = `hsla(${hue},95%,72%,${n === 0 ? 0.9 : 0.55 * ons[n + 1]})`;
          g.beginPath();
          g.ellipse(bx + n * 26, py, rx, 4.5, 0, 0, 6.3); g.fill();
        }
      } }) },
    { name: "RHEED", make: () => ({
      h: null, fall: [],
      step(g, w, t, hue) {
        const NCOL = 13, da = 6.6, sy = H * 0.72, x0 = 5, cw = (w * 0.5 - 10) / NCOL;
        if (!this.h) this.h = new Float64Array(NCOL);
        const mean = this.h.reduce((a2, b) => a2 + b, 0) / NCOL;
        // substrate block below the (level) surface
        g.fillStyle = `hsla(${hue},40%,40%,0.4)`;
        g.fillRect(0, sy + 4, w * 0.52, H);
        // deposited atoms: stacked circles, whole film sinking as it grows
        g.fillStyle = `hsla(${hue},55%,58%,0.85)`;
        for (let i = 0; i < NCOL; i++) {
          for (let l = Math.max(0, Math.floor(mean) - 1); l < this.h[i]; l++) {
            const y = sy - (l - mean + 1) * da + da / 2;
            if (y > 8 && y < sy + 6) {
              g.beginPath();
              g.arc(x0 + (i + 0.5) * cw + (l % 2) * cw * 0.5, y, da * 0.46, 0, 6.3);
              g.fill();
            }
          }
        }
        // falling atoms: land on their column's current top, then stack
        if (rnd() < 0.09) this.fall.push({ c: Math.floor(rnd() * NCOL), y: -4 });
        const landed = [];
        for (const a2 of this.fall) {
          const top = sy - (this.h[a2.c] - mean) * da;
          a2.y += 0.9;
          if (a2.y >= top - da) { this.h[a2.c] += 1; landed.push(a2); }
          else {
            g.beginPath();
            g.arc(x0 + (a2.c + 0.5) * cw, a2.y, da * 0.46, 0, 6.3); g.fill();
          }
        }
        this.fall = this.fall.filter(a2 => !landed.includes(a2));
        // grazing beam skimming the surface
        beam(g, 0, sy - 8, w * 0.26, sy - 2, `hsla(${hue},90%,65%,0.9)`, 1.6);
        beam(g, w * 0.26, sy - 2, w * 0.52, sy - 8, `hsla(${hue},90%,65%,0.6)`, 1.4);
        // streaks pulse with layer completion
        const osc = 0.5 + 0.5 * Math.cos(2 * Math.PI * (mean % 1));
        for (let n = -2; n <= 2; n++) {
          const x = w * 0.76 + n * w * 0.07;
          const len = (20 + 22 * osc) * Math.exp(-Math.abs(n) * 0.4);
          const grd = g.createLinearGradient(0, H * 0.38 - len / 2, 0, H * 0.38 + len / 2);
          grd.addColorStop(0, `hsla(${hue},95%,70%,0)`);
          grd.addColorStop(0.5, `hsla(${hue},95%,72%,${0.35 + 0.65 * osc})`);
          grd.addColorStop(1, `hsla(${hue},95%,70%,0)`);
          g.fillStyle = grd;
          g.fillRect(x - 2, H * 0.38 - len / 2, 4, len);
        }
      } }) },
    { name: "AFM", make: () => ({
      step(g, w, t, hue) {
        const surf = x => H * 0.74 - 10 * Math.sin(x * 0.05) * Math.cos(x * 0.021) - 5 * Math.sin(x * 0.013);
        g.strokeStyle = `hsla(${hue},55%,55%,0.8)`; g.lineWidth = 1.4;
        g.beginPath();
        for (let x = 0; x < w; x += 3) x ? g.lineTo(x, surf(x)) : g.moveTo(x, surf(x));
        g.stroke();
        const tx = ((t * 26) % (w + 60)) - 30;
        const ty = surf(tx);
        // cantilever beam first, tip triangle hanging from its underside
        const camber = -5;
        g.strokeStyle = `hsla(${hue},85%,68%,0.85)`; g.lineWidth = 3.5;
        g.beginPath(); g.moveTo(tx - 7, ty - 15); g.lineTo(tx + 52, ty - 15 + camber); g.stroke();
        g.fillStyle = `hsla(${hue},85%,68%,0.95)`;
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx - 7, ty - 14); g.lineTo(tx + 7, ty - 14);
        g.closePath(); g.fill();
        // measured trace behind the tip
        g.strokeStyle = `hsla(${(hue + 30) % 360},95%,75%,0.9)`; g.lineWidth = 1.5;
        g.beginPath();
        for (let x = 0; x < tx; x += 3) {
          const y = surf(x) - 24;
          x ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
      } }) },
  ];

  const grid = document.createElement("div");
  grid.className = "ht-grid";
  root.appendChild(grid);
  const HREF = {
    XRD: "modules/photons/xrd", XRR: "modules/photons/xrr",
    Ellipsometry: "modules/photons/optical", RBS: "modules/ions/rbs",
    SIMS: "modules/ions/sims", APT: "modules/ions/apt",
    XPS: "modules/espec/xps", SEM: "modules/sem/sem",
    FIB: "modules/sem/ebsd-fib", STEM: "modules/stem/stem-imaging",
    RHEED: "modules/stem/leed-rheed", AFM: "modules/spm/afm",
  };
  const tiles = V.map((v, i) => {
    const d = document.createElement("a");
    d.className = "ht-tile";
    if (HREF[v.name]) { d.href = HREF[v.name]; d.title = v.name + " in the course"; }
    const c = document.createElement("canvas");
    d.appendChild(c);
    const lab = document.createElement("div");
    lab.className = "ht-label";
    lab.textContent = v.name;
    d.appendChild(lab);
    grid.appendChild(d);
    return { cv: c, state: v.make(), hue: (i * 30 + 4) % 360 };
  });

  let raf = 0, visible = true, t0 = performance.now();
  function tick() {
    if (visible) {
      const t = (performance.now() - t0) / 1000 * SPEED;
      for (const tl of tiles) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = tl.cv.clientWidth || 200;
        if (tl.cv.width !== w * dpr) { tl.cv.width = w * dpr; tl.cv.height = H * dpr; }
        const g = tl.cv.getContext("2d");
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.fillStyle = "rgba(11,11,16,0.15)";
        g.fillRect(0, 0, w, H);
        tl.state.step(g, w, t, tl.hue);
      }
    }
    raf = requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; },
    { rootMargin: "60px" });
  io.observe(root);
  tick();
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}

export default { render };
