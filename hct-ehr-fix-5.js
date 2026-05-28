/* ============================================================
   HCT EHR Fix 5
   Issue 1: Color scheme / text visibility  (CSS handles)
   Issue 2: Modern interactive dropdowns    (CSS handles)
   Issue 3: Lab tests not visible + range   (patchLabSelect)
   Issue 4: HIS ward clickable navigation  (enhanceWardGrid)
   Issue 5: Instructor role → faculty HIS  (fixInstructorRole)
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITIES
     ---------------------------------------------------------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ----------------------------------------------------------
     FIX 5 — INSTRUCTOR ROLE ACCESS
     Root cause 1: hospital-online-mode.js isFac() only accepts
       role === 'instructor', failing for cloud role 'faculty'.
     Root cause 2: hct-ehr-github-bugfixes.js normalizeRole() only
       updates localStorage if it already contains an instructor
       token — fresh logins stay as 'student'.
     Fix: after cloud profile loads, normalise cloud.profile.role
       to 'instructor' for all instructor-class accounts, and
       unconditionally set localStorage hct_role to 'faculty'.
     ---------------------------------------------------------- */
  var INSTR_RE = /^(instructor|faculty|teacher|doctor|admin|administrator)$/i;

  function fixInstructorRole() {
    try {
      var cloud = window.cloud;
      if (!cloud || !cloud.profile) return;
      var rawRole = String(cloud.profile.role || '').toLowerCase().trim();
      if (!INSTR_RE.test(rawRole)) return;

      // 1. Always write localStorage so faculty() in chart-upgrade works
      if (localStorage.getItem('hct_role') !== 'faculty') {
        localStorage.setItem('hct_role', 'faculty');
      }

      // 2. Normalise cloud.profile.role to 'instructor' so isFac() works
      if (rawRole !== 'instructor') {
        try {
          Object.defineProperty(cloud.profile, 'role', {
            get: function () { return 'instructor'; },
            set: function () { /* intentional no-op */ },
            configurable: true,
            enumerable: true
          });
        } catch (e) {
          try { cloud.profile.role = 'instructor'; } catch (_) {}
        }
      }

      // 3. Also expose on window so any remaining checks resolve
      if (typeof window.isInstructor === 'function' && !window.isInstructor()) {
        window.isInstructor = function () { return true; };
      }
      if (typeof window.canUseFacultyTools === 'function' && !window.canUseFacultyTools()) {
        window.canUseFacultyTools = function () { return true; };
      }
    } catch (e) {}
  }

  /* ----------------------------------------------------------
     FIX 3 — EXPANDED LAB TESTS IN DROPDOWN
     Injects the full EXPANDED_LABS list (with proper optgroups)
     directly into #lab-test whenever it appears in the DOM.
     This bypasses any closure-captured rLabs() reference so
     it works regardless of which script defined rLabs.
     ---------------------------------------------------------- */
  var FIX5_LABS = [
    // Hematology
    { g: 'Hematology', name: 'CBC - WBC',            range: '4.5–11.0 x10⁹/L',                      lo: 4.5,  hi: 11,    critLo: 1,   critHi: 30 },
    { g: 'Hematology', name: 'CBC - RBC',            range: 'M: 4.5–5.9 / F: 4.0–5.2 x10\xb9\xb2/L', lo: 4,    hi: 5.9,   critLo: 2.5, critHi: 7 },
    { g: 'Hematology', name: 'CBC - Hemoglobin',     range: 'M: 13.5–17.5 g/dL / F: 12.0–16.0 g/dL', lo: 12,   hi: 17.5,  critLo: 7,   critHi: 20 },
    { g: 'Hematology', name: 'CBC - Hematocrit',     range: 'M: 41–53% / F: 36–46%',                  lo: 36,   hi: 53,    critLo: 20,  critHi: 60 },
    { g: 'Hematology', name: 'CBC - Platelets',      range: '150–400 x10⁹/L',                         lo: 150,  hi: 400,   critLo: 50,  critHi: 1000 },
    { g: 'Hematology', name: 'CBC - Neutrophils',    range: '40–70%',                                       lo: 40,   hi: 70 },
    { g: 'Hematology', name: 'CBC - Lymphocytes',    range: '20–40%',                                       lo: 20,   hi: 40 },
    { g: 'Hematology', name: 'CBC - Monocytes',      range: '2–8%',                                         lo: 2,    hi: 8 },
    { g: 'Hematology', name: 'CBC - Eosinophils',    range: '1–4%',                                         lo: 1,    hi: 4 },
    { g: 'Hematology', name: 'CBC - MCV',            range: '80–100 fL',                                    lo: 80,   hi: 100 },
    { g: 'Hematology', name: 'CBC - MCHC',           range: '32–36 g/dL',                                   lo: 32,   hi: 36 },
    { g: 'Hematology', name: 'Reticulocyte Count',   range: '0.5–2.5%',                                     lo: 0.5,  hi: 2.5 },
    // Electrolytes
    { g: 'Electrolytes', name: 'Sodium',             range: '135–145 mmol/L',                               lo: 135,  hi: 145,  critLo: 120, critHi: 160 },
    { g: 'Electrolytes', name: 'Potassium',          range: '3.5–5.0 mmol/L',                               lo: 3.5,  hi: 5,    critLo: 2.5, critHi: 6.5 },
    { g: 'Electrolytes', name: 'Chloride',           range: '98–107 mmol/L',                                lo: 98,   hi: 107,  critLo: 80,  critHi: 115 },
    { g: 'Electrolytes', name: 'Bicarbonate / CO2',  range: '22–29 mmol/L',                                 lo: 22,   hi: 29,   critLo: 10,  critHi: 40 },
    { g: 'Electrolytes', name: 'Calcium',            range: '8.5–10.5 mg/dL',                               lo: 8.5,  hi: 10.5, critLo: 6,   critHi: 13 },
    { g: 'Electrolytes', name: 'Ionized Calcium',    range: '1.12–1.32 mmol/L',                             lo: 1.12, hi: 1.32, critLo: 0.9, critHi: 1.6 },
    { g: 'Electrolytes', name: 'Magnesium',          range: '1.7–2.2 mg/dL',                                lo: 1.7,  hi: 2.2,  critLo: 1,   critHi: 5 },
    { g: 'Electrolytes', name: 'Phosphorus',         range: '2.5–4.5 mg/dL',                                lo: 2.5,  hi: 4.5,  critLo: 1,   critHi: 8 },
    // Renal Function
    { g: 'Renal Function', name: 'BUN',              range: '7–20 mg/dL',                                   lo: 7,    hi: 20,   critHi: 100 },
    { g: 'Renal Function', name: 'Creatinine',       range: 'M: 0.7–1.3 mg/dL / F: 0.6–1.1 mg/dL',   lo: 0.6,  hi: 1.3,  critHi: 5 },
    { g: 'Renal Function', name: 'eGFR',             range: '≥ 60 mL/min/1.73m\xb2',                        lo: 60,   hi: 200,  critLo: 15 },
    { g: 'Renal Function', name: 'Uric Acid',        range: 'M: 3.4–7.0 mg/dL / F: 2.4–6.0 mg/dL',   lo: 2.4,  hi: 7 },
    // Glucose & Metabolic
    { g: 'Glucose & Metabolic', name: 'Glucose - Random',  range: '70–140 mg/dL',                           lo: 70,   hi: 140,  critLo: 40,  critHi: 400 },
    { g: 'Glucose & Metabolic', name: 'Glucose - Fasting', range: '70–99 mg/dL',                            lo: 70,   hi: 99,   critLo: 40,  critHi: 400 },
    { g: 'Glucose & Metabolic', name: 'HbA1c',             range: '< 5.7% (Normal) / 5.7–6.4% (Pre-DM)',    lo: 0,    hi: 5.7,  critHi: 12 },
    { g: 'Glucose & Metabolic', name: 'Lactate',            range: '0.5–2.0 mmol/L',                         lo: 0.5,  hi: 2,    critHi: 4 },
    { g: 'Glucose & Metabolic', name: 'Albumin',            range: '3.5–5.0 g/dL',                           lo: 3.5,  hi: 5 },
    { g: 'Glucose & Metabolic', name: 'Total Protein',      range: '6.0–8.3 g/dL',                           lo: 6,    hi: 8.3 },
    { g: 'Glucose & Metabolic', name: 'Ammonia',            range: '15–45 mcg/dL',                           lo: 15,   hi: 45,   critHi: 100 },
    // Liver Function
    { g: 'Liver Function', name: 'Total Bilirubin',  range: '0.1–1.2 mg/dL',                                lo: 0.1,  hi: 1.2,  critHi: 15 },
    { g: 'Liver Function', name: 'Direct Bilirubin', range: '0.0–0.3 mg/dL',                                lo: 0,    hi: 0.3 },
    { g: 'Liver Function', name: 'AST (SGOT)',        range: '10–40 U/L',                                    lo: 10,   hi: 40,   critHi: 1000 },
    { g: 'Liver Function', name: 'ALT (SGPT)',        range: '7–56 U/L',                                     lo: 7,    hi: 56,   critHi: 1000 },
    { g: 'Liver Function', name: 'Alkaline Phosphatase', range: '44–147 U/L',                               lo: 44,   hi: 147 },
    { g: 'Liver Function', name: 'GGT',               range: 'M: 8–61 U/L / F: 5–36 U/L',              lo: 5,    hi: 61 },
    { g: 'Liver Function', name: 'LDH',               range: '140–280 U/L',                                  lo: 140,  hi: 280 },
    // Pancreatic
    { g: 'Pancreatic', name: 'Amylase',              range: '30–110 U/L',                                    lo: 30,   hi: 110,  critHi: 400 },
    { g: 'Pancreatic', name: 'Lipase',               range: '0–160 U/L',                                     lo: 0,    hi: 160,  critHi: 600 },
    // Cardiac Markers
    { g: 'Cardiac Markers', name: 'Troponin I',               range: '< 0.04 ng/mL',                              lo: 0,    hi: 0.04, critHi: 0.4 },
    { g: 'Cardiac Markers', name: 'Troponin T',               range: '< 0.01 ng/mL',                              lo: 0,    hi: 0.01, critHi: 0.1 },
    { g: 'Cardiac Markers', name: 'High-Sensitivity Troponin', range: '< 19 ng/L',                                lo: 0,    hi: 19,   critHi: 52 },
    { g: 'Cardiac Markers', name: 'BNP',                      range: '< 100 pg/mL',                               lo: 0,    hi: 100,  critHi: 400 },
    { g: 'Cardiac Markers', name: 'NT-proBNP',                range: '< 125 pg/mL (age < 75)',                    lo: 0,    hi: 125,  critHi: 1000 },
    { g: 'Cardiac Markers', name: 'CK-MB',                    range: '0–5 ng/mL',                            lo: 0,    hi: 5,    critHi: 25 },
    // Coagulation
    { g: 'Coagulation', name: 'PT',         range: '11–13.5 seconds',                                        lo: 11,   hi: 13.5, critHi: 30 },
    { g: 'Coagulation', name: 'INR',        range: '0.8–1.1 (not anticoagulated)',                           lo: 0.8,  hi: 1.1,  critHi: 5 },
    { g: 'Coagulation', name: 'aPTT',       range: '25–35 seconds',                                          lo: 25,   hi: 35,   critHi: 80 },
    { g: 'Coagulation', name: 'Fibrinogen', range: '200–400 mg/dL',                                          lo: 200,  hi: 400,  critLo: 100, critHi: 700 },
    { g: 'Coagulation', name: 'D-dimer',    range: '< 0.5 mcg/mL FEU',                                           lo: 0,    hi: 0.5,  critHi: 5 },
    // Inflammatory Markers
    { g: 'Inflammatory Markers', name: 'CRP',           range: '< 10 mg/L',                                       lo: 0,    hi: 10,   critHi: 100 },
    { g: 'Inflammatory Markers', name: 'Procalcitonin', range: '< 0.1 ng/mL',                                     lo: 0,    hi: 0.1,  critHi: 2 },
    { g: 'Inflammatory Markers', name: 'ESR',           range: 'M: 0–15 mm/hr / F: 0–20 mm/hr',         lo: 0,    hi: 20 },
    { g: 'Inflammatory Markers', name: 'Ferritin',      range: 'M: 12–300 ng/mL / F: 12–150 ng/mL',    lo: 12,   hi: 300 },
    // Thyroid
    { g: 'Thyroid', name: 'TSH',     range: '0.4–4.0 mIU/L',   lo: 0.4, hi: 4,    critLo: 0.01, critHi: 10 },
    { g: 'Thyroid', name: 'Free T4', range: '0.8–1.8 ng/dL',   lo: 0.8, hi: 1.8 },
    { g: 'Thyroid', name: 'Free T3', range: '2.3–4.2 pg/mL',   lo: 2.3, hi: 4.2 },
    // Lipid Panel
    { g: 'Lipid Panel', name: 'Total Cholesterol', range: '< 200 mg/dL (desirable)', lo: 0,  hi: 200, critHi: 400 },
    { g: 'Lipid Panel', name: 'LDL Cholesterol',   range: '< 100 mg/dL (optimal)',   lo: 0,  hi: 100 },
    { g: 'Lipid Panel', name: 'HDL Cholesterol',   range: '> 40 (M) / > 50 (F) mg/dL', lo: 40, hi: 300 },
    { g: 'Lipid Panel', name: 'Triglycerides',     range: '< 150 mg/dL',             lo: 0,  hi: 150, critHi: 1000 },
    // Arterial Blood Gas
    { g: 'Arterial Blood Gas', name: 'ABG - pH',          range: '7.35–7.45',         lo: 7.35, hi: 7.45, critLo: 7.2, critHi: 7.6 },
    { g: 'Arterial Blood Gas', name: 'ABG - PaCO2',       range: '35–45 mmHg',         lo: 35,   hi: 45,   critLo: 20,  critHi: 70 },
    { g: 'Arterial Blood Gas', name: 'ABG - PaO2',        range: '80–100 mmHg',        lo: 80,   hi: 100,  critLo: 50,  critHi: 200 },
    { g: 'Arterial Blood Gas', name: 'ABG - HCO3',        range: '22–26 mmol/L',       lo: 22,   hi: 26,   critLo: 10,  critHi: 40 },
    { g: 'Arterial Blood Gas', name: 'ABG - SaO2',        range: '95–100%',            lo: 95,   hi: 100,  critLo: 85 },
    { g: 'Arterial Blood Gas', name: 'ABG - Base Excess', range: '-2 to +2 mEq/L',          lo: -2,   hi: 2 },
    // Urinalysis
    { g: 'Urinalysis', name: 'Urinalysis',              range: 'Negative glucose/ketones/nitrites/leukocytes',   text: true },
    { g: 'Urinalysis', name: 'Urine Specific Gravity',  range: '1.005–1.030',                               lo: 1.005, hi: 1.03 },
    { g: 'Urinalysis', name: 'Urine pH',                range: '4.5–8.0',                                   lo: 4.5, hi: 8 },
    { g: 'Urinalysis', name: 'Urine Protein',           range: 'Negative/trace',                                  text: true },
    { g: 'Urinalysis', name: 'Urine Ketones',           range: 'Negative',                                        text: true },
    { g: 'Urinalysis', name: 'Urine Glucose',           range: 'Negative',                                        text: true },
    { g: 'Urinalysis', name: 'Urine WBC (microscopy)',  range: '0–5 /hpf',                                  lo: 0, hi: 5 },
    { g: 'Urinalysis', name: 'Urine RBC (microscopy)',  range: '0–2 /hpf',                                  lo: 0, hi: 2 },
    { g: 'Urinalysis', name: 'Creatinine Clearance',    range: '85–125 mL/min',                             lo: 85, hi: 125 },
    { g: 'Urinalysis', name: 'Pregnancy Test - hCG',    range: 'Negative unless pregnant',                        text: true },
    // Microbiology
    { g: 'Microbiology', name: 'Blood Culture',   range: 'No growth',                                             text: true },
    { g: 'Microbiology', name: 'Urine Culture',   range: 'No growth (< 100,000 CFU/mL)',                          text: true },
    { g: 'Microbiology', name: 'Sputum Culture',  range: 'Normal respiratory flora / no pathogen',                text: true },
    { g: 'Microbiology', name: 'Wound Culture',   range: 'No pathogenic growth',                                  text: true },
    { g: 'Microbiology', name: 'Stool Culture',   range: 'No pathogen isolated',                                  text: true },
    { g: 'Microbiology', name: 'CSF Culture',     range: 'No growth',                                             text: true },
    { g: 'Microbiology', name: 'Throat Culture',  range: 'Normal flora / no Group A Strep',                       text: true },
    // Rapid Tests
    { g: 'Rapid Tests', name: 'COVID-19 Antigen/PCR',  range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'Influenza A/B',          range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'RSV',                    range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'Dengue NS1 Antigen',     range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'Malaria RDT',            range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'Typhoid (Widal)',         range: 'Negative or < 1:80 titer',         text: true },
    { g: 'Rapid Tests', name: 'Rapid Strep Test',       range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'HBsAg',                  range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'Anti-HCV',               range: 'Negative',                         text: true },
    { g: 'Rapid Tests', name: 'HIV Antibody',           range: 'Negative',                         text: true },
    // Imaging
    { g: 'Imaging', name: 'Chest X-ray',              range: 'No acute cardiopulmonary abnormality',              imaging: true, text: true },
    { g: 'Imaging', name: 'Abdominal X-ray',          range: 'Non-obstructive bowel gas pattern',                 imaging: true, text: true },
    { g: 'Imaging', name: 'CT Head',                  range: 'No acute intracranial abnormality',                 imaging: true, text: true },
    { g: 'Imaging', name: 'CT Chest',                 range: 'No acute abnormality unless otherwise specified',   imaging: true, text: true },
    { g: 'Imaging', name: 'CT Abdomen/Pelvis',        range: 'No acute abnormality unless otherwise specified',   imaging: true, text: true },
    { g: 'Imaging', name: 'MRI Brain',                range: 'No acute infarct, hemorrhage, or mass',             imaging: true, text: true },
    { g: 'Imaging', name: 'MRI Spine',                range: 'No acute abnormality unless otherwise specified',   imaging: true, text: true },
    { g: 'Imaging', name: 'Ultrasound - Abdomen',     range: 'No acute abnormality unless otherwise specified',   imaging: true, text: true },
    { g: 'Imaging', name: 'Ultrasound - OB',          range: 'Viable intrauterine pregnancy / per OB report',     imaging: true, text: true },
    { g: 'Imaging', name: 'Doppler Ultrasound - Venous', range: 'No DVT identified',                             imaging: true, text: true },
    { g: 'Imaging', name: 'Echocardiogram',           range: 'Normal LV function; EF > 55%',                     imaging: true, text: true },
    { g: 'Imaging', name: 'ECG / EKG',               range: 'Normal sinus rhythm, no acute ST-T changes',        imaging: true, text: true },
    { g: 'Imaging', name: 'PET Scan',                range: 'No abnormal metabolic activity',                     imaging: true, text: true }
  ];

  function buildFix5LabOptions() {
    var groups = {};
    FIX5_LABS.forEach(function (t) {
      if (!groups[t.g]) groups[t.g] = [];
      groups[t.g].push(t);
    });
    return '<option value="">-- Select test or imaging --</option>'
      + Object.keys(groups).map(function (label) {
          var tests = groups[label];
          return '<optgroup label="' + esc(label) + '">'
            + tests.map(function (t) {
                return '<option value="' + esc(t.name) + '" data-range="' + esc(t.range) + '" data-imaging="' + (t.imaging ? '1' : '0') + '">'
                  + esc(t.name) + '</option>';
              }).join('')
            + '</optgroup>';
        }).join('');
  }

  function getLabMeta(name) {
    if (!name) return null;
    var lower = name.toLowerCase();
    return FIX5_LABS.find(function (t) { return t.name === name; })
      || FIX5_LABS.find(function (t) { return t.name.toLowerCase() === lower; })
      || FIX5_LABS.find(function (t) { return lower.includes(t.name.toLowerCase()); });
  }

  function autoFlag(meta, resultStr) {
    if (!meta || meta.text || meta.lo == null || meta.hi == null) return 'Normal';
    var m = String(resultStr || '').match(/-?\d+(?:\.\d+)?/);
    if (!m) return 'Normal';
    var n = Number(m[0]);
    if ((meta.critLo != null && n <= meta.critLo) || (meta.critHi != null && n >= meta.critHi)) return 'Critical';
    if (n < meta.lo) return 'Low';
    if (n > meta.hi) return 'High';
    return 'Normal';
  }

  function syncLabRangeUI(testName) {
    var meta = getLabMeta(testName);
    var rangeEl  = document.getElementById('lab-range');
    var imgRow   = document.querySelector('.hct-lab-image-row');
    var refBar   = document.getElementById('hct4-ref-bar');
    var resultEl = document.getElementById('lab-result');
    var flagEl   = document.getElementById('lab-flag');

    if (rangeEl)  rangeEl.value = meta ? meta.range : '';
    if (imgRow)   imgRow.style.display = (meta && meta.imaging) ? '' : 'none';

    if (refBar) {
      if (meta && meta.range) {
        var critText = '';
        if (meta.critLo != null || meta.critHi != null) {
          critText = '<span class="hct4-ref-crit">Critical: '
            + (meta.critLo != null ? '≤ ' + meta.critLo + ' ' : '')
            + (meta.critHi != null ? '/ ≥ ' + meta.critHi : '')
            + '</span>';
        }
        refBar.style.display = '';
        refBar.innerHTML = '<span class="hct4-ref-label">Reference range:</span>'
          + '<span class="hct4-ref-value">' + esc(meta.range) + '</span>'
          + critText;
      } else {
        refBar.style.display = 'none';
      }
    }

    if (resultEl && flagEl && meta) {
      var classified = autoFlag(meta, resultEl.value);
      flagEl.value = classified;
      var colors = { Normal: 'var(--success,#16a34a)', High: '#d97706', Low: '#2563eb', Critical: 'var(--danger,#dc2626)', Pending: 'var(--muted,#888)' };
      flagEl.style.color = colors[classified] || '';
      flagEl.style.fontWeight = classified !== 'Normal' ? '700' : '';
    }
  }

  function patchLabSelect() {
    var sel = document.getElementById('lab-test');
    if (!sel || sel.dataset.fix5Patched) return;

    // If it already has the "Cardiac Markers" optgroup we added, skip
    if (sel.querySelector('optgroup[label="Cardiac Markers"]')) {
      sel.dataset.fix5Patched = '1';
      bindLabSelectEvents(sel);
      return;
    }

    var prevVal = sel.value;
    sel.innerHTML = buildFix5LabOptions();
    sel.dataset.fix5Patched = '1';

    // Restore previous selection if possible
    if (prevVal) {
      var opt = sel.querySelector('option[value="' + prevVal.replace(/"/g, '\\"') + '"]');
      if (opt) sel.value = prevVal;
    }

    bindLabSelectEvents(sel);
    syncLabRangeUI(sel.value);
  }

  function bindLabSelectEvents(sel) {
    if (sel.dataset.fix5Events) return;
    sel.dataset.fix5Events = '1';

    sel.addEventListener('change', function () {
      syncLabRangeUI(this.value);
    });

    var resultEl = document.getElementById('lab-result');
    if (resultEl && !resultEl.dataset.fix5Bound) {
      resultEl.dataset.fix5Bound = '1';
      resultEl.addEventListener('input', function () {
        var labSel = document.getElementById('lab-test');
        if (labSel) syncLabRangeUI(labSel.value);
      });
    }
  }

  /* ----------------------------------------------------------
     FIX 4 — HIS WARD NAVIGATION
     Replaces static .hisx-ward divs with clickable buttons.
     All standard wards are shown even if currently empty.
     Clicking navigates to the Patients tab and filters by ward.
     ---------------------------------------------------------- */
  var STANDARD_WARDS = [
    { id: 'ICU',       label: 'Intensive Care Unit (ICU)' },
    { id: 'Medical',   label: 'Medical-Surgical Ward' },
    { id: 'Surgical',  label: 'Surgical Ward' },
    { id: 'Emergency', label: 'Emergency Department' },
    { id: 'Pediatrics',label: 'Pediatric Ward' },
    { id: 'OB-GYN',   label: 'OB-GYN / Labor & Delivery' },
    { id: 'Psychiatry',label: 'Psychiatric Ward' },
    { id: 'Neurology', label: 'Neurology Ward' },
    { id: 'NICU',      label: 'Neonatal ICU (NICU)' },
    { id: 'PACU',      label: 'Recovery / PACU' }
  ];

  // Map from standard ward id to various alternative names found in patient data
  var WARD_ALIASES = {
    'Medical':    ['medical', 'med-surg', 'medical-surgical', 'general'],
    'Surgical':   ['surgical', 'surgery', 'surg'],
    'Pediatrics': ['pediatrics', 'pediatric', 'peds'],
    'Psychiatry': ['psychiatry', 'psychiatric', 'psych', 'mental'],
    'NICU':       ['nicu', 'neonatal'],
    'PACU':       ['pacu', 'recovery', 'post-op']
  };

  function enhanceWardGrid() {
    var grid = document.querySelector('.hisx-wardgrid');
    if (!grid || grid.dataset.fix5Ward) return;
    grid.dataset.fix5Ward = '1';

    // Harvest existing ward counts from current content
    var wardCounts = {};
    grid.querySelectorAll('div, button').forEach(function (el) {
      var strong = el.querySelector('strong');
      var span   = el.querySelector('span');
      if (!strong) return;
      var wardName   = strong.textContent.trim();
      var countMatch = span ? span.textContent.match(/\d+/) : null;
      if (wardName) wardCounts[wardName] = countMatch ? parseInt(countMatch[0], 10) : 0;
    });

    // Ensure every standard ward is represented (with 0 if absent)
    STANDARD_WARDS.forEach(function (w) {
      if (wardCounts[w.id] != null) return; // exact id already present
      // Check aliases
      var found = Object.keys(wardCounts).some(function (k) {
        var kl = k.toLowerCase();
        var aliases = WARD_ALIASES[w.id] || [];
        return kl === w.id.toLowerCase() || aliases.indexOf(kl) !== -1;
      });
      if (!found) wardCounts[w.id] = 0;
    });

    // Sort: non-empty wards first, then alphabetical
    var entries = Object.keys(wardCounts).map(function (k) {
      return { id: k, count: wardCounts[k] };
    }).sort(function (a, b) {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      return a.id.localeCompare(b.id);
    });

    grid.innerHTML = entries.map(function (entry) {
      var wardInfo   = STANDARD_WARDS.find(function (w) { return w.id === entry.id; });
      var label      = wardInfo ? wardInfo.label : entry.id;
      var hasPatients = entry.count > 0;
      return '<button class="hisx-ward-btn ' + (hasPatients ? 'has-patients' : 'empty') + '" '
        + 'data-ward="' + esc(entry.id) + '" type="button">'
        + '<span class="ward-name">' + esc(label) + '</span>'
        + '<span class="ward-count">' + entry.count + ' patient' + (entry.count !== 1 ? 's' : '') + '</span>'
        + (hasPatients ? '<span class="hisx-ward-arrow">&#8594;</span>' : '')
        + '</button>';
    }).join('');

    // Bind click handlers
    grid.querySelectorAll('.hisx-ward-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navigateToWard(this.dataset.ward);
      });
    });
  }

  function navigateToWard(wardId) {
    // 1. Click the "Patients" nav button (works for both HIS versions)
    var patientsBtn = document.querySelector(
      '[data-his-module="patients"], [data-hisx-mod="patients"]'
    );
    if (patientsBtn) patientsBtn.click();

    // 2. After navigation renders, set the ward filter
    setTimeout(function () {
      // Approach A: ward dropdown (hospital-online-mode.js)
      var wardSel = document.getElementById('hisx-ward');
      if (wardSel) {
        var opts  = Array.from(wardSel.options);
        var lower = wardId.toLowerCase();
        var match = opts.find(function (o) { return o.value === wardId; })
          || opts.find(function (o) { return o.value.toLowerCase() === lower; })
          || opts.find(function (o) {
               return o.value.toLowerCase().includes(lower.split('-')[0])
                 || lower.includes(o.value.toLowerCase());
             });
        if (match) {
          wardSel.value = match.value;
          wardSel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Approach B: search input (hospital-online-chart-upgrade.js)
      var searchEl = document.getElementById('his-search') || document.getElementById('hisx-search');
      if (searchEl && !wardSel) {
        searchEl.value = wardId;
        searchEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 220);
  }

  /* ----------------------------------------------------------
     DOM OBSERVER — runs all DOM patches after any render
     ---------------------------------------------------------- */
  function runDomFixes() {
    patchLabSelect();
    enhanceWardGrid();
  }

  var _fix5timer = null;
  var _fix5obs = new MutationObserver(function (mutations) {
    var relevant = mutations.some(function (m) { return m.addedNodes.length > 0; });
    if (!relevant) return;
    clearTimeout(_fix5timer);
    _fix5timer = setTimeout(runDomFixes, 120);
  });

  try {
    _fix5obs.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}

  /* ----------------------------------------------------------
     BOOT — execute all fixes at several lifecycle points
     ---------------------------------------------------------- */
  function boot() {
    fixInstructorRole();
    runDomFixes();
  }

  // Immediate (in case DOM is already ready)
  fixInstructorRole();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Retry at increasing intervals to catch async cloud auth
  [300, 700, 1500, 3000, 5000].forEach(function (ms) {
    setTimeout(fixInstructorRole, ms);
  });

  // Periodic sweeps for dynamically-rendered content
  setTimeout(runDomFixes, 800);
  setTimeout(runDomFixes, 2000);
  setInterval(function () {
    fixInstructorRole();
    runDomFixes();
  }, 2000);
})();
