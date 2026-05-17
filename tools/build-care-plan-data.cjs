const fs = require("fs");
const path = require("path");

const sourcePath = process.argv[2];
const outPath = process.argv[3] || path.join(process.cwd(), "nursing-care-plan-data.js");
if (!sourcePath) throw new Error("Usage: node tools/build-care-plan-data.cjs <guide.txt> [out.js]");

function cleanText(value) {
  return String(value || "")
    .replace(/\u00e2\u20ac\u201d|\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u00a2/g, "•")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\ufffd/g, '"')
    .replace(/\u00e2\u20ac\u02dc|\u00e2\u20ac\u2122/g, "'")
    .replace(/Â/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeMojibake(value) {
  const cp1252 = {
    0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84,
    0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88,
    0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c,
    0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93,
    0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
    0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f
  };
  const bytes = [];
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    bytes.push(cp1252[code] || (code <= 255 ? code : 0x3f));
  }
  try { return Buffer.from(bytes).toString("utf8"); } catch (_) { return value; }
}

function splitBullets(block) {
  return cleanText(block)
    .split(/\s*•\s+/)
    .map(cleanText)
    .filter(Boolean)
    .map(function (x) { return x.replace(/\s+7644_.+$/i, "").trim(); })
    .filter(function (x) {
      return x.length > 2 && !/^PAGE \d+/i.test(x) && !/^Information that appears/i.test(x);
    });
}

function between(section, startRe, stopRe) {
  const start = section.search(startRe);
  if (start < 0) return "";
  const rest = section.slice(start).replace(startRe, "");
  const stop = rest.search(stopRe);
  return stop < 0 ? rest : rest.slice(0, stop);
}

function headingBefore(text, index) {
  const lines = text.slice(Math.max(0, index - 650), index).split(/\r?\n/).map(cleanText).filter(Boolean);
  const tail = [];
  for (let i = lines.length - 1; i >= 0 && tail.length < 4; i--) {
    const line = lines[i]
      .replace(/^\d+CHAPTER\s+\d+\s*/i, "")
      .replace(/^\d+\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (/^--- PAGE/i.test(line) || /^Nursing Diagnoses/i.test(line) || /^in Alphabetical Order/i.test(line)) break;
    if (
      line.length >= 4 &&
      line.length <= 150 &&
      !/^Information that appears/i.test(line) &&
      /[A-Z]/.test(line)
    ) tail.unshift(line);
  }
  if (tail.length) return tail.join(" ");
  return "Nursing Diagnosis";
}

const source = fs.readFileSync(sourcePath, "utf8").replace(/\r/g, "\n");
const cleanedSource = source
  .replace(/\u00e2\u20ac\u201d|\u00e2\u20ac\u201c/g, "-")
  .replace(/\u00e2\u20ac\u00a2/g, "•")
  .replace(/\u00e2\u20ac\u2122/g, "'")
  .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\ufffd/g, '"')
  .replace(/Â/g, " ")
  .replace(/\u00a0/g, " ");

const matches = [];
const divRe = /\[Diagnostic Division:\s*([^\]]+)\]/g;
let match;
while ((match = divRe.exec(cleanedSource))) matches.push({ index: match.index, category: cleanText(match[1]) });

const stopRe = /(?:\n\s*(?:Related Factors|Risk Factors|Defining Characteristics|Desired Outcomes\/Evaluation|Actions\/Interventions|Documentation Focus|NOC-|NIC-|--- PAGE|\[[A-Za-z]+))/i;
const diagnoses = matches.map(function (m, idx) {
  const end = matches[idx + 1] ? matches[idx + 1].index : cleanedSource.length;
  const section = cleanedSource.slice(m.index, end);
  const title = headingBefore(cleanedSource, m.index)
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const subjectiveBlock = between(section, /\bSubjective(?:\s*\([^)]*\))?\s*/i, /\b(?:Objective|Desired Outcomes\/Evaluation|Actions\/Interventions|Documentation Focus|NOC-|NIC-|Related Factors|Risk Factors|Defining Characteristics)\b/i);
  const objectiveBlock = between(section, /\bObjective(?:\s*\([^)]*\))?\s*/i, /\b(?:Subjective|Desired Outcomes\/Evaluation|Actions\/Interventions|Documentation Focus|NOC-|NIC-|Related Factors|Risk Factors|Defining Characteristics)\b/i);
  const combinedCueBlock = between(section, /\bSubjective\/Objective\s*/i, /\b(?:Desired Outcomes\/Evaluation|Actions\/Interventions|Documentation Focus|NOC-|NIC-|Related Factors|Risk Factors|Defining Characteristics)\b/i);
  const goalsBlock = between(section, /\bDesired Outcomes\/Evaluation Criteria[-\s]*(?:Client Will:?|Client\/Caregiver Will:?|Family Will:?)?/i, /\b(?:Actions\/Interventions|Documentation Focus|Assessment\/Reassessment|NOC-|NIC-|Related Factors|Risk Factors|Defining Characteristics)\b/i);
  const interventionsBlock = between(section, /\bActions\/Interventions\s*/i, /\b(?:Documentation Focus|Assessment\/Reassessment|NOC-|NIC-|--- PAGE\s+\d+\s+[A-Z][A-Z\s,\/\-\[\]]{8,}\s+\[Diagnostic Division:)/i);
  const noc = Array.from(section.matchAll(/\bNOC-([^\n]+)/g)).map(function (x) { return cleanText("NOC-" + x[1]); }).slice(0, 8);
  const nic = Array.from(section.matchAll(/\bNIC-([^\n]+)/g)).map(function (x) { return cleanText("NIC-" + x[1]); }).slice(0, 8);
  const subjective = splitBullets(subjectiveBlock);
  const objective = splitBullets(objectiveBlock);
  if (combinedCueBlock) {
    const both = splitBullets(combinedCueBlock);
    both.forEach(function (cue) {
      if (!subjective.includes(cue)) subjective.push(cue);
      if (!objective.includes(cue)) objective.push(cue);
    });
  }
  return {
    name: cleanText(title),
    category: cleanText(m.category),
    subjective: subjective.slice(0, 80),
    objective: objective.slice(0, 80),
    goals: splitBullets(goalsBlock).slice(0, 120),
    interventions: splitBullets(interventionsBlock).slice(0, 180),
    outcomes: noc,
    interventionTaxonomy: nic
  };
}).filter(function (d) {
  return d.name && d.category && (d.subjective.length || d.objective.length || d.goals.length || d.interventions.length);
});

const unique = [];
const seen = new Set();
diagnoses.forEach(function (d) {
  const key = d.name.toLowerCase() + "|" + d.category.toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(d);
  }
});

const output = "window.NURSING_CARE_PLAN_DATA = " + JSON.stringify(unique, null, 2) + ";\n";
fs.writeFileSync(outPath, output, "utf8");
console.log("Wrote " + unique.length + " diagnoses to " + outPath);
console.log("Subjective cues: " + new Set(unique.flatMap(function (d) { return d.subjective; })).size);
console.log("Objective cues: " + new Set(unique.flatMap(function (d) { return d.objective; })).size);
