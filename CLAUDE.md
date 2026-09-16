# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@react-hive/honey-layout` — a React 19 layout/theming component library published to npm. Part of the
`@react-hive` "honey" ecosystem: this package supplies **layout primitives and overlay orchestration**, while the
CSS-in-JS engine, theme shape, and spacing/color resolution live in the peer dependencies
`@react-hive/honey-style` and `@react-hive/honey-css`. Do not reimplement styling internals here — extend them.

Package manager is **pnpm** (see `pnpm-workspace.yaml`).

## Commands

```bash
pnpm start                  # docs dev server (live playground) at http://localhost:8093
pnpm test                   # vitest, single run (watch: false is set in vitest.config.ts)
pnpm test --watch           # watch mode
pnpm test src/components/HoneyBox/__tests__/honey-box.spec.tsx   # single file
pnpm test -t "should expose the overlay instance when it is active"  # single test by name
pnpm build:lib              # webpack -> dist (ESM + CJS + dev CJS), used by prepublishOnly
pnpm build:docs             # static docs bundle (Netlify)
pnpm diagnostics            # tsc --extendedDiagnostics over tsconfig.build.json -> diagnostics/latest.json
pnpm clean                  # rm -rf dist coverage
```

There is **no `lint` script** — run ESLint directly: `pnpm exec eslint .`. Note that the tree is *not*
currently lint-clean (~11 pre-existing errors, mostly unused vars in `src/docs/pages/examples/` plus one in
`helpers/helpers.ts`); lint is not wired into CI or the pre-commit hook, so do not assume a clean baseline.

There is **no `typecheck` script** — `pnpm diagnostics` is the de-facto type check (it runs a full `tsc` build);
the husky `pre-commit` hook runs it and stages `diagnostics/`.

## Release flow

Publishing is triggered by pushing to the **`release`** branch (`.github/workflows/publish.yml`), not by tags.
`prepublishOnly` runs clean + test + build:lib. Commit messages follow a strict convention — the version being
released, then a description of what changed:

```
18.4.0 - @floating-ui/* and other package upgrades
```

The `package.json` version bump is part of that same commit.

## Architecture

### Build outputs and what is bundled

`webpack.config.mjs` emits three bundles from `src/index.ts`: `index.mjs` (ESM), `index.cjs` (CJS), and
`index.dev.cjs` (development CJS, wired through the `development` condition in `package.json#exports`). Only
`react` and `@react-hive/honey-style` are webpack `externals` — everything else, including `@floating-ui/*`,
`@react-hive/honey-utils`, `@react-hive/honey-hooks`, and the lodash helpers, is **bundled into `dist`**. Keep
this in mind when adding a dependency: it lands in the consumer's bundle unless it is also added to `externals`
and to `peerDependencies`.

`tsconfig.build.json` excludes `src/docs`, `src/__mocks__`, and `src/**/__tests__` from the published output.

### Public API surface

`src/index.ts` re-exports `constants`, `types`, `components`, `providers`, `hooks`, `utils`, `helpers`, `effects`.
`src/contexts` is **deliberately not exported** — consumers reach layout state through `useHoneyLayout()`.

Each folder's `index.ts` barrel curates what escapes it. For example `HoneyPopup/index.ts` exports the component,
its types, its context and its hooks, but *not* `HoneyPopupContent`, `HoneyPopupStyled`, `HoneyPopupPortal`, or
`HoneyPopupTree`. When adding a file, adding it to the barrel is an explicit API decision. Internal modules
sometimes import through a parent barrel (`import { HoneyOverlay } from '../../components'`) rather than a deep
path — follow whichever the neighbouring file uses.

### The `$`-prefixed CSS prop system

This is the core mechanism and it spans `constants.ts` -> `types/css.types.ts` -> `helpers/helpers.ts` -> `HoneyBox`.

- `HONEY_LAYOUT_CSS_PROPERTY_PREFIX = '$'`. `HoneyPrefixedCssProperties` maps every `csstype` property to a
  `$`-prefixed optional prop, so `$width`, `$flexGrow`, `$backgroundColor` etc. exist without being enumerated.
- A value can be raw (`$width="100%"`), a function of the styled context, or a **responsive record keyed by
  breakpoint** (`$width={{ xs: '100%', md: '50%' }}`).
- `HoneyBox` iterates `HONEY_BREAKPOINTS`: `xs` uses `createStyles('xs')` (emitted unwrapped, so `xs` is the
  base/default layer), every other breakpoint uses `applyBreakpointStyles(bp)`, which wraps output in the custom
  at-rule `@honey-media (<bp>:up)` — resolved downstream by `@react-hive/honey-style`, not by this package.
- Spacing properties go through `resolveSpacing` (numbers and arrays become `px` shorthand); color properties whose
  value is a theme token go through `resolveColor`.

`HoneyBox` is the base of everything. `HoneyFlex` extends it, and nearly every other component extends `HoneyFlex`
or `HoneyBox`. A capability added to `HoneyBox` propagates library-wide.

`HoneyFlex` adds semantic booleans (`inline`, `row`, `center`, `centerX`, `centerY`) on top. Precedence is
deliberate and documented in its JSDoc: `inline` beats `$display`, but `$flexDirection`/`$alignItems`/
`$justifyContent` beat the semantic helpers — and a conflict emits a dev-only `warnOnce`.

### Overlay system (two distinct stacks — do not conflate them)

**1. The overlay stack — `HoneyLayoutProvider` + `useHoneyOverlays`.** This is a hand-rolled external store, and
its performance characteristics are the whole point (see commits 18.0.0 / 18.1.0):

- Overlays live in a **ref**, not React state. `registerOverlay`/`unregisterOverlay` replace the array and notify
  subscribers, so the provider and the whole layout subtree never re-render on overlay changes.
- The context value is memoized on `[theme, screenState]` only. **Do not add overlay data to the context value**
  and do not move the overlay array into `useState` — that reintroduces the re-render cascade this design removed.
- Consumers read through `useHoneyOverlay(id)`, which uses `useSyncExternalStore` but selects a single overlay, so
  unrelated stack churn does not re-render them. `getOverlaysSnapshot` must keep array identity stable between
  changes for this to stay correct.
- One `document` `keyup` listener exists for the whole app, and it dispatches **only to the top-of-stack overlay**,
  so hidden overlays underneath never react to the same key.
- `HoneyOverlay` registers itself via `useRegisterHoneyOverlay` while `active`, applies `inert` when inactive, and
  by default maps Escape to `onDeactivate`. Its children may be a render function receiving
  `{ overlay, isActive, deactivateOverlay }`.

**2. The layer registry — `HoneyLayerRegistry`.** A separate, intentionally UI-agnostic, `useState`-backed ordered
stack with arbitrary payloads, used for z-ordering (curtains, modals, drawers). Nesting is suppressed: if a parent
registry exists in the tree, the inner one renders as a pass-through. It has no connection to the overlay stack.

### Popup / context menu (floating-ui composition)

`HoneyPopup` = `HoneyPopupTree` (optional `FloatingTree`, auto-disabled when a parent floating node exists) wrapping
`HoneyPopupContent`. `HoneyPopupContent` calls `useHoneyPopup` for positioning/interactions/transition, then renders
reference -> `HoneyPopupPortal` -> `FloatingFocusManager` -> **`HoneyOverlay`**. Routing the floating element through
`HoneyOverlay` is what gives popups Escape handling and correct stack ordering for free. `HoneyContextMenu` is a thin
layer over `HoneyPopup`. Prop objects are passed down by slot (`referenceProps`, `referenceUserProps`, `contentProps`,
`focusManagerProps`, `arrowProps`, `portalProps`) — extend that pattern rather than flattening new props.

### Screen state

`useHoneyMediaQuery(theme, options)` derives `HoneyScreenState` (`isXs`..`isXl`, `isPortrait`/`isLandscape`) from
`theme.breakpoints`, `window.innerWidth`, and `window.screen.orientation`, with a throttled resize listener. It runs
once inside `HoneyLayoutProvider`; consumers read `screenState` from `useHoneyLayout()`. Because it touches
`screen.orientation`, `vitest.setup.ts` installs a mock for it — jsdom does not provide one.

### Effects

`HoneyEffect<Config, Props>` is `config => styledFunction`. Effects are passed to any `HoneyBox` descendant as the
`effects` array prop. `src/effects.ts` ships `honeyVisibilityTransitionEffect`; new shared effects belong there.

### Docs app (`src/docs`)

Not published. It imports the library through **relative source paths** (`../providers`, `../components`), so
`pnpm start` is a live playground against the working tree — changes to `src` are reflected immediately. Pages are
MDX files in `src/docs/pages/*.page.mdx`, registered in the `PAGES` array in `src/docs/constants.tsx`, which drives
both the router and the sidebar menu. Runnable demos live in `src/docs/pages/examples/`. Adding a component
generally means adding a `.page.mdx` and a `PAGES` entry.

## Conventions

- **Type imports are always separate `import type` statements**, placed after the value imports in the same group.
  The codebase has 129 of them and zero inline `import { type X }` — keep it that way.
- **File layout per component folder**: `<Name>.tsx` (logic), `<Name>Styled.ts` (styled parts), `<Name>.types.ts`
  (shared types), `hooks/` (component-local hooks), `index.ts` (curated barrel), `__tests__/<kebab-name>.spec.tsx`.
- **Every rendered component sets `data-testid`**, defaulting to its kebab-case name and overridable through props
  (`props['data-testid'] ?? 'honey-box'`). Tests select exclusively via `getByTestId`.
- **Props grouped with marker comments** in JSX — `// ARIA` before aria attributes, `// Data` before `data-*`.
- **Public props and exported types carry JSDoc**, including `@default` for optional props and `@example` blocks on
  components. This is the package's user-facing documentation; match the existing density.
- **Dev-only diagnostics** go behind the `__DEV__` flag from `src/constants.ts` and use `warnOnce(key, message)`
  from `src/utils/feedback.ts` so warnings do not spam. Invariants use `assert` from `@react-hive/honey-utils`.
  Messages are prefixed `[@react-hive/honey-layout]: `.
- **Tests must wrap in `HoneyLayoutProvider`** with `themeMock` from `src/__mocks__`. Each spec defines its own
  local `customRender` helper — there is no shared test-utils module. `vitest` globals are enabled, so `describe`,
  `it`, `expect`, and `vitest` need no import.
- Prettier: 100 columns, single quotes, semicolons, `arrowParens: "avoid"`.
