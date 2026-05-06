const LOCAL_KEY = 'hct_ehr_classroom_v1';

const scenarios = [
  {
    id: 'heg', name: 'Hyperemesis Gravidarum', focus: 'OB / Emergency', level: 'Intermediate',
    summary: 'Pregnant patient with persistent vomiting, ketonuria, weight loss, dehydration risk, and medication sequencing priorities.',
    skills: ['IV fluids', 'Thiamine first', 'FHR check', 'SBAR'],
    patient: patientTemplate({
      id: 'heg-default', scenarioId: 'heg', firstName: 'Sandra', lastName: 'Garces', age: '30', sex: 'Female', dob: 'Aug 19', mrn: '102847', location: 'ED Bay 4',
      diagnosis: 'Hyperemesis Gravidarum', acuity: 'Urgent', allergies: 'NKDA', specialty: 'OB / ED', tags: ['HEG', 'NPO', 'Fall risk', 'HCT'], gestation: 'G2P1, 16 weeks',
      chiefComplaint: 'Persistent nausea and vomiting', hpi: 'Nausea and vomiting since 8 weeks gestation, progressively worse. Vomits 5-10 times/day despite doxylamine-pyridoxine. Reports 9 lb weight loss in 2 weeks and difficulty keeping fluids down.',
      background: 'Bedside ultrasound confirmed viable singleton pregnancy with fetal heart rate 150 bpm. Husband Kevin at bedside and supportive.',
      pastHistory: 'No chronic conditions. Prior term vaginal birth without complications.',
      orders: [['Diet','NPO','Nothing by mouth until nausea controlled','Active'],['Nursing','Vital signs with SpO2 q1h','Notify provider for HR > 120, SBP < 90, SpO2 < 92%','Active'],['Nursing','Strict intake and output','Notify provider if urine output < 120 mL in 4 hr','Active'],['OB','Doppler fetal heart rate x1','Document rate, rhythm, and maternal response','Complete'],['IV Fluids','Thiamine 100 mg IV push once','Give before dextrose-containing fluids','STAT'],['IV Fluids','LR with MVI 1 L IV bolus','Infuse at 500 mL/hr after thiamine','Active'],['Medication','Ondansetron 4 mg IV push q8h PRN','For nausea/vomiting','Active']],
      labs: [['10:45','UA ketones','Moderate','Negative','High','Starvation ketosis'],['10:45','UA protein','3+','Negative/trace','High','Concentrated urine'],['11:15','Sodium','134 mmol/L','135-145','Low','Mild hyponatremia'],['11:15','Potassium','3.3 mmol/L','3.5-5.0','Low','Replacement ordered'],['11:20','FHR Doppler','150 bpm','110-160','Normal','Regular rhythm']],
      vitals: [{time:'10:50',hr:100,bps:102,bpd:60,rr:18,temp:'98.8',spo2:98,pain:'3',fetal:'150',note:'Triage vital signs',by:'Triage RN'}],
      meds: [['Thiamine','100 mg','IV push','Once','STAT','pending','Give before any dextrose-containing fluid.'],["Lactated Ringer's with MVI",'1 L','IV','Bolus at 500 mL/hr','STAT','pending',''],['D5 0.45% NaCl + 20 mEq KCl','150 mL/hr','IV','Continuous','Scheduled','pending','Verify thiamine was administered first.'],['Ondansetron','4 mg','IV push','q8h PRN','PRN','pending','For nausea/vomiting']]
    })
  },
  {
    id: 'pph', name: 'Postpartum Hemorrhage', focus: 'Maternal / OB', level: 'Advanced',
    summary: 'Postpartum patient with heavy bleeding, boggy fundus, falling blood pressure, and urgent uterotonic priorities.',
    skills: ['Fundal massage', 'QBL', 'Uterotonics', 'Escalation'],
    patient: patientTemplate({id:'pph-default', scenarioId:'pph', firstName:'Leah', lastName:'Mendoza', age:'28', sex:'Female', dob:'Feb 6', mrn:'221603', location:'LDR 2', diagnosis:'Postpartum Hemorrhage', acuity:'Critical', allergies:'Shellfish - hives', specialty:'OB', tags:['PPH','Critical','QBL','HCT'], gestation:'G3P3, delivered 30 min ago', chiefComplaint:'Heavy postpartum bleeding', hpi:'Thirty minutes after vaginal delivery, patient reports dizziness and increased bleeding. Fundus is boggy and above umbilicus.', background:'Delivery complicated by prolonged second stage. Placenta delivered intact per provider note.', pastHistory:'Prior postpartum hemorrhage with second pregnancy.', orders:[['Nursing','Fundal massage now','Continue until firm; call provider if remains boggy','STAT'],['Nursing','Quantify blood loss','Weigh pads and linens','STAT'],['IV Fluids','LR 1 L bolus','Pressure bag if available','STAT'],['Medication','Oxytocin 30 units in 500 mL LR','125 mL/hr after bolus started','STAT'],['Lab','CBC, PT/INR, fibrinogen, type and crossmatch','Draw now','STAT']], labs:[['14:40','Hemoglobin','10.2 g/dL','12-16','Low','Pre-delivery 11.4'],['14:40','Platelets','168 K/uL','150-400','Normal',''],['14:40','Fibrinogen','280 mg/dL','200-400','Normal','Watch trend']], vitals:[{time:'14:38',hr:118,bps:92,bpd:54,rr:22,temp:'99.0',spo2:97,pain:'5',fetal:'Postpartum',note:'Dizzy, pale',by:'LDR RN'}], meds:[['Oxytocin','30 units/500 mL LR','IV','Continuous','STAT','pending',''],['Methylergonovine','0.2 mg','IM','Once','STAT','pending','Hold if hypertensive.'],["Lactated Ringer's",'1 L','IV','Bolus','STAT','pending','']]})
  },
  {
    id:'sepsis', name:'Sepsis From Pneumonia', focus:'Adult / Emergency', level:'Advanced',
    summary:'Adult patient with fever, tachycardia, hypotension, elevated lactate, and time-sensitive sepsis bundle care.',
    skills:['Cultures', 'Antibiotics', 'Fluids', 'Lactate'],
    patient: patientTemplate({id:'sepsis-default', scenarioId:'sepsis', firstName:'Robert', lastName:'Chen', age:'64', sex:'Male', dob:'Nov 2', mrn:'304419', location:'ED Bay 7', diagnosis:'Sepsis secondary to pneumonia', acuity:'Critical', allergies:'Penicillin - rash', specialty:'ED / Medical', tags:['Sepsis','O2','Fall risk','HCT'], chiefComplaint:'Shortness of breath and fever', hpi:'Two days of productive cough, fever, chills, and increasing shortness of breath. Family reports confusion this morning.', background:'Chest x-ray shows right lower lobe infiltrate.', pastHistory:'Type 2 diabetes, hypertension.', orders:[['Sepsis','Activate sepsis pathway','Document time zero and bundle elements','Active'],['Lab','Blood cultures x2, CBC, CMP, lactate','Before antibiotics if this does not delay care','STAT'],['IV Fluids','NS bolus 30 mL/kg','Reassess lungs and perfusion during bolus','STAT'],['Medication','Ceftriaxone 1 g IV','Verify allergy details; provider aware of rash only','STAT'],['Medication','Azithromycin 500 mg IV','Infuse per policy','STAT']], labs:[['08:35','Lactate','3.8 mmol/L','0.5-2.0','High','Repeat in 2 hr'],['08:35','WBC','18.4 K/uL','4.5-11','High',''],['08:40','CXR','RLL infiltrate','','High','Consistent with pneumonia']], vitals:[{time:'08:30',hr:126,bps:88,bpd:52,rr:28,temp:'102.4',spo2:89,pain:'2',fetal:'N/A',note:'Room air, confused',by:'Triage RN'}], meds:[['Normal saline','2460 mL','IV','Bolus','STAT','pending','Monitor lung sounds.'],['Ceftriaxone','1 g','IV','Once','STAT','pending','Review allergy history.'],['Azithromycin','500 mg','IV','Once','STAT','pending','']]})
  },
  {
    id:'asthma', name:'Pediatric Asthma Exacerbation', focus:'Pediatrics / Respiratory', level:'Intermediate',
    summary:'School-age patient with wheezing, increased work of breathing, low oxygen saturation, and bronchodilator response assessment.',
    skills:['Respiratory assessment', 'Nebulizers', 'Peak flow', 'Teaching'],
    patient: patientTemplate({id:'asthma-default', scenarioId:'asthma', firstName:'Maya', lastName:'Reyes', age:'9', sex:'Female', dob:'Apr 10', mrn:'552018', location:'Peds ED 3', diagnosis:'Acute asthma exacerbation', acuity:'Urgent', allergies:'NKDA', specialty:'Pediatrics', tags:['Asthma','Peds','O2','HCT'], chiefComplaint:'Trouble breathing and wheezing', hpi:'Wheezing began after soccer practice. Used rescue inhaler twice at home with limited relief. Speaking in short phrases on arrival.', background:'Known asthma, last ED visit 8 months ago. No intubation history.', pastHistory:'Asthma triggered by exercise and seasonal allergies.', orders:[['Respiratory','Albuterol nebulizer','2.5 mg now, repeat per protocol','STAT'],['Respiratory','Ipratropium nebulizer','0.5 mg now with first treatment','STAT'],['Medication','Dexamethasone 16 mg PO once','Give when able to tolerate PO','Active']], labs:[['19:10','SpO2 room air','91%','>95%','Low',''],['19:12','Peak flow','160 L/min','Personal best 280','Low','57% personal best']], vitals:[{time:'19:10',hr:124,bps:104,bpd:66,rr:32,temp:'98.9',spo2:91,pain:'0',fetal:'N/A',note:'Accessory muscle use',by:'Peds RN'}], meds:[['Albuterol','2.5 mg','Nebulized','Now','STAT','pending','Reassess HR and breath sounds.'],['Ipratropium','0.5 mg','Nebulized','Now','STAT','pending',''],['Dexamethasone','16 mg','PO','Once','Scheduled','pending','']]})
  },
  {
    id:'dka', name:'Diabetic Ketoacidosis', focus:'Adult / Endocrine', level:'Advanced',
    summary:'Young adult with hyperglycemia, ketones, dehydration, potassium monitoring, insulin infusion, and neurologic reassessment.',
    skills:['Insulin safety', 'Potassium checks', 'Neuro checks', 'Fluids'],
    patient: patientTemplate({id:'dka-default', scenarioId:'dka', firstName:'Jordan', lastName:'Williams', age:'22', sex:'Male', dob:'Sep 3', mrn:'661002', location:'ED Resus 1', diagnosis:'Diabetic Ketoacidosis', acuity:'Critical', allergies:'NKDA', specialty:'ED / ICU', tags:['DKA','Insulin drip','Critical','HCT'], chiefComplaint:'Vomiting, abdominal pain, very high blood sugar', hpi:'Type 1 diabetes patient missed insulin during illness. Presents with vomiting, abdominal pain, thirst, and fruity breath.', background:'Home glucose meter read HI. Family reports increased sleepiness.', pastHistory:'Type 1 diabetes since age 12.', orders:[['IV Fluids','NS 1 L bolus','Start immediately','STAT'],['Lab','BMP, VBG, serum ketones q2h','Trend potassium and anion gap','Active'],['Medication','Regular insulin infusion','Start after potassium verified > 3.3','Pending'],['Nursing','POC glucose q1h','Follow DKA protocol','Active']], labs:[['01:22','Glucose','586 mg/dL','70-110','High',''],['01:22','Potassium','4.8 mmol/L','3.5-5.0','Normal','Ok to start insulin per protocol'],['01:22','Anion gap','28','8-12','High',''],['01:25','VBG pH','7.21','7.32-7.43','Low','']], vitals:[{time:'01:20',hr:122,bps:96,bpd:58,rr:28,temp:'99.1',spo2:98,pain:'6',fetal:'N/A',note:'Kussmaul respirations',by:'ED RN'}], meds:[['Normal saline','1 L','IV','Bolus','STAT','pending',''],['Regular insulin infusion','0.1 units/kg/hr','IV','Continuous','Protocol','pending','Do not start if K < 3.3.']]})
  }
];

function patientTemplate(input) {
  return {
    id: input.id, scenarioId: input.scenarioId || 'scratch', firstName: input.firstName, lastName: input.lastName, age: input.age || '--', sex: input.sex || '--', dob: input.dob || '--', mrn: input.mrn || randomMrn(),
    location: input.location || 'Simulation room', encounter: input.encounter || 'Simulation encounter', diagnosis: input.diagnosis || 'Practice case', acuity: input.acuity || 'Stable', codeStatus: input.codeStatus || 'Full Code', allergies: input.allergies || 'NKDA', attending: input.attending || 'Simulation provider', nurse: 'Student Nurse',
    specialty: input.specialty || 'Student-created', tags: input.tags || ['HCT'], gestation: input.gestation || 'N/A', height: input.height || '--', weight: input.weight || '--', diet: input.diet || 'As ordered', activity: input.activity || 'As tolerated', lines: input.lines || 'Add line/access details', monitoring: input.monitoring || 'As ordered',
    chiefComplaint: input.chiefComplaint || input.diagnosis || 'Practice case', hpi: input.hpi || 'Add HPI details.', background: input.background || 'Add background and relevant history.', pastHistory: input.pastHistory || 'Add past medical history.', social: input.social || 'Add support system and social history.', familyContact: input.familyContact || 'Add family/contact details.',
    objectives: input.objectives || ['Complete chart review.', 'Document focused assessment.', 'Chart interventions and patient response.', 'Use SBAR for priority communication.'],
    orders: (input.orders || []).map(([category, order, details, status]) => ({category, order, details, status})),
    labs: (input.labs || []).map(([time, test, result, range, flag, note]) => ({time, test, result, range, flag, note})),
    diagnostics: input.diagnostics || [],
    vitals: input.vitals || [],
    meds: (input.meds || []).map(([name, dose, route, freq, priority, status, warn], index) => ({id: `med-${index}-${Date.now()}`, name, dose, route, freq, priority, status, time: '', note: '', warn})),
    io: input.io || [], notes: [],
    assessment: input.assessment || {neuro:'',resp:'',cardiac:'',gi:'',gu:'',skin:'',safety:'',pain:'',specialty:'',psychosocial:'',narrative:''},
    carePlan: input.carePlan || [{dx:'', goal:'', interventions:'', evaluation:'Pending'}],
    education: input.education || [{topic:'Diagnosis and plan of care', status:'Not started', response:''}],
    sbar: {s:'', b:'', a:'', r:''}
  };
}

function randomMrn(){ return String(Math.floor(100000 + Math.random() * 900000)); }
function clone(value){ return JSON.parse(JSON.stringify(value)); }
function esc(value){ return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function lines(value){ return esc(value || '').replace(/\n/g,'<br>'); }
function nowTime(){ return new Date().toTimeString().slice(0,5); }
function uid(prefix){ return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`; }

let state = loadState();
let dashboardRows = [];
let dashboardSelectedId = '';
let saveTimer = null;
let cloud = { ready:false, client:null, session:null, profile:null, status:'Local only', busy:false };

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    if(saved && Array.isArray(saved.patients) && saved.patients.length) return saved;
  } catch(error) {}
  return { patients:[clone(scenarios[0].patient)], activeId:'heg-default', tab:'summary', submitted:{} };
}

function currentPatient(){ return state.patients.find(p => p.id === state.activeId) || state.patients[0]; }
function scenarioName(id){ return (scenarios.find(s => s.id === id) || {}).name || 'Student-created case'; }
function toast(message){ const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1600); }
function persist(options = {}){
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  if(options.cloud !== false) scheduleCloudSave();
}
function scheduleCloudSave(){
  if(!cloud.ready || !cloud.session) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveCurrentChart(false), 1200);
}

function badgeClass(text){ const s = String(text || '').toLowerCase(); if(s.includes('allergy') || s.includes('fall') || s.includes('critical') || s.includes('stat')) return 'red'; if(s.includes('npo') || s.includes('risk') || s.includes('watch')) return 'gold'; if(s.includes('stable') || s.includes('full code')) return 'green'; if(s.includes('hct')) return 'teal'; return 'blue'; }
function statusClass(text){ const s = String(text || '').toLowerCase(); if(s.includes('stat') || s.includes('critical') || s.includes('high') || s.includes('low')) return 'critical'; if(s.includes('pending') || s.includes('hold')) return 'pending'; if(s.includes('active') || s.includes('complete') || s.includes('given')) return 'done'; return 'normal'; }
function section(title, body, right = ''){ return `<div class="card"><div class="card-head"><h3>${esc(title)}</h3>${right}</div><div class="card-body">${body}</div></div>`; }
function field(label, value){ return `<div class="field"><span class="k">${esc(label)}</span><span class="v">${lines(value || '--')}</span></div>`; }

async function initSupabase(){
  const cfg = window.HCT_SUPABASE_CONFIG || {};
  const configured = cfg.url && cfg.anonKey && !cfg.url.includes('YOUR-') && !cfg.anonKey.includes('YOUR_');
  if(!configured || !window.supabase){ cloud.status = 'Supabase not configured'; render(); return; }
  cloud.ready = true;
  cloud.client = window.supabase.createClient(cfg.url, cfg.anonKey);
  const { data } = await cloud.client.auth.getSession();
  cloud.session = data.session;
  if(cloud.session) await loadProfile();
  cloud.client.auth.onAuthStateChange(async (_event, session) => { cloud.session = session; cloud.profile = null; if(session) await loadProfile(); render(); });
  cloud.status = cloud.session ? 'Cloud connected' : 'Ready for login';
  render();
}

async function loadProfile(){
  if(!cloud.session) return;
  const user = cloud.session.user;
  const { data } = await cloud.client.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if(data){ cloud.profile = data; return; }
  const metadata = user.user_metadata || {};
  const profile = { id:user.id, email:user.email, full_name:metadata.full_name || '', student_id:metadata.student_id || '', section:metadata.section || '', role:'student' };
  await cloud.client.from('profiles').insert(profile);
  cloud.profile = profile;
}

async function signIn(){
  const email = val('auth-email');
  const password = val('auth-password');
  if(!email || !password){ toast('Email and password required'); return; }
  cloud.status = 'Signing in...'; render();
  const { error } = await cloud.client.auth.signInWithPassword({ email, password });
  if(error){ cloud.status = 'Sign in failed'; toast(error.message); render(); return; }
  toast('Signed in');
}

async function signUp(){
  const email = val('auth-email');
  const password = val('auth-password');
  if(!email || !password){ toast('Email and password required'); return; }
  const metadata = { full_name:val('auth-name'), student_id:val('auth-student-id'), section:val('auth-section') };
  cloud.status = 'Creating account...'; render();
  const { data, error } = await cloud.client.auth.signUp({ email, password, options:{ data: metadata } });
  if(error){ cloud.status = 'Account creation failed'; toast(error.message); render(); return; }
  if(data.session){ cloud.session = data.session; await upsertProfile(metadata); toast('Student account ready'); }
  else toast('Check email to confirm the account');
  render();
}

async function upsertProfile(metadata = {}){
  if(!cloud.session) return;
  const user = cloud.session.user;
  const existingRole = cloud.profile?.role || 'student';
  const profile = { id:user.id, email:user.email, full_name:metadata.full_name || cloud.profile?.full_name || '', student_id:metadata.student_id || cloud.profile?.student_id || '', section:metadata.section || cloud.profile?.section || '', role:existingRole };
  const { error } = await cloud.client.from('profiles').upsert(profile, { onConflict:'id' });
  if(error) toast(error.message); else cloud.profile = profile;
}

async function signOut(){ await cloud.client.auth.signOut(); cloud.session = null; cloud.profile = null; cloud.status = 'Signed out'; toast('Signed out'); render(); }

function chartRecord(status){
  const p = currentPatient();
  const profile = cloud.profile || {};
  const submitted = status === 'submitted' || state.submitted[p.id];
  return {
    user_id: cloud.session.user.id,
    local_patient_id: p.id,
    scenario_id: p.scenarioId,
    scenario_name: scenarioName(p.scenarioId),
    patient_name: `${p.lastName}, ${p.firstName}`,
    patient_mrn: p.mrn,
    student_name: profile.full_name || cloud.session.user.email,
    student_id: profile.student_id || '',
    section: profile.section || '',
    status: submitted ? 'submitted' : 'draft',
    submitted_at: submitted ? new Date().toISOString() : null,
    chart: { patient: p, saved_at: new Date().toISOString() }
  };
}

async function saveCurrentChart(showToast = true, status = 'draft'){
  if(!cloud.ready || !cloud.session){ if(showToast) toast('Sign in to save centrally'); return; }
  const record = chartRecord(status);
  const { error } = await cloud.client.from('chart_attempts').upsert(record, { onConflict:'user_id,local_patient_id' });
  if(error){ cloud.status = 'Cloud save failed'; if(showToast) toast(error.message); }
  else { cloud.status = record.status === 'submitted' ? 'Submitted to instructor' : 'Saved to Supabase'; if(showToast) toast(cloud.status); }
  renderCloudOnly();
}

async function submitCurrentChart(){
  if(!cloud.session){ toast('Sign in before submitting'); return; }
  if(!confirm('Submit this chart for instructor review? You can still view it, but the dashboard will mark it submitted.')) return;
  state.submitted[currentPatient().id] = true;
  persist({cloud:false});
  await saveCurrentChart(true, 'submitted');
}

async function fetchDashboard(){
  if(!cloud.profile || cloud.profile.role !== 'instructor') return;
  cloud.status = 'Loading dashboard...'; renderCloudOnly();
  const { data, error } = await cloud.client.from('chart_attempts').select('id,updated_at,submitted_at,status,student_name,student_id,section,scenario_name,patient_name,patient_mrn,chart,review_score,review_comment').order('updated_at', { ascending:false }).limit(200);
  if(error){ toast(error.message); return; }
  dashboardRows = data || [];
  cloud.status = `Dashboard loaded: ${dashboardRows.length} charts`;
  render();
}

async function saveReview(id){
  const score = val(`review-score-${id}`);
  const comment = val(`review-comment-${id}`);
  const { error } = await cloud.client.from('chart_attempts').update({ review_score: score ? Number(score) : null, review_comment: comment, reviewed_at: new Date().toISOString(), reviewed_by: cloud.session.user.id }).eq('id', id);
  if(error) toast(error.message); else { toast('Review saved'); await fetchDashboard(); }
}

function render(){
  const p = currentPatient();
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><img class="logo" src="assets/hct-logo-teal.svg" alt="HCT logo"><div><h1>HCT Student EHR Simulation</h1><p>Student login, Supabase chart saving, and instructor review dashboard</p></div></div>
        <div class="top-actions"><div><strong>${cloud.profile ? esc(cloud.profile.full_name || cloud.profile.email) : 'HCT Simulation Program'}</strong><p>${esc(cloud.status)}</p></div><img class="logo small" src="assets/hct-logo-navy.svg" alt="HCT logo navy"></div>
      </header>
      ${renderCloudPanel()}
      <div class="ehr">
        <aside class="sidebar">${renderPatientCard(p)}${renderPatientTools()}${renderNav()}<div class="sidebar-foot">${cloud.profile ? `${esc(cloud.profile.role)} | ${esc(cloud.profile.section || 'No section')}` : 'Local practice mode'}<br>Static app with Supabase sync</div></aside>
        <main class="main"><div class="toolbar"><div class="toolbar-title"><h2>${esc(tabTitle())}</h2><p>${esc(p.lastName)}, ${esc(p.firstName)} | MRN ${esc(p.mrn)} | ${esc(cloud.status)}</p></div>${toolbarButtons()}</div><section class="content" id="content">${renderTab()}</section></main>
      </div>
    </div>`;
  bindEvents();
}

function renderCloudOnly(){
  const panel = document.getElementById('cloud-panel');
  if(panel) panel.outerHTML = renderCloudPanel();
  const subtitle = document.querySelector('.toolbar-title p');
  if(subtitle){ const p = currentPatient(); subtitle.textContent = `${p.lastName}, ${p.firstName} | MRN ${p.mrn} | ${cloud.status}`; }
  bindCloudEvents();
}

function renderCloudPanel(){
  if(!cloud.ready){ return `<section class="cloud-panel" id="cloud-panel"><div class="notice danger"><span class="mark">SETUP</span><span>Supabase is not configured yet. Fill in <strong>supabase-config.js</strong> and run <strong>supabase-schema.sql</strong>. Until then, charting stays in this browser only.</span></div></section>`; }
  if(!cloud.session){ return `<section class="cloud-panel" id="cloud-panel"><div class="cloud-grid"><div><span class="input-label">Email</span><input id="auth-email" type="email" placeholder="student@example.edu"></div><div><span class="input-label">Password</span><input id="auth-password" type="password" placeholder="Password"></div><div><span class="input-label">Full name</span><input id="auth-name" placeholder="Student name"></div><div><span class="input-label">Student ID</span><input id="auth-student-id" placeholder="ID"></div><div><span class="input-label">Section</span><input id="auth-section" placeholder="Class/section"></div></div><div class="actions"><button class="btn" id="signin-btn">Sign in</button><button class="btn primary" id="signup-btn">Create student account</button></div></section>`; }
  const p = cloud.profile || {};
  return `<section class="cloud-panel" id="cloud-panel"><div class="cloud-status"><span class="badge ${p.role === 'instructor' ? 'navy' : 'teal'}">${esc(p.role || 'student')}</span><strong>${esc(p.full_name || cloud.session.user.email)}</strong><span>${esc(p.student_id || '')}</span><span>${esc(p.section || '')}</span><span>${esc(cloud.status)}</span></div><div class="actions"><button class="btn primary" id="save-cloud-btn">Save current chart</button><button class="btn navy" id="submit-chart-btn">Submit chart</button>${p.role === 'instructor' ? '<button class="btn" id="dashboard-shortcut">Instructor dashboard</button>' : ''}<button class="btn" id="signout-btn">Sign out</button></div></section>`;
}

function renderPatientCard(p){ return `<div class="patient-card"><span class="label">Active patient</span><div class="patient-name">${esc(p.lastName)}, ${esc(p.firstName)}</div><div class="patient-line">${esc(p.sex)} | ${esc(p.age)}y | DOB ${esc(p.dob)} | MRN ${esc(p.mrn)}</div><div class="patient-line">${esc(p.location)} | ${esc(p.diagnosis)}</div><div class="patient-line">${esc(p.gestation)} | ${esc(p.codeStatus)} | ${esc(p.allergies)}</div><div class="badges">${(p.tags || []).map(t => `<span class="badge ${badgeClass(t)}">${esc(t)}</span>`).join('')}</div></div>`; }
function renderPatientTools(){ return `<div class="patient-tools"><label class="label" for="patient-select">Patient workspace</label><select id="patient-select">${state.patients.map(p => `<option value="${esc(p.id)}" ${p.id === state.activeId ? 'selected' : ''}>${esc(p.lastName)}, ${esc(p.firstName)} - ${esc(p.diagnosis)}</option>`).join('')}</select><div class="quick-actions"><button class="btn small primary" data-tab-jump="newpatient">New patient</button><button class="btn small" data-tab-jump="scenarios">Samples</button></div></div>`; }
function renderNav(){ const groups = [['Chart review',[['summary','PS','Patient summary'],['orders','PO','Provider orders'],['labs','LR','Labs / diagnostics']]],['Documentation',[['vitals','VS','Vital signs'],['assessment','FA','Focused assessment'],['meds','MR','MAR'],['io','IO','Intake / output'],['notes','NN','Nursing notes'],['careplan','CP','Care plan'],['education','ED','Education'],['sbar','SB','SBAR / handoff']]],['Student tools',[['scenarios','SC','Sample scenarios'],['newpatient','NP','Add patient']]]]; if(cloud.profile?.role === 'instructor') groups.push(['Instructor',[['dashboard','ID','Dashboard']]]); return `<nav class="nav">${groups.map(([g,items]) => `<div class="group">${g}</div>${items.map(([tab,ic,label]) => `<button class="nav-btn ${state.tab === tab ? 'active' : ''}" data-tab="${tab}"><span class="nav-ic">${ic}</span>${label}</button>`).join('')}`).join('')}</nav>`; }
function toolbarButtons(){ return `<button class="btn small primary" id="save-local-btn">Save</button><button class="btn small" onclick="window.print()">Print</button><button class="btn small danger" id="reset-btn">Reset local</button>`; }
function tabTitle(){ const titles = {summary:'Patient summary',orders:'Provider orders',labs:'Labs / diagnostics',vitals:'Vital signs',assessment:'Focused assessment',meds:'Medication administration record',io:'Intake / output',notes:'Nursing notes',careplan:'Care plan',education:'Patient education',sbar:'SBAR / handoff',scenarios:'Sample scenarios',newpatient:'Add patient from scratch',dashboard:'Instructor dashboard'}; return titles[state.tab] || 'Patient summary'; }
function renderTab(){ const map = {summary:rSummary, orders:rOrders, labs:rLabs, vitals:rVitals, assessment:rAssessment, meds:rMeds, io:rIO, notes:rNotes, careplan:rCarePlan, education:rEducation, sbar:rSbar, scenarios:rScenarios, newpatient:rNewPatient, dashboard:rDashboard}; return (map[state.tab] || rSummary)(); }

function rSummary(){ const p=currentPatient(); return `${section('Safety snapshot', `<div class="notice ${p.acuity === 'Critical' ? 'danger' : 'info'}"><span class="mark">HCT</span><span><strong>${esc(p.acuity)} acuity.</strong> Allergies: ${esc(p.allergies)}. Monitoring: ${esc(p.monitoring)}.</span></div><div class="grid-4">${field('Patient', `${p.lastName}, ${p.firstName}`)}${field('DOB / Age', `${p.dob} / ${p.age}`)}${field('Location', p.location)}${field('Diagnosis', p.diagnosis)}${field('Code status', p.codeStatus)}${field('Diet', p.diet)}${field('Activity', p.activity)}${field('Lines', p.lines)}</div>`)}${section('Clinical picture', `<p class="text-block"><strong>Chief complaint:</strong> ${esc(p.chiefComplaint)}</p><p class="text-block"><strong>HPI:</strong> ${esc(p.hpi)}</p><p class="text-block"><strong>Background:</strong> ${esc(p.background)}</p>`)}${section('History and objectives', `<div class="grid-2">${field('Past history', p.pastHistory)}${field('Social / contact', `${p.social}\n${p.familyContact}`)}${(p.objectives || []).map((o,i)=>field(`Objective ${i+1}`, o)).join('')}</div>`)}`; }
function rOrders(){ const p=currentPatient(); const rows=p.orders.map((o,i)=>`<tr><td>${esc(o.category)}</td><td>${esc(o.order)}</td><td>${esc(o.details)}</td><td><span class="status ${statusClass(o.status)}">${esc(o.status)}</span></td><td><button class="btn small danger" data-del-order="${i}">Delete</button></td></tr>`).join(''); return section('Provider orders', table(['Category','Order','Details','Status',''], rows)) + section('Add order', `<div class="form-grid"><input id="ord-cat" placeholder="Category"><input id="ord-name" placeholder="Order"><input id="ord-details" placeholder="Details"><select id="ord-status"><option>Active</option><option>STAT</option><option>Pending</option><option>Complete</option></select></div><div class="actions"><button class="btn primary" id="add-order">Add order</button></div>`); }
function rLabs(){ const p=currentPatient(); const rows=p.labs.map((l,i)=>`<tr><td>${esc(l.time)}</td><td>${esc(l.test)}</td><td><strong>${esc(l.result)}</strong></td><td>${esc(l.range)}</td><td><span class="status ${statusClass(l.flag)}">${esc(l.flag)}</span></td><td>${esc(l.note)}</td><td><button class="btn small danger" data-del-lab="${i}">Delete</button></td></tr>`).join(''); return section('Labs and diagnostics', table(['Time','Test','Result','Range','Flag','Note',''], rows)) + section('Add lab result', `<div class="form-grid"><input id="lab-time" type="time" value="${nowTime()}"><input id="lab-test" placeholder="Test"><input id="lab-result" placeholder="Result"><select id="lab-flag"><option>Normal</option><option>High</option><option>Low</option><option>Critical</option><option>Pending</option></select></div><div class="form-row"><label>Range / note</label><div class="grid-2"><input id="lab-range" placeholder="Reference range"><input id="lab-note" placeholder="Clinical note"></div></div><div class="actions"><button class="btn primary" id="add-lab">Add result</button></div>`); }
function rVitals(){ const p=currentPatient(); const last=p.vitals[p.vitals.length-1] || {}; const rows=p.vitals.map((v,i)=>`<tr><td>${esc(v.time)}</td><td>${esc(v.hr)}</td><td>${esc(v.bps)}/${esc(v.bpd)}</td><td>${esc(v.rr)}</td><td>${esc(v.temp)}</td><td>${esc(v.spo2)}%</td><td>${esc(v.pain)}</td><td>${esc(v.fetal)}</td><td>${esc(v.note)}</td><td><button class="btn small danger" data-del-vital="${i}">Delete</button></td></tr>`).join(''); return `<div class="metric-row"><div class="metric"><div class="num">${esc(last.hr||'--')}</div><div class="lbl">HR</div></div><div class="metric"><div class="num">${esc(last.bps||'--')}/${esc(last.bpd||'--')}</div><div class="lbl">BP</div></div><div class="metric"><div class="num">${esc(last.rr||'--')}</div><div class="lbl">RR</div></div><div class="metric"><div class="num">${esc(last.spo2||'--')}%</div><div class="lbl">SpO2</div></div></div>${section('Vital trend', `<svg class="vital-chart" viewBox="0 0 760 180">${vitalSvg(p.vitals)}</svg>`)}${section('Flowsheet', table(['Time','HR','BP','RR','Temp','SpO2','Pain','Specialty','Note',''], rows))}${section('Add vital signs', `<div class="form-grid"><input id="vt-time" type="time" value="${nowTime()}"><input id="vt-hr" type="number" placeholder="HR"><input id="vt-bps" type="number" placeholder="SBP"><input id="vt-bpd" type="number" placeholder="DBP"><input id="vt-rr" type="number" placeholder="RR"><input id="vt-temp" placeholder="Temp F"><input id="vt-spo2" type="number" placeholder="SpO2"><input id="vt-pain" placeholder="Pain"></div><div class="form-row"><label>Specialty / note</label><div class="grid-2"><input id="vt-fetal" placeholder="FHR, peak flow, neuro, or N/A"><input id="vt-note" placeholder="Response or cue"></div></div><div class="actions"><button class="btn primary" id="add-vital">Add vital signs</button></div>`)}`; }
function rAssessment(){ const a=currentPatient().assessment; const input=(k,ph='')=>`<input id="as-${k}" value="${esc(a[k]||'')}" placeholder="${esc(ph)}">`; return section('Focused assessment template', `<div class="form-row"><label>Neuro</label>${input('neuro')}</div><div class="form-row"><label>Respiratory</label>${input('resp')}</div><div class="form-row"><label>Cardiac / perfusion</label>${input('cardiac')}</div><div class="form-row"><label>GI</label>${input('gi')}</div><div class="form-row"><label>GU / output</label>${input('gu')}</div><div class="form-row"><label>Skin / hydration</label>${input('skin')}</div><div class="form-row"><label>Safety</label>${input('safety')}</div><div class="form-row"><label>Pain</label>${input('pain')}</div><div class="form-row"><label>Specialty cues</label>${input('specialty','FHR, fundus, peak flow, neuro checks, etc.')}</div><div class="form-row"><label>Psychosocial</label>${input('psychosocial')}</div><div class="form-row"><label>Narrative</label><textarea id="as-narrative">${esc(a.narrative||'')}</textarea></div><div class="actions"><button class="btn primary" id="save-assessment">Save assessment</button></div>`); }
function rMeds(){ const p=currentPatient(); const rows=p.meds.map((m,i)=>`<tr><td><strong>${esc(m.name)}</strong><br><span class="badge blue">${esc(m.priority)}</span>${m.warn?`<br><span style="color:var(--danger);font-size:11px;">${esc(m.warn)}</span>`:''}</td><td>${esc(m.dose)} ${esc(m.route)}<br>${esc(m.freq)}</td><td><span class="status ${statusClass(m.status)}">${esc(m.status)}</span></td><td><button class="btn small primary" data-med-act="given" data-med-index="${i}">Given</button> <button class="btn small" data-med-act="hold" data-med-index="${i}">Hold</button> <button class="btn small danger" data-med-act="not_given" data-med-index="${i}">Not given</button></td><td><input data-med-time="${i}" type="time" value="${esc(m.time||'')}"><input data-med-note="${i}" value="${esc(m.note||'')}" placeholder="site / response / reason"></td><td><button class="btn small danger" data-del-med="${i}">Delete</button></td></tr>`).join(''); return section('MAR safety', `<div class="notice danger"><span class="mark">MAR</span><span>Verify patient, medication, dose, route, time, allergies, indication, and relevant labs before documenting administration.</span></div>`) + section('Medication administration record', table(['Medication','Dose / route','Status','Action','Time / note',''], rows)) + section('Add medication', `<div class="form-grid"><input id="med-name" placeholder="Medication"><input id="med-dose" placeholder="Dose"><input id="med-route" placeholder="Route"><input id="med-freq" placeholder="Frequency"></div><div class="form-row"><label>Safety note</label><input id="med-warn" placeholder="Hold parameter or sequencing cue"></div><div class="actions"><button class="btn primary" id="add-med">Add medication</button></div>`); }
function rIO(){ const p=currentPatient(); const totals=p.io.reduce((a,e)=>{ Number(e.amount); if(e.direction==='in') a.ins += Number(e.amount)||0; else a.outs += Number(e.amount)||0; return a; }, {ins:0,outs:0}); const rows=p.io.map((e,i)=>`<tr><td>${esc(e.time)}</td><td>${esc(e.type)}</td><td>${e.direction==='in'?esc(e.amount):'--'}</td><td>${e.direction==='out'?esc(e.amount):'--'}</td><td>${esc(e.note)}</td><td>${esc(e.by)}</td><td><button class="btn small danger" data-del-io="${i}">Delete</button></td></tr>`).join(''); return `<div class="metric-row"><div class="metric"><div class="num">${totals.ins}</div><div class="lbl">Intake</div></div><div class="metric"><div class="num">${totals.outs}</div><div class="lbl">Output</div></div><div class="metric"><div class="num">${totals.ins - totals.outs}</div><div class="lbl">Net</div></div><div class="metric"><div class="num">${p.io.length}</div><div class="lbl">Entries</div></div></div>${section('I/O flowsheet', table(['Time','Type','In','Out','Note','By',''], rows))}${section('Add I/O', `<div class="form-grid"><input id="io-time" type="time" value="${nowTime()}"><input id="io-type" placeholder="IV bolus, urine, emesis"><input id="io-amount" type="number" placeholder="mL"><select id="io-direction"><option value="in">Intake</option><option value="out">Output</option></select></div><div class="form-row"><label>Note</label><input id="io-note" placeholder="Color, tolerance, route, or context"></div><div class="actions"><button class="btn primary" id="add-io">Add I/O</button></div>`)}`; }
function rNotes(){ const p=currentPatient(); const notes=p.notes.length ? p.notes.map((n,i)=>`<div class="note"><div class="note-head"><span><span class="note-type">${esc(n.type)}</span> | ${esc(n.time)} | ${esc(n.by)}</span><button class="btn small danger" data-del-note="${i}">Delete</button></div><div class="note-body">${esc(n.body)}</div></div>`).join('') : '<p class="text-block" style="text-align:center;color:var(--subtle);padding:18px;">No signed notes yet.</p>'; return section('Signed nursing notes', notes) + section('Add note', `<div class="form-row"><label>Type</label><select id="note-type"><option>HCT focused progress note</option><option>Admission note</option><option>Assessment note</option><option>Medication note</option><option>Patient education</option><option>Provider notification</option><option>Shift summary</option></select></div><div class="form-row"><label>Time</label><input id="note-time" type="time" value="${nowTime()}"></div><div class="form-row"><label>Note</label><textarea id="note-body" placeholder="Objective findings, interventions, response, follow-up plan."></textarea></div><div class="actions"><button class="btn" id="insert-note-template">Insert HCT template</button><button class="btn primary" id="save-note">Sign and save</button></div>`); }
function rCarePlan(){ const rows=currentPatient().carePlan.map((c,i)=>`<tr><td><input data-cp="dx" data-cp-index="${i}" value="${esc(c.dx)}"></td><td><textarea data-cp="goal" data-cp-index="${i}">${esc(c.goal)}</textarea></td><td><textarea data-cp="interventions" data-cp-index="${i}">${esc(c.interventions)}</textarea></td><td><textarea data-cp="evaluation" data-cp-index="${i}">${esc(c.evaluation)}</textarea></td><td><button class="btn small danger" data-del-cp="${i}">Delete</button></td></tr>`).join(''); return section('Nursing care plan', table(['Diagnosis','Goal','Interventions','Evaluation',''], rows) + '<div class="actions"><button class="btn primary" id="add-careplan">Add row</button><button class="btn navy" id="save-careplan">Save care plan</button></div>'); }
function rEducation(){ const rows=currentPatient().education.map((e,i)=>`<div class="check-row"><input type="checkbox" data-ed-check="${i}" ${e.status==='Complete'?'checked':''}><strong>${esc(e.topic)}</strong><select data-ed-status="${i}"><option ${e.status==='Not started'?'selected':''}>Not started</option><option ${e.status==='In progress'?'selected':''}>In progress</option><option ${e.status==='Complete'?'selected':''}>Complete</option><option ${e.status==='Deferred'?'selected':''}>Deferred</option></select><input data-ed-response="${i}" value="${esc(e.response)}" placeholder="Learner/patient response"></div>`).join(''); return section('Education record', `${rows}<div class="form-row"><label>New topic</label><input id="ed-topic" placeholder="Medication effects, warning signs, device use"></div><div class="actions"><button class="btn primary" id="add-education">Add topic</button><button class="btn navy" id="save-education">Save education</button></div>`); }
function rSbar(){ const s=currentPatient().sbar; return section('SBAR communication', `<div class="form-row"><label>Situation</label><textarea id="sb-s">${esc(s.s)}</textarea></div><div class="form-row"><label>Background</label><textarea id="sb-b">${esc(s.b)}</textarea></div><div class="form-row"><label>Assessment</label><textarea id="sb-a">${esc(s.a)}</textarea></div><div class="form-row"><label>Recommendation</label><textarea id="sb-r">${esc(s.r)}</textarea></div><div class="actions"><button class="btn" id="insert-sbar-template">Insert template</button><button class="btn primary" id="save-sbar">Save and document call</button></div>`); }
function rScenarios(){ return section('Sample scenario library', `<div class="notice info"><span class="mark">HCT</span><span>Open a sample to create a separate editable patient copy in the student workspace.</span></div><div class="scenario-grid">${scenarios.map(sc=>`<article class="scenario-card"><div class="top"></div><div class="body"><span class="label">${esc(sc.focus)} | ${esc(sc.level)}</span><h3>${esc(sc.name)}</h3><p>${esc(sc.summary)}</p><div class="skill-list">${sc.skills.map(skill=>`<span class="badge blue">${esc(skill)}</span>`).join('')}</div><button class="btn primary" data-load-scenario="${esc(sc.id)}">Open scenario</button></div></article>`).join('')}</div>`); }
function rNewPatient(){ return section('Create patient from scratch', `<div class="form-grid"><input id="np-first" placeholder="First name"><input id="np-last" placeholder="Last name"><input id="np-age" placeholder="Age"><select id="np-sex"><option>Female</option><option>Male</option><option>Nonbinary</option><option>Other</option></select><input id="np-dob" placeholder="DOB"><input id="np-mrn" placeholder="MRN auto if blank"><input id="np-location" placeholder="Location"><select id="np-acuity"><option>Stable</option><option>Watcher</option><option>Urgent</option><option>Critical</option></select></div><div class="form-row"><label>Diagnosis</label><input id="np-diagnosis" placeholder="Primary diagnosis"></div><div class="form-row"><label>Chief complaint</label><input id="np-cc" placeholder="Why the patient presented"></div><div class="form-row"><label>HPI</label><textarea id="np-hpi"></textarea></div><div class="form-row"><label>Background / PMH</label><textarea id="np-bg"></textarea></div><div class="form-row"><label>Allergies / code / tags</label><div class="grid-3"><input id="np-allergies" placeholder="NKDA"><select id="np-code"><option>Full Code</option><option>DNR</option><option>DNI</option><option>Limited Code</option></select><input id="np-tags" placeholder="HCT, Fall risk"></div></div><div class="actions"><button class="btn primary" id="create-patient">Create patient</button></div>`); }
function rDashboard(){ if(cloud.profile?.role !== 'instructor') return section('Instructor dashboard', '<div class="notice danger"><span class="mark">LOCKED</span><span>Instructor role required. Promote the instructor profile in Supabase with the SQL note in supabase-schema.sql.</span></div>'); const rows=dashboardRows.map(r=>`<tr><td>${esc(r.student_name||'')}</td><td>${esc(r.student_id||'')}</td><td>${esc(r.section||'')}</td><td>${esc(r.scenario_name||'')}</td><td>${esc(r.patient_name||'')}</td><td><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></td><td>${new Date(r.updated_at).toLocaleString()}</td><td><button class="btn small" data-view-attempt="${r.id}">View</button></td></tr>`).join(''); const selected=dashboardRows.find(r=>r.id===dashboardSelectedId); return section('Instructor dashboard controls', `<div class="actions" style="justify-content:flex-start;margin:0;"><button class="btn primary" id="refresh-dashboard">Refresh</button><button class="btn" id="export-dashboard">Export CSV</button></div>`) + section('Student submissions', table(['Student','ID','Section','Scenario','Patient','Status','Updated',''], rows || '<tr><td colspan="8">No submissions loaded.</td></tr>')) + (selected ? renderAttemptDetail(selected) : ''); }
function renderAttemptDetail(row){ const p=row.chart?.patient || {}; const notes=(p.notes||[]).map(n=>`<div class="note"><div class="note-head"><span>${esc(n.type)} | ${esc(n.time)} | ${esc(n.by)}</span></div><div class="note-body">${esc(n.body)}</div></div>`).join('') || '<p class="text-block">No notes signed.</p>'; return section('Selected chart review', `<div class="dashboard-detail"><div>${field('Student', `${row.student_name || ''}\n${row.student_id || ''}\n${row.section || ''}`)}${field('Patient', `${row.patient_name}\nMRN ${row.patient_mrn}`)}${field('Diagnosis', p.diagnosis)}${field('Latest assessment', p.assessment?.narrative || 'No narrative assessment entered.')}${notes}</div><div><label class="input-label">Score</label><input id="review-score-${row.id}" type="number" value="${esc(row.review_score||'')}" placeholder="0-100"><label class="input-label">Instructor comments</label><textarea id="review-comment-${row.id}">${esc(row.review_comment||'')}</textarea><div class="actions"><button class="btn primary" data-save-review="${row.id}">Save review</button></div></div></div>`); }

function table(headers, rows){ return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`; }
function vitalSvg(vitals){ if(!vitals.length) return '<text x="380" y="92" text-anchor="middle" fill="#8b98aa" font-size="13">No vital signs charted</text>'; const px=42,py=22,w=690,h=120; const vals=vitals.flatMap(v=>[Number(v.hr)||0,Number(v.bps)||0]).filter(Boolean); const lo=Math.min(50,...vals)-5, hi=Math.max(140,...vals)+5; const x=i=>vitals.length===1?px+w/2:px+i*(w/(vitals.length-1)); const y=val=>py+h-((Number(val)-lo)/(hi-lo))*h; const path=k=>vitals.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v[k]).toFixed(1)}`).join(' '); const dots=(k,c)=>vitals.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v[k])}" r="3.5" fill="${c}"></circle>`).join(''); const labels=vitals.map((v,i)=>`<text x="${x(i)}" y="164" text-anchor="middle" fill="#8b98aa" font-size="10">${esc(v.time)}</text>`).join(''); return `<line x1="${px}" y1="${py+h}" x2="${px+w}" y2="${py+h}" stroke="rgba(23,41,70,0.18)"></line><path d="${path('hr')}" fill="none" stroke="#a33131" stroke-width="2"></path>${dots('hr','#a33131')}<path d="${path('bps')}" fill="none" stroke="#175f9e" stroke-width="2"></path>${dots('bps','#175f9e')}${labels}`; }
function val(id){ return document.getElementById(id)?.value?.trim() || ''; }
function setTab(tab){ state.tab=tab; persist({cloud:false}); if(tab==='dashboard') fetchDashboard(); else render(); }

function bindEvents(){
  bindCloudEvents();
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  document.querySelectorAll('[data-tab-jump]').forEach(b=>b.onclick=()=>setTab(b.dataset.tabJump));
  document.getElementById('patient-select')?.addEventListener('change', e=>{state.activeId=e.target.value; state.tab='summary'; persist({cloud:false}); render();});
  document.getElementById('save-local-btn')?.addEventListener('click', ()=>{persist(); toast('Saved locally');});
  document.getElementById('reset-btn')?.addEventListener('click', ()=>{if(confirm('Reset all local charting in this browser?')){localStorage.removeItem(LOCAL_KEY); location.reload();}});
  bindTabEvents();
}
function bindCloudEvents(){ document.getElementById('signin-btn')?.addEventListener('click', signIn); document.getElementById('signup-btn')?.addEventListener('click', signUp); document.getElementById('signout-btn')?.addEventListener('click', signOut); document.getElementById('save-cloud-btn')?.addEventListener('click', ()=>saveCurrentChart(true)); document.getElementById('submit-chart-btn')?.addEventListener('click', submitCurrentChart); document.getElementById('dashboard-shortcut')?.addEventListener('click', ()=>setTab('dashboard')); }
function bindTabEvents(){
  const p=currentPatient();
  document.getElementById('add-order')?.addEventListener('click',()=>{ const order=val('ord-name'); if(!order) return toast('Order required'); p.orders.push({category:val('ord-cat')||'Nursing',order,details:val('ord-details'),status:val('ord-status')||'Active'}); persist(); render(); });
  document.querySelectorAll('[data-del-order]').forEach(b=>b.onclick=()=>{p.orders.splice(Number(b.dataset.delOrder),1); persist(); render();});
  document.getElementById('add-lab')?.addEventListener('click',()=>{ const test=val('lab-test'); if(!test) return toast('Test required'); p.labs.push({time:val('lab-time'),test,result:val('lab-result'),range:val('lab-range'),flag:val('lab-flag'),note:val('lab-note')}); persist(); render(); });
  document.querySelectorAll('[data-del-lab]').forEach(b=>b.onclick=()=>{p.labs.splice(Number(b.dataset.delLab),1); persist(); render();});
  document.getElementById('add-vital')?.addEventListener('click',()=>{ if(!val('vt-hr')||!val('vt-bps')||!val('vt-bpd')) return toast('HR and BP required'); p.vitals.push({time:val('vt-time'),hr:Number(val('vt-hr')),bps:Number(val('vt-bps')),bpd:Number(val('vt-bpd')),rr:val('vt-rr'),temp:val('vt-temp'),spo2:val('vt-spo2'),pain:val('vt-pain'),fetal:val('vt-fetal'),note:val('vt-note'),by:'Student Nurse'}); p.vitals.sort((a,b)=>String(a.time).localeCompare(String(b.time))); persist(); render(); });
  document.querySelectorAll('[data-del-vital]').forEach(b=>b.onclick=()=>{p.vitals.splice(Number(b.dataset.delVital),1); persist(); render();});
  document.getElementById('save-assessment')?.addEventListener('click',()=>{['neuro','resp','cardiac','gi','gu','skin','safety','pain','specialty','psychosocial','narrative'].forEach(k=>p.assessment[k]=val('as-'+k)); persist(); toast('Assessment saved');});
  document.querySelectorAll('[data-med-act]').forEach(b=>b.onclick=()=>{ const m=p.meds[Number(b.dataset.medIndex)]; m.status=b.dataset.medAct; if(m.status==='given'&&!m.time)m.time=nowTime(); persist(); render();});
  document.querySelectorAll('[data-med-time]').forEach(i=>i.onchange=()=>{p.meds[Number(i.dataset.medTime)].time=i.value; persist();});
  document.querySelectorAll('[data-med-note]').forEach(i=>i.onchange=()=>{p.meds[Number(i.dataset.medNote)].note=i.value; persist();});
  document.querySelectorAll('[data-del-med]').forEach(b=>b.onclick=()=>{p.meds.splice(Number(b.dataset.delMed),1); persist(); render();});
  document.getElementById('add-med')?.addEventListener('click',()=>{ const name=val('med-name'); if(!name) return toast('Medication required'); p.meds.push({id:uid('med'),name,dose:val('med-dose'),route:val('med-route'),freq:val('med-freq'),priority:'Practice',status:'pending',time:'',note:'',warn:val('med-warn')}); persist(); render();});
  document.getElementById('add-io')?.addEventListener('click',()=>{ const amount=Number(val('io-amount')); if(!amount) return toast('Amount required'); p.io.push({time:val('io-time'),type:val('io-type')||'Other',amount,direction:val('io-direction'),note:val('io-note'),by:'Student Nurse'}); persist(); render();});
  document.querySelectorAll('[data-del-io]').forEach(b=>b.onclick=()=>{p.io.splice(Number(b.dataset.delIo),1); persist(); render();});
  document.getElementById('insert-note-template')?.addEventListener('click',()=>{document.getElementById('note-body').value=`HCT Focused Progress Note\nPatient: ${p.lastName}, ${p.firstName} | Diagnosis: ${p.diagnosis}\n\nAssessment cues:\n- Neuro: ${p.assessment.neuro}\n- Respiratory: ${p.assessment.resp}\n- Cardiac/perfusion: ${p.assessment.cardiac}\n- Priority concern:\n\nInterventions completed:\n- \n\nPatient response / reassessment:\n- \n\nPlan / follow-up:\n- `;});
  document.getElementById('save-note')?.addEventListener('click',()=>{ const body=val('note-body'); if(!body)return toast('Note body required'); p.notes.push({type:val('note-type'),time:val('note-time'),body,by:'Student Nurse'}); persist(); render();});
  document.querySelectorAll('[data-del-note]').forEach(b=>b.onclick=()=>{p.notes.splice(Number(b.dataset.delNote),1); persist(); render();});
  document.getElementById('add-careplan')?.addEventListener('click',()=>{p.carePlan.push({dx:'',goal:'',interventions:'',evaluation:'Pending'}); persist(); render();});
  document.getElementById('save-careplan')?.addEventListener('click',()=>{document.querySelectorAll('[data-cp]').forEach(el=>p.carePlan[Number(el.dataset.cpIndex)][el.dataset.cp]=el.value); persist(); toast('Care plan saved');});
  document.querySelectorAll('[data-del-cp]').forEach(b=>b.onclick=()=>{p.carePlan.splice(Number(b.dataset.delCp),1); persist(); render();});
  document.getElementById('add-education')?.addEventListener('click',()=>{const topic=val('ed-topic'); if(!topic)return toast('Topic required'); p.education.push({topic,status:'Not started',response:''}); persist(); render();});
  document.getElementById('save-education')?.addEventListener('click',()=>{document.querySelectorAll('[data-ed-status]').forEach(el=>p.education[Number(el.dataset.edStatus)].status=el.value); document.querySelectorAll('[data-ed-response]').forEach(el=>p.education[Number(el.dataset.edResponse)].response=el.value); document.querySelectorAll('[data-ed-check]').forEach(el=>{if(el.checked)p.education[Number(el.dataset.edCheck)].status='Complete';}); persist(); toast('Education saved');});
  document.getElementById('insert-sbar-template')?.addEventListener('click',()=>{const last=p.vitals[p.vitals.length-1]||{}; document.getElementById('sb-s').value=`This is the student nurse calling about ${p.firstName} ${p.lastName} in ${p.location}, admitted for ${p.diagnosis}.`; document.getElementById('sb-b').value=p.hpi; document.getElementById('sb-a').value=`Current assessment: HR ${last.hr||'--'}, BP ${last.bps||'--'}/${last.bpd||'--'}, RR ${last.rr||'--'}, SpO2 ${last.spo2||'--'}%. Priority concern:`; document.getElementById('sb-r').value='I recommend provider reassessment and clarification of next orders. Please advise.';});
  document.getElementById('save-sbar')?.addEventListener('click',()=>{p.sbar={s:val('sb-s'),b:val('sb-b'),a:val('sb-a'),r:val('sb-r')}; if(!p.sbar.s)return toast('Situation required'); p.notes.push({type:'Provider notification',time:nowTime(),by:'Student Nurse',body:`SBAR provider communication\n\nS: ${p.sbar.s}\n\nB: ${p.sbar.b}\n\nA: ${p.sbar.a}\n\nR: ${p.sbar.r}`}); persist(); render();});
  document.querySelectorAll('[data-load-scenario]').forEach(b=>b.onclick=()=>{const sc=scenarios.find(s=>s.id===b.dataset.loadScenario); const next=clone(sc.patient); next.id=uid(sc.id); state.patients.push(next); state.activeId=next.id; state.tab='summary'; persist(); render();});
  document.getElementById('create-patient')?.addEventListener('click',()=>{const first=val('np-first'), last=val('np-last'), diagnosis=val('np-diagnosis'); if(!first||!last||!diagnosis)return toast('First, last, and diagnosis required'); const pNew=patientTemplate({id:uid('patient'),scenarioId:'scratch',firstName:first,lastName:last,age:val('np-age'),sex:val('np-sex'),dob:val('np-dob'),mrn:val('np-mrn')||randomMrn(),location:val('np-location'),diagnosis,acuity:val('np-acuity'),allergies:val('np-allergies')||'NKDA',codeStatus:val('np-code')||'Full Code',tags:(val('np-tags')||'HCT').split(',').map(t=>t.trim()).filter(Boolean),chiefComplaint:val('np-cc')||diagnosis,hpi:val('np-hpi'),background:val('np-bg')}); state.patients.push(pNew); state.activeId=pNew.id; state.tab='summary'; persist(); render();});
  document.getElementById('refresh-dashboard')?.addEventListener('click',fetchDashboard);
  document.getElementById('export-dashboard')?.addEventListener('click',exportDashboardCsv);
  document.querySelectorAll('[data-view-attempt]').forEach(b=>b.onclick=()=>{dashboardSelectedId=b.dataset.viewAttempt; render();});
  document.querySelectorAll('[data-save-review]').forEach(b=>b.onclick=()=>saveReview(b.dataset.saveReview));
}

function exportDashboardCsv(){
  const header = ['student_name','student_id','section','scenario_name','patient_name','status','updated_at','review_score'];
  const csv = [header.join(','), ...dashboardRows.map(r => header.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'hct-ehr-submissions.csv'; a.click(); URL.revokeObjectURL(url);
}

render();
initSupabase();
