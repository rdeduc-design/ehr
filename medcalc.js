// ═══════════════════════════════════════════════════════════════════════════
// HCT EHR — MEDICATION CALCULATOR & CALCULATION CHECKER
// medcalc.js  |  Include AFTER app.js in index.html
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ── Helpers ───────────────────────────────────────────────────────────────
  function E(v) {
    return String(v ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }
  function round(n, d = 2) {
    return Math.round(n * 10 ** d) / 10 ** d;
  }
  function num(id) {
    return parseFloat(document.getElementById(id)?.value ?? '') || 0;
  }
  function sel(id) {
    return document.getElementById(id)?.value ?? '';
  }
  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function currentPt() {
    return (typeof currentPatient === 'function') ? currentPatient() : null;
  }

  // ── Calculator definitions ─────────────────────────────────────────────
  // Each entry: { id, label, icon, category, fields[], calculate() → {steps[], answer, warning?, log} }
  const CALCULATORS = [

    // ── 1. Dose by weight ───────────────────────────────────────────────
    {
      id: 'dose_weight',
      label: 'Dose by weight',
      icon: '⚖️',
      category: 'Basic',
      description: 'Calculate a dose (mg, mcg, units) based on patient weight.',
      fields: [
        { id: 'dw_dose_per_kg', label: 'Ordered dose', placeholder: 'e.g. 0.1', unit: 'mg/kg or mcg/kg or units/kg', type: 'number' },
        { id: 'dw_unit',       label: 'Dose unit',     type: 'select',
          options: ['mg/kg','mcg/kg','units/kg','mEq/kg','g/kg','IU/kg'] },
        { id: 'dw_weight',     label: 'Patient weight', placeholder: 'e.g. 70', unit: 'kg', type: 'number' },
        { id: 'dw_max_dose',   label: 'Max single dose (optional)', placeholder: 'e.g. 500', unit: 'mg', type: 'number' },
        { id: 'dw_freq',       label: 'Frequency',     type: 'select',
          options: ['Once','Every 4h','Every 6h','Every 8h','Every 12h','Every 24h','PRN'] },
      ],
      autofill(p) {
        if (!p) return {};
        return { dw_weight: p.weight || '' };
      },
      calculate() {
        const dosePerKg = num('dw_dose_per_kg');
        const weight    = num('dw_weight');
        const max       = num('dw_max_dose');
        const unit      = sel('dw_unit');
        const freq      = sel('dw_freq');
        if (!dosePerKg || !weight) return null;

        const rawDose   = round(dosePerKg * weight, 3);
        const finalDose = (max > 0 && rawDose > max) ? max : rawDose;
        const capped    = max > 0 && rawDose > max;
        const baseUnit  = unit.replace('/kg', '');

        const steps = [
          { label: 'Ordered dose', expr: `${dosePerKg} ${unit}`, value: '' },
          { label: 'Patient weight', expr: `${weight} kg`, value: '' },
          { label: 'Raw dose calculation', expr: `${dosePerKg} ${unit} × ${weight} kg`, value: `${rawDose} ${baseUnit}` },
          ...(capped ? [{ label: '⚠ Max dose cap applied', expr: `Raw dose ${rawDose} ${baseUnit} exceeds max ${max} ${baseUnit}`, value: `Capped at ${max} ${baseUnit}` }] : []),
          { label: 'Final dose to administer', expr: ``, value: `${finalDose} ${baseUnit}` },
          { label: 'Frequency', expr: '', value: freq },
        ];

        return {
          steps,
          answer: `${finalDose} ${baseUnit} ${freq}`,
          warning: capped ? `Dose capped at maximum single dose of ${max} ${baseUnit}` : null,
          log: `Dose by weight: ${dosePerKg} ${unit} × ${weight} kg = ${finalDose} ${baseUnit} ${freq}${capped ? ' (capped at max)' : ''}`,
        };
      },
    },

    // ── 2. IV Flow rate (mL/hr) ─────────────────────────────────────────
    {
      id: 'iv_rate',
      label: 'IV flow rate (mL/hr)',
      icon: '💉',
      category: 'IV Therapy',
      description: 'Calculate infusion rate in mL/hr from volume and time.',
      fields: [
        { id: 'ivr_volume', label: 'Volume to infuse', placeholder: 'e.g. 1000', unit: 'mL', type: 'number' },
        { id: 'ivr_hours',  label: 'Infusion time',    placeholder: 'e.g. 8',    unit: 'hours', type: 'number' },
      ],
      calculate() {
        const vol  = num('ivr_volume');
        const hrs  = num('ivr_hours');
        if (!vol || !hrs) return null;
        const rate = round(vol / hrs, 1);
        return {
          steps: [
            { label: 'Formula', expr: 'Volume (mL) ÷ Time (hr)', value: '' },
            { label: 'Calculation', expr: `${vol} mL ÷ ${hrs} hr`, value: `${rate} mL/hr` },
          ],
          answer: `${rate} mL/hr`,
          log: `IV rate: ${vol} mL over ${hrs} hr = ${rate} mL/hr`,
        };
      },
    },

    // ── 3. IV drip rate (gtts/min) ──────────────────────────────────────
    {
      id: 'drip_rate',
      label: 'Drip rate (gtts/min)',
      icon: '🔬',
      category: 'IV Therapy',
      description: 'Calculate manual IV drip rate in drops per minute.',
      fields: [
        { id: 'dr_volume',  label: 'Volume',         placeholder: 'e.g. 500',  unit: 'mL',     type: 'number' },
        { id: 'dr_hours',   label: 'Infusion time',  placeholder: 'e.g. 4',    unit: 'hours',  type: 'number' },
        { id: 'dr_gtts',    label: 'Drop factor',    type: 'select',
          options: ['10 gtts/mL (macrodrip)','15 gtts/mL (macrodrip)','20 gtts/mL (macrodrip)','60 gtts/mL (microdrip)'] },
      ],
      calculate() {
        const vol  = num('dr_volume');
        const hrs  = num('dr_hours');
        const gttsStr = sel('dr_gtts');
        const factor  = parseInt(gttsStr) || 10;
        if (!vol || !hrs) return null;
        const rate  = round((vol * factor) / (hrs * 60), 0);
        return {
          steps: [
            { label: 'Formula', expr: '(Volume × Drop factor) ÷ (Time in hr × 60 min)', value: '' },
            { label: 'Numerator', expr: `${vol} mL × ${factor} gtts/mL`, value: `${vol * factor} gtts` },
            { label: 'Denominator', expr: `${hrs} hr × 60 min`, value: `${hrs * 60} min` },
            { label: 'Drip rate', expr: `${vol * factor} ÷ ${hrs * 60}`, value: `${rate} gtts/min` },
          ],
          answer: `${rate} gtts/min`,
          log: `Drip rate: ${vol} mL × ${factor} gtts/mL ÷ (${hrs} hr × 60) = ${rate} gtts/min`,
        };
      },
    },

    // ── 4. Concentration & dose in mL ──────────────────────────────────
    {
      id: 'dose_volume',
      label: 'Dose → volume to draw',
      icon: '💊',
      category: 'Basic',
      description: 'How many mL to draw based on available concentration.',
      fields: [
        { id: 'dv_ordered',   label: 'Dose ordered',       placeholder: 'e.g. 250',  unit: 'mg (or mcg, units)', type: 'number' },
        { id: 'dv_conc',      label: 'Available strength',  placeholder: 'e.g. 500',  unit: 'mg', type: 'number' },
        { id: 'dv_conc_vol',  label: 'Available volume',    placeholder: 'e.g. 2',    unit: 'mL', type: 'number' },
      ],
      calculate() {
        const ordered  = num('dv_ordered');
        const strength = num('dv_conc');
        const vol      = num('dv_conc_vol');
        if (!ordered || !strength || !vol) return null;
        const mL = round((ordered / strength) * vol, 3);
        return {
          steps: [
            { label: 'Formula', expr: '(Dose ordered ÷ Dose on hand) × Volume on hand', value: '' },
            { label: 'Step 1 — dose ratio', expr: `${ordered} ÷ ${strength}`, value: `${round(ordered / strength, 4)}` },
            { label: 'Step 2 — multiply by volume', expr: `${round(ordered / strength, 4)} × ${vol} mL`, value: `${mL} mL` },
          ],
          answer: `Draw ${mL} mL`,
          warning: mL > 10 ? 'Volume >10 mL — verify dose or concentration.' : null,
          log: `Volume to draw: (${ordered} ÷ ${strength}) × ${vol} mL = ${mL} mL`,
        };
      },
    },

    // ── 5. Weight-based infusion (mcg/kg/min) ──────────────────────────
    {
      id: 'mcg_kg_min',
      label: 'Infusion (mcg/kg/min → mL/hr)',
      icon: '🫀',
      category: 'Critical Care',
      description: 'Convert mcg/kg/min (or mcg/min) orders to mL/hr for pump programming.',
      fields: [
        { id: 'mkm_dose',      label: 'Ordered dose',     placeholder: 'e.g. 5',    unit: 'mcg/kg/min', type: 'number' },
        { id: 'mkm_weight',    label: 'Patient weight',   placeholder: 'e.g. 70',   unit: 'kg', type: 'number' },
        { id: 'mkm_drug_mg',   label: 'Drug in bag',      placeholder: 'e.g. 400',  unit: 'mg', type: 'number' },
        { id: 'mkm_bag_vol',   label: 'Bag volume',       placeholder: 'e.g. 250',  unit: 'mL', type: 'number' },
      ],
      autofill(p) {
        if (!p) return {};
        return { mkm_weight: p.weight || '' };
      },
      calculate() {
        const dose    = num('mkm_dose');
        const weight  = num('mkm_weight');
        const drugMg  = num('mkm_drug_mg');
        const bagVol  = num('mkm_bag_vol');
        if (!dose || !weight || !drugMg || !bagVol) return null;

        const concMcgPerML = round((drugMg * 1000) / bagVol, 2);  // mcg/mL
        const doseTotal    = round(dose * weight, 3);              // mcg/min
        const mLPerMin     = round(doseTotal / concMcgPerML, 4);   // mL/min
        const mLPerHr      = round(mLPerMin * 60, 2);              // mL/hr

        return {
          steps: [
            { label: 'Step 1 — bag concentration', expr: `(${drugMg} mg × 1000) ÷ ${bagVol} mL`, value: `${concMcgPerML} mcg/mL` },
            { label: 'Step 2 — total dose (mcg/min)', expr: `${dose} mcg/kg/min × ${weight} kg`, value: `${doseTotal} mcg/min` },
            { label: 'Step 3 — mL/min', expr: `${doseTotal} mcg/min ÷ ${concMcgPerML} mcg/mL`, value: `${mLPerMin} mL/min` },
            { label: 'Step 4 — convert to mL/hr', expr: `${mLPerMin} mL/min × 60`, value: `${mLPerHr} mL/hr` },
          ],
          answer: `Set pump to ${mLPerHr} mL/hr`,
          log: `mcg/kg/min: ${dose} mcg/kg/min × ${weight} kg, bag ${drugMg} mg/${bagVol} mL → ${mLPerHr} mL/hr`,
        };
      },
    },

    // ── 6. Insulin infusion (units/hr → mL/hr) ─────────────────────────
    {
      id: 'insulin_infusion',
      label: 'Insulin infusion (units/hr → mL/hr)',
      icon: '🩸',
      category: 'Critical Care',
      description: 'Convert insulin infusion order in units/hr to pump rate.',
      fields: [
        { id: 'ins_units_hr',  label: 'Ordered rate',  placeholder: 'e.g. 5',   unit: 'units/hr', type: 'number' },
        { id: 'ins_total_u',   label: 'Units in bag',  placeholder: 'e.g. 100', unit: 'units',    type: 'number' },
        { id: 'ins_bag_vol',   label: 'Bag volume',    placeholder: 'e.g. 100', unit: 'mL',       type: 'number' },
      ],
      calculate() {
        const rate   = num('ins_units_hr');
        const units  = num('ins_total_u');
        const vol    = num('ins_bag_vol');
        if (!rate || !units || !vol) return null;

        const concUperML = round(units / vol, 4);
        const mLPerHr    = round(rate / concUperML, 2);

        return {
          steps: [
            { label: 'Step 1 — bag concentration', expr: `${units} units ÷ ${vol} mL`, value: `${concUperML} units/mL` },
            { label: 'Step 2 — pump rate', expr: `${rate} units/hr ÷ ${concUperML} units/mL`, value: `${mLPerHr} mL/hr` },
          ],
          answer: `Set pump to ${mLPerHr} mL/hr`,
          warning: 'HIGH-ALERT — verify with second nurse before programming pump.',
          log: `Insulin infusion: ${rate} units/hr, bag ${units} units/${vol} mL → ${mLPerHr} mL/hr`,
        };
      },
    },

    // ── 7. Heparin infusion ─────────────────────────────────────────────
    {
      id: 'heparin',
      label: 'Heparin infusion (units/hr → mL/hr)',
      icon: '🧪',
      category: 'Critical Care',
      description: 'Convert heparin units/hr order to pump mL/hr.',
      fields: [
        { id: 'hep_units_hr',  label: 'Ordered rate',  placeholder: 'e.g. 1200', unit: 'units/hr', type: 'number' },
        { id: 'hep_total_u',   label: 'Units in bag',  placeholder: 'e.g. 25000',unit: 'units',    type: 'number' },
        { id: 'hep_bag_vol',   label: 'Bag volume',    placeholder: 'e.g. 250',  unit: 'mL',       type: 'number' },
      ],
      calculate() {
        const rate  = num('hep_units_hr');
        const units = num('hep_total_u');
        const vol   = num('hep_bag_vol');
        if (!rate || !units || !vol) return null;
        const conc    = round(units / vol, 2);
        const mLPerHr = round(rate / conc, 2);
        return {
          steps: [
            { label: 'Step 1 — bag concentration', expr: `${units} units ÷ ${vol} mL`, value: `${conc} units/mL` },
            { label: 'Step 2 — pump rate', expr: `${rate} units/hr ÷ ${conc} units/mL`, value: `${mLPerHr} mL/hr` },
          ],
          answer: `Set pump to ${mLPerHr} mL/hr`,
          warning: 'HIGH-ALERT — dual verification required for heparin infusions.',
          log: `Heparin: ${rate} units/hr, bag ${units} units/${vol} mL → ${mLPerHr} mL/hr`,
        };
      },
    },

    // ── 8. Pediatric weight-based bolus ────────────────────────────────
    {
      id: 'peds_bolus',
      label: 'Pediatric fluid bolus',
      icon: '👶',
      category: 'Pediatrics',
      description: 'Calculate NS/LR bolus volume (20 mL/kg) for a pediatric patient.',
      fields: [
        { id: 'pb_weight',  label: 'Patient weight', placeholder: 'e.g. 22',  unit: 'kg',       type: 'number' },
        { id: 'pb_mlkg',    label: 'mL per kg',      placeholder: 'e.g. 20',  unit: 'mL/kg',    type: 'number' },
        { id: 'pb_time',    label: 'Infuse over',    placeholder: 'e.g. 0.5', unit: 'hours',    type: 'number' },
        { id: 'pb_max_vol', label: 'Max volume',     placeholder: 'e.g. 500', unit: 'mL (optional)', type: 'number' },
      ],
      autofill(p) {
        if (!p) return {};
        return { pb_weight: p.weight || '' };
      },
      calculate() {
        const wt   = num('pb_weight');
        const mlkg = num('pb_mlkg') || 20;
        const hrs  = num('pb_time') || 0.5;
        const max  = num('pb_max_vol');
        if (!wt) return null;

        const rawVol   = round(wt * mlkg, 0);
        const finalVol = (max > 0 && rawVol > max) ? max : rawVol;
        const capped   = max > 0 && rawVol > max;
        const rate     = round(finalVol / hrs, 0);

        return {
          steps: [
            { label: 'Formula', expr: `${mlkg} mL/kg × weight`, value: '' },
            { label: 'Raw bolus volume', expr: `${mlkg} mL/kg × ${wt} kg`, value: `${rawVol} mL` },
            ...(capped ? [{ label: '⚠ Capped at max volume', expr: `${rawVol} mL exceeds max`, value: `${finalVol} mL` }] : []),
            { label: 'Infuse over', expr: '', value: `${hrs} hour(s)` },
            { label: 'Pump rate', expr: `${finalVol} mL ÷ ${hrs} hr`, value: `${rate} mL/hr` },
          ],
          answer: `${finalVol} mL over ${hrs} hr (${rate} mL/hr)`,
          warning: capped ? `Volume capped at ${finalVol} mL` : null,
          log: `Peds bolus: ${mlkg} mL/kg × ${wt} kg = ${finalVol} mL at ${rate} mL/hr`,
        };
      },
    },

    // ── 9. Maintenance fluids (Holliday-Segar) ─────────────────────────
    {
      id: 'maintenance',
      label: 'Maintenance fluids (Holliday-Segar)',
      icon: '🚰',
      category: 'Pediatrics',
      description: 'Calculate 24-hr maintenance fluid requirement and hourly rate.',
      fields: [
        { id: 'mf_weight', label: 'Patient weight', placeholder: 'e.g. 18', unit: 'kg', type: 'number' },
      ],
      autofill(p) {
        if (!p) return {};
        return { mf_weight: p.weight || '' };
      },
      calculate() {
        const wt = num('mf_weight');
        if (!wt) return null;

        let daily = 0;
        let breakdown = [];
        if (wt <= 10) {
          daily = wt * 100;
          breakdown = [`${wt} kg × 100 mL/kg = ${wt * 100} mL`];
        } else if (wt <= 20) {
          daily = 1000 + (wt - 10) * 50;
          breakdown = [`First 10 kg: 10 × 100 = 1000 mL`, `Next ${wt - 10} kg: ${wt - 10} × 50 = ${(wt - 10) * 50} mL`, `Total: ${daily} mL`];
        } else {
          daily = 1500 + (wt - 20) * 20;
          breakdown = [`First 10 kg: 1000 mL`, `Next 10 kg: 500 mL`, `Remaining ${wt - 20} kg: ${wt - 20} × 20 = ${(wt - 20) * 20} mL`, `Total: ${daily} mL`];
        }
        const hrRate = round(daily / 24, 1);
        return {
          steps: [
            { label: 'Method', expr: 'Holliday-Segar formula', value: '' },
            ...breakdown.map(b => ({ label: '', expr: b, value: '' })),
            { label: '24-hr fluid requirement', expr: '', value: `${daily} mL/day` },
            { label: 'Hourly rate', expr: `${daily} ÷ 24`, value: `${hrRate} mL/hr` },
          ],
          answer: `${daily} mL/day → ${hrRate} mL/hr`,
          log: `Holliday-Segar: ${wt} kg → ${daily} mL/day (${hrRate} mL/hr)`,
        };
      },
    },

    // ── 10. MgSO4 infusion ─────────────────────────────────────────────
    {
      id: 'mgso4',
      label: 'MgSO4 loading / maintenance (OB)',
      icon: '🤰',
      category: 'OB / Specialty',
      description: 'Calculate MgSO4 loading dose and maintenance infusion rates for pre-eclampsia / preterm labor.',
      fields: [
        { id: 'mg_loading_g',  label: 'Loading dose',    type: 'select',
          options: ['4 g loading','6 g loading'] },
        { id: 'mg_load_vol',   label: 'Loading bag volume', placeholder: 'e.g. 100', unit: 'mL', type: 'number' },
        { id: 'mg_load_min',   label: 'Infuse loading over', placeholder: 'e.g. 30', unit: 'min', type: 'number' },
        { id: 'mg_maint_g_hr', label: 'Maintenance rate', type: 'select',
          options: ['1 g/hr','2 g/hr','3 g/hr'] },
        { id: 'mg_maint_g',    label: 'Mg in maintenance bag', placeholder: 'e.g. 20', unit: 'g', type: 'number' },
        { id: 'mg_maint_vol',  label: 'Maintenance bag volume', placeholder: 'e.g. 500', unit: 'mL', type: 'number' },
      ],
      calculate() {
        const loadG    = parseFloat(sel('mg_loading_g')) || 4;
        const loadVol  = num('mg_load_vol') || 100;
        const loadMin  = num('mg_load_min') || 30;
        const maintGhr = parseFloat(sel('mg_maint_g_hr')) || 1;
        const maintG   = num('mg_maint_g') || 20;
        const maintVol = num('mg_maint_vol') || 500;

        const loadRate     = round((loadVol / loadMin) * 60, 0);
        const maintConcGML = round(maintG / maintVol, 4);
        const maintRate    = round(maintGhr / maintConcGML, 1);

        return {
          steps: [
            { label: 'LOADING DOSE', expr: '', value: '' },
            { label: 'Loading dose ordered', expr: '', value: `${loadG} g` },
            { label: 'Loading bag volume', expr: '', value: `${loadVol} mL` },
            { label: 'Infuse over', expr: '', value: `${loadMin} min` },
            { label: 'Loading pump rate', expr: `${loadVol} mL ÷ (${loadMin} min ÷ 60)`, value: `${loadRate} mL/hr` },
            { label: 'MAINTENANCE INFUSION', expr: '', value: '' },
            { label: 'Maintenance concentration', expr: `${maintG} g ÷ ${maintVol} mL`, value: `${maintConcGML} g/mL` },
            { label: 'Ordered rate', expr: '', value: `${maintGhr} g/hr` },
            { label: 'Maintenance pump rate', expr: `${maintGhr} g/hr ÷ ${maintConcGML} g/mL`, value: `${maintRate} mL/hr` },
          ],
          answer: `Loading: ${loadRate} mL/hr × ${loadMin} min → Maintenance: ${maintRate} mL/hr`,
          warning: 'HIGH-ALERT — dual verification required. Calcium gluconate antidote must be at bedside.',
          log: `MgSO4: ${loadG} g loading at ${loadRate} mL/hr × ${loadMin} min; maintenance ${maintGhr} g/hr → ${maintRate} mL/hr`,
        };
      },
    },

    // ── 11. Oxytocin infusion (mU/min → mL/hr) ─────────────────────────
    {
      id: 'oxytocin',
      label: 'Oxytocin infusion (mU/min → mL/hr)',
      icon: '🫃',
      category: 'OB / Specialty',
      description: 'Program oxytocin pump from mU/min order.',
      fields: [
        { id: 'oxy_mu_min',    label: 'Ordered dose',  placeholder: 'e.g. 2',  unit: 'mU/min',  type: 'number' },
        { id: 'oxy_units',     label: 'Oxytocin in bag', placeholder: 'e.g. 30', unit: 'units', type: 'number' },
        { id: 'oxy_vol',       label: 'Bag volume',    placeholder: 'e.g. 500', unit: 'mL',     type: 'number' },
      ],
      calculate() {
        const muMin  = num('oxy_mu_min');
        const units  = num('oxy_units');
        const vol    = num('oxy_vol');
        if (!muMin || !units || !vol) return null;

        const mUPerML  = round((units * 1000) / vol, 2);
        const mLPerMin = round(muMin / mUPerML, 4);
        const mLPerHr  = round(mLPerMin * 60, 2);

        return {
          steps: [
            { label: 'Step 1 — bag concentration', expr: `${units} units × 1000 mU ÷ ${vol} mL`, value: `${mUPerML} mU/mL` },
            { label: 'Step 2 — mL/min', expr: `${muMin} mU/min ÷ ${mUPerML} mU/mL`, value: `${mLPerMin} mL/min` },
            { label: 'Step 3 — mL/hr', expr: `${mLPerMin} mL/min × 60`, value: `${mLPerHr} mL/hr` },
          ],
          answer: `Set pump to ${mLPerHr} mL/hr`,
          log: `Oxytocin: ${muMin} mU/min, bag ${units} units/${vol} mL → ${mLPerHr} mL/hr`,
        };
      },
    },

    // ── 12. BMI ─────────────────────────────────────────────────────────
    {
      id: 'bmi',
      label: 'BMI calculator',
      icon: '📏',
      category: 'Assessment',
      description: 'Calculate and classify Body Mass Index.',
      fields: [
        { id: 'bmi_weight', label: 'Weight', placeholder: 'e.g. 70', unit: 'kg', type: 'number' },
        { id: 'bmi_height', label: 'Height', placeholder: 'e.g. 170', unit: 'cm', type: 'number' },
      ],
      calculate() {
        const wt  = num('bmi_weight');
        const ht  = num('bmi_height') / 100;
        if (!wt || !ht) return null;
        const bmi = round(wt / (ht * ht), 1);
        const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : bmi < 35 ? 'Obese Class I' : bmi < 40 ? 'Obese Class II' : 'Obese Class III (morbid)';
        return {
          steps: [
            { label: 'Formula', expr: 'Weight (kg) ÷ Height² (m²)', value: '' },
            { label: 'Calculation', expr: `${wt} ÷ (${ht.toFixed(2)})²`, value: `${wt} ÷ ${round(ht * ht, 4)} = ${bmi}` },
            { label: 'BMI classification', expr: '', value: cat },
          ],
          answer: `BMI ${bmi} — ${cat}`,
          log: `BMI: ${wt} kg / (${ht.toFixed(2)} m)² = ${bmi} (${cat})`,
        };
      },
    },

    // ── 13. CrCl (Cockcroft-Gault) ──────────────────────────────────────
    {
      id: 'crcl',
      label: 'CrCl (Cockcroft-Gault)',
      icon: '🫁',
      category: 'Assessment',
      description: 'Estimate creatinine clearance for renal dose adjustment.',
      fields: [
        { id: 'cg_age',     label: 'Age',               placeholder: 'e.g. 65',  unit: 'years',  type: 'number' },
        { id: 'cg_wt',      label: 'Weight',             placeholder: 'e.g. 70',  unit: 'kg',     type: 'number' },
        { id: 'cg_sex',     label: 'Sex',                type: 'select', options: ['Male','Female'] },
        { id: 'cg_scr',     label: 'Serum creatinine',   placeholder: 'e.g. 1.2', unit: 'mg/dL',  type: 'number' },
      ],
      calculate() {
        const age  = num('cg_age');
        const wt   = num('cg_wt');
        const scr  = num('cg_scr');
        const sex  = sel('cg_sex');
        if (!age || !wt || !scr) return null;

        const factor = sex === 'Female' ? 0.85 : 1;
        const crcl   = round(((140 - age) * wt * factor) / (72 * scr), 1);
        const cat    = crcl >= 90 ? 'Normal (G1)' : crcl >= 60 ? 'Mildly reduced (G2)' : crcl >= 45 ? 'Mildly-moderately reduced (G3a)' : crcl >= 30 ? 'Moderately-severely reduced (G3b)' : crcl >= 15 ? 'Severely reduced (G4)' : 'Kidney failure (G5)';

        return {
          steps: [
            { label: 'Formula (Cockcroft-Gault)', expr: '[(140 − age) × weight × sex factor] ÷ (72 × SCr)', value: '' },
            { label: 'Numerator', expr: `(140 − ${age}) × ${wt} kg × ${factor}`, value: `${round((140 - age) * wt * factor, 1)}` },
            { label: 'Denominator', expr: `72 × ${scr} mg/dL`, value: `${round(72 * scr, 1)}` },
            { label: 'CrCl', expr: '', value: `${crcl} mL/min` },
            { label: 'KDIGO category', expr: '', value: cat },
          ],
          answer: `CrCl ${crcl} mL/min — ${cat}`,
          warning: crcl < 30 ? 'Severe renal impairment — review all renally-dosed medications.' : null,
          log: `CrCl (C-G): age ${age}, wt ${wt} kg, SCr ${scr}, sex ${sex} → ${crcl} mL/min (${cat})`,
        };
      },
    },
  ];

  // ── Calculation Checker ───────────────────────────────────────────────────
  // Student enters their answer; system checks it step-by-step
  function renderChecker() {
    return `
      <div class="mc-checker-intro">
        <div class="notice info" style="margin-bottom:0;">
          <span class="mark">🎯 NCLEX / PNLE</span>
          <span>Enter a completed calculation to check your work. The checker verifies your setup and final answer, and shows the correct step-by-step solution.</span>
        </div>
      </div>

      <div class="mc-checker-form">
        <div class="mc-field-group">
          <label>Select calculation type</label>
          <select id="chk-type">
            <option value="">— Choose a calculation —</option>
            ${CALCULATORS.filter(c => c.id !== 'bmi').map(c =>
              `<option value="${c.id}">${c.label}</option>`
            ).join('')}
          </select>
        </div>

        <div id="chk-fields-wrap" style="display:none;">
          <div id="chk-fields"></div>
          <div class="mc-field-group" style="margin-top:8px;">
            <label>Your answer</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input id="chk-student-answer" type="number" placeholder="Enter your calculated number" style="max-width:200px;">
              <input id="chk-student-unit" placeholder="unit (e.g. mL/hr, mg)" style="max-width:140px;">
            </div>
          </div>
          <div class="actions" style="justify-content:flex-start;margin-top:10px;">
            <button class="btn primary" id="chk-submit">Check my answer</button>
            <button class="btn" id="chk-show-solution">Show solution</button>
          </div>
        </div>

        <div id="chk-result"></div>
      </div>
    `;
  }

  // ── Render a single calculator form ───────────────────────────────────────
  function renderCalcForm(calcId) {
    const calc = CALCULATORS.find(c => c.id === calcId);
    if (!calc) return '<p style="color:var(--subtle);">Select a calculator.</p>';

    const pt = currentPt();
    const autofilled = calc.autofill ? calc.autofill(pt) : {};

    const fields = calc.fields.map(f => {
      const val = autofilled[f.id] || '';
      if (f.type === 'select') {
        return `
          <div class="mc-field-group">
            <label>${E(f.label)}</label>
            <select id="${f.id}">
              ${f.options.map(o => `<option value="${E(o)}">${E(o)}</option>`).join('')}
            </select>
          </div>`;
      }
      return `
        <div class="mc-field-group">
          <label>${E(f.label)}${f.unit ? `<span class="mc-unit-hint">${E(f.unit)}</span>` : ''}</label>
          <input id="${f.id}" type="${f.type || 'text'}" placeholder="${E(f.placeholder || '')}" value="${E(val)}" step="any">
        </div>`;
    }).join('');

    return `
      <div class="mc-calc-header">
        <span class="mc-calc-icon">${calc.icon}</span>
        <div>
          <h3 class="mc-calc-title">${E(calc.label)}</h3>
          <p class="mc-calc-desc">${E(calc.description)}</p>
        </div>
      </div>
      ${pt ? `<div class="mc-patient-hint">📋 Auto-filled from current patient: ${E(pt.lastName)}, ${E(pt.firstName)}</div>` : ''}
      <div class="mc-fields-grid">${fields}</div>
      <div class="actions" style="justify-content:flex-start;">
        <button class="btn primary" id="calc-run">Calculate</button>
        <button class="btn" id="calc-clear">Clear</button>
        ${pt ? `<button class="btn navy" id="calc-save-note">Save to chart note</button>` : ''}
      </div>
      <div id="calc-result"></div>
    `;
  }

  // ── Render result steps ───────────────────────────────────────────────────
  function renderResult(res) {
    if (!res) return '<p class="mc-error">Please fill in all required fields.</p>';

    const stepsHtml = res.steps.map(s => {
      if (!s.label && !s.expr && !s.value) return '<hr class="mc-step-divider">';
      if (!s.label) return `
        <div class="mc-step mc-step-spacer">
          <span class="mc-step-expr" style="grid-column:1/-1;color:var(--muted);font-style:italic;">${E(s.expr)}</span>
        </div>`;
      return `
        <div class="mc-step">
          <span class="mc-step-label">${E(s.label)}</span>
          <span class="mc-step-expr">${E(s.expr)}</span>
          <span class="mc-step-value">${E(s.value)}</span>
        </div>`;
    }).join('');

    return `
      <div class="mc-result">
        ${res.warning ? `<div class="notice danger" style="margin-bottom:10px;"><span class="mark">⚠ HIGH-ALERT</span><span>${E(res.warning)}</span></div>` : ''}
        <div class="mc-steps">${stepsHtml}</div>
        <div class="mc-answer">
          <span class="mc-answer-label">Answer</span>
          <span class="mc-answer-value">${E(res.answer)}</span>
        </div>
      </div>`;
  }

  // ── Checker result ────────────────────────────────────────────────────────
  function renderCheckerResult(studentNum, studentUnit, res) {
    if (!res) return '<p class="mc-error">Fill all fields then click Check.</p>';

    const correctNum = parseFloat(res.answer);
    const tolerance  = Math.abs(correctNum) * 0.01; // 1% tolerance
    const isCorrect  = Math.abs(studentNum - correctNum) <= tolerance || Math.abs(studentNum - correctNum) < 0.01;

    const icon = isCorrect ? '✅' : '❌';
    const cls  = isCorrect ? 'mc-chk-correct' : 'mc-chk-wrong';
    const msg  = isCorrect
      ? 'Correct! Your answer matches the calculated answer.'
      : `Incorrect. Your answer: ${studentNum} ${studentUnit}. Correct answer: ${res.answer}.`;

    return `
      <div class="mc-chk-verdict ${cls}">
        <span class="mc-chk-icon">${icon}</span>
        <div>
          <strong>${isCorrect ? 'Correct ✓' : 'Not quite'}</strong>
          <p>${E(msg)}</p>
        </div>
      </div>
      ${renderResult(res)}`;
  }

  // ── Main tab renderer ─────────────────────────────────────────────────────
  function rMedCalc() {
    const categories = [...new Set(CALCULATORS.map(c => c.category))];

    const categoryGroups = categories.map(cat => {
      const calcs = CALCULATORS.filter(c => c.category === cat);
      return `
        <div class="mc-cat-group">
          <div class="mc-cat-label">${E(cat)}</div>
          <div class="mc-cat-cards">
            ${calcs.map(c => `
              <button class="mc-calc-btn" data-calc-id="${c.id}">
                <span class="mc-btn-icon">${c.icon}</span>
                <span class="mc-btn-label">${E(c.label)}</span>
              </button>`).join('')}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="mc-shell">
        <div class="mc-sidebar">
          <div class="mc-sidebar-head">
            <h2 class="mc-sidebar-title">Medication Calculators</h2>
            <p class="mc-sidebar-sub">Select a calculation type</p>
          </div>
          ${categoryGroups}
          <div class="mc-cat-group">
            <div class="mc-cat-label">Practice</div>
            <div class="mc-cat-cards">
              <button class="mc-calc-btn" data-calc-id="checker">
                <span class="mc-btn-icon">🎯</span>
                <span class="mc-btn-label">Answer checker</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mc-main" id="mc-main-panel">
          <div class="mc-placeholder">
            <div class="mc-ph-icon">💊</div>
            <h3>HCT Medication Calculator</h3>
            <p>Select a calculator from the left panel.<br>Patient weight and data are auto-filled from the active chart.</p>
            <div class="mc-ph-features">
              <span>⚖️ Weight-based dosing</span>
              <span>💉 IV rates & drip calculations</span>
              <span>👶 Pediatric bolus & maintenance</span>
              <span>🫀 Critical care infusions</span>
              <span>🤰 OB medications (MgSO4, oxytocin)</span>
              <span>🎯 Answer checker for PNLE/NCLEX prep</span>
            </div>
          </div>
        </div>
      </div>

      <div id="mc-calc-history" style="margin-top:14px;"></div>
    `;
  }

  // ── Bind events ───────────────────────────────────────────────────────────
  let _calcHistory = [];
  let _activeCalcId = null;
  let _activeCheckerCalcId = null;

  function bindMedCalcEvents() {
    // Calculator selector buttons
    document.querySelectorAll('[data-calc-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-calc-id]').forEach(b => b.classList.remove('mc-calc-btn--active'));
        btn.classList.add('mc-calc-btn--active');

        const id = btn.dataset.calcId;
        const panel = document.getElementById('mc-main-panel');
        if (!panel) return;

        if (id === 'checker') {
          _activeCalcId = null;
          panel.innerHTML = renderChecker();
          bindCheckerEvents();
        } else {
          _activeCalcId = id;
          panel.innerHTML = renderCalcForm(id);
          bindCalcRunEvents(id);
        }
      });
    });
  }

  function bindCalcRunEvents(calcId) {
    document.getElementById('calc-run')?.addEventListener('click', () => {
      const calc = CALCULATORS.find(c => c.id === calcId);
      if (!calc) return;
      const res = calc.calculate();
      setHtml('calc-result', renderResult(res));
      if (res) {
        _calcHistory.unshift({ time: new Date().toLocaleTimeString(), label: calc.label, answer: res.answer, log: res.log });
        _calcHistory = _calcHistory.slice(0, 10);
        renderHistory();
      }
    });

    document.getElementById('calc-clear')?.addEventListener('click', () => {
      setHtml('calc-result', '');
      const calc = CALCULATORS.find(c => c.id === calcId);
      if (calc) {
        calc.fields.forEach(f => {
          const el = document.getElementById(f.id);
          if (el && f.type !== 'select') el.value = '';
        });
      }
    });

    document.getElementById('calc-save-note')?.addEventListener('click', () => {
      const calc = CALCULATORS.find(c => c.id === calcId);
      if (!calc) return;
      const res = calc.calculate();
      if (!res) { alert('Run the calculation first.'); return; }
      const p = currentPt();
      if (!p) return;
      if (!p.notes) p.notes = [];
      p.notes.push({
        type: 'Medication calculation',
        time: (typeof nowTime === 'function') ? nowTime() : new Date().toISOString().slice(0, 16),
        by: 'Student Nurse',
        body: `MEDICATION CALCULATION — ${calc.label}\n\nResult: ${res.answer}\n\nSteps:\n${res.steps.filter(s => s.label || s.value).map(s => `${s.label ? s.label + ': ' : ''}${s.expr || ''}${s.value ? ' = ' + s.value : ''}`).join('\n')}\n\n${res.warning ? 'WARNING: ' + res.warning : ''}`,
      });
      if (typeof persist === 'function') persist();
      if (typeof toast === 'function') toast('Calculation saved to nursing notes ✓');
    });

    // Allow Enter key to trigger calculate
    document.getElementById('mc-main-panel')?.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('calc-run')?.click();
      });
    });
  }

  function bindCheckerEvents() {
    const typeSelect = document.getElementById('chk-type');
    typeSelect?.addEventListener('change', () => {
      const id = typeSelect.value;
      _activeCheckerCalcId = id;
      const wrap = document.getElementById('chk-fields-wrap');
      const fieldsEl = document.getElementById('chk-fields');
      setHtml('chk-result', '');

      if (!id) {
        if (wrap) wrap.style.display = 'none';
        return;
      }
      if (wrap) wrap.style.display = 'block';
      const calc = CALCULATORS.find(c => c.id === id);
      if (!calc || !fieldsEl) return;

      const pt = currentPt();
      const autofilled = calc.autofill ? calc.autofill(pt) : {};
      fieldsEl.innerHTML = calc.fields.map(f => {
        const val = autofilled[f.id] || '';
        if (f.type === 'select') {
          return `<div class="mc-field-group"><label>${E(f.label)}</label><select id="chk-${f.id}">${f.options.map(o => `<option value="${E(o)}">${E(o)}</option>`).join('')}</select></div>`;
        }
        return `<div class="mc-field-group"><label>${E(f.label)}${f.unit ? `<span class="mc-unit-hint">${E(f.unit)}</span>` : ''}</label><input id="chk-${f.id}" type="${f.type || 'text'}" placeholder="${E(f.placeholder || '')}" value="${E(val)}" step="any"></div>`;
      }).join('');
    });

    document.getElementById('chk-submit')?.addEventListener('click', () => {
      if (!_activeCheckerCalcId) return;
      const calc = CALCULATORS.find(c => c.id === _activeCheckerCalcId);
      if (!calc) return;

      // Temporarily remap field IDs
      const origGetters = {};
      calc.fields.forEach(f => {
        origGetters[f.id] = document.getElementById(f.id);
        const chkEl = document.getElementById('chk-' + f.id);
        if (chkEl) {
          const ghost = document.createElement(chkEl.tagName);
          ghost.id = f.id;
          ghost.value = chkEl.value;
          document.body.appendChild(ghost);
        }
      });

      const res = calc.calculate();

      // Cleanup ghost elements
      calc.fields.forEach(f => {
        const ghost = document.getElementById(f.id);
        if (ghost && !ghost.closest('#mc-main-panel')) ghost.remove();
      });

      const studentAns = num('chk-student-answer');
      const studentUnit = document.getElementById('chk-student-unit')?.value || '';
      setHtml('chk-result', renderCheckerResult(studentAns, studentUnit, res));
    });

    document.getElementById('chk-show-solution')?.addEventListener('click', () => {
      if (!_activeCheckerCalcId) return;
      const calc = CALCULATORS.find(c => c.id === _activeCheckerCalcId);
      if (!calc) return;

      calc.fields.forEach(f => {
        const chkEl = document.getElementById('chk-' + f.id);
        if (chkEl) {
          const ghost = document.createElement(chkEl.tagName);
          ghost.id = f.id;
          ghost.value = chkEl.value;
          document.body.appendChild(ghost);
        }
      });

      const res = calc.calculate();

      calc.fields.forEach(f => {
        const ghost = document.getElementById(f.id);
        if (ghost && !ghost.closest('#mc-main-panel')) ghost.remove();
      });

      setHtml('chk-result', renderResult(res));
    });
  }

  function renderHistory() {
    const wrap = document.getElementById('mc-calc-history');
    if (!wrap || !_calcHistory.length) return;
    wrap.innerHTML = `
      <div class="card">
        <div class="card-head"><h3>Recent calculations</h3></div>
        <div class="card-body" style="padding:10px 14px;">
          ${_calcHistory.map(h => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--line);font-size:12px;gap:12px;">
              <span style="color:var(--subtle);flex-shrink:0;">${E(h.time)}</span>
              <span style="flex:1;color:var(--muted);">${E(h.label)}</span>
              <strong style="color:var(--hct-navy);">${E(h.answer)}</strong>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── CSS injection ─────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('medcalc-styles')) return;
    const style = document.createElement('style');
    style.id = 'medcalc-styles';
    style.textContent = `
      /* ── Med calc shell ──────────────────────────────────────────── */
      .mc-shell {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        gap: 14px;
        min-height: 520px;
        align-items: start;
      }
      @media (max-width: 860px) {
        .mc-shell { grid-template-columns: 1fr; }
      }

      /* ── Sidebar ─────────────────────────────────────────────────── */
      .mc-sidebar {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        overflow: hidden;
        position: sticky;
        top: 8px;
      }
      .mc-sidebar-head {
        padding: 12px 14px;
        background: linear-gradient(135deg, rgba(67,192,196,0.15), rgba(23,41,70,0.06));
        border-bottom: 1px solid var(--line);
      }
      .mc-sidebar-title {
        margin: 0 0 2px;
        font-size: 13px;
        font-weight: 900;
        color: var(--hct-navy);
      }
      .mc-sidebar-sub {
        margin: 0;
        font-size: 11px;
        color: var(--subtle);
      }
      .mc-cat-group { padding: 6px 0; border-bottom: 1px solid var(--line); }
      .mc-cat-group:last-child { border-bottom: none; }
      .mc-cat-label {
        padding: 8px 14px 4px;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        color: var(--subtle);
      }
      .mc-cat-cards { padding: 0 6px 4px; display: flex; flex-direction: column; gap: 2px; }
      .mc-calc-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--muted);
        padding: 7px 9px;
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .mc-calc-btn:hover { background: var(--surface-2); color: var(--text); }
      .mc-calc-btn--active {
        background: rgba(67,192,196,0.16);
        color: var(--hct-navy);
        font-weight: 800;
      }
      .mc-btn-icon { font-size: 14px; flex-shrink: 0; width: 20px; text-align: center; }
      .mc-btn-label { flex: 1; line-height: 1.3; }

      /* ── Main panel ──────────────────────────────────────────────── */
      .mc-main {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 20px;
        min-height: 360px;
      }

      /* ── Placeholder ─────────────────────────────────────────────── */
      .mc-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 10px;
        padding: 40px 20px;
        color: var(--muted);
      }
      .mc-ph-icon { font-size: 40px; }
      .mc-placeholder h3 { margin: 0; color: var(--hct-navy); font-size: 18px; }
      .mc-placeholder p  { margin: 0; font-size: 13px; line-height: 1.6; color: var(--muted); }
      .mc-ph-features {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
        margin-top: 8px;
      }
      .mc-ph-features span {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        color: var(--muted);
      }

      /* ── Calculator form ─────────────────────────────────────────── */
      .mc-calc-header {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 16px;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--line);
      }
      .mc-calc-icon { font-size: 28px; flex-shrink: 0; }
      .mc-calc-title { margin: 0 0 3px; font-size: 16px; font-weight: 900; color: var(--hct-navy); }
      .mc-calc-desc  { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.45; }

      .mc-patient-hint {
        background: rgba(67,192,196,0.10);
        border: 1px solid rgba(67,192,196,0.25);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 700;
        color: var(--hct-teal-dark, #13848a);
        margin-bottom: 12px;
      }

      .mc-fields-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 10px;
        margin-bottom: 12px;
      }
      @media (max-width: 640px) { .mc-fields-grid { grid-template-columns: 1fr; } }

      .mc-field-group { display: flex; flex-direction: column; gap: 4px; }
      .mc-field-group label {
        font-size: 11px;
        font-weight: 800;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .mc-unit-hint {
        font-size: 10px;
        font-weight: 700;
        color: var(--subtle);
        text-transform: none;
        letter-spacing: 0;
        background: var(--surface);
        padding: 1px 6px;
        border-radius: 3px;
      }

      /* ── Result steps ────────────────────────────────────────────── */
      .mc-result {
        margin-top: 16px;
        border-top: 1px solid var(--line);
        padding-top: 14px;
        animation: mcFadeIn 0.25s ease both;
      }
      @keyframes mcFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }

      .mc-steps { display: flex; flex-direction: column; gap: 2px; margin-bottom: 12px; }
      .mc-step {
        display: grid;
        grid-template-columns: 220px minmax(0,1fr) 160px;
        gap: 8px;
        align-items: center;
        padding: 6px 10px;
        border-radius: 6px;
        background: var(--surface);
        font-size: 12px;
      }
      .mc-step:nth-child(even) { background: var(--paper); }
      .mc-step-spacer { grid-template-columns: 1fr; background: transparent; }
      .mc-step-divider { border: 0; border-top: 1px dashed var(--line); margin: 4px 0; }
      .mc-step-label { font-weight: 800; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
      .mc-step-expr  { color: var(--text); font-family: 'Courier New', monospace; font-size: 12px; }
      .mc-step-value { text-align: right; font-weight: 900; color: var(--hct-navy); font-size: 13px; }
      @media (max-width: 640px) {
        .mc-step { grid-template-columns: 1fr 1fr; }
        .mc-step-label { grid-column: 1/-1; }
      }

      .mc-answer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, rgba(67,192,196,0.18), rgba(23,41,70,0.07));
        border: 1px solid rgba(67,192,196,0.35);
        border-radius: 8px;
        padding: 12px 16px;
      }
      .mc-answer-label {
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--hct-teal-dark, #13848a);
      }
      .mc-answer-value {
        font-size: 18px;
        font-weight: 900;
        color: var(--hct-navy);
      }

      /* ── Checker ─────────────────────────────────────────────────── */
      .mc-checker-intro { margin-bottom: 14px; }
      .mc-checker-form { display: flex; flex-direction: column; gap: 10px; }

      .mc-chk-verdict {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 12px 14px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 13px;
      }
      .mc-chk-correct {
        background: var(--success-bg);
        border: 1px solid rgba(49,105,31,0.3);
        color: var(--success);
      }
      .mc-chk-wrong {
        background: var(--danger-bg);
        border: 1px solid rgba(163,49,49,0.3);
        color: var(--danger);
      }
      .mc-chk-icon { font-size: 22px; flex-shrink: 0; }
      .mc-chk-verdict strong { display: block; font-size: 14px; margin-bottom: 2px; }
      .mc-chk-verdict p { margin: 0; font-size: 12px; opacity: 0.85; }

      .mc-error { color: var(--danger); font-size: 13px; font-style: italic; }
    `;
    document.head.appendChild(style);
  }

  // ── Hook into app.js render pipeline ─────────────────────────────────────
  function install() {
    // Expose the tab renderer to app.js global scope
    window.rMedCalc = rMedCalc;

    // Patch the app's renderTab and tabTitle functions
    if (typeof renderTab === 'function' && !renderTab.__medcalc) {
      const origRenderTab = renderTab;
      window.renderTab = function () {
        if (typeof state !== 'undefined' && state.tab === 'medcalc') {
          injectStyles();
          return rMedCalc();
        }
        return origRenderTab.apply(this, arguments);
      };
      window.renderTab.__medcalc = true;
    }

    if (typeof tabTitle === 'function' && !tabTitle.__medcalc) {
      const origTabTitle = tabTitle;
      window.tabTitle = function () {
        if (typeof state !== 'undefined' && state.tab === 'medcalc') return 'Medication Calculator';
        return origTabTitle.apply(this, arguments);
      };
      window.tabTitle.__medcalc = true;
    }

    // Add nav entry by patching renderNav
    if (typeof renderNav === 'function' && !renderNav.__medcalc) {
      const origRenderNav = renderNav;
      window.renderNav = function () {
        let html = origRenderNav.apply(this, arguments);
        // Inject the medcalc button into Learning tools group
        html = html.replace(
          'data-tab="report"',
          'data-tab="report" id="nav-report"'
        );
        // Insert after the reasoning button
        html = html.replace(
          /<button class="nav-btn [^"]*" data-tab="reasoning">/,
          match => match
        );
        // Add medcalc tab before scenarios
        html = html.replace(
          /data-tab="scenarios"/,
          `data-tab="medcalc"><span class="nav-ic">Rx</span>Medication calculator</button>
           <button class="nav-btn ${typeof state !== 'undefined' && state.tab === 'medcalc' ? 'active' : ''}" data-tab="scenarios"`
        );
        return html;
      };
      window.renderNav.__medcalc = true;
    }

    // Patch bindTabEvents to include medcalc events
    if (typeof bindTabEvents === 'function' && !bindTabEvents.__medcalc) {
      const origBindTabEvents = bindTabEvents;
      window.bindTabEvents = function () {
        origBindTabEvents.apply(this, arguments);
        if (typeof state !== 'undefined' && state.tab === 'medcalc') {
          bindMedCalcEvents();
        }
      };
      window.bindTabEvents.__medcalc = true;
    }

    // Patch bindEvents as final fallback
    if (typeof bindEvents === 'function' && !bindEvents.__medcalc) {
      const origBindEvents = bindEvents;
      window.bindEvents = function () {
        origBindEvents.apply(this, arguments);
        if (typeof state !== 'undefined' && state.tab === 'medcalc') {
          bindMedCalcEvents();
        }
      };
      window.bindEvents.__medcalc = true;
    }

    injectStyles();
    console.log('[HCT MedCalc] Medication calculator module loaded — 13 calculators + answer checker ready.');
  }

  // Run after app.js is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    // Small delay to let app.js finish executing
    setTimeout(install, 0);
  }

})();
