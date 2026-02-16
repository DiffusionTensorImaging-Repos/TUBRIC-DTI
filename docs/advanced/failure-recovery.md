---
sidebar_position: 1
title: "Failure Recovery"
---

# Pipeline Failure Recovery

:::info Coming Soon
This page is under active development. Complete recovery procedures for every pipeline stage are being added.
:::

## Overview

In any large-scale preprocessing effort, some subjects will fail at various stages. This guide covers how to diagnose failures and re-run individual subjects without reprocessing the entire dataset.

## General Recovery Strategy

1. **Identify** which subjects failed using audit scripts
2. **Diagnose** why they failed (check log files, examine inputs)
3. **Fix** the underlying issue (missing file, parameter error, resource limit)
4. **Re-run** only the failed subjects from the failed stage onward
5. **Re-audit** to confirm successful completion

## Common Failure Modes

### Out of Memory
```bash
# Check if a job was killed by the OOM killer
dmesg | grep -i "killed process"
```
**Fix**: reduce parallelization (`max_jobs`) or increase memory allocation

### SSH Disconnection
Long-running jobs are lost when SSH disconnects.
**Prevention**: always use `nohup` or `screen`/`tmux`
```bash
nohup ./my_script.sh > output.log 2>&1 &
```

### Corrupted Input Files
A step fails because its input (from a previous step) is corrupted or incomplete.
**Fix**: go back to the previous step, re-run for that subject, then re-run the failed step

### Wrong Configuration Files
TOPUP or EDDY fails because `acqp.txt` or `index.txt` doesn't match the data.
**Fix**: verify phase encoding direction and readout time against JSON sidecars

## Re-Running Individual Subjects

Extract the processing command for a single subject and run it manually:

```bash
# Example: re-run EDDY for one subject
eddy \
  --imain="$input_dir/${subj}_dwi_denoised_degibbs.nii.gz" \
  --mask="$mask_dir/${subj}_brain_mask.nii.gz" \
  --acqp="$config_dir/acqp.txt" \
  --index="$config_dir/index.txt" \
  --bvecs="$input_dir/${subj}_dwi.bvec" \
  --bvals="$input_dir/${subj}_dwi.bval" \
  --topup="$topup_dir/${subj}_topup" \
  --out="$output_dir/${subj}_eddy" \
  --repol --verbose
```

## Tips

- Keep all log files — they are essential for diagnosing failures
- After re-running, always re-audit from the failed step through all subsequent steps
- If a subject consistently fails, consider excluding it rather than forcing it through
