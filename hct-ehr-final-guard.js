(function(){
  'use strict';
  function isInstructor(){
    try { return String((window.cloud || cloud || {}).profile?.role || '').trim().toLowerCase() === 'instructor'; }
    catch(_) { return false; }
  }
  function removeBuilder(){
    if (isInstructor()) return;
    document.querySelectorAll('.card').forEach(card => {
      const title = (card.querySelector('.card-head h3, h3')?.textContent || '').trim().toLowerCase();
      if (title.includes('faculty scenario generator')) card.remove();
      if (card.querySelector('#fs-save,#fs-template,#fs-name,#fs-diagnosis')) card.remove();
    });
    document.querySelectorAll('[data-tab="modulebuilder"]').forEach(el => el.remove());
    try { if ((window.state || state).tab === 'modulebuilder') { (window.state || state).tab = 'summary'; if (typeof render === 'function') render(); } } catch(_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', removeBuilder); else removeBuilder();
  const observer = new MutationObserver(() => { clearTimeout(observer._t); observer._t = setTimeout(removeBuilder, 60); });
  observer.observe(document.documentElement, {childList:true, subtree:true});
  setInterval(removeBuilder, 700);
})();
