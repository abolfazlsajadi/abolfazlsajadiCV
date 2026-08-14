---
record_type: paper_memory
citation_key: anders2023riscvsurvey
title: "A Survey of Recent Developments in Testability, Safety and Security of RISC-V Processors"
authors:
  - Jens Anders
  - Pablo Andreu
  - Bernd Becker
  - Steffen Becker
  - Riccardo Cantoro
  - Nikolaos I. Deligiannis
  - Nourhan Elhamawy
  - Tobias Faller
  - Carles Hernandez
  - Nele Mentens
  - Mahnaz Namazi Rizi
  - Ilia Polian
  - Abolfazl Sajadi
  - Mathias Sauer
  - Denis Schwachhofer
  - Matteo Sonza Reorda
  - Todor Stefanov
  - Ilya Tuzov
  - Stefan Wagner
  - Nuša Zidarič
author_focus: Abolfazl Sajadi
year: 2023
publication_type: conference_survey
venue: 28th IEEE European Test Symposium (ETS 2023), Special Session Paper
doi: 10.1109/ETS56758.2023.10174099
language: English
source_pdf: ../risc-v-testability-safety-security-survey-2023.pdf
publication_status: published
updated: 2026-08-14
---

# Survey of RISC-V testability, safety, and security

## AI retrieval card

Use this paper for broad questions at the intersection of RISC-V processors and functional testing, system-level testing, safety-critical design, timing verification, cryptographic acceleration, side-channel resilience, secure boot, roots of trust, and trusted execution environments.

One-sentence contribution: this survey connects three normally separate concerns—testability, functional/timing safety, and hardware-oriented security—and explains how RISC-V’s open, modular ISA and open-source cores create both opportunities and new engineering requirements in all three.

Canonical citation:

> J. Anders *et al.*, “A Survey of Recent Developments in Testability, Safety and Security of RISC-V Processors,” in *2023 28th IEEE European Test Symposium (ETS)*, 2023. doi: 10.1109/ETS56758.2023.10174099.

## Scope and motivation

RISC-V’s open ISA lets researchers and companies inspect, modify, and extend processor implementations without proprietary ISA licensing. This openness accelerated adoption, but a processor is not product-ready simply because it executes the ISA correctly. Manufactured systems must be tested, safety-critical execution must tolerate faults and meet timing guarantees, and security-sensitive systems must protect keys, code, and data against software and physical attacks.

The paper is a cross-domain snapshot of work available by 2023. It first discusses functional and system-level testing, then safety in the functional and timing domains, and finally security from cryptographic, microarchitectural, ISA, and system perspectives.

## Organizing framework

The survey uses selected open and academic RISC-V cores—such as Rocket, BOOM, Ibex/CV32E40P, CVA6, VexRiscv, PicoRV32, SCARV, and SweRV—as reference points. It records supported ISA variants, pipeline organization, optional features, system interfaces, and whether FPGA and/or ASIC implementations exist. This makes the rest of the discussion concrete: test, safety, and security methods depend not just on “RISC-V” in general but on the chosen microarchitecture, extensions, and integration interfaces.

## Part I: functional and system-level test

### Software-Based Self-Test

Software-Based Self-Test (SBST) runs processor-native programs to detect permanent faults at speed without requiring all testing to pass through dedicated design-for-test structures. Creating effective SBST programs manually is difficult because hard-to-test faults are architecture-dependent and fault effects can be non-intuitive.

RISC-V helps because its base ISA and extensions have open formal specifications. A test generator can reuse those formal descriptions to derive legal instructions, control/status-register behavior, and memory constraints. Because the ISA is modular, specifications and generated tests can be reused across cores that implement overlapping extension sets instead of starting from zero for every processor.

### System-Level Test

System-Level Test (SLT) must detect failures that appear only after a complete SoC is assembled and running realistic workloads. Traditional gate-level fault simulation is often too slow or too detached from whole-system behavior. The survey describes a greybox approach in which open RISC-V tools, cores, generators, and monitors provide feedback to fuzzing or test-program generation.

Frameworks such as Chipyard allow researchers to generate SoCs, instrument interconnects, observe bus activity, and optimize test snippets for non-functional properties such as contention, power, and timing. The same openness supports combinations with commercial fault simulation, power tools, and FPGA acceleration.

## Part II: RISC-V for safety-related applications

The safety discussion separates functional correctness from timing correctness.

### Functional correctness

Common safety mechanisms include:

- error-correcting codes for register files, caches, interconnects, and memories;
- dual modular redundancy or dual-core lockstep for fault detection;
- triple modular redundancy when correction as well as detection is required;
- memory scrubbing, fault containment, and diverse redundant implementations to reduce common-mode failures;
- fault injection and diagnostic analysis to measure coverage and locate weak points.

RISC-V’s modularity can reduce fragmentation in safety-critical processors, but certification still depends on implementation-specific evidence. An open ISA does not automatically make a core safe.

### Timing correctness

Safety standards require bounded software execution and freedom from temporal interference. Worst-case execution time analysis becomes harder with caches, branch prediction, out-of-order execution, shared memories, and multicore contention. The survey therefore discusses timing-predictable architectures, temporal/spatial isolation, resource reservation, and monitoring.

It reviews examples of RISC-V processors and platforms built for predictable or safety-related operation, illustrating the trade-off between determinism, performance, flexibility, and implementation cost.

## Part III: RISC-V for security applications

### Three linked perspectives

The paper organizes cryptographic hardware/software co-design through three perspectives:

1. **Cryptographic perspective:** protocols depend on primitives, and primitives depend on building blocks such as finite-field arithmetic, substitutions, permutations, and hashing operations.
2. **Hardware perspective:** acceleration may be integrated into the core datapath or attached as a tightly/loosely coupled coprocessor.
3. **ISA perspective:** a design may use only the base ISA, standardized cryptographic extensions, or custom instructions whose granularity ranges from a small operation to an entire cryptographic round or primitive.

This framework helps explain why there is no single “best” RISC-V crypto extension. Granularity changes area, performance, reuse, verification effort, and side-channel exposure.

### Surveyed security implementations

The survey tabulates RISC-V systems supporting conventional cryptography, post-quantum cryptography, lightweight cryptography, and secure communication protocols. Examples include AES, SHA-2/SHA-3, elliptic-curve operations, lattice-based primitives such as Kyber and NewHope, and lightweight finalists such as Ascon. It distinguishes custom datapath instructions, vector interfaces, standalone accelerators, and memory-mapped coprocessors.

It also notes the standardization effort for RISC-V cryptographic instructions: scalar/entropy-source instructions suit smaller cores, while vector cryptographic instructions target machines with vector registers and higher throughput.

### Side-channel resilience

Mathematically secure algorithms can leak through power, electromagnetic emanation, or timing. The survey reviews several RISC-V-specific defenses:

- constant-time or simple-power-analysis-hardened coprocessors;
- secure pipelines and custom instructions for masked computation;
- masked ALUs and random-bit support;
- core modifications found through formal co-design/co-verification;
- microarchitectural changes intended to prevent secret-share recombination or clear hidden state.

The paper emphasizes that custom hardware can improve performance while also creating or mitigating physical leakage. Security must be evaluated at implementation level.

### System security

The final security section covers roots of trust, trusted boot, memory isolation, attestation, and trusted execution environments. Sanctum and Keystone illustrate combinations of immutable boot code, protected secrets, physical memory protection, cryptographic accelerators, random-number generation, and isolated enclaves. The survey connects these system mechanisms to RISC-V cores rather than treating cryptography as an isolated coprocessor problem.

## Main takeaways

- Test, safety, and security are prerequisites for real RISC-V products, not optional follow-up topics.
- Many established techniques transfer from other processor families, but RISC-V’s openness and modular extensions enable more reusable, transparent, and automated solutions.
- Openness also broadens the design space: results must be tied to a concrete core, extension set, and system integration.
- Product-quality solutions require sustained collaboration among ISA architects, processor designers, test engineers, safety specialists, and hardware-security researchers.
- Because the ecosystem changes quickly, the paper is explicitly a 2023 snapshot rather than a final catalog.

## When to cite this paper

Cite this survey for:

- an overview of RISC-V functional test, SBST, and SLT research;
- why formal/open ISA specifications help automated test generation;
- RISC-V in safety-critical and timing-predictable systems;
- classifications of cryptographic ISA extensions and accelerator granularity;
- examples of side-channel-hardened RISC-V cores;
- RISC-V roots of trust, secure boot, memory protection, and TEEs;
- the argument that testability, safety, and security should be considered together.

For a narrow experimental claim about one countermeasure, one core, or one attack, cite the original specialized study rather than this survey.

## Limits and non-claims

- This is a broad expert survey and special-session paper, not a systematic-review protocol with exhaustive search and inclusion criteria.
- Its examples and tool status reflect the rapidly moving field as of 2023. Do not present its list of cores, extensions, or standards as current without checking newer sources.
- The paper discusses selected implementations; inclusion does not imply certification, complete security, or equal experimental evidence across entries.
- It does not experimentally compare all listed processors under one setup.
- The authors explicitly describe the work as a snapshot and call for continued cross-domain research.

## Author-specific evidence for the CV

Abolfazl Sajadi is a co-author affiliated with LIACS, Leiden University. The publication has no individual-contribution statement, so do not assign a particular section or experiment to him solely from the author list.

## Related papers in this collection

- [A Systematic Comparison of Side-channel Countermeasures for RISC-V-based SoCs](04-risc-v-side-channel-countermeasures-2024.md) supplies a focused experimental comparison after this survey.
- [PROACT](05-proact-2024.md) describes a project-level flow for incorporating physical security into cryptographic-chip design.
- [ASSESS](06-pre-silicon-leakage-analysis-assess-2026.md) focuses specifically on fast pre-silicon localization of power leakage.

## Search aliases and concepts

`RISC-V survey`, `RISC-V testability`, `RISC-V safety`, `RISC-V security`, `software-based self-test`, `SBST`, `system-level test`, `SLT`, `functional safety`, `WCET`, `timing verification`, `RISC-V cryptography extensions`, `secure RISC-V`, `side-channel hardened RISC-V`, `root of trust`, `trusted execution environment`, `Keystone`, `Sanctum`.

## BibTeX

```bibtex
@inproceedings{anders2023riscvsurvey,
  author    = {Anders, Jens and Andreu, Pablo and Becker, Bernd and Becker, Steffen and Cantoro, Riccardo and Deligiannis, Nikolaos I. and Elhamawy, Nourhan and Faller, Tobias and Hernandez, Carles and Mentens, Nele and Namazi Rizi, Mahnaz and Polian, Ilia and Sajadi, Abolfazl and Sauer, Mathias and Schwachhofer, Denis and Sonza Reorda, Matteo and Stefanov, Todor and Tuzov, Ilya and Wagner, Stefan and Zidari\v{c}, Nu\v{s}a},
  title     = {A Survey of Recent Developments in Testability, Safety and Security of {RISC-V} Processors},
  booktitle = {2023 28th IEEE European Test Symposium (ETS)},
  year      = {2023},
  doi       = {10.1109/ETS56758.2023.10174099}
}
```
