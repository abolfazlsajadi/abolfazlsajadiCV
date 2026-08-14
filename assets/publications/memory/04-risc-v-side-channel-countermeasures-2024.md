---
record_type: paper_memory
citation_key: sajadi2024countermeasures
title: "A Systematic Comparison of Side-channel Countermeasures for RISC-V-based SoCs"
authors:
  - Abolfazl Sajadi
  - Nuša Zidarič
  - Todor Stefanov
  - Nele Mentens
author_focus: Abolfazl Sajadi
year: 2024
publication_type: conference_paper
venue: 2024 IEEE Nordic Circuits and Systems Conference (NorCAS)
pages: 1-7
doi: 10.1109/NorCAS64408.2024.10752477
language: English
source_pdf: ../risc-v-side-channel-countermeasures-2024.pdf
publication_status: published
updated: 2026-08-14
---

# Systematic comparison of power side-channel countermeasures on RISC-V SoCs

## AI retrieval card

Use this paper when comparing masking, noise generation, dummy-instruction insertion, Secure-Ibex, or CoCo-Ibex against power analysis on software AES running on an FPGA-based RISC-V system.

One-sentence contribution: the paper evaluates several software- and hardware-level side-channel countermeasures on one common Ibex/FPGA platform and shows that their security benefits cannot be separated from their very different costs in code size, execution time, FPGA area, power, and energy.

Canonical citation:

> A. Sajadi, N. Zidarič, T. Stefanov, and N. Mentens, “A Systematic Comparison of Side-channel Countermeasures for RISC-V-based SoCs,” in *2024 IEEE Nordic Circuits and Systems Conference (NorCAS)*, pp. 1–7, 2024. doi: 10.1109/NorCAS64408.2024.10752477.

## Problem and motivation

AES is cryptographically strong, but software execution on a physical processor can leak key-dependent information through power consumption. This is especially relevant for edge and IoT nodes that may be deployed in unsupervised locations and built around lightweight RISC-V cores.

Published countermeasures are often evaluated in isolation on different boards, cores, trace-acquisition systems, and attack scripts. Such results do not tell an implementer whether a defense is worth its area, latency, and energy. The paper addresses that comparability gap by placing a representative set of defenses in the same SoC and evaluating them with the same first-order Correlation Power Analysis (CPA) workflow.

## Compared configurations

The study compares six target configurations:

1. **Ibex + Tiny-AES:** unprotected software baseline.
2. **Ibex + Mask-AES:** Boolean-masked AES software with pseudorandom masks.
3. **Ibex + SW-NG:** software-generated noise by mirroring the first-round S-box computation with the same plaintext and a different fixed key.
4. **Ibex + HW-NG:** hardware-generated switching noise from cascaded Shift Register LUTs (SRLs) enabled by pseudorandom control.
5. **Secure-Ibex + Tiny-AES:** a core with data-independent timing features and random dummy-instruction insertion, measured at minimum and maximum insertion frequencies.
6. **CoCo-Ibex + Tiny-AES:** a core designed to support masked software, intentionally tested here with unmasked Tiny-AES to determine whether the microarchitecture alone protects ordinary software.

The defenses cover masking and hiding, algorithm-specific and algorithm-independent approaches, and both software and hardware modifications.

## Experimental platform

The FPGA platform contains a Control SoC and a Target SoC. The control side loads memories, sends plaintexts, receives ciphertexts, and controls optional units. The target side contains the selected Ibex-family core and executes the AES implementation. This split supports consistent triggering and configuration while isolating the target being measured.

Important setup facts:

- Target board: ChipWhisperer CW305 with a Xilinx XC7A100T Artix-7 FPGA.
- Target clock: 50 MHz.
- Trace acquisition: ChipWhisperer-Husky at 200 MHz.
- Attack point: the S-box computation in the first AES round.
- Leakage model/attack: Hamming-weight-based first-order CPA, attacking the 16 key bytes independently.
- Direct power measurement for cost analysis: Nordic Semiconductor Power Profiler Kit II. The board clock was reduced to 630 kHz and power was averaged over 1,000 measurements to improve measurement resolution.
- The same acquisition and CPA workflow is used across configurations to improve fairness.

## Security findings

### Unprotected baseline

Tiny-AES on standard Ibex leaks strongly. Approximately 250 traces are sufficient to distinguish each correct subkey and recover all 16 AES key bytes in the reported setup.

### Software masking

Mask-AES is the strongest tested software-level defense under first-order CPA. No distinguishable correct-key correlation is found for any subkey with 21,000 traces. Its cost is mainly software: code size grows by 2.03× and execution time by 1.47×.

### Software-generated noise

Mirroring the S-box with a fixed wrong key creates a second strong correlation peak. Depending on the key byte, the wrong-key peak can be higher than the real one or nearly equal to it. This creates ambiguity but does not eliminate the real signal; candidate combinations can still be searched. The result is a delay/complication defense rather than reliable suppression of leakage.

### Hardware-generated noise

SRL switching lowers the signal-to-noise ratio. Some bytes require at least about 400 traces, and some appear less distinguishable in the measured range. However, correct-key correlation grows as more traces are collected, so the paper concludes that the countermeasure can be bypassed with a larger trace set. It also consumes 3.98× the FPGA LUTs of the baseline.

### Secure-Ibex

Neither the minimum- nor maximum-insertion setting reveals a clear correct-key distinguisher within 18,000 traces. Random dummy instructions disrupt the temporal alignment CPA normally exploits. The trade-off is execution time: 1.41× for the minimum setting and 5.13× for the maximum setting. The maximum setting also raises measured energy from 576.48 µJ for the baseline to 3,188 µJ.

### CoCo-Ibex with unmasked AES

Unmasked Tiny-AES on CoCo-Ibex behaves like the unprotected baseline, with the full key recoverable using roughly 250 traces. This is not a failure of CoCo’s intended design: CoCo-Ibex is meant to preserve the security assumptions of masked/share-based software, not automatically protect unmasked AES. The result is a useful warning against treating a security-oriented core name as application-independent protection.

## Cost results

The baseline uses 11,559 cycles, 18.35 ms at the measurement configuration, 31.42 mW, and 576.48 µJ. Selected reported comparisons are:

| Configuration | Security result in tested CPA | Principal cost |
|---|---|---|
| Mask-AES | No key recovery in 21K traces | 2.03× code, 1.47× time |
| Secure-Ibex-min | No key recovery in 18K traces | 1.41× time; 878.65 µJ |
| Secure-Ibex-max | No key recovery in 18K traces | 5.13× time; 3,188 µJ |
| HW-NG | Some bytes recoverable at ≥400 traces; trend grows | 3.98× LUTs; 37.41 mW |
| SW-NG | Ambiguous but recoverable candidate peaks | 1.34× controller code in this platform |
| CoCo-Ibex + unmasked Tiny-AES | Similar to baseline | 1.4× LUTs, 1.52× flip-flops |

The broader finding is that each defense stresses a different resource. Masking consumes software footprint and runtime, Secure-Ibex primarily consumes runtime and energy, and hardware noise primarily consumes FPGA area and power. A single scalar “overhead” would hide the actual integration decision.

## What is novel

The principal novelty is the systematic, same-platform comparison rather than a new countermeasure. The study aligns the core, algorithm, FPGA, trace capture, CPA, timing, and power methodology so that designers can interpret security and implementation cost together. It also evaluates a specialized masked-software core with unmasked AES, clarifying the boundary of its protection.

## When to cite this paper

Cite it for:

- experimental security/cost trade-offs among masking, noise, and dummy instructions;
- CPA on Tiny-AES executed by Ibex on FPGA;
- the result that noise tends to delay rather than eliminate first-order CPA;
- software masking versus Secure-Ibex as strong but differently costly options;
- why CoCo-Ibex does not protect unmasked software by itself;
- implementation-aware selection of side-channel countermeasures for constrained RISC-V SoCs.

## Limits and non-claims

- The attack is first-order, non-profiled CPA against the first-round S-box under a cooperative trigger. The paper does not establish resistance to higher-order, profiled/deep-learning, horizontal, electromagnetic, fault, or combined attacks.
- “No key recovery in 18K/21K traces” is a bounded experimental result, not proof that recovery is impossible with more traces or a stronger attack.
- Measurements are tied to the CW305 Artix-7 implementation, selected clocking, capture equipment, synthesis choices, and software versions.
- The CoCo-Ibex experiment uses unmasked Tiny-AES. It should not be cited to claim that CoCo-Ibex is ineffective for its intended masked-software use case.
- SW-NG reuses the Control SoC for the mirrored computation, so its reported code/resource accounting is platform-specific.
- The comparison helps design selection but does not identify one universally best countermeasure.

## Author-specific evidence for the CV

Abolfazl Sajadi is first author. The paper does not include a CRediT statement, so specific tasks should not be assigned to individual authors solely from author order.

## Related papers in this collection

- [The 2026 poster](07-aes-risc-v-countermeasures-poster-2026.md) is a concise restatement of this full study for Computing Frontiers. Prefer this NorCAS paper for complete methodology and original detailed evidence.
- [PROACT](05-proact-2024.md) provides the larger project context for the dual-SoC measurement platform and physical-security design flow.
- [ASSESS](06-pre-silicon-leakage-analysis-assess-2026.md) moves from post-implementation CPA comparison to fast pre-silicon leakage localization.

## Search aliases and concepts

`RISC-V side-channel countermeasures`, `Ibex power analysis`, `Tiny-AES CPA`, `Mask-AES`, `Secure-Ibex`, `CoCo-Ibex`, `software-generated noise`, `hardware noise generator`, `SRL noise`, `dummy instruction insertion`, `ChipWhisperer CW305`, `security overhead trade-off`, `FPGA side-channel analysis`.

## BibTeX

```bibtex
@inproceedings{sajadi2024countermeasures,
  author    = {Sajadi, Abolfazl and Zidari\v{c}, Nu\v{s}a and Stefanov, Todor and Mentens, Nele},
  title     = {A Systematic Comparison of Side-channel Countermeasures for {RISC-V}-based {SoCs}},
  booktitle = {2024 IEEE Nordic Circuits and Systems Conference (NorCAS)},
  pages     = {1--7},
  year      = {2024},
  doi       = {10.1109/NorCAS64408.2024.10752477}
}
```
