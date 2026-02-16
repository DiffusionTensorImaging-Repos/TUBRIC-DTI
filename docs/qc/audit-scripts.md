---
sidebar_position: 4
title: "Audit Scripts"
---

# Automated Audit Scripts

:::info Coming Soon
This page is under active development. Complete audit script templates for every pipeline stage are being added.
:::

## Overview

After each preprocessing step, run an audit script to verify that all expected output files were created successfully. This catches failed jobs, partial outputs, and file system errors before they propagate through the pipeline.

## Generic Audit Pattern

```bash
#!/bin/bash
# Generic audit template for any pipeline stage

base_dir="/path/to/output"
expected_files=("file1.nii.gz" "file2.nii.gz" "file3.mat")

echo "=== Audit: Stage Name ==="
printf "%-12s | %-10s\n" "Subject" "Status"
printf -- "-------------+-----------\n"

complete=0
incomplete=0

for subj_dir in "$base_dir"/*/; do
    subj_id=$(basename "$subj_dir")
    all_present=true

    for f in "${expected_files[@]}"; do
        if [ ! -f "$subj_dir/${subj_id}_${f}" ]; then
            all_present=false
            break
        fi
    done

    if [ "$all_present" = true ]; then
        printf "%-12s | PASS\n" "$subj_id"
        ((complete++))
    else
        printf "%-12s | FAIL\n" "$subj_id"
        ((incomplete++))
    fi
done

echo ""
echo "Summary: $complete complete, $incomplete incomplete"
```

## Audit Scripts by Stage

Each pipeline stage has specific expected outputs. Adapt the pattern above by changing the `expected_files` array:

| Stage | Expected Files |
|-------|---------------|
| DICOM to NIfTI | `_struct.nii`, `_dwi.nii.gz`, `_fmapAP.nii`, `_fmapPA.nii` |
| Skull Stripping | `_BrainExtractionBrain.nii.gz`, `_BrainExtractionMask.nii.gz` |
| TOPUP | `_topup_corrected_b0.nii.gz`, `_topup_fieldmap.nii.gz` |
| EDDY | `_eddy.nii.gz`, `_eddy.eddy_rotated_bvecs` |
| DTIFIT | `_DTI_FA.nii.gz`, `_DTI_MD.nii.gz`, `_DTI_L1.nii.gz` |
| FLIRT | `_diff2str.mat`, `_str2standard.mat`, `_diff2standard.mat` |

## Best Practices

- Run audits **immediately** after each stage before proceeding
- Log results to a file for reference
- Re-run failed subjects before moving to the next stage
- Track audit results in your data tracking spreadsheet
