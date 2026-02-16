---
sidebar_position: 4
title: "MRtrix3"
---

# MRtrix3

:::info Coming Soon
This page is under active development. A complete guide to MRtrix3 for DTI preprocessing is being written.
:::

## Overview

MRtrix3 is an open-source software package for diffusion MRI analysis, providing tools for denoising, artifact correction, and advanced diffusion modeling including constrained spherical deconvolution (CSD) and tractography.

**Official Site**: [https://www.mrtrix.org/](https://www.mrtrix.org/)
**GitHub**: [https://github.com/MRtrix3/mrtrix3](https://github.com/MRtrix3/mrtrix3)
**Documentation**: [https://mrtrix.readthedocs.io/](https://mrtrix.readthedocs.io/)

## Installation

```bash
# Clone and build
git clone https://github.com/MRtrix3/mrtrix3.git
cd mrtrix3
./configure
./build

# Add to PATH
export PATH="/path/to/mrtrix3/bin:$PATH"
```

## Key Commands for DTI

| Command | Pipeline Stage | Purpose |
|---------|---------------|---------|
| `dwidenoise` | Denoising | MP-PCA noise removal |
| `mrdegibbs` | Gibbs Correction | Remove Gibbs ringing artifacts |
| `dwiextract` | Shell Extraction | Extract specific b-value shells |

## References

- Tournier JD, Smith R, Raffelt D, et al. (2019). MRtrix3: A fast, flexible and open software framework for medical image processing and visualisation. *NeuroImage*, 202, 116137.
- Veraart J, Novikov DS, Christiaens D, Ades-Aron B, Sijbers J, Fieremans E (2016). Denoising of diffusion MRI using random matrix theory. *NeuroImage*, 142, 394-406.
- Kellner E, Dhital B, Kiselev VG, Reisert M (2016). Gibbs-ringing artifact removal based on local subvoxel-shifts. *Magnetic Resonance in Medicine*, 76(5), 1574-1581.
