# Security Updates — CVE Remediation

Tracks the dependency bumps made to resolve `npm audit` findings, since `package.json` (strict JSON) can't hold inline comments. See `SECURITY-REQUIREMENTS.md` for the original plan.

## Result
- **Before**: 61 vulnerabilities (4 critical, 32 high, 19 moderate, 6 low)
- **After**: 18 vulnerabilities (0 critical, 10 high, 8 moderate, 0 low)
- All critical and low findings resolved. All remaining findings trace to two upstream-unfixed transitive packages (see "Accepted risk" below) — not to unpatched versions we could bump to.

## Dependency changes

| Package | Old Version | New Version | Advisory IDs Resolved | Severity | Notes |
|---|---|---|---|---|---|
| `expo` | `~49.0.15` | `^57.0.11` | cascades fixes across `@expo/cli`, `metro`, `tar`, `js-yaml`, `postcss`, `ws`, `fast-xml-parser`, `form-data`, `shell-quote`, `node-forge`, and ~40 other transitive advisories | critical/high/moderate/low | 8-major SDK jump; see commit `chore(deps): upgrade Expo SDK 49 to 57...` |
| `react` | `18.2.0` | `19.2.3` | bundled with SDK bump | — | required peer of `react-native` 0.86.x |
| `react-native` | `0.72.6` | `0.86.2` | GHSA advisories in `@react-native/community-cli-plugin`, `@react-native/virtualized-lists` | high | |
| `react-native-reanimated` | `~3.3.0` | `4.5.1` | bundled with SDK bump | high | now requires `react-native-worklets` as a separate peer |
| `react-native-screens` | `~3.22.0` | `~4.26.0` | bundled with SDK bump | — | |
| `react-native-safe-area-context` | `4.6.3` | `~5.7.0` | bundled with SDK bump | — | |
| `expo-status-bar` | `~1.6.0` | `~57.0.1` | bundled with SDK bump | — | |
| `@expo/vector-icons` | `^13.0.0` | `^15.0.2` | bundled with SDK bump | — | |
| `@babel/core` | `^7.20.0` | `^7.29.7` | GHSA-4x5r-pxfx-6jf8 (arbitrary file read via sourceMappingURL) | low | stayed on the 7.x line — Babel 8 is a separate major unrelated to this CVE |
| `@faker-js/faker` | `^8.2.0` | `^10.5.0` | GHSA advisories in faker's own dependency tree at v8 | — | breaking API change — see below |

### New dependencies (required by the SDK bump)
- `expo-font` — peer dependency of `@expo/vector-icons`
- `react-native-worklets` — peer dependency of `react-native-reanimated` 4.x
- `expo-splash-screen` — SDK 57 removed the top-level `app.json` `splash` key in favor of this config plugin

### Code changes required by the bump
- `src/screens/3d/index.jsx`: `faker.finance.amount(80, 200, 0)` (positional args) → `faker.finance.amount({ min: 80, max: 200, dec: 0 })`. `@faker-js/faker` v9+ removed the positional-args signature; the old call didn't throw, it silently returned a value outside the intended range.
- `app.json`: moved `splash: {...}` to `plugins: [["expo-splash-screen", {...}]]` — required by SDK 57's config schema (`expo-doctor` failed on the old key).
- `.npmrc` added with `legacy-peer-deps=true` — Expo 57's optional dev-time `@expo/router-server` pulls a `react-dom` peer unrelated to this app (which doesn't use `expo-router`), which otherwise blocks every `npm install` with `ERESOLVE`.

## Accepted risk (documented, not silently ignored)
18 vulnerabilities remain (0 critical, 0 low). All trace to two leaf packages with no fixed version published yet at the time of this upgrade (`npm audit`'s own solver only offers a *downgrade* to an older Expo SDK as a "fix," which would reintroduce the critical/high findings this upgrade just resolved — not a real fix):

| Leaf package | Pulled in via | Advisory | Notes |
|---|---|---|---|
| `image-size` `<=2.0.2` | `metro` → `metro-config`/`metro-transform-worker` → `@expo/metro-config` → `expo` | GHSA (DoS via ICNS/JXL/HEIF parser infinite loop) | **Dev-time only** — part of Metro's asset pipeline, runs on the build machine, not shipped in the app bundle |
| `uuid` `<11.1.1` | `xcode` → `@expo/config-plugins` → `expo` | GHSA-w5hq-g745-h8pq (missing buffer bounds check) | **Dev-time only** — `xcode` is used solely during native project generation (`expo prebuild`), not at runtime |

**Action**: re-run `npm audit` periodically (e.g. monthly, or before each release) — these should resolve on their own once Expo bumps its `metro`/`@expo/config-plugins` pins to versions with the patched `image-size`/`uuid`.

## Verification performed
- `npx expo-doctor`: 20/20 checks passing
- `npx expo export --platform all` (iOS + Android): bundled cleanly, 1638/1634 modules, no errors
- Web platform: not tested — `react-dom`/`react-native-web` were never installed in this repo even before this upgrade (pre-existing gap, out of scope for this security-only branch)
- No device/simulator was available in this environment for a live runtime check of the animation screens (`src/screens/3d`, `src/screens/wave`) — recommend a manual pass in Expo Go or a simulator before merging
