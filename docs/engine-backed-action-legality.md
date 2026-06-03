# Engine-Backed Action Legality

## Goal

The game engine must be the only source of truth for whether an action is legal. Frontends should not independently decide whether a Pokemon can retreat, evolve, attack, use an Ability, attach Energy, play a Tool, or play a Trainer based on printed card data or locally inferred rules.

Frontend checks can still handle UI state that is not game legality, such as whether a prompt is open, whether a request is already in flight, or whether the viewed game is finished. Prompt UIs can also enforce constraints that came from the engine-generated prompt, such as `min`, `max`, `blocked`, `blockedTo`, and filters.

## Why

Many legality rules are dynamic:

- A Pokemon can be blocked from retreating by an effect.
- A Pokemon can have its Retreat Cost changed by Abilities, Tools, Stadiums, Special Conditions, or attack effects.
- A Pokemon may be unable to evolve because it was put into play this turn.
- A Pokemon may be allowed to evolve through card-specific exceptions.
- Trainer, Energy, Tool, Ability, and attack availability can be changed by effects in play.

If the frontend hard-codes any of these checks, it can hide a legal action or expose inconsistent behavior. The Latias ex `Skyliner` issue is an example: the engine correctly reduced retreat cost, but the frontend disabled retreat by comparing attached Energy to printed Retreat Cost.

## Target Shape

The engine should serialize legal actions alongside the public game state. A possible shape:

```ts
type AvailableActions = {
  hand: Array<{
    cardId: number;
    handIndex: number;
    targets: CardTarget[];
  }>;
  active?: {
    attacks: string[];
    abilities: string[];
    retreatTargets: number[];
  };
  bench: Array<{
    index: number;
    abilities: string[];
  }>;
  stadium?: {
    canUse: boolean;
  };
};
```

The frontend would use this data for highlighting, enabled buttons, drag/drop zones, and action menus. Dispatch still goes through the normal engine actions, and the engine still rejects stale or invalid attempts.

## High-Level Implementation

1. Add an engine-side legality projection step, similar to the existing `playableCardIds`, but target-aware and action-aware.
2. For each candidate action, run an isolated dry-run against a cloned state and catch `GameError`.
3. Suppress dry-run side effects such as prompts, logs, random outcomes, animations, and socket events.
4. Serialize the resulting `availableActions` on each player view.
5. Update Svelte and React table UIs to consume `availableActions` and remove local card-rule checks.
6. Keep prompt-local validation only when the prompt constraints were emitted by the engine.

## Snapshot Scope

Legality data should be scoped because dry-running candidate actions is intentionally more expensive than serializing board state. Headless snapshots default to `availableActionsScope: 'active'`, which emits `availableActions` only for the active player. Tools and agents can request `availableActionsScope: 'full'` when they need both players' complete action surface, or `availableActionsScope: 'none'` when they only need raw state.

Examples:

```json
{ "type": "state", "availableActionsScope": "none" }
{ "type": "state", "availableActionsScope": "active" }
{ "type": "state", "availableActionsScope": "full" }
```

Human-facing clients should prefer cheap always-on hints, such as `playableCardIds`, and request broader legality only for UI surfaces that actually need it. Agents can opt into the broader snapshot when correctness is more important than response latency.

Hosted single-player command responses should avoid paying for dry-run legality unless the response needs to immediately refresh an action menu. The Svelte client requests `availableActionsScope: 'none'` for latency-sensitive mutations like playing cards, resolving prompts, attacking, using abilities, retreating, and conceding. Initial game creation, explicit state refreshes, and turn passes keep the server default so the active-player action panel can still receive engine-owned legality at lower-frequency points.

## Notes

This should be implemented in the engine, not duplicated in each frontend. The frontend can still make ergonomic choices, such as preferring an open bench slot for a generic drop target, but it should not present that as legality unless the engine supplied it.
