"""Computed physics figures: kinematic factor, fluorescence yield, reduced
stopping powers, and the surface-energy vs sublimation-heat correlation."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import matplotlib.pyplot as plt
import figstyle as st
st.apply()

# ---- 1. kinematic factor vs target mass for He at several angles ----
def K(M2, theta, M1=4.0026):
    th = np.radians(theta)
    return ((M1*np.cos(th) + np.sqrt(M2**2 - M1**2*np.sin(th)**2)) / (M1+M2))**2

M2 = np.linspace(6, 220, 500)
fig, ax = plt.subplots(figsize=(6.4, 4.2))
for theta, c in [(90, st.GOLD), (120, st.GREEN), (150, st.BLUE), (170, st.ACCENT)]:
    ax.plot(M2, K(M2, theta), color=c, lw=2, label=f"θ = {theta}°")
for el, m in [("C", 12), ("O", 16), ("Si", 28), ("Fe", 56), ("Ag", 108), ("Au", 197)]:
    ax.axvline(m, color=st.GRAY, alpha=0.25, lw=0.8)
    ax.text(m, 1.015, el, ha="center", fontsize=10)
ax.set_xlabel("target mass $M_2$ (u)")
ax.set_ylabel("kinematic factor $K$")
ax.set_ylim(0, 1.06); ax.set_xlim(0, 220)
ax.legend(loc="lower right")
ax.set_title("He projectile: backscattered energy $E_1 = K E_0$")
st.save(fig, "kinematic-factor.svg"); plt.close(fig)

# ---- 2. K-shell fluorescence yield vs Z ----
Z = np.arange(4, 80)
a = 1.12e6
wK = Z**4 / (a + Z**4.0)
fig, ax = plt.subplots(figsize=(6.2, 4.0))
ax.plot(Z, wK, color=st.ACCENT, lw=2.2, label="X-ray emission  $\\omega_K$")
ax.plot(Z, 1 - wK, color=st.BLUE, lw=2.2, label="Auger emission  $1-\\omega_K$")
for el, z in [("C", 6), ("O", 8), ("Si", 14), ("Ti", 22), ("Cu", 29), ("Ge", 32), ("Zr", 40)]:
    ax.axvline(z, color=st.GRAY, alpha=0.25, lw=0.8)
    ax.text(z, 1.03, el, ha="center", fontsize=10)
ax.set_xlabel("atomic number $Z$")
ax.set_ylabel("K-shell yield per core hole")
ax.set_ylim(0, 1.1); ax.set_xlim(4, 79)
ax.legend(loc="center right")
st.save(fig, "fluorescence-yield.svg"); plt.close(fig)

# ---- 3. reduced stopping powers (universal ZBL nuclear + LSS electronic) ----
def sn_zbl(eps):
    eps = np.asarray(eps, float)
    lo = np.log1p(1.1383*eps) / (2*(eps + 0.01321*eps**0.21226 + 0.19593*np.sqrt(eps)))
    hi = np.log(np.where(eps > 0, eps, 1)) / (2*eps)
    return np.where(eps < 30, lo, hi)

eps = np.logspace(-3, 3, 400)
fig, ax = plt.subplots(figsize=(6.4, 4.2))
ax.loglog(eps, sn_zbl(eps), color=st.ACCENT, lw=2.2, label="nuclear (ZBL universal)")
for k, ls in [(0.15, "-"), (0.4, "--")]:
    ax.loglog(eps, k*np.sqrt(eps), color=st.BLUE, lw=2, ls=ls,
              label=f"electronic, $k$ = {k} (LSS)")
ax.axvspan(1e-3, 0.3, color=st.GOLD, alpha=0.08)
ax.text(2.2e-3, 0.62, "sputtering,\nimplantation,\nFIB", fontsize=10)
ax.text(70, 0.62, "RBS regime\n(electronic\ndominates)", fontsize=10)
ax.set_xlabel("reduced energy  $\\varepsilon$")
ax.set_ylabel("reduced stopping  $S(\\varepsilon)$")
ax.set_ylim(3e-3, 3); ax.legend(loc="lower left", fontsize=10)
ax.set_title("one universal curve for every ion-target pair")
st.save(fig, "reduced-stopping.svg"); plt.close(fig)

# ---- 4. surface energy vs heat of sublimation (representative values) ----
data = [  # gamma J/m2 (approx), dHsub kJ/mol (approx), label
    ("Pb", 0.59, 195), ("Ag", 1.25, 285), ("Al", 1.14, 330), ("Au", 1.50, 368),
    ("Cu", 1.79, 337), ("Ni", 2.38, 430), ("Fe", 2.42, 415), ("Ti", 2.10, 470),
    ("Pt", 2.48, 565), ("Mo", 3.00, 658), ("W", 3.68, 860),
]
fig, ax = plt.subplots(figsize=(6.0, 4.2))
xs = [d[2] for d in data]; ys = [d[1] for d in data]
ax.scatter(xs, ys, s=46, color=st.ACCENT, zorder=3)
OFF = {"Fe": (-24, 2), "Ni": (8, -6), "Cu": (7, 4)}
for name, g, h in data:
    dx, dy = OFF.get(name, (7, -3))
    ax.annotate(name, (h, g), textcoords="offset points", xytext=(dx, dy), fontsize=11)
p = np.polyfit(xs, ys, 1)
xf = np.linspace(150, 900, 10)
ax.plot(xf, np.polyval(p, xf), color=st.GRAY, lw=1.2, ls="--", zorder=2)
ax.set_xlabel("heat of sublimation (kJ/mol)")
ax.set_ylabel("surface energy $\\gamma$ (J/m$^2$)")
ax.set_title("the same bonds: break some (surface) or all (sublime)")
st.save(fig, "gamma-vs-sublimation.svg"); plt.close(fig)
print("batch 1 done")
