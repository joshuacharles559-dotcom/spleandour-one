# Push server example (Node.js)

This is a minimal example showing how to accept subscriptions from clients and send push notifications using web-push.

Important: GitHub Pages can't send push messages. You must deploy this code to a server (Render, Railway, Fly.io, DigitalOcean, or any VPS).

Files:
- send-push.js — Express server with /subscribe, /unsubscribe and /send endpoints
- subscriptions.json — persisted subscriptions (created automatically)

Install and run:

1. npm init -y
2. npm i express body-parser web-push
3. Create VAPID keys (see below) and set environment variables:
   - VAPID_PUBLIC_KEY
   - VAPID_PRIVATE_KEY
   - VAPID_SUBJECT (e.g. mailto:joshuacharles559@gmail.com)
4. node send-push.js

Endpoints
- POST /subscribe  — accepts a subscription JSON in request body and stores it
- POST /unsubscribe — accepts { endpoint } and removes stored subscription
- POST /send — accepts {title,body,url} and sends a push to all stored subscriptions

Generate VAPID keys (once):

  npx web-push generate-vapid-keys --json

Copy the public key into config.js (pushPublicKey) on your site and put the private key in the server's VAPID_PRIVATE_KEY.

