# Card Development Guide for Agents

This guide enables AI-assisted Pokemon TCG card implementation for twinleaf.gg.

---

## Reference Documentation

For detailed information, see these reference files in the same directory:

| File | Contents |
|------|----------|
| **AGENTS-prefabs.md** | All prefab functions with signatures and usage |
| **AGENTS-state.md** | PokemonCardList, Player, StateUtils properties and methods |
| **AGENTS-effects.md** | Effect types, timing (AttackEffect vs AfterAttackEffect), patterns |
| **AGENTS-enums.md** | CardTag, SpecialCondition, GameMessage, Stage, TrainerType, etc. |
| **AGENTS-examples.md** | Complete card implementations demonstrating common patterns |
| **AGENTS-api.md** | Pokemon TCG API usage, fetch script, bulk card generation workflow |

---

## Quick Reference

### Card Type Shortcuts (Global)
```typescript
G = GRASS, R = FIRE, W = WATER, L = LIGHTNING, P = PSYCHIC
F = FIGHTING, D = DARK, M = METAL, C = COLORLESS, Y = FAIRY, N = DRAGON
```

### File Location Pattern
```
ptcg-server/src/sets/set-{set-name}/{card-name}.ts
```

---

## Card Templates

### Basic Pokemon
```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class CardName extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = L;
  public hp = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Attack Name',
    cost: [L, C],
    damage: 30,
    text: ''
  }];

  public set = 'SET';
  public setNumber = '001';
  public regulationMark = 'G';
  public cardImage = 'assets/cardback.png';
  public name = 'Card Name';
  public fullName = 'Card Name SET';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
```

### Evolution Pokemon
```typescript
public stage = Stage.STAGE_1;
public evolvesFrom = 'Pikachu'; // Exact name match
```

### Pokemon V/ex/EX
```typescript
import { CardTag } from '../../game/store/card/card-types';

public tags = [CardTag.POKEMON_V];     // V Pokemon - 2 prizes
public tags = [CardTag.POKEMON_ex];    // Modern ex - 2 prizes
public tags = [CardTag.POKEMON_VMAX];  // VMAX - 3 prizes
```

### Trainer Card (Item/Supporter)
```typescript
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ItemName extends TrainerCard {
  public trainerType = TrainerType.ITEM; // or SUPPORTER, STADIUM, TOOL
  public set = 'SET';
  public setNumber = '001';
  public regulationMark = 'G';
  public cardImage = 'assets/cardback.png';
  public name = 'Item Name';
  public fullName = 'Item Name SET';
  public text = 'Card effect text.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      // Logic here
    }
    return state;
  }
}
```

---

## Critical Effect Timing Rules

**IMPORTANT**: Use the correct effect type based on WHEN the effect occurs:

| Effect Type | When It Fires | Use For |
|-------------|---------------|---------|
| `AttackEffect` | **Before** damage | Blocking attacks, modifying damage |
| `AfterAttackEffect` | **After** damage | Switching Pokemon, "if this attack hits" effects |

### Post-Damage Effect Pattern (e.g., "switch the Defending Pokemon")
```typescript
public usedMyAttack = false;

if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedMyAttack = true;  // Set flag, don't execute yet
}

if (effect instanceof AfterAttackEffect && this.usedMyAttack) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);  // Execute AFTER damage
}

if (effect instanceof EndTurnEffect && this.usedMyAttack) {
  this.usedMyAttack = false;  // Clean up
}
```

### Self-Attack Restriction Pattern
Use `cannotUseAttacksNextTurnPending` - system handles cleanup automatically:
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  if (!player.active.cannotUseAttacksNextTurnPending.includes('Attack Name')) {
    player.active.cannotUseAttacksNextTurnPending.push('Attack Name');
  }
}
// NO EndTurnEffect cleanup needed!
```

---

## Common Prefabs

Import from: `../../game/store/prefabs/prefabs`

```typescript
// Drawing
DRAW_CARDS(player, 2);
DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);

// Searching
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, filter?, options?);
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, filter?, options?);

// Moving Cards
SHUFFLE_DECK(store, state, player);
SHUFFLE_CARDS_INTO_DECK(store, state, player, cards);
MOVE_CARDS(store, state, source, destination, options?);

// Damage
THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, amount);
HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage);

// Switching
SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

// Coin Flips
COIN_FLIP_PROMPT(store, state, player, callback);

// Blocking Checks
IS_ABILITY_BLOCKED(store, state, player, card);
BLOCK_IF_DECK_EMPTY(player);
BLOCK_IF_NO_SLOTS(slots);
USE_ABILITY_ONCE_PER_TURN(player, marker, source);

// Attack Detection (Type Guards)
WAS_ATTACK_USED(effect, index, this): effect is AttackEffect
WAS_POWER_USED(effect, index, this): effect is PowerEffect
```

---

## Attack Prefabs

Import from: `../../game/store/prefabs/attack-effects`

```typescript
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);

FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads);
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads);

THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state);
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state);
PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(x, store, state, effect);

DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(x, effect, state);

DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
```

---

## Common Text Patterns → Code

| Card Text | Code Pattern |
|-----------|--------------|
| "Draw 2 cards" | `DRAW_CARDS(player, 2)` |
| "Flip a coin. If heads, [X]" | `COIN_FLIP_PROMPT` + callback |
| "does 30 more damage" | `effect.damage += 30` |
| "Defending Pokemon is now Paralyzed" | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED()` |
| "Discard an Energy from this Pokemon" | `DISCARD_X_ENERGY_FROM_THIS_POKEMON()` |
| "Discard an Energy attached to the Defending Pokemon" | `DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON()` |
| "Search your deck for a Basic Pokemon" | `SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND()` |
| "does 10 damage to each Benched Pokemon" | Loop bench with `PutDamageEffect` |
| "Heal 30 damage" | `HEAL_X_DAMAGE_FROM_THIS_POKEMON()` |
| "Switch the Defending Pokemon" | `AfterAttackEffect` + `SWITCH_ACTIVE_WITH_BENCHED` |
| "Can't use [Attack] next turn" | `cannotUseAttacksNextTurnPending.push('Attack Name')` |
| "Once during your turn..." (activated Ability) | `USE_ABILITY_ONCE_PER_TURN(...)` + `REMOVE_MARKER_AT_END_OF_TURN(...)` |

---

## Search Rules: Public vs Private Knowledge

Use this rule whenever implementing searches:

- **Private knowledge** (deck): player may choose fewer targets than requested when searching for a restricted subset (for example, "search your deck for 2 Basic Energy"), because opponent cannot verify deck contents.
- **Public knowledge** (discard/in play): player must meet required counts unless card says "up to".
- **Guaranteed private target**: if text guarantees a legal target whenever the zone is non-empty (for example, "search your deck for a card"), failing is not allowed.

Examples:
- `Computer Search` ("a card") -> mandatory selection if deck has cards.
- `Ultra Ball` style Pokemon search -> may fail.
- Discard recovery without "up to" -> enforce exact count.

---

## Important Rules

1. **Always return `state`** from `reduceEffect`
2. **Use prefabs first** before writing custom logic
3. **Check ability locks** with `IS_ABILITY_BLOCKED()` before ability effects
4. **Clean up markers** on `EndTurnEffect`
5. **Use `effect.preventDefault = true`** to block effects
6. **Never modify state directly** - use `store.reduceEffect()`
7. **Match attack with `WAS_ATTACK_USED(effect, index, this)`**
8. **Energy shorthand only in card properties** - use `CardType.FIRE` in logic
9. **`fullName` must be unique** - format: `"Card Name SET"`
10. **`cardImage` always `'assets/cardback.png'`**

---

## Card Property Order

### Pokemon
```typescript
public tags = [];           // Optional
public regulationMark = '';
public stage = Stage.BASIC;
public evolvesFrom = '';    // If evolution
public cardType = R;
public hp = 100;
public weakness = [{ type: W }];
public resistance = [];     // Optional
public retreat = [C, C];

public powers = [];         // Optional
public attacks = [];

public set = '';
public setNumber = '';
public cardImage = 'assets/cardback.png';
public name = '';
public fullName = '';
```

### Trainer
```typescript
public trainerType = TrainerType.ITEM;
public tags = [];           // Optional
public regulationMark = '';
public set = '';
public setNumber = '';
public cardImage = 'assets/cardback.png';
public name = '';
public fullName = '';
public text = '';
```

---

## Set Index Registration

After creating a card, add it to the set's `index.ts`:

```typescript
// set-example/index.ts
import { Card } from '../../game/store/card/card';
import { NewCard } from './new-card';

export const setExample: Card[] = [
  new NewCard(),
  // ...other cards
];
```

---

## AI Card Generation Workflow

1. **Parse card data** → Extract name, type, HP, attacks, abilities
2. **Determine card class** → PokemonCard, TrainerCard, or EnergyCard
3. **Map properties** → Convert types, stages, tags to enums
4. **Identify effect patterns** → Match card text to prefab functions
5. **Generate reduceEffect** → Compose prefabs for each attack/ability
6. **Handle edge cases** → Markers for once-per-turn, generators for multi-step
7. **Add to set index** → Register card in set's index.ts

**For detailed examples, see AGENTS-examples.md**

---

## Full Set Implementation Strategy

When implementing an entire Pokemon TCG set (50-100+ cards), use this tiered approach:

### Step 1: Gather Card Data
Fetch card data from the Pokemon TCG API first (see AGENTS-api.md). Save to `card-data.json` in the set directory. This provides exact stats, attack costs, and effect text for all cards.

### Step 2: Categorize Cards by Complexity

Sort cards into tiers based on implementation difficulty:

#### Pokemon Cards

| Tier | Type | Example Effects | Approach |
|------|------|-----------------|----------|
| **1** | Vanilla | Attacks with just damage, no text | No `reduceEffect` logic needed |
| **2** | Coin Flip | "+X if heads", "Xx damage per heads" | Use `FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE` or `MULTIPLE_COIN_FLIPS_PROMPT` |
| **3** | Special Conditions | Paralysis, Burn, Poison, Sleep, Confusion | Use `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_X` prefabs |
| **4** | Energy/Healing | Discard energy, attach from deck/discard, heal | Use energy manipulation and healing prefabs |
| **5** | Complex Effects | Force switch, prevent retreat, bench damage, attack copying | Requires `AfterAttackEffect` patterns, markers, generators |
| **6** | Abilities | Passive effects, activated abilities | Most complex - use `PowerEffect`, `BetweenTurnsEffect`, `DealDamageEffect` interception |

#### Trainer Cards

| Type | Complexity | Examples | Notes |
|------|------------|----------|-------|
| **Item (simple)** | Low | Potion, Switch, Energy Search | Usually 1-2 prefab calls |
| **Item (complex)** | Medium | Rare Candy, VS Seeker | May need deck/discard searching with filters |
| **Supporter** | Medium | Professor Juniper, N | Often draw/shuffle effects, one per turn enforced by system |
| **Stadium** | High | Requires `StadiumBounceBackEffect` check, affects both players |
| **Tool** | High | Attaches to Pokemon, uses `PokemonCardList.tool` property, needs `ToolEffect` |

#### Energy Cards

| Type | Complexity | Notes |
|------|------------|-------|
| **Basic Energy** | None | Already exist in `set-black-and-white/basic-energies.ts` - just reuse |
| **Special Energy** | Medium-High | Extend `EnergyCard`, implement `provides` array, add effects in `reduceEffect` |

**Trainer/Energy Strategy:**
1. Check if the card is a reprint - if so, add to `other-prints.ts` referencing existing implementation
2. For new trainers, find a similar existing trainer as reference (search by effect type)
3. Special Energy often needs to intercept `AttackEffect`, `RetreatEffect`, or provide conditional energy types

### Step 3: Implement in Parallel by Tier

Launch multiple agents simultaneously, each handling a different tier:

```
Agent 1: Tier 1-2 (vanilla + coin flips) - ~25 cards
Agent 2: Tier 3-4 (conditions + energy) - ~20 cards
Agent 3: Tier 5-6 (complex + abilities) - ~15 cards
```

**Why this works:**
- Lower tiers establish patterns that higher tiers can reference
- Similar cards within a tier share implementation patterns
- Agents can work independently without conflicts

### Step 4: Batch by Similar Effects

Within each tier, group cards with identical effect patterns:

```
Coin Flip Cards:
- "+X damage if heads": Darumaka, Blitzle, Pidove → all use FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE
- "Xx per heads (multiple coins)": Simisage, Audino → all use MULTIPLE_COIN_FLIPS_PROMPT
- "Paralysis if heads": Joltik, Klink → all use COIN_FLIP_PROMPT + YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED
```

This allows copy-paste-modify workflows within each batch.

### Step 5: Update Index Incrementally

Each agent should update `index.ts` as it creates cards:
- Import the new card class
- Add `new CardName()` to the set array

This prevents merge conflicts and ensures cards are immediately registered.

### Step 6: Verify Compilation

After all agents complete:
```bash
cd ptcg-server && npx tsc --noEmit
```

Fix any TypeScript errors before committing.

### Example Set Plan

For a 100-card set like Black & White:

| Tier | Cards | Agent | Time |
|------|-------|-------|------|
| 1: Vanilla | 13 | Agent 1 | Fast |
| 2: Coin Flip | 18 | Agent 1 | Fast |
| 3: Conditions | 11 | Agent 2 | Medium |
| 4: Energy/Heal | 12 | Agent 2 | Medium |
| 5: Complex | 20 | Agent 3 | Slow |
| 6: Abilities | 4 | Agent 3 | Slow |

**Key Insight:** Save ability cards for last. They often require understanding how other cards in the set work (e.g., energy types, evolution lines).

### Handling Reprints

Many sets contain reprints of trainers/energy from other sets. Check `other-prints.ts` patterns:

```typescript
// In other-prints.ts - reprint with new set code
export class SwitchBLW extends Switch {
  public set = 'BLW';
  public setNumber = '104';
  public fullName = 'Switch BLW';
}
```

Before implementing a trainer/energy:
1. Search codebase for existing implementation: `grep -r "name = 'Switch'" ptcg-server/src/sets/`
2. If found, create a minimal subclass in `other-prints.ts` that just overrides set info
3. Only implement from scratch if it's a genuinely new card

### Finding Reference Implementations for Complex Effects

**IMPORTANT**: Before implementing any complex effect (Tier 3+), search the existing codebase for similar card text to find reference implementations.

#### Search Strategy

1. **Search by English effect text** - Look for similar wording in existing card files:
   ```bash
   # For "does X damage to each of your opponent's Benched Pokemon"
   grep -r "damage to each.*Benched" ptcg-server/src/sets/ --include="*.ts"

   # For "Flip a coin. If heads, this attack does X more damage"
   grep -r "If heads.*more damage" ptcg-server/src/sets/ --include="*.ts"

   # For "Your opponent's Active Pokemon is now Paralyzed"
   grep -r "is now Paralyzed" ptcg-server/src/sets/ --include="*.ts"
   ```

2. **Search by prefab function usage** - Find cards using similar prefabs:
   ```bash
   # Find all cards that switch the defending Pokemon
   grep -r "SWITCH_ACTIVE_WITH_BENCHED" ptcg-server/src/sets/ --include="*.ts"

   # Find cards with "can't attack next turn" effects
   grep -r "cannotUseAttacksNextTurnPending" ptcg-server/src/sets/ --include="*.ts"
   ```

3. **Search by effect type** - Find cards intercepting the same effects:
   ```bash
   # Find ability implementations
   grep -r "PowerEffect" ptcg-server/src/sets/ --include="*.ts"

   # Find damage modification
   grep -r "DealDamageEffect" ptcg-server/src/sets/ --include="*.ts"
   ```

#### Why This Matters

- Ensures consistency with established patterns
- Reduces bugs from reinventing solutions
- Reveals edge cases already handled in reference code
- Faster implementation by adapting proven code

**Rule of thumb**: If the effect text is more than "deal X damage" or "flip a coin for +X damage", search for a reference first.

### Common Gotchas for Full Sets

1. **Duplicate Pokemon names**: Use different class names (e.g., `Snivy`, `Snivy2`) and unique `fullName` values
2. **Evolution chains**: Implement basics before evolutions so `evolvesFrom` references work
3. **Energy type logic**: Use `CardType.FIRE` in logic, not shorthand `R` (shorthand only works in property definitions)
4. **Marker cleanup**: Every marker added must be cleaned up in `EndTurnEffect`
5. **AfterAttackEffect timing**: Effects that happen "after damage" (switching, healing based on damage dealt) MUST use `AfterAttackEffect`, not execute during `AttackEffect`
6. **Trainer reprints**: Most sets have 10-15 trainer reprints - check existing implementations first
7. **Basic Energy**: Never re-implement - always reference existing basic energy classes

---

## Gotchas & Learnings (from NVI implementations)

### [2025-01] Energy Type Conversion Abilities
When modifying energy types (like Hydreigon's Dark Aura):
- Intercept `CheckProvidedEnergyEffect`, NOT `AttachEnergyEffect`
- Modify `em.provides` array in the energyMap, not the card properties
- Must verify the ability owner is in play AND the target Pokemon is owned by same player
- Check both `PlayerType.BOTTOM_PLAYER` iteration to find card in play

### [2025-01] AfterDamageEffect vs AfterAttackEffect
- `AfterDamageEffect` fires when THIS Pokemon receives damage - use for retaliation abilities (Rough Skin, Cursed Body)
- `AfterAttackEffect` fires after YOUR attack completes - use for post-damage switching/effects
- For retaliation: check `state.phase !== GamePhase.ATTACK` to avoid triggering on poison/burn/effect damage
- Always verify `effect.damage > 0` before applying retaliation

### [2025-01] Marker Cleanup Timing for "Next Turn" Effects
- If effect lasts "during your next turn", marker should be removed at end of YOUR next turn
- Clean up in `EndTurnEffect` by checking if it's the opponent's turn ending:
  ```typescript
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.forEachPokemon(...)  // Clean up YOUR markers when OPPONENT's turn ends
  ```

### [2025-01] Conditional Checks Across All Players
When checking if a Pokemon is "in play" (not just your side):
```typescript
state.players.forEach(p => {
  p.forEachPokemon(PlayerType.BOTTOM_PLAYER, ...);
  p.forEachPokemon(PlayerType.TOP_PLAYER, ...);
});
```
Both loops are needed because `forEachPokemon` only iterates one player's perspective at a time.

### [2025-01] Self-Shuffle Attacks ("Shuffle this Pokemon and all attached cards into your deck")
**Reference Implementation:** `set-brilliant-stars/lumineon-v.ts`

**ALWAYS use the prefab:**
```typescript
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';

// In AFTER_ATTACK (not WAS_ATTACK_USED!)
if (AFTER_ATTACK(effect, 0, this)) {
  return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
}
```

**For "You may shuffle" effects (optional):**
```typescript
private wantsToShuffle = false;

// Ask during attack
if (WAS_ATTACK_USED(effect, 0, this)) {
  store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), result => {
    this.wantsToShuffle = result;
  });
}

// Execute after attack if chosen
if (effect instanceof AfterAttackEffect && this.wantsToShuffle) {
  this.wantsToShuffle = false;
  return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
}

// Clean up flag
if (effect instanceof EndTurnEffect) { this.wantsToShuffle = false; }
```

**Critical timing rules:**
- Shuffle MUST happen in `AFTER_ATTACK`, not `WAS_ATTACK_USED`
- Special conditions (Paralyzed, Poisoned) apply during `WAS_ATTACK_USED`
- Damage to other Pokemon applies during `WAS_ATTACK_USED`
- The prefab handles Pokemon, tools, and energy separately using `MOVE_CARDS`

**Cards using this pattern:** Accelgor (DEX/NVI), Kartana-GX, Moltres&Zapdos&Articuno-GX, Lumineon V, Beheeyem (UNM), Dudunsparce

### [2025-01] Prize Manipulation
When moving cards between bench and prizes (Cofagrigus-2 pattern):
- Use `state.phase = GamePhase.BETWEEN_TURNS` to end turn immediately
- Set `targetPrize.isSecret = true` to keep prize face-down
- Handle case where prize card is not a Pokemon (move to hand instead)
- Set `pokemonPlayedTurn = state.turn` on newly benched Pokemon

### [2025-01] ChooseCardsPrompt with Blocked Indices
For restricted searches (only evolutions, only certain types):
```typescript
const blocked: number[] = [];
player.deck.cards.forEach((card, index) => {
  if (!isValidCard(card)) blocked.push(index);
});
// Pass blocked to prompt options
{ min: 0, max: 1, blocked }
```
This prevents selecting invalid cards while still showing the full deck.

### [2025-01] Opponent Energy Discard — NEVER use direct moveCardTo
When discarding energy from an opponent's Pokemon:
- **WRONG**: `opponentActive.moveCardTo(energyCards[0], opponent.discard)` — skips player choice and bypasses `DiscardCardsEffect`
- **RIGHT**: `DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect)` — prompts attacker to choose which energy, dispatches `DiscardCardsEffect` so other effects can intercept

### [2025-01] "Defending Pokemon is now [Condition]" — Use WAS_ATTACK_USED, not AFTER_ATTACK
Special conditions from attacks (Confused, Paralyzed, Poisoned, etc.) should be applied during `WAS_ATTACK_USED`, not `AFTER_ATTACK`. The `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_X` prefabs take `AttackEffect` as input.
- **WRONG**: `if (AFTER_ATTACK(effect, 0, this)) { ADD_CONFUSION_TO_PLAYER_ACTIVE(...) }`
- **RIGHT**: `if (WAS_ATTACK_USED(effect, 0, this)) { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect) }`

### [2025-01] Mandatory Attach — Use Math.min for both min and max
When an attack says "Attach X energy cards", both `min` and `max` must be capped at the available count:
```typescript
const count = Math.min(2, availableCount);
{ min: count, max: count, allowCancel: false }
```
Using `min: 1, max: Math.min(2, available)` is wrong — it allows attaching only 1 when 2 are available.
