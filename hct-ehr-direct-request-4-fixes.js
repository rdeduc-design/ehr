(function () {
  "use strict";

  function g(name) {
    try { return window[name] || eval(name); } catch (_) { return window[name]; }
  }

  function expose(name, value) {
    window[name] = value;
    try { eval(name + " = value"); } catch (_) {}
  }

  function patchPrivacyConsent() {
    // Keep the consent notice on new account creation only. Existing signed-in
    // accounts should not be blocked by the separate post-login consent screen.
    expose("hasPrivacyConsent", function () { return true; });
  }

  function patchSignupConsentCopy() {
    var text = "I consent to HCT Institute collecting and processing my account details, simulation chart entries, assessment responses, scores, timestamps, and instructor review records for EHR simulation learning, clinical reasoning practice, academic feedback, security, and required institutional reporting under the Data Privacy Act of 2012 (RA 10173).";
    var box = document.querySelector(".signup-consent span");
    if (box && box.textContent !== text) box.textContent = text;

    document.querySelectorAll(".privacy-card").forEach(function (card) {
      if (!card.closest("#view-signup")) card.remove();
    });
  }

  function boot() {
    patchPrivacyConsent();
    patchSignupConsentCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  setInterval(boot, 1000);
  setTimeout(function () {
    boot();
    var render = g("render");
    if (typeof render === "function") render();
  }, 700);
})();
