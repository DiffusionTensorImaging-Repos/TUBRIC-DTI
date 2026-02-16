---
sidebar_position: 1
title: "Practice Data"
---

# Practice Data and Interactive Environments

## Overview

You don't need your own MRI data to learn DTI preprocessing. Several publicly available datasets provide high-quality diffusion MRI data that you can use to practice every step in this tutorial.

## Recommended Datasets

### OpenNeuro

[OpenNeuro](https://openneuro.org) hosts thousands of freely available neuroimaging datasets. Search for "diffusion" or "DTI" to find suitable practice data.

**Recommended datasets:**

| Dataset | Description | Shells | Subjects |
|---------|-------------|--------|----------|
| [ds000201](https://openneuro.org/datasets/ds000201) | Multi-shell diffusion | b=1000, 2000 | 10+ |
| [ds001021](https://openneuro.org/datasets/ds001021) | HCP-style multi-shell | Multiple | 10+ |
| [ds000030](https://openneuro.org/datasets/ds000030) | UCLA Consortium | b=1000 | 200+ |

### Human Connectome Project (HCP)

The [HCP](https://www.humanconnectome.org/study/hcp-young-adult/data-releases) provides gold-standard multi-shell diffusion data (b=1000, 2000, 3000) with 90 gradient directions per shell. Registration required for access.

### Stanford HARDI

A classic dataset frequently used in diffusion MRI tutorials and tool development. Available through the [DiPy project](https://dipy.org/documentation/1.0.0./examples_built/reconst_dti/).

## Downloading Data

### From OpenNeuro

```bash
# Using the OpenNeuro CLI
npm install -g openneuro-cli
openneuro download ds000201 /path/to/output

# Or download a single subject via the web interface
```

### From HCP

1. Register at [ConnectomeDB](https://db.humanconnectome.org/)
2. Download individual subject packages
3. Look for the `Diffusion` package containing DWI, bvals, bvecs, and T1

## Interactive Environment (Binder)

:::tip Launch in Browser
Click the Binder badge below to launch a free cloud environment with pre-installed neuroimaging tools and sample data. No installation required.

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/TUBRIC/dti-repo/main?urlpath=lab)
:::

The Binder environment includes:
- FSL core tools (fslroi, fslmerge, fslmaths, bet, topup, eddy, dtifit, flirt)
- MRtrix3 (dwidenoise, mrdegibbs, dwiextract)
- dcm2niix
- Python with pyAFQ
- A sample single-subject DTI dataset ready to process
- Jupyter notebooks walking through each pipeline step

## Setting Up Your Own Practice Environment

If you prefer to work locally:

1. Install the required tools (see [Tool Ecosystem](/docs/tools/overview))
2. Download a practice dataset from OpenNeuro
3. Follow the pipeline steps in this tutorial, substituting your local paths

## What About Your Own Data?

Once you're comfortable with the pipeline using practice data, you can apply it to your own research data. The only things that change are:
- File paths and directory structure
- The `acqp.txt` file (must match your acquisition protocol)
- The `index.txt` file (must match your number of volumes)
- Any protocol-specific parameters (e.g., which b-value shells to include/exclude)

See [Configuration Files](/docs/reference/config-files) for guidance on creating these files for your data.
