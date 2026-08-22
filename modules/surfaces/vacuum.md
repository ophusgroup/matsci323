# Vacuum Technology

Most of the instruments in this course share an unglamorous but essential foundation: a stainless steel chamber pumped to somewhere between $10^{-6}$ and $10^{-11}$ Torr. Vacuum serves two distinct purposes. It keeps the sample surface clean on the timescale of the measurement, as quantified on the [previous page](properties.md), and it gives probe particles (electrons, ions, and the particles they knock loose) a collision-free path from source to sample to detector. This page covers the working vocabulary of vacuum practice: regimes, mean free path, pumps, gauges, and the realities of achieving ultrahigh vacuum.

## Vacuum regimes and mean free path

The mean free path of a gas molecule,

$$
\lambda = \frac{k_B T}{\sqrt{2}\, \pi d^2 P},
$$

with $d$ the molecular diameter, is about 70 nm at atmospheric pressure and roughly 50 m at $10^{-6}$ Torr. The conventional regimes:

| Regime | Pressure (Torr) | Character |
| --- | --- | --- |
| Rough vacuum | 760 to $10^{-3}$ | Viscous flow; pump-down and load locks |
| High vacuum (HV) | $10^{-3}$ to $10^{-8}$ | Molecular flow; electron microscopes, deposition tools |
| Ultrahigh vacuum (UHV) | below $10^{-8}$ | Surfaces stay clean for hours; surface analysis |

Two consequences follow. First, in the molecular flow regime gas molecules travel in straight lines and collide with walls rather than each other, so "pumping" means capturing molecules at surfaces rather than pushing a fluid. Second, for any charged-particle instrument the beam path is effectively collision-free once the pressure is below roughly $10^{-5}$ Torr; the much harder UHV requirement comes entirely from surface cleanliness, and instruments that do not care about surface contamination (a conventional SEM, for example) run comfortably at high vacuum.

## The monolayer formation time

The single most useful number in vacuum practice is the time to form one monolayer of adsorbed gas. Combining the impingement flux with a sticking coefficient $s$ and a monolayer density of about $10^{15}$ sites/cm$^2$ gives, for room-temperature nitrogen and $s = 1$, the rule of thumb

$$
t_{\mathrm{ML}} \approx \frac{3 \times 10^{-6}}{P}\ \text{seconds, with } P \text{ in Torr}.
$$

At $10^{-6}$ Torr a monolayer forms in seconds; at $10^{-10}$ Torr it takes on the order of ten hours. Surface-sensitive spectroscopy (XPS, AES, LEIS) and atomically resolved surface imaging (STM, LEED) therefore live in UHV, and every discussion of a technique in this course will note how demanding its vacuum requirements really are.

## Pumps

No single pump spans from atmosphere to UHV, so real systems chain several:

- **Roughing pumps** (rotary vane, scroll, diaphragm) take a chamber from atmosphere to the millitorr range and back up turbo pumps continuously. Oil-free (dry) pumps are now standard on analytical instruments to avoid hydrocarbon contamination.
- **Turbomolecular pumps** use a stack of blades spinning at tens of thousands of rpm to impart momentum to gas molecules. They cover roughly $10^{-3}$ to $10^{-10}$ Torr and are the workhorse of modern instruments.
- **Ion pumps** ionize gas molecules and bury them in sputtered titanium. They have no moving parts and no vibration, which makes them the standard for UHV analysis chambers and for instruments sensitive to mechanical noise such as STM.
- **Cryopumps and titanium sublimation pumps** capture gas on cold or freshly deposited getter surfaces, and provide high pumping speed for water and hydrogen respectively.

## Gauges, bakeout, and residual gas

Pressure measurement changes technology across the range: capacitance manometers and Pirani gauges cover rough vacuum, while ionization gauges (hot filament Bayard-Alpert type) cover HV and UHV by ionizing residual gas and measuring the ion current. A quadrupole residual gas analyzer, essentially a small mass spectrometer, identifies which gases remain, and is the first diagnostic reached for when a chamber misbehaves; a leak shows up as N$_2$ and O$_2$ in atmospheric ratio, while outgassing shows up as water and hydrogen.

Reaching UHV requires more than pumping. Water clings to chamber walls tenaciously, and desorbs so slowly at room temperature that an unbaked chamber stalls near $10^{-8}$ Torr. Systems are therefore baked at 120 to 200 °C for many hours to drive water off the walls while pumping. After bakeout the residual gas is dominated by hydrogen diffusing out of the stainless steel itself. UHV practice also dictates materials: metal gaskets instead of elastomers, low-vapor-pressure materials only, and no fingerprints, ever.

% TODO: figure of a generic UHV analysis chamber cross-section labeling load lock,
% transfer arm, pumps, gauges, and analysis position. Mark's Lecture 2 has a version;
% we should redraw a cleaner one.

## References and further reading

1. J. F. O'Hanlon, *A User's Guide to Vacuum Technology*, 3rd ed., Wiley (2003).
2. K. Oura et al., *Surface Science: An Introduction*, Springer (2003), Chapter 2.
3. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapter 1.
