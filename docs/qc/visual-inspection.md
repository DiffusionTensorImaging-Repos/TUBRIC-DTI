---
sidebar_position: 2
title: "Visual Inspection"
---

# Visual QC with FSLeyes

:::info Coming Soon
This page is under active development, including example screenshots of good and problematic results.
:::

## Overview

Visual inspection is irreplaceable in DTI preprocessing. Automated metrics can flag potential issues, but a trained eye is needed to make final judgments about data quality. FSLeyes is FSL's image viewer and the standard tool for visual QC.

## Launching FSLeyes

```bash
fsleyes &
```

Use the `-XY` flag when connecting via SSH to enable X11 forwarding:
```bash
ssh -XY user@host
```

## What to Inspect at Each Stage

### Skull Stripping (Step 2)

Load the original T1 and overlay the brain extraction:
```bash
fsleyes "$nifti_dir/${subj}_struct.nii" \
        "$ants_dir/${subj}_BrainExtractionBrain.nii.gz" -cm blue-lightblue -a 50 &
```

**Good**: brain tissue fully preserved, skull and scalp cleanly removed
**Bad**: brain tissue cut away (over-stripping) or skull remaining (under-stripping)

### EDDY Corrected Data (Step 8)

Load the 4D eddy-corrected data and scroll through volumes:
```bash
fsleyes "$eddy_dir/${subj}_eddy.nii.gz" &
```

**Look for**: signal dropout (dark slices), extreme brightness, residual geometric distortion, volume-to-volume jumps

### FA Maps (Step 11)

Load the FA map:
```bash
fsleyes "$dtifit_dir/${subj}_DTI_FA.nii.gz" -cm hot &
```

**Good**: white matter tracts clearly visible as bright regions, CSF dark, gray matter intermediate
**Bad**: uniform brightness (mask issue), streaks or rings (artifact), very low FA everywhere (processing error)

### Registration (Step 12)

Overlay the warped FA on the MNI template:
```bash
fsleyes "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
        "$output_dir/${subj}_FA_in_MNI" -cm red-yellow -a 50 &
```

**Good**: FA map aligns well with template anatomy
**Bad**: obvious misalignment, brain shifted or rotated
