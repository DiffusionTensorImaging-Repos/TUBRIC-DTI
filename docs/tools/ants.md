---
sidebar_position: 3
title: "ANTs (Advanced Normalization Tools)"
---

# ANTs — Advanced Normalization Tools

:::info Coming Soon
This page is under active development. A complete guide to ANTs for DTI preprocessing is being written.
:::

## Overview

ANTs is an open-source software suite for image registration and segmentation, developed at the University of Pennsylvania. In the DTI pipeline, ANTs is primarily used for high-quality brain extraction (skull stripping) and tissue segmentation.

**GitHub**: [https://github.com/ANTsX/ANTs](https://github.com/ANTsX/ANTs)

## Installation

```bash
# Clone and build from source
git clone https://github.com/ANTsX/ANTs.git
cd ANTs
mkdir build && cd build
cmake .. && make -j4

# Add to PATH
export ANTSPATH="/path/to/ANTs/bin"
export PATH="$ANTSPATH:$PATH"
```

## Key Commands for DTI

| Command | Purpose |
|---------|---------|
| `antsBrainExtraction.sh` | Template-based skull stripping |
| `Atropos` | Tissue segmentation (CSF, GM, WM) |

## Brain Templates

ANTs requires reference templates for brain extraction. Download from the official figshare repository:
[https://figshare.com/articles/dataset/ANTs_ANTsR_Brain_Templates/915436](https://figshare.com/articles/dataset/ANTs_ANTsR_Brain_Templates/915436)

| Template | Best For |
|----------|----------|
| **NKI** | Adolescents and adults |
| **OASIS** | Older adults |
| **ICBM** | General population |

## References

- Avants BB, Tustison NJ, Song G, Cook PA, Klein A, Gee JC (2011). A reproducible evaluation of ANTs similarity metric performance in brain image registration. *NeuroImage*, 54(3), 2033-2044.
