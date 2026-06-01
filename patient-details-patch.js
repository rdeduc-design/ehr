(function(){
  function patchNav(){
    const prev = window.renderNav;
    if(!prev) return;
    window.renderNav = function(){
      const t = (typeof state !== 'undefined') ? state.tab : '';
      const active = t === 'patient-details' ? ' active' : '';
      const btn = `<button class="nav-btn${active}" data-tab="patient-details">Edit Details</button>`;
      return prev().replace(
        /(<div class="group">Patient Details<\/div>)/,
        '$1\n    ' + btn
      );
    };
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', patchNav);
  } else {
    patchNav();
  }
})();
