---
sidebar_position: 3
title: "EDDY QC (eddy_quad & eddy_squad)"
---

# EDDY Quality Control

:::info Coming Soon
This page is under active development. Detailed instructions and example QC reports are being added.
:::

## Overview

FSL provides two dedicated QC tools for EDDY output:
- **eddy_quad**: per-subject QC reports
- **eddy_squad**: group-level QC summary

These tools produce HTML reports with motion plots, outlier statistics, and contrast-to-noise ratio (CNR) maps.

## Per-Subject QC: eddy_quad

```bash
eddy_quad "$eddy_dir/${subj}_eddy" \
  -idx "$config_dir/index.txt" \
  -par "$config_dir/acqp.txt" \
  -m "$mask_dir/${subj}_brain_mask.nii.gz" \
  -b "$input_dir/${subj}_dwi.bval"
```

### Key Metrics

- **Average absolute motion**: total displacement from the first volume. Should be < 2 mm.
- **Average relative motion**: volume-to-volume displacement. Lower is better.
- **Outlier slices**: percentage of slices flagged as outliers by `--repol`. High percentage suggests problematic data.
- **CNR per shell**: contrast-to-noise ratio for each b-value shell. Should be consistent across subjects.

## Group-Level QC: eddy_squad

```bash
# Create a text file listing all eddy_quad output directories
ls -d "$eddy_dir"/*/eddy_quad > squad_list.txt

# Run squad
eddy_squad squad_list.txt
```

Produces group summary statistics and identifies outlier subjects.

## Exclusion Criteria

See [Exclusion Criteria](./exclusion-criteria) for recommended thresholds.

## References

- Bastiani M, et al. (2019). Automated quality control for within and between studies diffusion MRI data using a non-parametric framework for movement and distortion correction. *NeuroImage*, 184, 801-812.
