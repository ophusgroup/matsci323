# Sputtering, SIMS, and LEIS

Bombarding a surface with keV ions removes material. That erosion is a problem for every technique that wants a pristine surface, and it is the enabling mechanism for two others: secondary ion mass spectrometry, which analyzes the removed material, and sputter depth profiling, which uses controlled erosion to expose successively deeper layers for any surface-sensitive spectroscopy. This page covers sputtering physics quantitatively, SIMS in depth, and low-energy ion scattering, the most surface-sensitive compositional probe that exists.

| SIMS at a glance | |
| --- | --- |
| Probe in / signal out | keV primary ions in, secondary ions out into a mass spectrometer |
| Information | Elemental and isotopic composition versus depth; trace impurities; molecular species (static SIMS) |
| Depth probed | Profiles from about 1 nm per point to many micrometers total |
| Lateral resolution | 50 nm to micrometers, mode dependent |
| Sensitivity | The best of any technique in this course: parts per billion, $10^{12}$ atoms/cm$^3$ for favorable dopants |
| Sample requirements | Vacuum compatible; destructive (the analyzed volume is consumed) |

## Sputtering

A keV ion entering a solid deposits its energy in a collision cascade of displaced target atoms, as developed in [ion-solid interactions](ion-solid.md). When the cascade intersects the surface, atoms receiving enough outward momentum to overcome the surface binding energy $U_0$ (a few eV, essentially the sublimation energy) escape: sputtering. In Sigmund's linear cascade theory the **sputter yield** is proportional to the nuclear energy deposited near the surface divided by the binding energy,

$$
Y \propto \frac{\alpha \, S_n(E)}{U_0},
$$

with $\alpha$ a slowly varying function of the mass ratio. The formula packages every practical trend. Yields are typically 0.5 to 10 atoms per ion, rising with ion mass and peaking at the energies where nuclear stopping peaks (hundreds of eV to a few keV for heavy ions); light ions like He sputter poorly because their energy goes to electrons instead. The yield rises with incidence angle to a maximum near 60 to 80 degrees off normal (the cascade sits closer to the surface) before collapsing at grazing angles where ions reflect. Sputtered atoms leave with a broad energy spectrum peaked at a few eV with a long tail, and mostly as neutrals, a fact of central importance for SIMS below.

Two cascade side effects set the resolution limits of everything sputter-based. On a multicomponent target, the species sputter at different rates until the surface composition adjusts itself so that removal becomes stoichiometric (**preferential sputtering**: the steady-state surface is enriched in the slow-sputtering species even as the removed flux matches the bulk). And the cascade relocates atoms without removing them, mixing interfaces over a depth comparable to the ion range (**ion beam mixing**). Together they guarantee that a measured interface is never sharper than the mixing depth, a few nanometers at standard conditions and reducible below one nanometer with low-energy or cluster ion beams.

## Secondary ion mass spectrometry

A small fraction of sputtered atoms leave the surface as ions. SIMS extracts these secondary ions electrostatically into a mass spectrometer and counts them by mass-to-charge ratio. Its extraordinary sensitivity comes from counting individual atoms of any element, hydrogen through uranium with isotopic resolution, against an almost zero background: ppb detection limits are routine for well-behaved impurities, orders of magnitude beyond any other technique in this course, which is why the semiconductor industry's dopant and contaminant metrology is built on SIMS.

The price is quantification, and the reason is worth understanding in detail. Whether a sputtered atom leaves as an ion is decided in its last moments near the surface, by electron exchange with the departing atom; the probability depends exponentially on the local electronic environment, the **matrix effect**. Oxygen bonded into the surface raises the work the electrons must do to neutralize a positive ion, enhancing positive-ion yields by orders of magnitude; cesium implanted into the surface lowers the work function and enhances negative-ion yields similarly. The same boron concentration therefore reads very differently in Si than in SiO$_2$, and raw SIMS intensities are never proportional to composition across a matrix change. Quantitative SIMS is built on **relative sensitivity factors (RSF)**: within one matrix, the impurity signal is ratioed to a matrix signal and calibrated against an ion-implanted standard of known dose (a dose known, ultimately, from RBS). Within a uniform matrix this works to 5 to 20%; across matrices, or in the first few nanometers before sputter equilibrium is reached (the transient region), it fails, and reliable SIMS work reports these limits. Practitioners exploit the matrix effect deliberately, profiling with O$_2^+$ beams for electropositive elements and Cs$^+$ for electronegative ones, choosing the chemistry that maximizes the wanted ion yield.

Two operating regimes serve different questions:

- **Dynamic SIMS** erodes continuously, producing depth profiles of dopants and impurities over micrometers of depth. Depth resolution is characterized by the exponential decay lengths of a profile through an atomically sharp marker layer, set by the mixing physics above; modern low-energy beams reach decay lengths near one nanometer per decade. Crater-edge effects are excluded by electronically gating the signal to the flat crater center, and the depth scale is calibrated by measuring the final crater with a profilometer. The dopant profile of essentially every transistor generation was developed against SIMS data.
- **Static SIMS** keeps the total primary dose below about $10^{12}$ to $10^{13}$ ions/cm$^2$, so that statistically every primary ion strikes previously undisturbed surface (the static limit follows directly from dividing surface site density by the damage cross section of a single impact). The sputtered flux then includes intact molecular fragments that fingerprint surface chemistry, invaluable for polymers, contamination, and organic films.

:::{anywidget} ../../widgets/technique-schematic.js
{ "name": "sims" }
:::

Instrument architectures pair an ion source with one of three analyzers, and the choice shapes the experiment. **Magnetic sector** instruments offer high mass resolution (separating, say, $^{31}$P from $^{30}$SiH, a classic interference in silicon work) and the highest useful yields for dynamic profiling. **Quadrupoles** filter one mass at a time at lower resolution but switch masses quickly and tolerate lower vacuum. **Time-of-flight (ToF)** analyzers pulse the primary beam and time the arrival of secondaries, collecting the *entire* mass spectrum at every pixel; paired with finely focused pulsed cluster sources (Bi$_n^+$ clusters for imaging, C$_{60}^+$ and large Ar gas-cluster beams for gentle organic sputtering), ToF-SIMS produces chemical images at better than 100 nm resolution and, with cluster erosion, molecular depth profiles of organic films that monatomic beams would destroy. Dual-beam ToF instruments separate the roles entirely: a low-energy beam erodes while the pulsed analytical beam samples the crater floor.

All modes share practical artifacts worth checking before trusting a profile: the pre-equilibrium transient at the start, knock-in of surface species (a surface contaminant appears to extend into the film), crater-edge and memory effects, and mass interferences (resolved by high mass resolution or by choosing a different isotope of the same element, an advantage of detecting individual isotopes).

% TODO: figures: (a) collision cascade with sputtered atoms and mixing zone;
% (b) an experimental B-in-Si dynamic SIMS depth profile with implant peak and
% decay length labeled; (c) a ToF-SIMS image. Mark's 2025 Lectures 7-8 have
% several usable examples to redraw or replace.

## Low-energy ion scattering

Drop the ion energy from MeV to a few keV and elastic scattering becomes a purely surface probe. In **LEIS** (also called ion scattering spectroscopy), noble-gas ions of 0.5 to 5 keV scatter from surface atoms, and an electrostatic analyzer measures the scattered ion energy; the [kinematic factor](ion-solid.md) then identifies the surface masses, exactly as in RBS but at a thousandth the energy. What makes LEIS unique is **neutralization**: a noble-gas ion approaching a surface is extremely likely to capture an electron (by Auger or resonant processes) and continue as a neutral, invisible to the electrostatic analyzer. Ions that penetrate to the second layer and back pass close to the surface twice and are neutralized with near certainty, so the *detected ion* signal comes overwhelmingly from single collisions with the outermost atomic layer. No other compositional technique has this strict single-layer selectivity.

The natural applications are exactly the problems where the top layer is the whole story: which element terminates a catalyst particle, how many deposition cycles it takes an ALD film to close over its substrate, which component of an alloy segregates to the surface. Quantification uses reference samples because neutralization probabilities are element-specific, and although the analysis beam itself sputters gently, doses can be kept low enough (static conditions, like static SIMS) that the surface survives a measurement. The spectra also contain, at lower energies, a reionized background carrying subsurface information that modern instruments use as a bonus depth signal.

## References and further reading

1. P. Sigmund, Theory of sputtering I, *Physical Review* **184**, 383 (1969). [doi.org/10.1103/PhysRev.184.383](https://doi.org/10.1103/PhysRev.184.383)
2. A. Benninghoven, F. G. Rüdenauer, and H. W. Werner, *Secondary Ion Mass Spectrometry*, Wiley (1987).
3. J. C. Vickerman and I. S. Gilmore (eds.), *Surface Analysis: The Principal Techniques*, 2nd ed., Wiley (2009), Chapters 4 and 5.
4. H. H. Brongersma, M. Draxler, M. de Ridder, and P. Bauer, Surface composition analysis by low-energy ion scattering, *Surface Science Reports* **62**, 63 (2007). [doi.org/10.1016/j.surfrep.2006.12.002](https://doi.org/10.1016/j.surfrep.2006.12.002)
