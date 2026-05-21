(function(){
  "use strict";

  const FACULTY_ROLES = new Set(["instructor", "faculty", "teacher", "admin", "administrator", "educator"]);
  const FACULTY_TABS = new Set(["modulebuilder", "dashboard", "statusboard"]);

  function appCloud(){
    try { if (typeof cloud !== "undefined") return cloud; } catch(_) {}
    return window.cloud || {};
  }

  function appState(){
    try { if (typeof state !== "undefined") return state; } catch(_) {}
    return window.state || null;
  }

  function roleOf(){
    const c = appCloud();
    return String((c.profile || {}).role || "").trim().toLowerCase();
  }

  function userEmail(){
    const c = appCloud();
    return String(c.session?.user?.email || c.profile?.email || "").trim().toLowerCase();
  }

  function analyticsFlag(){
    const p = appCloud().profile || {};
    return p.analytics_access === true || p.dashboard_access === true || p.faculty_access === true || p.role_access === "faculty";
  }

  function allowedEmail(){
    const email = userEmail();
    let allowed = window.ANALYTICS_ALLOWED_EMAILS;
    try { if (typeof ANALYTICS_ALLOWED_EMAILS !== "undefined") allowed = ANALYTICS_ALLOWED_EMAILS; } catch(_) {}
    return !!email && !!allowed && typeof allowed.has === "function" && allowed.has(email);
  }

  function canUseFaculty(){
    return FACULTY_ROLES.has(roleOf()) || analyticsFlag() || allowedEmail();
  }

  function expose(name, value){
    window[name] = value;
    try { eval(name + " = value"); } catch(_) {}
  }

  function applyFacultyAccessPatch(){
    expose("isInstructor", function(){ return FACULTY_ROLES.has(roleOf()); });
    expose("canAccessAnalytics", canUseFaculty);
    expose("canUseFacultyTools", canUseFaculty);
    expose("isFacultyTab", function(tab){ return FACULTY_TABS.has(tab) && !canUseFaculty(); });
  }

  function refreshIfFacultyTabUnlocked(){
    try {
      const s = appState();
      if (!s || typeof render !== "function") return;
      if (FACULTY_TABS.has(s.tab) && canUseFaculty()) render();
    } catch(err) {
      console.warn("Faculty dashboard refresh failed", err);
    }
  }

  function bindFloatingReferenceFallback(){
    const inv = window.HctMedicationInventory;
    if (!inv || inv.__floatingReferenceFallback) return;
    inv.__floatingReferenceFallback = true;
    const originalShow = inv.showCard;
    if (typeof originalShow === "function") {
      inv.showCard = function(){
        const result = originalShow.apply(this, arguments);
        requestAnimationFrame(() => {
          document.querySelectorAll(".drug-reference-panel").forEach(panel => panel.classList.add("open"));
        });
        return result;
      };
    }
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        document.querySelectorAll(".drug-reference-panel,.drug-reference-backdrop,.drug-verify-modal").forEach(el => el.remove());
      }
    });
  }

  function install(){
    applyFacultyAccessPatch();
    bindFloatingReferenceFallback();
    setTimeout(refreshIfFacultyTabUnlocked, 50);
    setTimeout(applyFacultyAccessPatch, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
