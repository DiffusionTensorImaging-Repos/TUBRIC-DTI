---
sidebar_position: 7
title: "Step 6: Brain Masking"
---

# Step 6: Brain Masking on Mean B0

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

Creates a binary brain mask from the mean B0 image using FSL's BET (Brain Extraction Tool). This mask defines which voxels are included in all downstream processing — ensuring that non-brain tissue (skull, scalp, air) is excluded from eddy correction, tensor fitting, and analysis.

## Why Use BET Here (Not ANTs)?

ANTs skull stripping (Step 2) was applied to the T1 structural image. Here we need a mask in **diffusion space** — aligned to the DWI data, not the structural. BET is fast and works well on mean B0 images.

## Command

```bash
bet "$input_dir/${subj}_topup_Tmean" \
    "$output_dir/${subj}_topup_Tmean_brain" \
    -m -f 0.3
```

- `-m`: generate a binary mask (`_mask.nii.gz`)
- `-f`: fractional intensity threshold (0.3 is a reasonable default; lower = less aggressive stripping)

## Expected Output

- `${subj}_topup_Tmean_brain.nii.gz` — brain-extracted mean B0
- `${subj}_topup_Tmean_brain_mask.nii.gz` — binary brain mask

## Quality Check

Overlay the mask on the mean B0 in FSLeyes:
```bash
fsleyes "$input_dir/${subj}_topup_Tmean" \
        "$output_dir/${subj}_topup_Tmean_brain_mask" -cm red-yellow -a 50 &
```

- The mask should cover the entire brain without including skull
- Adjust `-f` parameter if the mask is too tight (increase f) or too loose (decrease f)

## Common Issues

- **Over-stripping**: brain tissue excluded. Try lowering `-f` to 0.2
- **Under-stripping**: skull included. Try raising `-f` to 0.4 or adding `-g 0` flag

## Next Step

[Step 7: Denoising & Gibbs Correction](./denoising-gibbs)
