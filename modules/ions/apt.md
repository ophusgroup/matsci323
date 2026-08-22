# Atom Probe Tomography

Atom probe tomography (APT) is the logical endpoint of the mass spectrometry idea: remove the atoms of a sample one at a time, identify each one by time-of-flight mass spectrometry, and record where each came from. The result is a three-dimensional reconstruction containing tens to hundreds of millions of atoms, each with elemental (and isotopic) identity and a position good to a fraction of a nanometer. No other technique measures the three-dimensional chemistry of a buried interface, a grain boundary, or a dopant cluster with anything approaching this combination of spatial resolution and ppm-level sensitivity, and APT has moved in two decades from a specialist's curiosity to a mainstream tool of thin film and interface science.

| At a glance | |
| --- | --- |
| Probe in / signal out | High field plus voltage or laser pulses in; field-evaporated ions out to a position-sensitive ToF detector |
| Information | 3D composition maps with near-atomic resolution; all elements including H and Li, with isotopes |
| Analyzed volume | Roughly 100 nm diameter by up to a micrometer deep |
| Spatial resolution | About 0.1 to 0.3 nm in depth, somewhat coarser laterally |
| Sensitivity | Tens of ppm, uniform across the periodic table |
| Sample requirements | A needle-shaped specimen of about 100 nm tip radius, prepared by FIB; fully destructive |

## Field evaporation

Apply about 10 kV to a needle with a 100 nm tip radius and the field at the apex reaches several tens of volts per nanometer, enough to ionize surface atoms and pull them off the tip: field evaporation. The atom probe holds the specimen just below the evaporation threshold and triggers removal with either a voltage pulse (for conductive samples) or a focused laser pulse (whose brief thermal excitation lets semiconductors and insulators evaporate; essentially all thin film work uses laser pulsing). Each pulse removes at most a few atoms, which accelerate radially away from the tip toward a position-sensitive detector tens of centimeters away.

Two measurements are made per ion. The flight time from pulse to detector gives the mass-to-charge ratio, identifying the element and charge state; peaks are sharp enough to separate isotopes, though some overlaps (for example between molecular ions and elemental peaks) require care. The impact position, together with the order of arrival, encodes where on the tip the atom sat: the tip acts as a point projection microscope with magnification in the millions.

## Reconstruction and its artifacts

Turning the detector record back into a 3D atom map is a modeling step, not a direct measurement, and its assumptions are where APT's artifacts live. The standard reconstruction assumes a hemispherical tip evaporating layer by layer with uniform magnification. Real multilayer specimens violate this: phases with different evaporation fields develop local curvature differences, producing **local magnification** distortions in which low-field phases appear artificially dense or interfaces appear curled. Trajectory aberrations blur lateral positions near interfaces, detector dead time undercounts multiple simultaneous evaporation events (an issue for accurate stoichiometry of some compounds), and the overall detection efficiency, set by the detector, is 50 to 80%, so APT counts a known fraction of all atoms rather than every atom. None of this diminishes the technique; it defines the error bars, and quantitative APT means understanding them.

## What APT does for thin films

The measurements APT owns outright are three-dimensional and chemical at once: the segregation of dopants to a single grain boundary measured in atoms per unit area, the earliest stages of clustering and precipitation in an alloy, the true interfacial width and intermixing of a deposited multilayer, and the distribution of hydrogen or lithium (light elements invisible to most electron and X-ray spectroscopies) in a battery electrode or embrittled alloy. In semiconductor work it is the only measurement of the 3D dopant distribution in a single finFET fin. Because analysis requires a FIB-milled needle from a specific site, APT pairs naturally with [FIB sample preparation](../sem/ebsd-fib.md), and correlative workflows that image the same needle in STEM before running it in the atom probe give both crystallography and chemistry from one specimen.

The counterweights: throughput is low (one needle per few hours, and needles fracture), the analyzed volume is minuscule so statistics demand multiple tips, and quantification near interfaces carries the reconstruction caveats above. APT complements rather than replaces SIMS: SIMS profiles a millimeter-scale area with ppb sensitivity in one dimension, APT maps a hundred-nanometer volume with ppm sensitivity in three.

% TODO: figures: (a) schematic of tip, pulsing, and detector; (b) an example mass
% spectrum; (c) a published reconstruction of a multilayer or grain boundary
% (request permission, or generate from an open dataset). This page especially
% needs a figure of the FIB needle-preparation sequence, shared with the FIB page.

## References and further reading

1. B. Gault et al., Atom probe tomography, *Nature Reviews Methods Primers* **1**, 51 (2021). [doi.org/10.1038/s43586-021-00047-w](https://doi.org/10.1038/s43586-021-00047-w)
2. B. Gault, M. P. Moody, J. M. Cairney, and S. P. Ringer, *Atom Probe Microscopy*, Springer (2012).
3. T. F. Kelly and M. K. Miller, Atom probe tomography, *Review of Scientific Instruments* **78**, 031101 (2007). [doi.org/10.1063/1.2709758](https://doi.org/10.1063/1.2709758)
