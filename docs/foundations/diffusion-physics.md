---
sidebar_position: 2
title: "Diffusion Physics"
---

# The Physics of Diffusion in the Brain

:::info Coming Soon
This page is under active development. Check back for a complete treatment of diffusion physics as it applies to neuroimaging.
:::

## Brownian Motion and Molecular Diffusion

Water molecules are in constant random motion (Brownian motion). In a free, unrestricted environment, this motion is equal in all directions — **isotropic diffusion**. The diffusion coefficient *D* describes how far molecules travel per unit time.

## Anisotropic Diffusion in White Matter

In the brain's white matter, axonal membranes and myelin sheaths restrict water movement perpendicular to the fiber axis while allowing relatively free movement along it. This creates **anisotropic diffusion** — the key signal that DTI exploits.

## The Diffusion Tensor Model

The diffusion tensor is a 3x3 symmetric positive-definite matrix that characterizes the 3D diffusion profile at each voxel:

$$
D = \begin{pmatrix} D_{xx} & D_{xy} & D_{xz} \\ D_{xy} & D_{yy} & D_{yz} \\ D_{xz} & D_{yz} & D_{zz} \end{pmatrix}
$$

This matrix has 6 unique elements, which is why a minimum of 6 gradient directions (plus at least one b=0 image) are needed to fit the tensor.

## Eigendecomposition

The tensor's eigenvectors describe the principal axes of diffusion, and the eigenvalues describe the magnitude of diffusion along each axis. See [What is DTI?](./what-is-dti) for how eigenvalues map to FA, MD, AD, and RD.

## Limitations of the Single-Tensor Model

The single tensor assumes a single fiber population per voxel. In reality, approximately 60-90% of white matter voxels contain crossing, kissing, or fanning fibers that cannot be resolved by a single tensor.

## Beyond DTI

Advanced models that address crossing fibers include:

- **CSD (Constrained Spherical Deconvolution)** — estimates fiber orientation distribution functions
- **NODDI (Neurite Orientation Dispersion and Density Imaging)** — models neurite density and orientation dispersion
- **DKI (Diffusion Kurtosis Imaging)** — captures non-Gaussian diffusion behavior

## References

- Basser PJ, Mattiello J, LeBihan D (1994). MR diffusion tensor spectroscopy and imaging. *Biophysical Journal*, 66(1), 259-267.
- Jones DK (2010). *Diffusion MRI: Theory, Methods, and Applications*. Oxford University Press.
- Tournier JD, Calamante F, Connelly A (2007). Robust determination of the fibre orientation distribution in diffusion MRI. *NeuroImage*, 35(4), 1459-1472.
