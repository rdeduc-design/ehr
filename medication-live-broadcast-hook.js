(function () {
  const KEYS = ["hct_his_v1", "hct_his_online_mode_v1", "hct_his_online_mode_v2"];
  const channelName = "hct-ehr-medication-live-v3";
  const clientId = localStorage.hct_med_live_client || (localStorage.hct_med_live_client = "medlive_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
  let bc = null, live = null, timer = 0, pendingKey = "";
  const originalSetItem = localStorage.setItem.bind(localStorage);

  function parse(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } }
  function connect() {
    try { bc = bc || new BroadcastChannel(channelName); } catch (_) {}
    try {
      if (!live && window.cloud && cloud.client && cloud.client.channel) {
        live = cloud.client.channel(channelName + "-hook", { config: { broadcast: { ack: false } } });
        live.subscribe();
      }
    } catch (_) {}
  }
  function schedule(key) {
    pendingKey = key;
    clearTimeout(timer);
    timer = setTimeout(publish, 220);
  }
  function publish() {
    connect();
    if (!pendingKey) return;
    const payload = { cid: clientId, key: pendingKey, state: parse(pendingKey), sentAt: Date.now() };
    try { bc && bc.postMessage(payload); } catch (_) {}
    try { live && live.send({ type: "broadcast", event: "state", payload }); } catch (_) {}
    pendingKey = "";
  }

  localStorage.setItem = function (key, value) {
    originalSetItem(key, value);
    if (KEYS.includes(key)) schedule(key);
  };
  document.addEventListener("DOMContentLoaded", connect);
})();
