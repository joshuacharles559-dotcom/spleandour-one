// notifications.js
// Small client-side helper to subscribe the browser for Web Push and send the subscription to your server.
(function(){
  if(!window.CONFIG) return;
  const ownerBtnId='notify-btn';
  const insertBtn=()=>{
    if(document.getElementById(ownerBtnId))return;
    const b=document.createElement('button');b.className='g';b.id=ownerBtnId;
    b.textContent='🔔';b.title='Notifications';
    const th=document.getElementById('th');if(th)th.before(b);
    b.onclick=()=>toggle();
    updateButton();
  };
  const updateButton=()=>{
    const b=document.getElementById(ownerBtnId);if(!b)return;
    if(Notification.permission==='granted')b.className='on';else if(Notification.permission==='denied')b.className='g';else b.className='g';
  };
  const urlBase64ToUint8Array=(base64String)=>{
    const padding='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
    const rawData=atob(base64);
    const outputArray=new Uint8Array(rawData.length);
    for(let i=0;i<rawData.length;++i)outputArray[i]=rawData.charCodeAt(i);
    return outputArray;
  };
  async function subscribe(){
    if(!('serviceWorker' in navigator))return alert('Service workers are not supported in this browser.');
    if(!window.CONFIG.pushPublicKey) return alert('Push public key not set. The site owner must paste a VAPID public key into config.js');
    const p=Notification.permission;
    if(p==='default'){
      const r=await Notification.requestPermission(); if(r!=='granted')return alert('Permission denied');
    } else if(p==='denied') return alert('Notifications are blocked in this browser. Change browser settings to allow them.');
    const reg=await navigator.serviceWorker.ready;
    try{
      const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(window.CONFIG.pushPublicKey)});
      if(window.CONFIG.pushServerUrl){
        try{await fetch(window.CONFIG.pushServerUrl.replace(/\/$/,'')+'/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});alert('Subscribed — your browser will receive push notifications when the owner sends them.');}
        catch(e){console.error(e);alert('Subscribed locally but failed to send subscription to server. See console for details.');}
      } else {
        const txt=JSON.stringify(sub);
        try{await navigator.clipboard.writeText(txt);alert('Subscribed. Subscription JSON copied to clipboard — send it to your server to save it.');}catch(e){prompt('Subscription JSON — copy and save this to your server:',txt)}
      }
      updateButton();
    }catch(e){console.error(e);alert('Subscription failed: '+(e&&e.message?e.message:'unknown'))}
  }
  async function unsubscribe(){
    const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(!sub)return alert('No subscription found');
    const ok=confirm('Unsubscribe from push notifications?');if(!ok)return;
    if(window.CONFIG.pushServerUrl){try{await fetch(window.CONFIG.pushServerUrl.replace(/\/$/,'')+'/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:sub.endpoint})});}catch(e){console.warn('Unable to notify server')}}
    await sub.unsubscribe();alert('Unsubscribed');updateButton();
  }
  async function toggle(){
    if(Notification.permission==='granted'){
      const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(sub) return unsubscribe(); else return subscribe();
    } else subscribe();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',insertBtn);else insertBtn();
})();
