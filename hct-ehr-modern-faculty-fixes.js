(function(){
  "use strict";

  const FACULTY_ROLES = new Set(["instructor", "faculty", "teacher", "admin", "administrator", "educator"]);
  const FACULTY_TABS = new Set(["modulebuilder", "dashboard", "statusboard"]);

  function roleOf(){
    try { return String((window.cloud?.profile?.role || "")).trim().toLowerCase(); }
    catch(_) { return ""; }
  }

  function userEmail(){
    try {
      return String(window.cloud?.session?.user?.email || window.cloud?.profile?.email || "").trim().toLowerCase();
    } catch(_) { return ""; }
  }

  function analyticsFlag(){
    const p = window.cloud?.profile || {};
    return p.analytics_access === true || p.dashboard_access === true || p.faculty_access === true || p.role_access === "faculty";
  }

  function allowedEmail(){
    const email = userEmail();
    const allowed = window.ANALYTICS_ALLOWED_EMAILS;
    return !!email && !!allowed && typeof allowed.has === "function" && allowed.has(email);
  }

  function canUseFaculty(){
    return FACULTY_ROLES.has(roleOf()) || analyticsFlag() || allowedEmail();
  }

  function applyFacultyAccessPatch(){
    window.isInstructor = function(){ return FACULTY_ROLES.has(roleOf()); };
    window.canAccessAnalytics = canUseFaculty;
    window.canUseFacultyTools = canUseFaculty;
    window.isFacultyTab = function(tab){ return FACULTY_TABS.has(tab) && !canUseFaculty(); };
  }

  function refreshIfFacultyTabUnlocked(){
    try {
      if (!window.state || typeof window.render !== "function") return;
      if (FACULTY_TABS.has(window.state.tab) && canUseFaculty()) window.render();
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
