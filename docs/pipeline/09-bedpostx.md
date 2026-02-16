---
sidebar_position: 10
title: "Step 9: BedpostX"
---

# Step 9: BedpostX (Bayesian Fiber Orientation Estimation)

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

BedpostX (Bayesian Estimation of Diffusion Parameters Obtained using Sampling Techniques) uses Markov Chain Monte Carlo (MCMC) sampling to estimate the number and orientation of crossing fiber populations at each voxel. Unlike DTIFIT (which assumes a single fiber), BedpostX can model up to 3 crossing fibers per voxel.

## Why BedpostX?

The single-tensor model from DTIFIT cannot resolve crossing fibers (which exist in 60-90% of white matter voxels). BedpostX is required for probabilistic tractography (`probtrackx2`), which needs fiber orientation distributions rather than single tensor estimates.

## Prerequisites

BedpostX requires a specific directory structure:
```
bedpostx_input/
  data.nii.gz          # Eddy-corrected DWI
  bvecs                # Rotated gradient directions (from eddy)
  bvals                # B-values
  nodif_brain_mask.nii.gz  # Brain mask
```

## Command

```bash
# Prepare input directory
mkdir -p "$bedpostx_dir/${subj}"
cp "$eddy_dir/${subj}_eddy.nii.gz" "$bedpostx_dir/${subj}/data.nii.gz"
cp "$eddy_dir/${subj}_eddy.eddy_rotated_bvecs" "$bedpostx_dir/${subj}/bvecs"
cp "$input_dir/${subj}_dwi.bval" "$bedpostx_dir/${subj}/bvals"
cp "$mask_dir/${subj}_brain_mask.nii.gz" "$bedpostx_dir/${subj}/nodif_brain_mask.nii.gz"

# Run BedpostX
bedpostx "$bedpostx_dir/${subj}"
```

## Expected Output

Located in `${subj}.bedpostX/`:
- `dyads1.nii.gz` — primary fiber orientation
- `mean_f1samples.nii.gz` — volume fraction of fiber 1
- `merged_f[1-3]samples.nii.gz` — MCMC samples for each fiber population
- `merged_th[1-3]samples.nii.gz`, `merged_ph[1-3]samples.nii.gz` — orientation parameters

## Resource Requirements

BedpostX is computationally intensive:
- **CPU**: 6-24 hours per subject (varies with data size)
- **GPU** (`bedpostx_gpu`): ~1-2 hours per subject
- **RAM**: ~4-8 GB per subject

## References

- Behrens TEJ, et al. (2007). Probabilistic diffusion tractography with multiple fibre orientations. *NeuroImage*, 34(1), 144-155.
- FSL BedpostX: [https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FDT/UserGuide](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FDT/UserGuide)

## Next Step

[Step 10: Shell Extraction](./shell-extraction)
