---
sidebar_position: 4
title: "Multi-Shell Acquisition"
---

# Multi-Shell Diffusion MRI

:::info Coming Soon
This page is under active development. A guide to multi-shell analysis methods is being written.
:::

## Overview

Multi-shell acquisitions collect DWI data at multiple b-values (e.g., b=0, 1000, 2000, 3000 s/mm^2). While standard DTI only needs a single shell (b=1000), multi-shell data enables advanced diffusion models that provide more specific information about tissue microstructure.

## Why Multi-Shell?

The single-tensor DTI model assumes Gaussian diffusion, which breaks down at higher b-values and in voxels with complex fiber geometry. Multi-shell data supports models that go beyond these limitations:

| Model | Required Shells | What It Measures |
|-------|----------------|-----------------|
| **DTI** | 1 shell (b=1000) | FA, MD, AD, RD — bulk diffusion anisotropy |
| **DKI** | 2+ shells | Kurtosis — deviation from Gaussian diffusion |
| **CSD** | 1-2+ shells | Fiber orientation distribution — resolves crossings |
| **NODDI** | 2+ shells | Neurite density, orientation dispersion, free water |

## Shell Selection

- **b=1000**: standard for tensor fitting (Gaussian assumption holds)
- **b=2000-3000**: increases angular contrast, needed for CSD and DKI
- **b=5000+**: very high weighting, useful for specific microstructural models but very low SNR

## Preprocessing Considerations

Multi-shell data is preprocessed with the same pipeline described in this tutorial. The key differences:
- EDDY handles all shells simultaneously (no need to separate before correction)
- Shell extraction (Step 10) is used to select appropriate shells for each downstream analysis
- Higher b-value shells have lower SNR and may be more susceptible to artifacts

## References

- Jensen JH, et al. (2005). Diffusional kurtosis imaging. *MRM*, 53(6), 1432-1440.
- Tournier JD, et al. (2007). Robust determination of the fibre orientation distribution in diffusion MRI. *NeuroImage*, 35(4), 1459-1472.
- Zhang H, et al. (2012). NODDI: Practical in vivo neurite orientation dispersion and density imaging of the human brain. *NeuroImage*, 61(4), 1000-1016.
