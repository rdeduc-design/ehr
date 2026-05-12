(function(){
  const ORDER = ['summary','orders','vitals','assessment','meds','notes','careplan','education','sbar','reasoning','debriefing','report'];
  const PATH = [
    ['Assess','vitals','Chart baseline and reassessment vital signs.'],
    ['Document','assessment','Write the focused assessment and notes.'],
    ['Plan','careplan','Build the nursing care plan and education.'],
    ['Communicate','sbar','Complete SBAR and reasoning.'],
    ['Submit','report','Preview the printable report.']
  ];

  let guideCollapsed = true;

  function e(v){
    if(typeof esc === 'function') return esc(v);
    return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function has(v){ return String(v || '').trim().length > 0; }
  function p(){ return typeof currentPatient === 'function' ? currentPatient() : {}; }

  function completion(patient){
    const done = {
      summary: true,
      orders: (patient.orders || []).length > 0,
      labs: (patient.labs || []).length > 0,
      vitals: (patient.vitals || []).length > 0,
      assessment: has(patient.assessment?.narrative),
      meds: (patient.meds || []).some(m => m.status && m.status !== 'pending'),
      io: (patient.io || []).length > 0,
      notes: (patient.notes || []).length > 0,
      careplan: (patient.carePlan || []).some(c => has(c.dx) && has(c.interventions)),
      education: (patient.education || []).some(x => x.status === 'Complete' || has(x.response)),
      sbar: ['s','b','a','r'].every(k => has(patient.sbar?.[k])),
      reasoning: Object.values(patient.reasoningResponses || {}).some(has),
      debriefing: has(patient.debriefing?.selfScore) || has(patient.debriefing?.strengths),
      progress: true,
      peerreview: (patient.peerReviews || []).length > 0,
      report: false,
      scenarios: true,
      newpatient: true,
      dashboard: true,
      statusboard: true
    };
    const required = ORDER.filter(tab => tab !== 'report');
    const score = Math.round(required.filter(tab => done[tab]).length / required.length * 100);
    done.report = score >= 70;
    return {done, score};
  }

  function nextItems(patient){
    const c = completion(patient);
    const labels = {
      orders: 'Review provider orders',
      vitals: 'Chart vital signs',
      assessment: 'Complete focused assessment',
      meds: 'Update medication status',
      notes: 'Sign a nursing note',
      careplan: 'Add care plan priority',
      education: 'Document education response',
      sbar: 'Complete SBAR',
      reasoning: 'Answer reasoning prompts',
      debriefing: 'Finish debriefing',
      report: 'Preview print report'
    };
    return ORDER.filter(tab => !c.done[tab]).map(tab => ({tab, label: labels[tab] || tab}));
  }

  function go(tab){
    if(typeof setTab === 'function') setTab(tab);
    else if(typeof state !== 'undefined'){ state.tab = tab; render?.(); }
  }

  function guideHtml(patient){
    const c = completion(patient);
    const next = nextItems(patient);
    const current = typeof state !== 'undefined' ? state.tab : 'summary';
    const path = PATH.map(([label, tab, text]) => {
      const done = c.done[tab];
      return `<button class="ux-step ${done ? 'done' : ''} ${current === tab ? 'active' : ''}" data-ux-go="${tab}">
        <strong>${done ? 'Done: ' : ''}${e(label)}</strong>
        <span>${e(text)}</span>
      </button>`;
    }).join('');
    const todo = next.slice(0, 4).map(item => `<li><span>${e(item.label)}</span></li>`).join('');
    const nextTab = next[0]?.tab || 'report';

    return `<div class="ux-guide ${guideCollapsed ? 'collapsed' : ''}" id="ux-guide">
      <div class="ux-guide__top">
        <div>
          <p class="ux-guide__title">Student navigation guide</p>
          <p class="ux-guide__sub">Use this path to move through the chart without hunting through every section.</p>
        </div>
        <div class="ux-guide__controls">
          <div class="ux-guide__score"><strong>${c.score}%</strong><span>Core chart</span></div>
          <button class="btn small" id="ux-toggle-guide" type="button" aria-expanded="${guideCollapsed ? 'false' : 'true'}">${guideCollapsed ? 'Expand' : 'Collapse'}</button>
        </div>
      </div>
      <div class="ux-guide__body">
        <div class="ux-steps">${path}</div>
        <div class="ux-next">
          <h4>Next best actions</h4>
          <ul>${todo || '<li><span>Core charting is ready for report review.</span></li>'}</ul>
          <div class="ux-actions">
            <button class="btn primary" data-ux-go="${nextTab}">Go to next step</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function enhanceNav(){
    const patient = p();
    const c = completion(patient);
    document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
      const tab = btn.dataset.tab;
      btn.classList.toggle('ux-done', !!c.done[tab]);
      let mark = btn.querySelector('.ux-nav-state');
      if(!mark){
        mark = document.createElement('span');
        mark.className = 'ux-nav-state';
        btn.appendChild(mark);
      }
      mark.textContent = c.done[tab] ? '\u2713' : '';
      mark.title = c.done[tab] ? 'Section has charted content' : 'No charted content yet';
    });
  }

  function addGuide(){
    const content = document.getElementById('content');
    if(!content || document.getElementById('ux-guide')) return;
    if(typeof state !== 'undefined' && ['dashboard','statusboard','scenarios','newpatient'].includes(state.tab)) return;
    content.insertAdjacentHTML('afterbegin', guideHtml(p()));
  }

  function bindUx(){
    document.getElementById('ux-toggle-guide')?.addEventListener('click', () => {
      guideCollapsed = !guideCollapsed;
      if(typeof render === 'function') render();
    });
    document.querySelectorAll('[data-ux-go]').forEach(btn => btn.onclick = () => go(btn.dataset.uxGo));
  }

  function augment(){
    try{
      addGuide();
      enhanceNav();
      bindUx();
    }catch(err){
      console.warn('UI enhancements failed:', err);
    }
  }

  function install(){
    if(typeof render === 'function' && !render.__uiEnhancements){
      const original = render;
      render = function(){
        const result = original.apply(this, arguments);
        augment();
        return result;
      };
      render.__uiEnhancements = true;
    }
    augment();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
