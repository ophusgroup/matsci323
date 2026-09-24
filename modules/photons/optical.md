# Ellipsometry and Optical Spectroscopy

Light is the cheapest, fastest, and least destructive probe we have, and a surprising amount of thin film metrology is purely optical. Spectroscopic ellipsometry measures film thickness and optical constants with sub-nanometer repeatability and is the dominant in-line thickness metrology of the semiconductor industry. Raman spectroscopy identifies phases, measures strain and doping, and characterizes disorder, all in seconds through a microscope objective. Photoluminescence and absorption spectroscopies measure the band structure that most functional films exist to provide. None of these requires vacuum, and all of them can be mapped across a wafer.

| At a glance | |
| --- | --- |
| Probe in / signal out | Polarized or monochromatic light in, reflected or scattered light out |
| Information | Thickness and optical constants (ellipsometry); phase, strain, doping, disorder (Raman); band gap and defect states (PL, absorption) |
| Depth probed | Optical penetration depth, nanometers (metals) to the full film (transparent materials) |
| Lateral resolution | Beam-limited: tens of micrometers (ellipsometry) to about 0.5 um (micro-Raman, micro-PL) |
| Sensitivity | Sub-nanometer thickness repeatability (ellipsometry); monolayer sensitivity for strong Raman scatterers such as graphene |
| Sample requirements | Optically accessible surface; measured in air, nondestructive |

## Reflection of polarized light

Everything in ellipsometry follows from the Fresnel equations. Light polarized in the plane of incidence (p) and perpendicular to it (s) reflect with different amplitudes and phases, because the boundary conditions on the fields differ; for a single interface the two reflection coefficients are

$$
r_p = \frac{n_2\cos\theta_1 - n_1\cos\theta_2}{n_2\cos\theta_1 + n_1\cos\theta_2}, \qquad
r_s = \frac{n_1\cos\theta_1 - n_2\cos\theta_2}{n_1\cos\theta_1 + n_2\cos\theta_2},
$$

where $n_1$ and $n_2$ are the refractive indices of the incident medium and the material, $\theta_1$ is the angle of incidence, and $\theta_2$ is the refraction angle inside the material, with complex $n$ for absorbing media. Near the Brewster angle $r_p$ passes through a minimum (zero for a transparent material), which is why ellipsometers work at incidence angles of 65° to 75°, where the p-s difference, and hence the sensitivity, is largest. A film on the substrate adds interference: each coefficient becomes the familiar two-interface sum $r = (r_{01} + r_{12}e^{2i\beta})/(1 + r_{01}r_{12}e^{2i\beta})$ with the film phase thickness $\beta = 2\pi n_1 t \cos\theta_{\mathrm{film}}/\lambda$, the same physics as the [Kiessig fringes of XRR](xrr.md) transposed to optical wavelengths.

## Spectroscopic ellipsometry

:::{anywidget} ../../widgets/technique-schematic.js
{ "name": "ellipsometer" }
:::

Ellipsometry measures the ratio of these two reflection coefficients, expressed as

$$
\rho = \frac{r_p}{r_s} = \tan\Psi \; e^{i\Delta} .
$$

The complex ratio $\rho$ is what the instrument returns. The two measured quantities, the amplitude ratio $\Psi$ and the phase difference $\Delta$, are recorded at each wavelength across the spectrum (typically 200 to 1700 nm; infrared ellipsometers extend further), and being a ratio they are self-referencing: no intensity calibration, no reference sample, and immunity to source drift, which is the root of the technique's extraordinary precision. The phase $\Delta$ is the workhorse for ultrathin films: a monolayer-scale overlayer barely changes any intensity, but it shifts the relative phase measurably, so ellipsometry tracks films well below one nanometer, which is why it monitors gate oxides and atomic layer deposition cycle by cycle. Practical instruments modulate the polarization, most commonly with a rotating compensator, and extract $\Psi$ and $\Delta$ from the harmonics of the detected signal; mapping ellipsometers raster a focused spot to produce full-wafer thickness images in minutes.

Ellipsometry does not measure thickness directly. The measured $(\Psi, \Delta)$ spectra are fit to an optical model of the stack, with layer thicknesses and dielectric functions as parameters. Transparent films use simple dispersion models (Cauchy or Sellmeier); absorbing films use oscillator models (Lorentz, Tauc-Lorentz for amorphous semiconductors, Drude terms for free carriers, which also makes ellipsometry an optical probe of carrier concentration); rough surfaces are commonly modeled as an effective-medium mixture of material and void (Bruggeman EMA). The fit minimizes a mean-squared error between model and data, and the standing caveats are the same as for [XRR fitting](xrr.md): parameters correlate (thickness and index trade off strongly for very thin films, which is why ultrathin-film work fixes the index from a known bulk value), a wrong model can fit well and mislead, and agreement between ellipsometry and an independent thickness (XRR, or a stepped film measured by [AFM](../spm/afm.md)) is the real validation. Reporting a thickness without stating the assumed index is a common and avoidable error.

% TODO: figure: Psi/Delta spectra for oxide-on-Si at a few thicknesses, with the
% fitted model overlaid. Easy to compute ourselves with a transfer-matrix code.

The same interference physics that ellipsometry measures precisely is visible to the naked eye. The demonstration below computes the reflectance spectrum of an oxide or nitride film on silicon and converts it to the color you would see in the cleanroom: the famous oxide color chart. Judging thickness by eye against this chart, good to a few tens of nanometers once calibrated, is the oldest optical metrology in the semiconductor industry, and why the process history of a wafer can often be read from its color.

:::{anywidget} ../../widgets/film-color.js
:::

## Raman spectroscopy

:::{anywidget} ../../widgets/technique-schematic.js
{ "name": "raman" }
:::

Raman spectroscopy measures the inelastic scattering of laser light by lattice vibrations. In the classical picture, the polarizability of the material is modulated by each vibrational mode, so the driven dipole radiates not only at the laser frequency (Rayleigh scattering) but at sidebands shifted down (Stokes) and up (anti-Stokes) by the phonon frequency; only modes that modulate the polarizability are Raman active, a symmetry selection rule complementary to infrared absorption (which requires a changing dipole moment; in centrosymmetric crystals the two selection rules are mutually exclusive). The Stokes side is stronger because it does not require a phonon to be thermally present, and the Stokes to anti-Stokes intensity ratio follows the Bose-Einstein occupation, providing a built-in local thermometer. Instrumentally, a modern micro-Raman system is a laser, a microscope objective (spot size near the diffraction limit, about 0.5 µm), a steep edge filter to reject the elastically scattered laser line, and a spectrograph; shifts are quoted in cm$^{-1}$, with most phonons falling between 100 and 3000 cm$^{-1}$.

For thin film work its virtues are speed, spatial resolution, and sensitivity to exactly the properties diffraction misses:

- **Phase and polymorph identification**, including amorphous phases invisible to XRD: crystalline silicon shows a sharp line at 520 cm$^{-1}$ while amorphous silicon shows a broad band near 480 cm$^{-1}$, so one spectrum quantifies crystalline fraction in mixed-phase films, a standard measurement in thin-film photovoltaics.
- **Strain**, which shifts phonon frequencies by a few cm$^{-1}$ per GPa through the anharmonicity of the lattice; Raman mapping of strain around device features and laser-processed regions is standard failure-analysis practice.
- **Disorder and doping**, most famously in carbon materials, where the defect-activated D band near 1350 cm$^{-1}$ against the G band near 1580 cm$^{-1}$ quantifies disorder in everything from graphene to diamond-like coatings; in graphene the 2D band lineshape counts layers, and Raman shifts also track doping level.

The limits are the flip side of the physics: cross sections are tiny (roughly one photon in $10^8$), metals give almost no signal (screened polarizability and nanometer optical penetration), fluorescence can swamp the spectrum (often cured by changing laser wavelength), and laser heating can modify a thin film mid-measurement, so power dependence should be checked before trusting peak positions.

## Photoluminescence and absorption

For semiconducting films, photoluminescence (PL) and optical absorption close the loop on electronic quality. PL excites carriers with an above-gap laser and spectrally resolves their radiative recombination: the peak position tracks the band gap and its shifts with composition, strain, or quantum confinement, while the intensity and linewidth track defect density, since nonradiative recombination at defects competes with emission; time-resolved PL extends this to carrier lifetimes, the single most predictive quantity for photovoltaic material quality. Absorption or transmission spectra locate the gap directly, commonly through a Tauc analysis (plotting $(\alpha h\nu)^{1/2}$ or $(\alpha h\nu)^2$ for indirect and direct gaps respectively and extrapolating to zero), and reveal sub-gap defect absorption. Both are routine wafer-mapping tools for photovoltaic and optoelectronic films, where a PL image flags bad regions before any device is fabricated. Fourier-transform infrared spectroscopy (FTIR) rounds out the family: vibrational absorption identifies bonding configurations in dielectrics (Si-H, Si-OH, and B-O contents in deposited oxides are standard FTIR assays) through the infrared selection rule that complements Raman.

% TODO: this page needs example spectra: Si Raman (c-Si vs a-Si), graphene D/G/2D,
% and a PL map of a perovskite or III-V film. Good candidates to source from
% colleagues or measure in-house.

## References and further reading

1. H. Fujiwara, *Spectroscopic Ellipsometry: Principles and Applications*, Wiley (2007).
2. H. G. Tompkins and E. A. Irene (eds.), *Handbook of Ellipsometry*, William Andrew (2005).
3. A. C. Ferrari and D. M. Basko, Raman spectroscopy as a versatile tool for studying the properties of graphene, *Nature Nanotechnology* **8**, 235 (2013). [doi.org/10.1038/nnano.2013.46](https://doi.org/10.1038/nnano.2013.46)
4. D. K. Schroder, *Semiconductor Material and Device Characterization*, 3rd ed., Wiley (2006), Chapter 10.
