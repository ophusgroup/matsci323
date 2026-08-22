# LEED and RHEED

Electrons diffract, and their diffraction is the most direct measurement of surface crystal structure we have. This page covers the two surface electron diffraction techniques: low-energy electron diffraction (LEED), the classical probe of surface crystallography, and reflection high-energy electron diffraction (RHEED), the real-time growth monitor built into nearly every MBE and oxide deposition system. Both reuse machinery from earlier modules: the reciprocal lattice concepts of [XRD](../photons/xrd.md), applied to a two-dimensional lattice, and the [escape depth physics](../espec/electron-solid.md) that makes low-energy electrons surface sensitive. Both also set up the transmission diffraction of the [STEM pages](stem-imaging.md) that follow.

## Diffraction from a two-dimensional lattice

A surface is periodic in two dimensions only. Its reciprocal "lattice" is therefore a set of **rods** perpendicular to the surface rather than points: with no periodicity normal to the surface, there is no third Laue condition to satisfy, and diffracted beams appear wherever the Ewald sphere crosses a rod, at every incident energy. This one geometric fact shapes everything on this page.

Surface structures are named by how their two-dimensional mesh relates to the substrate net, using Wood's notation: Si(111) 7x7 for the famous reconstruction, c(2x2) for a centered overlayer, and so on. Any periodicity larger than the substrate's produces additional, more closely spaced rods, so superstructures announce themselves as extra spots.

## LEED

LEED fires electrons of 20 to 300 eV at normal incidence and displays the elastically backscattered beams on a hemispherical fluorescent screen. At these energies the [IMFP](../espec/electron-solid.md) sits at its minimum, so the pattern comes from the top few atomic layers: LEED is the surface counterpart of a single-crystal X-ray photograph. Reading the pattern is immediate: the spot geometry gives the surface mesh and its symmetry, extra spots reveal reconstructions or ordered adsorbate overlayers, and spot sharpness measures the ordered domain size. A sharp, low-background pattern is the accepted certificate of a clean, well-ordered surface, which is why a LEED image opens so many surface science papers.

Two caveats define the technique's scope. It requires UHV and a conductive, ordered surface, and spot positions alone give only the mesh, not atomic positions within it; extracting full structures requires modeling the strong multiple scattering of low-energy electrons (dynamical LEED I-V analysis), a specialist's art. In this course LEED serves chiefly as the vocabulary for surface order, and as preparation for reading diffraction in the STEM.

% TODO: figure: Ewald construction for rods vs points, side by side with a real
% LEED pattern of a reconstructed surface. Mark's Lecture 16 has usable pattern
% photos; the construction we should draw cleanly ourselves.

## RHEED

RHEED sends 10 to 30 keV electrons at grazing incidence, one to three degrees, onto the surface. The high energy would probe deeply at normal incidence, but geometry rescues surface sensitivity: at grazing angles the beam path through the material stays within the top few atomic layers. The diffraction pattern, streaks where the nearly flat Ewald sphere grazes the reciprocal rods, appears on a screen across the chamber. The grazing geometry leaves the space above the sample completely open, which is the point: RHEED coexists with deposition sources, and monitors the film as it grows.

Three readings make RHEED the growth technique it is:

- **Pattern character**: streaks indicate a smooth two-dimensional surface, spots indicate transmission through three-dimensional islands, rings indicate polycrystal. The transition from streaks to spots announces roughening in real time.
- **Reconstruction**: fractional-order streaks track surface reconstructions, which in MBE practice calibrate temperature and flux conditions.
- **Intensity oscillations**: in layer-by-layer growth the specular intensity oscillates with exactly one period per monolayer, as the surface cycles between smooth (complete layer) and rough (half layer). Counting oscillations counts monolayers, giving absolute growth rate calibration to a fraction of a monolayer, the standard by which MBE shutters are timed.

% TODO: figure: RHEED geometry, streak vs spot patterns, and an oscillation trace
% with the monolayer cartoon. The oscillation figure is a strong candidate for a
% simple animation on this page.

## References and further reading

1. K. Oura et al., *Surface Science: An Introduction*, Springer (2003), Chapters 4 and 5.
2. A. Ichimiya and P. I. Cohen, *Reflection High-Energy Electron Diffraction*, Cambridge University Press (2004).
3. M. A. Van Hove, W. H. Weinberg, and C.-M. Chan, *Low-Energy Electron Diffraction*, Springer (1986).
