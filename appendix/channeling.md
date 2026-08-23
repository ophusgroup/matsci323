# Appendix: Ion Channeling

Channeling extends [RBS](../modules/ions/rbs.md) from composition into crystallography. It appears here as reference material: historically central to semiconductor science, now practiced at the same few accelerator laboratories as RBS itself.

When an MeV ion beam is aligned with a low-index axis of a single crystal, ions entering between rows are steered by a series of correlated small-angle collisions and never approach a lattice atom closely enough to backscatter. The backscattering yield collapses, to a few percent of the random-orientation value for a good crystal, as long as the beam stays within a critical angle of the axis,

$$
\psi_c \approx \sqrt{ \frac{2 Z_1 Z_2 e^2}{E d} },
$$

typically well under one degree at MeV energies, with $d$ the atomic spacing along the row.

Three measurements follow from this steering effect:

- **Crystalline quality.** The minimum yield $\chi_{min}$, the ratio of aligned to random backscattering just below the surface, is a direct figure of merit: about 2 to 3% for a perfect crystal, rising with defect density. Depth-resolved aligned spectra profile damage, the classic application being implantation damage and its annealing recovery, including the crystalline-to-amorphous transition and epitaxial regrowth.
- **Impurity lattice location.** An impurity on substitutional sites is shadowed exactly like the host and disappears from the aligned spectrum; an interstitial impurity sits in the open channels and keeps scattering. Comparing aligned and random yields for host and impurity, across several axes, triangulates where in the unit cell an impurity sits, how it was determined that implanted-and-annealed dopants in silicon are substitutional.
- **Surface and interface structure.** The first atomic layer is never shadowed, so the aligned spectrum retains a surface peak whose area counts the atoms visible to the beam; reconstruction, relaxation, and adsorbates change this count, and a thin amorphous or strained interface layer adds to it.

Channeling requires a goniometer and a single crystal, and its niches have largely been inherited by X-ray diffraction (strain, quality) and STEM (defects, interfaces). It appears in this appendix because the physics reappears as electron channeling in EBSD patterns and STEM imaging of aligned crystals, and because accidental channeling in an epitaxial substrate makes it read as anomalously transparent in RBS.

## References and further reading

1. L. C. Feldman, J. W. Mayer, and S. T. Picraux, *Materials Analysis by Ion Channeling*, Academic Press (1982).
2. W.-K. Chu, J. W. Mayer, and M.-A. Nicolet, *Backscattering Spectrometry*, Academic Press (1978), Chapter 8.
