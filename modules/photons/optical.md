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

## Spectroscopic ellipsometry

Ellipsometry measures the change in polarization state of light reflected from a surface, expressed as the complex ratio of the p and s reflection coefficients,

$$
\rho = \frac{r_p}{r_s} = \tan\Psi \; e^{i\Delta}.
$$

The two measured quantities, the amplitude ratio $\Psi$ and the phase difference $\Delta$, are measured at each wavelength across the spectrum, and being a ratio they are self-referencing: no intensity calibration is needed, which is the root of the technique's extraordinary precision. The phase term $\Delta$ is exquisitely sensitive to thin overlayers, and detects films well below one nanometer, which is why ellipsometry monitors gate oxides and atomic layer deposition so effectively.

Ellipsometry does not measure thickness directly. The measured $(\Psi, \Delta)$ spectra are fit to an optical model of the stack, with layer thicknesses and dielectric functions as parameters, using dispersion models such as Cauchy for transparent films or oscillator models for absorbing ones. As with XRR, the fit is the art: a wrong model fits badly at best and misleads at worst, and thickness and index correlate strongly for very thin films. The parallels with XRR fitting are worth internalizing, and the two techniques are highly complementary: XRR measures mass density and total thickness independent of optical properties, while ellipsometry adds the dielectric function and works on rougher samples.

% TODO: figure: Psi/Delta spectra for oxide-on-Si at a few thicknesses, with the
% fitted model overlaid. Easy to compute ourselves with a transfer-matrix code.

## Raman spectroscopy

Raman spectroscopy measures the inelastic scattering of laser light by phonons: the scattered photon is shifted by a phonon energy, and the spectrum of shifts fingerprints the material. For thin film work its virtues are speed, micrometer spatial resolution through a standard microscope, and sensitivity to exactly the properties diffraction misses:

- **Phase and polymorph identification**, including amorphous phases invisible to XRD; the classic example is distinguishing amorphous, nanocrystalline, and crystalline silicon in one spectrum.
- **Strain**, which shifts phonon frequencies linearly by a few cm$^{-1}$ per GPa; Raman mapping of strain around device features is standard failure-analysis practice.
- **Disorder and doping**, most famously in carbon materials, where the D-to-G band intensity ratio quantifies disorder in everything from graphene to diamond-like coatings, and in graphene the 2D band lineshape counts layers.

The limits are the flip side of the physics: signals are weak (roughly one photon in $10^{8}$ is Raman scattered), metals give almost no signal, fluorescence can swamp the spectrum, and laser heating can modify a thin film mid-measurement.

## Photoluminescence and absorption

For semiconducting films, photoluminescence (PL) and optical absorption close the loop on electronic quality. PL excites carriers with a laser and spectrally resolves their radiative recombination; the peak position tracks the band gap (and its shifts with composition, strain, or quantum confinement), while intensity and linewidth track defect density, since nonradiative recombination at defects competes with emission. Absorption or transmission spectra locate the gap directly, commonly through a Tauc plot analysis, and reveal sub-gap defect absorption. Both are routine wafer-mapping tools for photovoltaic and optoelectronic films, where a PL image can flag bad regions before any device is fabricated.

% TODO: this page needs example spectra: Si Raman (c-Si vs a-Si), graphene D/G/2D,
% and a PL map of a perovskite or III-V film. Good candidates to source from
% colleagues or measure in-house.

## References and further reading

1. H. Fujiwara, *Spectroscopic Ellipsometry: Principles and Applications*, Wiley (2007).
2. H. G. Tompkins and E. A. Irene (eds.), *Handbook of Ellipsometry*, William Andrew (2005).
3. A. C. Ferrari and D. M. Basko, Raman spectroscopy as a versatile tool for studying the properties of graphene, *Nature Nanotechnology* **8**, 235 (2013). [doi.org/10.1038/nnano.2013.46](https://doi.org/10.1038/nnano.2013.46)
4. D. K. Schroder, *Semiconductor Material and Device Characterization*, 3rd ed., Wiley (2006), Chapter 10.
