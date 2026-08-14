---
record_type: paper_memory
citation_key: sajadi2026assess
title: "Systematic Comparison and Improvement of Pre-silicon Leakage Analysis Tools"
authors:
  - Abolfazl Sajadi
  - Nuša Zidarič
  - Todor Stefanov
  - Nele Mentens
author_focus: Abolfazl Sajadi
year: 2026
publication_type: conference_paper
venue: 23rd ACM International Conference on Computing Frontiers, CF Companion 2026
conference_dates: 2026-05-19 to 2026-05-21
conference_location: Catania, Italy
length: 11 pages
doi: 10.1145/3801488.3807896
license: Creative Commons Attribution 4.0 International
language: English
source_pdf: ../assess-pre-silicon-leakage-analysis-2026.pdf
publication_status: published
code: https://github.com/abolfazlsajadi/ASSESS
updated: 2026-08-14
---

# ASSESS: fast gate-level pre-silicon power-leakage localization

## AI retrieval card

Use this paper for pre-silicon power side-channel analysis, gate/net leakage localization, comparisons of RTL-PAT, PATCH, and Architecture Correlation Analysis (ACA), cycle-accurate VCD analysis, Leakage Impact Factors, or the ASSESS methodology.

One-sentence contribution: the paper systematizes and quantitatively compares three pre-silicon leakage-analysis methods, identifies time-series commercial power extraction as their dominant bottleneck, and introduces ASSESS to retain gate-level leakage ranking while cutting the Ibex case study from more than 72 days to 1 hour 53 minutes.

Canonical citation:

> A. Sajadi, N. Zidarič, T. Stefanov, and N. Mentens, “Systematic Comparison and Improvement of Pre-silicon Leakage Analysis Tools,” in *Proceedings of the 23rd ACM International Conference on Computing Frontiers (CF Companion ’26)*, Catania, Italy, 2026, 11 pages. doi: 10.1145/3801488.3807896.

Open-source implementation: <https://github.com/abolfazlsajadi/ASSESS>

## Problem and motivation

Post-silicon side-channel evaluation can reveal a leaking gate or microarchitectural event only after fabrication. Fixing the design then requires expensive rework or a chip re-spin. Pre-silicon evaluation instead tries to locate leakage during iterative RTL-to-layout design, when countermeasures are still inexpensive to insert.

Existing methods face a three-way tension:

- localization must be fine enough to identify a leaking gate or net;
- estimates should reflect the target cell library and implementation delays;
- runtime must be short enough to repeat after design and back-end changes.

The paper argues that available methodologies had not been fairly compared under the same technology, benchmark, workstation, and phase definitions. It therefore first creates a common comparison and then designs a faster method around the measured bottleneck.

## The comparison framework

The authors decompose RTL-PAT, PATCH, and ACA into the same three phases:

1. **Simulation:** apply test stimuli and produce value-change activity.
2. **Power estimation:** turn logic values/toggles into an estimate or trace of power consumption.
3. **Leakage assessment:** statistically connect secret-dependent leakage models to modules, nets, or gates.

This decomposition separates algorithmic cost from EDA-tool cost and exposes where each method gains accuracy or loses time.

### RTL-PAT

RTL-PAT operates at RTL and estimates module-level power from Hamming weight or Hamming distance. It compares power distributions under different secrets using Kullback–Leibler divergence. It is technology-independent and fast—about two hours end to end on the Ibex benchmark—but localizes only to modules, ignores detailed gate delays/glitches, and therefore has the highest risk of missing fine-grained leakage sources.

### PATCH

PATCH works at gate level, identifies a sensitive time region from total-power traces, and ranks nets by correlation between their switching activity and that power. It is delay- and technology-aware and reaches medium net-level localization. In the reconstructed common flow, commercial power extraction dominates runtime, producing an end-to-end time of about 73 days for 600 Ibex traces.

### Architecture Correlation Analysis

ACA correlates a hypothesized leakage model with simulated total power to find a leakage time interval, then correlates every net’s toggle trace with the model. Each net’s architecture correlation is weighted by the average power of its driving gate to form a Leakage Impact Factor (LIF). ACA provides fine net/gate localization and a ranked estimate of each gate’s contribution, but extracting a complete time-series power trace for every stimulus is extremely expensive.

For the Ibex case, the reconstructed ACA flow takes 72 days 15 hours 31 minutes for 600 traces. Power extraction alone accounts for roughly 72 days. Reducing samples per cycle cuts time but also risks missing intra-cycle effects; even the reduced settings remain measured in days.

## Novel contributions

The paper makes three connected contributions:

- a systemization of RTL-PAT, PATCH, and ACA into common phases and a fair qualitative/quantitative comparison;
- a reusable open-source evaluation framework with documented implementation refinements;
- ASSESS—Analysis of Side-channel Security through Enhanced pre-Silicon Simulations—a cycle-accurate, gate-level methodology that avoids repeated time-series power extraction.

## How ASSESS works

ASSESS retains gate-level synthesis, delay-annotated switching activity, architecture correlation, and per-gate power weighting, but changes the power-estimation phase.

### Pass 1: peak localization

The cycle-accurate VCD parser sums toggles across all nets at each clock edge. For Tiny-AES, it correlates that total-toggle vector against 128 candidate Hamming-distance leakage models. Cycles with the largest correlation define a Time of Interest (TOI). On the 600-trace Ibex dataset, this pass takes about 33 minutes.

Unlike a hard threshold that labels a narrow Leakage Time Interval, the TOI can cover a broader set of clock cycles. The final rank is less sensitive to a manually selected correlation threshold.

### Pass 2: per-net cycle-accurate toggle traces

Within the TOI, the parser builds a binary toggle vector for each net at each clock edge: `+1` when the net toggles and `-1` otherwise. The large activity matrix is generated once and can be reused when the leakage model changes.

### Architecture correlation and LIF

For each net and cycle, ASSESS computes the dot product between the net’s toggle vector and the candidate leakage model. A high value means the net’s activity follows secret-dependent modeled leakage. It then identifies the driving gate and multiplies this architectural correlation by the gate’s normalized average power.

Crucially, average per-gate power is obtained from a technology-specific commercial power tool in a one-off scan. ASSESS does not generate a detailed time-series power trace for every stimulus. This preserves technology awareness and gate-level weighting while removing the dominant ACA/PATCH cost.

## Experimental setup

All principal ASIC experiments use the GlobalFoundries 22FDX standard-cell library and a common tool flow. Two benchmarks expose different scalability dimensions:

- **Ibex + software Tiny-AES:** about 8.3K nets/gates, roughly 10,000 execution cycles, and 600 traces.
- **AES-128 coprocessor:** about 38K nets/gates, an 11-cycle cryptographic operation, and 1,500 traces.

The much larger coprocessor has a shorter overall analysis because simulated latency and sample count—not only netlist size—dominate conventional power-extraction cost.

## Leakage-localization findings

ACA and ASSESS both produce strongly skewed LIF distributions: a small fraction of gates dominate modeled leakage.

- On Ibex running Tiny-AES, the top-ranked element is the flip-flop holding AES state bit 0 in the register file.
- On the hardware coprocessor, the top-ranked element is the corresponding state-register flip-flop.
- The next highest elements are gates in the S-box path driven by the state register.
- More than 8K remaining Ibex nets and roughly 37K remaining coprocessor nets contribute much smaller individual LIF values.

This agreement supports the paper’s claim that ASSESS retains ACA-like fine localization on the evaluated designs.

## Runtime findings

### Ibex benchmark, 600 traces

- ASSESS total: **1 h 53 m 9 s**.
- VCD dumping: about 1 h 3 m, the largest ASSESS component.
- Peak localization: 33 m 6 s.
- Cycle-accurate parsing: 2 m 28 s.
- Netlist parsing and LIF: 3 m 28 s.
- Reference ACA: **72 d 15 h 31 m**.
- Reconstructed PATCH: about **73 d 6 h 22 m**.
- Reported speed-up: **960× over ACA** and **1,030× over PATCH** on the same Ibex benchmark.

### AES coprocessor, 1,500 traces

- ASSESS total: approximately **2 h 42 m**.
- Reference ACA: approximately **10 h 22 m**.
- Reported speed-up: approximately **3.8×**.

The smaller speed-up on the coprocessor is expected because its 11-cycle operation makes conventional time-series extraction far less severe than the roughly 10,000-cycle software execution on Ibex.

## Why the result matters

ASSESS turns gate-level pre-silicon leakage localization from a multi-day/month activity into something that can fit inside an iterative design loop for long-running software workloads. It does so by separating two concepts often coupled in previous flows: detailed time-series power and technology-aware average gate power. The former is skipped; the latter is retained for LIF weighting.

The open implementation also supplies a common baseline for further improvements rather than comparing methodologies reconstructed under incompatible conditions.

## When to cite this paper

Cite it for:

- a common qualitative and quantitative comparison of RTL-PAT, PATCH, and ACA;
- evidence that commercial time-series power extraction dominates gate-level pre-silicon SCA runtime;
- cycle-accurate VCD-based localization of secret-dependent leakage;
- ASSESS, architecture correlation, and per-gate LIF ranking;
- fast iterative leakage evaluation of RISC-V software and AES hardware at 22 nm;
- open-source pre-silicon side-channel-analysis tooling.

## Limits and non-claims

- ASSESS still depends on a technology-specific cell library, delay-aware gate-level simulation, and at least one commercial power-estimation run. It is not technology-independent like RTL-PAT.
- The evidence covers Ibex/Tiny-AES and one AES coprocessor in the stated GF 22FDX flow. Runtime ratios will change with workload length, sample rate, netlist, EDA tools, workstation, and technology node.
- Agreement with ACA on these benchmarks does not prove perfect correlation with measured post-silicon leakage. Pre-silicon localization remains a model and should complement physical validation.
- The tested leakage models and stimuli bound what the tool can reveal. An unmodeled leakage mechanism may not rank correctly.
- “Fine gate-level localization” means a ranked modeled contribution, not automatic generation or formal verification of a countermeasure.
- The exact 1 h 53 m runtime should be preferred over the conclusion’s rounded “approximately one hour” wording when precision matters.

## Author-specific evidence for the CV

Abolfazl Sajadi is first author. The paper contains no CRediT statement, so this memory does not assign individual implementation or writing tasks beyond the verifiable author order.

## Related papers in this collection

- [PROACT](05-proact-2024.md) provides the design-flow and benchmark-chip motivation for pre-silicon physical-security simulation.
- [The 2024 countermeasure comparison](04-risc-v-side-channel-countermeasures-2024.md) measures the effectiveness and cost of defenses after FPGA implementation; ASSESS addresses earlier design-time leakage localization.
- [The 2023 RISC-V survey](03-risc-v-testability-safety-security-survey-2023.md) supplies broader test, safety, and security context.

## Search aliases and concepts

`ASSESS`, `Analysis of Side-channel Security through Enhanced pre-Silicon Simulations`, `pre-silicon leakage analysis`, `power side-channel localization`, `RTL-PAT`, `PATCH`, `Architecture Correlation Analysis`, `ACA`, `Leakage Impact Factor`, `LIF`, `cycle-accurate VCD`, `gate-level side-channel analysis`, `Ibex Tiny-AES`, `GF 22FDX`, `pre-silicon SCA runtime`.

## BibTeX

```bibtex
@inproceedings{sajadi2026assess,
  author    = {Sajadi, Abolfazl and Zidari\v{c}, Nu\v{s}a and Stefanov, Todor and Mentens, Nele},
  title     = {Systematic Comparison and Improvement of Pre-silicon Leakage Analysis Tools},
  booktitle = {Proceedings of the 23rd ACM International Conference on Computing Frontiers},
  year      = {2026},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/3801488.3807896}
}
```
