# Prompt Design

Notes captured 2026-05-21 — direction for the prompt redesign, not all yet implemented.

## Core principle

**If a human player would be holding the cards in their hand, it's a front-and-center popup. If they'd be pointing at things on the table, the prompt is board-driven.**

This single rule decides almost every prompt's presentation.

- Deck search, hand choices, discard choices, opponent's hand → center glass popup.
- Damage movement, energy attach, "choose a Pokémon", anything that targets a board slot → minimal banner + interaction on the board.

## Three placement intents

| Intent  | When                                       | Position                              | Examples                                                                       |
| ------- | ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------ |
| `center` | Pure dialog or hand-held interaction       | Front and center glass popup          | Confirm, Alert, CoinFlip, Select, Wait, Shuffle, ChooseCards (deck/discard)    |
| `board`  | Player must click/target slots on the board | Thin glassy banner edge-anchored      | AttachEnergy, PutDamage, MoveDamage, RemoveDamage, ChoosePokemon               |
| `zone`   | Operates on a non-board collection         | Anchored over/adjacent to that zone   | (future — search prompts could "come out of" the deck/discard zone)            |

Placement should live as metadata next to each prompt classname (likely `lib/game/prompts.ts`), so PromptHost / PromptDock branches on declared intent rather than hardcoded `if className === '...'` chains.

## Board-driven prompts: design rules

For `board` placement, the popup should **barely show anything**. Just a small glassy banner telling the player what to do. All the interactivity happens on the board itself — the player should be looking at the board, not at a panel.

Concretely a board banner contains:

- One-line instruction ("Move 1–3 damage counters")
- Meta ("20/30 placed" or "2/3 counters")
- `[Reset]` `[Confirm]` `[Cancel]` (only the ones that apply)

Nothing else. No "From X / To Y" grids. No card lists in the banner. The board IS the selection surface.

### Phantom Dive is the precedent (but isn't there yet)

PutDamagePrompt for Phantom Dive already does board-driven placement: `App.svelte` wires `clickDamagePromptSlotAtPoint`, placements live in `promptSelectionStore.damagePlacements`, and the dock is just meta + Reset/Confirm. **But it's not the bar yet** — the banner is still too prompt-panel-y and the on-board affordances aren't expressive enough. The same patterns need a visual upgrade alongside this redesign.

### Munkidori as the next test case

`RemoveDamagePrompt` from `ptcg-server/src/sets/set-twilight-masquerade/munkidori.ts`:

```ts
new RemoveDamagePrompt(
  effect.player.id,
  GameMessage.MOVE_DAMAGE,
  PlayerType.ANY,
  [SlotType.ACTIVE, SlotType.BENCH],
  maxAllowedDamage,
  { min: 1, max: 3, allowCancel: false, sameTarget: true, blockedTo, blockedFrom }
)
```

Today this renders the generic `From X / To Y` button grid in `DamagePrompt.svelte` — ugly and disconnected from the board state. The desired flow:

1. Banner appears: "Munkidori — Move up to 30 damage. Pick a Pokémon to move from."
2. Eligible source Pokémon (not in `blockedFrom`, has damage) glow on the board.
3. Player clicks one → it becomes the source, its damage badge highlights.
4. Eligible destination Pokémon (not in `blockedTo`) glow.
5. Player clicks a destination → moves 10 damage (one counter). Source shows `-10` badge, destination shows `+10` badge, both animate.
6. Up to 3 counters / 30 damage. With `sameTarget: true`, subsequent counters auto-stay on the same source→dest pair until reset.
7. Banner shows `1/3` → `2/3` → `3/3`. Confirm button enables once min is hit.
8. `[Reset]` rewinds. `[Confirm]` submits the accumulated transfers.

Increment per click is `damageMultiple` (usually 10) — same field PutDamagePrompt already reads.

## Shared infrastructure to build

So we're not bespoking this per card. The goal: a new board-driven card should be ~30 lines of glue, not a new Svelte component.

1. **`state/boardInteraction.svelte.ts`** — derives the current "board mode" from the active prompt's classname: `'none' | 'place-damage' | 'move-damage' | 'attach-energy' | 'choose-pokemon'`. Centralizes the "is the board live, and for what?" question.

2. **`state/boardTargetingStore.svelte.ts`** — owns source/destination state and eligibility sets for board-driven prompts. Exposes `selectSource(target)`, `selectDestination(target)`, `incrementCounter()`, `reset()`, `canConfirm`. Today this logic is spread across `promptSelectionStore.damagePlacements` and per-prompt `$state` in `DamagePrompt.svelte`.

3. **`BoardSlot` reads from `boardTargetingStore`** to render rings/glows. Three states per slot: `eligible-source`, `eligible-destination`, `selected`. Currently BoardSlot only knows about play/retreat affordances; this adds prompt-driven affordances.

4. **`PromptStrip` primitive** — sibling to `PromptPanel`, lives in `lib/components/prompts/primitives/`. Edge-anchored, single-line. Title + meta + buttons. Different visual treatment from the center glass — flatter, narrower, less drama. The "barely showing anything" banner.

5. **Damage badge animations** — `+10` / `-10` badges that pop on the source and destination slots when a counter is moved. Reusable for any move-damage / heal effect. Powers the "I can see the damage getting added" feel that's currently the best part of Phantom Dive.

6. **Placement metadata table** — `lib/game/prompts.ts` maps classname → `'board' | 'center' | 'zone'` plus any per-prompt config (e.g. `incrementsBy: 10`, `requiresSource: true`). PromptHost / PromptDock branches on this.

Once these land, Munkidori, Adrena-Brain, and every future "click two things on the board" card is glue. Other board prompts (AttachEnergy, ChoosePokemon) also collapse into the same pattern.

## Done already (today)

- Theme tokens: `src/styles/tokens.css`, full light/dark, default light + system follow.
- Styled primitives for center prompts: `prompts/primitives/{PromptPanel,PromptTitle,PromptActions (implicit),PromptMeta,SelectableCard,PromptIcon}.svelte`.
- Unified selection treatment (one ramp, two emphasis modes: `outline` / `lift`).
- "Confirm" as the primary verb across selection prompts; Continue/Yes-No kept where semantically right.
- Universal Hide/Show via PromptPanel.
- ~400 lines of `:global` CSS removed from PromptHost; rest token-driven.
- Inline SVG icons (coin / energy / prize / cards / attack / damage / shuffle / hourglass / check) coloured via `currentColor`.

## Open questions for tomorrow

- Where does the board banner anchor — top, bottom, or attached to the player whose turn it is?
- For `zone` placement: does the prompt "come out of" the zone with an animation, or is it static-anchored?
- How does the active Pokémon stay visible behind center prompts? (Today they cover it. Maybe shift center placement upward, or auto-hide when mouse approaches board.)
- AttachEnergy currently sits at the top as a `compact` strip. Should it become a full board-driven prompt (drag from banner to slot is already there, but with rings/glows on eligible Pokémon)? Probably yes.
