# Board-Driven Prompts: Generalization Proposal

Status: reviewed by Codex and implemented.
Companion doc: [prompt-design.md](./prompt-design.md) — captures the broader direction; this doc proposes one specific refactor under that umbrella.

## Codex architecture review

The shape is sound, with one important scope correction: this should generalize the **strip-style board effects** first, not every board-targeted prompt. `AttachEnergyPrompt` remains a separate `PromptHost` flow for now because it has an energy cursor and drag/drop assignment behavior. That means the migration should leave the attach-energy branches in `isBoardPromptSelectable`, `isBoardPromptSelected`, `allowDrop`, and `dropToSlot` until a second pass explicitly folds attach assignment into the strategy API.

Implementation should also keep lifecycle cleanup explicit. The current code resets and prunes prompt-local state when prompt instances change or legal targets change. Hiding those side effects inside strategy creators would make `$derived` do work that is hard to reason about. Strategy creators should be pure adapters; `App.svelte` keeps small `$effect` blocks for:

- resetting state on `promptInstanceKey(...)` changes,
- pruning `PutDamagePrompt` placements when eligible targets change,
- clearing board-target selections when a different `ChoosePokemonPrompt` appears.

Use `slotDelta` rather than carrying `promptDamage` forward. The badge is now a generic pending board delta: positive for added damage, negative for removed damage. Renaming it during this refactor is cheaper than preserving the damage-specific name and cleaning it up later.

`ChoosePokemonPrompt` has one behavioral contract the first draft under-specified: when `max <= 1`, selecting a target should still resolve immediately, matching today's `BoardPromptDock` flow. The generic strip can still render while the prompt is active, but it should not force an extra confirm for single-target prompts.

## Why

After [`f92c9b4ea`](#) (Munkidori) we had two working board-driven prompts: `PutDamagePrompt` (Phantom Dive) and `MoveDamagePrompt` / `RemoveDamagePrompt` (Munkidori). A third, `ChoosePokemonPrompt`, still used a bespoke `BoardPromptDock` and predated the strip pattern.

Each lived in its own component with its own click handler, its own eligibility logic, its own strip wrapper. Adding a new board-driven card meant: new store, new strip component, new click handler in App.svelte, new branches in `isBoardPromptSelectable`/`isBoardPromptSelected`, new render branch in the template. Five files, lots of copy-paste.

The Twinleaf card pipeline will produce many more board-driven prompts (move energy, heal, swap, conditional discards, future single-card effects). They share enough that we should pay the abstraction cost now, while the pattern is still small enough to refactor cleanly.

## What we had before migration

Per board-driven prompt:

- A focused store for accumulating state (`damageTransferStore.svelte.ts`, `promptSelectionStore.damagePlacements`, `promptSelectionStore.selectedBoardTargets`, etc.).
- A wrapper component that renders `PromptStrip` (`DamagePromptStrip.svelte`, `DamageTransferStrip.svelte`) or its own bespoke dock (`BoardPromptDock.svelte`).
- A window-capture click handler (`clickDamagePromptSlotAtPoint`, `clickTransferPromptSlotAtPoint`) plus a branch in `clickSlot` for the button-onclick path.
- Branches in `isBoardPromptSelectable`/`isBoardPromptSelected` that decide BoardSlot ring states.
- Branches in `boardPromptDamage` that compute the signed +N/−N badge.

The board-targeted prompts as of today:

| Prompt | Accumulating state | Eligible-target shape | Submission |
|---|---|---|---|
| PutDamagePrompt | `DamagePlacement[]` (target+amount) | Single role (target) | `Array<{target, amount}>` |
| MoveDamagePrompt / RemoveDamagePrompt | `source + Array<{from, to}>` | Source role, then destination role | `Array<{from, to}>` |
| AttachEnergyPrompt | `Array<{energyIndex, target}>` + active energy cursor | Single role (target) but per-energy | `Array<{to, index}>` |
| ChoosePokemonPrompt | `CardTarget[]` | Single role | `CardTarget[]` |

The accumulating state and submission shape vary. The visual + interaction pattern is shared by `PutDamagePrompt`, `MoveDamagePrompt` / `RemoveDamagePrompt`, and `ChoosePokemonPrompt`. `AttachEnergyPrompt` is deliberately not part of the first strategy migration.

## Proposed abstraction

A `BoardInteractionStrategy` interface that adapts each prompt's focused store to a uniform shape the renderer and click dispatcher consume:

```ts
type BoardInteractionStrategy = {
  key: string;

  // ----- visual state per board slot -----
  isEligible: (target: CardTarget) => boolean;
  isSelected: (target: CardTarget) => boolean;
  /** Signed delta shown as +N / −N badge. 0 = no badge. */
  deltaFor: (target: CardTarget) => number;

  // ----- behavior -----
  activate: (target: CardTarget) => void;
  reset: () => void;
  confirm: () => void;
  cancel?: () => void;

  // ----- strip rendering -----
  get title(): string;
  get hint(): string;
  get iconName(): PromptIconName;
  get meta(): { current: number; max: number; secondary?: string };
  get canReset(): boolean;
  get canConfirm(): boolean;
  get allowCancel(): boolean;
};
```

The strip-facing fields should be getters, or the creator must read every reactive store value needed to rebuild the strategy. Getters are preferred: `BoardPromptStrip` can read `strategy.canConfirm`, `strategy.meta`, and `strategy.hint` directly, and Svelte will track the underlying `$state` reads inside those getters. The strategy object itself can then be recreated only when the prompt/game identity changes.

### How prompts produce strategies

Each board-driven prompt has a creator function that takes the game view, the prompt, references to the relevant stores, and a `resolvePrompt` callback. It returns a strategy object whose methods close over the store APIs:

```ts
export function createDamageTransferStrategy(args: {
  game: GameView;
  prompt: PromptView;
  store: DamageTransferStore;
  resolve: (value: unknown) => void;
}): BoardInteractionStrategy { ... }
```

In App.svelte:

```ts
let boardStrategy = $derived<BoardInteractionStrategy | null>(
  currentPrompt?.className === 'PutDamagePrompt'
    ? createPutDamageStrategy({ game, prompt: currentPrompt, ... })
    : currentPrompt?.className === 'MoveDamagePrompt' || currentPrompt?.className === 'RemoveDamagePrompt'
      ? createDamageTransferStrategy({ game, prompt: currentPrompt, ... })
      : currentPrompt?.className === 'ChoosePokemonPrompt'
        ? createChoosePokemonStrategy({ game, prompt: currentPrompt, ... })
        : null,
);
```

Because Svelte tracks `$state` reads from getters when the component renders, the strategy can expose live state without becoming a new state container. Avoid putting store mutations or prompt-instance resets inside the creator; those stay in explicit effects.

### How App.svelte consumes the strategy

One click dispatcher, used by both the window-capture listener and the slot button onclick path:

```ts
function dispatchBoardClick(slot: PokemonSlotView) {
  if (!boardStrategy || slot.empty) return;
  const target = targetForBoardSlot(currentPrompt!, slot);
  if (!boardStrategy.isEligible(target)) return;
  boardStrategy.activate(target);
}
```

`BoardSlot` props collapse to two booleans + the delta number, all derived from the strategy:

```svelte
<BoardSlot
  promptSelectable={!!boardStrategy?.isEligible(target)}
  promptSelected={!!boardStrategy?.isSelected(target)}
  slotDelta={boardStrategy?.deltaFor(target) ?? 0}
  ...
/>
```

One generic strip component, parameterized by the strategy:

```svelte
{#if boardStrategy}
  <BoardPromptStrip strategy={boardStrategy} resolving={resolvingPrompt} />
{/if}
```

### Files added

- `lib/game/boardInteraction.ts` — type + small helpers (target→player lookup, slot lookup by target).
- `lib/game/strategies/putDamageStrategy.ts`
- `lib/game/strategies/damageTransferStrategy.ts`
- `lib/game/strategies/choosePokemonStrategy.ts`
- `lib/game/strategies/boardInteractionStrategies.test.ts`
- `lib/components/prompts/BoardPromptStrip.svelte` — wraps `PromptStrip` parameterized by `BoardInteractionStrategy`.

### Files deleted

- `lib/components/prompts/DamagePromptStrip.svelte` → replaced by `BoardPromptStrip`.
- `lib/components/prompts/DamageTransferStrip.svelte` → replaced by `BoardPromptStrip`.
- `lib/components/BoardPromptDock.svelte` → `ChoosePokemonPrompt` now uses `BoardPromptStrip`.

### Files changed in App.svelte

- Remove: prompt-specific strip render branches, prompt-specific click handlers, and duplicate selected/delta branches for `PutDamagePrompt`, `MoveDamagePrompt` / `RemoveDamagePrompt`, and `ChoosePokemonPrompt`.
- Keep: attach-energy state and click/drop branches until the attach-energy migration happens.
- Add: `boardStrategy` derived value, `dispatchBoardClick`, the strategy-driven render branch, and a single window-capture listener whose body delegates to `dispatchBoardClick`.
- Net: ~150-200 lines deleted, ~40 added.

## Out of scope this session

**AttachEnergyPrompt is not migrated.** It has two concerns the migrated prompts don't:

1. An active "energy cursor" — the player picks which energy from a list before picking a board target.
2. A drag-and-drop interaction in addition to click.

Both can probably be expressed in a later strategy interface, but forcing it in this session means designing the cursor concept blind. Better to migrate it after the strategy interface has settled with three real users (PutDamage, DamageTransfer, ChoosePokemon), so we know exactly what cursor + drag affordances need to look like in the strategy shape.

## What does NOT change

- The accumulating state continues to live in the existing focused stores. We don't unify state — only the interface.
- The submission shape sent to the engine is unchanged for every prompt.
- Visual output is identical for PutDamage and DamageTransfer. ChoosePokemonPrompt picks up the strip aesthetic, replacing the bespoke `BoardPromptDock`.
- The `PromptStrip` primitive itself doesn't change.
- `AttachEnergyPrompt` continues to use the existing prompt host and assignment store.

## Tradeoffs

**Pros**

- Adding a new board-driven card is one strategy creator (~40 lines) + one line in the switch. No new component, no new click handler, no new App.svelte derived state.
- Future affordances (source/destination color distinction, custom badges, animated transitions per slice 2) get implemented once in `BoardPromptStrip` + `BoardSlot` and benefit every strategy.
- The strategy interface documents what a "board-driven prompt" actually requires — useful when implementing future cards.

**Cons**

- Indirection. To trace what happens when a player taps a Pokémon during Munkidori, you go: BoardSlot onclick → dispatchBoardClick → strategy.activate → store mutation. Today it's: BoardSlot onclick → clickSlot → activateTransferSlot → store mutation. One extra hop.
- Strategy creators read from stores AND get passed callbacks for `resolve`/`reset`. Two state-access patterns in one file.
- Risk that AttachEnergy turns out to need affordances the interface can't express, forcing either a v2 or a special case. Mitigated by keeping the interface small and willing to revise once AttachEnergy is in scope.

## Risks / open questions for review

1. **Should `BoardInteractionStrategy.activate` take a `MouseEvent`** in case future prompts need modifier-key behavior (e.g. shift-click for opposite-direction transfer)? Decision: no. Keep `activate(target)` minimal until a real prompt needs event data.
2. **Source vs destination visual distinction.** Today both render with the same ring color, distinguished only by the +N/−N badge. Decision: don't add role colors yet; the strategy returns booleans, not roles. Revisit if confusion shows up in playtesting.
3. **`promptDamage` rename.** Decision: rename it to `slotDelta` while touching the call chain.
4. **Strategy creation cost.** Decision: use small strategy objects plus getters for live state. This avoids rebuilding on every counter click while keeping component renders reactive.
5. **ChoosePokemonPrompt UX delta.** Decision: use the standard strip. Hide Reset when no selections exist, hide Cancel unless prompt options allow it, and preserve immediate resolve for `max <= 1`.
6. **Setup prompt.** Decision: stay separate. Setup is a distinct one-time flow with hand-card interaction, not a recurring board-driven effect.

## Migration order

1. Land the type + helpers (`boardInteraction.ts`).
2. Rename `BoardSlot`'s badge prop from `promptDamage` to `slotDelta` through `ActiveDuel`, `BenchZone`, `GameBoard`, and `App.svelte`.
3. Land `BoardPromptStrip.svelte` rendering against a strategy.
4. Build `putDamageStrategy`. Swap PutDamage's render branch to use `BoardPromptStrip`. Dogfood Phantom Dive.
5. Build `damageTransferStrategy`. Swap. Dogfood Munkidori.
6. Build `choosePokemonStrategy`. Swap. Dogfood any card that uses `ChoosePokemonPrompt`.
7. Delete `DamagePromptStrip`, `DamageTransferStrip`, `BoardPromptDock`.
8. Consolidate the click dispatcher (delete `clickDamagePromptSlotAtPoint`, `clickTransferPromptSlotAtPoint` window listeners; replace with a single `dispatchBoardClick` listener gated on `boardStrategy != null`).
9. Delete now-dead App.svelte derived state while keeping attach-energy branches intact.

Each step keeps the app working. If Codex flags an issue mid-migration, we stop and address before continuing.
