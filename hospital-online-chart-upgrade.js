(function () {
  const KEY = "hct_his_online_mode_v2";
  const USER = "hct_his_online_username";
  const ROLE = "hct_role";
  const CH = "hct-his-online-mode";
  const CID = localStorage.hct_his_online_client || (localStorage.hct_his_online_client = "his_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
  const nav = [["command", "Command Center"], ["patients", "Patients"], ["meds", "Medication Orders"], ["pharmacy", "Pharmacy"], ["labs", "Labs & Imaging"], ["notifications", "Notifications"]];
  const assessment = ["Neuro", "Respiratory", "Cardiac", "GI", "GU", "Skin", "Safety", "Pain", "Specialty", "Psychosocial"];
  const medSeed = [["Normal saline 1 L", 48, 20], ["Ceftriaxone 1 g vial", 22, 10], ["Azithromycin 500 mg vial", 18, 8], ["Regular insulin vial", 16, 10], ["Albuterol nebule", 44, 20], ["Oxytocin 30 units bag", 18, 8], ["Furosemide 20 mg ampule", 24, 12], ["Ondansetron 4 mg vial", 26, 10]];
  let bc = null;
  let live = null;

  try {
    bc = new BroadcastChannel(CH);
    bc.onmessage = function (e) {
      if (e.data && e.data.key === KEY && e.data.cid !== CID) rerender();
    };
  } catch (_) {}

  function state() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) {}
    s.module = s.module || "command";
    s.patients = s.patients || seedPatients();
    s.stock = s.stock || seedStock();
    s.events = s.events || [];
    s.queue = s.queue || [];
    s.selected = s.selected || Object.keys(s.patients)[0] || "";
    Object.values(s.patients).forEach(defaultPatient);
    return s;
  }

  function save(s, text, patient) {
    s.version = (s.version || 0) + 1;
    s.updatedAt = new Date().toISOString();
    if (text) event(s, text, patient);
    localStorage.setItem(KEY, JSON.stringify(s));
    publish(s, text);
    rerender();
  }

  function publish(s, text) {
    connect();
    try { bc && bc.postMessage({ key: KEY, cid: CID, text }); } catch (_) {}
    try { live && live.send({ type: "broadcast", event: "his-state", payload: { key: KEY, cid: CID, state: s, text } }); } catch (_) {}
  }

  function connect() {
    if (live) return;
    try {
      const c = typeof cloud !== "undefined" ? cloud : window.cloud;
      if (!c || !c.client || !c.client.channel) return;
      live = c.client.channel(CH, { config: { broadcast: { ack: true } } });
      live.on("broadcast", { event: "his-state" }, function (e) {
        const msg = e.payload || {};
        if (msg.cid === CID || !msg.state) return;
        const local = state();
        if (Number(msg.state.version || 0) >= Number(local.version || 0)) {
          localStorage.setItem(KEY, JSON.stringify(msg.state));
          rerender();
        }
      });
      live.subscribe(function (status) {
        if (status === "SUBSCRIBED") publish(state(), "Online HIS connected");
      });
    } catch (_) {}
  }

  function seedPatients() {
    const src = Array.isArray(window.scenarios) ? window.scenarios : [];
    const out = {};
    src.forEach(function (sc, i) {
      const p = sc.patient || sc;
      const idv = p.id || p.scenarioId || sc.id || "P" + (1000 + i);
      out[idv] = defaultPatient({
        id: idv,
        name: [p.firstName, p.lastName].filter(Boolean).join(" ") || sc.patientName || sc.name || "Patient " + (i + 1),
        mrn: p.mrn || "MRN-" + (10040 + i),
        age: p.age || "",
        sex: p.sex || "",
        allergies: p.allergies || "No known allergies",
        diagnosis: p.diagnosis || sc.diagnosis || sc.title || "Clinical scenario",
        ward: ward(p.specialty || p.location || "", i),
        room: p.location || "",
        status: p.acuity || (i % 4 === 0 ? "Critical" : i % 3 === 0 ? "Urgent" : "Stable"),
        orders: (p.orders || []).map(function (o) { return { type: o.category || o[0] || "Order", text: o.order || o[1] || "", note: o.details || o[2] || "", status: o.status || o[3] || "Active", by: "Scenario", when: now() }; }),
        labs: (p.labs || []).map(function (l) { return { type: "Laboratory", test: l.test || l[1] || "", result: l.result || l[2] || "", flag: l.flag || l[4] || "", note: l.note || l[5] || "", by: "Scenario", when: l.time || l[0] || now() }; }),
        vitals: (p.vitals || []).map(function (v) { return { time: v.time || now(), hr: v.hr || "", bp: v.bp || [v.bps, v.bpd].filter(Boolean).join("/"), rr: v.rr || "", temp: v.temp || "", spo2: v.spo2 || "", pain: v.pain || "", note: v.note || "", by: v.by || "Scenario" }; }),
        meds: (p.meds || []).map(function (m) { return { name: m.name || m[0] || "", dose: m.dose || m[1] || "", route: m.route || m[2] || "", schedule: m.freq || m[3] || "", status: m.status || m[5] || "Ordered", note: m.note || m[6] || "", by: "Scenario", when: now() }; })
      });
    });
    if (!Object.keys(out).length) out.P1001 = defaultPatient({ id: "P1001", name: "Maria Dela Cruz", mrn: "MRN-10042", diagnosis: "Acute Myocardial Infarction", ward: "ICU", room: "ICU-3", status: "Critical" });
    return out;
  }

  function defaultPatient(p) {
    p.id = p.id || id(p.name || "patient");
    p.name = p.name || "New Patient";
    p.initials = initials(p.name);
    p.ward = p.ward || "Medical";
    p.status = p.status || "Stable";
    p.attending = p.attending || "";
    p.nurse = p.nurse || "";
    p.photo = p.photo || "";
    ["orders", "vitals", "meds", "labs", "notes", "io", "care", "education"].forEach(function (k) { p[k] = Array.isArray(p[k]) ? p[k] : []; });
    p.assessment = p.assessment || {};
    assessment.forEach(function (a) { p.assessment[a] = p.assessment[a] || "Not assessed"; });
    p.assessmentNote = p.assessmentNote || "";
    p.sbar = p.sbar || { s: "", b: "", a: "", r: "" };
    return p;
  }

  function seedStock() {
    const out = {};
    medSeed.forEach(function (m) { out[id(m[0])] = { id: id(m[0]), name: m[0], qty: m[1], par: m[2] }; });
    return out;
  }

  function shell() {
    connect();
    const s = state();
    return '<div class="hisx-shell hisx-modern"><aside class="hisx-side"><div class="hisx-brand"><span class="hisx-mark">HCT</span><div><strong>Hospital IS</strong><small>Online live charting</small></div></div>' +
      field("Username", '<input id="his-user" value="' + esc(user()) + '" placeholder="Your display name">') +
      field("Role", '<select id="his-role"><option value="student"' + sel(role() === "student") + '>Student</option><option value="faculty"' + sel(faculty()) + '>Faculty</option></select>') +
      '<nav class="hisx-nav">' + nav.map(function (n) { return '<button class="' + (s.module === n[0] ? "active" : "") + '" data-his-module="' + n[0] + '" data-hisx-mod="' + n[0] + '">' + esc(n[1]) + "</button>"; }).join("") + '</nav><div class="hisx-sidefoot">Offline EHR and online HIS are separate records.</div></aside>' +
      '<main class="hisx-main"><section class="hisx-topbar hisx-top"><div><small>Realtime HIS</small><h1>Hospital Information System</h1></div>' + kpis(s) + '</section><section class="hisx-content">' + page(s) + '</section></main></div>';
  }

  function page(s) {
    if (s.module === "patients") return patients(s);
    if (s.module === "chart") return chart(s);
    if (s.module === "meds") return listBox("Medication Orders", s.queue.slice().reverse(), medLine);
    if (s.module === "pharmacy") return pharmacy(s);
    if (s.module === "labs") return labs(s);
    if (s.module === "notifications") return listBox("Notifications", s.events, function (e) { return '<b>' + esc(e.text) + '</b><small>' + esc([e.patient, e.by, e.when].filter(Boolean).join(" - ")) + "</small>"; });
    return command(s);
  }

  function command(s) {
    const pts = Object.values(s.patients);
    const wards = {};
    pts.forEach(function (p) { wards[p.ward] = (wards[p.ward] || 0) + 1; });
    return '<section class="hisx-grid two">' + box("Priority Patients", pts.filter(function (p) { return p.status !== "Stable"; }).slice(0, 8).map(function (p) { return '<button class="hisx-patientrow" data-open-chart="' + esc(p.id) + '">' + avatar(p) + '<span><b>' + esc(p.name) + '</b><small>' + esc(p.diagnosis || "") + '</small></span>' + badge(p.status) + "</button>"; }).join("") || empty("No priority patients.")) +
      box("Latest Updates", feed(s.events, 8)) + '</section>' +
      box("Ward Census", '<div class="hisx-wardgrid">' + Object.keys(wards).sort().map(function (w) { return '<div class="hisx-ward"><strong>' + esc(w) + '</strong><span>' + wards[w] + " patients</span></div>"; }).join("") + "</div>");
  }

  function patients(s) {
    const rows = Object.values(s.patients).map(function (p) {
      return '<div class="hisx-tr patient" data-filter="' + esc((p.name + p.mrn + p.diagnosis + p.ward).toLowerCase()) + '"><span>' + avatar(p) + '<b>' + esc(p.name) + '</b><small>' + esc([p.age, p.sex, p.allergies].filter(Boolean).join(" / ")) + '</small></span><span>' + esc(p.mrn || "") + '</span><span>' + esc(p.diagnosis || "") + '</span><span>' + esc(p.ward) + ' / ' + esc(p.room || "") + '</span><span><input data-nurse="' + esc(p.id) + '" value="' + esc(p.nurse || "") + '" placeholder="Attending nurse"></span><span>' + badge(p.status) + '</span><span class="hisx-actions"><button data-open-chart="' + esc(p.id) + '">Open Chart</button>' + (faculty() ? '<button data-delete-patient="' + esc(p.id) + '">Delete</button>' : "") + "</span></div>";
    }).join("");
    return box("Live Ward Census", '<div class="hisx-cardhead"><input id="his-search" placeholder="Search patient, MRN, diagnosis, ward">' + (faculty() ? '<button id="his-add-patient">Add Patient</button>' : "") + '</div><div class="hisx-table"><div class="hisx-tr head"><span>Patient</span><span>MRN</span><span>Diagnosis</span><span>Ward / Room</span><span>Nurse</span><span>Status</span><span></span></div>' + rows + "</div>");
  }

  function chart(s) {
    const p = s.patients[s.selected] || Object.values(s.patients)[0];
    if (!p) return empty("No patient selected.");
    const stock = Object.values(s.stock);
    return '<section class="hisx-chart"><div class="hisx-charthead hisx-card">' + avatar(p) + '<div><small>' + esc([p.mrn, p.ward, p.room].filter(Boolean).join(" / ")) + '</small><h2>' + esc(p.name) + '</h2><p>' + esc(p.diagnosis || "") + '</p></div><div class="hisx-chartactions">' + badge(p.status) + '<button data-his-module="patients">Back</button></div></div><div class="hisx-grid two">' +
      box("Chart Header", field("Photo URL", '<input id="p-photo" value="' + esc(p.photo) + '">') + field("Attending Provider", '<input id="p-attending" value="' + esc(p.attending) + '">') + field("Attending Nurse", '<input id="p-nurse" value="' + esc(p.nurse) + '">') + field("Status", opts("p-status", ["Stable", "Watch", "Urgent", "Critical", "Admitted", "Discharged"], p.status)) + field("Ward", '<input id="p-ward" value="' + esc(p.ward) + '">') + field("Room", '<input id="p-room" value="' + esc(p.room || "") + '">') + '<button id="save-header">Save Header</button>') +
      box("Doctor Orders", (faculty() ? '<div class="hisx-inline">' + opts("o-type", ["Medication", "Laboratory", "Imaging", "Nursing", "Diet", "Activity"]) + '<input id="o-text" placeholder="Order details"><button id="add-order">Add</button></div>' : '<p class="hisx-muted">Only faculty can add live doctor orders.</p>') + items(p.orders, function (o) { return '<b>' + esc(o.type || "Order") + '</b> ' + esc(o.text || "") + '<small>' + meta(o) + "</small>"; })) +
      box("Vital Signs", '<div class="hisx-vitals-form"><input id="v-hr" placeholder="HR"><input id="v-bp" placeholder="BP"><input id="v-rr" placeholder="RR"><input id="v-temp" placeholder="Temp"><input id="v-spo2" placeholder="SpO2"><input id="v-pain" placeholder="Pain"><input id="v-note" placeholder="Vitals note"><button id="add-vitals">Add</button></div>' + items(p.vitals.slice().reverse(), function (v) { return '<b>' + esc(v.time || "") + '</b> HR ' + esc(v.hr || "--") + ', BP ' + esc(v.bp || "--") + ', RR ' + esc(v.rr || "--") + ', Temp ' + esc(v.temp || "--") + ', SpO2 ' + esc(v.spo2 || "--") + '<small>' + esc(v.note || "") + " " + meta(v) + "</small>"; })) +
      box("Medications", '<div class="hisx-inline"><select id="m-id">' + stock.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.name) + " (" + m.qty + " left)</option>"; }).join("") + '</select><input id="m-dose" placeholder="Dose"><select id="m-sched"><option>STAT</option><option>Once</option><option>q4h</option><option>q6h</option><option>q8h</option><option>Daily</option><option>PRN</option></select><input id="m-note" placeholder="Medication note"><button id="request-med">Order</button></div>' + items(p.meds.slice().reverse(), medLine)) +
      box("Labs & Imaging", (faculty() ? '<div class="hisx-inline">' + opts("l-type", ["Laboratory", "Imaging"]) + '<input id="l-test" placeholder="Test or study"><input id="l-result" placeholder="Result / impression">' + opts("l-flag", ["Normal", "Abnormal", "Critical", "Pending"]) + '<input id="l-note" placeholder="Notes"><button id="add-lab">Post</button></div>' : '<p class="hisx-muted">Only faculty can post labs and imaging.</p>') + items(p.labs.slice().reverse(), labLine)) +
      box("Focused Assessment", '<div class="hisx-assess">' + assessment.map(function (a) { return field(a, opts("as-" + id(a), ["Not assessed", "WNL", "Needs monitoring", "Abnormal", "Critical"], p.assessment[a])); }).join("") + '</div>' + field("Narrative", '<textarea id="as-note">' + esc(p.assessmentNote || "") + '</textarea>') + '<button id="save-assess">Save Assessment</button>') +
      box("Intake / Output", '<div class="hisx-inline">' + opts("io-dir", ["Input", "Output"]) + opts("io-type", ["Oral fluid", "Meal", "IV fluid", "Urine", "Emesis", "Stool", "Drain", "Blood loss"]) + '<input id="io-amt" placeholder="Amount mL"><input id="io-note" placeholder="Description"><button id="add-io">Add</button></div><div class="hisx-mini">Input ' + total(p, "Input") + " mL / Output " + total(p, "Output") + " mL</div>" + items(p.io.slice().reverse(), function (x) { return '<b>' + esc(x.direction) + '</b> ' + esc(x.type) + ' ' + esc(x.amount) + ' mL<small>' + esc(x.note || "") + " " + meta(x) + "</small>"; })) +
      box("Notes", '<div class="hisx-inline">' + opts("n-type", ["Nursing Note", "Progress Note", "Medication Note", "Procedure Note", "Shift Handoff"]) + '<button id="note-template">Template</button></div><textarea id="n-body" placeholder="Write chart note"></textarea><button id="add-note">Add Note</button>' + items(p.notes.slice().reverse(), function (n) { return '<b>' + esc(n.type) + '</b><p>' + esc(n.text) + '</p><small>' + meta(n) + "</small>"; })) +
      box("Care Plan", '<div class="hisx-inline"><input id="c-dx" placeholder="Nursing diagnosis"><input id="c-goal" placeholder="Goal">' + opts("c-status", ["Planned", "In progress", "Met", "Not met", "Revised"]) + '<input id="c-int" placeholder="Interventions / evaluation"><button id="add-care">Add</button></div>' + items(p.care.slice().reverse(), function (c) { return '<b>' + esc(c.dx) + '</b> ' + badge(c.status) + '<p>' + esc(c.goal) + '</p><small>' + esc(c.intervention) + " " + meta(c) + "</small>"; })) +
      box("Education", '<div class="hisx-inline"><input id="e-topic" placeholder="Topic">' + opts("e-status", ["Not started", "In progress", "Complete", "Needs reinforcement"]) + '<input id="e-response" placeholder="Patient response"><button id="add-edu">Add</button></div>' + items(p.education.slice().reverse(), function (e) { return '<b>' + esc(e.topic) + '</b> ' + badge(e.status) + '<small>' + esc(e.response) + " " + meta(e) + "</small>"; })) +
      box("SBAR", field("Situation", '<textarea id="sbar-s">' + esc(p.sbar.s) + '</textarea>') + field("Background", '<textarea id="sbar-b">' + esc(p.sbar.b) + '</textarea>') + field("Assessment", '<textarea id="sbar-a">' + esc(p.sbar.a) + '</textarea>') + field("Recommendation", '<textarea id="sbar-r">' + esc(p.sbar.r) + '</textarea>') + '<button id="save-sbar">Save SBAR</button>') +
      "</div></section>";
  }

  function pharmacy(s) {
    return '<section class="hisx-grid two">' + box("Pharmacy Queue", items(s.queue.slice().reverse(), function (q) { return medLine(q) + (faculty() && q.status !== "Dispensed" ? ' <button data-dispense="' + esc(q.id) + '">Dispense</button>' : ""); })) +
      box("Inventory", Object.values(s.stock).map(function (m) { return '<div class="hisx-stock ' + (m.qty <= m.par ? "low" : "") + '"><span><b>' + esc(m.name) + '</b><small>Par ' + m.par + '</small></span><strong>' + m.qty + '</strong>' + (faculty() ? '<input data-restock="' + esc(m.id) + '" placeholder="+ qty"><button data-restock-btn="' + esc(m.id) + '">Restock</button>' : "") + "</div>"; }).join("")) + "</section>";
  }

  function labs(s) {
    const rows = [];
    Object.values(s.patients).forEach(function (p) { p.labs.forEach(function (l) { rows.push({ p, l }); }); });
    return listBox("Labs & Imaging", rows.reverse(), function (r) { return '<b>' + esc(r.l.type) + ": " + esc(r.l.test) + '</b> for ' + esc(r.p.name) + " " + badge(r.l.flag) + '<p>' + esc(r.l.result) + '</p><small>' + esc(r.l.note || "") + " " + meta(r.l) + "</small>"; });
  }

  function bind() {
    connect();
    document.querySelectorAll("[data-his-module]").forEach(function (b) { b.onclick = function () { const s = state(); s.module = b.dataset.hisModule; save(s); }; });
    document.querySelectorAll("[data-open-chart]").forEach(function (b) { b.onclick = function () { const s = state(); s.selected = b.dataset.openChart; s.module = "chart"; save(s); }; });
    document.querySelectorAll("[data-delete-patient]").forEach(function (b) { b.onclick = function () { if (!faculty()) return; const s = state(); const p = s.patients[b.dataset.deletePatient]; if (p) { delete s.patients[p.id]; s.selected = Object.keys(s.patients)[0] || ""; save(s, "Deleted patient from HIS", p.name); } }; });
    q("#his-user", "change", function (e) { localStorage.setItem(USER, e.target.value || "Care team member"); });
    q("#his-role", "change", function (e) { localStorage.setItem(ROLE, e.target.value); rerender(); });
    q("#his-search", "input", function (e) { const term = e.target.value.toLowerCase(); document.querySelectorAll(".hisx-tr.patient").forEach(function (r) { r.hidden = !r.dataset.filter.includes(term); }); });
    document.querySelectorAll("[data-nurse]").forEach(function (i) { i.onchange = function () { edit(i.dataset.nurse, function (p) { p.nurse = i.value; }, "Updated attending nurse"); }; });
    q("#his-add-patient", "click", function () { const s = state(); const idv = "P" + Date.now(); s.patients[idv] = defaultPatient({ id: idv, name: "New Patient", mrn: "MRN-" + String(Date.now()).slice(-5), diagnosis: "New admission", ward: "Medical", status: "Admitted" }); s.selected = idv; s.module = "chart"; save(s, "Added patient", "New Patient"); });
    q("#save-header", "click", function () { edit(null, function (p) { p.photo = val("p-photo"); p.attending = val("p-attending"); p.nurse = val("p-nurse"); p.status = val("p-status"); p.ward = val("p-ward"); p.room = val("p-room"); }, "Updated chart header"); });
    q("#add-order", "click", function () { if (!faculty()) return; edit(null, function (p) { p.orders.push(stamp({ type: val("o-type"), text: val("o-text") })); }, "Added doctor order"); });
    q("#add-vitals", "click", function () { edit(null, function (p) { p.vitals.push(stamp({ time: now(), hr: val("v-hr"), bp: val("v-bp"), rr: val("v-rr"), temp: val("v-temp"), spo2: val("v-spo2"), pain: val("v-pain"), note: val("v-note") })); }, "Added vital signs"); });
    q("#request-med", "click", requestMed);
    q("#add-lab", "click", function () { if (!faculty()) return; edit(null, function (p) { p.labs.push(stamp({ type: val("l-type"), test: val("l-test"), result: val("l-result"), flag: val("l-flag"), note: val("l-note") })); }, "Posted lab or imaging result"); });
    q("#save-assess", "click", function () { edit(null, function (p) { assessment.forEach(function (a) { p.assessment[a] = val("as-" + id(a)); }); p.assessmentNote = val("as-note"); }, "Updated focused assessment"); });
    q("#add-io", "click", function () { edit(null, function (p) { p.io.push(stamp({ direction: val("io-dir"), type: val("io-type"), amount: Number(val("io-amt") || 0), note: val("io-note") })); }, "Added intake/output entry"); });
    q("#note-template", "click", function () { const n = document.getElementById("n-body"); if (n) n.value = "Assessment: \nInterventions: \nResponse: \nPlan: "; });
    q("#add-note", "click", function () { edit(null, function (p) { p.notes.push(stamp({ type: val("n-type"), text: val("n-body") })); }, "Added chart note"); });
    q("#add-care", "click", function () { edit(null, function (p) { p.care.push(stamp({ dx: val("c-dx"), goal: val("c-goal"), status: val("c-status"), intervention: val("c-int") })); }, "Updated care plan"); });
    q("#add-edu", "click", function () { edit(null, function (p) { p.education.push(stamp({ topic: val("e-topic"), status: val("e-status"), response: val("e-response") })); }, "Added patient education"); });
    q("#save-sbar", "click", function () { edit(null, function (p) { p.sbar = { s: val("sbar-s"), b: val("sbar-b"), a: val("sbar-a"), r: val("sbar-r") }; }, "Updated SBAR handoff"); });
    document.querySelectorAll("[data-dispense]").forEach(function (b) { b.onclick = function () { dispense(b.dataset.dispense); }; });
    document.querySelectorAll("[data-restock-btn]").forEach(function (b) { b.onclick = function () { const s = state(), m = s.stock[b.dataset.restockBtn], input = document.querySelector('[data-restock="' + b.dataset.restockBtn + '"]'); if (faculty() && m) { m.qty += Number(input.value || 0); save(s, "Restocked " + m.name); } }; });
  }

  function edit(pid, fn, text) { const s = state(), p = s.patients[pid || s.selected]; if (!p) return; fn(p, s); save(s, text, p.name); }
  function requestMed() { edit(null, function (p, s) { const m = s.stock[val("m-id")]; if (!m) return; const r = stamp({ id: "rx" + Date.now(), patientId: p.id, patientName: p.name, medId: m.id, name: m.name, dose: val("m-dose"), schedule: val("m-sched"), note: val("m-note"), status: "Requested" }); p.meds.push(r); s.queue.push(r); }, "Requested medication from pharmacy"); }
  function dispense(rid) { const s = state(), r = s.queue.find(function (x) { return x.id === rid; }); if (!faculty() || !r) return; const m = s.stock[r.medId]; if (m) m.qty = Math.max(0, m.qty - 1); r.status = "Dispensed"; r.dispensedBy = user(); r.dispensedAt = now(); const p = s.patients[r.patientId]; if (p) { const pm = p.meds.find(function (x) { return x.id === r.id; }); if (pm) Object.assign(pm, r); } save(s, "Dispensed medication and updated inventory", r.patientName); }
  function event(s, text, patient) { const e = stamp({ id: "evt" + Date.now(), text, patient: patient || "" }); s.events.unshift(e); s.events = s.events.slice(0, 150); popup(e); }
  function popup(e) { const t = document.createElement("div"); t.className = "hisx-toast show"; t.innerHTML = "<b>" + esc(e.text) + "</b><span>" + esc([e.patient, e.by, e.when].filter(Boolean).join(" - ")) + "</span>"; document.body.appendChild(t); beep(); setTimeout(function () { t.classList.remove("show"); }, 4500); setTimeout(function () { t.remove(); }, 5200); }
  function rerender() { try { if (typeof window.render === "function") window.render(); else renderBody(); } catch (_) { renderBody(); } }
  function renderBody() { let r = document.getElementById("his-online-root"); if (!r) { r = document.createElement("div"); r.id = "his-online-root"; document.body.appendChild(r); } r.innerHTML = shell(); bind(); }

  function kpis(s) { const pts = Object.values(s.patients), low = Object.values(s.stock).filter(function (m) { return m.qty <= m.par; }).length; return '<div class="hisx-kpis">' + [["Census", pts.length], ["Critical", pts.filter(function (p) { return p.status === "Critical"; }).length], ["Low Stock", low], ["Open Orders", s.queue.filter(function (q) { return q.status !== "Dispensed"; }).length]].map(function (k) { return '<div class="hisx-kpi"><small>' + k[0] + "</small><strong>" + k[1] + "</strong></div>"; }).join("") + "</div>"; }
  function box(t, b) { return '<article class="hisx-card"><div class="hisx-cardhead"><div><small>Live chart</small><h3>' + esc(t) + "</h3></div></div>" + b + "</article>"; }
  function listBox(t, arr, fn) { return box(t, items(arr, fn)); }
  function items(arr, fn) { return arr && arr.length ? '<ul class="hisx-list">' + arr.map(function (x) { return "<li>" + fn(x) + "</li>"; }).join("") + "</ul>" : empty("No entries yet."); }
  function feed(events, n) { return items((events || []).slice(0, n), function (e) { return '<b>' + esc(e.text) + '</b><small>' + esc([e.patient, e.by, e.when].filter(Boolean).join(" - ")) + "</small>"; }); }
  function field(label, inner) { return '<label class="hisx-field"><span>' + esc(label) + "</span>" + inner + "</label>"; }
  function opts(idv, options, cur) { return '<select id="' + idv + '">' + options.map(function (o) { return '<option' + sel(o === cur) + ">" + esc(o) + "</option>"; }).join("") + "</select>"; }
  function medLine(m) { return '<b>' + esc(m.name || m.medName || "") + '</b> ' + esc(m.dose || "") + " " + badge(m.status || "") + '<small>' + esc([m.schedule, m.note, meta(m)].filter(Boolean).join(" - ")) + "</small>"; }
  function labLine(l) { return '<b>' + esc(l.type || "Lab") + ": " + esc(l.test || "") + '</b> ' + badge(l.flag || "") + '<p>' + esc(l.result || "") + '</p><small>' + esc([l.note, meta(l)].filter(Boolean).join(" - ")) + "</small>"; }
  function avatar(p) { return p.photo ? '<span class="hisx-avatar photo" style="background-image:url(' + esc(p.photo) + ')"></span>' : '<span class="hisx-avatar">' + esc(p.initials || initials(p.name)) + "</span>"; }
  function badge(x) { return '<span class="hisx-badge ' + id(x || "stable") + '">' + esc(x || "Stable") + "</span>"; }
  function empty(t) { return '<p class="hisx-empty">' + esc(t) + "</p>"; }
  function meta(x) { return [x.by || x.dispensedBy || "", x.when || x.dispensedAt || ""].filter(Boolean).join(" - "); }
  function total(p, d) { return (p.io || []).filter(function (x) { return x.direction === d; }).reduce(function (a, x) { return a + Number(x.amount || 0); }, 0); }
  function stamp(x) { x.by = x.by || user(); x.when = x.when || now(); x.stamp = x.stamp || new Date().toISOString(); return x; }
  function user() { return localStorage.getItem(USER) || localStorage.getItem("hct_user_name") || "Care team member"; }
  function role() { return localStorage.getItem(ROLE) || "student"; }
  function faculty() { return /faculty|instructor|doctor|admin/i.test(role()); }
  function val(x) { const e = document.getElementById(x); return e ? e.value.trim() : ""; }
  function q(s, e, fn) { const el = document.querySelector(s); if (el) el.addEventListener(e, fn); }
  function now() { return new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
  function sel(x) { return x ? " selected" : ""; }
  function initials(n) { return String(n || "P").split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join("").toUpperCase(); }
  function id(x) { return String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function ward(x, i) { return /icu|critical/i.test(x) ? "ICU" : /ob|gyn|labor/i.test(x) ? "OB-GYN" : /peds/i.test(x) ? "Pediatrics" : /psych/i.test(x) ? "Psychiatry" : /surg|ortho/i.test(x) ? "Surgical" : /ed|emergency/i.test(x) ? "Emergency" : ["Medical", "ICU", "Surgical", "OB-GYN"][i % 4]; }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function beep() { try { const A = window.AudioContext || window.webkitAudioContext, c = new A(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = 740; g.gain.value = .04; o.connect(g); g.connect(c.destination); o.start(); setTimeout(function () { o.stop(); c.close(); }, 130); } catch (_) {} }

  window.HctHis = { renderPage: shell, bindPage: bind, render: renderBody, sync: rerender, open: function () { try { if (window.state) window.state.tab = "his"; if (typeof window.render === "function") window.render(); else renderBody(); } catch (_) { renderBody(); } } };
  window.HctHisOnlineUpgrade = window.HctHis;
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll("#his-launcher,.his-launcher").forEach(function (x) { x.remove(); }); });
})();