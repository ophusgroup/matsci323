# Quantification, AES, and Depth Profiling

This page completes the electron spectroscopy module with the working skills: converting XPS peak areas into compositions and layer thicknesses, Auger electron spectroscopy as the focused-probe counterpart to XPS, and the sputter depth profiling that turns both into layer-by-layer analysis.

## Quantifying XPS

The intensity of a photoelectron line from a homogeneous sample is proportional to the atomic concentration times a chain of factors: the photoionization cross section, the IMFP, the analyzer transmission, and the angular asymmetry of emission. In practice the chain is collapsed into empirical **relative sensitivity factors** $S_i$, and compositions follow from

$$
x_i = \frac{I_i / S_i}{\sum_j I_j / S_j},
$$

after subtracting the inelastic background under each peak (Shirley or Tougaard). Done carefully, XPS composition is accurate to 5 to 10% relative, with two standing caveats: the answer is an exponentially weighted average over the sampling depth, so any vertical inhomogeneity (a contamination layer, an oxide skin, segregation) biases it, and adventitious carbon sits on every sample that has seen air.

The same escape-depth physics measures overlayer thickness. For a uniform overlayer of thickness $t$ on a substrate, the substrate signal is attenuated by $\exp(-t/\lambda\cos\theta)$, so the ratio of overlayer to substrate intensities gives $t$ directly for films up to about $3\lambda$. This simple ratio method, and its angle-resolved extension, is the workhorse measurement of gate oxides, ALD nucleation layers, and surface cleans, nondestructive and accurate to a few percent for films under about 10 nm.

## Auger electron spectroscopy

When a core hole is filled, the energy can eject a second electron instead of an X-ray: the Auger process, a three-level transition (labeled KLL, LMM, and so on) whose final kinetic energy is a property of the atom alone, independent of the excitation. Auger electrons appear in XPS spectra automatically; **Auger electron spectroscopy (AES)** as a standalone technique excites them with an electron beam instead of X-rays, and that one change defines its niche. An electron beam focuses to nanometers, so AES delivers surface chemical analysis with lateral resolution some three orders of magnitude better than laboratory XPS: about 10 nm in a modern field-emission scanning Auger microprobe.

The [fluorescence yield branching](electron-solid.md) makes AES most sensitive exactly where EDS is weakest, for light elements, and its detected electrons obey the same escape-depth physics as XPS, sampling a few nanometers. Historically spectra were recorded in derivative mode to lift the small Auger features off the large secondary electron background, and derivative peak-to-peak heights with sensitivity factors give semiquantitative composition, somewhat less accurate than XPS. Chemical state information exists in Auger lineshapes but is harder to use than XPS chemical shifts.

The costs of the focused electron probe: charging restricts AES to reasonably conductive samples, beam damage is a real concern at the current densities involved, and quantification is less settled than for XPS. The applications that exploit its strengths are particle and defect identification on wafers, grain boundary chemistry on fracture surfaces, and small-feature failure analysis: problems where the question is "what is this 100 nm thing," which no photon-probe technique can localize.

## Sputter depth profiling

Both XPS and AES sample only a few nanometers; to profile deeper, both are combined with the [sputtering](../ions/sims.md) of an argon ion gun, alternating erosion and measurement to build composition versus depth through films hundreds of nanometers thick. Everything learned about sputtering applies as limitations here: preferential sputtering falsifies the instantaneous surface composition of compounds (famously reducing many oxides), ion mixing broadens every interface by a few nanometers, and roughening accumulates with depth. Depth resolution of a few nanometers is standard, improved by sample rotation and low ion energies, and modern gas cluster ion sources profile polymers and organic films with minimal chemical damage. Interpreting any sputter profile means holding the measured profile and the artifact list in mind at the same time; a measured interface width is an upper bound, not a measurement, unless the sputtering conditions have been qualified.

Choosing among the depth profiling methods now available: XPS profiling for chemistry versus depth, SIMS for trace sensitivity, angle-resolved XPS or MEIS for nondestructive ultra-shallow profiles, and [STEM cross-sections](../stem/analytical-stem.md) when direct imaging of the actual interface is worth the sample preparation.

% TODO: figures: (a) Auger process level diagram side by side with X-ray emission,
% annotated with fluorescence yield vs Z; (b) an XPS sputter depth profile of a
% multilayer with the interface-broadening artifacts labeled; (c) overlayer
% attenuation schematic for the thickness measurement.

% TODO: homework tie-in: give students a real survey spectrum plus sensitivity
% factor table and have them extract composition; second part uses the attenuation
% equation for oxide thickness.

## References and further reading

1. D. Briggs and M. P. Seah (eds.), *Practical Surface Analysis, Vol. 1*, 2nd ed., Wiley (1990).
2. J. F. Watts and J. Wolstenholme, *An Introduction to Surface Analysis by XPS and AES*, 2nd ed., Wiley (2020), Chapters 3 to 5.
3. S. Hofmann, *Auger- and X-Ray Photoelectron Spectroscopy in Materials Science*, Springer (2013).
