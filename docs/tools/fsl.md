---
sidebar_position: 2
title: "FSL (FMRIB Software Library)"
---

# FSL — FMRIB Software Library

:::info Coming Soon
This page is under active development. A complete guide to FSL for DTI preprocessing is being written.
:::

## Overview

FSL is the backbone of the DTI preprocessing pipeline. Developed by the Analysis Group at the [Oxford Centre for Functional MRI of the Brain (FMRIB)](https://www.win.ox.ac.uk/), FSL provides the tools for distortion correction, motion correction, tensor fitting, registration, and brain extraction.

**Official Site**: [https://fsl.fmrib.ox.ac.uk/fsl/fslwiki](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki)

## Installation

Follow the official installation guide: [FSL Installation](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FslInstallation)

Verify installation:
```bash
flirt -version
which eddy
echo $FSLDIR
```

## Key DTI Commands

| Command | Pipeline Stage | Purpose |
|---------|---------------|---------|
| `fslroi` | B0 Concatenation | Extract specific volumes from 4D data |
| `fslmerge` | B0 Concatenation | Concatenate volumes along time |
| `topup` | Distortion Correction | Estimate susceptibility field |
| `fslmaths` | Mean B0 | Arithmetic operations on images |
| `bet` | Brain Masking | Brain extraction |
| `eddy` | Motion/Eddy Correction | Correct motion and eddy currents |
| `dtifit` | Tensor Fitting | Fit diffusion tensor model |
| `flirt` | Registration | Linear registration |
| `convert_xfm` | Registration | Concatenate/invert transforms |
| `bedpostx` | Fiber Estimation | Bayesian fiber orientation estimation |
| `fslstats` | ICV Calculation | Image statistics |
| `eddy_quad` | Quality Control | Per-subject QC |
| `eddy_squad` | Quality Control | Group-level QC |

## FSLeyes

FSLeyes is FSL's image viewer, essential for visual quality control at every pipeline stage.

```bash
fsleyes &
```

## References

- Jenkinson M, Beckmann CF, Behrens TEJ, Woolrich MW, Smith SM (2012). FSL. *NeuroImage*, 62(2), 782-790.
- Smith SM, et al. (2004). Advances in functional and structural MR image analysis and implementation as FSL. *NeuroImage*, 23(S1), 208-219.
