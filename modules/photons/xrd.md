# XRD of Thin Films

X-ray diffraction is the first measurement made on nearly every crystalline thin film. It requires no vacuum, no sample preparation, and no contact, it averages over a statistically meaningful area, and a single afternoon of measurements can determine the phases present, the film texture, the strain state, and the crystalline quality. This page assumes the diffraction background of an introductory XRD course and focuses on what changes when the sample is a film tens of nanometers thick on a substrate, rather than a powder or a bulk crystal.

| At a glance | |
| --- | --- |
| Probe in / signal out | X-rays in, diffracted X-rays out |
| Information | Phase identification, orientation and texture, strain and stress, grain size, crystalline quality |
| Depth probed | Full film thickness; tunable from nanometers up using grazing incidence |
| Lateral resolution | Millimeters (lab); micrometers at synchrotrons |
| Sensitivity | Crystalline phases down to a few volume percent; film thicknesses down to a few nanometers with care |
| Sample requirements | Essentially none; measured in air, nondestructive |

## The thin film problem

A symmetric $\theta$-$2\theta$ scan of a film on a substrate has two difficulties. The substrate, being vastly thicker, dominates the pattern with intense peaks that can bury the film signal, and for a strongly textured or epitaxial film only the lattice planes parallel to the surface diffract at all, so most of the pattern is simply absent. Both problems become tools once understood. The substrate peaks provide an internal calibration for the film peak positions, and the presence or absence of film reflections is itself a measurement of orientation.

For polycrystalline films the standard fix is **grazing incidence XRD (GIXRD)**: the incident beam is fixed at a small angle $\omega$ of a few degrees while the detector alone scans $2\theta$. The path length in the film scales as $1/\sin\omega$, so a grazing beam stays in the film, suppressing the substrate and boosting the film signal by an order of magnitude or more. The cost is that each reflection samples differently tilted grains, so GIXRD assumes random texture for quantitative work.

## Epitaxial films: rocking curves and reciprocal space maps

For epitaxial films, high-resolution XRD is the standard tool of the semiconductor industry. A **rocking curve** holds the detector fixed on a Bragg peak and rocks the sample through $\omega$; its width measures the spread of lattice plane orientations, and hence the density of dislocations and mosaic structure. Widths range from a few arcseconds for perfect homoepitaxy to degrees for heavily defected layers.

A **reciprocal space map (RSM)** scans both $\omega$ and $2\theta$ around an asymmetric reflection, resolving the in-plane and out-of-plane lattice parameters separately. This is the definitive measurement of coherent strain: a pseudomorphic film appears at the same in-plane reciprocal coordinate as the substrate, while a relaxed film moves toward its bulk lattice constant. Thickness fringes (Laue oscillations) around the film peak indicate a coherent, flat film and give its thickness directly, and dynamical diffraction simulations of the full profile can fit composition and strain in multilayer stacks.

Grain size and microstrain broadening carry over from powder diffraction: the Scherrer relation $t \approx K\lambda / (\beta \cos\theta)$ estimates the coherently diffracting domain size from the peak width $\beta$, with the usual caveats that strain broadening, instrument resolution, and the domain-shape factor $K$ all fold into the observed width, and that Scherrer sizes below the film thickness usually signal columnar or defected growth rather than literal grains.

## Texture and stress

Most sputtered and evaporated films are textured: their grains share a preferred out-of-plane orientation while remaining random in-plane (a fiber texture). A **pole figure** maps the intensity of one reflection over all sample tilts and rotations, revealing fiber textures as rings and epitaxial relationships as discrete spots. Texture controls properties from electromigration resistance in interconnects to the coercivity of magnetic films, and film texture measurement connects directly to the grain-by-grain orientation maps of [EBSD](../sem/ebsd-fib.md).

Residual stress is measured by using the lattice itself as a strain gauge. In the **$\sin^2\psi$ method**, the spacing of one set of planes is measured at several sample tilts $\psi$; for a biaxially stressed film the spacing varies linearly in $\sin^2\psi$ with a slope proportional to the stress. Thin film stresses routinely reach hundreds of MPa to several GPa, enough to curl substrates, crack coatings, and shift device characteristics, so this measurement is a routine part of process development.

% TODO: figures needed: (a) geometry comparison of theta-2theta vs GIXRD;
% (b) an experimental rocking curve pair (good vs defected film); (c) an RSM
% around an asymmetric reflection showing pseudomorphic vs relaxed; (d) a pole
% figure with fiber texture. We should generate (a) ourselves and source
% (b)-(d) from our own data or ask colleagues; Mark's slides have none of these.

% TODO: candidate interactive widget: a Bragg / Ewald sphere construction where
% the student tilts the film and sees which reflections light up.

## References and further reading

1. M. Birkholz, *Thin Film Analysis by X-Ray Scattering*, Wiley-VCH (2006), Chapters 1 to 6.
2. B. D. Cullity and S. R. Stock, *Elements of X-Ray Diffraction*, 3rd ed., Prentice Hall (2001).
3. P. F. Fewster, *X-Ray Scattering from Semiconductors*, 2nd ed., Imperial College Press (2003). High-resolution methods and RSMs.
4. D. K. Schroder, *Semiconductor Material and Device Characterization*, 3rd ed., Wiley (2006), Chapter 10.
