---
sidebar_position: 3
title: "Glossary"
---

# Glossary

A comprehensive glossary of terms used throughout this DTI preprocessing tutorial and in the broader diffusion MRI literature.

---

**AD (Axial Diffusivity)** — The rate of water diffusion along the principal axis of the diffusion tensor, equal to the first (largest) eigenvalue (L1). AD is sometimes interpreted as a marker of axonal integrity, though this interpretation should be made cautiously. Units: mm^2/s.

**Affine registration** — A type of spatial registration that allows 12 degrees of freedom: three translations, three rotations, three scalings, and three shears. Affine registration maps one image into the space of another while preserving parallel lines and ratios of distances. FSL's FLIRT performs affine registration.

**Anisotropy** — The property of being directionally dependent. In diffusion imaging, anisotropy refers to water diffusion that is not equal in all directions, typically because tissue microstructure (such as axon bundles) restricts diffusion along certain axes. See also: Fractional Anisotropy.

**Anterior-to-Posterior (AP)** — A phase encoding direction in MRI acquisition where the readout proceeds from the front to the back of the head. In FSL convention, this corresponds to the vector `0 -1 0` in the acquisition parameters file.

**B-value** — A scalar parameter (units: s/mm^2) that controls the strength of diffusion weighting in a DWI acquisition. A b-value of 0 means no diffusion weighting. Higher b-values increase sensitivity to diffusion but decrease signal-to-noise ratio. Common values in DTI are b=1000 s/mm^2; multi-shell acquisitions may include b=1000, 2000, and 3000.

**B-vector** — A unit vector specifying the direction of the diffusion-sensitizing gradient for a given DWI volume. The full set of b-vectors (stored in a `.bvec` file) describes the sampling scheme on the sphere. B-vectors must be rotated when the image volumes are rotated during motion correction.

**BedpostX (Bayesian Estimation of Diffusion Parameters Obtained using Sampling Techniques)** — An FSL tool that uses MCMC sampling to estimate the posterior distribution of diffusion parameters at each voxel, including the number and orientation of crossing fibers. BedpostX is used for probabilistic tractography with FSL's probtrackx.

**BET (Brain Extraction Tool)** — An FSL tool that removes non-brain tissue (skull, scalp, eyes) from structural or functional MRI images, producing a brain mask and/or skull-stripped image. BET uses a deformable surface model that evolves to fit the brain boundary.

**BIDS (Brain Imaging Data Structure)** — A community standard for organizing and describing neuroimaging datasets. BIDS specifies a consistent directory structure and file naming convention that makes datasets self-describing and compatible with a growing ecosystem of analysis tools.

**CSD (Constrained Spherical Deconvolution)** — A method for estimating the fiber orientation distribution function (fODF) at each voxel by deconvolving the DWI signal with a single-fiber response function. CSD can resolve crossing fibers within a voxel, unlike the single-tensor DTI model. Implemented in MRtrix3.

**CSF (Cerebrospinal Fluid)** — The clear fluid that surrounds the brain and spinal cord, filling the ventricles and subarachnoid space. In diffusion imaging, CSF shows high mean diffusivity and low fractional anisotropy because water diffuses freely in all directions.

**DICOM (Digital Imaging and Communications in Medicine)** — The standard file format used by MRI scanners and medical imaging equipment. DICOM files contain both image data and extensive metadata about the acquisition. DICOM data is typically converted to NIfTI format for analysis using tools such as dcm2niix.

**Diffusion tensor** — A 3x3 symmetric positive-definite matrix that models the three-dimensional diffusion displacement distribution at each voxel, assuming Gaussian diffusion. The tensor has six unique elements and is decomposed into eigenvalues and eigenvectors to derive scalar DTI metrics.

**DKI (Diffusion Kurtosis Imaging)** — An extension of DTI that estimates the kurtosis (non-Gaussianity) of the diffusion displacement distribution. DKI requires multi-shell data (at least two non-zero b-values) and provides additional microstructural information beyond what the standard tensor model captures.

**DTI (Diffusion Tensor Imaging)** — A diffusion MRI technique that models water diffusion at each voxel using a single diffusion tensor. DTI produces scalar maps (FA, MD, AD, RD) that characterize tissue microstructure. DTI requires at least 6 non-collinear gradient directions and one b=0 image.

**DTIFIT** — An FSL command that fits the diffusion tensor model to DWI data using weighted least squares, producing maps of FA, MD, eigenvalues, eigenvectors, and other tensor-derived metrics.

**DWI (Diffusion-Weighted Imaging)** — An MRI technique that sensitizes the signal to the random thermal motion (Brownian motion) of water molecules by applying magnetic field gradients. DWI is the raw data from which DTI and other diffusion models are estimated.

**Eddy currents** — Electrical currents induced in the conducting structures of the MRI scanner by the rapid switching of diffusion-sensitizing gradients. Eddy currents create time-varying magnetic fields that distort the DWI images, causing shearing, scaling, and translation artifacts. Corrected by FSL's `eddy` tool.

**Eigenvalue / Eigenvector** — In the context of the diffusion tensor, the three eigenvalues (L1, L2, L3) represent the magnitude of diffusion along the three principal axes, and the three eigenvectors (V1, V2, V3) represent the orientation of those axes. The primary eigenvector (V1) points along the direction of maximum diffusion.

**EPI (Echo-Planar Imaging)** — A fast MRI acquisition technique that collects an entire 2D image slice in a single shot after one RF excitation pulse. EPI is the standard readout method for DWI because of its speed, but it is highly susceptible to geometric distortions from B0 field inhomogeneities.

**FA (Fractional Anisotropy)** — A scalar measure (range 0-1) derived from the diffusion tensor that quantifies how directionally constrained the diffusion is. FA=0 means perfectly isotropic diffusion (equal in all directions); FA=1 means diffusion is confined to a single direction. White matter typically has high FA (0.3-0.8).

**Fieldmap** — An MRI acquisition specifically designed to measure the spatial inhomogeneities in the main magnetic field (B0). In DTI preprocessing, reverse-phase-encoded b=0 image pairs serve as fieldmap data for TOPUP-based distortion correction.

**FLIRT (FMRIB's Linear Image Registration Tool)** — An FSL tool for affine (linear) registration between brain images. FLIRT supports multiple cost functions and degrees of freedom (6, 7, 9, or 12 parameters). It is commonly used to register individual DTI maps to standard space or to a subject's structural T1 image.

**FMRIB (Functional MRI of the Brain)** — The Oxford Centre for Functional MRI of the Brain, a research group at the University of Oxford that develops the FSL software suite. FMRIB is part of the Wellcome Centre for Integrative Neuroimaging (WIN).

**FSL (FMRIB Software Library)** — A comprehensive library of analysis tools for brain imaging data (fMRI, MRI, DTI). FSL includes tools for preprocessing (BET, TOPUP, EDDY), tensor fitting (DTIFIT), registration (FLIRT, FNIRT), tractography (BedpostX, probtrackx), and statistical analysis (TBSS, randomise).

**Gibbs ringing** — An image artifact caused by the truncation of k-space data during MRI acquisition, manifesting as oscillating signal near sharp intensity boundaries (e.g., brain-CSF interfaces). Gibbs ringing can bias DTI metrics. It can be mitigated using tools such as MRtrix3's `mrdegibbs`.

**Gradient direction** — The spatial orientation of the diffusion-sensitizing magnetic field gradient applied during a DWI acquisition. Each DWI volume is acquired with a different gradient direction, and the collection of all directions defines the angular sampling scheme. See also: B-vector.

**ICV (Intracranial Volume)** — The total volume enclosed by the skull, including brain tissue, CSF, and meninges. ICV is sometimes used as a covariate in DTI group analyses to account for differences in head size.

**Isotropic / Anisotropic diffusion** — Isotropic diffusion is equal in all directions (as in free water or CSF). Anisotropic diffusion varies with direction (as in white matter, where axonal membranes and myelin sheaths restrict diffusion perpendicular to the fibers). The degree of anisotropy is quantified by FA.

**MCMC (Markov Chain Monte Carlo)** — A class of algorithms for sampling from probability distributions, used in neuroimaging for Bayesian estimation of model parameters. FSL's BedpostX uses MCMC to estimate the posterior distribution of fiber orientations at each voxel.

**MD (Mean Diffusivity)** — The average rate of water diffusion across all directions, calculated as the mean of the three eigenvalues: MD = (L1 + L2 + L3) / 3. MD is sensitive to cellular density and edema. Units: mm^2/s.

**MNI space** — A standardized coordinate system for the human brain defined by the Montreal Neurological Institute. MNI space is based on averaging many individual brain scans and is the most commonly used template space for group-level neuroimaging analyses. The MNI152 template (based on 152 subjects) is the standard reference.

**Multiband acceleration** — An MRI acquisition technique (also called simultaneous multi-slice or SMS) that excites and acquires multiple slices simultaneously, reducing total scan time. Multiband is commonly used in modern DWI protocols to acquire more gradient directions in less time. The multiband factor (e.g., MB=3) indicates how many slices are acquired simultaneously.

**Multi-shell acquisition** — A DWI acquisition protocol that collects data at multiple b-values (e.g., b=0, 1000, 2000, 3000 s/mm^2). Multi-shell data supports advanced diffusion models (CSD, DKI, NODDI) that go beyond the single-tensor DTI model. For standard DTI, only a single shell (typically b=1000) is used.

**NIfTI (Neuroimaging Informatics Technology Initiative)** — A standard file format for storing neuroimaging data, using the `.nii` or `.nii.gz` extension. NIfTI files contain a header with spatial orientation and voxel size information followed by the image data. NIfTI is the standard working format for FSL, MRtrix3, and most neuroimaging tools.

**NODDI (Neurite Orientation Dispersion and Density Imaging)** — A multi-compartment diffusion model that estimates neurite density, orientation dispersion, and free water fraction at each voxel. NODDI requires multi-shell data and provides more specific microstructural information than DTI.

**Phase encoding direction** — The direction in k-space along which spatial encoding is performed during EPI acquisition. The phase encoding direction determines the axis along which susceptibility-induced geometric distortions occur. Common directions are AP/PA (anterior-posterior) and LR/RL (left-right).

**Posterior-to-Anterior (PA)** — A phase encoding direction in MRI acquisition where the readout proceeds from the back to the front of the head. In FSL convention, this corresponds to the vector `0 1 0` in the acquisition parameters file. PA images are typically acquired as the reverse-phase-encode pair for AP acquisitions.

**QSIPrep** — An automated preprocessing pipeline for diffusion MRI data built on top of fMRIPrep and Nipype. QSIPrep handles the complete preprocessing workflow including denoising, Gibbs ringing removal, motion correction, distortion correction, and coregistration, following BIDS conventions.

**RD (Radial Diffusivity)** — The average rate of water diffusion perpendicular to the principal diffusion direction, calculated as: RD = (L2 + L3) / 2. RD is sometimes interpreted as a marker of myelin integrity, though this interpretation should be made cautiously. Units: mm^2/s.

**Readout time** — The total time to acquire all phase-encode lines for a single image slice during EPI acquisition. Also called Total Readout Time. This parameter is required by TOPUP and EDDY to correctly model susceptibility-induced distortions. It is specified in seconds in the `acqp.txt` file.

**Registration** — The process of spatially aligning two or more images to a common coordinate system. In DTI, registration is used to align individual subject maps to a standard template (e.g., MNI space) for group analysis, or to align the DWI data to a subject's structural T1 image.

**Skull stripping** — The process of removing non-brain tissue (skull, scalp, meninges, eyes) from an MRI image to isolate the brain. Also called brain extraction. FSL's BET is the most commonly used skull stripping tool in DTI preprocessing.

**SNR (Signal-to-Noise Ratio)** — The ratio of the signal magnitude to the noise level in an image. Higher SNR means cleaner data and more reliable parameter estimates. DWI inherently has lower SNR than structural MRI because the diffusion weighting attenuates the signal. SNR decreases with increasing b-value.

**Susceptibility distortion** — Geometric distortion in EPI images caused by spatial variations in the main magnetic field (B0 inhomogeneities). These distortions are most pronounced near air-tissue interfaces (e.g., frontal sinuses, ear canals) and manifest as signal pile-up, stretching, or compression along the phase encoding direction. Corrected by TOPUP.

**Tensor fitting** — The process of estimating the diffusion tensor at each voxel from the DWI data. FSL's `dtifit` performs tensor fitting using weighted least squares regression. The resulting tensor is decomposed into eigenvalues and eigenvectors to produce scalar DTI maps.

**TOPUP** — An FSL tool that estimates and corrects susceptibility-induced distortions in EPI images. TOPUP works by taking pairs of images acquired with opposite phase encoding directions (e.g., AP and PA), estimating the B0 field inhomogeneity, and computing a correction warp field.

**Tractography** — A computational technique for reconstructing white matter fiber pathways from diffusion MRI data. Tractography algorithms trace streamlines through the estimated fiber orientation field, either deterministically (following the most likely direction) or probabilistically (sampling from the orientation distribution). Used to study structural connectivity.

**Voxel** — The three-dimensional equivalent of a pixel; the smallest discrete element of a 3D image volume. In DWI, a typical voxel size is 2x2x2 mm, meaning each voxel represents the average diffusion properties of all tissue within that cubic region.

**White matter / Gray matter** — White matter consists of myelinated axon bundles that connect different brain regions; it appears bright on FA maps due to the highly directional diffusion along fiber tracts. Gray matter consists of neuronal cell bodies and dendrites; it shows lower FA because diffusion is less directionally constrained.
