---
sidebar_position: 15
title: "Step 14: BIDS Conversion & pyAFQ"
---

# Step 14: BIDS Conversion and Automated Fiber Quantification

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

The final preprocessing step organizes all outputs into the **Brain Imaging Data Structure (BIDS)** format and prepares data for **pyAFQ** (Automated Fiber Quantification). BIDS provides a standardized directory structure that ensures compatibility with a wide ecosystem of analysis tools.

## BIDS Directory Structure

pyAFQ expects data organized as:

```
derivatives/
  sub-001/
    dwi/
      sub-001_dwi.nii.gz           # Eddy-corrected DWI
      sub-001_dwi.bval             # B-values
      sub-001_dwi.bvec             # Rotated b-vectors (from eddy)
      sub-001_dwi_desc-brain_mask.nii.gz  # Brain mask
    anat/
      sub-001_T1w.nii.gz           # Original T1 structural
      sub-001_desc-brain_T1w.nii.gz    # Brain-extracted T1
      sub-001_desc-brain_mask.nii.gz   # T1 brain mask
```

## Organizing Data

```bash
# Create BIDS directory structure
bids_dir="$project_dir/derivatives"
subj_bids="sub-${subj}"
mkdir -p "$bids_dir/${subj_bids}/dwi" "$bids_dir/${subj_bids}/anat"

# Copy DWI data
cp "$eddy_dir/${subj}_eddy.nii.gz" \
   "$bids_dir/${subj_bids}/dwi/${subj_bids}_dwi.nii.gz"
cp "$eddy_dir/${subj}_eddy.eddy_rotated_bvecs" \
   "$bids_dir/${subj_bids}/dwi/${subj_bids}_dwi.bvec"
cp "$input_dir/${subj}_dwi.bval" \
   "$bids_dir/${subj_bids}/dwi/${subj_bids}_dwi.bval"
cp "$mask_dir/${subj}_brain_mask.nii.gz" \
   "$bids_dir/${subj_bids}/dwi/${subj_bids}_dwi_desc-brain_mask.nii.gz"

# Copy anatomical data
cp "$nifti_dir/${subj}_struct.nii" \
   "$bids_dir/${subj_bids}/anat/${subj_bids}_T1w.nii"
cp "$ants_dir/${subj}_BrainExtractionBrain.nii.gz" \
   "$bids_dir/${subj_bids}/anat/${subj_bids}_desc-brain_T1w.nii.gz"
cp "$ants_dir/${subj}_BrainExtractionMask.nii.gz" \
   "$bids_dir/${subj_bids}/anat/${subj_bids}_desc-brain_mask.nii.gz"
```

## Running pyAFQ

```python
import AFQ.api.bundle_dict as abd
from AFQ.api.participant import ParticipantAFQ

myafq = ParticipantAFQ(
    bids_path="path/to/derivatives",
    participant_id="sub-001",
)
myafq.export_all()
```

Or using the configuration file:
```bash
pyafq path/to/afq_config.toml
```

See [Configuration Files](/docs/reference/config-files) for details on `afq_config.toml`.

## What pyAFQ Produces

- Tract profiles: FA, MD, RD, AD sampled along 24 major white matter bundles
- Tractography results: streamlines for each bundle
- Interactive visualizations via AFQ-Browser

## References

- Yeatman JD, et al. (2012). Tract profiles of white matter properties. *PLoS One*, 7(11), e49790.
- Kruper J, et al. (2021). Evaluating the reliability of human brain white matter tractometry. *Aperture Neuro*.
- BIDS Specification: [https://bids-specification.readthedocs.io/](https://bids-specification.readthedocs.io/)
