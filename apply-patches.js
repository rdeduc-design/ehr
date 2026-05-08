#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// HCT EHR — Combined Patch Runner
// Applies: Faculty Gate + Datetime upgrades → app.js
//
// USAGE (run once from the project folder):
//   node apply-patches.js
//
// Reads app.js, applies all changes, writes app.js back.
// Backup saved as app.js.bak before any write.
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, 'app.js');
const BACKUP = TARGET + '.bak';

if (!fs.existsSync(TARGET)) {
  console.error('✗  app.js not found. Run this script from the same folder as app.js.');
  process.exit(1);
}

let src = fs.readFileSync(TARGET, 'utf8');
fs.writeFileSync(BACKUP, src);
console.log('✓  Backup saved → app.js.bak\n');

const report = [];
let applied = 0, skipped = 0;

function patch(label, find, replace) {
  if (src.includes(find)) {
    src = src.split(find).join(replace); // replace ALL occurrences (usually 1)
    report.push('  ✓  ' + label);
    applied++;
  } else {
    report.push('  –  ' + label + '  (not found — already applied or source differs)');
    skipped++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUP A — FACULTY GATE
// ═══════════════════════════════════════════════════════════════════════════

patch(
  'A1  isInstructor() helper',
  "let cloud={ready:false,client:null,session:null,profile:null,status:'Local only',busy:false};",
  "let cloud={ready:false,client:null,session:null,profile:null,status:'Local only',busy:false};\nfunction isInstructor(){return cloud.profile?.role==='instructor';}"
);

patch(
  'A2  renderNav() — faculty tools hidden from students',
  // ── FIND ──
`function renderNav(){
  const groups=[['Chart review',[['summary','PS','Patient summary'],['orders','PO','Provider orders'],['labs','LR','Labs / diagnostics']]],['Documentation',[['vitals','VS','Vital signs'],['assessment','FA','Focused assessment'],['meds','MR','MAR'],['io','IO','Intake / output'],['notes','NN','Nursing notes'],['careplan','CP','Care plan'],['education','ED','Education'],['sbar','SB','SBAR / handoff']]],['Learning tools',[['reasoning','CR','Clinical reasoning'],['peerreview','PR','Peer review mode'],['debriefing','DB','Debriefing'],['progress','PT','My progress'],['report','RP','Print report'],['scenarios','SC','Sample scenarios'],['newpatient','NP','Add patient']]],['Faculty tools',[['modulebuilder','MB','Faculty module builder']]]];
  return\`<nav class="nav">\${groups.map(([g,items])=>\`<div class="group">\${g}</div>\${items.map(([tab,ic,label])=>\`<button class="nav-btn \${state.tab===tab?'active':''}" data-tab="\${tab}"><span class="nav-ic">\${ic}</span>\${label}</button>\`).join('')}\`).join('')}</nav>\`;
}`,
  // ── REPLACE ──
`function renderNav(){
  const groups=[
    ['Chart review',[['summary','PS','Patient summary'],['orders','PO','Provider orders'],['labs','LR','Labs / diagnostics']]],
    ['Documentation',[['vitals','VS','Vital signs'],['assessment','FA','Focused assessment'],['meds','MR','MAR'],['io','IO','Intake / output'],['notes','NN','Nursing notes'],['careplan','CP','Care plan'],['education','ED','Education'],['sbar','SB','SBAR / handoff']]],
    ['Learning tools',[['reasoning','CR','Clinical reasoning'],['peerreview','PR','Peer review mode'],['debriefing','DB','Debriefing'],['progress','PT','My progress'],['report','RP','Print report'],['scenarios','SC','Sample scenarios'],['newpatient','NP','Add patient']]]
  ];
  if(isInstructor()){
    groups.push(['Faculty tools',[['modulebuilder','MB','Faculty module builder'],['dashboard','ID','Instructor dashboard'],['statusboard','SS','Status board']]]);
  }
  return\`<nav class="nav">\${groups.map(([g,items])=>\`<div class="group">\${g}</div>\${items.map(([tab,ic,label])=>\`<button class="nav-btn \${state.tab===tab?'active':''}" data-tab="\${tab}"><span class="nav-ic">\${ic}</span>\${label}</button>\`).join('')}\`).join('')}</nav>\`;
}`
);

patch(
  'A3  renderTab() — faculty tabs blocked at router level',
  'function renderTab(){const map={summary:rSummary,orders:rOrders,labs:rLabs,vitals:rVitals,assessment:rAssessment,meds:rMeds,io:rIO,notes:rNotes,careplan:rCarePlan,education:rEducation,sbar:rSbar,reasoning:rReasoning,debriefing:rDebriefing,progress:rProgress,scenarios:rScenarios,newpatient:rNewPatient,dashboard:rDashboard,statusboard:rStatusBoard,peerreview:rPeerReview,report:rReport,modulebuilder:rModuleBuilder};return(map[state.tab]||rSummary)();}',
  `function renderTab(){
  const map={summary:rSummary,orders:rOrders,labs:rLabs,vitals:rVitals,assessment:rAssessment,meds:rMeds,io:rIO,notes:rNotes,careplan:rCarePlan,education:rEducation,sbar:rSbar,reasoning:rReasoning,debriefing:rDebriefing,progress:rProgress,scenarios:rScenarios,newpatient:rNewPatient,dashboard:rDashboard,statusboard:rStatusBoard,peerreview:rPeerReview,report:rReport,modulebuilder:rModuleBuilder};
  const facultyOnlyTabs=['modulebuilder','dashboard','statusboard'];
  if(facultyOnlyTabs.includes(state.tab)&&!isInstructor())return rAccessDenied();
  return(map[state.tab]||rSummary)();
}`
);

patch(
  'A4  rAccessDenied() function added',
  'function rDashboard(){',
  `function rAccessDenied(){
  return section('Access restricted',\`
    <div class="notice danger">
      <span class="mark">🔒 RESTRICTED</span>
      <span><strong>This section is available to faculty accounts only.</strong><br>
      Student accounts do not have access to the Faculty Module Builder, Instructor Dashboard,
      or Submission Status Board. Contact your instructor if you believe this is an error.</span>
    </div>
    <div class="actions" style="justify-content:flex-start;">
      <button class="btn primary" data-tab-jump="summary">Return to patient summary</button>
      <button class="btn" data-tab-jump="progress">My progress tracker</button>
    </div>
  \`);
}
function rDashboard(){`
);

patch(
  'A5  rModuleBuilder() — role guard',
  'function rModuleBuilder(){const p=currentPatient();const modules=p.facultyModules||[];',
  'function rModuleBuilder(){if(!isInstructor())return rAccessDenied();const p=currentPatient();const modules=p.facultyModules||[];'
);

patch(
  'A6  rSummary() — "Build module" button hidden from students',
  '<button class="btn small" data-tab-jump="modulebuilder">Build module</button>',
  "${isInstructor()?'<button class=\"btn small\" data-tab-jump=\"modulebuilder\">Build module</button>':''}"
);

// ═══════════════════════════════════════════════════════════════════════════
// GROUP B — DATETIME UPGRADE
// ═══════════════════════════════════════════════════════════════════════════

patch(
  'B1  nowTime() → full datetime; fmtDT() helper added',
  'function nowTime(){return new Date().toTimeString().slice(0,5);}',
  `function nowTime(){
  const d=new Date();
  const pad=n=>String(n).padStart(2,'0');
  return \`\${d.getFullYear()}-\${pad(d.getMonth()+1)}-\${pad(d.getDate())}T\${pad(d.getHours())}:\${pad(d.getMinutes())}\`;
}
function fmtDT(v){
  if(!v||v==='--')return'--';
  if(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}/.test(v)){
    const[date,time]=v.split('T');
    const[y,m,d]=date.split('-');
    return \`\${m}/\${d}/\${y} \${time}\`;
  }
  return v;
}`
);

// B2–B6: type="time" → datetime-local
// These strings appear inside template literals in app.js, so the ${nowTime()} 
// is LITERAL TEXT in the source file — we match it as a plain string.
patch('B2  Vitals time input → datetime-local',
  'id="vt-time" type="time"',   'id="vt-time" type="datetime-local"');

patch('B3  Labs time input → datetime-local',
  'id="lab-time" type="time"',  'id="lab-time" type="datetime-local"');

patch('B4  Note time input → datetime-local',
  'id="note-time" type="time"', 'id="note-time" type="datetime-local"');

patch('B5  I/O intake time input → datetime-local',
  'id="io-in-time" type="time"',  'id="io-in-time" type="datetime-local"');

patch('B6  I/O output time input → datetime-local',
  'id="io-out-time" type="time"', 'id="io-out-time" type="datetime-local"');

// B7: MAR med-time input
patch('B7  MAR administration time input → datetime-local with default',
  "type=\"time\" value=\"${esc(m.time||'')}\"",
  'type="datetime-local" value="${esc(m.time||nowTime())}"');

// B8a–B8d: flowsheet display
patch('B8a Vitals flowsheet time → fmtDT()',
  '<td>${esc(v.time)}</td>',
  '<td style="white-space:nowrap;">${fmtDT(v.time)}</td>');

patch('B8b Labs flowsheet time → fmtDT()',
  '<td>${esc(l.time)}</td>',
  '<td style="white-space:nowrap;">${fmtDT(l.time)}</td>');

patch('B8c I/O flowsheet time → fmtDT()',
  '<td>${esc(e.time)}</td>',
  '<td style="white-space:nowrap;">${fmtDT(e.time)}</td>');

patch('B8d Nursing note timestamp → fmtDT()',
  '| ${esc(n.time)} |',
  '| ${fmtDT(n.time)} |');

// ═══════════════════════════════════════════════════════════════════════════
// WRITE & REPORT
// ═══════════════════════════════════════════════════════════════════════════

fs.writeFileSync(TARGET, src);

console.log('PATCH REPORT');
console.log('═'.repeat(60));
report.forEach(r => console.log(r));
console.log('═'.repeat(60));
console.log(`\n  Applied : ${applied}`);
console.log(`  Skipped : ${skipped}  (already applied, or source differs)`);
console.log(`\n✓  app.js written (${(src.length/1024).toFixed(0)} KB)`);
console.log('  Original preserved → app.js.bak\n');
