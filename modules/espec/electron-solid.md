# Electron-Solid Interactions

Electrons are the most versatile probe particles we have: easy to generate, easy to focus, easy to count, and carrying charge and energy that couple strongly to matter. That strong coupling is both the opportunity and the constraint. This page develops what happens to an electron inside a solid: elastic scattering, the inelastic channels and their spectrum, the inelastic mean free path and the universal curve, and the generation of secondary electrons and X-rays. This single body of physics underlies XPS and AES in this module, electron energy loss spectroscopy, and the imaging signals of the [SEM](../sem/sem.md) and [STEM](../stem/stem-imaging.md) modules.

## Elastic and inelastic scattering

An electron entering a solid scatters two ways. **Elastic scattering** from the screened Coulomb field of the nuclei changes direction without measurable energy loss; its cross section rises steeply with atomic number (roughly as $Z^2$ per atom, softened by screening) and falls with energy, and it is what turns straight-line electron paths into the random walks that define the SEM interaction volume. **Inelastic scattering** transfers energy to the electrons of the solid, in discrete channels: exciting collective oscillations (plasmons), promoting valence electrons, and ionizing core levels. The relative rates matter: in most materials the dominant inelastic event by far is plasmon excitation, and the typical energy lost per inelastic event is tens of eV, so a keV electron survives many collisions and a cascade of progressively slower electrons builds up inside the solid.

## The inelastic mean free path

The average distance between inelastic events is the **inelastic mean free path (IMFP)**, $\lambda$. Its dependence on electron kinetic energy is similar across materials, the **universal curve**: several nanometers at 10 eV, a minimum of 0.4 to 1 nm near 50 to 100 eV, then rising roughly as $E^{0.75}$ to a few nanometers at 1 to 2 keV. The shape has a physical reading: at high energy the electron simply spends less time near each atom, so losses become rarer; at very low energy the electron no longer has enough energy to excite plasmons or interband transitions, so the solid becomes nearly transparent to it. The minimum sits where the electron is best matched to the excitations available, and its depth varies somewhat with material (free-electron metals sit lower than wide-gap insulators). Predictive formulas fitted to optical data (the TPP-2M expression of Tanuma, Powell, and Penn is the standard) supply $\lambda$ for any material, and careful thickness work distinguishes the IMFP from the slightly shorter *effective attenuation length* that folds in elastic deflections.

The minimum of this curve is what makes surface analysis possible. An electron spectroscopy that detects electrons with kinetic energies between about 20 and 2000 eV is automatically surface sensitive, because any signal electron generated deeper than a few $\lambda$ scatters and loses its characteristic energy before escaping. The signal from depth $z$ attenuates as

$$
I(z) \propto \exp\!\left( \frac{-z}{\lambda \cos\theta} \right),
$$

where $I(z)$ is the signal that reaches the detector from depth $z$, $\lambda$ is the inelastic mean free path at that electron's kinetic energy, and $\theta$ is the emission angle from the surface normal. About 95% of detected signal originates within $3\lambda\cos\theta$ of the surface, a few nanometers at most. The angular factor is free depth resolution: tilting the detector toward grazing emission shrinks the sampled depth with no change to the instrument, the basis of angle-resolved XPS.

The interactive figure below is the most important one in this module. The left panel is the universal curve with the working energy ranges of LEED and XPS marked; the right panel converts the selected energy and emission angle into the numbers an analyst actually uses: the IMFP, the 95% sampling depth, and the attenuation of a substrate signal by an overlayer. Note how tilting toward grazing emission shrinks the sampling depth with no change to the instrument at all, which is the entire basis of angle-resolved XPS.

:::{anywidget} ../../widgets/imfp-escape.js
:::

## The energy loss spectrum

Watch the energy actually lost in each inelastic event and you have electron energy loss spectroscopy (EELS). The loss spectrum of any material has three regions:

- **The zero-loss and phonon region** (below about 0.1 eV): quasi-elastic scattering and lattice vibrations, resolvable only with monochromated instruments.
- **The low-loss region** (roughly 1 to 50 eV): dominated by **plasmons**, quantized collective oscillations of the valence electron gas. Treating the valence electrons as a free gas of density $n$ gives the plasmon energy $\hbar\omega_p = \hbar\sqrt{ne^2/\varepsilon_0 m}$, about 15 eV for aluminum and 17 eV for silicon, in good agreement with measurement for simple materials; more generally the loss spectrum measures the dielectric response of the solid. Plasmon excitation is the most probable inelastic event in most solids and therefore the main contributor to the IMFP; the same plasmons appear as satellite peaks in XPS spectra and as replicated loss features behind every sharp spectral line. Thicker samples show multiple plasmon losses at $2\hbar\omega_p, 3\hbar\omega_p, \dots$ with Poisson statistics, the basis of the thickness measurement used in [analytical STEM](../stem/analytical-stem.md). Low-loss spectra also contain interband transitions and, in thin samples and small particles, surface plasmons at lower energy.
- **The core-loss region** (above about 50 eV): ionization edges at the binding energies of core levels, an elemental fingerprint that rises at threshold and decays smoothly. The fine structure within a few tens of eV of each edge (ELNES) maps the local unoccupied density of states, carrying bonding information analogous to X-ray absorption spectroscopy.

The ionization cross section for a core level rises from threshold, peaks at an overvoltage of roughly two to three times the binding energy, and falls slowly; this one function shapes the sensitivity of EELS, of Auger spectroscopy, and of EDS X-ray generation alike, and dictates the beam energies chosen for each.

## Core holes: X-rays versus Auger electrons

However a core hole is made, by photon in XPS, by electron impact in SEM and AES, its filling releases a core-level energy difference, and that energy leaves the atom by one of two competing channels: a characteristic X-ray photon, or the ejection of a second electron (the Auger process). The branching ratio is the **fluorescence yield** $\omega$, and its trend with atomic number is strong and consequential: for K shells, $\omega_K$ is well approximated by $Z^4/(a + Z^4)$ with $a \approx 10^6$, so light elements decay almost exclusively by Auger emission while heavy elements favor X-rays. This single ratio explains a division of labor that recurs throughout the course: X-ray detection (EDS) is weakest exactly where Auger and EELS detection are strongest, in the light elements, and the boron-carbon-nitrogen-oxygen problems of thin film analysis belong to electron spectroscopies.

## Secondary electrons and backscattering

A primary beam entering a solid also generates the signals collected from outside:

- **Secondary electrons (SE)**: the low-energy electrons (conventionally below 50 eV, mostly just a few eV) liberated by the inelastic cascade. Their kinetic energy is so low that only those generated within a few nanometers of the surface escape, which makes the SE signal a surface and topography probe regardless of how deep the primary beam penetrates. The SE yield rises as primary energy *falls* (a slower primary deposits its energy closer to the surface), passing through unity typically somewhere in the 0.1 to a few keV range, the crossover exploited to balance charge on insulating samples in [low-voltage SEM](../sem/sem.md).
- **Backscattered electrons (BSE)**: primaries returned by (mostly multiple) elastic scattering, retaining a large fraction of their energy. The backscatter coefficient $\eta$ rises monotonically with atomic number, from a few percent for carbon to about half for gold, and is only weakly energy dependent above a few keV, which makes BSE contrast a robust map of mean atomic number.
- **Characteristic X-rays and Auger electrons**, per the branching above, generated throughout the region where the primary retains enough energy to ionize the relevant core level.

An important asymmetry follows from the escape physics: X-rays escape from nearly the full micrometer-scale interaction volume, but signal electrons escape only from the top few nanometers. The same event generates both; what you detect determines what depth you sample.

## References and further reading

1. M. P. Seah and W. A. Dench, Quantitative electron spectroscopy of surfaces: a standard data base for electron inelastic mean free paths in solids, *Surface and Interface Analysis* **1**, 2 (1979). [doi.org/10.1002/sia.740010103](https://doi.org/10.1002/sia.740010103)
2. S. Tanuma, C. J. Powell, and D. R. Penn, Calculations of electron inelastic mean free paths, *Surface and Interface Analysis* **21**, 165 (1994). [doi.org/10.1002/sia.740210302](https://doi.org/10.1002/sia.740210302)
3. R. F. Egerton, *Electron Energy-Loss Spectroscopy in the Electron Microscope*, 3rd ed., Springer (2011), Chapters 1 to 3.
4. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapter 6.
