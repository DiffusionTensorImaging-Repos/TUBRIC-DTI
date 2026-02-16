---
sidebar_position: 13
title: "Step 12: Registration (FLIRT)"
---

# Step 12: Registration and Spatial Alignment

:::info Coming Soon
Full tutorial content is under development. The key concepts and commands are outlined below.
:::

## Overview

Registers the diffusion data to the subject's T1 structural image and to a standard template (MNI152). This enables:
- **Within-subject alignment**: overlay DTI metrics on structural anatomy
- **Group analysis**: compare DTI metrics across subjects in a common space
- **Tractography seeding**: define seed regions in standard space and transform to diffusion space

## Conceptual Background

FLIRT performs **linear (affine) registration** using a cost function to find the best spatial alignment between two images. For DTI, we create a chain of transformations:

1. **Diffusion → Structural** (diff2str): align the FA map to the T1 brain
2. **Structural → Standard** (str2standard): align the T1 brain to MNI152
3. **Diffusion → Standard** (diff2standard): concatenate the above two transforms

We also compute the inverse transforms for mapping ROIs from standard space back to diffusion space.

## Commands

```bash
# Step 1: Diffusion to Structural
flirt -in "$dtifit_dir/${subj}_DTI_FA" \
      -ref "$ants_dir/${subj}_BrainExtractionBrain" \
      -out "$output_dir/${subj}_diff2str" \
      -omat "$output_dir/${subj}_diff2str.mat" \
      -dof 6

# Step 2: Structural to Standard (MNI152)
flirt -in "$ants_dir/${subj}_BrainExtractionBrain" \
      -ref "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
      -out "$output_dir/${subj}_str2standard" \
      -omat "$output_dir/${subj}_str2standard.mat" \
      -dof 12

# Step 3: Compute inverse transforms
convert_xfm -omat "$output_dir/${subj}_str2diff.mat" \
            -inverse "$output_dir/${subj}_diff2str.mat"

convert_xfm -omat "$output_dir/${subj}_standard2str.mat" \
            -inverse "$output_dir/${subj}_str2standard.mat"

# Step 4: Concatenate diffusion-to-standard
convert_xfm -omat "$output_dir/${subj}_diff2standard.mat" \
            -concat "$output_dir/${subj}_str2standard.mat" \
                    "$output_dir/${subj}_diff2str.mat"

# Step 5: Inverse of concatenated
convert_xfm -omat "$output_dir/${subj}_standard2diff.mat" \
            -inverse "$output_dir/${subj}_diff2standard.mat"
```

## Expected Output

Six transformation matrices per subject:
- `diff2str.mat` — diffusion to structural
- `str2diff.mat` — structural to diffusion (inverse)
- `str2standard.mat` — structural to MNI
- `standard2str.mat` — MNI to structural (inverse)
- `diff2standard.mat` — diffusion to MNI (concatenated)
- `standard2diff.mat` — MNI to diffusion (inverse)

## Quality Check

Apply the transform and visually verify alignment:
```bash
flirt -in "$dtifit_dir/${subj}_DTI_FA" \
      -ref "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
      -applyxfm -init "$output_dir/${subj}_diff2standard.mat" \
      -out "$output_dir/${subj}_FA_in_MNI"

fsleyes "$FSLDIR/data/standard/MNI152_T1_2mm_brain" \
        "$output_dir/${subj}_FA_in_MNI" -cm red-yellow -a 50 &
```

## References

- Jenkinson M, Smith SM (2001). A global optimisation method for robust affine registration of brain images. *Medical Image Analysis*, 5(2), 143-156.
- FSL FLIRT: [https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FLIRT](https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FLIRT)

## Next Step

[Step 13: ICV Calculation](./icv-calculation)
