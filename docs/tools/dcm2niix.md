---
sidebar_position: 5
title: "dcm2niix"
---

# dcm2niix

:::info Coming Soon
This page is under active development. A complete guide to dcm2niix is being written.
:::

## Overview

dcm2niix is a command-line tool that converts DICOM medical imaging files into the NIfTI format. Developed by Chris Rorden, it is the standard tool for DICOM-to-NIfTI conversion in the neuroimaging community.

**GitHub**: [https://github.com/rordenlab/dcm2niix](https://github.com/rordenlab/dcm2niix)

## Installation

Pre-built binaries are available for all platforms. See the [releases page](https://github.com/rordenlab/dcm2niix/releases).

```bash
# Verify installation
dcm2niix -h
```

## Basic Usage

```bash
dcm2niix -o "$output_dir" -f "${subj}_%p" "$dicom_dir"
```

## Key Flags

| Flag | Purpose | Example |
|------|---------|---------|
| `-o` | Output directory | `-o /path/to/output` |
| `-f` | Filename format | `-f "%n_%p"` (name_protocol) |
| `-z` | Compression | `-z y` (gzip output) |
| `-b` | BIDS sidecar | `-b y` (generate JSON) |

## Output Files

For each scan, dcm2niix produces:
- `.nii` or `.nii.gz` — NIfTI image
- `.json` — metadata sidecar (acquisition parameters)
- `.bval` — b-values (DWI only)
- `.bvec` — gradient directions (DWI only)

## References

- Li X, Morgan PS, Ashburner J, Smith J, Rorden C (2016). The first step for neuroimaging data analysis: DICOM to NIfTI conversion. *Journal of Neuroscience Methods*, 264, 47-56.
