# Spleandour One: 100% free setup

Cost: free static site + free push setup possible with Render/Railway free tiers.

- Hosting: GitHub Pages (free)
- AI: Puter.js (free for users)
- Data: saved on-device, with backup/restore
- Push notifications: use browser Web Push via VAPID keys + a tiny Node.js server

## Quick setup
1. Publish the repo to GitHub Pages.
2. Generate VAPID keys:
   `npx web-push generate-vapid-keys --json`
3. Paste the public key into `config.js` as `pushPublicKey`.
4. Deploy the tiny push server in `push-server-example/send-push.js` to Render or Railway.
5. Add the server URL to `config.js` as `pushServerUrl`.
6. Open the app and click the 🔔 button to subscribe.

## Free deployment choice
- GitHub Pages: free
- Render or Railway: free small tier, often enough for a tiny push server
- Browser users: free

## Important limit
A GitHub Pages site cannot send push notifications by itself. It needs a server to store subscriptions and send push payloads.

## Example push send
`curl -X POST https://your-server.example.com/send -H "Content-Type: application/json" -d '{"title":"Test","body":"Hello from owner","url":"https://joshuacharles559-dotcom.github.io/spleandour-one/"}'`
