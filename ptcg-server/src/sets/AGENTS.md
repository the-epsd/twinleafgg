# Implementing Card Effects from Auto-Generated Stubs

You are working with auto-generated card stubs. All card stats (HP, type, weakness, resistance, retreat, attacks, cost, damage) are already filled in. Your job is to implement the game logic inside `reduceEffect()` for cards marked with TODO comments.

---

## Your Workflow

### 1. Find the TODO

Look for `// TODO:` comments inside `reduceEffect()`. The card text describing the effect is right there:

```typescript
// Attack 1: Flare
// TODO: Flip a coin. If heads, this attack does 30 more damage.
if (WAS_ATTACK_USED(effect, 0, this)) {
  // Implement effect here   <-- YOUR JOB
}
```

### 2. Search for Similar Effects (MANDATORY)

**Before writing ANY code**, search the codebase for cards with similar effects. This is the single most important step. The codebase has hundreds of implemented cards — your effect has almost certainly been done before.

**Search by card text:**
```bash
grep -r "more damage" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "is now Paralyzed" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "damage to.*Benched" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "Discard.*Energy" ptcg-server/src/sets/ --include="*.ts" -l
```

**Search by prefab usage:**
```bash
grep -r "FLIP_A_COIN_IF_HEADS" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "SWITCH_ACTIVE_WITH_BENCHED" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "THIS_POKEMON_DOES_DAMAGE_TO_ITSELF" ptcg-server/src/sets/ --include="*.ts" -l
```

**Search by effect type:**
```bash
grep -r "AfterAttackEffect" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "BetweenTurnsEffect" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "DealDamageEffect" ptcg-server/src/sets/ --include="*.ts" -l
```

Read the matching files. Use them as your reference implementation.

**Cite your references.** When you implement an effect based on a reference card, replace the `// TODO:` comment with a `// Ref:` comment citing the file and attack name you used:

```typescript
// Single reference:
// Ref: set-emerging-powers/darmanitan.ts (Rock Smash)

// Multiple references (when combining patterns):
// Refs: set-noble-victories/stunfisk.ts (coin handling), set-noble-victories/audino.ts (self-heal)
```

This is **required** for every implemented effect. It helps reviewers verify correctness and helps future agents find examples. The `// Ref:` comment replaces the `// TODO:` line — do not leave both.

### 3. Check Text-to-Code Patterns

Read **AGENTS-patterns.md** in this directory. It maps common card text phrases directly to code, covering drawing, special conditions, coin flips, damage, healing, switching, energy, searching, and more.

### 4. Implement Using Prefabs

Always prefer prefab functions over custom logic. Read **CLAUDE-prefabs.md** for the complete list of available prefabs with signatures.

### 4.5 Public vs Private Knowledge (Search Rules)

This is a core rules concept and must be handled correctly:

- **Private knowledge zones** (usually the deck): if card text asks you to find a specific subset (for example, "a Pokemon", "2 Basic Energy"), the player may select fewer than requested or fail, because the opponent cannot verify deck contents.
- **Public knowledge zones** (discard, in-play, etc.): required counts are mandatory unless text says "up to".
- **Known guaranteed target in private zone**: if text is broad enough that a legal target is guaranteed when the zone is non-empty (for example, "search your deck for a card"), do not allow failing.

Examples:
- `Computer Search` ("a card") should be mandatory when the deck has cards.
- `Ultra Ball` style Pokemon search can fail, because deck contents are private.
- Discard-pile retrieval should follow exact counts unless the card says "up to".

### 5. Verify Compilation

After implementing cards, run:
```bash
cd ptcg-server && npx tsc --noEmit
```

---

## Critical Effect Timing

**This is the #1 source of bugs.** Use the correct effect type based on WHEN the effect occurs:

| Effect Type | When It Fires | Use For |
|-------------|---------------|---------|
| `AttackEffect` / `WAS_ATTACK_USED` | **Before** damage | Modifying damage, paying costs, setting flags |
| `AfterAttackEffect` | **After** damage | Switching Pokemon, effects that happen post-damage |

### WRONG (switches before damage is dealt):
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent); // BUG!
}
```

### CORRECT (switches after damage):
```typescript
public usedMyAttack = false;

if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedMyAttack = true;
}

if (effect instanceof AfterAttackEffect && this.usedMyAttack) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
}

if (effect instanceof EndTurnEffect) {
  this.usedMyAttack = false;
}
```

For the full effect timing reference, read **CLAUDE-effects.md**.

---

## When to Restructure the Stub

The generated stub uses `WAS_ATTACK_USED` and `WAS_POWER_USED` as starting points. These are correct for most cases, but some effects need restructuring:

### Passive Abilities (between turns, damage interception)

The stub generates:
```typescript
if (WAS_POWER_USED(effect, 0, this)) {
  // Implement ability here
}
```

But `WAS_POWER_USED` only works for **activated** abilities (player clicks to use). Passive abilities that trigger automatically need a different approach:

- **"Between turns" abilities** (e.g., "heal 10 damage between turns") → Intercept `BetweenTurnsEffect`
- **Damage modification abilities** (e.g., "reduce damage by 20") → Intercept `DealDamageEffect`
- **Always-on type changes** → Intercept `CheckProvidedEnergyEffect`

**Delete the `WAS_POWER_USED` block and replace it** with the appropriate effect intercept. Search for similar abilities in the codebase for the right pattern.

### Post-Damage Attack Effects

If the attack text says something happens **after** damage (switching, healing based on damage dealt), restructure to use the `AfterAttackEffect` flag pattern shown above.

---

## Self-Attack Restrictions

For "can't use [Attack] next turn" — use the built-in system (NO cleanup needed):
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.active.cannotUseAttacksNextTurnPending.push('Attack Name');
}
```

For "can't attack next turn":
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.active.cannotAttackNextTurnPending = true;
}
```

---

## Marker Cleanup

Every marker you add MUST be cleaned up in `EndTurnEffect`:
```typescript
if (effect instanceof EndTurnEffect) {
  effect.player.marker.removeMarker(this.MY_MARKER, this);
}
```

## "Once During Your Turn" Abilities

Use the dedicated prefab for activated abilities:
```typescript
if (WAS_POWER_USED(effect, 0, this)) {
  const player = effect.player;
  // card-specific validation first...
  USE_ABILITY_ONCE_PER_TURN(player, this.MY_ABILITY_MARKER, this);
  ABILITY_USED(player, this);
  // ability effect...
}

REMOVE_MARKER_AT_END_OF_TURN(effect, this.MY_ABILITY_MARKER, this);
```

---

## Key Prefabs Quick Reference

### Detection (Type Guards)
```typescript
WAS_ATTACK_USED(effect, index, this)   // Returns typed AttackEffect
WAS_POWER_USED(effect, index, this)    // Returns typed PowerEffect
AFTER_ATTACK(effect, index, this)      // Returns typed AfterAttackEffect
WAS_TRAINER_USED(effect, this)         // Returns typed TrainerEffect
```

### Drawing
```typescript
DRAW_CARDS(player, count)
DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, count)
```

### Searching
```typescript
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, filter?, options?)
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, filter?, options?)
SHUFFLE_DECK(store, state, player)
```

### Damage
```typescript
THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, amount)
HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage)
```

### Switching
```typescript
SWITCH_ACTIVE_WITH_BENCHED(store, state, player)
```

### Coin Flips
```typescript
COIN_FLIP_PROMPT(store, state, player, callback)
MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, amount, callback)
FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, damage)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads)
```

### Blocking / Checks
```typescript
IS_ABILITY_BLOCKED(store, state, player, card)
BLOCK_IF_DECK_EMPTY(player)
USE_ABILITY_ONCE_PER_TURN(player, marker, source)
```

### Energy
```typescript
DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, amount, type?)
DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect)
```

For the complete prefab reference with all signatures and imports, read **CLAUDE-prefabs.md**.

---

## Important Rules

1. **Always return `state`** from `reduceEffect()`
2. **Use prefabs first** — search before writing custom logic
3. **Check ability locks** with `IS_ABILITY_BLOCKED()` before ability effects
4. **Energy shorthand in properties, `CardType.TYPE` in logic** — Use `G`, `R`, `W` in card properties (already in stubs). Use `CardType.GRASS`, `CardType.FIRE`, `CardType.WATER` inside `reduceEffect()` logic.
5. **Clean up markers** on `EndTurnEffect` — every marker must be removed
6. **`effect.preventDefault = true`** to block effects
7. **Never modify state directly** — use `store.reduceEffect()` to dispatch sub-effects
8. **Energy symbols in text** — Use `[G]`, `[R]`, `[W]`, `[L]`, `[P]`, `[F]`, `[D]`, `[M]` instead of "Grass", "Fire", etc.
9. **Cite your references** — Replace `// TODO:` with `// Ref: set-name/file.ts (Attack Name)` for every implemented effect

---

## Detailed Reference Files

Read these files in this directory (`ptcg-server/src/sets/`) for in-depth documentation:

| File | Read When |
|------|-----------|
| **AGENTS-patterns.md** | Translating card text to code — maps text phrases to prefab calls |
| **CLAUDE-prefabs.md** | You need exact prefab function signatures and import paths |
| **CLAUDE-effects.md** | You need to understand effect timing or use advanced effect patterns |
| **CLAUDE-state.md** | You need to access PokemonCardList, Player, or StateUtils properties |
| **CLAUDE-enums.md** | You need CardTag, GameMessage, SpecialCondition, or other enum values |
| **CLAUDE-examples.md** | You want complete working card implementations to reference |
| **CLAUDE.md** | General card development overview and gotchas |

---

## Gotchas & Learnings

### "Until the end of your next turn" requires 2-phase marker cleanup

Single-marker patterns only persist through the opponent's turn. To persist through the attacker's NEXT turn, you need the 2-phase pattern:

```typescript
public readonly EFFECT_TURN1_MARKER = 'EFFECT_TURN1_MARKER';
public readonly CLEAR_EFFECT_MARKER = 'CLEAR_EFFECT_MARKER';

// On attack: add phase-1 marker
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.marker.addMarker(this.EFFECT_TURN1_MARKER, this);
  // ... apply the effect (e.g., add ability-blocking marker to opponent)
}

// EndTurnEffect: phase transition
if (effect instanceof EndTurnEffect) {
  // Phase 1 → Phase 2 (at end of current turn)
  REPLACE_MARKER_AT_END_OF_TURN(effect, this.EFFECT_TURN1_MARKER, this.CLEAR_EFFECT_MARKER, this);
  // Phase 2 → cleanup (at end of next turn)
  if (effect.player.marker.hasMarker(this.CLEAR_EFFECT_MARKER, this)) {
    effect.player.marker.removeMarker(this.CLEAR_EFFECT_MARKER, this);
    // ... remove the applied effect
  }
}
```

Reference: `set-great-encounters/dialga-lv-x.ts`

### ATTACH_ENERGY_PROMPT doesn't support conditional post-attachment logic

When a card says "If you attached Energy in this way, then [do something]", you cannot use the `ATTACH_ENERGY_PROMPT` prefab because it doesn't expose whether attachment actually happened. Inline the `AttachEnergyPrompt` logic and set the flag inside the callback when `transfers.length > 0`.

### IS_ABILITY_BLOCKED is mandatory for ALL ability types

Both activated abilities (`WAS_POWER_USED`) and passive abilities (e.g., `DealDamageEffect` intercepts) MUST check `IS_ABILITY_BLOCKED()` before applying their effect. Missing this check means the ability works even under Silent Lab or Garbodor's Garbotoxin.

### ChooseCardsPrompt `differentTypes` option

When card text says "X different types of basic Energy cards", use `differentTypes: true` in the `ChooseCardsPrompt` options. Reference: `set-surging-sparks/energy-search-pro.ts`.

### Ability-based evolution doesn't dispatch EvolveEffect

Cards like Inkay's "Upside-Down Evolution" that evolve via ability use manual `moveCardTo` + `clearEffects` + `pokemonPlayedTurn`. This means other cards intercepting `EvolveEffect` won't see the evolution. This is the established pattern — see `CLAUDE-effects.md`.

### Active-slot verification for abilities that check conditions

If an ability checks the active Pokemon's state (e.g., "if this Pokemon is Confused"), verify that `this` card is actually in the active slot using `StateUtils.findCardList(state, this)`. Otherwise the ability could trigger from the bench based on a different Pokemon's condition.

### PlayerType convention for forEachPokemon

When calling `opponent.forEachPokemon(...)`, use `PlayerType.TOP_PLAYER` (not `BOTTOM_PLAYER`). While the iteration works either way, the `PlayerType` is embedded in `CardTarget` and should be semantically correct. Use `PlayerType.BOTTOM_PLAYER` only when iterating the current player's own Pokemon.

### BLOCK_RETREAT must return its value

`BLOCK_RETREAT()` returns `State` via `store.reduceEffect`. Always `return BLOCK_RETREAT(...)` — do not call it as a void expression. When combining with other effects in the same attack, apply non-returning effects first, then `return BLOCK_RETREAT(...)`.

### burnFlipResult for stadium effects

The `BetweenTurnsEffect` has a `burnFlipResult` property for stadium cards that modify burn behavior:
- `undefined` (default): Normal coin flip for burn
- `true`: Skip the coin flip, burn is NOT removed (heads result forced — burn persists)
- `false`: Skip the coin flip, treat as tails (extra burn damage applied)

Reference: `set-dragons-majesty/wela-volcano-park.ts`

### "Opponent can't draw at beginning of next turn" pattern

`DrewTopdeckEffect` fires AFTER the card is already moved from deck to hand, so `preventDefault` does nothing. Instead, intercept `BeginTurnEffect` and throw `GameError(GameMessage.BLOCKED_BY_EFFECT)`. The `initNextTurn` function catches the exception and skips the draw while allowing the turn to proceed. Reference: `set-flashfire/luvdisc.ts` (Heart Wink).

### Ability-only sleepFlips modification

When the 2-coin sleep mechanic is part of an ability (e.g., Snorlax's "Stir and Snooze"), do NOT pass `sleepFlips` from the attack's `ADD_SLEEP_TO_PLAYER_ACTIVE` call. The ability's `BetweenTurnsEffect` handler should be the sole source of the `sleepFlips` override — this ensures the mechanic reverts to normal when the ability is blocked. Reference: `set-flashfire/snorlax.ts`.

### Activated abilities MUST have IS_ABILITY_BLOCKED check

Every `WAS_POWER_USED` handler (activated abilities) must include an `IS_ABILITY_BLOCKED` check immediately after entering the block. Without this, the ability bypasses Garbodor's Garbotoxin, Silent Lab, etc.

```typescript
if (WAS_POWER_USED(effect, 0, this)) {
  const player = effect.player;

  if (IS_ABILITY_BLOCKED(store, state, player, this)) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }

  // ... rest of ability logic
}
```

Note: Passive abilities (effect interception) also need `IS_ABILITY_BLOCKED` but handle it differently — they `return state` instead of throwing.

### Passive abilities should NOT have `useWhenInPlay: true`

Only activated abilities (those using `WAS_POWER_USED`) should have `useWhenInPlay: true`. Passive abilities that intercept effects automatically (DealDamageEffect, CheckPokemonStatsEffect, etc.) should omit this flag. See AGENTS-patterns.md for details.

### Two versions of HEAL_X_DAMAGE_FROM_THIS_POKEMON

Two versions exist with different argument orders — match the import source to the argument order:
- `prefabs/attack-effects.ts`: `HEAL_X_DAMAGE_FROM_THIS_POKEMON(damage, effect, store, state)`
- `prefabs/prefabs.ts`: `HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage)`

### DISCARD_TOP_X_CARDS_FROM_YOUR_DECK sourceEffect convention

The `sourceEffect` parameter should always be `effect` (the full AttackEffect), not `effect.attack` (the Attack object). While both work because the parameter is typed as `any`, passing `effect` is the established codebase convention.

### Programmatic tool attachment (non-standard sources)

When attaching tools to Pokemon programmatically (e.g., from deck, not through normal play), you must manually move the card from `cards` to `tools`:
```typescript
source.moveCardTo(tool, target);
const idx = target.cards.indexOf(tool);
if (idx !== -1) { target.cards.splice(idx, 1); }
target.tools.push(tool);
```
This mirrors what `play-trainer-effect.ts` does internally. Without the splice, the tool ends up in both arrays.

### "Attach to opponent" tools (Team Flare Hyper Gear)

Tools like Head Ringer and Jamming Net that attach to opponent's Pokemon-EX must intercept `PlayItemEffect` (not `TrainerEffect`) to bypass the normal tool attachment flow which only attaches to your own Pokemon. Reference: `set-phantom-forces/head-ringer-team-flare-hyper-gear.ts`, `set-phantom-forces/jamming-net-team-flare-hyper-gear.ts`.

### `DISCARD_UP_TO_X_TYPE_ENERGY` is for OPTIONAL discards only

`DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON` defaults to `minAmount: 0`, making the discard optional. When card text says "Discard all [type] Energy attached to this Pokemon" (mandatory), use a manual pattern that filters and discards without choice:

```typescript
// "Discard all [L] Energy attached to this Pokemon."
const cards = player.active.cards.filter(c => c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING));
cards.forEach(c => { player.active.moveCardTo(c, player.discard); });
```

Reference: `set-x-and-y/talonflame.ts`, `set-primal-clash/manectric.ts`

### "If the Defending Pokemon is damaged, it is Knocked Out" pattern

Use `CheckHpEffect` to get the target's HP, then set `effect.damage = checkHp.hp` in a `DealDamageEffect` handler. Do NOT directly mutate `effect.target.damage` during effect handling — that corrupts the engine's damage tracking.

```typescript
if (effect instanceof DealDamageEffect && effect.damage > 0
  && effect.target.marker.hasMarker(this.KO_MARKER, this)) {
  const checkHp = new CheckHpEffect(effect.player, effect.target);
  store.reduceEffect(state, checkHp);
  effect.damage = checkHp.hp;
}
```

Reference: `set-primal-clash/beedrill.ts` (Allergic Shock)

### Moving tools between Pokemon

Tools live in a separate `tools` array, not `cards`. When moving a tool from one Pokemon to another, you must splice from `source.tools`, use `moveCardTo`, then splice from `dest.cards` and push to `dest.tools`:

```typescript
const toolIdx = source.tools.indexOf(tool);
if (toolIdx !== -1) { source.tools.splice(toolIdx, 1); }
source.moveCardTo(tool, dest);
const cardIdx = dest.cards.indexOf(tool);
if (cardIdx !== -1) { dest.cards.splice(cardIdx, 1); }
dest.tools.push(tool);
```

Reference: `set-primal-clash/mr-mime.ts` (Trick)

### Never use `(c as any)` to bypass TypeScript types

Always import the correct type (e.g., `EnergyCard`, `PokemonCard`, `TrainerCard`) instead of using `as any` casts. If you need to check `energyType`, import `EnergyCard` and use `c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL`.

### `getPokemons()` vs `getPokemonCard()` — evolution chain handling

When filtering "cards attached to a Pokemon" (energy + tools), always use `getPokemons()` to exclude the **entire evolution chain**, not `getPokemonCard()` which only returns the **top** evolution card. Using `getPokemonCard()` on an evolved Pokemon (e.g., Stage 2) will incorrectly treat pre-evolution cards as "attached cards."

```typescript
// WRONG: Only excludes the top Pokemon card
const pokemonCard = cardList.getPokemonCard();
const attached = cardList.cards.filter(c => c !== pokemonCard);

// CORRECT: Excludes all Pokemon in the evolution chain
const pokemons = cardList.getPokemons();
const attached = cardList.cards.filter(c => !pokemons.includes(c as PokemonCard));
```

### Delayed KO timing: "end of opponent's next turn" vs "during your next turn"

These two timings require different marker placements:

- **"At the end of your opponent's next turn"** → Place marker on `opponent.marker` (single-phase). The marker is set during your turn, skips your EndTurnEffect (wrong player), then triggers at end of opponent's turn.
- **"During your next turn"** → Place marker on `player.marker` (2-phase with `REPLACE_MARKER_AT_END_OF_TURN`). Needs to persist across opponent's entire turn.

Reference: `set-roaring-skies/jirachi.ts` (Doom Desire) for opponent's-turn timing.

### On-evolve abilities must NOT have `useWhenInPlay: true`

On-evolve abilities handled by `JUST_EVOLVED` (which intercepts `EvolveEffect`) should NOT have `useWhenInPlay: true` in their power definition. Only activated abilities (those using `WAS_POWER_USED`) should have `useWhenInPlay: true`. Adding it to on-evolve abilities creates a non-functional "Use Ability" button in the game UI.

### Mandatory vs optional prompts for public knowledge zones

When card text says "Attach a basic Energy card from your discard pile to this Pokemon" (no "you may" or "up to"), the discard pile is public knowledge — the prompt must use `min: 1, allowCancel: false`. Only use `min: 0, allowCancel: true` when the card text says "you may" or the source zone is private (deck).

### Tool removal to hand/discard: don't manually splice before moveCardTo

When removing a tool from a Pokemon to send it to hand or discard, do NOT manually splice from `tools` before calling `moveCardTo`. The `moveCardTo` method checks `this.cards` first, then falls back to `this.tools`. If you splice the tool out of `tools` first, `moveCardTo` won't find it in either array and the card is lost.

```typescript
// WRONG: Card is lost — moveCardTo can't find it
const idx = target.tools.indexOf(tool);
target.tools.splice(idx, 1);
target.moveCardTo(tool, player.hand); // Fails silently

// CORRECT: Let moveCardTo handle the removal
target.moveCardTo(tool, player.hand);
```

Reference: `set-fates-collide/genesect-ex.ts` (Drive Change)

### `ignoreWeakness`/`ignoreResistance` vs `THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS`

These are different things:
- **"not affected by Weakness or Resistance"** → Set `effect.ignoreWeakness = true; effect.ignoreResistance = true;`
- **"not affected by any effects on the Defending Pokemon"** → Use `THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, baseDamage)` which bypasses ALL defensive effects but still applies Weakness/Resistance

Do NOT use `THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS` when the card only says "not affected by Weakness or Resistance".

### Deck placement: `unshift()` = top, `push()` = bottom

In the card list arrays, the beginning (index 0) is the top of the deck:
- `deck.cards.unshift(card)` or moving to index 0 = **top of deck**
- `deck.cards.push(card)` = **bottom of deck**

When card text says "put on the bottom of the deck", use `push()`.

### Discard is not KnockOut — no prizes

When card text says "discard the Defending Pokemon and all cards attached to it", this is NOT a KnockOut. Do not use `KnockOutEffect`. Discarding does not award prize cards. Instead, manually move all cards to the discard pile.

Reference: `set-ancient-origins/unown.ts` (Farewell Letter pattern)

### Energy card names must match exactly

Basic energy card names are: `Fire Energy`, `Water Energy`, `Grass Energy`, `Lightning Energy`, `Psychic Energy`, `Fighting Energy`, `Darkness Energy`, `Metal Energy`, `Fairy Energy`. Common mistake: using "Dark Energy" instead of "Darkness Energy".

### `SHUFFLE_CARDS_INTO_DECK` does NOT remove cards from source

The `SHUFFLE_CARDS_INTO_DECK` prefab only adds cards to the deck via `unshift` and shuffles — it does NOT remove them from their source location (discard, hand, etc.). You must remove cards from the source first, or use `moveCardTo` + `SHUFFLE_DECK` instead:

```typescript
// WRONG: Cards exist in both discard AND deck (duplication bug)
const cards = player.discard.cards.filter(c => /* ... */);
SHUFFLE_CARDS_INTO_DECK(store, state, player, cards);

// CORRECT: Move first, then shuffle
cards.forEach(c => { player.discard.moveCardTo(c, player.deck); });
return SHUFFLE_DECK(store, state, player);
```

### `BLOCK_RETREAT` marker must use `MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER`

When using the 3-call BLOCK_RETREAT pattern, `BLOCK_RETREAT_IF_MARKER` and `REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN` must use `MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER` — the exact marker that `BLOCK_RETREAT()` sets internally. Custom marker names will silently fail to block retreat.

```typescript
import { MarkerConstants } from '../../game/store/prefabs/prefabs';

// In WAS_ATTACK_USED: set the marker
BLOCK_RETREAT(player, opponent, effect);

// In CheckRetreatCostEffect: enforce block
BLOCK_RETREAT_IF_MARKER(effect, this, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);

// In EndTurnEffect: clean up
REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
```

### Tool presence: check `tools[]` not `cards[]`

Tools are stored in `PokemonCardList.tools`, not `PokemonCardList.cards`. To check if a Pokemon has a tool attached:

```typescript
// CORRECT
if (target.tools.length > 0) { /* has tool */ }

// WRONG: tools are NOT in cards[]
if (target.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL)) { /* never finds tools */ }
```

### `REPLACE_MARKER_AT_END_OF_TURN` only checks `effect.player.marker`

The `REPLACE_MARKER_AT_END_OF_TURN` prefab checks `effect.player.marker` — meaning it only fires during the EndTurnEffect of the player whose marker object holds the marker. Place the phase-1 marker on the correct player:

- **"Until end of your next turn"** → Place on `player.marker` (attacker). Transitions at end of attacker's turn, cleans up at end of attacker's next turn.
- **"Until end of opponent's next turn"** → Place on `player.marker` (attacker), NOT `opponent.marker`. Phase-1 transitions at end of attacker's turn; phase-2 cleans up at end of attacker's next turn (which is after opponent's turn). The blocking checks should inspect both players' markers.

### "During your opponent's next turn" needs 2-marker cleanup pattern

Simple `EndTurnEffect` cleanup fires at the end of EVERY player's turn. For effects that last "during your opponent's next turn", you must use a CLEAR marker on the opponent's player marker so cleanup fires only at the end of the opponent's turn:

```typescript
// On attack:
player.active.marker.addMarker(this.EFFECT_MARKER, this);
opponent.marker.addMarker(this.CLEAR_EFFECT_MARKER, this);  // <-- THIS IS KEY

// Cleanup (fires only at end of opponent's turn):
if (effect instanceof EndTurnEffect
  && effect.player.marker.hasMarker(this.CLEAR_EFFECT_MARKER, this)) {
  effect.player.marker.removeMarker(this.CLEAR_EFFECT_MARKER, this);
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
    cardList.marker.removeMarker(this.EFFECT_MARKER, this);
  });
}
```

Without the CLEAR marker, the effect gets cleaned up at the end of YOUR turn before the opponent can even attack. Reference: `set-steam-siege/seedot.ts`, `set-evolutions/gastly.ts`.

### On-play-from-hand abilities should NOT have `useWhenInPlay: true`

Abilities that trigger when played from hand (intercepting `PlayPokemonEffect`) should NOT have `useWhenInPlay: true`. Only activated abilities that a player clicks to use should have this flag. This also applies to passive abilities (see existing gotcha above).

### 2-phase marker ordering: REMOVE before REPLACE

When using the 2-phase marker pattern for "until the end of your next turn" effects, the order of `REMOVE_MARKER_AT_END_OF_TURN` and `REPLACE_MARKER_AT_END_OF_TURN` calls is critical. REMOVE must come before REPLACE:

```typescript
// CORRECT ordering:
REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_MARKER, this);
REPLACE_MARKER_AT_END_OF_TURN(effect, this.MARKER, this.CLEAR_MARKER, this);
```

If REPLACE comes before REMOVE, the newly-created CLEAR marker gets immediately removed in the same EndTurnEffect pass, causing the effect to last only one turn instead of two.

Also: when checking whether the effect is active, check BOTH phase markers, since the effect persists through both phases.

### `PokemonCardList.tools` is a separate array from `cards`

Tools attached to a Pokemon are stored in `PokemonCardList.tools`, not in `PokemonCardList.cards`. When implementing effects that move "all cards attached to a Pokemon" (return to hand, discard all, etc.), you must handle both arrays:

```typescript
const tools = cardList.tools.slice();
tools.forEach(card => { cardList.moveCardTo(card, destination); });
const cards = cardList.cards.slice();
cards.forEach(card => { cardList.moveCardTo(card, destination); });
```

### `cards[0]` is NOT the top Pokemon in an evolution stack

`PokemonCardList.cards[0]` is the Basic Pokemon at the bottom of the evolution line. For Stage 1+ Pokemon, `cards[0]` is NOT the current Pokemon. Use `getPokemonCard()` to get the current (top) Pokemon:

```typescript
// WRONG: For evolved Pokemon, this is the Basic, not the Stage 1/2
if (player.active.cards[0] === this) { ... }

// CORRECT: Gets the topmost Pokemon card
if (player.active.getPokemonCard() === this) { ... }
```

### Effect intercepts MUST verify `getPokemonCard() === this`

When intercepting effects like `DealDamageEffect`, `PutDamageEffect`, or `PutCountersEffect` for a specific Pokemon, always verify BOTH that the card is in the target AND that it's the active (top) Pokemon:

```typescript
// WRONG: Triggers even if this card is under an evolution
if (effect.target.cards.includes(this)) { ... }

// CORRECT: Ensures this card is the current Pokemon
if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) { ... }
```

Reference: `set-unified-minds/sewaddle.ts`

### Boolean flags for AfterAttackEffect MUST have EndTurnEffect cleanup

When using a boolean flag (e.g., `this.usedAttack = true`) to coordinate between `WAS_ATTACK_USED` and `AfterAttackEffect`, always add an `EndTurnEffect` cleanup block to reset the flag. If the `AfterAttackEffect` handler is skipped for any reason, the flag persists to the next turn:

```typescript
if (effect instanceof EndTurnEffect) {
  this.usedAttack = false;
}
```

### Generator trainers: never call `next()` outside of prompt callbacks

In generator-pattern Supporter/Item cards, only call `next()` (which calls `generator.next()`) from inside prompt callbacks. Calling `next()` synchronously in an `else` branch while the generator is already running causes `TypeError: Generator is already running`. If a `yield` is conditional, let the generator flow naturally without an else branch. Reference: Shauna XY pattern.

### "Prevent all effects of attacks" abilities must use `AbstractAttackEffect`

When a card says "Prevent all effects of attacks, including damage, done to this Pokemon by [condition]", intercept `AbstractAttackEffect` — not just `PutDamageEffect` or `DealDamageEffect`. `AbstractAttackEffect` is the parent class of all attack sub-effects and catches damage, special conditions, and other effects. Reference: `set-cosmic-eclipse/alolan-persian-gx.ts` (Smug Face).

### First-turn checks: `state.turn <= 2`, not `state.turn <= 1`

For "during your first turn" effects, use `state.turn <= 2`. Turn 1 is the first player's first turn, turn 2 is the second player's first turn. Using `state.turn <= 1` misses the going-second player entirely.

### `BLOCK_RETREAT()` returns State — always `return` the result

`BLOCK_RETREAT(store, state, effect, this)` dispatches a sub-effect via `store.reduceEffect` and returns `State`. Always capture and return the result: `return BLOCK_RETREAT(store, state, effect, this);`. Discarding the return value can lose state mutations.

### Public-zone mandatory selection: `min` must equal `max`

For effects that select cards from a public zone (discard pile), `min` should equal `max` (the computed available amount) when the card text doesn't say "up to". The opponent can verify the count in public zones. Only use `min: 1` when the source is private (deck) or text says "up to". Reference: `set-burning-shadows/ho-oh-gx.ts` (Eternal Flame-GX).

### AttachEnergyPrompt `validCardTypes` for type-restricted moves

When card text says "Move a [X] Energy", use `validCardTypes: [CardType.X]` in AttachEnergyPrompt options to restrict which energy type can be selected. Without this, players can move any energy type. Reference: `set-burning-shadows/simipour.ts` (Aqua Reflect).

### Verify evolution stage matches `evolvesFrom` after stub generation

The stub generator may incorrectly set `Stage.BASIC` for evolved Pokemon (especially when card data comes from TCGdex). Always verify: if `evolvesFrom` is present, the stage should be `Stage.STAGE_1` or `Stage.STAGE_2`, not `Stage.BASIC`. This was the most common bug found during set-shining-legends review (11 out of 37 cards affected).

### Passive abilities: use `IS_ABILITY_BLOCKED` prefab, not manual `PowerEffect` try/catch

For passive abilities that intercept effects (e.g., `PutDamageEffect`, `DealDamageEffect`, `RetreatEffect`), use `IS_ABILITY_BLOCKED(store, state, player, this)` followed by `return state` instead of the manual `try { new PowerEffect(...) } catch { return state }` pattern. The prefab is cleaner and the established preferred pattern.

### Special energy cards MUST check EnergyEffect before providing modified types

Every special energy card that modifies `CheckProvidedEnergyEffect` must first check whether special energy effects are blocked (e.g., by Enhanced Hammer or similar). Without this check, the energy provides its enhanced types even when special energy effects are suppressed.

```typescript
// In CheckProvidedEnergyEffect handler, BEFORE modifying energyMap:
try {
  const energyEffect = new EnergyEffect(effect.player, this);
  store.reduceEffect(state, energyEffect);
} catch {
  return state;
}
```

Reference: `set-ultra-prism/super-boost-energy.ts`

### BetweenTurnsEffect: finding the ability owner

`BetweenTurnsEffect` fires for the player whose turn it is. If a passive ability modifies between-turns effects (e.g., burn damage), the handler needs to find its own owner since `effect.player` may not be the ability's owner:

```typescript
let owner = null;
[player, opponent].forEach(p => {
  p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    if (card === this) owner = p;
  });
});
```

Reference: `set-ultra-prism/infernape.ts` (Flaming Fighter)

### Use `CheckPokemonTypeEffect` for type-based conditionals

Never check `card.cardType` directly for type-conditional effects. Use `CheckPokemonTypeEffect` to get the dynamic type, which accounts for type-changing effects (Memory tools, Delta Pokemon):

```typescript
const checkType = new CheckPokemonTypeEffect(cardList);
store.reduceEffect(state, checkType);
if (checkType.cardTypes.includes(CardType.PSYCHIC)) { ... }
```

Reference: `set-ultra-prism/bronzong.ts` (Psychic Resonance)

### Gust + Status Condition combo requires AfterAttackEffect

When an attack switches the opponent's active Pokemon AND applies a status condition, the status must be applied in `AfterAttackEffect` (after the switch resolves), not in `WAS_ATTACK_USED`:

```typescript
// In WAS_ATTACK_USED: set flag + gust
this.usedInvitingPoison = true;
GUST_OPPONENT_BENCHED_POKEMON(store, state, player, opponent);

// In AfterAttackEffect: apply status after switch
if (this.usedInvitingPoison) {
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
}

// In EndTurnEffect: cleanup
this.usedInvitingPoison = false;
```

Reference: `set-ultra-prism/roserade.ts` (Inviting Poison)

### Status conditions in AfterAttackEffect cannot use status prefabs

The `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_*` prefabs require an `AttackEffect` parameter. When applying status conditions inside an `AfterAttackEffect` block (e.g., after a gust), do NOT cast `AfterAttackEffect` to `AttackEffect` — they are different classes. Use direct `addSpecialCondition` instead:

```typescript
// WRONG: Unsafe cast — AfterAttackEffect is NOT an AttackEffect
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect as unknown as AttackEffect);

// CORRECT: Direct application
opponent.active.addSpecialCondition(SpecialCondition.POISONED);
```

Reference: `set-ultra-prism/roserade.ts` (Inviting Poison)

### "X of your opponent's Pokemon" (including active) targeting

When card text says "X of your opponent's Pokemon" (NOT "Benched Pokemon"), use `ChoosePokemonPrompt` with `[SlotType.ACTIVE, SlotType.BENCH]` + `DAMAGE_OPPONENT_POKEMON`. Do NOT use `THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON` which defaults to bench only.

Reference: `set-dark-explorers/kyogre-ex.ts` (Dual Splash)

### Generator-pattern Supporters require lifecycle management

All generator-pattern Supporters (using `function*` with `yield`) MUST include three lifecycle calls:
1. `effect.preventDefault = true` — prevents the engine from discarding the card before yields
2. `player.hand.moveCardTo(effect.trainerCard, player.supporter)` — moves to supporter zone
3. `CLEAN_UP_SUPPORTER(effect, player)` — moves from supporter zone to discard when done

Non-generator Supporters using `store.prompt()` callbacks are handled automatically.

### `PokemonCardList.moveTo()` does NOT move tools

The `moveTo()` method moves `cards` and `energies` but NOT `tools`. Any effect that shuffles/bounces/discards a Pokemon with "all cards attached to it" needs explicit tool handling:

```typescript
// Move tools first
const tools = target.tools.slice();
tools.forEach(t => { target.moveCardTo(t, destination); });
// Then move the rest
target.moveTo(destination);
```

### `useFromHand: true` vs `useWhenInPlay: true` for abilities

- `useFromHand: true` — abilities that trigger from the player's hand (e.g., "if this Pokemon is in your hand, you may...")
- `useWhenInPlay: true` — activated abilities that the player clicks to use while the Pokemon is in play
- Neither flag — passive abilities that intercept effects automatically

Using the wrong flag prevents the ability from working correctly.

### AttachEnergyEffect interception requires recursion guard

Abilities that intercept `AttachEnergyEffect` to attach additional energy (e.g., "when you attach energy, attach one more") will trigger themselves infinitely. Use a marker-based recursion guard:

```typescript
public readonly RECURSION_MARKER = 'RECURSION_MARKER';

if (effect instanceof AttachEnergyEffect && !HAS_MARKER(this.RECURSION_MARKER, effect.player, this)) {
  ADD_MARKER(this.RECURSION_MARKER, effect.player, this);
  // ... attach additional energy
}
REMOVE_MARKER_AT_END_OF_TURN(effect, this.RECURSION_MARKER, this);
```

Reference: `set-lost-thunder/primarina.ts` (Harmonics)

### `useWhenInPlay` abilities must NOT assume `player.active`

Activated abilities with `useWhenInPlay: true` can be used from **both** the active slot and the bench. Never use `player.active` to reference "this Pokemon" — use `StateUtils.findCardList(state, this)` instead:

```typescript
// WRONG: Assumes this Pokemon is active
player.active.damage += 30;

// CORRECT: Works from active or bench
const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
cardList.damage += 30;
```

Reference: `set-team-up/incineroar-gx.ts` (Scar Charge)

### `[X] Energy` in card text means basic energy only

When card text says "Discard all [L] Energy" or counts "[W] Energy", always filter with BOTH `provides.includes(CardType.X)` AND `energyType === EnergyType.BASIC`. Without the `EnergyType.BASIC` check, special energy cards that provide the type will incorrectly match:

```typescript
// WRONG: Matches special energy too
const lightningEnergy = cards.filter(c => c.provides.includes(CardType.LIGHTNING));

// CORRECT: Basic energy only
const lightningEnergy = cards.filter(c =>
  c.provides.includes(CardType.LIGHTNING) && c.energyType === EnergyType.BASIC
);
```

Reference: `set-team-up/ampharos-gx.ts` (Impact Bolt)

### Counting Pokemon with a specific named attack

When card text says "for each of your Pokemon that has [Attack Name]", search the bench and active for Pokemon whose `attacks` array includes the named attack:

```typescript
let count = 0;
player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
  const pokemonCard = cardList.getPokemonCard();
  if (pokemonCard && pokemonCard.attacks.some(a => a.name === 'Attack Name')) {
    count++;
  }
});
```

Reference: `set-lost-thunder/dedenne-2.ts` (Nuzzle Shot), `set-lost-thunder/meloetta.ts` (Miracle Harmony)

### "Prevent all damage" vs "Prevent all effects of attacks"

These are DIFFERENT effects — use the correct intercept:

- **"Prevent all damage"** → Intercept `DealDamageEffect` (set `damage = 0`) AND `PutDamageEffect` (`preventDefault`). Does NOT block status conditions or other non-damage effects.
- **"Prevent all effects of attacks, including damage"** → Intercept `AbstractAttackEffect` (`preventDefault`). Blocks everything: damage, status, and other effects.

Using `AbstractAttackEffect` when the card only says "prevent all damage" incorrectly blocks status conditions too.

Reference: `set-lost-thunder/lusamine.ts` (damage only), `set-cosmic-eclipse/alolan-persian-gx.ts` (all effects)

### Simple supporters: use `WAS_TRAINER_USED` without generator pattern

Supporters that only draw cards, shuffle, or perform a single action (no multi-step prompts) should NOT use the generator pattern. Just use `WAS_TRAINER_USED` directly:

```typescript
if (WAS_TRAINER_USED(effect, this)) {
  const player = effect.player;
  DRAW_CARDS(player, 3);
}
```

Only use the generator pattern (with `effect.preventDefault`, supporter zone management, and `CLEAN_UP_SUPPORTER`) when the card requires multiple sequential prompts (yields).

Reference: `set-lost-thunder/whitney.ts`

### "During your next turn, ALL your Pokemon can't attack" (self-restriction)

When a card says "During your next turn, your Pokemon can't attack" (affecting ALL Pokemon, not just this one), use the 2-phase marker pattern on `player.marker`. Do NOT use `cannotAttackNextTurnPending` (which only affects the single Pokemon):

```typescript
public readonly GIGATON_SHAKE_MARKER = 'GIGATON_SHAKE_MARKER';
public readonly CLEAR_GIGATON_SHAKE_MARKER = 'CLEAR_GIGATON_SHAKE_MARKER';

// On attack: set phase-1 marker
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.marker.addMarker(this.GIGATON_SHAKE_MARKER, this);
}

// Block ALL attacks while both phase markers are present
if (effect instanceof AttackEffect) {
  if (effect.player.marker.hasMarker(this.GIGATON_SHAKE_MARKER, this)
    || effect.player.marker.hasMarker(this.CLEAR_GIGATON_SHAKE_MARKER, this)) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }
}

// EndTurnEffect: 2-phase transition
REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_GIGATON_SHAKE_MARKER, this);
REPLACE_MARKER_AT_END_OF_TURN(effect, this.GIGATON_SHAKE_MARKER, this.CLEAR_GIGATON_SHAKE_MARKER, this);
```

This differs from `cannotAttackNextTurnPending` in that it blocks ALL of your Pokemon, not just the attacking one.

Reference: `set-unified-minds/steelix.ts` (Gigaton Shake)

### Selective weakness removal via `CheckPokemonStatsEffect`

When a card removes a SPECIFIC weakness type (not all weakness), intercept `CheckPokemonStatsEffect` and filter the `weakness` array instead of using `ignoreWeakness = true`:

```typescript
if (effect instanceof CheckPokemonStatsEffect) {
  // ... find ability owner and check IS_ABILITY_BLOCKED ...
  effect.weakness = effect.weakness.filter(w => w.type !== CardType.PSYCHIC);
}
```

`ignoreWeakness = true` removes ALL weakness, which is wrong when only one type should be removed.

Reference: `set-unified-minds/jirachi-gx.ts` (Psychic Zone)

### Overly broad ability type check: `powers.length > 0` vs `PowerType.ABILITY`

When card text says "Pokemon that has an Ability", filter specifically for `PowerType.ABILITY`, not just any power:

```typescript
// WRONG: Matches Poke-Powers, Poke-Bodies, AND Abilities
sourceCard.powers.length > 0

// CORRECT: Only matches Abilities
sourceCard.powers.some(p => p.powerType === PowerType.ABILITY)
```

Reference: `set-lost-thunder/carbink-2.ts` (Wonder Ray)
