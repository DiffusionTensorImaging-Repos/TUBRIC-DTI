---
sidebar_position: 1
title: "Quality Control Overview"
---

# Quality Control

For most pipeline stages, QC just means checking that the output files exist and are not empty. The two stages that need a closer look are **skull stripping** and **eddy correction**.

- **Skull stripping (Step 2)** — Open the result in FSLeyes and confirm the brain is fully preserved with the skull removed. See [Visual Inspection](./visual-inspection).
- **Eddy correction (Step 8)** — Run `eddy_quad` to get motion and outlier metrics. Subjects with too much motion get excluded. See [Eddy QC](./eddy-qc).

For file existence checks, see [Pipeline Verification Scripts](./audit-scripts). For exclusion thresholds, see [Exclusion Criteria](./exclusion-criteria).
