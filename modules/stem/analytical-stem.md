# Analytical STEM

A focused sub-angstrom probe positioned on a chosen atomic column can do more than image. The inelastic signals developed in [electron-solid interactions](../espec/electron-solid.md), energy losses and characteristic X-rays, are generated at the probe position and collected in parallel with every image, making the STEM a spectroscopy platform with the best spatial resolution of any technique in this course. Analytical STEM maps composition and chemical bonding across interfaces literally atom column by atom column, and for thin film problems it is the final arbiter: when depth profiles from sputter-based techniques disagree, a STEM-EELS line profile across the actual interface settles the question.

## STEM-EELS

The electron energy loss spectrometer sits after the sample and disperses transmitted electrons by energy lost. Everything about the loss spectrum carries over from the [earlier discussion](../espec/electron-solid.md); what the STEM adds is position. Recording a spectrum at every probe position of a scan (a spectrum image) turns each spectral feature into a map:

- **Core-loss edges** map elemental composition with atomic resolution; quantification via cross sections reaches roughly 5 to 10% relative accuracy, and light elements (Li, B, C, N, O), the weak spot of EDS, are strong EELS performers.
- **Energy-loss near-edge structure (ELNES)** maps bonding: the Ti L edge distinguishes Ti valence states across an oxide interface, the O K edge fingerprints coordination, the C K edge separates sp$^2$ from sp$^3$ carbon. This is the same chemical-state information XPS provides, at a thousand times finer spatial scale, though with a harder quantification path.
- **Low-loss features** map local band gaps and plasmonics, and the log-ratio of the plasmon signal measures the local foil thickness in units of the mean free path, a routine correction for quantitative work.
- **Monochromated instruments** resolve a few meV, extending EELS to phonons and enabling vibrational mapping at nanometer scale, a capability that did not exist before 2014.

The constraints are dose and thickness. Core-loss signals are weak, so atomic-resolution chemical maps push against beam damage, and samples much thicker than one inelastic mean free path (roughly 100 nm at 300 keV) bury the edges under multiple scattering. Thin, well-prepared samples are not optional.

## STEM-EDS

The same characteristic X-rays used in [SEM-EDS](../sem/sem.md) are collected in STEM by large solid-angle silicon drift detectors surrounding the sample. Because the sample is a thin foil, the micrometer interaction volume of bulk EDS collapses to essentially the probe diameter broadened by beam spreading: nanometer-scale X-ray mapping. Thin-sample quantification also simplifies, using the Cliff-Lorimer ratio method with k-factors or the more rigorous zeta-factor method. In modern practice STEM-EDS and STEM-EELS run simultaneously and are complementary: EDS covers heavy elements and full-stack overview maps with simple quantification, EELS covers light elements, bonding, and the finest spatial detail. An elemental map of a complete device cross-section, every layer labeled, in under an hour, is now a routine measurement that would have been a thesis twenty years ago.

## Strain and structure mapping

Diffraction-based STEM mapping completes the analytical picture. Nanobeam electron diffraction across a scan measures local lattice parameters, and hence strain tensors, at a few nanometers resolution with about 0.1% precision, directly on the device feature of interest rather than averaged over the beam footprint as in [X-ray methods](../photons/xrd.md). Geometric phase analysis extracts the same information from atomic-resolution HAADF images. For thin film development these maps answer whether the intended strain state survived patterning and processing, a question no ensemble technique can localize.

% TODO: figures: (a) spectrum image schematic with an EELS line profile across an
% oxide interface; (b) a full-stack STEM-EDS map of a device cross-section (we
% have candidates); (c) an ELNES comparison (Ti L or C K). Also decide whether to
% show one 4D-STEM strain map here or hold strain mapping entirely for lecture.

% TODO: homework tie-in: EELS quantification exercise from a provided spectrum
% image (Colab, hyperspy or exspy), mirroring the XPS quantification homework.

## References and further reading

1. R. F. Egerton, *Electron Energy-Loss Spectroscopy in the Electron Microscope*, 3rd ed., Springer (2011).
2. D. B. Williams and C. B. Carter, *Transmission Electron Microscopy*, 2nd ed., Springer (2009), Part 4.
3. O. L. Krivanek et al., Vibrational spectroscopy in the electron microscope, *Nature* **514**, 209 (2014). [doi.org/10.1038/nature13870](https://doi.org/10.1038/nature13870)
