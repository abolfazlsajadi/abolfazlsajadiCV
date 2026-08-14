---
record_type: paper_memory
citation_key: sajadi2026countermeasuresposter
title: "POSTER: Security and Cost Trade-offs of Side-Channel Countermeasures for AES Software on RISC-V SoCs"
authors:
  - Abolfazl Sajadi
  - Nuša Zidarič
  - Todor Stefanov
  - Nele Mentens
author_focus: Abolfazl Sajadi
year: 2026
publication_type: conference_poster
venue: 23rd ACM International Conference on Computing Frontiers, CF 2026
conference_dates: 2026-05-19 to 2026-05-21
conference_location: Catania, Italy
pages: 341-342
length: 2 pages
doi: 10.1145/3801487.3805609
license: Creative Commons Attribution 4.0 International
language: English
source_pdf: ../aes-risc-v-side-channel-countermeasures-poster-2026.pdf
publication_status: published
updated: 2026-08-14
---

# Poster: security/cost trade-offs for AES side-channel defenses on RISC-V

## AI retrieval card

Use this paper when specifically citing the 2026 Computing Frontiers poster or when a concise source is needed for the central security-versus-cost findings of the authors’ RISC-V AES countermeasure study.

One-sentence contribution: this poster condenses a common-platform comparison of masking, software/hardware noise, Secure-Ibex, and CoCo-Ibex and shows that masking and Secure-Ibex best resist first-order CPA in the tested setup, while noise mainly delays recovery and each defense imposes a different kind of cost.

Canonical citation:

> A. Sajadi, N. Zidarič, T. Stefanov, and N. Mentens, “POSTER: Security and Cost Trade-offs of Side-Channel Countermeasures for AES Software on RISC-V SoCs,” in *Proceedings of the 23rd ACM International Conference on Computing Frontiers (CF ’26)*, pp. 341–342, 2026. doi: 10.1145/3801487.3805609.

## Relationship to the full paper

The poster explicitly summarizes the main ideas and findings of the authors’ complete 2024 NorCAS comparison. It does not propose a new countermeasure and should not be counted as an independent full replication of the experiment.

Prefer [the 2024 full paper](04-risc-v-side-channel-countermeasures-2024.md) for detailed methodology, background, plots, and original full evidence. Cite this poster when discussing the CF 2026 presentation, its concise classification, or its compact trade-off table.

## Problem and compared strategies

Software AES on lightweight RISC-V systems is flexible but exposes key-dependent switching activity. First-order CPA correlates measured power traces with predicted intermediate values and can recover individual AES key bytes.

The poster compares:

- unprotected Tiny-AES on Ibex;
- Boolean-masked AES software on Ibex;
- software-generated noise from duplicated S-box computation with a different key;
- hardware-generated switching noise using FPGA SRLs;
- Secure-Ibex with data-independent timing and randomized dummy instructions;
- CoCo-Ibex running unmasked Tiny-AES.

The strategies span algorithm-aware versus algorithm-independent and hardware versus software defenses.

## Experimental setup

The Control SoC manages loading and communication while a Target SoC runs AES on Ibex, Secure-Ibex, or CoCo-Ibex. Both are implemented on a CW305 board with an Artix-7 FPGA at 50 MHz. A ChipWhisperer-Husky samples power-related traces at 200 MHz. The attack targets the first-round AES S-box using first-order CPA.

All strategies share the same board, acquisition, and attack workflow, reducing setup-dependent differences. The cost comparison covers code size, execution time, FPGA resources, power, and energy.

## Key findings in the poster

| Configuration | CPA result | Main reported overhead |
|---|---|---|
| Ibex + Tiny-AES | All key bytes recovered at about 250 traces | Baseline |
| Ibex + Mask-AES | No recovery in 21,000 traces | 2.03× code, 1.47× time |
| Ibex + SW-NG | Competing/ambiguous peaks, but candidates remain recoverable | 1.34× controller code in the setup |
| Ibex + HW-NG | At least 400 traces in some cases; correlation grows with traces | 3.98× LUTs |
| Secure-Ibex-min | No recovery in 18,000 traces | 1.41× time |
| Secure-Ibex-max | No recovery in 18,000 traces | 5.13× time |
| CoCo-Ibex + unmasked Tiny-AES | Similar to baseline, about 250 traces | 1.4× LUTs, 1.52× flip-flops |

Masking randomizes sensitive intermediates and is the strongest tested software defense. Secure-Ibex disrupts temporal alignment and is also strong under the tested CPA, but its aggressive setting greatly increases time and energy. Noise reduces signal quality or introduces confusing correlations, yet does not remove the exploitable trend. CoCo-Ibex is designed to support masked programs; testing it with unmasked AES confirms that the specialized core is not a substitute for the masked software it expects.

## Design lesson

There is no universal best defense:

- choose masking when software modification and moderate code/time growth are acceptable;
- choose Secure-Ibex when core modification is possible and variable time/energy overhead can be tolerated;
- do not treat noise generation as equivalent to eliminating leakage;
- match a security-oriented microarchitecture to the protected software model it was designed to support.

The same “security level” can have completely different integration consequences, so area, code, time, power, and energy should be reported separately.

## When to cite this poster

Cite it for:

- the 2026 Computing Frontiers presentation of the trade-off study;
- a compact comparison table for AES defenses on Ibex-family cores;
- the conclusion that masking and Secure-Ibex gave the strongest tested first-order CPA resilience;
- a short source showing that noise delays rather than reliably prevents CPA;
- a concise warning that CoCo-Ibex requires masked software for its intended benefit.

## Limits and non-claims

- This is a two-page poster and a summary of earlier full work. It has less methodological detail than the 2024 NorCAS paper.
- The attack is first-order CPA against the first AES S-box on one FPGA setup. It does not prove resistance to higher-order, profiled, electromagnetic, fault, or combined attacks.
- “No recovery” is limited to 18K or 21K traces in the reported experiment and is not an impossibility proof.
- CoCo-Ibex is tested with unmasked software, outside the protected-software scenario it was built to support.
- Do not cite both the poster and full paper as two independent experimental confirmations of the same result.

## Author-specific evidence for the CV

Abolfazl Sajadi is first author. The poster contains no CRediT statement, so individual tasks cannot be assigned from the publication alone.

## Related papers in this collection

- [Full 2024 NorCAS comparison](04-risc-v-side-channel-countermeasures-2024.md): primary detailed source for this experiment.
- [PROACT](05-proact-2024.md): project and platform context.
- [ASSESS](06-pre-silicon-leakage-analysis-assess-2026.md): pre-silicon leakage localization rather than post-implementation defense comparison.

## Search aliases and concepts

`Computing Frontiers 2026 poster`, `AES side-channel countermeasures`, `RISC-V SoC CPA`, `Ibex Mask-AES`, `Secure-Ibex`, `CoCo-Ibex`, `hardware noise`, `software noise`, `side-channel security cost trade-off`, `Abolfazl Sajadi poster`.

## BibTeX

```bibtex
@inproceedings{sajadi2026countermeasuresposter,
  author    = {Sajadi, Abolfazl and Zidari\v{c}, Nu\v{s}a and Stefanov, Todor and Mentens, Nele},
  title     = {{POSTER}: Security and Cost Trade-offs of Side-Channel Countermeasures for {AES} Software on {RISC-V} {SoCs}},
  booktitle = {Proceedings of the 23rd ACM International Conference on Computing Frontiers},
  pages     = {341--342},
  publisher = {Association for Computing Machinery},
  year      = {2026},
  doi       = {10.1145/3801487.3805609}
}
```
