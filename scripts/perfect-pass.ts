/**
 * One-shot green bar: engine quality + site QA + full-stack.
 *   npx tsx scripts/perfect-pass.ts
 */
import { spawnSync } from "child_process";
import path from "path";

const ROOT = path.join(__dirname, "..");

function run(label: string, script: string): boolean {
  console.log(`\n══ ${label} ══`);
  const r = spawnSync(
    process.execPath,
    [path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"), script],
    { cwd: ROOT, stdio: "inherit", env: process.env },
  );
  return r.status === 0;
}

const okQ = run("Engine quality", "scripts/verify-engine-quality.ts");
const okS = run("Site QA smoke", "scripts/qa-site-smoke.ts");
const okF = run("Full-stack smoke", "scripts/full-stack-smoke.ts");

console.log("\n══ Perfect pass summary ══");
console.log(`quality:    ${okQ ? "PASS" : "FAIL"}`);
console.log(`site QA:    ${okS ? "PASS" : "FAIL"}`);
console.log(`full-stack: ${okF ? "PASS" : "FAIL"}`);

if (!okQ || !okS || !okF) process.exit(1);
console.log("\nALL GREEN\n");
