---
sidebar_position: 4
title: "Key Papers and References"
---

# Key Papers and References

A curated reading list of foundational and practical papers relevant to DTI preprocessing and analysis. These references are organized by topic and provide the theoretical and methodological background for the steps in this tutorial.

---

## DTI Fundamentals

Core papers on diffusion tensor imaging theory, methods, and interpretation.

- **Basser, P. J., Mattiello, J., & LeBihan, D.** (1994). MR diffusion tensor spectroscopy and imaging. *Biophysical Journal*, 66(1), 259-267. DOI: [10.1016/S0006-3495(94)80775-1](https://doi.org/10.1016/S0006-3495(94)80775-1)
  - The foundational paper introducing the diffusion tensor model and the mathematical framework for estimating it from DWI data.

- **Le Bihan, D.** (2001). Diffusion tensor imaging: Concepts and applications. *Journal of Magnetic Resonance Imaging*, 13(4), 534-546. DOI: [10.1002/jmri.1076](https://doi.org/10.1002/jmri.1076)
  - A comprehensive review of DTI concepts, acquisition methods, and clinical applications.

- **Mori, S., & Zhang, J.** (2006). Principles of diffusion tensor imaging and its applications to basic neuroscience research. *Neuron*, 51(5), 527-539. DOI: [10.1016/j.neuron.2006.08.012](https://doi.org/10.1016/j.neuron.2006.08.012)
  - An accessible overview of DTI principles and their application in neuroscience, including discussion of scalar metrics and tractography.

- **Jones, D. K.** (2010). *Diffusion MRI: Theory, Methods, and Applications*. Oxford University Press. ISBN: 978-0195369779
  - A comprehensive textbook covering diffusion MRI from basic physics to advanced analysis methods. An essential reference for anyone working with diffusion data.

- **Alexander, A. L., Lee, J. E., Lazar, M., & Field, A. S.** (2007). Diffusion tensor imaging of the brain. *Neurotherapeutics*, 4(3), 316-329. DOI: [10.1016/j.nurt.2007.05.011](https://doi.org/10.1016/j.nurt.2007.05.011)
  - A review of DTI methodology and its clinical applications, including discussion of artifacts, limitations, and interpretation of DTI metrics.

---

## Preprocessing Methods

Papers describing the specific preprocessing tools and algorithms used in this tutorial.

- **Andersson, J. L. R., & Sotiropoulos, S. N.** (2016). An integrated approach to correction for off-resonance effects and subject movement in diffusion MR imaging. *NeuroImage*, 125, 1063-1078. DOI: [10.1016/j.neuroimage.2015.10.019](https://doi.org/10.1016/j.neuroimage.2015.10.019)
  - Describes FSL's `eddy` tool for simultaneous correction of eddy current distortions, susceptibility distortions, and subject movement. The primary methodological reference for the eddy correction step.

- **Andersson, J. L. R., Skare, S., & Ashburner, J.** (2003). How to correct susceptibility distortions in spin-echo echo-planar images: Application to diffusion tensor imaging. *NeuroImage*, 20(2), 870-888. DOI: [10.1016/S1053-8119(03)00336-7](https://doi.org/10.1016/S1053-8119(03)00336-7)
  - Introduces the TOPUP approach for correcting susceptibility-induced distortions using reversed phase-encode image pairs. The foundational reference for the TOPUP correction step.

- **Veraart, J., Novikov, D. S., Christiaens, D., Ades-Aron, B., Sijbers, J., & Fieremans, E.** (2016). Denoising of diffusion MRI using random matrix theory. *NeuroImage*, 142, 394-406. DOI: [10.1016/j.neuroimage.2016.08.016](https://doi.org/10.1016/j.neuroimage.2016.08.016)
  - Describes the Marchenko-Pastur PCA denoising method implemented in MRtrix3's `dwidenoise`. This approach exploits the redundancy in multi-directional DWI data to separate signal from noise.

- **Kellner, E., Dhital, B., Kiselev, V. G., & Reisert, M.** (2016). Gibbs-ringing artifact removal based on local subvoxel-shifts. *Magnetic Resonance in Medicine*, 76(5), 1574-1581. DOI: [10.1002/mrm.26054](https://doi.org/10.1002/mrm.26054)
  - Describes the method for removing Gibbs ringing artifacts, implemented in MRtrix3's `mrdegibbs`. Gibbs ringing can bias DTI metrics, particularly near tissue boundaries.

---

## Best Practices

Guidance on experimental design, quality control, and pitfalls in DTI.

- **Maximov, I. I., Alnaes, D., & Westlye, L. T.** (2019). Towards an optimised processing pipeline for diffusion magnetic resonance imaging data: Effects of artefact corrections on diffusion metrics and their age associations in UK Biobank. *Human Brain Mapping*, 40(14), 4146-4162. DOI: [10.1002/hbm.24691](https://doi.org/10.1002/hbm.24691)
  - A systematic evaluation of different preprocessing pipelines and their effects on DTI metrics, providing practical guidance on pipeline design.

- **Jones, D. K., & Cercignani, M.** (2010). Twenty-five pitfalls in the analysis of diffusion MRI data. *NMR in Biomedicine*, 23(7), 803-820. DOI: [10.1002/nbm.1543](https://doi.org/10.1002/nbm.1543)
  - An essential practical guide covering common mistakes and misconceptions in DTI analysis, from acquisition through statistical inference.

---

## Software

Primary references for the software packages used in this tutorial.

- **Jenkinson, M., Beckmann, C. F., Behrens, T. E. J., Woolrich, M. W., & Smith, S. M.** (2012). FSL. *NeuroImage*, 62(2), 782-790. DOI: [10.1016/j.neuroimage.2011.09.015](https://doi.org/10.1016/j.neuroimage.2011.09.015)
  - The primary reference for citing the FSL software library. FSL provides the core tools used in this tutorial: BET, TOPUP, EDDY, DTIFIT, FLIRT, and TBSS.

- **Tournier, J.-D., Smith, R., Raffelt, D., Tabbara, R., Dhollander, T., Pietsch, M., Christiaens, D., Jeurissen, B., Yeh, C.-H., & Connelly, A.** (2019). MRtrix3: A fast, flexible and open software framework for medical image processing and visualisation. *NeuroImage*, 202, 116137. DOI: [10.1016/j.neuroimage.2019.116137](https://doi.org/10.1016/j.neuroimage.2019.116137)
  - The primary reference for MRtrix3, which provides tools for denoising (dwidenoise), Gibbs ringing removal (mrdegibbs), and advanced fiber tracking.

- **Avants, B. B., Tustison, N. J., Song, G., Cook, P. A., Klein, A., & Gee, J. C.** (2011). A reproducible evaluation of ANTs similarity metric performance in brain image registration. *NeuroImage*, 54(3), 2033-2044. DOI: [10.1016/j.neuroimage.2010.09.025](https://doi.org/10.1016/j.neuroimage.2010.09.025)
  - The primary reference for Advanced Normalization Tools (ANTs), which provides high-quality nonlinear registration and brain extraction capabilities.

- **Cieslak, M., Cook, P. A., He, X., Yeh, F.-C., Dhollander, T., Adebimpe, A., Aguirre, G. K., Bassett, D. S., Betzel, R. F., Bourque, J., Cabral, L. M., Davatzikos, C., Detre, J. A., Earl, E., Elliott, M. A., Fadnavis, S., Fair, D. A., Foran, W., Fotiadis, P., ... Satterthwaite, T. D.** (2021). QSIPrep: An integrative platform for preprocessing and reconstructing diffusion MRI data. *Nature Methods*, 18(7), 775-778. DOI: [10.1038/s41592-021-01185-5](https://doi.org/10.1038/s41592-021-01185-5)
  - The primary reference for QSIPrep, an automated preprocessing pipeline for diffusion MRI that integrates multiple tools and follows BIDS conventions.

---

## Tractography

Papers on white matter tract reconstruction and quantification.

- **Yeatman, J. D., Dougherty, R. F., Myall, N. J., Wandell, B. A., & Feldman, H. M.** (2012). Tract profiles of white matter properties: Automating fiber-tract quantification. *PLoS ONE*, 7(11), e49790. DOI: [10.1371/journal.pone.0049790](https://doi.org/10.1371/journal.pone.0049790)
  - Introduces the Automated Fiber Quantification (AFQ) framework for extracting tract-specific profiles of diffusion metrics along white matter pathways.

- **Kruper, J., Yeatman, J. D., Richie-Halford, A., Bloom, D., Grotheer, M., Caffarra, S., Kiar, G., Karipidis, I. I., Roy, E., Chandio, B. Q., Garyfallidis, E., & Rokem, A.** (2021). Evaluating the reliability of human brain white matter tractometry. *Aperture Neuro*, 1(1). DOI: [10.52294/e6198571-60f8-4571-bf21-a33e3c83d0fc](https://doi.org/10.52294/e6198571-60f8-4571-bf21-a33e3c83d0fc)
  - Evaluates the test-retest reliability of pyAFQ tractometry, providing evidence for the reproducibility of automated tract quantification.

---

## Data Standards

References for data organization and sharing standards.

- **Gorgolewski, K. J., Auer, T., Calhoun, V. D., Craddock, R. C., Das, S., Duff, E. P., Flandin, G., Ghosh, S. S., Glatard, T., Halchenko, Y. O., Handwerker, D. A., Hanke, M., Keator, D., Li, X., Michael, Z., Maumet, C., Nichols, B. N., Nichols, T. E., Pellman, J., ... Poldrack, R. A.** (2016). The brain imaging data structure, a format for organizing and describing outputs of neuroimaging experiments. *Scientific Data*, 3, 160044. DOI: [10.1038/sdata.2016.44](https://doi.org/10.1038/sdata.2016.44)
  - The original paper describing the Brain Imaging Data Structure (BIDS) standard for organizing neuroimaging data in a consistent, self-describing format.

- **BIDS Specification.** [https://bids-specification.readthedocs.io/](https://bids-specification.readthedocs.io/)
  - The official and continuously updated BIDS specification, including the extension for diffusion MRI data (derivatives, DWI-specific metadata fields, and file naming conventions).
