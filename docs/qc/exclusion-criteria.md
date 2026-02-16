---
sidebar_position: 5
title: "Exclusion Criteria"
---

# Deciding When to Exclude a Subject

Not all data can be saved. Some subjects will need to be excluded from analysis due to excessive motion, failed preprocessing, or acquisition problems. Having clear, pre-defined exclusion criteria ensures that these decisions are objective and reproducible — not influenced by what the results look like after the fact.

:::caution Define Criteria Before Looking at Data
Decide your exclusion thresholds **before** you start preprocessing. Ideally, pre-register them alongside your analysis plan. If you choose thresholds after seeing the data, there is a risk (even unconscious) of adjusting criteria to include or exclude subjects based on their results.
:::

## Recommended Thresholds

The thresholds below are commonly used in the DTI literature. They are guidelines — not rigid rules — and should be adjusted based on your population, scanner, and research question.

### Motion

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Average absolute motion | > 2 mm | Exceeds typical voxel size (2 mm); corrections become unreliable |
| Maximum relative motion | > 3 mm | A single large jerk can corrupt multiple volumes |
| Average relative motion | > 1 mm | High frame-to-frame displacement indicates continuous fidgeting |

Motion parameters come from the [eddy QC reports](./eddy-qc). Use `eddy_quad` to extract these values for each subject.

### Artifacts and Outliers

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Outlier slice percentage | > 10% | Too many slices were corrupted; `--repol` replacement may bias estimates |
| Signal dropout volumes | > 5 volumes | Volumes with complete signal loss in one or more slices |
| Failed skull stripping | Cannot be fixed | Registration and masking will fail downstream |

### Tensor Fit Quality

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| FA > 1.0 anywhere in mask | Any voxel | Non-positive-definite tensor — indicates processing error |
| Whole-brain mean FA | Outside 2 SD of group | Likely artifact or processing failure |
| MD values | Negative anywhere | Physically impossible — processing error |

### Acquisition Issues

| Issue | Action |
|-------|--------|
| Missing scan type (T1, DWI, or fieldmap) | Exclude before preprocessing |
| Incomplete DWI acquisition (fewer volumes than expected) | Exclude — tensor fitting requires a minimum number of directions |
| Wrong protocol (different b-values or directions than the rest of the sample) | Exclude or process separately |
| Scanner artifact (e.g., RF spike, gradient failure) visible in raw data | Exclude |

## When to Exclude: Stage by Stage

Exclusion decisions happen at multiple points during preprocessing:

### Before Preprocessing
- Subject is missing required scan types
- DWI has far fewer volumes than expected (scan was stopped early)
- Raw data shows obvious scanner malfunction

### After Skull Stripping (Step 2)
- Brain extraction failed completely and cannot be corrected by adjusting parameters
- Major pathology (large lesion, prior surgery) makes standard processing inappropriate

### After Eddy (Step 8)
This is the most common exclusion point. Use `eddy_quad` metrics:
- Average absolute motion exceeds your threshold
- Outlier slice percentage exceeds your threshold
- Visual inspection reveals uncorrectable artifacts

### After DTIFIT (Step 11)
- FA map shows artifacts (streaks, rings, asymmetry)
- FA values outside 0–1 range
- FA/MD maps are obviously corrupted compared to the rest of the sample

### After Registration (Step 12)
- Registration to standard space failed (brain misaligned with template)
- Usually indicates a problem at an earlier stage — investigate before simply excluding

## Population-Specific Considerations

Standard adult thresholds may not apply to every population:

| Population | Consideration |
|------------|--------------|
| **Children** | Higher motion is expected — consider relaxing the absolute motion threshold to 2.5–3 mm if needed to retain adequate sample size |
| **Elderly / clinical** | Brain atrophy can cause skull stripping difficulties; may need to adjust BET parameters or use age-appropriate templates |
| **Infants / neonates** | Substantially different brain morphology — standard templates and default parameters are inappropriate. Use age-matched atlases |
| **Patients with lesions** | Large lesions can disrupt registration and tensor fitting. May need lesion masking or manual intervention |
| **High-motion populations** (ADHD, ASD, etc.) | Balance between strict QC and adequate sample size. Consider using `--repol` aggressively and documenting the trade-off |

:::tip Motion Thresholds Are Study-Specific
If you study a population that moves more (e.g., young children with ADHD), applying strict adult thresholds may exclude most of your sample. It is acceptable to use more lenient thresholds — but you must justify and report them. Conversely, a study of cooperative adults can use stricter thresholds.
:::

## Documenting Exclusions

For every excluded subject, record:

1. **Which criterion was violated** (e.g., "average absolute motion > 2 mm")
2. **The specific value** (e.g., "2.7 mm")
3. **At which stage** the problem was detected
4. **Whether re-processing was attempted** and the outcome
5. **Final decision**: include or exclude

### Example Exclusion Log

| Subject | Stage | Criterion | Value | Reprocessed? | Decision |
|---------|-------|-----------|-------|-------------|----------|
| sub-003 | Eddy | Abs motion | 3.1 mm | No | Exclude |
| sub-011 | Skull strip | Visual fail | — | Yes (adjusted -f) | Include after fix |
| sub-018 | DTIFIT | FA > 1.0 | Max FA = 1.34 | Yes (re-ran eddy) | Exclude (persisted) |
| sub-024 | Raw data | Missing DWI | — | No | Exclude |
| sub-031 | Eddy | Outlier slices | 14.2% | No | Exclude |

## Reporting in Your Methods Section

When writing up your study, include:

- Total number of subjects scanned
- Number excluded and at which stage
- The specific exclusion criteria used and their thresholds
- Any deviations from standard thresholds and justification
- Final sample size for analysis

Example: *"Of 85 subjects scanned, 7 were excluded from analysis: 2 for missing DWI acquisitions, 3 for excessive motion (average absolute displacement > 2 mm as measured by eddy_quad), 1 for failed skull stripping that could not be corrected, and 1 for corrupted FA maps (FA > 1.0). The final sample consisted of 78 subjects (mean age 24.3 years, 42 female)."*

## References

- Yendiki A, Koldewyn K, Kakunoori S, et al. (2014). Spurious group differences due to head motion in a diffusion MRI study. *NeuroImage*, 88, 79-90.
- Roalf DR, Quarmley M, Elliott MA, et al. (2016). The impact of quality assurance assessment on diffusion tensor imaging outcomes in a large-scale population-based cohort. *NeuroImage*, 125, 903-919.
- Bastiani M, Cottaar M, Fitzgibbon SP, et al. (2019). Automated quality control for within and between studies diffusion MRI data using a non-parametric framework for movement and distortion correction. *NeuroImage*, 184, 801-812.
