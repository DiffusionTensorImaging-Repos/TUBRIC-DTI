---
sidebar_position: 5
title: "Exclusion Criteria"
---

# Subject Exclusion Criteria

:::info Coming Soon
This page is under active development. Detailed exclusion criteria with example cases are being added.
:::

## Overview

Not all data is salvageable. Some subjects will need to be excluded from analysis due to excessive motion, failed preprocessing steps, or acquisition issues. Clear, pre-registered exclusion criteria ensure that decisions are objective and reproducible.

## Recommended Exclusion Thresholds

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Average absolute motion | > 2 mm | Exceeds typical voxel size; motion correction becomes unreliable |
| Volumes with severe artifacts | > 5 volumes | Too many corrupted volumes compromise tensor fitting |
| Outlier slice percentage | > 10% | Excessive outlier replacement may bias diffusion estimates |
| Failed skull stripping | Visual fail | Cannot proceed with registration or masking |
| Missing scan types | Any missing | Incomplete acquisitions cannot be fully preprocessed |
| FA values out of range | FA > 1.0 anywhere | Indicates processing error (non-positive-definite tensors) |

## When to Exclude

- **Before preprocessing**: subjects missing required scan types (T1, DWI, fieldmap AP, fieldmap PA)
- **After skull stripping**: subjects with severely failed brain extraction that cannot be fixed by adjusting parameters
- **After EDDY**: subjects exceeding motion thresholds or with excessive artifacts
- **After DTIFIT**: subjects with obviously corrupted FA/MD maps

## Documentation

Record exclusion decisions in your data tracking spreadsheet:
- Which criterion was violated
- The specific metric value
- Whether re-processing was attempted
- Final decision (include/exclude)

## Important Notes

:::caution
Define exclusion criteria **before** looking at the data to avoid bias. Ideally, pre-register your criteria along with your analysis plan.
:::

- These thresholds are guidelines, not absolute rules — adjust based on your sample, scanner, and research question
- Some studies may tolerate more motion (e.g., pediatric populations); document and justify any deviations
- The `--repol` flag in EDDY helps rescue data with moderate outlier slices, but cannot fix extreme motion
