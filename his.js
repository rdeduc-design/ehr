(function(){
  const HIS_KEY = 'hct_his_v1';
  const TABS = [
    ['command','CC','Command center','Hospital operations overview'],
    ['patients','PT','Patients','Ward census and patient live charts'],
    ['orders','DO',"Doctor's orders",'Faculty provider orders and nursing action'],
    ['meds','MR','Patient medications','Student requests, dispense, and administration'],
    ['pharmacy','RX','Pharmacy','Faculty dispensing and medication stock'],
    ['notifications','NF','Notifications','Latest live updates and department messages'],
    ['labs','LI','Labs and imaging','Diagnostics queue and resulted work'],
    ['supplies','CS','Central supplies','Inventory and restock requests']
  ];
  const LIVE_CHANNEL = 'hct-live-care-board-v1';
  const LOCK_TTL = 120000;

  const DEFAULT_INV = {
    pharmacy: window.HctMedicationInventory ? window.HctMedicationInventory.items.map(window.HctMedicationInventory.toLegacy) : [
      ['Normal saline 1 L', 42, 18, 'IV fluids', 'normal saline ns sodium chloride'],
      ['Lactated Ringers 1 L', 35, 14, 'IV fluids', 'lactated ringers lr'],
      ['Ondansetron 4 mg vial', 26, 10, 'Antiemetic', 'ondansetron zofran'],
      ['Oxytocin 30 units bag', 18, 8, 'OB emergency', 'oxytocin pitocin'],
      ['Albuterol nebules', 44, 20, 'Respiratory', 'albuterol salbutamol nebulizer nebule'],
      ['Regular insulin vial', 16, 8, 'Endocrine', 'regular insulin insulin infusion'],
      ['Ceftriaxone 1 g vial', 22, 8, 'Antibiotic', 'ceftriaxone rocephin'],
      ['Azithromycin 500 mg vial', 18, 8, 'Antibiotic', 'azithromycin'],
      ['Haloperidol 5 mg ampule', 14, 6, 'Psychiatry', 'haloperidol haldol'],
      ['Amlodipine 5 mg tablet', 80, 30, 'Cardiac', 'amlodipine'],
      ['Captopril 25 mg tablet', 45, 16, 'Cardiac', 'captopril'],
      ['Dexamethasone 4 mg tablet', 32, 12, 'Respiratory', 'dexamethasone']
    ],
    supplies: [
      ['IV start kit', 72, 30, 'Vascular access'],
      ['Blood draw tube set', 88, 35, 'Laboratory'],
      ['Foley catheter kit', 22, 10, 'GU'],
      ['Sterile dressing tray', 34, 15, 'Wound care'],
      ['OB hemorrhage cart pack', 10, 6, 'Emergency'],
      ['Isolation PPE bundle', 48, 20, 'Infection control']
    ]
  };

  let activeTab = 'command';
  let search = '';
  let open = false;
  let liveSection = 'overview';
  let livePatientId = '';
  let wardFilter = 'All wards';
  let liveChannel = null;
  let bc = null;
  const clientId = localStorage.getItem('hct_his_client_id') || `acct_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('hct_his_client_id', clientId);

  function escHtml(v){
    if(typeof esc === 'function') return esc(v);
    return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function toastMsg(msg){
    if(typeof toast === 'function') toast(msg);
    else console.log(msg);
  }

  function getPatients(){
    try {
      if(typeof state !== 'undefined' && Array.isArray(state.patients)) return state.patients;
      const saved = JSON.parse(localStorage.getItem('hct_ehr_v2') || 'null');
      return Array.isArray(saved?.patients) ? saved.patients : [];
    } catch(e) {
      return [];
    }
  }

  function getScenarioPatients(){
    try {
      if(Array.isArray(scenarios)) return scenarios.map(s => s.patient).filter(Boolean);
    } catch(e) {}
    return [];
  }

  function patientKey(p){
    return p?.scenarioId || p?.id || '';
  }

  function wardOf(p){
    const live = his?.live?.patients?.[patientKey(p)] || {};
    const explicit = live.ward || p?.ward || p?.specialty || '';
    const loc = p?.location || '';
    if(explicit && !/ed \/|medical \/|hct/i.test(explicit)) return explicit;
    if(/icu|resus|critical/i.test(loc)) return 'ICU';
    if(/ob|gyn|ldr|postpartum|labor/i.test(loc)) return 'OB-GYN';
    if(/peds|pediatric/i.test(loc)) return 'Pediatrics';
    if(/psych|mental/i.test(loc)) return 'Psychiatry';
    if(/surg|ortho|op|recovery/i.test(loc)) return 'Surgical';
    if(/ed|emergency/i.test(loc)) return 'Emergency';
    if(/neuro/i.test(loc)) return 'Neurology';
    return 'Medical';
  }

  function allLivePatients(){
    const map = new Map();
    const removed = new Set(Object.keys(his?.live?.removedPatients || {}));
    [...getScenarioPatients(), ...getPatients(), ...Object.values(his?.live?.addedPatients || {})].forEach(p => {
      const key = patientKey(p);
      if(key && !removed.has(key) && !map.has(key)) map.set(key, p);
    });
    return [...map.values()];
  }

  function accountName(){
    try {
      const profile = typeof cloud !== 'undefined' ? cloud.profile : null;
      const session = typeof cloud !== 'undefined' ? cloud.session : null;
      return profile?.full_name || profile?.email || session?.user?.email || localStorage.getItem('hct_his_account_name') || 'Care team member';
    } catch(e) {
      return localStorage.getItem('hct_his_account_name') || 'Care team member';
    }
  }

  function accountRole(){
    try {
      return (typeof cloud !== 'undefined' && cloud.profile?.role) || 'student';
    } catch(e) {
      return 'student';
    }
  }

  function loadHis(){
    try {
      const saved = JSON.parse(localStorage.getItem(HIS_KEY) || 'null');
      if(saved && saved.inventory) return saved;
    } catch(e) {}
    return {
      inventory: {
        pharmacy: DEFAULT_INV.pharmacy.map(([name,onHand,par,category,aliases], i) => ({id:'rx-'+i,name,onHand,par,category,aliases,requested:0})),
        supplies: DEFAULT_INV.supplies.map(([name,onHand,par,category], i) => ({id:'cs-'+i,name,onHand,par,category,requested:0}))
      },
      labStatus: {},
      medStatus: {},
      supplyRequests: [],
      live: {patients:{}, locks:{}, events:[], notifications:[], addedPatients:{}, removedPatients:{}}
    };
  }

  let his = loadHis();
  his.live = normalizeLive(his.live);
  normalizeInventory();

  function saveHis(){
    his.live = normalizeLive(his.live);
    normalizeInventory();
    localStorage.setItem(HIS_KEY, JSON.stringify(his));
  }

  function normalizeInventory(){
    his.inventory = his.inventory || {};
    his.inventory.pharmacy = Array.isArray(his.inventory.pharmacy) ? his.inventory.pharmacy : [];
    DEFAULT_INV.pharmacy.forEach(([name,onHand,par,category,aliases,handbook], i) => {
      const id = handbook?.id || `rx-${i}`;
      const existing = his.inventory.pharmacy.find(x => x.id === id || x.name === name);
      if(existing){
        existing.id = existing.id || id;
        existing.category = existing.category || category;
        existing.par = Number(existing.par ?? par);
        existing.onHand = Number(existing.onHand ?? onHand);
        existing.aliases = existing.aliases || aliases || name;
        if(handbook) {
          existing.brand = handbook.brand;
          existing.generic = handbook.generic;
          existing.doses = handbook.doses;
          existing.availability = handbook.availability;
          existing.handbook = handbook;
        }
        existing.requested = Number(existing.requested || 0);
      } else {
        his.inventory.pharmacy.push({id,name,onHand,par,category,aliases,brand:handbook?.brand || '',generic:handbook?.generic || '',doses:handbook?.doses || [],availability:handbook?.availability || '',handbook,requested:0});
      }
    });
  }

  function normalizeLive(live){
    const base = live && typeof live === 'object' ? live : {};
    base.patients = base.patients && typeof base.patients === 'object' ? base.patients : {};
    base.locks = base.locks && typeof base.locks === 'object' ? base.locks : {};
    base.events = Array.isArray(base.events) ? base.events.slice(-60) : [];
    base.notifications = Array.isArray(base.notifications) ? base.notifications.slice(-80) : [];
    base.addedPatients = base.addedPatients && typeof base.addedPatients === 'object' ? base.addedPatients : {};
    base.removedPatients = base.removedPatients && typeof base.removedPatients === 'object' ? base.removedPatients : {};
    allLivePatients().forEach(p => {
      const key = patientKey(p);
      if(!key) return;
      const current = base.patients[key] || {};
      base.patients[key] = {
        attendingNurse: current.attendingNurse || '',
        attendingProvider: current.attendingProvider || p.attending || 'Simulation provider',
        ward: current.ward || wardOf(p),
        room: current.room || p.location || '',
        photo: current.photo || '',
        status: current.status || p.acuity || 'Stable',
        note: current.note || '',
        vitals: Array.isArray(current.vitals) ? current.vitals : [],
        notes: Array.isArray(current.notes) ? current.notes : [],
        orders: Array.isArray(current.orders) ? current.orders : [],
        medRequests: Array.isArray(current.medRequests) ? current.medRequests : []
      };
    });
    Object.keys(base.locks).forEach(k => {
      if(!base.locks[k] || Date.now() - Number(base.locks[k].time || 0) > LOCK_TTL) delete base.locks[k];
    });
    return base;
  }

  function liveFor(patientId){
    his.live = normalizeLive(his.live);
    return his.live.patients[patientId] || (his.live.patients[patientId] = {attendingNurse:'',attendingProvider:'Simulation provider',ward:'Medical',room:'',photo:'',status:'Stable',note:'',vitals:[],notes:[],orders:[],medRequests:[]});
  }

  function eventLog(text, patientId, dept='HIS'){
    const p = allLivePatients().find(x => patientKey(x) === patientId);
    const entry = {time:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), stamp:new Date().toISOString(), dept, text, patient: p ? `${p.lastName}, ${p.firstName}` : ''};
    his.live.events.unshift(entry);
    his.live.events = his.live.events.slice(0, 60);
    his.live.notifications.unshift(entry);
    his.live.notifications = his.live.notifications.slice(0, 80);
  }

  function publishLive(type, payload={}){
    const msg = {type, payload, clientId, name: accountName(), role: accountRole(), time: Date.now()};
    try { bc?.postMessage(msg); } catch(e) {}
    try { liveChannel?.send({type:'broadcast', event:'live', payload:msg}); } catch(e) {}
  }

  function applyLiveMessage(msg){
    if(!msg || msg.clientId === clientId) return;
    his.live = normalizeLive(his.live);
    if(msg.type === 'snapshot-request'){
      publishLive('snapshot', {live:his.live});
      return;
    }
    if(msg.type === 'snapshot' && msg.payload?.live){
      his.live = normalizeLive(msg.payload.live);
    }
    if(msg.type === 'patient-update' && msg.payload?.patientId){
      his.live.patients[msg.payload.patientId] = {
        ...liveFor(msg.payload.patientId),
        ...msg.payload.patch
      };
    }
    if(msg.type === 'lock' && msg.payload?.key){
      his.live.locks[msg.payload.key] = msg.payload.lock;
    }
    if(msg.type === 'unlock' && msg.payload?.key){
      delete his.live.locks[msg.payload.key];
    }
    if(msg.type === 'event' && msg.payload?.event){
      his.live.events.unshift(msg.payload.event);
      his.live.events = his.live.events.slice(0, 60);
    }
    saveHis();
    if(open && activeTab === 'live') renderHis();
  }

  function installLiveSync(){
    if(!bc){
      try {
        bc = new BroadcastChannel(LIVE_CHANNEL);
        bc.onmessage = e => applyLiveMessage(e.data);
      } catch(e) {}
    }
    try {
      if(typeof cloud !== 'undefined' && cloud.client?.channel && !liveChannel){
        liveChannel = cloud.client.channel(LIVE_CHANNEL, {config:{broadcast:{ack:true}}});
        liveChannel.on('broadcast', {event:'live'}, e => applyLiveMessage(e.payload));
        liveChannel.subscribe(status => {
          if(status === 'SUBSCRIBED'){
            publishLive('snapshot-request', {});
            setTimeout(() => publishLive('snapshot', {live:his.live}), 300);
          }
        });
      }
    } catch(e) {}
  }

  function acuityClass(p){
    const a = String(p.acuity || '').toLowerCase();
    if(a.includes('critical')) return 'red';
    if(a.includes('urgent') || a.includes('watcher')) return 'gold';
    return 'green';
  }

  function patientText(p){
    return `${p.lastName || ''} ${p.firstName || ''} ${p.mrn || ''} ${p.diagnosis || ''} ${p.location || ''} ${p.specialty || ''}`.toLowerCase();
  }

  function filteredPatients(){
    const q = search.trim().toLowerCase();
    return getPatients().filter(p => !q || patientText(p).includes(q));
  }

  function labsAndImaging(){
    const rows = [];
    getPatients().forEach(p => {
      (p.labs || []).forEach((lab, idx) => {
        rows.push({
          id: `${p.id}-lab-${idx}`,
          patientId: p.id,
          patient: `${p.lastName}, ${p.firstName}`,
          location: p.location || '',
          type: /xray|x-ray|ct|mri|ultrasound|ecg|ekg|cxr/i.test(`${lab.test} ${lab.note}`) ? 'Imaging' : 'Lab',
          name: lab.test || 'Diagnostic test',
          result: lab.result || 'Pending',
          flag: lab.flag || 'Pending',
          time: lab.time || '',
          note: lab.note || ''
        });
      });
      (p.scenarioId === 'scratch' ? (p.orders || []) : []).filter(o => /lab|cbc|bmp|cmp|culture|xray|x-ray|ct|mri|ultrasound|ecg|ekg|diagnostic|imaging|lactate|fibrinogen/i.test(`${o.category} ${o.order}`)).forEach((order, idx) => {
        rows.push({
          id: `${p.id}-order-${idx}`,
          patientId: p.id,
          patient: `${p.lastName}, ${p.firstName}`,
          location: p.location || '',
          type: /xray|x-ray|ct|mri|ultrasound|ecg|ekg|diagnostic|imaging/i.test(`${order.category} ${order.order}`) ? 'Imaging' : 'Lab',
          name: order.order || 'Diagnostic order',
          result: his.labStatus[`${p.id}-order-${idx}`] || order.status || 'Ordered',
          flag: /stat|critical/i.test(`${order.status} ${order.details}`) ? 'STAT' : 'Routine',
          time: '',
          note: order.details || ''
        });
      });
    });
    return rows;
  }

  function medQueue(){
    const rows = [];
    getPatients().forEach(p => {
      (p.meds || []).forEach((m, idx) => rows.push({
        id: `${p.id}-med-${idx}`,
        patientId: p.id,
        patient: `${p.lastName}, ${p.firstName}`,
        location: p.location || '',
        med: m.name || 'Medication',
        dose: m.dose || '',
        route: m.route || '',
        status: his.medStatus[`${p.id}-med-${idx}`] || m.status || 'pending',
        note: m.warn || m.note || ''
      }));
    });
    return rows;
  }

  function metrics(){
    const pts = getPatients();
    const labs = labsAndImaging();
    const meds = medQueue();
    return {
      census: pts.length,
      critical: pts.filter(p => acuityClass(p) === 'red').length,
      diagnostics: labs.filter(l => !/resulted|complete|normal|high|low|critical/i.test(l.result)).length,
      medPending: meds.filter(m => !/verified|dispensed|given|hold|not_given/i.test(m.status)).length,
      rxLow: his.inventory.pharmacy.filter(i => i.onHand <= i.par).length,
      csLow: his.inventory.supplies.filter(i => i.onHand <= i.par).length
    };
  }

  function status(label, cls){
    return `<span class="his-status ${cls || ''}">${escHtml(label)}</span>`;
  }

  function card(title, body, right=''){
    return `<section class="his-card"><div class="his-card-head"><h3>${escHtml(title)}</h3>${right}</div><div class="his-card-body">${body}</div></section>`;
  }

  function metricCard(label, value, detail, cls=''){
    return `<section class="his-card his-metric"><div class="his-card-body"><strong>${escHtml(value)}</strong><span>${escHtml(label)}</span><small>${escHtml(detail || '')}</small></div></section>`;
  }

  function patientName(p){
    return `${p?.lastName || ''}, ${p?.firstName || ''}`.replace(/^, /, '').trim() || 'Patient';
  }

  function latestVitals(p){
    const live = liveFor(patientKey(p));
    return [...(p.vitals || []), ...live.vitals].filter(Boolean).slice(-1)[0] || {};
  }

  function patientPhoto(p){
    const live = liveFor(patientKey(p));
    if(live.photo) return `<img class="his-avatar" src="${escHtml(live.photo)}" alt="">`;
    const initials = `${p?.firstName?.[0] || ''}${p?.lastName?.[0] || ''}`.toUpperCase() || 'PT';
    return `<span class="his-avatar his-avatar-fallback">${escHtml(initials)}</span>`;
  }

  function findInventoryItem(text, id=''){
    normalizeInventory();
    if(id) return his.inventory.pharmacy.find(i => i.id === id);
    const hay = String(text || '').toLowerCase();
    return his.inventory.pharmacy.find(i => {
      const name = String(i.name || '').toLowerCase();
      const aliases = String(i.aliases || '').toLowerCase();
      return hay.includes(name.split(/\s+\d/)[0]) || aliases.split(/\s+/).some(a => a.length > 3 && hay.includes(a));
    });
  }

  function drugMeta(itemOrText){
    const handbook = window.HctMedicationInventory;
    if(!handbook) return typeof itemOrText === 'object' ? itemOrText?.handbook : null;
    if(typeof itemOrText === 'object') return itemOrText.handbook || handbook.find(itemOrText.id) || handbook.find(itemOrText.name);
    return handbook.find(itemOrText);
  }

  function drugButton(itemOrText){
    const meta = drugMeta(itemOrText);
    return meta ? `<button class="drug-info-btn" data-med-info="${escHtml(meta.id)}" title="Open drug reference sidebar">Reference</button>` : '';
  }

  function doseSelect(item, id, selected=''){
    const meta = drugMeta(item);
    if(!meta) return `<input id="${id}" placeholder="Dose / route / instruction">`;
    return `<select id="${id}" class="drug-dose-select">${window.HctMedicationInventory.doseOptions(meta, selected)}</select>`;
  }

  function depleteStockForMed(req){
    const item = findInventoryItem(req.med, req.itemId);
    if(!item) return false;
    const qty = Math.max(1, Number(req.qty || 1));
    item.onHand = Math.max(0, Number(item.onHand || 0) - qty);
    return true;
  }

  function allMedRequests(){
    const rows = [];
    allLivePatients().forEach(p => {
      const id = patientKey(p);
      liveFor(id).medRequests.forEach(req => rows.push({...req, patientId:id, patient:patientName(p), location:liveFor(id).room || p.location || '', ward:liveFor(id).ward || wardOf(p)}));
    });
    return rows.sort((a,b) => String(b.time || '').localeCompare(String(a.time || '')));
  }

  function medStatusClass(statusText){
    const s = String(statusText || '').toLowerCase();
    if(s.includes('requested')) return 'gold';
    if(s.includes('dispensed') || s.includes('given')) return 'green';
    if(s.includes('hold') || s.includes('cancel')) return 'red';
    return 'blue';
  }

  function renderCommand(){
    const pts = allLivePatients();
    const medReqs = allMedRequests();
    const m = {
      census: pts.length,
      critical: pts.filter(p => /critical/i.test(liveFor(patientKey(p)).status || p.acuity)).length,
      stable: pts.filter(p => /stable/i.test(liveFor(patientKey(p)).status || p.acuity)).length,
      admitted: pts.filter(p => !/critical/i.test(liveFor(patientKey(p)).status || p.acuity)).length,
      rxLow: his.inventory.pharmacy.filter(i => i.onHand <= i.par).length,
      activeOrders: pts.reduce((sum,p) => sum + (p.orders || []).length + liveFor(patientKey(p)).orders.length + liveFor(patientKey(p)).medRequests.filter(r => !/given|cancel/i.test(r.status)).length, 0)
    };
    const alerts = [
      ...pts.filter(p => /critical/i.test(liveFor(patientKey(p)).status || p.acuity)).map(p => ({title:`Critical patient: ${p.lastName}, ${p.firstName}`, body:`${liveFor(patientKey(p)).room || p.location || 'No location'} - ${p.diagnosis || 'No diagnosis'}`, tab:'patients'})),
      ...labsAndImaging().filter(l => /stat|critical/i.test(`${l.flag} ${l.result}`)).slice(0,4).map(l => ({title:`Diagnostic priority: ${l.name}`, body:`${l.patient} - ${l.flag} ${l.result}`, tab:'labs'})),
      ...his.inventory.pharmacy.filter(i => i.onHand <= i.par).slice(0,3).map(i => ({title:`Low pharmacy stock: ${i.name}`, body:`${i.onHand} on hand, par ${i.par}`, tab:'pharmacy'})),
      ...medReqs.filter(r => /requested/i.test(r.status)).slice(0,4).map(r => ({title:`Medication awaiting pharmacy: ${r.med}`, body:`${r.patient} - ${r.ward}`, tab:'pharmacy'}))
    ];
    const alertRows = alerts.map(a => `<div class="his-row"><div><strong>${escHtml(a.title)}</strong><span>${escHtml(a.body)}</span></div><button class="btn small" data-his-tab="${a.tab}">Open</button></div>`).join('');
    const feed = his.live.notifications.slice(0,7).map(n => `<div class="his-row"><div><strong>${escHtml(n.dept || 'HIS')} - ${escHtml(n.time || '')}</strong><span>${escHtml(n.text || '')}</span><small>${escHtml(n.patient || '')}</small></div></div>`).join('');
    return `<div class="his-grid">
      ${metricCard('Current census', m.census, 'Active EHR workspaces')}
      ${metricCard('Critical acuity', m.critical, 'Needs command awareness')}
      ${metricCard('Stable', m.stable, 'Recovery / routine monitoring')}
      ${metricCard('Admitted', m.admitted, 'Under observation')}
      ${metricCard('Low stock', m.rxLow, 'Medication items below par')}
      ${metricCard('Active orders', m.activeOrders, 'Awaiting action')}
    </div>
    <div class="his-grid two" style="margin-top:12px;">
      ${card('Command priorities', `<div class="his-list">${alertRows || '<p class="his-empty">No command center alerts right now.</p>'}</div>`)}
      ${card('Ward activity', `<div class="his-list">${feed || '<p class="his-empty">No live activity yet.</p>'}</div>`, '<button class="btn small" data-his-tab="notifications">View all</button>')}
    </div>`;
  }

  function renderPatients(){
    const pts = allLivePatients().filter(p => {
      const q = search.trim().toLowerCase();
      const ward = liveFor(patientKey(p)).ward || wardOf(p);
      return (!q || patientText(p).includes(q)) && (wardFilter === 'All wards' || ward === wardFilter);
    });
    const wards = ['All wards', ...new Set(allLivePatients().map(p => liveFor(patientKey(p)).ward || wardOf(p)))];
    const isFaculty = accountRole() === 'instructor';
    const rows = pts.map(p => {
      const id = patientKey(p);
      const live = liveFor(id);
      const v = latestVitals(p);
      return `<tr>
        <td><div class="his-patient-cell">${patientPhoto(p)}<div><strong>${escHtml(patientName(p))}</strong><small>${escHtml(p.age || '--')} y/o - ${escHtml(p.sex || '--')} - ${escHtml(p.allergies || 'Allergy unknown')}</small></div></div></td>
        <td>${escHtml(p.mrn || '')}</td>
        <td>${escHtml(p.diagnosis || 'No diagnosis')}</td>
        <td>${escHtml(live.ward || wardOf(p))} - ${escHtml(live.room || p.location || '')}</td>
        <td>${escHtml(live.attendingNurse || 'Unassigned')}</td>
        <td>HR ${escHtml(v.hr || '--')} - ${escHtml(v.bps || '--')}/${escHtml(v.bpd || '--')} - SpO2 ${escHtml(v.spo2 || '--')}%</td>
        <td>${status(live.status || p.acuity || 'Stable', acuityClass({...p, acuity:live.status || p.acuity}))}</td>
        <td class="his-actions"><button class="btn small primary" data-his-select-patient="${escHtml(id)}">Open</button>${isFaculty ? `<button class="btn small danger" data-his-delete-patient="${escHtml(id)}">Delete</button>` : ''}</td>
      </tr>`;
    }).join('');
    const facultyTools = isFaculty ? card('Faculty patient management', `<div class="his-live-controls">
      <input id="his-new-first" placeholder="First name"><input id="his-new-last" placeholder="Last name"><input id="his-new-mrn" placeholder="MRN"><input id="his-new-dx" placeholder="Diagnosis">
      <select id="his-new-ward"><option>Medical</option><option>ICU</option><option>Emergency</option><option>OB-GYN</option><option>Pediatrics</option><option>Surgical</option><option>Psychiatry</option><option>Neurology</option></select>
      <input id="his-new-room" placeholder="Room"><select id="his-new-status"><option>Stable</option><option>Admitted</option><option>Urgent</option><option>Critical</option></select><button class="btn primary" id="his-add-patient">Add patient</button>
    </div>`) : '';
    return `${card('Patient census', `<div class="his-census-tools"><select id="his-ward-filter">${wards.map(w => `<option ${w === wardFilter ? 'selected' : ''}>${escHtml(w)}</option>`).join('')}</select><span>${pts.length} of ${allLivePatients().length} patients</span></div><div class="table-wrap"><table class="his-table his-census"><thead><tr><th>Patient</th><th>MRN</th><th>Diagnosis</th><th>Ward / room</th><th>Attending nurse</th><th>Vitals</th><th>Status</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="8">No matching patients.</td></tr>'}</tbody></table></div>`)}${facultyTools}`;
  }

  function lockKey(patientId, section){
    return `${patientId}:${section}`;
  }

  function activeLock(patientId, section){
    his.live = normalizeLive(his.live);
    const lock = his.live.locks[lockKey(patientId, section)];
    if(!lock || Date.now() - Number(lock.time || 0) > LOCK_TTL) return null;
    return lock;
  }

  function ownLock(patientId, section){
    const lock = activeLock(patientId, section);
    return lock && lock.clientId === clientId;
  }

  function openLiveSection(patientId, section){
    livePatientId = patientId;
    liveSection = section;
    const key = lockKey(patientId, section);
    const lock = {clientId, by:accountName(), role:accountRole(), section, time:Date.now()};
    his.live.locks[key] = lock;
    saveHis();
    publishLive('lock', {key, lock});
    renderHis();
  }

  function liveOrderRows(patientId){
    const p = allLivePatients().find(x => patientKey(x) === patientId) || {};
    const live = liveFor(patientId);
    const sourceOrders = (p.orders || []).map((o, idx) => ({...o, source:'Scenario', idx}));
    const liveOrders = live.orders.map((o, idx) => ({...o, source:'Live doctor', idx}));
    const rows = [...liveOrders, ...sourceOrders].map(o => `<tr>
      <td><strong>${escHtml(o.order || 'Order')}</strong><br><small>${escHtml(o.details || '')}</small></td>
      <td>${escHtml(o.category || 'Order')}</td>
      <td>${status(o.status || 'Active', /stat|critical/i.test(o.status) ? 'red' : /complete|done/i.test(o.status) ? 'green' : 'gold')}</td>
      <td>${escHtml(o.by || o.source || '')}</td>
    </tr>`).join('');
    return `<div class="table-wrap"><table class="his-table"><thead><tr><th>Order</th><th>Category</th><th>Status</th><th>Source</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No orders yet.</td></tr>'}</tbody></table></div>`;
  }

  function renderOrders(){
    const p = allLivePatients().find(x => patientKey(x) === livePatientId) || allLivePatients()[0];
    if(p) livePatientId = patientKey(p);
    const isFaculty = accountRole() === 'instructor';
    const selector = patientSelector('orders');
    const live = liveFor(livePatientId);
    const controls = card('Live patient controls', `<div class="his-live-controls">
      ${selector}
      <input id="live-nurse" placeholder="Attending nurse" value="${escHtml(live.attendingNurse || '')}">
      <select id="live-status"><option ${live.status === 'Stable' ? 'selected' : ''}>Stable</option><option ${live.status === 'Admitted' ? 'selected' : ''}>Admitted</option><option ${live.status === 'Urgent' ? 'selected' : ''}>Urgent</option><option ${live.status === 'Critical' ? 'selected' : ''}>Critical</option></select>
      <input id="live-note" placeholder="Shared handoff note" value="${escHtml(live.note || '')}">
      <input id="his-photo" type="file" accept="image/*">
    </div>`);
    const faculty = isFaculty ? card('Faculty as doctor', `<div class="his-live-controls">
      <input id="live-order-name" placeholder="New doctor order"><input id="live-order-details" placeholder="Details / parameters"><select id="live-order-status"><option>STAT</option><option selected>Active</option><option>PRN</option><option>Complete</option></select><button class="btn primary" id="live-add-order">Add live order</button>
    </div>`) : card('Doctor orders', '<p class="his-empty">Faculty accounts act as the doctor and can add live orders.</p>');
    return `${controls}<div class="his-grid two" style="margin-top:12px;">${card("Doctor's orders", liveOrderRows(livePatientId))}${faculty}</div>${card('Live note', `<div class="his-live-controls"><input id="live-note-body" placeholder="Team update, handoff, concern, or action taken"><button class="btn primary" id="live-add-note">Post note</button></div>`)}`;
  }

  function patientSelector(targetTab){
    const pts = allLivePatients();
    if(!livePatientId && pts[0]) livePatientId = patientKey(pts[0]);
    return `<select id="live-patient-select" data-target-tab="${escHtml(targetTab || activeTab)}">${pts.map(p => {
      const id = patientKey(p);
      return `<option value="${escHtml(id)}" ${id === livePatientId ? 'selected' : ''}>${escHtml(patientName(p))} - ${escHtml(liveFor(id).ward || wardOf(p))}</option>`;
    }).join('')}</select>`;
  }

  function liveVitalsRows(patientId){
    const p = allLivePatients().find(x => patientKey(x) === patientId) || {};
    const live = liveFor(patientId);
    const rows = [...live.vitals, ...(p.vitals || [])].slice(-10).reverse().map(v => `<tr>
      <td>${escHtml(v.time || '')}</td><td>${escHtml(v.hr || '')}</td><td>${escHtml(v.bps || '')}/${escHtml(v.bpd || '')}</td>
      <td>${escHtml(v.rr || '')}</td><td>${escHtml(v.temp || '')}</td><td>${escHtml(v.spo2 || '')}</td><td>${escHtml(v.by || '')}</td>
    </tr>`).join('');
    return `<div class="table-wrap"><table class="his-table"><thead><tr><th>Time</th><th>HR</th><th>BP</th><th>RR</th><th>Temp</th><th>SpO2</th><th>By</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No vitals charted.</td></tr>'}</tbody></table></div>`;
  }

  function liveNotesRows(patientId){
    const p = allLivePatients().find(x => patientKey(x) === patientId) || {};
    const live = liveFor(patientId);
    const notes = [...live.notes, ...(p.notes || [])].slice(-8).reverse().map(n => `<div class="his-row">
      <div><strong>${escHtml(n.type || 'Live note')} - ${escHtml(n.time || '')}</strong><span>${escHtml(n.body || '')}</span><small>${escHtml(n.by || '')}</small></div>
    </div>`).join('');
    return `<div class="his-list">${notes || '<p class="his-empty">No live notes yet.</p>'}</div>`;
  }

  function renderPatientMeds(){
    const p = allLivePatients().find(x => patientKey(x) === livePatientId) || allLivePatients()[0];
    if(p) livePatientId = patientKey(p);
    const live = liveFor(livePatientId);
    const selectedItem = his.inventory.pharmacy[0];
    const inventoryOptions = his.inventory.pharmacy.map(i => `<option value="${escHtml(i.id)}">${escHtml(i.name)} (${escHtml(i.onHand)} on hand)</option>`).join('');
    const requests = live.medRequests.map(r => `<tr>
      <td><strong>${escHtml(r.med)}</strong> ${drugButton(r.itemId || r.med)}<br><small>${escHtml(r.dose || '')} ${escHtml(r.route || '')} - qty ${escHtml(r.qty || 1)}</small></td>
      <td>${status(r.status || 'Requested', medStatusClass(r.status))}</td>
      <td>${escHtml(r.requestedBy || '')}<br><small>${escHtml(r.time || '')}</small></td>
      <td>${escHtml(r.dispensedBy || '')}<br><small>${escHtml(r.dispensedAt || '')}</small></td>
      <td class="his-actions">
        ${/dispensed/i.test(r.status || '') ? `<button class="btn small primary" data-his-give-med="${escHtml(r.id)}">Mark given</button>` : ''}
        ${/requested/i.test(r.status || '') ? `<button class="btn small danger" data-his-cancel-med="${escHtml(r.id)}">Cancel</button>` : ''}
      </td>
    </tr>`).join('');
    const currentMeds = (p.meds || []).map((m, idx) => `<tr>
      <td><strong>${escHtml(m.name || 'Medication')}</strong> ${drugButton(m.name)}<br><small>${escHtml(m.dose || '')} ${escHtml(m.route || '')} ${escHtml(m.freq || '')}</small></td>
      <td>${status(m.status || 'pending', medStatusClass(m.status))}</td>
      <td>${escHtml(m.warn || m.note || '')}</td>
      <td><button class="btn small" data-his-order-existing="${idx}">Request from pharmacy</button></td>
    </tr>`).join('');
    return `${card('Patient medication workspace', `<div class="his-live-controls">${patientSelector('meds')}<select id="his-med-item">${inventoryOptions}</select>${doseSelect(selectedItem, 'his-med-dose')}<input id="his-med-qty" type="number" min="1" max="${escHtml(selectedItem?.onHand || 1)}" value="1"><button class="btn primary" id="his-request-med">Request medication</button></div>`)}
      <div class="his-grid two" style="margin-top:12px;">
        ${card('Pharmacy requests', `<div class="table-wrap"><table class="his-table"><thead><tr><th>Medication</th><th>Status</th><th>Requested</th><th>Dispensed</th><th></th></tr></thead><tbody>${requests || '<tr><td colspan="5">No medication requests yet.</td></tr>'}</tbody></table></div>`)}
        ${card('Medication orders on chart', `<div class="table-wrap"><table class="his-table"><thead><tr><th>Medication</th><th>Status</th><th>Safety note</th><th></th></tr></thead><tbody>${currentMeds || '<tr><td colspan="4">No medication orders on this chart.</td></tr>'}</tbody></table></div>`)}
      </div>`;
  }

  function renderLiveDetail(patientId){
    const p = allLivePatients().find(x => patientKey(x) === patientId);
    if(!p) return '<p class="his-empty">Select a patient to start live charting.</p>';
    const live = liveFor(patientId);
    const sections = [
      ['overview','Overview'],
      ['vitals','Vitals'],
      ['orders','Orders'],
      ['notes','Notes']
    ];
    const lock = activeLock(patientId, liveSection);
    const lockedByOther = lock && lock.clientId !== clientId;
    const lockedClass = lockedByOther ? ' is-dimmed' : '';
    const lockText = lockedByOther ? `<span class="his-lock-note">Locked by ${escHtml(lock.by)} in ${escHtml(lock.section)}</span>` : '<span class="his-lock-note own">You are live in this section</span>';
    const body = liveSection === 'orders' ? liveOrderRows(patientId)
      : liveSection === 'vitals' ? liveVitalsRows(patientId)
      : liveSection === 'notes' ? liveNotesRows(patientId)
      : `<div class="his-grid two">
          ${card('Patient snapshot', `<div class="his-list">
            <div class="his-row"><div><strong>${escHtml(p.diagnosis || 'No diagnosis')}</strong><span>${escHtml(p.location || 'No location')} - MRN ${escHtml(p.mrn || '')}</span><small>${escHtml(p.chiefComplaint || '')}</small></div>${status(live.status, acuityClass({...p, acuity:live.status}))}</div>
            <div class="his-row"><div><strong>Attending nurse</strong><span>${escHtml(live.attendingNurse || 'Unassigned')}</span></div></div>
            <div class="his-row"><div><strong>Live note</strong><span>${escHtml(live.note || 'No shared note yet.')}</span></div></div>
          </div>`)}
          ${card('Activity feed', `<div class="his-list">${his.live.events.slice(0,8).map(e => `<div class="his-row"><div><strong>${escHtml(e.time)} ${escHtml(e.patient)}</strong><span>${escHtml(e.text)}</span></div></div>`).join('') || '<p class="his-empty">No live activity yet.</p>'}</div>`)}
        </div>`;
    return `<div class="his-live-detail${lockedClass}">
      <div class="his-live-title">
        <div><h3>${escHtml(p.lastName)}, ${escHtml(p.firstName)}</h3><p>${escHtml(p.location || '')} - ${escHtml(p.diagnosis || '')}</p></div>
        ${lockText}
      </div>
      <div class="his-live-tabs">${sections.map(s => `<button class="btn small ${liveSection === s[0] ? 'primary' : ''}" data-live-section="${s[0]}" data-live-patient="${escHtml(patientId)}">${s[1]}</button>`).join('')}</div>
      <div class="his-live-pane">${body}</div>
    </div>`;
  }

  function renderLive(){
    his.live = normalizeLive(his.live);
    const pts = allLivePatients().filter(p => !search || patientText(p).includes(search.toLowerCase()));
    if(!livePatientId || !pts.some(p => patientKey(p) === livePatientId)) livePatientId = patientKey(pts[0] || {});
    const role = accountRole();
    const isFaculty = role === 'instructor';
    const patientOptions = pts.map(p => {
      const id = patientKey(p);
      return `<option value="${escHtml(id)}" ${id === livePatientId ? 'selected' : ''}>${escHtml(p.lastName)}, ${escHtml(p.firstName)} - ${escHtml(p.location || '')}</option>`;
    }).join('');
    const roster = pts.map(p => {
      const id = patientKey(p);
      const live = liveFor(id);
      const locks = ['overview','vitals','orders','notes'].map(s => activeLock(id, s)).filter(l => l && l.clientId !== clientId);
      return `<div class="his-row ${id === livePatientId ? 'active' : ''}" data-live-pick="${escHtml(id)}">
        <div><strong>${escHtml(p.lastName)}, ${escHtml(p.firstName)}</strong><span>${escHtml(p.location || 'No location')} - ${escHtml(p.diagnosis || 'No diagnosis')}</span><small>Nurse: ${escHtml(live.attendingNurse || 'Unassigned')}${locks.length ? ` - Locked: ${locks.map(l => escHtml(l.section)).join(', ')}` : ''}</small></div>
        ${status(live.status || p.acuity || 'Stable', acuityClass({...p, acuity:live.status || p.acuity}))}
      </div>`;
    }).join('');
    const live = liveFor(livePatientId);
    return `<div class="his-live-layout">
      <aside class="his-live-roster">
        ${card('Live roster', `<div class="his-list">${roster || '<p class="his-empty">No patients found.</p>'}</div>`)}
      </aside>
      <section class="his-live-work">
        ${card('Shared patient controls', `<div class="his-live-controls">
          <select id="live-patient-select">${patientOptions}</select>
          <input id="live-nurse" placeholder="Attending nurse" value="${escHtml(live.attendingNurse || '')}">
          <select id="live-status"><option ${live.status === 'Stable' ? 'selected' : ''}>Stable</option><option ${live.status === 'Watcher' ? 'selected' : ''}>Watcher</option><option ${live.status === 'Urgent' ? 'selected' : ''}>Urgent</option><option ${live.status === 'Critical' ? 'selected' : ''}>Critical</option></select>
          <input id="live-note" placeholder="Shared handoff note" value="${escHtml(live.note || '')}">
          <button class="btn primary" id="live-save-controls">Update live board</button>
        </div>`)}
        ${renderLiveDetail(livePatientId)}
        <div class="his-grid two" style="margin-top:12px;">
          ${card('Chart live vitals', `<div class="his-live-controls">
            <input id="live-vt-time" type="time" value="${new Date().toTimeString().slice(0,5)}"><input id="live-vt-hr" placeholder="HR"><input id="live-vt-bps" placeholder="SBP"><input id="live-vt-bpd" placeholder="DBP"><input id="live-vt-rr" placeholder="RR"><input id="live-vt-temp" placeholder="Temp"><input id="live-vt-spo2" placeholder="SpO2"><button class="btn primary" id="live-add-vital">Add vitals</button>
          </div>`)}
          ${card(isFaculty ? 'Doctor live orders' : 'Doctor orders', isFaculty ? `<div class="his-live-controls">
            <input id="live-order-name" placeholder="New doctor order"><input id="live-order-details" placeholder="Details / parameters"><select id="live-order-status"><option>STAT</option><option selected>Active</option><option>PRN</option><option>Complete</option></select><button class="btn primary" id="live-add-order">Add live order</button>
          </div>` : '<p class="his-empty">Faculty accounts act as the doctor and can add live orders here.</p>')}
        </div>
        ${card('Live note', `<div class="his-live-controls"><input id="live-note-body" placeholder="Team update, handoff, concern, or action taken"><button class="btn primary" id="live-add-note">Post note</button></div>`)}
      </section>
    </div>`;
  }

  function renderLabs(){
    const q = search.trim().toLowerCase();
    const rows = labsAndImaging().filter(l => !q || `${l.patient} ${l.name} ${l.type} ${l.result}`.toLowerCase().includes(q)).map(l => {
      const cls = /critical|stat/i.test(`${l.flag} ${l.result}`) ? 'red' : /pending|ordered|active/i.test(l.result) ? 'gold' : 'green';
      return `<tr>
        <td><strong>${escHtml(l.patient)}</strong><br><small>${escHtml(l.location)}</small></td>
        <td>${escHtml(l.type)}</td>
        <td><strong>${escHtml(l.name)}</strong><br><small>${escHtml(l.note)}</small></td>
        <td>${status(l.flag || 'Routine', cls)}</td>
        <td>${escHtml(l.result)}</td>
        <td><button class="btn small" data-his-result="${escHtml(l.id)}">Mark resulted</button></td>
      </tr>`;
    }).join('');
    return card('Labs and imaging queue', `<div class="table-wrap"><table class="his-table"><thead><tr><th>Patient</th><th>Type</th><th>Order</th><th>Priority</th><th>Status/result</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="6">No diagnostic work found.</td></tr>'}</tbody></table></div>`);
  }

  function inventoryRows(type){
    return his.inventory[type].filter(i => !search || `${i.name} ${i.category}`.toLowerCase().includes(search.toLowerCase())).map(i => {
      const pct = Math.min(100, Math.round(i.onHand / Math.max(i.par * 2, 1) * 100));
      const low = i.onHand <= i.par;
      return `<tr>
        <td><strong>${escHtml(i.name)}</strong> ${drugButton(i)}<br><small>${escHtml(i.category)}${i.brand ? ` | Brand: ${escHtml(i.brand)}` : ''}${i.availability ? ` | ${escHtml(i.availability)}` : ''}</small><div class="his-bar"><span style="width:${pct}%;"></span></div></td>
        <td>${i.onHand}</td>
        <td>${i.par}</td>
        <td>${status(low ? 'Reorder' : 'Stocked', low ? 'gold' : 'green')}</td>
        <td class="his-actions">
          <button class="btn small" data-his-adjust="${type}:${i.id}:-1">Use</button>
          <button class="btn small" data-his-adjust="${type}:${i.id}:5">Restock</button>
          <button class="btn small primary" data-his-request="${type}:${i.id}">Request</button>
        </td>
      </tr>`;
    }).join('');
  }

  function renderPharmacy(){
    const isFaculty = accountRole() === 'instructor';
    const queue = allMedRequests().filter(m => !search || `${m.patient} ${m.med} ${m.status}`.toLowerCase().includes(search.toLowerCase())).map(m => `<div class="his-row">
      <div><strong>${escHtml(m.med)} ${escHtml(m.dose || '')}</strong> ${drugButton(m.itemId || m.med)}<span>${escHtml(m.patient)} - ${escHtml(m.ward)} - ${escHtml(m.location)} - qty ${escHtml(m.qty || 1)}</span><small>${escHtml(m.requestedBy || '')} requested ${escHtml(m.time || '')}</small></div>
      <div class="his-actions">${status(m.status, medStatusClass(m.status))}${isFaculty && /requested/i.test(m.status || '') ? `<button class="btn small primary" data-his-dispense="${escHtml(m.patientId)}:${escHtml(m.id)}">Dispense</button>` : ''}</div>
    </div>`).join('');
    return `<div class="his-grid two">
      ${card('Pharmacy dispensing queue', `<div class="his-list">${queue || '<p class="his-empty">No medication queue items.</p>'}</div>`)}
      ${card('Pharmacy inventory', `<div class="table-wrap"><table class="his-table"><thead><tr><th>Item</th><th>On hand</th><th>Par</th><th>Status</th><th></th></tr></thead><tbody>${inventoryRows('pharmacy')}</tbody></table></div>`)}
    </div>`;
  }

  function renderSupplies(){
    const reqs = his.supplyRequests.slice(-8).reverse().map(r => `<div class="his-row"><div><strong>${escHtml(r.item)}</strong><span>${escHtml(r.type)} request - ${escHtml(r.time)}</span></div>${status(r.status, 'gold')}</div>`).join('');
    return `<div class="his-grid two">
      ${card('Central supplies inventory', `<div class="table-wrap"><table class="his-table"><thead><tr><th>Item</th><th>On hand</th><th>Par</th><th>Status</th><th></th></tr></thead><tbody>${inventoryRows('supplies')}</tbody></table></div>`)}
      ${card('Restock requests', `<div class="his-list">${reqs || '<p class="his-empty">No restock requests yet.</p>'}</div>`)}
    </div>`;
  }

  function renderNotifications(){
    const notices = his.live.notifications.filter(n => !search || `${n.dept} ${n.patient} ${n.text}`.toLowerCase().includes(search.toLowerCase()));
    const rows = notices.map(n => `<div class="his-row">
      <div><strong>${escHtml(n.dept || 'HIS')} - ${escHtml(n.time || '')}</strong><span>${escHtml(n.text || '')}</span><small>${escHtml(n.patient || '')}</small></div>
      ${status(n.dept || 'Update', /stat|critical|doctor/i.test(`${n.dept} ${n.text}`) ? 'red' : /pharmacy|rx|med/i.test(`${n.dept} ${n.text}`) ? 'gold' : 'green')}
    </div>`).join('');
    return `${card('Department notifications', `<div class="his-list">${rows || '<p class="his-empty">No notifications yet.</p>'}</div>`)}
      ${card('Post department message', `<div class="his-live-controls"><select id="his-message-dept"><option>HIS</option><option>Pharmacy</option><option>Lab</option><option>Radiology</option><option>Admissions</option><option>Nursing Supervisor</option></select><input id="his-message-body" placeholder="Message or update"><button class="btn primary" id="his-post-message">Post message</button></div>`)}`;
  }

  function content(){
    if(activeTab === 'patients') return renderPatients();
    if(activeTab === 'orders') return renderOrders();
    if(activeTab === 'meds') return renderPatientMeds();
    if(activeTab === 'labs') return renderLabs();
    if(activeTab === 'pharmacy') return renderPharmacy();
    if(activeTab === 'notifications') return renderNotifications();
    if(activeTab === 'supplies') return renderSupplies();
    return renderCommand();
  }

  function shellHtml(){
    const active = TABS.find(t => t[0] === activeTab) || TABS[0];
    return `<div class="his-shell ${open ? 'open' : ''}" id="his-shell">
      <div class="his-app" role="dialog" aria-label="Hospital information system">
        <aside class="his-side">
          <div class="his-brand"><strong>HCT Hospital IS</strong><span>Realtime command center, wards, orders, pharmacy, and notifications.</span></div>
          <nav class="his-nav">${TABS.map(t => `<button class="${activeTab === t[0] ? 'active' : ''}" data-his-tab="${t[0]}"><span class="his-ic">${t[1]}</span><span><strong>${t[2]}</strong><span>${t[3]}</span></span></button>`).join('')}</nav>
          <button class="btn danger" id="his-close">Close HIS</button>
        </aside>
        <main class="his-main">
          <header class="his-top">
            <div><h2>${escHtml(active[2])}</h2><p>${escHtml(active[3])}</p></div>
            <div class="his-tools"><input class="his-search" id="his-search" placeholder="Search patient, MRN, drug..." value="${escHtml(search)}"></div>
          </header>
          <section class="his-content">${content()}</section>
        </main>
      </div>
    </div>`;
  }

  function pageHtml(){
    const active = TABS.find(t => t[0] === activeTab) || TABS[0];
    return `<div class="his-page">
      <aside class="his-side his-page-side">
        <div class="his-brand"><strong>HCT Hospital IS</strong><span>Realtime inpatient operations</span></div>
        <nav class="his-nav">${TABS.map(t => `<button class="${activeTab === t[0] ? 'active' : ''}" data-his-tab="${t[0]}"><span class="his-ic">${t[1]}</span><span><strong>${t[2]}</strong><span>${t[3]}</span></span></button>`).join('')}</nav>
      </aside>
      <main class="his-main his-page-main">
        <header class="his-top">
          <div><h2>${escHtml(active[2])}</h2><p>${escHtml(active[3])}</p></div>
          <div class="his-tools"><input class="his-search" id="his-search" placeholder="Search patient, MRN, drug..." value="${escHtml(search)}"></div>
        </header>
        <section class="his-content">${content()}</section>
      </main>
    </div>`;
  }

  function renderHis(){
    let root = document.getElementById('his-root');
    if(!root){
      root = document.createElement('div');
      root.id = 'his-root';
      document.body.appendChild(root);
    }
    root.innerHTML = shellHtml();
    bindHis();
  }

  function ensureLauncher(){
    if(document.getElementById('his-launcher')) return;
    const btn = document.createElement('button');
    btn.id = 'his-launcher';
    btn.className = 'his-launcher';
    btn.textContent = 'Hospital IS';
    document.body.appendChild(btn);
    btn.onclick = () => { open = true; renderHis(); };
  }

  function bindHis(){
    installLiveSync();
    window.HctMedicationInventory?.bindDrugCards(document);
    window.HctMedicationInventory?.bindDosePicker('his-med-item', 'his-med-dose');
    document.getElementById('his-close')?.addEventListener('click', () => { open = false; renderHis(); });
    document.querySelectorAll('[data-his-tab]').forEach(btn => btn.onclick = () => { activeTab = btn.dataset.hisTab; renderHis(); });
    const searchInput = document.getElementById('his-search');
    searchInput?.addEventListener('input', e => { search = e.target.value; renderHis(); });
    document.getElementById('his-ward-filter')?.addEventListener('change', e => { wardFilter = e.target.value; renderHis(); });
    document.querySelectorAll('[data-his-select-patient]').forEach(btn => btn.onclick = () => { livePatientId = btn.dataset.hisSelectPatient; activeTab = 'orders'; openLiveSection(livePatientId, 'orders'); });
    document.querySelectorAll('[data-his-delete-patient]').forEach(btn => btn.onclick = () => {
      if(accountRole() !== 'instructor') return toastMsg('Faculty role required');
      his.live.removedPatients[btn.dataset.hisDeletePatient] = true;
      eventLog('Patient removed from HIS census', btn.dataset.hisDeletePatient, 'Admissions');
      saveHis();
      publishLive('snapshot', {live:his.live});
      renderHis();
    });
    document.getElementById('his-add-patient')?.addEventListener('click', () => {
      if(accountRole() !== 'instructor') return toastMsg('Faculty role required');
      const first = valLive('his-new-first'), last = valLive('his-new-last'), dx = valLive('his-new-dx');
      if(!first || !last || !dx) return toastMsg('First, last, and diagnosis required');
      const id = `his-${Date.now().toString(36)}`;
      const p = {id, scenarioId:id, firstName:first, lastName:last, mrn:valLive('his-new-mrn') || `HIS-${Date.now().toString().slice(-5)}`, age:'', sex:'', dob:'', location:valLive('his-new-room'), diagnosis:dx, acuity:valLive('his-new-status') || 'Stable', allergies:'NKDA', specialty:valLive('his-new-ward'), tags:['HIS'], orders:[], vitals:[], meds:[], notes:[]};
      his.live.addedPatients[id] = p;
      his.live.patients[id] = {...liveFor(id), ward:valLive('his-new-ward') || 'Medical', room:valLive('his-new-room'), status:valLive('his-new-status') || 'Stable'};
      livePatientId = id;
      eventLog('New patient admitted to HIS', id, 'Admissions');
      saveHis();
      publishLive('snapshot', {live:his.live});
      renderHis();
    });
    document.querySelectorAll('[data-his-open-patient]').forEach(btn => btn.onclick = () => {
      const id = btn.dataset.hisOpenPatient;
      if(typeof state !== 'undefined'){
        state.activeId = id;
        state.tab = 'summary';
        if(typeof persist === 'function') persist({cloud:false});
        if(typeof render === 'function') render();
      }
      open = false;
      renderHis();
    });
    document.querySelectorAll('[data-his-result]').forEach(btn => btn.onclick = () => {
      his.labStatus[btn.dataset.hisResult] = 'Resulted';
      saveHis();
      renderHis();
      toastMsg('Diagnostic item marked resulted');
    });
    document.querySelectorAll('[data-his-verify]').forEach(btn => btn.onclick = () => {
      his.medStatus[btn.dataset.hisVerify] = 'Verified';
      saveHis();
      renderHis();
      toastMsg('Medication verified');
    });
    document.querySelectorAll('[data-his-adjust]').forEach(btn => btn.onclick = () => {
      const [type, id, deltaRaw] = btn.dataset.hisAdjust.split(':');
      const item = his.inventory[type].find(x => x.id === id);
      if(item) item.onHand = Math.max(0, item.onHand + Number(deltaRaw));
      saveHis();
      renderHis();
    });
    document.querySelectorAll('[data-his-request]').forEach(btn => btn.onclick = () => {
      const [type, id] = btn.dataset.hisRequest.split(':');
      const item = his.inventory[type].find(x => x.id === id);
      if(item){
        item.requested += 1;
        his.supplyRequests.push({type, item:item.name, time:new Date().toLocaleString(), status:'Requested'});
        saveHis();
        renderHis();
        toastMsg('Restock request created');
      }
    });
    document.querySelectorAll('[data-live-pick]').forEach(row => row.onclick = () => openLiveSection(row.dataset.livePick, liveSection));
    document.querySelectorAll('[data-live-section]').forEach(btn => btn.onclick = () => openLiveSection(btn.dataset.livePatient, btn.dataset.liveSection));
    document.getElementById('live-patient-select')?.addEventListener('change', e => { livePatientId = e.target.value; openLiveSection(e.target.value, e.target.dataset.targetTab || liveSection); });
    ['live-nurse','live-status','live-note'].forEach(id => document.getElementById(id)?.addEventListener('change', saveLiveControls));
    document.getElementById('live-note')?.addEventListener('input', debounce(saveLiveControls, 450));
    document.getElementById('live-save-controls')?.addEventListener('click', saveLiveControls);
    document.getElementById('his-photo')?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const live = liveFor(livePatientId);
        live.photo = reader.result;
        eventLog('Patient photo updated', livePatientId, 'Admissions');
        saveHis();
        publishLive('patient-update', {patientId:livePatientId, patch:{photo:live.photo}});
        publishLive('event', {event:his.live.events[0]});
        renderHis();
      };
      reader.readAsDataURL(file);
    });
    function saveLiveControls(){
      const patch = {
        attendingNurse: document.getElementById('live-nurse')?.value?.trim() || '',
        status: document.getElementById('live-status')?.value || 'Stable',
        note: document.getElementById('live-note')?.value?.trim() || ''
      };
      his.live.patients[livePatientId] = {...liveFor(livePatientId), ...patch};
      eventLog('Updated attending nurse/status/handoff', livePatientId);
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    }
    document.getElementById('live-add-vital')?.addEventListener('click', () => {
      const entry = {time:valLive('live-vt-time'), hr:valLive('live-vt-hr'), bps:valLive('live-vt-bps'), bpd:valLive('live-vt-bpd'), rr:valLive('live-vt-rr'), temp:valLive('live-vt-temp'), spo2:valLive('live-vt-spo2'), by:accountName()};
      if(!entry.hr || !entry.bps || !entry.bpd) return toastMsg('HR and BP required');
      const live = liveFor(livePatientId);
      live.vitals.push(entry);
      live.vitals = live.vitals.slice(-20);
      eventLog('Charted live vital signs', livePatientId);
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{vitals:live.vitals}});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
    document.getElementById('live-add-order')?.addEventListener('click', () => {
      if(accountRole() !== 'instructor') return toastMsg('Faculty role required for doctor orders');
      const order = valLive('live-order-name');
      if(!order) return toastMsg('Order required');
      const live = liveFor(livePatientId);
      live.orders.unshift({category:'Doctor', order, details:valLive('live-order-details'), status:valLive('live-order-status') || 'Active', by:accountName(), time:new Date().toLocaleString()});
      eventLog(`Doctor order added: ${order}`, livePatientId);
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{orders:live.orders}});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
    document.getElementById('live-add-note')?.addEventListener('click', () => {
      const body = valLive('live-note-body');
      if(!body) return toastMsg('Note required');
      const live = liveFor(livePatientId);
      live.notes.unshift({type:'Live note', time:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), body, by:accountName()});
      live.notes = live.notes.slice(0, 30);
      eventLog('Posted a live note', livePatientId);
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{notes:live.notes}});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
    document.getElementById('his-request-med')?.addEventListener('click', () => {
      const item = findInventoryItem('', valLive('his-med-item'));
      if(!item) return toastMsg('Medication item required');
      const live = liveFor(livePatientId);
      const req = {id:`med-${Date.now().toString(36)}`, itemId:item.id, med:item.name, dose:valLive('his-med-dose'), route:'', qty:Math.max(1, Number(valLive('his-med-qty') || 1)), status:'Requested', requestedBy:accountName(), time:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})};
      live.medRequests.unshift(req);
      eventLog(`Medication requested: ${req.med}`, livePatientId, 'Pharmacy');
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{medRequests:live.medRequests}});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
    document.querySelectorAll('[data-his-order-existing]').forEach(btn => btn.onclick = () => {
      const p = allLivePatients().find(x => patientKey(x) === livePatientId);
      const med = p?.meds?.[Number(btn.dataset.hisOrderExisting)];
      const item = findInventoryItem(med?.name || '');
      const live = liveFor(livePatientId);
      const req = {id:`med-${Date.now().toString(36)}`, itemId:item?.id || '', med:med?.name || 'Medication', dose:med?.dose || '', route:med?.route || '', qty:1, status:'Requested', requestedBy:accountName(), time:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})};
      live.medRequests.unshift(req);
      eventLog(`Medication requested: ${req.med}`, livePatientId, 'Pharmacy');
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{medRequests:live.medRequests}});
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
    document.querySelectorAll('[data-his-dispense]').forEach(btn => btn.onclick = () => {
      if(accountRole() !== 'instructor') return toastMsg('Faculty role required to dispense');
      const [patientId, reqId] = btn.dataset.hisDispense.split(':');
      const live = liveFor(patientId);
      const req = live.medRequests.find(r => r.id === reqId);
      if(!req) return;
      req.status = 'Dispensed';
      req.dispensedBy = accountName();
      req.dispensedAt = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      req.stockDepleted = depleteStockForMed(req);
      eventLog(`Medication dispensed: ${req.med}`, patientId, 'Pharmacy');
      saveHis();
      publishLive('snapshot', {live:his.live});
      renderHis();
    });
    document.querySelectorAll('[data-his-give-med]').forEach(btn => btn.onclick = () => {
      const live = liveFor(livePatientId);
      const req = live.medRequests.find(r => r.id === btn.dataset.hisGiveMed);
      if(!req) return;
      req.status = 'Given';
      req.givenBy = accountName();
      req.givenAt = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      if(!req.stockDepleted) req.stockDepleted = depleteStockForMed(req);
      live.notes.unshift({type:'MAR', time:req.givenAt, by:accountName(), body:`Medication given: ${req.med} ${req.dose || ''}`});
      eventLog(`Medication given: ${req.med}`, livePatientId, 'Nursing');
      saveHis();
      publishLive('snapshot', {live:his.live});
      renderHis();
    });
    document.querySelectorAll('[data-his-cancel-med]').forEach(btn => btn.onclick = () => {
      const live = liveFor(livePatientId);
      const req = live.medRequests.find(r => r.id === btn.dataset.hisCancelMed);
      if(req) req.status = 'Cancelled';
      eventLog(`Medication request cancelled: ${req?.med || ''}`, livePatientId, 'Pharmacy');
      saveHis();
      publishLive('patient-update', {patientId:livePatientId, patch:{medRequests:live.medRequests}});
      renderHis();
    });
    document.getElementById('his-post-message')?.addEventListener('click', () => {
      const body = valLive('his-message-body');
      if(!body) return toastMsg('Message required');
      eventLog(body, livePatientId, valLive('his-message-dept') || 'HIS');
      saveHis();
      publishLive('event', {event:his.live.events[0]});
      renderHis();
    });
  }

  function valLive(id){
    return document.getElementById(id)?.value?.trim() || '';
  }

  function debounce(fn, delay){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function install(){
    ensureLauncher();
    renderHis();
    window.HctHis = {
      renderPage(){
        open = false;
        installLiveSync();
        return pageHtml();
      },
      bindPage(){
        bindHis();
      },
      open(){
        open = true;
        renderHis();
      }
    };
    if(typeof state !== 'undefined' && state.tab === 'his' && typeof render === 'function') render();
    document.addEventListener('keydown', event => {
      if(event.key === 'Escape' && open){
        open = false;
        renderHis();
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
