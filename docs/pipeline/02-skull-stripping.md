---
sidebar_position: 3
title: "Step 2: Skull Stripping"
---

# Step 2: Skull Stripping

## Overview

Skull stripping removes **non-brain tissue** (skull, scalp, eyes, neck musculature) from the T1-weighted structural image, producing a clean brain-only volume and a corresponding binary brain mask. This step is essential because:

- **Registration accuracy**: Non-brain tissue introduces misleading features that degrade alignment between subject and template spaces
- **Downstream contamination**: Skull and scalp voxels can leak into diffusion analyses if the structural image is used without masking
- **Computational efficiency**: Processing only brain voxels reduces computation time in later steps

## Conceptual Background

### Template-Based Skull Stripping (ANTs)

The preferred approach uses **ANTs (Advanced Normalization Tools)** to perform template-based brain extraction:

1. **Registration**: The subject's T1 image is nonlinearly aligned to a standard **brain template** (a population-averaged brain image)
2. **Mask propagation**: The template's known **brain mask** (a binary volume where 1 = brain, 0 = non-brain) is warped back into the subject's native space using the inverse of the computed transformation
3. **Extraction**: The warped mask is applied to the original T1 to remove non-brain tissue

This approach is more reliable than simple intensity-based methods (which threshold voxel brightness) because it leverages anatomical shape priors from the template. It handles challenging cases like bright meninges, sinus cavities, and neck tissue more robustly.

### Alternative: FSL BET

**FSL BET** (Brain Extraction Tool) uses a surface-fitting algorithm that starts as a sphere and deforms outward to find the brain boundary based on intensity gradients. It is faster but sometimes less accurate, particularly for subjects with atypical anatomy or strong intensity inhomogeneity.

## Prerequisites

- **NIfTI T1 structural images** from [Step 1](./dicom-to-nifti)
- **ANTs** installed (for template-based method)
- **Brain template and template mask** downloaded (see Template Selection below)
- Alternatively, **FSL** installed (for BET method)

## Tool & Command Reference

### Checking for ANTs Installation

If you are working on a shared cluster or HPC system, ANTs may already be installed. To locate it:

```bash
# Search for the ANTs brain extraction script
find / -type f -name "antsBrainExtraction.sh" 2>/dev/null | head -5

# Or check if it's available as a module
module avail 2>&1 | grep -i ants
```

### Adding ANTs to Your PATH

Once you know where ANTs is installed, add it to your environment:

```bash
# Add to your current session
export ANTSPATH="/path/to/ANTs/bin"
export PATH="$ANTSPATH:$PATH"

# Make permanent by adding to ~/.bashrc or ~/.bash_profile
echo 'export ANTSPATH="/path/to/ANTs/bin"' >> ~/.bashrc
echo 'export PATH="$ANTSPATH:$PATH"' >> ~/.bashrc
```

Verify the installation:

```bash
antsBrainExtraction.sh --help
```

### Template Selection

The brain template must match your study population in terms of age range and demographics. Common choices:

| Template | Population | Best For |
|----------|-----------|----------|
| **NKI** | Healthy adults and adolescents | General-purpose DTI studies |
| **OASIS** | Older adults (62-96 years) | Aging and dementia studies |
| **Pediatric** (e.g., NIHPD) | Children and adolescents | Developmental studies |

**Download templates from:**
https://figshare.com/articles/dataset/ANTs_ANTsR_Brain_Templates/915436

After downloading, you should have two key files:
- `T_template0.nii.gz` -- the brain template image
- `T_template0_BrainCerebellumProbabilityMask.nii.gz` -- the probability mask

### ANTs Brain Extraction (Preferred)

```bash
antsBrainExtraction.sh \
    -d 3 \
    -a "$input_dir/${subj}_struct.nii.gz" \
    -e "$template_dir/T_template0.nii.gz" \
    -m "$template_dir/T_template0_BrainCerebellumProbabilityMask.nii.gz" \
    -o "$output_dir/${subj}_"
```

**Flag reference:**

| Flag | Description |
|------|-------------|
| `-d 3` | Dimensionality: 3 for 3D volumes |
| `-a` | Anatomical input image (the subject T1) |
| `-e` | Brain template (population-averaged reference brain) |
| `-m` | Template probability mask (defines where brain tissue is in the template) |
| `-o` | Output prefix -- all output files will start with this string |

### FSL BET (Simpler Alternative)

```bash
bet "$input_dir/${subj}_struct.nii.gz" \
    "$output_dir/${subj}_brain" \
    -f 0.3 -g 0 -R
```

**Flag reference:**

| Flag | Description |
|------|-------------|
| `-f` | Fractional intensity threshold (0-1). Lower values = more liberal (include more tissue). Default: 0.5. Try 0.2-0.4 for T1 images. |
| `-g` | Vertical gradient. Positive values shift the brain center estimate downward. Usually 0. |
| `-R` | Robust brain center estimation (runs multiple iterations). Recommended. |

### Batch Processing with Parallelization

ANTs brain extraction is computationally intensive, typically requiring **2-3 GB of RAM per subject** and running for **30-60 minutes** per subject. You can parallelize across subjects, but be mindful of memory limits.

```bash
#!/bin/bash
# batch_skullstrip.sh - ANTs brain extraction for all subjects
#
# Usage: bash batch_skullstrip.sh

base_dir="/path/to/project"
input_dir="$base_dir/nifti"
output_dir="$base_dir/derivatives/skullstrip"
template_dir="/path/to/templates/NKI"

template="$template_dir/T_template0.nii.gz"
template_mask="$template_dir/T_template0_BrainCerebellumProbabilityMask.nii.gz"

# Calculate maximum parallel jobs based on available memory
total_mem_gb=$(free -g 2>/dev/null | awk '/Mem:/{print $2}' || sysctl -n hw.memsize 2>/dev/null | awk '{printf "%d", $1/1073741824}')
mem_per_job=3  # GB per ANTs brain extraction job
max_jobs=$(( total_mem_gb / mem_per_job ))
echo "System memory: ${total_mem_gb} GB | Max parallel jobs: ${max_jobs}"

for subj_dir in "$input_dir"/sub-*; do
    subj=$(basename "$subj_dir")
    input_file="$subj_dir/struct/${subj}_struct.nii.gz"
    out_prefix="$output_dir/$subj/${subj}_"

    # Skip if already processed
    if [ -f "${out_prefix}BrainExtractionBrain.nii.gz" ]; then
        echo "Skipping $subj (already processed)"
        continue
    fi

    # Skip if input missing
    if [ ! -f "$input_file" ]; then
        echo "WARNING: No structural image for $subj"
        continue
    fi

    mkdir -p "$output_dir/$subj"

    echo "Starting skull stripping: $subj"
    antsBrainExtraction.sh \
        -d 3 \
        -a "$input_file" \
        -e "$template" \
        -m "$template_mask" \
        -o "$out_prefix" &

    # Limit parallel jobs
    while [ "$(jobs -r | wc -l)" -ge "$max_jobs" ]; do
        sleep 30
    done
done

# Wait for all background jobs to finish
wait
echo "All skull stripping jobs complete."
```

### Running Long Jobs with nohup

Since skull stripping can take hours for a full dataset, use `nohup` to keep the process running after you disconnect:

```bash
nohup bash batch_skullstrip.sh > skullstrip.log 2>&1 &

# Monitor progress
tail -f skullstrip.log
```

## Expected Output

For each subject, ANTs produces:

```
$output_dir/
  sub-001/
    sub-001_BrainExtractionBrain.nii.gz       # Skull-stripped brain volume
    sub-001_BrainExtractionMask.nii.gz         # Binary brain mask (1=brain, 0=non-brain)
    sub-001_BrainExtractionPrior0GenericAffine.mat  # Affine transformation matrix
```

| File | Description |
|------|-------------|
| `BrainExtractionBrain.nii.gz` | The T1 image with all non-brain tissue set to zero |
| `BrainExtractionMask.nii.gz` | A binary mask indicating which voxels are brain (useful for applying to other images) |
| `BrainExtractionPrior0GenericAffine.mat` | The affine transformation used to align the template to the subject |

## Quality Check

Visual inspection is the gold standard for evaluating skull stripping quality.

### Using FSLeyes

```bash
# Open the original T1 with the extracted brain overlaid
fsleyes "$input_dir/${subj}_struct.nii.gz" \
        "$output_dir/${subj}_BrainExtractionBrain.nii.gz" -cm red-yellow -a 50 &
```

Alternatively, overlay the binary mask on the original T1:

```bash
fsleyes "$input_dir/${subj}_struct.nii.gz" \
        "$output_dir/${subj}_BrainExtractionMask.nii.gz" -cm blue-lightblue -a 40 &
```

### What to Look For

**Good extraction:**
- Brain boundary closely follows the cortical surface
- Cerebellum and brainstem are fully included
- No skull, scalp, or eye tissue remains
- No brain tissue has been removed (especially at the cortical surface and temporal poles)

**Signs of over-stripping (too aggressive):**
- Missing cortical gray matter, especially at the temporal poles and orbitofrontal cortex
- Cerebellum partially cut off
- Brainstem truncated

**Signs of under-stripping (too conservative):**
- Skull fragments visible around the brain
- Bright dura/meninges retained
- Eye globes or optic nerves still present
- Neck tissue visible below the brainstem

### Quick Batch QC

Generate PNG snapshots for rapid review across all subjects:

```bash
for subj_dir in "$output_dir"/sub-*; do
    subj=$(basename "$subj_dir")
    slicer "$subj_dir/${subj}_BrainExtractionBrain.nii.gz" \
           -a "$subj_dir/${subj}_skullstrip_qc.png"
done
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Over-stripping** (brain tissue removed) | Template mismatch or unusual subject anatomy | Try a different template; adjust BET `-f` threshold lower (e.g., 0.2) |
| **Under-stripping** (skull remains) | Template too different from subject; low tissue contrast | Try a different template; for BET, increase `-f` (e.g., 0.5) |
| **Wrong template for population** | Using adult template for pediatric data or vice versa | Select age-appropriate template (see Template Selection above) |
| **ANTs crashes with memory error** | Too many parallel jobs | Reduce `max_jobs`; ensure at least 3 GB RAM per job |
| **Very slow processing** | ANTs nonlinear registration is inherently slow | Expected: 30-60 min per subject. Use parallelization. |
| **Asymmetric extraction** | Strong bias field in the T1 | Run N4 bias field correction (`N4BiasFieldCorrection`) before skull stripping |

## References

- Avants, B. B., Tustison, N. J., Song, G., Cook, P. A., Klein, A., & Gee, J. C. (2011). A reproducible evaluation of ANTs similarity metric performance in brain image registration. *NeuroImage*, 54(3), 2033-2044. https://doi.org/10.1016/j.neuroimage.2010.09.025
- ANTs GitHub repository: https://github.com/ANTsX/ANTs
- ANTs brain templates: https://figshare.com/articles/dataset/ANTs_ANTsR_Brain_Templates/915436
- Smith, S. M. (2002). Fast robust automated brain extraction. *Human Brain Mapping*, 17(3), 143-155. https://doi.org/10.1002/hbm.10062

## Next Step

Proceed to **[Step 3: B0 Concatenation](./b0-concatenation)** to prepare the fieldmap data for susceptibility distortion correction.
