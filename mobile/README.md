# Papyrus Notes — React Native / Android

This is a native React Native client built with Expo SDK 58 (React Native 0.88). It lives beside the original Vite web client; the original source, Firebase collections and shared TypeScript data models remain intact.

## Included mobile workflows

- Firebase Google authentication and per-user Firestore real-time sync.
- Local offline cache and a durable AsyncStorage write/delete outbox that retries automatically when connectivity returns, with the same Firestore paths as the web app: `users/{uid}/notes`, `journals`, `tasks` and `profile/character`.
- Dashboard, notes, journal, tasks, Pomodoro focus timer and character/profile sections.
- Note templates, markdown preview, search, categories, tags, color themes, pin/archive/duplicate/delete, and Markdown/JSON sharing.
- Journal mood tracking, month calendar, search, checklist, photo attachment and voice recordings.
- Task priority, due dates, categories, completion, editing and bulk clearing of completed tasks.
- Configurable focus/short-break/long-break timer, task association, completion stats and local notifications.
- Avatar catalog and profile statistics.

The data types, starter notes/journals/tasks, templates, category list, and avatar catalog are imported from the existing `../src` tree so the mobile client stays compatible with the web client rather than copying or replacing those models.

## Setup

1. Install Node.js 22.13+ and Android Studio with the Android SDK.
2. From this folder install dependencies:
   ```bash
   npm install
   npx expo install --fix
   ```
   Expo recommends matching SDK-native package versions with `expo install --fix`; this project deliberately uses Expo-managed versions for its native modules.
3. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`. In Google Cloud Console, create an Android OAuth client for package `com.hoseinshooshi.papyrusnotes` using the SHA-1 fingerprint of the debug/release signing certificate. Keep the web OAuth client configured in the existing `firebase-applet-config.json`.
4. In Firebase Authentication, enable Google as a provider. The app reuses the existing Firebase project configuration from the repository root.
5. Deploy the included rules to the existing Firebase project (review the rules before deploying because CLI deployment replaces the rules currently attached to that database/bucket):
   ```bash
   npx firebase-tools deploy --project genuine-attic-v8chg --only firestore:rules,storage
   ```
   Storage rules restrict attachments to the signed-in user's own `users/{uid}/media/...` directory and cap each upload at 20 MB.
6. Run:
   ```bash
   npm run android
   ```
   Or start Metro and scan the QR code with a compatible development build:
   ```bash
   npm start
   ```

For a distributable APK/AAB, generate the native project with `npm run prebuild:android`, configure an EAS or local Android signing key, and build with Gradle or `npx eas-cli build --platform android --profile preview` (APK) / `--profile production` (AAB).

## Firebase and media notes

Google sign-in on Android requires the Android OAuth client ID and matching signing SHA-1; the existing repository only contains a web OAuth client ID, so that Android OAuth registration is a deployment prerequisite. Images and journal audio are uploaded to Firebase Storage when connected. Deploy the root `storage.rules` file before enabling attachments. The original avatar catalog is retained: the 32 pixel-art sprites and all 7 featured SVG scenes are rendered with `react-native-svg`. CSS-only floating/bounce effects are static in this native renderer. If an upload is unavailable, the selected local URI is retained on the device and the UI reports that it is not cloud-backed yet.

The native client reads and writes the existing named Firestore database (`ai-studio-remixpapyrusnote-0430bd11-bc8b-4f87-b50b-a9269dfa1baf`) using the same schema. It does not embed the web app in a WebView and does not modify the original website.
