"""Shared style for MATSCI 323 static figures.

Transparent background with mid-tone grays so figures read on both the light
and dark site themes; accent colors match the site (crimson + steel blue).
Run any make_*.py from the repo root:  .venv python scripts/figures/make_x.py
"""
import matplotlib as mpl

ACCENT = "#c00000"
BLUE = "#3a62b8"
GOLD = "#c98f00"
GREEN = "#3f8f5f"
GRAY = "#888888"
TEXT = "#8a8a8a"       # readable on white and near-black backgrounds

def apply():
    mpl.rcParams.update({
        "figure.facecolor": "none",
        "axes.facecolor": "none",
        "savefig.facecolor": "none",
        "savefig.transparent": True,
        "font.family": "sans-serif",
        "font.size": 12,
        "axes.edgecolor": GRAY,
        "axes.labelcolor": TEXT,
        "axes.titlecolor": TEXT,
        "xtick.color": GRAY,
        "ytick.color": GRAY,
        "xtick.labelcolor": TEXT,
        "ytick.labelcolor": TEXT,
        "text.color": TEXT,
        "axes.grid": True,
        "grid.color": GRAY,
        "grid.alpha": 0.22,
        "grid.linewidth": 0.6,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "legend.frameon": False,
        # Render text as paths: the browser would otherwise substitute its own
        # font under matplotlib's per-glyph positions and wreck the kerning.
        "svg.fonttype": "path",
    })

def save(fig, name):
    out = "assets/figures/" + name
    fig.savefig(out, bbox_inches="tight")
    print("wrote", out)
