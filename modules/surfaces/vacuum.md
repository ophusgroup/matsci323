# Vacuum Technology

Most of the instruments in this course share an unglamorous but essential foundation: a stainless steel chamber pumped to somewhere between $10^{-6}$ and $10^{-11}$ Torr. Vacuum serves two distinct purposes. It keeps the sample surface clean on the timescale of the measurement, as quantified on the [previous page](properties.md), and it gives probe particles (electrons, ions, and the particles they knock loose) a collision-free path from source to sample to detector. This page covers the working knowledge of vacuum practice: gas kinetics, regimes, conductance and pumping, gas loads, pumps, and gauges. It is unglamorous knowledge that every surface scientist ends up needing.

## Gas kinetics

A gas at pressure $P$ and temperature $T$ has molecular density $n = P/k_BT$, about $2.5 \times 10^{19}$ molecules per cm$^3$ at atmosphere and room temperature, and mean molecular speeds of hundreds of meters per second (about 470 m/s for N$_2$ at 300 K). Two derived quantities do most of the work in vacuum arithmetic. The **impingement flux** onto any surface follows from integrating the Maxwell-Boltzmann distribution over molecules moving toward it:

$$
\Phi = \frac{1}{4} n \bar{v} = \frac{P}{\sqrt{2\pi m k_B T}},
$$

and the **mean free path** between molecule-molecule collisions is

$$
\lambda = \frac{k_B T}{\sqrt{2}\, \pi d^2 P},
$$

with $d$ the molecular diameter (0.37 nm for N$_2$): about 70 nm at atmosphere, roughly 5 cm at $10^{-3}$ Torr, and 50 km at $10^{-9}$ Torr. Note what appears in each: the flux measures how often the gas touches your *sample*, the mean free path measures how often it touches *itself*, and the two answer different experimental questions.

The conventional regimes:

| Regime | Pressure (Torr) | Character |
| --- | --- | --- |
| Rough vacuum | 760 to $10^{-3}$ | Viscous flow: molecules collide with each other; pump-down and load locks |
| High vacuum (HV) | $10^{-3}$ to $10^{-8}$ | Molecular flow: molecules collide only with walls; electron microscopes, deposition tools |
| Ultrahigh vacuum (UHV) | below $10^{-8}$ | Surfaces stay clean for hours; surface analysis |

The crossover from viscous to molecular flow happens when $\lambda$ exceeds the chamber dimensions (the Knudsen criterion). In the molecular regime, gas has no collective behavior: each molecule flies ballistically between wall bounces, "pumping" means capturing molecules at surfaces rather than pushing a fluid, and gas moves through tubes only by the random chance of a molecule finding the far end. For any charged-particle instrument the beam path is effectively collision-free once the pressure is below roughly $10^{-5}$ Torr; the much harder UHV requirement comes entirely from surface cleanliness, and instruments that do not care about surface contamination (a conventional SEM, for example) run comfortably at high vacuum.

## The monolayer formation time

The single most useful number in vacuum practice is the time to form one monolayer of adsorbed gas. Dividing a monolayer's worth of sites (about $10^{15}$ per cm$^2$) by the impingement flux, with sticking coefficient one, gives for room-temperature nitrogen the rule of thumb

$$
t_{\mathrm{ML}} \approx \frac{3 \times 10^{-6}}{P}\ \text{seconds, with } P \text{ in Torr}.
$$

At $10^{-6}$ Torr a monolayer forms in seconds; at $10^{-10}$ Torr it takes on the order of ten hours. Surface-sensitive spectroscopy (XPS, AES, LEIS) and atomically resolved surface imaging (STM, LEED) therefore live in UHV, and every discussion of a technique in this course will note how demanding its vacuum requirements really are. Real sticking coefficients are below one and depend on the gas and surface, so these are worst-case times; they are still the right planning numbers, because the residual gas in a UHV system is dominated by exactly the reactive species (water, CO, hydrogen) that stick well. The calculator below carries the full arithmetic across the pressure range; sliding from atmosphere to UHV, fourteen orders of magnitude, is the fastest way to internalize why vacuum hardware dominates surface analysis.

:::{anywidget} ../../widgets/vacuum-calc.js
:::

## Conductance, pumping speed, and gas load

Vacuum systems are described by an Ohm's-law-like bookkeeping. A pump is rated by its **pumping speed** $S$ (volume per unit time, liters per second), and the steady-state pressure follows from the **gas load** $Q$ (throughput, in Torr·L/s) entering the chamber:

$$
P = \frac{Q}{S_{\mathrm{eff}}} .
$$

The subtlety is $S_{\mathrm{eff}}$: gas must travel through tubes and apertures to reach the pump, and in molecular flow each element has a **conductance** $C$ that combines with the pump speed like series resistors, $1/S_{\mathrm{eff}} = 1/S + 1/C$. Molecular-flow conductance is set by geometry alone (for an orifice, proportional to area times the mean molecular speed; for a tube, falling as the tube gets longer and narrower), which teaches the cardinal design rule: short, fat connections to pumps, because a long thin bellows can throttle an expensive pump to a fraction of its rated speed, and no larger pump can fix a conductance-limited system.

The gas load $Q$ has several sources, and which one dominates changes with pressure. Initial pumpdown removes the chamber volume (fast, exponential). What remains is **outgassing**: gas desorbing from every internal surface, overwhelmingly water in an unbaked chamber, which desorbs so slowly at room temperature that an unbaked system stalls near $10^{-8}$ Torr no matter how long it pumps. This is why UHV systems are **baked**, typically at 120 to 200 °C for many hours while pumping, to drive the water off the walls; after cooldown the residual gas is dominated by hydrogen diffusing out of the bulk of the stainless steel itself, the ultimate background of most UHV systems. Beyond outgassing sit true leaks (openings to atmosphere), virtual leaks (trapped volumes such as unvented screw holes that release gas slowly), and permeation through elastomer seals, which is why UHV practice replaces elastomer O-rings with knife-edge copper-gasket (ConFlat) seals, uses low-vapor-pressure materials throughout, and treats fingerprints as a leak you install yourself.

## Pumps

No single pump spans from atmosphere to UHV, so real systems chain several:

- **Roughing pumps** (rotary vane, scroll, diaphragm) work by mechanically trapping and compressing gas, covering atmosphere to the millitorr range, and back turbo pumps continuously. Oil-free (dry) pumps are now standard on analytical instruments because hydrocarbon oil vapor migrating backward into the chamber contaminates every surface analysis.
- **Turbomolecular pumps** use a stack of blades spinning at tens of thousands of rpm; in molecular flow, each blade collision biases the molecule's direction toward the exhaust, compressing the gas stage by stage. They cover roughly $10^{-3}$ to $10^{-10}$ Torr and are the workhorse of modern instruments. Their compression ratio is worst for light gases, which is one reason hydrogen dominates deep UHV.
- **Ion pumps** ionize gas molecules in a magnetically confined discharge and bury the ions in sputtered titanium. They have no moving parts, no oil, and no vibration, making them the standard for UHV analysis chambers and for vibration-sensitive instruments such as STM; their pump current even doubles as a pressure reading.
- **Capture pumps**: cryopumps condense and trap gas on surfaces at tens of kelvin (enormous speed for water), titanium sublimation pumps periodically deposit a fresh chemically reactive Ti film that getters active gases, and non-evaporable getter (NEG) coatings extend the same idea to distributed pumping. Capture pumps saturate and need regeneration, so they always operate alongside throughput pumps.

A typical analysis system combines a load lock (so samples enter without venting the analysis chamber), turbo plus dry roughing on the transfer line, and ion plus titanium sublimation pumping on the baked UHV chamber.

## Gauges and residual gas analysis

Pressure measurement changes physics across fourteen decades. Near atmosphere, capacitance manometers measure the actual force on a diaphragm (gas-species independent, the metrology standard). In rough vacuum, Pirani gauges infer pressure from the thermal conductivity of the gas. From high vacuum down, **ionization gauges** take over: a hot filament emits electrons that ionize residual gas, and the collected ion current is proportional to density. The Bayard-Alpert design, with its fine-wire collector, reads reliably to below $10^{-10}$ Torr, with two caveats worth remembering: readings are species-dependent (calibrated for N$_2$), and the hot filament itself pumps and outgasses slightly.

The most informative vacuum instrument is the **residual gas analyzer (RGA)**, a small quadrupole mass spectrometer (the same analyzer physics as [SIMS](../ions/sims.md)) that reports which gases remain. Reading an RGA spectrum is a core lab skill: mass 18 with 17 (water and its OH fragment) dominates an unbaked chamber; mass 28 could be N$_2$ or CO, and the tell is the companion peaks (mass 32 O$_2$ in atmospheric ratio means a leak; mass 12 and 16 fragments point to CO); mass 2 (H$_2$) dominates a well-baked system; and a ladder of hydrocarbon fragments spaced 14 mass units apart means oil contamination. A leak shows N$_2$ and O$_2$ in their 4:1 atmospheric ratio, while outgassing shows water, and this single diagnostic separates the two most common vacuum ailments in minutes.

% TODO: figure of a generic UHV analysis chamber cross-section labeling load lock,
% transfer arm, pumps, gauges, and analysis position. Mark's Lecture 2 has a version;
% we should redraw a cleaner one. Add a second small figure: example RGA spectra
% (leak vs unbaked vs baked).

## References and further reading

1. J. F. O'Hanlon, *A User's Guide to Vacuum Technology*, 3rd ed., Wiley (2003). The standard practical reference for everything on this page.
2. K. Oura et al., *Surface Science: An Introduction*, Springer (2003), Chapter 2.
3. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapter 1.
