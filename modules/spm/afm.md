# AFM

The atomic force microscope maps a surface by touch. A tip a few nanometers sharp, mounted on a flexible cantilever, is scanned across the sample while a feedback loop holds the tip-sample interaction constant; the feedback signal traces out topography with sub-angstrom height resolution. No vacuum, no conductivity requirement, no sample preparation: AFM images metals, oxides, polymers, and wet biological samples with equal indifference, which is why it sits in nearly every materials laboratory and cleanroom. For thin films AFM is the standard measurement of surface roughness, and its quantitative use is the subject of this page.

| At a glance | |
| --- | --- |
| Probe in / signal out | Sharp tip on a cantilever in mechanical interaction with the surface |
| Information | Topography, roughness statistics, step heights, grain morphology; mechanical properties |
| Vertical resolution | Better than 0.1 nm; atomic steps trivially resolved |
| Lateral resolution | 1 to 10 nm, set by tip radius |
| Field of view | Up to about 100 um; scan times of minutes |
| Sample requirements | Any reasonably smooth solid, in air, liquid, or vacuum; nondestructive |

## How the measurement works

The cantilever is the transducer: forces between tip and sample of piconewtons to nanonewtons deflect a cantilever of stiffness 0.01 to 100 N/m, and the deflection is read out by a laser reflected off the cantilever onto a split photodiode, a lever arm that converts sub-angstrom deflections into measurable signals. A **force-distance curve**, deflection versus tip approach, is the technique's Rosetta stone: it shows the long-range attraction, the jump to contact, the repulsive wall, and the adhesion hysteresis on retraction, and everything about imaging modes follows from where on this curve the instrument operates.

- **Contact mode** drags the tip in repulsive contact at constant deflection. Simple and fast, but lateral forces damage soft samples and dull tips.
- **Tapping mode** (amplitude modulation) oscillates the cantilever near resonance and uses the amplitude reduction caused by intermittent contact as the feedback signal. Lateral forces nearly vanish, and this is the default mode for most work. The phase lag of the oscillation maps energy dissipation, often revealing compositional contrast in polymer blends invisible in topography.
- **Non-contact and frequency-modulation modes** sense the force gradient through the resonance frequency shift without touching; in UHV with careful technique this achieves true atomic resolution, including imaging of individual chemical bonds with functionalized tips.

## Quantitative roughness metrology

The AFM's headline number for thin films is roughness, and using it well takes more care than reading the RMS value off the screen. The standard statistics, average roughness $R_a$ and RMS roughness $R_q$, characterize the height distribution, but two surfaces with identical $R_q$ can be morphologically different: one gently undulating, one sharply jagged. The **power spectral density (PSD)** of the height map resolves roughness by lateral wavelength, separating measurement noise, grain-scale texture, and long-range waviness, and is the right basis for comparing films or feeding roughness into optical and XRR models. Any reported roughness is a function of the measured wavelength band, so scan size and pixel density are part of the number; comparing an AFM $R_q$ from a 1 um scan against an [XRR](../photons/xrr.md) roughness, which averages a millimeter footprint and counts all wavelengths, requires exactly this bandwidth thinking.

Step height measurement is the other precision use: an AFM across a masked or etched step measures film thickness absolutely, to sub-nanometer accuracy, with no model at all, a valuable cross-check on the model-dependent thicknesses of ellipsometry and XRR.

## Artifacts

Every AFM image is the convolution of surface and tip. A dull or contaminated tip broadens every feature by its own radius, and features sharper than the tip image the tip instead of the sample (visible as repeated identical shapes). Feedback ringing, thermal drift, scanner bow, and line-to-line offsets all masquerade as topography; flattening and plane-fit corrections are necessary but can also erase real long-wavelength structure. The discipline is simple and non-negotiable: know the tip condition, image the same area twice (rotated once), and treat any feature at the resolution limit with suspicion.

The demonstration below scans a spherical tip across known test structures and shows the measured trace against the truth. Sweep the tip radius on the particles preset and watch every feature broaden as roughly $2\sqrt{rR}$ while heights stay correct; try the trench to see the opposite artifact, a hole the tip cannot enter; and enable the double tip to generate the ghost-image doubling that fools beginners. The roughness readout quantifies the damage: the measured $R_q$ is always at or below the true value, because the tip is a low-pass filter.

:::{anywidget} ../../widgets/afm-tip.js
:::

% TODO: figures still wanted: (a) force-distance curve annotated with imaging-mode
% operating points; (b) beam-deflection schematic; (c) a roughness PSD from real
% film data (good Colab exercise).

## References and further reading

1. B. Voigtländer, *Atomic Force Microscopy*, 2nd ed., Springer (2019).
2. F. J. Giessibl, Advances in atomic force microscopy, *Reviews of Modern Physics* **75**, 949 (2003). [doi.org/10.1103/RevModPhys.75.949](https://doi.org/10.1103/RevModPhys.75.949)
3. G. Binnig, C. F. Quate, and Ch. Gerber, Atomic force microscope, *Physical Review Letters* **56**, 930 (1986). [doi.org/10.1103/PhysRevLett.56.930](https://doi.org/10.1103/PhysRevLett.56.930)
