# EBSD and FIB

This page covers two SEM-platform techniques that extend the microscope far beyond imaging: electron backscatter diffraction, which maps crystal orientation grain by grain, and the focused ion beam, which machines site-specific cross-sections and prepares the specimens on which the rest of this course's microscopy depends.

## Electron backscatter diffraction

Tilt a polished sample to 70 degrees and place a camera near it: backscattered electrons diffracting off lattice planes on their way out of the sample form a pattern of intersecting **Kikuchi bands**, each band the projection of one set of lattice planes. The pattern is a map of the local crystal orientation, and software indexes it in milliseconds. Scanning the beam produces an **orientation map**: crystal orientation at every pixel, from which follow grain size distributions measured properly (not estimated from image contrast), grain boundary character including twin fractions, local texture, phase maps distinguishing polymorphs, and plastic strain estimates from within-grain orientation gradients.

For thin films, EBSD is the grain-by-grain complement to the ensemble texture measurement of a [pole figure](../photons/xrd.md): XRD texture answers "what fraction of the film is (111) oriented," EBSD answers "which grains, how large, and next to whom." Spatial resolution of roughly 20 to 50 nm bounds standard EBSD to films with grains above that scale; transmission Kikuchi diffraction (TKD), which runs EBSD in transmission through an electron-transparent sample, pushes resolution below 10 nm for nanocrystalline films. The practical demands are a flat, well-prepared, conductive surface and a crystal structure known well enough to index.

% TODO: figures: (a) EBSD geometry and an indexed Kikuchi pattern; (b) an
% orientation map of a polycrystalline film with grain boundaries overlaid.
% We can generate (b) from our own data.

## The focused ion beam

A focused ion beam (FIB) instrument is an SEM whose second column focuses ions, typically 30 keV Ga$^+$ from a liquid metal ion source, to a spot of about 5 nm. Where the electron beam images, the ion beam [sputters](../ions/sims.md): the FIB is a nanoscale milling machine with the SEM watching. Modern instruments are dual-beam by default, and the combination has quietly become the most important sample preparation tool in materials science.

The defining application for this course is the **site-specific cross-section**. Choose any feature on a wafer, a single transistor, a particle, a corrosion pit, protect it with a locally deposited Pt strap, mill a trench beside it, and the SEM images the exposed cross-section minutes later. Extending the same operations produces the **lift-out lamella**: a micrometers-wide slice undercut, welded to a micromanipulator, transferred to a grid, and thinned to below 100 nm for [STEM](../stem/stem-imaging.md), or sharpened into the needle required by [atom probe tomography](../ions/apt.md). Essentially every STEM image and APT reconstruction of a buried interface in the modern literature passed through this workflow.

FIB damage is the standing caveat. The same collision cascades that mill also implant Ga, amorphize a surface layer (roughly 20 nm per side in Si at 30 kV), and can redeposit sputtered material. Final polishing at 2 to 5 kV shrinks the damage layers to a few nanometers, and low-kV cleanup is mandatory for quantitative STEM work. Two newer source technologies address specific limits: Xe plasma FIB removes material orders of magnitude faster (large cross-sections, serial sectioning tomography) and avoids Ga, and He ion microscopes image with sub-nanometer resolution and mill with nanometer precision. For beam-sensitive and hydrated materials, cryo-FIB preparation transfers the entire workflow to cryogenic temperature, an approach imported from structural biology that is increasingly important for batteries and soft materials.

% TODO: figure: the lift-out sequence as a strip of SEM images (deposit, trench,
% undercut, weld, thin), plus an APT needle-sharpening panel shared with the APT
% page. We have plenty of in-house images for this.

## References and further reading

1. A. J. Schwartz, M. Kumar, B. L. Adams, and D. P. Field (eds.), *Electron Backscatter Diffraction in Materials Science*, 2nd ed., Springer (2009).
2. L. A. Giannuzzi and F. A. Stevie (eds.), *Introduction to Focused Ion Beams*, Springer (2005).
3. J. Mayer, L. A. Giannuzzi, T. Kamino, and J. Michael, TEM sample preparation and FIB-induced damage, *MRS Bulletin* **32**, 400 (2007). [doi.org/10.1557/mrs2007.63](https://doi.org/10.1557/mrs2007.63)
