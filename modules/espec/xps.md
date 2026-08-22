# XPS

X-ray photoelectron spectroscopy (XPS) is the standard measurement of surface chemistry. It identifies every element except hydrogen and helium in the top few nanometers of a sample, quantifies them to within a few percent, and, through small shifts in binding energy, reports how each element is chemically bonded. Nearly every materials laboratory has access to an XPS instrument, and for questions of the form "what is on this surface and what state is it in," XPS is almost always the first and best answer.

| At a glance | |
| --- | --- |
| Probe in / signal out | Soft X-rays in, photoelectrons out |
| Information | Elemental composition (Z of 3 and above), chemical/oxidation state, overlayer thickness |
| Depth probed | 3 to 10 nm; tunable shallower by angle-resolved measurement |
| Lateral resolution | 10 um to millimeters; imaging modes to about 3 um |
| Sensitivity | 0.1 to 1 atomic percent |
| Sample requirements | UHV compatible; insulators fine with charge compensation; nearly nondestructive |

## The photoelectric effect as spectroscopy

A monochromatic X-ray of energy $h\nu$ ejects a core electron whose kinetic energy is measured by an electrostatic analyzer. Energy conservation gives the binding energy of the level it came from:

$$
E_B = h\nu - E_K - \phi,
$$

with $\phi$ the spectrometer work function. Standard sources are Al K$\alpha$ (1486.6 eV, almost always monochromated) and Mg K$\alpha$ (1253.6 eV). Since every element has a unique ladder of core level binding energies, a survey spectrum identifies all elements present from lithium up. The surface sensitivity comes entirely from the [escape depth physics](electron-solid.md) of the outgoing photoelectron: the X-rays penetrate micrometers, but only photoelectrons born in the top few nanometers escape without energy loss.

Core levels with orbital angular momentum split into spin-orbit doublets (2p$_{1/2}$/2p$_{3/2}$, 3d$_{3/2}$/3d$_{5/2}$) with fixed intensity ratios and characteristic splittings, a built-in consistency check when identifying peaks and fitting overlapping chemistry.

## Chemical shifts

The measurement that makes XPS indispensable is the **chemical shift**: the binding energy of a core level moves by up to several eV with the atom's bonding environment. Oxidizing an atom withdraws valence charge, the remaining electrons feel the nucleus more strongly, and the core levels shift to higher binding energy. Si metal and SiO$_2$ are separated by about 4 eV in the Si 2p line, and a native-oxide-covered wafer shows both peaks at once, with intermediate oxidation states between. Carbon 1s resolves C-C, C-O, C=O, and O-C=O within about 5 eV, the basis of polymer and contamination analysis.

Reading shifts in real spectra requires care with reference and final-state effects: charging of insulating samples moves the entire spectrum (compensated with an electron flood gun and referenced to a known line), and satellite features (shake-up peaks, notably in Cu and other transition metal oxides, and plasmon replicas) are final-state effects that carry diagnostic value of their own; the presence or absence of the Cu 2p shake-up satellite is itself a fingerprint distinguishing Cu(II) from Cu(I) and Cu(0). Peak fitting of overlapping chemical states is standard practice and a well-known source of unreliable literature: fits must be constrained by physics (doublet ratios, sensible widths, consistent references), not merely by residuals.

% TODO: figures: (a) survey spectrum with labels; (b) Si 2p of a native oxide on
% Si showing metal/oxide doublet structure; (c) C 1s of a functionalized polymer.
% All three are classic figures we should draw from real data; the Stanford SNSF
% instruments can produce (a) and (b) in one afternoon.

## Instrumentation

A modern XPS instrument combines a monochromated Al source, a hemispherical analyzer run at fixed pass energy so resolution is constant across the spectrum, multichannel detection, a flood gun, and a UHV chamber with sample transfer. Variants extend the technique along every axis: angle-resolved XPS produces nondestructive depth profiles of the top few nanometers; imaging XPS maps chemistry at a few micrometers resolution; synchrotron beamlines make the photon energy tunable, which turns the escape depth itself into an experimental knob; hard X-ray photoemission (HAXPES) at 5 to 10 keV reaches tens of nanometers deep to see buried interfaces; and ambient-pressure XPS uses differential pumping to observe surfaces during catalysis or electrochemistry at millibar pressures. UPS, using ultraviolet photons of 21.2 eV, measures the valence band and work function with the same analyzer.

The quantification of XPS spectra, composition, overlayer thickness, and sputter depth profiling, is developed on the [next page](quantification.md), together with Auger spectroscopy.

## References and further reading

1. J. F. Watts and J. Wolstenholme, *An Introduction to Surface Analysis by XPS and AES*, 2nd ed., Wiley (2020).
2. J. F. Moulder et al., *Handbook of X-ray Photoelectron Spectroscopy*, Perkin-Elmer (1992).
3. S. Hüfner, *Photoelectron Spectroscopy*, 3rd ed., Springer (2003).
4. G. Greczynski and L. Hultman, X-ray photoelectron spectroscopy: towards reliable binding energy referencing, *Progress in Materials Science* **107**, 100591 (2020). [doi.org/10.1016/j.pmatsci.2019.100591](https://doi.org/10.1016/j.pmatsci.2019.100591)
