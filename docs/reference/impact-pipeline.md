---
sidebar_position: 5
title: "IMPACT Reference Pipeline"
---

# IMPACT Reference Implementation

## Overview

The concepts and code patterns in this tutorial are based on a production DTI preprocessing pipeline developed for **Project IMPACT** at the Temple University Brain Research Imaging Center (TUBRIC). The IMPACT pipeline has been applied to 55 participants and serves as a real-world reference implementation of the preprocessing stages described here.

## Repository

**GitHub**: [SDN-IMPACT-DTI](https://github.com/DiffusionTensorImaging-Repos/SDN-IMPACT-DTI)

## What the IMPACT Pipeline Demonstrates

- All 14 preprocessing stages applied to real multi-shell diffusion data
- CMRR multiband acquisition (mb3hydi, IPAT=2, 64-channel)
- B-value shells: b=0, 250, 1000, 2000, 3250, 5000
- Comprehensive audit scripts after every stage
- Visual QC examples with screenshots
- Parallelized processing on a 56-core Linux workstation
- Data tracking spreadsheet for 55 participants
- Failure recovery procedures
- BIDS conversion and pyAFQ preparation

## How This Tutorial Relates

This tutorial **generalizes** the IMPACT pipeline:

| IMPACT Pipeline | This Tutorial |
|----------------|---------------|
| Hardcoded paths to IMPACT data | Generalized variable paths ($base_dir, $subj) |
| CMRR-specific scan names | Generic scan type descriptions |
| Applied to 55 specific subjects | Applicable to any DTI dataset |
| Execution-focused (step-by-step commands) | Education-focused (concepts + commands) |
| Project-internal documentation | Public-facing resource |

## Using the IMPACT Pipeline as a Reference

When working through this tutorial, you can cross-reference the IMPACT repository to see:
- How each step was actually executed on real data
- What the expected outputs look like with real file sizes
- How audit scripts were structured for production use
- How parallelization was managed across 55 subjects
- What QC issues were encountered and how they were resolved

## Acknowledgments

The IMPACT DTI preprocessing pipeline was developed at the Social Development Neuroscience (SDN) Lab at Temple University, in collaboration with the Temple University Brain Research Imaging Center (TUBRIC).
