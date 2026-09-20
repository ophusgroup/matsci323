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
         fontsize=12, ha="left", va="center")
# sigma crossing
axL.plot([1.0], [0], "o", color=st.GRAY, ms=5)
axL.text(1.0, 0.18, r"$\sigma$", color=st.TEXT, fontsize=12, ha="center")
axL.axvline(2 * r0, color=st.GREEN, lw=1.4, ls="--")
axL.text(2 * r0 - 0.06, 0.95, "cutoff $2r_0$", color=st.GREEN, fontsize=11,
         rotation=90, va="top", ha="right")
axL.set_xlim(0.92, 3.0); axL.set_ylim(-1.75, 1.2)
axL.set_xlabel(r"separation  $r / \sigma$")
axL.set_ylabel(r"pair energy  $v(r) / \varepsilon$")
axL.set_title("Lennard-Jones pair potential", fontsize=12)

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
    axR.text(x, y, str(z), color="white", fontsize=10.5, ha="center", va="center",
             zorder=3, fontweight="bold")

def label(xy, text, dxy, color):
    axR.annotate(text, xy=xy, xytext=(xy[0] + dxy[0], xy[1] + dxy[1]),
                 fontsize=11.5, color=color, ha="center", va="center",
                 arrowprops=dict(arrowstyle="-", color=color, lw=1.0))

label(pts[Zc.argmin()], "corner atom\n$Z=3$,  $E=-1.5\\,\\varepsilon$", (-1.9, -1.2), st.GOLD)
edge = [k for k, z in enumerate(Zc) if z == 4]
edge_pt = pts[max(edge, key=lambda k: pts[k][1])]
label(edge_pt, "edge atom\n$Z=4$,  $E=-2\\,\\varepsilon$", (1.2, 1.1), st.ACCENT)
label((0.5, -0.87), "interior atom\n$Z=6$,  $E=-3\\,\\varepsilon$", (2.9, -2.2), st.BLUE)
axR.set_xlim(-5.4, 6.6); axR.set_ylim(-4.6, 4.2)
axR.set_title("bond counting on a close-packed patch\n(labels are the coordination $Z$)",
              fontsize=12)

fig.tight_layout()
st.save(fig, "lj-coordination.svg"); plt.close(fig)

# ---- broken bonds on the real fcc (111), (100) and (110) surfaces ----
# The crystal is built, cut on each plane, and drawn twice: looking down the
# normal, which shows the real surface mesh and how open the plane is, and from
# the side, which shows the layer stacking and the bonds the cut removed.
# Coordination is counted against the half crystal rather than assumed.
Ec, a_Cu, Z = 3.49, 0.3615e-9, 12          # Cu: eV per atom, m, bulk coordination
DNN = 1 / np.sqrt(2)                        # nearest-neighbor distance, units of a
RAD = DNN / 2                               # touching hard spheres

_cells = range(-8, 9)
_basis = np.array([[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]])
LATTICE = np.array([b + [i, j, k] for i in _cells for j in _cells
                    for k in _cells for b in _basis])


def surface_frame(n):
    """Rotation taking the plane normal n onto z, so the cut plane is z = 0."""
    e3 = np.array(n, float); e3 /= np.linalg.norm(e3)
    t = np.array([0, 0, 1.0]) if abs(e3[2]) < 0.9 else np.array([1.0, 0, 0])
    e1 = np.cross(t, e3); e1 /= np.linalg.norm(e1)
    return np.vstack([e1, np.cross(e3, e1), e3])


def cut(normal):
    """The half crystal, its layer positions, and the atom at the origin."""
    half = LATTICE @ surface_frame(normal).T
    half = half[half[:, 2] < 1e-9]
    zs = np.unique(np.round(half[:, 2], 6))[::-1]
    top = half[np.abs(half[:, 2]) < 1e-6]
    centre = top[np.argmin(np.hypot(top[:, 0], top[:, 1]))]
    return half, zs, centre


def mesh_vectors(half, centre):
    top = half[np.abs(half[:, 2]) < 1e-6] - centre
    top = top[(np.linalg.norm(top, axis=1) > 1e-6) & (np.linalg.norm(top, axis=1) < 1.3)]
    top = top[np.argsort(np.linalg.norm(top, axis=1))]
    v1 = top[0]
    v2 = next(v for v in top if abs(v1[0] * v[1] - v1[1] * v[0]) > 1e-6)
    return v1, v2, abs(v1[0] * v2[1] - v1[1] * v2[0])


def missing_bonds(normal, centre):
    v = LATTICE @ surface_frame(normal).T - centre
    r = np.linalg.norm(v, axis=1)
    return v[(r > 1e-6) & (r < DNN * 1.02) & (v[:, 2] > 1e-6)]


FACE = [st.ACCENT, st.BLUE, st.GRAY]
ALPHA = [1.0, 0.8, 0.45]


def plan_view(ax, normal, w=1.45):
    half, zs, centre = cut(normal)
    dz = abs(zs[1] - zs[0])
    sel = half[(half[:, 2] > zs[2] - 1e-6) & (np.abs(half[:, 0]) < w + RAD)
               & (np.abs(half[:, 1]) < w + RAD)]
    for p in sel[np.argsort(sel[:, 2])]:                 # deepest first
        li = int(round((zs[0] - p[2]) / dz))
        ax.add_patch(Circle(p[:2], RAD, facecolor=FACE[min(li, 2)],
                            alpha=ALPHA[min(li, 2)], edgecolor="white", lw=0.6))
    v1, v2, area = mesh_vectors(half, centre)
    corners = np.array([centre, centre + v1, centre + v1 + v2, centre + v2, centre])
    ax.plot(corners[:, 0], corners[:, 1], color=st.GREEN, lw=2.0, ls="--", zorder=6)
    ax.add_patch(Circle(centre[:2], RAD, facecolor="none", edgecolor=st.GOLD,
                        lw=2.2, zorder=7))
    for v in missing_bonds(normal, centre):          # where the lost neighbors sat
        ax.add_patch(Circle((centre[0] + v[0], centre[1] + v[1]), 0.15,
                            facecolor=st.GOLD, edgecolor="white", lw=1.0, zorder=8))
    ax.set_xlim(-w, w); ax.set_ylim(-w, w)
    ax.set_aspect("equal"); ax.axis("off")
    return area, dz


SHEAR = 0.45          # oblique side view, so bonds behind each other separate


def side_view(ax, normal, w=1.55, nlayers=3):
    half, zs, centre = cut(normal)
    dz = abs(zs[1] - zs[0])
    sel = half[(half[:, 2] > zs[nlayers - 1] - 1e-6) & (np.abs(half[:, 0]) < w + RAD)
               & (np.abs(half[:, 1]) < 0.30)]
    for p in sel[np.argsort(-sel[:, 1])]:                # farthest row first
        li = int(round((zs[0] - p[2]) / dz))
        fade = 1.0 if abs(p[1]) < 1e-6 else 0.35
        ax.add_patch(Circle((p[0] + SHEAR * p[1], p[2]), RAD, facecolor=FACE[min(li, 2)],
                            alpha=ALPHA[min(li, 2)] * fade, edgecolor="white", lw=0.6))
    cx = centre[0] + SHEAR * centre[1]
    ax.add_patch(Circle((cx, centre[2]), RAD, facecolor=st.ACCENT,
                        edgecolor=st.GOLD, lw=2.2, zorder=6))
    ax.annotate("", xy=(w + 0.18, 0), xytext=(w + 0.18, -dz),
                arrowprops=dict(arrowstyle="<|-|>", color=st.TEXT, lw=1.0))
    ax.text(w + 0.3, -dz / 2, "$d$", fontsize=12, ha="left", va="center", color=st.TEXT)
    ax.set_xlim(-w - 0.1, w + 0.95); ax.set_ylim(-(nlayers - 0.35) * dz, 1.05)
    ax.set_aspect("equal"); ax.axis("off")


PLANES = [("(111)", (1, 1, 1)), ("(100)", (0, 0, 1)), ("(110)", (1, 1, 0))]
BROKEN_PER_CELL = {"(111)": 3, "(100)": 4, "(110)": 6}

fig = plt.figure(figsize=(11.6, 6.0))
gs = fig.add_gridspec(2, 4, width_ratios=[1, 1, 1, 1.05], height_ratios=[1, 0.85],
                      hspace=0.02, wspace=0.28)
areas = {}
for c, (label, normal) in enumerate(PLANES):
    axp = fig.add_subplot(gs[0, c])
    area, dz = plan_view(axp, normal)
    areas[label] = area
    half, zs, centre = cut(normal)
    r = np.linalg.norm(half - centre, axis=1)
    coord = int(((r > 1e-6) & (r < DNN * 1.02)).sum())
    axp.set_title("fcc %s" % label, fontsize=14)
    axs = fig.add_subplot(gs[1, c])
    side_view(axs, normal)
    axs.text(0, -2.95 * dz, "keeps %d of 12 bonds,\n%d broken per surface atom\n"
             "mesh %.3f $a^2$, $d$ = %.3f $a$"
             % (coord, 12 - coord, area, dz), fontsize=12, ha="center", va="top",
             color=st.TEXT, transform=axs.transData)

fig.text(0.012, 0.70, "down the normal", fontsize=12, color=st.TEXT,
         rotation=90, va="center", ha="center")
fig.text(0.012, 0.34, "from the side", fontsize=12, color=st.TEXT,
         rotation=90, va="center", ha="center")
fig.text(0.035, 0.02,
         "Red is the top layer, blue the second, grey the third. Green dashes are the 1x1 surface mesh.\n"
         "Gold discs mark where the lost neighbors of the outlined atom would sit, seen from above; on "
         "(110) one of them is directly overhead.\n"
         "The (110) trough exposes the second layer as well, which breaks one more bond, so its 1x1 cell "
         "breaks 6 rather than the 5 its top atom loses.",
         fontsize=12, color=st.TEXT, va="bottom")

ax = fig.add_subplot(gs[:, 3])
gam = [BROKEN_PER_CELL[l] / Z * Ec * 1.602e-19 / (areas[l] * a_Cu**2) for l, _ in PLANES]
ax.bar([l for l, _ in PLANES], gam, color=[st.ACCENT, st.BLUE, st.GOLD], width=0.6)
for i, g in enumerate(gam):
    ax.text(i, g + 0.06, "%.1f" % g, ha="center", fontsize=13)
ax.set_ylabel(r"$\gamma$  (J/m$^2$)")
ax.set_ylim(0, max(gam) * 1.3)
ax.set_title("broken-bond estimate for Cu\n$\\gamma = (Z_s/Z)\\,E_c/A_s$,\n"
             "$Z_s$ per 1x1 cell", fontsize=12)
fig.subplots_adjust(left=0.035, right=0.985, top=0.92, bottom=0.17)
st.save(fig, "fcc-broken-bonds.svg"); plt.close(fig)
print("mesh areas:", {k: round(v, 3) for k, v in areas.items()})
