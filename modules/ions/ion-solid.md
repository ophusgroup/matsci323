# Ion-Solid Interactions

The next four pages cover techniques that fire ions at a sample: Rutherford backscattering, elastic recoil detection, low-energy ion scattering, secondary ion mass spectrometry, and atom probe tomography. All of them rest on the same physics, developed here: the kinematics of binary collisions, the cross section for scattering, and the stopping of ions as they travel through matter. This physics is worth learning carefully, both because it makes every ion beam technique quantitative from first principles, a property almost unique among the methods in this course, and because the same collisions govern ion implantation, sputter deposition, and radiation damage.

## Kinematics of elastic collisions

Consider a projectile of mass $M_1$ and energy $E_0$ striking a stationary target atom of mass $M_2$. Conservation of energy and momentum alone, with no knowledge of the interaction force, fixes the energy of the projectile scattered to angle $\theta$:

$$
E_1 = K E_0, \qquad
K = \left[ \frac{M_1 \cos\theta + \sqrt{M_2^2 - M_1^2 \sin^2\theta}}{M_1 + M_2} \right]^2 .
$$

The **kinematic factor** $K$ depends only on the mass ratio and the scattering angle. This is the central result of the module: measure the energy of a backscattered ion of known mass and energy, and you have measured the mass of the atom it hit. Heavy targets barely slow the projectile ($K \to 1$), light targets absorb more recoil energy, and for $M_2 < M_1$ backscattering is kinematically forbidden entirely, which is why helium beams cannot backscatter from hydrogen and why detecting hydrogen requires the recoil geometry of [ERD](rbs.md).

The struck atom recoils with energy $E_2 = E_0 - E_1$, up to a substantial fraction of the beam energy. These energetic recoils drive the collision cascades responsible for sputtering, treated in the [SIMS page](sims.md), and for implantation damage.

## The scattering cross section

How often collisions happen is set by the cross section. For a bare Coulomb repulsion between nuclei of charge $Z_1$ and $Z_2$, the differential cross section is Rutherford's result, which in the laboratory frame for $M_1 \ll M_2$ takes the familiar form

$$
\frac{d\sigma}{d\Omega} = \left( \frac{Z_1 Z_2 e^2}{4 E} \right)^2 \frac{1}{\sin^4(\theta/2)}.
$$

Three scalings matter for analysis. The cross section grows as $Z_2^2$, so heavy elements scatter far more strongly than light ones; it falls as $1/E^2$, so count rates drop quickly with beam energy; and it is known absolutely, with no adjustable parameters, which is what makes RBS a standards-free quantitative technique. At MeV energies and large angles the collision is close enough that the nuclei see each other's bare charge and the Rutherford formula holds to within small screening corrections. At keV energies, relevant to LEIS and to sputtering, the electron clouds screen the interaction and screened potentials such as the universal ZBL form must be used.

## Stopping power

Between the rare large-angle collisions, an ion moving through a solid loses energy continuously. Two mechanisms operate:

- **Electronic stopping**: drag from exciting and ionizing target electrons. Dominant at high velocity, it behaves like friction, smooth and nearly free of angular deflection.
- **Nuclear stopping**: energy transferred in many small-angle screened collisions with target nuclei. Dominant at low velocity (keV energies for heavy ions), it deflects trajectories and displaces target atoms, creating damage.

The total stopping power $dE/dx$ is tabulated to few-percent accuracy for essentially all ion-target combinations; the SRIM package, discussed in the [simulation appendix](../../appendix/simulation-tools.md), is the community standard. For a compound target the stopping adds by weighted atomic composition (Bragg's rule). A 2 MeV He ion in silicon loses roughly 25 eV per angstrom electronically, and this steady, predictable energy loss is what converts a measured energy into a depth in RBS: the stopping power is the ruler by which ion beam methods measure depth.

Stopping ends in a range. Ions implanted at energy $E_0$ come to rest in an approximately Gaussian depth distribution with projected range $R_p$ and straggle $\Delta R_p$, from a few nanometers at keV energies to micrometers at MeV energies. This is the basis of ion implantation doping, and also of the damage that every ion-based technique inflicts on the region it analyzes: the collision cascade near the surface produces vacancies, interstitials, and atomic mixing that fundamentally limit the depth resolution of sputter-based profiling.

% TODO: figures: (a) binary collision schematic defining theta, E0, E1, E2;
% (b) K vs M2 for He at a few scattering angles (compute ourselves); (c) electronic
% and nuclear stopping vs energy for He and Ar in Si (compute from SRIM tables);
% (d) implantation profile with Rp and straggle labeled.

% TODO: candidate interactive widget: kinematic factor calculator plus a stopping/
% range explorer. This replaces the SRIM homework exercises from earlier years.

## References and further reading

1. L. C. Feldman and J. W. Mayer, *Fundamentals of Surface and Thin Film Analysis*, North-Holland (1986), Chapters 2 and 3.
2. J. F. Ziegler, J. P. Biersack, and M. D. Ziegler, *SRIM: The Stopping and Range of Ions in Matter*, SRIM Co. (2008); [srim.org](http://www.srim.org).
3. M. Nastasi, J. W. Mayer, and J. K. Hirvonen, *Ion-Solid Interactions: Fundamentals and Applications*, Cambridge University Press (1996).
