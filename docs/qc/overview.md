---
sidebar_position: 1
title: "Quality Control Overview"
---

# Quality Control in DTI Preprocessing

Quality control (QC) is not an optional add-on — it is an integral part of every preprocessing step. A single subject with severe motion artifacts or failed skull stripping can distort group-level statistics and undermine entire analyses.

## QC Philosophy

Every preprocessing step should be audited for:
1. **Completeness**: did the expected output files get created?
2. **Correctness**: do the outputs look reasonable upon visual inspection?
3. **Consistency**: are the results consistent across subjects?

## The Three Levels of QC

### 1. Automated Audits
After each pipeline stage, run a script that checks for the existence and validity of all expected output files. These audits catch missing files, failed jobs, and obvious errors.

```bash
# Generic audit pattern
for subj in "$base_dir"/*/; do
  subj_id=$(basename "$subj")
  if [ -f "$output_dir/${subj_id}_expected_output.nii.gz" ]; then
    echo "$subj_id  | PASS"
  else
    echo "$subj_id  | FAIL"
  fi
done
```

### 2. Visual Inspection
Certain steps require visual QC in FSLeyes or another viewer:
- **Skull stripping** (Step 2): overlay brain extraction on original T1
- **EDDY correction** (Step 8): scroll through corrected volumes checking for artifacts
- **Tensor fitting** (Step 11): verify FA maps look reasonable (white matter bright, CSF dark)

### 3. Quantitative Metrics
Use automated tools to compute QC metrics:
- **eddy_quad**: per-subject motion, outlier counts, CNR
- **eddy_squad**: group-level summary statistics
- Data tracking spreadsheet: record QC outcomes per subject

## QC at Each Pipeline Stage

| Stage | QC Method | What to Check |
|-------|-----------|---------------|
| 1. DICOM to NIfTI | Automated audit | All expected files present |
| 2. Skull Stripping | Visual + audit | No over/under-stripping |
| 3. B0 Concatenation | Automated audit | Correct number of volumes |
| 4. TOPUP | Visual comparison | Distortions reduced |
| 5. Mean B0 | Automated audit | 3D output (not 4D) |
| 6. Brain Masking | Visual overlay | Mask covers brain, excludes skull |
| 7. Denoising | Visual comparison | Noise reduced without blurring |
| 8. EDDY | eddy_quad + visual | Motion < 2mm, outliers reasonable |
| 9. BedpostX | Automated audit | All output files present |
| 10. Shell Extraction | Volume count | Correct number of volumes |
| 11. DTIFIT | Visual + range check | FA 0-1, reasonable MD values |
| 12. Registration | Visual overlay | Good alignment in MNI space |
| 13. ICV | Range check | 1200-1800 cm^3 for adults |
| 14. BIDS | Automated audit | BIDS-compliant directory structure |

## Data Tracking

Maintain a spreadsheet or CSV tracking QC outcomes per subject. Include columns for:
- Subject ID
- Each pipeline stage (pass/fail)
- Motion parameters from EDDY
- Notes on any issues
- Final inclusion/exclusion decision

See [EDDY QC](./eddy-qc), [Visual Inspection](./visual-inspection), [Audit Scripts](./audit-scripts), and [Exclusion Criteria](./exclusion-criteria) for detailed guidance.
