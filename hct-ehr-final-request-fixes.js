(function(){
  'use strict';

  const FACULTY_ROLES = new Set(['instructor']);
  const ASSESS_KEYS = ['neuro','resp','cardiac','gi','gu','skin','safety','pain','specialty','psychosocial','narrative'];
  const ABNORMAL_WORDS = /\b(abnormal|low|high|decreased|increased|weak|absent|irregular|pain|distress|confused|dizzy|cyan|edema|bleeding|fever|hypotens|hypertens|tachy|brady|hypoxia|wheeze|crackles|risk|positive|impaired|severe|worsen|agitated|hallucination|shortness|dyspnea|kussmaul|pale|cool|fall|infection|drainage|oliguria|anuria|vomit|diarrhea)\b/i;

  function g(name){ try { return window[name] || eval(name); } catch(_) { return window[name]; } }
  function expose(name, value){ window[name] = value; try { eval(name + ' = value'); } catch(_) {} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function lines(v){ return esc(v).replace(/\n/g,'<br>'); }
  function cleanText(v){ return String(v == null ? '' : v).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
  function current(){ const fn = g('currentPatient'); return typeof fn === 'function' ? fn() : null; }
  function isInstructor(){ const cloud = g('cloud') || {}; return FACULTY_ROLES.has(String(cloud.profile?.role || '').trim().toLowerCase()); }
  function section(title, body){ const nativeSection = g('section'); return typeof nativeSection === 'function' ? nativeSection(title, body) : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3></div><div class="card-body">${body}</div></div>`; }
  function field(label, value){ const nativeField = g('field'); return typeof nativeField === 'function' ? nativeField(label, value || '--') : `<div class="field"><span class="k">${esc(label)}</span><span class="v">${lines(value || '--')}</span></div>`; }

  function fToC(temp){ const n = parseFloat(temp); return isNaN(n) ? null : Math.round((n - 32) * 5 / 9 * 10) / 10; }
  function cToF(temp){ const n = parseFloat(temp); return isNaN(n) ? '' : (Math.round((n * 9 / 5 + 32) * 10) / 10).toFixed(1); }
  function normalizeTempInputValue(value){
    const n = parseFloat(value);
    if (isNaN(n)) return value;
    return n > 45 ? String(value) : cToF(n);
  }
  function normalizeStoredTemps(){
    const state = g('state');
    const patients = state?.patients || [];
    let changed = false;
    patients.forEach(p => (p.vitals || []).forEach(v => {
      const n = parseFloat(v.temp);
      if (!isNaN(n) && n >= 30 && n <= 45) { v.temp = cToF(n); changed = true; }
    }));
    if (changed && typeof g('persist') === 'function') g('persist')({cloud:false});
  }

  function assessmentEntries(p){
    const a = p?.assessment || {};
    return ASSESS_KEYS.map(k => ({key:k, label:({resp:'Respiratory',gi:'GI',gu:'GU / Output',neuro:'Neurological',cardiac:'Cardiac / Perfusion',skin:'Skin / Wound',safety:'Safety',pain:'Pain',specialty:'Specialty',psychosocial:'Psychosocial',narrative:'Narrative'})[k] || k, value:String(a[k] || '').trim()})).filter(x => x.value);
  }
  function abnormalAssessmentEntries(p){ return assessmentEntries(p).filter(x => ABNORMAL_WORDS.test(x.value)); }

  function allAlerts(p){
    const alerts = [];
    const rules = g('VITAL_RULES') || [];
    (p?.vitals || []).forEach(v => {
      rules.forEach(r => {
        const value = r.key === 'tempc' ? fToC(v.temp) : Number(v[r.key]);
        if (value !== null && !isNaN(value) && (value < r.lo || value > r.hi)) {
          const valText = r.key === 'tempc' ? `${value.toFixed(1)} C (${esc(v.temp)} F)` : `${value} ${r.unit || ''}`;
          alerts.push({type:'Vital signs', title:`${r.label}: ${valText}`, detail:`${v.time ? v.time + ' - ' : ''}${r.msg}`});
        }
      });
    });
    (p?.labs || []).forEach(l => {
      const row = Array.isArray(l) ? {time:l[0], test:l[1], result:l[2], range:l[3], flag:l[4], note:l[5]} : l;
      if (row.flag && !/normal|negative|within/i.test(row.flag)) alerts.push({type:'Labs / diagnostics', title:`${row.test}: ${row.result}`, detail:`Flag: ${row.flag}${row.note ? ' - ' + row.note : ''}`});
    });
    const checkMedAllergy = g('checkMedAllergy');
    (p?.meds || []).forEach(m => {
      const warn = typeof checkMedAllergy === 'function' ? checkMedAllergy(m.name || '', p.allergies || '') : null;
      if (warn) alerts.push({type:'Medication allergy', title:m.name, detail:warn});
      const medText = [m.name,m.dose,m.route,m.freq,m.priority,m.note,m.warn].filter(Boolean).join(' ');
      if (/high-alert|dual verification|allergy|hold|contraind/i.test(medText)) alerts.push({type:'Medication safety', title:m.name || 'Medication', detail:medText});
      if (/hold|not_given/.test(String(m.status || ''))) alerts.push({type:'MAR status', title:m.name || 'Medication', detail:`Status: ${m.status}${m.note ? ' - ' + m.note : ''}`});
    });
    abnormalAssessmentEntries(p).forEach(x => alerts.push({type:'Focused assessment', title:x.label, detail:x.value}));
    const seen = new Set();
    return alerts.filter(a => { const key = `${a.type}|${a.title}|${a.detail}`.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
  }
  function alertsHtml(p){
    const alerts = allAlerts(p);
    if (!alerts.length) return '<p style="color:var(--subtle);font-size:12px;">No active alerts.</p>';
    return `<div class="hct-alert-list">${alerts.map(a => `<div class="notice danger"><span class="mark">${esc(a.type)}</span><span><strong>${esc(a.title)}</strong><br>${esc(a.detail)}</span></div>`).join('')}</div>`;
  }
  function assessmentHtml(p){
    const entries = assessmentEntries(p);
    if (!entries.length) return '<p style="color:var(--subtle);font-size:12px;">Focused assessment not documented yet.</p>';
    return `<div class="grid-2 hct-assessment-grid">${entries.map(x => field(x.label, x.value)).join('')}</div>`;
  }
  function familyHtml(p){
    return `<div class="grid-2">${field('Family / caregiver contact', p.familyContact || 'No family contact documented.')}${field('Social context', p.social || 'No social context documented.')}</div>${assessmentEntries(p).length ? `<div style="margin-top:10px;">${assessmentHtml(p)}</div>` : ''}`;
  }

  function patchFacultyVisibility(){
    expose('isInstructor', isInstructor);
    const originalFacultyTab = g('isFacultyTab');
    expose('isFacultyTab', function(tab){ return tab === 'modulebuilder' ? !isInstructor() : (typeof originalFacultyTab === 'function' ? originalFacultyTab(tab) : false); });

    const originalNav = g('renderNav');
    if (typeof originalNav === 'function' && !originalNav.__finalFacultyOnly) {
      const wrapped = function(){
        let html = originalNav.apply(this, arguments);
        if (!isInstructor()) html = html.replace(/<button class="nav-btn[\s\S]*?data-tab="modulebuilder"[\s\S]*?<\/button>/g, '');
        return html;
      };
      wrapped.__finalFacultyOnly = true;
      expose('renderNav', wrapped);
    }

    const originalScenarios = g('rScenarios');
    if (typeof originalScenarios === 'function' && !originalScenarios.__finalFacultyOnly) {
      const wrapped = function(){
        let html = originalScenarios.apply(this, arguments);
        if (!isInstructor()) html = html.replace(/<div class="card"[\s\S]*?<h3>Faculty scenario generator<\/h3>[\s\S]*?<\/div><\/div>/i, '');
        if (!isInstructor()) html = html.replace(/<div class="card"[\s\S]*?Faculty scenario generator[\s\S]*?Save to Sample Scenarios[\s\S]*?<\/div><\/div>/i, '');
        return html;
      };
      wrapped.__finalFacultyOnly = true;
      expose('rScenarios', wrapped);
    }
  }

  function patchSummaryAndReport(){
    const originalSummary = g('rSummary');
    if (typeof originalSummary === 'function' && !originalSummary.__finalAlerts) {
      const wrapped = function(){
        const p = current();
        let html = originalSummary.apply(this, arguments);
        const add = section('All active alerts', alertsHtml(p)) + section('Patient family and focused assessment', familyHtml(p));
        return html.replace(/(<div class="card"><div class="card-head"><h3>Clinical picture<\/h3>)/, add + '$1');
      };
      wrapped.__finalAlerts = true;
      expose('rSummary', wrapped);
    }
    const originalReport = g('rReport');
    if (typeof originalReport === 'function' && !originalReport.__finalAlerts) {
      const wrapped = function(){
        const p = current();
        let html = originalReport.apply(this, arguments);
        html = html.replace(/<div class="card"><div class="card-head"><h3>Active alerts<\/h3><\/div><div class="card-body">[\s\S]*?<\/div><\/div>/, section('Active alerts', alertsHtml(p)));
        const insert = section('Patient family / caregiver', familyHtml(p)) + section('Entered focused assessment', assessmentHtml(p));
        return html.replace(/(<div class="card"><div class="card-head"><h3>Medication administration record<\/h3>)/, insert + '$1');
      };
      wrapped.__finalAlerts = true;
      expose('rReport', wrapped);
    }
  }

  function recommendationFor(p){
    const alerts = allAlerts(p).slice(0, 8);
    if (!alerts.length) return 'Continue current monitoring, reassess per orders, and notify the provider if the patient status changes.';
    const focus = alerts.map(a => `${a.type}: ${a.title}`).join('; ');
    let rec = `Recommend provider review now for ${focus}. Request clarification of next orders, treatment parameters, and reassessment frequency.`;
    if (alerts.some(a => /spo2|oxygen|respiratory|dyspnea|wheeze/i.test(`${a.title} ${a.detail}`))) rec += ' Ask for oxygen/respiratory orders and escalation criteria.';
    if (alerts.some(a => /blood pressure|systolic|diastolic|hypotens|hypertens/i.test(`${a.title} ${a.detail}`))) rec += ' Ask for blood pressure parameters and fluid/medication guidance.';
    if (alerts.some(a => /allergy|high-alert|medication/i.test(a.type))) rec += ' Request medication safety verification before administration.';
    if (alerts.some(a => /lab|lactate|potassium|glucose|creatinine|wbc/i.test(`${a.type} ${a.title}`))) rec += ' Request lab trend follow-up and repeat testing timing.';
    return rec;
  }
  function assessmentForSbar(p){
    const last = (p?.vitals || []).slice(-1)[0] || {};
    const vitalLine = `Vitals: HR ${last.hr || '--'}, BP ${last.bps || '--'}/${last.bpd || '--'}, RR ${last.rr || '--'}, SpO2 ${last.spo2 || '--'}%, Temp ${last.temp || '--'} F.`;
    const abn = allAlerts(p).map(a => `${a.type} - ${a.title}: ${cleanText(a.detail)}`).slice(0, 10);
    return `${vitalLine}${abn.length ? '\nAbnormal findings: ' + abn.join('; ') : '\nNo abnormal findings currently flagged.'}`;
  }

  function patchEvents(){
    const originalBind = g('bindTabEvents');
    if (typeof originalBind === 'function' && !originalBind.__finalRequests) {
      const wrapped = function(){
        originalBind.apply(this, arguments);
        bindFinalEvents();
      };
      wrapped.__finalRequests = true;
      expose('bindTabEvents', wrapped);
    }
    bindFinalEvents();
  }
  function bindFinalEvents(){
    const temp = document.getElementById('vt-temp');
    if (temp && !temp.dataset.finalTempBound) {
      temp.dataset.finalTempBound = '1';
      temp.placeholder = 'Temp - enter C; saves as F automatically';
      const hint = document.createElement('div');
      hint.className = 'hct-temp-hint';
      temp.insertAdjacentElement('afterend', hint);
      const update = () => { const n = parseFloat(temp.value); hint.textContent = !isNaN(n) && n <= 45 ? `Will save as ${cToF(n)} F` : ''; };
      temp.addEventListener('input', update);
      update();
    }
    const addVital = document.getElementById('add-vital');
    if (addVital && !addVital.dataset.finalTempCapture) {
      addVital.dataset.finalTempCapture = '1';
      addVital.addEventListener('click', () => { const el = document.getElementById('vt-temp'); if (el) el.value = normalizeTempInputValue(el.value); }, true);
    }
    const insert = document.getElementById('insert-sbar-template');
    if (insert && !insert.dataset.finalSbarBound) {
      insert.dataset.finalSbarBound = '1';
      insert.addEventListener('click', () => setTimeout(() => {
        const p = current(); if (!p) return;
        const a = document.getElementById('sb-a');
        const r = document.getElementById('sb-r');
        if (a) a.value = assessmentForSbar(p);
        if (r) r.value = recommendationFor(p);
      }, 0));
    }
    const save = document.getElementById('save-sbar');
    if (save && !save.dataset.finalSbarCapture) {
      save.dataset.finalSbarCapture = '1';
      save.addEventListener('click', () => {
        const p = current(); if (!p) return;
        const a = document.getElementById('sb-a');
        const r = document.getElementById('sb-r');
        if (a && !a.value.trim()) a.value = assessmentForSbar(p);
        if (r && !r.value.trim()) r.value = recommendationFor(p);
      }, true);
    }
  }

  function patchMedicationReference(){
    const inv = window.HctMedicationInventory;
    if (inv && Array.isArray(inv.items) && !inv.__finalFiltered) {
      inv.items = inv.items.filter(item => {
        const required = [item.generic || item.name, item.classification || item.category, item.action, item.uses || item.indications, item.nursing || item.precautions];
        return required.every(v => String(v || '').trim().length > 6);
      });
      inv.__finalFiltered = true;
    }
    document.querySelectorAll('.drug-reference-panel,.drug-popover').forEach(panel => {
      if (!panel.previousElementSibling?.classList?.contains('drug-reference-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'drug-reference-backdrop';
        backdrop.addEventListener('click', () => { panel.remove(); backdrop.remove(); });
        panel.parentNode.insertBefore(backdrop, panel);
      }
      panel.classList.add('open','hct-drug-modal');
    });
  }

  function boot(){
    normalizeStoredTemps();
    patchFacultyVisibility();
    patchSummaryAndReport();
    patchEvents();
    patchMedicationReference();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setInterval(() => { patchMedicationReference(); bindFinalEvents(); }, 500);
  setTimeout(() => { boot(); if (typeof g('render') === 'function') g('render')(); }, 1200);
})();
