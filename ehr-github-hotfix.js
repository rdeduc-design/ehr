(function(){
  "use strict";

  const RIGHTS = [
    "Right patient",
    "Right medication",
    "Right dose",
    "Right route",
    "Right time",
    "Right documentation",
    "Right reason / indication",
    "Right assessment",
    "Right education",
    "Right evaluation / response"
  ];
  const WEB_CACHE = "hct_ehr_web_drug_reference_v2";

  function cleanBranding(root){
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/HCT ABT/g, "HCT EHR")
        .replace(/Aptitude and Behavioral Profile Test/gi, "Electronic Health Record Simulation")
        .replace(/Behavioral Profile Test/gi, "Electronic Health Record Simulation");
    });
  }

  function patchFacultyAndCalculator(){
    if (typeof cloud === "undefined" || typeof state === "undefined") return;
    window.isInstructor = function(){ return (cloud.profile || {}).role === "instructor"; };
    window.canUseFacultyTools = function(){ return window.isInstructor() || (typeof canAccessAnalytics === "function" && canAccessAnalytics()); };
    window.isFacultyTab = function(tab){ return new Set(["modulebuilder","dashboard","statusboard"]).has(tab) && !window.canUseFacultyTools(); };
    window.renderNav = function(){
      const hasAnalytics = window.canUseFacultyTools();
      const t = (window.state||state).tab;
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
    };
    window.rMedCalc = function(){
      return section("Medication calculator", `<div class="grid two"><div><h4>Dose by weight</h4>${calcInput("Weight (kg)","calc-weight")}${calcInput("Ordered dose (mg/kg)","calc-ordered")}${calcInput("Concentration (mg/mL)","calc-concentration")}${calcInput("Safe minimum (mg/kg)","calc-min")}${calcInput("Safe maximum (mg/kg)","calc-max")}</div><div><h4>IV rate / drip rate</h4>${calcInput("Total volume (mL)","calc-volume")}${calcInput("Infusion time (hours)","calc-hours")}${calcInput("Infusion time (minutes)","calc-minutes")}${calcInput("Drop factor (gtt/mL)","calc-drop-factor")}<div class="actions" style="justify-content:flex-start;margin-top:12px;"><button class="btn primary" id="calc-run">Calculate</button><button class="btn" id="calc-clear">Clear</button></div></div></div><div id="calc-result" class="summary-card" style="margin-top:16px;">Enter values, then calculate. Always verify with facility policy and the medication order.</div>`);
    };
    window.renderTab = function(){
      const tab = window.isFacultyTab(state.tab) ? "summary" : state.tab;
      const map = {his:rHis,summary:rSummary,orders:rOrders,labs:rLabs,vitals:rVitals,assessment:rAssessment,meds:rMeds,io:rIO,notes:rNotes,careplan:rCarePlan,education:rEducation,sbar:rSbar,reasoning:rReasoning,medcalc:window.rMedCalc,debriefing:rDebriefing,progress:rProgress,scenarios:rScenarios,newpatient:rNewPatient,dashboard:rDashboard,statusboard:rStatusBoard,peerreview:rPeerReview,report:rReport,modulebuilder:rModuleBuilder};
      return (map[tab] || rSummary)();
    };
    const originalBind = window.bindTabEvents;
    window.bindTabEvents = function(){
      originalBind?.();
      document.getElementById("calc-run")?.addEventListener("click", runMedicationCalc);
      document.getElementById("calc-clear")?.addEventListener("click", () => {
        document.querySelectorAll("#calc-weight,#calc-ordered,#calc-concentration,#calc-volume,#calc-hours,#calc-minutes,#calc-drop-factor,#calc-min,#calc-max").forEach(el => el.value = "");
        const result = document.getElementById("calc-result");
        if (result) result.textContent = "Enter values, then calculate. Always verify with facility policy and the medication order.";
      });
    };
  }

  function calcInput(label,id){ return `<div class="form-row"><label>${label}</label><input id="${id}" type="number" step="0.01"></div>`; }
  function num(id){ const n = Number(document.getElementById(id)?.value); return Number.isFinite(n) ? n : 0; }
  function runMedicationCalc(){
    const weight = num("calc-weight"), ordered = num("calc-ordered"), concentration = num("calc-concentration");
    const volume = num("calc-volume"), hours = num("calc-hours"), minutes = num("calc-minutes"), drop = num("calc-drop-factor");
    const min = num("calc-min"), max = num("calc-max");
    const dose = weight && ordered ? weight * ordered : 0;
    const vol = dose && concentration ? dose / concentration : 0;
    const rate = volume && hours ? volume / hours : 0;
    const gtt = volume && minutes && drop ? volume * drop / minutes : 0;
    const low = weight && min ? weight * min : 0, high = weight && max ? weight * max : 0;
    const safe = low && high && dose ? (dose >= low && dose <= high ? "Within entered safe range" : "Outside entered safe range - recheck order") : "Enter safe range to compare";
    const rows = [["Total ordered dose", dose ? `${dose.toFixed(2)} mg` : "--"],["Volume to administer", vol ? `${vol.toFixed(2)} mL` : "--"],["IV pump rate", rate ? `${rate.toFixed(2)} mL/hr` : "--"],["Manual drip rate", gtt ? `${Math.round(gtt)} gtt/min` : "--"],["Safe dose check", safe]];
    const result = document.getElementById("calc-result");
    if (result) result.innerHTML = rows.map(([k,v]) => `<div class="field"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("");
  }

  function patchMedicationGuide(){
    const inv = window.HctMedicationInventory;
    if (!inv?.items?.length || inv.__ehrHotfix) return;
    inv.__ehrHotfix = true;
    const oldFind = inv.find;
    inv.find = function(value){
      const key = norm(typeof value === "object" ? (value.id || value.name || value.generic) : value);
      if (!key) return null;
      const scored = inv.items.map(item => {
        const id = norm(item.id), generic = norm(item.generic), name = norm(item.name).replace(/\b\d+(\s?mg|mcg|g|ml|l|units?|iu|meq|%)?\b.*$/i,"").trim();
        const aliases = norm(item.aliases).split(" ").filter(x => x.length > 3);
        let score = key === id || key === generic || key === name ? 100 : generic && key.startsWith(generic) ? 90 : name && key.startsWith(name) ? 85 : 0;
        if (!score && aliases.some(a => key === a)) score = 70;
        return {item,score};
      }).filter(x => x.score >= 70).sort((a,b) => b.score - a.score)[0];
      return scored?.item || oldFind.call(inv, value);
    };
    inv.cardHtml = function(raw){
      const item = typeof raw === "object" ? raw : inv.find(raw);
      if (!item) return "";
      const ref = conciseRef(item);
      const qrPayload = `hct-ehr-med:${item.id}`;
      const pairs = [["Drug class","drugClass",ref.drugClass],["Indications","indications",ref.indications],["Mechanism","mechanism",ref.mechanism],["Uses","uses",ref.indications],["Precautions","precautions",ref.precautions],["Nursing considerations","nursing",ref.nursing],["Contraindications / screen first","contraindications",ref.contraindications],["Side effects","sideEffects",ref.sideEffects],["Adverse effects","adverseEffects",ref.adverseEffects]];
      return `<div class="drug-reference-backdrop" data-drug-close></div><aside class="drug-reference-panel" role="dialog" aria-modal="true" aria-label="${esc(ref.genericName)} drug reference" data-med-id="${esc(item.id)}" data-qr-payload="${esc(qrPayload)}"><div class="drug-reference-head"><div><small>${esc(item.category || "Drug reference")}</small><h3>${esc(ref.genericName)}</h3><p>${esc(ref.displayName)}${item.brand ? ` | Brand examples: ${esc(item.brand)}` : ""}</p><p>Web-first nursing reference</p></div><button class="drug-reference-close" data-drug-close aria-label="Close">x</button></div><div class="drug-dose-row">${(item.doses || []).map(d => `<span>${esc(d)}</span>`).join("")}</div><div class="drug-qr-box"><div class="drug-qr" data-drug-qr="${esc(item.id)}"></div><div><strong>Medication QR</strong><p>Scan this medication code to open the 10 rights verification checklist before administration.</p><button class="drug-info-btn" data-drug-scan="${esc(item.id)}">Scan / verify</button></div></div><dl>${pairs.map(([k,f,v]) => `<div><dt>${esc(k)}</dt><dd data-ref-field="${esc(f)}">${esc(v)}</dd></div>`).join("")}</dl><div class="drug-web-status" data-web-status>Loading current DailyMed/RxNav reference...</div><div class="drug-reference-sources" data-web-sources><a href="https://dailymed.nlm.nih.gov/dailymed/" target="_blank" rel="noopener">DailyMed</a><a href="https://lhncbc.nlm.nih.gov/RxNav/APIs/index.html" target="_blank" rel="noopener">RxNav/RxNorm</a><a href="https://medlineplus.gov/druginfo/meds/index.html" target="_blank" rel="noopener">MedlinePlus</a></div></aside>`;
    };
    inv.showCard = function(target,id){
      const item = inv.find(id);
      if (!item) return;
      document.querySelectorAll(".drug-reference-panel,.drug-reference-backdrop,.drug-verify-modal").forEach(el => el.remove());
      const wrap = document.createElement("div");
      wrap.innerHTML = inv.cardHtml(item);
      const backdrop = wrap.firstElementChild, panel = backdrop.nextElementSibling;
      document.body.append(backdrop, panel);
      renderQr(panel, item);
      loadWebRef(panel, item);
      requestAnimationFrame(() => panel.classList.add("open"));
      panel.querySelector("[data-drug-close]")?.addEventListener("click", closeDrugPanels);
      backdrop.addEventListener("click", closeDrugPanels);
      panel.querySelector("[data-drug-scan]")?.addEventListener("click", () => scanQr(item.id));
    };
    inv.bindDrugCards = function(root){
      (root || document).querySelectorAll("[data-med-info]").forEach(el => {
        if (el.dataset.drugBoundHotfix) return;
        el.dataset.drugBoundHotfix = "1";
        el.addEventListener("click", e => { e.preventDefault(); inv.showCard(el, el.dataset.medInfo); });
      });
    };
    inv.rebuildReferenceJson = function(){
      window.HctDrugReferenceJSON = { name:"HCT EHR web-first drug reference", sourceMode:"Cards fetch current DailyMed SPL labeling and RxNav/RxNorm identity data, with concise local fallback when offline.", totalCount:inv.items.length, sources:["DailyMed","RxNav/RxNorm","MedlinePlus"], drugs:inv.items.map(conciseRef) };
      return window.HctDrugReferenceJSON;
    };
    inv.rebuildReferenceJson();
  }

  function norm(v){ return String(v || "").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
  function compact(v,fallback){ const clean = String(v || "").replace(/\s+/g," ").trim(); return clean ? (clean.length > 180 ? `${clean.slice(0,177)}...` : clean) : fallback; }
  function conciseRef(item){ return { id:item.id, genericName:item.generic || item.name, displayName:item.name || item.generic, drugClass:item.classification || item.category || "Drug reference", indications:compact(item.indications || item.uses,"Use per current order and approved indication."), mechanism:compact(item.action,"See current official labeling."), precautions:compact(item.precautions || item.contraindications,"Screen allergies, organ impairment, pregnancy/lactation concerns, and interactions."), contraindications:compact(item.contraindications || item.precautions,"Screen patient-specific restrictions before giving."), nursing:compact(item.nursing,"Verify 10 rights, allergies, labs, hold parameters, and response."), sideEffects:compact(item.sideEffects || item.adverseEffects,"Monitor expected reactions."), adverseEffects:compact(item.adverseEffects || item.sideEffects,"Escalate serious reactions per policy.") }; }
  function closeDrugPanels(){ document.querySelectorAll(".drug-reference-panel,.drug-reference-backdrop,.drug-verify-modal").forEach(el => el.remove()); }
  function renderQr(panel,item){ const box = panel.querySelector("[data-drug-qr]"); const payload = panel.dataset.qrPayload || `hct-ehr-med:${item.id}`; if (box && window.QRCode) new window.QRCode(box,{text:payload,width:112,height:112,correctLevel:window.QRCode.CorrectLevel?.M}); else if (box) box.textContent = payload; }
  function parseQr(raw){ const text = String(raw || ""); const m = text.match(/hct-ehr-med:([a-z0-9-]+)/i); return m ? m[1] : ""; }
  function showChecklist(id,scanned){ const item = window.HctMedicationInventory?.find(id); if(!item)return; const wrap=document.createElement("div"); wrap.innerHTML=`<div class="drug-verify-modal" role="dialog" aria-modal="true"><div class="drug-verify-card"><div class="drug-reference-head"><div><small>Medication administration verification</small><h3>${esc(item.generic || item.name)}</h3><p>${esc(scanned ? "QR scan matched this medication entry." : "Manual verification checklist.")}</p></div><button class="drug-reference-close" data-drug-close aria-label="Close">x</button></div><div class="drug-verify-list">${RIGHTS.map((r,i)=>`<label><input type="checkbox" data-med-right="${i}"><span>${esc(r)}</span></label>`).join("")}</div><div class="drug-verify-actions"><button class="btn primary" data-med-verify-done disabled>Complete verification</button></div></div></div>`; const modal=wrap.firstElementChild; document.body.appendChild(modal); const done=modal.querySelector("[data-med-verify-done]"); modal.querySelector("[data-drug-close]")?.addEventListener("click",()=>modal.remove()); modal.querySelectorAll("[data-med-right]").forEach(input=>input.addEventListener("change",()=>{done.disabled=modal.querySelectorAll("[data-med-right]:checked").length!==RIGHTS.length;})); done.addEventListener("click",()=>{modal.remove(); toast?.(`10 rights verified for ${item.generic || item.name}`);}); }
  async function scanQr(expectedId){ if(!navigator.mediaDevices?.getUserMedia || !("BarcodeDetector" in window)){ showChecklist(expectedId); return; } const wrap=document.createElement("div"); wrap.innerHTML=`<div class="drug-verify-modal"><div class="drug-verify-card"><div class="drug-reference-head"><div><small>Camera scanner</small><h3>Scan medication QR</h3><p>Point the camera at a medication QR code.</p></div><button class="drug-reference-close" data-drug-close aria-label="Close">x</button></div><video class="drug-scan-video" autoplay playsinline muted></video><p class="drug-scan-status">Waiting for camera permission...</p><div class="drug-verify-actions"><button class="btn" data-manual-verify>Use checklist without scan</button></div></div></div>`; const modal=wrap.firstElementChild; document.body.appendChild(modal); const video=modal.querySelector("video"), status=modal.querySelector(".drug-scan-status"); let stream; const stop=()=>{stream?.getTracks?.().forEach(t=>t.stop()); modal.remove();}; modal.querySelector("[data-drug-close]")?.addEventListener("click",stop); modal.querySelector("[data-manual-verify]")?.addEventListener("click",()=>{stop();showChecklist(expectedId);}); try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}); video.srcObject=stream; status.textContent="Scanning..."; const detector=new BarcodeDetector({formats:["qr_code"]}); const tick=async()=>{const codes=await detector.detect(video).catch(()=>[]); const id=parseQr(codes[0]?.rawValue); if(id){stop(); showChecklist(id,true); if(expectedId && id!==expectedId) toast?.("Scanned QR is for a different medication."); return;} setTimeout(tick,350);}; tick();}catch(e){status.textContent="Camera unavailable. Use the checklist button to verify manually.";}}
  async function loadWebRef(panel,item){ const status=panel.querySelector("[data-web-status]"); const key=norm(item.generic || item.name || item.id); const cache=JSON.parse(localStorage.getItem(WEB_CACHE) || "{}"); if(cache[key] && Date.now()-cache[key].at < 2592000000) return applyWebRef(panel,cache[key].data,status); const q=encodeURIComponent(item.generic || item.name || ""); const data={sources:{dailyMed:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${q}`,rxNav:`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${q}`}}; try{const res=await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${q}`); const json=await res.json(); const spl=json?.data?.[0]; if(spl?.setid){data.setid=spl.setid; const xml=await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${encodeURIComponent(spl.setid)}.xml`).then(r=>r.text()); const doc=new DOMParser().parseFromString(xml,"application/xml"); data.indications=splText(doc,["INDICATIONS AND USAGE","INDICATIONS"]); data.mechanism=splText(doc,["CLINICAL PHARMACOLOGY","MECHANISM"]); data.precautions=splText(doc,["WARNINGS AND PRECAUTIONS","PRECAUTIONS"]); data.contraindications=splText(doc,["CONTRAINDICATIONS"]); data.adverseEffects=splText(doc,["ADVERSE REACTIONS","ADVERSE"]);}}catch(e){} cache[key]={at:Date.now(),data}; localStorage.setItem(WEB_CACHE,JSON.stringify(cache)); applyWebRef(panel,data,status); }
  function splText(doc,names){ const sec=Array.from(doc.querySelectorAll("section")).find(s=>names.some(n=>(s.querySelector("title")?.textContent || "").toUpperCase().includes(n))); return compact(sec?.querySelector("text")?.textContent || sec?.textContent,""); }
  function applyWebRef(panel,data,status){ const fields={indications:data.indications,uses:data.indications,mechanism:data.mechanism,precautions:data.precautions,contraindications:data.contraindications,adverseEffects:data.adverseEffects,sideEffects:data.adverseEffects}; Object.entries(fields).forEach(([f,v])=>{if(v){const el=panel.querySelector(`[data-ref-field="${f}"]`); if(el)el.textContent=v;}}); const links=[["DailyMed search",data.sources?.dailyMed],data.setid?["DailyMed SPL",`https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${encodeURIComponent(data.setid)}`]:null,["RxNav API",data.sources?.rxNav],["MedlinePlus medicines","https://medlineplus.gov/druginfo/meds/index.html"]].filter(Boolean); const box=panel.querySelector("[data-web-sources]"); if(box)box.innerHTML=links.map(([l,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join(""); if(status)status.textContent=data.setid ? "Current web reference loaded from DailyMed/RxNav." : "Web lookup completed; showing concise local fallback where label sections were unavailable."; }

  function install(){
    patchFacultyAndCalculator();
    patchMedicationGuide();
    cleanBranding(document.body);
    window.HctMedicationInventory?.bindDrugCards?.(document);
    if (typeof render === "function") render();
    setTimeout(() => cleanBranding(document.body), 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
