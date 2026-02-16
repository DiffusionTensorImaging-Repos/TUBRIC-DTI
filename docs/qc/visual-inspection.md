---
sidebar_position: 2
title: "Visual Inspection"
---

# Visual Inspection with FSLeyes

Automated metrics can flag potential issues, but there is no substitute for looking at your data. A trained eye catches problems that no script can — subtle signal dropout, registration misalignment, or a skull strip that removed part of the temporal lobe. This page walks through what to inspect at each pipeline stage and how to do it in FSLeyes.

## Setting Up FSLeyes

### Local Machine

```bash
# Launch FSLeyes
fsleyes &
```

### Remote Server (via SSH)

FSLeyes needs X11 forwarding to display on your local screen:

```bash
# Connect with X11 forwarding enabled
ssh -XY user@server.edu

# On macOS, install XQuartz first (https://www.xquartz.org)
# Then enable "Allow connections from network clients" in XQuartz preferences

# Test that X11 is working
xclock &
# If a clock appears, FSLeyes will work too
```

:::tip Alternative: VNC or Remote Desktop
If X11 is too slow (common over high-latency connections), consider using VNC, NoMachine, or a similar remote desktop tool. FSLeyes runs much more smoothly when rendered locally on the server and streamed as video.
:::

## What to Inspect at Each Stage

### Step 2: Skull Stripping

**Goal**: Verify that the brain extraction preserved all brain tissue and removed the skull.

```bash
# Overlay the extracted brain on the original T1
fsleyes "$nifti_dir/${subj}_struct.nii" \
        "$ants_dir/${subj}_BrainExtractionBrain.nii.gz" \
        -cm blue-lightblue -a 50 &
```

**What good looks like:**
- All cortical gray matter preserved, including the temporal poles and inferior frontal lobe
- Skull, scalp, and dura cleanly removed
- Cerebellum intact
- No holes in the brain mask

**Warning signs:**
- **Over-stripping**: Brain tissue removed, especially at the temporal poles, inferior cerebellum, or orbits. The semi-transparent overlay will show gaps where the blue brain does not cover the white brain outline.
- **Under-stripping**: Skull, dura, or eyes remain attached. You will see blue extending beyond the brain boundary.
- **Asymmetric stripping**: One hemisphere stripped more aggressively than the other — often caused by a bright artifact on one side biasing the extraction.

### Step 4: TOPUP Distortion Correction

**Goal**: Verify that susceptibility distortions are reduced after TOPUP.

```bash
# Compare the uncorrected and corrected B0 images
fsleyes "$nifti_dir/$subj/dti/${subj}_fmapAP.nii" \
        "$topup_dir/${subj}_topup_corrected_b0.nii.gz" &
```

**What good looks like:**
- Frontal and temporal lobes have realistic shape (not stretched or compressed)
- The ventricles are symmetric
- The brain boundary is smooth, not wavy

**Warning signs:**
- **Residual distortion**: The corrected image still shows stretching along the anterior-posterior axis, especially in the frontal lobes or near the sinuses.
- **Over-correction**: The corrected image looks warped in the opposite direction — this usually means the `acqp.txt` file has the wrong phase encoding direction.
- **Signal pileup**: Bright spots where signal from adjacent voxels has been compressed together. This can happen in regions of severe susceptibility gradients.

### Step 6: Brain Masking (Diffusion Space)

**Goal**: Verify that the BET mask covers the entire brain without including skull.

```bash
# Overlay the mask on the mean B0
fsleyes "$b0_dir/${subj}_Tmean_b0.nii.gz" \
        "$mask_dir/${subj}_brain_mask.nii.gz" \
        -cm red-yellow -a 40 &
```

Scroll through all three planes (axial, coronal, sagittal). The mask should tightly follow the brain boundary.

**Warning signs:**
- **Too tight**: Mask cuts into cortex, especially at the temporal poles or inferior cerebellum. Lower the `-f` parameter in BET (e.g., from 0.3 to 0.2).
- **Too loose**: Mask includes non-brain tissue (skull, sinuses, optic nerves). Increase `-f` (e.g., from 0.3 to 0.4).
- **Holes**: Internal holes in the mask, often in areas of signal dropout. Fill with `fslmaths mask -fillh mask_filled`.

### Step 7: Denoising and Gibbs Correction

**Goal**: Verify that denoising removed noise without blurring, and that Gibbs ringing is reduced.

```bash
# Compare raw vs denoised (toggle between them in FSLeyes)
fsleyes "$nifti_dir/$subj/dti/${subj}_dti.nii.gz" \
        "$denoised_dir/${subj}_denoised.nii.gz" &

# Inspect the noise map (should be spatially smooth)
fsleyes "$denoised_dir/${subj}_noise_map.nii.gz" &
```

**What good looks like:**
- Background noise (outside the brain) is visibly reduced in the denoised image
- Tissue boundaries remain sharp — not blurred or smoothed
- The noise map is spatially smooth, reflecting coil sensitivity patterns

**Warning signs:**
- **Blurry tissue boundaries**: May indicate the denoising removed signal, not just noise. This can happen with very few DWI volumes (< 10).
- **Noise map shows brain structure**: If the noise map has sharp edges that look like brain anatomy, the denoising algorithm incorrectly classified signal as noise.

### Step 8: Eddy-Corrected Data

**Goal**: Verify that eddy currents and motion are corrected, and no severe artifacts remain.

```bash
# Scroll through volumes of the corrected 4D data
fsleyes "$eddy_dir/${subj}_eddy.nii.gz" &
```

Step through volumes using the movie controls or the volume slider. Volumes should be well-aligned (no jumping between frames).

**What good looks like:**
- Volumes are well-aligned — structures stay in the same position as you scroll
- No bright or dark slices that do not match their neighbors
- Brain boundary is consistent across volumes

**Warning signs:**
- **Signal dropout**: One or more slices appear unusually dark. The `--repol` flag in eddy should have replaced these, but check that it worked.
- **Venetian blind artifact**: Alternating bright and dark slices in a striped pattern. This is caused by interleaved acquisition with significant between-slice motion.
- **Volume-to-volume jumps**: The brain appears to shift suddenly between adjacent volumes — may indicate residual uncorrected motion.
- **Bright ring at brain edge**: Can indicate residual eddy current distortion or mask problems.

### Step 11: DTIFIT — FA and MD Maps

**Goal**: Verify that the tensor fit produced reasonable scalar maps.

```bash
# View FA map
fsleyes "$dtifit_dir/${subj}_DTI_FA.nii.gz" -cm hot &

# View MD map
fsleyes "$dtifit_dir/${subj}_DTI_MD.nii.gz" -cm cool &

# View the V1 (principal eigenvector) as a color map
fsleyes "$dtifit_dir/${subj}_DTI_V1.nii.gz" -ot linevector &
```

**What good FA looks like:**
- White matter tracts are bright (high FA): corpus callosum, internal capsule, corona radiata
- CSF is dark (near-zero FA)
- Gray matter is intermediate
- FA values are between 0 and 1 everywhere

**Warning signs:**
- **FA > 1.0 anywhere**: Indicates non-positive-definite tensors. Run `fslstats FA -R` to check the range.
- **Uniformly low FA**: The entire brain looks gray with no tract definition — may indicate wrong b-values, wrong bvecs, or failed eddy correction.
- **Streaks or rings in FA**: Residual artifacts from Gibbs ringing, motion, or eddy currents that survived preprocessing.
- **Asymmetric FA**: One hemisphere has systematically higher or lower FA than the other — may indicate gradient miscalibration or residual distortion.

### Step 12: Registration to Standard Space

**Goal**: Verify that the subject's FA map aligns with the MNI template.

```bash
# Overlay FA on the MNI template
fsleyes "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
        "$reg_dir/${subj}_FA_in_MNI.nii.gz" \
        -cm red-yellow -a 50 &
```

**What good looks like:**
- The FA map aligns with the template anatomy — ventricles, corpus callosum, and cortical boundaries match
- No obvious rotation, shift, or scaling mismatch

**Warning signs:**
- **Brain shifted**: The registered FA is offset from the template — check that all three transforms (diff2str, str2standard) were computed correctly.
- **Brain rotated**: Often caused by using the wrong transform concatenation order.
- **Brain distorted**: Nonlinear warping may be needed (FNIRT) if linear FLIRT registration is insufficient.

## Batch Visual QC Strategy

For studies with many subjects, inspect every subject at the most critical stages:

| Stage | Inspect Every Subject? | Alternative |
|-------|----------------------|-------------|
| Skull stripping | **Yes** | — |
| TOPUP | Spot-check ~10% | Flag subjects with high eddy motion for closer look |
| Eddy volumes | Spot-check ~10% | Use `eddy_quad` metrics to flag outliers, then inspect those |
| FA maps | **Yes** | — |
| Registration | **Yes** | Batch montage using `slicesdir` |

### Using `slicesdir` for Batch QC

FSL's `slicesdir` creates a single HTML page with axial slices from multiple subjects — useful for quickly scanning through registration results:

```bash
# Create an HTML overview of all registered FA maps
cd "$reg_dir"
slicesdir -p "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
    sub-*/sub-*_FA_in_MNI.nii.gz

# Open the output in a browser
open slicesdir/index.html    # macOS
xdg-open slicesdir/index.html  # Linux
```

This lets you scan through dozens of subjects in minutes, clicking into any that look problematic for a closer FSLeyes inspection.
