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
      classification: "Parenteral fluid and electrolyte replacement; sodium and chloride salt solution.",
      uses: "Replacement of extracellular fluid losses, hypovolemia/dehydration, sodium or chloride depletion, and compatible IV medication dilution or line maintenance when ordered.",
      precautions: "Use cautiously with heart failure, renal impairment, edema, sodium retention, hypertension, or orders requiring fluid restriction; monitor closely when large volumes are infused.",
      action: "Provides sodium and chloride in an isotonic concentration, expanding extracellular and intravascular volume and supporting electrolyte replacement.",
      nursing: "Verify solution, volume, route, pump rate, and compatibility; assess lung sounds, edema, BP, I&O, weight, IV site, and serum sodium/chloride during therapy.",
      indications: "Fluid volume replacement, dehydration, sodium/chloride replacement, and IV access/medication carrier solution.",
      sideEffects: "Local infusion discomfort, phlebitis, mild edema, or warmth at IV site.",
      adverseEffects: "Fluid overload, pulmonary edema, hypernatremia, hyperchloremic metabolic acidosis, and electrolyte imbalance."
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
      classification: "Balanced isotonic crystalloid electrolyte solution.",
      uses: "Replacement of fluid and electrolyte losses, perioperative fluid support, burns/trauma resuscitation protocols, and dehydration treatment when ordered.",
      precautions: "Use cautiously with renal impairment, hyperkalemia, severe hepatic disease, alkalosis, or fluid overload risk; review compatibility before mixing with blood products or medications.",
      action: "Supplies water, sodium, chloride, potassium, calcium, and lactate; lactate is converted to bicarbonate, helping buffer metabolic acidosis.",
      nursing: "Confirm ordered rate and compatibility, monitor I&O, lung sounds, edema, IV site, serum electrolytes, acid-base status, and response to volume replacement.",
      indications: "Hypovolemia, dehydration, perioperative replacement, trauma/burn fluid protocols, and extracellular fluid replacement.",
      sideEffects: "Injection-site discomfort, mild edema, or local irritation.",
      adverseEffects: "Fluid overload, pulmonary edema, electrolyte disturbance, hyperkalemia, metabolic alkalosis, and incompatibility-related precipitation."
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
      classification: "Pharmacotherapeutic: central analgesic. Clinical: nonnarcotic analgesic and antipyretic.",
      uses: "Temporary fever reduction; mild to moderate pain relief; IV use for mild to moderate pain or with opioids for moderate to severe pain in appropriate patients.",
      precautions: "Contraindicated with hypersensitivity, severe hepatic impairment, or severe active liver disease; use cautiously with renal impairment, alcohol dependence, active liver disease, malnutrition, hypovolemia, or G6PD deficiency. Avoid duplicate acetaminophen products.",
      action: "Activates descending serotonergic inhibitory pathways for analgesia and inhibits the hypothalamic heat-regulating center for antipyresis.",
      nursing: "Total all acetaminophen sources, keep within ordered daily maximum, assess pain/temperature response, review alcohol/liver risk, and monitor ALT/AST or overdose symptoms when risk is present.",
      indications: "Analgesia and antipyresis for fever, headache, and mild to moderate pain; adjunct to opioid therapy for more severe pain when ordered.",
      sideEffects: "Nausea, vomiting, headache, and rash.",
      adverseEffects: "Severe liver injury/acute liver failure, overdose toxicity, severe skin reactions, and hypersensitivity."
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
      classification: "Pharmacotherapeutic: adrenergic beta2 agonist. Clinical: bronchodilator.",
      uses: "Prevention and relief of bronchospasm in reversible obstructive airway disease; prevention of exercise-induced bronchospasm.",
      precautions: "Use cautiously with cardiovascular disease, arrhythmias, hypertension, hyperthyroidism, diabetes, seizure disorder, or sensitivity to sympathomimetics.",
      action: "Stimulates beta2-adrenergic receptors in bronchial smooth muscle, increasing cyclic AMP and producing bronchodilation.",
      nursing: "Assess respiratory rate, breath sounds, work of breathing, SpO2, pulse, BP, tremor, and response before and after treatment; teach correct nebulizer/inhaler use.",
      indications: "Asthma or COPD bronchospasm, wheezing, reversible airway obstruction, and exercise-induced bronchospasm prevention.",
      sideEffects: "Tremor, nervousness, headache, dizziness, nausea, throat irritation, palpitations.",
      adverseEffects: "Paradoxical bronchospasm, tachyarrhythmias, chest pain, hypertension, hypokalemia, and hypersensitivity."
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
      classification: "Pharmacotherapeutic: selective serotonin 5-HT3 receptor antagonist. Clinical: antiemetic.",
      uses: "Prevention and treatment of nausea/vomiting associated with surgery, chemotherapy, radiation, gastroenteritis, or medication therapy when ordered.",
      precautions: "Use cautiously with congenital long QT syndrome, electrolyte abnormalities, heart failure, bradyarrhythmias, hepatic impairment, or concurrent QT-prolonging/serotonergic medications.",
      action: "Blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone and on vagal nerve terminals, interrupting emetic signaling.",
      nursing: "Assess nausea/vomiting, hydration, bowel pattern, ECG/QT risk, potassium and magnesium when indicated, and response after dosing.",
      indications: "Postoperative nausea/vomiting, chemotherapy- or radiation-induced nausea/vomiting, and other ordered antiemetic use.",
      sideEffects: "Headache, constipation, dizziness, fatigue, diarrhea.",
      adverseEffects: "QT prolongation/torsades risk, serotonin syndrome, severe hypersensitivity, and ileus masking."
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
      classification: "Pharmacotherapeutic: third-generation cephalosporin. Clinical: anti-infective.",
      uses: "Treatment of susceptible respiratory, skin/soft tissue, urinary, bone/joint, intra-abdominal, bloodstream, CNS, and gonococcal infections; perioperative prophylaxis when ordered.",
      precautions: "Contraindicated with cephalosporin hypersensitivity; use cautiously with penicillin allergy, severe renal/hepatic impairment, GI disease/colitis, biliary disease, or neonates receiving calcium-containing IV solutions.",
      action: "Binds bacterial penicillin-binding proteins and inhibits cell-wall synthesis, causing bacterial cell death.",
      nursing: "Obtain cultures before first dose when ordered, verify allergy history, monitor WBC/temperature, diarrhea, rash/anaphylaxis, renal/hepatic trends, and IV/IM site.",
      indications: "Pneumonia, sepsis/bacteremia, meningitis, UTI, skin/soft tissue infection, intra-abdominal infection, bone/joint infection, and gonorrhea caused by susceptible organisms.",
      sideEffects: "Diarrhea, nausea, rash, injection-site pain, phlebitis.",
      adverseEffects: "Anaphylaxis, C. difficile-associated diarrhea/colitis, biliary sludging, blood dyscrasias, seizures in susceptible patients."
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
      classification: "Pharmacotherapeutic: macrolide. Clinical: anti-infective.",
      uses: "Treatment of susceptible respiratory tract, skin/skin structure, and selected sexually transmitted infections; atypical pneumonia coverage when ordered.",
      precautions: "Contraindicated with hypersensitivity to macrolides or prior cholestatic jaundice/hepatic dysfunction from azithromycin; use cautiously with QT prolongation, arrhythmias, electrolyte imbalance, liver disease, myasthenia gravis, or interacting QT-prolonging drugs.",
      action: "Binds to the 50S ribosomal subunit of susceptible bacteria and inhibits RNA-dependent protein synthesis.",
      nursing: "Review allergy and culture data, assess respiratory/infection response, monitor GI tolerance, diarrhea, liver symptoms, and ECG/QT risk when present.",
      indications: "Community-acquired pneumonia, acute bacterial exacerbation of chronic bronchitis, sinusitis, pharyngitis/tonsillitis, skin infections, and selected STI regimens.",
      sideEffects: "Nausea, diarrhea, abdominal pain, vomiting, headache.",
      adverseEffects: "QT prolongation/torsades, hepatotoxicity, severe hypersensitivity, C. difficile-associated diarrhea, and myasthenia gravis worsening."
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
      classification: "Pharmacotherapeutic: pancreatic hormone. Clinical: antidiabetic, short-acting insulin.",
      uses: "Management of diabetes mellitus and hyperglycemia; IV insulin protocols for DKA/HHS or hyperkalemia when ordered.",
      precautions: "High-alert medication. Use cautiously with hypoglycemia risk, renal/hepatic impairment, poor intake, changing insulin needs, beta-blocker therapy, or potassium depletion.",
      action: "Lowers blood glucose by promoting cellular glucose uptake and inhibiting hepatic glucose production; also shifts potassium into cells.",
      nursing: "Check blood glucose before administration, verify insulin type/concentration/dose with independent double-check, coordinate meals, monitor potassium for IV protocols, and treat hypoglycemia promptly.",
      indications: "Type 1 or type 2 diabetes requiring insulin, correction-scale hyperglycemia, DKA/HHS protocols, and hyperkalemia protocols with glucose support.",
      sideEffects: "Hunger, sweating, tremor, anxiety, headache, injection-site irritation, lipodystrophy.",
      adverseEffects: "Severe hypoglycemia, hypokalemia, anaphylaxis, and serious harm from dosing/concentration errors."
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
      classification: "Pharmacotherapeutic: loop diuretic. Clinical: diuretic and antihypertensive.",
      uses: "Edema associated with heart failure, renal disease, or hepatic disease; acute pulmonary edema; hypertension adjunct when ordered.",
      precautions: "Contraindicated with anuria or hypersensitivity. Use cautiously with fluid/electrolyte depletion, renal/hepatic impairment, diabetes, gout, sulfonamide sensitivity, older adults, or concurrent ototoxic/nephrotoxic drugs.",
      action: "Inhibits sodium and chloride reabsorption in the ascending loop of Henle, increasing excretion of water, sodium, chloride, potassium, magnesium, and calcium.",
      nursing: "Monitor BP, orthostasis, I&O, daily weight, edema/lung sounds, potassium, sodium, BUN/creatinine, and hearing changes with rapid IV/high-dose therapy.",
      indications: "Edema, acute pulmonary edema, heart failure fluid overload, renal/hepatic edema, and hypertension adjunct therapy.",
      sideEffects: "Polyuria, dizziness, thirst, headache, nausea, photosensitivity.",
      adverseEffects: "Severe dehydration, hypotension, hypokalemia/hyponatremia, ototoxicity, renal dysfunction, and metabolic alkalosis."
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
      classification: "Pharmacotherapeutic: anticoagulant. Clinical: antithrombotic.",
      uses: "Prevention and treatment of venous thromboembolism; anticoagulation for acute coronary syndromes, atrial fibrillation, procedures, or lines when ordered.",
      precautions: "Contraindicated with active uncontrollable bleeding or history of heparin-induced thrombocytopenia. Use cautiously with bleeding risk, recent surgery/trauma, hypertension, peptic ulcer disease, liver/renal disease, or concurrent anticoagulants/antiplatelets.",
      action: "Potentiates antithrombin III, inactivating thrombin and factor Xa and preventing conversion of fibrinogen to fibrin.",
      nursing: "Use high-alert double-checks, monitor bleeding, bruising, platelet count, aPTT/anti-Xa per protocol, stool/urine blood, and injection/IV sites; avoid IM injections.",
      indications: "DVT/PE prophylaxis and treatment, ACS anticoagulation, atrial fibrillation embolic prevention, and procedural/line anticoagulation.",
      sideEffects: "Injection-site irritation, bruising, mild bleeding.",
      adverseEffects: "Major hemorrhage, heparin-induced thrombocytopenia with thrombosis, hypersensitivity, and hyperkalemia."
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
      classification: "Pharmacotherapeutic: anticoagulant. Clinical: vitamin K antagonist antithrombotic.",
      uses: "Long-term treatment/prevention of venous thromboembolism and prevention of thromboembolism with atrial fibrillation or prosthetic heart valves when ordered.",
      precautions: "Black box bleeding risk. Contraindicated with pregnancy for many indications, active bleeding, recent/anticipated CNS or eye surgery, severe uncontrolled hypertension, or inability to monitor. Many drug, food, and herbal interactions.",
      action: "Inhibits vitamin K epoxide reductase, decreasing synthesis of clotting factors II, VII, IX, X and proteins C and S.",
      nursing: "Monitor INR/PT and bleeding, verify dose against current INR goal, assess new medications/diet changes, teach consistent vitamin K intake and bleeding precautions.",
      indications: "DVT/PE treatment and prevention, stroke/systemic embolism prevention in atrial fibrillation, and thromboembolism prevention with mechanical/prosthetic valves.",
      sideEffects: "Nausea, abdominal cramps, easy bruising, minor bleeding.",
      adverseEffects: "Major or fatal bleeding, skin necrosis, purple toe syndrome, fetal harm, and calciphylaxis."
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
      classification: "Pharmacotherapeutic: opioid agonist. Clinical: opioid analgesic.",
      uses: "Management of moderate to severe pain; selected acute pulmonary edema or palliative dyspnea use when ordered.",
      precautions: "Black box opioid risks. Use cautiously with respiratory depression, asthma/COPD, head injury, hypotension, GI obstruction, renal/hepatic impairment, older adults, pregnancy, substance use disorder, or other CNS depressants.",
      action: "Binds mu-opioid receptors in the CNS, altering pain perception and emotional response while depressing respiratory and cough centers.",
      nursing: "Assess pain, sedation, respiratory rate, oxygenation, BP, bowel function, fall risk, and response; hold/clarify for excessive sedation or low RR and ensure naloxone availability.",
      indications: "Moderate to severe acute pain, severe chronic pain requiring opioid therapy, and selected dyspnea/palliative protocols.",
      sideEffects: "Constipation, nausea, vomiting, pruritus, drowsiness, dizziness, urinary retention.",
      adverseEffects: "Respiratory depression, profound sedation, hypotension, ileus, overdose, dependence, withdrawal, and serotonin syndrome risk with serotonergic drugs."
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
      classification: "Pharmacotherapeutic: posterior pituitary hormone. Clinical: uterotonic/oxytocic.",
      uses: "Induction or augmentation of labor, control of postpartum uterine bleeding/atony, and promotion of uterine involution when ordered.",
      precautions: "Use cautiously with uterine overdistention, previous uterine surgery/scar, fetal distress, malpresentation, cephalopelvic disproportion, hypertension, or fluid overload risk; continuous monitoring is required during labor infusion.",
      action: "Stimulates uterine smooth muscle by increasing intracellular calcium, strengthening and coordinating contractions; also promotes milk letdown.",
      nursing: "Use infusion pump and protocol, monitor uterine frequency/duration/intensity, fetal heart rate, maternal BP/pulse, I&O, bleeding, fundal tone, and signs of water intoxication.",
      indications: "Labor induction/augmentation, postpartum hemorrhage prevention or treatment due to uterine atony, and postpartum uterine contraction support.",
      sideEffects: "Nausea, vomiting, cramping, flushing, headache.",
      adverseEffects: "Uterine tachysystole, fetal distress, uterine rupture, severe hypertension/hypotension, water intoxication, seizures, and postpartum hemorrhage from overstimulation."
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
      classification: "Pharmacotherapeutic: butyrophenone antipsychotic. Clinical: antipsychotic.",
      uses: "Treatment of schizophrenia and other psychotic disorders; acute agitation or delirium protocols when ordered.",
      precautions: "Black box warning for increased mortality in elderly patients with dementia-related psychosis. Use cautiously with QT prolongation, electrolyte imbalance, Parkinson disease, seizure disorder, CNS depression, hepatic impairment, or concurrent QT-prolonging drugs.",
      action: "Blocks postsynaptic dopamine D2 receptors in the brain, reducing psychotic symptoms and agitation.",
      nursing: "Assess mental status, agitation triggers, EPS/akathisia/dystonia, sedation, orthostatic BP, fall risk, ECG/QT risk, and therapeutic response.",
      indications: "Schizophrenia/psychosis, acute agitation, Tourette disorder, and selected severe nausea/vomiting protocols.",
      sideEffects: "Drowsiness, dry mouth, constipation, blurred vision, akathisia, restlessness.",
      adverseEffects: "QT prolongation/torsades, neuroleptic malignant syndrome, tardive dyskinesia, severe extrapyramidal symptoms, seizures, and hypotension."
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
      classification: "Pharmacotherapeutic: calcium channel blocker. Clinical: antihypertensive and antianginal.",
      uses: "Treatment of hypertension, chronic stable angina, and vasospastic angina.",
      precautions: "Use cautiously with severe aortic stenosis, hypotension, hepatic impairment, heart failure, older adults, or recent dose increases in patients with CAD.",
      action: "Inhibits calcium ion influx across vascular smooth muscle and myocardial cells, causing peripheral arterial vasodilation and reduced afterload.",
      nursing: "Monitor BP, heart rate, edema, dizziness, weight, angina pattern, and adherence; teach slow position changes and reporting swelling or chest pain changes.",
      indications: "Hypertension, chronic stable angina, and vasospastic/Prinzmetal angina.",
      sideEffects: "Peripheral edema, flushing, dizziness, fatigue, palpitations.",
      adverseEffects: "Symptomatic hypotension, syncope, worsening angina or MI after initiation/titration in susceptible patients, and hepatic dysfunction."
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
      classification: "Pharmacotherapeutic: angiotensin-converting enzyme inhibitor. Clinical: antihypertensive.",
      uses: "Hypertension, heart failure, left ventricular dysfunction after MI, and diabetic nephropathy/proteinuria reduction when ordered.",
      precautions: "Contraindicated with hypersensitivity, ACE-inhibitor angioedema history, pregnancy, or use with aliskiren in diabetes. Use cautiously with renal impairment, renal artery stenosis, hyperkalemia, volume depletion, or potassium-sparing drugs.",
      action: "Blocks conversion of angiotensin I to angiotensin II, lowering vasoconstriction and aldosterone secretion.",
      nursing: "Monitor BP, orthostasis, potassium, BUN/creatinine, urine protein trends if ordered, cough, rash, and facial/tongue swelling requiring urgent action.",
      indications: "Hypertension, heart failure, post-MI LV dysfunction, and diabetic nephropathy.",
      sideEffects: "Dry cough, dizziness, fatigue, altered taste, rash.",
      adverseEffects: "Angioedema, hyperkalemia, acute kidney injury, severe hypotension, neutropenia, and fetal toxicity."
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
      classification: "Pharmacotherapeutic: glucocorticoid. Clinical: anti-inflammatory and immunosuppressant.",
      uses: "Treatment of inflammatory, allergic, respiratory, dermatologic, endocrine, rheumatic, hematologic, neoplastic, and cerebral edema conditions; antiemetic adjunct in selected regimens.",
      precautions: "Use cautiously with systemic infection, diabetes, hypertension, heart failure, peptic ulcer disease, osteoporosis, glaucoma, mood disorders, renal/hepatic impairment, or long-term therapy requiring taper.",
      action: "Suppresses migration of polymorphonuclear leukocytes, reverses capillary permeability, and suppresses immune/inflammatory mediators.",
      nursing: "Monitor glucose, BP, weight/edema, infection signs, GI bleeding, mood changes, wound healing, and taper plan after prolonged therapy.",
      indications: "Inflammatory and allergic disorders, asthma/COPD exacerbation adjunct, cerebral edema, adrenal insufficiency replacement protocols, and antiemetic adjunct therapy.",
      sideEffects: "Hyperglycemia, insomnia, mood changes, increased appetite, dyspepsia, fluid retention.",
      adverseEffects: "Adrenal suppression, serious infection masking, GI bleeding/perforation, psychosis, osteoporosis, and hyperglycemic crisis."
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
      classification: "Pharmacotherapeutic: biguanide. Clinical: antidiabetic.",
      uses: "Improves glycemic control in type 2 diabetes mellitus as adjunct to diet and exercise; may be combined with other antidiabetic therapy when ordered.",
      precautions: "Black box lactic acidosis risk. Contraindicated with severe renal impairment, acute/chronic metabolic acidosis, or diabetic ketoacidosis. Hold/clarify around iodinated contrast, surgery, hypoxic states, dehydration, sepsis, or heavy alcohol use per policy.",
      action: "Decreases hepatic glucose production, decreases intestinal glucose absorption, and improves insulin sensitivity.",
      nursing: "Monitor blood glucose/A1c trends, renal function/eGFR, GI tolerance, hydration status, contrast-procedure instructions, and symptoms of lactic acidosis.",
      indications: "Type 2 diabetes mellitus.",
      sideEffects: "Diarrhea, nausea, abdominal discomfort, flatulence, metallic taste, anorexia.",
      adverseEffects: "Lactic acidosis, vitamin B12 deficiency with long-term use, hypoglycemia when combined with insulin/secretagogues."
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
      classification: "Pharmacotherapeutic: amide local anesthetic. Clinical: local/regional anesthetic and antiarrhythmic for specific IV formulations.",
      uses: "Local or regional anesthesia by infiltration/nerve block; selected ventricular arrhythmia use only with appropriate IV formulation and order.",
      precautions: "Verify concentration, route, epinephrine content, and maximum dose. Use cautiously with heart block, severe hepatic disease, shock, seizure disorder, inflamed/infected injection site, or sensitivity to amide anesthetics.",
      action: "Stabilizes neuronal membranes by blocking sodium ion channels, preventing initiation and conduction of nerve impulses.",
      nursing: "Confirm route and dose limit, aspirate before injection per procedure technique, monitor numbness/anesthesia effect, VS, CNS symptoms, tinnitus, metallic taste, and cardiac rhythm if systemic exposure is possible.",
      indications: "Local infiltration anesthesia, peripheral nerve block/regional anesthesia, and selected ventricular arrhythmias with IV lidocaine orders.",
      sideEffects: "Transient burning, numbness, local swelling, dizziness, drowsiness.",
      adverseEffects: "CNS toxicity, seizures, respiratory depression, hypotension, bradycardia, arrhythmias, cardiac arrest, and methemoglobinemia with susceptible formulations/patients."
    }
  ];

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const priorityGenerics = [
    "acetaminophen","acetylcysteine","acyclovir","adrenaline","albumin","albuterol","allopurinol","aluminum hydroxide",
    "amikacin","aminophylline","amiodarone","amlodipine","amoxicillin","amoxicillin clavulanic acid","ampicillin",
    "aspirin","atenolol","atorvastatin","atropine","azithromycin","benztropine","bisacodyl","budesonide","calcium carbonate",
    "calcium gluconate","captopril","carbamazepine","cefazolin","cefepime","cefixime","cefotaxime","ceftazidime",
    "ceftriaxone","celecoxib","cetirizine","chlorphenamine","ciprofloxacin","clarithromycin","clindamycin","clonidine",
    "clopidogrel","cloxacillin","dexamethasone","dextrose","diazepam","digoxin","diphenhydramine","dobutamine","dopamine",
    "doxycycline","enalapril","enoxaparin","epinephrine","erythromycin","ferrous sulfate","fluconazole","furosemide",
    "gabapentin","gentamicin","glibenclamide","gliclazide","haloperidol","heparin","hydralazine","hydrochlorothiazide",
    "hydrocortisone","ibuprofen","insulin regular","ipratropium","isosorbide dinitrate","ketorolac","lactated ringer's solution",
    "lactulose","levetiracetam","levothyroxine","lidocaine","loperamide","loratadine","lorazepam","losartan","magnesium sulfate",
    "mannitol","mefenamic acid","meropenem","metformin","methyldopa","methylergonovine","metoclopramide","metoprolol",
    "metronidazole","midazolam","morphine","naloxone","nifedipine","nitroglycerin","norepinephrine","normal saline",
    "omeprazole","ondansetron","oral rehydration salts","oxytocin","pantoprazole","paracetamol","penicillin g","phenytoin",
    "piperacillin tazobactam","potassium chloride","prednisone","propofol","ranitidine","risperidone","salbutamol","simvastatin",
    "sodium bicarbonate","spironolactone","thiamine","tramadol","tranexamic acid","vancomycin","warfarin"
  ];

  const sourceLinks = [
    { label: "PhilHealth GAMOT/PNF list, 2025", url: "https://cdn.who.int/media/docs/default-source/essential-medicines/national-essential-medicines-lists-%28neml%29/wpro_neml/philippines-2025.pdf?download=true&sfvrsn=911da8c2_1" },
    { label: "Philippine National Formulary EML, 2022", url: "https://www.philhealth.gov.ph/partners/providers/pdf/PNF-EML_11022022.pdf" },
    { label: "NIH MedlinePlus drug information", url: "https://medlineplus.gov/druginformation.html" },
    { label: "NIH/NLM DailyMed labeling", url: "https://dailymed.nlm.nih.gov/dailymed/" }
  ];

  const scenarioAdditions = [
    {
      id: "thiamine",
      name: "Thiamine",
      generic: "thiamine",
      brand: "Vitamin B1",
      category: "Water-soluble vitamin",
      aliases: "thiamine vitamin b1 hyperemesis wernicke dextrose",
      onHand: 20,
      par: 8,
      doses: ["100 mg IV once before dextrose", "100 mg PO/IV daily"],
      availability: "Tablet and injectable vitamin preparation",
      classification: "Vitamin B1 replacement.",
      uses: "Prevention or treatment of thiamine deficiency, Wernicke encephalopathy risk, and replacement before dextrose in malnourished or prolonged-vomiting patients.",
      precautions: "Use cautiously with prior hypersensitivity; monitor for rare reactions with parenteral administration.",
      action: "Restores thiamine stores needed for carbohydrate metabolism and neurologic function.",
      nursing: "In hyperemesis or malnutrition, give before dextrose-containing fluids; assess nutrition, vomiting, neurologic status, and IV reaction.",
      indications: "Thiamine deficiency prevention/treatment, Wernicke risk, hyperemesis with poor intake, alcoholism, and refeeding risk.",
      sideEffects: "Mild GI upset, injection-site discomfort, flushing.",
      adverseEffects: "Rare hypersensitivity or anaphylaxis with injectable use.",
      pnleNotes: "PNLE cue: thiamine before dextrose protects neurologic function in prolonged vomiting or malnutrition."
    },
    {
      id: "d5-half-normal-saline-potassium",
      name: "D5 0.45% NaCl + 20 mEq KCl",
      generic: "dextrose 5% in 0.45% sodium chloride with potassium chloride",
      brand: "D5 1/2 NS with KCl",
      category: "Maintenance IV fluid with electrolyte",
      aliases: "d5 0.45 nacl half normal saline potassium chloride kcl dextrose",
      onHand: 24,
      par: 10,
      doses: ["150 mL/hr IV continuous", "Rate per provider order"],
      availability: "Premixed IV bag when available; otherwise pharmacy-prepared per policy",
      classification: "Dextrose-containing hypotonic saline with potassium replacement.",
      uses: "Maintenance hydration and potassium replacement when renal function and serum potassium permit.",
      precautions: "Do not administer potassium-containing fluids in severe hyperkalemia, significant renal failure, or absent urine output unless specifically ordered; avoid dextrose before thiamine in high-risk malnutrition.",
      action: "Provides free water after dextrose metabolism, sodium/chloride, and potassium replacement.",
      nursing: "Verify thiamine first when indicated, confirm potassium level and urine output, use an infusion pump, and monitor IV site, glucose, electrolytes, and I&O.",
      indications: "Maintenance fluids with potassium replacement after initial resuscitation or when ordered.",
      sideEffects: "Local IV irritation, mild hyperglycemia, fluid shifts.",
      adverseEffects: "Hyperkalemia, fluid overload, phlebitis, extravasation injury, and electrolyte imbalance.",
      pnleNotes: "PNLE cue: never add or run potassium casually; verify renal function, urine output, pump rate, and latest potassium."
    }
  ];

  scenarioAdditions.forEach(extra => {
    if (!items.some(item => item.id === extra.id || item.generic === extra.generic)) items.push(extra);
  });

  const formularyFallbacks = [
    ["adrenaline","Sympathomimetic catecholamine","Anaphylaxis, cardiac arrest, severe asthma adjunct, and shock protocols.","Stimulates alpha and beta adrenergic receptors, causing vasoconstriction, bronchodilation, and increased cardiac activity.","Hypersensitivity is rare; use caution with tachyarrhythmias, ischemic heart disease, and dosing-route errors.","Tachycardia, tremor, anxiety, hypertension, palpitations.","Verify concentration and route; monitor BP, pulse, ECG, perfusion, and response.","PNLE cue: anaphylaxis first-line IM drug; concentration and route errors are high-risk.","epinephrine"],
    ["aluminum hydroxide","Antacid / phosphate binder","Dyspepsia, hyperacidity, and phosphate binding when ordered.","Neutralizes gastric acid and binds dietary phosphate in the gut.","Use caution with renal impairment, constipation, bowel obstruction risk, and interacting oral medicines.","Constipation, nausea, hypophosphatemia.","Separate from other oral medicines; monitor bowel pattern and phosphate in renal patients.","PNLE cue: antacids can reduce absorption of many drugs; separate administration times.","antacid"],
    ["amikacin","Aminoglycoside antibiotic","Serious susceptible gram-negative infections and sepsis regimens when ordered.","Binds 30S ribosomal subunit, inhibiting bacterial protein synthesis.","Avoid with hypersensitivity; use caution in renal impairment, hearing loss, neuromuscular disease, and nephrotoxic/ototoxic drugs.","Nephrotoxicity, ototoxicity, nausea, injection-site irritation.","Obtain cultures, monitor renal function, peak/trough levels if ordered, hearing, and I&O.","PNLE cue: aminoglycosides require renal and hearing monitoring.","aminoglycoside"],
    ["aminophylline","Methylxanthine bronchodilator","Bronchospasm/asthma or COPD adjunct where protocol still uses it.","Relaxes bronchial smooth muscle through phosphodiesterase inhibition and adenosine antagonism.","Use caution with seizures, arrhythmias, liver disease, fever, and interacting drugs.","Nausea, tremor, insomnia, tachycardia.","Monitor serum levels when ordered, pulse, ECG, respiratory status, and toxicity symptoms.","PNLE cue: narrow therapeutic index; toxicity may present with vomiting, tachycardia, or seizures.","theophylline"],
    ["atenolol","Beta-1 selective blocker","Hypertension, angina, rate control, and post-MI therapy when ordered.","Blocks beta-1 receptors, lowering heart rate, contractility, and renin release.","Avoid severe bradycardia, heart block, cardiogenic shock; caution in asthma/COPD and diabetes.","Bradycardia, fatigue, dizziness, hypotension.","Check apical pulse and BP before giving; do not stop abruptly.","PNLE cue: hold and notify for bradycardia or hypotension per parameters.","beta blocker"],
    ["atorvastatin","HMG-CoA reductase inhibitor statin","Dyslipidemia and cardiovascular risk reduction.","Inhibits hepatic cholesterol synthesis and increases LDL clearance.","Contraindicated in active liver disease and pregnancy; caution with myopathy risk and interacting drugs.","Myalgia, GI upset, elevated liver enzymes.","Monitor lipid response, liver symptoms, and unexplained muscle pain or weakness.","PNLE cue: report muscle pain/dark urine; review pregnancy and liver disease.","statin"],
    ["atropine","Anticholinergic","Symptomatic bradycardia, organophosphate poisoning adjunct, and preprocedural secretion reduction.","Blocks muscarinic acetylcholine receptors, increasing heart rate and reducing secretions.","Use caution with glaucoma, urinary retention, tachyarrhythmias, and GI obstruction.","Dry mouth, blurred vision, tachycardia, urinary retention.","Monitor pulse, rhythm, secretions, temperature, and anticholinergic toxicity.","PNLE cue: used for symptomatic bradycardia; watch tachycardia and urinary retention.","antimuscarinic"],
    ["benztropine","Anticholinergic antiparkinsonian","Acute dystonia or extrapyramidal symptoms from antipsychotics.","Restores dopamine-acetylcholine balance by blocking central cholinergic activity.","Avoid narrow-angle glaucoma; caution with urinary retention, ileus, older adults, and heat exposure.","Dry mouth, constipation, blurred vision, confusion.","Assess EPS response, mental status, bowel/urine status, and heat intolerance.","PNLE cue: rescue medication for acute dystonia after haloperidol.","eps"],
    ["bisacodyl","Stimulant laxative","Constipation and bowel preparation when ordered.","Stimulates enteric nerves to increase colonic peristalsis and fluid secretion.","Avoid bowel obstruction, acute abdomen, and severe dehydration.","Cramping, diarrhea, nausea.","Assess bowel pattern, hydration, abdominal pain, and avoid crushing enteric-coated tablets.","PNLE cue: evaluate constipation cause and hydration before laxatives.","laxative"],
    ["calcium carbonate","Calcium supplement / antacid","Hypocalcemia prevention, calcium supplementation, and antacid use.","Provides elemental calcium and neutralizes gastric acid.","Use caution with hypercalcemia, renal stones, renal impairment, and digoxin therapy.","Constipation, gas, hypercalcemia.","Monitor calcium, bowel pattern, renal history, and separate from interacting medicines.","PNLE cue: constipation and hypercalcemia monitoring are common.","calcium antacid"],
    ["calcium gluconate","Calcium salt","Hypocalcemia, hyperkalemia cardioprotection, magnesium sulfate toxicity rescue.","Increases serum calcium and stabilizes cardiac membranes in hyperkalemia.","Use caution with digoxin therapy, hypercalcemia, and IV extravasation risk.","Bradycardia, hypotension, local irritation.","Use IV pump per policy; monitor ECG, calcium, IV site, and antidote availability in MgSO4 therapy.","PNLE cue: antidote for magnesium sulfate toxicity; keep available in OB settings.","calcium"],
    ["cefazolin","First-generation cephalosporin antibiotic","Surgical prophylaxis and susceptible skin, soft tissue, bone, urinary, or respiratory infections.","Inhibits bacterial cell-wall synthesis.","Avoid cephalosporin hypersensitivity; caution with severe penicillin allergy and renal impairment.","Diarrhea, rash, injection-site pain.","Check allergies, cultures if ordered, renal dosing, and signs of anaphylaxis or C. difficile diarrhea.","PNLE cue: verify allergy history before beta-lactam antibiotics.","cephalosporin"],
    ["cefepime","Fourth-generation cephalosporin antibiotic","Severe susceptible gram-negative infections, febrile neutropenia, pneumonia, UTI, and sepsis regimens.","Inhibits bacterial cell-wall synthesis with broad gram-negative activity.","Avoid cephalosporin hypersensitivity; caution with renal impairment and seizure risk.","Diarrhea, rash, neurotoxicity risk in renal impairment.","Monitor renal function, mental status, cultures, WBC, temperature, and diarrhea.","PNLE cue: confusion or seizures in renal impairment can signal cefepime neurotoxicity.","cephalosporin"],
    ["cefixime","Third-generation oral cephalosporin","Susceptible respiratory, urinary, and selected gonococcal infections when ordered.","Inhibits bacterial cell-wall synthesis.","Avoid cephalosporin hypersensitivity; caution with severe penicillin allergy and renal impairment.","Diarrhea, nausea, rash.","Assess allergy, culture response, renal function, and severe diarrhea.","PNLE cue: finish antibiotic course and monitor allergic reaction.","cephalosporin"],
    ["cefotaxime","Third-generation cephalosporin antibiotic","Serious susceptible infections including sepsis, pneumonia, meningitis, and intra-abdominal infections.","Inhibits bacterial cell-wall synthesis.","Avoid cephalosporin hypersensitivity; caution with renal impairment and severe beta-lactam allergy.","Diarrhea, rash, injection-site reaction.","Obtain cultures when ordered; monitor infection response, renal function, and anaphylaxis.","PNLE cue: cultures before antibiotics when this does not delay urgent care.","cephalosporin"],
    ["chlorphenamine","First-generation antihistamine","Allergic rhinitis, urticaria, and allergic symptoms.","Blocks H1 histamine receptors.","Use caution with glaucoma, urinary retention, BPH, older adults, and sedatives.","Drowsiness, dry mouth, dizziness, urinary retention.","Assess sedation, fall risk, anticholinergic effects, and response of allergy symptoms.","PNLE cue: first-generation antihistamines increase fall risk and anticholinergic effects.","chlorpheniramine"],
    ["clonidine","Central alpha-2 agonist antihypertensive","Hypertension and selected withdrawal/pain adjunct protocols.","Reduces sympathetic outflow from the CNS, lowering BP and heart rate.","Use caution with bradycardia, hypotension, depression, and abrupt discontinuation.","Drowsiness, dry mouth, hypotension, bradycardia.","Check BP/pulse, fall risk, sedation, and teach not to stop abruptly.","PNLE cue: rebound hypertension can occur if stopped suddenly.","antihypertensive"],
    ["cloxacillin","Penicillinase-resistant penicillin antibiotic","Susceptible staphylococcal skin, soft tissue, bone, and respiratory infections.","Inhibits bacterial cell-wall synthesis.","Avoid penicillin hypersensitivity; caution with cephalosporin allergy and hepatic/renal impairment.","Nausea, diarrhea, rash.","Verify allergy, monitor infection response and severe diarrhea; give around meals per local policy.","PNLE cue: penicillin allergy screening is a priority before administration.","penicillin"],
    ["diazepam","Benzodiazepine","Seizures, severe anxiety, muscle spasm, alcohol withdrawal, and sedation protocols.","Enhances GABA activity in the CNS.","Avoid severe respiratory depression; caution with older adults, opioids, sleep apnea, liver disease, and fall risk.","Drowsiness, dizziness, respiratory depression, hypotension.","Monitor RR, sedation, BP, fall risk, and have flumazenil/resuscitation support per policy.","PNLE cue: airway and respiratory status before and after benzodiazepines.","benzodiazepine"],
    ["digoxin","Cardiac glycoside","Heart failure symptom control and atrial fibrillation rate control.","Inhibits sodium-potassium ATPase, increasing contractility and vagal tone.","Avoid ventricular fibrillation; caution with bradycardia, AV block, renal impairment, and hypokalemia.","Nausea, visual changes, bradycardia, arrhythmias.","Check apical pulse, potassium, renal function, digoxin level if ordered, and toxicity symptoms.","PNLE cue: hypokalemia increases digoxin toxicity risk.","cardiac glycoside"],
    ["diphenhydramine","First-generation antihistamine","Allergic reactions, pruritus, motion sickness, insomnia, and EPS adjunct use.","Blocks H1 receptors and has anticholinergic/sedating effects.","Use caution with glaucoma, urinary retention, older adults, sedatives, and respiratory disease.","Sedation, dry mouth, dizziness, urinary retention.","Assess airway in allergic reaction, sedation, fall risk, and anticholinergic effects.","PNLE cue: sedation and fall risk are major nursing concerns.","antihistamine"],
    ["dobutamine","Beta-1 adrenergic agonist inotrope","Short-term support for low cardiac output states and decompensated heart failure.","Stimulates beta-1 receptors, increasing contractility and cardiac output.","Use caution with tachyarrhythmias, hypertrophic cardiomyopathy, and hypovolemia.","Tachycardia, hypertension, arrhythmias, chest pain.","Continuous monitoring: ECG, BP, urine output, IV site, perfusion, and pump accuracy.","PNLE cue: vasoactive drips require pump, close monitoring, and titration by protocol.","inotrope"],
    ["dopamine","Adrenergic vasopressor/inotrope","Shock with hypotension or low perfusion when ordered.","Dose-dependent dopaminergic, beta, and alpha stimulation improves perfusion, contractility, and vascular tone.","Use caution with tachyarrhythmias, pheochromocytoma, and uncorrected hypovolemia.","Arrhythmias, hypertension, extravasation injury.","Use central line when possible, pump, ECG/BP monitoring, urine output, and extravasation protocol.","PNLE cue: monitor IV site closely; vasopressor extravasation is urgent.","vasopressor"],
    ["ferrous sulfate","Iron supplement","Iron-deficiency anemia treatment or prevention.","Replaces iron needed for hemoglobin synthesis.","Avoid iron overload; caution with GI disease and children due to overdose toxicity.","Constipation, dark stools, nausea, abdominal discomfort.","Give with vitamin C if ordered, separate from antacids/calcium, monitor Hgb/ferritin and constipation.","PNLE cue: dark stools are expected; keep away from children due to poisoning risk.","iron"],
    ["gentamicin","Aminoglycoside antibiotic","Serious susceptible gram-negative infections and synergy regimens.","Binds 30S ribosomal subunit, inhibiting protein synthesis.","Avoid aminoglycoside hypersensitivity; caution with renal impairment, hearing loss, myasthenia gravis, and nephrotoxic/ototoxic drugs.","Nephrotoxicity, ototoxicity, vestibular symptoms.","Monitor renal function, drug levels if ordered, I&O, hearing, balance, and cultures.","PNLE cue: nephrotoxicity and ototoxicity monitoring define aminoglycoside safety.","aminoglycoside"],
    ["glibenclamide","Sulfonylurea antidiabetic","Type 2 diabetes mellitus when diet/exercise alone is insufficient.","Stimulates pancreatic insulin release.","Avoid type 1 diabetes/DKA; caution in renal/hepatic impairment, older adults, and irregular meals.","Hypoglycemia, weight gain, nausea.","Check blood glucose, meal intake, hypoglycemia symptoms, and patient teaching.","PNLE cue: do not give without assessing food intake and hypoglycemia risk.","glyburide sulfonylurea"],
    ["gliclazide","Sulfonylurea antidiabetic","Type 2 diabetes mellitus.","Stimulates insulin secretion from pancreatic beta cells.","Avoid type 1 diabetes/DKA; caution with renal/hepatic impairment and missed meals.","Hypoglycemia, weight gain, GI upset.","Monitor glucose, meal timing, hypoglycemia, and adherence.","PNLE cue: hypoglycemia safety and meal coordination are priority.","sulfonylurea"],
    ["hydralazine","Direct vasodilator antihypertensive","Hypertension, hypertensive urgency protocols, and pregnancy-related severe hypertension when ordered.","Relaxes arteriolar smooth muscle, reducing systemic vascular resistance.","Use caution with coronary disease, tachycardia, lupus-like syndrome risk, and hypotension.","Headache, tachycardia, flushing, hypotension.","Monitor BP frequently, pulse, headache, dizziness, and target-organ symptoms.","PNLE cue: avoid overly rapid BP drops; reassess after antihypertensive doses.","vasodilator"],
    ["hydrochlorothiazide","Thiazide diuretic","Hypertension and mild edema.","Inhibits sodium reabsorption in the distal tubule, increasing sodium and water excretion.","Avoid anuria; caution with sulfonamide allergy, gout, diabetes, renal impairment, and electrolyte imbalance.","Hypokalemia, dizziness, photosensitivity, hyperuricemia.","Monitor BP, potassium, sodium, glucose, uric acid, I&O, and orthostasis.","PNLE cue: watch potassium and orthostatic fall risk.","thiazide"],
    ["insulin regular","Short-acting insulin","Hyperglycemia, sliding-scale/correction insulin, DKA infusion, and hyperkalemia protocols.","Promotes cellular glucose uptake and shifts potassium into cells.","Avoid hypoglycemia; caution with renal impairment, poor intake, and potassium depletion.","Hypoglycemia, hypokalemia, injection-site reaction.","Independent double-check, verify glucose, meal/protocol timing, potassium for IV use, and hypoglycemia treatment.","PNLE cue: high-alert medication; double-check dose and monitor glucose/potassium.","regular insulin"],
    ["isosorbide dinitrate","Nitrate antianginal","Angina prophylaxis/treatment and heart failure adjunct when ordered.","Releases nitric oxide causing venous and arterial dilation, reducing preload and myocardial oxygen demand.","Contraindicated with PDE-5 inhibitors and severe hypotension; caution with increased ICP and volume depletion.","Headache, dizziness, hypotension, flushing.","Check BP, chest pain response, recent sildenafil/tadalafil use, and fall risk.","PNLE cue: screen PDE-5 inhibitor use before nitrates.","nitrate"],
    ["lactulose","Osmotic laxative / ammonia reducer","Constipation and hepatic encephalopathy management.","Draws water into colon and acidifies gut contents to trap ammonia.","Use caution with diabetes, dehydration, electrolyte imbalance, and bowel obstruction symptoms.","Diarrhea, cramping, gas, electrolyte imbalance.","Titrate to ordered stool goal, monitor mental status, hydration, potassium, and stool frequency.","PNLE cue: in hepatic encephalopathy, goal is soft stools without dehydration.","ammonia"],
    ["levetiracetam","Anticonvulsant","Focal and generalized seizure management.","Modulates synaptic neurotransmitter release through SV2A binding.","Use caution with renal impairment, depression, and suicidal ideation.","Drowsiness, dizziness, behavioral changes.","Monitor seizure activity, renal dosing, mood/behavior, and fall precautions.","PNLE cue: institute seizure precautions and do not stop abruptly.","antiepileptic"],
    ["loperamide","Antidiarrheal","Short-term control of noninfectious diarrhea when appropriate.","Slows intestinal motility through peripheral opioid receptor activity.","Avoid dysentery, high fever, suspected C. difficile, and acute ulcerative colitis flare.","Constipation, abdominal cramps, dizziness.","Assess hydration, stool features, fever, abdominal distention, and cause of diarrhea.","PNLE cue: do not mask infectious diarrhea with fever or blood in stool.","antidiarrheal"],
    ["mefenamic acid","NSAID analgesic","Mild to moderate pain and dysmenorrhea.","Inhibits prostaglandin synthesis through COX inhibition.","Avoid NSAID allergy, active GI bleeding, severe renal disease, and late pregnancy; caution with anticoagulants and asthma.","Dyspepsia, nausea, dizziness, edema.","Assess pain, GI bleeding, renal function, BP, and concurrent anticoagulants/NSAIDs.","PNLE cue: NSAIDs increase GI bleeding and renal risk.","nsaid"],
    ["meropenem","Carbapenem antibiotic","Severe broad-spectrum infections including sepsis, intra-abdominal infection, pneumonia, and meningitis when ordered.","Inhibits bacterial cell-wall synthesis and resists many beta-lactamases.","Avoid carbapenem hypersensitivity; caution with seizures, renal impairment, and beta-lactam allergy.","Diarrhea, rash, nausea, seizures rarely.","Obtain cultures, monitor renal function, neurologic status, infection response, and severe diarrhea.","PNLE cue: broad-spectrum antibiotics still require culture timing and de-escalation awareness.","carbapenem"],
    ["methyldopa","Central alpha-2 agonist antihypertensive","Hypertension, including pregnancy-related chronic hypertension where selected.","Reduces sympathetic outflow from the CNS.","Avoid active liver disease; caution with depression and hemolytic anemia history.","Sedation, dry mouth, dizziness, elevated liver enzymes.","Monitor BP, sedation, liver function symptoms, CBC if ordered, and orthostasis.","PNLE cue: often associated with pregnancy hypertension history; monitor sedation and liver effects.","antihypertensive"],
    ["metoclopramide","Prokinetic antiemetic","Nausea/vomiting, gastroparesis, and gastric emptying support.","Blocks dopamine receptors and enhances upper GI motility.","Avoid GI obstruction/perforation, pheochromocytoma, seizures; caution with Parkinson disease and EPS risk.","Drowsiness, diarrhea, restlessness, EPS.","Assess nausea, bowel sounds, EPS, sedation, and duration of therapy.","PNLE cue: monitor for acute dystonia and tardive dyskinesia with repeated use.","antiemetic prokinetic"],
    ["metronidazole","Nitroimidazole antimicrobial","Anaerobic bacterial and protozoal infections.","Disrupts microbial DNA after intracellular reduction.","Avoid hypersensitivity; caution with liver disease and alcohol use.","Metallic taste, nausea, dark urine, neuropathy.","Teach no alcohol during therapy and after per policy; monitor GI tolerance, neuropathy, and infection response.","PNLE cue: alcohol interaction can cause severe reaction; emphasize teaching.","antibiotic anaerobe"],
    ["normal saline","Isotonic crystalloid IV fluid","Fluid resuscitation, dehydration, sodium/chloride replacement, and IV medication carrier.","Expands extracellular and intravascular volume with sodium and chloride.","Use caution with heart failure, renal impairment, edema, hypertension, and hyperchloremia.","Edema, IV site irritation, hyperchloremia.","Monitor lung sounds, edema, BP, IV site, I&O, weight, and electrolytes.","PNLE cue: reassess lungs and perfusion during large-volume boluses.","0.9 sodium chloride ns"],
    ["oral rehydration salts","Oral electrolyte solution","Prevention and treatment of mild to moderate dehydration from diarrhea/vomiting.","Provides glucose-facilitated sodium and water absorption plus electrolyte replacement.","Use caution with shock, severe dehydration requiring IV fluids, ileus, or inability to drink safely.","Vomiting, abdominal fullness, electrolyte imbalance if misprepared.","Confirm correct mixing, small frequent sips, hydration signs, stool/vomit losses, and escalation cues.","PNLE cue: correct preparation matters; severe dehydration needs urgent IV/medical care.","ors"],
    ["paracetamol","Analgesic / antipyretic","Fever and mild to moderate pain.","Produces analgesia and antipyresis through central prostaglandin and heat-regulation effects.","Avoid severe active liver disease; caution with alcohol use, malnutrition, and duplicate products.","Nausea, rash, elevated liver enzymes.","Total all paracetamol/acetaminophen sources and monitor daily maximum and liver risk.","PNLE cue: overdose causes severe liver injury; check combination products.","acetaminophen"],
    ["prednisone","Systemic corticosteroid","Inflammatory, allergic, autoimmune, respiratory, and endocrine replacement indications.","Modifies gene transcription to suppress inflammation and immune response.","Use caution with active infection, diabetes, GI ulcer risk, osteoporosis, and abrupt withdrawal.","Hyperglycemia, mood changes, insomnia, fluid retention, infection risk.","Monitor glucose, infection signs, BP, GI symptoms, and taper instructions.","PNLE cue: do not stop long-term steroids abruptly; watch infection and glucose.","steroid"],
    ["ranitidine","H2 receptor antagonist","Acid suppression where locally available/ordered; many markets restrict or removed it.","Blocks histamine H2 receptors on gastric parietal cells, reducing acid secretion.","Use only if available and approved by current local policy; caution with renal impairment.","Headache, GI upset, confusion in older adults.","Verify current facility availability/policy; monitor symptom response and renal dosing.","PNLE cue: know that medication availability may vary; follow current institutional formulary.","h2 blocker"],
    ["risperidone","Atypical antipsychotic","Schizophrenia, bipolar mania, and severe behavioral symptoms when ordered.","Blocks dopamine D2 and serotonin 5-HT2 receptors.","Use caution with dementia-related psychosis, QT risk, metabolic syndrome, EPS, and seizures.","Sedation, weight gain, orthostasis, EPS, hyperprolactinemia.","Assess mental status, suicide/safety risk, EPS, metabolic parameters, orthostasis, and adherence.","PNLE cue: monitor EPS and metabolic effects; therapeutic communication remains priority.","antipsychotic"],
    ["salbutamol","Short-acting beta2 agonist bronchodilator","Acute bronchospasm and asthma/COPD rescue therapy.","Stimulates beta2 receptors causing bronchodilation.","Use caution with tachyarrhythmias, hypertension, hyperthyroidism, diabetes, and hypokalemia.","Tremor, tachycardia, nervousness, headache.","Assess breath sounds, work of breathing, SpO2, pulse, and response after treatment.","PNLE cue: reassess respiratory status after nebulization; tachycardia is expected but monitored.","albuterol"],
    ["tramadol","Opioid analgesic with SNRI activity","Moderate pain when ordered.","Binds mu-opioid receptors and inhibits norepinephrine/serotonin reuptake.","Avoid significant respiratory depression, acute intoxication, MAOI use; caution with seizures and serotonin syndrome risk.","Dizziness, nausea, constipation, sedation.","Assess pain, RR, sedation, fall risk, bowel regimen, and interacting serotonergic drugs.","PNLE cue: opioid-like safety applies: respiratory assessment before administration.","opioid analgesic"],
    ["tranexamic acid","Antifibrinolytic","Postpartum hemorrhage adjunct, trauma bleeding protocols, and other excessive bleeding indications.","Inhibits plasminogen activation and fibrinolysis, stabilizing clots.","Use caution with active thromboembolic disease, DIC without heparin, renal impairment, and seizure risk with high doses.","Nausea, diarrhea, hypotension if infused rapidly, thrombosis risk.","Give within ordered time window, monitor bleeding, BP during IV use, renal dosing, and thrombotic symptoms.","PNLE cue: in PPH, TXA is adjunct; fundal massage/uterotonics and escalation remain priorities.","txa"]
  ];

  formularyFallbacks.forEach(([generic, category, uses, action, precautions, sideEffects, nursing, pnleNotes, aliases]) => {
    if (items.some(item => normalizedName(item.generic || item.name) === normalizedName(generic))) return;
    items.push({
      id: normalizedName(generic).replace(/\s+/g, "-"),
      name: generic,
      generic,
      brand: "",
      category,
      aliases: `${generic} ${aliases || ""}`,
      onHand: 0,
      par: 0,
      doses: ["Dose per provider order and current facility policy"],
      availability: "Philippine formulary reference entry",
      classification: category,
      uses,
      precautions,
      action,
      nursing,
      indications: uses,
      sideEffects,
      adverseEffects: sideEffects,
      pnleNotes
    });
  });

  function normalizedName(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function priorityRank(item) {
    const key = normalizedName(item.generic || item.name);
    const idx = priorityGenerics.findIndex(name => nameMatches(key, normalizedName(name)));
    return idx === -1 ? 9999 : idx;
  }

  function nameMatches(key, wanted) {
    if (!key || !wanted) return false;
    if (key === wanted) return true;
    const keyTokens = new Set(key.split(" ").filter(Boolean));
    const wantedTokens = wanted.split(" ").filter(Boolean);
    return wantedTokens.length > 1 && wantedTokens.every(token => keyTokens.has(token));
  }

  function uniqueItems(list) {
    const seen = new Set();
    return (list || []).filter(item => {
      const key = normalizedName(item.generic || item.name || item.id);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function compactText(value, fallback) {
    const clean = String(value || "").replace(/\s+/g, " ").trim();
    if (!clean) return fallback;
    return clean.length > 420 ? `${clean.slice(0, 417)}...` : clean;
  }

  function classPnleNote(item) {
    const text = `${item.generic || ""} ${item.category || ""} ${item.classification || ""} ${item.aliases || ""}`.toLowerCase();
    if (/insulin|glibenclamide|gliclazide|metformin/.test(text)) return "Check blood glucose, meal timing, hypoglycemia cues, and renal considerations when applicable.";
    if (/heparin|warfarin|enoxaparin|clopidogrel|aspirin/.test(text)) return "Bleeding precautions, lab monitoring, fall prevention, and antidote awareness are common exam cues.";
    if (/cef|cillin|mycin|cycline|floxacin|meropenem|metronidazole|vancomycin/.test(text)) return "Obtain cultures before first dose when ordered, screen allergies, and monitor for anaphylaxis or severe diarrhea.";
    if (/furosemide|hydrochlorothiazide|spironolactone|mannitol/.test(text)) return "Track I&O, daily weight, BP, electrolytes, renal function, and dehydration signs.";
    if (/morphine|tramadol|diazepam|lorazepam|midazolam|propofol/.test(text)) return "Prioritize respiratory rate, sedation level, fall risk, and reversal/rescue readiness.";
    if (/oxytocin|methylergonovine|magnesium sulfate|tranexamic/.test(text)) return "Maternal safety cue: assess bleeding/uterine tone or DTR/respirations as appropriate before and after administration.";
    if (/albuterol|salbutamol|ipratropium|budesonide|aminophylline/.test(text)) return "Respiratory cue: compare breath sounds, work of breathing, SpO2, pulse, and response after therapy.";
    if (/amlodipine|atenolol|captopril|enalapril|losartan|nifedipine|nitroglycerin|hydralazine|clonidine/.test(text)) return "Check BP, pulse, orthostatic risk, hold parameters, and target-organ symptoms before giving.";
    return item.pnleNotes || "Link the medication to the indication, screen allergies/contraindications, and document response or reason held.";
  }

  function toReference(item) {
    return {
      id: item.id,
      genericName: item.generic || item.name,
      displayName: item.name || item.generic,
      drugClass: item.classification || item.category || "Drug reference",
      indications: compactText(item.indications || item.uses, "Use per provider order and approved indication."),
      mechanism: compactText(item.action, "See official labeling for the complete mechanism of action."),
      nursingConsiderations: compactText(item.nursing, "Verify patient, allergy, medication, dose, route, timing, indication, and monitoring parameters."),
      contraindications: compactText(item.contraindications || item.precautions, "Screen hypersensitivity, pregnancy/lactation concerns, organ impairment, and drug interactions using current policy."),
      sideEffects: compactText(item.sideEffects || item.adverseEffects, "Monitor expected and serious adverse reactions listed in official labeling."),
      pnleNotes: classPnleNote(item),
      commonDoses: item.doses || [],
      availability: item.availability || "",
      sourceBasis: sourceLinks.map(s => s.label)
    };
  }

  function referenceItems() {
    return uniqueItems(items)
      .filter(item => priorityRank(item) < 9999 || item.onHand || /thiamine|dextrose|ringer|saline|oxytocin|ondansetron|ceftriaxone|azithromycin|albuterol|ipratropium|dexamethasone|insulin|haloperidol|lorazepam|benztropine|amlodipine|captopril|methylergonovine/i.test(`${item.generic} ${item.name} ${item.aliases}`))
      .sort((a, b) => priorityRank(a) - priorityRank(b) || String(a.generic || a.name).localeCompare(String(b.generic || b.name)));
  }

  function rebuildReferenceJson() {
    window.HctDrugReferenceJSON = {
      name: "HCT Philippine formulary drug reference",
      minimumCount: 100,
      totalCount: referenceItems().length,
      fields: ["genericName", "drugClass", "indications", "mechanism", "nursingConsiderations", "contraindications", "sideEffects", "pnleNotes"],
      sources: sourceLinks,
      drugs: referenceItems().map(toReference)
    };
    return window.HctDrugReferenceJSON;
  }

  function find(value) {
    const key = String(value || "").toLowerCase();
    if (!key) return null;
    return items.find(item => item.id === value || key.includes(String(item.generic || "").toLowerCase()) || key.includes(String(item.name || "").toLowerCase().split(/\s+\d/)[0]) || String(item.aliases || "").split(/\s+/).some(a => a.length > 3 && key.includes(a)));
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
    const ref = toReference(item);
    const pairs = [
      ["Drug class", ref.drugClass],
      ["Indications", ref.indications],
      ["Mechanism", ref.mechanism],
      ["Nursing considerations", ref.nursingConsiderations],
      ["Contraindications / screen first", ref.contraindications],
      ["Side effects", ref.sideEffects],
      ["PNLE-relevant notes", ref.pnleNotes]
    ];
    return `<aside class="drug-reference-panel" role="dialog" aria-label="${esc(ref.genericName)} drug reference">
      <div class="drug-reference-head">
        <div><small>${esc(item.category || "Drug reference")}</small><h3>${esc(ref.genericName)}</h3><p>${esc(ref.displayName)}${item.brand ? ` | Brand examples: ${esc(item.brand)}` : ""}</p><p>Philippine formulary aligned nursing reference</p></div>
        <button class="drug-reference-close" data-drug-close aria-label="Close">x</button>
      </div>
      <div class="drug-dose-row">${item.doses.map(d => `<span>${esc(d)}</span>`).join("")}</div>
      <dl>${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <div class="drug-reference-sources">${sourceLinks.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div>
    </aside>`;
  }

  function showCard(target, id) {
    const item = find(id);
    if (!item) return;
    document.querySelectorAll(".drug-reference-panel").forEach(el => el.remove());
    const wrap = document.createElement("div");
    wrap.innerHTML = cardHtml(item);
    const panel = wrap.firstElementChild;
    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add("open"));
    panel.querySelector("[data-drug-close]")?.addEventListener("click", () => panel.remove());
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
    if (!e.target.closest(".drug-reference-panel") && !e.target.closest("[data-med-info]")) {
      document.querySelectorAll(".drug-reference-panel").forEach(el => el.remove());
    }
  });

  rebuildReferenceJson();
  window.HctMedicationInventory = { items, find, toLegacy, doseOptions, cardHtml, bindDrugCards, bindDosePicker, sourceLinks, priorityGenerics, referenceItems, toReference, rebuildReferenceJson };
})();
