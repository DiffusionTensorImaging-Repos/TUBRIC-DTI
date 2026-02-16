---
sidebar_position: 8
title: "Environment Setup"
---

# Setting Up Your Neuroimaging Environment

:::info Coming Soon
This page is under active development. A complete guide to setting up your computing environment is being written.
:::

## System Requirements

DTI preprocessing is computationally intensive. Recommended specifications:
- **OS**: Linux (Ubuntu 20.04+ recommended), macOS
- **RAM**: 64-128 GB for parallel processing
- **CPU**: Multi-core (8+ cores recommended)
- **Storage**: ~2-5 GB per subject for all derivatives
- **GPU**: Optional but significantly speeds up `eddy_cuda`

## Remote Access via SSH

Most neuroimaging work is done on shared Linux workstations or clusters:

```bash
ssh -XY username@hostname
```

The `-XY` flags enable X11 forwarding for GUI applications like FSLeyes.

## PATH Management

After installing tools, add them to your PATH:

```bash
# Add to ~/.bashrc or ~/.bash_profile
export FSLDIR="/usr/local/fsl"
source $FSLDIR/etc/fslconf/fsl.sh
export ANTSPATH="/path/to/ANTs/bin"
export PATH="$ANTSPATH:$FSLDIR/bin:/path/to/mrtrix3/bin:$PATH"
```

## Running Long Jobs

DTI preprocessing steps can run for hours. Use these strategies to prevent job loss:

```bash
# nohup: survives SSH disconnection
nohup ./my_script.sh > output.log 2>&1 &

# screen: persistent terminal session
screen -S dti_processing
# (run your command, then Ctrl+A, D to detach)
screen -r dti_processing  # reattach later

# tmux: alternative to screen
tmux new -s dti
```

## Monitoring Resources

```bash
free -h          # Available RAM
nproc            # Number of CPU cores
df -h            # Disk space
htop             # Interactive process viewer
tail -f log.txt  # Follow log output
```
