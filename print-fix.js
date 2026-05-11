(function(){
  const nativePrint = window.print.bind(window);

  function cleanup(cls){
    document.body.classList.remove(cls);
    window.removeEventListener('afterprint', afterPrintCleanup);
  }

  let activePrintClass = '';
  function afterPrintCleanup(){
    if(activePrintClass) cleanup(activePrintClass);
    activePrintClass = '';
  }

  window.printWithMode = function(mode){
    const cls = mode === 'band' ? 'print-band-mode' : 'print-report-mode';
    document.body.classList.remove('print-band-mode', 'print-report-mode');
    document.body.classList.add(cls);
    activePrintClass = cls;

    window.addEventListener('afterprint', afterPrintCleanup, {once:true});
    requestAnimationFrame(()=>{
      nativePrint();
      setTimeout(afterPrintCleanup, 10000);
    });
  };

  window.print = function(){
    window.printWithMode(document.getElementById('band-modal') ? 'band' : 'report');
  };
})();
