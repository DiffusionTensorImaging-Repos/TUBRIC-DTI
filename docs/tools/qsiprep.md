---
sidebar_position: 7
title: "QSIPrep"
---

# QSIPrep

## What is QSIPrep?

QSIPrep is a containerized BIDS-app for preprocessing diffusion MRI data, developed by the PennLINC group at the University of Pennsylvania. It provides an automated, reproducible pipeline that handles the full diffusion preprocessing workflow inside a Docker or Singularity container.

Under the hood, QSIPrep is built on top of many of the same tools covered in this tutorial -- FSL, ANTs, MRtrix3, and others. The difference is that QSIPrep orchestrates these tools automatically, applying sensible defaults and handling the complex interdependencies between steps.

Because QSIPrep runs inside a container, there is no need to manually install FSL, ANTs, MRtrix3, or any other dependency. The container bundles everything together, guaranteeing that the exact same software versions are used every time.

## What QSIPrep Automates

QSIPrep handles the following preprocessing operations:

- **Denoising** -- MP-PCA denoising (equivalent to `dwidenoise` in MRtrix3)
- **Gibbs ringing correction** -- removes ringing artifacts (equivalent to `mrdegibbs`)
- **Motion correction** -- corrects subject head motion across volumes
- **Eddy current correction** -- removes eddy current distortions (equivalent to FSL `eddy`)
- **Susceptibility distortion correction** -- corrects field inhomogeneity distortions (equivalent to FSL `topup`)
- **Brain extraction** -- removes non-brain tissue
- **Spatial normalization** -- aligns data to standard template space

QSIPrep also follows BIDS (Brain Imaging Data Structure) conventions for both input and output. Your raw data must be organized in BIDS format, and all outputs follow BIDS-derivatives naming conventions.

## Basic Usage

QSIPrep expects BIDS-formatted input data and produces BIDS-derivatives output:

```bash
qsiprep $bids_dir $output_dir participant \
  --participant-label $subj \
  --output-resolution 1.5 \
  --fs-license-file $license_file
```

**Key arguments:**

- `$bids_dir` -- path to the BIDS-formatted dataset
- `$output_dir` -- path where QSIPrep will write outputs
- `participant` -- analysis level (process individual subjects)
- `--participant-label` -- which subject to process (e.g., `sub-001`)
- `--output-resolution` -- isotropic voxel size for the output in mm
- `--fs-license-file` -- path to the FreeSurfer license file (required even if FreeSurfer is not used)

### Running with Docker

```bash
docker run -ti --rm \
  -v $bids_dir:/data:ro \
  -v $output_dir:/out \
  -v $license_file:/license.txt:ro \
  pennbbl/qsiprep:latest \
  /data /out participant \
  --participant-label $subj \
  --output-resolution 1.5 \
  --fs-license-file /license.txt
```

### Running with Singularity

```bash
singularity run --cleanenv \
  -B $bids_dir:/data:ro \
  -B $output_dir:/out \
  -B $license_file:/license.txt:ro \
  qsiprep.sif \
  /data /out participant \
  --participant-label $subj \
  --output-resolution 1.5 \
  --fs-license-file /license.txt
```

---

## Manual Pipeline vs QSIPrep

| Aspect | Manual Pipeline (this tutorial) | QSIPrep |
|--------|-------------------------------|---------|
| **Control** | Full control over every parameter | Automated with sensible defaults |
| **Transparency** | Every step visible and auditable | Black-box with detailed logs |
| **Learning** | Teaches you what each step does | Abstracts away the details |
| **Customization** | Fully customizable | Configurable but within framework |
| **Reproducibility** | Depends on documentation | Container guarantees reproducibility |
| **Setup** | Install each tool separately | Docker/Singularity only |
| **QC** | Manual at each step | Built-in visual QC reports |
| **Advanced models** | Can extend freely | Supports many reconstruction models |

---

## When to Use Each Approach

### Learn the Manual Pipeline First

This tutorial exists because understanding the manual pipeline is the best way to learn what is actually happening to your data at each stage. When something goes wrong -- and it will -- you need to know what each step does to diagnose the problem.

**Recommendation:** work through this tutorial's manual pipeline first to build your understanding. Then consider QSIPrep for production-scale processing.

### Use the Manual Pipeline When

- You need non-standard parameters that QSIPrep does not expose
- Your data does not fit BIDS format easily (unusual acquisition schemes, non-standard naming)
- You want maximum control over every processing decision
- You are learning diffusion MRI preprocessing for the first time
- You need to insert custom steps between standard stages
- You are developing or testing new preprocessing methods

### Use QSIPrep When

- Reproducibility is paramount (e.g., multi-site studies)
- You are processing many subjects and need automation
- You need standardized outputs for downstream analysis
- You are comfortable with the preprocessing concepts and want efficiency
- You need built-in quality control reports
- You want to ensure identical software versions across environments

---

## Important Caveat

:::caution
This tutorial does **not** validate that QSIPrep produces identical results to the manual pipeline described here. While the underlying algorithms are similar (both use FSL's `eddy`, MRtrix3's `dwidenoise`, etc.), the specific parameter choices, step ordering, and implementation details may differ. If you need to compare outputs between the two approaches, you should perform your own validation on your specific data.
:::

---

## QSIPrep Outputs

QSIPrep produces a rich set of outputs including:

- Preprocessed diffusion data (motion-corrected, distortion-corrected, denoised)
- Brain masks
- Confound time series (framewise displacement, etc.)
- Visual QC reports in HTML format
- Reconstruction outputs (if a reconstruction workflow is specified)

All outputs follow BIDS-derivatives naming conventions:

```
$output_dir/
  qsiprep/
    sub-001/
      anat/
      dwi/
        sub-001_space-T1w_desc-preproc_dwi.nii.gz
        sub-001_space-T1w_desc-preproc_dwi.bval
        sub-001_space-T1w_desc-preproc_dwi.bvec
        sub-001_space-T1w_desc-brain_mask.nii.gz
      figures/
```

---

## Links and References

- **Documentation:** [qsiprep.readthedocs.io](https://qsiprep.readthedocs.io/)
- **GitHub:** [github.com/PennLINC/qsiprep](https://github.com/PennLINC/qsiprep)
- **Reference:** Cieslak, M., Cook, P.A., He, X., Yeh, F.-C., Dhollander, T., Adebimpe, A., ... & Satterthwaite, T.D. (2021). QSIPrep: an integrative platform for preprocessing and reconstructing diffusion MRI data. *Nature Methods*, 18(7), 775-778. https://doi.org/10.1038/s41592-021-01185-5
