---
sidebar_position: 14
title: "Step 13: ICV Calculation"
---

# Step 13: Intracranial Volume (ICV) Estimation

## Overview

This optional step estimates the total intracranial volume (ICV) for each subject by computing the volume of the brain mask from skull stripping. ICV is sometimes used as a **covariate** in group-level statistical analyses to control for individual differences in head size.

:::tip When Do You Need ICV?
Whether to control for ICV depends on your research question, analysis approach, and population. ICV is necessary in some contexts but not others — for example, developmental and aging studies where head size varies systematically across groups often include ICV as a covariate, while studies of healthy adults using tract-based metrics (e.g., mean FA along a tract via pyAFQ) typically do not. Consult your statistical analysis plan before deciding.
:::

## When ICV Matters

- **Voxel-based analysis (VBA)**: comparing FA values voxel-by-voxel across groups where head size differences can confound results
- **Whole-brain DTI metrics**: computing global mean FA or total white matter volume
- **Clinical populations**: comparing groups with expected head size differences (e.g., neurodegeneration, developmental disorders)

## Commands

```bash
# ──────────────────────────────────────────────
# Define paths
# ──────────────────────────────────────────────
ants_dir="$base_dir/ants/$subj"
output_dir="$base_dir/icv"

mkdir -p "$output_dir"

# ──────────────────────────────────────────────
# Quick ICV from brain mask volume
# ──────────────────────────────────────────────
icv=$(fslstats "$ants_dir/${subj}_BrainExtractionMask.nii.gz" -V | awk '{print $2}')
echo "${subj},${icv}" >> "$output_dir/icv_summary.csv"

# ──────────────────────────────────────────────
# Optional: tissue segmentation with Atropos (for per-tissue volumes)
# ──────────────────────────────────────────────
Atropos -d 3 \
    -a "$ants_dir/${subj}_BrainExtractionBrain.nii.gz" \
    -x "$ants_dir/${subj}_BrainExtractionMask.nii.gz" \
    -i "KMeans[3]" \
    -o "[${output_dir}/${subj}_seg.nii.gz,${output_dir}/${subj}_prob%02d.nii.gz]"
```

## Expected Output

| File | Description |
|------|-------------|
| `icv_summary.csv` | CSV with subject ID and ICV in mm³ |
| `${subj}_seg.nii.gz` | 3-class segmentation (optional, from Atropos) |

## Quality Check

- ICV values for healthy adults typically range from **1,200,000–1,800,000 mm³** (1200–1800 cm³)
- Flag subjects with values far outside this range — likely indicates failed skull stripping
- If using Atropos, overlay the segmentation on the T1 in FSLeyes to verify labels

## Next Step

Proceed to **[Step 14: BIDS Conversion & pyAFQ](./pyafq-bids)** to organize your data for automated tract analysis.
