(function(){
  const KEY='hct_his_enterprise_v1';
  const CH='hct-his-enterprise-live';
  const cid=localStorage.hct_his_enterprise_client||(localStorage.hct_his_enterprise_client='his_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7));
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function write(his){try{localStorage.setItem(KEY,JSON.stringify(his))}catch(e){}}
  function mergeStock(base=[],incoming=[]){const map=new Map();base.forEach(i=>map.set(i.id,{...i}));incoming.forEach(i=>map.set(i.id,{...(map.get(i.id)||{}),...i}));return [...map.values()]}
  function mergeEvents(a=[],b=[]){const seen=new Set(),out=[];[...a,...b].forEach(e=>{const k=`${e.stamp}|${e.dept}|${e.text}|${e.patient}`;if(!seen.has(k)){seen.add(k);out.push(e)}});return out.slice(0,100)}
  function merge(local={},remote={}){const rt=Number(remote.updatedAt||0),lt=Number(local.updatedAt||0),remoteNewer=rt>=lt;return {...local,...remote,patients:{...(local.patients||{}),...(remote.patients||{})},added:{...(local.added||{}),...(remote.added||{})},removed:{...(local.removed||{}),...(remote.removed||{})},events:mergeEvents(remote.events||[],local.events||[]),stock:remoteNewer?mergeStock(local.stock||[],remote.stock||[]):mergeStock(remote.stock||[],local.stock||[]),updatedAt:Math.max(rt,lt)}}
  function guard(msg,sendBack){if(!msg||msg.cid===cid||msg.type!=='snapshot'||!msg.payload?.his)return msg;const local=read(),incoming=msg.payload.his;if(Number(incoming.updatedAt||0)<Number(local.updatedAt||0)){sendBack?.({type:'snapshot',payload:{his:local},cid,time:Date.now()});return null}const merged=merge(local,incoming);write(merged);msg.payload.his=merged;return msg}
  function patchBroadcastChannel(){const Native=window.BroadcastChannel;if(!Native||Native.__hctHisGuarded)return;function GuardedChannel(name){const bc=new Native(name);if(name!==CH)return bc;let current=null;Object.defineProperty(bc,'onmessage',{get(){return current},set(fn){current=function(e){const next=guard(e.data,m=>bc.postMessage(m));if(next&&fn)fn.call(bc,{...e,data:next})}}});return bc}GuardedChannel.prototype=Native.prototype;GuardedChannel.__hctHisGuarded=true;window.BroadcastChannel=GuardedChannel}
  function patchSupabase(){try{const client=cloud?.client;if(!client||client.__hctHisGuarded||!client.channel)return;const oldChannel=client.channel.bind(client);client.channel=function(name,opts){const channel=oldChannel(name,opts);if(name!==CH||channel.__hctHisGuarded)return channel;const oldOn=channel.on.bind(channel);const oldSend=channel.send?.bind(channel);channel.on=function(type,filter,cb){if(type==='broadcast'&&filter?.event==='his')return oldOn(type,filter,e=>{const next=guard(e.payload,m=>oldSend?.({type:'broadcast',event:'his',payload:m}));if(next&&cb)cb({...e,payload:next})});return oldOn(type,filter,cb)};channel.__hctHisGuarded=true;return channel};client.__hctHisGuarded=true}catch(e){}}
  patchBroadcastChannel();
  patchSupabase();
})();
