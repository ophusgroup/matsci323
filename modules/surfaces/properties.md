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

The cleanest way to see where the formula comes from is a cleaving thought experiment: split a crystal along a plane, and the work done equals the number of bonds crossing that plane times the bond energy, shared between the *two* new surfaces created. Diamond makes a concrete worked example, because its bonds are well defined. Cleaving on (111) breaks one bond per surface atom; with the (111) packing density of $1.8 \times 10^{15}$ atoms/cm$^2$ and a C-C bond energy of about 6.2 x $10^{-19}$ J, the estimate gives $\gamma_{(111)} \approx 5.6$ J/m$^2$. Cleaving on (100) breaks *two* bonds per atom at a slightly lower packing density, roughly doubling the answer. Both numbers are enormous by the standards of the table below, which is why diamond is hard to cleave and why its surfaces reconstruct aggressively, and the factor of two between them is why cleavage selects (111).

The broken-bond picture also predicts a useful correlation: the same bonds that hold a surface together must be broken completely to sublime an atom, so the surface energy per atom should be a fixed fraction (the fraction of bonds lost, typically one quarter to one half) of the sublimation energy per atom. Plotting measured surface energies against tabulated heats of sublimation confirms it across the periodic table, which is practically valuable because sublimation heats are measured easily and surface energies are not: when you need a $\gamma$ that is not in the tables, the sublimation heat gets you within tens of percent.

This crude estimate captures the correct magnitudes and, more importantly, the trends: surface energy scales with cohesive energy, so bond type organizes the table. Van der Waals solids sit lowest, hydrogen-bonded liquids next, then metals in proportion to their cohesion, and covalent networks highest. Representative values:

| Material | Bonding | $\gamma$ (J/m$^2$) |
| --- | --- | --- |
| PTFE | van der Waals | 0.02 |
| Polyethylene | van der Waals | 0.03 |
| Water (liquid) | hydrogen bonding | 0.072 |
| Mercury (liquid) | metallic | 0.49 |
| Al | metallic | 1.1 |
| Au | metallic | 1.5 |
| Cu | metallic | 1.8 |
| Fe | metallic | 2.4 |
| W | metallic | 3.7 |
| MgO (100) | ionic | 1.2 |
| Si | covalent | 1.2 |
| Diamond (111) | covalent | about 5.7 |

One more comparison with large practical consequences: metal *oxides* generally have far lower surface energies than their parent metals, often by a factor of five or more. Energetically, an oxide skin is therefore a way for a metal surface to buy down its surface energy, one reason oxide films spread over and passivate metals, and a standing warning that the surface you measure on any air-exposed metal is an oxide surface unless you cleaned it in vacuum.

Solid surface energies are measured only with difficulty (typically from high-temperature zero-creep experiments or liquid-metal extrapolations) and calculated values differ between methods, so treat any single number as approximate; the values above follow the compilations of Tyson and Miller ([doi.org/10.1016/0039-6028(77)90442-3](https://doi.org/10.1016/0039-6028(77)90442-3)) and the calculations of Vitos et al. ([doi.org/10.1016/S0039-6028(98)00363-X](https://doi.org/10.1016/S0039-6028(98)00363-X)). Wikipedia's [surface energy](wiki:Surface_energy) article maintains a longer table with sources.

% TODO: verify the table values against the two cited compilations before deploy.

Because $\gamma$ depends on orientation, a crystal free to choose its shape minimizes total surface energy rather than total area, giving the faceted equilibrium shapes of the [Wulff construction](wiki:Wulff_construction), exactly the physics that turned the simulated disk into a hexagon. Surface energy balances also decide whether a deposited film wets its substrate or balls up into islands, set the driving forces for grain growth and sintering, and drive the segregation and adsorption phenomena below.

The construction below computes both cases. On the left, the polar plot of $\gamma(\theta)$ and the equilibrium shape it generates: with no anisotropy the shape is a circle (a liquid drop), and as anisotropy grows, facets appear and sharpen. On the right, the Winterbottom extension puts the same crystal on a substrate: the balance of surface, interface, and substrate energies truncates the shape, and sweeping the wetting parameter moves the island continuously from a barely attached particle to a spread film. This is the equilibrium framework behind island growth, dewetting, and why deposited films ball up on substrates they do not wet.

:::{anywidget} ../../widgets/wulff.js
:::

:::{figure} ../../assets/figures/gamma-vs-sublimation.svg
:alt: Surface energies of metals plotted against their heats of sublimation, showing a linear correlation
:width: 75%

Surface energy against heat of sublimation for representative metals: the same bonds are broken partially by a surface and completely by sublimation, so the two track each other. Values are approximate; the correlation is the point.
:::

% TODO: static figure still wanted: broken-bond counting on fcc (111), (100), (110).

## Terraces, steps, and kinks

Real surfaces are not single perfect planes. A surface cut slightly off a low-index orientation (a vicinal surface) decomposes into low-energy terraces separated by atomic steps, with the step spacing set by the miscut angle; the steps themselves contain kinks. This terrace-step-kink picture organizes almost everything kinetic that happens on a surface. Kink sites are special: an atom attaching or detaching at a kink leaves the kink itself unchanged, so the kink is the repeatable growth site, and its energy sets the equilibrium between a crystal and its vapor. Steps are where deposited atoms attach during growth and where atoms detach during evaporation and etching, which is why growth and dissolution both proceed by steps flowing across terraces rather than by atoms landing at random. The step and kink energies are the one- and zero-dimensional analogues of the surface energy, and the simulation above displays all three: facets (low energy, dark), step edges along the facets (brighter), and kink and corner atoms (brightest of all).

A related distinction worth keeping precise: the **surface energy** $\gamma$ is the work to create new area (by cleaving), while the **surface stress** is the work to elastically stretch existing area. For liquids the two are equal, because a stretched liquid surface immediately repopulates with atoms; for solids they differ, and surface stress is what bends micromechanical cantilevers when molecules adsorb on one face.

## Relaxation and reconstruction

The atoms at a real surface do not sit at truncated bulk positions. In **relaxation**, the surface layers keep the bulk periodicity parallel to the surface but shift perpendicular to it; the first interlayer spacing of most metal surfaces contracts by a few percent. In **reconstruction**, the surface adopts a different two-dimensional periodicity altogether to reduce the number of dangling bonds. The canonical example is [Si(111) 7x7](wiki:Surface_reconstruction), a reconstruction whose unit cell contains 49 original surface cells and whose structure took a quarter century and the invention of scanning tunneling microscopy to solve. Semiconductors reconstruct strongly because their bonds are directional and dangling bonds are expensive; metals reconstruct less often.

Reconstructions matter to us for two reasons. They change surface reactivity and epitaxial growth behavior, and they produce the superstructure spots we will learn to read in low-energy electron diffraction in [Module 6](../stem/leed-rheed.md).

:::{figure} ../../assets/figures/relax-reconstruct.svg
:alt: Three atom-row schematics comparing a bulk-terminated surface, a relaxed surface with contracted first interlayer spacing, and a reconstructed surface with dimer rows

The three responses of a terminated crystal: hypothetical bulk termination, relaxation of the first interlayer spacing, and reconstruction into a new surface periodicity, drawn here as dimer rows of the kind Si(100) forms.
:::

% TODO: figure still wanted: an STM image of the Si(111) 7x7 (public domain
% versions exist).

## Adsorption and the need for vacuum

A surface in any real environment is being bombarded by gas molecules. The flux of molecules striking a surface follows from the kinetic theory of gases,

$$
\Phi = \frac{P}{\sqrt{2\pi m k_B T}},
$$

where $P$ is the pressure and $m$ the molecular mass. At atmospheric pressure this flux is about $3 \times 10^{23}$ molecules per cm$^2$ per second for nitrogen, enough to deliver a complete monolayer in a few nanoseconds if every molecule stuck. Even at $10^{-6}$ Torr, a good high vacuum, a monolayer arrives roughly every second. Keeping a surface atomically clean for the duration of an experiment, one hour say, requires pressures near $10^{-10}$ Torr. This single estimate explains why surface analysis instruments are built around ultrahigh vacuum, and we treat the technology on the [next page](vacuum.md).

Adsorption itself comes in two flavors. Physisorption binds molecules weakly through van der Waals forces, with binding energies below about 0.3 eV; chemisorption forms true chemical bonds, with energies of 1 eV or more. The residence time of an adsorbed molecule scales as $\tau = \tau_0 \exp(E_a / k_B T)$ with $\tau_0$ a vibrational period of order $10^{-13}$ s, so modest temperature changes swing surface coverage by orders of magnitude: a physisorbed molecule at room temperature leaves almost immediately, while a chemisorbed one is effectively permanent.

The simplest quantitative model of equilibrium coverage is the **Langmuir isotherm**: assume a fixed number of equivalent sites, one molecule per site, and no interactions between adsorbates. Balancing the arrival rate (proportional to pressure, from the flux formula above, times the fraction of empty sites) against the thermally activated desorption rate gives a coverage

$$
\theta = \frac{bP}{1 + bP},
$$

which rises linearly at low pressure and saturates at one monolayer, with $b(T)$ containing the binding energy. Real systems decorate this picture with adsorbate interactions, multilayer condensation, and site heterogeneity, but the Langmuir form remains the working baseline, and temperature-programmed desorption (an appendix-list technique) measures the binding energies directly by ramping the temperature and watching molecules leave.

Adsorbed atoms also move. Surface diffusion is thermally activated hopping between sites, with barriers typically a few tenths of an electron-volt on close-packed metal terraces, far below bulk diffusion barriers; this is why surfaces equilibrate at temperatures where bulks are frozen, and why every annealing behavior in the simulation above is dominated by atoms skating along edges rather than moving through the interior. One subtlety with large consequences for film growth: an atom approaching a descending step often faces an extra barrier to hopping down over the edge (the Ehrlich-Schwoebel barrier), which traps atoms on top of islands and can tip growth from smooth layer-by-layer toward three-dimensional mounds, a kinetic effect we will meet again in the [RHEED discussion](../stem/leed-rheed.md) of growth modes.

## Segregation

The composition of a surface is not the composition of the bulk. In an alloy, the component that lowers the total energy, generally the one with the lower surface energy or the larger size mismatch, enriches at the surface. The equilibrium enrichment follows Boltzmann statistics: moving an atom to the surface costs the fraction $f$ of its bonds that a surface site lacks, so each species distributes as

$$
\frac{C_{surf}}{C_{bulk}} \propto \exp\!\left( \frac{-f\, \Delta E_{sub}}{RT} \right),
$$

and the species with the smaller sublimation energy (the weaker bonder, the lower-$\gamma$ component) wins the surface. Because the energies in the exponent are electron-volts against a thermal energy of hundredths of an electron-volt, the enrichment factors are large: segregation of a dilute impurity can be dramatic, and a bulk concentration of parts per million can produce near-monolayer surface coverage at equilibrium. This is the working principle behind temper embrittlement of steels, the poisoning of catalysts, and many adhesion failures. It is also a warning for us as analysts: a technique that samples the top one or two atomic layers, such as low-energy ion scattering or grazing-emission XPS, can report a composition wildly different from the bulk, and both numbers are correct.

## The electronic surface

The electrons feel the surface too. The conduction electron density of a metal does not stop abruptly at the last atomic plane: it spills a fraction of an angstrom into the vacuum and, inside the crystal, relaxes back toward the bulk density through decaying (Friedel) oscillations. The spillout separates negative charge from the positive ion cores, creating a surface dipole layer, and that dipole is part of the work function, which is why the work function of a single metal differs measurably from facet to facet and why adsorbates that donate or withdraw charge shift it strongly. Localized electronic states that exist only at the surface (surface states, and the dangling bonds of semiconductors) pin Fermi levels at interfaces and drive the reconstructions above. These electronic differences are not a curiosity for us: they are the contrast mechanism of [scanning tunneling microscopy](../spm/spm-modes.md), the signal of [Kelvin probe microscopy](../spm/spm-modes.md), and the reason work functions appear throughout the electron spectroscopies of [Module 4](../espec/xps.md).

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
