(function () {
  const KEY = "hct_his_online_mode_v2";
  const USER = "hct_his_online_username";
  const CH = "hct-his-online-mode";
  const CID = localStorage.hct_his_online_client || (localStorage.hct_his_online_client = "hisfix_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
  let live = null;
  let bc = null;

  const systems = ["Neuro", "Respiratory", "Cardiac", "GI", "GU", "Skin", "Safety", "Pain", "Specialty", "Psychosocial"];
  const options = {
    Neuro: ["Alert and oriented x4", "Alert and oriented x3", "Alert and oriented x2", "PERRL", "Pupils unequal", "GCS 15", "GCS 13-14", "Speech clear", "Speech slurred", "Strength 5/5 bilaterally", "Unilateral weakness", "Facial droop", "Restless/confused", "Lethargic", "Seizure activity"],
    Respiratory: ["Lungs clear bilaterally", "Diminished bases", "Fine crackles", "Coarse crackles", "Expiratory wheezes", "Stridor", "Regular unlabored respirations", "Tachypnea", "Bradypnea", "Accessory muscle use", "Productive cough", "SpO2 >=95% room air", "SpO2 92-94%", "SpO2 <92%"],
    Cardiac: ["S1/S2 regular", "Irregular rhythm", "Murmur noted", "Peripheral pulses 2+ equal", "Peripheral pulses diminished", "Cap refill <2 sec", "Cap refill >3 sec", "Skin warm/dry/pink", "Cool/pale peripherally", "Diaphoretic", "No edema", "1+ edema", "2+ edema", "Telemetry NSR", "Telemetry PVCs", "Atrial fibrillation"],
    GI: ["Abdomen soft non-tender", "Abdomen tender", "Abdomen distended", "Bowel sounds active x4", "Hypoactive bowel sounds", "Hyperactive bowel sounds", "Absent bowel sounds", "No nausea/vomiting", "Nausea present", "Vomiting", "Last BM today normal", "Constipation", "Diarrhea", "NPO per order", "NG tube output"],
    GU: ["Voiding clear yellow urine", "Dark amber urine", "Output adequate", "Oliguria <30 mL/hr", "Anuria", "Hematuria", "Foley catheter in place", "Urinary retention", "Dysuria", "Frequency/urgency", "Lochia normal", "Heavy lochia/bleeding", "Urostomy/nephrostomy output"],
    Skin: ["Skin intact", "Warm/dry", "Poor skin turgor", "Mucous membranes dry", "Pressure injury risk", "Open wound", "Surgical incision intact", "Redness around wound", "Drainage present", "Bruising", "Rash", "Pallor", "Mottling", "Diaphoresis"],
    Safety: ["Call light within reach", "Bed low and locked", "Fall precautions active", "Side rails per policy", "Non-skid footwear", "Ambulates independently", "Requires assist x1", "Requires assist x2", "Confused/high fall risk", "Aspiration precautions", "Seizure precautions", "Isolation precautions"],
    Pain: ["Denies pain", "Pain 1-3 mild", "Pain 4-6 moderate", "Pain 7-10 severe", "Chest pain", "Abdominal pain", "Incisional pain", "Headache", "Pain improved after intervention", "Pain unchanged", "Nonverbal pain cues", "Repositioning effective"],
    Specialty: ["OB fundus firm", "OB fundus boggy", "Fetal heart tones obtained", "Postpartum bleeding WNL", "Pediatric caregiver present", "Neuro checks stable", "Psych safety assessment completed", "Diabetic foot check complete", "Wound care performed", "Telemetry strip reviewed"],
    Psychosocial: ["Calm/cooperative", "Anxious", "Tearful", "Agitated", "Withdrawn", "Family at bedside", "Needs interpreter", "Education readiness good", "Poor health literacy", "Denies SI/HI", "Command hallucinations reported", "Coping support needed"]
  };
  const intakeTypes = ["Oral fluids", "Meal/snack", "IV fluid", "IV medication volume", "Tube feeding", "TPN/lipids", "Blood product", "Flush/irrigation"];
  const outputTypes = ["Urine voided", "Urine catheter", "Straight catheter", "Emesis", "BM toilet", "BM bedpan", "BM diaper", "Colostomy", "Ileostomy", "NG drainage", "JP drain", "Chest tube", "Wound drain", "Lochia", "Blood loss", "Dialysis ultrafiltration"];

  try { bc = new BroadcastChannel(CH); } catch (_) {}

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) { return {}; }
  }

  function write(s, text, patient) {
    s.version = (s.version || 0) + 1;
    s.updatedAt = new Date().toISOString();
    if (text) notify(s, text, patient);
    localStorage.setItem(KEY, JSON.stringify(s));
    publish(s, text);
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
      live.subscribe();
    } catch (_) {}
  }

  function ensureScenarios() {
    const s = load();
    s.patients = s.patients || {};
    const seeded = seedPatients();
    let changed = false;
    Object.keys(seeded).forEach(function (id) {
      if (!s.patients[id]) {
        s.patients[id] = seeded[id];
        changed = true;
      } else {
        ["orders", "labs", "vitals", "meds"].forEach(function (k) {
          if (!s.patients[id][k] || !s.patients[id][k].length) {
            s.patients[id][k] = seeded[id][k] || [];
            changed = true;
          }
        });
      }
    });
    if (!s.selected || !s.patients[s.selected]) s.selected = Object.keys(s.patients)[0] || "";
    if (changed) write(s);
  }

  function seedPatients() {
    const src = Array.isArray(window.scenarios) ? window.scenarios : [];
    const out = {};
    src.forEach(function (sc, i) {
      const p = sc.patient || sc;
      const pid = p.id || p.scenarioId || sc.id || "P" + (1000 + i);
      out[pid] = patient({
        id: pid,
        name: [p.firstName, p.lastName].filter(Boolean).join(" ") || sc.patientName || sc.name || "Patient " + (i + 1),
        mrn: p.mrn || "MRN-" + (10040 + i),
        age: p.age || "",
        sex: p.sex || "",
        allergies: p.allergies || "No known allergies",
        diagnosis: p.diagnosis || sc.diagnosis || sc.title || "Clinical scenario",
        ward: ward(p.specialty || p.location || "", i),
        room: p.location || "",
        status: p.acuity || "Stable",
        orders: (p.orders || []).map(function (o) { return stamp({ type: o.category || o[0] || "Order", text: o.order || o[1] || "", note: o.details || o[2] || "", status: o.status || o[3] || "Active", by: "Scenario" }); }),
        labs: (p.labs || []).map(function (l) { return stamp({ type: "Laboratory", test: l.test || l[1] || "", result: l.result || l[2] || "", flag: l.flag || l[4] || "", note: l.note || l[5] || "", by: "Scenario" }); }),
        vitals: (p.vitals || []).map(function (v) { return stamp({ time: v.time || now(), hr: v.hr || "", bp: v.bp || [v.bps, v.bpd].filter(Boolean).join("/"), rr: v.rr || "", temp: v.temp || "", spo2: v.spo2 || "", pain: v.pain || "", note: v.note || "", by: v.by || "Scenario" }); }),
        meds: (p.meds || []).map(function (m) { return stamp({ id: "scenario-med-" + pid + "-" + Math.random().toString(36).slice(2, 7), name: m.name || m[0] || "", dose: m.dose || m[1] || "", route: m.route || m[2] || "", schedule: m.freq || m[3] || "", status: m.status || m[5] || "Ordered", note: m.note || m[6] || "", by: "Scenario" }); })
      });
    });
    return out;
  }

  function patient(p) {
    p.initials = initials(p.name);
    ["orders", "vitals", "meds", "labs", "notes", "io", "care", "education"].forEach(function (k) { p[k] = Array.isArray(p[k]) ? p[k] : []; });
    p.assessment = p.assessment || {};
    systems.forEach(function (x) { p.assessment[x] = p.assessment[x] || ""; });
    p.sbar = p.sbar || { s: "", b: "", a: "", r: "" };
    return p;
  }

  function enhance() {
    ensureScenarios();
    const s = load();
    const p = s.patients && s.patients[s.selected];
    if (!p || s.module !== "chart") return;
    replaceCard("Focused Assessment", assessmentHtml(p));
    replaceCard("Intake / Output", ioHtml(p));
    replaceCard("Medications", medsHtml(s, p));
    bindEnhanced(p.id);
  }

  function replaceCard(title, html) {
    const card = Array.from(document.querySelectorAll(".hisx-card")).find(function (el) {
      const h = el.querySelector("h3,h2");
      return h && h.textContent.trim() === title;
    });
    if (card) card.innerHTML = '<div class="hisx-cardhead"><div><small>Live chart</small><h3>' + esc(title) + "</h3></div></div>" + html;
  }

  function assessmentHtml(p) {
    return '<div class="hisx-assess">' + systems.map(function (sys) {
      const key = id(sys);
      return '<div class="hisx-assess-system"><label class="hisx-field"><span>' + esc(sys) + ' findings</span><select data-assess-pick="' + key + '"><option value="">Select finding to add</option>' + options[sys].map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + '</select></label><textarea id="fx-as-' + key + '" placeholder="Type or select ' + esc(sys.toLowerCase()) + ' findings">' + esc(p.assessment[sys] || "") + '</textarea></div>';
    }).join("") + '</div><label class="hisx-field"><span>Narrative priority note</span><textarea id="fx-as-note">' + esc(p.assessmentNote || "") + '</textarea></label><button id="fx-save-assess">Save Assessment</button>';
  }

  function ioHtml(p) {
    return '<div class="hisx-io-split"><section><h4>Intake</h4><div class="hisx-inline">' + select("fx-in-type", intakeTypes) + '<input id="fx-in-amt" placeholder="Amount mL"><input id="fx-in-time" placeholder="Time, optional"><input id="fx-in-note" placeholder="Intake note"><button id="fx-add-intake">Add Intake</button></div></section><section><h4>Output</h4><div class="hisx-inline">' + select("fx-out-type", outputTypes) + '<input id="fx-out-amt" placeholder="Amount mL"><input id="fx-out-count" placeholder="Episodes"><select id="fx-out-char"><option value="">Characteristic</option><option>Clear yellow</option><option>Dark amber</option><option>Cloudy</option><option>Bloody</option><option>Loose/watery</option><option>Formed</option><option>Soft</option><option>Bilious</option><option>Coffee-ground</option><option>Serosanguineous</option><option>Purulent</option></select><input id="fx-out-time" placeholder="Time, optional"><input id="fx-out-note" placeholder="Output note"><button id="fx-add-output">Add Output</button></div></section></div><div class="hisx-mini">Intake ' + total(p, "in") + " mL / Output " + total(p, "out") + " mL</div>" + list(p.io.slice().reverse(), function (x) { return '<b>' + esc(x.direction === "in" || x.direction === "Input" ? "Intake" : "Output") + '</b> ' + esc(x.type) + ' ' + esc(x.amount || 0) + ' mL' + (x.count ? " / " + esc(x.count) + " episode(s)" : "") + '<small>' + esc([x.characteristic, x.note, meta(x)].filter(Boolean).join(" | ")) + "</small>"; });
  }

  function medsHtml(s, p) {
    const stock = Object.values(s.stock || {});
    return '<div class="hisx-inline"><select id="fx-med-id">' + stock.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.name) + " (" + m.qty + " left)</option>"; }).join("") + '</select><input id="fx-med-dose" placeholder="Dose"><select id="fx-med-sched"><option>STAT</option><option>Once</option><option>q4h</option><option>q6h</option><option>q8h</option><option>Daily</option><option>PRN</option></select><input id="fx-med-note" placeholder="Medication note"><button id="fx-request-med">Order</button></div>' + list(p.meds.slice().reverse(), function (m) { return medLine(m) + (/dispensed/i.test(m.status || "") ? '<div class="hisx-actions med-actions"><button data-fx-med="given" data-med-id="' + esc(m.id) + '">Given</button><button data-fx-med="hold" data-med-id="' + esc(m.id) + '">Hold</button></div>' : ""); });
  }

  function bindEnhanced(pid) {
    document.querySelectorAll("[data-assess-pick]").forEach(function (sel) {
      sel.onchange = function () {
        const ta = document.getElementById("fx-as-" + sel.dataset.assessPick);
        if (ta && sel.value) ta.value = ta.value ? ta.value + "\n" + sel.value : sel.value;
        sel.value = "";
      };
    });
    on("fx-save-assess", function () { edit(pid, function (p) { systems.forEach(function (sys) { p.assessment[sys] = val("fx-as-" + id(sys)); }); p.assessmentNote = val("fx-as-note"); }, "Updated focused assessment"); });
    on("fx-add-intake", function () { edit(pid, function (p) { p.io.push(stamp({ direction: "in", type: val("fx-in-type"), amount: Number(val("fx-in-amt") || 0), time: val("fx-in-time") || now(), note: val("fx-in-note") })); }, "Added intake entry"); });
    on("fx-add-output", function () { edit(pid, function (p) { p.io.push(stamp({ direction: "out", type: val("fx-out-type"), amount: Number(val("fx-out-amt") || 0), count: Number(val("fx-out-count") || 0), characteristic: val("fx-out-char"), time: val("fx-out-time") || now(), note: val("fx-out-note") })); }, "Added output entry"); });
    on("fx-request-med", function () { requestMed(pid); });
    document.querySelectorAll("[data-fx-med]").forEach(function (b) {
      b.onclick = function () { medAction(pid, b.dataset.medId, b.dataset.fxMed); };
    });
  }

  function edit(pid, fn, text) {
    const s = load();
    const p = s.patients && s.patients[pid || s.selected];
    if (!p) return;
    fn(p, s);
    write(s, text, p.name);
    rerender();
  }

  function requestMed(pid) {
    edit(pid, function (p, s) {
      const m = (s.stock || {})[val("fx-med-id")];
      if (!m) return;
      const r = stamp({ id: "rx" + Date.now(), patientId: p.id, patientName: p.name, medId: m.id, name: m.name, dose: val("fx-med-dose"), schedule: val("fx-med-sched"), note: val("fx-med-note"), status: "Requested" });
      p.meds.push(r);
      s.queue = s.queue || [];
      s.queue.push(r);
    }, "Requested medication from pharmacy");
  }

  function medAction(pid, medId, action) {
    edit(pid, function (p, s) {
      const m = p.meds.find(function (x) { return x.id === medId; });
      if (!m) return;
      m.status = action === "given" ? "Given" : "Held";
      m.actionBy = user();
      m.actionAt = now();
      const q = (s.queue || []).find(function (x) { return x.id === medId; });
      if (q) Object.assign(q, m);
    }, action === "given" ? "Marked medication given" : "Held medication");
  }

  function notify(s, text, patient) {
    s.events = s.events || [];
    s.events.unshift(stamp({ id: "evt" + Date.now(), text, patient: patient || "" }));
    s.events = s.events.slice(0, 150);
  }

  function rerender() {
    try { if (typeof window.render === "function") window.render(); } catch (_) {}
  }

  function patchHctHis() {
    if (!window.HctHis || window.HctHis.__liveFixes) return;
    const base = window.HctHis;
    window.HctHis = Object.assign({}, base, {
      __liveFixes: true,
      renderPage: function () {
        ensureScenarios();
        return base.renderPage ? base.renderPage() : "";
      },
      bindPage: function () {
        if (base.bindPage) base.bindPage();
        enhance();
      }
    });
    window.HctHisOnlineUpgrade = window.HctHis;
  }

  function select(idv, arr) { return '<select id="' + idv + '">' + arr.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + "</select>"; }
  function list(arr, fn) { return arr && arr.length ? '<ul class="hisx-list">' + arr.map(function (x) { return "<li>" + fn(x) + "</li>"; }).join("") + "</ul>" : '<p class="hisx-empty">No entries yet.</p>'; }
  function medLine(m) { return '<b>' + esc(m.name || m.medName || "") + '</b> ' + esc(m.dose || "") + ' <span class="hisx-badge">' + esc(m.status || "") + '</span><small>' + esc([m.schedule, m.note, meta(m), m.actionBy ? "Action: " + m.status + " by " + m.actionBy + " at " + m.actionAt : ""].filter(Boolean).join(" - ")) + "</small>"; }
  function meta(x) { return [x.by || x.dispensedBy || "", x.when || x.dispensedAt || ""].filter(Boolean).join(" - "); }
  function total(p, d) { return (p.io || []).filter(function (x) { return x.direction === d || (d === "in" && x.direction === "Input") || (d === "out" && x.direction === "Output"); }).reduce(function (a, x) { return a + Number(x.amount || 0); }, 0); }
  function stamp(x) { x.by = x.by || user(); x.when = x.when || now(); x.stamp = x.stamp || new Date().toISOString(); return x; }
  function user() { return localStorage.getItem(USER) || localStorage.getItem("hct_user_name") || "Care team member"; }
  function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function on(id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; }
  function now() { return new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
  function initials(n) { return String(n || "P").split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join("").toUpperCase(); }
  function id(x) { return String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function ward(x, i) { return /icu|critical/i.test(x) ? "ICU" : /ob|gyn|labor/i.test(x) ? "OB-GYN" : /peds/i.test(x) ? "Pediatrics" : /psych/i.test(x) ? "Psychiatry" : /surg|ortho/i.test(x) ? "Surgical" : /ed|emergency/i.test(x) ? "Emergency" : ["Medical", "ICU", "Surgical", "OB-GYN"][i % 4]; }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", patchHctHis);
  else patchHctHis();
})();
