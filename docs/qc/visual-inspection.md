---
sidebar_position: 2
title: "Visual Inspection"
---

# Visual Inspection with FSLeyes

Automated metrics can flag potential issues, but sometimes you need to look at the data. The two stages where visual inspection is most valuable are **skull stripping** and **eddy correction** — these are the steps where subtle problems are hardest to catch automatically. Visual QC is optional but recommended, especially when processing a new dataset for the first time.

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

## Key Stages to Inspect

### Step 2: Skull Stripping

This is the most important stage for visual QC. A bad skull strip cascades into registration problems downstream, and no automated metric reliably catches all failure modes.

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

### Step 8: Eddy-Corrected Data

After eddy correction, scroll through volumes to check that motion and eddy current artifacts have been cleaned up.

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

## Optional: Additional Stages Worth a Quick Look

These stages do not usually require systematic visual QC, but a quick glance at one or two subjects is worthwhile when processing a new dataset:

### FA Maps (Step 11)

```bash
fsleyes "$dtifit_dir/${subj}_DTI_FA.nii.gz" -cm hot &
```

White matter tracts should be bright, CSF should be dark, and there should be no streaks, rings, or uniformly low FA. This is more of a sanity check than a formal QC step — if the FA map looks wrong, the problem almost always originated at an earlier stage (eddy, bvecs, or skull stripping).

### Registration (Step 12)

```bash
fsleyes "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
        "$reg_dir/${subj}_FA_in_MNI.nii.gz" \
        -cm red-yellow -a 50 &
```

The FA map should align with the template anatomy. If it does not, check the transformation matrices and the inputs to FLIRT.

## Batch Visual QC with slicesdir

For large samples, FSL's `slicesdir` creates a single HTML page with axial slices from multiple subjects — useful for quickly scanning through registration results:

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
