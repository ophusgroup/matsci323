# Electron-Solid Interactions

Electrons are the most versatile probe particles we have: easy to generate, easy to focus, easy to count, and carrying charge and energy that couple strongly to matter. That strong coupling is both the opportunity and the constraint. This page develops what happens to an electron inside a solid, the inelastic mean free path and the universal curve, the spectrum of energy losses, and the generation of secondary electrons and X-rays. This single body of physics underlies XPS and AES in this module, electron energy loss spectroscopy, and the imaging signals of the [SEM](../sem/sem.md) and [STEM](../stem/stem-imaging.md) modules.

## The inelastic mean free path

An electron traveling through a solid loses energy in discrete inelastic events: exciting plasmons, promoting valence electrons, and ionizing core levels. The average distance between such events is the **inelastic mean free path (IMFP)**, $\lambda$. Its dependence on electron kinetic energy is remarkably similar across all materials, the **universal curve**: several nanometers at 10 eV, dipping to a minimum of 0.4 to 1 nm near 50 to 100 eV, then rising roughly as $E^{0.75}$ to a few nanometers at 1 to 2 keV and tens of nanometers at higher energies.

The minimum of this curve is the founding fact of surface analysis. An electron spectroscopy that detects electrons with kinetic energies between about 20 and 2000 eV is automatically surface sensitive, because any signal electron generated deeper than a few $\lambda$ scatters and loses its characteristic energy before escaping. The signal from depth $z$ attenuates as

$$
I(z) \propto \exp\!\left( \frac{-z}{\lambda \cos\theta} \right),
$$

where $\theta$ is the emission angle from the surface normal. About 95% of detected signal originates within $3\lambda\cos\theta$ of the surface, a few nanometers at most. The angular factor is free depth resolution: tilting the detector toward grazing emission shrinks the sampled depth, the basis of angle-resolved XPS. Predictive formulas (Tanuma, Powell, and Penn's TPP-2M) give $\lambda$ for any material, and the distinction between the IMFP and the slightly shorter effective attenuation length (which folds in elastic scattering) matters for careful thickness work.

% TODO: figure: the universal curve with the techniques of this course marked on
% it (XPS, AES, LEED energy ranges), plus the exponential escape-depth schematic.
% This is the single most important figure of the module.

## The energy loss spectrum

Watch the energy actually lost in each inelastic event and you have electron energy loss spectroscopy (EELS). The loss spectrum of any material has three regions:

- **The zero-loss and phonon region** (below about 0.1 eV): quasi-elastic scattering.
- **The low-loss region** (1 to 50 eV): dominated by **plasmons**, collective oscillations of the valence electron gas at energy $\hbar\omega_p$, typically 15 to 25 eV. Plasmon excitation is the most probable inelastic event in most solids and therefore the main contributor to the IMFP; the same plasmons appear as satellite peaks in XPS spectra and as the background structure in Auger spectra. Low-loss EELS also measures the band gap and, through the plasmon energy, the valence electron density.
- **The core-loss region** (above about 50 eV): ionization edges at the binding energies of core levels, an elemental fingerprint. The fine structure on each edge (ELNES) reflects the local unoccupied density of states, carrying bonding information analogous to X-ray absorption spectroscopy.

The ionization cross section for a core level rises from threshold, peaks at an overvoltage of roughly 2 to 3 times the binding energy, and falls slowly; this one function shapes the sensitivity of EELS, of Auger spectroscopy, and of EDS X-ray generation alike. In this course the practice of EELS lives in the scanning transmission electron microscope, where it maps composition and bonding at atomic resolution, and we take it up with [analytical STEM](../stem/analytical-stem.md).

## Secondary electrons, backscattering, and X-rays

A primary beam entering a solid also generates signals we collect from outside:

- **Secondary electrons (SE)**: the low-energy (below 50 eV, mostly a few eV) electrons kicked up by the cascade of inelastic events. Their tiny escape depth of a few nanometers makes them the topographic imaging signal of the SEM.
- **Backscattered electrons (BSE)**: primaries returned by elastic scattering, with a yield that rises monotonically with atomic number, giving Z contrast.
- **Characteristic X-rays**: when an ionized core hole is filled, the released energy leaves as either a characteristic X-ray or an Auger electron. The fluorescence yield $\omega$ decides the branching: X-rays win for deep holes in heavy elements, Auger emission wins overwhelmingly for light elements and shallow core levels. This single branching ratio explains why EDS is weakest exactly where AES is strongest, and we will use it on both sides in the pages ahead.

An important asymmetry follows from the escape physics: X-rays escape from the full micrometer-scale interaction volume, but signal electrons escape only from the top few nanometers. The same event generates both; what you detect determines what depth you sample.

## References and further reading

1. M. P. Seah and W. A. Dench, Quantitative electron spectroscopy of surfaces: a standard data base for electron inelastic mean free paths in solids, *Surface and Interface Analysis* **1**, 2 (1979). [doi.org/10.1002/sia.740010103](https://doi.org/10.1002/sia.740010103)
2. R. F. Egerton, *Electron Energy-Loss Spectroscopy in the Electron Microscope*, 3rd ed., Springer (2011), Chapters 1 to 3.
3. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapter 6.
