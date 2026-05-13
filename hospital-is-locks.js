(function(){
  const KEY='hct_his_section_locks_v1';
  const CH='hct-his-enterprise-locks';
  const cid=localStorage.hct_his_enterprise_client||(localStorage.hct_his_enterprise_client='his_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7));
  let locks=load(), bc=null, liveChannel=null;
  function who(){try{return cloud?.profile?.full_name||cloud?.session?.user?.email||'Care team member'}catch(e){return'Care team member'}}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function save(){localStorage.setItem(KEY,JSON.stringify(clean(locks)))}
  function clean(x){Object.keys(x).forEach(k=>{if(!x[k]||x[k].expires<Date.now())delete x[k]});return x}
  function publish(){const msg={cid,locks:clean({...locks}),time:Date.now()};try{bc?.postMessage(msg)}catch(e){}try{liveChannel?.send({type:'broadcast',event:'his-locks',payload:msg})}catch(e){}}
  function apply(msg){if(!msg||msg.cid===cid||!msg.locks)return;Object.entries(msg.locks).forEach(([id,lock])=>{if(!locks[id]||Number(lock.expires||0)>Number(locks[id].expires||0))locks[id]=lock});locks=clean(locks);save();paint()}
  function sync(){if(!bc){try{bc=new BroadcastChannel(CH);bc.onmessage=e=>apply(e.data)}catch(e){}}try{if(cloud?.client?.channel&&!liveChannel){liveChannel=cloud.client.channel(CH,{config:{broadcast:{ack:true}}});liveChannel.on('broadcast',{event:'his-locks'},e=>apply(e.payload));liveChannel.subscribe(s=>{if(s==='SUBSCRIBED')publish()})}}catch(e){}}
  function claim(id){if(!id)return;locks=clean(locks);const cur=locks[id];if(cur&&cur.cid!==cid&&cur.expires>Date.now()){paint();return}locks[id]={cid,owner:who(),expires:Date.now()+60000};save();publish();paint()}
  function active(){return document.querySelector('.hisx-nav button.active[data-hisx-mod]')?.dataset.hisxMod||''}
  function label(text){const em=document.createElement('em');em.className='hisx-lock-note';em.textContent=text;return em}
  function banner(lock){let b=document.querySelector('.hisx-lock-banner');if(!lock){b?.remove();return}if(!b){b=document.createElement('div');b.className='hisx-lock-banner';document.querySelector('.hisx-top')?.after(b)}b.textContent=`${lock.owner} is currently working in this section. You can still view it, but it is dimmed to prevent duplicate edits.`}
  function paint(){clean(locks);document.querySelectorAll('.hisx-nav [data-hisx-mod]').forEach(btn=>{const lock=locks[btn.dataset.hisxMod];const mine=lock&&lock.cid===cid;const other=lock&&!mine&&lock.expires>Date.now();btn.classList.toggle('hisx-locked',!!other);btn.querySelector('.hisx-lock-note')?.remove();if(other)btn.appendChild(label(`${lock.owner} editing`))});const lock=locks[active()];const other=lock&&lock.cid!==cid&&lock.expires>Date.now();document.querySelector('.hisx-content')?.classList.toggle('hisx-section-locked',!!other);banner(other?lock:null)}
  function boot(){sync();document.addEventListener('click',e=>{const btn=e.target.closest('.hisx-nav [data-hisx-mod], [data-hisx-open]');if(!btn)return;setTimeout(()=>claim(btn.dataset.hisxMod||'orders'),0)});new MutationObserver(paint).observe(document.body,{childList:true,subtree:true});setInterval(()=>{const id=active();if(id)claim(id);paint()},30000);setInterval(paint,5000);setTimeout(()=>{if(active())claim(active());paint()},600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
