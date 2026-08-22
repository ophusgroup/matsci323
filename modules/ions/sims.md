# Sputtering, SIMS, and LEIS

Bombarding a surface with keV ions removes material. That erosion is a problem for every technique that wants a pristine surface, and it is the enabling mechanism for two others: secondary ion mass spectrometry, which analyzes the removed material, and sputter depth profiling, which uses controlled erosion to expose successively deeper layers for any surface-sensitive spectroscopy. This page covers sputtering physics, SIMS, and, in brief, low-energy ion scattering, the most surface-sensitive compositional probe that exists.

| SIMS at a glance | |
| --- | --- |
| Probe in / signal out | keV primary ions in, secondary ions out into a mass spectrometer |
| Information | Elemental and isotopic composition versus depth; trace impurities; molecular species (static SIMS) |
| Depth probed | Profiles from about 1 nm per point to many micrometers total |
| Lateral resolution | 50 nm to micrometers, mode dependent |
| Sensitivity | The best of any technique in this course: parts per billion, $10^{12}$ atoms/cm$^3$ for favorable dopants |
| Sample requirements | Vacuum compatible; destructive (the analyzed volume is consumed) |

## Sputtering

A keV ion entering a solid deposits its energy in a collision cascade of displaced target atoms. When the cascade intersects the surface, atoms with enough energy to overcome the surface binding energy escape: sputtering. The sputter yield $Y$, atoms removed per incident ion, is typically 0.5 to 10 and, in the linear cascade regime described by Sigmund's theory, scales with the nuclear stopping power deposited near the surface. Yield rises with ion mass, peaks at incidence angles near 60 to 70 degrees from normal, and varies element by element, which has an important consequence: on a multicomponent target, the species sputter at different rates until the surface composition adjusts to make removal stoichiometric (preferential sputtering). The cascade also relocates atoms without removing them, mixing interfaces over a depth comparable to the ion range. Preferential sputtering and ion beam mixing together set the fundamental limits of all sputter depth profiling: measured interfaces are never sharper than the mixing depth, a few nanometers at standard conditions, reducible below 1 nm with low-energy or cluster ion beams.

## Secondary ion mass spectrometry

A small fraction of sputtered atoms leave the surface as ions. SIMS extracts these secondary ions into a mass spectrometer and counts them by mass-to-charge ratio. Its extraordinary sensitivity comes from counting individual atoms of any element (hydrogen through uranium, with isotopic resolution) against an almost zero background; ppb detection limits are routine for well-behaved impurities, orders of magnitude beyond any other technique in this course.

The price is quantification. The ionization probability of a sputtered atom depends violently on its chemical environment, the **matrix effect**: oxygen in the surface enhances positive ion yields by orders of magnitude, cesium enhances negative ones, and the same boron concentration reads differently in Si than in SiO$_2$. Raw SIMS intensities are therefore never proportional to composition across a matrix change. Quantitative SIMS uses relative sensitivity factors calibrated with ion-implanted standards of known dose (measured, ultimately, against RBS), valid only within a single matrix. Practitioners exploit the matrix effect deliberately, profiling with O$_2^+$ beams for electropositive elements and Cs$^+$ beams for electronegative ones.

Two operating regimes serve different questions:

- **Dynamic SIMS** erodes continuously, producing depth profiles of dopants and impurities over micrometers of depth with nanometer-scale resolution. The dopant profile of essentially every transistor generation was developed against SIMS data.
- **Static SIMS** keeps the total ion dose below about $10^{12}$ ions/cm$^2$ so that each primary ion strikes undisturbed surface. The sputtered flux then includes intact molecular fragments that fingerprint surface chemistry, invaluable for polymers, contamination, and organic films. Modern instruments use pulsed cluster sources (Bi$_n^+$, C$_{60}^+$, large Ar clusters) with time-of-flight (ToF) analyzers that collect complete mass spectra at every pixel of an image; cluster beams sputter organics gently enough to depth-profile even molecular films.

Instrument architectures pair the source with a quadrupole, magnetic sector, or ToF analyzer, trading throughput, mass resolution, and imaging. All modes share practical artifacts worth knowing before trusting any profile: crater-edge signal, knock-in of surface species, and transient yields in the first nanometers before sputter equilibrium.

% TODO: figures: (a) collision cascade with sputtered atoms and mixing zone;
% (b) an experimental B-in-Si dynamic SIMS depth profile with implant peak;
% (c) a ToF-SIMS image of a patterned or contaminated surface. Mark's 2025
% Lectures 7-8 have several usable examples to redraw or replace.

## Low-energy ion scattering

Drop the ion energy from MeV to a few keV and scattering becomes a purely surface probe. In **LEIS** (also called ISS), noble gas ions scatter from surface atoms with energies still given by the kinematic factor, so peak positions identify surface masses. The remarkable property is neutralization: a noble gas ion that penetrates past the first atomic layer is almost certain to be neutralized and thus invisible to an electrostatic analyzer. The detected signal therefore comes from the outermost atomic layer alone, making LEIS the definitive measurement of which atoms terminate a surface. Its natural applications are catalysis, atomic layer deposition nucleation, and segregation, exactly the problems where the top layer is the whole story. Quantification requires reference samples, and the analysis consumes little material, though sputtering by the analysis beam itself limits repeated measurement.

## References and further reading

1. P. Sigmund, Theory of sputtering I, *Physical Review* **184**, 383 (1969). [doi.org/10.1103/PhysRev.184.383](https://doi.org/10.1103/PhysRev.184.383)
2. A. Benninghoven, F. G. Rüdenauer, and H. W. Werner, *Secondary Ion Mass Spectrometry*, Wiley (1987).
3. J. C. Vickerman and I. S. Gilmore (eds.), *Surface Analysis: The Principal Techniques*, 2nd ed., Wiley (2009), Chapters 4 and 5.
4. H. H. Brongersma, M. Draxler, M. de Ridder, and P. Bauer, Surface composition analysis by low-energy ion scattering, *Surface Science Reports* **62**, 63 (2007). [doi.org/10.1016/j.surfrep.2006.12.002](https://doi.org/10.1016/j.surfrep.2006.12.002)
