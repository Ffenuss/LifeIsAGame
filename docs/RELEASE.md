# Building and releasing Life Estate

The game is a Vite + Three.js web app wrapped in a native Android WebView. All
game code is bundled locally; the Android release requests no internet permission.

## 1. Requirements

- Node.js 20 or newer
- JDK 17
- Android SDK with platform 36 and build-tools 36
- `ANDROID_HOME` or `android/local.properties` pointing at the SDK
- A physical Android 8.0+ device or emulator for a final smoke test

## 2. Web development

```bash
npm ci
npm run dev          # http://localhost:3002
npm test             # 13 engine and life tests
npm run sim -- 400 sharp
npm run build
```

`npm run build` writes the production bundle to `dist/`.

## 3. Android debug build

```bash
npm run android:debug
```

This builds the web bundle, copies it to `android/app/src/main/assets/www/`, and
runs Gradle. The APK is written to:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install it with:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Debug builds use the application ID `com.lifeestate.game.debug` so they can sit
next to a production install. WebView remote debugging is enabled in debug
builds; open `chrome://inspect` on a desktop Chrome connected over USB.

## 4. Create the upload key (once)

```bash
npm run android:key
```

The script creates:

- `android/release.keystore`
- `android/keystore.properties`

Both are gitignored. **Back them up now.** If you lose the upload key you must ask
Google Play to reset it. Never commit either file.

If you prefer to create the key by hand:

```bash
keytool -genkeypair -v \
  -keystore android/release.keystore \
  -alias upload \
  -keyalg RSA -keysize 4096 -validity 10000
```

Then create `android/keystore.properties`:

```properties
storeFile=release.keystore
storePassword=YOUR_PASSWORD
keyAlias=upload
keyPassword=YOUR_PASSWORD
```

## 5. Signed release builds

```bash
npm run android:bundle   # Google Play upload artifact
cd android && ./gradlew assembleRelease   # optional sideload APK
```

Outputs:

```
android/app/build/outputs/bundle/release/app-release.aab
android/app/build/outputs/apk/release/app-release.apk
```

Verify the signature:

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
/usr/local/lib/android/sdk/build-tools/36.0.0/apksigner verify --print-certs \
  android/app/build/outputs/apk/release/app-release.apk
```

## 6. Version updates

Update all three places before every upload:

| File | Field |
| --- | --- |
| `android/app/build.gradle` | `versionCode` (integer, must increase every upload) |
| `android/app/build.gradle` | `versionName` (for example `1.0.1`) |
| `src/main.js` | `VERSION` (shown on the title screen) |
| `package.json` | `version` (optional, keep in sync) |

`versionCode` must strictly increase. Never reuse one.

## 7. Play Console setup

1. Create the app in Play Console: **Life Estate**, default language English,
   **Game**, **Free**.
2. Enroll in **Play App Signing**. Upload the first `.aab` and let Google manage
   the app signing key; keep the local upload key safe.
3. Complete **App content**:
   - Privacy policy URL
   - Ads: **No**
   - App access: **All functionality is available without restrictions**
   - Content rating questionnaire (see `docs/STORE_LISTING.md`)
   - Target audience: **13+**
   - Data safety: **No data collected, no data shared**
   - Government apps: **No**
   - Financial features: **No**
   - Health: **No**
4. Add the store listing assets and copy from `docs/STORE_LISTING.md`.
5. Upload the AAB to **Internal testing** first. Add yourself as a tester, install
   from the opt-in link, and play a full match on a real device.
6. Promote to closed testing, then production. A new personal developer account
   may need 12 testers for 14 days before production access is granted.

## 8. Device smoke test

Before promoting a build, verify:

- The splash screen disappears and the title screen renders.
- A new match starts; dice, tokens, and colony cubes animate.
- Buying a property deducts cash and shows the owner colour.
- Pinch zoom, rotate, and tile taps work.
- The Android back button closes a modal, then opens the pause menu, then exits.
- Backgrounding the app stops music and saves progress; resuming continues.
- A full match reaches the victory screen.
- Reopening the app offers **Continue** and restores the match.
- No console errors in debug builds.

## 9. Store screenshots

```bash
npm run build
npx playwright install chromium   # once
npm run store:capture
```

Artwork is written to `store/output/`. The capture script uses a debug-only time
scale so software-rendered browsers finish animations quickly. It does not
change gameplay in release builds.

## 10. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank WebView on device | Run `npm run build` first; confirm `assets/www/index.html` exists in the APK |
| `Web bundle missing` during Gradle | `npm run build`, then rebuild |
| Splash stays forever | Check logcat for `MainActivity`; the app clears the splash after 8 s even on error |
| Old UI after rebuild | Uninstall the app or clear app storage; then reinstall |
| Release AAB is unsigned | Create `android/keystore.properties` with `npm run android:key` |
| Gradle cannot find SDK | Create `android/local.properties` with `sdk.dir=/path/to/android/sdk` |
| Slow screenshots / animations | Use a headed browser (`DISPLAY=:0`) or set `STORE_HEADLESS=1` on CI with software GL |
