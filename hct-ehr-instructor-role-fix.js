(function () {
  const ROLE_KEY = "hct_role";

  function norm(v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function cloudRole() {
    try { return norm(window.cloud && window.cloud.profile && window.cloud.profile.role); } catch (_) { return ""; }
  }

  function isInstructorRole(role) {
    return /^(instructor|faculty|teacher|doctor|admin|administrator)$/.test(role);
  }

  function normalize() {
    const role = cloudRole();
    if (isInstructorRole(role)) {
      if (localStorage.getItem(ROLE_KEY) !== "faculty") localStorage.setItem(ROLE_KEY, "faculty");
    } else if (/faculty|instructor|doctor|admin/i.test(localStorage.getItem(ROLE_KEY) || "")) {
      localStorage.setItem(ROLE_KEY, "student");
    }
  }

  function rerenderOnce() {
    normalize();
    try { if (typeof window.render === "function") window.render(); } catch (_) {}
  }

  normalize();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rerenderOnce);
  else setTimeout(rerenderOnce, 0);
  setTimeout(rerenderOnce, 700);
})();
