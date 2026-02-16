---
sidebar_position: 1
title: "Quality Control Overview"
---

# Quality Control

Quality control in DTI preprocessing comes down to two things: making sure each step actually ran, and checking the two stages where problems are most likely to need manual judgment — **skull stripping** and **eddy correction**.

## What to Check

After each preprocessing step, verify that the expected output files exist and are not empty. For most stages, that is all you need to do — if the files are there and the step did not error out, the output is almost certainly fine.

The two exceptions are:

- **Skull stripping (Step 2)** — Open the result in FSLeyes and confirm the brain is fully preserved with the skull removed. A bad skull strip will silently degrade everything downstream.
- **Eddy correction (Step 8)** — Run `eddy_quad` to get motion and outlier metrics. This is where you decide if a subject has too much motion to include. See [Eddy QC](./eddy-qc) for details.

Beyond those two, glancing at the FA maps from DTIFIT (Step 11) is a good final sanity check — white matter tracts should be bright and there should be no obvious artifacts.

## Verification Scripts

A simple bash script that checks whether output files exist and are nonzero for each subject can save a lot of time. See [Pipeline Verification Scripts](./audit-scripts) for a template.

## Excluding Subjects

Subjects with excessive motion should be excluded based on `eddy_quad` metrics. See [Exclusion Criteria](./exclusion-criteria) for the standard thresholds.

## Detailed Guides

- **[Visual Inspection](./visual-inspection)** — What to look for in FSLeyes at skull stripping and eddy stages
- **[Eddy QC](./eddy-qc)** — Running `eddy_quad` and `eddy_squad`
- **[Pipeline Verification Scripts](./audit-scripts)** — File existence checks for each stage
- **[Exclusion Criteria](./exclusion-criteria)** — Motion thresholds for excluding subjects
