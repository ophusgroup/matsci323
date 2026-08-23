"""Drawn schematics: theta-2theta vs GIXRD geometry, STEM detector angular
layout, and relaxation vs reconstruction atom rows."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge, FancyArrowPatch, Circle
import figstyle as st
st.apply()

# ---- 1. symmetric theta-2theta vs grazing-incidence geometry ----
from matplotlib.patches import Arc
fig, axes = plt.subplots(1, 2, figsize=(9.0, 3.8))
for ax, mode in zip(axes, ["sym", "gixrd"]):
    ax.axis("off"); ax.set_xlim(-1.35, 1.35); ax.set_ylim(-0.40, 1.22)
    ax.set_aspect("equal")
    # film on substrate
    ax.fill_between([-0.8, 0.8], -0.07, 0, color=st.ACCENT, alpha=0.25)
    ax.fill_between([-0.8, 0.8], -0.30, -0.07, color=st.GRAY, alpha=0.3)
    ax.text(-1.30, -0.06, "film", fontsize=11)
    ax.text(-1.30, -0.24, "substrate", fontsize=11)
    if mode == "sym":
        th = np.radians(35)
        ax.add_patch(FancyArrowPatch((-np.cos(th), np.sin(th)), (0, 0),
            arrowstyle="-|>", mutation_scale=14, color=st.ACCENT, lw=2))
        ax.add_patch(FancyArrowPatch((0, 0), (np.cos(th), np.sin(th)),
            arrowstyle="-|>", mutation_scale=14, color=st.ACCENT, lw=2))
        ax.add_patch(Arc((0, 0), 0.72, 0.72, theta1=145, theta2=180,
            color=st.GRAY, lw=1.2))
        ax.add_patch(Arc((0, 0), 0.72, 0.72, theta1=0, theta2=35,
            color=st.GRAY, lw=1.2))
        ax.text(-0.52, 0.09, "θ", fontsize=12)
        ax.text(0.44, 0.09, "θ", fontsize=12)
        ax.add_patch(FancyArrowPatch((0, 0.06), (0, 0.82),
            arrowstyle="-|>", mutation_scale=12, color=st.BLUE, lw=1.8))
        ax.text(0.06, 0.94, "q stays along the\nsurface normal", fontsize=10,
            color=st.BLUE, va="top")
        ax.set_title("symmetric θ-2θ scan:\nonly planes parallel to the surface diffract",
            fontsize=11)
    else:
        w = np.radians(6)
        ax.add_patch(FancyArrowPatch((-1.25, np.tan(w)*1.25), (0, 0),
            arrowstyle="-|>", mutation_scale=14, color=st.ACCENT, lw=2))
        ax.text(-1.25, 0.24, "ω fixed,\na few degrees", fontsize=10)
        # two detector positions on the 2-theta circle, plus the scan arc
        for t2 in [np.radians(32), np.radians(66)]:
            ax.add_patch(FancyArrowPatch((0, 0),
                (0.85*np.cos(t2 - w), 0.85*np.sin(t2 - w)),
                arrowstyle="-|>", mutation_scale=12, color=st.ACCENT, lw=1.6))
        ax.add_patch(Arc((0, 0), 2.06, 2.06, theta1=20, theta2=72,
            color=st.GRAY, lw=1.2, ls="--"))
        ax.text(0.60, 1.02, "detector\nscans 2θ", fontsize=10)
        # q bisects incident and exit for the lower detector position
        t2 = np.radians(32)
        kin = np.array([np.cos(-w), np.sin(-w)])
        kout = np.array([np.cos(t2 - w), np.sin(t2 - w)])
        q = kout - kin; q = q / np.hypot(*q)
        ax.add_patch(FancyArrowPatch((0, 0.02), tuple(0.55*q + [0, 0.02]),
            arrowstyle="-|>", mutation_scale=12, color=st.BLUE, lw=1.8))
        ax.text(-1.05, 0.72, "q tilts as the\ndetector scans", fontsize=10, color=st.BLUE)
        ax.set_title("grazing incidence (GIXRD):\nlong beam path in the film, substrate suppressed",
            fontsize=11)
st.save(fig, "xrd-geometries.svg"); plt.close(fig)

# ---- 2. STEM detector angular layout ----
fig, ax = plt.subplots(figsize=(6.2, 4.6))
ax.axis("off"); ax.set_xlim(-1.4, 1.4); ax.set_ylim(-1.25, 0.75)
# sample at top, cone of scattering angles below
ax.fill_between([-0.7, 0.7], 0.58, 0.63, color=st.GRAY, alpha=0.5)
ax.text(0.74, 0.57, "thin sample", fontsize=11)
ax.add_patch(FancyArrowPatch((0, 0.95), (0, 0.66), arrowstyle="-|>",
    mutation_scale=14, color=st.BLUE, lw=2))
# angle wedges (schematic angular scale)
det = [("BF  (< 10 mrad)", 0, 10, st.BLUE, 0.45),
       ("ABF (10-25)", 10, 25, st.GREEN, 0.62),
       ("LAADF (25-60)", 25, 60, st.GOLD, 0.80),
       ("HAADF (> 60 mrad)", 60, 110, st.ACCENT, 1.0)]
scale = 1.05/110
for name, a0, a1, c, rl in det:
    for sgn in (-1, 1):
        ax.add_patch(Wedge((0, 0.60), 1.12, 270 - 90 - 0, 270 + 90, width=None,
            visible=False))
        th0, th1 = np.degrees(np.arctan(np.array([a0, a1]) * scale / 1.0))
        ax.add_patch(Wedge((0, 0.60), 1.15, 270 + sgn*th0 if sgn>0 else 270 - th1,
            270 + th1 if sgn>0 else 270 - th0, color=c, alpha=0.30))
    ax.text(1.18*np.sin(np.radians((np.degrees(np.arctan(a1*scale)) +
            np.degrees(np.arctan(a0*scale)))/2)), 0.60 - 1.18, "", fontsize=9)
# detector bars at the bottom with labels
y0 = -0.78
for name, a0, a1, c, rl in det:
    x0, x1 = np.tan(np.arctan(a0*scale))*1.3, np.tan(np.arctan(a1*scale))*1.3
    for sgn in (-1, 1):
        ax.plot([sgn*x0 if a0 else sgn*0.005, sgn*x1], [y0, y0], color=c, lw=7, solid_capstyle="butt")
    ax.text(1.36, y0 - 0.005, "", fontsize=9)
labels_y = {-0.78: None}
ly = y0 - 0.14
for i, (name, a0, a1, c, rl) in enumerate(det):
    ax.text(-1.38, ly - i*0.115, name, fontsize=10.5, color=c)
ax.text(0.07, 0.80, "converged probe", fontsize=11, color=st.BLUE)
ax.set_title("detector collection angles select the contrast", fontsize=12)
st.save(fig, "stem-detectors.svg"); plt.close(fig)

# ---- 3. relaxation vs reconstruction ----
fig, axes = plt.subplots(1, 3, figsize=(9.2, 3.0))
for ax, mode in zip(axes, ["bulk", "relaxed", "recon"]):
    ax.axis("off"); ax.set_xlim(-0.5, 6.5); ax.set_ylim(-3.6, 1.4)
    d12 = 1.0 if mode == "bulk" else (0.82 if mode == "relaxed" else 1.0)
    ys = [0.0, -1.0, -2.0, -3.0]
    ys[0] = ys[1] + d12
    for irow, y in enumerate(ys):
        xs = np.arange(0, 7)
        if mode == "recon" and irow == 0:
            xs = xs.astype(float)
            for i in range(0, 6, 2):
                xs[i] += 0.22; xs[i+1] -= 0.22   # dimer pairing
        for x in xs:
            ax.add_patch(Circle((x, y), 0.30,
                color=st.ACCENT if irow == 0 else st.GRAY,
                alpha=0.9 if irow == 0 else 0.45))
    if mode == "bulk":
        ax.set_title("bulk-terminated\n(hypothetical)", fontsize=11)
    elif mode == "relaxed":
        ax.set_title("relaxed:\nfirst spacing contracts", fontsize=11)
        ax.annotate("", xy=(6.45, ys[0]), xytext=(6.45, ys[1]),
            arrowprops=dict(arrowstyle="<->", color=st.BLUE))
        ax.text(6.75, (ys[0]+ys[1])/2 - 0.15, "$d_{12} < d_{bulk}$", fontsize=12, color=st.BLUE)
    else:
        ax.set_title("reconstructed:\nnew surface periodicity (dimers)", fontsize=11)
st.save(fig, "relax-reconstruct.svg"); plt.close(fig)
print("batch 3 done")
