# Appendix: Near-Field and Evanescent-Wave Microscopy

Earlier versions of this course devoted lectures to scanning near-field optical microscopy (SNOM) and related evanescent-wave techniques. That material lives on here as reference: the techniques remain scientifically active, especially in nanophotonics, but they are specialist tools rather than general thin film metrology.

The diffraction limit restricts conventional optics to feature sizes of roughly half a wavelength, a few hundred nanometers for visible light. Near-field microscopy evades the limit by exploiting evanescent fields, the non-propagating components of light that decay exponentially within a wavelength of a surface and carry the sub-wavelength spatial information that never reaches a far-field lens.

**Aperture SNOM** squeezes light through a sub-wavelength aperture, a metal-coated tapered fiber with an opening of 50 to 100 nm, scanned within nanometers of the surface using shear-force feedback borrowed from [AFM](../modules/spm/afm.md). Resolution is set by the aperture, not the wavelength, reaching tens of nanometers; throughput falls catastrophically with aperture size, which is the mode's fundamental tension.

**Scattering-type SNOM (s-SNOM)** abandons the aperture: a sharp metal AFM tip acts as an antenna, concentrating the illuminating field at its apex and scattering the local near-field response to a far-field detector, with interferometric detection and demodulation at harmonics of the tip oscillation to reject background. Resolution of 10 to 20 nm, independent of wavelength, extends into the infrared and terahertz, where s-SNOM maps phonon and plasmon polaritons, local conductivity, and chemical absorption at scales a hundred times below the free-space wavelength. Nano-FTIR, its broadband cousin, delivers infrared spectra from tens-of-nanometer regions, a genuine chemical identification capability for polymer blends and 2D material heterostructures.

**Total internal reflection and waveguide methods** use the evanescent tail above a surface of high refractive index for surface-selective excitation; TIRF microscopy is a staple of single-molecule biophysics, and attenuated total reflection (ATR) geometries make infrared spectroscopy surface sensitive.

For thin film problems these techniques answer optical and chemical questions at scales between confocal optics and electron microscopy, without vacuum and often without contact. They remain in the appendix because their operation is expert work and their information, for most films, is obtainable faster by the mainline techniques of this course.

## References and further reading

1. L. Novotny and B. Hecht, *Principles of Nano-Optics*, 2nd ed., Cambridge University Press (2012).
2. X. Chen et al., Modern scattering-type scanning near-field optical microscopy for advanced material research, *Advanced Materials* **31**, 1804774 (2019). [doi.org/10.1002/adma.201804774](https://doi.org/10.1002/adma.201804774)
