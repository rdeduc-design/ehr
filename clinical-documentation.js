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
      const hasFaculty = typeof canUseFacultyTools === "function" && canUseFacultyTools();
      const groups = [
        ["Hospital", [["his","HIS","Hospital IS"]]],
        ["Chart review", [["summary","PS","Patient summary"],["orders","PO","Provider orders"],["labs","LR","Labs / diagnostics"]]],
        ["Documentation", [["vitals","VS","Vital signs"],["assessment","FA","Focused assessment"],["clinicaldocs","CD","Clinical docs"],["meds","MR","MAR"],["io","IO","Intake / output"],["notes","NN","Nursing notes"],["careplan","CP","Care plan"],["education","ED","Education"],["sbar","SB","SBAR / handoff"]]],
        ["Learning tools", [["reasoning","CR","Clinical reasoning"],["peerreview","PR","Peer review mode"],["medcalc","MC","Medication calculator"],["debriefing","DB","Debriefing"],["progress","PT","My progress"],["report","RP","Print report"],["scenarios","SC","Sample scenarios"],["newpatient","NP","Add patient"]]]
      ];
      if(hasFaculty) groups.push(["Faculty tools", [["modulebuilder","MB","Faculty module builder"],["dashboard","AD","Analytics dashboard"],["statusboard","SB","Status board"]]]);
      return groups.map(([label,items]) => `<div class="nav-group"><div class="nav-label">${esc(label)}</div>${items.map(([id,abbr,title]) => `<button class="${state.tab===id ? "active" : ""}" data-tab="${id}"><span>${abbr}</span>${esc(title)}</button>`).join("")}</div>`).join("");
    };
  }

  window.rClinicalDocs = rClinicalDocs;
  patchNavigation();
})();

(function(){
  "use strict";

  const esc = window.escapeHtml || function(value){
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  };

  const VISIT_TYPES = ["Inpatient", "Outpatient", "Long-Term Care", "Run Report"];
  const ROUTES = ["PO", "IV", "IM", "SQ", "SL", "Topical", "Inhalation", "Other"];
  const YES_NO_UNKNOWN = ["Yes", "No", "Unknown"];
  const VACCINE_CHOICES = ["Influenza IIV4", "Hepatitis B", "Hepatitis A", "COVID-19", "MMR", "Varicella", "Tdap", "Pneumococcal conjugate PCV13", "Meningococcal", "HPV", "Rotavirus", "Other", "Vaccines Up to Date"];
  const VACCINE_ACTIONS = ["Given", "Refused", "1st Dose", "2nd Dose", "3rd Dose", "4th Dose", "Catch-up", "Vaccination Status Reviewed"];
  const ALLERGY_ACTIONS_2 = ["Allergen Added", "Reviewed"];
  const SECONDARY_DX_2 = ["Delirium", "Deep Vein Thrombosis (DVT)", "Pneumonia", "Malnutrition", "Medication Errors", "Infection", "Pressure Ulcers", "Stroke", "Hypoxia", "Anaphylaxis", "Alcohol Use", "Intoxication", "Substance Abuse", "Other"];
  const PRECAUTIONS_2 = ["Standard", "Contact", "Contact +", "Droplet", "Airborne", "Neutropenic", "Protective Isolation", "Radiation Precautions", "Reverse Isolation", "Enhanced Barrier Precautions", "Other"];
  const RISKS_2 = ["Fall", "Skin Breakdown", "Behavioral", "Sepsis", "MRSA", "Elopement Risk", "High Risk Medications", "Allergy", "Other"];
  const LIVING_2 = ["Lives Alone", "Lives in Assisted Living", "Lives in LTC", "Lives with Family", "Homeless", "Other"];
  const ABUSE_2 = ["Yes: See Comments", "No"];

  const ROS_2 = [
    ["skinMucous", "Skin / Mucous Membranes", ["WDL", "No Relevant Findings"]],
    ["head", "Head", ["Headaches", "Head injury", "No Relevant Findings"]],
    ["eyes", "Eyes", ["Glasses or contacts", "Change in vision", "Eye pain", "Double vision", "Flashing lights", "Glaucoma / Cataracts", "Last eye exam", "No Relevant Findings"]],
    ["ears", "Ears", ["Change in hearing", "Ear pain", "Ear discharge", "Ringing", "Dizziness", "No Relevant Findings"]],
    ["noseSinuses", "Nose / Sinuses", ["Nose bleeds", "Nasal stuffiness", "Frequent colds", "No Relevant Findings"]],
    ["allergies", "Allergies", ["Hives", "Swelling of lips or tongue", "Hay fever", "Asthma", "Eczema / Sensitive", "Sensitivity to drugs, food, pollens, or dander", "No Relevant Findings"]],
    ["mouthThroat", "Mouth / Throat", ["Bleeding gums", "Sore tongue", "Sore throat", "Hoarseness", "No Relevant Findings"]],
    ["neck", "Neck", ["Lumps", "Swollen glands", "Goiter", "Stiffness", "No Relevant Findings"]],
    ["breast", "Breast", ["Lumps", "Pain", "Nipple discharge", "Breast self-examination", "No Relevant Findings"]],
    ["respCardiac", "Respiratory / Cardiac", ["Shortness of breath", "Cough", "Production of phlegm, color", "Wheezing", "Coughing up blood", "Chest pain", "Fever", "Night sweats", "Swelling in hands / feet", "Blue fingers / toes", "High blood pressure", "Skipping heart beats", "Heart murmur", "History of heart medication", "Bronchitis / emphysema", "Rheumatic heart disease", "No Relevant Findings"]],
    ["gi", "Gastrointestinal", ["Change of appetite or weight", "Problems swallowing", "Nausea", "Heartburn", "Vomiting", "Vomiting blood", "Constipation", "Diarrhea", "Change in bowel habits", "Abdominal pain", "Excessive belching", "Excessive flatulence", "Yellow color of skin", "Food intolerance", "Rectal bleeding / hemorrhoids", "No Relevant Findings"]],
    ["urinary", "Urinary", ["Difficulty in urination", "Pain or burning during urination", "Frequent urination at night", "Urgent need to urinate", "Incontinence of urine", "Dribbling", "Decreased urine stream", "Blood in urine", "UTI / stones / prostate infection", "No Relevant Findings"]],
    ["peripheralVascular", "Peripheral Vascular", ["Leg cramps", "Varicose veins", "Clots in veins", "No Relevant Findings"]],
    ["musculoskeletal", "Musculoskeletal", ["Pain", "Swelling", "Stiffness", "Decreased joint motion", "Broken bone", "Serious sprains", "Arthritis", "Gout", "No Relevant Findings"]],
    ["neurologic", "Neurologic", ["Headaches", "Seizures", "Loss of consciousness / fainting", "Paralysis", "Weakness", "Loss of muscle size", "Muscle spasm", "Tremor", "Involuntary movement", "Incoordination", "Numbness", "Feeling of \u201cpins & needles / tingles\u201d", "No Relevant Findings"]],
    ["hematologic", "Hematologic", ["Anemia", "Easy bruising / bleeding", "Past transfusions", "No Relevant Findings"]],
    ["endocrine", "Endocrine", ["Abnormal growth", "Increased appetite", "Increased thirst", "Increased urine production", "Thyroid trouble", "Heat / Cold intolerance", "Excessive sweating", "Diabetes", "No Relevant Findings"]],
    ["psychiatric", "Psychiatric", ["Tension / Anxiety", "Depression / suicide ideation", "Memory problems", "Unusual problems", "Sleep problems", "Past treatment with Psychiatrist", "Change in mood / change in attitude towards family / friends", "No Relevant Findings"]]
  ];

  const PHYS_CATEGORIES_2 = [
    "General Survey", "HEENT & Neck", "Skin", "Cardiopulmonary", "Respiratory",
    "Gastrointestinal & Genitourinary", "Musculoskeletal & Extremities",
    "Neurological", "Psychiatric / Mental Status", "Lymphatic"
  ];

  const PE_CONFIG = {
    "General Survey": {
      type: "General Survey",
      groups: [
        cg("levelOfConsciousness", "Level of Consciousness", ["Alert", "Lethargic", "Obtunded", "Stuporous", "Unresponsive", "Other"]),
        cg("orientation", "Orientation", ["Oriented x4 (person, place, time, situation)", "Person", "Place", "Time", "Situation", "Disoriented", "Unable to assess", "Not tested", "Other"]),
        cg("apparentDistress", "Apparent Distress", ["No acute distress", "Mild distress", "Moderate distress", "Severe distress", "Respiratory distress", "Emotional distress", "Pain-related distress", "Other"]),
        cg("nutritionalStatus", "Nutritional Status", ["Well-nourished", "Underweight", "Overweight", "Cachectic", "Obese", "Malnourished", "Other"]),
        cg("hygieneGrooming", "Hygiene & Grooming", ["Well-groomed", "Disheveled", "Poor hygiene", "Body odor noted", "Poor dentition", "Other"]),
        cg("mobilityGait", "Mobility / Gait", ["Ambulated independently", "Uses assistive device, such as cane or walker", "Unsteady gait", "Ataxic gait", "Unable to walk", "Wheelchair-bound", "Other"])
      ]
    },
    Nose: {
      category: "HEENT & Neck",
      groups: [
        cg("externalNose", "External Nose", ["Normal appearance", "Asymmetry", "Deformity", "Redness", "Swelling", "Lesions", "Trauma/ecchymosis", "Other"]),
        dd("nasalMucosa", "Nasal Mucosa", ["Pink and moist", "Pale and boggy", "Erythematous", "Dry", "Bleeding noted", "Ulcerated", "Not assessed", "Other"]),
        cg("nasalSeptum", "Nasal Septum", ["Midline", "Deviated", "Perforated", "Bleeding present", "Septal hematoma", "Not visualized", "Other"]),
        cg("turbinates", "Turbinates", ["Normal size and color", "Pale", "Erythematous", "Enlarged", "Obstructing airflow", "Not visualized", "Other"]),
        cg("discharge", "Discharge", ["None", "Clear", "Mucoid", "Purulent", "Bloody", "Foul-smelling", "Not assessed", "Other"]),
        cg("sinusTenderness", "Sinus Tenderness", ["No sinus tenderness", "Frontal sinus tenderness", "Maxillary sinus tenderness", "Ethmoid sinus tenderness", "Percussion pain present", "Other"])
      ]
    },
    Neck: {
      category: "HEENT & Neck",
      groups: [
        cg("inspection", "Inspection", ["Neck supple", "Full range of motion", "Trachea midline", "Visible swelling", "Visible mass or fullness", "Surgical scar present", "No visible abnormalities", "Other"]),
        cg("palpation", "Palpation", ["No tenderness to palpation", "Trachea midline to palpation", "Tracheal deviation", "Mass palpated", "Thyromegaly appreciated", "Crepitus present", "Other"]),
        dd("cervicalRangeOfMotion", "Cervical Range of Motion", ["Full and non-tender", "Full with mild discomfort", "Limited due to pain", "Limited due to stiffness", "Severely restricted", "Not assessed", "Other"]),
        cg("thyroidExamination", "Thyroid Examination", ["Thyroid not enlarged", "Symmetric lobes", "Diffuse enlargement", "Palpable nodule(s)", "Tender to palpation", "Not palpable", "Other"]),
        cg("cervicalLymphadenopathy", "Cervical Lymphadenopathy", ["No lymphadenopathy", "Anterior cervical nodes palpable", "Posterior cervical nodes palpable", "Submandibular or submental nodes palpable", "Supraclavicular nodes palpable", "Tender nodes", "Firm or fixed nodes", "Other"]),
        cg("vascularFindings", "Vascular Findings", ["No jugular venous distention (JVD)", "JVD present", "No carotid bruit", "Carotid bruit auscultated", "Carotid pulse normal", "Diminished carotid pulse", "Other"])
      ]
    },
    Throat: {
      category: "HEENT & Neck",
      groups: [
        cg("oralMucosa", "Oral Mucosa", ["Moist", "Pink", "Dry", "Pale", "Erythematous", "Ulcerations", "Lesions present", "Other"]),
        dd("tonsils", "Tonsils", ["Present, non-enlarged", "Enlarged", "Erythematous", "Exudate present", "Removed, post-tonsillectomy", "Unable to visualize", "Other"]),
        cg("pharynxOropharynx", "Pharynx / Oropharynx", ["Clear", "Erythematous", "Cobblestoning", "Post-nasal drainage", "Exudate", "Petechiae", "Other"]),
        cg("uvula", "Uvula", ["Midline", "Deviation present", "Swollen", "Not visualized", "Other"]),
        cg("dentition", "Dentition", ["Intact", "Missing teeth", "Caries noted", "Poor dentition", "Dentures present", "Gingival inflammation", "Other"]),
        cg("tongue", "Tongue", ["Midline", "Moist", "Dry", "Coated", "Lesions present", "Deviated", "Other"])
      ]
    },
    Eyes: {
      category: "HEENT & Neck",
      groups: [
        cg("externalEyeAppearance", "External Eye Appearance", ["Normal appearance", "Periorbital edema", "Redness", "Discharge", "Lesions", "Jaundice (sclera)", "Other"]),
        cg("conjunctiva", "Conjunctiva", ["Clear", "Injected", "Pale", "Chemosis", "Discharge present", "Other"]),
        cg("sclera", "Sclera", ["White", "Icteric", "Bluish hue", "Injection noted", "Subconjunctival hemorrhage", "Other"]),
        cg("pupilFindings", "Pupil Findings", ["Equal", "Round", "Reactive to light", "Anisocoria", "Sluggish reaction", "Fixed", "Other"]),
        cg("extraocularMovements", "Extraocular Movements", ["Intact", "Limited lateral gaze", "Limited vertical gaze", "Nystagmus", "Diplopia reported", "Pain with movement", "Other"]),
        dd("visualAcuity", "Visual Acuity", ["Normal for age", "Blurred vision", "Decreased acuity", "Unable to assess", "Not tested", "Other"]),
        cg("fundoscopicExam", "Fundoscopic Exam", ["Normal disc and vessels", "Papilledema", "Retinal hemorrhage", "AV nicking", "Cotton wool spots", "Not performed", "Other"])
      ]
    },
    Head: {
      category: "HEENT & Neck",
      groups: [
        cg("generalAppearance", "General Appearance", ["Normocephalic", "Atraumatic", "Abnormal contour", "Scars", "Swelling", "Lesions present", "Other"]),
        cg("scalpCondition", "Scalp Condition", ["Intact, clean", "Flaky/dry", "Erythematous", "Laceration present", "Mass or nodule", "Alopecia", "Unable to assess", "Other"]),
        cg("palpationFindings", "Palpation Findings", ["No tenderness", "Mild tenderness", "Severe tenderness", "Crepitus", "Swelling", "Fluctuance", "Other"]),
        cg("massesLesions", "Masses or Lesions", ["None", "Soft tissue mass", "Bony prominence", "Scalp hematoma", "Cystic lesion", "Other"]),
        cg("signsOfTrauma", "Signs of Trauma", ["None observed", "Ecchymosis", "Abrasion", "Laceration", "Hematoma", "Other"])
      ]
    },
    Ears: {
      category: "HEENT & Neck",
      groups: [
        cg("externalEarAuricle", "External Ear / Auricle", ["Normal appearance", "Redness", "Swelling", "Tenderness", "Lesions", "Deformity", "Other"]),
        cg("earCanal", "Ear Canal", ["Clear", "Cerumen present", "Impacted cerumen", "Erythematous", "Swollen", "Discharge", "Other"]),
        dd("tympanicMembrane", "Tympanic Membrane (TM)", ["Normal: pearly gray, intact", "Erythematous", "Bulging", "Retracted", "Perforated", "Dull/opaque", "Unable to visualize", "Other"]),
        cg("hearingGross", "Hearing / Gross Assessment", ["Normal bilaterally", "Decreased on right", "Decreased on left", "Unable to assess", "Hearing aids in use", "Other"]),
        cg("tenderness", "Tenderness to Palpation", ["None", "Tragus tenderness", "Pinna tenderness", "Mastoid tenderness", "Other"]),
        cg("specialTests", "Special Tests, if performed", ["Weber test performed", "Rinne test performed", "Abnormal Weber", "Abnormal Rinne", "Not performed", "Other"])
      ]
    },
    Skin: {
      category: "Skin",
      groups: [
        cg("skinColorAppearance", "Skin Color & Appearance", ["Normal for ethnicity", "Pale", "Flushed", "Cyanotic", "Jaundiced", "Mottled", "Ecchymosis", "Erythema", "Other"]),
        dd("moistureTexture", "Moisture & Texture", ["Warm and dry", "Cool and dry", "Warm and moist", "Diaphoretic", "Clammy", "Rough or scaly", "Not assessed", "Other"]),
        dd("temperature", "Temperature", ["Normal temperature", "Warm to touch", "Cool to touch", "Hot to touch", "Cold extremities", "Not assessed", "Other"]),
        cg("turgorIntegrity", "Turgor & Integrity", ["Skin turgor normal", "Tenting noted", "Intact skin", "Skin tears present", "Excoriation", "Fragile skin", "Not assessed", "Other"]),
        cg("lesionsRashes", "Lesions / Rashes", ["No rash or lesions", "Maculopapular rash", "Vesicular lesions", "Petechiae", "Purpura", "Open lesions", "Other"]),
        cg("woundsUlcers", "Wounds / Ulcers", ["No wounds or ulcers", "Surgical incision", "Pressure injury", "Skin breakdown", "Drainage present", "Dressing intact", "Not assessed", "Other"])
      ]
    },
    Cardiovascular: {
      category: "Cardiopulmonary",
      groups: [
        cg("heartSoundsRhythm", "Heart Sounds & Rhythm", ["S1 normal", "S2 normal", "Regular rate and rhythm", "Murmur present", "Rub present", "Gallop (S3 or S4)", "Tachycardia", "Bradycardia", "Other"]),
        dd("murmurCharacteristics", "Murmur Characteristics", ["Systolic, graded I-VI", "Diastolic", "Continuous", "Flow murmur", "Not assessed", "Other"]),
        cg("precordialExam", "Precordial Exam", ["PMI at 5th ICS MCL", "PMI displaced", "Lift or heave", "Thrill present", "No precordial abnormality", "Other"]),
        dd("jvd", "Jugular Venous Distention (JVD)", ["Not assessed", "Absent", "Present", "Other"]),
        cg("peripheralPulses", "Peripheral Pulses", ["Radial pulses 2+", "Radial pulses diminished", "Dorsalis pedis pulses 2+", "Dorsalis pedis pulses diminished", "Posterior tibial pulses 2+", "Posterior tibial pulses diminished", "Pulses symmetric", "Pulses asymmetric", "Not assessed", "Other"]),
        cg("perfusionFindings", "Perfusion Findings", ["Capillary refill <2 seconds", "Capillary refill >2 seconds", "Cool extremities", "Warm and well-perfused", "Cyanosis", "Mottled appearance", "Other"]),
        cg("edema", "Edema", ["No edema", "1+ pitting", "2+ pitting", "3+ pitting", "4+ pitting", "Non-pitting edema", "Other"]),
        cg("bruits", "Bruits", ["No carotid bruit", "Carotid bruit present", "No femoral bruit", "Femoral bruit present", "Other"])
      ]
    },
    Respiratory: {
      category: "Respiratory",
      groups: [
        cg("workBreathingInspection", "Work of Breathing / Inspection", ["No respiratory distress", "Normal chest expansion", "Accessory muscle use", "Nasal flaring", "Retractions", "Tripod positioning", "Other"]),
        cg("auscultationBreathSounds", "Auscultation / Breath Sounds", ["Clear to auscultation bilaterally (CTAB)", "Diminished breath sounds", "Wheezes", "Crackles (rales)", "Rhonchi", "Stridor", "Other"]),
        dd("percussion", "Percussion", ["Resonant", "Hyperresonant", "Dull", "Not assessed", "Other"]),
        dd("tactileFremitus", "Tactile Fremitus", ["Normal", "Decreased", "Increased", "Not assessed", "Other"]),
        cg("coughSecretions", "Cough / Secretions", ["No cough", "Dry cough", "Productive cough", "Hemoptysis", "Sputum, describe in comments", "Other"]),
        cg("oxygenSupport", "Oxygen Support", ["Room air", "Nasal cannula", "Mask / Venturi", "Non-rebreather", "BiPAP / CPAP", "Other"])
      ]
    },
    Abdomen: {
      category: "Gastrointestinal & Genitourinary",
      groups: [
        cg("abdominalInspection", "Abdominal Inspection", ["Flat", "Round", "Protuberant", "Scaphoid", "Surgical scars", "Visible pulsations", "Hernia visible", "Skin changes, such as ecchymosis or striae", "Other"]),
        dd("bowelSounds", "Auscultation / Bowel Sounds", ["Normal active bowel sounds", "Hypoactive", "Hyperactive", "Absent", "High-pitched / tinkling", "Not assessed", "Other"]),
        cg("palpationFindings", "Palpation Findings", ["Soft, non-tender", "Firm", "Guarding", "Rigidity", "Pain with palpation", "Palpable mass", "Organomegaly", "Pulsatile mass", "Other"]),
        dd("percussion", "Percussion", ["Tympanic", "Dullness in flanks", "Generalized dullness", "Normal percussion", "Not assessed", "Other"]),
        cg("tendernessRebound", "Tenderness / Rebound", ["No tenderness", "Mild tenderness", "Moderate tenderness", "Severe tenderness", "Rebound tenderness present", "Rovsing's Sign", "Murphy's sign", "McBurney's point tenderness", "CVA tenderness", "Other"]),
        cg("distensionMasses", "Distension / Masses", ["No distension", "Abdominal distension noted", "Palpable mass", "Hernia noted", "Ascites suspected", "Visible peristalsis", "Other"])
      ]
    },
    Urinary: {
      category: "Gastrointestinal & Genitourinary",
      groups: [
        cg("voidingPattern", "Voiding Pattern", ["Voiding without difficulty", "Adequate urine output", "Frequency", "Urgency", "Hesitancy", "Nocturia", "Not assessed", "Other"]),
        cg("continence", "Continence", ["Continent", "Stress incontinence", "Urge incontinence", "Functional incontinence", "Total incontinence", "Other"]),
        cg("urineOutput", "Urine Output", ["Adequate output", "Oliguria", "Anuria", "Polyuria", "Other"]),
        cg("associatedSymptoms", "Associated Symptoms", ["Dysuria", "Hematuria", "Retention", "Suprapubic pain", "Flank pain", "Other"])
      ],
      commentsLabel: "Urinary Comments"
    },
    "Rectal Exam": {
      category: "Gastrointestinal & Genitourinary",
      groups: [
        cg("perianalInspection", "Perianal Inspection", ["Normal appearance", "Erythema or excoriation", "Skin tags", "Fissures", "External hemorrhoids", "Abscess", "Fistula opening", "No abnormalities noted", "Other"]),
        dd("sphincterToneTenderness", "Sphincter Tone & Tenderness", ["Normal sphincter tone", "Decreased tone", "Increased tone", "Tender to palpation", "Not assessed", "Other"]),
        cg("palpableMassesHemorrhoids", "Palpable Masses / Hemorrhoids", ["No masses palpated", "Internal hemorrhoids", "Rectal mass palpated", "Induration", "Nodularity", "Rectal wall irregularity", "Tender mass", "Other"]),
        dd("stoolFindings", "Stool Findings", ["No stool present", "Normal brown stool", "Hematochezia present", "Melena", "Loose stool", "Hard stool", "Fecal impaction", "Other"]),
        dd("guaiac", "Guaiac Test (FOBT)", ["Not performed", "Guaiac negative", "Guaiac positive for occult blood", "Unable to complete", "Other"]),
        cg("prostateExam", "Prostate Exam, if applicable", ["Not applicable", "Prostate smooth and non-tender", "Mild enlargement", "Nodular", "Firm or hard", "Prostate tender", "Induration present", "Other"])
      ]
    },
    "External Genitalia": {
      category: "Gastrointestinal & Genitourinary",
      groups: [
        cg("genitaliaInspection", "Genitalia Inspection", ["Normal appearance", "Symmetric", "Erythema", "Swelling", "Developmentally appropriate", "Abnormal findings noted", "Not assessed", "Other"]),
        cg("skinHairFindings", "Skin & Hair Findings", ["Normal pubic hair distribution", "Rashes or lesions present", "Infestations", "Hyperpigmentation", "Scars present", "Lichenification or excoriation", "Other"]),
        cg("maleAnatomy", "Male Anatomy, if applicable", ["Not applicable", "Penis and scrotum normal", "Phimosis or paraphimosis", "Hypospadias / Epispadias", "Undescended testicle(s)", "Testicular swelling or tenderness", "Testicular torsion", "Scrotal mass", "Hydrocele / varicocele", "Circumcised / uncircumcised", "Other"]),
        cg("femaleAnatomy", "Female Anatomy, if applicable", ["Not applicable", "Normal external genitalia", "Labial edema or asymmetry", "Erythema or irritation", "Vulvar lesions present", "Hymenal abnormality", "Clitoromegaly", "Bartholin cyst/mass"]),
        cg("dischargeLesions", "Discharge / Lesions", ["No discharge", "Clear or physiologic discharge", "Purulent discharge", "Foul odor", "Ulcers or vesicles", "Warts or growths", "Other"]),
        dd("herniasMasses", "Hernias / Masses", ["No hernia or mass", "Inguinal hernia", "Femoral hernia", "Palpable mass", "Not assessed", "Other"])
      ]
    },
    "Pelvic Exam": {
      category: "Gastrointestinal & Genitourinary",
      groups: [],
      commentsLabel: "Comments"
    }
  };

  function cg(key, label, options){ return {kind:"checkbox", key, label, options}; }
  function dd(key, label, options){ return {kind:"dropdown", key, label, options}; }

  function activeVisit(p){
    p.chartFlow = p.chartFlow || {};
    p.chartFlow.visits = Array.isArray(p.chartFlow.visits) ? p.chartFlow.visits : [];
    if(!p.chartFlow.activeVisitId && p.chartFlow.visits[0]) p.chartFlow.activeVisitId = p.chartFlow.visits[0].id;
    let v = p.chartFlow.visits.find(x=>x.id === p.chartFlow.activeVisitId);
    if(!v){
      v = {
        id: uid("visit"),
        visitType: "Inpatient",
        reasonForVisit: p.chiefComplaint || p.diagnosis || "",
        startDate: new Date().toISOString().slice(0,10),
        startTime: new Date().toTimeString().slice(0,5),
        endDate: "",
        endTime: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        docs: emptyDocs()
      };
      p.chartFlow.visits.unshift(v);
      p.chartFlow.activeVisitId = v.id;
    }
    v.docs = normalizeDocs(v.docs);
    return v;
  }

  function emptyDocs(){
    return {
      admission: [], hpi: [], pmsh: [], familySocial: [], homeMeds: [], medRec: [],
      allergies: [], immunizations: [], ros: [], physicalExam: {notes:"", date:"", time:"", entries:[]},
      generic: {}
    };
  }

  function normalizeDocs(d){
    d = d || emptyDocs();
    ["admission","hpi","pmsh","familySocial","homeMeds","medRec","allergies","immunizations","ros"].forEach(k=>d[k]=Array.isArray(d[k])?d[k]:[]);
    d.physicalExam = d.physicalExam || {notes:"", date:"", time:"", entries:[]};
    d.physicalExam.entries = Array.isArray(d.physicalExam.entries) ? d.physicalExam.entries : [];
    d.generic = d.generic || {};
    return d;
  }

  function stamp(values, section, old){
    const at = new Date().toISOString();
    return {
      id: old?.id || uid("cf"),
      section,
      patientId: currentPatient().id,
      visitId: activeVisit(currentPatient()).id,
      createdAt: old?.createdAt || at,
      updatedAt: at,
      createdBy: old?.createdBy || providerName2(),
      updatedBy: providerName2(),
      history: [...(old?.history || []), {at, by: providerName2(), action: old ? "Edited" : "Created"}],
      ...values
    };
  }

  function providerName2(){
    return (typeof cloud !== "undefined" && (cloud.profile?.full_name || cloud.session?.user?.email)) || "Care team member";
  }

  function nowParts(){
    const d = new Date();
    return {date:d.toISOString().slice(0,10), time:d.toTimeString().slice(0,5)};
  }

  function fmtDateTime(e){
    if(!e) return "--";
    const raw = e.date && e.time ? `${e.date}T${e.time}` : e.updatedAt;
    if(!raw) return "--";
    try { return new Date(raw).toLocaleString([], {year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit"}); }
    catch(_) { return raw; }
  }

  function selectOptions(items, cur, blank){
    return `${blank === false ? "" : `<option value="">${esc(blank || "-- Select --")}</option>`}${items.map(x=>`<option value="${esc(x)}" ${x===cur?"selected":""}>${esc(x)}</option>`).join("")}`;
  }

  function input(label, name, value, type){
    return `<div class="form-row"><label for="cf-${esc(name)}">${esc(label)}</label><input id="cf-${esc(name)}" name="${esc(name)}" type="${esc(type || "text")}" value="${esc(value || "")}"></div>`;
  }

  function textarea(label, name, value, rows){
    return `<div class="form-row"><label for="cf-${esc(name)}">${esc(label)}</label><textarea id="cf-${esc(name)}" name="${esc(name)}" rows="${rows || 4}">${esc(value || "")}</textarea></div>`;
  }

  function select(label, name, items, value, blank){
    return `<div class="form-row"><label for="cf-${esc(name)}">${esc(label)}</label><select id="cf-${esc(name)}" name="${esc(name)}">${selectOptions(items, value, blank)}</select></div>`;
  }

  function valIn(root, name){
    return root.querySelector(`[name="${CSS.escape(name)}"]`)?.value?.trim() || "";
  }

  function checks(name, selected){
    const set = new Set(Array.isArray(selected) ? selected : []);
    return `<div class="clinical-checkbox-grid">${selectedOptions(name, set)}</div>`;
  }

  function selectedOptions(name, set){
    return (window.__cfCurrentOptions || []).map((o,i)=>`
      <label for="${esc(name)}-${i}">
        <input id="${esc(name)}-${i}" type="checkbox" data-cf-check="${esc(name)}" value="${esc(o)}" ${set.has(o) ? "checked" : ""}>
        <span>${esc(o)}</span>
      </label>`).join("");
  }

  function checkGroup(name, options, selected){
    const old = window.__cfCurrentOptions;
    window.__cfCurrentOptions = options;
    const html = checks(name, selected);
    window.__cfCurrentOptions = old;
    return html;
  }

  function collect(root, name){
    return Array.from(root.querySelectorAll(`[data-cf-check="${CSS.escape(name)}"]:checked`)).map(x=>x.value);
  }

  function openModal(title, body, onSave){
    document.querySelector(".clinical-modal-backdrop")?.remove();
    const wrap = document.createElement("div");
    wrap.className = "clinical-modal-backdrop";
    wrap.innerHTML = `<div class="clinical-modal" role="dialog" aria-modal="true" aria-labelledby="cf-modal-title">
      <div class="clinical-modal-head">
        <h3 id="cf-modal-title">${esc(title)}</h3>
        <button class="btn small" type="button" data-cf-close aria-label="Close">X</button>
      </div>
      <form>
        <div class="clinical-modal-body">${body}</div>
        <div class="clinical-modal-actions">
          <button class="btn" type="button" data-cf-close>Cancel</button>
          <button class="btn primary" type="submit">OK</button>
        </div>
      </form>
    </div>`;
    document.body.appendChild(wrap);
    const prior = document.activeElement;
    const close = () => { wrap.remove(); if(prior?.focus) prior.focus(); };
    wrap.querySelectorAll("[data-cf-close]").forEach(b=>b.addEventListener("click", close));
    wrap.addEventListener("click", e=>{ if(e.target === wrap) close(); });
    wrap.addEventListener("keydown", e=>{ if(e.key === "Escape") close(); });
    wrap.querySelector("form").addEventListener("submit", e=>{ e.preventDefault(); if(onSave(wrap)!==false) close(); });
    bindMutualExclusive(wrap);
    setTimeout(()=>wrap.querySelector("input,select,textarea,button")?.focus(), 30);
  }

  function bindMutualExclusive(root){
    root.querySelectorAll("[data-cf-check]").forEach(cb=>cb.addEventListener("change", ()=>{
      const group = cb.dataset.cfCheck;
      const all = Array.from(root.querySelectorAll(`[data-cf-check="${CSS.escape(group)}"]`));
      const v = cb.value.toLowerCase();
      const exclusive = /no relevant findings|not assessed|not visualized|none$|none observed|no edema|no rash|no wounds|no tenderness|no lymphadenopathy|no discharge|not performed|not applicable/.test(v);
      if(cb.checked && exclusive) all.forEach(x=>{ if(x!==cb) x.checked=false; });
      if(cb.checked && !exclusive) all.forEach(x=>{ if(/no relevant findings|not assessed|not visualized/.test(x.value.toLowerCase())) x.checked=false; });
    }));
  }

  function choiceModal(title, choices, onPick){
    openModal(title, `
      <div class="form-row"><label>Search</label><input data-cf-choice-search placeholder="Search"></div>
      <div class="clinical-choice-list">${choices.map(c=>`<button class="btn" type="button" data-cf-choice="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    `, ()=>false);
    const root = document.querySelector(".clinical-modal-backdrop");
    root.querySelector("[data-cf-choice-search]")?.addEventListener("input", e=>{
      const q = e.target.value.toLowerCase();
      root.querySelectorAll("[data-cf-choice]").forEach(b=>b.style.display = b.dataset.cfChoice.toLowerCase().includes(q) ? "" : "none");
    });
    root.querySelectorAll("[data-cf-choice]").forEach(b=>b.addEventListener("click", ()=>{
      const value = b.dataset.cfChoice;
      root.remove();
      onPick(value);
    }));
  }

  function empty(msg){ return `<p class="clinical-empty">${esc(msg)}</p>`; }

  function kv(label, value){
    if(Array.isArray(value)) value = value.join(", ");
    return value ? field(label, value) : "";
  }

  function rowActions(kind, i){
    return `<span style="display:flex;gap:6px;flex-wrap:wrap;">
      <button class="btn small" data-cf-edit="${esc(kind)}" data-cf-index="${i}" title="Edit">Edit</button>
      <button class="btn small danger" data-cf-delete="${esc(kind)}" data-cf-index="${i}" title="Delete">X</button>
    </span>`;
  }

  function visitStrip(){
    const v = activeVisit(currentPatient());
    return `<div class="clinical-visit-strip">
      ${field("Visit Type", v.visitType || "--")}
      ${field("Visit Start", [v.startDate, v.startTime].filter(Boolean).join(" ") || "--")}
      ${field("Reason for Visit", v.reasonForVisit || "--")}
    </div>`;
  }

  function renderPatientDetails(){
    const p = currentPatient();
    const v = activeVisit(p);
    return `${visitStrip()}${section("Patient Details", `
      <div class="grid-4">
        ${field("Patient name", `${p.lastName || ""}, ${p.firstName || ""}`)}
        ${field("Age", p.age)}
        ${field("Date of birth", p.dob)}
        ${field("Sex", p.sex)}
        ${field("MRN", p.mrn)}
        ${field("Allergies", p.allergies)}
        ${field("Visit Type", v.visitType)}
        ${field("Reason for Visit", v.reasonForVisit)}
      </div>
      <div class="actions" style="justify-content:flex-start;">
        <button class="btn primary" id="cf-edit-patient">Edit Patient Details</button>
        <button class="btn" id="cf-new-visit">New Visit</button>
      </div>
    `)}`;
  }

  function openPatientModal(){
    const p = currentPatient();
    openModal("Edit Patient Details", `
      <div class="clinical-doc-grid">
        ${input("First name", "firstName", p.firstName)}
        ${input("Last name", "lastName", p.lastName)}
        ${input("Age", "age", p.age)}
        ${input("Date of birth", "dob", p.dob)}
        ${select("Sex", "sex", ["Female", "Male", "Nonbinary", "Other"], p.sex)}
        ${input("MRN", "mrn", p.mrn)}
      </div>
      ${textarea("Allergies", "allergies", p.allergies, 3)}
    `, root=>{
      ["firstName","lastName","age","dob","sex","mrn","allergies"].forEach(k=>p[k]=valIn(root,k));
      p.updatedAt = new Date().toISOString();
      persist();
      toast("Saved Patient Data");
      render();
    });
  }

  function openVisitModal(){
    const p = currentPatient();
    const v = activeVisit(p);
    openModal("New Visit", `
      <div class="clinical-doc-grid">
        ${select("Visit Type", "visitType", VISIT_TYPES, v.visitType || "Inpatient", false)}
        ${input("Reason for Visit", "reasonForVisit", "")}
        ${input("Visit Start Date", "startDate", nowParts().date, "date")}
        ${input("Visit Start Time", "startTime", nowParts().time, "time")}
        ${input("Visit End Date", "endDate", "", "date")}
        ${input("Visit End Time", "endTime", "", "time")}
      </div>
    `, root=>{
      const visit = {
        id: uid("visit"),
        visitType: valIn(root,"visitType") || "Inpatient",
        reasonForVisit: valIn(root,"reasonForVisit"),
        startDate: valIn(root,"startDate"),
        startTime: valIn(root,"startTime"),
        endDate: valIn(root,"endDate"),
        endTime: valIn(root,"endTime"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        docs: emptyDocs()
      };
      p.chartFlow = p.chartFlow || {visits:[]};
      p.chartFlow.visits = Array.isArray(p.chartFlow.visits) ? p.chartFlow.visits : [];
      p.chartFlow.visits.unshift(visit);
      p.chartFlow.activeVisitId = visit.id;
      state.tab = "summary";
      persist();
      toast("Saved Visit Successfully");
      render();
    });
  }

  function latest(arr){ return (arr || []).slice().sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")))[0]; }

  function visitSummary(){
    const p = currentPatient();
    const v = activeVisit(p);
    const d = v.docs;
    const latestVitals = (p.vitals || []).slice(-1)[0];
    const ioTotals = (p.io || []).reduce((a,e)=>{ if(e.direction==="in") a.ins += Number(e.amount)||0; if(e.direction==="out") a.outs += Number(e.amount)||0; return a; }, {ins:0, outs:0});
    const sections = [
      section("Patient Details", `<div class="grid-4">${kv("Patient name", `${p.lastName}, ${p.firstName}`)}${kv("Age", p.age)}${kv("Date of birth", p.dob)}${kv("Sex", p.sex)}${kv("MRN", p.mrn)}${kv("Allergies", p.allergies)}</div>`),
      section("Visit Details", `<div class="grid-4">${kv("Visit Type", v.visitType)}${kv("Visit Start", [v.startDate,v.startTime].filter(Boolean).join(" "))}${kv("Visit End", [v.endDate,v.endTime].filter(Boolean).join(" "))}${kv("Reason for Visit", v.reasonForVisit)}</div><div class="actions" style="justify-content:flex-start;"><button class="btn" id="cf-new-visit">Manage Visit</button><button class="btn danger" id="cf-end-visit">End Visit</button></div>`),
      summaryList("Admission Information", d.admission, admissionSummary, "No admission information documented."),
      summaryList("History of Present Illness", d.hpi, hpiSummary, "No HPI documented."),
      section("Notes", (p.notes||[]).length ? table(["Role","Note Type","Note"], (p.notes||[]).map(n=>`<tr><td>${esc(n.by||"")}</td><td>${esc(n.type||"")}</td><td>${lines(n.body||"")}</td></tr>`).join("")) : empty("No notes entered")),
      section("Orders", (p.orders||[]).length ? table(["Date/Time","Order","Action History"], (p.orders||[]).map(o=>`<tr><td>${esc(o.time||"")}</td><td>${esc(o.order||"")}</td><td>${esc(o.status||"")}</td></tr>`).join("")) : empty("This patient has no Orders to view.")),
      section("MAR", (p.meds||[]).length ? table(["Medication","Dose","Route","Status"], (p.meds||[]).map(m=>`<tr><td>${esc(m.name||"")}</td><td>${esc(m.dose||"")}</td><td>${esc(m.route||"")}</td><td>${esc(m.status||"")}</td></tr>`).join("")) : empty("No MAR entries to view")),
      section("Vital Signs", latestVitals ? `<div class="grid-4">${kv("Temperature", latestVitals.temp)}${kv("Heart Rate", latestVitals.hr)}${kv("Pulse Oximetry", latestVitals.spo2)}${kv("Respirations per Minute", latestVitals.rr)}${kv("Blood Pressure", latestVitals.bps&&latestVitals.bpd?`${latestVitals.bps}/${latestVitals.bpd}`:"")}${kv("Pain Scale", latestVitals.pain)}${kv("Comments", latestVitals.note)}</div>` : empty("No vital signs recorded")),
      section("Assessment", (d.generic.assessments||[]).length ? summaryBox("Assessment", latest(d.generic.assessments), Object.entries(latest(d.generic.assessments)||{}).filter(([k,v])=>!["id","section","patientId","visitId","createdAt","updatedAt","createdBy","updatedBy","history"].includes(k)&&v).map(([k,v])=>kv(label(k),v)).join("")) : (p.assessment?.narrative || Object.values(p.assessment||{}).some(Boolean) ? `<div class="grid-2">${Object.entries(p.assessment||{}).filter(([,v])=>v).map(([k,v])=>kv(label(k), v)).join("")}</div>` : empty("No assessment documented"))),
      section("Intake & Output", (p.io||[]).length ? `<div class="grid-4">${kv("Intake Total", `${ioTotals.ins} mL`)}${kv("Output Total", `${ioTotals.outs} mL`)}${kv("Balance", `${ioTotals.ins-ioTotals.outs} mL`)}</div>` : empty("No intake or output documented")),
      section("Flowsheets", empty("No flowsheets documented")),
      section("Allergies & Immunizations", `${allergySummaryBlock(d)}${immunizationSummaryBlock(d)}`),
      section("Results", (p.labs||[]).length ? table(["Date/Time","Result","Flag"], (p.labs||[]).map(l=>`<tr><td>${esc(l.time||"")}</td><td>${esc(l.test||"")} ${esc(l.result||"")}</td><td>${esc(l.flag||"")}</td></tr>`).join("")) : empty("No results to view")),
      section("Provider Documentation", providerSummary(d)),
      summaryList("Patient History", d.pmsh, pmshSummary, "No past medical or surgical history documented."),
      summaryList("Review of Systems", d.ros, rosEntrySummary, "No Review of Systems documented."),
      physicalExamSummarySection(d),
      section("Respiratory", physicalSummaryByCategory(d, "Respiratory") || empty("No respiratory documentation entered")),
      section("Obstetrics", empty("No obstetrics documentation entered")),
      section("Problem List", empty("No problem list entries documented")),
      section("SBAR", p.sbar?.s ? `<div class="grid-2">${kv("Situation",p.sbar.s)}${kv("Background",p.sbar.b)}${kv("Assessment",p.sbar.a)}${kv("Recommendation",p.sbar.r)}</div>` : empty("No SBAR documented")),
      section("Care Plan", (p.carePlan||[]).some(c=>c.dx||c.assessment) ? table(["Assessment","Diagnosis","Goal","Interventions"], (p.carePlan||[]).map(c=>`<tr><td>${lines(c.assessment||"")}</td><td>${esc(c.dx||"")}</td><td>${esc(c.goal||"")}</td><td>${esc(c.interventions||"")}</td></tr>`).join("")) : empty("No care plan documented")),
      section("Patient Forms", empty("No patient forms documented"))
    ];
    return `${visitStrip()}${sections.join("")}`;
  }

  function summaryList(title, entries, renderer, emptyMsg){
    return section(title, (entries||[]).length ? entries.map(renderer).join("") : empty(emptyMsg));
  }

  function summaryBox(title, e, body){
    return `<div class="clinical-summary-card"><strong>${esc(title)}</strong><div class="clinical-doc-subtitle">Documented: ${esc(fmtDateTime(e))}</div><div class="grid-2">${body}</div></div>`;
  }

  function admissionSummary(e){ return summaryBox("Admission Information", e, [kv("Admitting Provider", e.admittingProvider), kv("Chief Complaint", e.chiefComplaint), kv("Admission Diagnosis", e.admissionDiagnosis), kv("Secondary Medical Diagnosis", e.secondaryMedicalDiagnosis), kv("Safety & Special Precautions", e.safetySpecialPrecautions), kv("Risks & Alerts", e.risksAlerts), kv("Room / Bed #", e.roomBed), kv("Admission Comments", e.admissionComments)].join("")); }
  function hpiSummary(e){ return summaryBox("HPI", e, [kv("Signs and Symptoms", e.signsSymptoms), kv("Location", e.location), kv("Duration", e.duration), kv("Quality", e.quality), kv("Severity", e.severity), kv("HPI Comments", e.hpiComments)].join("")); }
  function pmshSummary(e){ return summaryBox("Past Medical & Surgical History", e, [kv("Medical History", e.medicalHistory), kv("Surgical History", e.surgicalHistory)].join("")); }
  function familySummary(e){ return summaryBox("Family & Social History", e, [kv("Family History", e.familyHistory), kv("Living Situation", e.livingSituation), kv("Patient feels safe at home", e.safeAtHome), kv("Safety Comments", e.safetyComments), kv("History of Abuse / Neglect", e.abuseNeglect), kv("Abuse / Neglect Comments", e.abuseNeglectComments), kv("Substance Use / Abuse", (e.substanceEntries||[]).map(substanceLine).join("\n")), kv("Social History Comments", e.socialHistoryComments)].join("")); }
  function homeSummary(e){ return summaryBox("Home Medications", e, kv("Home Medications", e.homeMedications)); }
  function providerSummary(d){ return [latest(d.admission)&&admissionSummary(latest(d.admission)), latest(d.hpi)&&hpiSummary(latest(d.hpi)), latest(d.pmsh)&&pmshSummary(latest(d.pmsh)), latest(d.familySocial)&&familySummary(latest(d.familySocial)), latest(d.homeMeds)&&homeSummary(latest(d.homeMeds))].filter(Boolean).join("") || empty("No provider documentation entered"); }

  function allergySummaryBlock(d){
    return `<div class="clinical-summary-card"><strong>Allergies</strong>${d.allergies.length ? d.allergies.map(a=>`<p>${esc(a.allergen)}${a.reaction?` - ${esc(a.reaction)}`:""}<br><span class="clinical-doc-subtitle">Status: ${esc(a.action || "")} | Documented: ${esc(fmtDateTime(a))}</span>${a.comments?`<br>${esc(a.comments)}`:""}</p>`).join("") : empty("No allergies documented.")}</div>`;
  }

  function immunizationSummaryBlock(d){
    return `<div class="clinical-summary-card"><strong>Immunizations</strong>${d.immunizations.length ? d.immunizations.map(i=>`<p>${esc(i.vaccine)}${i.status?` - ${esc(i.status)}`:""}<br><span class="clinical-doc-subtitle">Documented: ${esc(fmtDateTime(i))}</span><br>Manufacturer: ${esc(i.manufacturer||"Not entered")} | Lot #: ${esc(i.lotNumber||"Not entered")} | Expiration: ${esc(i.expirationDate||"Not entered")}${i.clinicalSite?`<br>Clinical Site: ${esc(i.clinicalSite)}`:""}${i.comments?`<br>${esc(i.comments)}`:""}</p>`).join("") : empty("No immunizations documented.")}</div>`;
  }

  function rosEntrySummary(e){
    const rows = ROS_2.map(([key, title])=>{
      const vals = e.findings?.[key] || [];
      return vals.length ? `<p><strong>${esc(title)}:</strong> ${esc(vals.join(", "))}</p>` : "";
    }).join("");
    return `<div class="clinical-summary-card"><strong>Review of Systems</strong><div class="clinical-doc-subtitle">Documented: ${esc(fmtDateTime(e))}</div>${e.notes?`<p>${lines(e.notes)}</p>`:""}${rows}</div>`;
  }

  function physicalExamSummarySection(d){
    const body = PHYS_CATEGORIES_2.map(cat=>physicalSummaryByCategory(d, cat)).filter(Boolean).join("");
    return section("Physical Exam", body || empty("No Physical Exam documented."));
  }

  function physicalSummaryByCategory(d, cat){
    const pe = d.physicalExam || {};
    const entries = (pe.entries || []).filter(e=>e.category === cat);
    if(!entries.length) return "";
    return `<div class="clinical-summary-card"><strong>${esc(cat)}</strong><div class="clinical-doc-subtitle">Documented: ${esc([pe.date, pe.time].filter(Boolean).join(" ") || fmtDateTime(entries[0]))}</div>${entries.map(e=>`<p><strong>${esc(e.type)}:</strong> ${esc(physicalSentence(e))}${e.comments?` Comment: ${esc(e.comments)}`:""}</p>`).join("")}</div>`;
  }

  function physicalSentence(e){
    const vals = [];
    (PE_CONFIG[e.type]?.groups || []).forEach(g=>{
      const v = e.fields?.[g.key];
      if(Array.isArray(v) && v.length) vals.push(`${g.label}: ${v.join(", ")}`);
      if(!Array.isArray(v) && v) vals.push(`${g.label}: ${v}`);
    });
    if(!vals.length) return "Not documented.";
    return vals.join(". ") + ".";
  }

  function label(k){ return String(k).replace(/([A-Z])/g," $1").replace(/^./, c=>c.toUpperCase()); }

  function tableEntries(entries, columns, emptyMsg, kind){
    if(!entries.length) return empty(emptyMsg);
    const rows = entries.map((e,i)=>`<tr>${columns.map(([head,key,render])=>`<td>${render?render(e):esc(e[key]||"")}</td>`).join("")}<td>${rowActions(kind, i)}</td></tr>`).join("");
    return table([...columns.map(c=>c[0]), ""], rows);
  }

  function renderAllergies(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Allergies", tableEntries(d.allergies, [
      ["Allergen", "allergen"], ["Severity or reaction", "reaction"], ["Date and time documented", "updatedAt", fmtDateTime], ["Action", "action"]
    ], "No allergies documented.", "allergy"), `<button class="btn small primary" data-cf-new="allergy">+ New Entry</button>`)}`;
  }

  function renderImmunizations(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Immunizations", tableEntries(d.immunizations, [
      ["Vaccine name", "vaccine"], ["Manufacturer", "manufacturer"], ["Lot number", "lotNumber"], ["Expiration date", "expirationDate"], ["Dose status", "status"], ["Date and time documented", "updatedAt", fmtDateTime], ["Action", "action"]
    ], "No immunizations documented.", "immunization"), `<button class="btn small primary" data-cf-new="immunization">+ New Entry</button>`)}`;
  }

  function renderProviderAdmission(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Admission Information", tableEntries(d.admission, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Admitting Provider", "admittingProvider"], ["Chief Complaint", "chiefComplaint"], ["Admission Diagnosis", "admissionDiagnosis"], ["Room / Bed #", "roomBed"]
    ], "No admission information documented.", "admission"), `<button class="btn small primary" data-cf-new="admission">+ New Entry</button>`)}`;
  }

  function renderProviderHpi(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("History of Present Illness (HPI)", tableEntries(d.hpi, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Signs and Symptoms", "signsSymptoms"], ["Location", "location"], ["Duration", "duration"], ["Severity", "severity"]
    ], "No HPI documented.", "hpi"), `<button class="btn small primary" data-cf-new="hpi">+ New Entry</button>`)}`;
  }

  function renderProviderPmsh(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Past Medical & Surgical History", tableEntries(d.pmsh, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Medical History", "medicalHistory"], ["Surgical History", "surgicalHistory"]
    ], "No past medical or surgical history documented.", "pmsh"), `<button class="btn small primary" data-cf-new="pmsh">+ New Entry</button>`)}`;
  }

  function renderProviderFamily(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Family & Social History", tableEntries(d.familySocial, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Family History", "familyHistory"], ["Living Situation", "livingSituation"], ["Feels Safe at Home", "safeAtHome"], ["Substance Use / Abuse", "substanceEntries", e=>(e.substanceEntries||[]).map(substanceLine).join("<br>")]
    ], "No family or social history documented.", "family"), `<button class="btn small primary" data-cf-new="family">+ New Entry</button>`)}`;
  }

  function substanceLine(e){
    return `${e.entryType}: ${Object.entries(e.fields || {}).filter(([,v])=>Array.isArray(v)?v.length:v).map(([k,v])=>`${label(k)} ${Array.isArray(v)?v.join(", "):v}`).join("; ")}${e.comments?`; Comments ${e.comments}`:""}`;
  }

  function renderProviderHomeMeds(){
    const d = activeVisit(currentPatient()).docs;
    const home = section("Home Medications", tableEntries(d.homeMeds, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Home Medications", "homeMedications"]
    ], "No home medications documented.", "home"), `<button class="btn small primary" data-cf-new="home">+ New Entry</button>`);
    const medRec = section("Medication Reconciliation", tableEntries(d.medRec, [
      ["Medication & Concentration", "medicationConcentration"], ["Indication", "indication"], ["Dose", "dose"], ["Route", "route"], ["Frequency & Time", "frequencyTime"], ["Currently Taking", "currentlyTaking"], ["Last Taken", "lastTaken"]
    ], "No medication reconciliation entries documented.", "medrec"), `<button class="btn small primary" data-cf-new="medrec">+ New Entry</button>`);
    return `${visitStrip()}${home}${medRec}`;
  }

  function renderProviderRos(){
    const d = activeVisit(currentPatient()).docs;
    return `${visitStrip()}${section("Review of Systems", tableEntries(d.ros, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Review of Systems: Notes", "notes"], ["Findings", "findings", e=>Object.entries(e.findings||{}).filter(([,v])=>v?.length).map(([k,v])=>`${label(k)}: ${v.join(", ")}`).join("<br>")]
    ], "No Review of Systems documented.", "ros"), `<button class="btn small primary" data-cf-new="ros">+ New Entry</button>`)}`;
  }

  function renderProviderPhysical(){
    const d = activeVisit(currentPatient()).docs;
    const pe = d.physicalExam;
    const rows = PHYS_CATEGORIES_2.map(cat=>{
      const entries = (pe.entries || []).filter(e=>e.category === cat);
      const body = entries.length ? entries.map((e,i)=>{
        const actual = pe.entries.indexOf(e);
        return `<div class="clinical-subentry">
          <div class="clinical-doc-entry-head"><span class="clinical-subentry-title">${esc(e.type)}</span>${rowActions("physical", actual)}</div>
          <div class="grid-2">${(PE_CONFIG[e.type]?.groups || []).map(g=>kv(g.label, e.fields?.[g.key])).join("")}${kv("Comments", e.comments)}</div>
        </div>`;
      }).join("") : `<span class="clinical-empty">Not documented</span>`;
      return `<div class="clinical-physical-row">
        <div class="clinical-physical-row-head">
          <button class="clinical-plus" data-cf-physical-add="${esc(cat)}" title="Add ${esc(cat)}">+</button>
          <strong>${esc(cat)}</strong>
          <div>${body}</div>
        </div>
      </div>`;
    }).join("");
    return `${visitStrip()}${section("Physical Exam", `
      <div class="clinical-doc-grid">${input("Date", "physicalDate", pe.date || nowParts().date, "date")}${input("Time", "physicalTime", pe.time || nowParts().time, "time")}</div>
      ${textarea("Physical Exam Notes", "physicalNotes", pe.notes, 5)}
      ${rows}
      <div class="clinical-floating-save"><button class="btn primary" id="cf-save-physical">Save Physical Exam</button></div>
    `)}`;
  }

  function renderGeneric(tab, title, emptyMsg){
    const d = activeVisit(currentPatient()).docs;
    const arr = d.generic[tab] = Array.isArray(d.generic[tab]) ? d.generic[tab] : [];
    return `${visitStrip()}${section(title, tableEntries(arr, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Entry", "title"], ["Comments", "comments"]
    ], emptyMsg, `generic:${tab}`), `<button class="btn small primary" data-cf-new-generic="${esc(tab)}" data-cf-title="${esc(title)}">+ New Entry</button>`)}`;
  }

  function renderCfVitals(){
    const p = currentPatient();
    const rows = (p.vitals || []).map((v,i)=>`<tr>
      <td>${esc(fmtDateTime(v))}</td><td>${esc(v.temperature || v.temp || "")}</td><td>${esc(v.heartRate || v.hr || "")}</td><td>${esc(v.pulseOximetry || v.spo2 || "")}</td><td>${esc(v.bloodPressure || (v.bps&&v.bpd?`${v.bps}/${v.bpd}`:""))}</td><td>${esc(v.painScale || v.pain || "")}</td><td>${rowActions("cfvital", i)}</td>
    </tr>`).join("") || `<tr><td colspan="7" style="color:var(--subtle);">No vital signs recorded.</td></tr>`;
    return `${visitStrip()}${section("Vital Signs", table(["Date/Time","Temperature","Heart Rate","Pulse Oximetry","Blood Pressure","Pain Scale",""], rows), `<button class="btn small primary" data-cf-new="cfvital">+ New Entry</button>`)}`;
  }

  function renderCfAssessment(){
    const p = currentPatient();
    const arr = activeVisit(p).docs.generic.assessments = Array.isArray(activeVisit(p).docs.generic.assessments) ? activeVisit(p).docs.generic.assessments : [];
    return `${visitStrip()}${section("Assessment", tableEntries(arr, [
      ["Date/Time", "updatedAt", fmtDateTime], ["Level of Consciousness", "levelOfConsciousness"], ["Head", "head"], ["Respirations", "respirations"], ["Fall Risk", "fallRisk"]
    ], "No assessment documented.", "cfassessment"), `<button class="btn small primary" data-cf-new="cfassessment">+ New Entry</button>`)}`;
  }

  function renderCfIO(){
    const p = currentPatient();
    const rows = (p.io || []).map((e,i)=>`<tr><td>${esc(fmtDateTime(e))}</td><td>${esc(e.direction||"")}</td><td>${esc(e.type||"")}</td><td>${esc(e.amount||"")}</td><td>${esc(e.note||e.comments||"")}</td><td>${rowActions("cfio", i)}</td></tr>`).join("") || `<tr><td colspan="6" style="color:var(--subtle);">No intake or output documented.</td></tr>`;
    return `${visitStrip()}${section("Intake & Output", table(["Date/Time","Direction","Type","Amount","Comments",""], rows), `<button class="btn small primary" data-cf-new="cfio">+ New Entry</button>`)}`;
  }

  function openAllergy2(index){
    const p = currentPatient(), d = activeVisit(p).docs, cur = index >= 0 ? d.allergies[index] : {};
    openModal(index >= 0 ? "Edit Allergy" : "New Allergy", `
      ${input("Allergen", "allergen", cur.allergen)}
      ${input("Reaction", "reaction", cur.reaction)}
      ${textarea("Comments", "comments", cur.comments, 3)}
      ${select("Action", "action", ALLERGY_ACTIONS_2, cur.action || "Allergen Added", false)}
    `, root=>{
      const allergen = valIn(root,"allergen");
      if(!allergen){ toast("Allergen required"); return false; }
      d.allergies[index >= 0 ? index : d.allergies.length] = stamp({allergen, reaction:valIn(root,"reaction"), comments:valIn(root,"comments"), action:valIn(root,"action") || "Allergen Added"}, "Allergies", cur);
      p.allergies = d.allergies.length ? d.allergies.map(a=>[a.allergen,a.reaction].filter(Boolean).join(" - ")).join("; ") : "NKDA";
      saveClinical("Saved Patient Data");
    });
  }

  function openVaccineChoice(index){
    if(index >= 0) return openImmunization2(index);
    choiceModal("Select Vaccine", VACCINE_CHOICES, vaccine=>openImmunization2(-1, vaccine));
  }

  function openImmunization2(index, vaccine){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.immunizations[index] : {vaccine};
    openModal(index >= 0 ? "Edit Immunization" : "Vaccine Details", `
      <div class="clinical-doc-grid">
        ${input("Vaccine", "vaccine", cur.vaccine)}
        ${select("Dose status", "status", VACCINE_ACTIONS, cur.status || "Given")}
        ${input("Date", "date", cur.date || nowParts().date, "date")}
        ${input("Time", "time", cur.time || nowParts().time, "time")}
        ${input("Manufacturer", "manufacturer", cur.manufacturer)}
        ${input("Lot Number", "lotNumber", cur.lotNumber)}
        ${input("Expiration Date", "expirationDate", cur.expirationDate, "date")}
        ${input("Clinical Site", "clinicalSite", cur.clinicalSite)}
      </div>
      ${textarea("Comments", "comments", cur.comments, 3)}
      ${select("Action", "action", VACCINE_ACTIONS, cur.action || cur.status || "Given")}
    `, root=>{
      const entry = {};
      ["vaccine","status","date","time","manufacturer","lotNumber","expirationDate","clinicalSite","comments","action"].forEach(k=>entry[k]=valIn(root,k));
      if(!entry.vaccine){ toast("Vaccine required"); return false; }
      d.immunizations[index >= 0 ? index : d.immunizations.length] = stamp(entry, "Immunizations", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openAdmission(index){
    const d = activeVisit(currentPatient()).docs, p = currentPatient(), cur = index >= 0 ? d.admission[index] : {};
    openModal(index >= 0 ? "Edit Admission Information" : "Admission Information", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}${input("Admitting Provider", "admittingProvider", cur.admittingProvider || p.attending)}${input("Room / Bed #", "roomBed", cur.roomBed || p.location)}</div>
      ${textarea("Chief Complaint", "chiefComplaint", cur.chiefComplaint || p.chiefComplaint, 3)}
      ${textarea("Admission Diagnosis", "admissionDiagnosis", cur.admissionDiagnosis || p.diagnosis, 3)}
      <div class="clinical-doc-grid">${select("Secondary Medical Diagnosis", "secondaryMedicalDiagnosis", SECONDARY_DX_2, cur.secondaryMedicalDiagnosis)}${select("Safety & Special Precautions", "safetySpecialPrecautions", PRECAUTIONS_2, cur.safetySpecialPrecautions)}${select("Risks & Alerts", "risksAlerts", RISKS_2, cur.risksAlerts)}</div>
      ${textarea("Admission Comments", "admissionComments", cur.admissionComments, 4)}
    `, root=>{
      const entry = {};
      ["date","time","admittingProvider","roomBed","chiefComplaint","admissionDiagnosis","secondaryMedicalDiagnosis","safetySpecialPrecautions","risksAlerts","admissionComments"].forEach(k=>entry[k]=valIn(root,k));
      d.admission[index >= 0 ? index : d.admission.length] = stamp(entry, "Admission Information", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openHpi(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.hpi[index] : {};
    openModal(index >= 0 ? "Edit HPI" : "History of Present Illness", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}${input("Location", "location", cur.location)}${input("Duration", "duration", cur.duration)}${input("Quality", "quality", cur.quality)}${input("Severity", "severity", cur.severity)}</div>
      ${textarea("Signs and Symptoms", "signsSymptoms", cur.signsSymptoms, 4)}
      ${textarea("HPI Comments", "hpiComments", cur.hpiComments, 4)}
    `, root=>{
      const entry = {};
      ["date","time","location","duration","quality","severity","signsSymptoms","hpiComments"].forEach(k=>entry[k]=valIn(root,k));
      d.hpi[index >= 0 ? index : d.hpi.length] = stamp(entry, "HPI", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openPmsh(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.pmsh[index] : {};
    openModal(index >= 0 ? "Edit Past Medical & Surgical History" : "Past Medical & Surgical History", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}</div>
      ${textarea("Medical History", "medicalHistory", cur.medicalHistory, 5)}
      ${textarea("Surgical History", "surgicalHistory", cur.surgicalHistory, 5)}
    `, root=>{
      const entry = {date:valIn(root,"date"), time:valIn(root,"time"), medicalHistory:valIn(root,"medicalHistory"), surgicalHistory:valIn(root,"surgicalHistory")};
      d.pmsh[index >= 0 ? index : d.pmsh.length] = stamp(entry, "Past Medical & Surgical History", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openFamily(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.familySocial[index] : {substanceEntries:[]};
    openModal(index >= 0 ? "Edit Family & Social History" : "Family & Social History", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}${select("Living Situation", "livingSituation", LIVING_2, cur.livingSituation)}${select("Does Patient Feel Safe at Home?", "safeAtHome", ["Yes","No"], cur.safeAtHome)}${select("History of Abuse / Neglect", "abuseNeglect", ABUSE_2, cur.abuseNeglect)}</div>
      ${textarea("Family History", "familyHistory", cur.familyHistory, 4)}
      ${textarea("Safety Comments", "safetyComments", cur.safetyComments, 3)}
      ${textarea("Abuse / Neglect Comments", "abuseNeglectComments", cur.abuseNeglectComments, 3)}
      <div class="clinical-group"><h4>Substance Use / Abuse</h4><button class="btn small primary" type="button" data-cf-add-substance>+ Substance Use / Abuse</button><div data-cf-substance-preview>${(cur.substanceEntries||[]).map(substanceLine).map(esc).join("<br>")}</div></div>
      ${textarea("Social History Comments", "socialHistoryComments", cur.socialHistoryComments, 4)}
    `, root=>{
      const existing = root.__substanceEntries || cur.substanceEntries || [];
      const entry = {};
      ["date","time","livingSituation","safeAtHome","abuseNeglect","familyHistory","safetyComments","abuseNeglectComments","socialHistoryComments"].forEach(k=>entry[k]=valIn(root,k));
      entry.substanceEntries = existing;
      d.familySocial[index >= 0 ? index : d.familySocial.length] = stamp(entry, "Family & Social History", cur);
      saveClinical("Saved Patient Data");
    });
    const root = document.querySelector(".clinical-modal-backdrop");
    root.__substanceEntries = (cur.substanceEntries || []).slice();
    root.querySelector("[data-cf-add-substance]")?.addEventListener("click", ()=>choiceModal("Select Substance Use / Abuse", ["Substance Use / Abuse", "Alcohol Abuse", "Tobacco Abuse"], type=>openSubstanceFor(root, type)));
  }

  function openSubstanceFor(parent, type){
    const body = substanceBody(type, {});
    openModal(type, body, root=>{
      parent.__substanceEntries = parent.__substanceEntries || [];
      parent.__substanceEntries.push({entryType:type, fields:collectSubstance(root,type), comments:valIn(root,"comments")});
      const preview = parent.querySelector("[data-cf-substance-preview]");
      if(preview) preview.innerHTML = parent.__substanceEntries.map(substanceLine).map(esc).join("<br>");
    });
  }

  function substanceBody(type, f){
    if(type === "Tobacco Abuse") return `<div class="clinical-doc-grid">${select("Smoking", "smoking", ["Never","Former","Every Day","Some Days","Unknown"], f.smoking)}${select("Passive Exposure", "passiveExposure", ["Never","Past","Current"], f.passiveExposure)}${select("Smokeless", "smokeless", ["Never","Former","Current","Unknown"], f.smokeless)}${input("Quit Date", "quitDate", f.quitDate, "date")}${input("Cessation", "cessation", f.cessation)}</div><div class="clinical-group"><h4>Types</h4>${checkGroup("types", ["Chew","Snuff"], f.types)}</div>${textarea("Comments", "comments", f.comments, 3)}`;
    if(type === "Alcohol Abuse") return `${input("Alcohol Amount", "alcoholAmount", f.alcoholAmount)}${textarea("Comments", "comments", f.comments, 3)}`;
    return `<div class="clinical-doc-grid">${select("Alcohol", "alcohol", YES_NO_UNKNOWN, f.alcohol)}${input("Alcohol Amount", "alcoholAmount", f.alcoholAmount)}${select("Cigarettes / Cigars", "cigarettesCigars", YES_NO_UNKNOWN, f.cigarettesCigars)}${input("How many packs per day?", "packsPerDay", f.packsPerDay)}${select("Chewing Tobacco", "chewingTobacco", YES_NO_UNKNOWN, f.chewingTobacco)}${select("Vaping", "vaping", YES_NO_UNKNOWN, f.vaping)}${select("Marijuana", "marijuana", YES_NO_UNKNOWN, f.marijuana)}${select("Illicit Drugs", "illicitDrugs", YES_NO_UNKNOWN, f.illicitDrugs)}</div>${textarea("Comments", "comments", f.comments, 3)}`;
  }

  function collectSubstance(root,type){
    const out = {};
    if(type === "Tobacco Abuse"){ ["smoking","passiveExposure","smokeless","quitDate","cessation"].forEach(k=>out[k]=valIn(root,k)); out.types=collect(root,"types"); }
    else if(type === "Alcohol Abuse"){ out.alcoholAmount=valIn(root,"alcoholAmount"); }
    else ["alcohol","alcoholAmount","cigarettesCigars","packsPerDay","chewingTobacco","vaping","marijuana","illicitDrugs"].forEach(k=>out[k]=valIn(root,k));
    return out;
  }

  function openHome(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.homeMeds[index] : {};
    openModal(index >= 0 ? "Edit Home Medications" : "Home Medications", `<div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}</div>${textarea("Home Medications", "homeMedications", cur.homeMedications, 5)}`, root=>{
      d.homeMeds[index >= 0 ? index : d.homeMeds.length] = stamp({date:valIn(root,"date"), time:valIn(root,"time"), homeMedications:valIn(root,"homeMedications")}, "Home Medications", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openMedRec2(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.medRec[index] : {};
    openModal(index >= 0 ? "Edit Medication Reconciliation" : "Medication Reconciliation", `<div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}${input("Medication & Concentration", "medicationConcentration", cur.medicationConcentration)}${input("Indication", "indication", cur.indication)}${input("Dose", "dose", cur.dose)}${select("Route", "route", ROUTES, cur.route)}${input("Frequency & Time", "frequencyTime", cur.frequencyTime)}${select("Currently Taking", "currentlyTaking", YES_NO_UNKNOWN, cur.currentlyTaking)}${input("Last Taken", "lastTaken", cur.lastTaken)}</div>`, root=>{
      const entry = {};
      ["date","time","medicationConcentration","indication","dose","route","frequencyTime","currentlyTaking","lastTaken"].forEach(k=>entry[k]=valIn(root,k));
      d.medRec[index >= 0 ? index : d.medRec.length] = stamp(entry, "Medication Reconciliation", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function openCfVital(index){
    const p = currentPatient(), cur = index >= 0 ? p.vitals[index] : {};
    openModal(index >= 0 ? "Edit Vital Signs" : "Vital Signs", `
      <div class="clinical-doc-grid">
        ${input("Date", "date", cur.date || nowParts().date, "date")}
        ${input("Time", "time", cur.time || nowParts().time, "time")}
        ${input("Temperature", "temperature", cur.temperature || cur.temp)}
        ${input("Temperature Source", "temperatureSource", cur.temperatureSource)}
        ${input("Heart Rate", "heartRate", cur.heartRate || cur.hr)}
        ${input("Pulse Oximetry", "pulseOximetry", cur.pulseOximetry || cur.spo2)}
        ${input("Oxygen Method", "oxygenMethod", cur.oxygenMethod)}
        ${input("Respirations per Minute", "respirationsPerMinute", cur.respirationsPerMinute || cur.rr)}
        ${input("Blood Pressure", "bloodPressure", cur.bloodPressure || (cur.bps&&cur.bpd?`${cur.bps}/${cur.bpd}`:""))}
        ${input("BP Location", "bpLocation", cur.bpLocation)}
        ${input("Orthostatic Blood Pressure", "orthostaticBloodPressure", cur.orthostaticBloodPressure)}
        ${input("Pain Scale", "painScale", cur.painScale || cur.pain)}
        ${input("Weight", "weight", cur.weight)}
        ${input("Height", "height", cur.height)}
      </div>
      ${textarea("Vital Sign Comments", "comments", cur.comments || cur.note, 3)}
    `, root=>{
      const entry = {};
      ["date","time","temperature","temperatureSource","heartRate","pulseOximetry","oxygenMethod","respirationsPerMinute","bloodPressure","bpLocation","orthostaticBloodPressure","painScale","weight","height","comments"].forEach(k=>entry[k]=valIn(root,k));
      entry.temp = entry.temperature;
      entry.hr = entry.heartRate;
      entry.spo2 = entry.pulseOximetry;
      entry.rr = entry.respirationsPerMinute;
      const bp = entry.bloodPressure.split("/");
      entry.bps = bp[0] || "";
      entry.bpd = bp[1] || "";
      entry.pain = entry.painScale;
      entry.note = entry.comments;
      p.vitals[index >= 0 ? index : p.vitals.length] = stamp(entry, "Vital Signs", cur);
      saveClinical("Saved Vital Signs");
    });
  }

  function openCfAssessment(index){
    const d = activeVisit(currentPatient()).docs;
    const arr = d.generic.assessments = Array.isArray(d.generic.assessments) ? d.generic.assessments : [];
    const cur = index >= 0 ? arr[index] : {};
    const fields = ["Level of Consciousness","Head","Eyes","Ears","Nose","Mouth","Throat","Neck","Skin / Mucous Membranes","Respirations","Lung Sounds","Heart Sounds & Rhythms","Edema","Capillary Refill","Pulses","Gastrointestinal","Genitourinary","Urine Characteristics","Musculoskeletal","Psychosocial","Fall Risk"];
    openModal(index >= 0 ? "Edit Assessment" : "Assessment", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}</div>
      ${fields.map(f=>input(f, keyFor(f), cur[keyFor(f)])).join("")}
      ${textarea("Assessment Comments", "assessmentComments", cur.assessmentComments, 4)}
    `, root=>{
      const entry = {date:valIn(root,"date"), time:valIn(root,"time")};
      fields.forEach(f=>entry[keyFor(f)] = valIn(root, keyFor(f)));
      entry.assessmentComments = valIn(root,"assessmentComments");
      arr[index >= 0 ? index : arr.length] = stamp(entry, "Assessment", cur);
      currentPatient().assessment = {...(currentPatient().assessment||{}), narrative: entry.assessmentComments, neuro: entry.levelOfConsciousness, resp: entry.respirations, cardiac: entry.heartSoundsRhythms, skin: entry.skinMucousMembranes, safety: entry.fallRisk};
      saveClinical("Saved Assessment");
    });
  }

  function openCfIO(index){
    const p = currentPatient(), cur = index >= 0 ? p.io[index] : {};
    openModal(index >= 0 ? "Edit Intake & Output" : "Intake & Output", `
      <div class="clinical-doc-grid">
        ${input("Date", "date", cur.date || nowParts().date, "date")}
        ${input("Time", "time", cur.time || nowParts().time, "time")}
        ${input("Percent of Meal Eaten", "percentMealEaten", cur.percentMealEaten)}
        ${input("Oral Fluids", "oralFluids", cur.oralFluids)}
        ${input("IV Fluids", "ivFluids", cur.ivFluids)}
        ${input("Enteral Feeds", "enteralFeeds", cur.enteralFeeds)}
        ${input("Urine", "urine", cur.urine)}
        ${input("Indwelling Catheter", "indwellingCatheter", cur.indwellingCatheter)}
        ${input("Other Urine", "otherUrine", cur.otherUrine)}
        ${input("Stool", "stool", cur.stool)}
        ${input("Emesis", "emesis", cur.emesis)}
        ${input("Naso / Orogastric Tube", "nasoOrogastricTube", cur.nasoOrogastricTube)}
        ${input("Ostomy", "ostomy", cur.ostomy)}
        ${input("Drain", "drain", cur.drain)}
        ${input("Other", "other", cur.other)}
      </div>
      ${textarea("Intake Comments", "intakeComments", cur.intakeComments, 3)}
      ${textarea("Output Comments", "outputComments", cur.outputComments, 3)}
    `, root=>{
      const entry = {};
      ["date","time","percentMealEaten","oralFluids","ivFluids","enteralFeeds","urine","indwellingCatheter","otherUrine","stool","emesis","nasoOrogastricTube","ostomy","drain","other","intakeComments","outputComments"].forEach(k=>entry[k]=valIn(root,k));
      const intake = ["oralFluids","ivFluids","enteralFeeds"].reduce((n,k)=>n+(Number(entry[k])||0),0);
      const output = ["urine","indwellingCatheter","otherUrine","stool","emesis","nasoOrogastricTube","ostomy","drain","other"].reduce((n,k)=>n+(Number(entry[k])||0),0);
      entry.intakeTotal = intake;
      entry.outputTotal = output;
      entry.balance = intake - output;
      entry.direction = "flowsheet";
      entry.type = "I/O";
      entry.amount = entry.balance;
      entry.note = `Intake ${intake} mL; Output ${output} mL; Balance ${entry.balance} mL`;
      p.io[index >= 0 ? index : p.io.length] = stamp(entry, "Intake & Output", cur);
      saveClinical("Saved Intake & Output");
    });
  }

  function keyFor(labelText){
    return labelText.replace(/[^A-Za-z0-9]+(.)/g, (_,c)=>c.toUpperCase()).replace(/[^A-Za-z0-9]/g,"").replace(/^./, c=>c.toLowerCase());
  }

  function openRos(index){
    const d = activeVisit(currentPatient()).docs, cur = index >= 0 ? d.ros[index] : {findings:{}};
    openModal(index >= 0 ? "Edit Review of Systems" : "Review of Systems", `
      <div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}</div>
      ${textarea("Review of Systems: Notes", "notes", cur.notes, 4)}
      ${ROS_2.map(([key,title,options])=>`<div class="clinical-group"><h4>${esc(title)}</h4>${checkGroup(`ros-${key}`, options, cur.findings?.[key])}</div>`).join("")}
    `, root=>{
      const entry = {date:valIn(root,"date"), time:valIn(root,"time"), notes:valIn(root,"notes"), findings:{}};
      ROS_2.forEach(([key])=>entry.findings[key]=collect(root, `ros-${key}`));
      d.ros[index >= 0 ? index : d.ros.length] = stamp(entry, "Review of Systems", cur);
      saveClinical("Saved Patient Data");
    });
  }

  function addPhysical(category){
    if(category === "General Survey") return choiceModal("Select General Survey", ["General Survey"], ()=>openPhysicalDetail(-1, "General Survey", "General Survey"));
    if(category === "HEENT & Neck") return choiceModal("Select HEENT & Neck", ["Nose","Neck","Throat","Eyes","Head","Ears"], type=>openPhysicalDetail(-1, "HEENT & Neck", type));
    if(category === "Gastrointestinal & Genitourinary") return choiceModal("Select Gastrointestinal & Genitourinary", ["Urinary","Rectal Exam","External Genitalia","Abdomen","Pelvic Exam"], type=>openPhysicalDetail(-1, "Gastrointestinal & Genitourinary", type));
    if(category === "Cardiopulmonary") return openPhysicalDetail(-1, "Cardiopulmonary", "Cardiovascular");
    if(category === "Respiratory") return openPhysicalDetail(-1, "Respiratory", "Respiratory");
    if(category === "Skin") return openPhysicalDetail(-1, "Skin", "Skin");
    return openPhysicalDetail(-1, category, category);
  }

  function openPhysicalDetail(index, category, type){
    const d = activeVisit(currentPatient()).docs;
    const pe = d.physicalExam;
    const cur = index >= 0 ? pe.entries[index] : {category, type, fields:{}, comments:""};
    const config = PE_CONFIG[type] || {category, type, groups:[], commentsLabel:"Comments"};
    const body = `<div class="clinical-structured-modal">
      <div class="clinical-modal-label">${esc(type)}</div>
      <div>
        ${config.groups?.length ? config.groups.map(g=>groupInput(g, cur.fields?.[g.key])).join("") : textarea(`${type} Comments`, "commentsOnly", cur.comments, 6)}
        ${textarea(config.commentsLabel || "Comments", "comments", cur.comments, 4)}
      </div>
    </div>`;
    openModal(index >= 0 ? `Edit ${type}` : type, body, root=>{
      const next = stamp({category:config.category || category, type, fields:{}, comments:valIn(root,"comments") || valIn(root,"commentsOnly")}, "Physical Exam", cur);
      (config.groups || []).forEach(g=>next.fields[g.key] = g.kind === "dropdown" ? valIn(root, g.key) : collect(root, `pe-${g.key}`));
      pe.entries[index >= 0 ? index : pe.entries.length] = next;
      saveClinical("Saved Patient Data");
    });
  }

  function groupInput(g, value){
    if(g.kind === "dropdown") return select(g.label, g.key, g.options, value);
    return `<div class="clinical-group"><h4>${esc(g.label)}</h4>${checkGroup(`pe-${g.key}`, g.options, value)}</div>`;
  }

  function openGeneric(tab, title, index){
    const d = activeVisit(currentPatient()).docs;
    const arr = d.generic[tab] = Array.isArray(d.generic[tab]) ? d.generic[tab] : [];
    const cur = index >= 0 ? arr[index] : {};
    openModal(index >= 0 ? `Edit ${title}` : title, `<div class="clinical-doc-grid">${input("Date", "date", cur.date || nowParts().date, "date")}${input("Time", "time", cur.time || nowParts().time, "time")}${input("Entry", "title", cur.title)}</div>${textarea("Comments", "comments", cur.comments, 5)}`, root=>{
      arr[index >= 0 ? index : arr.length] = stamp({date:valIn(root,"date"), time:valIn(root,"time"), title:valIn(root,"title"), comments:valIn(root,"comments")}, title, cur);
      saveClinical(`Saved ${title}`);
    });
  }

  function savePhysicalHeader(){
    const d = activeVisit(currentPatient()).docs;
    d.physicalExam.date = document.getElementById("cf-physicalDate")?.value || d.physicalExam.date;
    d.physicalExam.time = document.getElementById("cf-physicalTime")?.value || d.physicalExam.time;
    d.physicalExam.notes = document.getElementById("cf-physicalNotes")?.value || "";
    d.physicalExam.updatedAt = new Date().toISOString();
    saveClinical("Saved Physical Exam");
  }

  function saveClinical(message){
    activeVisit(currentPatient()).updatedAt = new Date().toISOString();
    persist();
    toast(message || "Saved Patient Data");
    render();
  }

  function deleteEntry(kind, index){
    const p = currentPatient(), d = activeVisit(p).docs;
    if(!confirm("Delete this entry?")) return;
    if(kind === "allergy"){ d.allergies.splice(index,1); p.allergies = d.allergies.length ? d.allergies.map(a=>[a.allergen,a.reaction].filter(Boolean).join(" - ")).join("; ") : "NKDA"; }
    else if(kind === "immunization") d.immunizations.splice(index,1);
    else if(kind === "admission") d.admission.splice(index,1);
    else if(kind === "hpi") d.hpi.splice(index,1);
    else if(kind === "pmsh") d.pmsh.splice(index,1);
    else if(kind === "family") d.familySocial.splice(index,1);
    else if(kind === "home") d.homeMeds.splice(index,1);
    else if(kind === "medrec") d.medRec.splice(index,1);
    else if(kind === "ros") d.ros.splice(index,1);
    else if(kind === "physical") d.physicalExam.entries.splice(index,1);
    else if(kind === "cfvital") currentPatient().vitals.splice(index,1);
    else if(kind === "cfassessment") d.generic.assessments.splice(index,1);
    else if(kind === "cfio") currentPatient().io.splice(index,1);
    else if(kind.startsWith("generic:")) d.generic[kind.split(":")[1]].splice(index,1);
    saveClinical("Entry deleted");
  }

  function editEntry(kind, index){
    if(kind === "allergy") return openAllergy2(index);
    if(kind === "immunization") return openImmunization2(index);
    if(kind === "admission") return openAdmission(index);
    if(kind === "hpi") return openHpi(index);
    if(kind === "pmsh") return openPmsh(index);
    if(kind === "family") return openFamily(index);
    if(kind === "home") return openHome(index);
    if(kind === "medrec") return openMedRec2(index);
    if(kind === "ros") return openRos(index);
    if(kind === "physical"){
      const e = activeVisit(currentPatient()).docs.physicalExam.entries[index];
      return openPhysicalDetail(index, e.category, e.type);
    }
    if(kind === "cfvital") return openCfVital(index);
    if(kind === "cfassessment") return openCfAssessment(index);
    if(kind === "cfio") return openCfIO(index);
    if(kind.startsWith("generic:")){
      const tab = kind.split(":")[1];
      return openGeneric(tab, genericTitle(tab), index);
    }
  }

  function genericTitle(tab){
    return ({
      flowsheets:"Flowsheets", screenings:"Screenings & Scales", respiratory:"Respiratory",
      obstetrics:"Obstetrics", problemlist:"Problem List", patienthistory:"Patient History",
      forms:"Patient Forms", roys:"Roy's Adaptation Model", results:"Results"
    })[tab] || "Entry";
  }

  function bindChartFlow(){
    document.getElementById("cf-edit-patient")?.addEventListener("click", openPatientModal);
    document.getElementById("cf-new-visit")?.addEventListener("click", openVisitModal);
    document.getElementById("cf-end-visit")?.addEventListener("click", ()=>{
      const v = activeVisit(currentPatient());
      v.endDate = nowParts().date;
      v.endTime = nowParts().time;
      saveClinical("Saved Visit Successfully");
    });
    document.querySelectorAll("[data-cf-new]").forEach(b=>b.addEventListener("click", ()=>{
      const k = b.dataset.cfNew;
      if(k==="allergy") openAllergy2(-1);
      if(k==="immunization") openVaccineChoice(-1);
      if(k==="admission") openAdmission(-1);
      if(k==="hpi") openHpi(-1);
      if(k==="pmsh") openPmsh(-1);
      if(k==="family") openFamily(-1);
      if(k==="home") openHome(-1);
      if(k==="medrec") openMedRec2(-1);
      if(k==="ros") openRos(-1);
      if(k==="cfvital") openCfVital(-1);
      if(k==="cfassessment") openCfAssessment(-1);
      if(k==="cfio") openCfIO(-1);
    }));
    document.querySelectorAll("[data-cf-new-generic]").forEach(b=>b.addEventListener("click", ()=>openGeneric(b.dataset.cfNewGeneric, b.dataset.cfTitle, -1)));
    document.querySelectorAll("[data-cf-edit]").forEach(b=>b.addEventListener("click", ()=>editEntry(b.dataset.cfEdit, Number(b.dataset.cfIndex))));
    document.querySelectorAll("[data-cf-delete]").forEach(b=>b.addEventListener("click", ()=>deleteEntry(b.dataset.cfDelete, Number(b.dataset.cfIndex))));
    document.querySelectorAll("[data-cf-physical-add]").forEach(b=>b.addEventListener("click", ()=>addPhysical(b.dataset.cfPhysicalAdd)));
    document.getElementById("cf-save-physical")?.addEventListener("click", savePhysicalHeader);
  }

  const previousTabTitle = window.tabTitle || tabTitle;
  const previousRenderTab = window.renderTab || renderTab;
  const previousBindTabs = window.bindTabEvents || bindTabEvents;

  const chartFlowTabs = {
    patientdetails: "Patient Details",
    summary: "Visit Summary",
    "ai-allergies": "Allergies",
    "ai-immunizations": "Immunizations",
    "provider-admission": "Admission Information",
    "provider-hpi": "History of Present Illness (HPI)",
    "provider-pmsh": "Past Medical & Surgical History",
    "provider-family": "Family & Social History",
    "provider-home": "Home Medications",
    "provider-ros": "Review of Systems",
    "provider-physical": "Physical Exam",
    flowsheets: "Flowsheets",
    screenings: "Screenings & Scales",
    respiratory: "Respiratory",
    obstetrics: "Obstetrics",
    problemlist: "Problem List",
    patienthistory: "Patient History",
    forms: "Patient Forms",
    roys: "Roy's Adaptation Model"
  };

  window.tabTitle = function(){
    return chartFlowTabs[state.tab] || previousTabTitle();
  };

  window.renderTab = function(){
    if(state.tab === "patientdetails") return renderPatientDetails();
    if(state.tab === "summary") return visitSummary();
    if(state.tab === "ai-allergies") return renderAllergies();
    if(state.tab === "ai-immunizations") return renderImmunizations();
    if(state.tab === "provider-admission") return renderProviderAdmission();
    if(state.tab === "provider-hpi") return renderProviderHpi();
    if(state.tab === "provider-pmsh") return renderProviderPmsh();
    if(state.tab === "provider-family") return renderProviderFamily();
    if(state.tab === "provider-home") return renderProviderHomeMeds();
    if(state.tab === "provider-ros") return renderProviderRos();
    if(state.tab === "provider-physical") return renderProviderPhysical();
    if(state.tab === "vitals") return renderCfVitals();
    if(state.tab === "assessment") return renderCfAssessment();
    if(state.tab === "io") return renderCfIO();
    if(["flowsheets","screenings","respiratory","obstetrics","problemlist","patienthistory","forms","roys"].includes(state.tab)) return renderGeneric(state.tab, chartFlowTabs[state.tab], `No ${chartFlowTabs[state.tab].toLowerCase()} documented`);
    return previousRenderTab();
  };

  window.renderNav = function(){
    const groups = [
      ["Patient", [["patientdetails","PD","Patient Details"],["summary","VS","Visit Summary"]]],
      ["Allergies & Immunizations", [["ai-allergies","AL","Allergies"],["ai-immunizations","IM","Immunizations"]]],
      ["Results", [["labs","LR","Results"]]],
      ["Provider", [["provider-admission","AI","Admission Information"],["provider-hpi","HP","History of Present Illness"],["provider-pmsh","PM","Past Medical & Surgical History"],["provider-family","FS","Family & Social History"],["provider-home","HM","Home Medications"],["provider-ros","RS","Review of Systems"],["provider-physical","PE","Physical Exam"]]],
      ["Clinical Chart", [["notes","NN","Notes"],["orders","OR","Orders"],["meds","MR","MAR"],["vitals","VS","Vital Signs"],["assessment","AS","Assessment"],["io","IO","Intake & Output"],["flowsheets","FL","Flowsheets"],["screenings","SS","Screenings & Scales"],["respiratory","RE","Respiratory"],["obstetrics","OB","Obstetrics"],["problemlist","PL","Problem List"],["patienthistory","PH","Patient History"],["sbar","SB","SBAR"],["careplan","CP","Care Plan"],["roys","RA","Roy's Adaptation Model"],["forms","PF","Patient Forms"]]]
    ];
    return groups.map(([label,items])=>`<div class="nav-group"><div class="nav-label">${esc(label)}</div>${items.map(([id,abbr,title])=>`<button class="${state.tab===id?"active":""}" data-tab="${id}"><span>${abbr}</span>${esc(title)}</button>`).join("")}</div>`).join("");
  };

  window.bindTabEvents = function(){
    previousBindTabs();
    bindChartFlow();
  };
})();
