---
sidebar_position: 11
title: "Step 10: Shell Extraction"
---

# Step 10: DWI Shell Extraction

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

After eddy correction, the 4D DWI dataset may contain multiple b-value shells (e.g., b=0, 1000, 2000, 3000). Different downstream analyses require different shell combinations:

- **Tensor fitting (DTIFIT)**: requires only b=0 and b=1000 (the Gaussian diffusion assumption holds best at moderate b-values)
- **Advanced models (CSD, DKI)**: benefit from multiple shells (b=0, 1000, 2000)
- **High angular resolution**: may use all available shells

This step extracts the appropriate shells for each analysis.

## Tool

MRtrix3 `dwiextract`

## Commands

```bash
# Extract b=0 and b=1000 for tensor fitting
dwiextract "$input_dir/${subj}_eddy.nii.gz" \
  "$output_dir/${subj}_data_1000.nii.gz" \
  -fslgrad "$input_dir/${subj}_eddy.eddy_rotated_bvecs" "$input_dir/${subj}_dwi.bval" \
  -shells 0,1000 \
  -export_grad_fsl "$output_dir/${subj}_data_1000.bvec" "$output_dir/${subj}_data_1000.bval"

# Extract b=0, 1000, and 2000 for advanced models
dwiextract "$input_dir/${subj}_eddy.nii.gz" \
  "$output_dir/${subj}_data_1000_2000.nii.gz" \
  -fslgrad "$input_dir/${subj}_eddy.eddy_rotated_bvecs" "$input_dir/${subj}_dwi.bval" \
  -shells 0,1000,2000 \
  -export_grad_fsl "$output_dir/${subj}_data_1000_2000.bvec" "$output_dir/${subj}_data_1000_2000.bval"
```

## Expected Output

- `${subj}_data_1000.nii.gz` + `.bvec` + `.bval` — data for tensor fitting
- `${subj}_data_1000_2000.nii.gz` + `.bvec` + `.bval` — data for advanced models

## Quality Check

Verify the correct number of volumes and b-values:
```bash
fslnvols "$output_dir/${subj}_data_1000.nii.gz"
cat "$output_dir/${subj}_data_1000.bval"
```

:::caution Important
Always use the **rotated bvecs** from eddy (`eddy_rotated_bvecs`), not the original bvecs. The gradient directions must be updated to reflect any head rotations that occurred during scanning.
:::

## Next Step

[Step 11: Tensor Fitting (DTIFIT)](./dtifit)
