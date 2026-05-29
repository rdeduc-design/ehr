(function(){
  'use strict';

  const SYSTEM_KEYS = ['neuro','resp','cardiac','gi','gu','skin','safety','pain','specialty','psychosocial'];
  const SYSTEM_LABELS = {
    neuro:'Neurological', resp:'Respiratory', cardiac:'Cardiovascular / Perfusion',
    gi:'Gastrointestinal', gu:'Genitourinary / Output', skin:'Skin / Hydration / Wound',
    safety:'Safety / Environment', pain:'Pain Assessment', specialty:'Specialty Cues',
    psychosocial:'Psychosocial'
  };
  const NORMAL_FINDINGS = {
    neuro:['Alert and oriented x4','Speech clear and coherent','PERRLA','No focal neurological deficits'],
    resp:['Breath sounds clear bilaterally','Respirations even and unlabored','No cough noted','No shortness of breath reported'],
    cardiac:['Regular rate and rhythm','Peripheral pulses 2+ bilaterally','Capillary refill less than 2 seconds','Skin warm and dry'],
    gi:['Abdomen soft and non-tender','Bowel sounds present x4 quadrants','No nausea or vomiting','Tolerating intake as ordered'],
    gu:['Voiding spontaneously','Urine clear yellow','Output adequate','No dysuria reported'],
    skin:['Skin intact, warm, and dry','Mucous membranes moist','No pressure injury noted','IV site without redness or edema'],
    safety:['Call light within reach','Bed low and locked','Non-skid footwear in place','Patient oriented to environment'],
    pain:['No pain reported - 0/10','No non-verbal pain indicators noted'],
    specialty:['Specialty assessment within expected limits for scenario'],
    psychosocial:['Patient calm and cooperative','Patient verbalizes understanding of plan of care','Support system available as appropriate']
  };
  const ACTIONS = [
    { rx:/stridor|airway obstruction/i, actions:['Assess airway patency','Position patient upright','Monitor oxygen saturation','Notify provider immediately','Prepare for emergency airway support if worsening'], dx:['Ineffective Airway Clearance','Impaired Gas Exchange'] },
    { rx:/spo.?2|oxygen|dyspn|retraction|accessory|cyanosis|wheez|crackle|tachypnea/i, actions:['Assess work of breathing and lung sounds','Position for lung expansion','Apply oxygen as ordered','Monitor SpO2 and response','Notify provider for worsening respiratory status'], dx:['Impaired Gas Exchange','Ineffective Breathing Pattern','Ineffective Airway Clearance'] },
    { rx:/gcs\s*(<=|<|8)|obtunded|seizure|non-reactive|facial droop|aphasia|hemiparesis/i, actions:['Reassess level of consciousness and pupils','Maintain airway and aspiration precautions','Check glucose and vital signs as indicated','Institute safety precautions','Notify provider immediately'], dx:['Risk for Aspiration','Decreased Intracranial Adaptive Capacity','Risk for Ineffective Cerebral Tissue Perfusion'] },
    { rx:/fall|unsteady|weakness|confused|disoriented|lethargic|mobility/i, actions:['Implement fall precautions','Assist with ambulation and transfers','Keep call light within reach','Reassess cognition and gait','Review medications that increase fall risk'], dx:['Risk for Falls','Impaired Physical Mobility'] },
    { rx:/poor oral|weight loss|anorexia|dehydration|dry mucous|oliguria|vomiting|diarr/i, actions:['Monitor intake and output','Assess mucous membranes and daily weight','Encourage/maintain ordered fluids or nutrition','Trend electrolytes as ordered','Notify provider for worsening losses or poor output'], dx:['Deficient Fluid Volume','Imbalanced Nutrition: Less Than Body Requirements','Risk for Electrolyte Imbalance'] },
    { rx:/chest pain|mottled|capillary refill|pulses.*absent|irregular rhythm|pvc|cyanosis|jvd/i, actions:['Assess perfusion, pulses, pain, and rhythm','Obtain/monitor vital signs and ECG as ordered','Maintain ordered oxygen and activity limits','Prepare SBAR with current findings','Notify provider for unstable perfusion or rhythm'], dx:['Decreased Cardiac Output','Ineffective Peripheral Tissue Perfusion','Risk for Shock'] },
    { rx:/suicidal|homicidal|elopement|agitated|hallucination/i, actions:['Maintain a safe environment','Use therapeutic communication','Remove hazards as appropriate','Initiate observation precautions per policy','Notify provider or mental health team'], dx:['Risk for Self-Directed Violence','Risk for Other-Directed Violence','Ineffective Coping'] }
  ];

  const criticalRx = /stridor|gcs\s*(<=|<|8)|seizure|non-reactive|central cyanosis|spo.?2\s*<\s*92|anuria|heavy bleeding|suicidal|homicidal|worst possible pain|10\/10|critical/i;
  const abnormalRx = /abnormal|impaired|sluggish|unequal|weakness|droop|confused|agitated|lethargic|obtunded|hallucination|diminished|crackle|wheez|tachypnea|bradypnea|accessory|retraction|dyspn|irregular|murmur|absent|pale|mottled|clammy|cyanosis|oedema|edema|tender|distended|hypoactive|hyperactive|vomiting|diarr|melena|poor|dry|oliguria|retention|haematuria|bleeding|jaundice|rash|pressure injury|purulent|infiltration|phlebitis|fall risk|unsteady|restraints|elopement|pain|anxious|refuses|non-compliance|positive/i;

  function escHtml(s){
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function makeId(prefix){
    if(typeof window.uid === 'function') return window.uid(prefix);
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function nowIso(){
    if(typeof window.nowTime === 'function') return window.nowTime();
    return new Date().toISOString().slice(0,16);
  }
  function displayTime(t){
    if(!t) return '';
    if(typeof window.nowDisplay === 'function') return window.nowDisplay(t);
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? t : d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  }
  function patient(){
    return typeof window.currentPatient === 'function' ? window.currentPatient() : null;
  }
  function saveAndRender(doRender){
    if(typeof window.persist === 'function') window.persist();
    if(doRender !== false && typeof window.render === 'function') window.render();
  }
  function severityFor(label, fallback){
    if(fallback) return fallback;
    if(criticalRx.test(label)) return 'Critical';
    if(abnormalRx.test(label)) return 'Abnormal';
    return 'Normal';
  }
  function actionMeta(label){
    const matches = ACTIONS.filter(x => x.rx.test(label || ''));
    return {
      actions: [...new Set(matches.flatMap(x => x.actions))],
      diagnoses: [...new Set(matches.flatMap(x => x.dx))]
    };
  }
  function lineItems(text){
    return String(text || '').split(/[\n;]+/).map(x => x.trim()).filter(Boolean);
  }

  // Converts legacy plain-text assessment fields into structured finding objects without deleting the original text.
  function ensureStructured(a){
    if(!a.structuredFindings || typeof a.structuredFindings !== 'object') a.structuredFindings = {};
    SYSTEM_KEYS.forEach(k => {
      if(!Array.isArray(a.structuredFindings[k])) a.structuredFindings[k] = [];
      const existing = new Set(a.structuredFindings[k].map(f => String(f.label || '').toLowerCase()));
      lineItems(a[k]).forEach(label => {
        if(existing.has(label.toLowerCase())) return;
        const meta = actionMeta(label);
        a.structuredFindings[k].push({
          id: makeId('asf'),
          system: k,
          label,
          severity: severityFor(label),
          timestamp: '',
          suggestedActions: meta.actions,
          nursingDiagnoses: meta.diagnoses,
          legacy: true
        });
        existing.add(label.toLowerCase());
      });
    });
    syncPlainText(a);
    return a.structuredFindings;
  }
  function syncPlainText(a){
    SYSTEM_KEYS.forEach(k => {
      const findings = (a.structuredFindings?.[k] || []);
      a[k] = findings.map(f => f.label).join('\n');
    });
  }
  function addFinding(a, system, label, severity){
    if(!label) return false;
    ensureStructured(a);
    const list = a.structuredFindings[system] || (a.structuredFindings[system] = []);
    if(list.some(f => String(f.label).trim().toLowerCase() === String(label).trim().toLowerCase())) return false;
    const meta = actionMeta(label);
    list.push({
      id: makeId('asf'),
      system,
      label: String(label).trim(),
      severity: severityFor(label, severity),
      timestamp: nowIso(),
      suggestedActions: meta.actions,
      nursingDiagnoses: meta.diagnoses
    });
    syncPlainText(a);
    return true;
  }
  function removeFinding(a, system, id){
    ensureStructured(a);
    a.structuredFindings[system] = (a.structuredFindings[system] || []).filter(f => f.id !== id);
    syncPlainText(a);
  }
  function abnormalFindings(a){
    ensureStructured(a);
    return SYSTEM_KEYS.flatMap(k => (a.structuredFindings[k] || [])
      .filter(f => f.severity === 'Abnormal' || f.severity === 'Critical')
      .map(f => ({...f, system: k, systemLabel: SYSTEM_LABELS[k] || k})));
  }
  function allActions(a){
    ensureStructured(a);
    return [...new Set(SYSTEM_KEYS.flatMap(k => (a.structuredFindings[k] || [])
      .filter(f => f.severity !== 'Normal')
      .flatMap(f => f.suggestedActions || [])))];
  }
  function allDiagnoses(a){
    ensureStructured(a);
    return [...new Set(SYSTEM_KEYS.flatMap(k => (a.structuredFindings[k] || [])
      .filter(f => f.severity !== 'Normal')
      .flatMap(f => f.nursingDiagnoses || [])))];
  }
  function impression(a){
    const ab = abnormalFindings(a);
    const crit = ab.filter(f => f.severity === 'Critical');
    if(crit.length) return `Patient presents with critical findings requiring immediate reassessment, focused monitoring, and provider notification: ${crit.map(f => `${f.systemLabel} - ${f.label}`).join('; ')}.`;
    if(ab.length) return `Patient presents with abnormal assessment cues requiring continued reassessment and nursing intervention: ${ab.map(f => `${f.systemLabel} - ${f.label}`).join('; ')}.`;
    return 'Assessment findings are currently within expected limits based on documented systems. Continue routine monitoring and reassessment.';
  }
  function priorityStatement(a){
    const crit = abnormalFindings(a).filter(f => f.severity === 'Critical');
    if(crit.some(f => /stridor|airway|spo.?2|cyanosis/i.test(f.label))) return `Airway and oxygenation are the highest priorities due to ${crit.map(f => f.label).join(', ')}.`;
    if(crit.some(f => /gcs|seizure|obtunded|non-reactive/i.test(f.label))) return `Neurological status and airway protection are the highest priorities due to ${crit.map(f => f.label).join(', ')}.`;
    if(crit.length) return `Immediate reassessment is the highest priority due to ${crit.map(f => f.label).join(', ')}.`;
    const ab = abnormalFindings(a);
    return ab.length ? `Ongoing focused reassessment is indicated for ${ab.map(f => f.label).slice(0,3).join(', ')}.` : 'Continue routine focused assessment and reassessment.';
  }
  function clinicalReasoning(a){
    const labels = abnormalFindings(a).map(f => f.label).join('; ');
    if(!labels) return 'No abnormal or critical assessment cues are currently documented.';
    const lines = [];
    if(/stridor/i.test(labels)) lines.push('Inspiratory stridor may indicate upper airway obstruction and requires immediate airway-focused assessment.');
    if(/gcs\s*(<=|<|8)/i.test(labels)) lines.push('A GCS of 8 or less increases risk for airway compromise and aspiration.');
    if(/spo.?2|cyanosis|dyspn|retraction/i.test(labels)) lines.push('Low oxygenation or increased work of breathing may indicate impaired gas exchange.');
    if(/poor oral|weight loss|vomiting|diarr|dry mucous|oliguria/i.test(labels)) lines.push('Poor intake, fluid losses, or decreased output increase risk for fluid volume deficit and electrolyte imbalance.');
    if(!lines.length) lines.push('Abnormal cues require trend assessment, patient safety measures, and escalation when findings worsen or conflict with baseline.');
    return lines.join(' ');
  }
  function generateNarrative(a){
    ensureStructured(a);
    const stamp = new Date().toLocaleString();
    const parts = [`HCT Focused Assessment - ${stamp}`, ''];
    SYSTEM_KEYS.forEach(k => {
      const list = a.structuredFindings[k] || [];
      if(!list.length) return;
      parts.push(`${SYSTEM_LABELS[k] || k}:`);
      list.forEach(f => {
        const sev = f.severity || 'Normal';
        const rec = f.timestamp ? ` - recorded ${displayTime(f.timestamp)}` : '';
        parts.push(`${sev} finding noted: ${f.label}${rec}`);
      });
      const actions = [...new Set(list.filter(f => f.severity !== 'Normal').flatMap(f => f.suggestedActions || []))];
      if(actions.length) parts.push(`Suggested actions: ${actions.join(', ')}.`);
      parts.push('');
    });
    const ab = abnormalFindings(a);
    parts.push('Abnormal / Critical Findings Summary:');
    parts.push(ab.length ? ab.map(f => `- ${f.systemLabel}: ${f.label} (${f.severity}${f.timestamp ? ', ' + displayTime(f.timestamp) : ''})`).join('\n') : '- No abnormal or critical findings documented.');
    parts.push('');
    parts.push('Priority Concern:');
    parts.push(priorityStatement(a));
    parts.push('');
    parts.push('Suggested Interventions:');
    parts.push((allActions(a).length ? allActions(a) : ['Continue assessment and reassess per scenario priority.']).map(x => `- ${x}`).join('\n'));
    parts.push('');
    parts.push('Suggested Nursing Diagnoses:');
    parts.push((allDiagnoses(a).length ? allDiagnoses(a) : ['No diagnosis suggestion triggered by current findings.']).map(x => `- ${x}`).join('\n'));
    parts.push('');
    parts.push('Clinical Impression:');
    parts.push(impression(a));
    parts.push('');
    parts.push('Clinical Reasoning:');
    parts.push(clinicalReasoning(a));
    return parts.join('\n');
  }
  function addDxToCarePlan(dx){
    const p = patient();
    if(!p) return;
    if(!Array.isArray(p.carePlan)) p.carePlan = [];
    if(!p.carePlan.some(c => c.dx === dx)){
      p.carePlan.push({assessment:'Suggested from focused assessment', dx, goal:'', interventions:'', evaluation:''});
    }
  }
  function renderPanel(a){
    const ab = abnormalFindings(a);
    const rows = ab.map(f => `
      <div class="notice ${f.severity === 'Critical' ? 'danger' : ''}" style="margin-bottom:6px;">
        <span class="mark">${escHtml(f.systemLabel)}</span>
        <span>${escHtml(f.label)} - <strong>${escHtml(f.severity)}</strong>${f.timestamp ? ' - ' + escHtml(displayTime(f.timestamp)) : ''}</span>
      </div>`).join('');
    return `
      <div class="hct-assessment-panel">
        <div class="card">
          <div class="card-head"><h3>Critical / Abnormal Findings</h3></div>
          <div class="card-body">${rows || '<div class="hct-panel-empty">No abnormal or critical findings documented.</div>'}</div>
        </div>
      </div>`;
  }
  function renderFindingList(a, system){
    const list = a.structuredFindings?.[system] || [];
    const actions = [...new Set(list.filter(f => f.severity !== 'Normal').flatMap(f => f.suggestedActions || []))];
    const dxs = [...new Set(list.filter(f => f.severity !== 'Normal').flatMap(f => f.nursingDiagnoses || []))];
    return `
      <div class="hct-finding-list">
        ${list.map(f => `
          <div class="hct-finding-pill">
            <div class="hct-finding-main">
              <strong>${escHtml(f.label)}</strong>
              <div class="hct-finding-meta">${f.timestamp ? `recorded ${escHtml(displayTime(f.timestamp))}` : 'legacy finding - timestamp unavailable'}</div>
            </div>
            <div class="hct-finding-actions">
              <span class="hct-severity hct-severity-${String(f.severity || 'Normal').toLowerCase()}">${escHtml(f.severity || 'Normal')}</span>
              <button class="btn small danger" data-hct-remove-finding="${escHtml(system)}:${escHtml(f.id)}">Remove</button>
            </div>
          </div>`).join('')}
      </div>
      ${actions.length ? `<div class="hct-suggestions"><strong>Suggested nursing actions:</strong><br>${actions.map(x => `- ${escHtml(x)}`).join('<br>')}</div>` : ''}
      ${dxs.length ? `<div class="hct-suggestions"><strong>Suggested nursing diagnoses:</strong><div class="hct-dx-buttons">${dxs.map(dx => `<button class="btn small" data-hct-add-dx="${escHtml(dx)}">${escHtml(dx)}</button>`).join('')}</div></div>` : ''}`;
  }
  function enhanceAssessment(){
    const p = patient();
    if(!p || !p.assessment) return;
    const a = p.assessment;
    ensureStructured(a);

    const firstRow = document.querySelector('.assessment-row');
    if(firstRow && !document.querySelector('.hct-assessment-panel')){
      firstRow.insertAdjacentHTML('beforebegin', renderPanel(a));
    }

    SYSTEM_KEYS.forEach(k => {
      const ta = document.getElementById(`as-${k}`);
      const row = ta?.closest('.assessment-row');
      if(!ta || !row || row.dataset.hctEnhanced) return;
      row.dataset.hctEnhanced = 'true';
      const labelWrap = row.querySelector('.assessment-label');
      const inputGroup = row.querySelector('.assessment-input-group');
      const count = (a.structuredFindings[k] || []).length;
      const hasAlert = (a.structuredFindings[k] || []).some(f => f.severity !== 'Normal');
      const collapsed = !hasAlert && count === 0;
      if(collapsed) row.classList.add('hct-collapsed');
      labelWrap.innerHTML = `
        <button type="button" class="hct-system-toggle" aria-expanded="${!collapsed}" data-hct-toggle="${k}">
          <span class="hct-chevron">${collapsed ? '+' : '-'}</span>
          <span class="hct-system-title">${escHtml(SYSTEM_LABELS[k] || k)}</span>
          <span class="hct-count">(${count} finding${count === 1 ? '' : 's'})</span>
        </button>`;
      ta.style.display = 'none';
      inputGroup.insertAdjacentHTML('beforeend', `
        <div class="hct-assessment-actions">
          <button class="btn small" data-hct-normal="${k}">Add Normal Findings</button>
          <button class="btn small danger" data-hct-clear="${k}">Clear Findings</button>
        </div>
        <div data-hct-list="${k}">${renderFindingList(a, k)}</div>`);
      const dd = document.getElementById(`as-dd-${k}`);
      if(dd){
        dd.onchange = function(){
          if(!this.value) return;
          addFinding(a, k, this.value);
          this.value = '';
          saveAndRender(true);
        };
      }
    });
  }

  document.addEventListener('click', function(e){
    const p = patient();
    if(!p || !p.assessment) return;
    const a = p.assessment;
    const toggle = e.target.closest('[data-hct-toggle]');
    if(toggle){
      const row = toggle.closest('.assessment-row');
      const collapsed = row.classList.toggle('hct-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.querySelector('.hct-chevron').textContent = collapsed ? '+' : '-';
    }
    const normal = e.target.closest('[data-hct-normal]');
    if(normal){
      const k = normal.dataset.hctNormal;
      (NORMAL_FINDINGS[k] || []).forEach(label => addFinding(a, k, label, 'Normal'));
      saveAndRender(true);
    }
    const clear = e.target.closest('[data-hct-clear]');
    if(clear && confirm('Clear findings for this system?')){
      ensureStructured(a);
      a.structuredFindings[clear.dataset.hctClear] = [];
      syncPlainText(a);
      saveAndRender(true);
    }
    const rem = e.target.closest('[data-hct-remove-finding]');
    if(rem){
      const [system, id] = rem.dataset.hctRemoveFinding.split(':');
      removeFinding(a, system, id);
      saveAndRender(true);
    }
    const dx = e.target.closest('[data-hct-add-dx]');
    if(dx){
      const diagnosis = dx.dataset.hctAddDx;
      const ta = document.getElementById('as-narrative');
      if(ta && !ta.value.includes(diagnosis)) ta.value += `${ta.value ? '\n' : ''}Suggested nursing diagnosis: ${diagnosis}`;
      addDxToCarePlan(diagnosis);
      syncPlainText(a);
      if(typeof window.persist === 'function') window.persist();
      if(typeof window.toast === 'function') window.toast('Diagnosis added');
    }
  });

  const originalBind = window.bindTabEvents;
  if(typeof originalBind === 'function'){
    window.bindTabEvents = function(){
      originalBind.apply(this, arguments);
      enhanceAssessment();
      const p = patient();
      const btn = document.getElementById('insert-assessment-template');
      if(btn && p?.assessment){
        btn.onclick = function(){
          ensureStructured(p.assessment);
          const ta = document.getElementById('as-narrative');
          if(ta){
            ta.value = generateNarrative(p.assessment);
            p.assessment.narrative = ta.value;
            if(typeof window.persist === 'function') window.persist();
            ta.focus();
          }
        };
      }
      const save = document.getElementById('save-assessment');
      if(save && p?.assessment){
        save.addEventListener('click', function(){
          ensureStructured(p.assessment);
          const narrative = document.getElementById('as-narrative');
          if(narrative) p.assessment.narrative = narrative.value;
          syncPlainText(p.assessment);
        }, true);
      }
    };
  }
})();
