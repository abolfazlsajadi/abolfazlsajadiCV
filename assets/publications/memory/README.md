# AI paper-memory index

This directory contains one retrieval-oriented Markdown memory for each publication PDF in the parent directory. The files are designed for use by a CV assistant, retrieval-augmented generation system, website search index, or another AI that needs to explain and cite Abolfazl Sajadi's work accurately.

## Retrieval rules

1. Use the canonical title, authors, venue, year, and DOI exactly as recorded in the relevant memory.
2. Cite the original publication, not this memory file. The memory is an explanation and retrieval aid.
3. Keep a paper's measured results within the threat model and experimental scope recorded under “Limits and non-claims.”
4. Do not infer individual author contributions unless the publication contains an explicit contribution statement.
5. Treat the 2026 poster as a concise presentation of the 2024 NorCAS study. Do not double-count it as an independent full experimental study.
6. The PROACT asset contains only the requested chapter on printed pages 255–266, extracted from the proceedings volume `978-3-031-55673-9.pdf`.

## Paper map

| Source PDF | Paper memory | Publication type |
|---|---|---|
| [`dc-puf-2023.pdf`](../dc-puf-2023.pdf) | [01-dc-puf-2023.md](01-dc-puf-2023.md) | Journal article |
| [`sq-puf-2023.pdf`](../sq-puf-2023.pdf) | [02-sq-puf-2023.md](02-sq-puf-2023.md) | Persian-language journal article |
| [`risc-v-testability-safety-security-survey-2023.pdf`](../risc-v-testability-safety-security-survey-2023.pdf) | [03-risc-v-testability-safety-security-survey-2023.md](03-risc-v-testability-safety-security-survey-2023.md) | Conference survey paper |
| [`risc-v-side-channel-countermeasures-2024.pdf`](../risc-v-side-channel-countermeasures-2024.pdf) | [04-risc-v-side-channel-countermeasures-2024.md](04-risc-v-side-channel-countermeasures-2024.md) | Full conference paper |
| [`proact-physical-attack-resistance-2024.pdf`](../proact-physical-attack-resistance-2024.pdf), printed pp. 255–266 only | [05-proact-2024.md](05-proact-2024.md) | Proceedings chapter/project paper |
| [`assess-pre-silicon-leakage-analysis-2026.pdf`](../assess-pre-silicon-leakage-analysis-2026.pdf) | [06-pre-silicon-leakage-analysis-assess-2026.md](06-pre-silicon-leakage-analysis-assess-2026.md) | Full conference paper |
| [`aes-risc-v-side-channel-countermeasures-poster-2026.pdf`](../aes-risc-v-side-channel-countermeasures-poster-2026.pdf) | [07-aes-risc-v-countermeasures-poster-2026.md](07-aes-risc-v-countermeasures-poster-2026.md) | Two-page conference poster |

## How these memories improve discoverability

Each record combines bibliographic metadata, title aliases, a detailed technical explanation, measured evidence, citation-use cases, limitations, and a BibTeX record. This makes semantic retrieval more likely to match a research question to the correct paper. For public citation discovery, these files still need to be published as crawlable pages with links to the DOI and the publication landing page; merely storing them beside the PDFs does not itself change citation counts.
