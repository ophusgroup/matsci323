# XRR and Grazing-Incidence Scattering

X-ray reflectivity (XRR) measures the specular reflection of X-rays from a film at angles of a fraction of a degree to a few degrees. It is one of the most precise thickness measurements available anywhere, routinely better than 1%, and it works on amorphous and crystalline films alike because it depends only on electron density, not on crystallinity. Together with its diffuse-scattering cousins GISAXS and GIWAXS, it forms the grazing-incidence family of measurements that probe film thickness, density, roughness, and nanoscale morphology.

| At a glance | |
| --- | --- |
| Probe in / signal out | X-rays in at grazing incidence, reflected or scattered X-rays out |
| Information | Layer thickness, density, interface roughness (XRR); lateral nanostructure (GISAXS); crystalline packing in thin and organic films (GIWAXS) |
| Depth probed | Total stack up to a few hundred nanometers |
| Lateral resolution | Averages over the beam footprint, millimeters |
| Sensitivity | Thickness to about 1%; density to a few percent; roughness to fractions of a nanometer |
| Sample requirements | Smooth, flat samples; measured in air, nondestructive |

## Total external reflection and the critical angle

For X-rays, the refractive index of matter is slightly less than one, $n = 1 - \delta + i\beta$ with $\delta \sim 10^{-5}$. Below a critical angle $\theta_c \approx \sqrt{2\delta}$, typically 0.2 to 0.6 degrees, X-rays undergo total external reflection. Because $\delta$ is proportional to electron density, the critical angle alone measures the film density, one of the few direct density probes for thin films and a sensitive monitor of porosity in deposited layers.

## Kiessig fringes and thickness

Above $\theta_c$, reflections from the top surface and from the film-substrate interface interfere, producing thickness oscillations (Kiessig fringes) with period

$$
\Delta\theta \approx \frac{\lambda}{2t},
$$

so a 50 nm film measured with Cu K$\alpha$ radiation shows fringes about 0.09 degrees apart. Reading the fringe period gives the thickness immediately; fitting the full curve does far more. The reflectivity of an arbitrary multilayer is computed exactly by the Parratt recursion, and interface roughness enters as a damping factor on each interface. Roughness of the top surface accelerates the overall intensity decay (ideal surfaces fall off as $\theta^{-4}$; rough ones faster), while roughness of a buried interface damps the fringe amplitude. Fitting an XRR curve therefore yields thickness, density, and roughness for each layer in a stack, including buried layers no microscope can see without cross-sectioning. In practice fitting is the art: parameters correlate, and a good fit begins from a physically sensible model of the stack.

% TODO: figure: measured XRR curves for the same nominal film with different
% thickness and roughness, annotated with critical angle and fringe period.
% We can compute these ourselves (Parratt) which also feeds the homework.

The calculator below computes the exact Parratt reflectivity of a film on silicon as you adjust the stack. Work through the fitting logic one parameter at a time: thickness sets the fringe period, density sets the critical angle and the fringe contrast against the substrate, surface roughness accelerates the overall decay, and interface roughness damps the fringes without changing their period. These four signatures are exactly what an XRR fitting program is disentangling, and seeing them separately is most of the skill of reading a reflectivity curve.

:::{anywidget} ../../widgets/xrr-explorer.js
:::

## GISAXS and GIWAXS

Replacing the point detector with an area detector at grazing incidence turns reflectivity into scattering. **GISAXS** (grazing-incidence small-angle X-ray scattering) records the diffuse scattering at small angles, which encodes lateral structure: island sizes and spacings during growth, pore networks in low-k dielectrics, and the domain spacing of self-assembled block copolymer films. **GIWAXS** (wide-angle) records the diffraction rings of the film with the same surface sensitivity, and has become the standard structural probe of organic photovoltaics, halide perovskites, and other solution-processed films, where the texture and polymorph of a spin-cast layer decide device performance. Both are most powerful at synchrotron sources, where high flux permits real-time measurements during film growth and annealing.

**Neutron reflectometry** follows the same formalism with neutrons, whose scattering contrast depends on isotopes rather than electron density. Deuterium labeling makes it the technique of choice for polymer interdiffusion and buried organic interfaces, and its magnetic contrast resolves the depth profile of magnetization in multilayers.

## References and further reading

1. M. Birkholz, *Thin Film Analysis by X-Ray Scattering*, Wiley-VCH (2006), Chapter 4.
2. L. G. Parratt, Surface studies of solids by total reflection of X-rays, *Physical Review* **95**, 359 (1954). [doi.org/10.1103/PhysRev.95.359](https://doi.org/10.1103/PhysRev.95.359)
3. J. Als-Nielsen and D. McMorrow, *Elements of Modern X-ray Physics*, 2nd ed., Wiley (2011), Chapter 3.
4. G. Renaud, R. Lazzari, and F. Leroy, Probing surface and interface morphology with grazing incidence small angle X-ray scattering, *Surface Science Reports* **64**, 255 (2009). [doi.org/10.1016/j.surfrep.2009.07.002](https://doi.org/10.1016/j.surfrep.2009.07.002)
