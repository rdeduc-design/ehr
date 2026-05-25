(function(){
  'use strict';

  const SHARED_SCENARIOS_KEY = 'hct_ehr_shared_faculty_scenarios_v1';

  function g(name){ try { return window[name] || eval(name); } catch(_) { return window[name]; } }
  function expose(name, value){ window[name] = value; try { eval(name + ' = value'); } catch(_) {} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
  function lines(v){ return esc(v).replace(/\n/g,'<br>'); }
  function section(title, body){ const fn = g('section'); return typeof fn === 'function' ? fn(title, body) : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3></div><div class="card-body">${body}</div></div>`; }
  function table(headers, rows){ const fn = g('table'); return typeof fn === 'function' ? fn(headers, rows) : `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`; }
  function stateObj(){ return g('state') || window.state || {}; }
  function cloudObj(){ return g('cloud') || window.cloud || {}; }
  function current(){ const fn = g('currentPatient'); return typeof fn === 'function' ? fn() : null; }
  function persist(opts){ const fn = g('persist'); if (typeof fn === 'function') fn(opts || {}); }
  function render(){ const fn = g('render'); if (typeof fn === 'function') fn(); }
  function toast(msg){ const fn = g('toast'); if (typeof fn === 'function') fn(msg); }
  function nowTime(){ const fn = g('nowTime'); return typeof fn === 'function' ? fn() : new Date().toISOString().slice(0,16); }
  function nowDisplay(v){ const fn = g('nowDisplay'); return typeof fn === 'function' ? fn(v) : (v ? new Date(v).toLocaleString([], {dateStyle:'medium', timeStyle:'short'}) : '--'); }
  function val(id){ const el = document.getElementById(id); return el ? el.value : ''; }
  function isInstructor(){ return String(cloudObj().profile?.role || '').trim().toLowerCase() === 'instructor'; }
  function canFaculty(){ return isInstructor(); }
  function readSharedScenarios(){ try { return JSON.parse(localStorage.getItem(SHARED_SCENARIOS_KEY) || '[]').filter(Boolean); } catch(_) { return []; } }
  function writeSharedScenario(sc){
    if (!sc || !sc.id) return;
    const list = [sc, ...readSharedScenarios().filter(x => x.id !== sc.id)].slice(0,50);
    localStorage.setItem(SHARED_SCENARIOS_KEY, JSON.stringify(list));
  }
  function mergedScenarioLibrary(){
    const base = typeof g('scenarioLibrary') === 'function' ? g('scenarioLibrary')() : [];
    const byId = new Map();
    [...base, ...readSharedScenarios()].forEach(sc => { if (sc && sc.id && !byId.has(sc.id)) byId.set(sc.id, sc); });
    return [...byId.values()];
  }

  function patchAccessAndNav(){
    expose('canUseFacultyTools', canFaculty);
    expose('isInstructor', isInstructor);
    expose('isFacultyTab', function(tab){ return new Set(['modulebuilder','dashboard','statusboard']).has(tab) && !canFaculty(); });
    expose('toolbarButtons', function(){ return `<button class="btn small" id="print-report-btn">Print report</button><button class="btn small danger" id="reset-btn">Reset local</button>`; });
  }

  function patchScenarios(){
    const original = g('rScenarios');
    expose('rScenarios', function(){
      if (canFaculty() && typeof original === 'function') return original();
      const library = mergedScenarioLibrary();
      const rows = library.map(sc => `<article class="scenario-card hct-scenario-card"><div class="top"></div><div class="body"><span class="label">${esc(sc.focus || 'Simulation')} | ${esc(sc.level || 'Practice')}</span><h3>${esc(sc.name || 'Sample scenario')}</h3><p>${esc(sc.summary || sc.patient?.diagnosis || 'Open this case to practice a complete EHR workflow.')}</p><div class="skill-list">${(sc.skills||[]).map(s=>`<span class="badge blue">${esc(s)}</span>`).join('')}</div><button class="btn primary" data-load-scenario="${esc(sc.id)}">Open scenario</button></div></article>`).join('');
      return section('Sample scenario library', `<div class="notice info"><span class="mark">HCT</span><span>Open a sample to create a separate editable patient copy in your workspace. Faculty-created scenarios appear here when they are available.</span></div><div class="scenario-grid">${rows || '<p class="text-block">No scenarios available yet.</p>'}</div>`);
    });
  }

  function debriefQuestions(p){
    const scenarioQs = Array.isArray(p?.debriefingQuestions) ? p.debriefingQuestions : [];
    const diagnosis = p?.diagnosis || 'this condition';
    const last = (p?.vitals || []).slice(-1)[0] || {};
    const lab = (p?.labs || []).slice(-1)[0];
    const labText = Array.isArray(lab) ? `${lab[1] || 'latest lab'} ${lab[2] || ''}` : (lab?.test ? `${lab.test} ${lab.result || ''}` : 'the available labs and diagnostics');
    const base = [
      'PEARLS reactions: What was your first emotional or clinical reaction when you opened this chart?',
      `PEARLS description: What patient cues supported the diagnosis or concern of ${diagnosis}?`,
      `PEARLS analysis: Which EHR data point changed your priorities most: vital signs, orders, MAR, labs, notes, or I/O? Explain why.`,
      `PEARLS analysis: Based on HR ${last.hr || '--'}, BP ${last.bps || '--'}/${last.bpd || '--'}, RR ${last.rr || '--'}, and SpO2 ${last.spo2 || '--'}, what would you reassess first?`,
      `PEARLS analysis: How did ${labText} influence your nursing actions or provider notification?`,
      'PEARLS summary: What is one action you would repeat because it protected patient safety?',
      'PEARLS application: What will you do differently in the next EHR simulation to document, prioritize, or communicate more clearly?',
      'EHR usability: Which part of the EHR helped you make a safer decision, and which part of your charting needs cleanup before submission?'
    ];
    return [...scenarioQs, ...base].filter(Boolean).filter((q, i, arr) => arr.indexOf(q) === i);
  }

  function patchDebriefing(){
    expose('rDebriefing', function(){
      const p = current();
      const d = p.debriefing || {};
      const qs = debriefQuestions(p);
      const idx = Math.max(0, Math.min(Number(d.pearlsIndex || 0), qs.length - 1));
      const responses = d.pearlsResponses || [];
      const progress = qs.length ? Math.round(((idx + 1) / qs.length) * 100) : 0;
      const currentAnswer = responses[idx] || '';
      const savedRows = qs.map((q,i) => responses[i] ? `<tr><td>${i+1}</td><td>${esc(q)}</td><td>${lines(responses[i])}</td></tr>` : '').join('');
      return section('PEARLS debriefing', `<div class="notice info"><span class="mark">PEARLS</span><span>Answer one question at a time. Use the next button to move through reactions, description, analysis, summary, and application.</span></div><div class="hct-debrief-wizard" data-db-index="${idx}"><div class="hct-debrief-progress"><span>Question ${idx+1} of ${qs.length}</span><strong>${progress}%</strong></div><div class="hct-progress-bar"><span style="width:${progress}%"></span></div><h3>${esc(qs[idx] || 'Debriefing question')}</h3><textarea id="db-current-answer" placeholder="Type your response before moving to the next question.">${esc(currentAnswer)}</textarea><div class="actions"><button class="btn" id="db-prev" ${idx===0?'disabled':''}>Previous</button><button class="btn primary" id="db-next">${idx===qs.length-1?'Review':'Next question'}</button><button class="btn navy" id="db-submit">Submit debriefing</button></div>${d.pearlsSubmittedAt ? `<p class="hct-submit-note">Submitted ${esc(nowDisplay(d.pearlsSubmittedAt))}</p>` : ''}</div>`)
        + section('Saved debrief responses', savedRows ? table(['#','Question','Response'], savedRows) : '<p class="text-block" style="color:var(--subtle);">Responses will appear here after you answer each question.</p>')
        + (canFaculty() ? section('Facilitator notes', `<div class="form-row"><label>Facilitator notes</label><textarea id="db-fac-notes">${esc(d.facilNotes || '')}</textarea></div><div class="actions"><button class="btn navy" id="save-debrief-fac">Save facilitator notes</button></div>`) : '');
    });
  }

  function saveDebriefAt(nextIndex, submit){
    const p = current(); if (!p) return;
    p.debriefing = p.debriefing || {};
    const qs = debriefQuestions(p);
    const idx = Math.max(0, Math.min(Number(p.debriefing.pearlsIndex || 0), qs.length - 1));
    p.debriefing.pearlsResponses = p.debriefing.pearlsResponses || [];
    p.debriefing.pearlsResponses[idx] = val('db-current-answer').trim();
    p.debriefing.pearlsIndex = Math.max(0, Math.min(nextIndex, qs.length - 1));
    if (submit) p.debriefing.pearlsSubmittedAt = new Date().toISOString();
    persist();
    toast(submit ? 'Debriefing submitted' : 'Debriefing response saved');
    render();
  }

  function patchStatusBoard(){
    expose('rStatusBoard', function(){
      if (!isInstructor()) return section('Status board', '<div class="notice danger"><span class="mark">LOCKED</span><span>Status board is shown only on instructor accounts.</span></div>');
      const rows = g('dashboardRows') || window.dashboardRows || [];
      const notStarted = rows.filter(r => r.status === 'draft' && !r.chart?.patient?.notes?.length);
      const drafts = rows.filter(r => r.status === 'draft' && r.chart?.patient?.notes?.length);
      const submitted = rows.filter(r => r.status === 'submitted');
      const col = (title, items, color) => `<div class="status-col" style="border-top:3px solid ${color};"><div class="status-col-head">${esc(title)} <span class="badge blue">${items.length}</span></div>${items.map(r => `<div class="status-card hct-status-card"><strong>${esc(r.student_name || 'Student')}</strong><div>${esc(r.section || '')} | ${esc(r.scenario_name || '')}</div><div class="hct-last-edited"><span>Last edited</span>${esc(nowDisplay(r.updated_at))}</div></div>`).join('') || '<p style="color:var(--subtle);font-size:12px;padding:8px;">None</p>'}</div>`;
      return section('Submission status board', `<div class="notice info"><span class="mark">HCT</span><span>Instructor-only live view of student chart progress. Last edited now includes date and time.</span></div><div class="status-board">${col('Not started', notStarted, 'var(--subtle)')}${col('In progress: draft saved', drafts, 'var(--warning)')}${col('Submitted for review', submitted, 'var(--success)')}</div>`);
    });
  }

  function patchMedCalc(){
    expose('rMedCalc', function(){
      return section('Medication calculator', `<div class="hct-calc-grid"><div><h4>Dose by weight</h4><div class="form-row"><label>Weight (kg)</label><input id="calc-weight" type="number" step="0.01"></div><div class="form-row"><label>Ordered dose (mg/kg)</label><input id="calc-ordered" type="number" step="0.01"></div><div class="form-row"><label>Concentration (mg/mL)</label><input id="calc-concentration" type="number" step="0.01"></div><div class="form-row"><label>Safe minimum (mg/kg)</label><input id="calc-min" type="number" step="0.01"></div><div class="form-row"><label>Safe maximum (mg/kg)</label><input id="calc-max" type="number" step="0.01"></div></div><div><h4>IV rate / drip rate</h4><div class="form-row"><label>Total volume (mL)</label><input id="calc-volume" type="number" step="0.01"></div><div class="form-row"><label>Infusion time (hours)</label><input id="calc-hours" type="number" step="0.01"></div><div class="form-row"><label>Infusion time (minutes)</label><input id="calc-minutes" type="number" step="0.01"></div><div class="form-row"><label>Drop factor (gtt/mL)</label><input id="calc-drop-factor" type="number" step="0.01"></div><div class="actions" style="justify-content:flex-start;"><button class="btn primary" id="calc-run">Calculate</button><button class="btn" id="calc-clear">Clear</button></div></div></div><div id="calc-result" class="hct-calc-result">Enter values, then calculate. Always verify with facility policy and the medication order.</div>`);
    });
  }

  function runCalc(){
    const n = id => { const x = Number(val(id)); return Number.isFinite(x) ? x : 0; };
    const weight = n('calc-weight'), ordered = n('calc-ordered'), concentration = n('calc-concentration');
    const volume = n('calc-volume'), hours = n('calc-hours'), minutes = n('calc-minutes'), drop = n('calc-drop-factor');
    const min = n('calc-min'), max = n('calc-max');
    const dose = weight && ordered ? weight * ordered : 0;
    const vol = dose && concentration ? dose / concentration : 0;
    const rate = volume && hours ? volume / hours : 0;
    const gtt = volume && minutes && drop ? volume * drop / minutes : 0;
    const low = weight && min ? weight * min : 0, high = weight && max ? weight * max : 0;
    const safe = low && high && dose ? (dose >= low && dose <= high ? 'Within entered safe range' : 'Outside entered safe range - recheck order') : 'Enter safe range to compare';
    const rows = [['Total ordered dose', dose ? `${dose.toFixed(2)} mg` : '--'],['Volume to administer', vol ? `${vol.toFixed(2)} mL` : '--'],['IV pump rate', rate ? `${rate.toFixed(2)} mL/hr` : '--'],['Manual drip rate', gtt ? `${Math.round(gtt)} gtt/min` : '--'],['Safe dose check', safe]];
    const result = document.getElementById('calc-result');
    if (result) result.innerHTML = rows.map(([k,v]) => `<div class="field"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');
  }

  function bindRequest3(){
    document.getElementById('db-prev')?.addEventListener('click', () => { const p = current(); saveDebriefAt(Number(p?.debriefing?.pearlsIndex || 0) - 1, false); });
    document.getElementById('db-next')?.addEventListener('click', () => { const p = current(); saveDebriefAt(Number(p?.debriefing?.pearlsIndex || 0) + 1, false); });
    document.getElementById('db-submit')?.addEventListener('click', () => { const p = current(); saveDebriefAt(Number(p?.debriefing?.pearlsIndex || 0), true); });
    document.getElementById('calc-run')?.addEventListener('click', runCalc);
    document.getElementById('calc-clear')?.addEventListener('click', () => { document.querySelectorAll('#calc-weight,#calc-ordered,#calc-concentration,#calc-volume,#calc-hours,#calc-minutes,#calc-drop-factor,#calc-min,#calc-max').forEach(el => el.value = ''); const r = document.getElementById('calc-result'); if (r) r.textContent = 'Enter values, then calculate. Always verify with facility policy and the medication order.'; });
  }

  function patchBinders(){
    const original = g('bindTabEvents');
    if (typeof original === 'function' && !original.__direct3) {
      const wrapped = function(){ original.apply(this, arguments); bindRequest3(); };
      wrapped.__direct3 = true;
      expose('bindTabEvents', wrapped);
    }
    const oldCloud = g('bindCloudEvents');
    if (typeof oldCloud === 'function' && !oldCloud.__direct3) {
      const wrappedCloud = function(){ oldCloud.apply(this, arguments); bindRequest3(); };
      wrappedCloud.__direct3 = true;
      expose('bindCloudEvents', wrappedCloud);
    }
    bindRequest3();
  }

  function installSignOutDelegate(){
    if (window.__hctDirect3SignOut) return;
    window.__hctDirect3SignOut = true;
    document.addEventListener('click', async e => {
      const btn = e.target?.closest?.('#signout-btn,#privacy-signout');
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const cloud = cloudObj();
      try { await cloud.client?.auth?.signOut?.(); } catch(_) {}
      cloud.session = null;
      cloud.profile = null;
      cloud.status = 'Signed out';
      render();
    }, true);
  }

  function mirrorFacultyScenarioSaves(){
    if (window.__hctDirect3ScenarioMirror) return;
    window.__hctDirect3ScenarioMirror = true;
    document.addEventListener('click', e => {
      if (!e.target?.closest?.('#fs-save')) return;
      setTimeout(() => {
        const list = stateObj().customScenarios || [];
        if (list[0]) writeSharedScenario(list[0]);
      }, 300);
    }, true);
  }

  function boot(){
    patchAccessAndNav();
    patchScenarios();
    patchDebriefing();
    patchStatusBoard();
    patchMedCalc();
    patchBinders();
    installSignOutDelegate();
    mirrorFacultyScenarioSaves();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setTimeout(() => { boot(); render(); }, 900);
  setInterval(() => { patchAccessAndNav(); patchBinders(); }, 1000);
})();
