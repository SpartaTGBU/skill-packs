---
disable-model-invocation: true  # skl: on-demand pack skill
name: mobile-native
description: >
  Make mobile UI feel native: web-on-phone fixes (viewport units, safe areas, input zoom, tap
  feedback, overscroll), iOS HIG and Android Material 3 conventions, cross-platform translation,
  tablet/foldable adaptation, React Native/Expo motion, gestures and haptics, SwiftUI defaults, and
  on-device verification. Use when building or reviewing a mobile web app, PWA, SwiftUI, Jetpack
  Compose, React Native or Expo screen, porting web to native, or when an app "feels like a
  website" on a phone.
---

# Mobile native

**The platform governs structure; the brand lives in tint, type, motion and content.** The slop
tests: an iOS app that looks "ported from a website", an Android app that is "an iOS app in an
Android skin", a mobile site that flashes, zooms and bounces. Use the project's existing stack and
components (forge:ponytail); visual direction comes from atelier:frontend-design, web motion from
atelier:motion-design.

Never cut: hit targets, Dynamic Type / font scale, reduced motion, dark mode, contrast, and the
platform back gesture.

## 1. Web on a phone

Baseline:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0b0b">
```
plus `:root { color-scheme: light dark; } html { -webkit-text-size-adjust: 100%; }`.
**Never** set `maximum-scale=1` or `user-scalable=no`.

| Symptom | Fix |
|---|---|
| Hover styles stick after tap | Wrap hover in `@media (hover: hover) and (pointer: fine)` |
| Grey flash on tap | `-webkit-tap-highlight-color: transparent` + your own `:active` state |
| Layout jumps / hidden under browser bars | `100dvh` for app shells, `100svh` for heroes; never `100vh` |
| Page zooms when an input is focused | Input font-size >= 16px; set `inputmode`, `enterkeyhint`, `autocapitalize`, `autocomplete` |
| Taps feel late | `touch-action: manipulation`; feedback on `:active`/pointerdown, 100-160ms ease-out, `scale(0.97)` |
| Whole page rubber-bands / pull-to-refresh fires | `overscroll-behavior: none` on html/body, `contain` on inner scrollers; never `touchmove` + `preventDefault` |
| Content under notch / home indicator | `padding: env(safe-area-inset-top, 0px)` etc. (needs `viewport-fit=cover`) |
| Long-press selects button labels | `user-select: none; -webkit-touch-callout: none` on controls only, never body |
| Horizontal carousel blocks vertical scroll | `touch-action: pan-y` on it; prefer CSS `scroll-snap`; `touch-action: none` only on full-gesture surfaces |
| Status bar colour wrong | `theme-color` per scheme + `color-scheme` |

Gate on capability (`@media (hover)`, `(pointer: coarse)`, `@supports`), never user-agent sniffing.
Hit targets >= 44x44 CSS px with >= 8px between them.

## 2. iOS (Human Interface Guidelines)

- **Navigation:** tab bar for 2-5 top-level sections (never for actions); navigation stack for
  hierarchy; sheets for focused tasks. Keep the edge-swipe back gesture working - never override it.
- **Titles:** large titles at the top of root screens that collapse to inline on scroll.
- **Targets:** >= 44x44pt.
- **Type:** Dynamic Type text styles (`.body` 17pt, `.headline`, `.caption`...), SF for UI, 11pt
  floor. Layout must survive the largest accessibility sizes (text wraps, stacks go vertical).
- **Colour:** semantic system colours (`label`, `secondaryLabel`, `systemBackground`,
  `separator`); Dark Mode is first-class; one tint colour carries the brand.
- **Materials:** system materials/blur, not hand-rolled glass.
- **Components:** platform controls (toggles, pickers, menus, context menus, swipe actions); SF
  Symbols at matching weight; grouped/inset lists for settings and forms.
- **Sheets vs covers:** sheet (with detents) for tasks the user can abandon - honour
  swipe-to-dismiss, confirm only if there are unsaved changes; full-screen cover only for immersive
  or multi-step flows.
- **Motion:** system push/pop and sheet transitions; under Reduce Motion, replace movement with
  crossfades.

## 3. Android (Material 3)

- **Navigation:** navigation bar (3-5 destinations) on compact widths; navigation rail or drawer
  on medium/expanded. **Predictive Back** must always work - never swallow back without handling.
- **Edge-to-edge:** draw behind system bars and handle insets (status bar, navigation bar,
  display cutout, IME) with `WindowInsets`.
- **Top app bar** for title and actions; at most **one FAB**, only for the single primary action.
- **Targets:** >= 48x48dp with 8dp spacing.
- **Type:** Material type roles (display/headline/title/body/label), Roboto or the brand face, sizes
  in `sp` so font scale applies.
- **Colour:** colour roles (`primary`, `onPrimary`, `surface`, `surfaceContainer`...); Dynamic Color
  on Android 12+ with a brand fallback scheme; dark theme first-class; tonal elevation (surface
  tint), not heavy shadows.
- **Components:** Material components (Compose Material3); snackbars for transient feedback,
  dialogs only for interruptions that need a decision; ripple for touch feedback.
- **Motion:** container transform (element to screen), shared axis (siblings/steps), fade through
  (unrelated destinations). Honour "Remove animations".

## 4. Cross-platform translation

Re-conform per platform; don't ship one platform's idioms on the other.

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail |
| Edge-swipe back | Predictive Back |
| Switch, segmented control | Material switch, segmented buttons / chips |
| Action sheet | Bottom sheet or dialog |
| SF Symbols, SF, Dynamic Type | Material Symbols, Roboto, `sp` |
| Semantic colours, materials | Colour roles, tonal elevation |
| Push, sheet | Container transform, shared axis, fade through |

Web -> native: re-conform the structure (navigation, lists, controls) rather than reflowing the
web layout into a phone frame.

## 5. Adapt to size, not device

- Restructure, don't stretch: decide layouts by size class (iOS) / window size class (Android:
  compact < 600dp, medium < 840dp, expanded), never by device model.
- Tablet/expanded: sidebar or rail, master-detail (list + detail side by side), popovers instead of
  full-screen sheets. Split-screen and multitasking are just another size.
- Landscape restructures (two panes, side controls); don't lock orientation to dodge layout bugs.
- Foldables: test folded, unfolded and tabletop (half-open) postures; keep content off the hinge.
- Never hide core functionality on small screens; move it (overflow menu, secondary screen).

## 6. React Native / Expo motion and touch

**Frequency gate before animating:** used 100+ times a day -> no animation; tens of times -> under
150ms; occasional -> standard; rare (onboarding, success) -> the delight budget. Name the purpose
(feedback, orientation, continuity) or don't animate. Tab switches don't slide (`animation: 'none'`).

**Cheapest tool that works:**
- state change -> Reanimated CSS-style transitions; mount/unmount -> layout animations
  (`entering`/`exiting`, but never on virtualized list rows);
- anything a finger moves -> shared value + Gesture Handler `Gesture` + `useAnimatedStyle`;
- screens -> native stack; sheets -> `presentation: 'formSheet'` or the native sheet; tabs ->
  native tabs; pull-to-refresh -> `RefreshControl`; keyboard -> a keyboard-aware controller;
- Lottie only for illustration, Skia only for heavy custom drawing.
- Add Expo libraries with `npx expo install` so versions match the SDK.

**Properties:** animate `transform` and `opacity`. Never start from `scale(0)` - use `0.95` +
opacity 0. Don't animate elevation, shadow or blur intensity.

**Springs whenever a finger is involved** (they inherit gesture velocity):
- default `{ duration: 400, dampingRatio: 1 }`; snap-back `{ duration: 400, dampingRatio: 0.8,
  velocity }`; sheet `{ duration: 300, dampingRatio: 0.8, velocity }`;
- `overshootClamping` at hard edges; bounce only when there is momentum; rubber-band past limits;
- dismiss on velocity **or** distance threshold, not distance alone.

**Easings / durations** (non-gesture): ease-out `bezier(0.23, 1, 0.32, 1)`, in-out
`bezier(0.77, 0, 0.175, 1)`, sheet `bezier(0.32, 0.72, 0, 1)`; never ease-in for entrances. Press
100-150ms, toggle 150-200ms, other UI < 300ms, navigation uses the platform default.

**Keep it on the UI thread:** no `setState` inside gesture callbacks; hop to JS only in `onEnd` or
`useAnimatedReaction` (`scheduleOnRN`; `runOnJS` is deprecated in current Reanimated); never read
or write shared values during render (`.get()`/`.set()` in worklets); mark helpers `'worklet'`.
Never use `PanResponder` or core `Animated` for gestures.

**Press:** visual feedback on press-in, commit on press-out; `Pressable` scale 0.97; reach 44pt/48dp
with `hitSlop`; set `pressRetentionOffset`; ripple only in Material-styled apps.

**Haptics** - same frame as the visual, one per action, never the only feedback:

| Event | Haptic |
|---|---|
| Picker detent, segment change | selection |
| Snap, toggle, commit | impact light |
| Heavy or destructive action | impact medium |
| Result | notification success / error |

**Reduced motion:** `useReducedMotion()` / `ReduceMotion.System`; keep opacity, drop translate and
scale; screens fade. **Font scaling:** measure with `onLayout`; never animate to hard-coded heights.

**Setup:** `GestureHandlerRootView` at the root; New Architecture on. Judge performance on a
release build on the slowest target device, not Expo Go. For 120Hz on iOS ProMotion, set
`CADisableMinimumFrameDurationOnPhone` (8ms frame budget).

## 7. SwiftUI defaults

- Value types first (`struct`/`enum`); `some P` before `any P`.
- Main actor and synchronous first; add `async` when needed, move work off-actor (`@concurrent`)
  only after Instruments shows a hang; actors last. For apps (not libraries) enable Approachable
  Concurrency with default MainActor isolation.
- Data races: stop sharing, then value types, then actor isolation, then `Mutex`.
- `@Observable` over `ObservableObject`; copy values into `@Sendable` closures (`[pulse] in`);
  call `withAnimation` from synchronous callbacks.
- Swift Testing (`@Test`, `#expect`); `Logger`, not `print`.

## 8. Verify on devices

- **Web:** serve on `0.0.0.0`, open on a real phone; debug with Safari Web Inspector (iOS) or
  `chrome://inspect` (Android). Check with keyboard open, landscape, installed PWA (standalone),
  and an old, slow phone.
- **iOS simulator:** `xcrun simctl io booted screenshot <path>` (use the UDID if several are
  booted); `xcrun simctl ui booted appearance dark`; check the largest Dynamic Type sizes.
- **Android:** `adb exec-out screencap -p > <path>`; `adb shell cmd uimode night yes`; font scale
  via `adb shell settings put system font_scale 1.3` - read the current value first and restore it.
- Gestures, haptics, frame rate and keyboard behaviour need real hardware; simulators lie.
- Review the result with atelier:ui-review; close with forge:verification (screenshots in both
  themes, largest text size, reduced motion on).
