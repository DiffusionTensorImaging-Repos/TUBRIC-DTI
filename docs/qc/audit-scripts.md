---
sidebar_position: 4
title: "Pipeline Verification Scripts"
---

# Pipeline Verification Scripts

After each preprocessing step, a quick check that the expected output files exist and are not empty catches failed jobs before they cause problems downstream.

## Basic Pattern

Every verification check follows the same logic — loop through subjects, check that the expected files exist with nonzero size:

```bash
#!/bin/bash
# verify_stage.sh — Check that output files exist for each subject

output_dir="/path/to/output"
expected_suffixes=(
    "_output1.nii.gz"
    "_output2.nii.gz"
)

for subj_dir in "$output_dir"/sub-*; do
    [ -d "$subj_dir" ] || continue
    subj=$(basename "$subj_dir")
    ok=true

    for suffix in "${expected_suffixes[@]}"; do
        [ -s "$subj_dir/${subj}${suffix}" ] || { ok=false; break; }
    done

    echo "$subj: $( [ "$ok" = true ] && echo PASS || echo FAIL )"
done
```

The `-s` flag checks that the file exists **and** has nonzero size — a zero-byte `.nii.gz` means the step failed mid-write.

## Expected Output Files by Stage

Adapt the script above by swapping in the correct directory and suffixes for each stage:

| Stage | Directory | Key Output Files |
|-------|-----------|-----------------|
| Skull Stripping | `ants/` | `_BrainExtractionBrain.nii.gz`, `_BrainExtractionMask.nii.gz` |
| TOPUP | `topup/` | `_topup_corrected_b0.nii.gz`, `_topup_fieldcoef.nii.gz` |
| Brain Masking | `topup/` | `_topup_Tmean_brain_mask.nii.gz` |
| Eddy | `eddy/` | `_eddy.nii.gz`, `_eddy.eddy_rotated_bvecs` |
| Shell Extraction | `shells/` | `_data_b1000.nii.gz`, `_data_b1000.bvec`, `_data_b1000.bval` |
| DTIFIT | `dtifit/` | `_DTI_FA.nii.gz`, `_DTI_MD.nii.gz` |
| Registration | `flirt/` | `_diff2str.mat`, `_str2standard.mat`, `_FA_in_MNI.nii.gz` |

Run these checks immediately after each batch finishes a stage — not after the entire pipeline is done.
