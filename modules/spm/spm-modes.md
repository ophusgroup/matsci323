# Functional SPM Modes and STM

The AFM feedback loop holds one interaction constant while scanning; add a second measurement channel and the same platform maps almost any local property alongside topography. These functional modes have made scanning probe microscopy the property-mapping counterpart to everything else in this course: where the other techniques measure what a film is, SPM modes measure what it does, point by point. This page surveys the modes that matter most for thin films, then closes with scanning tunneling microscopy, the original scanning probe and still the highest-resolution imaging technique in existence.

## Electrical and functional modes

- **Conductive AFM (c-AFM)** applies a bias through a conductive tip in contact and maps current, resolving conduction nanoscale feature by feature: leakage hot spots in gate dielectrics, conductive filaments in resistive-switching oxides, grain-boundary conduction in polycrystalline solar absorbers. Related spreading-resistance modes quantify local dopant levels in semiconductors.
- **Kelvin probe force microscopy (KPFM)** measures the contact potential difference between tip and sample by nulling the electrostatic force, mapping work function at tens of millielectronvolts and tens of nanometers resolution. Work function terrain reveals grain-to-grain facet variation, band bending at boundaries and contacts, and surface photovoltage under illumination, connecting directly to the ensemble work function from [UPS](../espec/xps.md).
- **Piezoresponse force microscopy (PFM)** drives the sample with an AC bias and detects the resulting piezoelectric surface oscillation, imaging ferroelectric domains and, with a DC bias, writing them. PFM is the standard microscopy of ferroelectric films and underlies much of the field's device work; distinguishing true piezoresponse from electrostatic artifacts is the mode's standing challenge.
- **Magnetic force microscopy (MFM)** senses magnetostatic force gradients with a magnetized tip on a second lifted pass, mapping domain structure in magnetic films with about 30 to 50 nm resolution, in air, with no sample preparation.
- **Nanomechanical modes** extract modulus and adhesion at every pixel from fast force-distance curves, mapping mechanical heterogeneity in polymer blends and composites.

The shared caveat across all functional modes: the measured signal mixes the property of interest with topography, tip condition, and contact quality, so quantitative claims require the same skepticism developed for [AFM topography](afm.md), doubled.

% TODO: figures: one panel per major mode showing a real thin film example
% (c-AFM leakage map, KPFM of a polycrystalline absorber, PFM domains, MFM
% domains). Published examples exist for all; request permissions or use
% in-house data.

## Scanning tunneling microscopy

The scanning tunneling microscope preceded and inspired all other scanning probes, and it remains unmatched in resolution. A bias of millivolts to volts is applied between a sharp metal tip and a conductive sample, and at tip-sample gaps below a nanometer, electrons tunnel across the vacuum gap. The tunneling current depends exponentially on the gap,

$$
I \propto \exp(-2\kappa d), \qquad \kappa = \frac{\sqrt{2m\phi}}{\hbar},
$$

falling roughly an order of magnitude per angstrom for typical work functions $\phi$. That exponential is the whole instrument: it confines the current to the last atom of the tip, giving atomic resolution laterally and picometer sensitivity vertically with no lenses and no diffraction limit. The Si(111) 7x7 reconstruction from [the first module](../surfaces/properties.md) was solved in real space this way within two years of the instrument's invention.

STM images are not topography; the current depends on both the surface height and the local electronic density of states, so an adsorbate can image as a hole and a dangling bond as a mountain. **Scanning tunneling spectroscopy (STS)** makes that dependence the point: sweeping the bias and measuring $dI/dV$ maps the local density of states, resolving band edges, superconducting gaps, and defect states atom by atom, the measurement behind much of two-dimensional materials and correlated-oxide physics.

The requirements keep STM a research instrument rather than a metrology tool: conductive samples, atomically clean surfaces (hence UHV, and frequently cryogenic temperatures for stability and spectroscopy), and vibration isolation worthy of the picometer signals. In this course's decision framework, STM answers questions about atomic and electronic structure of a conductive surface that nothing else can, and AFM handles everything else.

## References and further reading

1. B. Voigtländer, *Scanning Probe Microscopy*, Springer (2015).
2. C. J. Chen, *Introduction to Scanning Tunneling Microscopy*, 3rd ed., Oxford University Press (2021).
3. G. Binnig, H. Rohrer, Ch. Gerber, and E. Weibel, Surface studies by scanning tunneling microscopy, *Physical Review Letters* **49**, 57 (1982). [doi.org/10.1103/PhysRevLett.49.57](https://doi.org/10.1103/PhysRevLett.49.57)
4. S. Sadewasser and T. Glatzel (eds.), *Kelvin Probe Force Microscopy*, 2nd ed., Springer (2018).
