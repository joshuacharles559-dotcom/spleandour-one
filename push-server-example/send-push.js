// send-push.js
// Minimal Express server to store subscriptions and send push messages.

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const SUBS_FILE = path.join(__dirname,'subscriptions.json');
function loadSubs(){try{return JSON.parse(fs.readFileSync(SUBS_FILE))}catch(e){return []}}
function saveSubs(s){fs.writeFileSync(SUBS_FILE,JSON.stringify(s,null,2))}

const app = express();app.use(bodyParser.json());

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:joshuacharles559@gmail.com';

if(!VAPID_PUBLIC || !VAPID_PRIVATE){
  console.warn('VAPID keys are missing. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY env vars.');
}
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if(!sub || !sub.endpoint) return res.status(400).json({error:'invalid subscription'});
  const subs = loadSubs();
  if(!subs.find(s=>s.endpoint===sub.endpoint)) subs.push(sub);
  saveSubs(subs);
  res.json({ok:true});
});

app.post('/unsubscribe', (req, res)=>{
  const {endpoint} = req.body;
  if(!endpoint) return res.status(400).json({error:'missing endpoint'});
  let subs = loadSubs(); subs = subs.filter(s=>s.endpoint!==endpoint); saveSubs(subs); res.json({ok:true});
});

app.post('/send', async (req, res) => {
  const {title='Spleandour One', body='Open the app to see updates', url='./'} = req.body || {};
  const payload = JSON.stringify({title,body,url});
  const subs = loadSubs();
  const results = [];
  for(const s of subs){
    try{ await webpush.sendNotification(s, payload); results.push({endpoint:s.endpoint,ok:true}); }
    catch(e){ console.error('send error',e); results.push({endpoint:s.endpoint,ok:false,error:e.message}); }
  }
  res.json({results});
});

const port = process.env.PORT || 3000; app.listen(port, ()=>console.log('Push server listening on',port));
