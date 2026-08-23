# Properties of Surfaces

A surface is a defect. Terminating a crystal removes the bonding partners of every atom in the outermost layers, and the material responds: surface atoms relax, reconstruct, adsorb whatever the environment offers, and trade places with atoms from the bulk. Every technique in this course exists because the composition and structure of the top few nanometers of a material routinely differ from the bulk, and because those few nanometers control adhesion, catalysis, corrosion, contact resistance, nucleation, and the behavior of essentially every interface in a device.

We start with the single most important concept of the module, [surface energy](wiki:Surface_energy), built up first in a two-dimensional model simple enough to play with, then stated properly in three dimensions.

## Surface energy in two dimensions

Consider atoms that interact through pairwise bonds of strength $\varepsilon$, arranged in a two-dimensional close-packed crystal. An atom in the interior has six neighbors and energy near $-3\varepsilon$ (one half of six bonds, since each bond is shared). An atom on a flat close-packed edge keeps only four neighbors, an atom at a corner three, and an isolated atom none. The total energy of a finite crystal is therefore the bulk value plus a positive correction proportional to the length of its perimeter, and that correction is the surface energy: the energy cost of the bonds broken to create the boundary. Everything else on this page follows from atoms rearranging to reduce this cost.

The simulation below makes the idea concrete. Atoms interact through a Lennard-Jones potential cut off at twice the bond length, evolve by Langevin dynamics at a temperature you control with the slider, and are colored by their energy: interior atoms sit at the bottom of the scale and appear dark, while undercoordinated atoms at surfaces, edges, corners, and grain boundaries glow. The box is periodic, so nothing is lost off the edges.

:::{anywidget} ../../widgets/surface-energy.js
:::

Some experiments worth performing, roughly in order:

- **Stability.** The hexagon is the equilibrium shape and simply vibrates. The triangle and snowflake have the same kind of atoms but more perimeter per atom; check their energies against the hexagon in the right panel.
- **Metastability.** The square lattice is not the ground state, yet when cold it persists indefinitely: there is an energy barrier between it and the close-packed lattice. Warm it and it shears into close packing. The quasicrystal, a twelve-fold square-triangle tiling, is built entirely from these two locally stable motifs and likewise holds together cold, transforming only slowly when warmed; the ring teaches the same lesson in shape form. This distinction between the lowest-energy state and the states that survive kinetically is half of thin film science.
- **The limits of pair bonding.** The honeycomb, the open network of graphene, collapses even when cold: a three-coordinated network is floppy under central pair forces no matter how the interaction range is chosen. Watching it crumple is the demonstration of why real 2D materials depend on directional covalent bonds, which resist bending in a way no pair potential can.
- **Surface diffusion.** At moderate temperature, edge atoms hop along the perimeter far more readily than anything moves in the interior. This is why annealing works: the snowflake's arms retract into a compact hexagon by edge diffusion alone.
- **Sintering and ripening.** The pair of touching particles forms a neck that thickens as the two coalesce, eliminating surface. It is slow when cold, because coalescence is limited by the same surface diffusion; warm it gently and watch the neck grow. The islands preset scatters particles of many sizes, the morphology of an early-stage deposited film: warmed, the small islands lose atoms to the large ones.
- **Grain boundaries.** The bicrystal and the two dense polycrystal presets fill the box completely, so the only defects are the internal interfaces. The boundary atoms glow for exactly the same reason edge atoms do: missing and misaligned bonds. Start with the bicrystal to see a single boundary cleanly, compare the energy per atom of coarse and fine grains, then warm the fine-grained sample and watch boundaries move.
- **Phases.** The gas preset starts hot. Cool it through roughly $T = 0.5$ to $0.4$ and a liquid droplet condenses from the vapor; cool further and it crystallizes. Quench fast versus slow and compare the crystals you get. The glass preset is the other endpoint: a jammed amorphous packing of two atom sizes that flows when warmed but resists crystallizing, the structure of an amorphous thin film.
- **Defects by hand.** Drag atoms to build vacancies, adatoms, or notches, and watch them heal, or fail to heal if it is cold. The notch preset seeds a sharp crack for you; warm it and watch the tip blunt.

The energy trace in the right panel is the quantitative summary: every spontaneous change moves it downhill, and each discrete step is one rearrangement event.

## Surface energy in three dimensions

The real quantity is defined thermodynamically: the surface energy $\gamma$ is the reversible work required to create a unit area of new surface,

$$
\gamma = \left( \frac{\partial G}{\partial A} \right)_{T,P,n},
$$

with units of J/m$^2$ (equivalently N/m; values are often quoted in mJ/m$^2$). The two-dimensional bond counting generalizes directly. For a crystal with cohesive energy $E_c$ per atom and coordination number $Z$ in the bulk, a surface that breaks $Z_s$ bonds per surface atom of area $A_s$ costs approximately

$$
\gamma \approx \frac{Z_s}{Z} \frac{E_c}{A_s}.
$$

This crude estimate captures the correct magnitudes and, more importantly, the trends: surface energy scales with cohesive energy, so refractory metals have the highest values and noble metals, molecular solids, and polymers the lowest; and close-packed faces, which break the fewest bonds, have the lowest energy of any orientation. Representative values:

| Material | $\gamma$ (J/m$^2$) |
| --- | --- |
| W | 3.7 |
| Fe | 2.4 |
| Ni | 2.4 |
| Cu | 1.8 |
| Au | 1.5 |
| Si | 1.2 |
| Al | 1.1 |
| Water (liquid) | 0.072 |
| PTFE | 0.02 |

Solid surface energies are measured only with difficulty (typically from high-temperature zero-creep experiments or liquid-metal extrapolations) and calculated values differ between methods, so treat any single number as approximate; the values above follow the compilations of Tyson and Miller ([doi.org/10.1016/0039-6028(77)90442-3](https://doi.org/10.1016/0039-6028(77)90442-3)) and the calculations of Vitos et al. ([doi.org/10.1016/S0039-6028(98)00363-X](https://doi.org/10.1016/S0039-6028(98)00363-X)). Wikipedia's [surface energy](wiki:Surface_energy) article maintains a longer table with sources.

% TODO: verify the table values against the two cited compilations before deploy.

Because $\gamma$ depends on orientation, a crystal free to choose its shape minimizes total surface energy rather than total area, giving the faceted equilibrium shapes of the [Wulff construction](wiki:Wulff_construction), exactly the physics that turned the simulated disk into a hexagon. Surface energy balances also decide whether a deposited film wets its substrate or balls up into islands, set the driving forces for grain growth and sintering, and drive the segregation and adsorption phenomena below.

% TODO: static figure: broken-bond counting on fcc (111), (100), (110) plus a
% Wulff construction sketch; Mark's Lecture 2 (2025) has versions to redraw.

## Relaxation and reconstruction

The atoms at a real surface do not sit at truncated bulk positions. In **relaxation**, the surface layers keep the bulk periodicity parallel to the surface but shift perpendicular to it; the first interlayer spacing of most metal surfaces contracts by a few percent. In **reconstruction**, the surface adopts a different two-dimensional periodicity altogether to reduce the number of dangling bonds. The canonical example is [Si(111) 7x7](wiki:Surface_reconstruction), a reconstruction whose unit cell contains 49 original surface cells and whose structure took a quarter century and the invention of scanning tunneling microscopy to solve. Semiconductors reconstruct strongly because their bonds are directional and dangling bonds are expensive; metals reconstruct less often.

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

The composition of a surface is not the composition of the bulk. In an alloy, the component that lowers the total energy, generally the one with the lower surface energy or the larger size mismatch, enriches at the surface. Segregation of a dilute impurity can be dramatic: a bulk concentration of parts per million can produce near-monolayer surface coverage at equilibrium. This is the working principle behind temper embrittlement of steels, the poisoning of catalysts, and many adhesion failures. It is also a warning for us as analysts: a technique that samples the top one or two atomic layers, such as low-energy ion scattering or grazing-emission XPS, can report a composition wildly different from the bulk, and both numbers are correct.

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
4. W. R. Tyson and W. A. Miller, Surface free energies of solid metals: estimation from liquid surface tension measurements, *Surface Science* **62**, 267 (1977). [doi.org/10.1016/0039-6028(77)90442-3](https://doi.org/10.1016/0039-6028(77)90442-3)
5. L. Vitos, A. V. Ruban, H. L. Skriver, and J. Kollár, The surface energy of metals, *Surface Science* **411**, 186 (1998). [doi.org/10.1016/S0039-6028(98)00363-X](https://doi.org/10.1016/S0039-6028(98)00363-X)
6. G. Binnig, H. Rohrer, Ch. Gerber, and E. Weibel, 7x7 reconstruction on Si(111) resolved in real space, *Physical Review Letters* **50**, 120 (1983). [doi.org/10.1103/PhysRevLett.50.120](https://doi.org/10.1103/PhysRevLett.50.120)
7. [Surface energy](wiki:Surface_energy) on Wikipedia, including its table of measured surface energies.
