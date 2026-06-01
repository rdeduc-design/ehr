(function(){
  'use strict';

  const ASSESS_KEYS = ['neuro','resp','cardiac','gi','gu','skin','safety','pain','specialty','psychosocial','narrative'];
  const ASSESS_LABELS = {neuro:'Neurological',resp:'Respiratory',cardiac:'Cardiac / Perfusion',gi:'GI',gu:'GU / Output',skin:'Skin / Wound',safety:'Safety',pain:'Pain',specialty:'Specialty',psychosocial:'Psychosocial',narrative:'Narrative'};
  const NORMAL_FINDING = /\b(alert and oriented x?4|alert and oriented x?3|perrl|clear breath sounds|regular rhythm|capillary refill\s*(<|less than)\s*3|skin warm dry|intact skin|soft non[- ]tender|bowel sounds present|voiding without difficulty|denies pain|pain\s*0\/?10|no acute distress|within normal limits|wnl|normal|negative|wound clean dry intact)\b/i;
  const ABNORMAL_WORDS = /\b(abnormal|low|high|decreased|increased|weak|absent|irregular|pain|distress|confused|dizzy|cyan|edema|bleeding|fever|hypotens|hypertens|tachy|brady|hypoxia|wheeze|crackles|risk|positive|impaired|severe|worsen|agitated|hallucination|shortness|dyspnea|kussmaul|pale|cool|fall|infection|drainage|oliguria|anuria|vomit|diarrhea|sluggish|non-reactive|unequal|disoriented|lethargic|needs monitoring|critical)\b/i;

  const LAB_TESTS = [
    {name:'CBC - WBC', range:'4.5-11.0 x10^9/L', lo:4.5, hi:11, critLo:1, critHi:30},
    {name:'CBC - RBC', range:'4.2-5.9 x10^12/L', lo:4.2, hi:5.9, critLo:2.5, critHi:7},
    {name:'CBC - Hemoglobin', range:'12.0-16.0 g/dL (F), 13.5-17.5 g/dL (M)', lo:12, hi:17.5, critLo:7, critHi:20},
    {name:'CBC - Hematocrit', range:'36-46% (F), 41-53% (M)', lo:36, hi:53, critLo:20, critHi:60},
    {name:'CBC - Platelets', range:'150-400 x10^9/L', lo:150, hi:400, critLo:50, critHi:1000},
    {name:'Neutrophils', range:'40-70%', lo:40, hi:70},
    {name:'Lymphocytes', range:'20-40%', lo:20, hi:40},
    {name:'Sodium', range:'135-145 mmol/L', lo:135, hi:145, critLo:120, critHi:160},
    {name:'Potassium', range:'3.5-5.0 mmol/L', lo:3.5, hi:5, critLo:2.5, critHi:6.5},
    {name:'Chloride', range:'98-107 mmol/L', lo:98, hi:107, critLo:80, critHi:115},
    {name:'Bicarbonate / CO2', range:'22-29 mmol/L', lo:22, hi:29, critLo:10, critHi:40},
    {name:'BUN', range:'7-20 mg/dL', lo:7, hi:20, critLo:0, critHi:100},
    {name:'Creatinine', range:'0.6-1.3 mg/dL', lo:0.6, hi:1.3, critLo:0, critHi:5},
    {name:'eGFR', range:'>=60 mL/min/1.73m2', lo:60, hi:200, critLo:15},
    {name:'Glucose - Random', range:'70-140 mg/dL', lo:70, hi:140, critLo:40, critHi:400},
    {name:'Glucose - Fasting', range:'70-99 mg/dL', lo:70, hi:99, critLo:40, critHi:400},
    {name:'HbA1c', range:'<5.7%', lo:0, hi:5.7, critHi:10},
    {name:'Calcium', range:'8.5-10.5 mg/dL', lo:8.5, hi:10.5, critLo:6, critHi:13},
    {name:'Ionized Calcium', range:'1.12-1.32 mmol/L', lo:1.12, hi:1.32, critLo:0.9, critHi:1.6},
    {name:'Magnesium', range:'1.7-2.2 mg/dL', lo:1.7, hi:2.2, critLo:1, critHi:5},
    {name:'Phosphorus', range:'2.5-4.5 mg/dL', lo:2.5, hi:4.5, critLo:1, critHi:8},
    {name:'Albumin', range:'3.5-5.0 g/dL', lo:3.5, hi:5},
    {name:'Total Bilirubin', range:'0.1-1.2 mg/dL', lo:0.1, hi:1.2, critHi:15},
    {name:'AST', range:'10-40 U/L', lo:10, hi:40, critHi:1000},
    {name:'ALT', range:'7-56 U/L', lo:7, hi:56, critHi:1000},
    {name:'Alkaline Phosphatase', range:'44-147 U/L', lo:44, hi:147},
    {name:'Amylase', range:'30-110 U/L', lo:30, hi:110},
    {name:'Lipase', range:'0-160 U/L', lo:0, hi:160},
    {name:'Lactate', range:'0.5-2.0 mmol/L', lo:0.5, hi:2, critLo:0, critHi:4},
    {name:'Procalcitonin', range:'<0.1 ng/mL', lo:0, hi:0.1, critHi:2},
    {name:'CRP', range:'<10 mg/L', lo:0, hi:10, critHi:100},
    {name:'ESR', range:'0-20 mm/hr', lo:0, hi:20},
    {name:'Troponin I', range:'<0.04 ng/mL', lo:0, hi:0.04, critLo:0, critHi:0.4},
    {name:'Troponin T', range:'<0.01 ng/mL', lo:0, hi:0.01, critHi:0.1},
    {name:'BNP', range:'<100 pg/mL', lo:0, hi:100, critHi:1000},
    {name:'CK-MB', range:'0-5 ng/mL', lo:0, hi:5, critHi:25},
    {name:'PT', range:'11-13.5 seconds', lo:11, hi:13.5, critHi:30},
    {name:'INR', range:'0.8-1.1 (not anticoagulated)', lo:0.8, hi:1.1, critHi:5},
    {name:'aPTT', range:'25-35 seconds', lo:25, hi:35, critHi:80},
    {name:'D-dimer', range:'<0.5 mcg/mL FEU', lo:0, hi:0.5, critHi:5},
    {name:'Fibrinogen', range:'200-400 mg/dL', lo:200, hi:400, critLo:100, critHi:700},
    {name:'ABG - pH', range:'7.35-7.45', lo:7.35, hi:7.45, critLo:7.2, critHi:7.6},
    {name:'ABG - PaCO2', range:'35-45 mmHg', lo:35, hi:45, critLo:20, critHi:70},
    {name:'ABG - PaO2', range:'80-100 mmHg', lo:80, hi:100, critLo:50, critHi:200},
    {name:'ABG - HCO3', range:'22-26 mmol/L', lo:22, hi:26, critLo:10, critHi:40},
    {name:'ABG - SaO2', range:'95-100%', lo:95, hi:100, critLo:85},
    {name:'Urinalysis', range:'Negative glucose/ketones/nitrites/leukocytes', text:true},
    {name:'Urine Specific Gravity', range:'1.005-1.030', lo:1.005, hi:1.03},
    {name:'Urine Protein', range:'Negative/trace', text:true},
    {name:'Urine Ketones', range:'Negative', text:true},
    {name:'Pregnancy Test - hCG', range:'Negative unless pregnant', text:true},
    {name:'Blood Culture', range:'No growth', text:true},
    {name:'Urine Culture', range:'No growth', text:true},
    {name:'Sputum Culture', range:'Normal respiratory flora / no pathogen', text:true},
    {name:'Wound Culture', range:'No pathogenic growth', text:true},
    {name:'COVID-19 Antigen/PCR', range:'Negative', text:true},
    {name:'Influenza A/B', range:'Negative', text:true},
    {name:'RSV', range:'Negative', text:true},
    {name:'Chest X-ray', range:'No acute cardiopulmonary abnormality', imaging:true, text:true},
    {name:'Abdominal X-ray', range:'Non-obstructive bowel gas pattern', imaging:true, text:true},
    {name:'CT Head', range:'No acute intracranial abnormality', imaging:true, text:true},
    {name:'CT Chest', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'CT Abdomen/Pelvis', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'MRI Brain', range:'No acute infarct, hemorrhage, or mass', imaging:true, text:true},
    {name:'MRI Spine', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'Ultrasound - Abdomen', range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {name:'Ultrasound - OB', range:'Viable intrauterine pregnancy / per OB report', imaging:true, text:true},
    {name:'Doppler Ultrasound - Venous', range:'No DVT', imaging:true, text:true},
    {name:'Echocardiogram', range:'Normal LV function unless otherwise specified', imaging:true, text:true},
    {name:'ECG / EKG', range:'Normal sinus rhythm, no acute ST-T changes', imaging:true, text:true}
  ];

  function g(name){ try { return window[name] || eval(name); } catch(_) { return window[name]; } }
  function expose(name, value){ window[name] = value; try { eval(name + ' = value'); } catch(_) {} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function lines(v){ return esc(v).replace(/\n/g,'<br>'); }
  function cleanText(v){ return String(v == null ? '' : v).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
  function current(){ const fn = g('currentPatient'); return typeof fn === 'function' ? fn() : null; }
  function stateObj(){ return g('state') || window.state || {}; }
  function persist(){ const fn = g('persist'); if (typeof fn === 'function') fn(); }
  function render(){ const fn = g('render'); if (typeof fn === 'function') fn(); }
  function section(title, body){ const fn = g('section'); return typeof fn === 'function' ? fn(title, body) : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3></div><div class="card-body">${body}</div></div>`; }
  function field(label, value){ const fn = g('field'); return typeof fn === 'function' ? fn(label, value || '--') : `<div class="field"><span class="k">${esc(label)}</span><span class="v">${lines(value || '--')}</span></div>`; }
  function table(heads, rows){ const fn = g('table'); return typeof fn === 'function' ? fn(heads, rows) : `<table><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`; }
  function statusClass(v){ const fn = g('statusClass'); return typeof fn === 'function' ? fn(v) : String(v||'').toLowerCase(); }
  function nowTime(){ const fn = g('nowTime'); return typeof fn === 'function' ? fn() : new Date().toISOString().slice(0,16); }
  function nowDisplay(v){ const fn = g('nowDisplay'); return typeof fn === 'function' ? fn(v) : (v || '--'); }
  function val(id){ const el = document.getElementById(id); return el ? el.value : ''; }
  function numericValue(v){ const match = String(v == null ? '' : v).match(/-?\d+(?:\.\d+)?/); return match ? Number(match[0]) : NaN; }
  function labMeta(name){ return LAB_TESTS.find(t => t.name === name) || LAB_TESTS.find(t => String(name||'').toLowerCase().includes(t.name.toLowerCase())); }
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
  function isAbnormalAssessmentValue(value){ const text = cleanText(value); return !!text && !(NORMAL_FINDING.test(text) && !ABNORMAL_WORDS.test(text)) && ABNORMAL_WORDS.test(text); }
  function assessmentEntries(p){ const a = p?.assessment || {}; return ASSESS_KEYS.map(k => ({key:k,label:ASSESS_LABELS[k] || k,value:String(a[k] || '').trim()})).filter(x => x.value); }
  function abnormalAssessmentEntries(p){ return assessmentEntries(p).filter(x => isAbnormalAssessmentValue(x.value)); }

  function normalizeDx(d){
    return {
      dx: d.dx || d.name || '',
      name: d.name || d.dx || '',
      subjective: d.subjective || d.assessment?.subjective || [],
      objective: d.objective || d.assessment?.objective || [],
      goals: d.goals || (d.goal ? [d.goal] : []),
      interventions: Array.isArray(d.interventions) ? d.interventions : (d.interventions ? String(d.interventions).split(/\n|;\s*/).map(x=>x.trim()).filter(Boolean) : []),
      evaluation: d.evaluation || ''
    };
  }
  function careLibrary(){
    const primary = g('NURSING_DIAGNOSIS_LIBRARY');
    const secondary = window.HctNursingDiagnosisLibrary;
    const tertiary = window.NURSING_CARE_PLAN_DATA;
    return (Array.isArray(primary) ? primary : Array.isArray(secondary) ? secondary : Array.isArray(tertiary) ? tertiary : []).map(normalizeDx).filter(d => d.dx);
  }
  function findDx(name){ const n = String(name || '').toLowerCase(); return careLibrary().find(d => d.dx === name || d.name === name) || careLibrary().find(d => n && d.dx.toLowerCase().includes(n)); }
  function careDxOptions(cur){ return '<option value="">Choose nursing diagnosis</option>' + careLibrary().map(d => `<option value="${esc(d.dx)}" ${d.dx===cur?'selected':''}>${esc(d.dx)}</option>`).join(''); }
  function careSelect(id, items, cur, label){ return `<select id="${id}"><option value="">${esc(label)}</option>${(items||[]).map(x=>`<option value="${esc(x)}" ${x===cur?'selected':''}>${esc(x)}</option>`).join('')}</select>`; }
  function careAssessmentSelect(i, tpl, cur){
    const subj = tpl?.subjective || [];
    const obj = tpl?.objective || [];
    const cueHtml = '<option value="">Add subjective/objective cue</option>' + (subj.length ? '<optgroup label="Subjective cues">' + subj.map(x=>`<option value="Subjective: ${esc(x)}">Subjective: ${esc(x)}</option>`).join('') + '</optgroup>' : '') + (obj.length ? '<optgroup label="Objective cues">' + obj.map(x=>`<option value="Objective: ${esc(x)}">Objective: ${esc(x)}</option>`).join('') + '</optgroup>' : '');
    return `<select data-cp-cue="${i}">${cueHtml}</select><textarea data-cp="assessment" data-cp-index="${i}" placeholder="Subjective and objective cues">${esc(cur || '')}</textarea>`;
  }
  function assessmentFromDx(tpl){ return ['Subjective cues:', ...(tpl.subjective||[]).map(x=>' - '+x), '', 'Objective cues:', ...(tpl.objective||[]).map(x=>' - '+x)].join('\n').trim(); }

  function patchNav(){
    const canUseFacultyTools = g('canUseFacultyTools');
    expose('renderNav', function(){
      const st = stateObj();
      const t = st.tab;
      const hasAnalytics = typeof canUseFacultyTools === 'function' ? canUseFacultyTools() : false;
      const nb = (tab, label, child=false) =>
        `<button class="nav-btn${child?' nav-child':''} ${t===tab?'active':''}" data-tab="${tab}">${label}</button>`;
      const ns = (id, label, inner, childTabs=[]) => {
        const open = !!(window.navOpen||{})[id] || childTabs.includes(t);
        return `<div class="nav-group${open?' open':''}" data-nav-section="${id}"><button class="nav-group-toggle" data-nav-toggle="${id}">${label}<span class="nav-chev">&#8250;</span></button><div class="nav-group-body">${inner}</div></div>`;
      };
      const icBtn = (tab, ic, label) =>
        `<button class="nav-btn ${t===tab?'active':''}" data-tab="${tab}"><span class="nav-ic">${ic}</span>${label}</button>`;
      return `<nav class="nav">
        <div class="group">Patient Details</div>
        ${nb('visit-history','Visit History')}
        ${nb('summary','Visit Summary')}
        ${ns('sec-allergy','Allergies &amp; Immunizations',nb('allergy-list','Allergies',true)+nb('immunization-list','Immunizations',true),['allergy-list','immunization-list'])}
        ${ns('sec-results','Results',nb('labs','Labs',true)+nb('lab-panels','Lab Panels',true)+nb('blood-bank','Blood Bank Panels',true)+nb('microbiology','Microbiology Cultures',true)+nb('imaging','Imaging &amp; Diagnostics',true),['labs','lab-panels','blood-bank','microbiology','imaging'])}
        ${ns('sec-provider','Provider',nb('admission-info','Admission Information',true)+nb('hpi','History of Present Illness (HPI)',true)+nb('past-history','Past Medical &amp; Surgical History',true)+nb('family-history','Family &amp; Social History',true)+nb('home-meds','Home Medications',true)+nb('ros','Review of Systems',true)+nb('physical-exam','Physical Exam',true),['admission-info','hpi','past-history','family-history','home-meds','ros','physical-exam'])}
        ${nb('notes','Notes')}
        ${nb('orders','Orders')}
        ${nb('meds','MAR')}
        ${nb('vitals','Vital Signs')}
        ${ns('sec-flowsheets','Flowsheets',nb('patient-registration','Patient Registration',true)+nb('assessment','Assessment',true)+nb('clinicaldocs','Clinical Docs',true)+nb('io','Intake &amp; Output',true)+nb('pain-mgmt','Pain Management',true)+nb('daily-care','Daily Care-Safety',true)+nb('iv-site','IV Site',true)+nb('behavioral','Behavioral Assessment',true)+nb('interventions','Interventions',true)+nb('pre-post-op','Pre &amp; Post-Op Checklists',true)+nb('intraoperative','Intraoperative',true)+nb('critical-care','Critical Care',true)+nb('diabetic-monitoring','Diabetic Monitoring',true)+nb('wound-care','Wound Care',true)+nb('physical-therapy','Physical Therapy',true)+nb('occupational-therapy','Occupational Therapy',true)+nb('code-blue','Code Blue Form',true)+nb('nutrition','Nutrition Assessment',true)+nb('pediatric-assessment','Pediatric Assessment',true)+nb('education','Patient Education',true)+nb('discharge','Discharge',true),['patient-registration','assessment','clinicaldocs','io','pain-mgmt','daily-care','iv-site','behavioral','interventions','pre-post-op','intraoperative','critical-care','diabetic-monitoring','wound-care','physical-therapy','occupational-therapy','code-blue','nutrition','pediatric-assessment','education','discharge'])}
        ${ns('sec-screenings','Screenings &amp; Scales',nb('glasgow','Glasgow Coma Scale',true)+nb('morse-fall','Morse Fall Scale',true)+nb('braden','Braden Scale',true)+nb('be-fast','BE-FAST Stroke Screening',true)+nb('nihss','NIH Stroke Scale (NIHSS)',true)+nb('ciwa','CIWA Protocol',true)+nb('cage-aid','CAGE-AID Questionnaire',true)+nb('cows','Clinical Opiate Withdrawal Scale (COWS)',true)+nb('katz','Katz Index of Independence in Activities of Daily Living',true)+nb('aota','AOTA Occupational Profile',true)+nb('bmat','Bedside Mobility Assessment Tool (BMAT)',true)+nb('mews','Modified Early Warning Score (MEWS)',true)+nb('news2','National Early Warning Score (NEWS) 2',true)+nb('pews','Pediatric Early Warning Score (PEWS)',true)+nb('mmse','Mini-Mental Status Examination (MMSE)',true)+nb('mental-status','Mental Status Exam',true)+nb('gad7','Generalized Anxiety Disorder (GAD-7)',true)+nb('ham-a','Hamilton Anxiety Rating Scale (HAM-A)',true)+nb('hdrs','Hamilton Depression Rating Scale (HDRS)',true)+nb('geriatric-depression','Geriatric Depression Scale',true)+nb('rass','Richmond Agitation-Sedation Scale (RASS)',true)+nb('c-ssrs','Columbia-Suicide Severity Rating Scale (C-SSRS)',true)+nb('flacc','FLACC Scale',true)+nb('sbirt','SBIRT',true)+nb('sbirt-eating','SBIRT for Eating Disorders',true)+nb('vision-screening','Vision Screenings',true)+nb('covid-screening','COVID-19 Screening',true)+nb('sirs-sepsis','SIRS Sepsis Screening Tool',true)+nb('audit','Alcohol Screening Questionnaire (AUDIT)',true)+nb('dast','Drug Screening Questionnaire (DAST)',true)+nb('phq9','Patient Health Questionnaire-9 (PHQ-9)',true)+nb('painad','Pain Assessment in Advanced Dementia (PAINAD) Scale',true)+nb('bvc','Br\xf8set Violence Checklist (BVC)',true)+nb('fica','FICA Spiritual Assessment',true)+nb('wong-baker','Wong-Baker FACES\xae Pain Rating Scale',true),['glasgow','morse-fall','braden','be-fast','nihss','ciwa','cage-aid','cows','katz','aota','bmat','mews','news2','pews','mmse','mental-status','gad7','ham-a','hdrs','geriatric-depression','rass','c-ssrs','flacc','sbirt','sbirt-eating','vision-screening','covid-screening','sirs-sepsis','audit','dast','phq9','painad','bvc','fica','wong-baker'])}
        ${ns('sec-respiratory','Respiratory',nb('resp-assessment','Respiratory Assessment',true)+nb('resp-medications','Respiratory Medications',true)+nb('resp-interventions','Respiratory Interventions',true)+nb('o2-therapy','O2 Therapy',true)+nb('airway-management','Airway Management',true)+nb('ventilator','Ventilator',true),['resp-assessment','resp-medications','resp-interventions','o2-therapy','airway-management','ventilator'])}
        ${ns('sec-obstetrics','Obstetrics',nb('prenatal-visit','Prenatal Visit',true)+nb('ob-admission','OB Admission',true)+nb('labor-assessment','Labor Assessment',true)+nb('birth-summary','Birth Summary',true)+nb('postpartum','Postpartum',true),['prenatal-visit','ob-admission','labor-assessment','birth-summary','postpartum'])}
        ${nb('problem-list','Problem List')}
        ${ns('sec-patient-history','Patient History',nb('past-history','Past Medical &amp; Surgical History',true)+nb('family-history','Family &amp; Social History',true)+nb('notes-history','Notes History',true)+nb('orders-history','Orders History',true)+nb('vitals-history','Vital Signs History',true)+nb('hpi-history','HPI History',true)+nb('demographics','Demographics',true),['past-history','family-history','notes-history','orders-history','vitals-history','hpi-history','demographics'])}
        ${nb('sbar','SBAR')}
        ${nb('careplan','Care Plan')}
        ${nb('roys-model',"Roy's Adaptation Model")}
        ${ns('sec-patient-forms','Patient Forms',nb('prior-auth-form','Prior Authorization Form',true)+nb('referral-form','Referral Request Form',true)+nb('release-of-info','Release of Information',true)+nb('blood-consent-form','Blood / Blood Products Consent Form',true)+nb('new-patient-intake','New Patient Medical Intake Form',true),['prior-auth-form','referral-form','release-of-info','blood-consent-form','new-patient-intake'])}
        <div class="group">Learning tools</div>
        ${[['reasoning','CR','Clinical reasoning'],['peerreview','PR','Peer review mode'],['medcalc','MC','Medication calculator'],['debriefing','DB','Debriefing'],['progress','PT','My progress'],['report','RP','Print report'],['scenarios','SC','Sample scenarios'],['newpatient','NP','Add patient']].map(([tab,ic,label])=>icBtn(tab,ic,label)).join('')}
        ${hasAnalytics?`<div class="group">Faculty tools</div>${[['modulebuilder','MB','Faculty module builder'],['dashboard','AD','Analytics dashboard'],['statusboard','SB','Status board']].map(([tab,ic,label])=>icBtn(tab,ic,label)).join('')}`:''}
      </nav>`;
    });
  }

  function patchLabs(){
    expose('rLabs', function(){
      const p = current();
      const rows = (p?.labs || []).map((raw,i) => {
        const l = normalizeLab(raw), meta = labMeta(l.test);
        const image = l.imageData ? `<div class="hct-lab-image"><img src="${esc(l.imageData)}" alt="${esc(l.test || 'Imaging result')}"></div>` : '';
        return `<tr><td>${esc(nowDisplay(l.time))}</td><td>${esc(l.test)}${meta?.imaging ? '<span class="badge blue" style="margin-left:4px;">Imaging</span>' : ''}</td><td><strong>${esc(l.result)}</strong>${image}</td><td style="color:var(--muted);font-size:11px;">${esc(l.range)}</td><td><span class="status ${statusClass(l.flag)} ${isAlertFlag(l.flag) ? 'hct-lab-alert-flag' : ''}">${esc(l.flag)}</span></td><td style="font-size:11px;color:var(--muted);">${esc(l.note)}</td><td><button class="btn small danger" data-del-lab="${i}">Delete</button></td></tr>`;
      }).join('');
      const groups = {Hematology:LAB_TESTS.slice(0,7), Chemistry:LAB_TESTS.slice(7,32), Coagulation:LAB_TESTS.slice(32,37), ABG:LAB_TESTS.slice(37,42), Urine:LAB_TESTS.slice(42,47), Microbiology:LAB_TESTS.slice(47,54), Imaging:LAB_TESTS.slice(54)};
      const options = Object.entries(groups).map(([label, tests]) => `<optgroup label="${esc(label)}">${tests.map(t => `<option value="${esc(t.name)}" data-range="${esc(t.range)}" data-imaging="${t.imaging ? '1' : '0'}">${esc(t.name)}</option>`).join('')}</optgroup>`).join('');
      return section('Labs and diagnostics', table(['Time','Test','Result','Range','Flag','Note',''], rows)) + section('Add lab result', `<div class="form-grid"><input id="lab-time" type="datetime-local" value="${nowTime()}"><select id="lab-test">${options}</select><input id="lab-result" placeholder="Result"><select id="lab-flag"><option>Normal</option><option>High</option><option>Low</option><option>Critical</option><option>Pending</option></select></div><div class="form-row"><label>Range / note</label><div class="grid-2"><input id="lab-range" placeholder="Reference range" readonly><input id="lab-note" placeholder="Clinical note"></div></div><div class="form-row hct-lab-image-row" style="display:none;"><label>Imaging attachment</label><input id="lab-image" type="file" accept="image/*"></div><div class="actions"><button class="btn primary" id="add-lab">Add result</button></div>`);
    });
  }

  function patchCarePlan(){
    expose('carePlanEmpty', function(){ return {assessment:'', dx:'', goal:'', interventions:'', evaluation:''}; });
    expose('rCarePlan', function(){
      const p = current();
      p.carePlan = Array.isArray(p.carePlan) ? p.carePlan : [g('carePlanEmpty')()];
      const rows = p.carePlan.map((c,i) => {
        const tpl = findDx(c.dx);
        return `<tr><td>${careAssessmentSelect(i,tpl,c.assessment || c.cues || '')}</td><td><select data-cp-template="${i}">${careDxOptions(c.dx)}</select></td><td>${careSelect(`cp-goal-${i}`,tpl?.goals,c.goal,'Choose goal')}<textarea data-cp="goal" data-cp-index="${i}" placeholder="Goal / priority">${esc(c.goal || '')}</textarea></td><td>${careSelect(`cp-int-${i}`,tpl?.interventions,c.interventions,'Choose intervention')}<textarea data-cp="interventions" data-cp-index="${i}" placeholder="Interventions">${esc(c.interventions || '')}</textarea></td><td><textarea data-cp="evaluation" data-cp-index="${i}" placeholder="Student evaluation">${esc(c.evaluation || tpl?.evaluation || '')}</textarea></td><td><button class="btn small danger" data-del-cp="${i}">Delete</button></td></tr>`;
      }).join('');
      return section('Nursing care plan', `<div class="notice info"><span class="mark">GUIDE</span><span>Select a nursing diagnosis to populate subjective/objective cues, goals, and interventions. Individualize the text before saving.</span></div>` + table(['Assessment cues','Diagnosis','Goal','Interventions','Evaluation',''], rows) + '<div class="actions"><button class="btn primary" id="add-careplan">Add row</button><button class="btn navy" id="save-careplan">Save care plan</button></div>');
    });
  }

  function vitalNarrative(p){ const v = (p?.vitals || []).slice(-1)[0] || {}; return `Current vital signs: HR ${v.hr || '--'} bpm, BP ${v.bps || '--'}/${v.bpd || '--'} mmHg, RR ${v.rr || '--'} breaths/min, SpO2 ${v.spo2 || '--'}%, Temp ${v.temp || '--'} C, Pain ${v.pain || '--'}/10.`; }
  function focusedNarrative(p){ const abn = abnormalAssessmentEntries(p); if (!abn.length) return 'No abnormal focused assessment findings are currently flagged.'; return 'Focused assessment abnormalities: ' + abn.map(x => `${x.label.toLowerCase()} shows ${cleanText(x.value)}`).join('; ') + '.'; }
  function recommendationForSpecificFindings(p){
    const recs = [];
    const last = (p?.vitals || []).slice(-1)[0] || {};
    const spo2 = Number(last.spo2), rr = Number(last.rr), hr = Number(last.hr), sbp = Number(last.bps), temp = Number(last.temp);
    const findings = abnormalAssessmentEntries(p).map(x => `${x.label} ${x.value}`).join(' ');
    if (!isNaN(spo2) && spo2 < 95 || !isNaN(rr) && (rr < 12 || rr > 20) || /respiratory|dyspnea|wheeze|crackles|shortness|hypoxia/i.test(findings)) recs.push('Assess airway and work of breathing, position for ventilation, apply ordered oxygen, and notify provider if saturation or distress does not improve.');
    if (!isNaN(sbp) && (sbp < 90 || sbp > 140) || !isNaN(hr) && (hr < 60 || hr > 100) || /cardiac|perfusion|edema|pale|cool|dizzy/i.test(findings)) recs.push('Recheck blood pressure and pulse manually, assess perfusion and symptoms, maintain safety, and request provider guidance for hemodynamic changes.');
    if (!isNaN(temp) && (temp < 36.1 || temp > 37.9) || /fever|infection|drainage|wound/i.test(findings)) recs.push('Trend temperature and infection cues, review ordered cultures/labs, use aseptic care, and notify provider for suspected infection or worsening fever.');
    if (/pain|severe|guarding/i.test(findings)) recs.push('Reassess pain characteristics, implement ordered comfort or analgesic measures, and evaluate response within the expected timeframe.');
    if (/confused|disoriented|lethargic|sluggish|non-reactive|unequal|fall|safety/i.test(findings)) recs.push('Institute safety precautions, reassess neurologic status, and escalate acute neurologic or fall-risk changes.');
    (p?.labs || []).map(normalizeLab).filter(l => isAlertFlag(l.flag)).forEach(l => recs.push(`Follow up ${l.test} result (${l.flag}); verify provider notification and repeat testing or treatment orders as indicated.`));
    return recs.length ? recs.join('\n') : 'Continue current monitoring and reassess per orders.';
  }
  function sbarAssessmentText(p){ return vitalNarrative(p) + '\n' + focusedNarrative(p); }

  function timelineHtml(p){
    const log = (p?.interactionLog || []).slice().map((e,i) => ({time:e.iso || e.stamp || e.time || '', action:e.action || e.text || '', idx:i})).filter(e => e.action);
    if (!log.length) return '<p style="color:var(--subtle);font-size:12px;">No actions documented yet.</p>';
    log.sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime() || a.idx - b.idx);
    return `<ol class="hct-timeline">${log.map(e => `<li><time>${esc(e.time)}</time><span>${esc(e.action)}</span></li>`).join('')}</ol>`;
  }
  function patchSummary(){
    const original = g('rSummary');
    if (typeof original !== 'function' || original.__direct2Timeline) return;
    const wrapped = function(){ const p = current(); const html = original.apply(this, arguments); return html + section('Patient activity timeline', timelineHtml(p)); };
    wrapped.__direct2Timeline = true;
    expose('rSummary', wrapped);
  }

  function recordAction(action){
    const p = current(); if (!p || !action) return;
    p.interactionLog = Array.isArray(p.interactionLog) ? p.interactionLog : [];
    p.interactionLog.unshift({time:new Date().toLocaleString(), iso:new Date().toISOString(), action});
    p.interactionLog = p.interactionLog.slice(0,80);
    persist();
  }
  function actionFromClick(target){
    const el = target.closest && target.closest('button,input[type="checkbox"]'); if (!el) return '';
    if (el.id === 'add-vital') return 'Added vital signs';
    if (el.id === 'add-lab') return 'Added lab or diagnostic result';
    if (el.id === 'save-assessment') return 'Saved focused assessment';
    if (el.id === 'add-careplan') return 'Added care plan row';
    if (el.id === 'save-careplan') return 'Saved nursing care plan';
    if (el.id === 'save-sbar') return 'Saved SBAR handoff';
    if (el.id === 'add-note') return 'Added nursing note';
    if (el.id === 'add-med') return 'Added medication order';
    if (el.dataset?.medAct) return `Updated MAR status to ${el.dataset.medAct}`;
    if (el.dataset?.orderComplete) return 'Updated provider order completion status';
    if (el.dataset?.loadScenario) return 'Opened sample scenario';
    if (el.dataset?.delLab) return 'Deleted lab or diagnostic result';
    if (el.dataset?.delVital) return 'Deleted vital signs entry';
    if (el.dataset?.delCp) return 'Deleted care plan row';
    return '';
  }

  function bindDirectEvents(){
    bindLabEvents();
    bindCareEvents();
    bindSbarEvents();
  }
  function bindLabEvents(){
    const test = document.getElementById('lab-test');
    if (test && !test.dataset.direct2LabBound) {
      test.dataset.direct2LabBound = '1';
      const sync = () => { const meta = labMeta(test.value); const range = document.getElementById('lab-range'); const imgRow = document.querySelector('.hct-lab-image-row'); const result = document.getElementById('lab-result'); const flag = document.getElementById('lab-flag'); if (range) range.value = meta?.range || ''; if (imgRow) imgRow.style.display = meta?.imaging ? '' : 'none'; if (result && flag) flag.value = classifyLab(meta, result.value); };
      test.addEventListener('change', sync); document.getElementById('lab-result')?.addEventListener('input', sync); sync();
    }
    const add = document.getElementById('add-lab');
    if (add && !add.dataset.direct2LabCapture) {
      add.dataset.direct2LabCapture = '1';
      add.addEventListener('click', ev => {
        ev.preventDefault(); ev.stopImmediatePropagation();
        const p = current(); if (!p) return;
        const meta = labMeta(val('lab-test')); const file = document.getElementById('lab-image')?.files?.[0];
        const lab = {time:val('lab-time'), test:val('lab-test'), result:val('lab-result'), range:val('lab-range') || meta?.range || '', flag:classifyLab(meta, val('lab-result')), note:val('lab-note')};
        const done = () => { p.labs = p.labs || []; p.labs.push(lab); recordAction('Added lab or diagnostic result: ' + lab.test); render(); };
        if (file && meta?.imaging) { const reader = new FileReader(); reader.onload = () => { lab.imageData = reader.result; done(); }; reader.readAsDataURL(file); } else done();
      }, true);
    }
  }
  function bindCareEvents(){
    document.querySelectorAll('[data-cp-template]').forEach(sel => {
      if (sel.dataset.direct2CareBound) return;
      sel.dataset.direct2CareBound = '1';
      sel.addEventListener('change', ev => {
        ev.preventDefault(); ev.stopImmediatePropagation();
        const p = current(); const i = Number(sel.dataset.cpTemplate); const tpl = findDx(sel.value);
        if (!p?.carePlan?.[i] || !tpl) return;
        p.carePlan[i] = {...p.carePlan[i], dx:tpl.dx, assessment:assessmentFromDx(tpl), goal:(tpl.goals||[])[0] || '', interventions:(tpl.interventions||[]).join('\n'), evaluation:tpl.evaluation || p.carePlan[i].evaluation || ''};
        recordAction('Selected care plan diagnosis: ' + tpl.dx);
        render();
      }, true);
    });
  }
  function bindSbarEvents(){
    const insert = document.getElementById('insert-sbar-template');
    if (insert && !insert.dataset.direct2SbarBound) {
      insert.dataset.direct2SbarBound = '1';
      insert.addEventListener('click', ev => {
        ev.preventDefault(); ev.stopImmediatePropagation();
        const p = current(); if (!p) return;
        const s = document.getElementById('sb-s'), b = document.getElementById('sb-b'), a = document.getElementById('sb-a'), r = document.getElementById('sb-r');
        if (s) s.value = `This is the student nurse calling about ${p.firstName || ''} ${p.lastName || ''} in ${p.location || ''}, admitted for ${p.diagnosis || 'the current diagnosis'}.`;
        if (b) b.value = p.hpi || p.background || '';
        if (a) a.value = sbarAssessmentText(p);
        if (r) r.value = recommendationForSpecificFindings(p);
      }, true);
    }
    const save = document.getElementById('save-sbar');
    if (save && !save.dataset.direct2SbarSave) {
      save.dataset.direct2SbarSave = '1';
      save.addEventListener('click', () => { const p = current(); const a = document.getElementById('sb-a'), r = document.getElementById('sb-r'); if (p && a && !a.value.trim()) a.value = sbarAssessmentText(p); if (p && r && !r.value.trim()) r.value = recommendationForSpecificFindings(p); }, true);
    }
  }

  function patchBinders(){
    const original = g('bindTabEvents');
    if (typeof original === 'function' && !original.__direct2) {
      const wrapped = function(){ original.apply(this, arguments); bindDirectEvents(); };
      wrapped.__direct2 = true;
      expose('bindTabEvents', wrapped);
    }
    bindDirectEvents();
  }

  function installClickLogger(){
    if (window.__hctDirect2ClickLogger) return;
    window.__hctDirect2ClickLogger = true;
    document.addEventListener('click', e => { const action = actionFromClick(e.target); if (action) setTimeout(() => recordAction(action), 0); }, true);
  }

  function boot(){ patchNav(); patchLabs(); patchCarePlan(); patchSummary(); patchBinders(); installClickLogger(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setInterval(() => { patchNav(); bindDirectEvents(); }, 700);
  setTimeout(() => { boot(); render(); }, 1000);
})();
