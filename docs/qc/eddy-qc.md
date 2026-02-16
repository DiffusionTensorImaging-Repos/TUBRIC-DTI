---
sidebar_position: 3
title: "EDDY QC (eddy_quad & eddy_squad)"
---

# EDDY Quality Control

EDDY is the step where most data quality problems become visible — motion, signal dropout, and slice-level artifacts. FSL provides two dedicated QC tools that generate detailed reports: `eddy_quad` for individual subjects and `eddy_squad` for group-level summaries. These tools should be run routinely after every eddy correction.

## Per-Subject QC: eddy_quad

`eddy_quad` reads the eddy output files and generates an HTML report with plots and statistics for a single subject.

### Running eddy_quad

```bash
# ──────────────────────────────────────────────
# Define paths
# ──────────────────────────────────────────────
eddy_dir="$base_dir/eddy/$subj"
config_dir="$base_dir/config"
mask_dir="$base_dir/topup/$subj"
nifti_dir="$base_dir/nifti/$subj/dti"

# ──────────────────────────────────────────────
# Run eddy_quad
# ──────────────────────────────────────────────
eddy_quad "$eddy_dir/${subj}_eddy" \
    -idx "$config_dir/index.txt" \
    -par "$config_dir/acqp.txt" \
    -m "$mask_dir/${subj}_topup_Tmean_brain_mask.nii.gz" \
    -b "$nifti_dir/${subj}_dti.bval" \
    -v
```

The `-v` flag enables verbose output. The first argument is the **eddy output prefix** (without the `.nii.gz` extension) — the same prefix you passed to eddy's `--out` flag.

### Output

`eddy_quad` creates a directory called `<prefix>.qc/` containing:

```
sub-001_eddy.qc/
  qc.json              # All metrics in machine-readable format
  qc.pdf               # Full QC report with plots
  vols_no_outliers.txt # List of volumes without outlier slices
  avg_b0.png           # Average b=0 image
  avg_b1000.png        # Average image per shell
  ...
```

### Key Metrics Explained

| Metric | What It Means | Typical Range | Concern Threshold |
|--------|--------------|---------------|-------------------|
| **Average absolute motion** | How far the brain moved from its position in the first volume, averaged across all volumes | 0.2 – 1.0 mm | > 2 mm |
| **Average relative motion** | Average volume-to-volume displacement — captures sudden jerks | 0.1 – 0.5 mm | > 1 mm |
| **Max relative motion** | Largest single between-volume displacement | 0.2 – 2.0 mm | > 3 mm |
| **Outlier slices (%)** | Percentage of all slices flagged as outliers by `--repol` | 0 – 5% | > 10% |
| **CNR (per shell)** | Contrast-to-noise ratio — how much diffusion signal stands out above noise | Varies by shell | Very low compared to group |

:::tip Understanding Motion Metrics
**Absolute motion** tells you the total displacement — useful for deciding if a subject's data is salvageable. **Relative motion** tells you about sudden movements — these cause the most damage because they create slice-level artifacts that `--repol` must replace. A subject with low absolute motion but spikes of high relative motion may have more problems than one with steady low-level drift.
:::

### Reading the QC Report

The `qc.pdf` report contains several sections:

1. **Motion plots**: Translation (x, y, z) and rotation (pitch, roll, yaw) across volumes. Look for sudden spikes — these correspond to head jerks during the scan.

2. **Outlier maps**: A 2D matrix showing which slices in which volumes were flagged as outliers. Scattered outliers are normal; clustered outliers (many consecutive volumes with outlier slices) suggest a period of severe motion.

3. **CNR maps**: Per-shell CNR images. These should look roughly uniform across the brain. Focal dark spots indicate regions with poor signal.

4. **Average images per shell**: These should look clean without obvious artifacts.

## Batch Processing eddy_quad

```bash
#!/bin/bash
# run_eddy_quad.sh — Generate QC reports for all subjects

base_dir="/path/to/project"
config_dir="$base_dir/config"

for subj_dir in "$base_dir"/eddy/sub-*; do
    subj=$(basename "$subj_dir")
    echo "Running eddy_quad for: $subj"

    eddy_prefix="$subj_dir/${subj}_eddy"

    # Skip if QC already exists
    if [ -d "${eddy_prefix}.qc" ]; then
        echo "  QC already exists — skipping"
        continue
    fi

    eddy_quad "$eddy_prefix" \
        -idx "$config_dir/index.txt" \
        -par "$config_dir/acqp.txt" \
        -m "$base_dir/topup/$subj/${subj}_topup_Tmean_brain_mask.nii.gz" \
        -b "$base_dir/nifti/$subj/dti/${subj}_dti.bval" \
        -v

    echo "  Done: $subj"
done
```

## Group-Level QC: eddy_squad

After running `eddy_quad` for all subjects, `eddy_squad` produces a group-level summary that makes it easy to spot outlier subjects.

### Running eddy_squad

```bash
# ──────────────────────────────────────────────
# Create a text file listing all eddy_quad output directories
# ──────────────────────────────────────────────
ls -d "$base_dir"/eddy/sub-*/*_eddy.qc > squad_list.txt

# ──────────────────────────────────────────────
# Run eddy_squad
# ──────────────────────────────────────────────
eddy_squad squad_list.txt -o "$base_dir/qc/eddy_squad_report"
```

### What eddy_squad Produces

The output directory contains:

- **group_qc.pdf**: Summary report with scatter plots of motion, outlier percentages, and CNR for all subjects
- **group_db.json**: All metrics for all subjects in a single JSON file

The scatter plots show each subject as a point. Subjects that fall far from the cluster are potential outliers — inspect them more closely in FSLeyes.

### Building a QC Summary Table

Extract key metrics from the individual JSON files into a spreadsheet:

```bash
#!/bin/bash
# extract_eddy_metrics.sh — Pull key QC metrics into a CSV

echo "subject,abs_motion_mm,rel_motion_mm,outlier_pct" > eddy_qc_summary.csv

for qc_dir in "$base_dir"/eddy/sub-*/*_eddy.qc; do
    subj=$(basename "$(dirname "$qc_dir")")
    json="$qc_dir/qc.json"

    if [ ! -f "$json" ]; then
        echo "$subj,NA,NA,NA" >> eddy_qc_summary.csv
        continue
    fi

    # Extract metrics using Python (jq also works)
    python3 -c "
import json, sys
with open('$json') as f:
    d = json.load(f)
abs_mot = d.get('qc_mot_abs', 'NA')
rel_mot = d.get('qc_mot_rel', 'NA')
outlier = d.get('qc_outliers_pe', ['NA'])[0] if isinstance(d.get('qc_outliers_pe'), list) else d.get('qc_outliers_pe', 'NA')
print(f'$subj,{abs_mot},{rel_mot},{outlier}')
" >> eddy_qc_summary.csv
done

echo "Saved to eddy_qc_summary.csv"
```

:::caution JSON Field Names May Vary
The exact field names in `qc.json` depend on your FSL version. Check `qc.json` for one subject to confirm the field names before writing extraction scripts. Common fields include `qc_mot_abs`, `qc_mot_rel`, `qc_outliers_tot`, and `qc_cnr_avg`.
:::

## Interpreting Results: When to Worry

| Scenario | Action |
|----------|--------|
| Absolute motion 0.3–1.0 mm, few outlier slices | Normal — include |
| Absolute motion 1.0–2.0 mm, < 5% outlier slices | Borderline — include but note in tracking sheet |
| Absolute motion > 2.0 mm | Likely exclude — inspect FA maps carefully |
| > 10% outlier slices | Likely exclude — too much data was replaced by `--repol` |
| Single large motion spike but otherwise clean | May be ok — check the FA map for artifacts near the spike |
| Very low CNR compared to group | Check for scanner issues, wrong protocol, or severe motion |

These thresholds are guidelines. See [Exclusion Criteria](./exclusion-criteria) for detailed discussion of threshold selection and population-specific considerations.

## References

- Bastiani M, Cottaar M, Fitzgibbon SP, et al. (2019). Automated quality control for within and between studies diffusion MRI data using a non-parametric framework for movement and distortion correction. *NeuroImage*, 184, 801-812.
- Andersson JLR, Sotiropoulos SN (2016). An integrated approach to correction for off-resonance effects and subject movement in diffusion MR imaging. *NeuroImage*, 125, 1063-1078.
- FSL eddy_quad documentation: [https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddyqc/UsersGuide](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddyqc/UsersGuide)
