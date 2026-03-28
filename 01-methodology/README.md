# 01-methodology — Analytical Methodology Stack

This folder contains the foundational methodology papers for the WP-2026 series. These documents define how attribution is established, how state nexus is assessed, how illicit finance nodes are classified and controlled, and how named entities are evaluated against the enforcement record. All downstream series papers import from this stack by cross-reference.

---

## Documents

| Document | Function |
|----------|----------|
| [WP-2026-ATTRIBUTION-01.pdf](WP-2026-ATTRIBUTION-01.pdf) | Four-level state nexus attribution framework — the Nexus Protocol |
| [WP-2026-NEXUS-01.pdf](WP-2026-NEXUS-01.pdf) | PRC commercial state nexus extension — five-rung ladder |
| [WP-2026-AML-01.pdf](WP-2026-AML-01.pdf) | AML/CFT/CPF control matrix — 9 node categories, 20 node types |
| [WP-2026-AML-01.docx](WP-2026-AML-01.docx) | Editable source |
| [WP-2026-AML-01.html](WP-2026-AML-01.html) | Web reader |
| [WP-2026-SENI-02.pdf](WP-2026-SENI-02.pdf) | Named-entity enforcement index — AML-01 companion |
| [WP-2026-SENI-02.docx](WP-2026-SENI-02.docx) | Editable source |
| [WP-2026-SENI-02.html](WP-2026-SENI-02.html) | Web reader |

---

## ATTRIBUTION-01 — The Nexus Protocol

**Series position:** Foundational methodology. All attribution claims across the series import from this document.

Establishes a four-level state nexus attribution framework applicable across OFAC, DOJ, State, IC, and Commerce/BIS enforcement contexts:

| Level | Definition |
|-------|-----------|
| **Presence** | Entity or actor operates within state-controlled or state-adjacent environment |
| **Linkage** | Documented relationship between entity and state apparatus |
| **Support** | State provides material, financial, or operational facilitation |
| **Direct Tasking** | State directs or controls the entity's activity |

Each level carries explicit evidentiary requirements, disconfirmation criteria, and corroboration standards. The framework defines six attribution failure modes: circumstantial conflation, source contamination, temporal mismatch, jurisdictional overreach, advocacy capture, and toleration-as-tasking. Attribution failure mode identification is required before any nexus claim reaches the series record.

---

## NEXUS-01 — PRC State Nexus Protocol (CSE-01)

**Series position:** PRC-specific extension of ATTRIBUTION-01. Required reading for any series paper addressing PRC-facilitated networks.

Extends ATTRIBUTION-01 with a fifth rung — **Enablement** — positioned between Support and Direct Tasking, designed specifically for PRC commercial state nexus where the relationship between state and enterprise is indirect, structural, and difficult to attribute through standard evidentiary pathways.

Additional contributions:
- Beneficial ownership analysis framework for VIE architecture and opaque holding structures
- OFAC 50 Percent Rule application methodology
- FinCEN CDD compliance assessment
- CFIUS effective-control test for commercial state nexus
- Four Support/Enablement boundary tests for ambiguous cases
- Seven nexus attribution failure modes (adds PRC-specific modes to ATTRIBUTION-01 baseline)

SAM-01 Rev 2.0 requires NEXUS-01 as a dependency for any Tier B/C network analysis involving PRC exposure.

---

## AML-01 — AML/CFT/CPF Control Matrix (v2.2)

**Series position:** Node-level control architecture for financial enforcement. Governs the typological and regulatory scaffolding that SIEGE-01, ESCALATE-01, SHIELD-01, and the SENI system presuppose.

Nine node categories, 20 node types, eight-column structure:

| Column | Content |
|--------|---------|
| Node Type | Category and specific node classification |
| Documented Exposure Pattern | Public enforcement record basis |
| Risk Indicators | Behavioral and transactional escalation signals |
| Controls | BSA/AML program requirements |
| Escalation Indicators | Threshold conditions for enhanced review or SAR |
| Reporting Pathways | SAR, CTR, OFAC reporting obligations |
| Statutory Authority | Controlling legal authorities per node |
| FATF Alignment | Applicable FATF Recommendations with non-binding qualifier |

Three appendices: Analytic Posture Framework, Control Typology Classification, False-Positive Discipline.

**Statutory coverage includes:** BSA (31 U.S.C. §5318), PATRIOT Act §312, FCPA (15 U.S.C. §§78dd-1/2/3), IEEPA, EAR/ITAR distinction, 18 U.S.C. §1956/1960/2339B, UIGEA (31 U.S.C. §§5362-5363), AMLA 2020, FATF Recommendations (non-binding qualifier throughout), UN SCRs (regime-specific).

**Red-team audit status:** Three documented passes — (1) statutory precision and citation verification, (2) escalation language audit, (3) per-row enforcement exposure scoring. All HIGH and VERY HIGH exposure rows carry mandatory disclaimer language.

---

## SENI-02 — Named-Entity Enforcement Index (v2.2)

**Series position:** Named-entity companion to AML-01. Sits beside AML-01 in the methodology layer; cross-referenced from the SENI sub-system.

Populates the AML-01 node architecture with 65+ specifically named institutions, networks, and entities drawn exclusively from the public enforcement record. Seven-column structure:

| Column | Content |
|--------|---------|
| Entity | Institution or network name |
| Jurisdiction | Primary domicile and operational jurisdiction |
| Node Category | AML-01 node classification |
| Summary Basis | One-sentence enforcement basis |
| Public Enforcement Relevance | Detailed attribution paragraph |
| Status | A (active) / D (designated) / I (indicted) / R (reported) / H (historical) / O (ongoing) |
| Controlling Citation | Primary enforcement action, designation, or reporting basis |

**Front matter:** Three sections — inclusion criteria, exclusion and caution indicators, source-status legend.

**Global disclaimer:** All entries are attribution-first, time-bounded, and source-status differentiated. Entries based on allegations, civil findings, or investigative reporting are explicitly distinguished from adjudicated criminal findings. No entry constitutes a current allegation absent explicit indication of ongoing status.

**Red-team audit status:** Three documented passes matching AML-01. High-risk rows (Tether, Trump Organization, Bayrock, Tornado Cash, Lazarus Group, Dandong Hongxiang) carry per-row mandatory disclaimer language. All FinCEN Section 311 references cite 31 U.S.C. §5318A throughout.

---

## Upstream / Downstream

**Upstream:** 00-governance (SAM-01 compliance; StyleGuide v3.0; Verbiage Guide v2.2)

**Downstream:**
- ATTRIBUTION-01 → NEXUS-01 → SHIELD-01 → SENI-01 and sub-series
- AML-01 → SENI-02 → SENI-01 (node architecture foundation)
- AML-01 → SIEGE-01 (typological scaffolding)
- AML-01 → ESCALATE-01 (escalation indicator framework)
- NEXUS-01 → all Tier B/C network papers with PRC exposure (SAM-01 requirement)

---

*UNCLASSIFIED // OPEN SOURCE // INDEPENDENT POLICY RESEARCH*
*WP-2026 · Center for Competitive Statecraft and Strategic Policy · Collin George · March 2026*
