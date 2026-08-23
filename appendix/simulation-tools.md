# Appendix: Simulation and Analysis Software

Nearly every technique in this course has an open or freely available simulation counterpart, and using them is the fastest way to build intuition: simulate the measurement you are about to make, and you will recognize what you see, and notice what should not be there. Several homework assignments use these tools through Python notebooks in Google Colab, so no local installation is required. This page collects the standard software by module.

## Ion beam methods

- **SRIM/TRIM** ([srim.org](http://www.srim.org)): the community standard for stopping powers, ion ranges, and Monte Carlo collision cascades. Windows only, with a dated interface, but its stopping tables underpin the whole field. Earlier versions of this course used SRIM directly for homework; we now reproduce the relevant calculations in Python notebooks, using tabulated stopping data.
- **SIMNRA** ([simnra.com](https://www.simnra.com)) and **RUMP**: simulation and fitting of RBS, ERD, and NRA spectra for arbitrary layer stacks. SIMNRA is the de facto standard for quantitative ion beam analysis.

## X-ray methods

- **Parratt-formalism XRR calculators**: many implementations exist; the Python packages **refnx** and **GenX** fit X-ray and neutron reflectivity with modern optimizers, and writing a basic Parratt recursion from scratch is a one-page exercise (and one of our homework problems).
- **GSAS-II** and **profex/BGMN**: full-pattern XRD refinement, open source.
- **VESTA**: crystal structure visualization and powder pattern calculation, indispensable generally.

## Electron spectroscopy

- **NIST databases**: the NIST XPS database (binding energies), the NIST Electron IMFP and Electron Effective Attenuation Length databases (the quantitative backbone of escape-depth calculations), and SESSA, which simulates full XPS spectra of multilayer samples including geometry effects.
- **CasaXPS** (commercial but ubiquitous) and the open Python ecosystem (**lmfit**-based fitting) for peak fitting; constrained fitting matters more than the choice of tool.

## Electron microscopy

- **CASINO**: fast Monte Carlo of electron trajectories in bulk samples; the standard way to visualize SEM interaction volumes and estimate EDS sampling depths.
- **abTEM** and **prismatic**: multislice simulation of TEM and STEM images and diffraction from atomic models; abTEM is pure Python and pairs naturally with **ASE** for structure building.
- **py4DSTEM** and **hyperspy/exspy**: analysis of 4D-STEM datasets and of EELS/EDS spectrum images respectively; both open source, Python, and used in our homework.

## Scanning probes

- **Gwyddion**: the standard open-source SPM data processor: flattening, PSD, grain analysis, and every roughness statistic defined on the [AFM page](../modules/spm/afm.md).

% TODO: as the Colab notebooks are written, link each one from this page and from
% its module page. Planned notebooks: stopping/range explorer (M3), RBS spectrum
% simulator/fitter (M3), Parratt XRR fitter (M2), XPS quantification (M4),
% CASINO-style interaction volume (M5), EELS quantification (M6), AFM PSD (M7).
