(function(){
  function patient(){
    return typeof currentPatient === 'function' ? currentPatient() : null;
  }

  function isReadyMadeScenario(p){
    return !!(p && p.scenarioId && p.scenarioId !== 'scratch');
  }

  function withoutOrderSync(fn){
    return function(){
      const p = patient();
      if(!isReadyMadeScenario(p)) return fn.apply(this, arguments);
      const originalOrders = p.orders;
      p.orders = [];
      try {
        return fn.apply(this, arguments);
      } finally {
        p.orders = originalOrders;
      }
    };
  }

  function removeTabChecks(){
    document.querySelectorAll('.ux-nav-state').forEach(el => el.remove());
    document.querySelectorAll('.nav-btn.ux-done').forEach(el => el.classList.remove('ux-done'));
  }

  function celsius(f){
    const n = parseFloat(f);
    if(isNaN(n)) return '--';
    return `${(Math.round((n - 32) * 5 / 9 * 10) / 10).toFixed(1)} C`;
  }

  function latestMarAction(){
    const p = patient();
    return (p?.meds || [])
      .filter(m => ['given','not_given','hold'].includes(m.status))
      .slice()
      .sort((a,b) => String(b.time || '').localeCompare(String(a.time || '')))[0] || {};
  }

  function statusLabel(status){
    if(status === 'given') return 'Given';
    if(status === 'not_given') return 'Not given';
    if(status === 'hold') return 'Held';
    return 'No MAR medication action documented';
  }

  function medicationNoteTemplate(){
    const p = patient() || {};
    const last = (p.vitals || [])[p.vitals?.length - 1] || {};
    const med = latestMarAction();
    const doseRouteFreq = [med.dose, med.route, med.freq].filter(Boolean).join(' / ') || '--';
    const displayTime = typeof nowDisplay === 'function' && med.time ? nowDisplay(med.time) : (med.time || '--');
    const noteTime = typeof nowDisplay === 'function' && typeof nowTime === 'function' ? nowDisplay(nowTime()) : new Date().toLocaleString();

    return `Medication Note
Patient: ${p.lastName || '--'}, ${p.firstName || '--'} | MRN: ${p.mrn || '--'}
Date/Time: ${noteTime} | Diagnosis: ${p.diagnosis || '--'}
Allergies: ${p.allergies || '--'}

MEDICATION / MAR ACTION:
- Drug: ${med.name || 'No MAR medication selected'}
- Dose / Route / Frequency: ${doseRouteFreq}
- MAR status: ${statusLabel(med.status)}
- Indication:
- Verified: Patient ID [ ]  Allergy [ ]  MAR [ ]  Labs [ ]  Right time [ ]
- MAR safety note: ${med.warn || 'No MAR safety note documented'}

PRE-ADMINISTRATION ASSESSMENT:
- HR: ${last.hr || '--'} | BP: ${last.bps || '--'}/${last.bpd || '--'} | RR: ${last.rr || '--'} | SpO2: ${last.spo2 || '--'}% | Pain: ${last.pain || '--'}/10
- Temp: ${celsius(last.temp)}
- Relevant labs:
- Hold parameters checked:  [ ]
- Patient education provided: [ ]

ADMINISTRATION / MAR NOTE:
- Site / Method:
- Time documented in MAR: ${displayTime}
- MAR note: ${med.note || 'No MAR note documented'}
- Administered by: Student Nurse

POST-ADMINISTRATION MONITORING:
- Expected effect:
- Adverse reactions to monitor:
- Reassessment time:
- Patient response:`;
  }

  function install(){
    if(typeof rMeds === 'function' && !rMeds.__readyMadeOrderPatch){
      const original = rMeds;
      rMeds = withoutOrderSync(original);
      rMeds.__readyMadeOrderPatch = true;
    }

    if(typeof rLabs === 'function' && !rLabs.__readyMadeOrderPatch){
      const original = rLabs;
      rLabs = withoutOrderSync(original);
      rLabs.__readyMadeOrderPatch = true;
    }

    if(typeof getNoteTemplate === 'function' && !getNoteTemplate.__marNotePatch){
      const original = getNoteTemplate;
      getNoteTemplate = function(type){
        if(type === 'Medication note') return medicationNoteTemplate();
        return original.apply(this, arguments);
      };
      getNoteTemplate.__marNotePatch = true;
    }

    if(typeof render === 'function' && !render.__removeTabChecksPatch){
      const original = render;
      render = function(){
        const result = original.apply(this, arguments);
        removeTabChecks();
        return result;
      };
      render.__removeTabChecksPatch = true;
    }

    document.addEventListener('click', event => {
      const button = event.target?.closest?.('[data-med-act]');
      if(!button) return;
      const p = patient();
      const med = p?.meds?.[Number(button.dataset.medIndex)];
      if(med && !med.time && typeof nowTime === 'function') med.time = nowTime();
    }, true);

    removeTabChecks();
    if(typeof render === 'function') render();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
