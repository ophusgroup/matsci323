---
title: "Phonon modes of ZnPS3"
short_title: "ZnPS3 phonons"
---

ZnPS$_3$ is a layered thiophosphate studied as a solid-state Zn$^{2+}$ ion conductor.

Its phonons near 3.7 and 5.5 THz are of interest for how lattice vibrations couple to Zn hopping, and this page shows what those vibrations look like.

## Structure

ZnPS$_3$ is monoclinic, space group C2/m, with one layer per cell.

- Zn sits in edge-sharing ZnS$_6$ octahedra that form a honeycomb (blue).
- A P$_2$ dimer sits at the center of each honeycomb hexagon, bonded to six S that also form an octahedron (gold), the P$_2$S$_6$ unit.
- The layers are held together by van der Waals forces between the S planes.

## Calculation

The modes are computed at the Γ point, the center of the Brillouin zone, which is the only wavevector light couples to.

- Cell from the Materials Project style CIF (PBE), held fixed; atomic positions relaxed with the MACE-MP-0 machine-learned potential.
- Force constants by finite displacements with phonopy, then the eigenvectors of the dynamical matrix.
- C2/m has inversion symmetry, so Raman-active modes (Ag, Bg) and infrared-active modes (Au, Bu) are separate.
- MACE-MP-0 frequencies are typically within about 10% of experiment, so the mode near a measured frequency is a candidate, not an assignment.

## Modes

:::{anywidget} ../../widgets/znps3-phonons.js
:::

Optical modes below 6 THz, with the share of the vibrational kinetic energy carried by each element. Ag and Bg modes are Raman active, Au and Bu infrared active.

| THz | cm$^{-1}$ | Symmetry | Zn | P | S |
| --- | --- | --- | --- | --- | --- |
| 0.54i | unstable | Bg | 88% | 0% | 12% |
| 1.57 | 52 | Bg | 11% | 10% | 78% |
| 1.57 | 52 | Ag | 11% | 10% | 79% |
| 1.89 | 63 | Bu | 52% | 3% | 44% |
| 1.89 | 63 | Au | 53% | 3% | 43% |
| 2.43 | 81 | Ag | 86% | 1% | 12% |
| 2.43 | 81 | Bg | 86% | 1% | 13% |
| 2.51 | 84 | Bu | 57% | 31% | 11% |
| 3.04 | 101 | Bu | 13% | 6% | 81% |
| 3.06 | 102 | Au | 12% | 6% | 82% |
| 4.10 | 137 | Ag | 2% | 15% | 83% |
| 4.11 | 137 | Bg | 2% | 15% | 83% |
| 4.52 | 151 | Bg | 12% | 0% | 88% |
| 4.55 | 152 | Au | 0% | 0% | 100% |
| 5.26 | 175 | Bu | 0% | 14% | 86% |
| 5.26 | 176 | Au | 0% | 14% | 86% |
| 5.42 | 181 | Bg | 0% | 12% | 88% |
| 5.42 | 181 | Ag | 0% | 12% | 88% |
| 5.66 | 189 | Bu | 8% | 34% | 58% |
| 5.70 | 190 | Ag | 0% | 1% | 99% |

- Near 3.7 THz the calculation gives the Ag and Bg pair at 4.10 THz (Raman) and the Bu and Au pair at 3.04 THz (infrared). Both are dominated by S moving along the layer normal, tilting the P$_2$S$_6$ units.
- Near 5.5 THz it gives the Bg and Ag pair at 5.42 THz (Raman) and the infrared modes at 5.26 and 5.66 THz. The 5.66 THz Bu mode is the one with a large P$_2$ dimer component.
- Ag and Bg modes come in near-degenerate pairs: each pair is one doubly degenerate mode of a single layer, split only weakly by the monoclinic stacking.
- The Zn-dominated modes sit lower, at 1.9 to 2.5 THz.
- The one unstable mode is Zn moving off the center of its octahedron. Oliva et al. ([arXiv:2402.02102](https://arxiv.org/abs/2402.02102)) attribute the strong broadening of the low-frequency Raman lines of ZnPS$_3$ to a second-order Jahn-Teller tendency of this kind, though their DFT calculation finds the C2/m structure stable, so this small instability may come from the MACE-MP-0 potential.
