---
sidebar_position: 4
title: "Pipeline Verification Scripts"
---

# Pipeline Verification Scripts

After each preprocessing step, run a verification script to confirm that all expected output files were created and are not empty. This catches failed jobs, partial outputs, and file system errors before they propagate through the pipeline and cause mysterious failures in later stages.

## The General Pattern

Every verification script follows the same logic:

1. Define the expected output files for a given stage
2. Loop through all subjects
3. Check that each expected file exists and has nonzero size
4. Print a pass/fail summary

```bash
#!/bin/bash
# verify_stage.sh — Template for verifying pipeline output

stage_name="Stage Name"
output_dir="/path/to/output"

# List the expected output file suffixes for this stage
# (these get combined with the subject ID)
expected_suffixes=(
    "_output1.nii.gz"
    "_output2.nii.gz"
    "_output3.mat"
)

echo "=== Verifying: $stage_name ==="
printf "%-15s | %-8s | %s\n" "Subject" "Status" "Details"
printf -- "----------------+----------+------------------\n"

pass=0
fail=0

for subj_dir in "$output_dir"/sub-*; do
    [ -d "$subj_dir" ] || continue
    subj=$(basename "$subj_dir")
    missing=""

    for suffix in "${expected_suffixes[@]}"; do
        filepath="$subj_dir/${subj}${suffix}"
        if [ ! -s "$filepath" ]; then
            missing+=" $(basename "$filepath")"
        fi
    done

    if [ -z "$missing" ]; then
        printf "%-15s | PASS     |\n" "$subj"
        ((pass++))
    else
        printf "%-15s | FAIL     | Missing:%s\n" "$subj" "$missing"
        ((fail++))
    fi
done

echo ""
echo "Results: $pass passed, $fail failed out of $((pass + fail)) subjects"
```

:::tip Check File Size, Not Just Existence
The `-s` flag in `[ ! -s "$filepath" ]` checks that the file exists **and** has nonzero size. A zero-byte `.nii.gz` file means the step started but failed mid-write — existence alone would miss this.
:::

## Stage-Specific Verification

Below are the expected output files for each pipeline stage. Copy the template above and replace the `output_dir` and `expected_suffixes` for each stage.

### Step 1: DICOM to NIfTI

```bash
output_dir="$base_dir/nifti"
# Check inside each subject's subdirectories
for subj_dir in "$output_dir"/sub-*; do
    subj=$(basename "$subj_dir")
    files_ok=true
    for f in \
        "$subj_dir/struct/${subj}_struct.nii" \
        "$subj_dir/dti/${subj}_dti.nii.gz" \
        "$subj_dir/dti/${subj}_dti.bval" \
        "$subj_dir/dti/${subj}_dti.bvec" \
        "$subj_dir/fmap/${subj}_fmapAP.nii" \
        "$subj_dir/fmap/${subj}_fmapPA.nii"; do
        [ -s "$f" ] || { files_ok=false; echo "  MISSING: $f"; }
    done
    echo "$subj: $( [ "$files_ok" = true ] && echo PASS || echo FAIL )"
done
```

### Step 2: Skull Stripping

```bash
expected_suffixes=(
    "_BrainExtractionBrain.nii.gz"
    "_BrainExtractionMask.nii.gz"
)
```

### Step 3–4: B0 Concatenation and TOPUP

```bash
# B0 concatenation
expected_suffixes=("_b0_pair.nii.gz")

# TOPUP
expected_suffixes=(
    "_topup_corrected_b0.nii.gz"
    "_topup_fieldcoef.nii.gz"
    "_topup_movpar.txt"
)
```

### Step 5–6: Mean B0 and Brain Masking

```bash
# Mean B0
expected_suffixes=("_Tmean_b0.nii.gz")

# Brain mask
expected_suffixes=(
    "_topup_Tmean_brain.nii.gz"
    "_topup_Tmean_brain_mask.nii.gz"
)
```

### Step 8: Eddy

```bash
expected_suffixes=(
    "_eddy.nii.gz"
    "_eddy.eddy_rotated_bvecs"
)
```

### Step 9: BedpostX

```bash
# BedpostX output lives in a .bedpostX directory
for subj_dir in "$base_dir"/bedpostx/sub-*; do
    subj=$(basename "$subj_dir")
    bpx="${subj_dir}.bedpostX"
    if [ -f "$bpx/dyads1.nii.gz" ] && [ -f "$bpx/mean_f1samples.nii.gz" ]; then
        echo "$subj: PASS"
    else
        echo "$subj: FAIL"
    fi
done
```

### Step 10: Shell Extraction

```bash
expected_suffixes=(
    "_data_b1000.nii.gz"
    "_data_b1000.bvec"
    "_data_b1000.bval"
)
```

### Step 11: DTIFIT

```bash
expected_suffixes=(
    "_DTI_FA.nii.gz"
    "_DTI_MD.nii.gz"
    "_DTI_L1.nii.gz"
    "_DTI_L2.nii.gz"
    "_DTI_L3.nii.gz"
    "_DTI_V1.nii.gz"
)
```

### Step 12: Registration (FLIRT)

```bash
expected_suffixes=(
    "_diff2str.mat"
    "_str2standard.mat"
    "_diff2standard.mat"
    "_FA_in_MNI.nii.gz"
)
```

## Full Pipeline Verification

Run all stage checks in sequence:

```bash
#!/bin/bash
# verify_all.sh — Check all pipeline stages for all subjects

base_dir="/path/to/project"

echo "============================================"
echo "  Full Pipeline Verification"
echo "============================================"

check_files() {
    local stage="$1"
    local dir="$2"
    shift 2
    local suffixes=("$@")
    local pass=0 fail=0

    for subj_dir in "$dir"/sub-*; do
        [ -d "$subj_dir" ] || continue
        subj=$(basename "$subj_dir")
        ok=true
        for s in "${suffixes[@]}"; do
            [ -s "$subj_dir/${subj}${s}" ] || { ok=false; break; }
        done
        [ "$ok" = true ] && ((pass++)) || ((fail++))
    done
    printf "%-25s | %3d pass | %3d fail\n" "$stage" "$pass" "$fail"
}

echo ""
printf "%-25s | %8s | %8s\n" "Stage" "Pass" "Fail"
printf -- "--------------------------+----------+---------\n"

check_files "Skull Stripping" \
    "$base_dir/ants" \
    "_BrainExtractionBrain.nii.gz" "_BrainExtractionMask.nii.gz"

check_files "TOPUP" \
    "$base_dir/topup" \
    "_topup_corrected_b0.nii.gz" "_topup_fieldcoef.nii.gz"

check_files "Brain Masking" \
    "$base_dir/topup" \
    "_topup_Tmean_brain_mask.nii.gz"

check_files "Eddy" \
    "$base_dir/eddy" \
    "_eddy.nii.gz" "_eddy.eddy_rotated_bvecs"

check_files "Shell Extraction" \
    "$base_dir/shells" \
    "_data_b1000.nii.gz" "_data_b1000.bvec" "_data_b1000.bval"

check_files "DTIFIT" \
    "$base_dir/dtifit" \
    "_DTI_FA.nii.gz" "_DTI_MD.nii.gz" "_DTI_L1.nii.gz"

check_files "Registration" \
    "$base_dir/flirt" \
    "_diff2str.mat" "_str2standard.mat" "_FA_in_MNI.nii.gz"

echo ""
echo "Verification complete."
```

## Integrating Verification Into Your Workflow

Run verification scripts immediately after each batch of subjects finishes a stage — not after the entire pipeline is done. This catches problems early:

```bash
# Example workflow
./process_eddy.sh          # Run eddy for all subjects
./verify_eddy.sh           # Immediately verify
# Fix any failures
./process_eddy.sh sub-003  # Re-run failed subject
./verify_eddy.sh           # Re-verify
# Then proceed to next stage
./process_shells.sh
```

Save verification output to log files for your records:

```bash
./verify_all.sh | tee "qc_verification_$(date +%Y%m%d).log"
```

## Beyond File Checks: Value Verification

File existence is necessary but not sufficient. For critical outputs, also verify the values make sense:

```bash
# Check that FA is in the valid range (0 to 1)
for fa in "$base_dir"/dtifit/sub-*/*_DTI_FA.nii.gz; do
    subj=$(basename "$(dirname "$fa")")
    range=$(fslstats "$fa" -R)
    echo "$subj: FA range = $range"
done

# Check that brain mask covers a reasonable volume
for mask in "$base_dir"/topup/sub-*/*_brain_mask.nii.gz; do
    subj=$(basename "$(dirname "$mask")")
    vol=$(fslstats "$mask" -V | awk '{print $2}')
    echo "$subj: Mask volume = $vol mm^3"
done
```

Extreme values (FA > 1.0, mask volume < 500,000 mm^3 or > 2,500,000 mm^3) should trigger manual inspection.
