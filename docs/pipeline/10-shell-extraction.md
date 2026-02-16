---
sidebar_position: 11
title: "Step 10: Shell Extraction"
---

# Step 10: DWI Shell Extraction

## Overview

After eddy correction, your 4D DWI dataset may contain data from **multiple b-value shells** (e.g., b=0, 1000, 2000, 3000). Different downstream analyses require different shell combinations. This step extracts the specific shells you need, producing a smaller, targeted dataset for each planned analysis.

## Conceptual Background

### What Are Shells?

A "shell" refers to a group of DWI volumes acquired with the same b-value. The b-value controls how much diffusion weighting is applied:

- **b=0**: No diffusion weighting — shows anatomy without diffusion contrast
- **b≈1000**: Moderate diffusion weighting — standard for DTI, good balance of SNR and diffusion contrast
- **b≈2000–3000**: High diffusion weighting — more sensitive to restricted diffusion, better for advanced models (CSD, NODDI)

### Which Shells Do I Need?

This depends on your planned analysis:

| Analysis | Required Shells | Why |
|----------|----------------|-----|
| **DTI / DTIFIT** | b=0 + one shell (typically b≈1000) | Single-tensor model assumes Gaussian diffusion — works best at moderate b-values |
| **CSD (constrained spherical deconvolution)** | b=0 + one or more higher shells (b≈2000–3000) | Needs strong diffusion weighting to resolve crossing fibers |
| **NODDI** | b=0 + at least 2 non-zero shells | Multi-compartment model requires multiple b-values to separate intra/extracellular water |
| **DKI (diffusion kurtosis imaging)** | b=0 + at least 2 non-zero shells (b≈1000, 2000) | Kurtosis estimation requires multiple b-values |
| **Free water elimination** | b=0 + at least 2 non-zero shells | Separating free water from tissue requires multi-shell data |

### Inspecting Your Shells

Before extracting, check what shells you actually have:

```bash
# Option 1: Read the .bval file directly
cat "$input_dir/${subj}_dti.bval"
# Example: 0 0 1000 1000 1000 2000 2000 2000 3000 3000 ...

# Option 2: Use MRtrix3 to identify detected shells
mrinfo "$input_dir/${subj}_eddy.nii.gz" \
    -fslgrad "$input_dir/${subj}_eddy.eddy_rotated_bvecs" "$input_dir/${subj}_dti.bval" \
    -shell_bvalues
# Example output: 0 1000 2000 3000

# Option 3: Count volumes per shell
mrinfo "$input_dir/${subj}_eddy.nii.gz" \
    -fslgrad "$input_dir/${subj}_eddy.eddy_rotated_bvecs" "$input_dir/${subj}_dti.bval" \
    -shell_sizes
# Example output: 6 64 64 64
```

:::tip B-Values Are Not Always Exact
Scanners often produce b-values like 998, 1003, or 2005 instead of exactly 1000 or 2000. MRtrix3 handles this automatically by grouping b-values within a tolerance (default ±100). So `dwiextract -shells 0,1000` will correctly capture volumes with b=998, 1003, etc.
:::

## Prerequisites

| Input | Source | Description |
|-------|--------|-------------|
| Eddy-corrected DWI | [Step 8: Eddy](./eddy) | 4D diffusion volume |
| Rotated bvecs | [Step 8: Eddy](./eddy) | Gradient directions corrected for head rotation |
| b-values | [Step 1: DICOM to NIfTI](./dicom-to-nifti) | Original b-value file |

:::caution Use Rotated bvecs
**Always** use the rotated bvecs from eddy (`eddy_rotated_bvecs`), **not** the original bvecs from DICOM conversion. During scanning, the subject's head rotates slightly between volumes. Eddy detects these rotations and updates the gradient directions accordingly. Using the original (unrotated) bvecs means your gradient directions no longer match the data, leading to incorrect FA/MD values and inaccurate tractography.
:::

## Commands

### Extract Shells for DTI (b=0 + b=1000)

```bash
# ──────────────────────────────────────────────
# Define paths
# ──────────────────────────────────────────────
eddy_dir="$base_dir/eddy/$subj"
nifti_dir="$base_dir/nifti/$subj/dti"
output_dir="$base_dir/shells/$subj"

mkdir -p "$output_dir"

# ──────────────────────────────────────────────
# Extract b=0 and b=1000 for tensor fitting
# ──────────────────────────────────────────────
dwiextract "$eddy_dir/${subj}_eddy.nii.gz" \
    "$output_dir/${subj}_data_b1000.nii.gz" \
    -fslgrad "$eddy_dir/${subj}_eddy.eddy_rotated_bvecs" \
             "$nifti_dir/${subj}_dti.bval" \
    -shells 0,1000 \
    -export_grad_fsl "$output_dir/${subj}_data_b1000.bvec" \
                     "$output_dir/${subj}_data_b1000.bval"
```

### Extract Shells for Multi-Shell Analysis (b=0 + b=1000 + b=2000)

```bash
# ──────────────────────────────────────────────
# Extract b=0, 1000, and 2000 for CSD/NODDI
# ──────────────────────────────────────────────
dwiextract "$eddy_dir/${subj}_eddy.nii.gz" \
    "$output_dir/${subj}_data_b1000_2000.nii.gz" \
    -fslgrad "$eddy_dir/${subj}_eddy.eddy_rotated_bvecs" \
             "$nifti_dir/${subj}_dti.bval" \
    -shells 0,1000,2000 \
    -export_grad_fsl "$output_dir/${subj}_data_b1000_2000.bvec" \
                     "$output_dir/${subj}_data_b1000_2000.bval"
```

### Single-Shell Data (No Extraction Needed)

If your data has only b=0 and one non-zero shell (e.g., a standard DTI protocol with 30 directions at b=1000), shell extraction is unnecessary. You can pass the eddy-corrected data directly to DTIFIT.

## Batch Processing Script

```bash
#!/bin/bash
# shell_extraction.sh — Extract b-value shells for all subjects

base_dir="/path/to/project"
eddy_dir="$base_dir/eddy"
nifti_dir="$base_dir/nifti"
output_dir="$base_dir/shells"

# ============================================================
# IMPORTANT: Adjust the -shells flag to match YOUR b-values
# Check your .bval files to see what shells you have
# ============================================================

subjects=$(ls -d "$eddy_dir"/sub-* 2>/dev/null | xargs -n1 basename)

for subj in $subjects; do
    echo "Processing: $subj"

    input="$eddy_dir/$subj/${subj}_eddy.nii.gz"
    bvecs="$eddy_dir/$subj/${subj}_eddy.eddy_rotated_bvecs"
    bvals="$nifti_dir/$subj/dti/${subj}_dti.bval"

    if [ ! -f "$input" ]; then
        echo "  WARNING: Missing eddy output for $subj — skipping"
        continue
    fi

    mkdir -p "$output_dir/$subj"

    # Extract b=0 + b=1000 for tensor fitting
    dwiextract "$input" \
        "$output_dir/$subj/${subj}_data_b1000.nii.gz" \
        -fslgrad "$bvecs" "$bvals" \
        -shells 0,1000 \
        -export_grad_fsl "$output_dir/$subj/${subj}_data_b1000.bvec" \
                         "$output_dir/$subj/${subj}_data_b1000.bval"

    echo "  Done: $subj"
done

echo "Shell extraction complete."
```

## Expected Output

| File | Description |
|------|-------------|
| `${subj}_data_b1000.nii.gz` | 4D volume containing only b=0 and b=1000 volumes |
| `${subj}_data_b1000.bvec` | Updated gradient directions for the extracted subset |
| `${subj}_data_b1000.bval` | Updated b-values for the extracted subset |

## Quality Check

### 1. Verify Volume Count

The number of volumes should match the number of b-values:

```bash
fslnvols "$output_dir/$subj/${subj}_data_b1000.nii.gz"
# Example: 70

wc -w < "$output_dir/$subj/${subj}_data_b1000.bval"
# Should match: 70
```

### 2. Verify Correct B-Values

```bash
cat "$output_dir/$subj/${subj}_data_b1000.bval"
# Should only contain values near 0 and 1000
# Example: 0 0 0 0 0 0 1000 1000 1000 1000 ...
```

### 3. Verify Rotated Bvecs Were Used

```bash
# Check that the bvecs are not identical to the original
# (they should differ slightly due to head motion corrections)
diff "$output_dir/$subj/${subj}_data_b1000.bvec" \
     "$nifti_dir/$subj/dti/${subj}_dti.bvec"
# Should show differences (if the subject moved at all during the scan)
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No volumes match the specified shells" | Your b-values do not include the shell you requested | Check your actual b-values with `cat file.bval` or `mrinfo -shell_bvalues` |
| Wrong number of volumes | b-value tolerance issue | MRtrix3 uses a tolerance of ±100 by default; if your b-values are far from the nominal value, use `-shell_bvalue_scaling` |
| Used original bvecs instead of rotated | Common mistake | Always use `eddy_rotated_bvecs` from the eddy output directory |
| Single-shell data, nothing to extract | Only one non-zero b-value in the data | Skip this step; use the full eddy-corrected dataset directly |

## References

- Jones DK (2004). The effect of gradient sampling schemes on measures derived from diffusion tensor MRI: A Monte Carlo study. *Magnetic Resonance in Medicine*, 51(4), 807-815.
- MRtrix3 dwiextract: [https://mrtrix.readthedocs.io/en/latest/reference/commands/dwiextract.html](https://mrtrix.readthedocs.io/en/latest/reference/commands/dwiextract.html)

## Next Step

Proceed to **[Step 11: Tensor Fitting (DTIFIT)](./dtifit)** to fit the diffusion tensor model and compute FA, MD, AD, and RD maps.
