/**
 * Anonymized wins — add entries ONLY after real paid orders.
 * Never invent testimonials or guarantee outcomes.
 */
export type AnonymizedWin = {
  id: string;
  role: string; // e.g. "Grant writer, regional nonprofit"
  engineSlug: string;
  engineLabel: string;
  whatChanged: string; // factual process change, not "we got funded"
  dateLabel: string; // e.g. "Jul 2026"
};

export const ANONYMIZED_WINS: AnonymizedWin[] = [
  // Example shape (commented until real orders exist):
  // {
  //   id: "w1",
  //   role: "Program manager, workforce nonprofit",
  //   engineSlug: "grant-proposal-narrative-generator",
  //   engineLabel: "Grant Proposal Narrative Generator",
  //   whatChanged:
  //     "Cut blank-page time on a state narrative draft; team edited SMART goals before counsel/funder review.",
  //   dateLabel: "Jul 2026",
  // },
];
