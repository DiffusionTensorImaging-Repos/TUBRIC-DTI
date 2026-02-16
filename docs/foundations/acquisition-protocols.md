---
sidebar_position: 5
title: "Acquisition Protocols"
---

# MRI Acquisition Protocols for DTI

:::info Coming Soon
This page is under active development. A complete guide to DTI acquisition protocols is being written.
:::

## What You Need to Acquire

A complete DTI acquisition for this pipeline requires **four scan types**:

| Scan | Purpose | Example Sequence |
|------|---------|-----------------|
| **T1 Structural** | High-resolution anatomical reference | MPRAGE, MP2RAGE |
| **DWI Main Run** | Diffusion-weighted images with multiple gradient directions | CMRR multiband EPI |
| **Fieldmap AP** | B0 field map with anterior-to-posterior phase encoding | Spin-echo EPI |
| **Fieldmap PA** | B0 field map with posterior-to-anterior phase encoding | Spin-echo EPI |

## CMRR Multiband Sequences

The Center for Magnetic Resonance Research (CMRR) at the University of Minnesota develops widely-used multiband EPI sequences for Siemens scanners. These sequences use **simultaneous multi-slice (SMS) acceleration** to acquire multiple slices at once, dramatically reducing scan time.

Key parameters:
- **Multiband factor**: number of slices acquired simultaneously (e.g., MB3 = 3 slices at once)
- **IPAT/GRAPPA**: in-plane acceleration factor
- **Number of directions**: total gradient directions across all shells

## Phase Encoding and Fieldmaps

Phase encoding direction determines how susceptibility distortions manifest in the image. By acquiring fieldmaps with **opposite phase encoding directions** (AP and PA), TOPUP can estimate and correct these distortions.

## Readout Time

The total readout time is critical for TOPUP and EDDY configuration. It can be found in the JSON sidecar from dcm2niix or calculated from scan parameters.

## Example Protocol Parameters

A typical research DTI protocol might include:
- **B-values**: 0, 1000, 2000, 3000 s/mm^2
- **Directions**: 6-10 b=0, 30+ per shell
- **Resolution**: 1.5-2.0 mm isotropic
- **Multiband**: MB2-MB3
- **Total scan time**: 10-20 minutes

## References

- Sotiropoulos SN, et al. (2013). Advances in diffusion MRI acquisition and processing in the Human Connectome Project. *NeuroImage*, 80, 125-143.
- Setsompop K, et al. (2012). Blipped-controlled aliasing in parallel imaging for simultaneous multislice echo planar imaging. *Magnetic Resonance in Medicine*, 67(5), 1210-1224.
