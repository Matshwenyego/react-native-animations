# CVE Remediation Requirements — react-native-animations

## Objective
Update dependencies to resolve known CVEs/security advisories without breaking the Expo-managed app, and leave a durable, reviewable record of what was fixed and why.

## Current state (`npm audit`, 2026-08-08)
- **61 total vulnerabilities**: 4 critical, 32 high, 19 moderate, 6 low.
- Only **3 direct** dependencies are flagged: `@babel/core` (low), `expo` (moderate), `react-native` (high).
- The other **58 are transitive**, pulled in almost entirely through Expo's CLI/build tooling (`@expo/cli`, `metro`, `@react-native-community/cli-*`, `tar`, `js-yaml`, `postcss`, `ws`, `semver`, `nanoid`, `cross-spawn`, `fast-xml-parser`, `form-data`, `node-forge`, `shell-quote`, `xmldom`, `lodash`, ...) because the project pins `expo: ~49.0.15`, an SDK released in 2023.
- Root cause: the SDK is old enough that its toolchain dependencies have since had CVEs published against their pre-fix versions.
- **Risk framing**: most of the 58 transitive advisories (`tar`, `js-yaml`, `postcss`, `ws`, `node-forge`, `fast-xml-parser`, `form-data`, `cacache`, etc.) live in Expo's *CLI/build tooling* — they run on the dev machine during `expo start` / build, not inside the compiled app bundle end users install. They're still worth fixing (a compromised build toolchain is a real supply-chain risk), but they are not the same severity class as a CVE in code that ships to production. The 3 direct dependencies (`expo`, `react-native`, `@babel/core`) are the ones with runtime/build-output exposure and should be treated as the priority.

## Constraint: this is an Expo-managed project
**Do not** run `npm audit fix --force` or hand-bump individual transitive packages. Expo pins exact versions of `react-native`, `react-native-screens`, `react-native-safe-area-context`, `react-native-reanimated`, and `expo-status-bar` to match each SDK release. Forcing mismatched versions will break the app at runtime (native module ABI mismatches) even though `npm audit` goes green.

The correct fix path is to move the app to a newer Expo SDK using Expo's own tooling, then re-run `npm audit` against the updated tree.

## Tasks
1. Create a branch: `security/cve-updates`.
2. Determine target SDK — check the Expo changelog and run `npx expo-doctor`; prefer the latest stable SDK. Local Node (v26.6.0) / npm (11.18.0) are already well ahead of anything Expo requires, so no Node-version blocker is expected.
3. Upgrade Expo and let it resolve compatible peers:
   - `npx expo install expo@latest`
   - `npx expo install --fix` (aligns `react-native`, `react-native-screens`, `react-native-safe-area-context`, `react-native-reanimated`, `@react-navigation/*`, `expo-status-bar` to what the new SDK expects)
   - **If the direct jump misbehaves** (install conflicts, `expo-doctor` failures, app won't boot): fall back to upgrading one SDK major at a time via [Expo's upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) instead of forcing the 5-major jump from SDK 49 in one step.
   - Run `npx expo-doctor` after the bump — it catches version-compatibility issues `npm audit` won't (mismatched native module versions, config plugin issues).
4. Manually bump remaining flagged direct/dev dependencies not covered by step 3:
   - `@babel/core` → ≥7.29.1 (resolves GHSA-4x5r-pxfx-6jf8, low)
   - `@faker-js/faker` → latest version compatible as a devDependency
5. Re-run `npm audit`. Target: 0 critical, 0 high. Anything left (deep transitive dep with no upstream fix yet) gets documented as an accepted risk — not silently ignored, not worked around with `overrides` unless explicitly approved.
6. Smoke test after upgrade (SDK bumps can break Reanimated/Moti APIs):
   - `npx expo start` boots with no red-box errors
   - every screen in `src/` renders and its animation runs (moti + reanimated are the most breakage-prone deps here)
   - check on iOS simulator / Android emulator / Expo Go if available
7. Update `README.md` if the required Node/Expo CLI version changed.

## Documenting CVE fixes
`package.json` is strict JSON — it can't hold comments, so advisory IDs can't be noted inline there. Record them instead in a new `SECURITY-UPDATES.md` at the repo root, one row per direct dependency bump:

| Package | Old Version | New Version | Advisory IDs Resolved | Severity | Notes |
|---|---|---|---|---|---|
| expo | ~49.0.15 | *(target)* | cascades fixes across `@expo/cli`, `metro`, `tar`, `js-yaml`, `postcss`, `ws`, etc. | critical/high | SDK bump — see `expo install --fix` output |
| react-native | 0.72.6 | *(target)* | bundled with SDK bump — see `expo` row | high | |
| @babel/core | ^7.20.0 | ≥7.29.1 | GHSA-4x5r-pxfx-6jf8 | low | |

Reference `SECURITY-UPDATES.md` from the PR description and commit message so the audit trail lives in git history, not in the JSON file.

## Acceptance criteria
- [ ] `npm audit` reports 0 critical / 0 high, or each remaining item has a documented reason in `SECURITY-UPDATES.md`
- [ ] App boots and all animation screens work after the upgrade
- [ ] `SECURITY-UPDATES.md` committed with a row per bumped direct dependency and its resolved advisory IDs
- [ ] `package.json` / `package-lock.json` committed
- [ ] `README.md` updated if tooling version requirements changed

## Out of scope
- Feature work, refactors, or dependency additions unrelated to the security fix
- Transitive packages with no upstream patch available yet — document, don't route around

## Reference: full critical/high advisory list (raw `npm audit`, 2026-08-08)
```
CRITICAL: fast-xml-parser, form-data, shell-quote, tar   (all transitive, via @expo/cli toolchain)
HIGH:     @babel/plugin-transform-modules-systemjs, @expo/cli, @expo/config-plugins,
          @expo/image-utils, @expo/plist, @expo/prebuild-config, @react-native-community/cli*,
          @xmldom/xmldom, body-parser, brace-expansion, braces, cacache, cross-spawn,
          image-size, ip, js-yaml, lodash, metro*, minimatch, nanoid, node-forge,
          picomatch, postcss, react-native (direct), semver, tmp, ws
```
Full JSON output (with GHSA links per package) is available via `npm audit --json` — re-run before starting work since advisories shift over time.

**Naming note**: most of these advisories are identified only by GHSA ID (e.g. `GHSA-4x5r-pxfx-6jf8`) — GitHub's advisory database doesn't require a paired CVE number, and most of these don't have one assigned. Use the GHSA ID as the record of truth in `SECURITY-UPDATES.md`; don't spend time hunting for a CVE number that may not exist.
