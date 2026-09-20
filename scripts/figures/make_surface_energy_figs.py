"""Surface energy: the Lennard-Jones pair potential with the bond counting on a
close-packed patch, and the same counting on the three low-index fcc surfaces."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch
import figstyle as st
st.apply()

fig, (axL, axR) = plt.subplots(1, 2, figsize=(10.2, 4.3),
                               gridspec_kw={"width_ratios": [1.0, 1.15]})

# ---- (a) the Lennard-Jones pair potential ----
r = np.linspace(0.92, 3.0, 800)
v = 4 * (r**-12 - r**-6)
r0 = 2 ** (1 / 6)
axL.plot(r, v, color=st.ACCENT, lw=2.2)
axL.axhline(0, color=st.GRAY, lw=0.8)
axL.plot([r0], [-1], "o", color=st.ACCENT, ms=6)
# epsilon depth
axL.add_patch(FancyArrowPatch((r0 + 0.30, 0), (r0 + 0.30, -1), arrowstyle="<|-|>",
                              mutation_scale=10, color=st.BLUE, lw=1.4))
axL.text(r0 + 0.38, -0.52, r"$\varepsilon$", color=st.BLUE, fontsize=13, va="center")
# equilibrium spacing
axL.add_patch(FancyArrowPatch((1.0, -1.30), (r0, -1.30), arrowstyle="<|-|>",
                              mutation_scale=10, color=st.BLUE, lw=1.4))
axL.text(r0 + 0.10, -1.30, r"$r_0 = 2^{1/6}\sigma$", color=st.BLUE,
         fontsize=11, ha="left", va="center")
# sigma crossing
axL.plot([1.0], [0], "o", color=st.GRAY, ms=5)
axL.text(1.0, 0.18, r"$\sigma$", color=st.TEXT, fontsize=12, ha="center")
axL.axvline(2 * r0, color=st.GREEN, lw=1.4, ls="--")
axL.text(2 * r0 - 0.06, 0.95, "cutoff $2r_0$", color=st.GREEN, fontsize=10,
         rotation=90, va="top", ha="right")
axL.set_xlim(0.92, 3.0); axL.set_ylim(-1.75, 1.2)
axL.set_xlabel(r"separation  $r / \sigma$")
axL.set_ylabel(r"pair energy  $v(r) / \varepsilon$")
axL.set_title("Lennard-Jones pair potential", fontsize=11)

# ---- (b) coordination on a close-packed patch ----
axR.axis("off"); axR.set_aspect("equal")
pts = []
R = 3                                   # hexagon of side R+1 atoms
for i in range(-R, R + 1):
    for j in range(-R, R + 1):
        if abs(i + j) > R:
            continue
        pts.append((i + 0.5 * j, j * np.sqrt(3) / 2))
pts = np.array(pts)
d = np.linalg.norm(pts[:, None, :] - pts[None, :, :], axis=-1)
Zc = ((d > 0.1) & (d < 1.2)).sum(1)

for a in range(len(pts)):
    for b in range(a + 1, len(pts)):
        if d[a, b] < 1.2:
            axR.plot(*zip(pts[a], pts[b]), color=st.GRAY, lw=0.9, alpha=0.55, zorder=1)
face = {6: st.BLUE, 4: st.ACCENT, 3: st.GOLD}
for (x, y), z in zip(pts, Zc):
    axR.add_patch(Circle((x, y), 0.30, facecolor=face.get(z, st.GRAY),
                         edgecolor="none", zorder=2))
    axR.text(x, y, str(z), color="white", fontsize=9, ha="center", va="center",
             zorder=3, fontweight="bold")

def label(xy, text, dxy, color):
    axR.annotate(text, xy=xy, xytext=(xy[0] + dxy[0], xy[1] + dxy[1]),
                 fontsize=10.5, color=color, ha="center", va="center",
                 arrowprops=dict(arrowstyle="-", color=color, lw=1.0))

label(pts[Zc.argmin()], "corner atom\n$Z=3$,  $E=-1.5\\,\\varepsilon$", (-1.9, -1.2), st.GOLD)
edge = [k for k, z in enumerate(Zc) if z == 4]
edge_pt = pts[max(edge, key=lambda k: pts[k][1])]
label(edge_pt, "edge atom\n$Z=4$,  $E=-2\\,\\varepsilon$", (1.2, 1.1), st.ACCENT)
label((0.5, -0.87), "interior atom\n$Z=6$,  $E=-3\\,\\varepsilon$", (2.9, -2.2), st.BLUE)
axR.set_xlim(-5.4, 6.6); axR.set_ylim(-4.6, 4.2)
axR.set_title("bond counting on a close-packed patch\n(labels are the coordination $Z$)",
              fontsize=11)

fig.tight_layout()
st.save(fig, "lj-coordination.svg"); plt.close(fig)

# ---- broken bonds on fcc (111), (100), (110) ----
# Cu: cohesive energy per atom and lattice parameter.
Ec, a = 3.49, 0.3615e-9          # eV, m
Z = 12
planes = [
    ("(111)", 3, np.sqrt(3) / 4),   # broken bonds per surface atom, area / a^2
    ("(100)", 4, 0.5),
    ("(110)", 6, 1 / np.sqrt(2)),
]
gam = [(zs / Z) * Ec * 1.602e-19 / (f * a**2) for _, zs, f in planes]

fig, axes = plt.subplots(1, 4, figsize=(10.6, 3.3),
                         gridspec_kw={"width_ratios": [1, 1, 1, 1.1]})
for ax, (name, zs, f) in zip(axes[:3], planes):
    ax.axis("off"); ax.set_aspect("equal")
    ax.set_xlim(-0.6, 5.9); ax.set_ylim(-0.9, 2.4)
    # Two rows of atoms, cut at the top. The in-plane spacing follows the area
    # per surface atom, so the more open planes are drawn more open.
    d = np.sqrt(f / (np.sqrt(3) / 4))
    top = [(x * d, 1.0) for x in range(5)]
    bot = [((x + 0.5) * d, 0.1) for x in range(4)]
    for (x, y) in top + bot:
        ax.add_patch(Circle((x, y), 0.34, facecolor=st.BLUE if y < 0.5 else st.ACCENT,
                            edgecolor="none", zorder=3))
    for (x, y) in top:                       # bonds down into the bulk
        for (x2, y2) in bot:
            if abs(x2 - x) < 0.9 * d:
                ax.plot([x, x2], [y, y2], color=st.GRAY, lw=1.2, zorder=1)
    for (x, y) in top[:-1]:                  # bonds along the surface
        ax.plot([x, x + d], [y, y], color=st.GRAY, lw=1.2, zorder=1)
    for (x, y) in top:                       # the broken bonds, drawn as stubs
        for k in range(zs):
            th = np.radians(55 + k * (70 / max(zs - 1, 1)))
            ax.plot([x, x + 0.62 * np.cos(th)], [y, y + 0.62 * np.sin(th)],
                    color=st.GOLD, lw=1.6, zorder=2)
    ax.set_title("%s\n%d broken bonds per atom\narea $%.3f\\,a^2$ per atom"
                 % (name, zs, f), fontsize=10.5)

ax = axes[3]
ax.bar([p[0] for p in planes], gam, color=[st.ACCENT, st.BLUE, st.GOLD], width=0.6)
for i, g in enumerate(gam):
    ax.text(i, g + 0.05, "%.1f" % g, ha="center", fontsize=10.5)
ax.set_ylabel(r"$\gamma$  (J/m$^2$)")
ax.set_ylim(0, max(gam) * 1.25)
ax.set_title("broken-bond estimate for Cu\n$\\gamma = (Z_s/Z)\\,E_c/A_s$", fontsize=10.5)
fig.suptitle("Bond counting on the low-index fcc surfaces (gold stubs are the broken bonds)",
             fontsize=11, y=1.03)
fig.tight_layout()
st.save(fig, "fcc-broken-bonds.svg"); plt.close(fig)
