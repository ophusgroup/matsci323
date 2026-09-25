"""Field ion microscopy: how the image forms, and a simulated ring pattern.

    /Users/cophus/repos/quantem/.venv/bin/python scripts/figures/make_fim.py

The right panel is a real calculation: a bcc tungsten crystal is cut to a
hemispherical apex, the atoms that protrude at terrace edges are selected by
coordination, and their directions are projected stereographically the way the
ion trajectories project onto the screen.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Wedge
import figstyle as fs

fs.apply()

A_W = 3.165          # tungsten lattice parameter, angstrom
NN = A_W * np.sqrt(3) / 2 * 1.15   # first-neighbour cutoff with margin


def tip_atoms(radius, axis=(0, 1, 1)):
    """bcc lattice cut to a sphere, rotated so `axis` points at the screen."""
    n = int(radius / A_W) + 2
    g = np.arange(-n, n + 1) * A_W
    X, Y, Z = np.meshgrid(g, g, g, indexing="ij")
    corner = np.stack([X, Y, Z], -1).reshape(-1, 3)
    body = corner + A_W / 2
    pts = np.vstack([corner, body])
    pts = pts[np.linalg.norm(pts, axis=1) <= radius]
    e3 = np.array(axis, float); e3 /= np.linalg.norm(e3)
    t = np.array([1.0, 0, 0]) if abs(e3[0]) < 0.9 else np.array([0, 0, 1.0])
    e1 = np.cross(t, e3); e1 /= np.linalg.norm(e1)
    e2 = np.cross(e3, e1)
    return pts @ np.vstack([e1, e2, e3]).T


def coordination(pts):
    """Neighbour count, computed in blocks so the pair matrix stays small."""
    c = np.zeros(len(pts), int)
    for i in range(0, len(pts), 2000):
        d = np.linalg.norm(pts[i:i + 2000, None, :] - pts[None, :, :], axis=-1)
        c[i:i + 2000] = ((d < NN) & (d > 0.1)).sum(1)
    return c


def fim_image(ax, radius=52.0, theta_max=np.deg2rad(52)):
    pts = tip_atoms(radius)
    co = coordination(pts)
    r = np.linalg.norm(pts, axis=1)
    surf = r > radius - NN                      # only the outermost shell shows
    theta = np.arccos(np.clip(pts[:, 2] / np.maximum(r, 1e-9), -1, 1))
    keep = surf & (theta < theta_max) & (co <= 6)   # protruding edge atoms
    p, co_k, th = pts[keep], co[keep], theta[keep]
    rho = 2 * np.tan(th / 2)                    # stereographic, as the ions project
    phi = np.arctan2(p[:, 1], p[:, 0])
    # the fewer neighbours, the further the atom protrudes, the brighter it images
    size = np.interp(co_k, [3, 6], [26, 7])
    ax.scatter(rho * np.cos(phi), rho * np.sin(phi), s=size, c=fs.ACCENT,
               alpha=0.85, linewidths=0)
    lim = 2 * np.tan(theta_max / 2)
    ax.add_patch(Circle((0, 0), lim, facecolor="none", edgecolor=fs.GRAY, lw=1.2))
    ax.set_xlim(-lim * 1.08, lim * 1.08); ax.set_ylim(-lim * 1.08, lim * 1.08)
    ax.set_aspect("equal"); ax.axis("off")
    ax.text(0, lim * 1.02, "(011) pole at the centre", ha="center", va="bottom",
            fontsize=11.5, color=fs.TEXT)
    ax.text(0, -lim * 1.16, "Simulated image: each ring is one crystal plane,\n"
            "each spot an atom at a terrace edge", ha="center", va="top",
            fontsize=11.5, color=fs.TEXT)


def mechanism(ax):
    """Cross-section of the apex: gas in, ionization over the protruding atoms,
    ion out along the radius."""
    ax.set_xlim(-7.2, 7.2); ax.set_ylim(-1.7, 8.8); ax.axis("off")
    ax.set_aspect("equal")
    R, step = 4.0, 0.62
    for y in np.arange(0, R - 0.2, step):          # dome: narrows upward
        half = np.sqrt(max(R**2 - y**2, 0.04))
        xs = np.arange(-half, half + 0.01, step)
        for x in xs:
            edge = x in (xs.min(), xs.max())
            ax.add_patch(Circle((x, y), 0.27,
                                facecolor=fs.ACCENT if edge else fs.GRAY,
                                alpha=0.55 if edge else 0.28,
                                edgecolor=fs.ACCENT if edge else fs.GRAY, lw=1.0))
    ax.text(0, -0.95, "terraced apex, radius $r$; the edge atoms protrude",
            ha="center", fontsize=11.5, color=fs.TEXT)

    ax.add_patch(Wedge((0, 0), R + 1.35, 8, 172, width=0.42, facecolor=fs.GOLD,
                       alpha=0.40, edgecolor="none"))
    ax.text(0.2, R + 2.35, "ionization zone, 0.4 nm out",
            ha="center", va="bottom", fontsize=11.5, color=fs.GOLD)
    ax.annotate("", xy=(0.2, R + 1.5), xytext=(0.2, R + 2.3),
                arrowprops=dict(arrowstyle="->", color=fs.GOLD, lw=1.0))

    hop = np.array([[-6.9, 6.4], [-5.8, 5.0], [-4.9, 3.6], [-4.2, 2.4],
                    [-3.7, 1.5]])
    ax.plot(hop[:, 0], hop[:, 1], color=fs.BLUE, lw=1.2, ls=":")
    ax.plot(hop[0, 0], hop[0, 1], "o", ms=6, color=fs.BLUE)
    ax.text(-7.0, 6.9, "imaging gas (He, Ne),\npolarized and drawn in",
            ha="left", va="bottom", fontsize=11.5, color=fs.BLUE)

    ang = np.deg2rad(52)
    d = np.array([np.sin(ang), np.cos(ang)])
    ax.annotate("", xy=tuple(d * 8.4), xytext=tuple(d * (R + 1.7)),
                arrowprops=dict(arrowstyle="->", color=fs.ACCENT, lw=1.8))
    ax.text(7.2, 8.6, "ion, straight out\nalong the radius\nto the screen",
            ha="right", va="top", fontsize=11.5, color=fs.ACCENT)


def main():
    fig, (axL, axR) = plt.subplots(1, 2, figsize=(12.0, 5.4),
                                   gridspec_kw=dict(width_ratios=[1, 1]))
    mechanism(axL)
    fim_image(axR)
    fig.subplots_adjust(wspace=0.05)
    fs.save(fig, "fim-image.svg")
    plt.close(fig)


if __name__ == "__main__":
    main()
