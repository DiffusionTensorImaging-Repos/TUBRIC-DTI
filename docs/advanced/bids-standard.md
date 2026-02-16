---
sidebar_position: 3
title: "BIDS Standard"
---

# The Brain Imaging Data Structure (BIDS)

:::info Coming Soon
This page is under active development. A comprehensive guide to BIDS for diffusion MRI is being written.
:::

## Overview

BIDS is a community standard for organizing and describing neuroimaging datasets. Adopting BIDS ensures your data is:
- **Self-describing**: anyone can understand the dataset structure
- **Compatible**: works with a growing ecosystem of BIDS-aware tools (pyAFQ, QSIPrep, fMRIPrep)
- **Reproducible**: standardized naming eliminates ambiguity

## BIDS for Diffusion MRI

```
project/
  dataset_description.json
  participants.tsv
  sub-001/
    anat/
      sub-001_T1w.nii.gz
      sub-001_T1w.json
    dwi/
      sub-001_dwi.nii.gz
      sub-001_dwi.json
      sub-001_dwi.bval
      sub-001_dwi.bvec
    fmap/
      sub-001_dir-AP_epi.nii.gz
      sub-001_dir-AP_epi.json
      sub-001_dir-PA_epi.nii.gz
      sub-001_dir-PA_epi.json
  derivatives/
    preprocessing/
      sub-001/
        dwi/
          sub-001_desc-preproc_dwi.nii.gz
          sub-001_desc-brain_mask.nii.gz
```

## Key Principles

- **Subject prefix**: all files start with `sub-<label>`
- **Modality directories**: `anat/`, `dwi/`, `fmap/`
- **Derivatives**: processed outputs go in `derivatives/`
- **JSON sidecars**: every NIfTI file has a matching JSON with metadata
- **participants.tsv**: subject-level demographics and metadata

## Validation

Use the BIDS Validator to check compliance:
```bash
# Web-based: https://bids-standard.github.io/bids-validator/
# Or install locally:
npm install -g bids-validator
bids-validator /path/to/dataset
```

## References

- Gorgolewski KJ, et al. (2016). The brain imaging data structure. *Scientific Data*, 3, 160044.
- BIDS Specification: [https://bids-specification.readthedocs.io/](https://bids-specification.readthedocs.io/)
