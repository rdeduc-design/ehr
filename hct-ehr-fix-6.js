(function(){
  "use strict";

  const HIS_KEY = "hct_his_online_mode_v2";
  const COMMAND_WARD_KEY = "hct_his_command_ward_v1";
  const STANDARD_WARDS = ["Medical", "ICU", "Emergency", "OB-GYN", "Pediatrics", "Surgical", "Psychiatry", "Neurology"];

  function esc(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c];
    });
  }

  function readHisState(){
    try { return JSON.parse(localStorage.getItem(HIS_KEY) || "{}"); }
    catch (_) { return {}; }
  }

  function writeHisState(state){
    try { localStorage.setItem(HIS_KEY, JSON.stringify(state)); }
    catch (_) {}
  }

  function patientList(state){
    return Object.values((state && state.patients) || {}).filter(function(patient){ return patient && !patient.removed; });
  }

  function wardList(state){
    const names = new Set(STANDARD_WARDS);
    patientList(state).forEach(function(patient){ if (patient.ward) names.add(patient.ward); });
    return ["All wards"].concat(Array.from(names).filter(Boolean).sort());
  }

  function activeWard(){
    return localStorage.getItem(COMMAND_WARD_KEY) || "All wards";
  }

  function setActiveWard(ward){
    localStorage.setItem(COMMAND_WARD_KEY, ward || "All wards");
  }

  function dedupeCloudSaveIndicators(){
    document.querySelectorAll(".cloud-status").forEach(function(status){
      const indicators = Array.from(status.querySelectorAll(".sync-indicator"));
      indicators.slice(1).forEach(function(node){ node.remove(); });
    });
  }

  function enhanceWardDropdown(){
    const field = document.getElementById("p-ward");
    if (!field) return;
    const state = readHisState();
    const wards = wardList(state).filter(function(ward){ return ward !== "All wards"; });
    const current = field.value || "Medical";
    if (field.tagName === "SELECT") {
      if (field.dataset.fix6WardOptions === wards.join("|")) return;
      field.innerHTML = wards.map(function(ward){ return '<option value="' + esc(ward) + '"' + (ward === current ? " selected" : "") + '>' + esc(ward) + '</option>'; }).join("");
      field.dataset.fix6WardOptions = wards.join("|");
      return;
    }
    const select = document.createElement("select");
    select.id = field.id;
    select.className = field.className;
    select.dataset.fix6WardOptions = wards.join("|");
    select.innerHTML = wards.map(function(ward){ return '<option value="' + esc(ward) + '"' + (ward === current ? " selected" : "") + '>' + esc(ward) + '</option>'; }).join("");
    field.replaceWith(select);
  }

  function commandPatientRows(state){
    const ward = activeWard();
    const patients = patientList(state).filter(function(patient){ return ward === "All wards" || patient.ward === ward; });
    const shown = ward === "All wards" ? patients.filter(function(patient){ return patient.status !== "Stable"; }) : patients;
    if (!shown.length) return '<p class="hisx-empty">No patients in this ward.</p>';
    return shown.slice(0, 24).map(function(patient){
      return '<button class="hisx-patientrow" data-fix6-open-chart="' + esc(patient.id) + '">' + avatar(patient) + '<span><b>' + esc(patient.name) + '</b><small>' + esc([patient.ward, patient.room, patient.diagnosis].filter(Boolean).join(" / ")) + '</small></span>' + badge(patient.status) + '</button>';
    }).join("");
  }

  function avatar(patient){
    if (patient.photo) return '<span class="hisx-avatar photo" style="background-image:url(' + esc(patient.photo) + ')"></span>';
    return '<span class="hisx-avatar">' + esc(patient.initials || initials(patient.name)) + '</span>';
  }

  function initials(name){
    return String(name || "P").split(/\s+/).filter(Boolean).slice(0, 2).map(function(part){ return part[0]; }).join("").toUpperCase();
  }

  function badge(status){
    const key = String(status || "stable").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return '<span class="hisx-badge ' + esc(key) + '">' + esc(status || "Stable") + '</span>';
  }

  function enhanceCommandCenterWard(){
    const root = document.querySelector(".hisx-modern");
    if (!root) return;
    const state = readHisState();
    if (state.module && state.module !== "command") return;
    const content = root.querySelector(".hisx-content");
    if (!content) return;
    const cards = Array.from(content.querySelectorAll(".hisx-card"));
    const priorityCard = cards.find(function(card){ return /Priority Patients/i.test(card.textContent); });
    if (!priorityCard) return;

    let toolbar = content.querySelector(".hisx-command-filter");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "hisx-command-filter";
      content.insertBefore(toolbar, content.firstChild);
    }
    const current = activeWard();
    toolbar.innerHTML = '<label><span>Ward</span><select id="his-command-ward-filter">' + wardList(state).map(function(ward){ return '<option value="' + esc(ward) + '"' + (ward === current ? " selected" : "") + '>' + esc(ward) + '</option>'; }).join("") + '</select></label><strong>' + esc(current === "All wards" ? "Command Center" : current + " only") + '</strong>';
    toolbar.querySelector("select").addEventListener("change", function(event){
      setActiveWard(event.target.value);
      enhanceCommandCenterWard();
    });

    const title = priorityCard.querySelector("h3");
    if (title) title.textContent = current === "All wards" ? "Priority Patients" : current + " Patients";
    Array.from(priorityCard.children).forEach(function(child){ if (!child.classList.contains("hisx-cardhead")) child.remove(); });
    priorityCard.insertAdjacentHTML("beforeend", commandPatientRows(state));
    priorityCard.querySelectorAll("[data-fix6-open-chart]").forEach(function(button){
      button.addEventListener("click", function(){
        const next = readHisState();
        next.selected = button.dataset.fix6OpenChart;
        next.module = "chart";
        writeHisState(next);
        if (typeof window.render === "function") window.render();
      });
    });

    content.querySelectorAll(".hisx-ward").forEach(function(row){
      const ward = row.querySelector("strong")?.textContent?.trim();
      if (!ward) return;
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.classList.toggle("active", ward === current);
      row.onclick = function(){ setActiveWard(ward); enhanceCommandCenterWard(); };
      row.onkeydown = function(event){ if (event.key === "Enter" || event.key === " ") { event.preventDefault(); row.click(); } };
    });
  }

  function enhance(){
    dedupeCloudSaveIndicators();
    enhanceWardDropdown();
    enhanceCommandCenterWard();
  }

  function wrapRender(){
    if (window.__hctFix6RenderWrapped || typeof window.render !== "function") return;
    window.__hctFix6RenderWrapped = true;
    const original = window.render;
    window.render = function(){
      const result = original.apply(this, arguments);
      setTimeout(enhance, 0);
      return result;
    };
  }

  function install(){
    wrapRender();
    enhance();
    setTimeout(enhance, 250);
    setTimeout(enhance, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
