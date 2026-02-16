---
sidebar_position: 1
title: "Tool Ecosystem Overview"
---

# Tool Ecosystem Overview

DTI preprocessing relies on a coordinated set of open-source neuroimaging tools. Each tool specializes in particular operations, and a typical pipeline chains them together in sequence. This page provides a comprehensive map of every tool used in this tutorial, what it does, and where it fits in the pipeline.

## Tools at a Glance

| Tool | Role | Key Commands | Official Link |
|------|------|-------------|---------------|
| **FSL** | Backbone of the DTI pipeline | `topup`, `eddy`, `dtifit`, `flirt`, `bet`, `fslroi`, `fslmerge`, `fslmaths`, `bedpostx`, `eddy_quad` | [fsl.fmrib.ox.ac.uk](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki) |
| **ANTs** | Brain extraction and registration | `antsBrainExtraction.sh`, `Atropos` | [github.com/ANTsX/ANTs](https://github.com/ANTsX/ANTs) |
| **MRtrix3** | Noise correction and advanced diffusion processing | `dwidenoise`, `mrdegibbs`, `dwiextract` | [mrtrix.org](https://www.mrtrix.org/) |
| **dcm2niix** | DICOM to NIfTI conversion | `dcm2niix` | [github.com/rordenlab/dcm2niix](https://github.com/rordenlab/dcm2niix) |
| **pyAFQ** | Automated fiber quantification | Python API | [yeatmanlab.github.io/pyAFQ](https://yeatmanlab.github.io/pyAFQ/) |
| **QSIPrep** | Containerized preprocessing | `qsiprep` command | [qsiprep.readthedocs.io](https://qsiprep.readthedocs.io/) |

---

## Pipeline Stages Mapped to Tools

Understanding which tool handles which stage helps you troubleshoot problems and customize the pipeline. The table below maps every preprocessing stage to its primary tool.

| Pipeline Stage | Tool | Commands Used |
|----------------|------|---------------|
| DICOM to NIfTI conversion | dcm2niix | `dcm2niix` |
| Skull stripping / brain extraction | ANTs | `antsBrainExtraction.sh` |
| B0 concatenation | FSL | `fslmerge` |
| Susceptibility distortion correction | FSL | `topup` |
| Mean B0 creation | FSL | `fslmaths`, `fslroi` |
| Brain masking | FSL | `bet` |
| Denoising | MRtrix3 | `dwidenoise` |
| Gibbs ringing correction | MRtrix3 | `mrdegibbs` |
| Eddy current and motion correction | FSL | `eddy` |
| Fiber orientation estimation | FSL | `bedpostx` |
| Shell extraction | MRtrix3 | `dwiextract` |
| Tensor fitting (FA, MD, RD, AD) | FSL | `dtifit` |
| Registration to standard space | FSL | `flirt` |
| Intracranial volume calculation | ANTs / FSL | `Atropos`, `fslmaths`, `fslstats` |
| Quality control reporting | FSL | `eddy_quad` |
| Automated tractography | pyAFQ | Python API |

---

## FSL: The Pipeline Backbone

FSL (FMRIB Software Library) provides the majority of commands in the DTI pipeline. It handles everything from distortion correction to tensor fitting to registration. Nearly every stage beyond the initial conversion and brain extraction passes through an FSL command.

Key FSL commands used in this tutorial:

- **`topup`** -- estimates and corrects susceptibility-induced distortions using pairs of images acquired with reversed phase-encode directions
- **`eddy`** -- corrects eddy current distortions and subject motion in diffusion-weighted images
- **`dtifit`** -- fits diffusion tensors to the data and produces scalar maps (FA, MD, RD, AD, V1)
- **`flirt`** -- performs linear (affine) registration between images
- **`bet`** -- extracts the brain from a whole-head image (brain extraction tool)
- **`fslroi`** -- extracts specific volumes from a 4D image
- **`fslmerge`** -- concatenates images along a specified dimension
- **`fslmaths`** -- performs mathematical operations on images (averaging, thresholding, masking)
- **`bedpostx`** -- estimates fiber orientation distributions using a Bayesian framework
- **`eddy_quad`** -- generates quality control metrics and reports for eddy-corrected data

## ANTs: Brain Extraction and Segmentation

ANTs (Advanced Normalization Tools) provides robust, template-based brain extraction that often outperforms FSL's `bet` on diffusion data. In this pipeline, ANTs handles the initial skull stripping and tissue segmentation for intracranial volume estimation.

Key ANTs commands used:

- **`antsBrainExtraction.sh`** -- template-based brain extraction using registration and segmentation
- **`Atropos`** -- N-tissue segmentation used for intracranial volume calculation

## MRtrix3: Noise and Gibbs Correction

MRtrix3 contributes noise correction tools that operate on the raw diffusion data before eddy correction. These steps improve data quality by removing thermal noise and Gibbs ringing artifacts.

Key MRtrix3 commands used:

- **`dwidenoise`** -- removes thermal noise using Marchenko-Pastur PCA (MP-PCA)
- **`mrdegibbs`** -- corrects Gibbs ringing artifacts
- **`dwiextract`** -- extracts specific b-value shells from multi-shell data

## dcm2niix: DICOM Conversion

dcm2niix converts raw DICOM files from the scanner into NIfTI format, which is the standard file format used by all downstream tools. It also generates JSON sidecar files with acquisition metadata and produces the `.bval` and `.bvec` files that describe the diffusion gradient scheme.

## pyAFQ: Automated Fiber Quantification

pyAFQ provides automated tractography and tract profiling after preprocessing is complete. It expects BIDS-formatted input data, which is why the final stage of the pipeline organizes outputs into BIDS structure.

## FSLeyes: Visualization

[FSLeyes](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FSLeyes) is FSL's image viewer and is used throughout this tutorial for visual quality control. While not a processing tool, it is essential for:

- Inspecting raw data before processing
- Checking brain masks and skull stripping results
- Verifying distortion correction outputs
- Evaluating registration quality
- Viewing FA, MD, and other scalar maps

FSLeyes is installed alongside FSL and can be launched from the command line:

```bash
fsleyes $out_dir/dtifit_FA.nii.gz &
```

---

## QSIPrep: An Alternative Containerized Approach

[QSIPrep](https://qsiprep.readthedocs.io/) is a containerized BIDS-app that automates many of the same preprocessing steps covered in this tutorial. It bundles FSL, ANTs, MRtrix3, and other tools into a Docker or Singularity container, providing a one-command preprocessing solution.

QSIPrep is discussed in detail on its [dedicated page](../tools/qsiprep.md). The short version: learn the manual pipeline first to understand what each step does, then consider QSIPrep for production-scale processing where reproducibility and standardization are priorities.

---

## References

- Jenkinson, M., Beckmann, C.F., Behrens, T.E.J., Woolrich, M.W., & Smith, S.M. (2012). FSL. *NeuroImage*, 62(2), 782-790. https://doi.org/10.1016/j.neuroimage.2011.09.015
- Avants, B.B., Tustison, N.J., Song, G., Cook, P.A., Klein, A., & Gee, J.C. (2011). A reproducible evaluation of ANTs similarity metric performance in brain image registration. *NeuroImage*, 54(3), 2033-2044. https://doi.org/10.1016/j.neuroimage.2010.09.025
- Tournier, J.-D., Smith, R., Raffelt, D., Tabbara, R., Dhollander, T., Pietsch, M., Christiaens, D., Jeurissen, B., Yeh, C.-H., & Connelly, A. (2019). MRtrix3: A fast, flexible and open software framework for medical image processing and visualisation. *NeuroImage*, 202, 116137. https://doi.org/10.1016/j.neuroimage.2019.116137
