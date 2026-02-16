---
sidebar_position: 1
title: "Getting Started"
---

# Welcome to the TUBRIC DTI Preprocessing Tutorial

This tutorial is a practical, concept-driven guide to diffusion tensor imaging (DTI) preprocessing. Whether you are a research assistant running your first diffusion pipeline, a graduate student building intuition for what each step does, or an experienced researcher looking for a structured reference, this resource is designed for you.

## What This Tutorial Covers

You will work through four interconnected areas:

1. **Conceptual Foundations** -- What diffusion MRI measures, how the diffusion tensor works, and what the key file formats and acquisition parameters mean.
2. **A 14-Stage Preprocessing Pipeline** -- A complete, ordered walkthrough from raw DICOM conversion through tensor fitting and tract-based spatial statistics. Each stage explains *why* the step exists, *what* it does to the data, and *how* to run it.
3. **Tool Guides** -- Focused references for FSL, MRtrix3, ANTs, and other software you will encounter throughout the pipeline.
4. **Quality Assurance and Quality Control** -- Strategies for catching problems early, interpreting QC outputs, and deciding when a dataset should be excluded.

## Prerequisites

Before starting, you should have:

- **Basic Linux/Bash familiarity** -- navigating directories, running commands, editing text files. You do not need to be a scripting expert, but you should be comfortable in a terminal.
- **Access to a computing environment** with [FSL](https://fsl.fmrib.ox.ac.uk/fsl/), [ANTs](http://stnava.github.io/ANTs/), and [MRtrix3](https://www.mrtrix.org/) installed. This can be a university cluster, a local workstation, or a container-based setup.
- **No prior diffusion MRI experience required.** The foundations section will bring you up to speed.

## How to Use This Tutorial

The tutorial is organized sequentially, and reading it start-to-finish will give you the most complete understanding. That said, every page is self-contained enough to be useful on its own. If you already understand the basics and need to troubleshoot a specific pipeline stage, jump straight there.

Use the sidebar to navigate between sections. Each pipeline stage page includes a summary box at the top so you can quickly determine whether you are in the right place.

## The IMPACT Reference Implementation

Throughout this tutorial, you will see references to the **SDN-IMPACT-DTI** project. The [SDN-IMPACT-DTI repository](https://github.com/DiffusionTensorImaging-Repos/SDN-IMPACT-DTI) is a real-world implementation of this preprocessing pipeline applied to 55 participants in the IMPACT study. It serves as a concrete example of how these concepts and stages come together in a production research workflow.

When a pipeline stage page references IMPACT-specific choices (e.g., which b-value shells were selected, or how many volumes were acquired), this is to ground the discussion in a real dataset rather than abstract parameters.

## Interactive Practice

Where possible, we provide links to **Binder environments** that let you run preprocessing steps on public datasets directly in your browser. These are ideal for experimenting with parameters and building intuition before applying tools to your own data.

## Let's Get Started

Head to the [Foundations](./foundations/what-is-dti) section to begin with the conceptual building blocks, or jump directly to the [Pipeline Overview](./pipeline/overview) if you are ready to preprocess.
