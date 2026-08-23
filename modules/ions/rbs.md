# RBS and ERD

Rutherford backscattering spectrometry (RBS) sends a beam of MeV helium ions at a sample and measures the energy spectrum of the ions scattered back to a detector near 170 degrees. Everything needed to interpret the spectrum was developed on the [previous page](ion-solid.md): the kinematic factor converts energy to target mass, the stopping power converts energy loss to depth, and the Rutherford cross section converts count rate to concentration, absolutely and without standards. RBS is no longer a routine technique, accelerators are scarce and its niche has narrowed, but it remains the calibration anchor of thin film analysis: when another technique needs an absolute composition or areal density standard, that standard was probably measured by RBS.

| At a glance | |
| --- | --- |
| Probe in / signal out | MeV He ions in, backscattered He ions out |
| Information | Composition and film thickness versus depth, absolute areal density, heavy elements on or in light matrices |
| Depth probed | Up to a few micrometers; depth resolution 10 to 30 nm typical |
| Lateral resolution | Millimeter-scale beam spot (micro-RBS reaches micrometers) |
| Sensitivity | Excellent for heavy elements in light matrices (down to about $10^{13}$ atoms/cm$^2$); poor for light elements on heavy substrates |
| Sample requirements | Vacuum compatible, a few cm or smaller; nearly nondestructive |

## Reading an RBS spectrum

Three rules decode any RBS spectrum:

1. **Energy identifies mass.** An ion scattered from a surface atom of mass $M_2$ arrives at the detector with energy $K E_0$. Heavier elements appear at higher energy. Mass resolution is good for light and medium elements and degrades for heavy ones, where neighboring $K$ values crowd together; RBS can distinguish Si from O easily, but not W from Ta.
2. **Energy loss measures depth.** An ion scattered at depth $t$ loses energy on the way in and again on the way out, so atoms of one element produce a peak whose width maps the depth distribution. The conversion is the stopping power, giving a depth scale of typically a few hundred eV per nanometer. A thin film of one element appears as a box whose width gives the film's areal density (atoms/cm$^2$) directly; dividing by an assumed atomic density converts to thickness in nanometers.
3. **Yield measures concentration.** The height of the spectrum scales with the Rutherford cross section, $Z_2^2$, times concentration. Since the cross section is known exactly, relative concentrations follow with no standards, and with a measured beam dose, absolute ones.

The signature strength is heavy-on-light: a submonolayer of Hf on silicon stands isolated at high energy above a low silicon background, measurable to $10^{13}$ atoms/cm$^2$ (about a hundredth of a monolayer). The signature weakness is the reverse: carbon or oxygen on a heavy substrate sits as a small bump on a large background. Simulation and fitting programs (SIMNRA, RUMP) make the interpretation of multilayer spectra routine; see the [simulation appendix](../../appendix/simulation-tools.md).

% TODO: figures: (a) annotated experimental spectrum of a metal film on Si showing
% surface energies, film width, and substrate edge; (b) the classic schematic of
% spectrum formation from a two-element film. Mark's Lecture 5 (2025) has good
% examples worth redrawing; his hand-drawn spectrum-buildup figures are the best
% part of the old deck.

The simulator below applies all three rules to a stack you define. The kinematic factors and the $Z^2/E^2$ cross sections are exact; the stopping powers are approximate tabulated values, so treat depth scales as semi-quantitative. Reproduce the classic cases: a heavy marker layer (Au) standing isolated above a light substrate, the box width growing with film thickness, layer signals shifting down in energy as you bury them, and the hopeless overlap of two neighboring heavy elements.

:::{anywidget} ../../widgets/rbs-spectrum.js
:::

% TODO: homework tie-in: Colab notebook version of this simulator that asks
% students to fit an unknown spectrum quantitatively.

## Instrumentation

RBS requires an electrostatic accelerator (typically a tandem in the 1 to 3 MV range) delivering a collimated He beam to a UHV-adjacent scattering chamber, and a silicon surface-barrier detector whose 12 to 15 keV energy resolution sets the depth resolution. This infrastructure explains the technique's scarcity: measurements are usually obtained through university or national laboratory facilities. Channeling measurements, in which the beam is aligned with a crystal axis to suppress scattering from lattice atoms and thereby measure crystalline quality and impurity lattice sites, are covered in the [channeling appendix](../../appendix/channeling.md).

## Elastic recoil detection

RBS cannot see hydrogen: nothing bounces backward off a lighter target. **Elastic recoil detection (ERD)** inverts the geometry, hitting the sample at a glancing angle and detecting the target atoms knocked forward. With a He beam and an absorber foil to stop forward-scattered He, ERD measures hydrogen and deuterium depth profiles quantitatively, the standard method for H content in materials from diamond-like carbon to hydrogenated a-Si. With heavy ion beams (say 30 MeV iodine) and a detector that identifies each recoil species, heavy-ion ERD profiles all light elements simultaneously, a powerful if scarce capability for nitrides, oxides, and other light-element films.

**Medium-energy ion scattering (MEIS)** shrinks RBS to about 100 keV, where electrostatic energy analyzers deliver sub-nanometer depth resolution over the top few nanometers, resolving, for example, the individual layers of an ultrathin gate oxide stack. It bridges toward the single-layer sensitivity of [LEIS](sims.md).

## References and further reading

1. W.-K. Chu, J. W. Mayer, and M.-A. Nicolet, *Backscattering Spectrometry*, Academic Press (1978).
2. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapters 2 to 5.
3. M. Mayer, SIMNRA, a simulation program for the analysis of NRA, RBS and ERDA, *AIP Conference Proceedings* **475**, 541 (1999). [doi.org/10.1063/1.59188](https://doi.org/10.1063/1.59188)
