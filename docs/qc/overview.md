---
sidebar_position: 1
title: "Quality Control Overview"
---

# Quality Control in DTI Preprocessing

Quality control is not an optional step you do at the end — it is woven into every stage of preprocessing. A single subject with severe motion or a failed skull strip can quietly distort your group statistics. Catching problems early saves weeks of troubleshooting later.

## How to Think About QC

Every preprocessing step produces outputs that can go wrong in predictable ways. Your job at each stage is to answer three questions:

1. **Did it finish?** Check that the expected output files exist and are not empty or corrupted.
2. **Does it look right?** Open the images in FSLeyes and verify they match what you expect.
3. **Are the numbers reasonable?** Compare quantitative metrics against known ranges and across your sample.

Most problems fall into one of these categories:

- **Missing data** — a job crashed, a file path was wrong, or input was missing
- **Artifacts** — motion, susceptibility distortion, Gibbs ringing, or signal dropout survived preprocessing
- **Parameter errors** — wrong b-values, mismatched phase encoding, incorrect mask

## QC at Each Pipeline Stage

The table below summarizes what to check after each step. Detailed guidance for each check is in the linked pages.

| Stage | What to Check | Method |
|-------|--------------|--------|
| [1. DICOM to NIfTI](../pipeline/dicom-to-nifti) | All expected files created, .bval/.bvec present | File audit |
| [2. Skull Stripping](../pipeline/skull-stripping) | Brain fully preserved, no skull remaining | Visual overlay |
| [3. B0 Concatenation](../pipeline/b0-concatenation) | Correct number of B0 volumes, both PE directions | Volume count |
| [4. TOPUP](../pipeline/topup) | Frontal/temporal distortions reduced | Visual comparison |
| [5. Mean B0](../pipeline/mean-b0) | Output is 3D (not 4D), reasonable contrast | `fslinfo` + visual |
| [6. Brain Masking](../pipeline/brain-masking) | Mask covers brain, excludes skull | Visual overlay |
| [7. Denoising](../pipeline/denoising-gibbs) | Noise reduced, edges preserved, smooth noise map | Visual comparison |
| [8. Eddy](../pipeline/eddy) | Motion < 2 mm, few outlier slices, no residual artifacts | `eddy_quad` + visual |
| [9. BedpostX](../pipeline/bedpostx) | Output directory exists, dyads files present | File audit |
| [10. Shell Extraction](../pipeline/shell-extraction) | Correct volume count, correct b-values | `fslnvols` + `cat .bval` |
| [11. DTIFIT](../pipeline/dtifit) | FA in 0–1 range, tracts visible, no artifacts | Visual + `fslstats` |
| [12. Registration](../pipeline/flirt-registration) | Good alignment in standard space | Visual overlay |
| [13. ICV](../pipeline/icv-calculation) | Volume within normal range (1200–1800 cm^3) | `fslstats` |
| [14. BIDS Setup](../pipeline/pyafq-bids) | BIDS-compliant structure, validator passes | `bids-validator` |

## Automated Checks vs. Visual Inspection

**Automated checks** (file audits, volume counts, metric thresholds) are efficient and reproducible. They should be your first line of defense — run them immediately after every batch of subjects finishes processing.

**Visual inspection** is irreplaceable for certain steps. No script can reliably judge whether a skull strip looks right or whether an FA map has subtle artifacts. Plan to visually inspect at least these critical stages:

- Skull stripping (Step 2)
- TOPUP distortion correction (Step 4)
- Eddy-corrected volumes (Step 8)
- FA and MD maps (Step 11)
- Registration to standard space (Step 12)

For large studies (50+ subjects), you may not be able to visually inspect every subject at every stage. Prioritize visual QC at the stages above, and use automated metrics to flag subjects that need closer inspection.

## Tracking QC Results

Maintain a spreadsheet or CSV that records QC outcomes for every subject:

| Column | Example |
|--------|---------|
| Subject ID | sub-001 |
| Skull strip QC | Pass |
| TOPUP QC | Pass |
| Eddy mean motion (mm) | 0.83 |
| Eddy outlier slices (%) | 2.1 |
| FA range check | Pass |
| Registration QC | Pass |
| Notes | Slight frontal signal dropout in vol 42 |
| Final decision | Include |

This tracking file becomes part of your analysis documentation. When you write your methods section, you can report exactly how many subjects were excluded and why.

:::tip Start QC Tracking on Day One
Create your QC spreadsheet before you start processing — not after. Add rows as subjects are processed and update them at each stage. This prevents the common situation where you process 100 subjects, realize 10 have problems, and cannot remember which steps you already checked.
:::

## When Something Looks Wrong

If a subject fails QC at any stage:

1. **Check the inputs** — is the problem in this step, or was a bad input passed forward from an earlier step?
2. **Check the parameters** — did you use the right configuration files, masks, and settings?
3. **Try adjusting parameters** — some steps (like skull stripping) can be re-run with different settings
4. **Decide: fix or exclude** — if the problem cannot be fixed, exclude the subject and document why

See [Failure Recovery](../advanced/failure-recovery) for stage-by-stage troubleshooting and [Exclusion Criteria](./exclusion-criteria) for guidance on when to exclude a subject.

## Detailed QC Guides

- **[Visual Inspection](./visual-inspection)** — FSLeyes commands and what to look for at each stage
- **[Eddy QC](./eddy-qc)** — Using `eddy_quad` and `eddy_squad` for motion and artifact assessment
- **[Pipeline Verification Scripts](./audit-scripts)** — Automated scripts to check that all files were created
- **[Exclusion Criteria](./exclusion-criteria)** — Thresholds for deciding when to exclude a subject
