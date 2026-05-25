(function(){
  'use strict';

  const FACULTY_ROLES = new Set(['instructor']);
  const ASSESS_KEYS = ['neuro','resp','cardiac','gi','gu','skin','safety','pain','specialty','psychosocial','narrative'];
  const ASSESS_LABELS = {resp:'Respiratory',gi:'GI',gu:'GU / Output',neuro:'Neurological',cardiac:'Cardiac / Perfusion',skin:'Skin / Wound',safety:'Safety',pain:'Pain',specialty:'Specialty',psychosocial:'Psychosocial',narrative:'Narrative'};
  const NORMAL_FINDING = /\b(alert and oriented x?4|alert and oriented x?3|perrl|clear breath sounds|regular rhythm|capillary refill\s*(<|less than)\s*3|skin warm dry|intact skin|soft non[- ]tender|bowel sounds present|voiding without difficulty|denies pain|pain\s*0\/?10|no acute distress|within normal limits|normal|negative|wound clean dry intact)\b/i;
  const ABNORMAL_WORDS = /\b(abnormal|low|high|decreased|increased|weak|absent|irregular|pain|distress|confused|dizzy|cyan|edema|bleeding|fever|hypotens|hypertens|tachy|brady|hypoxia|wheeze|crackles|risk|positive|impaired|severe|worsen|agitated|hallucination|shortness|dyspnea|kussmaul|pale|cool|fall|infection|drainage|oliguria|anuria|vomit|diarrhea|sluggish|non-reactive|unequal|disoriented|lethargic)\b/i;
  const LAB_TESTS = [
    {name:'Complete Blood Count - WBC', range:'4.5-11.0 x10^9/L', lo:4.5, hi:11, critLo:1, critHi:30},
    {name:'Complete Blood Count - Hemoglobin', range:'12.0-16.0 g/dL (F), 13.5-17.5 g/dL (M)', lo:12, hi:17.5, critLo:7, critHi:20},
    {name:'Complete Blood Count - Hematocrit', range:'36-46% (F), 41-53% (M)', lo:36, hi:53, critLo:20, critHi:60},
    {name:'Platelet Count', range:'150-400 x10^9/L', lo:150, hi:400, critLo:50, critHi:1000},
    {name:'Sodium', range:'135-145 mmol/L', lo:135, hi:145, critLo:120, critHi:160},
    {name:'Potassium', range:'3.5-5.0 mmol/L', lo:3.5, hi:5, critLo:2.5, critHi:6.5},
    {name:'Chloride', range:'98-107 mmol/L', lo:98, hi:107, critLo:80, critHi:115},
    {name:'Bicarbonate / CO2', range:'22-29 mmol/L', lo:22, hi:29, critLo:10, critHi:40},
    {name:'BUN', range:'7-20 mg/dL', lo:7, hi:20, critLo:0, critHi:100},
    {name:'Creatinine', range:'0.6-1.3 mg/dL', lo:0.6, hi:1.3, critLo:0, critHi:5},
    {name:'Glucose', range:'70-110 mg/dL', lo:70, hi:110, critLo:40, critHi:400},
    {name:'Calcium', range:'8.5-10.5 mg/dL', lo:8.5, hi:10.5, critLo:6, critHi:13},
    {name:'Magnesium', range:'1.7-2.2 mg/dL', lo:1.7, hi:2.2, critLo:1, critHi:5},
    {name:'Lactate', range:'0.5-2.0 mmol/L', lo:0.5, hi:2, critLo:0, critHi:4},
    {name:'Troponin I', range:'<0.04 ng/mL', lo:0, hi:0.04, critLo:0, critHi:0.4},
    {name:'PT / INR', range:'INR 0.8-1.1 (not anticoagulated)', lo:0.8, hi:1.1, critLo:0, critHi:5},
    {name:'aPTT', range:'25-35 seconds', lo:25, hi:35, critLo:0, critHi:80},
    {name:'Urinalysis', range:'Negative glucose/ketones/nitrites/leukocytes', text:true},
    {name:'Blood Culture', range:'No growth', text:true},
    {name:'ABG - pH', range:'7.35-7.45', lo:7.35, hi:7.45, critLo:7.2, critHi:7.6},
    {name:'ABG - PaCO2', range:'35-45 mmHg', lo:35, hi:45, critLo:20, critHi:70},
    {name:'ABG - PaO2', range:'80-100 mmHg', lo:80, hi:100, critLo:50, critHi:200},
    {name:'Chest X-ray', range:'No acute cardiopulmonary abnormality', imaging:true, text:true},
    {name:'CT Scan', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'MRI', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'Ultrasound', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'ECG / EKG', range:'Normal sinus rhythm, no acute ST-T changes', imaging:true, text:true}
  ];

  function g(name){ try { return window[name] || eval(name); } catch(_) { return window[name]; } }
  function expose(name, value){ window[name] = value; try { eval(name + ' = value'); } catch(_) {} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function lines(v){ return esc(v).replace(/\n/g,'<br>'); }
  function cleanText(v){ return String(v == null ? '' : v).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
  function current(){ const fn = g('currentPatient'); return typeof fn === 'function' ? fn() : null; }
  function isInstructor(){ const cloud = g('cloud') || {}; return FACULTY_ROLES.has(String(cloud.profile?.role || '').trim().toLowerCase()); }
  function section(title, body){ const nativeSection = g('section'); return typeof nativeSection === 'function' ? nativeSection(title, body) : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3></div><div class="card-body">${body}</div></div>`; }
  function field(label, value){ const nativeField = g('field'); return typeof nativeField === 'function' ? nativeField(label, value || '--') : `<div class="field"><span class="k">${esc(label)}</span><span class="v">${lines(value || '--')}</span></div>`; }
  function table(heads, rows){ const nativeTable = g('table'); return typeof nativeTable === 'function' ? nativeTable(heads, rows) : `<table><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`; }
  function statusClass(v){ const fn = g('statusClass'); return typeof fn === 'function' ? fn(v) : String(v||'').toLowerCase(); }
  function nowTime(){ const fn = g('nowTime'); return typeof fn === 'function' ? fn() : new Date().toISOString().slice(0,16); }
  function nowDisplay(v){ const fn = g('nowDisplay'); return typeof fn === 'function' ? fn(v) : (v || '--'); }
  function celsius(v){ const n = parseFloat(v); return isNaN(n) ? null : Math.round(n * 10) / 10; }
  function labMeta(name){ return LAB_TESTS.find(t => t.name === name) || LAB_TESTS.find(t => String(name||'').toLowerCase().includes(t.name.toLowerCase())); }
  function numericValue(v){ const match = String(v == null ? '' : v).match(/-?\d+(?:\.\d+)?/); return match ? Number(match[0]) : NaN; }
  function classifyLab(meta, result){
    if (!meta || meta.text || meta.lo == null || meta.hi == null) return 'Normal';
    const n = numericValue(result);
    if (isNaN(n)) return 'Normal';
    if ((meta.critLo != null && n <= meta.critLo) || (meta.critHi != null && n >= meta.critHi)) return 'Critical';
    if (n < meta.lo) return 'Low';
    if (n > meta.hi) return 'High';
    return 'Normal';
  }
  function normalizeLab(l){ return Array.isArray(l) ? {time:l[0], test:l[1], result:l[2], range:l[3], flag:l[4], note:l[5]} : (l || {}); }
  function isAlertFlag(flag){ return /^(high|low|critical)$/i.test(String(flag || '').trim()); }

  function assessmentEntries(p){
    const a = p?.assessment || {};
    return ASSESS_KEYS.map(k => ({key:k, label:ASSESS_LABELS[k] || k, value:String(a[k] || '').trim()})).filter(x => x.value);
  }
  function isAbnormalAssessment(x){
    const value = cleanText(x.value);
    if (!value || NORMAL_FINDING.test(value) && !ABNORMAL_WORDS.test(value)) return false;
    return ABNORMAL_WORDS.test(value);
  }
  function abnormalAssessmentEntries(p){ return assessmentEntries(p).filter(isAbnormalAssessment); }

  function vitalAlerts(p){
    const alerts = [];
    const rules = g('VITAL_RULES') || [];
    (p?.vitals || []).forEach(v => {
      rules.forEach(r => {
        const value = r.key === 'tempc' ? celsius(v.temp) : Number(v[r.key]);
        if (value !== null && !isNaN(value) && (value < r.lo || value > r.hi)) {
          const valText = r.key === 'tempc' ? `${value.toFixed(1)} C` : `${value} ${r.unit || ''}`;
          alerts.push({type:'Vital signs', title:`${r.label}: ${valText}`, detail:`${v.time ? nowDisplay(v.time) + ' - ' : ''}${r.msg}`});
        }
      });
    });
    return alerts;
  }
  function labAlerts(p){
    return (p?.labs || []).map(normalizeLab).filter(l => isAlertFlag(l.flag)).map(l => ({
      type:'Labs / diagnostics',
      title:`${l.test || 'Test'}: ${l.result || '--'}`,
      detail:`${l.flag}${l.range ? ' | Range: ' + l.range : ''}${l.note ? ' | ' + l.note : ''}`
    }));
  }
  function allAlerts(p){
    const alerts = [...vitalAlerts(p), ...labAlerts(p)];
    abnormalAssessmentEntries(p).forEach(x => alerts.push({type:'Focused assessment', title:x.label, detail:x.value}));
    const seen = new Set();
    return alerts.filter(a => { const key = `${a.type}|${a.title}|${a.detail}`.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
  }
  function alertsHtml(p){
    const alerts = allAlerts(p);
    if (!alerts.length) return '<p style="color:var(--subtle);font-size:12px;">No active alerts.</p>';
    return `<div class="hct-alert-list">${alerts.map(a => `<div class="notice danger hct-red-alert"><span class="mark">${esc(a.type)}</span><span><strong>${esc(a.title)}</strong><br>${esc(a.detail)}</span></div>`).join('')}</div>`;
  }
  function assessmentAlertsHtml(p){
    const entries = abnormalAssessmentEntries(p);
    if (!entries.length) return '<p style="color:var(--subtle);font-size:12px;">No focused assessment alerts.</p>';
    return `<div class="grid-2 hct-assessment-grid">${entries.map(x => field(x.label, x.value)).join('')}</div>`;
  }
  function assessmentHtml(p){
    const entries = assessmentEntries(p);
    if (!entries.length) return '<p style="color:var(--subtle);font-size:12px;">Focused assessment not documented yet.</p>';
    return `<div class="grid-2 hct-assessment-grid">${entries.map(x => field(x.label, x.value)).join('')}</div>`;
  }
  function familyHtml(p){ return `<div class="grid-2">${field('Family / caregiver contact', p.familyContact || 'No family contact documented.')}${field('Social context', p.social || 'No social context documented.')}</div>${assessmentEntries(p).length ? `<div style="margin-top:10px;">${assessmentHtml(p)}</div>` : ''}`; }

  function patchFacultyVisibility(){
    expose('isInstructor', isInstructor);
    const originalFacultyTab = g('isFacultyTab');
    expose('isFacultyTab', function(tab){ return tab === 'modulebuilder' ? !isInstructor() : (typeof originalFacultyTab === 'function' ? originalFacultyTab(tab) : false); });
    const originalNav = g('renderNav');
    if (typeof originalNav === 'function' && !originalNav.__finalFacultyOnly) {
      const wrapped = function(){ let html = originalNav.apply(this, arguments); if (!isInstructor()) html = html.replace(/<button class="nav-btn[\s\S]*?data-tab="modulebuilder"[\s\S]*?<\/button>/g, ''); return html; };
      wrapped.__finalFacultyOnly = true; expose('renderNav', wrapped);
    }
    const originalScenarios = g('rScenarios');
    if (typeof originalScenarios === 'function' && !originalScenarios.__finalFacultyOnly) {
      const wrapped = function(){ let html = originalScenarios.apply(this, arguments); if (!isInstructor()) html = html.replace(/<div class="card"[\s\S]*?Faculty scenario generator[\s\S]*?Save to Sample Scenarios[\s\S]*?<\/div><\/div>/i, ''); return html; };
      wrapped.__finalFacultyOnly = true; expose('rScenarios', wrapped);
    }
  }

  function patchVitals(){
    const originalVitals = g('rVitals');
    if (typeof originalVitals === 'function' && !originalVitals.__finalCelsiusOnly) {
      const wrapped = function(){
        const p = current();
        if (!p) return originalVitals.apply(this, arguments);
        const last = (p.vitals || []).slice(-1)[0] || {};
        const rules = g('VITAL_RULES') || [];
        const latestAlerts = vitalAlerts({vitals:last.time ? [last] : []});
        const alertHTML = latestAlerts.map(a => `<div class="notice danger hct-red-alert" style="margin-bottom:6px;"><span class="mark">${esc(a.title)}</span><span>${esc(a.detail)}</span></div>`).join('');
        const temp = celsius(last.temp);
        const tempBad = temp !== null && rules.some(r => r.key === 'tempc' && (temp < r.lo || temp > r.hi));
        const rows = (p.vitals || []).map((v,i) => `<tr><td>${esc(v.time)}</td><td>${esc(v.hr)}</td><td>${esc(v.bps)}/${esc(v.bpd)}</td><td>${esc(v.rr)}</td><td>${esc(v.spo2)}%</td><td>${v.temp ? esc(v.temp) + ' C' : '--'}</td><td>${esc(v.pain)}</td><td>${esc(v.fetal)}</td><td style="font-size:11px;color:var(--muted);">${esc(v.note)}</td><td><button class="btn small danger" data-del-vital="${i}">Delete</button></td></tr>`).join('');
        return `<div class="metric-row" style="grid-template-columns:repeat(6,minmax(100px,1fr));"><div class="metric"><div class="num">${esc(last.hr || '--')}</div><div class="lbl">HR (bpm)</div></div><div class="metric"><div class="num">${esc(last.bps || '--')}/${esc(last.bpd || '--')}</div><div class="lbl">BP (mmHg)</div></div><div class="metric"><div class="num">${esc(last.rr || '--')}</div><div class="lbl">RR (br/min)</div></div><div class="metric"><div class="num">${esc(last.spo2 || '--')}%</div><div class="lbl">SpO2</div></div><div class="metric"><div class="num" style="${tempBad ? 'color:var(--danger);' : ''}">${last.temp ? esc(last.temp) : '--'} C</div><div class="lbl">Temp (C)</div></div><div class="metric"><div class="num">${esc(last.pain || '--')}</div><div class="lbl">Pain (0-10)</div></div></div>${latestAlerts.length ? section('Clinical decision alerts', alertHTML) : ''}${section('Vital trend - 6-parameter chart', `<svg class="vital-chart" viewBox="0 0 760 260" style="height:240px;">${typeof g('vitalSvg') === 'function' ? g('vitalSvg')(p.vitals || []) : ''}</svg><div class="vital-legend"><span class="vl-hr">HR</span><span class="vl-bp">SBP</span><span class="vl-dbp">DBP</span><span class="vl-rr">RR</span><span class="vl-temp">Temp C</span><span class="vl-spo2">SpO2 %</span></div>`)}${section('Flowsheet', table(['Time','HR','BP','RR','SpO2','Temp','Pain','Specialty','Note',''], rows))}${section('Add vital signs', `<div class="form-grid"><input id="vt-time" type="datetime-local" value="${nowTime()}"><input id="vt-hr" type="number" placeholder="HR (bpm)"><input id="vt-bps" type="number" placeholder="SBP (mmHg)"><input id="vt-bpd" type="number" placeholder="DBP (mmHg)"><input id="vt-rr" type="number" placeholder="RR (br/min)"><input id="vt-temp" type="number" step="0.1" placeholder="Temp - Celsius only"><input id="vt-spo2" type="number" placeholder="SpO2 (%)"><input id="vt-pain" placeholder="Pain (0-10)"></div><div class="form-row"><label>Specialty / note</label><div class="grid-2"><input id="vt-fetal" placeholder="FHR, peak flow, neuro, or N/A"><input id="vt-note" placeholder="Patient response or cue"></div></div><div class="actions"><button class="btn primary" id="add-vital">Add vital signs</button></div>`)}`;
      };
      wrapped.__finalCelsiusOnly = true; expose('rVitals', wrapped);
    }
  }

  function patchLabs(){
    const originalLabs = g('rLabs');
    if (typeof originalLabs === 'function' && !originalLabs.__finalSmartLabs) {
      const wrapped = function(){
        const p = current();
        const rows = (p?.labs || []).map((raw,i) => {
          const l = normalizeLab(raw);
          const meta = labMeta(l.test);
          const image = l.imageData ? `<div class="hct-lab-image"><img src="${esc(l.imageData)}" alt="${esc(l.test || 'Imaging result')}"></div>` : '';
          return `<tr><td>${esc(nowDisplay(l.time))}</td><td>${esc(l.test)}${meta?.imaging ? '<span class="badge blue" style="margin-left:4px;">Imaging</span>' : ''}</td><td><strong>${esc(l.result)}</strong>${image}</td><td style="color:var(--muted);font-size:11px;">${esc(l.range)}</td><td><span class="status ${statusClass(l.flag)} ${isAlertFlag(l.flag) ? 'hct-lab-alert-flag' : ''}">${esc(l.flag)}</span></td><td style="font-size:11px;color:var(--muted);">${esc(l.note)}</td><td><button class="btn small danger" data-del-lab="${i}">Delete</button></td></tr>`;
        }).join('');
        const options = LAB_TESTS.map(t => `<option value="${esc(t.name)}" data-range="${esc(t.range)}" data-imaging="${t.imaging ? '1' : '0'}">${esc(t.name)}</option>`).join('');
        return section('Labs and diagnostics', table(['Time','Test','Result','Range','Flag','Note',''], rows)) + section('Add lab result', `<div class="form-grid"><input id="lab-time" type="datetime-local" value="${nowTime()}"><select id="lab-test">${options}</select><input id="lab-result" placeholder="Result"><select id="lab-flag"><option>Normal</option><option>High</option><option>Low</option><option>Critical</option><option>Pending</option></select></div><div class="form-row"><label>Range / note</label><div class="grid-2"><input id="lab-range" placeholder="Reference range" readonly><input id="lab-note" placeholder="Clinical note"></div></div><div class="form-row hct-lab-image-row" style="display:none;"><label>Imaging attachment</label><input id="lab-image" type="file" accept="image/*"></div><div class="actions"><button class="btn primary" id="add-lab">Add result</button></div>`);
      };
      wrapped.__finalSmartLabs = true; expose('rLabs', wrapped);
    }
  }

  function patchSummaryAndReport(){
    const originalSummary = g('rSummary');
    if (typeof originalSummary === 'function' && !originalSummary.__finalAlerts) {
      const wrapped = function(){ const p = current(); let html = originalSummary.apply(this, arguments); const add = section('Active clinical alerts', alertsHtml(p)) + section('Focused assessment alerts by system', assessmentAlertsHtml(p)) + section('Patient family and focused assessment', familyHtml(p)); return html.replace(/(<div class="card"><div class="card-head"><h3>Clinical picture<\/h3>)/, add + '$1'); };
      wrapped.__finalAlerts = true; expose('rSummary', wrapped);
    }
    const originalReport = g('rReport');
    if (typeof originalReport === 'function' && !originalReport.__finalAlerts) {
      const wrapped = function(){ const p = current(); let html = originalReport.apply(this, arguments); html = html.replace(/<div class="card"><div class="card-head"><h3>Active alerts<\/h3><\/div><div class="card-body">[\s\S]*?<\/div><\/div>/, section('Active alerts', alertsHtml(p))); const insert = section('Patient family / caregiver', familyHtml(p)) + section('Entered focused assessment', assessmentHtml(p)); return html.replace(/(<div class="card"><div class="card-head"><h3>Medication administration record<\/h3>)/, insert + '$1'); };
      wrapped.__finalAlerts = true; expose('rReport', wrapped);
    }
  }

  function recommendationFor(p){ const alerts = allAlerts(p).slice(0,8); if (!alerts.length) return 'Continue current monitoring, reassess per orders, and notify the provider if the patient status changes.'; const focus = alerts.map(a => `${a.type}: ${a.title}`).join('; '); let rec = `Recommend provider review now for ${focus}. Request clarification of next orders, treatment parameters, and reassessment frequency.`; if (alerts.some(a => /spo2|oxygen|respiratory|dyspnea|wheeze/i.test(`${a.title} ${a.detail}`))) rec += ' Ask for oxygen/respiratory orders and escalation criteria.'; if (alerts.some(a => /blood pressure|systolic|diastolic|hypotens|hypertens/i.test(`${a.title} ${a.detail}`))) rec += ' Ask for blood pressure parameters and fluid/medication guidance.'; if (alerts.some(a => /lab|lactate|potassium|glucose|creatinine|wbc/i.test(`${a.type} ${a.title}`))) rec += ' Request lab trend follow-up and repeat testing timing.'; return rec; }
  function assessmentForSbar(p){ const last = (p?.vitals || []).slice(-1)[0] || {}; const vitalLine = `Vitals: HR ${last.hr || '--'}, BP ${last.bps || '--'}/${last.bpd || '--'}, RR ${last.rr || '--'}, SpO2 ${last.spo2 || '--'}%, Temp ${last.temp || '--'} C.`; const abn = allAlerts(p).map(a => `${a.type} - ${a.title}: ${cleanText(a.detail)}`).slice(0, 10); return `${vitalLine}${abn.length ? '\nAbnormal findings: ' + abn.join('; ') : '\nNo abnormal findings currently flagged.'}`; }

  function patchEvents(){
    const originalBind = g('bindTabEvents');
    if (typeof originalBind === 'function' && !originalBind.__finalRequests) { const wrapped = function(){ originalBind.apply(this, arguments); bindFinalEvents(); }; wrapped.__finalRequests = true; expose('bindTabEvents', wrapped); }
    bindFinalEvents();
  }
  function bindFinalEvents(){
    const temp = document.getElementById('vt-temp');
    if (temp && !temp.dataset.finalTempBound) { temp.dataset.finalTempBound = '1'; temp.placeholder = 'Temp - Celsius only'; temp.step = '0.1'; temp.type = 'number'; }
    const addVital = document.getElementById('add-vital');
    if (addVital && !addVital.dataset.finalTempCapture) { addVital.dataset.finalTempCapture = '1'; addVital.addEventListener('click', () => { const el = document.getElementById('vt-temp'); if (el) el.value = String(el.value || '').trim(); }, true); }
    bindLabEvents();
    const insert = document.getElementById('insert-sbar-template');
    if (insert && !insert.dataset.finalSbarBound) { insert.dataset.finalSbarBound = '1'; insert.addEventListener('click', () => setTimeout(() => { const p = current(); if (!p) return; const a = document.getElementById('sb-a'); const r = document.getElementById('sb-r'); if (a) a.value = assessmentForSbar(p); if (r) r.value = recommendationFor(p); }, 0)); }
    const save = document.getElementById('save-sbar');
    if (save && !save.dataset.finalSbarCapture) { save.dataset.finalSbarCapture = '1'; save.addEventListener('click', () => { const p = current(); if (!p) return; const a = document.getElementById('sb-a'); const r = document.getElementById('sb-r'); if (a && !a.value.trim()) a.value = assessmentForSbar(p); if (r && !r.value.trim()) r.value = recommendationFor(p); }, true); }
  }
  function bindLabEvents(){
    const test = document.getElementById('lab-test');
    if (test && !test.dataset.finalLabBound) {
      test.dataset.finalLabBound = '1';
      const sync = () => { const meta = labMeta(test.value); const range = document.getElementById('lab-range'); const imgRow = document.querySelector('.hct-lab-image-row'); if (range) range.value = meta?.range || ''; if (imgRow) imgRow.style.display = meta?.imaging ? '' : 'none'; const result = document.getElementById('lab-result'); const flag = document.getElementById('lab-flag'); if (result && flag) flag.value = classifyLab(meta, result.value); };
      test.addEventListener('change', sync); document.getElementById('lab-result')?.addEventListener('input', sync); sync();
    }
    const add = document.getElementById('add-lab');
    if (add && !add.dataset.finalLabCapture) {
      add.dataset.finalLabCapture = '1';
      add.addEventListener('click', ev => {
        ev.preventDefault(); ev.stopImmediatePropagation();
        const p = current(); if (!p) return;
        const meta = labMeta(document.getElementById('lab-test')?.value);
        const file = document.getElementById('lab-image')?.files?.[0];
        const lab = {time:val('lab-time'), test:val('lab-test'), result:val('lab-result'), range:val('lab-range') || meta?.range || '', flag:classifyLab(meta, val('lab-result')), note:val('lab-note')};
        const done = () => { p.labs = p.labs || []; p.labs.push(lab); if (typeof g('persist') === 'function') g('persist')(); if (typeof g('render') === 'function') g('render')(); };
        if (file && meta?.imaging) { const reader = new FileReader(); reader.onload = () => { lab.imageData = reader.result; done(); }; reader.readAsDataURL(file); } else done();
      }, true);
    }
  }
  function val(id){ const el = document.getElementById(id); return el ? el.value : ''; }

  function patchMedicationReference(){ const inv = window.HctMedicationInventory; if (inv && Array.isArray(inv.items) && !inv.__finalFiltered) { inv.items = inv.items.filter(item => { const required = [item.generic || item.name, item.classification || item.category, item.action, item.uses || item.indications, item.nursing || item.precautions]; return required.every(v => String(v || '').trim().length > 6); }); inv.__finalFiltered = true; } document.querySelectorAll('.drug-reference-panel,.drug-popover').forEach(panel => { if (!panel.previousElementSibling?.classList?.contains('drug-reference-backdrop')) { const backdrop = document.createElement('div'); backdrop.className = 'drug-reference-backdrop'; backdrop.addEventListener('click', () => { panel.remove(); backdrop.remove(); }); panel.parentNode.insertBefore(backdrop, panel); } panel.classList.add('open','hct-drug-modal'); }); }

  function boot(){ patchFacultyVisibility(); patchVitals(); patchLabs(); patchSummaryAndReport(); patchEvents(); patchMedicationReference(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setInterval(() => { patchMedicationReference(); bindFinalEvents(); }, 500);
  setTimeout(() => { boot(); if (typeof g('render') === 'function') g('render')(); }, 1200);
})();
