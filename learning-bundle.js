(function(){
  const RUBRIC = [
    {
      key: 'assessment',
      label: 'Assessment and monitoring',
      points: 20,
      guide: 'Latest vitals, focused assessment narrative, and abnormal-cue recognition are present.'
    },
    {
      key: 'meds',
      label: 'Medication and order safety',
      points: 20,
      guide: 'Medication actions, allergy checks, hold parameters, and priority order completion are documented.'
    },
    {
      key: 'reasoning',
      label: 'Clinical reasoning and prioritization',
      points: 20,
      guide: 'Reasoning prompts, nursing priorities, care plan, and debriefing show defensible clinical judgment.'
    },
    {
      key: 'communication',
      label: 'Communication and handoff',
      points: 20,
      guide: 'SBAR is complete and supported by provider notification or handoff-ready documentation.'
    },
    {
      key: 'documentation',
      label: 'Education and documentation quality',
      points: 20,
      guide: 'Patient education, signed notes, I/O, timestamps, and evaluations are complete enough for continuity.'
    }
  ];

  let activePanel = 'check';
  let bundleCollapsed = true;

  function safeEsc(v){
    if(typeof esc === 'function') return esc(v);
    return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function patientFromAttempt(row){
    return row?.chart?.patient || {};
  }

  function latest(arr){
    return Array.isArray(arr) && arr.length ? arr[arr.length - 1] : {};
  }

  function words(v){
    return String(v || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function hasAny(v){
    return String(v || '').trim().length > 0;
  }

  function getRubric(p){
    const vitals = p.vitals || [];
    const meds = p.meds || [];
    const orders = p.orders || [];
    const notes = p.notes || [];
    const care = p.carePlan || [];
    const education = p.education || [];
    const io = p.io || [];
    const sbar = p.sbar || {};
    const reasoning = p.reasoningResponses || {};
    const debrief = p.debriefing || {};
    const assessment = p.assessment || {};
    const allergyText = String(p.allergies || '').toLowerCase();
    const hasAllergy = allergyText && allergyText !== 'nkda' && allergyText !== 'nka';
    const medActionCount = meds.filter(m => ['given','hold','not_given'].includes(m.status)).length;
    const orderCompleteCount = orders.filter(o => o.nurseCompleted || String(o.status || '').toLowerCase() === 'complete').length;

    const categories = {
      assessment: {
        score:
          (vitals.length ? 6 : 0) +
          (vitals.length >= 2 ? 4 : 0) +
          (words(assessment.narrative) >= 15 ? 6 : 0) +
          (notes.some(n => /reassess|worsen|improv|alert|notify/i.test(n.body || '')) ? 4 : 0),
        issues: [
          !vitals.length && 'Add at least one complete vital-sign set.',
          vitals.length < 2 && 'Add a reassessment vital-sign set after intervention or time passes.',
          words(assessment.narrative) < 15 && 'Write a focused assessment narrative with priority cues.',
          !notes.some(n => /reassess|worsen|improv|alert|notify/i.test(n.body || '')) && 'Document recognition of abnormal cues or patient response.'
        ].filter(Boolean)
      },
      meds: {
        score:
          (meds.length ? 4 : 0) +
          (meds.length && medActionCount === meds.length ? 6 : medActionCount ? 3 : 0) +
          (hasAllergy ? (notes.some(n => /allerg/i.test(n.body || '')) ? 4 : 0) : 4) +
          (orders.length && orderCompleteCount ? 4 : 0) +
          (meds.some(m => hasAny(m.note) || hasAny(m.warn)) ? 2 : 0),
        issues: [
          !meds.length && 'Add or reconcile the medication administration record.',
          meds.length && medActionCount < meds.length && 'Mark each medication as given, held, not given, or pending with rationale.',
          hasAllergy && !notes.some(n => /allerg/i.test(n.body || '')) && 'Document allergy verification before medication administration.',
          orders.length && !orderCompleteCount && 'Complete or address at least one priority provider order.',
          !meds.some(m => hasAny(m.note) || hasAny(m.warn)) && 'Add medication safety notes, hold parameters, or response documentation.'
        ].filter(Boolean)
      },
      reasoning: {
        score:
          (Object.values(reasoning).filter(hasAny).length ? 8 : 0) +
          (care.some(c => hasAny(c.dx)) ? 5 : 0) +
          (care.some(c => hasAny(c.interventions)) ? 3 : 0) +
          (hasAny(debrief.strengths) ? 2 : 0) +
          (hasAny(debrief.improvements) ? 2 : 0),
        issues: [
          !Object.values(reasoning).filter(hasAny).length && 'Answer the clinical reasoning prompts.',
          !care.some(c => hasAny(c.dx)) && 'Add a priority nursing diagnosis or problem.',
          !care.some(c => hasAny(c.interventions)) && 'Link interventions to the priority problem.',
          !hasAny(debrief.strengths) && 'Complete the debriefing strength field.',
          !hasAny(debrief.improvements) && 'Complete the debriefing improvement field.'
        ].filter(Boolean)
      },
      communication: {
        score:
          (hasAny(sbar.s) ? 3 : 0) +
          (hasAny(sbar.b) ? 3 : 0) +
          (hasAny(sbar.a) ? 3 : 0) +
          (hasAny(sbar.r) ? 3 : 0) +
          (notes.some(n => /sbar|provider|notify|handoff|report/i.test(`${n.type || ''} ${n.body || ''}`)) ? 5 : 0) +
          (vitals.length && hasAny(latest(vitals).note) ? 3 : 0),
        issues: [
          !hasAny(sbar.s) && 'Complete SBAR Situation.',
          !hasAny(sbar.b) && 'Complete SBAR Background.',
          !hasAny(sbar.a) && 'Complete SBAR Assessment.',
          !hasAny(sbar.r) && 'Complete SBAR Recommendation.',
          !notes.some(n => /sbar|provider|notify|handoff|report/i.test(`${n.type || ''} ${n.body || ''}`)) && 'Sign a note showing provider notification or handoff communication.'
        ].filter(Boolean)
      },
      documentation: {
        score:
          (education.some(e => e.status === 'Complete') ? 5 : 0) +
          (education.some(e => hasAny(e.response)) ? 3 : 0) +
          (notes.length ? 4 : 0) +
          (io.length ? 3 : 0) +
          (care.some(c => hasAny(c.evaluation)) ? 3 : 0) +
          (notes.some(n => hasAny(n.time) && hasAny(n.by)) ? 2 : 0),
        issues: [
          !education.some(e => e.status === 'Complete') && 'Complete at least one patient education topic.',
          !education.some(e => hasAny(e.response)) && 'Document learner or patient response to education.',
          !notes.length && 'Add a signed nursing note.',
          !io.length && 'Chart intake/output when relevant to the scenario.',
          !care.some(c => hasAny(c.evaluation)) && 'Evaluate the care plan goal or intervention response.'
        ].filter(Boolean)
      }
    };

    const details = RUBRIC.map(item => ({
      ...item,
      score: Math.min(item.points, categories[item.key].score),
      issues: categories[item.key].issues
    }));
    const total = details.reduce((sum, item) => sum + item.score, 0);
    const issues = details.flatMap(item => item.issues.map(text => ({category: item.label, text})));
    return {total, details, issues};
  }

  function priorityLevel(score){
    if(score >= 85) return {label:'Ready for instructor review', cls:'ok'};
    if(score >= 70) return {label:'Needs minor cleanup', cls:'warn'};
    return {label:'Needs completion before submission', cls:'risk'};
  }

  function buildTimeline(p){
    const events = [];
    (p.vitals || []).forEach(v => events.push({
      time: v.time,
      title: 'Vitals charted',
      body: `HR ${v.hr || '--'}, BP ${v.bps || '--'}/${v.bpd || '--'}, RR ${v.rr || '--'}, SpO2 ${v.spo2 || '--'}%. ${v.note || ''}`
    }));
    (p.labs || []).forEach(l => events.push({
      time: l.time,
      title: `Lab ${l.flag || ''}: ${l.test || 'result'}`,
      body: `${l.result || '--'} ${l.range ? `(ref ${l.range})` : ''} ${l.note || ''}`
    }));
    (p.meds || []).filter(m => m.status && m.status !== 'pending').forEach(m => events.push({
      time: m.time || '',
      title: `Medication ${m.status}`,
      body: `${m.name || 'Medication'} ${m.dose || ''} ${m.route || ''}. ${m.note || m.warn || ''}`
    }));
    (p.io || []).forEach(e => events.push({
      time: e.time,
      title: `I/O ${e.direction || ''}`,
      body: `${e.type || 'entry'} ${e.amount ? `${e.amount} mL` : ''}. ${e.characteristic || e.note || ''}`
    }));
    (p.orders || []).filter(o => o.nurseCompleted || String(o.status || '').toLowerCase() === 'complete').forEach(o => events.push({
      time: '',
      title: 'Order completed',
      body: `${o.order || ''}. ${o.details || ''}`
    }));
    (p.notes || []).forEach(n => events.push({
      time: n.time,
      title: n.type || 'Nursing note',
      body: n.body || ''
    }));
    if(p.sbar && (p.sbar.s || p.sbar.a || p.sbar.r)){
      events.push({time:'', title:'SBAR prepared', body:[p.sbar.s, p.sbar.a, p.sbar.r].filter(Boolean).join(' ')});
    }
    return events.sort((a,b) => String(a.time || '9999').localeCompare(String(b.time || '9999'))).slice(-14);
  }

  function handoffSummary(p){
    const lastVital = latest(p.vitals || []);
    const pendingMeds = (p.meds || []).filter(m => !m.status || m.status === 'pending').map(m => m.name).filter(Boolean);
    const activeOrders = (p.orders || []).filter(o => !o.nurseCompleted && String(o.status || '').toLowerCase() !== 'complete').map(o => o.order).filter(Boolean);
    const alerts = getRubric(p).issues.slice(0, 4).map(i => `- ${i.text}`);
    return [
      `Patient: ${p.lastName || ''}, ${p.firstName || ''} | MRN ${p.mrn || ''}`,
      `Diagnosis: ${p.diagnosis || 'Not documented'} | Acuity: ${p.acuity || 'Not documented'}`,
      `Situation: ${p.sbar?.s || p.chiefComplaint || 'Situation not documented.'}`,
      `Background: ${p.sbar?.b || p.hpi || p.background || 'Background not documented.'}`,
      `Latest vitals: HR ${lastVital.hr || '--'}, BP ${lastVital.bps || '--'}/${lastVital.bpd || '--'}, RR ${lastVital.rr || '--'}, SpO2 ${lastVital.spo2 || '--'}%, Pain ${lastVital.pain || '--'}.`,
      `Assessment: ${p.sbar?.a || p.assessment?.narrative || 'Focused assessment not documented.'}`,
      `Recommendation: ${p.sbar?.r || 'Recommendation not documented.'}`,
      `Pending medications: ${pendingMeds.length ? pendingMeds.join(', ') : 'None documented.'}`,
      `Active orders: ${activeOrders.length ? activeOrders.slice(0, 5).join(', ') : 'None documented.'}`,
      `Priority cleanup:\n${alerts.length ? alerts.join('\n') : '- No major chart gaps detected.'}`
    ].join('\n\n');
  }

  function rubricText(result){
    return result.details.map(item => `${item.label}: ${item.score}/${item.points} - ${item.guide}`).join('\n');
  }

  function reviewComment(result, p){
    const topIssues = result.issues.slice(0, 6).map(i => `- ${i.text}`).join('\n') || '- No major chart gaps detected.';
    return [
      `Objective rubric score: ${result.total}/100`,
      '',
      rubricText(result),
      '',
      'Priority feedback:',
      topIssues,
      '',
      'Handoff snapshot:',
      handoffSummary(p)
    ].join('\n');
  }

  function renderCheckPanel(p){
    const result = getRubric(p);
    const status = priorityLevel(result.total);
    const issueItems = result.issues.slice(0, 8).map(i => `<li><span class="lb-dot ${status.cls}"></span><span><strong>${safeEsc(i.category)}:</strong> ${safeEsc(i.text)}</span></li>`).join('');
    const rubricRows = result.details.map(item => `
      <div class="lb-rubric-row">
        <strong><span>${safeEsc(item.label)}</span><span>${item.score}/${item.points}</span></strong>
        <p>${safeEsc(item.guide)}</p>
      </div>`).join('');

    return `
      <div class="lb-score-grid">
        <div class="lb-score"><strong>${result.total}</strong><span>${safeEsc(status.label)}</span></div>
        <div>
          <ul class="lb-list">${issueItems || '<li><span class="lb-dot ok"></span><span>No major chart gaps detected.</span></li>'}</ul>
          <div class="lb-rubric" style="margin-top:12px;">${rubricRows}</div>
        </div>
      </div>`;
  }

  function renderTimelinePanel(p){
    const rows = buildTimeline(p).map(e => `
      <div class="lb-event">
        <time>${safeEsc(e.time || 'No time')}</time>
        <div><strong>${safeEsc(e.title)}</strong><span>${safeEsc(e.body)}</span></div>
      </div>`).join('');
    return `<div class="lb-timeline">${rows || '<p class="text-block">No timeline events yet.</p>'}</div>`;
  }

  function renderHandoffPanel(p){
    return `
      <textarea class="lb-handoff" id="lb-handoff-text">${safeEsc(handoffSummary(p))}</textarea>
      <div class="actions"><button class="btn" id="lb-copy-handoff">Copy handoff</button></div>`;
  }

  function renderBundle(p){
    const result = getRubric(p);
    const status = priorityLevel(result.total);
    const panels = {
      check: renderCheckPanel(p),
      timeline: renderTimelinePanel(p),
      handoff: renderHandoffPanel(p)
    };
    return `
      <div class="learning-bundle ${bundleCollapsed ? 'collapsed' : ''}" id="learning-bundle">
        <div class="learning-bundle__head">
          <div>
            <p class="learning-bundle__title">Chart readiness bundle</p>
            <div class="learning-bundle__meta">${result.total}/100 - ${safeEsc(status.label)}</div>
          </div>
          <div class="learning-bundle__tools">
            <div class="lb-tabs">
              ${Object.keys(panels).map(k => `<button class="lb-tab ${activePanel === k ? 'active' : ''}" data-lb-panel="${k}">${safeEsc(k === 'check' ? 'Completeness' : k === 'timeline' ? 'Timeline' : 'Handoff')}</button>`).join('')}
            </div>
            <button class="btn small" id="lb-toggle-bundle" type="button" aria-expanded="${bundleCollapsed ? 'false' : 'true'}">${bundleCollapsed ? 'Expand' : 'Collapse'}</button>
          </div>
        </div>
        <div class="learning-bundle__body">
          ${Object.entries(panels).map(([k, html]) => `<div class="lb-panel ${activePanel === k ? 'active' : ''}" data-lb-panel-view="${k}">${html}</div>`).join('')}
        </div>
      </div>`;
  }

  function addStudentBundle(){
    const content = document.getElementById('content');
    if(!content || document.getElementById('learning-bundle')) return;
    if(typeof state === 'undefined' || ['dashboard','statusboard'].includes(state.tab)) return;
    const p = currentPatient();
    content.insertAdjacentHTML('afterbegin', renderBundle(p));
  }

  function enhanceDashboard(){
    if(typeof state === 'undefined' || state.tab !== 'dashboard') return;
    const selected = typeof dashboardRows !== 'undefined' ? dashboardRows.find(r => r.id === dashboardSelectedId) : null;
    if(!selected || document.getElementById('lb-rubric-tools')) return;
    const side = document.querySelector(`[data-save-review="${selected.id}"]`)?.closest('.actions');
    if(!side) return;
    const p = patientFromAttempt(selected);
    const result = getRubric(p);
    side.insertAdjacentHTML('beforebegin', `
      <div id="lb-rubric-tools" class="lb-rubric" style="margin-top:12px;">
        <div class="lb-rubric-row">
          <strong><span>Objective rubric score</span><span>${result.total}/100</span></strong>
          <p>Use this to prefill score and comments from observable chart evidence.</p>
        </div>
        ${result.details.map(item => `<div class="lb-rubric-row"><strong><span>${safeEsc(item.label)}</span><span>${item.score}/${item.points}</span></strong><p>${safeEsc(item.guide)}</p></div>`).join('')}
        <button class="btn navy" id="lb-apply-rubric" type="button">Apply objective rubric</button>
      </div>
    `);
  }

  function bindBundleEvents(){
    document.getElementById('lb-toggle-bundle')?.addEventListener('click', () => {
      bundleCollapsed = !bundleCollapsed;
      if(typeof render === 'function') render();
    });
    document.querySelectorAll('[data-lb-panel]').forEach(btn => {
      btn.onclick = () => {
        activePanel = btn.dataset.lbPanel;
        if(typeof render === 'function') render();
      };
    });
    document.getElementById('lb-copy-handoff')?.addEventListener('click', () => {
      const text = document.getElementById('lb-handoff-text')?.value || '';
      navigator.clipboard?.writeText(text).then(() => toast?.('Handoff copied')).catch(() => prompt('Copy handoff:', text));
    });
    document.getElementById('lb-apply-rubric')?.addEventListener('click', () => {
      const selected = dashboardRows.find(r => r.id === dashboardSelectedId);
      if(!selected) return;
      const p = patientFromAttempt(selected);
      const result = getRubric(p);
      const score = document.getElementById(`review-score-${selected.id}`);
      const comment = document.getElementById(`review-comment-${selected.id}`);
      if(score) score.value = result.total;
      if(comment) comment.value = reviewComment(result, p);
    });
  }

  function augment(){
    try {
      addStudentBundle();
      enhanceDashboard();
      bindBundleEvents();
    } catch(err) {
      console.warn('Learning bundle failed:', err);
    }
  }

  function install(){
    if(typeof render === 'function' && !render.__learningBundle){
      const originalRender = render;
      render = function(){
        const result = originalRender.apply(this, arguments);
        augment();
        return result;
      };
      render.__learningBundle = true;
    }

    if(typeof submitCurrentChart === 'function' && !submitCurrentChart.__learningBundle){
      const originalSubmit = submitCurrentChart;
      submitCurrentChart = async function(){
        const result = getRubric(currentPatient());
        if(result.total < 85){
          const message = [
            `Chart readiness score is ${result.total}/100.`,
            '',
            'Top items to fix:',
            ...(result.issues.slice(0, 5).map(i => `- ${i.text}`)),
            '',
            'Submit anyway?'
          ].join('\n');
          if(!confirm(message)) return;
        }
        return originalSubmit.apply(this, arguments);
      };
      submitCurrentChart.__learningBundle = true;
    }

    window.HCTLearningBundle = {
      getRubric,
      buildTimeline,
      handoffSummary,
      reviewComment,
      guide: RUBRIC
    };

    augment();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
