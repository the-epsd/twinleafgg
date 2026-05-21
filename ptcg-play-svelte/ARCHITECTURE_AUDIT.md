# Svelte UI — Architecture Audit & Migration Plan

**Status:** Approved direction. Ready for implementation agents.
**Branch:** `twinleaf-lite`
**Scope:** `ptcg-play-svelte/src/` — the Svelte front-end and its local engine bridge.
**Audience:** Implementation agents and reviewers picking up the refactor work.

This document is the consolidated working plan. It combines the original audit
with two passes of review feedback. The goal is to make every piece of UI state
have one explicit owner; runes are the tool that gets us there, not the goal
itself.

---

## 1. Diagnosis

### 1.1 What's healthy — do not touch

- **The engine boundary is clean.** `src/engine/localEngine.ts` spawns the
  `ptcg-server` headless CLI, talks JSON over stdio, and translates the
  engine's snapshot into `GameView` via `buildView` / `buildPlayerView` /
  `buildPokemonSlot` / `normalizeCard`. The UI never sees raw engine objects.
- **`src/engine/server.ts`** is a 58-line HTTP shim. The web client posts JSON
  commands to `/local-engine`. Right shape for a local-first client.
- **`src/lib/game/types.ts`** has a clean domain model — `CardView`,
  `PokemonSlotView`, `PlayerView`, `PromptView`, `GameView`, `PlayerType`,
  `SlotType`, `targetFor`. The trouble is that components don't lean on it.
- **Pure logic is extracted and tested.** `playTargets.ts`, `setupPrompt.ts`,
  `deckImport.ts`, `labels.ts`, `localEngine.ts` all have `.test.ts` siblings.
  `setupPrompt.getSetupPromptUiState` is the model pattern.
- **`httpClient.ts`** is appropriately thin. No accidental abstractions.
- **`labels.ts`** is small and isolated.

Verified: `npm run build` passes; `npm test` passes (4 files, 22 tests).

### 1.2 The root issue — state has no owner

State and behavior do not have stable owners. `App.svelte` and
`PromptPanel.svelte` have become god components that hold most of the UI's
state and most of its derived logic. CSS is entirely global. Prompt fields
are typed as `Record<string, unknown>` and accessed via `as any`. Three
different parent↔child communication styles coexist.

Svelte 5 is declared in `package.json` (`^5.45.6`) but no runes are used
anywhere — 0 occurrences of `$state` / `$derived` / `$effect` / `$props` /
`$bindable`. That is a symptom of the ownership problem, not the cause. The
cure is to give every piece of state a single owner, using Svelte 5
primitives where they clarify that ownership.

### 1.3 Concrete problems

#### 1.3.1 `App.svelte` is a god component (1,125 lines)

The top-level component owns eight different feature modules:

- **Lifecycle:** `game`, `error`, `busy`, `resolvingPrompt`, deck textareas.
- **Selection:** `selectedHand`, `draggingHand`, `focusedSlot`, `viewIndex`,
  `followActive`.
- **Setup-prompt:** `setupActiveIndex`, `setupBenchIndexes`, `setupPromptKey`.
- **Board-prompt:** `selectedBoardTargets`, `boardPromptMin`/`Max`,
  `boardPromptTargets`.
- **Attach-energy:** `attachPromptEnergyIndex`, `attachPromptAssignments`,
  `attachPromptCards`, `attachPromptTargets`, `attachPromptMin`/`Max`,
  `attachPreviewKey`.
- **Auto-confirm:** `autoConfirmPrompts`, `autoConfirmPromptKey`.
- **Zone viewer:** `openZone`.
- **Board perspective sliders:** `boardTilt`, `boardPerspective`,
  `boardScaleY`, `boardLift`, `debugZones`, `showLogs`.

840 lines of script before the template starts. ~40 `$:` derivations,
~30 functions, and 30 props (12 of them callbacks) drilled into `GameBoard`.

Notable smells inside:

- Lines 102–116: imperative state resets inside a `$:` block — that's an
  effect, not a derivation.
- Helpers that don't belong on a Svelte component: `getBoardPromptTargets`,
  `getAttachPromptTargets`, `extractPromptCards`, `sameTarget`,
  `targetForPromptSlot`, `normalizePromptLimit`, `previewAttachEnergySlot`,
  `benchSlotsFor`, `canPlayOnBoardState`.
- The "preview" mechanism (`previewSlot`, `previewAttachEnergySlot`)
  fabricates fake `PokemonSlotView`s so `GameBoard` renders pending
  placements. Clever, but invisible to anyone reading the render code.

#### 1.3.2 `PromptPanel.svelte` is a god component (790 lines)

One file handles every prompt class with one shared state bag
(`selectedIndexes`, `selectedTargets`, `sourceTarget`, `damageAmount`,
`attachEnergyIndex`, `mulliganDrawAmount`, `mulliganDrawKey`, `autoContinueKey`,
`autoContinueTimer`, `hidden`, `promptKey`). State for one prompt class leaks
into another; the reset block at lines 65–74 is a workaround for that. 360
lines of `{#if … :else if …}` chain.

State is also duplicated with `App.svelte`: both compute selectable targets
for `ChoosePokemonPrompt`, both manage attach-energy assignments (via
prop + event sync), both define `sameTarget` and target-from-slot helpers.

#### 1.3.3 CSS: 2,256 lines, all global

`src/styles.css` is one flat file with ~316 selectors, ~292 distinct class
names, one media query, zero CSS variables on `:root`. **No component uses
a `<style>` block.** Consequences:

- Rename a class → grep across CSS and Svelte.
- Delete a component → dead CSS, no compile-time signal.
- Visual concerns leak: `.energy-badges`, `.pokemon-status`,
  `.attach-energy-card` live in the same namespace as `.app-header`.
- Theming requires retroactive variable extraction.

#### 1.3.4 Prop drilling and event-style inconsistency

`GameBoard.svelte` declares 30 props (lines 6–41); 12 are callbacks that
thread back to `App.svelte` for state `GameBoard` doesn't own.

The seven components use three different patterns for child→parent:

| Component       | Style                                                   |
| --------------- | ------------------------------------------------------- |
| `PromptPanel`   | `createEventDispatcher`                                 |
| `ZoneViewer`    | `createEventDispatcher`                                 |
| `Hand`          | Callback props (`onSelect`, `onDrag`, `onDragEnd`)      |
| `GameBoard`     | Callback props (12+ of them)                            |
| `BoardSlot`     | Bare DOM event forwarding (`on:click`, `on:dragover`)   |
| `CardTile`      | Bare DOM event forwarding                               |
| `PlayerSummary` | Dead — no consumers                                     |

#### 1.3.5 `as any` on prompt fields (47 occurrences)

`PromptView.fields: Record<string, unknown>` forces every consumer to write
`(prompt.fields as any).options.blocked`. The engine knows what shape
`fields` has — `className` is right there. A tagged union eliminates the
casts.

#### 1.3.6 Dead / vestigial code

- `PlayerSummary.svelte` has no consumers.
- The lower `AttachEnergyPrompt` branch in `PromptPanel.svelte`
  (lines 684–714) is unreachable because the earlier branch at line 644
  short-circuits.
- `localGameApi.useStadium()` has no Svelte caller.
- `customEnergyIcons` in `BoardSlot.svelte` is a 20-entry hard-coded table
  that belongs in `lib/game/`.
- `mulliganDrawValues` parses display strings with a regex
  (`/^Draw\s+(\d+)\s+card\(s\)$/i`). Breaks if the engine ever localizes.

#### 1.3.7 Other smells

- **`GameBoard.projectedPiles`** uses `getBoundingClientRect()` hit-testing
  on `on:mousemove` + `on:click` to figure out which pile a click landed in,
  then synthesizes the click. Implies the perspective transform is covering
  the real buttons. Needs investigation before scheduling a fix — could be
  a `pointer-events` / `z-index` tweak or a transform rebuild.
- **`applyResponse`** partial reset: on `res.ok = false` with a `view`, it
  updates `game` but doesn't clear `selectedHand`/`focusedSlot`. Selection
  can point into a stale hand index.
- **`CardTile`** duplicates its markup tree for `interactive` true vs false.
  Use `<svelte:element this={interactive ? 'button' : 'div'}>`.
- **`BoardSlot.placement`** is a free-form string used as a CSS class.
  Type it.
- **Drag-data MIME types** are inconsistent. `PromptPanel.dragAttachEnergy`
  sets `application/x-twinleaf-energy-index`; `App.onHandDrag` only writes
  `text/plain`. Standardize.
- **Two parallel auto-confirm machines**: `App.autoConfirmPrompts` and
  `PromptPanel.autoContinue`. Delete one.
- **Per-action busy plumbing** (~8 callsites): every action repeats
  `busy = true; await …; busy = false; applyResponse(res)`. A `runCommand`
  wrapper deduplicates.

---

## 2. Target architecture

### 2.1 Directory shape

```
src/
  state/
    game.svelte.ts              # gameStore — game, error, busy, resolving, runCommand()
    selection.svelte.ts         # selectionStore — hand selection, drag, focused slot
    perspective.svelte.ts       # board control sliders (probably debug-only)
  lib/
    game/
      types.ts                  # (unchanged)
      prompts.ts                # KnownPrompt | UnknownPrompt + field helpers
      targets.ts                # sameTarget, targetForPromptSlot, prompt target derivation
      preview.ts                # previewSlot, previewAttachEnergySlot, benchSlotsFor
      energyIcons.ts            # icon tables + lookup
      playTargets.ts            # (unchanged)
      setupPrompt.ts            # (unchanged)
      deckImport.ts             # (unchanged)
      labels.ts                 # (unchanged)
      httpClient.ts             # (unchanged)
    components/
      App.svelte                # ~150 lines, layout only
      ImportScreen.svelte
      Toolbar.svelte
      BoardPerspectiveControls.svelte
      board/
        GameBoard.svelte        # thin shell
        BoardSlot.svelte        # presentational, scoped <style>
        BenchZone.svelte
        CenterPiles.svelte
        ActiveFocus.svelte      # focused-Pokemon modal
        StadiumCard.svelte
      hand/
        Hand.svelte
        CardTile.svelte
      prompts/
        PromptHost.svelte       # dispatcher: className → component
        AlertLikePrompt.svelte  # Alert + ShowCards + ConfirmCards + ShowMulligan
        WaitPrompt.svelte
        ConfirmPrompt.svelte
        CoinFlipPrompt.svelte
        SelectPrompt.svelte
        MulliganDrawPrompt.svelte
        ChooseAttackPrompt.svelte
        ChooseCardsPrompt.svelte
        ChoosePrizePrompt.svelte
        ChooseEnergyPrompt.svelte
        ChoosePokemonPrompt.svelte
        AttachEnergyPrompt.svelte
        DiscardEnergyPrompt.svelte
        MoveEnergyPrompt.svelte
        PutDamagePrompt.svelte
        MoveDamagePrompt.svelte
        RemoveDamagePrompt.svelte
        ShuffleOrderPrompt.svelte
      zones/
        ZoneViewer.svelte
  styles/
    tokens.css                  # :root variables (colors, spacing, fonts, perspective)
    reset.css                   # element resets, true globals
    # everything else lives in component <style> blocks
```

### 2.2 State ownership rules

State has three categories. Treat them differently.

**App-global session state (singleton `$state` class in `state/game.svelte.ts`):**
`game`, `error`, `busy`, `resolvingPrompt`, command execution. One game session
per app; singleton import is fine.

```ts
// state/game.svelte.ts
class GameStore {
  game = $state<GameView | null>(null);
  error = $state('');
  busy = $state(false);
  resolvingPrompt = $state(false);

  // Plain getters over $state are reactive automatically.
  // Use $derived only for stored memoized projections.
  get currentPrompt() { return this.game?.prompts[0]; }
  get gameFinished() { return this.game?.phase === 7; }

  async run(fn: () => Promise<EngineResponse>) {
    this.busy = true;
    try {
      this.apply(await fn());
    } finally {
      this.busy = false;
    }
  }

  private apply(res: EngineResponse) { /* current applyResponse logic, with the partial-reset bug fixed */ }
}

export const gameStore = new GameStore();
```

**Long-lived UI state with explicit resets (singleton `$state` class):**
`selectionStore` (hand selection, drag, focused slot). Includes an `$effect`
that resets itself on `gameStore.currentPrompt?.id` change.

**Per-prompt-instance state stays inside its prompt component.** Do not make
singletons out of these:

- `ChoosePokemonPrompt.svelte` owns `selectedTargets`.
- `AttachEnergyPrompt.svelte` owns `attachAssignments` and
  `activeEnergyIndex`.
- `SetupPrompt.svelte` (extracted from App's setup-dock logic) owns
  `setupActiveIndex` and `setupBenchIndexes`.
- `ChooseCardsPrompt.svelte` owns `selectedIndexes`.

These die when the prompt resolves. Making them long-lived singletons is the
wrong move.

### 2.3 Container vs presentational split

When a component is extracted, classify it:

- **Container** — imports stores, derives a view-model, passes props down.
  Allowed to import `gameStore` / `selectionStore` / feature state.
- **Presentational** — receives props and callback props. Does **not** import
  stores. Easier to test and reason about in isolation.

Default to presentational for leaves. A container is a deliberate choice that
should be visible in the file's name and placement (e.g. `BoardContainer`
wraps `GameBoard`; `BoardSlot` stays presentational).

This is the rule that prevents trading visible prop drilling for invisible
global coupling.

### 2.4 Event style: callback props

New code uses callback props (`onclick`, `onresolve`, `onclose`).
`createEventDispatcher` is deprecated in Svelte 5 and is not used in new
code. DOM-event forwarding stays for true leaf wrappers (`CardTile`,
`BoardSlot`) where the parent really does want the raw event.

### 2.5 Prompt typing

Start with `type Prompt = KnownPrompt | UnknownPrompt` in
`lib/game/prompts.ts`. `KnownPrompt` is a discriminated union keyed on
`className`. The union grows one prompt class at a time, paired with that
prompt's extraction. Don't try to type every server prompt up front.

Field-typed accessors (`promptOptions(prompt)`, `promptSlots(prompt)`,
`promptBlockedIndexes(prompt)`) hide the remaining `as any` until each prompt
is typed.

### 2.6 CSS

`src/styles/tokens.css` for `:root` variables. `src/styles/reset.css` for
element resets and true globals. Everything else moves into component
`<style>` blocks **as each component is extracted or rewritten**, not as a
sweeping pre-pass.

---

## 3. Standing rules for new work

These apply immediately, before any migration step lands.

1. **New `.svelte` files use Svelte 5 runes from the first commit** —
   `$props`, `$state`, `$derived`, `$effect`. Existing legacy files can
   stay in legacy mode while being shrunk.
2. **New shared reactive state lives in `.svelte.ts` modules**, not in
   `App.svelte` or as ad-hoc top-level `let` variables.
3. **No new feature state in `App.svelte` or `PromptPanel.svelte`.** Both
   are being decommissioned.
4. **No new `createEventDispatcher` usage.** Use callback props.
5. **No new global CSS for component-local UI.** Use `<style>` blocks.
   Only tokens, resets, and truly cross-cutting concerns go in
   `src/styles/`.
6. **No new prompt-field `as any`** outside `lib/game/prompts.ts`. Use the
   typed helpers.
7. **No new prompt behavior added to `PromptPanel.svelte`** unless it's a
   short-lived bridge during extraction.
8. **Stores are imported by containers**, not by every leaf component. If a
   component imports a store, it is a container and should be named and
   placed accordingly.

---

## 4. Migration plan

Each step is independently shippable. Acceptance criteria per step are below;
the cross-cutting criteria in §5 apply to every PR.

### Step 0 — Adopt §3 as policy

Land a short `CONTRIBUTING.md` (or section in `CLAUDE.md`/`README`) that
states the rules in §3. No code change. Without this, the migration leaks.

**Done when:** the rules exist in a file teammates and agents will read.

### Step 1 — Delete dead code

- Remove `src/lib/components/PlayerSummary.svelte` (no consumers).
- Remove the unreachable `AttachEnergyPrompt` branch in
  `src/lib/components/PromptPanel.svelte` lines 684–714.
- Remove `localGameApi.useStadium` from `src/lib/game/httpClient.ts` after
  confirming no caller.

**Done when:** dead files are gone, build and tests still pass, no
behavior change is visible.

### Step 2 — Extract pure helpers

Move out of `App.svelte` and `PromptPanel.svelte`:

- `src/lib/game/targets.ts` — `sameTarget`, `targetForPromptSlot`,
  `getSelectableTargets`, `getAttachTargets`, `getBoardPromptTargets`.
- `src/lib/game/preview.ts` — `previewSlot`, `previewAttachEnergySlot`,
  `benchSlotsFor`.
- `src/lib/game/energyIcons.ts` — regex table + custom icon map from
  `BoardSlot`.

Add unit tests for each module. No component behavior change.

**Done when:** helpers exist as standalone modules, components import them
instead of redefining them, tests pass, behavior identical.

### Step 3 — Typed prompt helpers (narrow start)

Create `src/lib/game/prompts.ts`:

- `type Prompt = KnownPrompt | UnknownPrompt`.
- `KnownPrompt` initially covers two or three of the simplest prompts —
  `AlertPrompt`, `ConfirmPrompt`, `WaitPrompt`. Field types are explicit.
- `UnknownPrompt` is structurally similar to today's `PromptView`.
- Field-typed accessors: `promptOptions(prompt)`, `promptSlots(prompt)`,
  `promptBlockedIndexes(prompt)`, etc.
- `localEngine.buildView` keeps emitting the loose shape; narrowing happens
  at read sites.

**Done when:** helpers exist, `as any` count starts dropping, no prompt
behavior change. The union grows in Step 5.

### Step 4 — Styling foundation

Create only:

- `src/styles/tokens.css` — `:root` variables for colors, spacing scale,
  font stack, board perspective vars.
- `src/styles/reset.css` — element resets and true globals (`body`, `*`,
  default button reset).

Update `src/main.ts` to import both. **Leave `styles.css` largely intact**
for now. Component-local styles will move into their components in
Steps 5–8.

**Done when:** tokens and reset exist, are loaded first, and `styles.css`
still works as before.

### Step 5 — Split `PromptPanel` behind `PromptHost`

This is the biggest single chunk of work. Stage it in three sub-phases so
each PR is small.

**5a — Isolated prompts first.** These have self-contained state and
rendering; they don't reach into `App.svelte` or `GameBoard`. Move them in
roughly this order:

1. `PromptHost.svelte` skeleton (registers components by `className`).
2. `AlertLikePrompt.svelte` (covers Alert / ShowCards / ConfirmCards /
   ShowMulligan).
3. `WaitPrompt.svelte`, `ConfirmPrompt.svelte`, `CoinFlipPrompt.svelte`.
4. `SelectPrompt.svelte` + `MulliganDrawPrompt.svelte`.
5. `ChooseCardsPrompt.svelte`.
6. `ChoosePrizePrompt.svelte`.
7. `ChooseEnergyPrompt.svelte`.
8. `ShuffleOrderPrompt.svelte` (Shuffle + Order).
9. `DiscardEnergyPrompt.svelte`, `MoveEnergyPrompt.svelte`.
10. `PutDamagePrompt.svelte`, `MoveDamagePrompt.svelte`,
    `RemoveDamagePrompt.svelte`.
11. `ChooseAttackPrompt.svelte`.

For each:

- Create the new component in runes mode.
- Add its variant to `KnownPrompt` in `src/lib/game/prompts.ts`.
- Move its local state out of `PromptPanel` into the new component as
  `$state`.
- Co-locate its CSS in a `<style>` block (remove those rules from
  `styles.css` in the same PR).
- Register it in `PromptHost`'s class→component map.
- Delete the corresponding branch from `PromptPanel.svelte`.

**5b — Board-coupled prompts last.** `ChoosePokemonPrompt` (board-target
path) and `AttachEnergyPrompt` reach into `App.svelte` and `GameBoard`
today: board selectability, board highlighting, pending energy previews,
drop targets, and board click handling all live outside `PromptPanel`.

Do not start with these. Move them only after:

- The target/preview helpers from Step 2 exist.
- A prompt context or view-model is in place that lets the prompt component
  expose its selectable/selected state to `GameBoard` without going through
  `App.svelte`.

**5c — Retire `PromptPanel`.** When the chain is empty, delete
`PromptPanel.svelte`.

**Done when:** every prompt class has its own component under
`src/lib/components/prompts/`; `PromptHost.svelte` dispatches by
`className`; `PromptPanel.svelte` is deleted; no prompt-class state lives in
`App.svelte` or `PromptPanel.svelte`.

### Step 6 — Create `gameStore`

Create `src/state/game.svelte.ts` per §2.2.

Migrate from `App.svelte`:

- `game`, `error`, `busy`, `resolvingPrompt` fields.
- `applyResponse` logic (fix the partial-reset bug: clear
  `selectedHand`/`focusedSlot` on engine errors too).
- All action methods (`startGame`, `playToTarget`, `attack`, `useAbility`,
  `concede`, `passTurn`, `retreat`, `resolvePrompt`) wrap their HTTP call in
  `gameStore.run(...)`.

The ~8 `busy = true; await …; busy = false; applyResponse(res)` blocks in
`App.svelte` collapse to `gameStore.run(...)`.

**Done when:** `App.svelte` no longer owns lifecycle state; all command
callsites go through `gameStore.run`; behavior is identical.

### Step 7 — Per-feature state modules and prompt-local state

Two parallel tracks, both required:

**7a — `selectionStore` as a singleton** in
`src/state/selection.svelte.ts`. Holds `selectedHand`, `draggingHand`,
`focusedSlot`. Includes an `$effect` that resets these when
`gameStore.currentPrompt?.id` changes (replacing the imperative `$:`
block at `App.svelte:102-116`).

**7b — Setup-prompt state moves into a prompt component.** Create
`src/lib/components/prompts/SetupPrompt.svelte` (a `ChooseCardsPrompt`
variant matched by `message === 'CHOOSE_STARTING_POKEMONS'`). It owns
`setupActiveIndex` and `setupBenchIndexes` as `$state` inside its own
component. This component disappears when the setup prompt resolves; its
state dies with it. No global setup store.

Same pattern for attach-energy assignment state when 5b lands — it lives
inside `AttachEnergyPrompt.svelte`, not in a global store.

**Done when:** no per-prompt-instance state lives in `App.svelte`;
long-lived selection state lives in `selectionStore`; the `$:` reset block
at `App.svelte:102-116` is replaced by `$effect`s in the relevant stores.

### Step 8 — Extract presentational components

Carve out of `App.svelte`:

- `ImportScreen.svelte` (the deck-import view).
- `Toolbar.svelte` (the top toolbar with toggles).
- `BoardPerspectiveControls.svelte` (the sliders behind the `⚙` summary).
- `ActiveFocus.svelte` (the focused-Pokemon modal).

Carve out of `GameBoard.svelte`:

- `BenchZone.svelte` (one per side, parameterized by player + bench slots).
- `CenterPiles.svelte` (lost zone, prizes, deck, discard).
- `StadiumCard.svelte`.

Each extraction:

- Runs in runes mode with `$props`.
- Co-locates its CSS in a `<style>` block; removes those rules from
  `styles.css` in the same PR.
- Is **presentational by default** — receives props and callback props, does
  not import stores.
- A small number of components are explicit **containers** that read from
  stores. Name them as such (e.g. a `BoardContainer.svelte` between `App`
  and `GameBoard`, or have `GameBoard` itself be the one place that reads
  `gameStore` + `selectionStore`).

When `App.svelte` is layout-only (target: ~150 lines) and `GameBoard.svelte`
is a thin shell, this step is done.

**Done when:** the components above exist; the corresponding code is gone
from `App.svelte` and `GameBoard.svelte`; component-local CSS is in
`<style>` blocks; the container/presentational split is explicit.

### Step 9 — Investigate the playmat hit-test

`GameBoard.projectedPiles` uses bounding-rect hit-testing because *something*
covers the pile buttons. Before changing it, find out what.

- Inspect with DevTools: which element actually receives the click at the
  pile coordinates? What's its z-index? Does the perspective transform
  enlarge a sibling over the buttons?
- Try the cheap fix: explicit `z-index` on the piles, `pointer-events: none`
  on the covering layer. If it works, delete `projectedPiles` and
  `containsPoint`.
- If the cheap fix doesn't work, document why and scope a separate
  "playmat layering rebuild" PR.

**Done when:** either `projectedPiles` is removed, or we have a written
explanation of what blocks removing it and a follow-up plan.

### Step 10 — Convert remaining legacy components

By now, most active surfaces have been rewritten in runes mode during
extraction. The remaining legacy files (likely `Hand.svelte`,
`CardTile.svelte`, `ZoneViewer.svelte`, `BoardSlot.svelte`) are small and
isolated. Convert each in its own PR:

- `export let` → `let { … } = $props()`.
- `$:` derivations → `$derived` or plain getters.
- `$:` effects → `$effect`.
- `createEventDispatcher` → callback props.
- `on:event` → callback prop or DOM forwarding (`onclick` etc.) as
  appropriate.
- Move component-local CSS into `<style>` blocks.

Also fix the small smells: `CardTile`'s duplicated markup tree via
`<svelte:element>`, typed `BoardSlot.placement`, consistent drag-data MIME
types, deletion of the duplicate auto-confirm machinery.

**Done when:** zero `createEventDispatcher` usages remain; zero `export let`
declarations remain; all remaining global styles have either moved into
`tokens.css` / `reset.css` or into component `<style>` blocks; the old
monolithic `styles.css` is deleted.

---

## 5. Acceptance criteria for every PR

Behavioral, not count-based:

- `npm run build` passes.
- `npm test` passes.
- No new feature state added to `App.svelte` or `PromptPanel.svelte`.
- No new `createEventDispatcher` usage.
- No new prompt-field `as any` outside `src/lib/game/prompts.ts`.
- No new global CSS for component-local UI.
- Every new `.svelte` file uses runes.
- Every moved prompt class or component has one clear owner for its state.
- Behavior of the game UI is unchanged unless the PR explicitly says it
  isn't (e.g. the Step 6 `applyResponse` fix or the Step 9 playmat fix).

Run greps as PR-level sanity, not gates:

```sh
rg -n '\$state|\$derived|\$effect|\$props|\$bindable' src/  # should grow
rg -n 'export let' src/                                     # should shrink
rg -n 'as any' src/                                         # should shrink
rg -n 'createEventDispatcher' src/                          # should shrink to 0
```

---

## 6. Non-goals

- **No new framework or library.** No SvelteKit, no Tailwind, no shadcn,
  no state library beyond Svelte 5's built-in `$state`.
- **No design changes.** The visual outputs the user is happy with stay
  identical. This is a structural refactor.
- **No engine changes.** `ptcg-server`, the headless CLI, and the HTTP shim
  stay as they are.
- **No test framework changes.** Vitest is fine.
- **No build tooling changes.** Vite + the existing svelte plugin already
  support runes; `tsconfig.json` is fine.

---

## 7. Open questions

1. **Singleton stores vs `setContext`?** Singletons are simpler for an app
   with one game session at a time. `setContext` becomes the right answer
   if the app ever needs to render two boards side-by-side (replays?
   spectator mode?). Default to singletons; revisit if multi-session work
   appears.
2. **Where does the `preview` mechanism live long-term?** Two options:
   keep it as pure-function decorators in `lib/game/preview.ts` (current
   shape, cleaner imports), or push it into the render layer as
   "real slot + pending overlay" props on `BoardSlot` (more honest about
   what's happening, more components touched). Default to the former; the
   latter is a follow-up.
3. **Where does auto-confirm live?** Probably on `gameStore` so it can be
   configured per-session, but it could also be a `PromptHost`-level
   concern. Either is fine; one machine, not two.
4. **Board-perspective sliders — feature or dev tool?** If real settings,
   they need persistence. If dev tools, gate them on a `?debug` query
   param and stop carrying them in `App.svelte`. Decide before Step 8.

---

## 8. TL;DR

The UI works and looks good. The architecture is what you'd expect from
"keep hammering until it looks right": one giant App component, one giant
Prompt component, all state at the top, all CSS in one file, all types
reaching into `any`, framework version a major release ahead of the idioms
in use.

None of it is broken. All of it makes the next feature more expensive than
the last. The plan: declare the rule for new work, delete the obvious dead
code, extract the pure helpers, split `PromptPanel` into one component per
prompt class (isolated first, board-coupled last), centralize app-global
state in a `$state` class while keeping per-prompt state inside its prompt
component, and move CSS into `<style>` blocks as components are extracted.
Each step is its own PR. The whole sequence is a focused week.

---

## Revision history

This document consolidates an initial audit, two reviewer passes, and the
agreed direction. Earlier sections (original audit, first review, author
response, first revised plan, second review) have been folded into the
current text. Reviewers: Claude (audit + author response), Codex (first and
second review). The Svelte 5 ownership-first framing, the
`KnownPrompt | UnknownPrompt` starting point, the CSS-moves-during-extraction
sequencing, the container vs presentational split, and the staged Step 5
(isolated prompts before board-coupled prompts) come from the Codex review
passes.
