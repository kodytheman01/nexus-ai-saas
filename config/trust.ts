/** FOA / NOFO coverage checklist — grant specialist trust signal. */
export const FOA_COVERAGE_CHECKLIST: { section: string; tip: string }[] = [
  { section: "Cover / Abstract", tip: "Problem, population, ask amount, period of performance" },
  { section: "Statement of Need", tip: "Local data + disparity vs. state/national" },
  { section: "Goals & Objectives", tip: "SMART; link each goal to activities" },
  { section: "Project Design / Work Plan", tip: "Milestones by year; who does what" },
  { section: "Organizational Capacity", tip: "Staff roles, prior awards, fiscal controls" },
  { section: "Partnerships", tip: "MOUs / letters — roles clearly stated" },
  { section: "Evaluation", tip: "Indicators, data sources, reporting cadence" },
  { section: "Budget Narrative", tip: "Line items aligned to activities (use budget engine)" },
  { section: "Sustainability", tip: "Continuation after award period" },
  { section: "Appendices", tip: "Resumes, LOIs, org chart, rate docs" },
];

export const GRANT_PAIRINGS: Record<
  string,
  { label: string; slug: string; why: string }[]
> = {
  "grant-proposal-narrative-generator": [
    {
      label: "Grant Proposal Outline",
      slug: "grant-proposal-outline-generator",
      why: "Map FOA sections before drafting prose",
    },
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Pair narrative with budget narrative language",
    },
  ],
  "grant-proposal-outline-generator": [
    {
      label: "Grant Proposal Narrative",
      slug: "grant-proposal-narrative-generator",
      why: "Fill sections after the outline is locked",
    },
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Budget narrative next to the outline",
    },
  ],
  "nonprofit-budget-allocation-calculator": [
    {
      label: "Grant Proposal Narrative",
      slug: "grant-proposal-narrative-generator",
      why: "Align story to the allocation",
    },
    {
      label: "Grant Compliance Checklist",
      slug: "grant-compliance-reporting-checklist",
      why: "Stay audit-ready after award",
    },
  ],
  "grant-compliance-reporting-checklist": [
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Keep spend narrative consistent with reports",
    },
  ],
};

export const ENTITY = {
  legalName: "Apex Capital Admin Services",
  region: "Texas, USA",
  email: "admin@apexcapitaladmin.com",
  phone: "(214) 506-3083",
  phoneHref: "tel:+12145063083",
  supportHours: "Mon–Fri, 9am–5pm Central",
  humanReviewSla: "Within 1 business day of generation",
  retention:
    "Order records (email, engine, deliverable reference) are kept as needed for support, accounting, and legal obligations. Intake text is retained only as long as needed to generate, deliver, and support your order, then may be deleted or anonymized.",
};
