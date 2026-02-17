---
sidebar_position: 1
title: "Getting Started"
---

# TUBRIC DTI Preprocessing Tutorial

A practical guide to diffusion tensor imaging (DTI) preprocessing, covering concepts, tools, and a complete pipeline.

## What's Here

- **Foundations** — What diffusion MRI measures, how the tensor works, and what the key file formats mean.
- **Pipeline** — An ordered walkthrough from DICOM conversion through tensor fitting and registration. Each step explains what it does and how to run it.
- **Quality Control** — Visual inspection and eddy QC metrics for catching problems.
- **Tool Guides** — References for FSL, MRtrix3, ANTs, and other software used throughout the pipeline.

## Prerequisites

- **Basic Linux/Bash familiarity** — navigating directories, running commands, editing text files.
- **A computing environment** with [FSL](https://fsl.fmrib.ox.ac.uk/fsl/), [ANTs](http://stnava.github.io/ANTs/), and [MRtrix3](https://www.mrtrix.org/) installed. This can be a university cluster, a local workstation, or a container-based setup.
- **No prior diffusion MRI experience required.** The foundations section covers the basics.

## Example Scripts

The [SDN-IMPACT-DTI repository](https://github.com/DiffusionTensorImaging-Repos/SDN-IMPACT-DTI) has example scripts that run each pipeline step as a loop across subjects. It can be a useful reference for how these steps look in practice.

## Getting Started

Head to [Foundations](./foundations/what-is-dti) to start with the conceptual building blocks, or go directly to the [Pipeline Overview](./pipeline/overview) if you're ready to preprocess.
