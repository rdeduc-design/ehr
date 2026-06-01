(function(){
  "use strict";

  const ALLERGY_ACTIONS = ["Allergen Added", "Reviewed"];
  const IMMUNIZATION_STATUS = ["Given", "Refused", "1st Dose", "2nd Dose", "3rd Dose", "4th Dose", "Catch-up", "Vaccination Status Reviewed"];
  const VACCINES = [
    "Influenza IIV4", "Yellow Fever", "Vaccines Up to Date", "Hepatitis B / HepB",
    "Dengue / DEN4CYD: 9-16 yrs", "Pneumococcal polysaccharide / PPSV23",
    "Inactivated poliovirus / IPV: <18 yrs", "Meningococcal B / MenB-4C", "COVID-19",
    "Measles, mumps, rubella / MMR", "Hepatitis A / HepA", "Varicella / VAR",
    "Zoster Recombinant / Shingrix (Shingles)",
    "Tetanus, diphtheria, & acellular pertussis / Tdap: \u22657 yrs",
    "Quadrivalent Influenza Vaccine / Fluzone", "Pneumococcal conjugate / PCV13",
    "Diphtheria, tetanus, & acellular pertussis / DTaP: <7 yrs",
    "Human papillomavirus / HPV", "Rotavirus / RV5 (3-dose series)",
    "Meningococcal / MenACWY-D \u22659 mos", "Haemophilus influenzae type b / Hib",
    "Influenza / LAIV4", "Other / See Comments", "Rotavirus / RV1 (2-dose series)"
  ];

  const SECONDARY_DIAGNOSES = ["Pressure Ulcers", "Stroke", "Hypoxia", "Anaphylaxis", "Alcohol Use", "Intoxication", "Substance Abuse", "Other"];
  const PRECAUTIONS = ["Standard", "Contact", "Contact +", "Droplet", "Airborne", "Neutropenic", "Protective Isolation", "Radiation Precautions", "Reverse Isolation", "Enhanced Barrier Precautions", "Other"];
  const RISKS_ALERTS = ["Delirium", "Deep Vein Thrombosis (DVT)", "Pneumonia", "Malnutrition", "Medication Errors", "Infection", "Pressure Ulcers", "Stroke", "Fall", "Skin Breakdown", "Behavioral", "Sepsis", "MRSA", "Elopement Risk", "High Risk Medications", "Allergy"];
  const LIVING_SITUATIONS = ["Lives Alone", "Lives in Assisted Living", "Lives in LTC", "Lives with Family", "Homeless", "Other"];
  const YES_NO = ["Yes", "No"];
  const ABUSE_NEGLECT = ["Yes: See Comments", "No"];

  const ROS = [
    ["skinMucous", "Skin / Mucous Membranes", ["WDL"]],
    ["head", "Head", ["Headaches", "Head injury", "No Relevant Findings"]],
    ["eyes", "Eyes", ["Glasses or contacts", "Change in vision", "Eye pain", "Double vision", "Flashing lights", "Glaucoma / Cataracts", "Last eye exam", "No Relevant Findings"]],
    ["ears", "Ears", ["Change in hearing", "Ear pain", "Ear discharge", "Ringing", "Dizziness", "No Relevant Findings"]],
    ["noseSinuses", "Nose / Sinuses", ["Nose bleeds", "Nasal stuffiness", "Frequent colds", "No Relevant Findings"]],
    ["allergies", "Allergies", ["Hives", "Swelling of lips or tongue", "Hay fever", "Asthma", "Eczema / Sensitive", "Sensitivity to drugs, food, pollens, or dander", "No Relevant Findings"]],
    ["mouthThroat", "Mouth / Throat", ["Bleeding gums", "Sore tongue", "Sore throat", "Hoarseness", "No Relevant Findings"]],
    ["neck", "Neck", ["Lumps", "Swollen glands", "Goiter", "Stiffness", "No Relevant Findings"]],
    ["breast", "Breast", ["Lumps", "Pain", "Nipple discharge", "Breast self-examination", "No Relevant Findings"]],
    ["respCardiac", "Respiratory / Cardiac", ["Shortness of breath", "Cough", "Production of phlegm, color", "Wheezing", "Coughing up blood", "Chest pain", "Fever", "Night sweats", "Swelling in hands / feet", "Blue fingers / toes", "High blood pressure", "Skipping heart beats", "Heart murmur", "History of heart medication", "Bronchitis / emphysema", "Rheumatic heart disease", "No Relevant Findings"]],
    ["gi", "Gastrointestinal", ["Change of appetite or weight", "Problems swallowing", "Nausea", "Heartburn", "Vomiting", "Vomiting blood", "Constipation", "Diarrhea", "Change in bowel habits", "Abdominal Pain", "Excessive belching", "Excessive flatulence", "Yellow color of skin", "Food intolerance", "Rectal bleeding / hemorrhoids", "No Relevant Findings"]],
    ["urinary", "Urinary", ["Difficulty in urination", "Pain or burning during urination", "Frequent urination at night", "Urgent need to urinate", "Incontinence of urine", "Dribbling", "Decreased urine stream", "Blood in urine", "UTI / stones / prostate infection", "No Relevant Findings"]],
    ["peripheralVascular", "Peripheral Vascular", ["Leg cramps", "Varicose veins", "Clots in veins", "No Relevant Findings"]],
    ["musculoskeletal", "Musculoskeletal", ["Pain", "Swelling", "Stiffness", "Decreased joint motion", "Broken bone", "Serious sprains", "Arthritis", "Gout", "No Relevant Findings"]],
    ["neurologic", "Neurologic", ["Headaches", "Seizures", "Loss of consciousness / fainting", "Paralysis", "Weakness", "Loss of muscle size", "Muscle spasm", "Tremor", "Involuntary movement", "Incoordination", "Numbness", "Feeling of \u201cpins & needles / tingles\u201d", "No Relevant Findings"]],
    ["hematologic", "Hematologic", ["Anemia", "Easy bruising / bleeding", "Past transfusions", "No Relevant Findings"]],
    ["endocrine", "Endocrine", ["Abnormal growth", "Increased appetite", "Increased thirst", "Increased urine production", "Thyroid trouble", "Heat / Cold intolerance", "Excessive sweating", "Diabetes", "No Relevant Findings"]],
    ["psychiatric", "Psychiatric", ["Tension / Anxiety", "Depression / suicide ideation", "Memory problems", "Unusual problems", "Sleep problems", "Past treatment with Psychiatrist", "Change in mood / change in attitude towards family / friends", "No Relevant Findings"]]
  ];

  const GENERAL_SURVEY = [
    ["levelOfConsciousness", "Level of Consciousness", ["Alert", "Lethargic", "Obtunded", "Stuporous", "Unresponsive", "Other"]],
    ["orientation", "Orientation", ["Oriented x4 (person, place, time, situation)", "Person", "Place", "Time", "Situation", "Disoriented", "Unable to assess", "Not tested", "Other"]],
    ["apparentDistress", "Apparent Distress", ["No acute distress", "Mild distress", "Moderate distress", "Severe distress", "Respiratory distress", "Emotional distress", "Pain-related distress", "Other"]],
    ["nutritionalStatus", "Nutritional Status", ["Well-nourished", "Underweight", "Overweight", "Cachectic", "Obese", "Malnourished", "Other"]],
    ["hygieneGrooming", "Hygiene & Grooming", ["Well-groomed", "Disheveled", "Poor hygiene", "Body odor noted", "Poor dentition", "Other"]],
    ["mobilityGait", "Mobility / Gait", ["Ambulated independently", "Uses assistive device (e.g., cane, walker)", "Unsteady gait", "Ataxic gait", "Unable to walk", "Wheelchair-bound", "Other"]]
  ];

  const PHYSICAL_EXAM_CATEGORIES = ["Physical Exam", "General Survey", "HEENT & Neck", "Skin", "Cardiopulmonary", "Gastrointestinal & Genitourinary", "Musculoskeletal & Extremities", "Neurological", "Psychiatric / Mental Status", "Lymphatic"];
  const PE_DETAILS = {
    Nose: {
      checkboxGroups: [
        ["externalNose", "External Nose", ["Normal appearance", "Asymmetry", "Deformity", "Redness", "Swelling", "Lesions", "Trauma/ecchymosis", "Other"]],
        ["nasalSeptum", "Nasal Septum", ["Midline", "Deviated", "Perforated", "Bleeding present", "Septal hematoma", "Not visualized", "Other"]],
        ["turbinates", "Turbinates", ["Normal size and color", "Pale", "Erythematous", "Enlarged", "Obstructing airflow", "Not visualized", "Other"]],
        ["discharge", "Discharge", ["None", "Clear", "Mucoid", "Purulent", "Bloody", "Foul-smelling", "Not assessed", "Other"]],
        ["sinusTenderness", "Sinus Tenderness", ["No sinus tenderness", "Frontal sinus tenderness", "Maxillary sinus tenderness", "Ethmoid sinus tenderness", "Percussion pain present", "Other"]]
      ],
      dropdowns: [["nasalMucosa", "Nasal Mucosa", ["Pink and moist", "Pale and boggy", "Erythematous", "Dry", "Bleeding noted", "Ulcerated", "Not assessed", "Other"]]]
    },
    Neck: {
      checkboxGroups: [
        ["inspection", "Inspection", ["Neck supple", "Full range of motion", "Trachea midline", "Visible swelling", "Visible mass or fullness", "Surgical scar present", "No visible abnormalities", "Other"]],
        ["palpation", "Palpation", ["No tenderness to palpation", "Trachea midline to palpation", "Tracheal deviation", "Mass palpated", "Thyromegaly appreciated", "Crepitus present", "Other"]],
        ["thyroidExamination", "Thyroid Examination", ["Thyroid not enlarged", "Symmetric lobes", "Diffuse enlargement", "Palpable nodule(s)", "Tender to palpation", "Not palpable", "Other"]],
        ["cervicalLymphadenopathy", "Cervical Lymphadenopathy", ["No lymphadenopathy", "Anterior cervical nodes palpable", "Posterior cervical nodes palpable", "Submandibular or submental nodes palpable", "Supraclavicular nodes palpable", "Tender nodes", "Firm or fixed nodes", "Other"]],
        ["vascularFindings", "Vascular Findings", ["No jugular venous distention (JVD)", "JVD present", "No carotid bruit", "Carotid bruit auscultated", "Carotid pulse normal", "Diminished carotid pulse", "Other"]]
      ],
      dropdowns: [["cervicalRangeOfMotion", "Cervical Range of Motion", ["Full and non-tender", "Full with mild discomfort", "Limited due to pain", "Limited due to stiffness", "Severely restricted", "Not assessed", "Other"]]]
    },
    Throat: {
      checkboxGroups: [
        ["oralMucosa", "Oral Mucosa", ["Moist", "Pink", "Dry", "Pale", "Erythematous", "Ulcerations", "Lesions present", "Other"]],
        ["pharynxOropharynx", "Pharynx / Oropharynx", ["Clear", "Erythematous", "Cobblestoning", "Post-nasal drainage", "Exudate", "Petechiae", "Other"]],
        ["uvula", "Uvula", ["Midline", "Deviation present", "Swollen", "Not visualized", "Other"]],
        ["dentition", "Dentition", ["Intact", "Missing teeth", "Caries noted", "Poor dentition", "Dentures present", "Gingival inflammation", "Other"]]
      ],
      dropdowns: [["tonsils", "Tonsils", []]]
    }
  };

  function ensureDocs(p){
    p.clinicalDocumentation = p.clinicalDocumentation || {};
    const d = p.clinicalDocumentation;
    d.allergies = Array.isArray(d.allergies) ? d.allergies : [];
    const legacyAllergy = String(p.allergies || "").trim();
    const hasLegacy = legacyAllergy && !/^nka$|^nkda$|^allergy unknown$/i.test(legacyAllergy);
    if(!d.allergies.length && hasLegacy && !d.legacyAllergyImported){
      d.allergies.push(entryBase({allergen:legacyAllergy,reaction:"",comments:"",action:"Reviewed"}, "Allergies"));
      d.legacyAllergyImported = true;
    }
    d.immunizations = Array.isArray(d.immunizations) ? d.immunizations : [];
    d.provider = d.provider || {};
    d.provider.admission = d.provider.admission || {};
    d.provider.hpi = d.provider.hpi || {};
    d.provider.pastMedicalSurgical = d.provider.pastMedicalSurgical || {};
    d.provider.familySocial = d.provider.familySocial || {};
    d.provider.familySocial.substanceEntries = Array.isArray(d.provider.familySocial.substanceEntries) ? d.provider.familySocial.substanceEntries : [];
    d.provider.homeMedications = d.provider.homeMedications || {};
    d.medicationReconciliation = Array.isArray(d.medicationReconciliation) ? d.medicationReconciliation : [];
    d.ros = d.ros || {notes:"", findings:{}};
    d.ros.findings = d.ros.findings || {};
    d.physicalExam = d.physicalExam || {entries:[]};
    d.physicalExam.entries = Array.isArray(d.physicalExam.entries) ? d.physicalExam.entries : [];
    return d;
  }

  function entryBase(values, section, subsection, entryType){
    const at = new Date().toISOString();
    const p = currentPatient();
    return {
      id: uid("doc"),
      patientId: p.id,
      visitId: p.encounter || p.scenarioId || "",
      section,
      subsection: subsection || "",
      entryType: entryType || "",
      createdAt: at,
      updatedAt: at,
      createdBy: providerName(),
      updatedBy: providerName(),
      ...values
    };
  }

  function providerName(){
    return (typeof cloud !== "undefined" && (cloud.profile?.full_name || cloud.session?.user?.email)) || "Care team member";
  }

  function opt(list, selected, blank){
    const empty = blank === false ? "" : `<option value="">${esc(blank || "-- Select --")}</option>`;
    return empty + list.map(x=>`<option value="${esc(x)}" ${x === selected ? "selected" : ""}>${esc(x)}</option>`).join("");
  }

  function selectedList(list){ return Array.isArray(list) ? list : []; }

  function checkboxGrid(name, options, selected){
    const cur = new Set(selectedList(selected));
    return `<div class="clinical-checkbox-grid">${options.map((o,i)=>`
      <label for="${esc(name)}-${i}">
        <input id="${esc(name)}-${i}" type="checkbox" data-check-group="${esc(name)}" value="${esc(o)}" ${cur.has(o) ? "checked" : ""}>
        <span>${esc(o)}</span>
      </label>`).join("")}</div>`;
  }

  function collectChecks(root, name){
    return Array.from(root.querySelectorAll(`[data-check-group="${CSS.escape(name)}"]:checked`)).map(x=>x.value);
  }

  function docVal(id){ return document.getElementById(id)?.value?.trim() || ""; }
  function docValue(root, name){ return root.querySelector(`[name="${CSS.escape(name)}"]`)?.value?.trim() || ""; }
  function textInput(label, name, value, type){ return `<div class="form-row"><label for="cd-${esc(name)}">${esc(label)}</label><input id="cd-${esc(name)}" name="${esc(name)}" type="${esc(type || "text")}" value="${esc(value || "")}"></div>`; }
  function textArea(label, name, value, rows){ return `<div class="form-row"><label for="cd-${esc(name)}">${esc(label)}</label><textarea id="cd-${esc(name)}" name="${esc(name)}" rows="${rows || 3}">${esc(value || "")}</textarea></div>`; }
  function selectInput(label, name, options, value, blank){ return `<div class="form-row"><label for="cd-${esc(name)}">${esc(label)}</label><select id="cd-${esc(name)}" name="${esc(name)}">${opt(options, value, blank)}</select></div>`; }

  function modal(title, body, onSave){
    document.querySelector(".clinical-modal-backdrop")?.remove();
    const wrap = document.createElement("div");
    wrap.className = "clinical-modal-backdrop";
    wrap.innerHTML = `<div class="clinical-modal" role="dialog" aria-modal="true" aria-labelledby="clinical-modal-title">
      <div class="clinical-modal-head">
        <h3 id="clinical-modal-title">${esc(title)}</h3>
        <button class="btn small" type="button" data-clinical-close aria-label="Close">Close</button>
      </div>
      <form class="clinical-modal-form">
        <div class="clinical-modal-body">${body}</div>
        <div class="clinical-modal-actions">
          <button class="btn" type="button" data-clinical-close>Cancel</button>
          <button class="btn primary" type="submit">Save</button>
        </div>
      </form>
    </div>`;
    document.body.appendChild(wrap);
    const prior = document.activeElement;
    const close = () => {
      wrap.remove();
      if(prior && typeof prior.focus === "function") prior.focus();
    };
    wrap.querySelectorAll("[data-clinical-close]").forEach(b=>b.addEventListener("click", close));
    wrap.addEventListener("click", e=>{ if(e.target === wrap) close(); });
    wrap.addEventListener("keydown", e=>{ if(e.key === "Escape") close(); });
    wrap.querySelector("form").addEventListener("submit", e=>{
      e.preventDefault();
      if(onSave(wrap) !== false) close();
    });
    setTimeout(()=>wrap.querySelector("input,select,textarea,button")?.focus(), 30);
  }

  function updateAllergyHeader(p, docs){
    const entries = docs.allergies.filter(a=>a.allergen || a.reaction);
    p.allergies = entries.length ? entries.map(a=>[a.allergen, a.reaction].filter(Boolean).join(" - ")).join("; ") : "NKDA";
  }

  function saveAndRender(message){
    persist();
    toast(message || "Clinical documentation saved");
    render();
  }

  function itemActions(type, i){
    return `<span style="display:flex;gap:6px;flex-wrap:wrap;">
      <button class="btn small" data-cd-edit="${esc(type)}" data-cd-index="${i}">Edit</button>
      <button class="btn small danger" data-cd-delete="${esc(type)}" data-cd-index="${i}">Delete</button>
    </span>`;
  }

  function renderEntry(title, subtitle, details, actions){
    return `<div class="clinical-doc-entry">
      <div class="clinical-doc-entry-head">
        <div><strong>${esc(title || "Entry")}</strong>${subtitle ? `<div class="clinical-doc-subtitle">${esc(subtitle)}</div>` : ""}</div>
        ${actions || ""}
      </div>
      <div class="grid-2">${details}</div>
    </div>`;
  }

  function compactFields(fields){
    return fields.filter(([,v])=>{
      if(Array.isArray(v)) return v.length;
      return v !== undefined && v !== null && String(v).trim() !== "";
    }).map(([k,v])=>field(k, Array.isArray(v) ? v.join(", ") : v)).join("");
  }

  function labelize(k){
    return String(k).replace(/([A-Z])/g, " $1").replace(/^./, c=>c.toUpperCase()).replace(/\bRos\b/g, "ROS");
  }

  function allergiesSection(d){
    const rows = d.allergies.length ? d.allergies.map((a,i)=>renderEntry(
      a.allergen || "Allergy",
      a.action || "",
      compactFields([["Reaction", a.reaction], ["Comments", a.comments]]),
      itemActions("allergy", i)
    )).join("") : `<p class="text-block" style="color:var(--subtle);">No allergy entries documented.</p>`;
    return section("Allergies", rows, `<button class="btn small primary" data-cd-new="allergy">New Entry</button>`);
  }

  function immunizationsSection(d){
    const rows = d.immunizations.length ? d.immunizations.map((im,i)=>renderEntry(
      im.vaccine || "Immunization",
      [im.status, im.date, im.time].filter(Boolean).join(" | "),
      compactFields([["Manufacturer", im.manufacturer], ["Lot Number", im.lotNumber], ["Expiration Date", im.expirationDate], ["Clinical Site", im.clinicalSite], ["Comments", im.comments]]),
      itemActions("immunization", i)
    )).join("") : `<p class="text-block" style="color:var(--subtle);">No immunization entries documented.</p>`;
    return section("Immunizations", rows, `<button class="btn small primary" data-cd-new="immunization">New Entry</button>`);
  }

  function providerSection(d){
    const p = currentPatient();
    const pr = d.provider;
    const admission = pr.admission;
    const hpi = pr.hpi;
    const pmh = pr.pastMedicalSurgical;
    const social = pr.familySocial;
    const home = pr.homeMedications;
    return [
      section("Admission Information", `
        <div class="clinical-doc-grid">
          ${textInput("Admitting Provider", "admittingProvider", admission.admittingProvider || p.attending || "")}
          ${textInput("Chief Complaint", "chiefComplaint", admission.chiefComplaint || p.chiefComplaint || "")}
          ${textInput("Admission Diagnosis", "admissionDiagnosis", admission.admissionDiagnosis || p.diagnosis || "")}
          ${selectInput("Secondary Medical Diagnosis", "secondaryMedicalDiagnosis", SECONDARY_DIAGNOSES, admission.secondaryMedicalDiagnosis)}
          ${selectInput("Safety & Special Precautions", "safetySpecialPrecautions", PRECAUTIONS, admission.safetySpecialPrecautions)}
          ${selectInput("Risks & Alerts", "risksAlerts", RISKS_ALERTS, admission.risksAlerts)}
          ${textInput("Room / Bed #", "roomBed", admission.roomBed || p.location || "")}
        </div>
        ${textArea("Admission Comments", "admissionComments", admission.admissionComments, 3)}
        <div class="actions"><button class="btn primary" id="save-admission-info">Save Admission Information</button></div>
      `),
      section("History of Present Illness (HPI)", `
        <div class="clinical-doc-grid">
          ${textInput("Sign and Symptoms", "signsSymptoms", hpi.signsSymptoms)}
          ${textInput("Location", "location", hpi.location)}
          ${textInput("Duration", "duration", hpi.duration)}
          ${textInput("Quality", "quality", hpi.quality)}
          ${textInput("Severity", "severity", hpi.severity)}
        </div>
        ${textArea("HPI Comments", "hpiComments", hpi.hpiComments || p.hpi || "", 4)}
        <div class="actions"><button class="btn primary" id="save-hpi-doc">Save HPI</button></div>
      `),
      section("Past Medical & Surgical History", `
        ${textArea("Medical History", "medicalHistory", pmh.medicalHistory || p.pastHistory || "", 4)}
        ${textArea("Surgical History", "surgicalHistory", pmh.surgicalHistory, 4)}
        <div class="actions"><button class="btn primary" id="save-pmsh-doc">Save History</button></div>
      `),
      familySocialSection(social),
      section("Home Medications", `
        ${textArea("Home Medications", "homeMedications", home.homeMedications, 5)}
        <div class="actions"><button class="btn primary" id="save-home-meds-doc">Save Home Medications</button></div>
      `),
      medicationReconciliationSection(d)
    ].join("");
  }

  function familySocialSection(social){
    const substanceRows = social.substanceEntries.length ? social.substanceEntries.map((e,i)=>renderEntry(
      e.entryType,
      "",
      compactFields(Object.entries(e.fields || {}).map(([k,v])=>[labelize(k), v]).concat([["Comments", e.comments]])),
      itemActions("substance", i)
    )).join("") : `<p class="text-block" style="color:var(--subtle);">No substance use / abuse entries documented.</p>`;
    return section("Family & Social History", `
      ${textArea("Family History", "familyHistory", social.familyHistory, 3)}
      <div class="clinical-doc-grid">
        ${selectInput("Living Situation", "livingSituation", LIVING_SITUATIONS, social.livingSituation)}
        ${selectInput("Does Patient Feel Safe at Home?", "safeAtHome", YES_NO, social.safeAtHome)}
        ${selectInput("History of Abuse / Neglect", "abuseNeglect", ABUSE_NEGLECT, social.abuseNeglect)}
      </div>
      ${textArea("Safety Comments", "safetyComments", social.safetyComments, 3)}
      ${textArea("Abuse / Neglect Comments", "abuseNeglectComments", social.abuseNeglectComments, 3)}
      <div class="clinical-group">
        <h4>Substance Use / Abuse</h4>
        <div class="actions" style="justify-content:flex-start;">
          <button class="btn small primary" data-cd-new="substance" data-substance-type="Substance Use / Abuse">Substance Use / Abuse</button>
          <button class="btn small" data-cd-new="substance" data-substance-type="Alcohol Abuse">Alcohol Abuse</button>
          <button class="btn small" data-cd-new="substance" data-substance-type="Tobacco Abuse">Tobacco Abuse</button>
        </div>
        ${substanceRows}
      </div>
      ${textArea("Social History Comments", "socialHistoryComments", social.socialHistoryComments, 3)}
      <div class="actions"><button class="btn primary" id="save-family-social-doc">Save Family & Social History</button></div>
    `);
  }

  function medicationReconciliationSection(d){
    const rows = d.medicationReconciliation.map((m,i)=>`<tr>
      <td>${esc(m.medicationConcentration)}</td><td>${esc(m.indication)}</td><td>${esc(m.dose)}</td><td>${esc(m.route)}</td>
      <td>${esc(m.frequencyTime)}</td><td>${esc(m.currentlyTaking)}</td><td>${esc(m.lastTaken)}</td><td>${itemActions("medrec", i)}</td>
    </tr>`).join("") || `<tr><td colspan="8" style="color:var(--subtle);">No medication reconciliation rows documented.</td></tr>`;
    return section("Medication Reconciliation", table(["Medication & Concentration", "Indication", "Dose", "Route", "Frequency & Time", "Currently Taking", "Last taken", ""], rows), `<button class="btn small primary" data-cd-new="medrec">New Row</button>`);
  }

  function rosSection(d){
    const r = d.ros;
    const summary = ROS.map(([key,label])=>{
      const vals = selectedList(r.findings[key]);
      return vals.length ? field(label, vals.join(", ")) : "";
    }).join("") || `<p class="text-block" style="color:var(--subtle);">No Review of Systems findings selected.</p>`;
    const groups = ROS.map(([key,label,items])=>`
      <div class="clinical-group"><h4>${esc(label)}</h4>${checkboxGrid(`ros-${key}`, items, r.findings[key])}</div>`).join("");
    return section("Review of Systems", `
      <div class="clinical-doc-entry">${summary}</div>
      ${textArea("Review of Systems: Notes", "rosNotes", r.notes, 4)}
      ${groups}
      <div class="actions"><button class="btn primary" id="save-ros-doc">Save Review of Systems</button></div>
    `);
  }

  function physicalExamSection(d){
    const entries = d.physicalExam.entries;
    const summary = entries.length ? PHYSICAL_EXAM_CATEGORIES.map(cat=>{
      const catEntries = entries.filter(e=>e.subsection === cat);
      if(!catEntries.length) return "";
      return `<div class="clinical-group"><h4>${esc(cat)}</h4>${catEntries.map(e=>{
        const actualIndex = entries.indexOf(e);
        return renderEntry(e.entryType || cat, e.updatedAt ? `Updated ${new Date(e.updatedAt).toLocaleString()}` : "",
          compactFields(Object.entries(e.fields || {}).map(([k,v])=>[labelize(k), v]).concat([["Comments", e.comments]])),
          itemActions("physical", actualIndex));
      }).join("")}</div>`;
    }).join("") : `<p class="text-block" style="color:var(--subtle);">No physical exam findings documented.</p>`;
    const buttons = PHYSICAL_EXAM_CATEGORIES.map(cat=>`<button class="btn small ${cat === "General Survey" ? "primary" : ""}" data-cd-new="physical" data-pe-category="${esc(cat)}">${esc(cat)}</button>`).join("");
    const heent = ["Nose", "Neck", "Throat", "Eyes", "Head", "Ears"].map(sub=>`<button class="btn small" data-cd-new="physical" data-pe-category="HEENT & Neck" data-pe-subentry="${esc(sub)}">${esc(sub)}</button>`).join("");
    return section("Physical Exam", `
      <div class="actions" style="justify-content:flex-start;">${buttons}</div>
      <div class="clinical-group"><h4>HEENT & Neck Subentries</h4><div class="actions" style="justify-content:flex-start;">${heent}</div></div>
      ${summary}
    `);
  }

  function rClinicalDocs(){
    const p = currentPatient();
    const d = ensureDocs(p);
    return `
      ${section("Clinical Documentation Summary", `
        <div class="grid-4">
          ${field("Allergies", d.allergies.length)}
          ${field("Immunizations", d.immunizations.length)}
          ${field("Medication reconciliation rows", d.medicationReconciliation.length)}
          ${field("Physical exam entries", d.physicalExam.entries.length)}
        </div>
      `)}
      ${allergiesSection(d)}
      ${immunizationsSection(d)}
      ${providerSection(d)}
      ${rosSection(d)}
      ${physicalExamSection(d)}
    `;
  }

  function openAllergy(index){
    const p = currentPatient();
    const d = ensureDocs(p);
    const a = index >= 0 ? d.allergies[index] : {};
    modal(index >= 0 ? "Edit Allergy" : "New Allergy", `
      ${textInput("Allergen", "allergen", a.allergen)}
      ${textInput("Reaction", "reaction", a.reaction)}
      ${selectInput("Action / Status", "action", ALLERGY_ACTIONS, a.action || "Allergen Added", false)}
      ${textArea("Comments", "comments", a.comments, 4)}
    `, root=>{
      const allergen = docValue(root, "allergen");
      if(!allergen){ toast("Allergen required"); return false; }
      const next = index >= 0 ? d.allergies[index] : entryBase({}, "Allergies");
      Object.assign(next, {allergen, reaction:docValue(root,"reaction"), action:docValue(root,"action") || "Allergen Added", comments:docValue(root,"comments"), updatedAt:new Date().toISOString(), updatedBy:providerName()});
      if(index < 0) d.allergies.push(next);
      updateAllergyHeader(p, d);
      saveAndRender("Allergy saved");
    });
  }

  function openImmunization(index){
    const d = ensureDocs(currentPatient());
    const im = index >= 0 ? d.immunizations[index] : {};
    modal(index >= 0 ? "Edit Immunization" : "New Immunization", `
      <div class="clinical-doc-grid">
        ${selectInput("Vaccine", "vaccine", VACCINES, im.vaccine)}
        ${selectInput("Dose/status", "status", IMMUNIZATION_STATUS, im.status)}
        ${textInput("Date", "date", im.date, "date")}
        ${textInput("Time", "time", im.time, "time")}
        ${textInput("Manufacturer", "manufacturer", im.manufacturer)}
        ${textInput("Lot Number", "lotNumber", im.lotNumber)}
        ${textInput("Expiration Date", "expirationDate", im.expirationDate, "date")}
        ${textInput("Clinical Site", "clinicalSite", im.clinicalSite)}
      </div>
      ${textArea("Comments", "comments", im.comments, 4)}
    `, root=>{
      const vaccine = docValue(root, "vaccine");
      if(!vaccine){ toast("Vaccine required"); return false; }
      const next = index >= 0 ? d.immunizations[index] : entryBase({}, "Immunizations");
      ["vaccine","status","date","time","manufacturer","lotNumber","expirationDate","clinicalSite","comments"].forEach(k=>next[k]=docValue(root,k));
      next.updatedAt = new Date().toISOString();
      next.updatedBy = providerName();
      if(index < 0) d.immunizations.push(next);
      saveAndRender("Immunization saved");
    });
  }

  function openSubstance(index, type){
    const d = ensureDocs(currentPatient());
    const list = d.provider.familySocial.substanceEntries;
    const entry = index >= 0 ? list[index] : {entryType:type || "Substance Use / Abuse", fields:{}, comments:""};
    const f = entry.fields || {};
    let body = selectInput("Entry Type", "entryType", ["Substance Use / Abuse", "Alcohol Abuse", "Tobacco Abuse"], entry.entryType, false);
    if(entry.entryType === "Tobacco Abuse"){
      body += `<div class="clinical-doc-grid">
        ${selectInput("Smoking", "smoking", ["Never", "Former", "Every Day", "Some Days", "Unknown"], f.smoking)}
        ${selectInput("Passive Exposure", "passiveExposure", ["Never", "Past", "Current"], f.passiveExposure)}
        ${selectInput("Smokeless", "smokeless", ["Never", "Former", "Current", "Unknown"], f.smokeless)}
        ${textInput("Quit Date", "quitDate", f.quitDate, "date")}
        ${textInput("Cessation", "cessation", f.cessation)}
      </div><div class="clinical-group"><h4>Types</h4>${checkboxGrid("tobaccoTypes", ["Chew", "Snuff"], f.types)}</div>`;
    } else if(entry.entryType === "Alcohol Abuse"){
      body += textInput("Alcohol Amount", "alcoholAmount", f.alcoholAmount);
    } else {
      body += `<div class="clinical-doc-grid">
        ${textInput("Alcohol", "alcohol", f.alcohol)}
        ${textInput("Alcohol Amount", "alcoholAmount", f.alcoholAmount)}
        ${textInput("Cigarettes / Cigars", "cigarettesCigars", f.cigarettesCigars)}
        ${textInput("How many packs per day?", "packsPerDay", f.packsPerDay)}
        ${textInput("Chewing Tobacco", "chewingTobacco", f.chewingTobacco)}
        ${textInput("Vaping", "vaping", f.vaping)}
        ${textInput("Marijuana", "marijuana", f.marijuana)}
        ${textInput("Illicit Drugs", "illicitDrugs", f.illicitDrugs)}
      </div>`;
    }
    body += textArea("Comments", "comments", entry.comments, 4);
    modal(index >= 0 ? "Edit Substance Entry" : "New Substance Entry", body, root=>{
      const entryType = docValue(root, "entryType");
      const next = index >= 0 ? list[index] : entryBase({}, "Provider Documentation", "Family & Social History", entryType);
      next.entryType = entryType;
      next.fields = {};
      if(entryType === "Tobacco Abuse"){
        ["smoking","passiveExposure","smokeless","quitDate","cessation"].forEach(k=>next.fields[k]=docValue(root,k));
        next.fields.types = collectChecks(root, "tobaccoTypes");
      } else if(entryType === "Alcohol Abuse"){
        next.fields.alcoholAmount = docValue(root, "alcoholAmount");
      } else {
        ["alcohol","alcoholAmount","cigarettesCigars","packsPerDay","chewingTobacco","vaping","marijuana","illicitDrugs"].forEach(k=>next.fields[k]=docValue(root,k));
      }
      next.comments = docValue(root, "comments");
      next.updatedAt = new Date().toISOString();
      next.updatedBy = providerName();
      if(index < 0) list.push(next);
      saveAndRender("Substance entry saved");
    });
  }

  function openMedRec(index){
    const d = ensureDocs(currentPatient());
    const row = index >= 0 ? d.medicationReconciliation[index] : {};
    modal(index >= 0 ? "Edit Medication Reconciliation Row" : "New Medication Reconciliation Row", `
      <div class="clinical-doc-grid">
        ${textInput("Medication & Concentration", "medicationConcentration", row.medicationConcentration)}
        ${textInput("Indication", "indication", row.indication)}
        ${textInput("Dose", "dose", row.dose)}
        ${textInput("Route", "route", row.route)}
        ${textInput("Frequency & Time", "frequencyTime", row.frequencyTime)}
        ${textInput("Currently Taking", "currentlyTaking", row.currentlyTaking)}
        ${textInput("Last taken", "lastTaken", row.lastTaken)}
      </div>
    `, root=>{
      const med = docValue(root, "medicationConcentration");
      if(!med){ toast("Medication & Concentration required"); return false; }
      const next = index >= 0 ? d.medicationReconciliation[index] : entryBase({}, "Provider Documentation", "Medication Reconciliation");
      ["medicationConcentration","indication","dose","route","frequencyTime","currentlyTaking","lastTaken"].forEach(k=>next[k]=docValue(root,k));
      next.updatedAt = new Date().toISOString();
      next.updatedBy = providerName();
      if(index < 0) d.medicationReconciliation.push(next);
      saveAndRender("Medication reconciliation saved");
    });
  }

  function openPhysical(index, category, subentry){
    const d = ensureDocs(currentPatient());
    const entry = index >= 0 ? d.physicalExam.entries[index] : {subsection:category || "General Survey", entryType:subentry || category || "General Survey", fields:{}, comments:""};
    const cat = entry.subsection || category || "General Survey";
    const type = entry.entryType || subentry || cat;
    let body = `<div class="clinical-doc-grid">
      ${selectInput("Physical Exam Category", "category", PHYSICAL_EXAM_CATEGORIES, cat, false)}
      ${cat === "HEENT & Neck" ? selectInput("Subentry", "entryType", ["Nose", "Neck", "Throat", "Eyes", "Head", "Ears"], type, false) : textInput("Entry Type", "entryType", type)}
    </div>`;
    const f = entry.fields || {};
    if(cat === "General Survey"){
      body += GENERAL_SURVEY.map(([key,label,items])=>`<div class="clinical-group"><h4>${esc(label)}</h4>${checkboxGrid(`pe-${key}`, items, f[key])}</div>`).join("");
    } else if(cat === "HEENT & Neck" && PE_DETAILS[type]){
      const spec = PE_DETAILS[type];
      body += (spec.dropdowns || []).map(([key,label,items])=>selectInput(label, key, items, f[key], items.length ? "-- Select --" : "No platform options defined")).join("");
      body += (spec.checkboxGroups || []).map(([key,label,items])=>`<div class="clinical-group"><h4>${esc(label)}</h4>${checkboxGrid(`pe-${key}`, items, f[key])}</div>`).join("");
    }
    body += textArea("Comments", "comments", entry.comments, 4);
    modal(index >= 0 ? "Edit Physical Exam Entry" : "New Physical Exam Entry", body, root=>{
      const nextCat = docValue(root, "category");
      const nextType = docValue(root, "entryType") || nextCat;
      const next = index >= 0 ? d.physicalExam.entries[index] : entryBase({}, "Physical Exam", nextCat, nextType);
      next.subsection = nextCat;
      next.entryType = nextType;
      next.fields = {};
      if(nextCat === "General Survey"){
        GENERAL_SURVEY.forEach(([key])=>next.fields[key]=collectChecks(root, `pe-${key}`));
      } else if(nextCat === "HEENT & Neck" && PE_DETAILS[nextType]){
        (PE_DETAILS[nextType].dropdowns || []).forEach(([key])=>next.fields[key]=docValue(root, key));
        (PE_DETAILS[nextType].checkboxGroups || []).forEach(([key])=>next.fields[key]=collectChecks(root, `pe-${key}`));
      }
      next.comments = docValue(root, "comments");
      next.updatedAt = new Date().toISOString();
      next.updatedBy = providerName();
      if(index < 0) d.physicalExam.entries.push(next);
      saveAndRender("Physical exam entry saved");
    });
  }

  function saveProviderFields(sectionName, fields, message){
    const d = ensureDocs(currentPatient());
    const target = d.provider[sectionName];
    fields.forEach(k=>target[k]=docVal(k));
    target.updatedAt = new Date().toISOString();
    target.updatedBy = providerName();
    saveAndRender(message);
  }

  function saveRos(){
    const d = ensureDocs(currentPatient());
    d.ros.notes = docVal("rosNotes");
    ROS.forEach(([key])=>{
      d.ros.findings[key] = Array.from(document.querySelectorAll(`[data-check-group="ros-${key}"]:checked`)).map(x=>x.value);
    });
    d.ros.updatedAt = new Date().toISOString();
    d.ros.updatedBy = providerName();
    saveAndRender("Review of Systems saved");
  }

  function bindClinicalDocs(){
    document.querySelectorAll("[data-cd-new]").forEach(btn=>btn.addEventListener("click", ()=>{
      const type = btn.dataset.cdNew;
      if(type === "allergy") openAllergy(-1);
      if(type === "immunization") openImmunization(-1);
      if(type === "substance") openSubstance(-1, btn.dataset.substanceType);
      if(type === "medrec") openMedRec(-1);
      if(type === "physical") openPhysical(-1, btn.dataset.peCategory, btn.dataset.peSubentry);
    }));
    document.querySelectorAll("[data-cd-edit]").forEach(btn=>btn.addEventListener("click", ()=>{
      const i = Number(btn.dataset.cdIndex);
      if(btn.dataset.cdEdit === "allergy") openAllergy(i);
      if(btn.dataset.cdEdit === "immunization") openImmunization(i);
      if(btn.dataset.cdEdit === "substance") openSubstance(i);
      if(btn.dataset.cdEdit === "medrec") openMedRec(i);
      if(btn.dataset.cdEdit === "physical") openPhysical(i);
    }));
    document.querySelectorAll("[data-cd-delete]").forEach(btn=>btn.addEventListener("click", ()=>{
      if(!confirm("Delete this entry?")) return;
      const p = currentPatient();
      const d = ensureDocs(p);
      const i = Number(btn.dataset.cdIndex);
      if(btn.dataset.cdDelete === "allergy"){ d.allergies.splice(i,1); updateAllergyHeader(p,d); }
      if(btn.dataset.cdDelete === "immunization") d.immunizations.splice(i,1);
      if(btn.dataset.cdDelete === "substance") d.provider.familySocial.substanceEntries.splice(i,1);
      if(btn.dataset.cdDelete === "medrec") d.medicationReconciliation.splice(i,1);
      if(btn.dataset.cdDelete === "physical") d.physicalExam.entries.splice(i,1);
      saveAndRender("Entry deleted");
    }));
    document.getElementById("save-admission-info")?.addEventListener("click", ()=>saveProviderFields("admission", ["admittingProvider","chiefComplaint","admissionDiagnosis","secondaryMedicalDiagnosis","safetySpecialPrecautions","risksAlerts","roomBed","admissionComments"], "Admission Information saved"));
    document.getElementById("save-hpi-doc")?.addEventListener("click", ()=>saveProviderFields("hpi", ["signsSymptoms","location","duration","quality","severity","hpiComments"], "HPI saved"));
    document.getElementById("save-pmsh-doc")?.addEventListener("click", ()=>saveProviderFields("pastMedicalSurgical", ["medicalHistory","surgicalHistory"], "History saved"));
    document.getElementById("save-family-social-doc")?.addEventListener("click", ()=>saveProviderFields("familySocial", ["familyHistory","livingSituation","safeAtHome","safetyComments","abuseNeglect","abuseNeglectComments","socialHistoryComments"], "Family & Social History saved"));
    document.getElementById("save-home-meds-doc")?.addEventListener("click", ()=>saveProviderFields("homeMedications", ["homeMedications"], "Home Medications saved"));
    document.getElementById("save-ros-doc")?.addEventListener("click", saveRos);
  }

  function patchNavigation(){
    const originalTabTitle = window.tabTitle || tabTitle;
    window.tabTitle = function(){
      if(state.tab === "clinicaldocs") return "Clinical documentation";
      return originalTabTitle();
    };
    const originalRenderTab = window.renderTab || renderTab;
    window.renderTab = function(){
      if(state.tab === "clinicaldocs") return rClinicalDocs();
      return originalRenderTab();
    };
    const originalBind = window.bindTabEvents || bindTabEvents;
    window.bindTabEvents = function(){
      originalBind();
      if(state.tab === "clinicaldocs") bindClinicalDocs();
    };
    window.renderNav = function(){
      const hasAnalytics = typeof canAccessAnalytics === "function" && canAccessAnalytics();
      const t = state.tab;
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
  }

  window.rClinicalDocs = rClinicalDocs;
  patchNavigation();
})();
