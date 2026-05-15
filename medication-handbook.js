(function () {
  const items = [
    {
      id: "normal-saline-1-l",
      name: "Normal saline 1 L",
      generic: "0.9% sodium chloride",
      brand: "Baxter, Viaflex",
      category: "Isotonic crystalloid IV fluid",
      aliases: "normal saline ns sodium chloride 0.9 iv fluid crystalloid",
      onHand: 42,
      par: 18,
      doses: ["1 L IV bolus once", "75 mL/hr IV infusion", "125 mL/hr IV infusion"],
      availability: "1 L IV bag; fluid warmer and IV room stock",
      classification: "Isotonic crystalloid solution.",
      uses: "Fluid replacement, medication carrier fluid, and volume support when ordered.",
      precautions: "Use caution with heart failure, renal impairment, sodium overload, or fluid restriction.",
      action: "Expands intravascular volume with sodium and chloride-containing isotonic fluid.",
      nursing: "Verify rate and pump settings, monitor lung sounds, edema, I&O, IV site, and electrolytes.",
      indications: "Hypovolemia, dehydration, IV medication administration, compatible line maintenance.",
      sideEffects: "Infusion-site discomfort, mild edema.",
      adverseEffects: "Fluid overload, hyperchloremic metabolic acidosis, electrolyte imbalance."
    },
    {
      id: "lactated-ringers-1-l",
      name: "Lactated Ringers 1 L",
      generic: "lactated Ringer's solution",
      brand: "Baxter, Hospira",
      category: "Balanced crystalloid IV fluid",
      aliases: "lactated ringers lr ringer crystalloid iv fluid",
      onHand: 35,
      par: 14,
      doses: ["1 L IV bolus once", "75 mL/hr IV infusion", "125 mL/hr IV infusion"],
      availability: "1 L IV bag; IV room stock",
      classification: "Balanced isotonic crystalloid solution.",
      uses: "Volume replacement and perioperative or dehydration fluid support when ordered.",
      precautions: "Use caution with severe liver disease, hyperkalemia, renal failure, or fluid overload risk.",
      action: "Provides water and electrolytes; lactate is metabolized to bicarbonate.",
      nursing: "Monitor I&O, respiratory status, edema, IV site, electrolytes, and ordered rate.",
      indications: "Hypovolemia, dehydration, surgical fluid replacement, burn or trauma protocols.",
      sideEffects: "Infusion-site discomfort, mild swelling.",
      adverseEffects: "Fluid overload, electrolyte disturbance, alkalosis in susceptible patients."
    },
    {
      id: "acetaminophen-500-mg-tablet",
      name: "Acetaminophen 500 mg tablet",
      generic: "acetaminophen",
      brand: "Tylenol",
      category: "Analgesic / antipyretic",
      aliases: "acetaminophen paracetamol tylenol pain fever analgesic antipyretic",
      onHand: 120,
      par: 40,
      doses: ["500 mg PO q6h PRN", "650 mg PO q6h PRN", "1,000 mg PO q8h PRN"],
      availability: "Unit-dose tablets; stocked in med cart and pharmacy",
      classification: "Nonopioid analgesic and antipyretic.",
      uses: "Mild pain and fever reduction.",
      precautions: "Use caution with liver disease, heavy alcohol use, or duplicate combination products.",
      action: "Inhibits central prostaglandin synthesis and lowers fever through hypothalamic heat regulation.",
      nursing: "Check total daily acetaminophen from all sources, assess pain or temperature response, and monitor liver-risk patients.",
      indications: "Fever; mild to moderate pain.",
      sideEffects: "Nausea, rash, headache.",
      adverseEffects: "Hepatotoxicity, severe skin reaction, overdose toxicity."
    },
    {
      id: "albuterol-2-5-mg-nebule",
      name: "Albuterol 2.5 mg nebule",
      generic: "albuterol",
      brand: "Proventil, Ventolin",
      category: "Short-acting beta2 agonist",
      aliases: "albuterol salbutamol proventil ventolin nebulizer nebule saba bronchodilator",
      onHand: 44,
      par: 20,
      doses: ["2.5 mg nebulized q4-6h PRN", "2 puffs inhaled q4-6h PRN"],
      availability: "Nebules and metered-dose inhaler; respiratory drawer",
      classification: "Adrenergic bronchodilator.",
      uses: "Relief of bronchospasm in asthma or COPD.",
      precautions: "Use caution with tachyarrhythmias, severe cardiac disease, hyperthyroidism, or diabetes.",
      action: "Stimulates beta2 receptors to relax bronchial smooth muscle.",
      nursing: "Assess lung sounds, work of breathing, oxygen saturation, pulse, and tremor before and after therapy.",
      indications: "Bronchospasm, wheezing, reversible airway obstruction.",
      sideEffects: "Tremor, nervousness, headache, palpitations.",
      adverseEffects: "Tachycardia, chest pain, hypokalemia, paradoxical bronchospasm."
    },
    {
      id: "ondansetron-4-mg-vial",
      name: "Ondansetron 4 mg vial",
      generic: "ondansetron",
      brand: "Zofran",
      category: "Antiemetic",
      aliases: "ondansetron zofran nausea vomiting antiemetic 5ht3",
      onHand: 26,
      par: 10,
      doses: ["4 mg IV q6h PRN", "4 mg PO/ODT q8h PRN", "8 mg PO q8h PRN"],
      availability: "IV vial and ODT; antiemetic bin",
      classification: "Selective 5-HT3 receptor antagonist.",
      uses: "Nausea and vomiting prevention or treatment.",
      precautions: "Use caution with prolonged QT interval, electrolyte imbalance, or other QT-prolonging drugs.",
      action: "Blocks serotonin receptors centrally and peripherally involved in the vomiting reflex.",
      nursing: "Assess nausea, bowel pattern, hydration, ECG risk, and constipation.",
      indications: "Postoperative, medication-related, or gastroenteritis-associated nausea/vomiting.",
      sideEffects: "Headache, constipation, dizziness.",
      adverseEffects: "QT prolongation, serotonin syndrome, hypersensitivity."
    },
    {
      id: "ceftriaxone-1-g-vial",
      name: "Ceftriaxone 1 g vial",
      generic: "ceftriaxone",
      brand: "Rocephin",
      category: "Third-generation cephalosporin antibiotic",
      aliases: "ceftriaxone rocephin cephalosporin antibiotic infection sepsis pneumonia",
      onHand: 22,
      par: 8,
      doses: ["1 g IV q24h", "2 g IV q24h", "1 g IM once"],
      availability: "Powder vial for IV/IM reconstitution",
      classification: "Beta-lactam cephalosporin antibiotic.",
      uses: "Susceptible bacterial infections including pneumonia, UTI, sepsis workups, and meningitis regimens.",
      precautions: "Screen for beta-lactam allergy; use caution with biliary disease and neonates receiving calcium-containing IV solutions.",
      action: "Inhibits bacterial cell-wall synthesis.",
      nursing: "Obtain cultures before first dose when ordered, monitor allergy response, diarrhea, WBC trend, and IV site.",
      indications: "Susceptible respiratory, urinary, skin, bloodstream, CNS, and intra-abdominal infections.",
      sideEffects: "Diarrhea, rash, injection-site discomfort.",
      adverseEffects: "Anaphylaxis, C. difficile colitis, biliary sludging, blood dyscrasias."
    },
    {
      id: "azithromycin-500-mg-vial",
      name: "Azithromycin 500 mg vial",
      generic: "azithromycin",
      brand: "Zithromax",
      category: "Macrolide antibiotic",
      aliases: "azithromycin zithromax macrolide antibiotic pneumonia atypical",
      onHand: 18,
      par: 8,
      doses: ["500 mg IV q24h", "500 mg PO once then 250 mg daily", "1 g PO once"],
      availability: "IV vial and tablets; antibiotic shelf",
      classification: "Macrolide antibacterial.",
      uses: "Respiratory, skin, and selected sexually transmitted infections caused by susceptible organisms.",
      precautions: "Use caution with QT prolongation, liver disease, and interacting antiarrhythmics.",
      action: "Binds bacterial ribosomal subunits and suppresses protein synthesis.",
      nursing: "Review allergies, culture data, ECG risk, liver history, and GI tolerance.",
      indications: "Community-acquired pneumonia, atypical coverage, bronchitis exacerbation, selected STI therapy.",
      sideEffects: "Nausea, diarrhea, abdominal pain.",
      adverseEffects: "QT prolongation, hepatotoxicity, severe hypersensitivity, C. difficile colitis."
    },
    {
      id: "regular-insulin-100-units-ml-vial",
      name: "Regular insulin vial",
      generic: "regular insulin",
      brand: "Humulin R, Novolin R",
      category: "Short-acting insulin",
      aliases: "regular insulin humulin novolin endocrine diabetes hyperglycemia sliding scale",
      onHand: 16,
      par: 8,
      doses: ["Per sliding scale SQ", "0.1 unit/kg IV bolus", "0.1 unit/kg/hr IV infusion"],
      availability: "100 units/mL multidose vial; refrigerated until opened",
      classification: "Short-acting antidiabetic hormone.",
      uses: "Hyperglycemia management, correction scale, IV insulin protocols.",
      precautions: "High-alert medication; verify blood glucose, meal status, potassium, and concentration.",
      action: "Promotes glucose uptake and shifts potassium into cells.",
      nursing: "Independent double-check per policy, monitor glucose closely, hold or clarify when hypoglycemic or not eating.",
      indications: "Diabetes mellitus, hyperglycemia, DKA/HHS protocols, hyperkalemia protocols.",
      sideEffects: "Hunger, sweating, tremor, injection-site irritation.",
      adverseEffects: "Severe hypoglycemia, hypokalemia, medication error harm."
    },
    {
      id: "furosemide-20-mg-ampule",
      name: "Furosemide 20 mg ampule",
      generic: "furosemide",
      brand: "Lasix",
      category: "Loop diuretic",
      aliases: "furosemide lasix diuretic loop edema heart failure pulmonary edema",
      onHand: 24,
      par: 12,
      doses: ["20 mg IV once", "40 mg IV/PO once", "20-40 mg PO daily"],
      availability: "IV ampule and tablets; cardiac medication bin",
      classification: "Loop diuretic.",
      uses: "Fluid overload, edema, heart failure, pulmonary congestion.",
      precautions: "Use caution with dehydration, electrolyte depletion, sulfonamide sensitivity, and renal impairment.",
      action: "Inhibits sodium and chloride reabsorption in the loop of Henle, increasing diuresis.",
      nursing: "Monitor BP, I&O, daily weight, potassium, renal function, and response to diuresis.",
      indications: "Edema, heart failure exacerbation, hypertension adjunct.",
      sideEffects: "Increased urination, dizziness, thirst.",
      adverseEffects: "Hypotension, hypokalemia, dehydration, ototoxicity, renal dysfunction."
    },
    {
      id: "heparin-5000-units-ml-vial",
      name: "Heparin 5,000 units/mL vial",
      generic: "heparin",
      brand: "Hep-Lock, Heparin Sodium",
      category: "Anticoagulant",
      aliases: "heparin anticoagulant dvt prophylaxis infusion thrombin",
      onHand: 36,
      par: 14,
      doses: ["5,000 units SQ q8-12h", "Per weight-based IV protocol"],
      availability: "Vials; anticoagulant high-alert storage",
      classification: "Parenteral anticoagulant.",
      uses: "VTE prophylaxis and treatment protocols.",
      precautions: "Avoid with active bleeding or history of HIT; verify platelet count and ordered protocol.",
      action: "Enhances antithrombin activity, reducing thrombin and factor Xa activity.",
      nursing: "Monitor bleeding, platelets, aPTT or anti-Xa per protocol, and injection-site bruising.",
      indications: "DVT/PE prophylaxis or treatment, ACS and procedural anticoagulation protocols.",
      sideEffects: "Bruising, injection-site irritation.",
      adverseEffects: "Major bleeding, heparin-induced thrombocytopenia, hypersensitivity."
    },
    {
      id: "warfarin-5-mg-tablet",
      name: "Warfarin 5 mg tablet",
      generic: "warfarin",
      brand: "Coumadin, Jantoven",
      category: "Oral anticoagulant",
      aliases: "warfarin coumadin jantoven anticoagulant inr vitamin k",
      onHand: 60,
      par: 20,
      doses: ["2.5 mg PO daily", "5 mg PO daily", "Dose by INR"],
      availability: "Tablets; anticoagulant drawer",
      classification: "Vitamin K antagonist anticoagulant.",
      uses: "Long-term anticoagulation for VTE, atrial fibrillation, or mechanical valve protocols.",
      precautions: "Contraindicated in pregnancy for many indications; many food and drug interactions.",
      action: "Inhibits vitamin K-dependent clotting factor synthesis.",
      nursing: "Check INR, bleeding signs, diet consistency, new medications, and patient education needs.",
      indications: "VTE treatment/prevention, stroke prevention in atrial fibrillation, mechanical valves.",
      sideEffects: "Easy bruising, nausea.",
      adverseEffects: "Major bleeding, skin necrosis, fetal harm."
    },
    {
      id: "morphine-2-mg-ml-vial",
      name: "Morphine 2 mg/mL vial",
      generic: "morphine",
      brand: "MS Contin, Roxanol",
      category: "Opioid analgesic",
      aliases: "morphine opioid analgesic pain narcotic",
      onHand: 20,
      par: 8,
      doses: ["2 mg IV q2-4h PRN", "4 mg IV q2-4h PRN", "15 mg PO q4h PRN"],
      availability: "Controlled medication; vial and oral forms",
      classification: "Opioid agonist analgesic.",
      uses: "Moderate to severe pain and selected dyspnea/palliative protocols.",
      precautions: "Use caution with respiratory depression, hypotension, head injury, renal impairment, or sedative coadministration.",
      action: "Binds opioid receptors to alter pain perception and response.",
      nursing: "Assess pain, sedation, respiratory rate, BP, bowel function, and naloxone availability.",
      indications: "Moderate to severe acute pain, severe chronic pain when appropriate.",
      sideEffects: "Constipation, nausea, pruritus, drowsiness.",
      adverseEffects: "Respiratory depression, severe hypotension, overdose, dependence."
    },
    {
      id: "oxytocin-30-units-bag",
      name: "Oxytocin 30 units bag",
      generic: "oxytocin",
      brand: "Pitocin",
      category: "Uterotonic",
      aliases: "oxytocin pitocin uterotonic labor postpartum hemorrhage ob",
      onHand: 18,
      par: 8,
      doses: ["Per induction protocol IV", "10 units IM after delivery", "30 units in IV fluid per PPH protocol"],
      availability: "Premixed OB bag and vial; OB emergency stock",
      classification: "Posterior pituitary hormone; uterotonic.",
      uses: "Labor induction/augmentation and postpartum uterine atony management.",
      precautions: "Use fetal and uterine monitoring during labor; caution with uterine scar, malpresentation, or fetal distress.",
      action: "Stimulates uterine smooth-muscle contraction.",
      nursing: "Monitor contraction pattern, fetal status, bleeding, fundal tone, BP, and IV pump settings.",
      indications: "Labor induction/augmentation, postpartum hemorrhage prevention or treatment.",
      sideEffects: "Cramping, nausea, flushing.",
      adverseEffects: "Uterine tachysystole, fetal distress, uterine rupture, water intoxication."
    },
    {
      id: "haloperidol-5-mg-ampule",
      name: "Haloperidol 5 mg ampule",
      generic: "haloperidol",
      brand: "Haldol",
      category: "Typical antipsychotic",
      aliases: "haloperidol haldol antipsychotic agitation delirium psychosis",
      onHand: 14,
      par: 6,
      doses: ["2 mg IM once", "5 mg IM once", "0.5-2 mg PO/IV per order"],
      availability: "Ampule and tablets; behavioral health medication bin",
      classification: "Butyrophenone antipsychotic.",
      uses: "Acute agitation, psychosis, and selected delirium protocols.",
      precautions: "Use caution with QT prolongation, Parkinson disease, dementia-related psychosis, and electrolyte imbalance.",
      action: "Blocks dopamine receptors in the CNS.",
      nursing: "Assess behavior, EPS, sedation, ECG risk, fall risk, and therapeutic response.",
      indications: "Schizophrenia symptoms, acute agitation, severe nausea in selected protocols.",
      sideEffects: "Drowsiness, dry mouth, akathisia, constipation.",
      adverseEffects: "QT prolongation, neuroleptic malignant syndrome, tardive dyskinesia, severe EPS."
    },
    {
      id: "amlodipine-5-mg-tablet",
      name: "Amlodipine 5 mg tablet",
      generic: "amlodipine",
      brand: "Norvasc",
      category: "Calcium channel blocker",
      aliases: "amlodipine norvasc calcium channel blocker hypertension angina",
      onHand: 80,
      par: 30,
      doses: ["5 mg PO daily", "10 mg PO daily"],
      availability: "Tablets; cardiac drawer",
      classification: "Dihydropyridine calcium channel blocker.",
      uses: "Hypertension and angina management.",
      precautions: "Use caution with severe aortic stenosis, liver impairment, hypotension, or heart failure symptoms.",
      action: "Relaxes vascular smooth muscle, reducing peripheral resistance.",
      nursing: "Monitor BP, edema, dizziness, heart rate, and adherence.",
      indications: "Hypertension, chronic stable angina, vasospastic angina.",
      sideEffects: "Peripheral edema, flushing, dizziness.",
      adverseEffects: "Symptomatic hypotension, worsening angina rarely after initiation."
    },
    {
      id: "captopril-25-mg-tablet",
      name: "Captopril 25 mg tablet",
      generic: "captopril",
      brand: "Capoten",
      category: "ACE inhibitor",
      aliases: "captopril capoten ace inhibitor hypertension heart failure",
      onHand: 45,
      par: 16,
      doses: ["12.5 mg PO once", "25 mg PO BID/TID", "50 mg PO TID"],
      availability: "Tablets; cardiac drawer",
      classification: "Angiotensin-converting enzyme inhibitor.",
      uses: "Hypertension, heart failure, and selected renal/cardiac protection indications.",
      precautions: "Avoid in pregnancy and history of angioedema; use caution with renal artery stenosis or hyperkalemia.",
      action: "Reduces angiotensin II formation and aldosterone secretion.",
      nursing: "Monitor BP, potassium, creatinine, cough, dizziness, and angioedema symptoms.",
      indications: "Hypertension, heart failure, post-MI LV dysfunction, diabetic nephropathy.",
      sideEffects: "Cough, dizziness, taste changes.",
      adverseEffects: "Angioedema, hyperkalemia, acute kidney injury, fetal toxicity."
    },
    {
      id: "dexamethasone-4-mg-tablet",
      name: "Dexamethasone 4 mg tablet",
      generic: "dexamethasone",
      brand: "Decadron",
      category: "Corticosteroid",
      aliases: "dexamethasone decadron corticosteroid steroid inflammation cerebral edema",
      onHand: 32,
      par: 12,
      doses: ["4 mg PO/IV q6h", "6 mg PO/IV daily", "10 mg IV once"],
      availability: "Tablets and injectable; steroid bin",
      classification: "Long-acting glucocorticoid.",
      uses: "Inflammation, airway edema, cerebral edema, allergic reactions, and other steroid-responsive conditions.",
      precautions: "Use caution with infection, diabetes, GI bleeding risk, mood disorders, and long-term adrenal suppression.",
      action: "Suppresses inflammatory and immune responses.",
      nursing: "Monitor glucose, infection signs, GI symptoms, mood changes, and taper instructions when prolonged.",
      indications: "Inflammatory, allergic, respiratory, neurologic edema, and antiemetic adjunct indications.",
      sideEffects: "Hyperglycemia, insomnia, mood changes, increased appetite.",
      adverseEffects: "Adrenal suppression, GI bleeding, infection masking, psychosis."
    },
    {
      id: "metformin-500-mg-tablet",
      name: "Metformin 500 mg tablet",
      generic: "metformin",
      brand: "Glucophage",
      category: "Biguanide antidiabetic",
      aliases: "metformin glucophage diabetes biguanide oral hypoglycemic",
      onHand: 90,
      par: 30,
      doses: ["500 mg PO BID with meals", "850 mg PO daily", "1,000 mg PO BID with meals"],
      availability: "Tablets; endocrine drawer",
      classification: "Biguanide antihyperglycemic.",
      uses: "Type 2 diabetes management.",
      precautions: "Hold/clarify with severe renal impairment, metabolic acidosis, or iodinated contrast per policy.",
      action: "Decreases hepatic glucose production and improves insulin sensitivity.",
      nursing: "Monitor glucose, renal function, GI tolerance, and contrast-procedure instructions.",
      indications: "Type 2 diabetes mellitus.",
      sideEffects: "Diarrhea, nausea, abdominal discomfort, metallic taste.",
      adverseEffects: "Lactic acidosis, vitamin B12 deficiency with long-term use."
    },
    {
      id: "lidocaine-1-percent-vial",
      name: "Lidocaine 1% vial",
      generic: "lidocaine",
      brand: "Xylocaine",
      category: "Local anesthetic",
      aliases: "lidocaine xylocaine local anesthetic infiltration procedure",
      onHand: 28,
      par: 10,
      doses: ["Infiltrate per procedure order", "Use dose limit per policy"],
      availability: "Multidose vial; procedure cart",
      classification: "Amide local anesthetic.",
      uses: "Local anesthesia for procedures and line insertion.",
      precautions: "Check allergy, concentration, epinephrine content, and maximum dose.",
      action: "Blocks sodium channels to inhibit nerve impulse conduction.",
      nursing: "Assess site, dose, aspiration before injection per technique, and toxicity symptoms.",
      indications: "Local or regional anesthesia.",
      sideEffects: "Local numbness, mild burning.",
      adverseEffects: "CNS toxicity, seizures, arrhythmias, methemoglobinemia with some formulations."
    }
  ];

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function find(value) {
    const key = String(value || "").toLowerCase();
    if (!key) return null;
    return items.find(item => item.id === value || key.includes(String(item.generic || "").toLowerCase()) || key.includes(item.name.toLowerCase().split(/\s+\d/)[0]) || item.aliases.split(/\s+/).some(a => a.length > 3 && key.includes(a)));
  }

  function toLegacy(item) {
    return [item.name, item.onHand, item.par, item.category, item.aliases, item];
  }

  function doseOptions(item, selected) {
    const doses = item && item.doses ? item.doses : [];
    const cur = selected || (doses[0] || "");
    return doses.map(d => `<option${d === cur ? " selected" : ""}>${esc(d)}</option>`).join("");
  }

  function cardHtml(raw) {
    const item = typeof raw === "object" ? raw : find(raw);
    if (!item) return "";
    const pairs = [
      ["Classification", item.classification],
      ["Uses", item.uses],
      ["Precautions", item.precautions],
      ["Action", item.action],
      ["Nursing Considerations", item.nursing],
      ["Indications", item.indications],
      ["Side Effects", item.sideEffects],
      ["Adverse Effects", item.adverseEffects]
    ];
    return `<div class="drug-popover" role="dialog" aria-label="${esc(item.generic)} handbook card">
      <div class="drug-popover-head">
        <div><small>${esc(item.category)}</small><h3>${esc(item.generic)}</h3><p>Brand: ${esc(item.brand)} | ${esc(item.availability)}</p></div>
        <button class="drug-popover-close" data-drug-close aria-label="Close">x</button>
      </div>
      <div class="drug-dose-row">${item.doses.map(d => `<span>${esc(d)}</span>`).join("")}</div>
      <dl>${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </div>`;
  }

  function showCard(target, id) {
    const item = find(id);
    if (!item) return;
    document.querySelectorAll(".drug-popover").forEach(el => el.remove());
    const wrap = document.createElement("div");
    wrap.innerHTML = cardHtml(item);
    const pop = wrap.firstElementChild;
    document.body.appendChild(pop);
    const rect = target.getBoundingClientRect();
    const left = Math.min(window.innerWidth - 390, Math.max(12, rect.left));
    const top = Math.min(window.innerHeight - 500, Math.max(12, rect.bottom + 8));
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.querySelector("[data-drug-close]")?.addEventListener("click", () => pop.remove());
  }

  function bindDrugCards(root) {
    (root || document).querySelectorAll("[data-med-info]").forEach(el => {
      if (el.dataset.drugBound) return;
      el.dataset.drugBound = "1";
      el.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        showCard(el, el.dataset.medInfo);
      });
      el.addEventListener("mouseenter", () => showCard(el, el.dataset.medInfo));
    });
  }

  function bindDosePicker(itemSelectId, doseSelectId) {
    const itemSelect = document.getElementById(itemSelectId);
    const doseSelect = document.getElementById(doseSelectId);
    if (!itemSelect || !doseSelect) return;
    const sync = () => {
      const item = find(itemSelect.value);
      if (!item) return;
      doseSelect.innerHTML = doseOptions(item);
    };
    itemSelect.addEventListener("change", sync);
    sync();
  }

  document.addEventListener("click", e => {
    if (!e.target.closest(".drug-popover") && !e.target.closest("[data-med-info]")) {
      document.querySelectorAll(".drug-popover").forEach(el => el.remove());
    }
  });

  window.HctMedicationInventory = { items, find, toLegacy, doseOptions, cardHtml, bindDrugCards, bindDosePicker };
})();
