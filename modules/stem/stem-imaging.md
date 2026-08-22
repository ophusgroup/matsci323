# STEM Imaging

Transmission electron microscopy answers the question every depth-profiling technique in this course approximates: what does the buried interface actually look like? Prepare a cross-section thin enough for electrons to pass through, and the film stack, its interfaces, its defects, and its atomic structure are imaged directly, at resolution down to well below an angstrom. The price is the preparation: the sample must be thinned to below about 100 nm, almost always by [FIB lift-out](../sem/ebsd-fib.md), and the analyzed region is measured in micrometers. This page covers imaging and diffraction in the scanning transmission electron microscope (STEM), the mode that now dominates materials work; the [next page](analytical-stem.md) adds spectroscopy.

| At a glance | |
| --- | --- |
| Probe in / signal out | 60 to 300 keV focused electron beam transmitted through a thin sample |
| Information | Direct imaging of interfaces, layers, and defects down to atomic resolution; local crystal structure and orientation by diffraction |
| Sample thickness | Below about 100 nm; below 30 nm for the highest resolution |
| Lateral resolution | Sub-angstrom probes in aberration-corrected instruments |
| Sensitivity | Single atomic columns; single dopant atoms in favorable cases |
| Sample requirements | Electron-transparent lamella, typically FIB-prepared; preparation is destructive |

## The scanning transmission geometry

A STEM focuses the beam to a fine probe, scans it across the thin sample, and records scattered intensity on detectors below, building the image pixel by pixel exactly as in the [SEM](../sem/sem.md). The crucial differences are the sample and the energy: through a sample tens of nanometers thick at hundreds of keV, the beam broadens only slightly, so resolution is set by the probe itself. Aberration correctors, standard on high-end instruments since the mid-2000s, cancel the intrinsic spherical aberration of round magnetic lenses and shrink the probe below 1 angstrom, comfortably resolving atomic columns in any orientation-aligned crystal.

Detectors partition the scattered beam by angle, and the collection angle selects the contrast:

- **High-angle annular dark field (HAADF)** collects electrons scattered to high angles by near-nucleus Rutherford-like scattering. Intensity scales roughly as $Z^{1.7}$, giving directly interpretable atomic number contrast: heavy layers bright, light layers dark, with none of the contrast reversals of phase-contrast imaging. HAADF is the default structural image of a film stack.
- **Bright field and annular bright field** collect the transmitted disk and its rim, where phase contrast makes light-element columns (oxygen, even hydrogen in favorable cases) visible alongside heavy ones.
- **Pixelated detectors** record the full diffraction pattern at every probe position (4D-STEM), from which essentially any contrast can be synthesized computationally, and local strain, orientation, polarity, and fields can be mapped quantitatively.

For thin film problems the routine STEM measurements are direct: layer thicknesses without the model-dependence of XRR or ellipsometry, interface abruptness and interdiffusion seen atom column by atom column, misfit dislocations and threading defects, local epitaxial relationships, and the real conformality of a deposited film over topography.

## Diffraction in the TEM and STEM

Selected-area electron diffraction from any chosen region gives single-crystal patterns that identify phases and orientation relationships across an interface, the local, single-grain complement to the ensemble average of [XRD](../photons/xrd.md). Converging the beam (CBED) adds sensitivity to thickness and symmetry, and scanning nanobeam diffraction maps strain fields across device structures at nanometer resolution with precision competitive with the X-ray methods, from exactly the region of interest. Where the reciprocal-space rods of [RHEED and LEED](leed-rheed.md) probed the surface, transmission diffraction probes the full thin foil, and the same Ewald constructions carry over directly.

## Reading STEM images honestly

Three cautions keep STEM quantitative. The image is a two-dimensional projection through the foil thickness, so a "diffuse" interface may be a sharp but rough interface viewed edge-on, and roughness projects into apparent interdiffusion. The FIB-prepared foil carries amorphized surface layers and possible implanted Ga, so the outer few nanometers of the sample are artifacts of preparation, not of the film. And the beam itself deposits energy: knock-on displacement and radiolysis modify sensitive materials during observation, managed by lowering voltage or dose, cryogenic stages, and low-dose acquisition schemes developed for exactly this purpose.

% TODO: figures: (a) STEM geometry with detector layout labeled by angle;
% (b) HAADF cross-section of a multilayer or device stack with the layers
% annotated (we have many candidates in-house); (c) an interface image pair
% illustrating the projection/roughness caveat.

% TODO: decide how much 4D-STEM to include here vs leaving it as a final project
% topic; current draft mentions it in one sentence by design.

## References and further reading

1. D. B. Williams and C. B. Carter, *Transmission Electron Microscopy*, 2nd ed., Springer (2009).
2. S. J. Pennycook and P. D. Nellist (eds.), *Scanning Transmission Electron Microscopy: Imaging and Analysis*, Springer (2011).
3. C. Ophus, Quantitative scanning transmission electron microscopy for materials science: imaging, diffraction, spectroscopy, and tomography, *Annual Review of Materials Research* **53** (2023). [doi.org/10.1146/annurev-matsci-080921-092646](https://doi.org/10.1146/annurev-matsci-080921-092646)

% TODO: verify the DOI and page numbers of reference 3 before deploy.
