"""Simulation-derived figures: RBS spectrum formation, SEM interaction
volumes at three voltages, AFM force-distance curve, EELS spectrum anatomy."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import matplotlib.pyplot as plt
import figstyle as st
st.apply()
rng = np.random.default_rng(7)

# ---- 1. RBS spectrum formation: stack diagram + spectrum with mapping arrows ----
# physics matches the site widget: K factors, Z^2/E^2, approximate stopping
def kfac(M2, theta=165, M1=4.0026):
    th = np.radians(theta)
    return ((M1*np.cos(th) + np.sqrt(M2**2 - M1**2*np.sin(th)**2)) / (M1+M2))**2

ELEM = {"Au": (196.97, 79, 59.0, 115), "Cu": (63.55, 29, 84.9, 68), "Si": (28.09, 14, 49.9, 46)}
def spectrum(stack, E0=2000e3):
    nb, Emax = 1024, 2100.0
    bins = np.zeros(nb)
    Ein, outAbove = E0, 0.0
    cos_out = np.cos(np.radians(15))
    for el, t in stack:
        M, Zt, n, eps = ELEM[el]
        K = kfac(M)
        sIn = eps*n*0.1; sOut = sIn/cos_out
        x = np.arange(0, t, 1.0)
        E = Ein - sIn*x
        ok = E > 2e5
        Edet = (K*E - sOut*x - outAbove)[ok]/1000.0
        w = Zt**2/(E[ok]/1e6)**2 * n
        idx = (Edet/Emax*nb).astype(int)
        for i, ww in zip(idx, w):
            if 0 <= i < nb: bins[i] += ww
        Ein = E[-1] if len(E) else Ein
        outAbove += sOut*min(len(x), t)
        if Ein < 2e5: break
    # 15 keV detector resolution
    sig = 6.4/(Emax/nb)
    kx = np.arange(-3*int(sig), 3*int(sig)+1)
    kern = np.exp(-kx**2/(2*sig**2)); kern /= kern.sum()
    return np.convolve(bins, kern, mode="same"), Emax

stack = [("Au", 60), ("Cu", 150), ("Si", 3000)]
sp, Emax = spectrum(stack)
sp /= sp.max()
fig, (axs, axp) = plt.subplots(2, 1, figsize=(6.8, 5.6),
    gridspec_kw={"height_ratios": [1, 2.6], "hspace": 0.45})
# stack diagram
colors = {"Au": st.GOLD, "Cu": "#b87333", "Si": "#7a6ea8"}
x0 = 0
for el, t in stack:
    wdt = 3.5 if t >= 3000 else t/60
    axs.barh(0, wdt, left=x0, color=colors[el], edgecolor="none", height=0.7)
    axs.text(x0 + wdt/2, 0, el, ha="center", va="center", color="white", fontsize=13, weight="bold")
    x0 += wdt
axs.annotate("2 MeV He beam", xy=(0, 0), xytext=(-2.6, 0), fontsize=12,
             va="center", arrowprops=dict(arrowstyle="->", color=st.ACCENT, lw=2))
axs.set_xlim(-2.8, x0+0.2); axs.set_ylim(-0.8, 0.8)
axs.axis("off"); axs.set_title("60 nm Au / 150 nm Cu / Si substrate", fontsize=12)
# spectrum
E = np.linspace(0, Emax, len(sp))
axp.fill_between(E, sp, color=st.ACCENT, alpha=0.15)
axp.plot(E, sp, color=st.ACCENT, lw=1.8)
for el, (M, Zt, n, eps) in ELEM.items():
    KE = kfac(M)*2000
    axp.plot([KE, KE], [0, 0.97], color=st.GRAY, lw=0.9, ls="--", alpha=0.7)
    axp.text(KE, 1.04, f"$K_{{{el}}}E_0$", ha="center", fontsize=12)
axp.set_xlabel("detected energy (keV)")
axp.set_ylabel("yield (arb.)")
axp.set_xlim(300, 2000); axp.set_ylim(0, 1.15)
axp.text(1925, 0.55, "Au\n(width =\n60 nm)", ha="center", fontsize=11)
axp.text(1300, 0.75, "Cu\n(shifted below $K_{Cu}E_0$\nby the Au overlayer)", ha="center", fontsize=11)
axp.text(700, 0.55, "Si substrate\n(continuum)", ha="center", fontsize=11)
st.save(fig, "rbs-formation.svg"); plt.close(fig)

# ---- 2. SEM interaction volumes at 5, 15, 30 kV in Si (validated MC port) ----
def trajectory(Z, A, rho, E0):
    J = (9.76*Z + 58.5*Z**-0.19)*1e-3
    E, x, y, z = E0, 0.0, 0.0, 0.0
    cx, cy, cz = 0.0, 0.0, 1.0
    pts = [(0.0, 0.0)]
    for _ in range(3000):
        if E < 0.2: break
        al = 3.4e-3*Z**0.67/E
        sg = 5.21e-21*(Z*Z/(E*E))*(4*np.pi/(al*(1+al)))*((E+511)/(E+1024))**2
        lam = A/(6.022e23*rho*sg)*1e4
        s = -lam*np.log(rng.random())
        E -= 78500*(Z*rho/(A*E))*np.log(1.166*(E+0.85*J)/J)*1e-4*s
        x += cx*s; y += cy*s; z += cz*s
        pts.append((x, z))
        if z < 0: break
        R = rng.random()
        ct = 1 - 2*al*R/(1+al-R)
        stq = np.sqrt(max(0, 1-ct*ct)); ph = 2*np.pi*rng.random()
        cf, sf = np.cos(ph), np.sin(ph)
        if abs(cz) > 0.99999:
            cx, cy, cz = stq*cf, stq*sf, ct*np.sign(cz)
        else:
            sq = np.sqrt(1-cz*cz)
            cx, cy, cz = (cx*ct + stq*(cx*cz*cf-cy*sf)/sq,
                          cy*ct + stq*(cy*cz*cf+cx*sf)/sq,
                          cz*ct - sq*stq*cf)
    return pts

fig, axes = plt.subplots(1, 3, figsize=(9.6, 3.6), sharey=False)
for ax, E0 in zip(axes, [5, 15, 30]):
    RKO = 0.0276*28.09*E0**1.67/(14**0.89*2.33)
    lim = 1.35*RKO
    for _ in range(70):
        pts = np.array(trajectory(14, 28.09, 2.33, E0))
        bse = pts[-1, 1] < 0
        ax.plot(pts[:, 0], pts[:, 1],
                color=st.ACCENT if bse else st.BLUE,
                alpha=0.75 if bse else 0.22, lw=0.7)
    ax.axhline(0, color=st.GRAY, lw=1)
    ax.set_xlim(-lim, lim); ax.set_ylim(lim, -0.12*lim)
    ax.set_title(f"{E0} kV   ($R_{{KO}}$ = {RKO:.2f} µm)", fontsize=12)
    ax.set_xlabel("µm"); ax.grid(alpha=0.12)
axes[0].set_ylabel("depth (µm)")
fig.suptitle("electron trajectories in silicon (red = backscattered)", y=1.04, fontsize=12)
st.save(fig, "interaction-volume.svg"); plt.close(fig)

# ---- 3. AFM force-distance curve with snap-in and adhesion hysteresis ----
# sphere-plane van der Waals + short-range repulsion; cantilever k line
H, R = 1e-19, 20e-9          # Hamaker (J), tip radius (m)
z0 = 0.25e-9
def Fts(d):
    d = np.maximum(d, 0.05e-9)
    return -H*R/(6*d**2) * (1 - (z0/d)**6)   # attractive + steep repulsion
k = 0.6                                       # N/m soft contact lever
zc = np.linspace(12e-9, -1.2e-9, 900)         # cantilever base position
dgrid = np.linspace(0.06e-9, 15e-9, 40000)
def sweep(zs):
    # quasi-static balance d = z + F(d)/k, solved exactly by locating the
    # sign changes of g(d) = d - z - F(d)/k and following the branch closest
    # to the previous solution; branch disappearance IS snap-in / pull-off
    ds = []
    dprev = zs[0]
    Fg = Fts(dgrid)/k
    for z in zs:
        g = dgrid - z - Fg
        s = np.where(np.diff(np.sign(g)) != 0)[0]
        if len(s):
            roots = dgrid[s]
            dprev = roots[np.argmin(np.abs(roots - dprev))]
        ds.append(dprev)
    ds = np.array(ds)
    return ds, Fts(ds)
dA, FA = sweep(zc)
dR, FR = sweep(zc[::-1])
fig, ax = plt.subplots(figsize=(6.4, 4.3))
ax.plot(zc*1e9, FA*1e9, color=st.BLUE, lw=2, label="approach")
ax.plot(zc[::-1]*1e9, FR*1e9, color=st.ACCENT, lw=2, label="retract")
ax.axhline(0, color=st.GRAY, lw=0.8)
ax.set_xlabel("cantilever base position (nm)  →  approaching")
ax.set_ylabel("force on tip (nN)")
ax.invert_xaxis()
ax.legend(loc="lower left")
ax.annotate("snap-in\n(gradient exceeds k)", xy=(2.0, -0.55), xytext=(6.5, -1.15),
            fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
ax.annotate("pull-off = adhesion", xy=(4.4, -2.45), xytext=(7.6, -2.75),
            fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
ax.annotate("repulsive contact\n(imaging setpoints live here)", xy=(-0.75, 0.75), xytext=(9.5, 1.5),
            fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
ax.set_ylim(-3, 2.6)
st.save(fig, "force-curve.svg"); plt.close(fig)

# ---- 4. EELS spectrum anatomy: broken axis, phonons + plasmons + core edge ----
# Three energy windows on one log-intensity scale; the axis breaks step the
# energy unit from meV to eV so the meV-scale phonon losses stay visible.
def g(x, mu, s): return np.exp(-0.5*((x-mu)/s)**2)
tl = 0.5                                     # t / lambda

def model(E):
    """Loss spectrum in eV, monochromated (ZLP FWHM ~ 8 meV), one global scale
    so the three panels join continuously across the axis breaks."""
    s = g(E, 0.0, 0.0034)                      # ZLP, amplitude 1
    # plasmon multiples (Poisson in t/lambda), amplitudes relative to the ZLP
    for n in range(1, 6):
        Pn = np.exp(-tl)*tl**n/__import__("math").factorial(n)
        s += Pn * g(E, 16.7*n, 1.2 + 2.2*n)
    # phonon losses on the ZLP tail (tens of meV; drawn at 20 and 38 meV)
    s += 1.2e-2*g(E, 0.020, 0.004) + 7e-3*g(E, 0.038, 0.005)
    # core edge (Si L) + ELNES + power-law background
    s += np.where(E > 99, ((E-99+2)/12.0)**-0.2 * np.exp(-(E-99)/300), 0) * 3e-4
    s += 6e-5*(g(E, 103, 1.6) + 0.7*g(E, 108, 2.4))
    s += np.where(E > 25, 2.5e-3*(E/25.0)**-2.6, 0)
    return s

fig, axs = plt.subplots(1, 3, figsize=(8.6, 4.0), sharey=True,
    gridspec_kw={"width_ratios": [1.0, 1.2, 1.4], "wspace": 0.07})
wins = [(-0.012, 0.062, 1e3, "energy loss (meV)"),
        (0.5, 55, 1.0, "energy loss (eV)"),
        (55, 620, 1.0, "energy loss (eV)")]
for ax, (e0, e1, unit, xl) in zip(axs, wins):
    E = np.linspace(e0, e1, 4000)
    ax.semilogy(E*unit, model(E), color=st.ACCENT, lw=1.6)
    ax.set_xlim(e0*unit, e1*unit)
    ax.set_xlabel(xl, fontsize=11.5)
    ax.spines["left"].set_visible(ax is axs[0])
    if ax is not axs[0]: ax.tick_params(left=False)
axs[0].set_ylim(1e-5, 3)
axs[0].set_ylabel("intensity (log scale)")
# background line in the core-loss window
E3 = np.linspace(60, 620, 500)
axs[2].semilogy(E3, 2.5e-3*(E3/25.0)**-2.6, color=st.GRAY, lw=1.1, ls="--")
# axis-break slashes between panels
for axL, axR in [(axs[0], axs[1]), (axs[1], axs[2])]:
    for ax, x in [(axL, 1.0), (axR, 0.0)]:
        ax.plot([x, x], [-0.02, 0.02], transform=ax.transAxes, color=st.GRAY,
                lw=1.2, clip_on=False)
        ax.plot([x-0.015, x+0.015], [-0.025, 0.025], transform=ax.transAxes,
                color=st.GRAY, lw=1.2, clip_on=False)
axs[0].annotate("zero-loss peak", xy=(0.5, 0.55), xytext=(8, 1.1), fontsize=11,
    arrowprops=dict(arrowstyle="->", color=st.GRAY))
axs[0].annotate("phonon\nlosses", xy=(21, 1.6e-2), xytext=(33, 0.08),
    fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
axs[1].annotate("plasmon multiples\n(Poisson in t/λ)", xy=(17.5, 0.13), xytext=(21, 0.6),
    fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
axs[2].annotate("core-loss edge\n(Si L, with ELNES)", xy=(104, 4.7e-4), xytext=(180, 8e-3),
    fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
axs[2].annotate("power-law\nbackground $AE^{-r}$", xy=(330, 2.3e-5), xytext=(330, 4e-4),
    fontsize=11, arrowprops=dict(arrowstyle="->", color=st.GRAY))
st.save(fig, "eels-anatomy.svg"); plt.close(fig)
print("batch 2 done")
