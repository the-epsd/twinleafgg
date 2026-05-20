# Svelte 5 Architecture Migration Changelog

This log records migration changes and the reason behind each slice. It is
intended to help reviewers and future agents understand why files moved.

## 2026-05-19

### Branch Setup

- Started migration work on `codex/svelte5-architecture` from a clean
  `twinleaf-lite` worktree.
- Kept the current behavior and visuals as the default constraint. Any behavior
  changes should be called out explicitly in this file.

### Policy

- Added `CONTRIBUTING.md` for `ptcg-play-svelte` with Svelte 5 migration rules:
  new Svelte files use runes, new child-to-parent communication uses callback
  props, prompt field casts stay behind typed helpers, and component-local CSS
  moves into component `<style>` blocks as components are extracted.

### Dead Code Cleanup

- Removed unused `PlayerSummary.svelte`; it had no import sites.
- Removed unused `localGameApi.useStadium`; no Svelte caller referenced it.
- Removed unreachable `AttachEnergyPrompt` checks from the discard/move energy
  branch in `PromptPanel.svelte`. The dedicated `AttachEnergyPrompt` branch
  handles that prompt before this branch can run.

### Pure Helper Extraction

- Added `src/lib/game/targets.ts` for prompt target derivation and value-based
  target comparison. `App.svelte` and `PromptPanel.svelte` now share these
  helpers instead of duplicating board-target logic.
- Added `src/lib/game/preview.ts` for setup and attach-energy preview slot
  construction. `App.svelte` now calls these helpers instead of fabricating
  preview slots locally.
- Added `src/lib/game/energyIcons.ts` for energy and Pokemon type icon lookup.
  `BoardSlot.svelte` now imports this logic instead of owning hard-coded icon
  tables.
- Added focused tests for target filtering, preview construction, and icon
  lookup.

### Typed Prompt Helper Foundation

- Added `src/lib/game/prompts.ts` with the initial `KnownPrompt | UnknownPrompt`
  foundation and shared helpers for prompt options, slots, blocked indexes,
  blocked targets, and prompt card extraction.
- Integrated those helpers into `App.svelte` and `PromptPanel.svelte`, removing
  prompt-field `as any` casts from app/component code. The remaining `as any`
  occurrences are in existing engine tests.
- Added `prompts.test.ts` to cover the initial known prompt set and field-helper
  behavior.

### Styling Foundation

- Added `src/styles/tokens.css` for root-level visual tokens and
  `src/styles/reset.css` for base element rules.
- Updated `src/main.ts` to load tokens, reset, then the remaining legacy
  `styles.css`.
- Moved the existing root/base rules out of `styles.css` without changing their
  declarations, preserving visuals while creating the future destination for
  global styles.

### PromptHost Foundation

- Added `src/lib/components/prompts/PromptHost.svelte` in runes mode. It routes
  migrated prompt classes to new callback-prop components and keeps
  `PromptPanel.svelte` as a temporary legacy fallback for board-coupled and
  not-yet-migrated prompts.
- Added first isolated prompt components in runes mode:
  `AlertLikePrompt.svelte`, `WaitPrompt.svelte`, `ConfirmPrompt.svelte`, and
  `CoinFlipPrompt.svelte`.
- Added `SelectPrompt.svelte` in runes mode for `SelectPrompt` and
  `SelectOptionPrompt`, including the mulligan draw slider state as local
  `$state`/`$effect`.
- Added `ChooseAttackPrompt.svelte` in runes mode and removed that branch from
  the legacy prompt chain.
- Added `ChoosePrizePrompt.svelte` and `ChooseEnergyPrompt.svelte` in runes
  mode, keeping their selected-index state local to the prompt component.
- Added `ChooseCardsPrompt.svelte`, `CardListPrompt.svelte`,
  `ShuffleOrderPrompt.svelte`, `EnergyTransferPrompt.svelte`, and
  `DamagePrompt.svelte` in runes mode. Their selection/source/damage state now
  belongs to the prompt instance instead of the legacy prompt bridge.
- Added `AttachEnergyPrompt.svelte` in runes mode and kept its board-coupled
  assignment state flowing through `App.svelte` for now, matching the existing
  board highlight and pending-preview behavior.
- Updated `App.svelte` to render `PromptHost` with callback props instead of
  listening directly to `PromptPanel` dispatcher events.
- Deleted `PromptPanel.svelte`. `ChoosePokemonPrompt` is handled by the
  existing board prompt dock in `App.svelte`; all prompt-dock rendering now goes
  through `PromptHost.svelte`.

### Game Session Store Foundation

- Added `src/state/game.svelte.ts` as the Svelte 5 `$state` owner for game
  lifecycle fields and command execution (`game`, `error`, `busy`,
  `resolvingPrompt`, `run`, `resolve`, `reset`).
- Added `src/state/selection.svelte.ts` as the Svelte 5 `$state` owner for
  long-lived hand selection, drag state, and focused-Pokemon state.
- Routed engine commands in `App.svelte` through the store-backed command
  helpers instead of repeating the busy/apply-response block at each callsite.
- Routed App selection mutations through `selectionStore` while preserving an
  explicit legacy-component synchronization bridge. This keeps behavior stable
  until `App.svelte` itself moves to runes and can consume rune store fields
  directly.
- Converted `App.svelte` itself to runes mode. It now consumes `gameStore` and
  `selectionStore` through `$derived` values directly, removing the temporary
  legacy-component synchronization bridge.
- Fixed the partial-reset behavior noted in the audit: command responses now
  clear hand drag/selection/focus state even when the engine returns an error
  response with a replacement `view`.
- Added `src/state/setupSelection.svelte.ts` as the Svelte 5 `$state` owner for
  setup active/bench placement indexes. `App.svelte` now reads those values as
  derived state and calls store methods for setup placement/removal, while the
  board preview and setup-confirm behavior remain unchanged.
- Added `src/state/setupSelectionModel.ts` for pure setup placement transforms.
  This keeps deterministic placement rules testable without importing a rune
  module directly into Vitest.

### Presentational Component Extraction

- Added `ImportScreen.svelte` in runes mode with `$bindable` deck text props.
  The import screen markup/classes are unchanged, but the state boundary is now
  explicit.
- Moved `ImportScreen.svelte`'s import-screen layout, deck grid, textarea, error
  box, and mobile deck-grid CSS out of `styles.css` and into the component.
  This removes the old global `textarea`, `.import-screen`, `.deck-import`, and
  `.error` import-screen rules.
- Added `BoardPerspectiveControls.svelte` in runes mode with `$bindable`
  perspective values and a reset callback. This keeps the toolbar markup in
  `App.svelte` smaller without changing the controls.
- Converted `ZoneViewer.svelte` to runes mode and replaced its dispatcher event
  with an explicit `close` callback prop.
- Converted `CardTile.svelte`, `Hand.svelte`, `BoardSlot.svelte`, and
  `GameBoard.svelte` to runes mode. Existing behavior and class names were
  preserved, while component event forwarding was replaced with explicit
  callback-style event props where these components talk to each other.
- Added `Toolbar.svelte` in runes mode and moved the table toolbar controls out
  of `App.svelte`, including the board perspective controls, toggles, turn
  actions, and inline error display.
- Added `ActiveFocus.svelte` in runes mode and moved the focused-Pokemon action
  modal out of `App.svelte`. The modal remains presentational: it receives the
  focused slot, action availability, and callbacks for ability, attack, retreat,
  and close.
- Added `SetupDock.svelte`, `BoardPromptDock.svelte`, and `LogPanel.svelte` in
  runes mode for the remaining small App-owned display panels. These keep the
  same classes and text while reducing `App.svelte` to session orchestration and
  board-state coordination.
- Replaced remaining `on:` event directives in the active Svelte component tree
  with Svelte 5 event attributes. `src/lib/components/` now has no
  `export let`, no `createEventDispatcher`, and no `on:` event directives.
- Added `BenchZone.svelte` in runes mode as the presentational owner for each
  player bench row and its bench drop surface. The existing board callbacks are
  still passed from `GameBoard.svelte`; the bench-zone CSS moved from
  `styles.css` into the component.
- Added `StadiumCard.svelte` in runes mode as the presentational owner for the
  top/bottom stadium card buttons. The stadium CSS moved from `styles.css` into
  the component while preserving the existing class names and rotated top-card
  layout.
- Added `CenterPiles.svelte` in runes mode as the presentational owner for the
  center lost-zone, prize, deck, and discard piles. The pile/deck/prize CSS
  moved from `styles.css` into the component. `GameBoard.svelte` still owns the
  projected-pile hit-test state for now, passing the four pile element refs
  through `bind:` so the existing click workaround behaves the same.
- Added `ActiveDuel.svelte` in runes mode as the presentational owner for the
  active Pokemon slots and stadium placement. Active-duel layout, top-active
  rotation, active-slot pointer targeting, and mobile row sizing moved from
  `styles.css` into the component with scoped `:global(...)` selectors for the
  child `BoardSlot` root classes.

### Verification

- Repeated `npm run build` and `npm test -- --run` after each substantial
  migration slice.
- Ran a browser smoke test at `http://localhost:5174/`: loaded the import
  screen, started a local game through the existing engine proxy, resolved the
  initial `ConfirmPrompt`, and verified the setup board rendered without console
  errors.
- Re-ran the browser smoke after the board/hand/toolbar conversion to verify
  the migrated board, hand, and toolbar surfaces still render and interact
  through setup without console errors.
- Re-ran the browser smoke after the active-focus extraction to verify the
  import/start/confirm/setup path still renders without console errors.
- Re-ran the browser smoke after the setup/board dock and log-panel extraction
  to verify the setup dock still renders correctly without console errors.
- Re-ran the browser smoke after the selection-store migration to verify the
  import/start/confirm/setup path still renders without console errors.
- After converting `App.svelte` to runes mode, `npm run build` and
  `npm test -- --run` pass. A browser smoke was attempted against the production
  preview, but the in-app browser click automation did not trigger the start
  button even though the built bundle contains the click handlers. This needs a
  fresh manual/browser verification pass before treating the App conversion as
  visually signed off.
- Rechecked the import-screen click path against the dev server after the setup
  selection store extraction. `npm run build` passes and `npm test -- --run`
  passes with 9 files / 39 tests. The in-app browser still focuses the start
  button without delivering a visible click result; a temporary direct DOM
  listener probe behaved the same and was removed, so this remains a browser
  automation caveat rather than a retained code change.
- Verified the same path with an independent headless Chrome + Playwright smoke
  outside the in-app browser. That exposed a real App runes regression: the
  attach-energy assignment pruning effect read and wrote the same `$state`
  array, producing `effect_update_depth_exceeded` when no attach prompt was
  active. Guarded that write with value comparison and restored the missing
  `canAct` helper from the legacy reactive declaration.
- Re-ran the independent smoke through `Start local game` and the initial
  `Go first?` confirmation. The setup dock and board render with no page errors;
  the only console error is the existing missing favicon request.
- Re-ran `npm run build`, `npm test -- --run`, and the independent headless
  Chrome + Playwright smoke after the `BenchZone`/`StadiumCard` extraction.
  The smoke reaches the setup dock and board, confirms both bench zones and the
  active duel have non-zero layout boxes, and reports no app page errors.
- Investigated the `GameBoard` projected pile hit-test. In headless Chrome,
  `elementFromPoint` at the pile centers lands on `.playmat` or
  `.game-board-plane` for most lost/discard piles because the transformed
  center pile stack has `pointer-events: none` through the container chain.
  Changing only `button.stack-pile` to `pointer-events: auto` lets the bottom
  discard pile work, but the top lost, top discard, and bottom lost centers
  still fall through. Making the container chain pointer-aware also failed to
  make all four direct pile clicks reliable. The manual projected hit-test stays
  in place until the center pile layering is rebuilt or moved into a dedicated
  `CenterPiles.svelte` that can own the workaround explicitly.
- Re-ran `npm run build` and `npm test -- --run` after the `CenterPiles`
  extraction; both passed with the existing 9 files / 39 tests.
- Re-ran the independent headless Chrome + Playwright smoke after the
  `CenterPiles` extraction. The setup board renders with non-zero center pile
  layout boxes, and all four projected lost/discard pile clicks open the
  expected zone viewer. The only console error remains the existing missing
  favicon request.
- Re-ran `npm run build`, `npm test -- --run`, and the independent headless
  Chrome + Playwright setup smoke after the `ActiveDuel` extraction. The active
  duel and both active slot boxes render with non-zero layout, active slots keep
  `pointer-events: auto`, and no app page errors were reported.
- Re-ran `npm run build`, `npm test -- --run`, and a headless Chrome import
  layout smoke after moving `ImportScreen` CSS. The desktop import screen keeps
  two deck columns and the mobile viewport collapses to one deck column, with
  both deck textareas and the start button visible.
