(function(){
  'use strict';

  // ======================================================
  // SHARED UTILITIES
  // ======================================================
  function g(name){ try { return window[name] || eval(name); } catch(_){ return window[name]; } }
  function expose(name, value){ window[name] = value; try { eval(name + ' = value'); } catch(_){} }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function current(){ const fn = g('currentPatient'); return typeof fn === 'function' ? fn() : null; }
  function persist(){ const fn = g('persist'); if (typeof fn === 'function') fn(); }
  function render(){ const fn = g('render'); if (typeof fn === 'function') fn(); }
  function section(title, body){ const fn = g('section'); return typeof fn === 'function' ? fn(title, body) : `<div class="card"><div class="card-head"><h3>${esc(title)}</h3></div><div class="card-body">${body}</div></div>`; }
  function val(id){ const el = document.getElementById(id); return el ? el.value : ''; }
  function nowTime(){ const fn = g('nowTime'); return typeof fn === 'function' ? fn() : new Date().toISOString().slice(0,16); }
  function nowDisplay(v){ const fn = g('nowDisplay'); return typeof fn === 'function' ? fn(v) : (v || '--'); }
  function statusClass(v){ const fn = g('statusClass'); return typeof fn === 'function' ? fn(v) : String(v||'').toLowerCase(); }
  function numericValue(v){ const m = String(v==null?'':v).match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : NaN; }
  function isInstructor(){ const cloud = g('cloud') || {}; return /^instructor$/i.test(String(cloud.profile?.role || '').trim()); }

  // ======================================================
  // FIX 1 — REMOVE DUPLICATE "ACTIVE CLINICAL ALERTS"
  // ======================================================
  // Root cause: hct-ehr-final-request-fixes.js wraps rSummary and prepends
  // a new "Active clinical alerts" section. But the original rSummary already
  // contains one. This MutationObserver hides all but the first occurrence.
  function installDedupObserver(){
    if (window.__fix4DedupObserver) return;
    const DEDUP_TITLES = new Set(['active clinical alerts']);
    const deduplicate = () => {
      const seen = new Set();
      document.querySelectorAll('.card-head h3').forEach(h3 => {
        const key = (h3.textContent || '').trim().toLowerCase();
        if (!DEDUP_TITLES.has(key)) return;
        const card = h3.closest('.card');
        if (!card) return;
        if (seen.has(key)) {
          card.style.display = 'none';
        } else {
          card.style.display = '';
          seen.add(key);
        }
      });
    };
    const obs = new MutationObserver(() => {
      clearTimeout(window.__fix4DedupTimer);
      window.__fix4DedupTimer = setTimeout(deduplicate, 60);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    window.__fix4DedupObserver = obs;
    deduplicate();
  }

  // ======================================================
  // FIX 2 — EXPANDED LAB TESTS WITH AUTO RANGE & AUTO FLAG
  // ======================================================
  const EXPANDED_LABS = [
    // Hematology
    {g:'Hematology', name:'CBC - WBC',              range:'4.5-11.0 x10⁹/L',                         lo:4.5,  hi:11,    critLo:1,    critHi:30},
    {g:'Hematology', name:'CBC - RBC',              range:'M: 4.5-5.9; F: 4.0-5.2 x10¹²/L',   lo:4,    hi:5.9,   critLo:2.5,  critHi:7},
    {g:'Hematology', name:'CBC - Hemoglobin',       range:'M: 13.5-17.5 g/dL; F: 12.0-16.0 g/dL',       lo:12,   hi:17.5,  critLo:7,    critHi:20},
    {g:'Hematology', name:'CBC - Hematocrit',       range:'M: 41-53%; F: 36-46%',                         lo:36,   hi:53,    critLo:20,   critHi:60},
    {g:'Hematology', name:'CBC - Platelets',        range:'150-400 x10⁹/L',                          lo:150,  hi:400,   critLo:50,   critHi:1000},
    {g:'Hematology', name:'CBC - Neutrophils',      range:'40-70%',                                        lo:40,   hi:70},
    {g:'Hematology', name:'CBC - Lymphocytes',      range:'20-40%',                                        lo:20,   hi:40},
    {g:'Hematology', name:'CBC - Monocytes',        range:'2-8%',                                          lo:2,    hi:8},
    {g:'Hematology', name:'CBC - Eosinophils',      range:'1-4%',                                          lo:1,    hi:4},
    {g:'Hematology', name:'CBC - Basophils',        range:'0.5-1%',                                        lo:0.5,  hi:1},
    {g:'Hematology', name:'CBC - MCV',              range:'80-100 fL',                                     lo:80,   hi:100},
    {g:'Hematology', name:'CBC - MCH',              range:'27-33 pg',                                      lo:27,   hi:33},
    {g:'Hematology', name:'CBC - MCHC',             range:'32-36 g/dL',                                    lo:32,   hi:36},
    {g:'Hematology', name:'CBC - RDW',              range:'11.5-14.5%',                                    lo:11.5, hi:14.5},
    {g:'Hematology', name:'Reticulocyte Count',     range:'0.5-2.5%',                                      lo:0.5,  hi:2.5},
    // Electrolytes
    {g:'Electrolytes', name:'Sodium',               range:'135-145 mmol/L',                                lo:135,  hi:145,   critLo:120,  critHi:160},
    {g:'Electrolytes', name:'Potassium',            range:'3.5-5.0 mmol/L',                                lo:3.5,  hi:5,     critLo:2.5,  critHi:6.5},
    {g:'Electrolytes', name:'Chloride',             range:'98-107 mmol/L',                                 lo:98,   hi:107,   critLo:80,   critHi:115},
    {g:'Electrolytes', name:'Bicarbonate / CO2',    range:'22-29 mmol/L',                                  lo:22,   hi:29,    critLo:10,   critHi:40},
    {g:'Electrolytes', name:'Calcium',              range:'8.5-10.5 mg/dL',                                lo:8.5,  hi:10.5,  critLo:6,    critHi:13},
    {g:'Electrolytes', name:'Ionized Calcium',      range:'1.12-1.32 mmol/L',                              lo:1.12, hi:1.32,  critLo:0.9,  critHi:1.6},
    {g:'Electrolytes', name:'Magnesium',            range:'1.7-2.2 mg/dL',                                 lo:1.7,  hi:2.2,   critLo:1,    critHi:5},
    {g:'Electrolytes', name:'Phosphorus',           range:'2.5-4.5 mg/dL',                                 lo:2.5,  hi:4.5,   critLo:1,    critHi:8},
    // Renal
    {g:'Renal Function', name:'BUN',                range:'7-20 mg/dL',                                    lo:7,    hi:20,    critHi:100},
    {g:'Renal Function', name:'Creatinine',         range:'M: 0.7-1.3 mg/dL; F: 0.6-1.1 mg/dL',          lo:0.6,  hi:1.3,   critHi:5},
    {g:'Renal Function', name:'eGFR',               range:'>= 60 mL/min/1.73m²',                     lo:60,   hi:200,   critLo:15},
    {g:'Renal Function', name:'BUN/Creatinine Ratio',range:'10-20',                                        lo:10,   hi:20},
    {g:'Renal Function', name:'Uric Acid',          range:'M: 3.4-7.0 mg/dL; F: 2.4-6.0 mg/dL',          lo:2.4,  hi:7},
    // Glucose & Metabolic
    {g:'Glucose & Metabolic', name:'Glucose - Random', range:'70-140 mg/dL',                              lo:70,   hi:140,   critLo:40,   critHi:400},
    {g:'Glucose & Metabolic', name:'Glucose - Fasting', range:'70-99 mg/dL',                              lo:70,   hi:99,    critLo:40,   critHi:400},
    {g:'Glucose & Metabolic', name:'HbA1c',         range:'< 5.7% (Normal); 5.7-6.4% (Pre-DM)',           lo:0,    hi:5.7,   critHi:12},
    {g:'Glucose & Metabolic', name:'Insulin (Fasting)', range:'2-25 μIU/mL',                         lo:2,    hi:25},
    {g:'Glucose & Metabolic', name:'Lactate',       range:'0.5-2.0 mmol/L',                                lo:0.5,  hi:2,     critHi:4},
    {g:'Glucose & Metabolic', name:'Albumin',       range:'3.5-5.0 g/dL',                                  lo:3.5,  hi:5},
    {g:'Glucose & Metabolic', name:'Total Protein', range:'6.0-8.3 g/dL',                                  lo:6,    hi:8.3},
    {g:'Glucose & Metabolic', name:'Ammonia',       range:'15-45 mcg/dL',                                  lo:15,   hi:45,    critHi:100},
    // Liver
    {g:'Liver Function', name:'Total Bilirubin',    range:'0.1-1.2 mg/dL',                                lo:0.1,  hi:1.2,   critHi:15},
    {g:'Liver Function', name:'Direct Bilirubin',   range:'0.0-0.3 mg/dL',                                lo:0,    hi:0.3},
    {g:'Liver Function', name:'Indirect Bilirubin', range:'0.1-0.9 mg/dL',                                lo:0.1,  hi:0.9},
    {g:'Liver Function', name:'AST (SGOT)',          range:'10-40 U/L',                                    lo:10,   hi:40,    critHi:1000},
    {g:'Liver Function', name:'ALT (SGPT)',          range:'7-56 U/L',                                     lo:7,    hi:56,    critHi:1000},
    {g:'Liver Function', name:'Alkaline Phosphatase',range:'44-147 U/L',                                   lo:44,   hi:147},
    {g:'Liver Function', name:'GGT',                range:'M: 8-61 U/L; F: 5-36 U/L',                     lo:5,    hi:61},
    {g:'Liver Function', name:'LDH',                range:'140-280 U/L',                                   lo:140,  hi:280},
    // Pancreatic
    {g:'Pancreatic', name:'Amylase',                range:'30-110 U/L',                                    lo:30,   hi:110,   critHi:400},
    {g:'Pancreatic', name:'Lipase',                 range:'0-160 U/L',                                     lo:0,    hi:160,   critHi:600},
    // Cardiac
    {g:'Cardiac Markers', name:'Troponin I',         range:'< 0.04 ng/mL',                                lo:0,    hi:0.04,  critHi:0.4},
    {g:'Cardiac Markers', name:'Troponin T',         range:'< 0.01 ng/mL',                                lo:0,    hi:0.01,  critHi:0.1},
    {g:'Cardiac Markers', name:'High-Sensitivity Troponin', range:'< 19 ng/L',                            lo:0,    hi:19,    critHi:52},
    {g:'Cardiac Markers', name:'BNP',               range:'< 100 pg/mL',                                   lo:0,    hi:100,   critHi:400},
    {g:'Cardiac Markers', name:'NT-proBNP',         range:'< 125 pg/mL (age < 75)',                        lo:0,    hi:125,   critHi:1000},
    {g:'Cardiac Markers', name:'CK-MB',             range:'0-5 ng/mL',                                     lo:0,    hi:5,     critHi:25},
    {g:'Cardiac Markers', name:'Myoglobin',         range:'< 90 ng/mL',                                    lo:0,    hi:90},
    // Coagulation
    {g:'Coagulation', name:'PT',                    range:'11-13.5 seconds',                               lo:11,   hi:13.5,  critHi:30},
    {g:'Coagulation', name:'INR',                   range:'0.8-1.1 (not anticoagulated)',                  lo:0.8,  hi:1.1,   critHi:5},
    {g:'Coagulation', name:'aPTT',                  range:'25-35 seconds',                                 lo:25,   hi:35,    critHi:80},
    {g:'Coagulation', name:'Fibrinogen',            range:'200-400 mg/dL',                                 lo:200,  hi:400,   critLo:100,  critHi:700},
    {g:'Coagulation', name:'D-dimer',               range:'< 0.5 mcg/mL FEU',                             lo:0,    hi:0.5,   critHi:5},
    {g:'Coagulation', name:'Thrombin Time',         range:'14-19 seconds',                                 lo:14,   hi:19},
    // Inflammatory
    {g:'Inflammatory', name:'CRP',                  range:'< 10 mg/L',                                     lo:0,    hi:10,    critHi:100},
    {g:'Inflammatory', name:'Procalcitonin',        range:'< 0.1 ng/mL',                                   lo:0,    hi:0.1,   critHi:2},
    {g:'Inflammatory', name:'ESR',                  range:'M: 0-15 mm/hr; F: 0-20 mm/hr',                 lo:0,    hi:20},
    {g:'Inflammatory', name:'Ferritin',             range:'M: 12-300 ng/mL; F: 12-150 ng/mL',             lo:12,   hi:300},
    {g:'Inflammatory', name:'IL-6',                 range:'< 7 pg/mL',                                     lo:0,    hi:7},
    // Thyroid
    {g:'Thyroid', name:'TSH',                       range:'0.4-4.0 mIU/L',                                 lo:0.4,  hi:4,     critLo:0.01, critHi:10},
    {g:'Thyroid', name:'Free T4',                   range:'0.8-1.8 ng/dL',                                 lo:0.8,  hi:1.8},
    {g:'Thyroid', name:'Free T3',                   range:'2.3-4.2 pg/mL',                                 lo:2.3,  hi:4.2},
    // Lipids
    {g:'Lipid Panel', name:'Total Cholesterol',     range:'< 200 mg/dL (desirable)',                       lo:0,    hi:200,   critHi:400},
    {g:'Lipid Panel', name:'LDL Cholesterol',       range:'< 100 mg/dL (optimal)',                         lo:0,    hi:100},
    {g:'Lipid Panel', name:'HDL Cholesterol',       range:'> 40 (M) / > 50 (F) mg/dL',                    lo:40,   hi:300},
    {g:'Lipid Panel', name:'Triglycerides',         range:'< 150 mg/dL',                                   lo:0,    hi:150,   critHi:1000},
    // ABG
    {g:'Arterial Blood Gas', name:'ABG - pH',       range:'7.35-7.45',                                     lo:7.35, hi:7.45,  critLo:7.2,  critHi:7.6},
    {g:'Arterial Blood Gas', name:'ABG - PaCO2',    range:'35-45 mmHg',                                    lo:35,   hi:45,    critLo:20,   critHi:70},
    {g:'Arterial Blood Gas', name:'ABG - PaO2',     range:'80-100 mmHg',                                   lo:80,   hi:100,   critLo:50,   critHi:200},
    {g:'Arterial Blood Gas', name:'ABG - HCO3',     range:'22-26 mmol/L',                                  lo:22,   hi:26,    critLo:10,   critHi:40},
    {g:'Arterial Blood Gas', name:'ABG - SaO2',     range:'95-100%',                                       lo:95,   hi:100,   critLo:85},
    {g:'Arterial Blood Gas', name:'ABG - Base Excess', range:'-2 to +2 mEq/L',                            lo:-2,   hi:2},
    // Hormones
    {g:'Hormones', name:'Cortisol (AM)',            range:'6-23 mcg/dL',                                   lo:6,    hi:23},
    {g:'Hormones', name:'PSA',                      range:'< 4 ng/mL',                                     lo:0,    hi:4},
    {g:'Hormones', name:'Serum hCG',                range:'Negative (non-pregnant)',                        text:true},
    {g:'Hormones', name:'HBsAg',                    range:'Negative',                                       text:true},
    {g:'Hormones', name:'Anti-HCV',                 range:'Negative',                                       text:true},
    {g:'Hormones', name:'HIV Antibody',             range:'Negative',                                       text:true},
    // Urinalysis
    {g:'Urinalysis', name:'Urinalysis',             range:'Negative glucose/ketones/nitrites/leukocytes',  text:true},
    {g:'Urinalysis', name:'Urine Specific Gravity', range:'1.005-1.030',                                   lo:1.005,hi:1.03},
    {g:'Urinalysis', name:'Urine pH',               range:'4.5-8.0',                                       lo:4.5,  hi:8},
    {g:'Urinalysis', name:'Urine Protein',          range:'Negative/trace',                                 text:true},
    {g:'Urinalysis', name:'Urine Ketones',          range:'Negative',                                       text:true},
    {g:'Urinalysis', name:'Urine Glucose',          range:'Negative',                                       text:true},
    {g:'Urinalysis', name:'Urine Nitrites',         range:'Negative',                                       text:true},
    {g:'Urinalysis', name:'Urine Bilirubin',        range:'Negative',                                       text:true},
    {g:'Urinalysis', name:'Urine WBC (microscopy)', range:'0-5 /hpf',                                      lo:0,    hi:5},
    {g:'Urinalysis', name:'Urine RBC (microscopy)', range:'0-2 /hpf',                                      lo:0,    hi:2},
    {g:'Urinalysis', name:'24-hr Urine Protein',    range:'< 150 mg/24hr',                                 lo:0,    hi:150},
    {g:'Urinalysis', name:'Creatinine Clearance',   range:'85-125 mL/min',                                 lo:85,   hi:125},
    // Microbiology
    {g:'Microbiology', name:'Blood Culture',        range:'No growth',                                      text:true},
    {g:'Microbiology', name:'Urine Culture',        range:'No growth (< 100,000 CFU/mL)',                   text:true},
    {g:'Microbiology', name:'Sputum Culture',       range:'Normal respiratory flora / no pathogen',         text:true},
    {g:'Microbiology', name:'Wound Culture',        range:'No pathogenic growth',                           text:true},
    {g:'Microbiology', name:'Stool Culture',        range:'No pathogen isolated',                           text:true},
    {g:'Microbiology', name:'CSF Culture',          range:'No growth',                                      text:true},
    {g:'Microbiology', name:'Throat Culture',       range:'Normal flora / no Group A Strep',                text:true},
    // Rapid Tests
    {g:'Rapid Tests', name:'COVID-19 Antigen/PCR',  range:'Negative',                                       text:true},
    {g:'Rapid Tests', name:'Influenza A/B',         range:'Negative',                                       text:true},
    {g:'Rapid Tests', name:'RSV',                   range:'Negative',                                       text:true},
    {g:'Rapid Tests', name:'Dengue NS1 Antigen',    range:'Negative',                                       text:true},
    {g:'Rapid Tests', name:'Malaria RDT',           range:'Negative',                                       text:true},
    {g:'Rapid Tests', name:'Typhoid (Widal)',        range:'Negative or < 1:80 titer',                      text:true},
    {g:'Rapid Tests', name:'Rapid Strep Test',      range:'Negative',                                       text:true},
    // Imaging
    {g:'Imaging', name:'Chest X-ray',              range:'No acute cardiopulmonary abnormality',            imaging:true, text:true},
    {g:'Imaging', name:'Abdominal X-ray',          range:'Non-obstructive bowel gas pattern',               imaging:true, text:true},
    {g:'Imaging', name:'CT Head',                  range:'No acute intracranial abnormality',               imaging:true, text:true},
    {g:'Imaging', name:'CT Chest',                 range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {g:'Imaging', name:'CT Abdomen/Pelvis',        range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {g:'Imaging', name:'MRI Brain',                range:'No acute infarct, hemorrhage, or mass',           imaging:true, text:true},
    {g:'Imaging', name:'MRI Spine',                range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {g:'Imaging', name:'Ultrasound - Abdomen',     range:'No acute abnormality unless otherwise specified', imaging:true, text:true},
    {g:'Imaging', name:'Ultrasound - OB',          range:'Viable intrauterine pregnancy / per OB report',   imaging:true, text:true},
    {g:'Imaging', name:'Doppler Ultrasound - Venous', range:'No DVT identified',                           imaging:true, text:true},
    {g:'Imaging', name:'Echocardiogram',           range:'Normal LV function; EF > 55%',                    imaging:true, text:true},
    {g:'Imaging', name:'ECG / EKG',               range:'Normal sinus rhythm, no acute ST-T changes',      imaging:true, text:true},
    {g:'Imaging', name:'Bone Scan',               range:'No abnormal uptake',                               imaging:true, text:true},
    {g:'Imaging', name:'PET Scan',                range:'No abnormal metabolic activity',                   imaging:true, text:true}
  ];

  function labMetaEx(name){
    if (!name) return null;
    const lower = name.toLowerCase();
    return EXPANDED_LABS.find(t => t.name === name)
        || EXPANDED_LABS.find(t => t.name.toLowerCase() === lower)
        || EXPANDED_LABS.find(t => lower.includes(t.name.toLowerCase()))
        || EXPANDED_LABS.find(t => t.name.toLowerCase().includes(lower));
  }

  function classifyEx(meta, result){
    if (!meta || meta.text || meta.lo == null || meta.hi == null) return 'Normal';
    const n = numericValue(result);
    if (isNaN(n)) return 'Normal';
    if ((meta.critLo != null && n <= meta.critLo) || (meta.critHi != null && n >= meta.critHi)) return 'Critical';
    if (n < meta.lo) return 'Low';
    if (n > meta.hi) return 'High';
    return 'Normal';
  }

  function buildLabOptions(){
    const groups = {};
    EXPANDED_LABS.forEach(t => { if (!groups[t.g]) groups[t.g] = []; groups[t.g].push(t); });
    return '<option value="">-- Select test or imaging --</option>'
      + Object.entries(groups).map(([label, tests]) =>
          `<optgroup label="${esc(label)}">${tests.map(t =>
            `<option value="${esc(t.name)}" data-range="${esc(t.range)}" data-imaging="${t.imaging?'1':'0'}">${esc(t.name)}</option>`
          ).join('')}</optgroup>`
        ).join('');
  }

  function patchLabsExpanded(){
    expose('rLabs', function(){
      const p = current();
      const rows = (p?.labs || []).map((raw, i) => {
        const l = Array.isArray(raw)
          ? {time:raw[0], test:raw[1], result:raw[2], range:raw[3], flag:raw[4], note:raw[5]}
          : (raw || {});
        const meta = labMetaEx(l.test);
        const alertFlag = /^(high|low|critical)$/i.test(String(l.flag || '').trim());
        const img = l.imageData ? `<div class="hct-lab-image"><img src="${esc(l.imageData)}" alt="${esc(l.test)}"></div>` : '';
        return `<tr class="${alertFlag ? 'hct4-alert-row' : ''}">
          <td>${esc(nowDisplay(l.time))}</td>
          <td>${esc(l.test)}${meta?.imaging ? '<span class="badge blue hct4-img-badge">Imaging</span>' : ''}</td>
          <td><strong>${esc(l.result)}</strong>${img}</td>
          <td class="hct4-range-cell">${esc(l.range || meta?.range || '')}</td>
          <td><span class="status ${statusClass(l.flag)} ${alertFlag ? 'hct-lab-alert-flag' : ''}">${esc(l.flag)}</span></td>
          <td class="hct4-note-cell">${esc(l.note || '')}</td>
          <td><button class="btn small danger" data-del-lab="${i}">Delete</button></td>
        </tr>`;
      }).join('');

      const tFn = g('table');
      const tableHtml = typeof tFn === 'function'
        ? tFn(['Time','Test','Result','Reference Range','Flag','Note',''], rows)
        : `<div class="table-wrap"><table><thead><tr><th>Time</th><th>Test</th><th>Result</th><th>Reference Range</th><th>Flag</th><th>Note</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;

      return section('Labs and diagnostics', tableHtml)
        + section('Add lab / diagnostic result',
          `<div class="hct4-lab-form">
            <div class="form-grid">
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Date / Time</label>
                <input id="lab-time" type="datetime-local" value="${nowTime()}">
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Test / Study</label>
                <select id="lab-test">${buildLabOptions()}</select>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Result</label>
                <input id="lab-result" placeholder="Enter result value">
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Flag (auto-set on input)</label>
                <select id="lab-flag">
                  <option>Normal</option><option>High</option><option>Low</option><option>Critical</option><option>Pending</option>
                </select>
              </div>
            </div>
            <div id="hct4-ref-bar" class="hct4-ref-bar" style="display:none;"></div>
            <div class="form-row">
              <label>Reference range</label>
              <div class="grid-2">
                <input id="lab-range" placeholder="Auto-filled on test select" readonly>
                <input id="lab-note" placeholder="Clinical note (optional)">
              </div>
            </div>
            <div class="form-row hct-lab-image-row" style="display:none;">
              <label>Imaging attachment</label>
              <input id="lab-image" type="file" accept="image/*">
            </div>
            <div class="actions">
              <button class="btn primary" id="add-lab">Add result</button>
            </div>
          </div>`);
    });
  }

  function bindLabEvents(){
    const test = document.getElementById('lab-test');
    if (test && !test.dataset.fix4Bound) {
      test.dataset.fix4Bound = '1';
      const sync = () => {
        const meta = labMetaEx(test.value);
        const range = document.getElementById('lab-range');
        const imgRow = document.querySelector('.hct-lab-image-row');
        const result = document.getElementById('lab-result');
        const flag = document.getElementById('lab-flag');
        const refBar = document.getElementById('hct4-ref-bar');
        if (range) range.value = meta?.range || '';
        if (imgRow) imgRow.style.display = meta?.imaging ? '' : 'none';
        if (refBar) {
          if (meta?.range) {
            const critPart = (meta.critLo != null || meta.critHi != null)
              ? `<span class="hct4-ref-crit">Critical: ${meta.critLo != null ? '≤ ' + meta.critLo : ''} ${meta.critHi != null ? '/ ≥ ' + meta.critHi : ''}</span>`
              : '';
            refBar.style.display = '';
            refBar.innerHTML = `<span class="hct4-ref-label">Normal range:</span><span class="hct4-ref-value">${esc(meta.range)}</span>${critPart}`;
          } else {
            refBar.style.display = 'none';
          }
        }
        if (result && flag) {
          const classified = classifyEx(meta, result.value);
          flag.value = classified;
          const colors = {Normal:'var(--success,#16a34a)', High:'var(--warning,#d97706)', Low:'#2563eb', Critical:'var(--danger,#dc2626)', Pending:'var(--muted,#888)'};
          flag.style.color = colors[classified] || '';
          flag.style.fontWeight = classified !== 'Normal' ? '700' : '';
        }
      };
      test.addEventListener('change', sync);
      const resultEl = document.getElementById('lab-result');
      if (resultEl && !resultEl.dataset.fix4ResultBound) {
        resultEl.dataset.fix4ResultBound = '1';
        resultEl.addEventListener('input', sync);
      }
      sync();
    }

    const addBtn = document.getElementById('add-lab');
    if (addBtn && !addBtn.dataset.fix4LabCapture) {
      addBtn.dataset.fix4LabCapture = '1';
      addBtn.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const p = current();
        if (!p) return;
        const testVal = val('lab-test');
        if (!testVal) return;
        const meta = labMetaEx(testVal);
        const file = document.getElementById('lab-image')?.files?.[0];
        const lab = {
          time: val('lab-time'),
          test: testVal,
          result: val('lab-result'),
          range: val('lab-range') || meta?.range || '',
          flag: classifyEx(meta, val('lab-result')),
          note: val('lab-note')
        };
        const done = () => { p.labs = p.labs || []; p.labs.push(lab); persist(); render(); };
        if (file && meta?.imaging) {
          const reader = new FileReader();
          reader.onload = () => { lab.imageData = reader.result; done(); };
          reader.readAsDataURL(file);
        } else {
          done();
        }
      }, true);
    }
  }

  // ======================================================
  // FIX 3 — DEBRIEFING "NEXT" JUMPS TO QUESTION 8
  // ======================================================
  // Root cause: hct-ehr-direct-request-3-fixes.js adds a click listener
  // to #db-next inside setInterval(1000ms) without dedup guards. After
  // N seconds, N listeners fire on each click, incrementing pearlsIndex
  // by N — jumping directly to question N.
  //
  // Fix: a single capture-phase document listener fires before any
  // element-level handlers and calls stopImmediatePropagation so only
  // our authoritative handler executes exactly once per click.
  function installDebriefCapture(){
    if (window.__fix4DebriefCapture) return;
    window.__fix4DebriefCapture = true;

    document.addEventListener('click', function(ev){
      const target = ev.target?.closest?.('#db-next,#db-prev,#db-submit,#save-debrief-fac');
      if (!target) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();

      const p = current();
      if (!p) return;
      p.debriefing = p.debriefing || {};

      // Read question count from rendered wizard to bound index
      const wizardEl = document.querySelector('.hct-debrief-wizard');
      const progressSpan = wizardEl?.querySelector('.hct-debrief-progress span');
      const qsMatch = (progressSpan?.textContent || '').match(/of (\d+)/);
      const totalQs = qsMatch ? Number(qsMatch[1]) : (p.debriefing._cachedQsLength || 8);
      p.debriefing._cachedQsLength = totalQs;

      const idx = Math.max(0, Math.min(Number(p.debriefing.pearlsIndex || 0), totalQs - 1));
      p.debriefing.pearlsResponses = p.debriefing.pearlsResponses || [];
      const answerEl = document.getElementById('db-current-answer');
      if (answerEl) p.debriefing.pearlsResponses[idx] = answerEl.value || '';

      if (target.id === 'db-prev') {
        p.debriefing.pearlsIndex = Math.max(0, idx - 1);
      } else if (target.id === 'db-next') {
        p.debriefing.pearlsIndex = Math.min(totalQs - 1, idx + 1);
      } else if (target.id === 'db-submit') {
        p.debriefing.pearlsSubmittedAt = new Date().toISOString();
      } else if (target.id === 'save-debrief-fac') {
        const facEl = document.getElementById('db-fac-notes');
        if (facEl) p.debriefing.facilNotes = facEl.value || '';
      }
      persist();
      render();
    }, true);
  }

  // ======================================================
  // FIX 4 — ONLINE HIS REAL-TIME SYNC
  // ======================================================
  function patchHISRealtimeSync(){
    if (window.__fix4HISSyncDone) return;
    window.__fix4HISSyncDone = true;

    try {
      // Locate the Supabase client set up by supabase-config.js
      const client = window.supabaseClient
        || (window._supabaseClient)
        || (typeof window.supabase === 'object' && typeof window.supabase.channel === 'function'
            ? window.supabase : null);

      if (client && typeof client.channel === 'function') {
        const tables = ['charts','chart_sessions','his_entries','medications','orders','patients','lab_results'];
        tables.forEach(tbl => {
          try {
            client.channel('fix4-rt-' + tbl)
              .on('postgres_changes', {event:'*', schema:'public', table:tbl}, () => {
                clearTimeout(window.__fix4RTThrottle);
                window.__fix4RTThrottle = setTimeout(() => {
                  const syncFn = window.syncHISData || window.refreshHIS || window.reloadHISData;
                  if (typeof syncFn === 'function') syncFn();
                  render();
                }, 250);
              })
              .subscribe();
          } catch(_){}
        });
      }

      // Tighten polling interval if one already exists
      if (window.__hisPollInterval) clearInterval(window.__hisPollInterval);
      window.__hisPollInterval = setInterval(() => {
        const pullFn = window.pullHISUpdates || window.fetchHISData || window.syncHISData;
        if (typeof pullFn === 'function') pullFn();
      }, 3000);

      // BroadcastChannel for same-origin multi-tab / multi-device sync
      if (typeof BroadcastChannel !== 'undefined' && !window.__fix4BC) {
        const bc = new BroadcastChannel('hct-ehr-sync');
        window.__fix4BC = bc;
        bc.onmessage = (ev) => {
          if (ev.data?.type === 'chart-update') {
            clearTimeout(window.__fix4BCThrottle);
            window.__fix4BCThrottle = setTimeout(render, 150);
          }
        };
        // Hook persist() to broadcast on every save
        const originalPersist = g('persist');
        if (typeof originalPersist === 'function' && !originalPersist.__fix4BCHooked) {
          const hooked = function(){
            originalPersist.apply(this, arguments);
            try { bc.postMessage({type:'chart-update', ts:Date.now()}); } catch(_){}
          };
          hooked.__fix4BCHooked = true;
          expose('persist', hooked);
        }
      }
    } catch(_){}
  }

  // ======================================================
  // FIX 5 — FACULTY FUNCTIONS FOR INSTRUCTOR ACCOUNTS
  // ======================================================
  function patchFacultyAccess(){
    expose('isInstructor', isInstructor);
    expose('canUseFacultyTools', isInstructor);
    expose('isFacultyTab', function(tab){
      return new Set(['modulebuilder','dashboard','statusboard']).has(tab) && !isInstructor();
    });

    // Patch renderNav to ensure faculty tabs are never hidden for instructors
    const nav = g('renderNav');
    if (typeof nav === 'function' && !nav.__fix4FacultyNav) {
      const wrapped = function(){
        let html = nav.apply(this, arguments);
        if (isInstructor()) {
          // Strip any inline display:none on faculty nav buttons
          html = html.replace(
            /(<button[^>]*data-tab="(?:modulebuilder|dashboard|statusboard)"[^>]*)style="[^"]*display\s*:\s*none[^"]*"/gi,
            '$1'
          );
        }
        return html;
      };
      wrapped.__fix4FacultyNav = true;
      expose('renderNav', wrapped);
    }

    // Also fix live DOM — unhide any faculty buttons present right now
    if (isInstructor()) {
      ['modulebuilder','dashboard','statusboard'].forEach(tab => {
        document.querySelectorAll(`[data-tab="${tab}"]`).forEach(btn => {
          btn.style.display = '';
          btn.removeAttribute('hidden');
        });
      });
    }
  }

  // ======================================================
  // FIX 6 — MEDICATION DRUG GUIDE IN HIS AND EHR
  // ======================================================
  function buildDrugHTML(drug){
    if (!drug) return '';
    const brand = Array.isArray(drug.brand) ? drug.brand.join(', ') : (drug.brand || drug.brandName || '');
    const dosage = Array.isArray(drug.dosage)
      ? drug.dosage.map(d => `<div style="margin-bottom:3px;">${esc(d)}</div>`).join('')
      : esc(drug.dosage || drug.dose || '');
    const nursing = Array.isArray(drug.nursing)
      ? drug.nursing.map(n => `<li>${esc(n)}</li>`).join('')
      : (drug.nursing ? `<li>${esc(drug.nursing)}</li>` : '');
    const sideEff = Array.isArray(drug.sideEffects) ? drug.sideEffects.join(', ')
      : (drug.sideEffects || drug.side_effects || drug.commonSideEffects || '');
    const advEff = Array.isArray(drug.adverseEffects) ? drug.adverseEffects.join(', ')
      : (drug.adverseEffects || drug.adverse_effects || drug.adverseReactions || '');
    const indications = Array.isArray(drug.indications) ? drug.indications.join(', ')
      : (drug.indications || drug.uses || drug.indication || '');
    const precautions = Array.isArray(drug.precautions) ? drug.precautions.join('; ')
      : (drug.precautions || drug.contraindications || '');

    const row = (title, content, cls) => content
      ? `<div class="hct4-dg-section${cls ? ' ' + cls : ''}"><div class="hct4-dg-label">${esc(title)}</div><div class="hct4-dg-content">${content}</div></div>`
      : '';

    return `
      <div class="hct4-dg-header">
        <div class="hct4-dg-title-block">
          <h2 class="hct4-dg-title">${esc(drug.generic || drug.name || drug.drug || 'Drug Guide')}</h2>
          ${brand ? `<div class="hct4-dg-brand">Brand name(s): <strong>${esc(brand)}</strong></div>` : ''}
        </div>
        <button class="hct4-dg-close" id="hct4-dg-close" aria-label="Close drug guide">&times;</button>
      </div>
      <div class="hct4-dg-body">
        ${row('Classification', esc(drug.classification || drug.category || drug.drugClass || ''))}
        ${row('Dosage', dosage)}
        ${row('Mechanism of Action', esc(drug.action || drug.mechanismOfAction || drug.mechanism || ''))}
        ${row('Indications / Uses', esc(indications))}
        ${row('Precautions / Contraindications', esc(precautions), 'hct4-dg-warn')}
        ${nursing ? row('Nursing Considerations', `<ul class="hct4-dg-nursing-list">${nursing}</ul>`, 'hct4-dg-nursing') : ''}
        ${row('Side Effects', esc(sideEff))}
        ${row('Adverse Effects / Reactions', esc(advEff), 'hct4-dg-adverse')}
      </div>`;
  }

  function showDrugGuide(drug){
    document.getElementById('hct4-dg-backdrop')?.remove();
    document.getElementById('hct4-dg-modal')?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'hct4-dg-backdrop';
    backdrop.className = 'hct4-dg-backdrop';

    const modal = document.createElement('div');
    modal.id = 'hct4-dg-modal';
    modal.className = 'hct4-dg-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = buildDrugHTML(drug);

    const close = () => { backdrop.remove(); modal.remove(); };
    backdrop.addEventListener('click', close);
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    setTimeout(() => { document.getElementById('hct4-dg-close')?.addEventListener('click', close); }, 50);
  }

  function findDrug(name){
    if (!name) return null;
    const lower = name.toLowerCase();
    const inv = window.HctMedicationInventory;
    const items = Array.isArray(inv) ? inv : (inv?.items || []);
    return items.find(d => (d.generic || d.name || '').toLowerCase() === lower)
        || items.find(d => String(d.brand || d.brandName || '').toLowerCase().includes(lower))
        || items.find(d => lower.includes((d.generic || d.name || '').toLowerCase()));
  }

  function patchDrugGuide(){
    expose('showDrugGuide', showDrugGuide);
    expose('findDrugByName', findDrug);

    if (!window.__fix4DrugDelegate) {
      window.__fix4DrugDelegate = true;
      document.addEventListener('click', ev => {
        const btn = ev.target?.closest?.('[data-drug-guide],[data-med-guide],[data-drug-info]');
        if (!btn) return;
        const name = btn.dataset.drugGuide || btn.dataset.medGuide || btn.dataset.drugInfo;
        const drug = findDrug(name);
        if (drug) {
          showDrugGuide(drug);
        } else if (name) {
          showDrugGuide({
            name, generic: name,
            classification: 'See formulary',
            action: 'Information not available in current inventory',
            indications: 'As ordered by provider',
            precautions: 'Verify with clinical pharmacist',
            nursing: ['Follow institution protocol', 'Verify six rights before administration', 'Monitor for therapeutic effect and adverse reactions'],
            sideEffects: 'See package insert',
            adverseEffects: 'Consult pharmacist or package insert'
          });
        }
      });
    }

    addDrugGuideButtons();
  }

  function addDrugGuideButtons(){
    // Add to MAR / medication list rows
    document.querySelectorAll('[data-med-name]:not([data-dg-injected])').forEach(el => {
      el.dataset.dgInjected = '1';
      const name = el.dataset.medName;
      if (!name) return;
      const btn = document.createElement('button');
      btn.className = 'btn small hct4-dg-btn';
      btn.textContent = 'Drug Guide';
      btn.dataset.drugGuide = name;
      btn.title = 'View drug information for ' + name;
      el.appendChild(btn);
    });

    // Add to HIS medication / inventory cells
    document.querySelectorAll('.his-med-name:not([data-dg-injected]), .med-inventory-name:not([data-dg-injected])').forEach(el => {
      el.dataset.dgInjected = '1';
      const name = (el.textContent || '').trim();
      if (!name) return;
      const btn = document.createElement('button');
      btn.className = 'btn small hct4-dg-btn';
      btn.textContent = 'Drug Guide';
      btn.dataset.drugGuide = name;
      el.parentNode?.insertBefore(btn, el.nextSibling);
    });
  }

  // ======================================================
  // FIX 7 & 8 — MOBILE-FRIENDLY + MODERN UI
  // ======================================================
  function patchMobileAndUI(){
    // Correct viewport meta for mobile
    let vp = document.querySelector('meta[name="viewport"]');
    if (!vp) { vp = document.createElement('meta'); vp.name = 'viewport'; document.head.appendChild(vp); }
    vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';

    // Add CSS hook classes
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.documentElement.classList.add('hct4-touch');
    }
    document.documentElement.classList.add('hct4-modern');
    document.documentElement.classList.toggle('hct4-mobile', window.innerWidth < 768);

    // Update mobile class on resize
    if (!window.__fix4ResizeHandler) {
      window.__fix4ResizeHandler = true;
      window.addEventListener('resize', () => {
        document.documentElement.classList.toggle('hct4-mobile', window.innerWidth < 768);
      });
    }

    // Smooth scroll to top on tab navigation
    if (!window.__fix4NavScroll) {
      window.__fix4NavScroll = true;
      document.addEventListener('click', ev => {
        if (ev.target?.closest?.('.nav-btn')) {
          setTimeout(() => {
            const content = document.querySelector('.main-content, [class*="content"], .card:first-child');
            if (content) content.scrollIntoView({block:'start', behavior:'smooth'});
          }, 100);
        }
      });
    }
  }

  // ======================================================
  // BOOT
  // ======================================================
  function boot(){
    installDedupObserver();   // Fix 1
    patchLabsExpanded();      // Fix 2
    installDebriefCapture();  // Fix 3
    patchHISRealtimeSync();   // Fix 4
    patchFacultyAccess();     // Fix 5
    patchDrugGuide();         // Fix 6
    patchMobileAndUI();       // Fix 7 & 8
    bindLabEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  setTimeout(() => { boot(); render(); }, 900);
  setInterval(() => { bindLabEvents(); patchFacultyAccess(); addDrugGuideButtons(); }, 800);
})();
