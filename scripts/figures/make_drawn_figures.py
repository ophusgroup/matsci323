"""Drawn schematics: theta-2theta vs GIXRD geometry and relaxation vs
reconstruction atom rows. The STEM detector figure is stem-detector-angles.svg,
made by the teaching repo's make_diffraction_extra.py."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge, FancyArrowPatch, Circle
import figstyle as st
st.apply()

# ---- 1. symmetric theta-2theta vs grazing-incidence geometry ----
from matplotlib.patches import Arc
fig, axes = plt.subplots(1, 2, figsize=(11.0, 4.2))
for ax, mode in zip(axes, ["sym", "gixrd"]):
    ax.axis("off"); ax.set_xlim(-1.35, 1.35); ax.set_ylim(-0.40, 1.22)
    ax.set_aspect("equal")
    # film on substrate
    ax.fill_between([-0.8, 0.8], -0.07, 0, color=st.ACCENT, alpha=0.25)
    ax.fill_between([-0.8, 0.8], -0.30, -0.07, color=st.GRAY, alpha=0.3)
    ax.text(0.84, -0.05, "film", fontsize=11, va="center")
    ax.text(0.84, -0.20, "substrate", fontsize=11, va="center")
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
        ax.text(0.06, 0.94, "q stays along the\nsurface normal", fontsize=11,
            color=st.BLUE, va="top")
        ax.set_title("symmetric θ-2θ scan:\nonly planes parallel to\nthe surface diffract",
            fontsize=11.5)
    else:
        w = np.radians(6)
        ax.add_patch(FancyArrowPatch((-1.25, np.tan(w)*1.25), (0, 0),
            arrowstyle="-|>", mutation_scale=14, color=st.ACCENT, lw=2))
        ax.text(-1.25, 0.24, "ω fixed,\na few degrees", fontsize=11)
        # two detector positions on the 2-theta circle, plus the scan arc
        for t2 in [np.radians(32), np.radians(66)]:
            ax.add_patch(FancyArrowPatch((0, 0),
                (0.85*np.cos(t2 - w), 0.85*np.sin(t2 - w)),
                arrowstyle="-|>", mutation_scale=12, color=st.ACCENT, lw=1.6))
        ax.add_patch(Arc((0, 0), 2.06, 2.06, theta1=20, theta2=72,
            color=st.GRAY, lw=1.2, ls="--"))
        ax.text(0.60, 1.02, "detector\nscans 2θ", fontsize=11)
        # q bisects incident and exit for the lower detector position
        t2 = np.radians(32)
        kin = np.array([np.cos(-w), np.sin(-w)])
        kout = np.array([np.cos(t2 - w), np.sin(t2 - w)])
        q = kout - kin; q = q / np.hypot(*q)
        ax.add_patch(FancyArrowPatch((0, 0.02), tuple(0.55*q + [0, 0.02]),
            arrowstyle="-|>", mutation_scale=12, color=st.BLUE, lw=1.8))
        ax.text(-1.05, 0.72, "q tilts as the\ndetector scans", fontsize=11, color=st.BLUE)
        ax.set_title("grazing incidence (GIXRD):\nlong beam path in the film,\nsubstrate suppressed",
            fontsize=11.5)
st.save(fig, "xrd-geometries.svg"); plt.close(fig)

# ---- 3. relaxation vs reconstruction ----
fig, axes = plt.subplots(1, 3, figsize=(9.6, 2.45))
for ax, mode in zip(axes, ["bulk", "relaxed", "recon"]):
    ax.axis("off"); ax.set_xlim(-1.35, 6.75); ax.set_ylim(-3.45, 0.75)
    ax.set_aspect("equal")                       # atoms are circles, not ellipses
    d12 = 1.0 if mode == "bulk" else (0.82 if mode == "relaxed" else 1.0)
    ys = [0.0, -1.0, -2.0, -3.0]
    ys[0] = ys[1] + d12
    for irow, y in enumerate(ys):
        xs = np.arange(0, 6)
        if mode == "recon" and irow == 0:
            xs = xs.astype(float)
            for i in range(0, 6, 2):
                xs[i] += 0.22; xs[i+1] -= 0.22   # dimer pairing
        for x in xs:
            ax.add_patch(Circle((x, y), 0.30,
                color=st.ACCENT if irow == 0 else st.GRAY,
                alpha=0.9 if irow == 0 else 0.45))
    if mode == "bulk":
        ax.set_title("bulk-terminated\n(hypothetical)", fontsize=12)
    elif mode == "relaxed":
        ax.set_title("relaxed:\nthe first spacing $d_{12}$ contracts", fontsize=12)
        ax.plot([-0.4, 5.6], [0.0, 0.0], color=st.GRAY, lw=1.0, ls=":")
        ax.text(-0.45, 0.0, "bulk", fontsize=10.5, color=st.GRAY, ha="right", va="center")
        ax.annotate("", xy=(5.85, ys[0]), xytext=(5.85, ys[1]),
            arrowprops=dict(arrowstyle="<->", color=st.BLUE))
        ax.text(6.05, (ys[0]+ys[1])/2, "$d_{12}$", fontsize=12, color=st.BLUE, va="center")
    else:
        ax.set_title("reconstructed:\nnew surface periodicity (dimers)", fontsize=12)
fig.tight_layout()
st.save(fig, "relax-reconstruct.svg"); plt.close(fig)
print("batch 3 done")
