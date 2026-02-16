---
sidebar_position: 14
title: "Step 13: ICV Calculation"
---

# Step 13: Intracranial Volume (ICV) Estimation

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

Estimates the total intracranial volume (ICV) for each subject by segmenting the brain-extracted T1 into three tissue classes (CSF, gray matter, white matter) and summing their volumes. ICV is commonly used as a **covariate** in group-level statistical analyses to control for individual differences in head size.

## Why ICV Matters

Brain volume varies across individuals due to factors like sex, age, and body size. Without controlling for ICV, group differences in DTI metrics could reflect head size rather than microstructural differences.

## Commands

```bash
# Step 1: Tissue segmentation using ANTs Atropos
Atropos -d 3 \
  -a "$ants_dir/${subj}_BrainExtractionBrain.nii.gz" \
  -x "$ants_dir/${subj}_BrainExtractionMask.nii.gz" \
  -i "KMeans[3]" \
  -o "[${output_dir}/${subj}_seg.nii.gz, ${output_dir}/${subj}_prob%02d.nii.gz]"

# Step 2: Calculate total brain volume from the mask
icv=$(fslstats "$ants_dir/${subj}_BrainExtractionMask.nii.gz" -V | awk '{print $2}')
echo "${subj},${icv}" >> "$output_dir/icv_summary.csv"
```

## Expected Output

- `${subj}_seg.nii.gz` — 3-class segmentation (1=CSF, 2=GM, 3=WM)
- `${subj}_prob00.nii.gz` through `${subj}_prob02.nii.gz` — probability maps for each tissue class
- `icv_summary.csv` — cumulative CSV with subject IDs and ICV values

## Quality Check

- Verify segmentation labels by overlaying in FSLeyes
- Check that ICV values are within a reasonable range (typically 1200-1800 cm^3 for adults)

## References

- Avants BB, et al. (2011). ANTs similarity metric performance in brain image registration. *NeuroImage*, 54(3), 2033-2044.

## Next Step

[Step 14: BIDS Conversion & pyAFQ](./pyafq-bids)
