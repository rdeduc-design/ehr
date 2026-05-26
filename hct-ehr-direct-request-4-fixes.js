(function(){
  'use strict';
  const PHARMA_URL = 'https://rdeduc-design.github.io/hct-pharmamaster/';
  function g(name){ try { return window[name] || eval(name); } catch(_) { return window[name]; } }
  function expose(name,value){ window[name]=value; try { eval(name + ' = value'); } catch(_) {} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function lines(v){ return esc(v).replace(/\n/g,'<br>'); }
  function section(title,body,right){ const fn=g('section'); return typeof fn==='function' ? fn(title,body,right||'') : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3>${right||''}</div><div class="card-body">${body}</div></div>`; }
  function table(headers,rows){ const fn=g('table'); return typeof fn==='function' ? fn(headers,rows) : `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`; }
  function stateObj(){ return g('state') || window.state || {}; }
  function cloudObj(){ return g('cloud') || window.cloud || {}; }
  function current(){ const fn=g('currentPatient'); return typeof fn==='function' ? fn() : null; }
  function persist(opts){ const fn=g('persist'); if(typeof fn==='function') fn(opts||{}); }
  function render(){ const fn=g('render'); if(typeof fn==='function') fn(); }
  function toast(msg){ const fn=g('toast'); if(typeof fn==='function') fn(msg); else console.log(msg); }
  function nowDisplay(v){ const fn=g('nowDisplay'); return typeof fn==='function' ? fn(v) : (v ? new Date(v).toLocaleString([], {dateStyle:'medium', timeStyle:'short'}) : '--'); }
  function val(id){ return document.getElementById(id)?.value?.trim() || ''; }
  function role(){ const c=cloudObj(); return String(c.profile?.role || localStorage.getItem('hct_role') || 'student').toLowerCase(); }
  function isFaculty(){ return /instructor|faculty|admin|doctor/.test(role()); }
  function medMeta(text){ const h=window.HctMedicationInventory; if(!h) return null; return h.find(text) || h.items?.find?.(m => String(text||'').toLowerCase().includes(String(m.name||'').toLowerCase()) || String(text||'').toLowerCase().includes(String(m.generic||'').toLowerCase())); }
  function medSlugFrom(name){ const m=medMeta(name) || {}; return m.id || String(name||'medication').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function medNameFromTarget(target){
    const direct=target.closest?.('[data-med-info],[data-his-med-ref],[data-med-open]');
    if(direct){ const raw=direct.dataset.medInfo || direct.dataset.hisMedRef || direct.dataset.medOpen || direct.textContent; const m=medMeta(raw); return m?.name || raw; }
    const strong=target.closest?.('.hct-clickable-med');
    return strong?.dataset.medOpen || strong?.textContent || '';
  }
  function openMedication(name){
    const m=medMeta(name) || {name};
    const query=new URLSearchParams({drug:m.name || name, id:m.id || medSlugFrom(name)}).toString();
    window.open(`${PHARMA_URL}?${query}#${encodeURIComponent(m.id || medSlugFrom(name))}`,'_blank','noopener');
  }
  function patchAccessAndConsent(){
    expose('isInstructor', isFaculty);
    expose('canAccessAnalytics', isFaculty);
    expose('canUseFacultyTools', isFaculty);
    expose('isFacultyTab', tab => new Set(['modulebuilder','dashboard','statusboard']).has(tab) && !isFaculty());
    expose('hasPrivacyConsent', () => true);
    const oldSignUp=g('signUp');
    if(typeof oldSignUp==='function' && !oldSignUp.__direct4){
      const wrapped=function(){ return oldSignUp.apply(this, arguments); };
      wrapped.__direct4=true;
      expose('signUp', wrapped);
    }
  }
  function patchSignupText(){
    const box=document.querySelector('.signup-consent span');
    if(box) box.innerHTML='I consent to HCT Institute collecting and processing my account details, simulation chart entries, assessment responses, scores, timestamps, and instructor review records for EHR simulation learning, clinical reasoning practice, academic feedback, security, and required institutional reporting under the Data Privacy Act of 2012 (RA 10173).';
    document.querySelectorAll('.privacy-card').forEach(card => { if(!card.closest('#view-signup')) card.remove(); });
    document.querySelectorAll('.sync-indicator + .sync-indicator').forEach(el => el.remove());
  }
  function activeAlertMessages(p){
    const out=[];
    const last=(p?.vitals||[]).slice(-1)[0] || {};
    const rules=g('VITAL_RULES') || [
      {key:'hr',label:'Heart rate',lo:60,hi:100,msg:'Heart rate is outside the expected adult range.'},
      {key:'bps',label:'Systolic BP',lo:90,hi:140,msg:'Systolic blood pressure needs reassessment.'},
      {key:'bpd',label:'Diastolic BP',lo:50,hi:90,msg:'Diastolic blood pressure needs reassessment.'},
      {key:'rr',label:'Respiratory rate',lo:12,hi:20,msg:'Respiratory rate is outside the expected adult range.'},
      {key:'spo2',label:'SpO2',lo:92,hi:100,msg:'Oxygen saturation is below target or invalid.'}
    ];
    rules.forEach(r => { const n=Number(last[r.key]); if(Number.isFinite(n) && (n<r.lo || n>r.hi)) out.push(`${r.label}: ${r.msg}`); });
    (p?.labs||[]).forEach(l => { const flag=String(l.flag || l[4] || '').toLowerCase(); if(/critical|high|low|abnormal/.test(flag)) out.push(`${l.test || l[1] || 'Lab'} ${l.result || l[2] || ''}: ${l.flag || l[4]}`); });
    (p?.orders||[]).forEach(o => { const status=String(o.status || o[3] || '').toLowerCase(); if(/stat|critical/.test(status)) out.push(`Priority order: ${o.order || o[1] || 'STAT order'}`); });
    const allergy=String(p?.allergies||'');
    (p?.meds||[]).forEach(m => { const warn=typeof g('checkMedAllergy')==='function' ? g('checkMedAllergy')(m.name || m[0], allergy) : ''; if(warn) out.push(`Medication allergy: ${warn}`); if(/high-alert/i.test(m.note || m.warn || m[6] || '')) out.push(`High-alert medication: ${m.name || m[0]}`); });
    return [...new Set(out.filter(Boolean))];
  }
  function patchSummary(){
    expose('rSummary', function(){
      const p=current();
      const alerts=activeAlertMessages(p);
      const body=alerts.length ? alerts.map(a=>`<div class="notice danger"><span class="mark">ALERT</span><span>${esc(a)}</span></div>`).join('') : '<p class="text-block" style="color:var(--subtle);">No active clinical alerts.</p>';
      return section('Active clinical alerts', `<div class="hct-summary-alerts">${body}</div>`);
    });
  }
  function debriefQuestions(p){
    const custom=Array.isArray(p?.debriefingQuestions) ? p.debriefingQuestions : [];
    const base=[
      'PEARLS reactions: What was your first clinical reaction when you opened this chart?',
      `PEARLS description: What cues supported the concern of ${p?.diagnosis || 'this condition'}?`,
      'PEARLS analysis: Which EHR data point changed your priority most?',
      'PEARLS analysis: What would you reassess first, and why?',
      'PEARLS analysis: Which order, lab, or medication required the highest safety check?',
      'PEARLS summary: What action protected patient safety?',
      'PEARLS application: What will you do differently in the next simulation?',
      'EHR usability: Which charting area needs cleanup before submission?'
    ];
    return [...custom,...base].filter((q,i,a)=>q && a.indexOf(q)===i);
  }
  function patchDebrief(){
    expose('rDebriefing', function(){
      const p=current(); const d=p.debriefing=p.debriefing||{}; const qs=debriefQuestions(p);
      const idx=Math.max(0, Math.min(Number(d.pearlsIndex||0), qs.length-1));
      const ans=d.pearlsResponses||[]; const pct=qs.length ? Math.round(((idx+1)/qs.length)*100) : 0;
      const rows=qs.map((q,i)=>ans[i]?`<tr><td>${i+1}</td><td>${esc(q)}</td><td>${lines(ans[i])}</td></tr>`:'').join('');
      return section('PEARLS debriefing', `<div class="hct-debrief-wizard"><div class="hct-debrief-progress"><span>Question ${idx+1} of ${qs.length}</span><strong>${pct}%</strong></div><div class="hct-progress-bar"><span style="width:${pct}%"></span></div><h3>${esc(qs[idx]||'Debriefing question')}</h3><textarea id="db-current-answer">${esc(ans[idx]||'')}</textarea><div class="actions"><button class="btn" id="db-prev" ${idx===0?'disabled':''}>Previous</button><button class="btn primary" id="db-next">${idx===qs.length-1?'Review':'Next question'}</button><button class="btn navy" id="db-submit">Submit debriefing</button></div>${d.pearlsSubmittedAt?`<p class="hct-submit-note">Submitted ${esc(nowDisplay(d.pearlsSubmittedAt))}</p>`:''}</div>`) + section('Saved debrief responses', rows ? table(['#','Question','Response'], rows) : '<p class="text-block" style="color:var(--subtle);">Responses will appear here after you answer each question.</p>');
    });
  }
  function saveDebrief(delta, submit){
    const p=current(); if(!p) return; p.debriefing=p.debriefing||{};
    const qs=debriefQuestions(p); const idx=Math.max(0, Math.min(Number(p.debriefing.pearlsIndex||0), qs.length-1));
    p.debriefing.pearlsResponses=p.debriefing.pearlsResponses||[];
    p.debriefing.pearlsResponses[idx]=val('db-current-answer');
    p.debriefing.pearlsIndex=Math.max(0, Math.min(idx+delta, qs.length-1));
    if(submit) p.debriefing.pearlsSubmittedAt=new Date().toISOString();
    persist(); toast(submit?'Debriefing submitted':'Debriefing response saved'); render();
  }
  function decorateMedicationNames(){
    document.querySelectorAll('strong:not(.hct-clickable-med)').forEach(el => {
      const txt=el.textContent.trim(); const meta=medMeta(txt);
      if(meta && txt.length>2){ el.classList.add('hct-clickable-med'); el.dataset.medOpen=meta.name; el.title='Open this medication in HCT PharmaMaster'; }
    });
  }

  const HIS_KEY='hct_online_his_final_v4';
  const HIS_CHANNEL='hct-online-his-final-v4';
  const HIS_ROW='shared';
  let hisModule='command', hisSelected='', hisSearch='', hisState=null, hisBc=null, hisLive=null, hisSync='offline', hisPoll=null, hisSaving=null;
  function initials(p){ return `${p.firstName||p.name||'P'} ${p.lastName||''}`.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
  function patientName(p){ return p.name || `${p.lastName||''}, ${p.firstName||''}`.replace(/^,\s*/,'') || 'Patient'; }
  function wardOf(p){ const s=`${p.location||''} ${p.specialty||''} ${p.diagnosis||''}`; if(/icu|resus|critical/i.test(s))return'ICU'; if(/ob|gyn|labor|postpartum/i.test(s))return'OB-GYN'; if(/peds|pediatric/i.test(s))return'Pediatrics'; if(/psych|mental/i.test(s))return'Psychiatry'; if(/surg|ortho/i.test(s))return'Surgical'; if(/ed|emergency/i.test(s))return'Emergency'; return'Medical'; }
  function seedHis(){ const out={version:1,updatedAt:Date.now(),patients:{},stock:[],events:[],selected:''}; try{(g('scenarios')||[]).forEach(sc=>{const p=sc.patient; if(!p)return; const id=p.scenarioId||p.id||sc.id; out.patients[id]={id,firstName:p.firstName,lastName:p.lastName,name:`${p.lastName}, ${p.firstName}`,mrn:p.mrn,age:p.age,sex:p.sex,diagnosis:p.diagnosis,allergies:p.allergies,ward:wardOf(p),room:p.location,status:p.acuity||'Stable',nurse:'',note:'',orders:(p.orders||[]).map(o=>({id:'ord_'+Math.random().toString(36).slice(2),order:o.order||o[1]||'',details:o.details||o[2]||'',category:o.category||o[0]||'Order',status:o.status||o[3]||'Active',by:'Scenario',time:''})),meds:(p.meds||[]).map(m=>({id:'med_'+Math.random().toString(36).slice(2),name:m.name||m[0]||'',dose:m.dose||m[1]||'',route:m.route||m[2]||'',freq:m.freq||m[3]||'',status:m.status||m[5]||'Ordered',by:'Scenario',time:''})),vitals:[...(p.vitals||[])],labs:[...(p.labs||[])],notes:[]};});}catch(_){} out.selected=Object.keys(out.patients)[0]||''; const meds=window.HctMedicationInventory?.items||[]; out.stock=meds.length?meds.map(m=>({id:m.id,name:m.name,onHand:m.onHand||20,par:m.par||8,category:m.category||'',generic:m.generic||''})):[{id:'normal-saline-1-l',name:'Normal saline 1 L',onHand:42,par:18,category:'IV fluid'}]; return out; }
  function loadHis(){ if(hisState) return hisState; try{hisState=JSON.parse(localStorage.getItem(HIS_KEY)||'null')||seedHis();}catch(_){hisState=seedHis();} return hisState; }
  function saveHis(text){ const s=loadHis(); s.version=Number(s.version||0)+1; s.updatedAt=Date.now(); if(text) s.events.unshift({text,by:accountName(),time:new Date().toLocaleString(),patient:patientName(s.patients[hisSelected]||{})}); s.events=s.events.slice(0,120); localStorage.setItem(HIS_KEY,JSON.stringify(s)); broadcastHis(s,text); queueCloudSave(s); }
  function mergeHis(local,remote){ if(!remote) return local; const next={...local,...remote,patients:{...(local.patients||{}),...(remote.patients||{})},stock:remote.updatedAt>=local.updatedAt?(remote.stock||local.stock):(local.stock||remote.stock),events:[...(remote.events||[]),...(local.events||[])]}; const seen=new Set(); next.events=next.events.filter(e=>{const k=`${e.time}|${e.text}|${e.patient}`; if(seen.has(k))return false; seen.add(k); return true;}).slice(0,120); next.updatedAt=Math.max(local.updatedAt||0,remote.updatedAt||0); next.version=Math.max(local.version||0,remote.version||0); return next; }
  function accountName(){ const c=cloudObj(); return c.profile?.full_name || c.session?.user?.email || localStorage.getItem('hct_his_online_username') || 'Care team member'; }
  function broadcastHis(s,text){ try{hisBc ||= new BroadcastChannel(HIS_CHANNEL); hisBc.postMessage({cid:HIS_CHANNEL + localStorage.hct_his_online_client, state:s, text});}catch(_){} try{hisLive?.send({type:'broadcast',event:'state',payload:{cid:HIS_CHANNEL + localStorage.hct_his_online_client,state:s,text}});}catch(_){} }
  async function queueCloudSave(s){ clearTimeout(hisSaving); hisSync='saving'; hisSaving=setTimeout(async()=>{ try{const c=cloudObj(); if(!c.client) throw new Error('offline'); const row={id:HIS_ROW,state:s,updated_by:c.session?.user?.id||null,updated_at:new Date().toISOString()}; const {error}=await c.client.from('hct_online_his_state').upsert(row,{onConflict:'id'}); if(error) throw error; hisSync='saved'; }catch(_){ hisSync='offline'; } render(); },450); }
  async function pullCloudHis(){ try{const c=cloudObj(); if(!c.client) return; const {data,error}=await c.client.from('hct_online_his_state').select('state,updated_at').eq('id',HIS_ROW).maybeSingle(); if(error||!data?.state) return; hisState=mergeHis(loadHis(),data.state); localStorage.setItem(HIS_KEY,JSON.stringify(hisState)); hisSync='saved'; }catch(_){ hisSync='offline'; } }
  function connectHis(){ try{hisBc ||= new BroadcastChannel(HIS_CHANNEL); hisBc.onmessage=e=>{const m=e.data||{}; if(m.state){hisState=mergeHis(loadHis(),m.state); localStorage.setItem(HIS_KEY,JSON.stringify(hisState)); render();}};}catch(_){} try{const c=cloudObj(); if(c.client?.channel && !hisLive){hisLive=c.client.channel(HIS_CHANNEL,{config:{broadcast:{ack:true}}}); hisLive.on('broadcast',{event:'state'},e=>{const m=e.payload||{}; if(m.state){hisState=mergeHis(loadHis(),m.state); localStorage.setItem(HIS_KEY,JSON.stringify(hisState)); render();}}); hisLive.subscribe(st=>{if(st==='SUBSCRIBED'){pullCloudHis().then(render); broadcastHis(loadHis(),'Online HIS connected');}});}}catch(_){} if(!hisPoll) hisPoll=setInterval(()=>{ if(stateObj().tab==='his') pullCloudHis().then(render); },5000); }
  function pill(t){ const s=String(t||'').toLowerCase(); const c=/critical|stat|low/.test(s)?'red':/urgent|request|pending|watch/.test(s)?'gold':/given|dispensed|stable|active/.test(s)?'green':'blue'; return `<span class="badge ${c}">${esc(t||'')}</span>`; }
  function refBtn(name){ return `<button class="btn small" data-his-med-ref="${esc(name)}">Reference</button>`; }
  function card(t,b){ return section(t,b); }
  function hisPatients(){ const s=loadHis(); return Object.values(s.patients||{}).filter(p=>!p.removed); }
  function hisPatient(){ const s=loadHis(); return s.patients[hisSelected||s.selected] || hisPatients()[0]; }
  function hisShell(){ connectHis(); const s=loadHis(); if(!hisSelected) hisSelected=s.selected; const nav=[['command','Command'],['patients','Patients'],['chart','Chart'],['pharmacy','Pharmacy'],['labs','Labs'],['notifications','Notifications']]; const active=nav.find(n=>n[0]===hisModule)||nav[0]; return `<div class="hct-his4-shell"><aside class="hct-his4-side"><div class="hct-his4-brand"><strong>Online HIS</strong><span>Shared live hospital interface for all signed-in devices and accounts.</span></div><nav class="hct-his4-nav">${nav.map(n=>`<button class="${hisModule===n[0]?'active':''}" data-his4-mod="${n[0]}">${esc(n[1])}</button>`).join('')}</nav><div class="hct-his4-sidefoot">Role: ${esc(isFaculty()?'Instructor':'Student')}<br>All edits broadcast and save to Supabase.</div></aside><main class="hct-his4-main"><header class="hct-his4-top"><div><h2>${esc(active[1])}</h2><p>${esc(hisPatients().length)} live patients. Same-tab edits are merged for the group.</p></div><span class="hct-his-sync ${hisSync}">${esc(hisSync==='saved'?'Synced':hisSync==='saving'?'Syncing':'Local/offline')}</span></header><section class="hct-his4-content">${hisPage()}</section></main></div>`; }
  function hisPage(){ if(hisModule==='patients')return hisPatientList(); if(hisModule==='chart')return hisChart(); if(hisModule==='pharmacy')return hisPharmacy(); if(hisModule==='labs')return hisLabs(); if(hisModule==='notifications')return hisNotifications(); return hisCommand(); }
  function hisCommand(){ const pts=hisPatients(); const meds=pts.flatMap(p=>(p.meds||[]).map(m=>({...m,p}))); const crit=pts.filter(p=>/critical|urgent/i.test(p.status)); return `<div class="hct-his4-grid">${card('Census',`<div class="hct-his4-kpi"><strong>${pts.length}</strong><span>Patients</span></div>`)}${card('Priority',`<div class="hct-his4-kpi"><strong>${crit.length}</strong><span>Urgent/Critical</span></div>`)}${card('Medication queue',`<div class="hct-his4-kpi"><strong>${meds.filter(m=>/request/i.test(m.status)).length}</strong><span>Requests</span></div>`)}</div><div class="hct-his4-grid two" style="margin-top:10px;">${card('Priority patients',`<div class="hct-his4-list">${crit.map(p=>hisRow(patientName(p),`${p.ward} ${p.room} - ${p.diagnosis}`,pill(p.status),`data-his4-open="${esc(p.id)}"`)).join('')||'<p class="text-block">No priority patients.</p>'}</div>`)}${card('Live activity',`<div class="hct-his4-list">${(loadHis().events||[]).slice(0,8).map(e=>hisRow(e.text,`${e.patient||''} - ${e.by||''} - ${e.time||''}`,'')).join('')||'<p class="text-block">No live updates yet.</p>'}</div>`)}</div>`; }
  function hisRow(a,b,right,attrs){ return `<div class="hct-his4-row" ${attrs||''}><div><strong>${esc(a)}</strong><small>${esc(b)}</small></div><div class="hct-his4-actions">${right||''}</div></div>`; }
  function hisPatientList(){ const pts=hisPatients().filter(p=>!hisSearch||`${patientName(p)} ${p.mrn} ${p.diagnosis} ${p.ward}`.toLowerCase().includes(hisSearch.toLowerCase())); const add=isFaculty()?card('Instructor patient management','<div class="hct-his4-tools"><input id="his4-first" placeholder="First name"><input id="his4-last" placeholder="Last name"><input id="his4-dx" placeholder="Diagnosis"><button class="btn primary" id="his4-add-patient">Add patient</button></div>'):''; return `${card('Live patient census',`<div class="hct-his4-tools"><input id="his4-search" value="${esc(hisSearch)}" placeholder="Search patient, MRN, diagnosis, ward"><span></span><span></span><span></span></div><div class="hct-his4-list">${pts.map(p=>`<div class="hct-his4-row"><div class="hct-his4-pt"><span class="hct-his4-avatar">${esc(initials(p))}</span><div><strong>${esc(patientName(p))}</strong><small>${esc([p.mrn,p.ward,p.room,p.diagnosis].filter(Boolean).join(' - '))}</small></div></div><div class="hct-his4-actions">${pill(p.status)}<button class="btn small primary" data-his4-open="${esc(p.id)}">Open</button>${isFaculty()?`<button class="btn small danger" data-his4-del="${esc(p.id)}">Delete</button>`:''}</div></div>`).join('')||'<p class="text-block">No patients found.</p>'}</div>`)}${add}`; }
  function hisChart(){ const p=hisPatient(); if(!p)return '<p>No patient selected.</p>'; const orderRows=(p.orders||[]).map(o=>`<tr><td><strong>${esc(o.order)}</strong><br><small>${esc(o.details)}</small></td><td>${esc(o.category)}</td><td>${pill(o.status)}</td><td>${esc(o.by||'')}</td></tr>`).join(''); const medRows=(p.meds||[]).map(m=>`<tr><td><strong class="hct-clickable-med" data-med-open="${esc(m.name)}">${esc(m.name)}</strong><br><small>${esc([m.dose,m.route,m.freq].filter(Boolean).join(' '))}</small></td><td>${pill(m.status)}</td><td>${esc(m.by||'')}</td><td>${refBtn(m.name)} ${/ordered/i.test(m.status)?`<button class="btn small" data-his4-request-med="${esc(m.id)}">Request</button>`:''}${/dispensed/i.test(m.status)?`<button class="btn small primary" data-his4-give="${esc(m.id)}">Give</button>`:''}</td></tr>`).join(''); const vit=(p.vitals||[]).slice(-1)[0]||{}; return `<div class="hct-his4-row" style="margin-bottom:10px;"><div class="hct-his4-pt"><span class="hct-his4-avatar">${esc(initials(p))}</span><div><strong>${esc(patientName(p))}</strong><small>${esc([p.mrn,p.ward,p.room,p.diagnosis].filter(Boolean).join(' - '))}</small></div></div><button class="btn" data-his4-mod="patients">Back</button></div>${card('Live controls',`<div class="hct-his4-tools"><input id="his4-nurse" value="${esc(p.nurse||'')}" placeholder="Attending nurse"><select id="his4-status"><option ${p.status==='Stable'?'selected':''}>Stable</option><option ${p.status==='Urgent'?'selected':''}>Urgent</option><option ${p.status==='Critical'?'selected':''}>Critical</option><option ${p.status==='Admitted'?'selected':''}>Admitted</option></select><input id="his4-note" value="${esc(p.note||'')}" placeholder="Shared handoff note"><button class="btn primary" id="his4-save-header">Save</button></div>`)}<div class="hct-his4-grid two" style="margin-top:10px;">${card('Doctor orders',`${isFaculty()?'<div class="hct-his4-tools"><input id="his4-order" placeholder="New order"><input id="his4-order-details" placeholder="Details"><select id="his4-order-status"><option>STAT</option><option selected>Active</option><option>PRN</option></select><button class="btn primary" id="his4-add-order">Add</button></div>':''}${table(['Order','Type','Status','By'],orderRows||'<tr><td colspan="4">No orders.</td></tr>')}`)}${card('Vital signs',`<div class="hct-his4-tools"><input id="his4-hr" value="${esc(vit.hr||'')}" placeholder="HR"><input id="his4-bp" value="${vit.bps&&vit.bpd?esc(vit.bps+'/'+vit.bpd):''}" placeholder="BP"><input id="his4-spo2" value="${esc(vit.spo2||'')}" placeholder="SpO2"><button class="btn primary" id="his4-add-vitals">Save vitals</button></div>`)}</div><div class="hct-his4-grid two" style="margin-top:10px;">${card('Medications',`<div class="hct-his4-tools"><select id="his4-med-item">${loadHis().stock.map(i=>`<option value="${esc(i.id)}">${esc(i.name)}</option>`).join('')}</select><input id="his4-med-dose" placeholder="Dose / route"><input id="his4-med-qty" type="number" min="1" value="1"><button class="btn primary" id="his4-add-med">Request</button></div>${table(['Medication','Status','By',''],medRows||'<tr><td colspan="4">No medications.</td></tr>')}`)}${card('Nursing notes',`<div class="hct-his4-tools"><input id="his4-note-body" placeholder="Team update or handoff note"><span></span><span></span><button class="btn primary" id="his4-post-note">Post</button></div><div class="hct-his4-list">${(p.notes||[]).slice().reverse().map(n=>hisRow(n.body,`${n.by} - ${n.time}`,'')).join('')||'<p class="text-block">No notes yet.</p>'}</div>`)}</div>`; }
  function hisPharmacy(){ const s=loadHis(); const requests=hisPatients().flatMap(p=>(p.meds||[]).filter(m=>/request/i.test(m.status)).map(m=>({...m,p}))); return `<div class="hct-his4-grid two">${card('Pharmacy queue',`<div class="hct-his4-list">${requests.map(m=>hisRow(`${m.name} ${m.dose||''}`,`${patientName(m.p)} - requested by ${m.by||''}`,`${refBtn(m.name)} ${pill(m.status)} ${isFaculty()?`<button class="btn small primary" data-his4-dispense="${esc(m.p.id)}:${esc(m.id)}">Dispense</button>`:''}`)).join('')||'<p class="text-block">No medication requests.</p>'}</div>`)}${card('Inventory',`<div class="hct-his4-list">${s.stock.map(i=>hisRow(i.name,`${i.category||''} - Par ${i.par||0}`,`${refBtn(i.name)} ${pill(Number(i.onHand)<=Number(i.par)?'Low stock':'Stocked')} <strong>${esc(i.onHand)}</strong> ${isFaculty()?`<button class="btn small" data-his4-restock="${esc(i.id)}">+5</button>`:''}`)).join('')}</div>`)}</div>`; }
  function hisLabs(){ const rows=[]; hisPatients().forEach(p=>(p.labs||[]).forEach(l=>rows.push(`<tr><td>${esc(patientName(p))}</td><td>${esc(l.test||l[1]||'Diagnostic')}</td><td>${esc(l.result||l[2]||'Pending')}</td><td>${pill(l.flag||l[4]||'')}</td><td>${esc(l.note||l[5]||'')}</td></tr>`))); return card('Labs and imaging', `${isFaculty()?'<div class="hct-his4-tools"><select id="his4-lab-patient">'+hisPatients().map(p=>`<option value="${esc(p.id)}">${esc(patientName(p))}</option>`).join('')+'</select><input id="his4-lab-test" placeholder="Test"><input id="his4-lab-result" placeholder="Result"><button class="btn primary" id="his4-add-lab">Post</button></div>':''}${table(['Patient','Test','Result','Flag','Note'],rows.join('')||'<tr><td colspan="5">No diagnostics.</td></tr>')}`); }
  function hisNotifications(){ return card('Notifications', `<div class="hct-his4-tools"><input id="his4-msg" placeholder="Department message"><span></span><span></span><button class="btn primary" id="his4-post-msg">Post</button></div><div class="hct-his4-list">${(loadHis().events||[]).map(e=>hisRow(e.text,`${e.patient||''} - ${e.by||''} - ${e.time||''}`,'')).join('')||'<p class="text-block">No notifications yet.</p>'}</div>`); }
  function bindHis(){ document.querySelectorAll('[data-his4-mod]').forEach(b=>b.onclick=()=>{hisModule=b.dataset.his4Mod; render();}); document.querySelectorAll('[data-his4-open]').forEach(b=>b.onclick=()=>{hisSelected=b.dataset.his4Open; loadHis().selected=hisSelected; hisModule='chart'; saveHis(); render();}); document.getElementById('his4-search')?.addEventListener('input',e=>{hisSearch=e.target.value; render();}); document.getElementById('his4-save-header')?.addEventListener('click',()=>{const p=hisPatient(); if(!p)return; p.nurse=val('his4-nurse'); p.status=val('his4-status'); p.note=val('his4-note'); saveHis('Patient header updated'); render();}); document.getElementById('his4-add-order')?.addEventListener('click',()=>{if(!isFaculty())return toast('Instructor role required'); const p=hisPatient(); if(!p||!val('his4-order'))return; p.orders.unshift({id:'ord_'+Date.now(),order:val('his4-order'),details:val('his4-order-details'),status:val('his4-order-status'),category:'Doctor',by:accountName(),time:new Date().toLocaleString()}); saveHis('Doctor order added'); render();}); document.getElementById('his4-add-vitals')?.addEventListener('click',()=>{const p=hisPatient(); if(!p)return; const bp=val('his4-bp').split('/'); p.vitals.push({time:new Date().toLocaleString(),hr:val('his4-hr'),bps:bp[0]||'',bpd:bp[1]||'',spo2:val('his4-spo2'),by:accountName(),note:'Online HIS'}); saveHis('Vital signs updated'); render();}); document.getElementById('his4-add-med')?.addEventListener('click',()=>{const p=hisPatient(), item=loadHis().stock.find(i=>i.id===val('his4-med-item')); if(!p||!item)return; p.meds.unshift({id:'med_'+Date.now(),name:item.name,dose:val('his4-med-dose'),qty:Number(val('his4-med-qty')||1),status:'Requested',by:accountName(),time:new Date().toLocaleString()}); saveHis('Medication requested'); render();}); document.querySelectorAll('[data-his4-request-med]').forEach(b=>b.onclick=()=>{const p=hisPatient(),m=p?.meds.find(x=>x.id===b.dataset.his4RequestMed); if(m){m.status='Requested'; m.by=accountName(); saveHis('Medication requested'); render();}}); document.querySelectorAll('[data-his4-dispense]').forEach(b=>b.onclick=()=>{if(!isFaculty())return toast('Instructor role required'); const [pid,mid]=b.dataset.his4Dispense.split(':'),s=loadHis(),p=s.patients[pid],m=p?.meds.find(x=>x.id===mid); if(m){m.status='Dispensed'; m.by=accountName(); const stock=s.stock.find(i=>i.name===m.name||i.id===m.itemId); if(stock)stock.onHand=Math.max(0,Number(stock.onHand||0)-Number(m.qty||1)); saveHis('Medication dispensed'); render();}}); document.querySelectorAll('[data-his4-give]').forEach(b=>b.onclick=()=>{const p=hisPatient(),m=p?.meds.find(x=>x.id===b.dataset.his4Give); if(m){m.status='Given'; m.by=accountName(); saveHis('Medication given'); render();}}); document.querySelectorAll('[data-his4-restock]').forEach(b=>b.onclick=()=>{if(!isFaculty())return; const i=loadHis().stock.find(x=>x.id===b.dataset.his4Restock); if(i){i.onHand=Number(i.onHand||0)+5; saveHis('Inventory restocked'); render();}}); document.getElementById('his4-post-note')?.addEventListener('click',()=>{const p=hisPatient(); if(!p||!val('his4-note-body'))return; p.notes.push({body:val('his4-note-body'),by:accountName(),time:new Date().toLocaleString()}); saveHis('Nursing note posted'); render();}); document.getElementById('his4-add-patient')?.addEventListener('click',()=>{if(!isFaculty())return; const first=val('his4-first'), last=val('his4-last'), dx=val('his4-dx'); if(!first||!last||!dx)return; const id='online_'+Date.now(); loadHis().patients[id]={id,firstName:first,lastName:last,name:`${last}, ${first}`,mrn:'HIS-'+String(Date.now()).slice(-5),diagnosis:dx,ward:'Medical',room:'',status:'Admitted',orders:[],meds:[],vitals:[],labs:[],notes:[]}; hisSelected=id; hisModule='chart'; saveHis('Patient admitted'); render();}); document.querySelectorAll('[data-his4-del]').forEach(b=>b.onclick=()=>{if(!isFaculty())return; const p=loadHis().patients[b.dataset.his4Del]; if(p){p.removed=true; saveHis('Patient removed'); render();}}); document.getElementById('his4-add-lab')?.addEventListener('click',()=>{if(!isFaculty())return; const p=loadHis().patients[val('his4-lab-patient')]; if(!p)return; p.labs.push({time:new Date().toLocaleString(),test:val('his4-lab-test'),result:val('his4-lab-result'),flag:'Posted',note:'Online HIS',by:accountName()}); saveHis('Lab/imaging posted'); render();}); document.getElementById('his4-post-msg')?.addEventListener('click',()=>{if(!val('his4-msg'))return; saveHis(val('his4-msg')); render();}); decorateMedicationNames(); }
  function patchHis(){ window.HctHis={renderPage:hisShell,bindPage:bindHis,open(){try{stateObj().tab='his'; render();}catch(_){}}}; }
  function bindGlobal(){
    document.addEventListener('click', e => {
      const med=medNameFromTarget(e.target);
      if(med){ e.preventDefault(); e.stopPropagation(); openMedication(med); return; }
      const id=e.target?.id;
      if(id==='db-prev'){ e.preventDefault(); e.stopImmediatePropagation(); saveDebrief(-1,false); }
      if(id==='db-next'){ e.preventDefault(); e.stopImmediatePropagation(); saveDebrief(1,false); }
      if(id==='db-submit'){ e.preventDefault(); e.stopImmediatePropagation(); saveDebrief(0,true); }
    }, true);
  }
  function boot(){ patchAccessAndConsent(); patchSummary(); patchDebrief(); patchHis(); patchSignupText(); decorateMedicationNames(); bindHis(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  bindGlobal();
  setInterval(boot, 1200);
  setTimeout(()=>{ boot(); render(); }, 900);
})();
