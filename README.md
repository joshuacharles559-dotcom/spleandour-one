# Spleandour One

Spleandour One is an installable, offline-friendly personal dashboard. After the first online visit, the app shell can load without a connection. Dashboard data and local demo accounts are stored in the current browser on the current device.

## Use the app

- Open the published site over HTTPS.
- Create an account with an email and a unique password. This is only a local profile; there is no server account, password recovery, or cross-device sync.
- Use **⬇** to export a backup and **⬆** to restore one. Keep backup files private.
- Install the app from the browser's install prompt or menu. On iPhone/iPad, use **Share → Add to Home Screen**.
- The planner, journal, trackers, calculators, and other local tools work offline after the app has been loaded once.

AI chat, AI Studio generation, and translation need an AI service and are not connected in this static release. Do not enter sensitive personal or financial information: browser storage is not a secure account system.

## Publish with GitHub Pages

The included GitHub Actions workflow publishes this static app to GitHub Pages whenever changes are pushed to the `main` branch. In repository settings, ensure **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**. The site is installable only when served over HTTPS (or localhost).

To download the website files, use GitHub's **Code → Download ZIP**. To install the app, open the published HTTPS site in a supported browser and choose **Install app** / **Add to Home Screen**.