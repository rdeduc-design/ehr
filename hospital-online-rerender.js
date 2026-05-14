(function () {
  function refreshHis() {
    try {
      if (window.state && window.state.tab === "his" && typeof window.render === "function") window.render();
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refreshHis);
  else refreshHis();
})();
