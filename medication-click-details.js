(function () {
  const h = window.HctMedicationInventory;
  if (!h || !Array.isArray(h.items)) return;

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function cardHtml(raw) {
    const item = typeof raw === "object" ? raw : h.find(raw);
    if (!item) return "";
    const pairs = [
      ["Mechanism of Action", item.action],
      ["Classification", item.classification],
      ["Uses", item.uses],
      ["Precautions", item.precautions],
      ["Nursing Considerations", item.nursing],
      ["Indications", item.indications],
      ["Side Effects", item.sideEffects],
      ["Adverse Effects", item.adverseEffects]
    ];
    return `<div class="drug-popover" role="dialog" aria-label="${esc(item.generic)} medication details">
      <div class="drug-popover-head">
        <div><small>${esc(item.category)}</small><h3>${esc(item.generic)}</h3><p>Brand: ${esc(item.brand)} | ${esc(item.availability)}</p></div>
        <button class="drug-popover-close" data-drug-close aria-label="Close">x</button>
      </div>
      <div class="drug-dose-row">${(item.doses || []).map(d => `<span>${esc(d)}</span>`).join("")}</div>
      <dl>${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v || "See current facility policy and official label for final verification.")}</dd></div>`).join("")}</dl>
    </div>`;
  }

  function showCard(target, id) {
    const item = h.find(id);
    if (!item) return;
    document.querySelectorAll(".drug-popover").forEach(el => el.remove());
    const wrap = document.createElement("div");
    wrap.innerHTML = cardHtml(item);
    const pop = wrap.firstElementChild;
    document.body.appendChild(pop);
    const rect = target.getBoundingClientRect();
    const width = Math.min(420, window.innerWidth - 24);
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.left));
    const top = Math.min(window.innerHeight - Math.min(560, window.innerHeight - 24) - 12, Math.max(12, rect.bottom + 8));
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.querySelector("[data-drug-close]")?.addEventListener("click", () => pop.remove());
  }

  function resetButton(el) {
    if (!el || !el.dataset.medInfo) return null;
    const clone = el.cloneNode(true);
    clone.dataset.drugBound = "";
    el.replaceWith(clone);
    return clone;
  }

  function bindDrugCards(root) {
    (root || document).querySelectorAll("[data-med-info]").forEach(el => {
      const button = el.dataset.clickOnlyBound ? el : resetButton(el);
      if (!button || button.dataset.clickOnlyBound) return;
      button.dataset.clickOnlyBound = "1";
      button.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        showCard(button, button.dataset.medInfo);
      });
    });
  }

  function medRowContext(el) {
    if (el.closest(".his-row, .hisx-row, .his-table, .hisx-table")) return true;
    const row = el.closest("tr");
    if (!row) return false;
    const rest = Array.from(row.children).slice(1).map(c => c.textContent || "").join(" ").toLowerCase();
    return /\b(po|iv|im|sq|subq|nebulized|route|dose|freq|stat|scheduled|prn|pending|given|hold|not given|dispensed|requested)\b/.test(rest);
  }

  function addButton(el, item) {
    if (!item || el.parentElement?.querySelector(".drug-info-btn")) return;
    el.insertAdjacentHTML("afterend", ` <button class="drug-info-btn" data-med-info="${esc(item.id)}" title="Open medication details">Details</button>`);
  }

  function annotateMedicationText(root) {
    const scope = root || document;
    scope.querySelectorAll("td:first-child strong, td:first-child, .his-row strong, .hisx-row strong, .his-table td strong, .hisx-table td strong").forEach(el => {
      if (!medRowContext(el)) return;
      addButton(el, h.find(el.textContent || ""));
    });
    bindDrugCards(scope);
  }

  function refresh() {
    h.cardHtml = cardHtml;
    h.bindDrugCards = bindDrugCards;
    annotateMedicationText(document);
  }

  h.cardHtml = cardHtml;
  h.bindDrugCards = bindDrugCards;
  document.addEventListener("click", e => {
    if (!e.target.closest(".drug-popover") && !e.target.closest("[data-med-info]")) {
      document.querySelectorAll(".drug-popover").forEach(el => el.remove());
    }
  }, true);
  document.addEventListener("DOMContentLoaded", refresh);
  const observer = new MutationObserver(() => {
    clearTimeout(observer._t);
    observer._t = setTimeout(refresh, 80);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  refresh();
})();
