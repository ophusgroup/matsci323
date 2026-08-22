# Unique Properties of Surfaces

A surface is a defect. Terminating a crystal removes the bonding partners of every atom in the outermost layers, and the material responds: surface atoms relax, reconstruct, adsorb whatever the environment offers, and trade places with atoms from the bulk. Every technique in this course exists because the composition and structure of the top few nanometers of a material routinely differ from the bulk, and because those few nanometers control adhesion, catalysis, corrosion, contact resistance, nucleation, and the behavior of essentially every interface in a device.

This page develops the ideas we will use all quarter: surface energy, relaxation and reconstruction, adsorption, and segregation. It also introduces the analytical puzzle that frames the whole course: given a sample and a question, which measurement do you actually perform?

## Surface energy

Creating a surface costs energy, because it breaks bonds. In the simplest broken-bond picture, the surface energy $\gamma$ is the energy of the bonds cut per unit area of surface created. For a crystal with cohesive energy $E_c$ per atom, coordination number $Z$ in the bulk, and $Z_s$ broken bonds per surface atom,

$$
\gamma \approx \frac{Z_s}{Z} \frac{E_c}{A_s},
$$

where $A_s$ is the area per surface atom. This crude estimate captures the correct order of magnitude, typically 0.5 to 3 J/m$^2$ for metals, and it correctly predicts the trends that matter: surface energy scales with cohesive energy, so refractory metals like W have high surface energies while noble metals and van der Waals solids have low ones, and close-packed faces with the fewest broken bonds have the lowest energy. The equilibrium shape of a small crystal follows from minimizing total surface energy over all orientations, the Wulff construction, which is why supported nanoparticles expose predominantly low-index facets.

Surface energy drives much of thin film behavior. Whether a deposited film wets its substrate or balls up into islands is set by the balance of film, substrate, and interface energies, and surface energy differences drive the segregation and adsorption phenomena described below.

% TODO: figure showing broken-bond counting on fcc (111), (100), (110) surfaces,
% and a Wulff construction sketch. Mark's Lecture 2 (2025) has versions of both
% we can redraw.

## Relaxation and reconstruction

The atoms at a surface do not simply sit at truncated bulk positions. In **relaxation**, the surface layers keep the bulk periodicity parallel to the surface but shift perpendicular to it; the first interlayer spacing of most metal surfaces contracts by a few percent. In **reconstruction**, the surface adopts a different two-dimensional periodicity altogether to lower the number of dangling bonds. The canonical example is Si(111), which reconstructs into a 7$\times$7 unit cell containing 49 original surface cells, a structure so complex that solving it required the invention of scanning tunneling microscopy alongside careful diffraction work. Semiconductors reconstruct strongly because their bonds are directional and dangling bonds are energetically expensive; metals reconstruct less often.

Reconstructions matter to us for two reasons. They change surface reactivity and epitaxial growth behavior, and they produce the superstructure spots we will learn to read in low-energy electron diffraction in [Module 6](../stem/leed-rheed.md).

% TODO: figure of relaxation vs reconstruction, plus the Si(111) 7x7 example
% (an STM image would be ideal; public domain versions exist).

## Adsorption and the need for vacuum

A surface in any real environment is being bombarded by gas molecules. The flux of molecules striking a surface follows from the kinetic theory of gases,

$$
\Phi = \frac{P}{\sqrt{2\pi m k_B T}},
$$

where $P$ is the pressure and $m$ the molecular mass. At atmospheric pressure this flux is about $3 \times 10^{23}$ molecules per cm$^2$ per second for nitrogen, enough to deliver a complete monolayer in a few nanoseconds if every molecule stuck. Even at $10^{-6}$ Torr, a good high vacuum, a monolayer arrives roughly every second. Keeping a surface atomically clean for the duration of an experiment, one hour say, requires pressures near $10^{-10}$ Torr. This single estimate explains why surface analysis instruments are built around ultrahigh vacuum, and we treat the technology on the [next page](vacuum.md).

Adsorption itself comes in two flavors. Physisorption binds molecules weakly through van der Waals forces, with binding energies below about 0.3 eV; chemisorption forms true chemical bonds, with energies of 1 eV or more. The coverage at equilibrium depends on pressure and temperature through adsorption isotherms, and the residence time of an adsorbed molecule scales as $\tau = \tau_0 \exp(E_a / k_B T)$, so modest temperature changes swing surface coverage by orders of magnitude.

## Segregation

The composition of a surface is not the composition of the bulk. In an alloy, the component that lowers the total energy, generally the one with the lower surface energy or the larger atomic size mismatch, enriches at the surface. Segregation of a dilute impurity can be dramatic: a bulk concentration of parts per million can produce near-monolayer surface coverage at equilibrium. This is the working principle behind temper embrittlement of steels, the poisoning of catalysts, and many adhesion failures. It is also a warning for us as analysts: a technique that samples the top one or two atomic layers, such as low-energy ion scattering or grazing-emission XPS, can report a composition wildly different from the bulk, and both numbers are correct.

## The analytical puzzle

Every characterization problem in this course reduces to the same set of questions:

- **What do you want to know?** Composition, chemical bonding state, crystal structure, thickness, roughness, morphology, defect content, or a depth profile of any of these.
- **Where is the information?** The top atomic layer, the top few nanometers, a buried interface, or the full film.
- **What resolution and sensitivity do you need?** Lateral resolution from millimeters to angstroms; detection limits from percent to parts per billion.
- **What can the sample tolerate?** Vacuum exposure, electron or ion beam damage, the destruction of the analyzed region, or the effort of preparing a thin cross-section.

No single technique answers all of these at once. XPS gives chemical states but averages over a large spot; atom probe gives three-dimensional composition with atomic resolution but destroys the sample; STEM sees a buried interface directly but only after the interface has been cut out and thinned. Learning the strengths and limits of each technique, well enough to design a characterization strategy for a problem you have never seen before, is the goal of this course. We return to this puzzle explicitly in the [final synthesis lecture](../../synthesis.md).

## References and further reading

1. A. Zangwill, *Physics at Surfaces*, Cambridge University Press (1988), Chapters 1 to 4.
2. K. Oura et al., *Surface Science: An Introduction*, Springer (2003), Chapters 1, 10, and 14.
3. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapter 1.
4. G. Binnig, H. Rohrer, Ch. Gerber, and E. Weibel, 7x7 reconstruction on Si(111) resolved in real space, *Physical Review Letters* **50**, 120 (1983). [doi.org/10.1103/PhysRevLett.50.120](https://doi.org/10.1103/PhysRevLett.50.120)
