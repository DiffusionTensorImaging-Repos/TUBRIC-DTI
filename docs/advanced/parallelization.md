---
sidebar_position: 2
title: "Parallelization"
---

# Parallel Processing in DTI Pipelines

:::info Coming Soon
This page is under active development. Advanced parallelization patterns and resource management strategies are being added.
:::

## Overview

DTI preprocessing involves running the same operations on many subjects independently. Parallelization dramatically reduces total processing time by running multiple subjects simultaneously — but requires careful resource management to avoid crashes.

## Resource Estimation

Before parallelizing, estimate the per-subject resource requirements:

| Stage | RAM per Subject | CPU Cores | Typical Duration |
|-------|----------------|-----------|-----------------|
| dcm2niix | ~200 MB | 1 | < 1 min |
| ANTs skull stripping | 2-3 GB | 1-2 | 30-60 min |
| TOPUP | ~1 GB | 1 | 5-15 min |
| EDDY | 4-8 GB | 1-4 | 30-90 min |
| BedpostX | 4-8 GB | 1-2 | 6-24 hours |
| DTIFIT | ~500 MB | 1 | < 1 min |

## Calculating max_jobs

```bash
# Check available memory
available_gb=$(free -g | awk '/^Mem:/{print $7}')
ram_per_job=3  # GB, adjust per stage

max_jobs=$((available_gb / ram_per_job))
echo "Safe to run $max_jobs jobs in parallel"
```

## Bash Parallel Pattern

```bash
max_jobs=8
job_count=0

for subj in "${subjects[@]}"; do
    process_subject "$subj" &
    ((job_count++))

    if (( job_count >= max_jobs )); then
        wait -n
        ((job_count--))
    fi
done

wait  # Wait for all remaining jobs
```

## Using nohup for SSH Resilience

```bash
# Write your batch script to a file
nano run_batch.sh
# ... paste your parallel script ...
chmod +x run_batch.sh

# Run with nohup
nohup ./run_batch.sh > batch.log 2>&1 &

# Monitor progress
tail -f batch.log
```

## Tips

- Start conservative — if you estimate 30 jobs are safe, try 20 first
- Monitor with `htop` during the first batch to verify resource usage
- Lightweight stages (dcm2niix, fslmaths, dtifit) can use high parallelism (30-60 jobs)
- Heavy stages (ANTs, EDDY, BedpostX) need lower parallelism (4-10 jobs)
