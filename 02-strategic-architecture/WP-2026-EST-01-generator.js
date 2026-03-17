const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Footer, Header
} = require('docx');
const fs = require('fs');

// ── COLORS ──
const NAVY      = "1B2A4A";
const NAVY_MID  = "2E4172";
const SLATE     = "4A5568";
const RED_DARK  = "7B1C1C";
const AMBER     = "7A4A00";
const GREEN_DK  = "1A4A2E";
const GREY_LIGHT = "F4F5F7";
const GREY_MID  = "E2E4E9";
const WHITE     = "FFFFFF";
const LIGHT_RED  = "FDF0F0";
const LIGHT_AMBER = "FDF8EE";
const LIGHT_GREEN = "F0F7F3";
const LIGHT_NAVY  = "EEF1F8";

// ── BORDERS ──
const b     = { style: BorderStyle.SINGLE, size: 1, color: "C8CDD8" };
const bHvy  = { style: BorderStyle.SINGLE, size: 6, color: NAVY };
const noBrd = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };
const borders = { top: b, bottom: b, left: b, right: b };
const noBorders = { top: noBrd, bottom: noBrd, left: noBrd, right: noBrd };

// ── HELPERS ──
const spacer = (pts = 80) => new Paragraph({ spacing: { before: pts }, children: [] });
const divider = () => new Paragraph({
  spacing: { before: 140, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
  children: []
});
const pageBreak = () => new Paragraph({ pageBreakBefore: true, children: [] });

const para = (text, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 100 }, indent: { firstLine: 720 },
  children: [new TextRun({ text, size: 22, font: "Times New Roman", color: "000000", ...opts })]
});
const paraNoIndent = (text, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 100 },
  children: [new TextRun({ text, size: 22, font: "Times New Roman", color: "000000", ...opts })]
});
const paraSmall = (text, opts = {}) => new Paragraph({
  spacing: { before: 60, after: 80 },
  children: [new TextRun({ text, size: 18, font: "Arial", color: SLATE, ...opts })]
});

// Section headers
const sectionHeader = (label, title) => new Paragraph({
  spacing: { before: 360, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GREY_MID, space: 1 } },
  children: [
    new TextRun({ text: `${label}  `, bold: true, size: 22, font: "Arial", color: NAVY_MID, allCaps: true }),
    new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: NAVY }),
  ]
});

const subHeader = (text) => new Paragraph({
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: SLATE })]
});

// ── KEY JUDGMENT BOX ──
function kjBox(num, confidence, method, text, fill) {
  const confColor = confidence.startsWith('HIGH') ? GREEN_DK
    : confidence.startsWith('LOW') ? RED_DARK : AMBER;
  const fillColor = confidence.startsWith('HIGH') ? LIGHT_GREEN
    : confidence.startsWith('LOW') ? LIGHT_RED : LIGHT_AMBER;

  const C1 = 900, C2 = 8460;
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [C1, C2],
    rows: [
      new TableRow({ children: [
        new TableCell({
          width: { size: C1, type: WidthType.DXA }, rowSpan: 2,
          borders, shading: { fill: NAVY, type: ShadingType.CLEAR },
          verticalAlign: "center",
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: `KJ`, bold: true, size: 18, font: "Arial", color: WHITE }),
            new TextRun({ text: `\n${num}`, bold: true, size: 24, font: "Arial", color: WHITE, break: 1 }),
          ]})]
        }),
        new TableCell({
          width: { size: C2, type: WidthType.DXA }, borders,
          shading: { fill: fillColor, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 40, left: 160, right: 120 },
          children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [
            new TextRun({ text: confidence, bold: true, size: 18, font: "Arial", color: confColor }),
            new TextRun({ text: "  ·  ", size: 18, font: "Arial", color: SLATE }),
            new TextRun({ text: method, size: 18, font: "Arial", color: SLATE, italics: true }),
          ]})]
        }),
      ]}),
      new TableRow({ children: [
        new TableCell({
          width: { size: C2, type: WidthType.DXA }, borders,
          shading: { fill: WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 100, left: 160, right: 120 },
          children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [
            new TextRun({ text, size: 21, font: "Times New Roman" })
          ]})]
        }),
      ]}),
    ]
  });
}

// ── SCENARIO BOX ──
function scenarioBox(label, prob, confidence, description, outcome) {
  const C1 = 1600, C2 = 7760;
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [C1, C2],
    rows: [
      new TableRow({ children: [
        new TableCell({
          width: { size: C1, type: WidthType.DXA }, borders,
          shading: { fill: NAVY_MID, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [
            new Paragraph({ spacing: { before: 0, after: 40 }, children: [
              new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: WHITE })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 0 }, children: [
              new TextRun({ text: prob, bold: true, size: 18, font: "Arial", color: GREY_LIGHT })
            ]}),
            new Paragraph({ spacing: { before: 20, after: 0 }, children: [
              new TextRun({ text: confidence, size: 16, font: "Arial", color: GREY_LIGHT, italics: true })
            ]}),
          ]
        }),
        new TableCell({
          width: { size: C2, type: WidthType.DXA }, borders,
          shading: { fill: LIGHT_NAVY, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: [
            new Paragraph({ spacing: { before: 0, after: 40 }, children: [
              new TextRun({ text: description, size: 20, font: "Times New Roman", bold: true })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 0 }, children: [
              new TextRun({ text: outcome, size: 19, font: "Times New Roman", color: SLATE })
            ]}),
          ]
        }),
      ]}),
    ]
  });
}

// ── INDICATOR ROW ──
function indicatorTable(rows) {
  const C1 = 2800, C2 = 3000, C3 = 3560;
  const hdrs = { top: b, bottom: b, left: b, right: b };
  const headerRow = new TableRow({ tableHeader: true, children: [
    new TableCell({ width: { size: C1, type: WidthType.DXA }, borders: hdrs,
      shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: "INDICATOR / SIGNPOST", bold: true, size: 19, font: "Arial", color: WHITE })] })] }),
    new TableCell({ width: { size: C2, type: WidthType.DXA }, borders: hdrs,
      shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: "SCENARIO RELEVANCE", bold: true, size: 19, font: "Arial", color: WHITE })] })] }),
    new TableCell({ width: { size: C3, type: WidthType.DXA }, borders: hdrs,
      shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: "OBSERVABLE SOURCE", bold: true, size: 19, font: "Arial", color: WHITE })] })] }),
  ]});
  const dataRows = rows.map(([ind, rel, src], i) => {
    const fill = i % 2 === 0 ? GREY_LIGHT : WHITE;
    return new TableRow({ children: [
      new TableCell({ borders: hdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: ind, size: 19, font: "Times New Roman" })] })] }),
      new TableCell({ borders: hdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: rel, size: 19, font: "Times New Roman", italics: true, color: SLATE })] })] }),
      new TableCell({ borders: hdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: src, size: 19, font: "Arial", color: SLATE })] })] }),
    ]});
  });
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [C1, C2, C3],
    rows: [headerRow, ...dataRows] });
}

// ── CONFIDENCE MATRIX TABLE ──
function confidenceMatrix() {
  const C = [3000, 3000, 3360];
  const hdr = (t) => new TableCell({ borders,
    shading: { fill: NAVY_MID, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 19, font: "Arial", color: WHITE })] })] });
  const cell = (t, fill, bold = false) => new TableCell({ borders,
    shading: { fill, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 19, font: "Times New Roman", bold, color: bold ? NAVY : "000000" })] })] });

  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: C, rows: [
    new TableRow({ tableHeader: true, children: [hdr("COMPONENT"), hdr("SCENARIO-CONDITIONED"), hdr("ANALYTICALLY INFERRED")] }),
    new TableRow({ children: [
      cell("Hormuz leverage window (structural)", GREY_LIGHT, true),
      cell("HIGH CONFIDENCE (crisis-conditioned)", LIGHT_GREEN),
      cell("HIGH CONFIDENCE (BRI architecture)", LIGHT_GREEN),
    ]}),
    new TableRow({ children: [
      cell("Saudi treaty viability", WHITE, true),
      cell("LOW-MOD CONFIDENCE", LIGHT_RED),
      cell("MODERATE CONFIDENCE (structural incentives)", LIGHT_AMBER),
    ]}),
    new TableRow({ children: [
      cell("India conversion (active to operational)", GREY_LIGHT, true),
      cell("LOW CONFIDENCE (autonomy constraint)", LIGHT_RED),
      cell("MODERATE CONFIDENCE (parallel beneficiary)", LIGHT_AMBER),
    ]}),
    new TableRow({ children: [
      cell("Forum institutionalization", WHITE, true),
      cell("MODERATE CONFIDENCE", LIGHT_AMBER),
      cell("MODERATE CONFIDENCE (treaty-independent)", LIGHT_AMBER),
    ]}),
    new TableRow({ children: [
      cell("Full concurrent 5-year execution", GREY_LIGHT, true),
      cell("LOW-MOD CONFIDENCE (~even odds)", LIGHT_RED),
      cell("LOW-MOD CONFIDENCE (variable interdependence)", LIGHT_RED),
    ]}),
  ]});
}

// ── DOCUMENT ──
const doc = new Document({
  numbering: { config: [] },
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22, color: "000000" } } },
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1296, right: 1296, bottom: 1296, left: 1296 } } },
    headers: { default: new Header({ children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREY_MID, space: 1 } },
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({ text: "UNCLASSIFIED // OPEN SOURCE  ·  ", size: 16, font: "Arial", color: RED_DARK, bold: true }),
        new TextRun({ text: "George — BRI Corridor Strategic Estimate  ·  WP-2026-EST-01", size: 16, font: "Arial", color: SLATE }),
      ]
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: GREY_MID, space: 1 } },
      alignment: AlignmentType.CENTER, spacing: { before: 80 },
      children: [
        new TextRun({ text: "UNCLASSIFIED // OPEN SOURCE  ·  ", size: 16, font: "Arial", color: RED_DARK, bold: true }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial", color: SLATE }),
      ]
    })] }) },

    children: [

      // ── TITLE BLOCK ──
      spacer(160),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 20 }, children: [
        new TextRun({ text: "UNCLASSIFIED // OPEN SOURCE ANALYSIS", bold: true, size: 18, font: "Arial", color: RED_DARK, allCaps: true })
      ]}),
      spacer(80),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 }, children: [
        new TextRun({ text: "STRATEGIC ESTIMATE", bold: true, size: 36, font: "Arial", color: NAVY, allCaps: true })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [
        new TextRun({ text: "BRI Corridor Architecture: Leverage Window Assessment, Scenario-Conditioned Outcomes, and Indicators", bold: true, size: 24, font: "Arial", color: NAVY_MID })
      ]}),
      spacer(40),
      // Metadata table
      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
        rows: [
          ["Subject", "US-led coalition corridor architecture competing with PRC Belt and Road Initiative (BRI) in the context of the March 2026 Hormuz crisis window"],
          ["Reference", "WP-2026-EST-01 (derived from WP-2026-BRI-01 v4.1)"],
          ["Prepared by", "Collin Blaine George, Center for Competitive Statecraft and Strategic Policy"],
          ["Date", "March 2026"],
          ["Classification", "Unclassified // Open Source Analysis"],
          ["Tradecraft Standard", "WP-2026 Series CI Assessment v2.0 — dual-axis confidence framework (evidentiary quality × analytic confidence)"],
        ].map(([label, val], i) => new TableRow({ children: [
          new TableCell({ borders, shading: { fill: i % 2 === 0 ? GREY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 19, font: "Arial", color: NAVY })] })] }),
          new TableCell({ borders, shading: { fill: i % 2 === 0 ? GREY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: val, size: 19, font: "Times New Roman" })] })] }),
        ]}))
      }),
      spacer(60),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [
        new TextRun({ text: "UNCLASSIFIED // OPEN SOURCE ANALYSIS", bold: true, size: 18, font: "Arial", color: RED_DARK, allCaps: true })
      ]}),
      divider(),
      pageBreak(),

      // ── SECTION 1: KEY JUDGMENTS ──
      sectionHeader("I.", "Key Judgments"),
      paraSmall("The following six judgments govern this estimate. Each carries a probability assessment and a dual-axis confidence label. Supporting analysis appears in Sections III–IV. Judgments marked SCENARIO-CONDITIONED are valid only if the March 2026 Hormuz crisis premises hold."),
      spacer(60),

      kjBox(1, "MODERATE CONFIDENCE", "Scenario-Conditioned",
        "The March 2026 Hormuz crisis has very likely opened a conditional strategic opportunity space — a five-to-ten year window during which structural conditions for a US-led coalition corridor architecture are available. Whether that opportunity is realized depends on concurrent execution of four components under unusually favorable political conditions. The opportunity space is real; its exploitation is not predicted.",
        LIGHT_AMBER),
      spacer(60),
      kjBox(2, "HIGH CONFIDENCE", "Analytically Inferred",
        "BRI\u2019s physical architecture almost certainly concentrates critical vulnerabilities in the Indian Ocean corridor. The hub-and-spoke structure converges on the Hormuz-Malacca route, and 55\u201360% of Chinese crude supply that bypass architectures cannot cover remains Hormuz-dependent on any planning horizon under a decade. This finding is independent of the scenario premise.",
        LIGHT_GREEN),
      spacer(60),
      kjBox(3, "MODERATE CONFIDENCE", "Analytically Inferred",
        "China\u2019s Hormuz vulnerability is very likely declining structurally as electrification reduces fossil fuel\u2019s share of total energy consumption. A leverage window exists and is finite. The 5\u201310 year estimate is an analytic range, not a predicted endpoint; institutional lock-in must occur during the current crisis window if it occurs at all.",
        LIGHT_AMBER),
      spacer(60),
      kjBox(4, "MODERATE CONFIDENCE", "Analytically Inferred",
        "India is likely achievable as a parallel beneficiary of US-designed outcomes by deliberate institutional design over the five-year crisis window, but is very unlikely to accept formal coalition membership. Any architecture requiring India to formally abandon strategic autonomy is assessed as very likely to fail regardless of conditions offered.",
        LIGHT_AMBER),
      spacer(60),
      kjBox(5, "LOW-MODERATE CONFIDENCE", "Scenario-Conditioned",
        "Full concurrent architecture execution on the five-year horizon is assessed at roughly even odds under scenario conditions. That probability assessment itself carries LOW-MODERATE confidence because it is contingent on three variables \u2014 Iranian escalation threshold, Saudi treaty pace, and Chinese diplomatic intervention timing \u2014 each of which the available open-source record supports at only LOW to LOW-MODERATE confidence. The minimum coalition-effective architecture defines what partial execution achieves if full concurrent delivery is not realized.",
        LIGHT_RED),
      spacer(60),
      kjBox(6, "MODERATE CONFIDENCE", "Analytically Inferred",
        "The most likely failure point is the Saudi treaty variable, not BRI displacement or Forum institutionalization. Treaty stall produces a degraded but partially functional architecture. Architecture collapse \u2014 not degradation \u2014 requires concurrent failure of both coalition persistence and China\u2019s decision to contest rather than participate in the Forum.",
        LIGHT_AMBER),
      spacer(80),
      divider(),
      pageBreak(),

      // ── SECTION 2: SCOPE AND CONFIDENCE ──
      sectionHeader("II.", "Scope, Tradecraft Standard, and Confidence Framework"),

      subHeader("2.1 Scope"),
      para("This estimate assesses the strategic availability and likely outcome distribution of a US-led coalition corridor architecture in the Indian Ocean\u2013Middle East corridor, conditional on the March 2026 Hormuz crisis scenario premises. It is not a prediction, a policy recommendation, or an assessment of US government intent. It estimates the conditional opportunity space and likely outcome distribution; it does not assess whether execution will occur. It assesses the conditional opportunity space, the scenario-conditioned outcome distribution, the most probable alternative pathways, and the observable indicators that would update confidence in each direction."),
      para("The estimate\u2019s geographic scope is the Indian Ocean corridor and the Gulf states from which BRI displacement, Forum institutionalization, and mineral partnership components derive their strategic significance. It does not address European theater dynamics, Taiwan Strait contingencies, or Arctic corridor developments except as secondary leverage variables."),

      subHeader("2.2 Tradecraft Standard"),
      para("This estimate applies a dual-axis confidence framework that separates evidentiary quality (how strong is the underlying factual record?) from analytic confidence (given that record, how confident is the judgment?). The two axes can diverge: a well-documented structural constraint can support HIGH evidentiary quality with only MODERATE analytic confidence where the causal mechanism is contested. Probability assessments use IC-standard verbal scale: Almost Certainly (>95%), Very Likely (>80%), Likely (60\u201380%), Roughly Even Odds (40\u201360%), Unlikely (20\u201340%), Very Unlikely (<20%), Remote (<5%). Confidence labels: HIGH, MODERATE, LOW-MODERATE, LOW."),

      subHeader("2.3 Open-Source Ceiling"),
      para("All judgments in this estimate rest on open-source evidentiary foundations. The evidentiary ceiling for several critical variables \u2014 particularly Iranian escalation decision-making, Chinese internal deliberations on Forum participation, and Saudi treaty negotiation dynamics \u2014 is binding. Judgments dependent on these variables carry LOW to LOW-MODERATE confidence not because the structural logic is weak but because the dispositive data is not available on open sources. Government access to FinCEN data, NSA signals, and allied diplomatic reporting would materially upgrade confidence on KJs 4 and 5 specifically."),
      spacer(40),
      new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.SINGLE, size: 12, color: NAVY_MID } },
          shading: { fill: GREY_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "Two-Axis Confidence Summary: This estimate\u2019s structurally-derived judgments (KJ 2, 3) carry the highest confidence because they derive from geographic and economic constraints that are publicly documented and not contingent on actor behavior. Scenario-conditioned judgments (KJ 1, 5) carry lower confidence because they depend on concurrence of multiple actor decisions under time pressure. KJ 4 and 6 occupy an intermediate position: the structural incentives are inferable from open sources, but the specific actor choices are not.", size: 20, font: "Times New Roman", italics: true, color: SLATE })] })]
        })]})],
      }),
      divider(),
      pageBreak(),

      // ── SECTION 3: BASELINE ASSESSMENT ──
      sectionHeader("III.", "Baseline Assessment"),

      subHeader("3.1 The Structural Lever: BRI\u2019s Hormuz Dependency"),
      para("BRI\u2019s strategic architecture rests on a physical vulnerability that is structurally determined rather than contingent: the hub-and-spoke configuration of Chinese maritime energy imports converges on the Strait of Hormuz in a way that no Chinese-controlled bypass architecture can fully resolve on a decade planning horizon. Roughly 55\u201360% of Chinese crude imports transit Hormuz under current routing configurations. The planned Energy China Corridor and CPEC pipeline alternatives can redirect modest volumes but cannot replace the maritime route\u2019s throughput capacity on any timeline under ten years. This dependency is the leverage foundation on which the BRI corridor architecture operates. [HIGH CONFIDENCE, Analytically Inferred]"),
      para("The leverage window is finite. IEA electrification scenario modeling projects Chinese fossil fuel\u2019s share of total primary energy declining through the 2030s, reducing the economic coercive value of Hormuz transit control. The combination of declining dependency and bypass architecture development \u2014 CPEC, INSTC, Russian Arctic routing \u2014 compresses the available window for institutional lock-in. Five to ten years is the analytic range for when the compulsion threshold remains operative; the lower bound reflects accelerated electrification scenarios and Chinese domestic development success. [MODERATE CONFIDENCE, Analytically Inferred]"),

      subHeader("3.2 The Scenario Trigger: March 2026 Hormuz Crisis"),
      para("The March 2026 Hormuz crisis has opened a window that would not otherwise exist. A credible demonstration of US coalition capacity to affect Hormuz transit reliability creates coercive leverage that structural Hormuz dependency alone does not deliver in peacetime. The crisis converts a latent structural asymmetry into an operational one. Simultaneously, it creates the political conditions under which GCC states will consider binding security architecture that they would resist in a steady-state environment. [MODERATE CONFIDENCE, Scenario-Conditioned]"),
      para("The crisis-conditioned opportunity window has four distinguishable components, each with independent viability assessments: (1) Saudi security treaty \u2014 the highest-value but highest-risk component; (2) GCC mineral partnership offtake agreements \u2014 the most tractable and least crisis-dependent; (3) Forum institutionalization for Indian Ocean transit governance \u2014 treaty-independent but requiring sustained diplomatic investment; (4) BRI Tier 2/3 node displacement in contestable pre-operational segments \u2014 addressable through DFC/JBIC competitive finance regardless of crisis trajectory."),

      subHeader("3.3 Russia\u2019s Strategic Position"),
      para("Russia\u2019s position in the architecture is primarily structural rather than volitional. Russian energy exports face sustained Western sanctions pressure and require Chinese market absorption to maintain hard-currency revenue. This creates asymmetric dependency: Russia needs China\u2019s market more than China needs Russia\u2019s energy, which constrains Russia\u2019s willingness to support Chinese counter-moves against the Forum architecture. Sustained US-led sanctions enforcement against Russia\u2019s primary alternative energy buyers \u2014 India being the most significant \u2014 compresses Russia\u2019s strategic flexibility further. Russian isolation through superior alternative provision is the most scenario-independent component of the architecture. [MODERATE CONFIDENCE, Analytically Inferred]"),

      divider(),
      pageBreak(),

      // ── SECTION 4: SCENARIO-CONDITIONED ESTIMATE ──
      sectionHeader("IV.", "Scenario-Conditioned Outcome Estimate"),
      paraSmall("Five scenarios are assessed below in order of probability under scenario-conditioned premises. Probability bands are non-additive approximate analytic ranges, not point estimates; they reflect the analyst\u2019s assessment of relative likelihood under uncertainty rather than a precise probability distribution. All estimates apply only if crisis premises hold through Year 1."),
      spacer(60),

      scenarioBox("Scenario A",
        "35\u201345% probability",
        "Low-Mod Confidence",
        "Partial execution: GCC mineral partnerships + Forum institutionalization proceed; Saudi treaty stalls after Year 2.",
        "Architecture delivers structural advantage but not decade-level institutional lock-in. Requires active US maintenance rather than self-enforcing institutional design. Chinese counter-moves through ASEAN/SCO alternative frameworks degrade Forum normative authority gradually. Outcome: moderate durable advantage over 3\u20137 years."),
      spacer(40),
      scenarioBox("Scenario B",
        "20\u201330% probability",
        "Moderate Confidence",
        "Full concurrent execution: all four components proceed within crisis window.",
        "Decade-level institutional lock-in achieved. Saudi treaty converts GCC partnerships from contingent to self-enforcing. India converts from parallel beneficiary to operational coordination under tariff resolution. This is the architecture\u2019s designed outcome but requires the most favorable confluence of actor behavior. Outcome: structural advantage extending to mid-2030s."),
      spacer(40),
      scenarioBox("Scenario C",
        "15\u201325% probability",
        "Low Confidence",
        "China hedges and delays: Forum alternative institutionalization under ASEAN/SCO rather than confrontational refusal.",
        "Most strategically rational Chinese response. Does not break the architecture\u2019s structural mechanism \u2014 Hormuz dependency is a logistics constraint, not a policy variable \u2014 but extends the timeline for leverage to accumulate by redirecting diplomatic effort. Outcome: compressed leverage window; architecture partially effective; outcome distribution shifts toward Scenario A."),
      spacer(40),
      scenarioBox("Scenario D",
        "10\u201315% probability",
        "Low Confidence",
        "India passive: tariff and S-400 friction unresolved, India remains parallel beneficiary without operational conversion.",
        "Forum operates as GCC-centered institution without Indian Ocean depth. Chinese BRI maritime positioning in Sri Lanka and Bangladesh remains more contestable with Indian cooperation. Architecture\u2019s core mechanism unaffected \u2014 India\u2019s continued Russian energy imports under scenario conditions actually serve US interests by maintaining the Russia-China wedge. Outcome: structurally sound but regionally shallow."),
      spacer(40),
      scenarioBox("Scenario E",
        "<10% probability",
        "Low Confidence",
        "Architecture collapse: coalition persistence erosion concurrent with Chinese bypass acceleration below compulsion threshold.",
        "Requires concurrent failure of US political will (administration transition de-prioritization) AND successful Chinese bypass architecture reducing Hormuz dependency below the compulsion threshold before institutional lock-in. Neither condition alone collapses the architecture. Their concurrence is the primary catastrophic failure mode. Observable through combination of US diplomatic withdrawal indicators and IEA upward revision to Chinese electrification trajectory."),
      spacer(60),

      subHeader("4.1 Confidence Matrix by Component"),
      spacer(40),
      confidenceMatrix(),
      spacer(80),
      divider(),
      pageBreak(),

      // ── SECTION 5: ALTERNATIVE HYPOTHESES ──
      sectionHeader("V.", "Alternative Hypotheses and Competing Analytic Frames"),

      subHeader("5.1 The Overextension Hypothesis"),
      para("The primary competing analytic frame holds that the architecture\u2019s concurrent execution demands exceed realistic US political and institutional capacity \u2014 that the estimate overestimates US coalition management capability, underestimates GCC risk aversion, and fails to account for the political costs of sustained Hormuz forward posture. On this hypothesis, the realistic assessment is Scenario D or E rather than Scenario A or B."),
      para("Assessment: The overextension hypothesis identifies real constraints but does not engage the minimum coalition-effective architecture argument. The architecture does not require concurrent execution of all four components at full fidelity. GCC mineral partnerships and BRI node displacement at Tier 2/3 are executable without the treaty and without Indian conversion. These components create structural switching costs in Chinese supply chains regardless of broader architecture performance. The overextension hypothesis is valid as a critique of Scenario B; it does not defeat Scenario A. [MODERATE CONFIDENCE]"),

      subHeader("5.2 The Chinese Adaptation Hypothesis"),
      para("A second competing frame holds that Chinese bypass architecture development will outpace US institutional lock-in, reducing Hormuz leverage below the compulsion threshold before the Forum architecture can mature. CPEC pipeline capacity expansion, INSTC deepening through post-sanctions Iran, and Arctic routing investment under the Russia relationship collectively represent a bypass portfolio that could shift the dependency calculus within the leverage window."),
      para("Assessment: The bypass portfolio faces engineering constraints that are publicly documented and not contingent on political choices. CPEC pipeline throughput capacity is limited by Pakistani infrastructure bottlenecks and security risk. INSTC deepening requires Iranian cooperation that secondary sanctions pressure complicates. Arctic routing is seasonal and volume-limited. The aggregate bypass effect is real but measured in marginal percentage points on a decade timeline \u2014 sufficient to compress the leverage window but not to defeat it. Chinese domestic electrification is the more credible long-term leverage-reduction mechanism, which is why KJ 3 explicitly acknowledges the finite leverage window. [MODERATE CONFIDENCE on structural constraints; LOW-MODERATE on specific bypass timeline]"),

      subHeader("5.3 The Forum Legitimacy Hypothesis"),
      para("A third competing frame holds that a US-led Forum lacks the normative legitimacy to function as a genuine international institution rather than a US preference-laundering mechanism, and that non-Western states will recognize and resist this. On this view, Forum institutionalization is likely to produce formal membership without substantive compliance, creating an institutional shell rather than a genuine governance mechanism."),
      para("Assessment: The legitimacy concern is structurally present but manageable through design. Forum effectiveness does not require Chinese membership or universal endorsement \u2014 it requires that the states whose Hormuz transit matters most (GCC, India, Southeast Asian importers) find the Forum\u2019s governance functions valuable enough to comply with its norms even under Chinese pressure. The minimum effectiveness threshold is functional compliance by transit-dependent states, not normative legitimacy in the abstract. This is achievable through instrumental design even absent US soft power credibility. [MODERATE CONFIDENCE]"),
      divider(),
      pageBreak(),

      // ── SECTION 6: INDICATORS ──
      sectionHeader("VI.", "Indicators and Signposts"),
      paraSmall("The following indicators, if observed, would update confidence on specific key judgments. All are assessable from open-source reporting within the lag constraints noted."),
      spacer(60),
      indicatorTable([
        ["Saudi-US security negotiations: formal framework announcement", "Scenario B confidence upgrade; KJ 6 (treaty viability)", "US/Saudi official statements; State Dept. briefings; Saudi MOFA"],
        ["Saudi negotiations stall or are postponed past Year 2", "Scenario A confirmation; KJ 6 confidence upgrade", "Diplomatic reporting; Saudi royal court public statements"],
        ["Indian government DFC or JBIC co-investment in corridor project", "India conversion from passive to operational; KJ 4 upgrade", "DFC press releases; Indian MEA; JBIC project announcements"],
        ["Chinese Forum alternative proposal under ASEAN or SCO auspices", "Scenario C activation; Chinese hedging strategy confirmed", "Chinese MFA statements; ASEAN/SCO summit communiques"],
        ["CPEC pipeline capacity expansion (above 10 Bcm/yr)", "Chinese bypass acceleration; KJ 3 leverage window compression", "Pakistani energy ministry; commercial infrastructure reporting"],
        ["IEA upward revision to Chinese 2030 electrification trajectory", "Leverage window compression; KJ 3 timeline shortening", "IEA World Energy Outlook; BloombergNEF; Wood Mackenzie"],
        ["Iranian escalation beyond JCPOA-equivalent threshold", "Architecture crisis trigger; scenario premises extension", "IAEA; CENTCOM; commercial satellite imagery"],
        ["US administration transition with explicit de-prioritization of Forum", "Coalition persistence erosion; Scenario E activation indicator", "Presidential transition documents; NSC senior appointments"],
        ["GCC mineral offtake agreements with US/allied DFC financing (signed)", "Architecture lock-in at mineral component; KJ 5 upgrade", "DFC announcements; GCC sovereign wealth fund reporting"],
        ["Chinese BRI node displacement at Bolivia lithium or comparable Tier 2 site", "BRI displacement component confirmed; architecture partial execution", "DFC/JBIC press releases; host government announcements"],
      ]),
      spacer(80),
      divider(),
      pageBreak(),

      // ── SECTION 7: POLICY IMPLICATIONS ──
      sectionHeader("VII.", "Implications Under Scenario Conditions"),
      paraSmall("The implications below follow analytically from the judgments in Sections III\u2013VI under scenario conditions. They identify where the estimate\u2019s findings bear most directly on decision-relevant considerations. They do not constitute policy advice or recommendations."),
      spacer(40),

      subHeader("7.1 Immediate Priority: Front-Load Institutional Lock-In"),
      para("The estimate\u2019s institutional lock-in logic has a sequencing implication: components that can be locked in through commercially structured agreements \u2014 GCC mineral offtake agreements, BRI Tier 2/3 node displacement \u2014 are less vulnerable to coalition persistence erosion than components requiring sustained political commitment (Saudi treaty, Forum institutionalization). Under Scenario E assumptions, the analysis indicates that early lock-in of commercially-structured components is what preserves partial architecture function through an administration transition. This sequencing implication is robust across Scenarios A, B, and D."),

      subHeader("7.2 India: Parallel Beneficiary, Not Coalition Partner"),
      para("The India analysis yields a counterintuitive implication. India\u2019s continued Russian energy imports under scenario conditions serve the architecture\u2019s structural interests by maintaining the Russia-China energy pricing wedge. The analysis suggests that architecture designs requiring Indian formal coalition alignment are less likely to succeed \u2014 and potentially counterproductive \u2014 compared to designs that achieve the same structural outcomes through parallel beneficiary arrangements that preserve Indian strategic autonomy."),

      subHeader("7.3 Tariff Instrument Conflict and Coalition Durability"),
      para("The most significant near-term risk to the architecture is self-inflicted instrument conflict. Tariff measures directed at GCC states, Japan, South Korea, or the Netherlands during the crisis window would degrade the coalition durability on which technology-denial coordination, Forum participation, and mineral partnership follow-through depend. The policy implication follows the Coalition Conflict Resolution Protocol logic developed in WP-2026-SHIELD-01: before tariff escalation affecting primary coalition partners exceeds a defined threshold, the relevant export-control and diplomatic authorities should certify that coalition coordination is not materially impaired. Absent this mechanism, tariff and coercive architecture instruments will continue to resolve in favor of whichever has the more immediate political constituency."),

      subHeader("7.4 China Engagement: Forum Participation Preferred; Adjacent Compliance Sufficient"),
      para("Chinese Forum membership is the preferred outcome; Forum-adjacent compliance through self-interest in Hormuz transit reliability is the minimum effective outcome. US policy should not foreclose Chinese participation \u2014 Forum design that makes Chinese membership rational (through access to transit reliability governance and dispute resolution mechanisms) is more likely to achieve lock-in than exclusionary design that triggers Chinese counter-institutionalization. The architecture\u2019s leverage over China is structural (Hormuz dependency), not coercive (Forum exclusion). The analysis indicates that inclusive Forum design \u2014 structured to make Chinese membership rational rather than exclusionary \u2014 is more likely to achieve durable institutional lock-in under Scenario C conditions."),

      divider(),
      paraNoIndent("UNCLASSIFIED // OPEN SOURCE ANALYSIS  ·  WP-2026-EST-01  ·  Collin Blaine George, Center for Competitive Statecraft and Strategic Policy  ·  March 2026", { size: 16, font: "Arial", color: RED_DARK }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/claude/ci-report/WP-2026-EST-01.docx", buf);
  console.log("IC-style estimate complete.");
});
