import fs from "fs";

const raw = fs.readFileSync(".env");
const text = raw.toString("utf8").replace(/^\uFEFF/, "");
console.log("encoding_guess", raw[0] === 0xff ? "utf16?" : "ok");
for (const line of text.split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (!m) continue;
  const k = m[1];
  let v = m[2].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  if (/META|INSTAGRAM|TOKEN|PUBLIC_AD|GMAIL|PASSWORD/i.test(k)) {
    console.log(
      k,
      "len=" + v.length,
      "prefix=" + (v.slice(0, 3) || "empty"),
      "multiline_break=" + (v.includes("\\n") || false),
    );
  } else {
    console.log(k, "present");
  }
}
