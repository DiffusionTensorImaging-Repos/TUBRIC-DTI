---
sidebar_position: 8
title: "Step 7: Denoising & Gibbs Correction"
---

# Step 7: Denoising and Gibbs Ringing Removal

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

This step applies two artifact corrections using MRtrix3:
1. **Denoising** (`dwidenoise`): removes thermal noise using Marchenko-Pastur Principal Component Analysis (MP-PCA)
2. **Gibbs ringing removal** (`mrdegibbs`): removes oscillatory artifacts near sharp tissue boundaries caused by Fourier truncation

An optional third operation removes unwanted b-value shells (e.g., b=250) that may not be useful for tensor fitting.

## Conceptual Background

### Thermal Noise
MRI images contain random thermal noise from the scanner electronics and the subject. MP-PCA exploits the mathematical properties of the noise distribution in multi-volume data to separate signal from noise without blurring.

### Gibbs Ringing
When the Fourier transform used in MRI reconstruction is truncated (because k-space coverage is finite), oscillatory artifacts appear near sharp edges in the image. These "rings" can bias diffusion metrics, particularly near the cortical surface.

## Commands

```bash
# Step 1: Denoise the raw DWI data
dwidenoise "$input_dir/${subj}_dwi.nii.gz" \
           "$output_dir/${subj}_denoised.nii.gz"

# Step 2: Remove Gibbs ringing
mrdegibbs "$output_dir/${subj}_denoised.nii.gz" \
          "$output_dir/${subj}_denoised_degibbs.nii.gz"

# Optional Step 3: Remove unwanted b-value shells
dwiextract "$output_dir/${subj}_denoised_degibbs.nii.gz" \
           "$output_dir/${subj}_dwi_cleaned.nii.gz" \
           -fslgrad "$input_dir/${subj}_dwi.bvec" "$input_dir/${subj}_dwi.bval" \
           -shells 0,1000,2000,3000 \
           -export_grad_fsl "$output_dir/${subj}_cleaned.bvec" "$output_dir/${subj}_cleaned.bval"
```

## Order Matters

Denoising should be applied **before** Gibbs correction. The noise estimation in `dwidenoise` works best on data that has not been spatially filtered.

## Expected Output

- `${subj}_denoised.nii.gz` — denoised DWI
- `${subj}_denoised_degibbs.nii.gz` — denoised + Gibbs-corrected DWI
- Updated `.bvec` and `.bval` files (if shells were removed)

## Quality Check

Compare volumes before and after denoising — noise should be reduced without visible blurring of tissue boundaries.

## References

- Veraart J, et al. (2016). Denoising of diffusion MRI using random matrix theory. *NeuroImage*, 142, 394-406.
- Kellner E, Dhital B, Kiselev VG, Reisert M (2016). Gibbs-ringing artifact removal based on local subvoxel-shifts. *MRM*, 76(5), 1574-1581.

## Next Step

[Step 8: Eddy Current & Motion Correction](./eddy)
