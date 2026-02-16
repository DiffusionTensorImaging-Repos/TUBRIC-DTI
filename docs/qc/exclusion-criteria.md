---
sidebar_position: 5
title: "Exclusion Criteria"
---

# Exclusion Criteria

After running eddy correction, you need to decide which subjects to include in your analysis. The key metrics come from `eddy_quad` — see [EDDY QC](./eddy-qc) for how to generate these reports.

:::caution Define Criteria Before Looking at Data
Decide your exclusion thresholds **before** you start preprocessing. Ideally, pre-register them alongside your analysis plan.
:::

## Motion Thresholds

These thresholds are standard in DTI preprocessing:

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Average absolute motion | > 2 mm | Exceeds typical voxel size; corrections become unreliable |
| Average relative motion | > 1 mm | High frame-to-frame displacement indicates continuous motion |
| Outlier slice percentage | > 10% | Too many slices were corrupted; `--repol` replacement may bias estimates |

Motion parameters come from the [eddy QC reports](./eddy-qc). Use `eddy_quad` to extract these values for each subject.

## Population-Specific Considerations

Standard adult thresholds may not apply to every population. If you study a population that moves more (e.g., young children, clinical populations), applying strict adult thresholds may exclude most of your sample. It is acceptable to use more lenient thresholds — but you must justify and report them.

## Reporting in Your Methods Section

When writing up your study, include:

- Total number of subjects scanned
- Number excluded and why
- The specific exclusion criteria used and their thresholds
- Final sample size for analysis

Example: *"Of 85 subjects scanned, 5 were excluded for excessive motion (average absolute displacement > 2 mm as measured by eddy_quad). The final sample consisted of 80 subjects (mean age 24.3 years, 42 female)."*

## References

- Yendiki A, Koldewyn K, Kakunoori S, et al. (2014). Spurious group differences due to head motion in a diffusion MRI study. *NeuroImage*, 88, 79-90.
- Roalf DR, Quarmley M, Elliott MA, et al. (2016). The impact of quality assurance assessment on diffusion tensor imaging outcomes in a large-scale population-based cohort. *NeuroImage*, 125, 903-919.
- Bastiani M, Cottaar M, Fitzgibbon SP, et al. (2019). Automated quality control for within and between studies diffusion MRI data using a non-parametric framework for movement and distortion correction. *NeuroImage*, 184, 801-812.
