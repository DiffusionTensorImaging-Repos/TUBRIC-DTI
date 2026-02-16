---
sidebar_position: 6
title: "pyAFQ"
---

# pyAFQ — Automated Fiber Quantification

:::info Coming Soon
This page is under active development. A complete guide to pyAFQ is being written.
:::

## Overview

pyAFQ is a Python package for automated identification and quantification of major white matter tracts. It takes BIDS-formatted diffusion data and produces tract profiles — measures of diffusion properties (FA, MD, etc.) sampled along the length of each tract.

**GitHub**: [https://github.com/yeatmanlab/pyAFQ](https://github.com/yeatmanlab/pyAFQ)
**Documentation**: [https://yeatmanlab.github.io/pyAFQ/](https://yeatmanlab.github.io/pyAFQ/)

## Installation

```bash
pip install pyAFQ
```

## BIDS Input Requirements

pyAFQ expects data in BIDS format:
```
derivatives/
  sub-001/
    dwi/
      sub-001_dwi.nii.gz
      sub-001_dwi.bval
      sub-001_dwi.bvec
      sub-001_dwi_desc-brain_mask.nii.gz
    anat/
      sub-001_T1w.nii.gz
```

## Configuration

pyAFQ uses a TOML configuration file. See [Configuration Files](/docs/reference/config-files) for details.

## References

- Yeatman JD, Dougherty RF, Myall NJ, Wandell BA, Feldman HM (2012). Tract profiles of white matter properties: automating fiber-tract quantification. *PLoS One*, 7(11), e49790.
- Kruper J, et al. (2021). Evaluating the reliability of human brain white matter tractometry. *Aperture Neuro*, 1(6).
