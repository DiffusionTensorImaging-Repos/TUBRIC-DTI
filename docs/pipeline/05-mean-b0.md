---
sidebar_position: 6
title: "Step 5: Mean B0 Image"
---

# Step 5: Mean B0 Image

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

After TOPUP corrects susceptibility distortions in the B0 images, we average all corrected B0 volumes across time to produce a single, high signal-to-noise ratio (SNR) reference image. This mean B0 serves as the basis for brain mask generation in the next step.

## Why Average?

Individual B0 volumes contain random noise. By averaging multiple volumes, random noise cancels out while the true signal remains, producing a cleaner reference image for brain extraction.

## Command

```bash
fslmaths "$input_dir/${subj}_topup_corrected_b0" \
  -Tmean \
  "$output_dir/${subj}_topup_Tmean"
```

- `-Tmean`: averages across the time (4th) dimension, collapsing a 4D file into a 3D volume

## Expected Output

- `${subj}_topup_Tmean.nii.gz` — 3D mean B0 image

## Quality Check

Verify the output is 3D (not 4D) using `fslinfo`:
```bash
fslinfo "$output_dir/${subj}_topup_Tmean" | grep "^dim4"
# Should show dim4 = 1
```

## Next Step

[Step 6: Brain Masking](./brain-masking)
