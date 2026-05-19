(function () {
  const h = window.HctMedicationInventory;
  if (!h || !Array.isArray(h.items)) return;

  const additions = [
    drug("thiamine-100-mg", "Thiamine 100 mg", "thiamine", "Vitamin B1", "Vitamin replacement", "thiamine vitamin b1 wernicke hyperemesis alcohol dextrose", 40, 12, ["100 mg IV once", "100 mg PO daily", "100 mg IV/PO daily"], "Vitamin drawer and IV medication bin", "Water-soluble B vitamin.", "Prevention or treatment of thiamine deficiency and Wernicke encephalopathy risk.", "Give before dextrose in malnourished, hyperemesis, or alcohol-use risk patients when ordered.", "Replaces thiamine required for carbohydrate metabolism and neurologic function.", "Assess nutrition risk, vomiting history, alcohol-use risk, IV compatibility, and response.", "Deficiency prevention or treatment; hyperemesis or alcohol-related deficiency risk.", "Mild GI upset, injection-site discomfort.", "Hypersensitivity, rare anaphylaxis with parenteral use."),
    drug("dextrose-half-ns-kcl", "D5 0.45% NaCl + 20 mEq KCl", "dextrose 5% in 0.45% sodium chloride with potassium chloride", "D5 half-normal saline with KCl", "Maintenance IV fluid with electrolyte", "d5 half ns potassium chloride kcl dextrose sodium chloride maintenance fluid", 24, 8, ["150 mL/hr IV continuous", "100 mL/hr IV continuous", "Per provider order"], "Premixed IV fluid shelf", "Hypotonic dextrose-containing crystalloid with potassium supplement.", "Maintenance fluid, carbohydrate support, and potassium replacement when ordered.", "Do not start potassium-containing fluids until renal function and urine output are appropriate; verify pump rate.", "Provides water, dextrose calories, sodium/chloride, and potassium replacement.", "Monitor glucose, potassium, renal function, IV site, I&O, and cardiac rhythm when indicated.", "Maintenance hydration with ordered potassium supplementation.", "Local irritation, hyperglycemia.", "Hyperkalemia, phlebitis, fluid overload, severe electrolyte imbalance."),
    drug("mvi-in-lr", "Lactated Ringer's with MVI", "lactated Ringer's solution with multivitamin infusion", "LR with MVI", "Balanced crystalloid with vitamins", "lactated ringers lr mvi multivitamin banana bag vitamin infusion", 18, 6, ["1 L IV bolus", "500 mL/hr IV", "Per protocol"], "IV fluid and vitamin additive stock", "Balanced crystalloid with multivitamin additive.", "Fluid support with vitamin replacement in dehydration or nutrition-risk scenarios.", "Verify additives, compatibility, light protection if required, and ordered rate.", "Expands extracellular volume while supplying water-soluble vitamins.", "Monitor I&O, lung sounds, IV site, allergies to additives, and electrolyte trends.", "Dehydration with ordered multivitamin replacement.", "Infusion-site irritation, nausea.", "Fluid overload, hypersensitivity to additive components, electrolyte disturbance."),
    drug("methylergonovine-0-2-mg", "Methylergonovine 0.2 mg", "methylergonovine", "Methergine", "Ergot uterotonic", "methylergonovine methergine uterotonic postpartum hemorrhage pph ergot", 12, 6, ["0.2 mg IM once", "0.2 mg PO q6-8h short course"], "OB emergency stock", "Ergot alkaloid uterotonic.", "Postpartum uterine atony or hemorrhage when not contraindicated.", "Avoid in hypertension, preeclampsia, or significant cardiovascular disease unless specifically directed.", "Produces sustained uterine smooth-muscle contraction through serotonergic and alpha-adrenergic activity.", "Check BP before giving, assess fundal tone and bleeding, and escalate severe hypertension or chest pain.", "Postpartum hemorrhage due to uterine atony.", "Nausea, vomiting, cramping, headache.", "Severe hypertension, seizure, stroke, myocardial ischemia, vasospasm."),
    drug("ipratropium-0-5-mg-nebule", "Ipratropium 0.5 mg nebule", "ipratropium", "Atrovent", "Anticholinergic bronchodilator", "ipratropium atrovent anticholinergic bronchodilator nebulizer asthma copd", 30, 12, ["0.5 mg nebulized once", "0.5 mg nebulized q4-6h"], "Respiratory medication drawer", "Inhaled antimuscarinic bronchodilator.", "Bronchospasm treatment, often paired with albuterol in acute asthma or COPD protocols.", "Use caution with glaucoma, urinary retention, or anticholinergic sensitivity.", "Blocks muscarinic receptors in bronchial smooth muscle, reducing bronchoconstriction.", "Assess breath sounds, work of breathing, oxygen saturation, secretions, and anticholinergic effects.", "Bronchospasm in asthma or COPD exacerbation protocols.", "Dry mouth, cough, throat irritation.", "Paradoxical bronchospasm, urinary retention, angle-closure glaucoma symptoms."),
    drug("lorazepam-2-mg", "Lorazepam 2 mg", "lorazepam", "Ativan", "Benzodiazepine", "lorazepam ativan benzodiazepine anxiety agitation seizure sedation", 18, 8, ["1 mg PO/IV/IM once", "2 mg IM once", "0.5-2 mg per order"], "Controlled medication storage", "Benzodiazepine anxiolytic, sedative, and anticonvulsant.", "Acute anxiety, agitation, seizure activity, alcohol withdrawal, or procedural sedation protocols.", "Use caution with respiratory disease, opioids, alcohol, older adults, and fall risk.", "Enhances GABA activity in the CNS, increasing inhibitory neurotransmission.", "Monitor sedation, respiratory rate, BP, fall risk, paradoxical agitation, and reversal/support resources.", "Anxiety, acute agitation, seizure control, withdrawal protocols.", "Drowsiness, dizziness, weakness.", "Respiratory depression, severe hypotension, dependence, withdrawal, paradoxical agitation."),
    drug("benztropine-1-mg", "Benztropine 1 mg", "benztropine", "Cogentin", "Anticholinergic antiparkinsonian", "benztropine cogentin eps dystonia anticholinergic extrapyramidal", 16, 6, ["1 mg PO/IM once", "1-2 mg PO daily or BID"], "Behavioral health medication bin", "Centrally acting anticholinergic.", "Treatment or prevention of extrapyramidal symptoms from antipsychotics.", "Use caution with glaucoma, urinary retention, bowel obstruction, tachyarrhythmias, and older adults.", "Restores dopamine-acetylcholine balance by blocking central muscarinic activity.", "Assess EPS symptoms, temperature, bowel/urinary status, mental status, and anticholinergic burden.", "Acute dystonia, drug-induced parkinsonism, EPS management.", "Dry mouth, blurred vision, constipation, dizziness.", "Confusion, urinary retention, hyperthermia, ileus, angle-closure glaucoma."),
    drug("aspirin-81-mg", "Aspirin 81 mg", "aspirin", "Bayer, Ecotrin", "Antiplatelet / salicylate", "aspirin asa antiplatelet salicylate pain fever cardiac stroke", 100, 30, ["81 mg PO daily", "80 mg PO daily", "325 mg PO once"], "Antiplatelet drawer", "Salicylate antiplatelet and analgesic.", "Antiplatelet therapy and selected pain, fever, or ACS protocols.", "Avoid with active bleeding, true aspirin allergy, severe asthma sensitivity, or pediatric viral illness unless ordered.", "Irreversibly inhibits platelet cyclooxygenase, reducing thromboxane A2 and platelet aggregation.", "Check allergy, bleeding risk, platelet/anticoagulant use, GI symptoms, and procedure plans.", "Secondary cardiovascular prevention, ACS protocols, pain or fever when appropriate.", "Dyspepsia, bruising, nausea.", "GI bleeding, bronchospasm, anaphylaxis, hemorrhagic stroke, salicylate toxicity."),
    drug("metoclopramide-10-mg", "Metoclopramide 10 mg", "metoclopramide", "Reglan", "Dopamine antagonist antiemetic / prokinetic", "metoclopramide reglan antiemetic prokinetic nausea vomiting gastroparesis", 20, 8, ["10 mg IV push once", "10 mg PO/IV q6h PRN", "5 mg IV once"], "Antiemetic bin", "Dopamine receptor antagonist with prokinetic activity.", "Nausea, vomiting, gastroparesis, and gastric emptying support when ordered.", "Use caution with Parkinson disease, bowel obstruction, seizure disorder, depression, and prolonged use.", "Blocks dopamine receptors and enhances upper GI motility through cholinergic effects.", "Monitor nausea relief, bowel sounds, sedation, diarrhea, akathisia, dystonia, and duration limits.", "Nausea/vomiting, diabetic gastroparesis, gastric emptying support.", "Drowsiness, diarrhea, restlessness.", "Tardive dyskinesia, neuroleptic malignant syndrome, acute dystonia, depression worsening."),
    drug("magnesium-sulfate-2-g", "Magnesium sulfate 2 g", "magnesium sulfate", "Magnesium sulfate", "Electrolyte replacement / anticonvulsant", "magnesium sulfate mgso4 magnesium hypomagnesemia eclampsia electrolyte", 22, 8, ["2 g IV over 1 hr", "4 g IV loading dose per protocol", "1-2 g/hr IV infusion"], "High-alert electrolyte bin", "Magnesium salt electrolyte replacement.", "Hypomagnesemia replacement and selected obstetric, arrhythmia, or asthma protocols.", "Use caution with renal impairment, heart block, myasthenia gravis, and respiratory compromise.", "Replaces magnesium needed for neuromuscular and cardiac stability; decreases acetylcholine release at high levels.", "Monitor reflexes, respiratory rate, BP, urine output, magnesium level, and calcium gluconate availability for high-dose therapy.", "Hypomagnesemia, seizure prophylaxis in preeclampsia/eclampsia, torsades protocols.", "Flushing, warmth, nausea, drowsiness.", "Respiratory depression, loss of reflexes, hypotension, cardiac arrest with toxicity."),
    drug("potassium-chloride-10-meq", "Potassium chloride 10 mEq", "potassium chloride", "KCl", "Electrolyte replacement", "potassium chloride kcl potassium hypokalemia electrolyte high alert", 28, 10, ["10 mEq IV over 1 hr", "20 mEq PO once", "Per replacement protocol"], "High-alert electrolyte storage", "Potassium salt electrolyte replacement.", "Treatment or prevention of hypokalemia when ordered.", "Never give IV push; verify renal function, urine output, concentration, route, and infusion rate.", "Replaces potassium required for cardiac conduction, skeletal muscle, and cellular function.", "Use pump for IV infusion, monitor potassium, renal function, IV site, and cardiac rhythm when indicated.", "Hypokalemia treatment or prevention.", "GI upset with oral forms, IV site burning.", "Hyperkalemia, arrhythmias, cardiac arrest, phlebitis or tissue injury from IV infiltration."),
    drug("rivaroxaban-15-mg", "Rivaroxaban 15 mg", "rivaroxaban", "Xarelto", "Direct oral anticoagulant", "rivaroxaban xarelto doac factor xa anticoagulant dvt pe", 36, 12, ["15 mg PO with food", "20 mg PO with evening meal", "10 mg PO daily"], "Anticoagulant drawer", "Direct factor Xa inhibitor anticoagulant.", "Treatment or prevention of DVT/PE and stroke prevention in nonvalvular atrial fibrillation.", "Use caution with renal/hepatic impairment, active bleeding, neuraxial procedures, and interacting drugs.", "Selectively inhibits factor Xa, reducing thrombin generation and clot formation.", "Verify indication, dose timing with food when required, renal function, bleeding signs, and adherence teaching.", "DVT/PE treatment or prophylaxis; stroke prevention in atrial fibrillation.", "Bruising, nausea, mild bleeding.", "Major bleeding, spinal/epidural hematoma, thrombosis if stopped prematurely."),
    drug("metoprolol-succinate-100-mg", "Metoprolol succinate 100 mg", "metoprolol succinate", "Toprol XL", "Beta1-selective beta blocker", "metoprolol succinate toprol beta blocker beta1 hypertension afib angina", 50, 16, ["25 mg PO daily", "50 mg PO daily", "100 mg PO daily"], "Cardiac drawer", "Beta1-selective adrenergic blocker.", "Hypertension, angina, heart failure regimens, and rate control when ordered.", "Use caution with bradycardia, heart block, hypotension, asthma/COPD, diabetes, and abrupt withdrawal.", "Blocks beta1 receptors, lowering heart rate, contractility, and renin release.", "Check apical pulse and BP, hold per parameters, monitor dizziness, fatigue, glucose masking, and worsening HF.", "Hypertension, angina, heart failure, rate control.", "Fatigue, dizziness, bradycardia.", "Heart block, severe hypotension, bronchospasm, worsening heart failure."),
    drug("atorvastatin-80-mg", "Atorvastatin 80 mg", "atorvastatin", "Lipitor", "HMG-CoA reductase inhibitor", "atorvastatin lipitor statin cholesterol hyperlipidemia cardiovascular", 70, 20, ["20 mg PO daily", "40 mg PO daily", "80 mg PO daily"], "Lipid-lowering drawer", "Statin antihyperlipidemic.", "Hyperlipidemia and cardiovascular risk reduction.", "Use caution with active liver disease, pregnancy, interacting drugs, or unexplained muscle pain.", "Inhibits HMG-CoA reductase, decreasing hepatic cholesterol synthesis and increasing LDL clearance.", "Monitor lipid response, liver symptoms, muscle pain/weakness, CK if indicated, and adherence.", "Hyperlipidemia, ASCVD risk reduction, post-ACS therapy.", "Headache, GI upset, myalgia.", "Rhabdomyolysis, hepatotoxicity, severe hypersensitivity."),
    drug("nitroglycerin-0-4-mg-sl", "Nitroglycerin 0.4 mg SL", "nitroglycerin", "Nitrostat", "Nitrate antianginal", "nitroglycerin nitro nitrate antianginal chest pain sublingual", 35, 10, ["0.4 mg SL q5min x3 PRN chest pain", "Apply topical/transdermal per order"], "Emergency cardiac drawer", "Organic nitrate vasodilator.", "Acute angina relief and selected heart failure or hypertensive emergency protocols.", "Contraindicated with recent PDE-5 inhibitor use or severe hypotension; use caution with right ventricular infarct.", "Releases nitric oxide, relaxing vascular smooth muscle and reducing myocardial oxygen demand.", "Check BP and pain before each dose, keep patient seated, screen for PDE-5 inhibitors, and escalate persistent pain.", "Acute angina, ischemic chest pain protocols.", "Headache, flushing, dizziness.", "Severe hypotension, syncope, reflex tachycardia, methemoglobinemia rarely."),
    drug("enoxaparin-40-mg", "Enoxaparin 40 mg", "enoxaparin", "Lovenox", "Low-molecular-weight heparin", "enoxaparin lovenox lmwh anticoagulant dvt prophylaxis factor xa", 32, 12, ["40 mg SQ daily", "30 mg SQ q12h", "1 mg/kg SQ q12h"], "Anticoagulant high-alert storage", "Low-molecular-weight heparin anticoagulant.", "VTE prophylaxis and treatment when ordered.", "Use caution with renal impairment, low platelets, active bleeding, neuraxial anesthesia, and weight extremes.", "Potentiates antithrombin inhibition of factor Xa and thrombin activity.", "Verify dose, renal function, platelet count, bleeding signs, injection technique, and do not expel air bubble from prefilled syringe unless policy says otherwise.", "DVT/PE prophylaxis or treatment, bridging anticoagulation protocols.", "Bruising, injection-site pain.", "Major bleeding, spinal hematoma, thrombocytopenia/HIT, hyperkalemia."),
    drug("donepezil-5-mg", "Donepezil 5 mg", "donepezil", "Aricept", "Cholinesterase inhibitor", "donepezil aricept cholinesterase inhibitor alzheimer dementia", 36, 12, ["5 mg PO daily", "10 mg PO daily"], "Neurology/geriatric drawer", "Acetylcholinesterase inhibitor.", "Cognitive symptoms of Alzheimer disease and selected dementia regimens.", "Use caution with bradycardia, syncope, GI ulcer/bleeding risk, asthma/COPD, and seizure history.", "Inhibits acetylcholinesterase, increasing acetylcholine availability in the CNS.", "Monitor pulse, syncope/falls, weight, nausea/diarrhea, sleep disturbance, and caregiver adherence.", "Mild, moderate, or severe Alzheimer disease symptoms.", "Nausea, diarrhea, insomnia, muscle cramps.", "Bradycardia, syncope, GI bleeding, seizures, severe vomiting/dehydration."),
    drug("lisinopril-40-mg", "Lisinopril 40 mg", "lisinopril", "Prinivil, Zestril", "ACE inhibitor", "lisinopril prinivil zestril ace inhibitor hypertension heart failure renal", 55, 18, ["10 mg PO daily", "20 mg PO daily", "40 mg PO daily"], "Cardiac drawer", "Angiotensin-converting enzyme inhibitor.", "Hypertension, heart failure, and renal/cardiac protection indications.", "Avoid in pregnancy and history of ACE-inhibitor angioedema; use caution with renal artery stenosis or hyperkalemia.", "Reduces angiotensin II and aldosterone, lowering vascular resistance and sodium retention.", "Monitor BP, potassium, creatinine, cough, dizziness, and swelling of face/lips/tongue.", "Hypertension, heart failure, post-MI therapy, diabetic kidney protection.", "Cough, dizziness, fatigue.", "Angioedema, hyperkalemia, acute kidney injury, fetal toxicity."),
    drug("hydrocodone-apap-5-325", "Hydrocodone/APAP 5/325 mg", "hydrocodone-acetaminophen", "Norco, Vicodin", "Opioid combination analgesic", "hydrocodone apap acetaminophen norco vicodin opioid pain", 24, 8, ["5/325 mg PO q6h PRN", "10/325 mg PO q6h PRN"], "Controlled medication storage", "Opioid agonist plus nonopioid analgesic.", "Moderate to severe pain when nonopioid therapy is inadequate.", "Use caution with respiratory depression risk, sedatives, liver disease, alcohol use, constipation, and fall risk.", "Hydrocodone activates opioid receptors; acetaminophen provides central analgesic and antipyretic effect.", "Assess pain, sedation, RR, BP, bowel regimen, fall risk, total daily acetaminophen, and naloxone access.", "Moderate to severe acute pain.", "Drowsiness, nausea, constipation, pruritus.", "Respiratory depression, overdose, dependence, hepatotoxicity from acetaminophen."),
    drug("ibuprofen-800-mg", "Ibuprofen 800 mg", "ibuprofen", "Advil, Motrin", "NSAID analgesic", "ibuprofen advil motrin nsaid pain fever inflammation", 80, 25, ["400 mg PO q6h PRN", "600 mg PO q6h PRN", "800 mg PO q6-8h PRN"], "Analgesic drawer", "Nonsteroidal anti-inflammatory drug.", "Pain, fever, and inflammation management.", "Use caution with renal impairment, GI bleed risk, anticoagulants, heart failure, hypertension, asthma sensitivity, and pregnancy late term.", "Inhibits cyclooxygenase enzymes, decreasing prostaglandin-mediated inflammation and pain.", "Give with food if appropriate; monitor pain, GI bleeding, renal function, BP, and allergy history.", "Mild to moderate pain, fever, inflammatory conditions.", "Dyspepsia, nausea, dizziness.", "GI bleeding, renal injury, bronchospasm, cardiovascular thrombotic events."),
    drug("hydrochlorothiazide-25-mg", "HCTZ 25 mg", "hydrochlorothiazide", "Microzide", "Thiazide diuretic", "hydrochlorothiazide hctz thiazide diuretic hypertension edema sulfa", 45, 16, ["12.5 mg PO daily", "25 mg PO daily"], "Cardiac drawer", "Thiazide diuretic antihypertensive.", "Hypertension and edema management when ordered.", "Use caution with sulfonamide sensitivity, gout, diabetes, electrolyte depletion, renal impairment, and dehydration.", "Inhibits sodium-chloride reabsorption in the distal tubule, increasing diuresis and lowering BP.", "Monitor BP, I&O, daily weight, sodium, potassium, glucose, uric acid, and orthostatic symptoms.", "Hypertension, edema adjunct therapy.", "Increased urination, dizziness, photosensitivity.", "Hypokalemia, hyponatremia, dehydration, gout flare, severe hypotension."),
    drug("docusate-100-mg", "Docusate sodium 100 mg", "docusate sodium", "Colace", "Stool softener", "docusate sodium colace stool softener constipation opioid", 60, 20, ["100 mg PO daily", "100 mg PO BID"], "Bowel regimen drawer", "Surfactant laxative stool softener.", "Prevention or treatment of constipation, often with opioid therapy or reduced mobility.", "Avoid with suspected bowel obstruction, acute abdominal pain, nausea/vomiting of unknown cause.", "Lowers stool surface tension, allowing water and fat to penetrate stool.", "Assess bowel pattern, hydration, abdominal symptoms, opioid use, and effectiveness.", "Constipation prevention or treatment.", "Mild cramping, throat irritation with liquid.", "Severe diarrhea, electrolyte imbalance with overuse, hypersensitivity."),
    drug("azathioprine-100-mg", "Azathioprine 100 mg", "azathioprine", "Imuran", "Immunosuppressant antimetabolite", "azathioprine imuran immunosuppressant crohns transplant autoimmune", 20, 6, ["50 mg PO daily", "100 mg PO daily", "Dose by weight/order"], "Immunosuppressant storage", "Purine antimetabolite immunosuppressant.", "Crohn disease, autoimmune conditions, and transplant immunosuppression when ordered.", "Use caution with infection, liver disease, low TPMT/NUDT15 activity, pregnancy planning, and interacting allopurinol/febuxostat.", "Converted to mercaptopurine metabolites that inhibit purine synthesis and lymphocyte proliferation.", "Monitor CBC, liver tests, infection signs, GI tolerance, and medication interactions.", "Inflammatory bowel disease, autoimmune disease, transplant immunosuppression.", "Nausea, fatigue, mild rash.", "Myelosuppression, serious infection, hepatotoxicity, pancreatitis, malignancy risk."),
    drug("infliximab-120-mg", "Infliximab 120 mg", "infliximab", "Remicade, Inflectra", "TNF blocker biologic", "infliximab remicade inflectra tnf biologic crohns rheumatoid psoriasis", 8, 3, ["Dose by weight IV infusion", "Maintenance every 6-8 weeks", "Per specialty protocol"], "Specialty biologic infusion stock", "Tumor necrosis factor-alpha inhibitor biologic.", "Inflammatory bowel disease and selected autoimmune inflammatory conditions.", "Screen for TB/hepatitis and avoid live vaccines; use caution with serious infection, heart failure, and prior infusion reactions.", "Binds TNF-alpha, reducing inflammatory cytokine activity.", "Verify screening, premedications if ordered, infusion rate, reaction readiness, infection symptoms, and follow-up schedule.", "Crohn disease, ulcerative colitis, rheumatoid arthritis, psoriasis, ankylosing spondylitis.", "Headache, nausea, infusion-site or infusion reaction symptoms.", "Serious infection, anaphylaxis/infusion reaction, hepatitis B reactivation, malignancy risk, heart failure worsening."),
    drug("escitalopram-10-mg", "Escitalopram 10 mg", "escitalopram", "Lexapro", "SSRI antidepressant", "escitalopram lexapro ssri depression anxiety serotonin", 48, 16, ["10 mg PO daily", "20 mg PO daily"], "Behavioral health drawer", "Selective serotonin reuptake inhibitor.", "Depression and anxiety disorder treatment.", "Use caution with QT prolongation, bipolar disorder, serotonin drugs, bleeding risk, and suicide risk early in therapy.", "Inhibits serotonin reuptake, increasing serotonergic activity in the CNS.", "Monitor mood, suicidality, sleep, GI effects, serotonin syndrome, bleeding risk, and adherence.", "Major depressive disorder, generalized anxiety disorder, other anxiety indications.", "Nausea, insomnia, sexual dysfunction, sweating.", "Serotonin syndrome, QT prolongation, hyponatremia, suicidality warning, withdrawal symptoms if abruptly stopped.")
  ];

  function drug(id, name, generic, brand, category, aliases, onHand, par, doses, availability, classification, uses, precautions, action, nursing, indications, sideEffects, adverseEffects) {
    return { id, name, generic, brand, category, aliases, onHand, par, doses, availability, classification, uses, precautions, action, nursing, indications, sideEffects, adverseEffects };
  }

  function mergeText(a, b) {
    const set = new Set(String(a || "").split(/\s+/).filter(Boolean));
    String(b || "").split(/\s+/).filter(Boolean).forEach(x => set.add(x));
    return Array.from(set).join(" ");
  }

  function mergeItem(item) {
    const key = item.generic.toLowerCase();
    const existing = h.items.find(x => x.id === item.id || String(x.generic || "").toLowerCase() === key || String(x.name || "").toLowerCase() === item.name.toLowerCase());
    if (!existing) {
      h.items.push(item);
      return;
    }
    Object.keys(item).forEach(k => {
      if (k === "aliases") existing.aliases = mergeText(existing.aliases, item.aliases);
      else if (k === "doses") existing.doses = Array.from(new Set([...(existing.doses || []), ...(item.doses || [])]));
      else if (!existing[k]) existing[k] = item[k];
    });
  }

  additions.forEach(mergeItem);

  function parse(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function stockItem(item) {
    return { id: item.id, name: item.name, onHand: item.onHand, par: item.par, cat: item.category, category: item.category, aliases: item.aliases, brand: item.brand, generic: item.generic, doses: item.doses, availability: item.availability, handbookId: item.id };
  }

  function mergeStockArray(list) {
    let changed = false;
    h.items.forEach(item => {
      const seed = stockItem(item);
      const existing = list.find(x => x.id === seed.id || x.name === seed.name || x.handbookId === seed.id);
      if (!existing) {
        list.push(seed);
        changed = true;
      } else {
        ["cat", "category", "aliases", "brand", "generic", "doses", "availability", "handbookId"].forEach(k => {
          if (!existing[k] && seed[k]) { existing[k] = seed[k]; changed = true; }
        });
      }
    });
    return changed;
  }

  function seedOfflineHis() {
    const state = parse("hct_his_v1") || { inventory: {}, labStatus: {}, medStatus: {}, supplyRequests: [] };
    state.inventory = state.inventory || {};
    state.inventory.pharmacy = Array.isArray(state.inventory.pharmacy) ? state.inventory.pharmacy : [];
    if (mergeStockArray(state.inventory.pharmacy)) save("hct_his_v1", state);
  }

  function seedOnlineHis() {
    const state = parse("hct_his_online_mode_v1") || {};
    state.stock = Array.isArray(state.stock) ? state.stock : [];
    if (mergeStockArray(state.stock)) save("hct_his_online_mode_v1", state);
  }

  function addButton(el, item) {
    if (!item || el.dataset.medExpansionAnnotated || el.parentElement?.querySelector(".drug-info-btn")) return;
    el.dataset.medExpansionAnnotated = "1";
    el.insertAdjacentHTML("afterend", ` <button class="drug-info-btn" data-med-info="${esc(item.id)}" title="Open medication details">Details</button>`);
  }

  function medRowContext(el) {
    if (el.closest(".his-row, .hisx-row, .his-table, .hisx-table")) return true;
    const row = el.closest("tr");
    if (!row) return false;
    const cells = Array.from(row.children).map(c => c.textContent || "");
    const rest = cells.slice(1).join(" ").toLowerCase();
    return /\b(po|iv|im|sq|subq|nebulized|route|dose|freq|stat|scheduled|prn|pending|given|hold|not given|dispensed|requested)\b/.test(rest);
  }

  function annotateMedicationText(root) {
    const scope = root || document;
    scope.querySelectorAll("td:first-child strong, td:first-child, .his-row strong, .hisx-row strong, .his-table td strong, .hisx-table td strong").forEach(el => {
      if (!medRowContext(el)) return;
      addButton(el, h.find(el.textContent || ""));
    });
    if (typeof h.bindDrugCards === "function") h.bindDrugCards(scope);
  }

  function relabelPopovers(root) {
    (root || document).querySelectorAll(".drug-popover dt").forEach(dt => {
      if (dt.textContent.trim() === "Action") dt.textContent = "Mechanism of Action";
    });
  }

  function enhance() {
    seedOfflineHis();
    seedOnlineHis();
    annotateMedicationText(document);
    relabelPopovers(document);
  }

  h.medicationExpansionVersion = "2026-05-19";
  document.addEventListener("DOMContentLoaded", enhance);
  const observer = new MutationObserver(() => {
    clearTimeout(observer._t);
    observer._t = setTimeout(enhance, 60);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhance();
})();
