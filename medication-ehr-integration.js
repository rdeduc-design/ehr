(function () {
  const HIS_KEY = "hct_his_v1";
  const ONLINE_KEY = "hct_his_online_mode_v2";
  const RELOAD_FLAG = "hct_med_inventory_seeded_v1";

  function handbook() { return window.HctMedicationInventory; }
  function parse(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function now() { return new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function pharmacyItem(item) {
    return {
      id: item.id,
      name: item.name,
      onHand: item.onHand,
      par: item.par,
      category: item.category,
      aliases: item.aliases,
      brand: item.brand,
      generic: item.generic,
      doses: item.doses,
      availability: item.availability,
      handbookId: item.id,
      requested: 0
    };
  }

  function stockItem(item) {
    return {
      id: item.id,
      name: item.name,
      qty: item.onHand,
      par: item.par,
      category: item.category,
      aliases: item.aliases,
      brand: item.brand,
      generic: item.generic,
      doses: item.doses,
      availability: item.availability,
      handbookId: item.id
    };
  }

  function mergeById(list, seeded) {
    let changed = false;
    seeded.forEach(seed => {
      const existing = list.find(x => x.id === seed.id || x.name === seed.name);
      if (!existing) {
        list.push(seed);
        changed = true;
      } else {
        ["category", "aliases", "brand", "generic", "doses", "availability", "handbookId"].forEach(k => {
          if (!existing[k] && seed[k]) { existing[k] = seed[k]; changed = true; }
        });
        if (existing.par == null) { existing.par = seed.par; changed = true; }
        if (existing.onHand == null && seed.onHand != null) { existing.onHand = seed.onHand; changed = true; }
      }
    });
    return changed;
  }

  function seedOfflineStorage() {
    const h = handbook();
    if (!h) return false;
    const state = parse(HIS_KEY) || { inventory: {}, labStatus: {}, medStatus: {}, supplyRequests: [] };
    state.inventory = state.inventory || {};
    state.inventory.pharmacy = Array.isArray(state.inventory.pharmacy) ? state.inventory.pharmacy : [];
    state.inventory.supplies = Array.isArray(state.inventory.supplies) ? state.inventory.supplies : [];
    state.labStatus = state.labStatus || {};
    state.medStatus = state.medStatus || {};
    state.supplyRequests = Array.isArray(state.supplyRequests) ? state.supplyRequests : [];
    const changed = mergeById(state.inventory.pharmacy, h.items.map(pharmacyItem));
    if (changed) save(HIS_KEY, state);
    return changed;
  }

  function seedOnlineStorage() {
    const h = handbook();
    if (!h) return false;
    const state = parse(ONLINE_KEY) || {};
    state.stock = state.stock || {};
    let changed = false;
    h.items.forEach(item => {
      const seed = stockItem(item);
      const existingKey = Object.keys(state.stock).find(k => k === seed.id || state.stock[k].name === seed.name);
      if (!existingKey) {
        state.stock[seed.id] = seed;
        changed = true;
      } else {
        const current = state.stock[existingKey];
        ["category", "aliases", "brand", "generic", "doses", "availability", "handbookId"].forEach(k => {
          if (!current[k] && seed[k]) { current[k] = seed[k]; changed = true; }
        });
        if (current.par == null) { current.par = seed.par; changed = true; }
        if (current.qty == null) { current.qty = seed.qty; changed = true; }
      }
    });
    if (changed) save(ONLINE_KEY, state);
    return changed;
  }

  function drugButton(item) {
    return item ? `<button class="drug-info-btn" data-med-info="${esc(item.id)}" title="Open concise drug handbook card">Drug guide</button>` : "";
  }

  function annotateDrugText(root) {
    const h = handbook();
    if (!h) return;
    (root || document).querySelectorAll(".his-table td strong, .his-row strong, .hisx-stock b, .hisx-list li b").forEach(el => {
      if (el.dataset.medAnnotated || el.parentElement.querySelector(".drug-info-btn")) return;
      const item = h.find(el.textContent || "");
      if (!item) return;
      el.dataset.medAnnotated = "1";
      el.insertAdjacentHTML("afterend", " " + drugButton(item));
    });
    h.bindDrugCards(root || document);
  }

  function syncDoseSelect(selectId, doseId, qtyId) {
    const h = handbook();
    const med = document.getElementById(selectId);
    const dose = document.getElementById(doseId);
    if (!h || !med || !dose) return;
    const sync = () => {
      const item = h.find(med.value);
      if (item) dose.innerHTML = h.doseOptions(item);
      const qty = document.getElementById(qtyId);
      const online = parse(ONLINE_KEY);
      const stock = online && online.stock && online.stock[med.value];
      if (qty && stock) qty.max = Math.max(1, Number(stock.qty || 1));
    };
    if (!med.dataset.medDoseBound) {
      med.dataset.medDoseBound = "1";
      med.addEventListener("change", sync);
    }
    sync();
  }

  function enhanceOnlineOrderControls() {
    const med = document.getElementById("m-id");
    const sched = document.getElementById("m-sched");
    if (!med || !sched) return;
    const dose = document.getElementById("m-dose");
    if (dose && dose.tagName !== "SELECT") {
      const replacement = document.createElement("select");
      replacement.id = "m-dose";
      replacement.className = "drug-dose-select";
      dose.replaceWith(replacement);
    }
    if (!document.getElementById("m-qty")) {
      const qty = document.createElement("input");
      qty.id = "m-qty";
      qty.type = "number";
      qty.min = "1";
      qty.value = "1";
      qty.placeholder = "Qty";
      sched.parentNode.insertBefore(qty, sched);
    }
    syncDoseSelect("m-id", "m-dose", "m-qty");
  }

  function requestOnlineMedication(e) {
    const button = e.target.closest && e.target.closest("#request-med");
    if (!button || !document.getElementById("m-qty")) return;
    const state = parse(ONLINE_KEY);
    if (!state || !state.selected || !state.patients || !state.stock) return;
    const patient = state.patients[state.selected];
    const medId = document.getElementById("m-id")?.value || "";
    const med = state.stock[medId];
    if (!patient || !med) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const req = {
      id: "rx" + Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      medId: med.id,
      name: med.name,
      dose: document.getElementById("m-dose")?.value || "",
      qty: Math.max(1, Number(document.getElementById("m-qty")?.value || 1)),
      schedule: document.getElementById("m-sched")?.value || "",
      note: document.getElementById("m-note")?.value || "",
      status: "Requested",
      by: localStorage.getItem("hct_his_online_username") || localStorage.getItem("hct_user_name") || "Care team member",
      when: now(),
      stamp: new Date().toISOString()
    };
    patient.meds = Array.isArray(patient.meds) ? patient.meds : [];
    state.queue = Array.isArray(state.queue) ? state.queue : [];
    patient.meds.push(req);
    state.queue.push(req);
    state.events = Array.isArray(state.events) ? state.events : [];
    state.events.unshift({ id: "evt" + Date.now(), text: "Requested medication from pharmacy", patient: patient.name, by: req.by, when: req.when, stamp: req.stamp });
    save(ONLINE_KEY, state);
    if (window.HctHis && typeof window.HctHis.sync === "function") window.HctHis.sync();
  }

  function dispenseOnlineMedication(e) {
    const button = e.target.closest && e.target.closest("[data-dispense]");
    if (!button) return;
    const state = parse(ONLINE_KEY);
    const req = state && Array.isArray(state.queue) ? state.queue.find(x => x.id === button.dataset.dispense) : null;
    if (!req || !req.qty || Number(req.qty) <= 1) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const stock = state.stock && state.stock[req.medId];
    if (stock) stock.qty = Math.max(0, Number(stock.qty || 0) - Math.max(1, Number(req.qty || 1)));
    req.status = "Dispensed";
    req.dispensedBy = localStorage.getItem("hct_his_online_username") || localStorage.getItem("hct_user_name") || "Care team member";
    req.dispensedAt = now();
    const patient = state.patients && state.patients[req.patientId];
    const chartReq = patient && Array.isArray(patient.meds) ? patient.meds.find(x => x.id === req.id) : null;
    if (chartReq) Object.assign(chartReq, req);
    save(ONLINE_KEY, state);
    if (window.HctHis && typeof window.HctHis.sync === "function") window.HctHis.sync();
  }

  function enhance() {
    annotateDrugText(document);
    enhanceOnlineOrderControls();
    syncDoseSelect("his-med-item", "his-med-dose", "his-med-qty");
  }

  const changed = seedOfflineStorage() || seedOnlineStorage();
  if (changed && !sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, "1");
    location.reload();
    return;
  }

  document.addEventListener("click", requestOnlineMedication, true);
  document.addEventListener("click", dispenseOnlineMedication, true);
  document.addEventListener("DOMContentLoaded", enhance);
  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
})();
