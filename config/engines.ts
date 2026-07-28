export type EngineSeed = {
  slug: string;
  title: string;
  description: string;
  priceInUSD: number;
  inputLabel: string;
  inputPlaceholder: string;
  aiSystemPrompt: string;
  outputFormat: "json" | "markdown" | "code";
  category: string;
};

export const ENGINES_SEED_DATA: EngineSeed[] = [
  {
    slug: "micro-saas-logic",
    title: "Engine 1: Micro-SaaS & Automation Logic",
    description:
      "Generate instant Make/Zapier automation blueprints based on your app goals.",
    priceInUSD: 9,
    inputLabel: "Describe your app features and target APIs:",
    inputPlaceholder:
      "e.g., Send an invoice when a new Typeform is filled...",
    aiSystemPrompt:
      "You are an expert systems automation architect. Output raw JSON blueprints for Make.com / Zapier-style schemas based on user integrations. Be concrete and production-oriented.",
    outputFormat: "json",
    category: "automation",
  },
  {
    slug: "cross-border-tax",
    title: "Engine 2: Cross-Border Regulatory Tax Frameworks",
    description:
      "Generate an educational international entity structure overview map.",
    priceInUSD: 49,
    inputLabel:
      "Enter your home country, target country, and annual revenue projection:",
    inputPlaceholder: "e.g., US LLC, selling to EU, $150k/year...",
    aiSystemPrompt:
      "You are an educational international tax information assistant. Output structured markdown outlining common entity patterns, filing concepts, and questions to ask a licensed tax advisor. Never claim this is personalized legal/tax advice. Emphasize compliance and professional consultation.",
    outputFormat: "markdown",
    category: "finance",
  },
  {
    slug: "supply-chain-logistics",
    title: "Engine 3: Supply Chain & Logistical Optimization",
    description:
      "Calculate optimized multi-modal routing matrices for shipping paths.",
    priceInUSD: 19,
    inputLabel: "Enter origin, destination, weight, dimensions, and timeline:",
    inputPlaceholder:
      "e.g., Shanghai to Munich, 500kg, 2 pallets, 14 days max...",
    aiSystemPrompt:
      "You are a global logistics operations analyst. Generate a comprehensive routing optimization brief with mode options, tradeoffs, and checklist items.",
    outputFormat: "markdown",
    category: "automation",
  },
  {
    slug: "defi-smart-contract",
    title: "Engine 4: Decentralized Finance & Smart Contract Architecture",
    description:
      "Compile production-oriented Solidity starter contracts from tokenomics specs.",
    priceInUSD: 99,
    inputLabel:
      "Specify token supply, inflation/deflation rules, and staking parameters:",
    inputPlaceholder:
      "e.g., 100M supply, 2% burn per transaction, 5% APY staking reward...",
    aiSystemPrompt:
      "You are a senior Solidity developer. Output valid, commented Solidity starter code with security notes and audit checklist items. Warn that code must be audited before mainnet use.",
    outputFormat: "code",
    category: "dev",
  },
  {
    slug: "algo-trading-indicator",
    title: "Engine 5: High-Frequency Algorithmic Trading Systems",
    description:
      "Generate TradingView PineScript indicator or strategy starter code.",
    priceInUSD: 19,
    inputLabel: "Define technical indicators and cross-over logic triggers:",
    inputPlaceholder:
      "e.g., Buy when RSI < 30 and 50 EMA crosses above 200 EMA...",
    aiSystemPrompt:
      "You are a quantitative developer. Generate production-ready TradingView Pine Script v5 indicator or strategy code with clear comments. Include risk disclaimer.",
    outputFormat: "code",
    category: "finance",
  },
  {
    slug: "real-estate-arbitrage",
    title: "Engine 6: Real Estate Valuation & Land-Use Analytics",
    description:
      "Analyze zoning inputs to outline highest-and-best-use conversion ideas.",
    priceInUSD: 29,
    inputLabel:
      "Provide postal code, parcel square footage, and current municipal class:",
    inputPlaceholder:
      "e.g., 90210, 12,000 sq ft, Low-density residential R-1...",
    aiSystemPrompt:
      "You are a land-use planning analyst. Produce a markdown feasibility brief of conversion options, constraints, and due-diligence questions. Not a formal appraisal.",
    outputFormat: "markdown",
    category: "finance",
  },
  {
    slug: "conversion-neuro-audit",
    title: "Engine 7: Consumer Psychology & Conversion Rate Mechanics",
    description:
      "Audit page copy for cognitive friction and conversion improvements.",
    priceInUSD: 14,
    inputLabel: "Paste your landing page copy or layout text content:",
    inputPlaceholder:
      "e.g., Headline: Get our course today. Subheadline: It will teach you a lot...",
    aiSystemPrompt:
      "You are an elite conversion copywriter. Provide a rigorous psychological layout audit with prioritized rewrite suggestions.",
    outputFormat: "markdown",
    category: "seo",
  },
  {
    slug: "pseo-keyword-clusters",
    title: "Engine 8: Programmatic SEO & Organic Traffic Scaling",
    description:
      "Build semantic keyword cluster maps for programmatic content growth.",
    priceInUSD: 39,
    inputLabel: "Enter core business vertical and geographical target market:",
    inputPlaceholder:
      "e.g., Emergency plumbing services, Greater London area...",
    aiSystemPrompt:
      "You are a programmatic SEO cluster engineer. Return JSON with topical clusters, example long-tail keywords, and page-type recommendations.",
    outputFormat: "json",
    category: "seo",
  },
  {
    slug: "operations-sop-builder",
    title: "Engine 9: Business Operations & SOP Architecture",
    description:
      "Transform raw task notes into nested corporate SOP manuals.",
    priceInUSD: 7,
    inputLabel: "Paste raw workflow description or text log notes:",
    inputPlaceholder:
      "e.g., First, the tech pulls the client file, logs the IP, and triggers the update...",
    aiSystemPrompt:
      "You are a senior business operations analyst. Rewrite raw notes into a clear nested Standard Operating Procedure with roles, checklists, and edge cases.",
    outputFormat: "markdown",
    category: "automation",
  },
  {
    slug: "ironclad-contract-factory",
    title: "Engine 10: Contractual Law & Risk Mitigation Paradigms",
    description:
      "Generate educational service agreement and NDA draft templates.",
    priceInUSD: 24,
    inputLabel:
      "Provide provider country, client country, contract value, and penalty parameters:",
    inputPlaceholder:
      "e.g., US Dev Agency, UK E-com client, $20k value, 10% late payment fee...",
    aiSystemPrompt:
      "You are a contracts drafting assistant for educational templates. Output a structured markdown draft MSA/NDA-style outline with placeholders. Clearly state it is not legal advice and must be reviewed by a licensed attorney for the relevant jurisdictions.",
    outputFormat: "markdown",
    category: "legal",
  },
];
