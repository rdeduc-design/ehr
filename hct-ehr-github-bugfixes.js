(function () {
  const HIS_KEY = "hct_his_online_mode_v2";
  const ROLE_KEY = "hct_role";
  const PATCHED = "__hctGithubBugfixes";
  const MED_EMPTY_TEXT = /^(|drug reference|use per provider order and approved indication\.?|see official labeling|monitor expected and serious adverse reactions)$/i;

  function text(v) { return String(v == null ? "" : v); }
  function esc(v) { return text(v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(v) { return text(v).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function toast(msg) { if (typeof window.toast === "function") window.toast(msg); }

  function profileRole() {
    try { return norm(window.cloud && window.cloud.profile && window.cloud.profile.role); } catch (_) { return ""; }
  }

  function isInstructorAccount() {
    const r = profileRole();
    return /^(instructor|faculty|teacher|doctor|admin|administrator)$/.test(r);
  }

  function normalizeRole() {
    if (isInstructorAccount()) {
      const current = norm(localStorage.getItem(ROLE_KEY));
      if (/faculty|instructor|doctor|admin/.test(current)) localStorage.setItem(ROLE_KEY, "faculty");
      return;
    }
    if (/faculty|instructor|doctor|admin/i.test(localStorage.getItem(ROLE_KEY) || "")) {
      localStorage.setItem(ROLE_KEY, "student");
    }
  }

  function readHis() {
    try { return JSON.parse(localStorage.getItem(HIS_KEY) || "{}"); } catch (_) { return {}; }
  }

  function writeHis(s) {
    localStorage.setItem(HIS_KEY, JSON.stringify(s));
  }

  function entryKey(x) {
    if (!x || typeof x !== "object") return text(x);
    if (x.id) return "id:" + x.id;
    if (x.stamp && x.text) return "event:" + x.stamp + ":" + x.text;
    const copy = Object.assign({}, x);
    delete copy.when;
    delete copy.stamp;
    return JSON.stringify(copy);
  }

  function dedupeArray(arr) {
    const seen = new Set();
    return (Array.isArray(arr) ? arr : []).filter(function (x) {
      const key = entryKey(x);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function medNames() {
    const meds = window.HctMedicationInventory && Array.isArray(window.HctMedicationInventory.items) ? window.HctMedicationInventory.items : [];
    return new Set(meds.map(function (m) { return norm(m.generic || m.name); }).filter(Boolean));
  }

  function isMedicationLab(lab, names) {
    const test = norm(lab && lab.test);
    if (!test || !names.has(test)) return false;
    return /drug guide|drug reference|pitocin|premixed|uterotonic/i.test(text(lab.result) + " " + text(lab.note) + " " + text(lab.type));
  }

  function cleanupHisState() {
    const s = readHis();
    if (!s || !s.patients) return;
    let changed = false;
    const names = medNames();
    Object.keys(s.patients).forEach(function (id) {
      const p = s.patients[id];
      if (!p) return;
      ["orders", "vitals", "notes", "io", "care", "education", "meds"].forEach(function (k) {
        const next = dedupeArray(p[k]);
        if (JSON.stringify(next) !== JSON.stringify(p[k] || [])) changed = true;
        p[k] = next;
      });
      const labs = dedupeArray(p.labs).filter(function (lab) { return !isMedicationLab(lab, names); });
      if (JSON.stringify(labs) !== JSON.stringify(p.labs || [])) changed = true;
      p.labs = labs;
      if (p.name === "New Patient" && (p.firstName || p.lastName)) {
        p.name = [p.firstName, p.lastName].filter(Boolean).join(" ");
        changed = true;
      }
    });
    ["events", "queue"].forEach(function (k) {
      const next = dedupeArray(s[k]);
      if (JSON.stringify(next) !== JSON.stringify(s[k] || [])) changed = true;
      s[k] = next;
    });
    if (changed) writeHis(s);
  }

  function cleanMedicationInventory() {
    const inv = window.HctMedicationInventory;
    if (!inv || inv.__cleanedNoInfo || !Array.isArray(inv.items)) return;
    inv.items = inv.items.filter(function (item) {
      const useful = [item.uses, item.indications, item.action, item.nursing, item.precautions, item.sideEffects, item.adverseEffects]
        .map(function (v) { return text(v).trim(); })
        .filter(function (v) { return v && !MED_EMPTY_TEXT.test(v); });
      return norm(item.generic || item.name) && useful.length >= 2;
    });
    inv.__cleanedNoInfo = true;
    if (typeof inv.rebuildReferenceJson === "function") inv.rebuildReferenceJson();
  }

  function fixBranding(root) {
    document.title = "HCT EHR Simulation";
    (root || document).querySelectorAll("h1,h2,h3,strong,p,span,small,div,title").forEach(function (el) {
      if (!el || el.children.length) return;
      let value = el.textContent || "";
      value = value.replace(/HCT\s+ABT\s+SImulation/g, "HCT EHR Simulation")
        .replace(/HCT\s+ABT\s+Simulation/g, "HCT EHR Simulation")
        .replace(/Aptitude and behavioral profile assessment with secure review tools/g, "How Care Transforms");
      if (value !== el.textContent) el.textContent = value;
    });
  }

  function removeDuplicateButtons(root) {
    (root || document).querySelectorAll(".actions,.toolbar,.topbar,.hisx-export,.hisx-cardhead,.hisx-actions,.userbar,.nav-actions").forEach(function (wrap) {
      const seen = new Set();
      Array.from(wrap.querySelectorAll("button,input[type='button']")).forEach(function (btn) {
        const label = norm(btn.textContent || btn.value || btn.id);
        if (!label) return;
        const key = label + "|" + (btn.getAttribute("id") || "") + "|" + (btn.getAttribute("data-his-module") || btn.getAttribute("data-hisx-mod") || "");
        if (/^(export json|import json|saved|save|submit chart|help tour)$/.test(label) && seen.has(key)) btn.remove();
        else seen.add(key);
      });
    });
  }

  function forceDrugSidebar() {
    document.querySelectorAll(".drug-reference-panel").forEach(function (panel) {
      Object.assign(panel.style, { position: "fixed", top: "0", right: "0", bottom: "0", left: "auto", height: "100vh", maxHeight: "100vh", zIndex: "2147483000", overflow: "auto" });
      panel.classList.add("open");
    });
  }

  function roleGateUi() {
    const role = document.getElementById("his-role");
    if (!role) return;
    const field = role.closest("label") || role.parentElement;
    if (!isInstructorAccount()) {
      role.value = "student";
      Array.from(role.options).forEach(function (o) { if (/faculty/i.test(o.textContent || o.value)) o.remove(); });
      if (field) field.classList.add("hct-role-locked");
    } else {
      const faculty = Array.from(role.options).find(function (o) { return /faculty/i.test(o.textContent || o.value); });
      if (!faculty) role.insertAdjacentHTML("beforeend", '<option value="faculty">Faculty</option>');
    }
  }

  function injectPatientFields() {
    const add = document.getElementById("his-add-patient");
    if (!add || document.getElementById("hct-bugfix-first")) return;
    const wrap = document.createElement("div");
    wrap.className = "hct-bugfix-patient-fields";
    wrap.innerHTML = '<input id="hct-bugfix-first" placeholder="First name"><input id="hct-bugfix-last" placeholder="Last name"><input id="hct-bugfix-mrn" placeholder="MRN"><input id="hct-bugfix-dx" placeholder="Diagnosis"><select id="hct-bugfix-ward"><option>Medical</option><option>ICU</option><option>Emergency</option><option>OB-GYN</option><option>Pediatrics</option><option>Surgical</option><option>Psychiatry</option><option>Neurology</option></select><input id="hct-bugfix-room" placeholder="Room"><select id="hct-bugfix-status"><option>Stable</option><option>Admitted</option><option>Urgent</option><option>Critical</option></select>';
    add.parentElement.insertBefore(wrap, add);
  }

  function addNamedPatient() {
    if (!isInstructorAccount()) return toast("Instructor account required");
    const first = document.getElementById("hct-bugfix-first") && document.getElementById("hct-bugfix-first").value.trim();
    const last = document.getElementById("hct-bugfix-last") && document.getElementById("hct-bugfix-last").value.trim();
    const dx = document.getElementById("hct-bugfix-dx") && document.getElementById("hct-bugfix-dx").value.trim();
    if (!first || !last || !dx) return toast("First name, last name, and diagnosis are required");
    const s = readHis();
    s.patients = s.patients || {};
    s.events = Array.isArray(s.events) ? s.events : [];
    const id = "P" + Date.now();
    const name = first + " " + last;
    s.patients[id] = {
      id: id,
      firstName: first,
      lastName: last,
      name: name,
      initials: (first[0] + last[0]).toUpperCase(),
      mrn: (document.getElementById("hct-bugfix-mrn") && document.getElementById("hct-bugfix-mrn").value.trim()) || "MRN-" + String(Date.now()).slice(-5),
      diagnosis: dx,
      ward: (document.getElementById("hct-bugfix-ward") && document.getElementById("hct-bugfix-ward").value) || "Medical",
      room: (document.getElementById("hct-bugfix-room") && document.getElementById("hct-bugfix-room").value.trim()) || "",
      status: (document.getElementById("hct-bugfix-status") && document.getElementById("hct-bugfix-status").value) || "Admitted",
      age: "", sex: "", allergies: "NKDA", attending: "", nurse: "", photo: "",
      orders: [], vitals: [], meds: [], labs: [], notes: [], io: [], care: [], education: [],
      assessment: {}, assessmentNote: "", sbar: { s: "", b: "", a: "", r: "" }
    };
    s.selected = id;
    s.module = "chart";
    s.events.unshift({ id: "evt" + Date.now(), text: "Added patient", patient: name, by: localStorage.getItem("hct_his_online_username") || "Care team member", when: new Date().toLocaleString(), stamp: new Date().toISOString() });
    writeHis(s);
    if (typeof window.render === "function") window.render();
  }

  function postLabSafely() {
    if (!isInstructorAccount()) return toast("Instructor account required");
    const test = document.getElementById("l-test") && document.getElementById("l-test").value.trim();
    if (!test) return toast("Enter the lab test or imaging study");
    const names = medNames();
    if (names.has(norm(test))) return toast("Use Labs & Imaging for tests, not medication names");
    return null;
  }

  function afterRender() {
    normalizeRole();
    cleanMedicationInventory();
    cleanupHisState();
    fixBranding(document);
    removeDuplicateButtons(document);
    roleGateUi();
    injectPatientFields();
    forceDrugSidebar();
  }

  function patchRender() {
    if (window[PATCHED]) return;
    window[PATCHED] = true;
    const baseRender = window.render;
    if (typeof baseRender === "function") {
      window.render = function () {
        const result = baseRender.apply(this, arguments);
        setTimeout(afterRender, 0);
        return result;
      };
    }

    const patchHis = function () {
      if (!window.HctHis || window.HctHis.__githubBugfixes) return;
      const base = window.HctHis;
      window.HctHis = Object.assign({}, base, {
        __githubBugfixes: true,
        renderPage: function () {
          normalizeRole();
          cleanupHisState();
          return base.renderPage ? base.renderPage.apply(base, arguments) : "";
        },
        bindPage: function () {
          if (base.bindPage) base.bindPage.apply(base, arguments);
          afterRender();
        },
        open: function () {
          normalizeRole();
          if (base.open) return base.open.apply(base, arguments);
        }
      });
    };
    patchHis();
    setTimeout(patchHis, 500);
    setTimeout(patchHis, 1200);
  }

  document.addEventListener("click", function (e) {
    const add = e.target && e.target.closest && e.target.closest("#his-add-patient");
    if (add && document.getElementById("hct-bugfix-first")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      addNamedPatient();
      return;
    }
    const lab = e.target && e.target.closest && e.target.closest("#add-lab");
    if (lab) {
      const blocked = postLabSafely();
      if (blocked !== null) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  document.addEventListener("click", function () { setTimeout(afterRender, 60); }, true);
  document.addEventListener("change", function () { setTimeout(afterRender, 60); }, true);
  document.addEventListener("DOMContentLoaded", function () { patchRender(); afterRender(); });
  patchRender();
  setTimeout(afterRender, 0);
  setTimeout(afterRender, 800);
})();
